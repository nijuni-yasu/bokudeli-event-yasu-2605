import { describe, expect, it } from 'vitest'
import {
  computeCheckoutTotalFromSelfPay,
  computeEventStripePayFields,
  computeUserPaymentFeeFromSelfPay,
  isCheckoutAmountTotalMatchingPayAmount,
  previewUserPaymentFee,
  shouldApplyUserPaymentFee,
  sumChargedUserPaymentFee,
} from './paymentUserFee.js'

describe('computeUserPaymentFeeFromSelfPay', () => {
  it('自己負担 0 以下は手数料 0', () => {
    expect(computeUserPaymentFeeFromSelfPay(0)).toBe(0)
    expect(computeUserPaymentFeeFromSelfPay(-1)).toBe(0)
  })

  it.each([1, 999, 1000, 1999, 2000, 3000, 3500, 4000, 10000, 1000000])(
    '自己負担 %i 円でも手数料は一律 110 円',
    (selfPay) => {
      expect(computeUserPaymentFeeFromSelfPay(selfPay)).toBe(110)
    },
  )
})

describe('computeCheckoutTotalFromSelfPay', () => {
  it('自己負担 0 は合計 0', () => {
    expect(computeCheckoutTotalFromSelfPay(0)).toEqual({ selfPay: 0, fee: 0, total: 0 })
  })

  it('自己負担 2000 円以上でも合計への加算は 110 円', () => {
    expect(computeCheckoutTotalFromSelfPay(2000)).toEqual({ selfPay: 2000, fee: 110, total: 2110 })
    expect(computeCheckoutTotalFromSelfPay(10000)).toEqual({ selfPay: 10000, fee: 110, total: 10110 })
  })

  it('自己負担 + 手数料が合計', () => {
    expect(computeCheckoutTotalFromSelfPay(1000)).toEqual({ selfPay: 1000, fee: 110, total: 1110 })
  })
})

describe('computeEventStripePayFields', () => {
  it.each([0, 110, 220, 330])('Checkout に記録された手数料 %i 円を料金改定後も保持する', (chargedFee) => {
    const fields = computeEventStripePayFields(2000, chargedFee)
    expect(fields.pay_amount).toBe(2000 + chargedFee)
    expect(fields.pay_user_fee_amount).toBe(chargedFee === 0 ? undefined : chargedFee)
    expect(isCheckoutAmountTotalMatchingPayAmount(2000 + chargedFee, fields.pay_amount)).toBe(true)
    expect(isCheckoutAmountTotalMatchingPayAmount(1999 + chargedFee, fields.pay_amount)).toBe(false)
  })

  it('手数料 0 では pay_user_fee_amount を書かない', () => {
    expect(computeEventStripePayFields(0, 0)).toEqual({ pay_amount: 0 })
  })

  it('自己負担 1000 は pay_amount 1110 と fee 110', () => {
    expect(computeEventStripePayFields(1000, 110)).toEqual({ pay_amount: 1110, pay_user_fee_amount: 110 })
  })
})

describe('isCheckoutAmountTotalMatchingPayAmount', () => {
  it('amount_total が無いときは確定しない', () => {
    expect(isCheckoutAmountTotalMatchingPayAmount(null, 1110)).toBe(false)
    expect(isCheckoutAmountTotalMatchingPayAmount(undefined, 1110)).toBe(false)
  })

  it('amount_total と保存予定額は一致必須で、手数料抜きの額にフォールバックしない', () => {
    expect(isCheckoutAmountTotalMatchingPayAmount(1110, 1110)).toBe(true)
    expect(isCheckoutAmountTotalMatchingPayAmount(1000, 1000)).toBe(true)
    expect(isCheckoutAmountTotalMatchingPayAmount(1000, 1110)).toBe(false)
    expect(isCheckoutAmountTotalMatchingPayAmount(900, 1110)).toBe(false)
  })
})

describe('shouldApplyUserPaymentFee / previewUserPaymentFee', () => {
  it('自己負担 0 はどの支払い方式でも適用しない', () => {
    expect(shouldApplyUserPaymentFee('user_advance', 0)).toBe(false)
    expect(shouldApplyUserPaymentFee('enterprise_subsidy', 0)).toBe(false)
    expect(shouldApplyUserPaymentFee('community_bill', 0, { type: 'discount' })).toBe(false)
    expect(previewUserPaymentFee('user_advance', 0)).toBe(0)
  })

  it.each([1, 1000, 2000, 10000])('対象の全支払い方式で自己負担 %i 円は 110 円', (selfPay) => {
    expect(previewUserPaymentFee('user_advance', selfPay)).toBe(110)
    expect(previewUserPaymentFee('enterprise_subsidy', selfPay)).toBe(110)
    expect(previewUserPaymentFee('community_bill', selfPay, { type: 'discount' })).toBe(110)
  })

  it('当日払い・無料参加は適用しない', () => {
    expect(shouldApplyUserPaymentFee('user_on_day', 1000)).toBe(false)
    expect(shouldApplyUserPaymentFee('community_bill', 1000, { type: 'free' })).toBe(false)
    expect(previewUserPaymentFee('user_on_day', 1000)).toBe(0)
    expect(previewUserPaymentFee('community_bill', 1000, { type: 'free' })).toBe(0)
  })
})

describe('sumChargedUserPaymentFee', () => {
  it('pay_user_fee_amount 未設定の決済は 0', () => {
    expect(
      sumChargedUserPaymentFee(
        [
          { status: 'ordered', stripe_id: 'legacy' },
          { status: 'ordered', stripe_id: 'legacy' },
        ],
        { legacy: undefined },
      ),
    ).toBe(0)
  })

  it('同じ stripe は 1 回だけ足す', () => {
    expect(
      sumChargedUserPaymentFee(
        [
          { status: 'ordered', stripe_id: 's1' },
          { status: 'ordered', stripe_id: 's1' },
          { status: 'ordered', stripe_id: 's2' },
        ],
        { s1: 220, s2: 110 },
      ),
    ).toBe(330)
  })

  it('キャンセル済み注文の stripe は含めない', () => {
    expect(
      sumChargedUserPaymentFee(
        [
          { status: 'canceled', stripe_id: 'gone' },
          { status: 'ordered', stripe_id: 'keep' },
        ],
        { gone: 220, keep: 110 },
      ),
    ).toBe(110)
  })

  it('stripe_id が無い注文は 0', () => {
    expect(sumChargedUserPaymentFee([{ status: 'ordered' }, { status: 'processing', stripe_id: '' }], {})).toBe(0)
  })
})
