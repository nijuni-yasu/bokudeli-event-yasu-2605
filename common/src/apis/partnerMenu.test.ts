import { describe, expect, it } from 'vitest'
import { SavePartnerMenuRequestSchema, SavePartnerOptionRequestSchema } from './partnerMenu.js'

const option = {
  option_id: 'opt-1',
  create: true,
  option_name: 'サイズ',
  selection: 'single',
  required: true,
  option_items: [{ item_id: 'large', name: '大盛', price_delta: 100 }],
}
const menu = {
  menu_id: 'menu-1',
  menu_name: '弁当',
  menu_description: '説明',
  menu_price: 1000,
  menu_sort_number: 0,
  is_sold_out: false,
  limit_per_event: null,
  menu_date_start: null,
  menu_date_end: null,
  option_ids: ['opt-1'],
}

describe('店舗メニュー・オプションの Callable 入力', () => {
  it.each([
    null,
    {},
    'invalid',
    { item_id: '', name: '大盛', price_delta: 0 },
    { item_id: 'a', name: '', price_delta: 0 },
    { item_id: 'a', name: 'あ'.repeat(41), price_delta: 0 },
    { item_id: 'a', name: '大盛', price_delta: '100' },
    { item_id: 'a', name: '大盛', price_delta: 0.1 },
    { item_id: 'a', name: '大盛', price_delta: -10001 },
    { item_id: 'a', name: '大盛', price_delta: 10001 },
  ])('不正な項目を拒否する: %j', (item) => {
    expect(SavePartnerOptionRequestSchema.safeParse({ ...option, option_items: [item] }).success).toBe(false)
  })
  it.each([-10000, 0, 10000])('境界金額を許可する: %i', (price_delta) => {
    expect(
      SavePartnerOptionRequestSchema.safeParse({
        ...option,
        option_items: [{ item_id: 'a', name: '変更', price_delta }],
      }).success,
    ).toBe(true)
  })
  it('項目ID・項目名の重複と上限超過を拒否する', () => {
    for (const option_items of [
      [],
      [option.option_items[0], { item_id: 'large', name: '別名', price_delta: 0 }],
      [option.option_items[0], { item_id: 'other', name: '大盛', price_delta: 0 }],
      Array.from({ length: 21 }, (_, i) => ({ item_id: String(i), name: String(i), price_delta: 0 })),
    ]) {
      expect(SavePartnerOptionRequestSchema.safeParse({ ...option, option_items }).success).toBe(false)
    }
  })
  it('他店舗への書き込み指定や日時の偽装を受け取らない', () => {
    expect(SavePartnerOptionRequestSchema.safeParse({ ...option, partner_id: 'other' }).success).toBe(false)
    expect(SavePartnerOptionRequestSchema.safeParse({ ...option, created_at: 1 }).success).toBe(false)
    expect(SavePartnerMenuRequestSchema.safeParse({ ...menu, partner_id: 'other' }).success).toBe(false)
  })
  it.each(['', '.', '..', 'a/b', '__reserved__', 'あ'.repeat(501)])('不正な参照IDを拒否する: %s', (id) => {
    expect(SavePartnerMenuRequestSchema.safeParse({ ...menu, option_ids: [id] }).success).toBe(false)
  })
  it('メニュー説明文と参照配列も検証する', () => {
    expect(SavePartnerMenuRequestSchema.safeParse(menu).success).toBe(true)
    expect(SavePartnerMenuRequestSchema.safeParse({ ...menu, menu_id: 'no_order_participation' }).success).toBe(false)
    for (const patch of [
      { menu_description: '' },
      { menu_description: 'あ'.repeat(301) },
      { option_ids: ['opt-1', 'opt-1'] },
      { option_ids: Array.from({ length: 11 }, (_, i) => String(i)) },
      { limit_per_event: -1 },
      { menu_date_start: {} },
    ]) {
      expect(SavePartnerMenuRequestSchema.safeParse({ ...menu, ...patch }).success).toBe(false)
    }
  })
})
