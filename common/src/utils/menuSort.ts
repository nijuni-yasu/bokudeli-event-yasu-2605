type MenuWithSoldOut = {
  is_sold_out: boolean
}

/** 現在の並び順を保ちながら、売り切れメニューを末尾へ移動する。 */
export function sortMenusWithSoldOutLast<T extends MenuWithSoldOut>(menus: readonly T[]): T[] {
  return [...menus].sort((a, b) => Number(a.is_sold_out) - Number(b.is_sold_out))
}
