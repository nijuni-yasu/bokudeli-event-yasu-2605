import { describe, expect, it } from 'vitest'
import type { SelectedOptionType } from '../schemas/menuOption.js'
import type { MenuOptionDefinition } from './menuOption.js'
import {
  computeMenuMinTotal,
  computeOptionMinDelta,
  formatNamesPrintMenuLabel,
  formatOrderMenuDisplayName,
  getOrderMenuGroupKey,
  getStripeLineItemGroupKey,
  isMenuMinTotalValid,
  resolveEventMenuCartOrder,
  snapshotPartnerOptionsForMenu,
  validateCartOptionSelection,
} from './menuOption.js'

const sizeOption: MenuOptionDefinition = {
  option_id: 'opt-size',
  option_name: 'サイズ',
  selection: 'single',
  required: true,
  option_items: [
    { item_id: 'large', name: '大盛', price_delta: 100 },
    { item_id: 'regular', name: '並', price_delta: 0 },
  ],
}

const toppingOption: MenuOptionDefinition = {
  option_id: 'opt-topping',
  option_name: 'トッピング',
  selection: 'multiple',
  required: false,
  option_items: [
    { item_id: 'cheese', name: 'チーズ', price_delta: 50 },
    { item_id: 'minus', name: '少なめ', price_delta: -30 },
  ],
}

const selectedLargeCheese: SelectedOptionType[] = [
  { option_id: 'opt-size', option_name: 'サイズ', item_id: 'large', item_name: '大盛', price_delta: 100 },
  { option_id: 'opt-topping', option_name: 'トッピング', item_id: 'cheese', item_name: 'チーズ', price_delta: 50 },
]

describe('formatOrderMenuDisplayName', () => {
  it('選択があるときメニュー名のあとに項目名を付ける', () => {
    expect(formatOrderMenuDisplayName('チーズバーガー', selectedLargeCheese)).toBe('チーズバーガー（大盛、チーズ）')
  })

  it('選択が無いときメニュー名のみ', () => {
    expect(formatOrderMenuDisplayName('チーズバーガー')).toBe('チーズバーガー')
    expect(formatOrderMenuDisplayName('チーズバーガー', [])).toBe('チーズバーガー')
  })
})

describe('computeOptionMinDelta / computeMenuMinTotal', () => {
  it('必須の単一は最小差分', () => {
    expect(computeOptionMinDelta(sizeOption)).toBe(0)
  })

  it('任意の単一は 0 と最小の小さい方', () => {
    expect(
      computeOptionMinDelta({
        ...sizeOption,
        required: false,
        option_items: [
          { item_id: 'a', name: 'A', price_delta: 80 },
          { item_id: 'b', name: 'B', price_delta: -20 },
        ],
      }),
    ).toBe(-20)
    expect(
      computeOptionMinDelta({
        ...sizeOption,
        required: false,
        option_items: [{ item_id: 'a', name: 'A', price_delta: 80 }],
      }),
    ).toBe(0)
  })

  it('複数は負の差分の合計', () => {
    expect(computeOptionMinDelta(toppingOption)).toBe(-30)
  })

  it('最小合計が 1 円未満なら無効', () => {
    expect(computeMenuMinTotal(1000, [sizeOption, toppingOption])).toBe(970)
    expect(isMenuMinTotalValid(20, [toppingOption])).toBe(false)
    expect(isMenuMinTotalValid(31, [toppingOption])).toBe(true)
  })
})

describe('getOrderMenuGroupKey / getStripeLineItemGroupKey', () => {
  it('menu_id + 選択の組 + menu_price でまとめる', () => {
    const keyA = getOrderMenuGroupKey({
      menu_id: 'm1',
      menu_price: 1150,
      selected_options: selectedLargeCheese,
    })
    const keyB = getOrderMenuGroupKey({
      menu_id: 'm1',
      menu_price: 1150,
      selected_options: [...selectedLargeCheese].reverse(),
    })
    expect(keyA).toBe(keyB)
    expect(
      getOrderMenuGroupKey({
        menu_id: 'm1',
        menu_price: 1000,
        selected_options: selectedLargeCheese,
      }),
    ).not.toBe(keyA)
  })

  it('区切り文字を含む ID でも別の選択と衝突しない', () => {
    const collided = getOrderMenuGroupKey({
      menu_id: 'm1',
      menu_price: 1000,
      selected_options: [
        {
          option_id: 'opt',
          option_name: 'A',
          item_id: 'b,c:d',
          item_name: 'A',
          price_delta: 0,
        },
      ],
    })
    const split = getOrderMenuGroupKey({
      menu_id: 'm1',
      menu_price: 1000,
      selected_options: [
        { option_id: 'opt', option_name: 'A', item_id: 'b', item_name: 'A', price_delta: 0 },
        { option_id: 'c', option_name: 'B', item_id: 'd', item_name: 'B', price_delta: 0 },
      ],
    })
    expect(collided).not.toBe(split)
  })

  it('selected_options 無しと空配列は同じ', () => {
    expect(getOrderMenuGroupKey({ menu_id: 'm1', menu_price: 1000 })).toBe(
      getOrderMenuGroupKey({ menu_id: 'm1', menu_price: 1000, selected_options: [] }),
    )
  })

  it('Stripe 用キーは自己負担単価を足す', () => {
    const order = { menu_id: 'm1', menu_price: 1150, selected_options: selectedLargeCheese }
    expect(getStripeLineItemGroupKey(order, 650)).not.toBe(getStripeLineItemGroupKey(order, 1150))
    expect(getStripeLineItemGroupKey(order, 650)).toBe(`${getOrderMenuGroupKey(order)}\u0000${650}`)
  })
})

describe('validateCartOptionSelection / resolveEventMenuCartOrder', () => {
  const eventMenu = {
    menu_id: 'm1',
    menu_name: 'チーズバーガー',
    menu_price: 1000,
    options: [sizeOption, toppingOption],
  }

  it('selected_items が配列でないときは拒否する', () => {
    const resolved = resolveEventMenuCartOrder({
      eventMenu,
      selectedItems: { option_id: 'opt-size', item_id: 'large' },
    })
    expect(resolved.ok).toBe(false)
    if (!resolved.ok) {
      expect(resolved.httpsCode).toBe('invalid-argument')
    }
  })

  it('必須未選択と single の複数選択を拒否する', () => {
    expect(validateCartOptionSelection([sizeOption], []).ok).toBe(false)
    expect(
      validateCartOptionSelection(
        [sizeOption],
        [
          { option_id: 'opt-size', item_id: 'large' },
          { option_id: 'opt-size', item_id: 'regular' },
        ],
      ).ok,
    ).toBe(false)
  })

  it('定義順で selected_options を作り込み単価を返す', () => {
    const resolved = resolveEventMenuCartOrder({
      eventMenu,
      selectedItems: [
        { option_id: 'opt-topping', item_id: 'cheese' },
        { option_id: 'opt-size', item_id: 'large' },
      ],
      presentedMenuPrice: 1150,
    })
    expect(resolved.ok).toBe(true)
    if (resolved.ok) {
      expect(resolved.menu_price).toBe(1150)
      expect(resolved.selected_options.map((item) => item.item_id)).toEqual(['large', 'cheese'])
    }
  })

  it('提示額不一致は failed-precondition', () => {
    const resolved = resolveEventMenuCartOrder({
      eventMenu,
      selectedItems: [{ option_id: 'opt-size', item_id: 'large' }],
      presentedMenuPrice: 1000,
    })
    expect(resolved).toMatchObject({ ok: false, httpsCode: 'failed-precondition' })
  })

  it('コピーされていない項目は invalid-argument', () => {
    const resolved = resolveEventMenuCartOrder({
      eventMenu: { ...eventMenu, options: [] },
      selectedItems: [{ option_id: 'opt-size', item_id: 'large' }],
    })
    expect(resolved).toMatchObject({ ok: false, httpsCode: 'invalid-argument' })
  })
})

describe('formatNamesPrintMenuLabel', () => {
  it('メニュー名が 28 文字以上ならメニュー名だけ切る', () => {
    const longName = 'あ'.repeat(30)
    expect(formatNamesPrintMenuLabel(longName, selectedLargeCheese)).toBe('あ'.repeat(28))
  })

  it('未満なら項目名側だけ切って … を付ける', () => {
    const label = formatNamesPrintMenuLabel('バーガー', selectedLargeCheese, 10)
    expect(label.startsWith('バーガー（')).toBe(true)
    expect(label.endsWith('）')).toBe(true)
    expect(label.length).toBeLessThanOrEqual(12)
    expect(label).toContain('…')
  })
})

describe('snapshotPartnerOptionsForMenu', () => {
  it('option_ids の順で定義をコピーする', () => {
    const snapped = snapshotPartnerOptionsForMenu(['opt-topping', 'opt-size'], [sizeOption, toppingOption])
    expect(snapped.map((option) => option.option_id)).toEqual(['opt-topping', 'opt-size'])
  })
})
