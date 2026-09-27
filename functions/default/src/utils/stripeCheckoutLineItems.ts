import { HttpsError } from 'firebase-functions/https'

/** Stripe Checkout の line_items 上限。システム利用料行を含む最終件数で検査する */
export const STRIPE_CHECKOUT_LINE_ITEM_LIMIT = 100

export function assertStripeCheckoutLineItemLimit(lineItemCount: number): void {
  if (lineItemCount > STRIPE_CHECKOUT_LINE_ITEM_LIMIT) {
    throw new HttpsError(
      'failed-precondition',
      `一度にチェックアウトできる明細の上限（${STRIPE_CHECKOUT_LINE_ITEM_LIMIT}件）を超えています`,
    )
  }
}
