import type { HistoryState, RouteLocationRaw, Router } from 'vue-router'

/** history.state に載せる、挨拶案内の対象ルーム ID */
export const CHAT_GREETING_PROMPT_STATE_KEY = 'promptChatGreetingRoomId'

export const CHAT_GREETING_NAMED_KEYS = [
  'chat.greeting.named_hello',
  'chat.greeting.named_nice_to_meet',
  'chat.greeting.named_looking_forward',
  'chat.greeting.named_wave',
  'chat.greeting.named_conversation',
  'chat.greeting.named_friendly',
  'chat.greeting.named_joined',
] as const

export const CHAT_GREETING_UNNAMED_KEYS = [
  'chat.greeting.unnamed_hello',
  'chat.greeting.unnamed_nice_to_meet',
  'chat.greeting.unnamed_looking_forward',
  'chat.greeting.unnamed_wave',
  'chat.greeting.unnamed_conversation',
  'chat.greeting.unnamed_friendly',
  'chat.greeting.unnamed_joined',
] as const

export const CHAT_GREETING_EMOJI_KEYS = [
  'chat.greeting_emoji.smile',
  'chat.greeting_emoji.grin',
  'chat.greeting_emoji.warm_smile',
  'chat.greeting_emoji.raised_hands',
  'chat.greeting_emoji.wave',
  'chat.greeting_emoji.sparkles',
  'chat.greeting_emoji.blossom',
  'chat.greeting_emoji.tulip',
  'chat.greeting_emoji.clover',
  'chat.greeting_emoji.rainbow',
  'chat.greeting_emoji.star',
  'chat.greeting_emoji.glowing_star',
  'chat.greeting_emoji.light_bulb',
  'chat.greeting_emoji.bow',
  'chat.greeting_emoji.folded_hands',
] as const

export type ChatGreetingChoice = {
  key: (typeof CHAT_GREETING_NAMED_KEYS)[number] | (typeof CHAT_GREETING_UNNAMED_KEYS)[number]
  emojiKey: (typeof CHAT_GREETING_EMOJI_KEYS)[number]
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
  const keys = name === '' ? CHAT_GREETING_UNNAMED_KEYS : CHAT_GREETING_NAMED_KEYS
  const key = keys[pickIndex(keys.length, random)]
  const emojiKey = CHAT_GREETING_EMOJI_KEYS[pickIndex(CHAT_GREETING_EMOJI_KEYS.length, random)]
  return name === '' ? { key, emojiKey } : { key, emojiKey, name }
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

export const clearChatGreetingPromptState = (router?: Router): void => {
  const current = history.state as HistoryState | null
  if (current == null || !(CHAT_GREETING_PROMPT_STATE_KEY in current)) {
    return
  }
  const next: HistoryState = { ...current }
  delete next[CHAT_GREETING_PROMPT_STATE_KEY]
  if (router != null) {
    const route = router.currentRoute.value
    void router.replace({
      path: route.path,
      query: route.query,
      hash: route.hash,
      state: next,
    })
    return
  }
  history.replaceState(next, '')
}
