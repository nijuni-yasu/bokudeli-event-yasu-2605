import { describe, expect, it } from 'vitest'
import {
  computeCheckoutTotalFromSelfPay,
  computeEventStripePayFields,
  computeUserPaymentFeeFromSelfPay,
  isCheckoutAmountTotalMatchingPayAmount,
  previewUserPaymentFee,
  shouldApplyUserPaymentFee,
} from './paymentUserFee.js'

describe('computeUserPaymentFeeFromSelfPay', () => {
  it('自己負担 0 以下は手数料 0', () => {
    expect(computeUserPaymentFeeFromSelfPay(0)).toBe(0)
    expect(computeUserPaymentFeeFromSelfPay(-1)).toBe(0)
  })

  it('1000 円未満でも最低 110 円', () => {
    expect(computeUserPaymentFeeFromSelfPay(1)).toBe(110)
    expect(computeUserPaymentFeeFromSelfPay(999)).toBe(110)
  })

  it('仕様書の計算例', () => {
    expect(computeUserPaymentFeeFromSelfPay(1000)).toBe(110)
    expect(computeUserPaymentFeeFromSelfPay(1999)).toBe(110)
    expect(computeUserPaymentFeeFromSelfPay(2000)).toBe(220)
    expect(computeUserPaymentFeeFromSelfPay(3000)).toBe(220)
    expect(computeUserPaymentFeeFromSelfPay(3500)).toBe(220)
    expect(computeUserPaymentFeeFromSelfPay(4000)).toBe(220)
    expect(computeUserPaymentFeeFromSelfPay(10000)).toBe(220)
  })
})

describe('computeCheckoutTotalFromSelfPay', () => {
  it('自己負担 0 は合計 0', () => {
    expect(computeCheckoutTotalFromSelfPay(0)).toEqual({ selfPay: 0, fee: 0, total: 0 })
  })

  it('自己負担 + 手数料が合計', () => {
    expect(computeCheckoutTotalFromSelfPay(1000)).toEqual({ selfPay: 1000, fee: 110, total: 1110 })
  })
})

describe('computeEventStripePayFields', () => {
  it('手数料 0 では pay_user_fee_amount を書かない', () => {
    expect(computeEventStripePayFields(0)).toEqual({ pay_amount: 0 })
  })

  it('自己負担 1000 は pay_amount 1110 と fee 110', () => {
    expect(computeEventStripePayFields(1000)).toEqual({ pay_amount: 1110, pay_user_fee_amount: 110 })
  })
})

describe('isCheckoutAmountTotalMatchingPayAmount', () => {
  it('amount_total が無いときは一致とみなす', () => {
    expect(isCheckoutAmountTotalMatchingPayAmount(null, 1110)).toBe(true)
    expect(isCheckoutAmountTotalMatchingPayAmount(undefined, 1110)).toBe(true)
  })

  it('amount_total があるときは pay_amount と一致必須', () => {
    expect(isCheckoutAmountTotalMatchingPayAmount(1110, 1110)).toBe(true)
    expect(isCheckoutAmountTotalMatchingPayAmount(1000, 1110)).toBe(false)
  })
})

describe('shouldApplyUserPaymentFee / previewUserPaymentFee', () => {
  it('自己負担 0 はどの支払い方式でも適用しない', () => {
    expect(shouldApplyUserPaymentFee('user_advance', 0)).toBe(false)
    expect(shouldApplyUserPaymentFee('enterprise_subsidy', 0)).toBe(false)
    expect(shouldApplyUserPaymentFee('community_bill', 0, { type: 'discount' })).toBe(false)
    expect(previewUserPaymentFee('user_advance', 0)).toBe(0)
  })

  it('user_advance / enterprise_subsidy / 割引差額は適用する', () => {
    expect(previewUserPaymentFee('user_advance', 1000)).toBe(110)
    expect(previewUserPaymentFee('enterprise_subsidy', 1000)).toBe(110)
    expect(previewUserPaymentFee('community_bill', 1000, { type: 'discount' })).toBe(110)
  })

  it('当日払い・無料参加は適用しない', () => {
    expect(shouldApplyUserPaymentFee('user_on_day', 1000)).toBe(false)
    expect(shouldApplyUserPaymentFee('community_bill', 1000, { type: 'free' })).toBe(false)
    expect(previewUserPaymentFee('user_on_day', 1000)).toBe(0)
    expect(previewUserPaymentFee('community_bill', 1000, { type: 'free' })).toBe(0)
  })
})
