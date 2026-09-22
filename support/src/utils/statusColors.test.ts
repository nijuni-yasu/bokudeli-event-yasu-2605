import { describe, expect, it } from 'vitest'
import { eventStatusTicketTone, invoicePaymentTicketTone, orderStatusTicketTone } from './statusColors'

describe('eventStatusTicketTone', () => {
  it('受付中は live、超過系は warn、キャンセルは danger', () => {
    expect(eventStatusTicketTone('accepting_order')).toBe('live')
    expect(eventStatusTicketTone('applying_reservation')).toBe('pending')
    expect(eventStatusTicketTone('full')).toBe('warn')
    expect(eventStatusTicketTone('event_canceled')).toBe('danger')
    expect(eventStatusTicketTone('finished')).toBe('muted')
    expect(eventStatusTicketTone('in_draft')).toBe('ink')
  })
})

describe('invoicePaymentTicketTone', () => {
  it('支払い済みは live、未払いは warn、未確認は pending', () => {
    expect(invoicePaymentTicketTone('paid')).toBe('live')
    expect(invoicePaymentTicketTone('unpaid')).toBe('warn')
    expect(invoicePaymentTicketTone('unconfirmed')).toBe('pending')
  })
})

describe('orderStatusTicketTone', () => {
  it('注文済みは live', () => {
    expect(orderStatusTicketTone('ordered')).toBe('live')
    expect(orderStatusTicketTone('in_cart')).toBe('ink')
  })
})
