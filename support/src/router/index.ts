import { type User, getAuth, onAuthStateChanged } from 'firebase/auth'
import type { Router } from 'vue-router'
import { useConfigStore } from '@shokujii/base/stores/config.js'

/** ログイン不要で表示するパス */
const PUBLIC_PATHS = new Set(['/login', '/pass-code', '/maintenance'])

/** 運営アカウント以外を弾いたときに /login へ渡すクエリ */
export const NOT_SUPPORT_QUERY = { error: 'not_support' } as const

/** Firebase Auth の初回 onAuthStateChanged まで待つ。セッション復元前の currentUser が null のままになるのを避ける。 */
const waitForAuthInitialState = (): Promise<User | null> =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      unsubscribe()
      resolve(user)
    })
  })

export const setupRouter = (router: Router) => {
  let lastUser: User | null = null
  getAuth().onAuthStateChanged((user: User | null) => {
    if (lastUser != null && user == null) {
      router.replace('/login')
    }
    lastUser = user
  })

  // 認証ガードより先に評価する。メンテ中は /login もブロックし未ログインは /maintenance のみ。
  router.beforeEach(async (to) => {
    await waitForAuthInitialState()

    const configStore = useConfigStore()
    const config = await configStore.getResolvedConfig()

    if (to.path === '/maintenance') {
      if (config?.isMaintenanceMode()) {
        return
      }
      return '/'
    }

    if (config?.isMaintenanceMode()) {
      const currentUser = getAuth().currentUser
      if (currentUser != null && config.isSupport(currentUser.uid)) {
        return
      }
      return '/maintenance'
    }
  })

  // 認証 + 運営権限ガード。フロント判定のみに依存せず Firestore Rules の isSupport() と二重で守る。
  router.beforeEach(async (to) => {
    if (to.path === '/maintenance') {
      return
    }

    await waitForAuthInitialState()
    const currentUser = getAuth().currentUser

    if (currentUser == null) {
      if (PUBLIC_PATHS.has(to.path)) {
        return
      }
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    const configStore = useConfigStore()
    const config = await configStore.getResolvedConfig()

    if (config == null || !config.isSupport(currentUser.uid)) {
      await getAuth().signOut()
      if (to.path === '/login') {
        return
      }
      return { path: '/login', query: NOT_SUPPORT_QUERY }
    }

    if (to.path === '/login' || to.path === '/pass-code') {
      const redirect = to.query.redirect
      return typeof redirect === 'string' && !PUBLIC_PATHS.has(redirect) ? redirect : '/'
    }
  })
}
