import type { HistoryState, RouteLocationRaw, Router } from 'vue-router'
import {
  NO_ORDER_PARTICIPATION_MENU_ID,
  NO_ORDER_PARTICIPATION_MENU_NAME,
} from '@shokujii/common/schemas/EventItemType.js'
import type { SelectedOptionType } from '@shokujii/common/schemas/menuOption.js'
import { formatOrderMenuDisplayName } from '@shokujii/common/utils/menuOption.js'

/** history.state に載せる、挨拶案内の対象ルーム ID */
export const CHAT_GREETING_PROMPT_STATE_KEY = 'promptChatGreetingRoomId'

/** 表示名変更前に保存された注文なし参加のメニュー名 */
const LEGACY_PARTICIPATION_ONLY_MENU_NAME = '注文なしで参加'

export const CHAT_GREETING_NAMED_INTRO_KEYS = [
  'chat.greeting.intro.named_hello',
  'chat.greeting.intro.named_nice_to_meet',
  'chat.greeting.intro.named_looking_forward',
  'chat.greeting.intro.named_plain',
  'chat.greeting.intro.named_joined',
] as const

/** null は自己紹介なし（一言、または注文文から始める） */
export const CHAT_GREETING_UNNAMED_INTRO_KEYS = [
  'chat.greeting.intro.unnamed_hello',
  'chat.greeting.intro.unnamed_nice_to_meet',
  'chat.greeting.intro.unnamed_looking_forward',
  null,
  'chat.greeting.intro.unnamed_joined',
] as const

export const CHAT_GREETING_CLOSING_KEYS = [
  'chat.greeting.closing.hello',
  'chat.greeting.closing.nice_to_meet',
  'chat.greeting.closing.looking_forward',
  'chat.greeting.closing.wave',
  'chat.greeting.closing.conversation',
  'chat.greeting.closing.friendly',
  'chat.greeting.closing.joined',
] as const

/** 従来の7文面。自己紹介と一言は同じ添字で対にし、絵文字だけ別抽選する */
export const CHAT_GREETING_VARIANTS = [
  {
    namedIntroKey: 'chat.greeting.intro.named_hello',
    unnamedIntroKey: 'chat.greeting.intro.unnamed_hello',
    closingKey: 'chat.greeting.closing.hello',
  },
  {
    namedIntroKey: 'chat.greeting.intro.named_nice_to_meet',
    unnamedIntroKey: 'chat.greeting.intro.unnamed_nice_to_meet',
    closingKey: 'chat.greeting.closing.nice_to_meet',
  },
  {
    namedIntroKey: 'chat.greeting.intro.named_looking_forward',
    unnamedIntroKey: 'chat.greeting.intro.unnamed_looking_forward',
    closingKey: 'chat.greeting.closing.looking_forward',
  },
  {
    namedIntroKey: 'chat.greeting.intro.named_plain',
    unnamedIntroKey: null,
    closingKey: 'chat.greeting.closing.wave',
  },
  {
    namedIntroKey: 'chat.greeting.intro.named_plain',
    unnamedIntroKey: null,
    closingKey: 'chat.greeting.closing.conversation',
  },
  {
    namedIntroKey: 'chat.greeting.intro.named_plain',
    unnamedIntroKey: null,
    closingKey: 'chat.greeting.closing.friendly',
  },
  {
    namedIntroKey: 'chat.greeting.intro.named_joined',
    unnamedIntroKey: 'chat.greeting.intro.unnamed_joined',
    closingKey: 'chat.greeting.closing.joined',
  },
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

export type ChatGreetingIntroKey =
  | (typeof CHAT_GREETING_NAMED_INTRO_KEYS)[number]
  | Exclude<(typeof CHAT_GREETING_UNNAMED_INTRO_KEYS)[number], null>

export type ChatGreetingChoice = {
  introKey: ChatGreetingIntroKey | null
  closingKey: (typeof CHAT_GREETING_CLOSING_KEYS)[number]
  emojiKey: (typeof CHAT_GREETING_EMOJI_KEYS)[number]
  name?: string
}

export type ChatGreetingOrderLine = {
  status: string
  menu_name: string
  menu_id?: string
  selected_options?: readonly SelectedOptionType[] | null
}

const isParticipationOnlyOrder = (order: ChatGreetingOrderLine): boolean => {
  return (
    order.menu_id === NO_ORDER_PARTICIPATION_MENU_ID ||
    order.menu_name === NO_ORDER_PARTICIPATION_MENU_NAME ||
    order.menu_name === LEGACY_PARTICIPATION_ONLY_MENU_NAME
  )
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
  const variant = CHAT_GREETING_VARIANTS[pickIndex(CHAT_GREETING_VARIANTS.length, random)] ?? CHAT_GREETING_VARIANTS[0]
  const introKey = name === '' ? variant.unnamedIntroKey : variant.namedIntroKey
  const closingKey = variant.closingKey
  const emojiKey = CHAT_GREETING_EMOJI_KEYS[pickIndex(CHAT_GREETING_EMOJI_KEYS.length, random)]
  return name === '' ? { introKey, closingKey, emojiKey } : { introKey, closingKey, emojiKey, name }
}

/** 確定注文の表示名を、同じ名前は件数、複数種類は「 と 」でまとめる。対象が無いときは空文字 */
export const formatChatGreetingMenuPhrase = (orders: readonly ChatGreetingOrderLine[]): string => {
  const menuCounts = new Map<string, number>()
  const menuNameOrder: string[] = []
  for (const order of orders) {
    if (order.status !== 'ordered' || isParticipationOnlyOrder(order)) {
      continue
    }
    const name = formatOrderMenuDisplayName(order.menu_name, order.selected_options)
    if (name === '') {
      continue
    }
    const count = menuCounts.get(name)
    if (count == null) {
      menuCounts.set(name, 1)
      menuNameOrder.push(name)
      continue
    }
    menuCounts.set(name, count + 1)
  }
  return menuNameOrder
    .map((name) => {
      const count = menuCounts.get(name) ?? 0
      return count <= 1 ? name : `${name}×${count}`
    })
    .join(' と ')
}

type ChatGreetingTranslate = (key: string, values?: Record<string, string>) => string

/** 自己紹介・注文・一言を選んで連結する。orders が null のときは注文文を付けない */
export const buildChatGreetingText = (
  userName: string,
  orders: readonly ChatGreetingOrderLine[] | null,
  translate: ChatGreetingTranslate,
  maxLength: number,
  random: () => number = Math.random,
): string => {
  const choice = pickChatGreeting(userName, random)
  const intro = choice.introKey == null ? '' : translate(choice.introKey, { name: choice.name ?? '' })
  const closing = translate(choice.closingKey, { emoji: translate(choice.emojiKey) })
  const menus = orders == null ? '' : formatChatGreetingMenuPhrase(orders)
  const orderSentence = menus === '' ? '' : translate('chat.greeting.order', { menus })
  return composeChatGreetingBody(intro, orderSentence, closing, maxLength)
}

/** 自己紹介、注文文、一言を連結する。注文文があるときは改行で区切る。上限を超えるときは注文文を外す */
export const composeChatGreetingBody = (
  intro: string,
  orderSentence: string,
  closing: string,
  maxLength: number,
): string => {
  const withoutOrder = `${intro}${closing}`
  if (orderSentence === '') {
    return withoutOrder
  }
  const withOrder = [intro, orderSentence, closing].filter((part) => part !== '').join('\n')
  if (withOrder.length > maxLength) {
    return withoutOrder
  }
  return withOrder
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
