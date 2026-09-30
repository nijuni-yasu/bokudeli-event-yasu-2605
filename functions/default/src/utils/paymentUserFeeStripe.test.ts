import { beforeEach, describe, expect, it, vi } from 'vitest'
import Stripe from 'stripe'
import { computeEventStripePayFields } from '@shokujii/common/utils/paymentUserFee.js'
import {
  retrieveCheckoutUserPaymentFeeAmount,
  USER_PAYMENT_FEE_LINE_ITEM_DESCRIPTION,
  USER_PAYMENT_FEE_LINE_ITEM_NAME,
  buildUserPaymentFeeCheckoutLineItem,
  buildUserPaymentFeeCheckoutLineItemFromSelfPay,
} from './paymentUserFeeStripe.js'

const { listLineItemsMock } = vi.hoisted(() => ({ listLineItemsMock: vi.fn() }))
vi.mock('stripe', () => ({
  default: class {
    checkout = { sessions: { listLineItems: listLineItemsMock } }
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('buildUserPaymentFeeCheckoutLineItem', () => {
  it('fee 0 以下は line item を作らない', () => {
    expect(buildUserPaymentFeeCheckoutLineItem(0)).toBeNull()
    expect(buildUserPaymentFeeCheckoutLineItemFromSelfPay(0)).toBeNull()
  })

  it('自己負担 1000 円は システム利用料 110 円の inclusive line item', () => {
    const item = buildUserPaymentFeeCheckoutLineItemFromSelfPay(1000)
    expect(item).toEqual({
      price_data: {
        currency: 'jpy',
        tax_behavior: 'inclusive',
        product_data: {
          name: USER_PAYMENT_FEE_LINE_ITEM_NAME,
          description: USER_PAYMENT_FEE_LINE_ITEM_DESCRIPTION,
          metadata: { fee_type: 'user_payment_fee' },
        },
        unit_amount: 110,
      },
      quantity: 1,
    })
  })
})

describe('retrieveCheckoutUserPaymentFeeAmount', () => {
  const stripe = new Stripe('test')
  const makeItem = (amount: number, name: string, metadata: Record<string, string>) => ({
    amount_total: amount,
    currency: 'jpy',
    price: { product: { name, metadata } },
  })
  const food = makeItem(2000, 'お弁当', { partner_id: 'partner-1' })

  it.each([110, 220, 330])('作成時の手数料 %i 円を現在の料金で再計算しない', async (fee) => {
    listLineItemsMock.mockResolvedValue({
      has_more: false,
      data: [food, makeItem(fee, USER_PAYMENT_FEE_LINE_ITEM_NAME, { fee_type: 'user_payment_fee' })],
    })
    const chargedFee = await retrieveCheckoutUserPaymentFeeAmount(stripe, 'cs_test')
    expect(chargedFee).toBe(fee)
    expect(computeEventStripePayFields(2000, chargedFee)).toEqual({
      pay_amount: 2000 + fee,
      pay_user_fee_amount: fee,
    })
    expect(listLineItemsMock).toHaveBeenCalledWith('cs_test', { limit: 100, expand: ['data.price.product'] })
  })

  it.each(['システム利用料', '決済手数料'])('識別 metadata がない旧明細「%s」の 220 円も保持する', async (name) => {
    listLineItemsMock.mockResolvedValue({ has_more: false, data: [food, makeItem(220, name, {})] })
    expect(await retrieveCheckoutUserPaymentFeeAmount(stripe, 'cs_old')).toBe(220)
  })

  it('手数料導入前の Checkout は手数料 0 のまま', async () => {
    listLineItemsMock.mockResolvedValue({ has_more: false, data: [food] })
    const fee = await retrieveCheckoutUserPaymentFeeAmount(stripe, 'cs_legacy')
    expect(fee).toBe(0)
    expect(computeEventStripePayFields(2000, fee)).toEqual({ pay_amount: 2000 })
  })

  it('システム利用料と同名の食事を手数料に含めない', async () => {
    listLineItemsMock.mockResolvedValue({
      has_more: false,
      data: [makeItem(2000, USER_PAYMENT_FEE_LINE_ITEM_NAME, { partner_id: 'partner-1' })],
    })
    expect(await retrieveCheckoutUserPaymentFeeAmount(stripe, 'cs_food')).toBe(0)
  })

  it('明細の取りこぼしがある場合は確定しない', async () => {
    listLineItemsMock.mockResolvedValue({ has_more: true, data: [food] })
    await expect(retrieveCheckoutUserPaymentFeeAmount(stripe, 'cs_many')).rejects.toThrow('limit')
  })

  it.each([null, 'prod_unexpanded', { id: 'prod_deleted', deleted: true }])(
    'Product を取得できない場合は手数料 0 にせず失敗する',
    async (product) => {
      listLineItemsMock.mockResolvedValue({
        has_more: false,
        data: [{ amount_total: 110, currency: 'jpy', price: { product } }],
      })
      await expect(retrieveCheckoutUserPaymentFeeAmount(stripe, 'cs_invalid')).rejects.toThrow('unavailable')
    },
  )

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])('不正な手数料 %s を保存しない', async (amount) => {
    listLineItemsMock.mockResolvedValue({
      has_more: false,
      data: [food, makeItem(amount, USER_PAYMENT_FEE_LINE_ITEM_NAME, {})],
    })
    await expect(retrieveCheckoutUserPaymentFeeAmount(stripe, 'cs_invalid')).rejects.toThrow('Invalid')
  })

  it('Stripe の取得エラーを握りつぶさず Webhook の再試行対象にする', async () => {
    listLineItemsMock.mockRejectedValueOnce(new Error('Stripe unavailable'))
    await expect(retrieveCheckoutUserPaymentFeeAmount(stripe, 'cs_retry')).rejects.toThrow('Stripe unavailable')
  })
})

describe('Webhook EventStripe 金額', () => {
  it('自己負担 + 手数料を pay_amount にし、fee を保存する', () => {
    expect(computeEventStripePayFields(1000, 110)).toEqual({
      pay_amount: 1110,
      pay_user_fee_amount: 110,
    })
  })

  it('自己負担 0 は手数料フィールドを書かない', () => {
    expect(computeEventStripePayFields(0, 0)).toEqual({ pay_amount: 0 })
  })

  it('自己負担 10000 円でも手数料 110 円の明細を作る', () => {
    expect(buildUserPaymentFeeCheckoutLineItemFromSelfPay(10000)?.price_data?.unit_amount).toBe(110)
    expect(computeEventStripePayFields(10000, 110)).toEqual({
      pay_amount: 10110,
      pay_user_fee_amount: 110,
    })
  })
})
