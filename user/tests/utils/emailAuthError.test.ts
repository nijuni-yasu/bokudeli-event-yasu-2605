import { describe, expect, it } from 'vitest'
import { FirebaseError } from 'firebase/app'

import { isAlreadyRegisteredEmailError } from '@/utils/emailAuthError.js'

describe('isAlreadyRegisteredEmailError', () => {
  it('functions/already-exists を true にする', () => {
    expect(isAlreadyRegisteredEmailError(new FirebaseError('functions/already-exists', 'used'))).toBe(true)
  })

  it('他の FirebaseError と通常の Error は false にする', () => {
    expect(isAlreadyRegisteredEmailError(new FirebaseError('functions/not-found', 'missing'))).toBe(false)
    expect(isAlreadyRegisteredEmailError(new Error('already-exists'))).toBe(false)
  })
})
