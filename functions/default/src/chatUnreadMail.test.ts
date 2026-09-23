import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('firebase-functions/v2/scheduler', () => ({
  onSchedule: (_opts: unknown, handler: unknown) => handler,
}))

const sgMailSendMock = vi.fn()
const listActiveUnreadChatMembershipsMock = vi.fn()
const getChatUnreadMailStateMock = vi.fn()
const saveChatUnreadMailStateMock = vi.fn()
const getUserMock = vi.fn()
const getChatRoomMock = vi.fn()
const getCommunityMock = vi.fn()
const getEventInCommunityMock = vi.fn()
const getChatUrlForUserMock = vi.fn()

vi.mock('./utils/sendgrid.js', () => ({
  send: (...args: unknown[]) => sgMailSendMock(...args),
}))

vi.mock('./stores/chatMembership.js', () => ({
  listActiveUnreadChatMemberships: (...args: unknown[]) => listActiveUnreadChatMembershipsMock(...args),
}))

vi.mock('./stores/chatUnreadMailState.js', () => ({
  getChatUnreadMailState: (...args: unknown[]) => getChatUnreadMailStateMock(...args),
  saveChatUnreadMailState: (...args: unknown[]) => saveChatUnreadMailStateMock(...args),
}))

vi.mock('./stores/user.js', () => ({
  getUser: (...args: unknown[]) => getUserMock(...args),
}))

vi.mock('./stores/chatRoom.js', () => ({
  getChatRoom: (...args: unknown[]) => getChatRoomMock(...args),
}))

vi.mock('./stores/community.js', () => ({
  getCommunity: (...args: unknown[]) => getCommunityMock(...args),
}))

vi.mock('./stores/event.js', () => ({
  getEventInCommunity: (...args: unknown[]) => getEventInCommunityMock(...args),
}))

vi.mock('./utils/urls.js', () => ({
  getChatUrlForUser: (...args: unknown[]) => getChatUrlForUserMock(...args),
}))

vi.mock('./utils/mail.js', () => ({
  DEFAULT_FROM: 'test@example.com',
  SUPPORT_MAIL: 'support@example.com',
}))

import { sendChatUnreadMails } from './chatUnreadMail.js'

const morning = Date.parse('2026-09-22T10:20:00+09:00')
const unreadAt = Date.parse('2026-09-22T09:50:00+09:00')

const unreadRow = {
  userId: 'user-1',
  membership: {
    id: 'room-1',
    room_id: 'room-1',
    room_type: 'event' as const,
    community_id: 'comm-1',
    event_id: 'evt-1',
    is_active: true,
    unread_count: 2,
    last_message_at: unreadAt,
    last_message_preview: '待ち合わせ18時で',
  },
}

describe('sendChatUnreadMails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    listActiveUnreadChatMembershipsMock.mockResolvedValue([unreadRow])
    getChatUnreadMailStateMock.mockResolvedValue(undefined)
    getChatUrlForUserMock.mockResolvedValue('https://pf.example.com/chat/room-1')
    getChatRoomMock.mockResolvedValue({ title: '春の食事会' })
    sgMailSendMock.mockResolvedValue(undefined)
    saveChatUnreadMailStateMock.mockResolvedValue(undefined)
  })

  it('does not query outside the send slot', async () => {
    await sendChatUnreadMails(Date.parse('2026-09-22T12:00:00+09:00'))
    expect(listActiveUnreadChatMembershipsMock).not.toHaveBeenCalled()
    expect(sgMailSendMock).not.toHaveBeenCalled()
  })

  it('skips deleted users and empty emails', async () => {
    getUserMock.mockResolvedValueOnce({ is_deleted: true, user_email: 'a@example.com', user_name: 'A' })
    await sendChatUnreadMails(morning)
    expect(sgMailSendMock).not.toHaveBeenCalled()

    getUserMock.mockResolvedValueOnce({ is_deleted: false, user_email: '  ', user_name: 'A' })
    await sendChatUnreadMails(morning)
    expect(sgMailSendMock).not.toHaveBeenCalled()
    expect(saveChatUnreadMailStateMock).not.toHaveBeenCalled()
  })

  it('sends and writes last_sent_at only after success', async () => {
    getUserMock.mockResolvedValue({ is_deleted: false, user_email: 'user@example.com', user_name: '太郎' })
    await sendChatUnreadMails(morning)
    expect(sgMailSendMock).toHaveBeenCalledTimes(1)
    expect(saveChatUnreadMailStateMock).toHaveBeenCalledTimes(1)
    const savedState = saveChatUnreadMailStateMock.mock.calls[0]?.[1]
    expect(savedState).toMatchObject({ last_sent_at: morning })
  })

  it('does not write last_sent_at when SendGrid fails', async () => {
    getUserMock.mockResolvedValue({ is_deleted: false, user_email: 'user@example.com', user_name: '太郎' })
    sgMailSendMock.mockRejectedValue(new Error('sendgrid down'))
    await sendChatUnreadMails(morning)
    expect(saveChatUnreadMailStateMock).not.toHaveBeenCalled()
  })
})
