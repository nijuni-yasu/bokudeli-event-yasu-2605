export type PassCodeMode = 'login'

export const getLogin = () => '/login'

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
