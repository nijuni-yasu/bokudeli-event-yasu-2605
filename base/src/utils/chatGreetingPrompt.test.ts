import { describe, expect, it, vi } from 'vitest'
import type { SelectedOptionType } from '@shokujii/common/schemas/menuOption.js'
import {
  CHAT_GREETING_EMOJI_KEYS,
  CHAT_GREETING_PROMPT_STATE_KEY,
  CHAT_GREETING_VARIANTS,
  buildChatGreetingText,
  clearChatGreetingPromptState,
  composeChatGreetingBody,
  formatChatGreetingMenuPhrase,
  pickChatGreeting,
  readChatGreetingPromptRoomId,
  withChatGreetingPrompt,
} from './chatGreetingPrompt.js'

const selectedLargeCheese: SelectedOptionType[] = [
  { option_id: 'opt-size', option_name: 'サイズ', item_id: 'large', item_name: '大盛', price_delta: 100 },
  { option_id: 'opt-topping', option_name: 'トッピング', item_id: 'cheese', item_name: 'チーズ', price_delta: 50 },
]

describe('pickChatGreeting', () => {
  it('名前があるときは名前入りの自己紹介を選ぶ', () => {
    expect(pickChatGreeting('山田', () => 0)).toEqual({
      introKey: CHAT_GREETING_VARIANTS[0].namedIntroKey,
      closingKey: CHAT_GREETING_VARIANTS[0].closingKey,
      emojiKey: CHAT_GREETING_EMOJI_KEYS[0],
      name: '山田',
    })
    expect(pickChatGreeting(' 山田 ', () => 0.99)).toEqual({
      introKey: CHAT_GREETING_VARIANTS[CHAT_GREETING_VARIANTS.length - 1].namedIntroKey,
      closingKey: CHAT_GREETING_VARIANTS[CHAT_GREETING_VARIANTS.length - 1].closingKey,
      emojiKey: CHAT_GREETING_EMOJI_KEYS[CHAT_GREETING_EMOJI_KEYS.length - 1],
      name: '山田',
    })
  })

  it('名前が空のときは名前なしの自己紹介を選ぶ', () => {
    expect(pickChatGreeting('  ', () => 0)).toEqual({
      introKey: CHAT_GREETING_VARIANTS[0].unnamedIntroKey,
      closingKey: CHAT_GREETING_VARIANTS[0].closingKey,
      emojiKey: CHAT_GREETING_EMOJI_KEYS[0],
    })
    expect(pickChatGreeting('', () => 1)).toEqual({
      introKey: CHAT_GREETING_VARIANTS[CHAT_GREETING_VARIANTS.length - 1].unnamedIntroKey,
      closingKey: CHAT_GREETING_VARIANTS[CHAT_GREETING_VARIANTS.length - 1].closingKey,
      emojiKey: CHAT_GREETING_EMOJI_KEYS[CHAT_GREETING_EMOJI_KEYS.length - 1],
    })
  })

  it('名前が空のとき自己紹介なしを選べる', () => {
    expect(pickChatGreeting('', () => 0.6)).toMatchObject({
      introKey: null,
    })
  })

  it.each(['山田', ''])('名前「%s」で自己紹介と一言は同じ文面の対で、絵文字だけ別抽選する', (userName) => {
    const introKeyOf = (index: number) => {
      const variant = CHAT_GREETING_VARIANTS[index]
      return userName === '' ? variant?.unnamedIntroKey : variant?.namedIntroKey
    }
    const random = vi.fn<() => number>().mockReturnValueOnce(0).mockReturnValueOnce(0.99)

    expect(pickChatGreeting(userName, random)).toMatchObject({
      introKey: introKeyOf(0),
      closingKey: CHAT_GREETING_VARIANTS[0].closingKey,
      emojiKey: CHAT_GREETING_EMOJI_KEYS[CHAT_GREETING_EMOJI_KEYS.length - 1],
    })
  })
})

describe('formatChatGreetingMenuPhrase', () => {
  it('確定注文を表示名でまとめ、単品は件数を付けない', () => {
    expect(
      formatChatGreetingMenuPhrase([
        { status: 'ordered', menu_name: '唐揚げ' },
        { status: 'canceled', menu_name: 'サラダ' },
        { status: 'in_cart', menu_name: '牛丼' },
        { status: 'processing', menu_name: 'カレー' },
      ]),
    ).toBe('唐揚げ')
  })

  it('同じ表示名は ×N、複数種類は出現順に「 と 」でつなぐ', () => {
    expect(
      formatChatGreetingMenuPhrase([
        { status: 'ordered', menu_name: '唐揚げ' },
        { status: 'ordered', menu_name: '牛丼' },
        { status: 'ordered', menu_name: '唐揚げ' },
      ]),
    ).toBe('唐揚げ×2 と 牛丼')
  })

  it('オプション付きはメニュー名と項目名でまとめる', () => {
    expect(
      formatChatGreetingMenuPhrase([
        { status: 'ordered', menu_name: 'チーズバーガー', selected_options: selectedLargeCheese },
      ]),
    ).toBe('チーズバーガー（大盛、チーズ）')
  })

  it('注文なしで参加はメニュー文に含めない', () => {
    expect(formatChatGreetingMenuPhrase([{ status: 'ordered', menu_name: '注文なしで参加' }])).toBe('')
    expect(formatChatGreetingMenuPhrase([{ status: 'ordered', menu_name: '食事は持参' }])).toBe('')
    expect(
      formatChatGreetingMenuPhrase([{ status: 'ordered', menu_name: '唐揚げ', menu_id: 'no_order_participation' }]),
    ).toBe('')
    expect(
      formatChatGreetingMenuPhrase([
        { status: 'ordered', menu_name: '注文なしで参加' },
        { status: 'ordered', menu_name: '唐揚げ' },
      ]),
    ).toBe('唐揚げ')
  })

  it('表示名が空の行は含めない', () => {
    expect(formatChatGreetingMenuPhrase([{ status: 'ordered', menu_name: '' }])).toBe('')
  })
})

describe('composeChatGreetingBody', () => {
  it('自己紹介、注文文、一言を改行で区切る', () => {
    expect(
      composeChatGreetingBody(
        'こんにちは！山田です。',
        '唐揚げを注文しました。',
        'みなさん、よろしくお願いします😊',
        2000,
      ),
    ).toBe('こんにちは！山田です。\n唐揚げを注文しました。\nみなさん、よろしくお願いします😊')
  })

  it('自己紹介が空のときは注文文から改行する', () => {
    expect(composeChatGreetingBody('', '唐揚げを注文しました。', 'よろしくお願いします😊', 2000)).toBe(
      '唐揚げを注文しました。\nよろしくお願いします😊',
    )
  })

  it('注文文が空のときは自己紹介と一言だけ', () => {
    expect(composeChatGreetingBody('こんにちは！', '', 'みなさん、よろしくお願いします😊', 2000)).toBe(
      'こんにちは！みなさん、よろしくお願いします😊',
    )
  })

  it('上限を超えるときは注文文を外す', () => {
    const intro = 'こんにちは！山田です。'
    const closing = 'みなさん、よろしくお願いします😊'
    const orderSentence = '唐揚げを注文しました。'
    const maxLength = intro.length + closing.length
    expect(composeChatGreetingBody(intro, orderSentence, closing, maxLength)).toBe(`${intro}${closing}`)
    const withOrder = `${intro}\n${orderSentence}\n${closing}`
    expect(composeChatGreetingBody(intro, orderSentence, closing, withOrder.length)).toBe(withOrder)
    expect(composeChatGreetingBody(intro, orderSentence, closing, withOrder.length - 1)).toBe(`${intro}${closing}`)
  })
})

describe('buildChatGreetingText', () => {
  const messages: Record<string, string> = {
    'chat.greeting.intro.named_hello': 'こんにちは！{name}です。',
    'chat.greeting.intro.unnamed_hello': 'こんにちは！',
    'chat.greeting.closing.hello': 'みなさん、よろしくお願いします{emoji}',
    'chat.greeting_emoji.smile': '😊',
    'chat.greeting.order': '{menus}を注文しました。',
  }
  const translate = (key: string, values?: Record<string, string>): string => {
    let text = messages[key] ?? key
    if (values == null) {
      return text
    }
    for (const [name, value] of Object.entries(values)) {
      text = text.split(`{${name}}`).join(value)
    }
    return text
  }

  it('自己紹介、注文、一言を改行で区切る', () => {
    expect(buildChatGreetingText('山田', [{ status: 'ordered', menu_name: '唐揚げ' }], translate, 2000, () => 0)).toBe(
      'こんにちは！山田です。\n唐揚げを注文しました。\nみなさん、よろしくお願いします😊',
    )
  })

  it('注文が無いときと取得できないときはメニュー文を付けない', () => {
    const withoutOrder = 'こんにちは！山田です。みなさん、よろしくお願いします😊'
    expect(buildChatGreetingText('山田', [], translate, 2000, () => 0)).toBe(withoutOrder)
    expect(buildChatGreetingText('山田', null, translate, 2000, () => 0)).toBe(withoutOrder)
  })

  it('名前が空のときは名前なしの自己紹介から始める', () => {
    expect(buildChatGreetingText('', [{ status: 'ordered', menu_name: '唐揚げ' }], translate, 2000, () => 0)).toBe(
      'こんにちは！\n唐揚げを注文しました。\nみなさん、よろしくお願いします😊',
    )
  })

  it('上限を超えるときは注文文を外す', () => {
    const withoutOrder = 'こんにちは！山田です。みなさん、よろしくお願いします😊'
    expect(
      buildChatGreetingText(
        '山田',
        [{ status: 'ordered', menu_name: '唐揚げ' }],
        translate,
        withoutOrder.length,
        () => 0,
      ),
    ).toBe(withoutOrder)
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
