import { onSchedule } from 'firebase-functions/v2/scheduler'
import { DateTime } from 'luxon'
import type { ChatMembership } from '@shokujii/common/schemas/ChatMembership.js'
import { DEFAULT_FROM, SUPPORT_MAIL } from './utils/mail.js'
import * as sgMail from './utils/sendgrid.js'
import { createModuleLogger } from './utils/logger.js'
import {
  CHAT_UNREAD_MAIL_FALLBACK_ROOM_NAME,
  CHAT_UNREAD_MAIL_MAX_ROOMS,
  CHAT_UNREAD_MAIL_TIME_ZONE,
  buildChatUnreadMailSubject,
  buildChatUnreadMailTemplateData,
  resolveChatMailSlot,
  sortUnreadMembershipsForMail,
  type ChatUnreadMailRoomPayload,
} from './utils/chatUnreadMail.js'
import { getChatUrlForUser } from './utils/urls.js'
import { listActiveUnreadChatMemberships } from './stores/chatMembership.js'
import { getChatRoom } from './stores/chatRoom.js'
import { getCommunity } from './stores/community.js'
import { getEventInCommunity } from './stores/event.js'
import { claimChatUnreadMailSendSlot, releaseChatUnreadMailSendSlot } from './stores/chatUnreadMailState.js'
import { getEnterpriseById, getEnterpriseMember } from './stores/enterprise.js'
import { getUser } from './stores/user.js'

const logger = createModuleLogger('chatUnreadMail')

export const CHAT_UNREAD_MAIL_TEMPLATE_ID = 'd-8d54dcbff9bd45e8b2f0355efb92d42f'

/** コンソールでグループ作成後に差し替える。0 のあいだは送らない */
export const CHAT_UNREAD_MAIL_ASM_GROUP_ID = 0

export const isChatUnreadMailTemplateConfigured = (): boolean => {
  return CHAT_UNREAD_MAIL_TEMPLATE_ID.startsWith('d-') && !CHAT_UNREAD_MAIL_TEMPLATE_ID.includes('pending')
}

export const isChatUnreadMailDeliveryConfigured = (): boolean => {
  return isChatUnreadMailTemplateConfigured() && CHAT_UNREAD_MAIL_ASM_GROUP_ID > 0
}

const groupMembershipsByUserId = (
  rows: Awaited<ReturnType<typeof listActiveUnreadChatMemberships>>,
): Map<string, ChatMembership[]> => {
  const grouped = new Map<string, ChatMembership[]>()
  for (const row of rows) {
    const current = grouped.get(row.userId) ?? []
    current.push(row.membership)
    grouped.set(row.userId, current)
  }
  return grouped
}

const resolveRoomName = async (membership: ChatMembership): Promise<string> => {
  const room = await getChatRoom(membership.room_id)
  const title = room?.title?.trim()
  if (title != null && title !== '') {
    return title
  }

  if (membership.room_type === 'event' && membership.community_id != null && membership.event_id != null) {
    const event = await getEventInCommunity(membership.community_id, membership.event_id)
    const eventName = event?.event_name?.trim()
    if (eventName != null && eventName !== '') {
      return eventName
    }
  }

  if (membership.community_id != null && membership.community_id !== '') {
    const community = await getCommunity(membership.community_id)
    const communityName = community?.community_name?.trim()
    if (communityName != null && communityName !== '') {
      return communityName
    }
  }

  return CHAT_UNREAD_MAIL_FALLBACK_ROOM_NAME
}

const CLAIM_RELEASE_ATTEMPTS = 3

const releaseClaim = async (userId: string, previousLastSentAt: number | undefined): Promise<void> => {
  for (let attempt = 1; attempt <= CLAIM_RELEASE_ATTEMPTS; attempt += 1) {
    try {
      await releaseChatUnreadMailSendSlot(userId, previousLastSentAt)
      return
    } catch (error) {
      if (attempt === CLAIM_RELEASE_ATTEMPTS) {
        logger.error('Failed to release chat unread mail claim', {
          userId,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }
}

const isEnterpriseRecipientActive = async (userId: string, enterpriseId: string | undefined): Promise<boolean> => {
  if (enterpriseId == null || enterpriseId === '') {
    return true
  }

  const enterprise = await getEnterpriseById(enterpriseId)
  if (enterprise == null || !enterprise.is_active) {
    return false
  }

  const member = await getEnterpriseMember(enterpriseId, userId)
  return member != null && member.is_active
}

const sendChatUnreadMailToUser = async (
  userId: string,
  memberships: ChatMembership[],
  nowMillis: number,
): Promise<'sent' | 'skipped' | 'failed'> => {
  const user = await getUser(userId, true)
  if (user == null || user.is_deleted) {
    logger.info('Skip chat unread mail', { userId, reason: 'user_unavailable' })
    return 'skipped'
  }

  const to = user.user_email.trim()
  if (to === '') {
    logger.info('Skip chat unread mail', { userId, reason: 'empty_email' })
    return 'skipped'
  }

  if (!(await isEnterpriseRecipientActive(userId, user.enterprise_id))) {
    logger.info('Skip chat unread mail', { userId, reason: 'enterprise_inactive' })
    return 'skipped'
  }

  const claim = await claimChatUnreadMailSendSlot(userId, nowMillis, memberships)
  if (!claim.claimed) {
    logger.info('Skip chat unread mail', { userId, reason: claim.reason })
    return 'skipped'
  }

  try {
    const sorted = sortUnreadMembershipsForMail(memberships)
    const listed = sorted.slice(0, CHAT_UNREAD_MAIL_MAX_ROOMS)
    const ctaRoomId = sorted.length === 1 ? sorted[0]?.room_id : undefined
    const ctaUrl = await getChatUrlForUser(user, ctaRoomId)
    if (ctaUrl == null) {
      logger.warn('Skip chat unread mail', { userId, reason: 'host_unresolved' })
      await releaseClaim(userId, claim.previousLastSentAt)
      return 'skipped'
    }

    const rooms: ChatUnreadMailRoomPayload[] = []
    for (const membership of listed) {
      const chatUrl = await getChatUrlForUser(user, membership.room_id)
      if (chatUrl == null) {
        logger.warn('Skip chat unread mail', { userId, reason: 'host_unresolved' })
        await releaseClaim(userId, claim.previousLastSentAt)
        return 'skipped'
      }
      rooms.push({
        room_name: await resolveRoomName(membership),
        unread_count: membership.unread_count,
        preview: membership.last_message_preview ?? '',
        chat_url: chatUrl,
      })
    }

    const firstRoomName = rooms[0]?.room_name ?? CHAT_UNREAD_MAIL_FALLBACK_ROOM_NAME
    const dynamicTemplateData = buildChatUnreadMailTemplateData({
      userName: user.user_name,
      rooms,
      unreadRoomCount: sorted.length,
      ctaUrl,
    })

    await sgMail.send({
      to,
      from: DEFAULT_FROM,
      replyTo: SUPPORT_MAIL,
      templateId: CHAT_UNREAD_MAIL_TEMPLATE_ID,
      subject: buildChatUnreadMailSubject(sorted.length, firstRoomName),
      dynamicTemplateData,
      ...(CHAT_UNREAD_MAIL_ASM_GROUP_ID > 0 ? { asm: { groupId: CHAT_UNREAD_MAIL_ASM_GROUP_ID } } : {}),
    })
    return 'sent'
  } catch (error) {
    logger.error('Failed to send chat unread mail', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    })
    await releaseClaim(userId, claim.previousLastSentAt)
    return 'failed'
  }
}

export const sendChatUnreadMails = async (nowMillis: number): Promise<void> => {
  if (resolveChatMailSlot(nowMillis) == null) {
    logger.info('Skip chat unread mail job', { reason: 'outside_slot' })
    return
  }

  const rows = await listActiveUnreadChatMemberships()
  const grouped = groupMembershipsByUserId(rows)
  const results = await Promise.allSettled(
    [...grouped.entries()].map(async ([userId, memberships]) => {
      try {
        return await sendChatUnreadMailToUser(userId, memberships, nowMillis)
      } catch (error) {
        logger.error('Failed to send chat unread mail', {
          userId,
          error: error instanceof Error ? error.message : String(error),
        })
        return 'failed'
      }
    }),
  )

  let sentCount = 0
  let skippedCount = 0
  let failedCount = 0
  for (const result of results) {
    if (result.status === 'rejected') {
      failedCount += 1
      continue
    }
    if (result.value === 'sent') {
      sentCount += 1
    } else if (result.value === 'failed') {
      failedCount += 1
    } else {
      skippedCount += 1
    }
  }

  if (failedCount > 0) {
    logger.warn('Failed to send chat unread mail', {
      successCount: sentCount,
      failedCount,
      skippedCount,
      totalUsers: grouped.size,
    })
    return
  }

  logger.info('Chat unread mail job finished', {
    successCount: sentCount,
    skippedCount,
    totalUsers: grouped.size,
  })
}

export const chatUnreadMail = onSchedule(
  {
    schedule: '*/5 * * * *',
    timeZone: CHAT_UNREAD_MAIL_TIME_ZONE,
    region: 'asia-northeast1',
    secrets: ['SENDGRID_API_KEY'],
    memory: '1GiB',
    timeoutSeconds: 540,
    maxInstances: 1,
    concurrency: 1,
  },
  async (event) => {
    if (!isChatUnreadMailDeliveryConfigured()) {
      logger.warn('Chat unread mail delivery is not configured')
      return
    }
    const nowMillis = DateTime.fromISO(event.scheduleTime, { zone: CHAT_UNREAD_MAIL_TIME_ZONE }).toMillis()
    await sendChatUnreadMails(nowMillis)
  },
)
