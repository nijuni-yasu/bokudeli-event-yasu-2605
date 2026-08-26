import { describe, expect, it } from 'vitest'
import { EventMenu } from './EventMenu.js'
import { NO_ORDER_PARTICIPATION_MENU_ID } from './EventItemType.js'

describe('EventMenu item_type', () => {
  it('item_type 未指定時は partner_menu が既定', () => {
    const menu = new EventMenu('event-1', 'menu-1', {
      menu_name: 'Test',
      menu_description: 'desc',
      menu_price: 100,
      menu_sort_number: 1,
    })
    expect(menu.item_type).toBe('partner_menu')
    expect(menu.isValidForDatabase()).toBe(true)
  })

  it('organizer_menu は menu_price 0 を許可する', () => {
    const menu = new EventMenu('event-1', NO_ORDER_PARTICIPATION_MENU_ID, {
      menu_name: '注文なしで参加',
      menu_description: '説明',
      menu_price: 0,
      menu_sort_number: 999999,
      is_selected: false,
      item_type: 'organizer_menu',
    })
    expect(menu.isValidForDatabase()).toBe(true)
  })

  it('partner_menu で menu_price 0 は拒否する', () => {
    expect(
      () =>
        new EventMenu('event-1', 'menu-1', {
          menu_name: 'Test',
          menu_description: 'desc',
          menu_price: 0,
          menu_sort_number: 1,
          item_type: 'partner_menu',
        }),
    ).toThrow()
  })
})
