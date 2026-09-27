import {
  DocumentData,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Transaction,
} from 'firebase-admin/firestore'
import { CHAT_UNREAD_MAIL_STATE_DOC_ID, ChatUnreadMailState } from '@shokujii/common/schemas/ChatUnreadMailState.js'
import { ChatMembership } from '@shokujii/common/schemas/ChatMembership.js'
import {
  CHAT_UNREAD_MAIL_MAX_ROOMS,
  CHAT_UNREAD_MAIL_MIN_INTERVAL_MILLIS,
  shouldSendChatUnreadMail,
  sortUnreadMembershipsForMail,
  type ChatUnreadMailSkipReason,
} from '../utils/chatUnreadMail.js'
import { getChatMembership, getChatMembershipRef, saveChatMembership } from './chatMembership.js'

class ChatUnreadMailStateConverter implements FirestoreDataConverter<ChatUnreadMailState> {
  toFirestore(state: ChatUnreadMailState): DocumentData {
    return state.toFirestore()
  }
  fromFirestore(snapshot: QueryDocumentSnapshot): ChatUnreadMailState {
    return new ChatUnreadMailState(snapshot.id, snapshot.data())
  }
}

export const getChatUnreadMailStateRef = (userId: string) => {
  return getFirestore()
    .collection('users')
    .doc(userId)
    .collection('notification_states')
    .doc(CHAT_UNREAD_MAIL_STATE_DOC_ID)
    .withConverter(new ChatUnreadMailStateConverter())
}

export const getChatUnreadMailState = async (
  userId: string,
  transaction?: Transaction,
): Promise<ChatUnreadMailState | undefined> => {
  const ref = getChatUnreadMailStateRef(userId)
  const snapshot = await (transaction === undefined ? ref.get() : transaction.get(ref))
  return snapshot.exists ? snapshot.data() : undefined
}

export const saveChatUnreadMailState = async (
  userId: string,
  state: ChatUnreadMailState,
  transaction?: Transaction,
): Promise<void> => {
  const ref = getChatUnreadMailStateRef(userId)
  if (transaction === undefined) {
    await ref.set(state)
  } else {
    transaction.set(ref, state)
  }
}

export const deleteChatUnreadMailState = async (userId: string, transaction?: Transaction): Promise<void> => {
  const ref = getChatUnreadMailStateRef(userId)
  if (transaction === undefined) {
    await ref.delete()
  } else {
    transaction.delete(ref)
  }
}

export type ChatUnreadMailSendReservation = {
  claimedAt: number
  previousLastSentAt: number | undefined
  /** 通知に載せるルームの確保前の状態。失敗時は通知時刻だけを戻す。 */
  memberships: ChatMembership[]
}

export type ChatUnreadMailSendClaim =
  | { claimed: false; reason: ChatUnreadMailSkipReason }
  | ({ claimed: true } & ChatUnreadMailSendReservation)

/** 最新の既読状態を再評価し、全体の送信間隔と本文に載せるルームの通知状態を同時に確保する。 */
export const claimChatUnreadMailSendSlot = async (
  userId: string,
  nowMillis: number,
  roomIds: string[],
): Promise<ChatUnreadMailSendClaim> => {
  return getFirestore().runTransaction(async (transaction) => {
    const state = await getChatUnreadMailState(userId, transaction)
    if (state != null && nowMillis - state.last_sent_at < CHAT_UNREAD_MAIL_MIN_INTERVAL_MILLIS) {
      return { claimed: false, reason: 'min_interval' }
    }
    const currentMemberships = await Promise.all(
      [...new Set(roomIds)].map((roomId) => getChatMembership(userId, roomId, transaction)),
    )
    const decision = shouldSendChatUnreadMail({
      nowMillis,
      lastSentAt: state?.last_sent_at,
      unreadMemberships: currentMemberships.filter((membership) => membership != null),
    })
    if (!decision.send) {
      return { claimed: false, reason: decision.reason }
    }

    const memberships = sortUnreadMembershipsForMail(decision.memberships).slice(0, CHAT_UNREAD_MAIL_MAX_ROOMS)
    await saveChatUnreadMailState(
      userId,
      new ChatUnreadMailState(CHAT_UNREAD_MAIL_STATE_DOC_ID, { last_sent_at: nowMillis }),
      transaction,
    )
    await Promise.all(
      memberships.map((membership) =>
        saveChatMembership(
          userId,
          new ChatMembership(membership.id, { ...membership, last_unread_mail_sent_at: nowMillis }),
          transaction,
        ),
      ),
    )
    return { claimed: true, claimedAt: nowMillis, previousLastSentAt: state?.last_sent_at, memberships }
  })
}

/** 失敗した確保だけを戻す。送信処理中の既読・新着・退会は維持する。 */
export const releaseChatUnreadMailSendSlot = async (
  userId: string,
  reservation: ChatUnreadMailSendReservation,
): Promise<void> => {
  await getFirestore().runTransaction(async (transaction) => {
    const state = await getChatUnreadMailState(userId, transaction)
    if (state?.last_sent_at !== reservation.claimedAt) {
      return
    }
    const currentMemberships = await Promise.all(
      reservation.memberships.map((membership) => getChatMembership(userId, membership.room_id, transaction)),
    )

    if (reservation.previousLastSentAt == null) {
      await deleteChatUnreadMailState(userId, transaction)
    } else {
      await saveChatUnreadMailState(
        userId,
        new ChatUnreadMailState(CHAT_UNREAD_MAIL_STATE_DOC_ID, { last_sent_at: reservation.previousLastSentAt }),
        transaction,
      )
    }
    const previousSentAtByRoom = new Map(
      reservation.memberships.map((membership) => [membership.room_id, membership.last_unread_mail_sent_at]),
    )
    for (const membership of currentMemberships) {
      if (membership == null || membership.last_unread_mail_sent_at !== reservation.claimedAt) {
        continue
      }
      // 初回通知失敗なら追加したフィールドを除去するため、最新の全フィールドで置き換える。
      transaction.set(
        getChatMembershipRef(userId, membership.room_id),
        new ChatMembership(membership.id, {
          ...membership,
          last_unread_mail_sent_at: previousSentAtByRoom.get(membership.room_id),
        }),
      )
    }
  })
}
