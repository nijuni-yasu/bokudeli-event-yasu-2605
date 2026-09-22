import { z } from 'zod'
import { EpochMillisSchema, NonEmptyStringSchema, TimestampSchema, optionalDeleteField } from './firebase/index.js'

export const INVOICE_PAYMENT_DOC_ID = 'current'

export const COMMUNITY_BILL_PAYMENT_STATUS_VALUES = ['unconfirmed', 'unpaid', 'paid'] as const
export type CommunityBillPaymentStatusType = (typeof COMMUNITY_BILL_PAYMENT_STATUS_VALUES)[number]

const EventInvoicePaymentDbSchema = z.object({
  status: z.enum(COMMUNITY_BILL_PAYMENT_STATUS_VALUES),
  memo: NonEmptyStringSchema.optional(),
  updated_at: TimestampSchema,
  updated_by: z.string().nonempty(),
  paid_at: optionalDeleteField(TimestampSchema),
  paid_by: NonEmptyStringSchema.optional(),
  last_mail_sent_at: TimestampSchema.optional(),
  last_mail_sent_by: z.string().nonempty().optional(),
  mail_send_count: z.number().int().nonnegative().optional(),
})

const EventInvoicePaymentAppSchema = z.object({
  status: z.enum(COMMUNITY_BILL_PAYMENT_STATUS_VALUES).default('unconfirmed'),
  memo: z.string().optional(),
  updated_by: z.string().nonempty(),
  paid_at: EpochMillisSchema.optional(),
  paid_by: z.string().optional(),
  last_mail_sent_at: EpochMillisSchema.optional(),
  last_mail_sent_by: z.string().optional(),
  mail_send_count: z.number().int().nonnegative().optional(),
})

const convertToDb = (payment: EventInvoicePayment) => {
  const isPaid = payment.status === 'paid'
  return {
    status: payment.status,
    memo: payment.memo ?? '',
    updated_at: Date.now(),
    updated_by: payment.updated_by,
    paid_at: isPaid ? payment.paid_at : undefined,
    paid_by: isPaid ? (payment.paid_by ?? '') : '',
    last_mail_sent_at: payment.last_mail_sent_at,
    last_mail_sent_by: payment.last_mail_sent_by,
    mail_send_count: payment.mail_send_count,
  }
}

export class EventInvoicePayment {
  readonly id: string
  status!: CommunityBillPaymentStatusType
  memo?: string
  updated_at: number
  updated_by!: string
  paid_at?: number
  paid_by?: string
  last_mail_sent_at?: number
  last_mail_sent_by?: string
  mail_send_count?: number

  constructor(id: string, src: Partial<EventInvoicePayment>) {
    Object.assign(this, EventInvoicePaymentAppSchema.parse(src))
    this.id = id
    this.updated_at = EpochMillisSchema.default(Date.now()).parse(src.updated_at)
  }

  isValidForDatabase(): boolean {
    return EventInvoicePaymentDbSchema.safeParse(convertToDb(this)).success
  }

  toFirestore(): z.infer<typeof EventInvoicePaymentDbSchema> {
    const parsed = EventInvoicePaymentDbSchema.parse(convertToDb(this))
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => value !== undefined)) as z.infer<
      typeof EventInvoicePaymentDbSchema
    >
  }
}
