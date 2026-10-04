import { describe, expect, it } from 'vitest'
import { VerificationTestOutboxAppSchema, VerificationTestOutboxDbSchema } from './VerificationTestOutbox.js'
import { Timestamp } from 'firebase-admin/firestore'

const valid = {
  email: 'pstack.participant@verify.shokujii.test',
  pass_code: '123456',
  kind: 'user_pass_code',
  verification_run_id: 'run-1',
  created_at: Timestamp.fromMillis(1770000000000),
}

describe('VerificationTestOutbox', () => {
  it('読取で Timestamp を millis にし、書込で Timestamp に戻す', () => {
    const app = VerificationTestOutboxAppSchema.parse(valid)
    expect(app.created_at).toBe(1770000000000)
    expect(VerificationTestOutboxDbSchema.parse(app).created_at.toMillis()).toBe(1770000000000)
  })

  it.each([
    { email: 'user@example.com' },
    { pass_code: '' },
    { kind: 'unknown' },
    { created_at: undefined },
    { verification_run_id: 1 },
  ])('壊れた記録を既定値で補わず拒否する: %j', (override) => {
    expect(VerificationTestOutboxAppSchema.safeParse({ ...valid, ...override }).success).toBe(false)
  })

  it('既存の run ID なし記録を読み取れる', () => {
    expect(
      VerificationTestOutboxAppSchema.parse({ ...valid, verification_run_id: null }).verification_run_id,
    ).toBeNull()
  })
})
