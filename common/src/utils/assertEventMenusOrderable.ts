import { EventMenu } from '../schemas/EventMenu.js'

const SOLD_OUT_MENU_ERROR_MESSAGE = '売り切れのメニューが含まれています'

function findEventMenu(eventMenus: EventMenu[], menuId: string): EventMenu | undefined {
  return eventMenus.find((m) => m.menu_id === menuId || m.id === menuId)
}

/**
 * 注文対象 menu_id のうち、is_selected かつ !is_sold_out を満たさない ID を返す（addToCart 用）。
 */
export function findUnorderableMenuIds(eventMenus: EventMenu[], menuIds: readonly string[]): string[] {
  const uniqueMenuIds = [...new Set(menuIds)]
  return uniqueMenuIds.filter((menuId) => {
    const eventMenu = findEventMenu(eventMenus, menuId)
    if (eventMenu == null || !eventMenu.is_selected || eventMenu.is_sold_out) {
      return true
    }
    return false
  })
}

/**
 * 売り切れになっている menu_id を返す（confirmOrder / Stripe 用）。
 */
export function findSoldOutMenuIds(eventMenus: EventMenu[], menuIds: readonly string[]): string[] {
  const uniqueMenuIds = [...new Set(menuIds)]
  return uniqueMenuIds.filter((menuId) => findEventMenu(eventMenus, menuId)?.is_sold_out === true)
}

/**
 * 売り切れメニューが含まれる場合に Error を throw する（Callable 側で HttpsError に変換する）。
 */
export function assertNoSoldOutMenus(eventMenus: EventMenu[], menuIds: readonly string[]): void {
  if (findSoldOutMenuIds(eventMenus, menuIds).length > 0) {
    throw new Error(SOLD_OUT_MENU_ERROR_MESSAGE)
  }
}

export { SOLD_OUT_MENU_ERROR_MESSAGE }
