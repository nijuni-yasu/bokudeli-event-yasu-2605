import { describe, expect, it } from 'vitest'
import { EventMenu } from '../schemas/EventMenu.js'
import { EventMemberOrder } from '../schemas/EventMemberOrder.js'
import {
  assertMenuLimitsNotExceeded,
  computeRemaining,
  countIncrementsFromCartMenus,
  countOrderedByMenuId,
  findMenuLimitViolations,
} from './menuLimit.js'

const EVENT_ID = 'event1'

function makeEventMenu(menuId: string, limitPerEvent: number | null = null): EventMenu {
  return new EventMenu(EVENT_ID, menuId, {
    menu_name: `Menu ${menuId}`,
    menu_description: 'desc',
    menu_price: 1000,
    menu_sort_number: 0,
    limit_per_event: limitPerEvent,
  })
}

function makeOrder(menuId: string, status: EventMemberOrder['status'] = 'ordered'): EventMemberOrder {
  return new EventMemberOrder(`order-${menuId}-${Math.random()}`, {
    order_id: `order-${menuId}`,
    user_id: 'user1',
    event_id: EVENT_ID,
    community_id: 'community1',
    status,
    menu_id: menuId,
    menu_name: `Menu ${menuId}`,
    menu_price: 1000,
  })
}

describe('computeRemaining', () => {
  it('limit が null の場合は null を返す', () => {
    expect(computeRemaining(null, 3)).toBeNull()
  })

  it('残数を返す', () => {
    expect(computeRemaining(10, 3)).toBe(7)
    expect(computeRemaining(10, 12)).toBe(0)
  })
})

describe('countOrderedByMenuId', () => {
  it('ordered のみ数える', () => {
    const orders = [makeOrder('menu1', 'ordered'), makeOrder('menu1', 'in_cart'), makeOrder('menu2', 'ordered')]
    expect(countOrderedByMenuId(orders, 'menu1')).toBe(1)
  })
})

describe('findMenuLimitViolations', () => {
  it('上限内なら空配列', () => {
    const eventMenus = [makeEventMenu('menu1', 5)]
    const violations = findMenuLimitViolations(
      eventMenus,
      new Map([['menu1', 3]]),
      countIncrementsFromCartMenus([{ menu_id: 'menu1', count: 2 }]),
    )
    expect(violations).toEqual([])
  })

  it('超過時に violation を返す', () => {
    const eventMenus = [makeEventMenu('menu1', 5)]
    const violations = findMenuLimitViolations(
      eventMenus,
      new Map([['menu1', 4]]),
      countIncrementsFromCartMenus([{ menu_id: 'menu1', count: 2 }]),
    )
    expect(violations).toHaveLength(1)
    expect(violations[0]?.remaining).toBe(1)
  })
})

describe('assertMenuLimitsNotExceeded', () => {
  it('超過時に Error を throw する', () => {
    const eventMenus = [makeEventMenu('menu1', 1)]
    expect(() =>
      assertMenuLimitsNotExceeded(
        eventMenus,
        new Map([['menu1', 1]]),
        countIncrementsFromCartMenus([{ menu_id: 'menu1', count: 1 }]),
      ),
    ).toThrow(/限定食数の上限に達しました/)
  })
})
