import { describe, expect, it } from 'vitest'
import { EventInvoicePayment, INVOICE_PAYMENT_DOC_ID } from './EventInvoicePayment.js'

describe('EventInvoicePayment', () => {
  it('未払いを Firestore 向けにシリアライズする', () => {
    const payment = new EventInvoicePayment(INVOICE_PAYMENT_DOC_ID, {
      status: 'unpaid',
      memo: '3/31 未着',
      updated_by: 'support-1',
    })

    expect(payment.isValidForDatabase()).toBe(true)
    const firestore = payment.toFirestore()
    expect(firestore.status).toBe('unpaid')
    expect(firestore.memo).toBe('3/31 未着')
    expect(firestore.updated_by).toBe('support-1')
    expect(firestore.updated_at).toBeDefined()
  })

  it('支払い済みは paid_at / paid_by を残す', () => {
    const paidAt = Date.now()
    const payment = new EventInvoicePayment(INVOICE_PAYMENT_DOC_ID, {
      status: 'paid',
      updated_by: 'support-1',
      paid_at: paidAt,
      paid_by: 'support-1',
    })

    const firestore = payment.toFirestore()
    expect(firestore.status).toBe('paid')
    expect(firestore.paid_by).toBe('support-1')
    expect(firestore.paid_at).toBeDefined()
  })

  it('未払いへ戻すと paid_at / paid_by を削除する', () => {
    const payment = new EventInvoicePayment(INVOICE_PAYMENT_DOC_ID, {
      status: 'unpaid',
      updated_by: 'support-1',
      paid_at: Date.now(),
      paid_by: 'support-1',
    })

    const firestore = payment.toFirestore()
    expect(firestore.paid_at).toBeDefined()
    expect(firestore.paid_by).toBeDefined()
    expect(typeof firestore.paid_at).not.toBe('number')
  })

  it('空メモはフィールド削除になる', () => {
    const payment = new EventInvoicePayment(INVOICE_PAYMENT_DOC_ID, {
      status: 'unconfirmed',
      memo: '',
      updated_by: 'support-1',
    })

    const firestore = payment.toFirestore()
    expect(firestore.memo).toBeDefined()
    expect(firestore.memo).not.toBe('')
  })
})
