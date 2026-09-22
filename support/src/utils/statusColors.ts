export type SupportTicketTone = 'live' | 'warn' | 'danger' | 'muted' | 'ink' | 'pending'

/** イベント calculatedEventStatus → 食券トーン */
export const eventStatusTicketTone = (status: string): SupportTicketTone => {
  switch (status) {
    case 'accepting_order':
      return 'live'
    case 'applying_reservation':
      return 'pending'
    case 'order_closed':
    case 'full':
      return 'warn'
    case 'event_canceled':
      return 'danger'
    case 'finished':
      return 'muted'
    default:
      return 'ink'
  }
}

/** 請求書払い入金 status → 食券トーン */
export const invoicePaymentTicketTone = (status: string): SupportTicketTone => {
  switch (status) {
    case 'paid':
      return 'live'
    case 'unpaid':
      return 'warn'
    case 'unconfirmed':
      return 'pending'
    default:
      return 'ink'
  }
}

/** 注文 status → 食券トーン */
export const orderStatusTicketTone = (status: string): SupportTicketTone => {
  switch (status) {
    case 'ordered':
      return 'live'
    case 'processing':
      return 'warn'
    case 'canceled':
      return 'danger'
    default:
      return 'ink'
  }
}
