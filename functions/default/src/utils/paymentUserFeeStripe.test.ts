import { describe, expect, it } from 'vitest'
import { computeEventStripePayFields } from '@shokujii/common/utils/paymentUserFee.js'
import {
  USER_PAYMENT_FEE_LINE_ITEM_DESCRIPTION,
  USER_PAYMENT_FEE_LINE_ITEM_NAME,
  buildUserPaymentFeeCheckoutLineItem,
  buildUserPaymentFeeCheckoutLineItemFromSelfPay,
} from './paymentUserFeeStripe.js'

describe('buildUserPaymentFeeCheckoutLineItem', () => {
  it('fee 0 以下は line item を作らない', () => {
    expect(buildUserPaymentFeeCheckoutLineItem(0)).toBeNull()
    expect(buildUserPaymentFeeCheckoutLineItemFromSelfPay(0)).toBeNull()
  })

  it('自己負担 1000 円は 決済手数料 110 円の inclusive line item', () => {
    const item = buildUserPaymentFeeCheckoutLineItemFromSelfPay(1000)
    expect(item).toEqual({
      price_data: {
        currency: 'jpy',
        tax_behavior: 'inclusive',
        product_data: {
          name: USER_PAYMENT_FEE_LINE_ITEM_NAME,
          description: USER_PAYMENT_FEE_LINE_ITEM_DESCRIPTION,
        },
        unit_amount: 110,
      },
      quantity: 1,
    })
  })
})

describe('Webhook EventStripe 金額', () => {
  it('自己負担 + 手数料を pay_amount にし、fee を保存する', () => {
    expect(computeEventStripePayFields(1000)).toEqual({
      pay_amount: 1110,
      pay_user_fee_amount: 110,
    })
  })

  it('自己負担 0 は手数料フィールドを書かない', () => {
    expect(computeEventStripePayFields(0)).toEqual({ pay_amount: 0 })
  })

  it('自己負担 10000 円は手数料上限 330 円', () => {
    expect(computeEventStripePayFields(10000)).toEqual({
      pay_amount: 10330,
      pay_user_fee_amount: 330,
    })
  })
})
