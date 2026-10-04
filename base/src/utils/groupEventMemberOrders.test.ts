import { describe, expect, it } from 'vitest'
import { groupOrderedMenus } from './groupEventMemberOrders.js'

describe('groupOrderedMenus', () => {
  it('ordered だけをメニューごとに数える', () => {
    const groups = groupOrderedMenus([
      { status: 'ordered', menu_id: 'm1', menu_name: 'ハンバーグ', menu_price: 1000 },
      { status: 'ordered', menu_id: 'm1', menu_name: 'ハンバーグ', menu_price: 1000 },
      { status: 'in_cart', menu_id: 'm2', menu_name: 'サラダ', menu_price: 500 },
      { status: 'canceled', menu_id: 'm1', menu_name: 'ハンバーグ', menu_price: 1000 },
    ])
    expect(groups.map(([, group]) => group)).toEqual([{ name: 'ハンバーグ', count: 2 }])
  })
})
