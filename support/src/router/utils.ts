import type { RouteLocationRaw } from 'vue-router'

export type PassCodeMode = 'login'

export const getLogin = (): string => '/login'

export const getDashboardLocation = (): RouteLocationRaw => ({ path: '/' })

export const getEventsLocation = (options?: {
  acceptingOrder?: boolean
  applyingReservation?: boolean
}): RouteLocationRaw => {
  const query =
    options?.applyingReservation === true
      ? { status: 'applying_reservation' }
      : options?.acceptingOrder === true
        ? { status: 'accepting_order' }
        : {}
  return { path: '/events', query }
}

export const getCommunitiesLocation = (options?: { pendingApproval?: boolean }): RouteLocationRaw => ({
  path: '/communities',
  query: options?.pendingApproval === true ? { is_approved: 'false' } : {},
})

export const getShopsLocation = (options?: { pendingApproval?: boolean }): RouteLocationRaw => ({
  path: '/shops',
  query: options?.pendingApproval === true ? { is_approved: 'false' } : {},
})

export const getOrdersLocation = (options?: { recentDays?: 7 }): RouteLocationRaw => ({
  path: '/orders',
  query: options?.recentDays === 7 ? { recent: '7' } : {},
})

export const getUsersLocation = (): RouteLocationRaw => ({ path: '/users' })

export const getPassCode = (email: string) => ({
  path: '/pass-code',
  state: { email, mode: 'login' as const },
})

/** catch-all ルートの error パラメータから 3 桁 HTTP ステータスコードを解決する。 */
export const parseErrorCodeFromRoute = (path: string, errorParam: unknown): string | null => {
  if (path === '/404' || path === '/520') {
    return path.slice(1)
  }
  if (errorParam == null || errorParam === '') {
    return null
  }
  const segments = Array.isArray(errorParam) ? errorParam : [errorParam]
  if (segments.length === 0) {
    return null
  }
  const last = segments[segments.length - 1]
  if (typeof last === 'string' && /^\d{3}$/.test(last)) {
    return last
  }
  return '404'
}
