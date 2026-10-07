import { FirebaseError } from 'firebase/app'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFirestoreListenRetry, isRetryableFirestoreError } from '@shokujii/base/utils/firestoreListenRetry.js'

describe('isRetryableFirestoreError', () => {
  it('一時的な Firestore エラーだけ true', () => {
    expect(isRetryableFirestoreError(new FirebaseError('unavailable', 'down'))).toBe(true)
    expect(isRetryableFirestoreError(new FirebaseError('firestore/resource-exhausted', 'too many'))).toBe(true)
    expect(isRetryableFirestoreError(new FirebaseError('permission-denied', 'no'))).toBe(false)
    expect(isRetryableFirestoreError(new Error('plain'))).toBe(false)
  })
})

describe('createFirestoreListenRetry', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('リトライ可能な失敗はバックオフ後に購読を張り直す', () => {
    vi.useFakeTimers()
    const unsubscribers = [vi.fn(), vi.fn()]
    let attempt = 0
    const listen = vi.fn((handlers: { onError: (err: unknown) => void }) => {
      attempt += 1
      if (attempt === 1) {
        handlers.onError(new FirebaseError('unavailable', 'down'))
      }
      return unsubscribers[attempt - 1] ?? vi.fn()
    })

    const retry = createFirestoreListenRetry(listen, { baseDelayMs: 1000, maxBackoffSteps: 5 })
    retry.ensure()

    expect(listen).toHaveBeenCalledTimes(1)
    expect(unsubscribers[0]).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(999)
    expect(listen).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1)
    expect(listen).toHaveBeenCalledTimes(2)
  })

  it('権限エラーでは張り直さない', () => {
    vi.useFakeTimers()
    const onGiveUp = vi.fn()
    const listen = vi.fn((handlers: { onError: (err: unknown) => void }) => {
      handlers.onError(new FirebaseError('permission-denied', 'no'))
      return vi.fn()
    })

    const retry = createFirestoreListenRetry(listen, { baseDelayMs: 1000, onGiveUp })
    retry.ensure()
    vi.advanceTimersByTime(10_000)

    expect(listen).toHaveBeenCalledTimes(1)
    expect(onGiveUp).toHaveBeenCalledTimes(1)
    retry.ensure()
    expect(listen).toHaveBeenCalledTimes(1)
  })

  it('stop すると待ち中の再購読をしない', () => {
    vi.useFakeTimers()
    const listen = vi.fn((handlers: { onError: (err: unknown) => void }) => {
      handlers.onError(new FirebaseError('unavailable', 'down'))
      return vi.fn()
    })

    const retry = createFirestoreListenRetry(listen, { baseDelayMs: 1000 })
    retry.ensure()
    retry.stop()
    vi.advanceTimersByTime(5000)

    expect(listen).toHaveBeenCalledTimes(1)
  })

  it('スナップショットが来ない購読は無応答の待ち時間後に張り直す', () => {
    vi.useFakeTimers()
    const unsubscribe = vi.fn()
    const listen = vi.fn(() => unsubscribe)

    const retry = createFirestoreListenRetry(listen, { silenceTimeoutMs: 8000, baseDelayMs: 1000 })
    retry.ensure()
    expect(listen).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(7999)
    expect(listen).toHaveBeenCalledTimes(1)
    expect(unsubscribe).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(unsubscribe).toHaveBeenCalledTimes(1)
    expect(listen).toHaveBeenCalledTimes(2)
  })

  it('無応答で張り直したあとの古いエラーは新しい購読を外さない', () => {
    vi.useFakeTimers()
    const handlers: Array<{ onError: (err: unknown) => void }> = []
    const listen = vi.fn((handlersForListen: { onError: (err: unknown) => void }) => {
      handlers.push(handlersForListen)
      return vi.fn()
    })

    const retry = createFirestoreListenRetry(listen, { silenceTimeoutMs: 8000, baseDelayMs: 1000 })
    retry.ensure()
    vi.advanceTimersByTime(8000)
    expect(listen).toHaveBeenCalledTimes(2)

    handlers[0]?.onError(new FirebaseError('cancelled', 'cancelled'))
    vi.advanceTimersByTime(10_000)
    expect(listen).toHaveBeenCalledTimes(2)
  })

  it('スナップショットを受け取ったら無応答では張り直さない', () => {
    vi.useFakeTimers()
    const listen = vi.fn(() => vi.fn())
    const retry = createFirestoreListenRetry(listen, { silenceTimeoutMs: 8000, baseDelayMs: 1000 })
    retry.ensure()
    retry.markHealthy()
    vi.advanceTimersByTime(40_000)
    expect(listen).toHaveBeenCalledTimes(1)
  })
})
