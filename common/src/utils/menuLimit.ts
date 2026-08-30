import { EventMenu } from '../schemas/EventMenu.js'
import type { EventMemberOrder } from '../schemas/EventMemberOrder.js'

export const MENU_LIMIT_EXCEEDED_MESSAGE = '限定食数の上限に達しました'

/** PartnerMenu / EventMenu の limit_per_event 上限 */
export const MENU_LIMIT_PER_EVENT_MAX = 1000

function findEventMenu(eventMenus: EventMenu[], menuId: string): EventMenu | undefined {
  return eventMenus.find((m) => m.menu_id === menuId || m.id === menuId)
}

export function countOrderedByMenuId(orders: readonly EventMemberOrder[], menuId: string): number {
  return orders.filter((order) => order.status === 'ordered' && order.menu_id === menuId).length
}

export function computeRemaining(limit: number | null | undefined, orderedCount: number): number | null {
  if (limit == null) {
    return null
  }
  return Math.max(0, limit - orderedCount)
}

export interface MenuLimitViolation {
  menuId: string
  menuName: string
  limit: number
  orderedCount: number
  incrementCount: number
  remaining: number
}

export function findMenuLimitViolations(
  eventMenus: EventMenu[],
  orderedCountsByMenu: ReadonlyMap<string, number>,
  incrementsByMenu: ReadonlyMap<string, number>,
): MenuLimitViolation[] {
  const violations: MenuLimitViolation[] = []

  for (const [menuId, incrementCount] of incrementsByMenu) {
    if (incrementCount <= 0) {
      continue
    }
    const eventMenu = findEventMenu(eventMenus, menuId)
    if (eventMenu?.limit_per_event == null) {
      continue
    }
    const orderedCount = orderedCountsByMenu.get(menuId) ?? 0
    const remaining = computeRemaining(eventMenu.limit_per_event, orderedCount)
    if (remaining == null || incrementCount <= remaining) {
      continue
    }
    violations.push({
      menuId,
      menuName: eventMenu.menu_name,
      limit: eventMenu.limit_per_event,
      orderedCount,
      incrementCount,
      remaining,
    })
  }

  return violations
}

export function formatMenuLimitExceededMessage(violations: MenuLimitViolation[]): string {
  if (violations.length === 0) {
    return MENU_LIMIT_EXCEEDED_MESSAGE
  }
  const details = violations.map((violation) => `${violation.menuName}（残り${violation.remaining}食）`).join('、')
  return `${MENU_LIMIT_EXCEEDED_MESSAGE}: ${details}`
}

export function assertMenuLimitsNotExceeded(
  eventMenus: EventMenu[],
  orderedCountsByMenu: ReadonlyMap<string, number>,
  incrementsByMenu: ReadonlyMap<string, number>,
): void {
  const violations = findMenuLimitViolations(eventMenus, orderedCountsByMenu, incrementsByMenu)
  if (violations.length > 0) {
    throw new Error(formatMenuLimitExceededMessage(violations))
  }
}

export function countIncrementsByMenuId(menuIds: readonly string[]): Map<string, number> {
  const increments = new Map<string, number>()
  for (const menuId of menuIds) {
    increments.set(menuId, (increments.get(menuId) ?? 0) + 1)
  }
  return increments
}

export function countIncrementsFromCartMenus(
  menus: readonly { menu_id: string; count: number }[],
): Map<string, number> {
  const increments = new Map<string, number>()
  for (const menu of menus) {
    increments.set(menu.menu_id, (increments.get(menu.menu_id) ?? 0) + menu.count)
  }
  return increments
}
