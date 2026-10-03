import { FirebaseError } from 'firebase/app'
import type { Unsubscribe } from 'firebase/firestore'

const RETRYABLE_FIRESTORE_CODES = new Set([
  'unavailable',
  'deadline-exceeded',
  'resource-exhausted',
  'aborted',
  'cancelled',
  'internal',
  'unknown',
])

/** 一時的な Firestore 購読失敗だけ張り直す。権限不足などは対象外。 */
export const isRetryableFirestoreError = (err: unknown): boolean => {
  if (!(err instanceof FirebaseError)) {
    return false
  }
  const slash = err.code.lastIndexOf('/')
  const code = slash === -1 ? err.code : err.code.slice(slash + 1)
  return RETRYABLE_FIRESTORE_CODES.has(code)
}

export type FirestoreListenHandlers = {
  onError: (err: unknown) => void
}

export type FirestoreListenRetry = {
  /** 未購読かつリトライ待ちでなければ購読を開始する */
  ensure: () => void
  stop: () => void
  /** スナップショットを受け取れたらバックオフを戻す */
  markHealthy: () => void
}

export type FirestoreListenRetryOptions = {
  /** 待ち時間は min(失敗回数, maxBackoffSteps) * baseDelayMs。リトライ可能な失敗は打ち切らない */
  maxBackoffSteps?: number
  baseDelayMs?: number
  onError?: (err: unknown) => void
  /** リトライしないエラー（権限不足など） */
  onGiveUp?: (err: unknown) => void
}

const DEFAULT_MAX_BACKOFF_STEPS = 5
const DEFAULT_BASE_DELAY_MS = 1000

/**
 * onSnapshot が失敗したとき購読を張り直す。
 * computed 内で購読を外したまま再評価されない、という取りこぼしを避ける。
 */
export const createFirestoreListenRetry = (
  listen: (handlers: FirestoreListenHandlers) => Unsubscribe,
  options: FirestoreListenRetryOptions = {},
): FirestoreListenRetry => {
  const maxBackoffSteps = options.maxBackoffSteps ?? DEFAULT_MAX_BACKOFF_STEPS
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS
  let unsubscribe: Unsubscribe | null = null
  let timer: ReturnType<typeof setTimeout> | null = null
  let failureCount = 0
  let stopped = false
  let gaveUp = false

  const clearTimer = () => {
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
  }

  const begin = () => {
    if (stopped || gaveUp || unsubscribe != null || timer != null) {
      return
    }
    // onError が listen() の戻り値代入より先に同期実行されることがある
    let started: Unsubscribe | null = null
    let failed = false
    const releaseStarted = () => {
      const current = unsubscribe ?? started
      unsubscribe = null
      started = null
      current?.()
    }
    started = listen({
      onError: (err: unknown) => {
        if (failed) {
          return
        }
        failed = true
        releaseStarted()
        try {
          options.onError?.(err)
        } catch (callbackErr) {
          console.error('firestore listen onError callback failed', callbackErr)
        }
        if (stopped || gaveUp) {
          return
        }
        if (!isRetryableFirestoreError(err)) {
          gaveUp = true
          try {
            options.onGiveUp?.(err)
          } catch (callbackErr) {
            console.error('firestore listen onGiveUp callback failed', callbackErr)
          }
          return
        }
        failureCount += 1
        const steps = Math.min(failureCount, maxBackoffSteps)
        clearTimer()
        timer = setTimeout(() => {
          timer = null
          begin()
        }, baseDelayMs * steps)
      },
    })
    if (failed) {
      // 同期エラー時は listen の戻り値を購読中として残さない
      releaseStarted()
      return
    }
    unsubscribe = started
  }

  return {
    ensure: () => {
      stopped = false
      if (gaveUp || unsubscribe != null || timer != null) {
        return
      }
      begin()
    },
    stop: () => {
      stopped = true
      gaveUp = false
      failureCount = 0
      clearTimer()
      const current = unsubscribe
      unsubscribe = null
      current?.()
    },
    markHealthy: () => {
      failureCount = 0
      gaveUp = false
    },
  }
}
