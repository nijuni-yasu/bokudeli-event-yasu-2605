import { HttpsError } from 'firebase-functions/https'
import type { Transaction } from 'firebase-admin/firestore'
import { EventMenu } from '@shokujii/common/schemas/EventMenu.js'
import type { EventMemberOrder } from '@shokujii/common/schemas/EventMemberOrder.js'
import {
  assertMenuLimitsNotExceeded,
  countIncrementsByMenuId,
  countIncrementsFromCartMenus,
} from '@shokujii/common/utils/menuLimit.js'
import { countOrderedMenus } from '../stores/memberOrder.js'

function findEventMenu(eventMenus: EventMenu[], menuId: string): EventMenu | undefined {
  return eventMenus.find((menu) => menu.menu_id === menuId || menu.id === menuId)
}

function getLimitedMenuIds(eventMenus: EventMenu[], menuIds: readonly string[]): string[] {
  return [...new Set(menuIds)].filter((menuId) => findEventMenu(eventMenus, menuId)?.limit_per_event != null)
}

export async function assertMenuLimitsForCartAdd(params: {
  eventId: string
  eventMenus: EventMenu[]
  menus: readonly { menu_id: string; count: number }[]
  transaction?: Transaction
}): Promise<void> {
  const { eventId, eventMenus, menus, transaction } = params
  const increments = countIncrementsFromCartMenus(menus)
  const limitedMenuIds = getLimitedMenuIds(eventMenus, [...increments.keys()])
  if (limitedMenuIds.length === 0) {
    return
  }

  const orderedCounts = await countOrderedMenus(eventId, limitedMenuIds, transaction)
  try {
    assertMenuLimitsNotExceeded(eventMenus, orderedCounts, increments)
  } catch (error) {
    const message = error instanceof Error ? error.message : '限定食数の上限に達しました'
    throw new HttpsError('failed-precondition', message)
  }
}

export async function assertMenuLimitsForConfirm(params: {
  eventId: string
  eventMenus: EventMenu[]
  orders: readonly EventMemberOrder[]
  transaction?: Transaction
}): Promise<void> {
  const { eventId, eventMenus, orders, transaction } = params
  const increments = countIncrementsByMenuId(orders.map((order) => order.menu_id))
  const limitedMenuIds = getLimitedMenuIds(eventMenus, [...increments.keys()])
  if (limitedMenuIds.length === 0) {
    return
  }

  const orderedCounts = await countOrderedMenus(eventId, limitedMenuIds, transaction)
  try {
    assertMenuLimitsNotExceeded(eventMenus, orderedCounts, increments)
  } catch (error) {
    const message = error instanceof Error ? error.message : '限定食数の上限に達しました'
    throw new HttpsError('failed-precondition', message)
  }
}
