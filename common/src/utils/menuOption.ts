import type { EventMenuOptionType, SelectedOptionType, CartSelectedItemType } from '../schemas/menuOption.js'

export const MENU_OPTION_MIN_TOTAL = 1
export const INVALID_OPTION_SELECTION_MESSAGE = 'オプションの選択が正しくありません'
export const INVALID_MENU_PRICE_MESSAGE = 'メニュー金額が正しくありません'
export const MENU_MIN_TOTAL_INVALID_MESSAGE = '選べる組み合わせの合計が1円未満です'

export type MenuOptionDefinition = Pick<
  EventMenuOptionType,
  'option_id' | 'option_name' | 'selection' | 'required' | 'option_items'
> & { option_description?: string }

export type OrderMenuGroupInput = {
  menu_id: string
  menu_price: number
  selected_options?: SelectedOptionType[]
}

export function formatOrderMenuDisplayName(
  menuName: string,
  selectedOptions?: readonly SelectedOptionType[] | null,
): string {
  if (selectedOptions == null || selectedOptions.length === 0) {
    return menuName
  }
  const itemNames = selectedOptions.map((item) => item.item_name)
  return `${menuName}（${itemNames.join('、')}）`
}

export function computeOptionMinDelta(option: MenuOptionDefinition): number {
  const deltas = option.option_items.map((item) => item.price_delta)
  if (deltas.length === 0) {
    return 0
  }
  const minDelta = Math.min(...deltas)
  if (option.selection === 'single') {
    if (option.required) {
      return minDelta
    }
    return Math.min(0, minDelta)
  }
  return deltas.filter((delta) => delta < 0).reduce((sum, delta) => sum + delta, 0)
}

export function computeMenuMinTotal(menuPrice: number, options: readonly MenuOptionDefinition[]): number {
  return menuPrice + options.reduce((sum, option) => sum + computeOptionMinDelta(option), 0)
}

export function isMenuMinTotalValid(menuPrice: number, options: readonly MenuOptionDefinition[]): boolean {
  return computeMenuMinTotal(menuPrice, options) >= MENU_OPTION_MIN_TOTAL
}

export function getSelectedOptionsForGroupKey(
  selectedOptions?: readonly SelectedOptionType[] | null,
): SelectedOptionType[] {
  if (selectedOptions == null || selectedOptions.length === 0) {
    return []
  }
  return [...selectedOptions].sort((a, b) => {
    if (a.option_id === b.option_id) {
      return a.item_id > b.item_id ? 1 : a.item_id < b.item_id ? -1 : 0
    }
    return a.option_id > b.option_id ? 1 : -1
  })
}

export function getOrderMenuGroupKey(order: OrderMenuGroupInput): string {
  const selected = getSelectedOptionsForGroupKey(order.selected_options)
  const selectedPart = JSON.stringify(selected.map((item) => [item.option_id, item.item_id]))
  return `${order.menu_id}\u0000${selectedPart}\u0000${order.menu_price}`
}

export function getStripeLineItemGroupKey(order: OrderMenuGroupInput, selfPayUnitAmount: number): string {
  return `${getOrderMenuGroupKey(order)}\u0000${selfPayUnitAmount}`
}

export function sumSelectedPriceDelta(selectedOptions: readonly SelectedOptionType[]): number {
  return selectedOptions.reduce((sum, item) => sum + item.price_delta, 0)
}

export type MenuPriceSplit = {
  basePrice: number
  optionPrice: number
}

/** 注文に保存された込み単価を、当時の本体とオプション差額合計に分ける。選択が無いときはオプション 0。 */
export function splitMenuPrice(
  menuPrice: number,
  selectedOptions?: readonly SelectedOptionType[] | null,
): MenuPriceSplit {
  const optionPrice = sumSelectedPriceDelta(selectedOptions ?? [])
  return { basePrice: menuPrice - optionPrice, optionPrice }
}

export type MenuPriceLine = {
  name: string
  amount: number
}

/** 選択があるとき、メニュー本体と各項目の金額行を定義順で返す。選択が無いときは空。 */
export function buildMenuPriceLines(
  menuName: string,
  menuPrice: number,
  selectedOptions?: readonly SelectedOptionType[] | null,
): MenuPriceLine[] {
  if (selectedOptions == null || selectedOptions.length === 0) {
    return []
  }
  const split = splitMenuPrice(menuPrice, selectedOptions)
  return [
    { name: menuName, amount: split.basePrice },
    ...selectedOptions.map((item) => ({ name: item.item_name, amount: item.price_delta })),
  ]
}

export function buildSelectedOptionsInDefinitionOrder(
  optionDefs: readonly MenuOptionDefinition[],
  selectedItems: readonly CartSelectedItemType[],
): SelectedOptionType[] {
  const selected = new Set(selectedItems.map((item) => `${item.option_id}\u0000${item.item_id}`))
  const result: SelectedOptionType[] = []
  for (const option of optionDefs) {
    for (const item of option.option_items) {
      if (selected.has(`${option.option_id}\u0000${item.item_id}`)) {
        result.push({
          option_id: option.option_id,
          option_name: option.option_name,
          item_id: item.item_id,
          item_name: item.name,
          price_delta: item.price_delta,
        })
      }
    }
  }
  return result
}

export type CartOptionValidationResult =
  | { ok: true; selected_options: SelectedOptionType[]; price_delta: number }
  | { ok: false; reason: string }

export function validateCartOptionSelection(
  optionDefs: readonly MenuOptionDefinition[],
  selectedItems: readonly CartSelectedItemType[],
): CartOptionValidationResult {
  const optionById = new Map(optionDefs.map((option) => [option.option_id, option]))
  for (const selected of selectedItems) {
    const option = optionById.get(selected.option_id)
    if (option == null) {
      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
    }
    if (!option.option_items.some((item) => item.item_id === selected.item_id)) {
      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
    }
  }

  for (const option of optionDefs) {
    const chosen = selectedItems.filter((item) => item.option_id === option.option_id)
    const uniqueItemIds = new Set(chosen.map((item) => item.item_id))
    if (uniqueItemIds.size !== chosen.length) {
      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
    }
    if (option.selection === 'single' && chosen.length > 1) {
      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
    }
    if (option.required && chosen.length === 0) {
      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
    }
  }

  const selected_options = buildSelectedOptionsInDefinitionOrder(optionDefs, selectedItems)
  return { ok: true, selected_options, price_delta: sumSelectedPriceDelta(selected_options) }
}

export function computeOrderMenuPrice(basePrice: number, selectedOptions: readonly SelectedOptionType[]): number {
  return basePrice + sumSelectedPriceDelta(selectedOptions)
}

export const NAMES_PRINT_MAX_MENU_LABEL_LENGTH = 28

export function formatSelectedOptionItemNames(selectedOptions?: readonly SelectedOptionType[] | null): string {
  if (selectedOptions == null || selectedOptions.length === 0) {
    return ''
  }
  return selectedOptions.map((item) => item.item_name).join('、')
}

export function formatNamesPrintMenuLabel(
  menuName: string,
  selectedOptions?: readonly SelectedOptionType[] | null,
  maxLength = NAMES_PRINT_MAX_MENU_LABEL_LENGTH,
): string {
  const normalizedName = menuName.normalize('NFKC')
  if (normalizedName.length >= maxLength) {
    return normalizedName.slice(0, maxLength)
  }
  if (selectedOptions == null || selectedOptions.length === 0) {
    return normalizedName
  }
  const prefix = `${normalizedName}（`
  const suffix = '）'
  const remaining = maxLength - prefix.length - suffix.length
  if (remaining < 1) {
    return normalizedName
  }
  const itemPart = formatSelectedOptionItemNames(selectedOptions)
  if (itemPart.length <= remaining) {
    return `${prefix}${itemPart}${suffix}`
  }
  const ellipsis = '…'
  const keep = Math.max(0, remaining - ellipsis.length)
  return `${prefix}${itemPart.slice(0, keep)}${ellipsis}${suffix}`
}

export { hasDuplicateOptionItemNames } from '../schemas/menuOption.js'

function isCartSelectedItem(value: unknown): value is CartSelectedItemType {
  if (typeof value !== 'object' || value == null) {
    return false
  }
  if (!('option_id' in value) || !('item_id' in value)) {
    return false
  }
  return (
    typeof value.option_id === 'string' &&
    value.option_id.length > 0 &&
    typeof value.item_id === 'string' &&
    value.item_id.length > 0
  )
}

function isCartSelectedItemList(value: unknown): value is CartSelectedItemType[] {
  return Array.isArray(value) && value.every(isCartSelectedItem)
}

export type ResolveEventMenuCartOrderInput = {
  eventMenu: {
    menu_id: string
    menu_name: string
    menu_price: number
    is_selected?: boolean
    options?: readonly MenuOptionDefinition[] | null
  }
  selectedItems?: unknown
  presentedMenuPrice?: number
}

export type ResolveEventMenuCartOrderResult =
  | { ok: true; selected_options: SelectedOptionType[]; menu_price: number }
  | { ok: false; httpsCode: 'invalid-argument' | 'failed-precondition'; reason: string }

export function resolveEventMenuCartOrder(input: ResolveEventMenuCartOrderInput): ResolveEventMenuCartOrderResult {
  const optionDefs = input.eventMenu.options ?? []
  const rawSelected = input.selectedItems ?? []
  if (!isCartSelectedItemList(rawSelected)) {
    return { ok: false, httpsCode: 'invalid-argument', reason: INVALID_OPTION_SELECTION_MESSAGE }
  }
  const selectedItems = rawSelected
  if (optionDefs.length === 0 && selectedItems.length > 0) {
    return { ok: false, httpsCode: 'invalid-argument', reason: INVALID_OPTION_SELECTION_MESSAGE }
  }
  const validation = validateCartOptionSelection(optionDefs, selectedItems)
  if (!validation.ok) {
    return { ok: false, httpsCode: 'invalid-argument', reason: validation.reason }
  }
  const menu_price = computeOrderMenuPrice(input.eventMenu.menu_price, validation.selected_options)
  const isAttendanceOnlyMenu = input.eventMenu.menu_price === 0 && menu_price === 0
  if (menu_price < MENU_OPTION_MIN_TOTAL && !isAttendanceOnlyMenu) {
    return { ok: false, httpsCode: 'invalid-argument', reason: INVALID_MENU_PRICE_MESSAGE }
  }
  if (input.presentedMenuPrice != null && input.presentedMenuPrice !== menu_price) {
    return { ok: false, httpsCode: 'failed-precondition', reason: INVALID_MENU_PRICE_MESSAGE }
  }
  return { ok: true, selected_options: validation.selected_options, menu_price }
}

export function findMissingOptionIds(optionIds: readonly string[], options: readonly MenuOptionDefinition[]): string[] {
  const optionIdSet = new Set(options.map((option) => option.option_id))
  return optionIds.filter((optionId) => !optionIdSet.has(optionId))
}

export function snapshotPartnerOptionsForMenu(
  optionIds: readonly string[],
  options: readonly MenuOptionDefinition[],
): EventMenuOptionType[] | null {
  const optionById = new Map(options.map((option) => [option.option_id, option]))
  if (findMissingOptionIds(optionIds, options).length > 0) {
    return null
  }
  return optionIds.flatMap((optionId) => {
    const option = optionById.get(optionId)
    if (option == null) {
      return []
    }
    return [
      {
        option_id: option.option_id,
        option_name: option.option_name,
        ...(option.option_description != null && option.option_description !== ''
          ? { option_description: option.option_description }
          : {}),
        selection: option.selection,
        required: option.required,
        option_items: option.option_items.map((item) => ({ ...item })),
      },
    ]
  })
}
