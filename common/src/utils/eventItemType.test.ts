import { describe, expect, it } from 'vitest'
import { EventMemberOrder } from '../schemas/EventMemberOrder.js'
import { filterPartnerSuppliedOrders, isMenuItem, isPartnerSuppliedItem, isTicketItem } from './eventItemType.js'

describe('eventItemType', () => {
  it('isPartnerSuppliedItem は partner_menu のみ true', () => {
    expect(isPartnerSuppliedItem('partner_menu')).toBe(true)
    expect(isPartnerSuppliedItem(undefined)).toBe(true)
    expect(isPartnerSuppliedItem('organizer_menu')).toBe(false)
    expect(isPartnerSuppliedItem('ticket')).toBe(false)
  })

  it('isMenuItem は partner_menu と organizer_menu が true', () => {
    expect(isMenuItem('partner_menu')).toBe(true)
    expect(isMenuItem('organizer_menu')).toBe(true)
    expect(isMenuItem('ticket')).toBe(false)
  })

  it('isTicketItem は ticket のみ true', () => {
    expect(isTicketItem('ticket')).toBe(true)
    expect(isTicketItem('partner_menu')).toBe(false)
  })

  it('filterPartnerSuppliedOrders は partner_menu のみ残す', () => {
    const orders = [
      new EventMemberOrder('o1', {
        order_id: 'o1',
        user_id: 'u1',
        event_id: 'e1',
        community_id: 'c1',
        menu_id: 'm1',
        menu_name: 'A',
        menu_price: 100,
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
    const filtered = filterPartnerSuppliedOrders(orders)
    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.menu_id).toBe('m1')
  })
})
