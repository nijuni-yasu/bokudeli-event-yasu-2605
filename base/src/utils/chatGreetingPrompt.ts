import type { HistoryState, RouteLocationRaw } from 'vue-router'

/** history.state に載せる、挨拶案内の対象ルーム ID */
export const CHAT_GREETING_PROMPT_STATE_KEY = 'promptChatGreetingRoomId'

export const CHAT_GREETING_NAMED_KEYS = [
  'chat.greeting.named_hello',
  'chat.greeting.named_nice_to_meet',
  'chat.greeting.named_intro',
  'chat.greeting.named_looking_forward',
] as const

export const CHAT_GREETING_UNNAMED_KEYS = [
  'chat.greeting.unnamed_hello',
  'chat.greeting.unnamed_nice_to_meet',
  'chat.greeting.unnamed_joined',
] as const

export type ChatGreetingChoice = {
  key: (typeof CHAT_GREETING_NAMED_KEYS)[number] | (typeof CHAT_GREETING_UNNAMED_KEYS)[number]
  name?: string
}

const pickIndex = (length: number, random: () => number): number => {
  const raw = Math.floor(random() * length)
  if (raw < 0) {
    return 0
  }
  if (raw >= length) {
    return length - 1
  }
  return raw
}

export const pickChatGreeting = (userName: string, random: () => number = Math.random): ChatGreetingChoice => {
  const name = userName.trim()
  if (name === '') {
    const key = CHAT_GREETING_UNNAMED_KEYS[pickIndex(CHAT_GREETING_UNNAMED_KEYS.length, random)]
    return { key }
  }
  const key = CHAT_GREETING_NAMED_KEYS[pickIndex(CHAT_GREETING_NAMED_KEYS.length, random)]
  return { key, name }
}

export const withChatGreetingPrompt = (location: RouteLocationRaw, roomId: string): RouteLocationRaw => {
  const promptState: HistoryState = { [CHAT_GREETING_PROMPT_STATE_KEY]: roomId }
  if (typeof location === 'string') {
    return { path: location, state: promptState }
  }
  return {
    ...location,
    state: {
      ...location.state,
      ...promptState,
    },
  }
}

export const readChatGreetingPromptRoomId = (): string | null => {
  const value = history.state?.[CHAT_GREETING_PROMPT_STATE_KEY]
  return typeof value === 'string' && value !== '' ? value : null
}

export const clearChatGreetingPromptState = (): void => {
  const current = history.state
  if (current == null || !(CHAT_GREETING_PROMPT_STATE_KEY in current)) {
    return
  }
  const next: HistoryState = { ...current }
  delete next[CHAT_GREETING_PROMPT_STATE_KEY]
  history.replaceState(next, '')
}
