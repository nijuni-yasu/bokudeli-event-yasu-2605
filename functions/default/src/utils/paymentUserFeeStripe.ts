import type Stripe from 'stripe'
import {
  computeUserPaymentFeeFromSelfPay,
  USER_PAYMENT_FEE_MAX,
  USER_PAYMENT_FEE_UNIT,
} from '@shokujii/common/utils/paymentUserFee.js'

export const USER_PAYMENT_FEE_LINE_ITEM_NAME = '決済手数料'
export const USER_PAYMENT_FEE_LINE_ITEM_DESCRIPTION = `最低${USER_PAYMENT_FEE_UNIT}円・最大${USER_PAYMENT_FEE_MAX}円。キャンセルしても返金されません。`

/** Checkout に載せる決済手数料 line item。fee が 0 以下なら追加しない。 */
export function buildUserPaymentFeeCheckoutLineItem(fee: number): Stripe.Checkout.SessionCreateParams.LineItem | null {
  if (fee <= 0) return null
  return {
    price_data: {
      currency: 'jpy',
      tax_behavior: 'inclusive',
      product_data: {
        name: USER_PAYMENT_FEE_LINE_ITEM_NAME,
        description: USER_PAYMENT_FEE_LINE_ITEM_DESCRIPTION,
      },
      unit_amount: fee,
    },
    quantity: 1,
  }
}

export function buildUserPaymentFeeCheckoutLineItemFromSelfPay(
  selfPay: number,
): Stripe.Checkout.SessionCreateParams.LineItem | null {
  return buildUserPaymentFeeCheckoutLineItem(computeUserPaymentFeeFromSelfPay(selfPay))
}
