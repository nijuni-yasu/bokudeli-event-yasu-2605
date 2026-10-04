import { NO_ORDER_PARTICIPATION_MENU_ID } from '@shokujii/common/schemas/EventItemType.js'
import type { EventItemTypeType } from '@shokujii/common/schemas/EventItemType.js'
import { isPartnerSuppliedItem } from '@shokujii/common/utils/eventItemType.js'

type CartMenuLine = {
  menu_id: string
  count: number
}

type CartMenuMaster = {
  id: string
  item_type?: EventItemTypeType
}

type InCartOrder = {
  menu_id: string
  order_id: string
}

/** 店舗メニューをカートへ入れるとき、同じ Transaction で消す in_cart の注文なし参加 ID。 */
export function inCartNoOrderIdsToReplace(
  menus: readonly CartMenuLine[],
  eventMenus: readonly CartMenuMaster[],
  existingCartOrders: readonly InCartOrder[],
): string[] {
  const partnerUnits = menus.reduce((sum, menu) => {
    const eventMenu = eventMenus.find((candidate) => candidate.id === menu.menu_id)
    if (eventMenu == null || !isPartnerSuppliedItem(eventMenu.item_type)) {
      return sum
    }
    return sum + menu.count
  }, 0)
  if (!(partnerUnits > 0)) {
    return []
  }
  return existingCartOrders
    .filter((order) => order.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
    .map((order) => order.order_id)
}
