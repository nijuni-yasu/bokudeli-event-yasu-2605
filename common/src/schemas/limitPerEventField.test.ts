import { describe, expect, it } from 'vitest'
import { PartnerMenu } from './PartnerMenu.js'
import { EventMenu } from './EventMenu.js'
import { normalizeLimitPerEventForApp } from './limitPerEventField.js'

describe('normalizeLimitPerEventForApp', () => {
  it('有効な値はそのまま返す', () => {
    expect(normalizeLimitPerEventForApp(3)).toBe(3)
    expect(normalizeLimitPerEventForApp(1000)).toBe(1000)
  })

  it('null / undefined は null を返す', () => {
    expect(normalizeLimitPerEventForApp(null)).toBeNull()
    expect(normalizeLimitPerEventForApp(undefined)).toBeNull()
  })

  it('上限超過・不正値は null を返す', () => {
    expect(normalizeLimitPerEventForApp(1001)).toBeNull()
    expect(normalizeLimitPerEventForApp(1300)).toBeNull()
    expect(normalizeLimitPerEventForApp(0)).toBeNull()
    expect(normalizeLimitPerEventForApp(1.5)).toBeNull()
    expect(normalizeLimitPerEventForApp('5')).toBeNull()
  })
})

describe('PartnerMenu limit_per_event 読み込み正規化', () => {
  it('上限超過の既存値は null として読み込める', () => {
    const menu = new PartnerMenu('partner1', 'menu1', {
      menu_name: 'テスト',
      menu_description: '説明',
      menu_price: 500,
      limit_per_event: 1300,
    })
    expect(menu.limit_per_event).toBeNull()
  })
})

describe('EventMenu limit_per_event 読み込み正規化', () => {
  it('上限超過の既存値は null として読み込める', () => {
    const menu = new EventMenu('event1', 'menu1', {
      menu_name: 'テスト',
      menu_description: '説明',
      menu_price: 500,
      menu_sort_number: 0,
      limit_per_event: 1300,
    })
    expect(menu.limit_per_event).toBeNull()
  })
})
