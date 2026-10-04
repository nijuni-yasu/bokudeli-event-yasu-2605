import type { SelectedOptionType } from '@shokujii/common/schemas/menuOption.js'
import { formatOrderMenuDisplayName, getOrderMenuGroupKey } from '@shokujii/common/utils/menuOption.js'

export type GroupableMemberOrder = {
  status: string
  menu_id: string
  menu_name: string
  menu_price: number
  selected_options?: SelectedOptionType[]
}

export type OrderedMenuGroup = {
  name: string
  count: number
}

/** 確定済み注文を、メニューとオプションの組み合わせごとに数える */
export function groupOrderedMenus(orders: readonly GroupableMemberOrder[]): [string, OrderedMenuGroup][] {
  const map: Record<string, OrderedMenuGroup> = {}
  for (const order of orders) {
    if (order.status !== 'ordered') continue
    const key = getOrderMenuGroupKey(order)
    const current = map[key]
    if (current == null) {
      map[key] = {
        name: formatOrderMenuDisplayName(order.menu_name, order.selected_options),
        count: 1,
      }
    } else {
      current.count += 1
    }
  }
  return Object.entries(map)
}
