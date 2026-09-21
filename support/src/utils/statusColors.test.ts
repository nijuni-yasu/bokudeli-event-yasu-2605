import { describe, expect, it } from 'vitest'
import { eventStatusTicketTone, orderStatusTicketTone } from './statusColors'

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

describe('orderStatusTicketTone', () => {
  it('注文済みは live', () => {
    expect(orderStatusTicketTone('ordered')).toBe('live')
    expect(orderStatusTicketTone('in_cart')).toBe('ink')
  })
})
