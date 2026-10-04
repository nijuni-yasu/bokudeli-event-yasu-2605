import type { RouteLocationNormalizedLoaded } from 'vue-router'

const STORAGE_KEY = 'pstack_verification_run_id'

/** pstack / 検証用受け口で OTP 記録を分離する run ID（query → state → sessionStorage） */
export const getVerificationRunId = (route: RouteLocationNormalizedLoaded): string | undefined => {
  const fromQuery = route.query.verification_run_id
  if (typeof fromQuery === 'string' && fromQuery !== '') {
    try {
      sessionStorage.setItem(STORAGE_KEY, fromQuery)
    } catch {
      // sessionStorage 不可時は query のみ
    }
    return fromQuery
  }
  const fromState = history.state?.verification_run_id
  if (typeof fromState === 'string' && fromState !== '') {
    return fromState
  }
  try {
    const fromStorage = sessionStorage.getItem(STORAGE_KEY)
    return fromStorage != null && fromStorage !== '' ? fromStorage : undefined
  } catch {
    return undefined
  }
}

export const verificationRunIdForRequest = (route: RouteLocationNormalizedLoaded): { verification_run_id?: string } => {
  const verificationRunId = getVerificationRunId(route)
  return verificationRunId != null ? { verification_run_id: verificationRunId } : {}
}
