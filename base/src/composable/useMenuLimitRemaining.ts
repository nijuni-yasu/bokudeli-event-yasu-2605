import { computed, watch } from 'vue'
import { computeRemaining, countOrderedByMenuId } from '@shokujii/common/utils/menuLimit.js'
import { useAppEventStore } from '@shokujii/base/composable/useAppEventStore.js'
import { resolveInjectedCommunityScope } from '@shokujii/base/composable/useAppCommunityStore.js'
import {
  buildEventStoreOptions,
  useEventStore,
  type BokudeliEventMenu,
  type EventStore,
} from '@shokujii/base/stores/event.js'

export type MenuLimitRemainingInfo = {
  limit: number
  ordered: number
  remaining: number
}

/** limit_per_event はイベント全体の注文数で計算するため、enterprise 注文フィルタを外した store を使う */
export function getMenuLimitOrderEventStore(eventId: string): EventStore {
  const enterpriseId = resolveInjectedCommunityScope()?.enterpriseId
  if (enterpriseId != null && enterpriseId !== '') {
    return useEventStore(eventId, {
      ...buildEventStoreOptions(enterpriseId),
      skipOrdersEnterpriseFilter: true,
    })
  }
  return useAppEventStore(eventId)
}

export function useMenuLimitRemaining(eventId: string) {
  const eventStore = getMenuLimitOrderEventStore(eventId)

  const remainingByMenuId = computed(() => {
    const menus = eventStore.menus
    const confirmedOrders = eventStore.confirmedOrders
    if (menus == null || confirmedOrders == null) {
      return null
    }

    const map = new Map<string, MenuLimitRemainingInfo>()
    for (const menu of menus) {
      if (menu.limit_per_event == null) {
        continue
      }
      const ordered = countOrderedByMenuId(confirmedOrders, menu.menu_id)
      const remaining = computeRemaining(menu.limit_per_event, ordered)
      if (remaining == null) {
        continue
      }
      map.set(menu.menu_id, {
        limit: menu.limit_per_event,
        ordered,
        remaining,
      })
    }
    return map
  })

  const getRemainingForMenu = (menu: BokudeliEventMenu): MenuLimitRemainingInfo | null => {
    return remainingByMenuId.value?.get(menu.menu_id) ?? null
  }

  const isMenuLimitSoldOut = (menu: BokudeliEventMenu): boolean => {
    const info = getRemainingForMenu(menu)
    return info != null && info.remaining <= 0
  }

  return {
    remainingByMenuId,
    getRemainingForMenu,
    isMenuLimitSoldOut,
  }
}

export async function waitForConfirmedOrders(eventStore: EventStore) {
  const existing = eventStore.confirmedOrders
  if (existing != null) {
    return existing
  }
  await eventStore.getLoadedEvent()
  const loaded = eventStore.confirmedOrders
  if (loaded != null) {
    return loaded
  }
  return new Promise<NonNullable<EventStore['confirmedOrders']>>((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const stop = watch(
      () => eventStore.confirmedOrders,
      (val) => {
        if (val != null) {
          stop()
          if (timeoutId != null) {
            clearTimeout(timeoutId)
          }
          resolve(val)
        }
      },
      { immediate: true },
    )
    timeoutId = setTimeout(() => {
      stop()
      resolve([])
    }, 10_000)
  })
}

export async function loadMenuLimitRemainingMap(eventId: string): Promise<Map<string, MenuLimitRemainingInfo>> {
  const eventStore = getMenuLimitOrderEventStore(eventId)
  await eventStore.getLoadedMenus()
  const menus = eventStore.menus
  const confirmedOrders = await waitForConfirmedOrders(eventStore)
  const map = new Map<string, MenuLimitRemainingInfo>()
  if (menus == null) {
    return map
  }

  for (const menu of menus) {
    if (menu.limit_per_event == null) {
      continue
    }
    const ordered = countOrderedByMenuId(confirmedOrders, menu.menu_id)
    const remaining = computeRemaining(menu.limit_per_event, ordered)
    if (remaining == null) {
      continue
    }
    map.set(menu.menu_id, {
      limit: menu.limit_per_event,
      ordered,
      remaining,
    })
  }
  return map
}
