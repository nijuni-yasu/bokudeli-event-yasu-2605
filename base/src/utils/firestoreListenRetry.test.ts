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
})
