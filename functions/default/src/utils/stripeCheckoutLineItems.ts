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

const STRIPE_PRODUCT_NAME_MAX_LENGTH = 250

/** Stripe に渡す商品名だけを省略する。注文スナップショットと集約キーは変更しない。 */
export function formatStripeProductName(displayName: string): string {
  const characters = Array.from(displayName)
  return characters.length <= STRIPE_PRODUCT_NAME_MAX_LENGTH
    ? displayName
    : `${characters.slice(0, STRIPE_PRODUCT_NAME_MAX_LENGTH - 1).join('')}…`
}
