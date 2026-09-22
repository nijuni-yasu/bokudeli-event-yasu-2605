export const INVOICE_REMINDER_COOLDOWN_MS = 10 * 60 * 1000

export type InvoiceReminderBlockReason =
  | 'not_community_bill'
  | 'not_unpaid'
  | 'missing_bill_email'
  | 'event_not_started'
  | 'cooldown'

export const isInvoiceReminderOnCooldown = (lastMailSentAt: number | undefined, now: number): boolean =>
  lastMailSentAt != null && now - lastMailSentAt < INVOICE_REMINDER_COOLDOWN_MS

export const invoiceReminderCooldownRemainingMs = (lastMailSentAt: number | undefined, now: number): number => {
  if (lastMailSentAt == null) {
    return 0
  }
  return Math.max(0, INVOICE_REMINDER_COOLDOWN_MS - (now - lastMailSentAt))
}

export const getInvoiceReminderBlockReason = (input: {
  eventPayment: string
  status: string | undefined
  billEmail: string | undefined
  eventStartDatetime: number
  lastMailSentAt: number | undefined
  now: number
}): InvoiceReminderBlockReason | null => {
  if (input.eventPayment !== 'community_bill') {
    return 'not_community_bill'
  }
  if (input.status !== 'unpaid') {
    return 'not_unpaid'
  }
  if (input.billEmail == null || input.billEmail.trim() === '') {
    return 'missing_bill_email'
  }
  if (input.eventStartDatetime > input.now) {
    return 'event_not_started'
  }
  if (isInvoiceReminderOnCooldown(input.lastMailSentAt, input.now)) {
    return 'cooldown'
  }
  return null
}
