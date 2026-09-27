import { DateTime } from 'luxon'
import type { ChatMembership } from '@shokujii/common/schemas/ChatMembership.js'
import { DEFAULT_TIME_ZONE } from '@shokujii/common/utils/datetime.js'
import { getEventCoverStoragePath } from '@shokujii/common/utils/storagePaths.js'

export const CHAT_UNREAD_MAIL_TIME_ZONE = DEFAULT_TIME_ZONE
export const CHAT_UNREAD_MAIL_DEBOUNCE_MILLIS = 60 * 60 * 1000
export const CHAT_UNREAD_MAIL_MIN_INTERVAL_MILLIS = 72 * 60 * 60 * 1000
export const CHAT_UNREAD_MAIL_MAX_ROOMS = 5
export const CHAT_UNREAD_MAIL_FALLBACK_ROOM_NAME = 'グループチャット'

export type ChatMailSlot = 'morning' | 'evening'

export type ChatUnreadMailSkipReason = 'outside_slot' | 'no_unread' | 'debounce' | 'awaiting_read' | 'min_interval'

type ChatUnreadMailMembership = Pick<
  ChatMembership,
  'last_message_at' | 'unread_count' | 'is_active' | 'last_read_at' | 'last_unread_mail_sent_at'
>

export type ShouldSendChatUnreadMailResult<T extends ChatUnreadMailMembership> =
  | { send: true; memberships: T[] }
  | { send: false; reason: ChatUnreadMailSkipReason }

export type ChatUnreadMailRoomPayload = {
  room_name: string
  unread_count: number
  preview: string
  chat_url: string
  /** イベントチャットのカバー画像 URL。イベント以外は空文字 */
  cover_url: string
}

export type ChatUnreadMailTemplateData = {
  user_name: string
  unread_room_count: number
  rooms: ChatUnreadMailRoomPayload[]
  more_room_count: number
  cta_url: string
}

const toJst = (millis: number): DateTime => DateTime.fromMillis(millis, { zone: CHAT_UNREAD_MAIL_TIME_ZONE })

export const resolveChatMailSlot = (nowMillis: number): ChatMailSlot | null => {
  const dt = toJst(nowMillis)
  const minutes = dt.hour * 60 + dt.minute
  if (minutes >= 9 * 60 && minutes < 12 * 60) {
    return 'morning'
  }
  if (minutes >= 18 * 60 && minutes < 23 * 60) {
    return 'evening'
  }
  return null
}

export const shouldSendChatUnreadMail = <T extends ChatUnreadMailMembership>(params: {
  nowMillis: number
  lastSentAt: number | undefined
  unreadMemberships: T[]
}): ShouldSendChatUnreadMailResult<T> => {
  if (resolveChatMailSlot(params.nowMillis) == null) {
    return { send: false, reason: 'outside_slot' }
  }

  const unread = params.unreadMemberships.filter(
    (membership) =>
      membership.is_active &&
      membership.unread_count > 0 &&
      membership.last_message_at != null &&
      (membership.last_read_at == null || membership.last_message_at > membership.last_read_at),
  )
  if (unread.length === 0) {
    return { send: false, reason: 'no_unread' }
  }

  const lastSentAt = params.lastSentAt
  if (lastSentAt != null && params.nowMillis - lastSentAt < CHAT_UNREAD_MAIL_MIN_INTERVAL_MILLIS) {
    return { send: false, reason: 'min_interval' }
  }

  const notNotifiedSinceRead = unread.filter(
    (membership) =>
      membership.last_unread_mail_sent_at == null ||
      (membership.last_read_at != null && membership.last_read_at > membership.last_unread_mail_sent_at),
  )
  if (notNotifiedSinceRead.length === 0) {
    return { send: false, reason: 'awaiting_read' }
  }
  const debounceCutoff = params.nowMillis - CHAT_UNREAD_MAIL_DEBOUNCE_MILLIS
  const memberships = notNotifiedSinceRead.filter(
    (membership) => membership.last_message_at != null && membership.last_message_at <= debounceCutoff,
  )
  if (memberships.length === 0) {
    return { send: false, reason: 'debounce' }
  }

  return { send: true, memberships }
}

export const sortUnreadMembershipsForMail = (memberships: ChatMembership[]): ChatMembership[] => {
  return [...memberships].sort((a, b) => (b.last_message_at ?? 0) - (a.last_message_at ?? 0))
}

export const buildChatUnreadMailCoverUrl = (
  membership: Pick<ChatMembership, 'room_type' | 'community_id' | 'event_id'>,
  toStorageUrl: (storagePath: string) => string,
): string => {
  if (membership.room_type !== 'event') {
    return ''
  }
  const communityId = membership.community_id
  const eventId = membership.event_id
  if (communityId == null || communityId === '' || eventId == null || eventId === '') {
    return ''
  }
  return toStorageUrl(getEventCoverStoragePath(communityId, eventId))
}

export const buildChatUnreadMailSubject = (unreadRoomCount: number, firstRoomName: string): string => {
  if (unreadRoomCount <= 1) {
    return `${firstRoomName}に未読のチャットがあります`
  }
  return `${unreadRoomCount}件のチャットに未読があります`
}

export const buildChatUnreadMailTemplateData = (params: {
  userName: string
  rooms: ChatUnreadMailRoomPayload[]
  unreadRoomCount: number
  ctaUrl: string
}): ChatUnreadMailTemplateData => {
  return {
    user_name: params.userName,
    unread_room_count: params.unreadRoomCount,
    rooms: params.rooms.slice(0, CHAT_UNREAD_MAIL_MAX_ROOMS),
    more_room_count: Math.max(0, params.unreadRoomCount - CHAT_UNREAD_MAIL_MAX_ROOMS),
    cta_url: params.ctaUrl,
  }
}
