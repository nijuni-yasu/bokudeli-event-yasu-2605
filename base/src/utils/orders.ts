import type { EventMemberOrder } from '@shokujii/common/schemas/EventMemberOrder.js'
import { filterPartnerSuppliedOrders } from '@shokujii/common/utils/eventItemType.js'
import { getOrderMenuGroupKey } from '@shokujii/common/utils/menuOption.js'

export {
  compareEventMemberOrdersForPartnerDetail,
  sortEventMemberOrdersForPartnerDetail,
} from '@shokujii/common/utils/eventMemberOrderSort.js'

export const ordersCount = (orders: EventMemberOrder[]) =>
  filterPartnerSuppliedOrders(orders).filter((o) => o.status === 'ordered').length

export const ordersTotalPrice = (orders: EventMemberOrder[]) =>
  filterPartnerSuppliedOrders(orders)
    .filter((o) => o.status === 'ordered')
    .reduce((sum, o) => sum + o.menu_price, 0)

export interface SubtotalMenu {
  menu_id: string
  name: string
  optionItemNames: string[]
  price: number
  count: number
}

export const getSubtotalsOfOrders = (orders: EventMemberOrder[]): SubtotalMenu[] => {
  const map = new Map<string, SubtotalMenu>()
  for (const o of filterPartnerSuppliedOrders(orders)) {
    const key = getOrderMenuGroupKey(o)
    const existing = map.get(key)
    if (existing) {
      existing.count++
    } else {
      map.set(key, {
        menu_id: o.menu_id,
        name: o.menu_name,
        optionItemNames: o.selected_options?.map((item) => item.item_name) ?? [],
        price: o.menu_price,
        count: 1,
      })
    }
  }
  return Array.from(map.values())
}
