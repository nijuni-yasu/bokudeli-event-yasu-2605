import { describe, expect, it } from 'vitest'
import {
  INVOICE_REMINDER_COOLDOWN_MS,
  getInvoiceReminderBlockReason,
  invoiceReminderCooldownRemainingMs,
  isInvoiceReminderOnCooldown,
} from './invoicePayment.js'

describe('invoice reminder cooldown', () => {
  it('未送信はクールダウンしない', () => {
    expect(isInvoiceReminderOnCooldown(undefined, 1_000_000)).toBe(false)
    expect(invoiceReminderCooldownRemainingMs(undefined, 1_000_000)).toBe(0)
  })

  it('10分以内はクールダウン中', () => {
    const now = 1_000_000
    expect(isInvoiceReminderOnCooldown(now - INVOICE_REMINDER_COOLDOWN_MS + 1, now)).toBe(true)
    expect(isInvoiceReminderOnCooldown(now - INVOICE_REMINDER_COOLDOWN_MS, now)).toBe(false)
  })
})

describe('getInvoiceReminderBlockReason', () => {
  const base = {
    eventPayment: 'community_bill',
    status: 'unpaid',
    billEmail: 'bill@example.com',
    eventStartDatetime: 100,
    lastMailSentAt: undefined,
    now: 200,
  }

  it('条件を満たせば null', () => {
    expect(getInvoiceReminderBlockReason(base)).toBeNull()
  })

  it('community_bill 以外は拒否', () => {
    expect(getInvoiceReminderBlockReason({ ...base, eventPayment: 'user_advance' })).toBe('not_community_bill')
  })

  it('未払い以外は拒否', () => {
    expect(getInvoiceReminderBlockReason({ ...base, status: 'unconfirmed' })).toBe('not_unpaid')
    expect(getInvoiceReminderBlockReason({ ...base, status: 'paid' })).toBe('not_unpaid')
    expect(getInvoiceReminderBlockReason({ ...base, status: undefined })).toBe('not_unpaid')
  })

  it('請求先メールが空なら拒否', () => {
    expect(getInvoiceReminderBlockReason({ ...base, billEmail: '' })).toBe('missing_bill_email')
    expect(getInvoiceReminderBlockReason({ ...base, billEmail: '   ' })).toBe('missing_bill_email')
    expect(getInvoiceReminderBlockReason({ ...base, billEmail: undefined })).toBe('missing_bill_email')
  })

  it('開催前は拒否', () => {
    expect(getInvoiceReminderBlockReason({ ...base, eventStartDatetime: 300, now: 200 })).toBe('event_not_started')
  })

  it('クールダウン中は拒否', () => {
    expect(getInvoiceReminderBlockReason({ ...base, lastMailSentAt: base.now - 1000 })).toBe('cooldown')
  })
})
