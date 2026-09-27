import { describe, expect, it } from 'vitest'
import {
  CHAT_UNREAD_MAIL_DEBOUNCE_MILLIS,
  CHAT_UNREAD_MAIL_MIN_INTERVAL_MILLIS,
  buildChatUnreadMailCoverUrl,
  buildChatUnreadMailSubject,
  buildChatUnreadMailTemplateData,
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

describe('shouldSendChatUnreadMail', () => {
  const now = jst('2026-09-25T10:00:00+09:00')
  const firstSentAt = now - CHAT_UNREAD_MAIL_MIN_INTERVAL_MILLIS
  const unread = {
    is_active: true,
    unread_count: 1,
    last_message_at: now - CHAT_UNREAD_MAIL_DEBOUNCE_MILLIS,
  }

  it('sends the first notification exactly one hour after the last message', () => {
    expect(shouldSendChatUnreadMail({ nowMillis: now, lastSentAt: undefined, unreadMemberships: [unread] })).toEqual({
      send: true,
      memberships: [unread],
    })
    expect(CHAT_UNREAD_MAIL_DEBOUNCE_MILLIS).toBe(60 * 60 * 1000)
  })

  it('waits when the latest message is less than one hour old', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: now,
        lastSentAt: undefined,
        unreadMemberships: [{ ...unread, last_message_at: unread.last_message_at + 1 }],
      }),
    ).toEqual({ send: false, reason: 'debounce' })
  })

  it.each([1, 24, 48])('does not send another room after %i hours', (hours) => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: now,
        lastSentAt: now - hours * 60 * 60 * 1000,
        unreadMemberships: [unread],
      }),
    ).toEqual({ send: false, reason: 'min_interval' })
  })

  it('enforces 72 elapsed hours instead of calendar dates', () => {
    expect(CHAT_UNREAD_MAIL_MIN_INTERVAL_MILLIS).toBe(72 * 60 * 60 * 1000)
    expect(
      shouldSendChatUnreadMail({
        nowMillis: now - 1,
        lastSentAt: firstSentAt,
        unreadMemberships: [unread],
      }),
    ).toEqual({ send: false, reason: 'min_interval' })
    expect(
      shouldSendChatUnreadMail({
        nowMillis: now,
        lastSentAt: firstSentAt,
        unreadMemberships: [unread],
      }),
    ).toEqual({ send: true, memberships: [unread] })
  })

  it.each([undefined, firstSentAt - 1, firstSentAt])(
    'keeps an unread room paused when last_read_at is %s',
    (lastReadAt) => {
      expect(
        shouldSendChatUnreadMail({
          nowMillis: now,
          lastSentAt: firstSentAt,
          unreadMemberships: [{ ...unread, last_read_at: lastReadAt, last_unread_mail_sent_at: firstSentAt }],
        }),
      ).toEqual({ send: false, reason: 'awaiting_read' })
    },
  )

  it('resumes only after the room was read and a new unread arrived', () => {
    const membership = { ...unread, last_read_at: firstSentAt + 1, last_unread_mail_sent_at: firstSentAt }
    expect(
      shouldSendChatUnreadMail({
        nowMillis: now,
        lastSentAt: firstSentAt,
        unreadMemberships: [membership],
      }),
    ).toEqual({ send: true, memberships: [membership] })
  })

  it('can notify a room whose message predates the last mail for a different room', () => {
    const membership = { ...unread, last_message_at: firstSentAt - 1 }
    expect(
      shouldSendChatUnreadMail({
        nowMillis: now,
        lastSentAt: firstSentAt,
        unreadMemberships: [membership],
      }),
    ).toEqual({ send: true, memberships: [membership] })
  })

  it('includes only eligible rooms, excluding paused rooms and rooms still waiting an hour', () => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: now,
        lastSentAt: firstSentAt,
        unreadMemberships: [
          { ...unread, last_unread_mail_sent_at: firstSentAt },
          { ...unread, last_message_at: now - 1 },
          unread,
        ],
      }),
    ).toEqual({ send: true, memberships: [unread] })
  })

  it.each([
    { ...unread, unread_count: 0 },
    { ...unread, is_active: false },
    { ...unread, last_message_at: undefined },
    { ...unread, last_read_at: unread.last_message_at },
    { ...unread, last_read_at: now + 1 },
  ])('skips read, inactive, or inconsistent memberships', (membership) => {
    expect(
      shouldSendChatUnreadMail({
        nowMillis: now,
        lastSentAt: undefined,
        unreadMemberships: [membership],
      }),
    ).toEqual({ send: false, reason: 'no_unread' })
  })

  it('carries a late evening message over to the next morning', () => {
    const membership = { ...unread, last_message_at: jst('2026-09-25T22:30:00+09:00') }
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-25T22:55:00+09:00'),
        lastSentAt: undefined,
        unreadMemberships: [membership],
      }),
    ).toEqual({ send: false, reason: 'debounce' })
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-25T23:30:00+09:00'),
        lastSentAt: undefined,
        unreadMemberships: [membership],
      }),
    ).toEqual({ send: false, reason: 'outside_slot' })
    expect(
      shouldSendChatUnreadMail({
        nowMillis: jst('2026-09-26T09:00:00+09:00'),
        lastSentAt: undefined,
        unreadMemberships: [membership],
      }),
    ).toEqual({ send: true, memberships: [membership] })
  })
})

describe('buildChatUnreadMailCoverUrl', () => {
  const toStorageUrl = (storagePath: string): string => `https://storage.example/${storagePath}`

  it('returns the event cover url for an event room', () => {
    expect(
      buildChatUnreadMailCoverUrl(
        { room_type: 'event', community_id: 'community-1', event_id: 'event-1' },
        toStorageUrl,
      ),
    ).toBe('https://storage.example/communities/community-1/events/event-1/cover')
  })

  it('returns an empty string for a community room', () => {
    expect(buildChatUnreadMailCoverUrl({ room_type: 'community', community_id: 'community-1' }, toStorageUrl)).toBe('')
  })

  it('returns an empty string when the event id is missing', () => {
    expect(buildChatUnreadMailCoverUrl({ room_type: 'event', community_id: 'community-1' }, toStorageUrl)).toBe('')
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
      cover_url: '',
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
