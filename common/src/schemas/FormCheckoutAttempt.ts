import { z } from 'zod'
import { EpochMillisSchema, NonEmptyStringSchema, TimestampSchema } from './firebase/index.js'
import { FormAnswerSnapshotSchema, type FormAnswerSnapshot } from './FormResponse.js'
import { FormFieldSchema, type FormField } from './formFields.js'

export const FORM_CHECKOUT_ATTEMPT_STATUS_VALUES = ['pending', 'frozen', 'consumed'] as const
export type FormCheckoutAttemptStatus = (typeof FORM_CHECKOUT_ATTEMPT_STATUS_VALUES)[number]

const FormCheckoutAttemptDbSchema = z.object({
  user_id: z.string().min(1),
  source_form_id: NonEmptyStringSchema.optional(),
  definition_version: z.number().int().positive(),
  revision_basis: z.number().int().nonnegative(),
  answers: z.array(FormAnswerSnapshotSchema),
  fields_snapshot: z.array(FormFieldSchema).optional(),
  status: z.enum(FORM_CHECKOUT_ATTEMPT_STATUS_VALUES),
  stripe_session_id: NonEmptyStringSchema.optional(),
  created_at: TimestampSchema,
  updated_at: TimestampSchema,
})

const FormCheckoutAttemptAppSchema = z.object({
  user_id: z.string().min(1),
  source_form_id: z.string().default(''),
  definition_version: z.number().int().positive(),
  revision_basis: z.number().int().nonnegative(),
  answers: z.array(FormAnswerSnapshotSchema),
  fields_snapshot: z.array(FormFieldSchema).optional(),
  status: z.enum(FORM_CHECKOUT_ATTEMPT_STATUS_VALUES).default('pending'),
  stripe_session_id: z.string().default(''),
  created_at: EpochMillisSchema,
  updated_at: EpochMillisSchema,
})

const convertToDb = (attempt: FormCheckoutAttempt) => {
  const base = {
    user_id: attempt.user_id,
    definition_version: attempt.definition_version,
    revision_basis: attempt.revision_basis,
    answers: attempt.answers,
    ...(attempt.fields_snapshot != null ? { fields_snapshot: attempt.fields_snapshot } : {}),
    status: attempt.status,
    created_at: attempt.created_at,
    updated_at: Date.now(),
  }
  return {
    ...base,
    ...(attempt.source_form_id.trim() !== '' ? { source_form_id: attempt.source_form_id } : {}),
    ...(attempt.stripe_session_id.trim() !== '' ? { stripe_session_id: attempt.stripe_session_id } : {}),
  }
}

export class FormCheckoutAttempt {
  readonly id: string
  user_id!: string
  source_form_id!: string
  definition_version!: number
  revision_basis!: number
  answers!: FormAnswerSnapshot[]
  // 既存の試行は過去の定義を復元できないため省略を許容。新規作成時は検証済み定義を保存する。
  fields_snapshot?: FormField[]
  status!: FormCheckoutAttemptStatus
  stripe_session_id!: string
  created_at!: number
  updated_at!: number

  constructor(id: string, src: Partial<FormCheckoutAttempt>) {
    const now = Date.now()
    Object.assign(
      this,
      FormCheckoutAttemptAppSchema.parse({
        ...src,
        created_at: src.created_at ?? now,
        updated_at: src.updated_at ?? now,
      }),
    )
    this.id = id
  }

  isValidForDatabase(): boolean {
    return FormCheckoutAttemptDbSchema.safeParse(convertToDb(this)).success
  }

  toFirestore(): z.infer<typeof FormCheckoutAttemptDbSchema> {
    return FormCheckoutAttemptDbSchema.parse(convertToDb(this))
  }
}
