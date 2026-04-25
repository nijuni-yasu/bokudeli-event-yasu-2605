import { onDocumentWritten } from 'firebase-functions/v2/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import type {
  BackfillUserFriendsRequest,
  BackfillUserFriendsResponse,
  GetUserFriendsRequest,
  GetUserFriendsResponse,
  UserFriendsSortBy,
} from '@shokujii/common/apis/userFriends.js'
import { EventMemberOrderStatusType } from '@shokujii/common/schemas/EventMemberOrder.js'
import { EpochMillisSchema } from '@shokujii/common/schemas/firebase/index.js'
import { getConfigGlobal } from './stores/config.js'
import { getEventInCommunity } from './stores/event.js'
import { getOrders } from './stores/memberOrder.js'
import { listUserFriends, UserFriendsListCursor } from './stores/userFriend.js'
import { getUsersByUserIds } from './stores/user.js'
import { applyOrdered, revokeOrdered, runBackfill } from './utils/friendsService.js'
import { createModuleLogger } from './utils/logger.js'
import { judgeOrderTransition } from './utils/orderStatusTransition.js'

const logger = createModuleLogger('userFriends')

const GetUserFriendsRequestSchema = z.object({
  limit: z.number().int().min(1).max(50).optional(),
  sort_by: z.enum(['meet_count', 'last_met_at']).optional(),
  cursor: z.string().nullable().optional(),
})

const BackfillUserFriendsRequestSchema = z.object({
  dry_run: z.boolean().optional(),
  community_id: z.string().optional(),
  event_id_from: z.string().optional(),
  event_id_to: z.string().optional(),
  resume_token: z.string().optional(),
})

const CursorSchema = z.object({
  value: EpochMillisSchema.or(z.number().int().nonnegative()),
  friend_user_id: z.string().nonempty(),
})

const decodeCursor = (cursor: string | null | undefined): UserFriendsListCursor | undefined => {
  if (cursor == null || cursor === '') {
    return undefined
  }
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'))
    const normalized = CursorSchema.parse(parsed)
    return {
      value: normalized.value,
      friend_user_id: normalized.friend_user_id,
    }
  } catch {
    throw new HttpsError('invalid-argument', 'Invalid cursor')
  }
}

const encodeCursor = (cursor: UserFriendsListCursor | null): string | null => {
  if (cursor == null) {
    return null
  }
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64')
}

const asOrderStatus = (status: unknown): EventMemberOrderStatusType | undefined => {
  return status === 'in_cart' || status === 'ordered' || status === 'canceled' ? status : undefined
}

export const onMemberOrderWritten = onDocumentWritten(
  {
    document: 'communities/{communityId}/events/{eventId}/members/{memberId}/member_orders/{orderId}',
    region: 'asia-northeast1',
    timeoutSeconds: 60,
    memory: '256MiB',
  },
  async (event) => {
    const before = event.data?.before?.data()
    const after = event.data?.after?.data()
    const beforeStatus = asOrderStatus(before?.status)
    const afterStatus = asOrderStatus(after?.status)
    const action = judgeOrderTransition(beforeStatus, afterStatus)
    if (action === 'NOOP') {
      return
    }

    const communityId = String(after?.community_id ?? before?.community_id ?? '')
    const eventId = String(after?.event_id ?? before?.event_id ?? '')
    const targetUserId = String(after?.user_id ?? before?.user_id ?? '')
    if (communityId === '' || eventId === '' || targetUserId === '') {
      logger.warn('Skip trigger due to missing ids', {
        community_id: communityId,
        event_id: eventId,
        target_user_id: targetUserId,
      })
      return
    }

    const orderedOrders = await getOrders(communityId, eventId, 'ordered')
    const orderedUserIds = [...new Set(orderedOrders.map((order) => order.user_id))]

    if (action === 'ADD') {
      const eventData = await getEventInCommunity(communityId, eventId)
      const eventAt = eventData?.event_start_datetime ?? Date.now()
      await applyOrdered({
        event_id: eventId,
        community_id: communityId,
        event_at: eventAt,
        user_ids: orderedUserIds,
      })
      return
    }

    await revokeOrdered({
      event_id: eventId,
      user_ids: [...new Set([...orderedUserIds, targetUserId])],
    })
  },
)

export const getUserFriends = onCall<GetUserFriendsRequest, Promise<GetUserFriendsResponse>>(
  { region: 'asia-northeast1' },
  async (request) => {
    const uid = request.auth?.uid
    if (uid == null) {
      throw new HttpsError('unauthenticated', '認証が必要です')
    }

    const input = GetUserFriendsRequestSchema.parse(request.data)
    const limit = input.limit ?? 10
    const sortBy: UserFriendsSortBy = input.sort_by ?? 'meet_count'
    const decodedCursor = decodeCursor(input.cursor)

    const page = await listUserFriends(uid, sortBy, limit, decodedCursor)
    if (page.friends.length === 0) {
      return { friends: [], has_more: false, next_cursor: null }
    }

    const userMap = await getUsersByUserIds(page.friends.map((friend) => friend.id))
    const friends = page.friends
      .map((friend) => {
        const user = userMap.get(friend.id)
        if (user == null || user.is_deleted) {
          return null
        }
        return {
          user_id: friend.id,
          user_name: user.user_name,
          user_image_url: user.user_image_url,
          meet_count: friend.meet_count,
          first_met_at: friend.first_met_at,
          last_met_at: friend.last_met_at,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item != null)

    return {
      friends,
      has_more: page.hasMore,
      next_cursor: encodeCursor(page.nextCursor),
    }
  },
)

export const backfillUserFriends = onCall<BackfillUserFriendsRequest, Promise<BackfillUserFriendsResponse>>(
  { region: 'asia-northeast1', timeoutSeconds: 540, memory: '1GiB' },
  async (request) => {
    const uid = request.auth?.uid
    if (uid == null) {
      throw new HttpsError('unauthenticated', '認証が必要です')
    }
    const config = await getConfigGlobal()
    const isSupport = config?.isSupport(uid) ?? false
    if (!isSupport) {
      throw new HttpsError('permission-denied', '権限がありません')
    }

    const input = BackfillUserFriendsRequestSchema.parse(request.data)
    return runBackfill(input)
  },
)
