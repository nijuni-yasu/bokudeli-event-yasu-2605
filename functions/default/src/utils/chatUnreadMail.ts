import { DateTime } from 'luxon'
import type { ChatMembership } from '@shokujii/common/schemas/ChatMembership.js'
import { DEFAULT_TIME_ZONE } from '@shokujii/common/utils/datetime.js'
import { getEventCoverStoragePath } from '@shokujii/common/utils/storagePaths.js'

export const CHAT_UNREAD_MAIL_TIME_ZONE = DEFAULT_TIME_ZONE
export const CHAT_UNREAD_MAIL_DEBOUNCE_MILLIS = 15 * 60 * 1000
export const CHAT_UNREAD_MAIL_MIN_INTERVAL_MILLIS = 4 * 60 * 60 * 1000
export const CHAT_UNREAD_MAIL_MAX_ROOMS = 5
export const CHAT_UNREAD_MAIL_FALLBACK_ROOM_NAME = 'グループチャット'

export type ChatMailSlot = 'morning' | 'evening'

export type ChatUnreadMailSkipReason =
  | 'outside_slot'
  | 'no_unread'
  | 'debounce'
  | 'same_slot'
  | 'no_new_unread'
  | 'min_interval'

export type ShouldSendChatUnreadMailResult = { send: true } | { send: false; reason: ChatUnreadMailSkipReason }

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

export const isSameChatMailSlot = (lastSentAt: number, nowMillis: number): boolean => {
  const lastSlot = resolveChatMailSlot(lastSentAt)
  const nowSlot = resolveChatMailSlot(nowMillis)
  if (lastSlot == null || nowSlot == null || lastSlot !== nowSlot) {
    return false
  }
  return toJst(lastSentAt).toISODate() === toJst(nowMillis).toISODate()
}

export const shouldSendChatUnreadMail = (params: {
  nowMillis: number
  lastSentAt: number | undefined
  unreadMemberships: Pick<ChatMembership, 'last_message_at' | 'unread_count' | 'is_active'>[]
}): ShouldSendChatUnreadMailResult => {
  if (resolveChatMailSlot(params.nowMillis) == null) {
    return { send: false, reason: 'outside_slot' }
  }

  const unread = params.unreadMemberships.filter((membership) => membership.is_active && membership.unread_count > 0)
  if (unread.length === 0) {
    return { send: false, reason: 'no_unread' }
  }

  const lastSentAt = params.lastSentAt
  if (lastSentAt != null && isSameChatMailSlot(lastSentAt, params.nowMillis)) {
    return { send: false, reason: 'same_slot' }
  }

  const debounceCutoff = params.nowMillis - CHAT_UNREAD_MAIL_DEBOUNCE_MILLIS
  const isDebounced = (lastMessageAt: number | undefined): boolean => {
    return lastMessageAt != null && lastMessageAt <= debounceCutoff
  }

  if (lastSentAt == null) {
    const hasDebouncedUnread = unread.some((membership) => isDebounced(membership.last_message_at))
    if (!hasDebouncedUnread) {
      return { send: false, reason: 'debounce' }
    }
    return { send: true }
  }

  const newUnread = unread.filter(
    (membership) => membership.last_message_at != null && membership.last_message_at > lastSentAt,
  )
  if (newUnread.length === 0) {
    return { send: false, reason: 'no_new_unread' }
  }
  if (!newUnread.some((membership) => isDebounced(membership.last_message_at))) {
    return { send: false, reason: 'debounce' }
  }

  if (params.nowMillis - lastSentAt < CHAT_UNREAD_MAIL_MIN_INTERVAL_MILLIS) {
    return { send: false, reason: 'min_interval' }
  }

  return { send: true }
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
