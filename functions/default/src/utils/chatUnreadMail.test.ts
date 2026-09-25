import { describe, expect, it } from 'vitest'
import {
  buildChatUnreadMailSubject,
  buildChatUnreadMailTemplateData,
  isSameChatMailSlot,
  resolveChatMailSlot,
  shouldSendChatUnreadMail,
} from './chatUnreadMail.js'

const jst = (iso: string): number => Date.parse(iso)

describe('resolveChatMailSlot', () => {
  it('treats 11:50 as morning', () => {
    expect(resolveChatMailSlot(jst('2026-09-22T11:50:00+09:00'))).toBe('morning')
  })

  it('treats 12:00 as outside the morning slot', () => {
    expect(resolveChatMailSlot(jst('2026-09-22T12:00:00+09:00'))).toBeNull()
  })

  it('treats 22:55 as evening', () => {
    expect(resolveChatMailSlot(jst('2026-09-22T22:55:00+09:00'))).toBe('evening')
  })

  it('holds 23:05 until the next morning slot', () => {
    expect(resolveChatMailSlot(jst('2026-09-22T23:05:00+09:00'))).toBeNull()
  })
})

describe('isSameChatMailSlot', () => {
  it('matches the same JST calendar slot', () => {
    expect(isSameChatMailSlot(jst('2026-09-22T10:15:00+09:00'), jst('2026-09-22T11:40:00+09:00'))).toBe(true)
  })

  it('does not match across JST dates', () => {
    expect(isSameChatMailSlot(jst('2026-09-22T10:15:00+09:00'), jst('2026-09-23T10:15:00+09:00'))).toBe(false)
  })
})

describe('shouldSendChatUnreadMail', () => {
  const unread = [{ is_active: true as const, unread_count: 1, last_message_at: jst('2026-09-22T09:50:00+09:00') }]

  it('sends the first mail after the 15 minute debounce', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-22T10:10:00+09:00'),
        lastSentAt: undefined,
        unreadMemberships: unread,
      }),
    ).toEqual({ send: true })
  })

  it('skips when the latest unread is newer than 15 minutes', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-22T10:00:00+09:00'),
        lastSentAt: undefined,
        unreadMemberships: [{ is_active: true, unread_count: 1, last_message_at: jst('2026-09-22T09:50:00+09:00') }],
      }),
    ).toEqual({ send: false, reason: 'debounce' })
  })

  it('skips read rooms', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-22T10:20:00+09:00'),
        lastSentAt: undefined,
        unreadMemberships: [{ is_active: true, unread_count: 0, last_message_at: jst('2026-09-22T09:50:00+09:00') }],
      }),
    ).toEqual({ send: false, reason: 'no_unread' })
  })

  it('skips when last_sent_at is already in the same slot', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-22T11:10:00+09:00'),
        lastSentAt: jst('2026-09-22T10:15:00+09:00'),
        unreadMemberships: [{ is_active: true, unread_count: 1, last_message_at: jst('2026-09-22T11:00:00+09:00') }],
      }),
    ).toEqual({ send: false, reason: 'same_slot' })
  })

  it('skips the evening slot when there is no unread newer than last_sent_at', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-22T18:20:00+09:00'),
        lastSentAt: jst('2026-09-22T10:15:00+09:00'),
        unreadMemberships: unread,
      }),
    ).toEqual({ send: false, reason: 'no_new_unread' })
  })

  it('does not send a fresh unread just because an older room already waited 15 minutes', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-22T18:05:00+09:00'),
        lastSentAt: jst('2026-09-22T10:15:00+09:00'),
        unreadMemberships: [
          { is_active: true, unread_count: 1, last_message_at: jst('2026-09-22T09:50:00+09:00') },
          { is_active: true, unread_count: 1, last_message_at: jst('2026-09-22T17:59:00+09:00') },
        ],
      }),
    ).toEqual({ send: false, reason: 'debounce' })
  })

  it('sends in the evening when there is a newer unread', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-22T18:20:00+09:00'),
        lastSentAt: jst('2026-09-22T10:15:00+09:00'),
        unreadMemberships: [{ is_active: true, unread_count: 1, last_message_at: jst('2026-09-22T17:50:00+09:00') }],
      }),
    ).toEqual({ send: true })
  })

  it('skips when the previous send is within 4 hours', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-22T18:20:00+09:00'),
        lastSentAt: jst('2026-09-22T15:00:00+09:00'),
        unreadMemberships: [{ is_active: true, unread_count: 1, last_message_at: jst('2026-09-22T17:50:00+09:00') }],
      }),
    ).toEqual({ send: false, reason: 'min_interval' })
  })
})

describe('buildChatUnreadMail payload', () => {
  it('uses the room name for a single unread room', () => {
    expect(buildChatUnreadMailSubject(1, '春の食事会')).toBe('春の食事会に未読のチャットがあります')
  })

  it('counts rooms when there are two or more', () => {
    expect(buildChatUnreadMailSubject(3, '春の食事会')).toBe('3件のチャットに未読があります')
  })

  it('caps listed rooms at 5', () => {
    const rooms = Array.from({ length: 6 }, (_, index) => ({
      room_name: `room-${index}`,
      unread_count: 1,
      preview: 'hello',
      chat_url: `https://example.com/chat/${index}`,
    }))
    const data = buildChatUnreadMailTemplateData({
      userName: '太郎',
      rooms,
      unreadRoomCount: 6,
      ctaUrl: 'https://example.com/chat',
    })
    expect(data.rooms).toHaveLength(5)
    expect(data.more_room_count).toBe(1)
  })
})
