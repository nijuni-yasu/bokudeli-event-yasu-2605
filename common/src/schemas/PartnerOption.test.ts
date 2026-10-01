import { describe, expect, it } from 'vitest'
import { PartnerMenu } from './PartnerMenu.js'
import { PartnerOption } from './PartnerOption.js'

describe('PartnerOption', () => {
  it('必須項目が揃えば toFirestore できる', () => {
    const option = new PartnerOption('partner-1', 'opt-1', {
      option_name: 'サイズ',
      selection: 'single',
      required: true,
      option_items: [{ item_id: 'large', name: '大盛', price_delta: 100 }],
    })
    expect(option.isValidForDatabase()).toBe(true)
    const out = option.toFirestore()
    expect(out.option_name).toBe('サイズ')
    expect(out.option_items).toHaveLength(1)
    expect(out.partner_id).toBe('partner-1')
  })

  it('説明が空なら toFirestore に option_description を含めない', () => {
    const option = new PartnerOption('partner-1', 'opt-1', {
      option_name: 'サイズ',
      option_description: '',
      selection: 'single',
      required: true,
      option_items: [{ item_id: 'large', name: '大盛', price_delta: 100 }],
    })
    expect(option.toFirestore()).not.toHaveProperty('option_description')
  })

  it('編集中の空の項目名は構築でき、保存はできない', () => {
    const option = new PartnerOption('partner-1', 'opt-new', {
      option_items: [{ item_id: 'item-1', name: '', price_delta: 0 }],
    })
    expect(option.option_items[0]?.name).toBe('')
    expect(option.isValidForDatabase()).toBe(false)
  })

  it('項目名が重複するときは保存できない', () => {
    const option = new PartnerOption('partner-1', 'opt-1', {
      option_name: 'サイズ',
      option_items: [
        { item_id: 'a', name: '大盛', price_delta: 100 },
        { item_id: 'b', name: '大盛', price_delta: 0 },
      ],
    })
    expect(option.isValidForDatabase()).toBe(false)
  })
})

describe('PartnerMenu option_ids', () => {
  const base = {
    menu_name: 'バーガー',
    menu_description: '説明',
    menu_price: 800,
    menu_sort_number: 0,
  }

  it('option_ids の重複は保存できない', () => {
    expect(
      () =>
        new PartnerMenu('partner-1', 'menu-1', {
          ...base,
          option_ids: ['opt-1', 'opt-1'],
        }),
    ).toThrow()
  })
})
