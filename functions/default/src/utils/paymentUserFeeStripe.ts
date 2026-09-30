import type Stripe from 'stripe'
import { computeUserPaymentFeeFromSelfPay, USER_PAYMENT_FEE_AMOUNT } from '@shokujii/common/utils/paymentUserFee.js'

export const USER_PAYMENT_FEE_LINE_ITEM_NAME = 'システム利用料'
export const USER_PAYMENT_FEE_LINE_ITEM_DESCRIPTION = `自己負担がある事前決済のときだけかかります。現在は1回の決済につき税込${USER_PAYMENT_FEE_AMOUNT}円です。キャンセルしても返金されません。`

/** Checkout に載せるシステム利用料 line item。fee が 0 以下なら追加しない。 */
export function buildUserPaymentFeeCheckoutLineItem(fee: number): Stripe.Checkout.SessionCreateParams.LineItem | null {
  if (fee <= 0) return null
  return {
    price_data: {
      currency: 'jpy',
      tax_behavior: 'inclusive',
      product_data: {
        name: USER_PAYMENT_FEE_LINE_ITEM_NAME,
        description: USER_PAYMENT_FEE_LINE_ITEM_DESCRIPTION,
        metadata: { fee_type: 'user_payment_fee' },
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

/** 料金改定をまたいだ Checkout も、作成時の明細に載った手数料を確定額として使う。 */
export async function retrieveCheckoutUserPaymentFeeAmount(stripe: Stripe, sessionId: string): Promise<number> {
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
    expand: ['data.price.product'],
  })
  // Checkout 作成時も最大 100 行。明細を取りこぼしたまま金額を確定しない。
  if (lineItems.has_more) throw new Error('Checkout line items exceed the supported limit')

  let fee = 0
  for (const item of lineItems.data) {
    const product = item.price?.product
    if (product == null || typeof product === 'string' || product.deleted === true) {
      throw new Error('Checkout line item product is unavailable')
    }
    // 旧 Checkout の手数料 Product には識別用 metadata がない。
    // 食事 Product の partner_id を確認し、同名のメニューを手数料に含めない。
    const isLegacyFee =
      product.metadata.fee_type == null &&
      product.metadata.partner_id == null &&
      (product.name === USER_PAYMENT_FEE_LINE_ITEM_NAME || product.name === '決済手数料')
    if (product.metadata.fee_type !== 'user_payment_fee' && !isLegacyFee) continue
    if (item.currency !== 'jpy' || !Number.isSafeInteger(item.amount_total) || item.amount_total < 0) {
      throw new Error('Invalid Checkout user payment fee')
    }
    fee += item.amount_total
  }
  return fee
}
