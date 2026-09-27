import { describe, expect, it } from 'vitest'
import { ChatUnreadMailState, CHAT_UNREAD_MAIL_STATE_DOC_ID } from './ChatUnreadMailState.js'

describe('ChatUnreadMailState', () => {
  it('stores last_sent_at only', () => {
    const lastSentAt = Date.parse('2026-09-22T10:15:00+09:00')
    const state = new ChatUnreadMailState(CHAT_UNREAD_MAIL_STATE_DOC_ID, {
      last_sent_at: lastSentAt,
    })

    expect(state.isValidForDatabase()).toBe(true)
    const firestore = state.toFirestore()
    expect(Object.keys(firestore)).toEqual(['last_sent_at'])
    expect(firestore.last_sent_at.toMillis()).toBe(lastSentAt)
  })
})
