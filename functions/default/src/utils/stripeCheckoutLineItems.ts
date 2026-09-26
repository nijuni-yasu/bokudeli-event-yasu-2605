import { HttpsError } from 'firebase-functions/https'

export const STRIPE_CHECKOUT_LINE_ITEM_LIMIT = 100

export function assertStripeCheckoutLineItemLimit(lineItemCount: number): void {
  if (lineItemCount > STRIPE_CHECKOUT_LINE_ITEM_LIMIT) {
    throw new HttpsError(
      'failed-precondition',
      `一度にチェックアウトできる明細の上限（${STRIPE_CHECKOUT_LINE_ITEM_LIMIT}件）を超えています`,
    )
  }
}
