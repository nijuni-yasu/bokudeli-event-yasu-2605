import type { Transaction } from 'firebase-admin/firestore'
import { NO_ORDER_PARTICIPATION_MENU_ID } from '@shokujii/common/schemas/EventItemType.js'
import type { EventItemTypeType } from '@shokujii/common/schemas/EventItemType.js'
import { isPartnerSuppliedItem } from '@shokujii/common/utils/eventItemType.js'
import { deleteOrder, getMemberOrders } from '../stores/memberOrder.js'
import { createModuleLogger } from './logger.js'

const logger = createModuleLogger('deleteOrderedNoOrderParticipation')

type ConfirmingOrder = {
  id: string
  item_type?: EventItemTypeType
}

type ExistingOrder = {
  id: string
  menu_id: string
  status: string
}

/** 店舗メニューの確定で置き換える、ordered の注文なし参加 ID。読み取りはしない。 */
export function orderedNoOrderIdsToDelete(
  memberOrders: readonly ExistingOrder[],
  confirmingOrders: readonly ConfirmingOrder[],
): string[] {
  if (!confirmingOrders.some((order) => isPartnerSuppliedItem(order.item_type))) {
    return []
  }
  const confirmingIds = new Set(confirmingOrders.map((order) => order.id))
  return memberOrders
    .filter(
      (order) =>
        order.menu_id === NO_ORDER_PARTICIPATION_MENU_ID &&
        order.status === 'ordered' &&
        !confirmingIds.has(order.id),
    )
    .map((order) => order.id)
}

/** Transaction 内の write より前に呼ぶ。確定対象に店舗メニューが無いときは読まない。 */
export async function findOrderedNoOrderParticipationIdsToDelete(
  communityId: string,
  eventId: string,
  userId: string,
  confirmingOrders: readonly ConfirmingOrder[],
  transaction: Transaction,
): Promise<string[]> {
  if (!confirmingOrders.some((order) => isPartnerSuppliedItem(order.item_type))) {
    return []
  }
  const memberOrders = await getMemberOrders(communityId, eventId, userId, transaction)
  return orderedNoOrderIdsToDelete(memberOrders, confirmingOrders)
}

/** 確定の write と同じ Transaction で、注文なし参加ドキュメントを削除する。 */
export async function deleteOrderedNoOrderParticipation(
  communityId: string,
  eventId: string,
  userId: string,
  orderIds: readonly string[],
  transaction: Transaction,
): Promise<void> {
  if (orderIds.length === 0) {
    return
  }
  for (const orderId of orderIds) {
    await deleteOrder(communityId, eventId, userId, orderId, transaction)
  }
  logger.info('注文なし参加を削除', {
    communityId,
    eventId,
    userId,
    orderIds,
  })
}
