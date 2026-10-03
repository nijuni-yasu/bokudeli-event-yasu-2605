import { getAuth } from 'firebase/auth'
import { isWithinOrderDeadline } from '@shokujii/common/utils/orderDeadline.js'
import { buildEventStoreOptions, useEventStore, type EventStoreOptions } from '@shokujii/base/stores/event'
import { loadMenuLimitRemainingMap } from '@shokujii/base/composable/useMenuLimitRemaining.js'

export type ProfileGap = 'name' | 'image' | 'email'
export type CartOrderBlockReason = 'deadline' | 'limitPeople' | 'unselectedMenu' | 'soldOutMenu' | 'menuLimitMenu'

export const PROFILE_GAP_MESSAGE_KEY: Record<ProfileGap, string> = {
  name: 'cart.doesnt_exists_user_name',
  image: 'cart.doesnt_exists_user_image',
  email: 'cart.doesnt_exists_user_email',
}

export const CART_BLOCK_MESSAGE_KEY: Record<CartOrderBlockReason, string> = {
  deadline: 'cart.cannot_order_deadline',
  limitPeople: 'cart.cannot_order_limit_people',
  unselectedMenu: 'cart.cannot_order_unselected_menu',
  soldOutMenu: 'cart.cannot_order_sold_out',
  menuLimitMenu: 'cart.cannot_order_menu_limit',
}

type ProfileUser = {
  user_name?: string | null
  user_image_url?: string | null
}

type ProfilePersonalInformation = {
  user_email?: string | null
}

type CartOrderTarget = {
  event: {
    event_id: string
    event_deadline_datetime: number
    event_max_people: number
  }
  orders: { menu_id: string }[]
}

export function findProfileGap(
  user: ProfileUser | null | undefined,
  personalInformation: ProfilePersonalInformation | null | undefined,
): ProfileGap | null {
  if (user?.user_name == null || user.user_name === '') {
    return 'name'
  }
  if (user.user_image_url == null || user.user_image_url === '') {
    return 'image'
  }
  if (personalInformation?.user_email == null || personalInformation.user_email === '') {
    return 'email'
  }
  return null
}

export async function resolveCartEventStoreOptions(): Promise<EventStoreOptions> {
  const auth = getAuth()
  const user = auth.currentUser
  if (user == null) {
    return {}
  }
  try {
    const token = await user.getIdTokenResult()
    const enterpriseId = token.claims.enterprise_id
    return buildEventStoreOptions(typeof enterpriseId === 'string' ? enterpriseId : undefined)
  } catch {
    return {}
  }
}

/** 通常の注文確定前と同じ確認。フォーム付き注文でもカートを出る前と回答送信前に使う。 */
export async function findCartOrderBlock(cartItem: CartOrderTarget): Promise<CartOrderBlockReason | null> {
  const { event, orders } = cartItem
  if (!isWithinOrderDeadline(event.event_deadline_datetime)) {
    return 'deadline'
  }

  const eventStoreOptions = await resolveCartEventStoreOptions()
  const eventStore = useEventStore(event.event_id, eventStoreOptions)
  const members = await eventStore.getLoadedMembers()
  if (members.length >= event.event_max_people) {
    return 'limitPeople'
  }

  const eventMenus = await eventStore.getLoadedMenus()
  const menuIds = new Set(orders.map((order) => order.menu_id))
  for (const menuId of menuIds) {
    const eventMenu = eventMenus.find((menu) => menu.id === menuId)
    if (eventMenu == null || !eventMenu.is_selected) {
      return 'unselectedMenu'
    }
    if (eventMenu.is_sold_out) {
      return 'soldOutMenu'
    }
  }

  const limitMap = await loadMenuLimitRemainingMap(event.event_id, eventStoreOptions)
  if (limitMap != null && limitMap.size > 0) {
    const menuCounts = new Map<string, number>()
    for (const order of orders) {
      menuCounts.set(order.menu_id, (menuCounts.get(order.menu_id) ?? 0) + 1)
    }
    for (const [menuId, cartCount] of menuCounts) {
      const limitInfo = limitMap.get(menuId)
      if (limitInfo == null) {
        continue
      }
      if (cartCount > limitInfo.remaining) {
        return 'menuLimitMenu'
      }
    }
  }

  return null
}
