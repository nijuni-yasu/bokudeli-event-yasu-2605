export type AddToCartMenuRequest = {
  menu_id: string
  count: number
  selected_items?: { option_id: string; item_id: string }[]
  presented_menu_price?: number
}

export type AddToCartRequest = {
  community_id: string
  event_id: string
  menus: AddToCartMenuRequest[]
}
export type AddToCartResponse = void

export type RemoveFromCartRequest = {
  community_id: string
  event_id: string
  order_id: string
}

export type ConfirmOrderRequest = {
  community_id: string
  event_id: string
  order_ids: string[]
}

export type ConfirmOrderResponse = {
  subsidy_recalculated?: boolean
}
