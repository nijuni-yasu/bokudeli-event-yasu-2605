import { describe, expect, it } from 'vitest'
import { NO_ORDER_PARTICIPATION_MENU_ID } from '../schemas/EventItemType.js'
import { sortMenusWithSoldOutLast } from './menuSort.js'

describe('sortMenusWithSoldOutLast', () => {
  it('売り切れメニューを末尾へ移動し、それぞれの元の順序を保つ', () => {
    const menus = [
      { id: 'sold-out-1', is_sold_out: true },
      { id: 'available-1', is_sold_out: false },
      { id: 'sold-out-2', is_sold_out: true },
      { id: 'available-2', is_sold_out: false },
    ]

    expect(sortMenusWithSoldOutLast(menus).map((menu) => menu.id)).toEqual([
      'available-1',
      'available-2',
      'sold-out-1',
      'sold-out-2',
    ])
  })

  it('注文なし参加を売り切れより後ろの末尾に置く', () => {
    const menus = [
      { id: 'sold-out', menu_id: 'sold-out', is_sold_out: true },
      { id: 'no-order', menu_id: NO_ORDER_PARTICIPATION_MENU_ID, is_sold_out: false },
      { id: 'available', menu_id: 'available', is_sold_out: false },
    ]

    expect(sortMenusWithSoldOutLast(menus).map((menu) => menu.id)).toEqual(['available', 'sold-out', 'no-order'])
  })

  it('元の配列を変更しない', () => {
    const menus = [
      { id: 'sold-out', is_sold_out: true },
      { id: 'available', is_sold_out: false },
    ]

    sortMenusWithSoldOutLast(menus)

    expect(menus.map((menu) => menu.id)).toEqual(['sold-out', 'available'])
  })
})
