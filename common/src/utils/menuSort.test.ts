import { describe, expect, it } from 'vitest'
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

  it('元の配列を変更しない', () => {
    const menus = [
      { id: 'sold-out', is_sold_out: true },
      { id: 'available', is_sold_out: false },
    ]

    sortMenusWithSoldOutLast(menus)

    expect(menus.map((menu) => menu.id)).toEqual(['sold-out', 'available'])
  })
})
