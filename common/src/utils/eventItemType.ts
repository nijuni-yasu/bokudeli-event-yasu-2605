import type { EventItemTypeType } from '../schemas/EventItemType.js'
import type { EventMemberOrder } from '../schemas/EventMemberOrder.js'

/** 店舗に発注し、店舗へ支払う品目か（発注情報・主催者請求書の対象判定） */
export function isPartnerSuppliedItem(itemType: EventItemTypeType | undefined): boolean {
  return itemType === undefined || itemType === 'partner_menu'
}

/** イベントページのメニュー一覧に表示する品目か */
export function isMenuItem(itemType: EventItemTypeType): boolean {
  return itemType === 'partner_menu' || itemType === 'organizer_menu'
}

/** カート画面で加算される付加項目か */
export function isTicketItem(itemType: EventItemTypeType): boolean {
  return itemType === 'ticket'
}

/** 店舗発注・請求の対象となる注文のみを抽出する */
export function filterPartnerSuppliedOrders(orders: EventMemberOrder[]): EventMemberOrder[] {
  return orders.filter((order) => isPartnerSuppliedItem(order.item_type))
}
