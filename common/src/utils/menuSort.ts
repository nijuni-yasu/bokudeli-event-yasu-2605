import { NO_ORDER_PARTICIPATION_MENU_ID } from '../schemas/EventItemType.js'

type MenuWithSoldOut = {
  is_sold_out: boolean
  menu_id?: string
}

/** 在庫あり 0、売り切れ 1、注文なし参加 2。同順位は元の並びを保つ。 */
function menuDisplayRank(menu: MenuWithSoldOut): number {
  if (menu.menu_id === NO_ORDER_PARTICIPATION_MENU_ID) {
    return 2
  }
  return Number(menu.is_sold_out)
}

/** 現在の並び順を保ちながら、売り切れを後方へ、注文なし参加をそのさらに末尾へ移動する。 */
export function sortMenusWithSoldOutLast<T extends MenuWithSoldOut>(menus: readonly T[]): T[] {
  return [...menus].sort((a, b) => menuDisplayRank(a) - menuDisplayRank(b))
}
