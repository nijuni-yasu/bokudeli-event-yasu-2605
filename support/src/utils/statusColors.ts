/** イベント calculatedEventStatus → v-chip color */
export const eventStatusChipColor = (status: string): string => {
  switch (status) {
    case 'accepting_order':
      return 'success'
    case 'order_closed':
    case 'full':
      return 'warning'
    case 'event_canceled':
      return 'error'
    case 'finished':
      return 'secondary'
    case 'in_draft':
    case 'applying_reservation':
    case 'applying_to_admin':
      return 'default'
    default:
      return 'default'
  }
}

/** 注文 status → v-chip color */
export const orderStatusChipColor = (status: string): string => {
  switch (status) {
    case 'ordered':
      return 'success'
    case 'processing':
      return 'warning'
    case 'canceled':
      return 'error'
    default:
      return 'default'
  }
}
