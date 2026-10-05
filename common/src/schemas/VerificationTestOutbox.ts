import { z } from 'zod'
import { PASS_CODE_DURATION } from './PassCode.js'
import { EpochMillisSchema, TimestampSchema } from './firebase/index.js'

const fields = {
  email: z.string().email().endsWith('@verify.shokujii.test'),
  pass_code: z.string().regex(/^\d{6}$/),
  kind: z.literal('user_pass_code'),
  // 初回実装の run ID なし記録も読めるよう null を維持する。
  verification_run_id: z.string().min(1).nullable(),
}

export const VerificationTestOutboxDbSchema = z.object({
  ...fields,
  created_at: TimestampSchema,
  expires_at: TimestampSchema,
})
export const VerificationTestOutboxAppSchema = z
  .object({ ...fields, created_at: EpochMillisSchema, expires_at: EpochMillisSchema.optional() })
  // 既存の sandbox 記録は保存時刻から同じ有効期限を導出し、延命しない。
  .transform((record) => ({ ...record, expires_at: record.expires_at ?? record.created_at + PASS_CODE_DURATION }))
export type VerificationTestOutboxRecord = z.infer<typeof VerificationTestOutboxAppSchema> & { id: string }
