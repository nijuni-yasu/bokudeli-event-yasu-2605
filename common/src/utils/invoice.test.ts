import { describe, expect, it } from 'vitest'
import { EventMemberOrder } from '../schemas/EventMemberOrder.js'
import { minimalMemberOrderFields } from '../schemas/partnerCompatTestDummyData.js'
import {
  aggregateOrderMenus,
  calculateInvoiceTaxBreakdown,
  calculateOrdersTotal,
  computeInclusive8ExTaxAndTax,
  computeInclusive10ExTaxAndTax,
  groupOrderedCommunityBillOffByAmount,
} from './invoice.js'

describe('computeInclusive8ExTaxAndTax', () => {
  it('1100 円税込: 税抜は floor と税額の和が税込', () => {
    const { exTaxPrice, taxPrice } = computeInclusive8ExTaxAndTax(1100)
    expect(exTaxPrice).toBe(Math.floor(1100 / 1.08))
    expect(exTaxPrice + taxPrice).toBe(1100)
  })

  it('1000 円税込', () => {
    const { exTaxPrice, taxPrice } = computeInclusive8ExTaxAndTax(1000)
    expect(exTaxPrice).toBe(925)
    expect(taxPrice).toBe(75)
  })

  it('880 円税込', () => {
    const { exTaxPrice, taxPrice } = computeInclusive8ExTaxAndTax(880)
    expect(exTaxPrice).toBe(Math.floor(880 / 1.08))
    expect(exTaxPrice + taxPrice).toBe(880)
  })

  it('5400 円税込（税抜 5000・税 400）', () => {
    const { exTaxPrice, taxPrice } = computeInclusive8ExTaxAndTax(5400)
    expect(exTaxPrice).toBe(5000)
    expect(taxPrice).toBe(400)
  })

  it('0 円', () => {
    const { exTaxPrice, taxPrice } = computeInclusive8ExTaxAndTax(0)
    expect(exTaxPrice).toBe(0)
    expect(taxPrice).toBe(0)
  })

  it('請求書の 8% 内訳と一致する', () => {
    const tax08Inclusive = 5400
    const breakdown = calculateInvoiceTaxBreakdown(tax08Inclusive, 0)
    const receipt = computeInclusive8ExTaxAndTax(tax08Inclusive)
    expect(receipt.exTaxPrice).toBe(breakdown.tax8SubTotal)
    expect(receipt.taxPrice).toBe(breakdown.tax8)
  })
})

describe('computeInclusive10ExTaxAndTax', () => {
  it('110 円税込: 税抜 100・税 10', () => {
    expect(computeInclusive10ExTaxAndTax(110)).toEqual({ exTaxPrice: 100, taxPrice: 10 })
  })

  it('240 円税込: 税抜 218・税 22', () => {
    expect(computeInclusive10ExTaxAndTax(240)).toEqual({ exTaxPrice: 218, taxPrice: 22 })
  })

  it('0 円', () => {
    expect(computeInclusive10ExTaxAndTax(0)).toEqual({ exTaxPrice: 0, taxPrice: 0 })
  })
})

describe('aggregateOrderMenus', () => {
  it('選択が違う注文は別行にする', () => {
    const base = { ...minimalMemberOrderFields, status: 'ordered' as const }
    const plain = new EventMemberOrder('o1', { ...base, menu_id: 'm1', menu_name: 'バーガー', menu_price: 1000 })
    const withOption = new EventMemberOrder('o2', {
      ...base,
      menu_id: 'm1',
      menu_name: 'バーガー',
      menu_price: 1100,
      selected_options: [
        { option_id: 'opt-size', option_name: 'サイズ', item_id: 'large', item_name: '大盛', price_delta: 100 },
      ],
    })
    const rows = aggregateOrderMenus([plain, withOption])
    expect(rows).toHaveLength(2)
    expect(rows.map((row) => row.name).sort()).toEqual(['バーガー', 'バーガー（大盛）'])
  })

  it('selected_options 無しの過去注文はメニュー名と現行単価のまままとめる', () => {
    const a = new EventMemberOrder('o1', {
      ...minimalMemberOrderFields,
      menu_id: 'm1',
      menu_name: 'ランチ',
      menu_price: 1000,
    })
    const b = new EventMemberOrder('o2', {
      ...minimalMemberOrderFields,
      menu_id: 'm1',
      menu_name: 'ランチ',
      menu_price: 1000,
    })
    const rows = aggregateOrderMenus([a, b])
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ name: 'ランチ', count: 2, price: 1000 })
  })

  it('organizer_menu は集計から除外する', () => {
    const partner = new EventMemberOrder('o1', {
      ...minimalMemberOrderFields,
      menu_id: 'm1',
      menu_name: 'ランチ',
      menu_price: 1000,
      item_type: 'partner_menu',
    })
    const organizer = new EventMemberOrder('o2', {
      ...minimalMemberOrderFields,
      menu_id: 'no_order_participation',
      menu_name: '注文なし',
      menu_price: 0,
      item_type: 'organizer_menu',
    })
    const rows = aggregateOrderMenus([partner, organizer])
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ name: 'ランチ', count: 1, price: 1000 })
  })
})

describe('groupOrderedCommunityBillOffByAmount', () => {
  it('まとめキーに 1 食あたりの負担額を足す', () => {
    const shared = {
      ...minimalMemberOrderFields,
      status: 'ordered' as const,
      menu_id: 'm1',
      menu_name: 'バーガー',
      pay_community_bill_off_amount: 200,
    }
    const a = new EventMemberOrder('o1', { ...shared, menu_price: 1000 })
    const b = new EventMemberOrder('o2', {
      ...shared,
      menu_price: 1100,
      selected_options: [
        { option_id: 'opt-size', option_name: 'サイズ', item_id: 'large', item_name: '大盛', price_delta: 100 },
      ],
    })
    const rows = groupOrderedCommunityBillOffByAmount([a, b])
    expect(rows).toHaveLength(2)
  })
})

describe('calculateOrdersTotal', () => {
  it('organizer_menu は合計から除外する', () => {
    const orders = [
      new EventMemberOrder('o1', {
        order_id: 'o1',
        user_id: 'u1',
        event_id: 'e1',
        community_id: 'c1',
        menu_id: 'm1',
        menu_name: 'A',
        menu_price: 1000,
        item_type: 'partner_menu',
        status: 'ordered',
      }),
      new EventMemberOrder('o2', {
        order_id: 'o2',
        user_id: 'u1',
        event_id: 'e1',
        community_id: 'c1',
        menu_id: 'no_order_participation',
        menu_name: '注文なし',
        menu_price: 0,
        item_type: 'organizer_menu',
        status: 'ordered',
      }),
    ]
    expect(calculateOrdersTotal(orders)).toBe(1000)
  })
})
