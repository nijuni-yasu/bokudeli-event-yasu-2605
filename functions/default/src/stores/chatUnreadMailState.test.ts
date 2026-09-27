import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ChatMembership } from '@shokujii/common/schemas/ChatMembership.js'
import { ChatUnreadMailState } from '@shokujii/common/schemas/ChatUnreadMailState.js'

const transactionGetMock = vi.fn()
const transactionSetMock = vi.fn()
const transactionDeleteMock = vi.fn()
const runTransactionMock = vi.fn()

vi.mock('firebase-admin/firestore', async (importOriginal) => {
  const original = await importOriginal<typeof import('firebase-admin/firestore')>()
  const collection = (path: string) => ({
    doc: (id: string) => ({
      collection: (name: string) => collection(`${path}/${id}/${name}`),
      withConverter: () => ({ path: `${path}/${id}` }),
    }),
  })
  return {
    ...original,
    getFirestore: () => ({ collection, runTransaction: (...args: unknown[]) => runTransactionMock(...args) }),
  }
})

import { claimChatUnreadMailSendSlot, releaseChatUnreadMailSendSlot } from './chatUnreadMailState.js'

const now = Date.parse('2026-09-25T10:00:00+09:00')
const previousSentAt = now - 72 * 60 * 60 * 1000
const statePath = 'users/user-1/notification_states/chat_unread_mail'
const membershipPath = (roomId: string): string => `users/user-1/chat_memberships/${roomId}`
const documents = new Map<string, ChatMembership | ChatUnreadMailState>()
const transaction = { get: transactionGetMock, set: transactionSetMock, delete: transactionDeleteMock }

const membership = (roomId: string, overrides: Partial<ChatMembership> = {}): ChatMembership =>
  new ChatMembership(roomId, {
    room_type: 'event',
    unread_count: 1,
    last_message_at: now - 60 * 60 * 1000,
    ...overrides,
  })

describe('chat unread mail reservation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    documents.clear()
    documents.set(membershipPath('room-1'), membership('room-1'))
    transactionGetMock.mockImplementation(async (ref: { path: string }) => ({
      exists: documents.has(ref.path),
      data: () => documents.get(ref.path),
    }))
    runTransactionMock.mockImplementation(async (callback: (tx: typeof transaction) => Promise<unknown>) =>
      callback(transaction),
    )
  })

  it('rechecks current memberships and skips rooms read or removed after the initial query', async () => {
    documents.set(membershipPath('room-1'), membership('room-1', { unread_count: 0, last_read_at: now }))
    expect(await claimChatUnreadMailSendSlot('user-1', now, ['room-1', 'removed-room'])).toEqual({
      claimed: false,
      reason: 'no_unread',
    })
    expect(transactionSetMock).not.toHaveBeenCalled()
  })

  it('does not reserve when a previous run already claimed the user interval', async () => {
    documents.set(statePath, new ChatUnreadMailState('chat_unread_mail', { last_sent_at: now }))
    expect(await claimChatUnreadMailSendSlot('user-1', now, ['room-1'])).toEqual({
      claimed: false,
      reason: 'min_interval',
    })
    expect(transactionGetMock).toHaveBeenCalledTimes(1)
    expect(transactionSetMock).not.toHaveBeenCalled()
  })

  it('claims at most five eligible rooms and leaves overflow and paused rooms unnotified', async () => {
    const roomIds = Array.from({ length: 6 }, (_, index) => `room-${index + 1}`)
    for (const [index, roomId] of roomIds.entries()) {
      documents.set(membershipPath(roomId), membership(roomId, { last_message_at: now - 60 * 60 * 1000 - index }))
    }
    documents.set(membershipPath('paused'), membership('paused', { last_unread_mail_sent_at: previousSentAt }))
    const claim = await claimChatUnreadMailSendSlot('user-1', now, [...roomIds, 'paused', 'room-1'])
    expect(claim.claimed).toBe(true)
    if (!claim.claimed) throw new Error('expected reservation')
    expect(claim.memberships.map((item) => item.room_id)).toEqual(roomIds.slice(0, 5))
    expect(transactionSetMock).toHaveBeenCalledTimes(6)
    expect(transactionSetMock).toHaveBeenCalledWith({ path: statePath }, expect.objectContaining({ last_sent_at: now }))
    for (const roomId of roomIds.slice(0, 5)) {
      expect(transactionSetMock).toHaveBeenCalledWith(
        { path: membershipPath(roomId) },
        expect.objectContaining({ last_unread_mail_sent_at: now }),
        { merge: true },
      )
    }
    const lastRead = Math.max(...transactionGetMock.mock.invocationCallOrder)
    const firstWrite = Math.min(...transactionSetMock.mock.invocationCallOrder)
    expect(lastRead).toBeLessThan(firstWrite)
  })

  it('restores notification timestamps while preserving reads and messages made during sending', async () => {
    const before = membership('room-1', { last_unread_mail_sent_at: previousSentAt })
    documents.set(statePath, new ChatUnreadMailState('chat_unread_mail', { last_sent_at: now }))
    documents.set(
      membershipPath('room-1'),
      membership('room-1', {
        last_unread_mail_sent_at: now,
        last_read_at: now + 1,
        last_message_at: now + 2,
        last_message_preview: '送信処理中に届いた新着',
        unread_count: 3,
      }),
    )
    await releaseChatUnreadMailSendSlot('user-1', {
      claimedAt: now,
      previousLastSentAt: previousSentAt,
      memberships: [before],
    })
    expect(transactionSetMock).toHaveBeenCalledWith(
      { path: statePath },
      expect.objectContaining({ last_sent_at: previousSentAt }),
    )
    expect(transactionSetMock).toHaveBeenCalledWith(
      { path: membershipPath('room-1') },
      expect.objectContaining({
        last_unread_mail_sent_at: previousSentAt,
        last_read_at: now + 1,
        last_message_at: now + 2,
        last_message_preview: '送信処理中に届いた新着',
        unread_count: 3,
      }),
    )
    const lastRead = Math.max(...transactionGetMock.mock.invocationCallOrder)
    const firstWrite = Math.min(...transactionSetMock.mock.invocationCallOrder)
    expect(lastRead).toBeLessThan(firstWrite)
  })

  it('removes first-send state without recreating a membership removed during sending', async () => {
    documents.set(statePath, new ChatUnreadMailState('chat_unread_mail', { last_sent_at: now }))
    documents.set(membershipPath('room-1'), membership('room-1', { last_unread_mail_sent_at: now }))
    await releaseChatUnreadMailSendSlot('user-1', {
      claimedAt: now,
      previousLastSentAt: undefined,
      memberships: [membership('room-1'), membership('removed-room')],
    })
    expect(transactionDeleteMock).toHaveBeenCalledWith({ path: statePath })
    expect(transactionSetMock).toHaveBeenCalledTimes(1)
    expect(transactionSetMock).toHaveBeenCalledWith(
      { path: membershipPath('room-1') },
      expect.objectContaining({ last_unread_mail_sent_at: undefined }),
    )
  })

  it('does not roll back a newer reservation or a previously released reservation', async () => {
    const reservation = { claimedAt: now, previousLastSentAt: undefined, memberships: [membership('room-1')] }
    documents.set(statePath, new ChatUnreadMailState('chat_unread_mail', { last_sent_at: now + 1 }))
    await releaseChatUnreadMailSendSlot('user-1', reservation)
    documents.delete(statePath)
    await releaseChatUnreadMailSendSlot('user-1', reservation)
    expect(transactionSetMock).not.toHaveBeenCalled()
    expect(transactionDeleteMock).not.toHaveBeenCalled()
  })
})
