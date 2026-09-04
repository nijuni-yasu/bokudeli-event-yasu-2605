export type PassCodeMode = 'login'

export const getLogin = () => '/login'

export const getPassCode = (email: string) => ({
  path: '/pass-code',
  state: { email, mode: 'login' as const },
})
