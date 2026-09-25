import { describe, expect, it } from 'vitest'
import {
  CHAT_GREETING_NAMED_KEYS,
  CHAT_GREETING_PROMPT_STATE_KEY,
  CHAT_GREETING_UNNAMED_KEYS,
  clearChatGreetingPromptState,
  pickChatGreeting,
  readChatGreetingPromptRoomId,
  withChatGreetingPrompt,
} from './chatGreetingPrompt.js'

describe('pickChatGreeting', () => {
  it('名前があるときは名前入りの文面を選ぶ', () => {
    expect(pickChatGreeting('山田', () => 0)).toEqual({ key: CHAT_GREETING_NAMED_KEYS[0], name: '山田' })
    expect(pickChatGreeting(' 山田 ', () => 0.99)).toEqual({
      key: CHAT_GREETING_NAMED_KEYS[CHAT_GREETING_NAMED_KEYS.length - 1],
      name: '山田',
    })
  })

  it('名前が空のときは名前なしの文面を選ぶ', () => {
    expect(pickChatGreeting('  ', () => 0)).toEqual({ key: CHAT_GREETING_UNNAMED_KEYS[0] })
    expect(pickChatGreeting('', () => 1)).toEqual({
      key: CHAT_GREETING_UNNAMED_KEYS[CHAT_GREETING_UNNAMED_KEYS.length - 1],
    })
  })
})

describe('withChatGreetingPrompt', () => {
  it('パス文字列に挨拶案内の state を載せる', () => {
    expect(withChatGreetingPrompt('/chat/room-1', 'room-1')).toEqual({
      path: '/chat/room-1',
      state: { [CHAT_GREETING_PROMPT_STATE_KEY]: 'room-1' },
    })
  })

  it('既存の state を残して対象ルーム ID を足す', () => {
    expect(withChatGreetingPrompt({ path: '/chat/room-1', state: { from: 'orders' } }, 'room-1')).toEqual({
      path: '/chat/room-1',
      state: { from: 'orders', [CHAT_GREETING_PROMPT_STATE_KEY]: 'room-1' },
    })
  })
})

describe('readChatGreetingPromptRoomId', () => {
  it('history.state から対象ルーム ID を読み、消したあとは null になる', () => {
    const state: Record<string, unknown> = { position: 1, [CHAT_GREETING_PROMPT_STATE_KEY]: 'room-1' }
    const historyMock = {
      get state() {
        return state
      },
      replaceState(next: Record<string, unknown>) {
        for (const key of Object.keys(state)) {
          delete state[key]
        }
        Object.assign(state, next)
      },
    }
    const previous = globalThis.history
    Object.defineProperty(globalThis, 'history', { configurable: true, value: historyMock })
    try {
      expect(readChatGreetingPromptRoomId()).toBe('room-1')
      clearChatGreetingPromptState()
      expect(readChatGreetingPromptRoomId()).toBeNull()
      expect(state.position).toBe(1)
    } finally {
      Object.defineProperty(globalThis, 'history', { configurable: true, value: previous })
    }
  })
})
