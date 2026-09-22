import { describe, expect, it } from 'vitest'
import { EventMemberOrder } from '@shokujii/common/schemas/EventMemberOrder.js'
import { computeEventStripePayFields } from '@shokujii/common/utils/paymentUserFee.js'
import { computeStripeRefundAmountForMemberOrders } from './refundMemberOrdersStripe.js'

const makeOrder = (id: string, menuPrice: number, discount?: { subsidy?: number; communityBill?: number }) =>
  new EventMemberOrder(id, {
    order_id: id,
    user_id: 'u1',
    event_id: 'e1',
    community_id: 'c1',
    menu_id: 'm1',
    menu_name: 'menu',
    menu_price: menuPrice,
    ...(discount?.subsidy != null ? { pay_enterprise_subsidy_amount: discount.subsidy } : {}),
    ...(discount?.communityBill != null ? { pay_community_bill_off_amount: discount.communityBill } : {}),
  })

describe('computeStripeRefundAmountForMemberOrders', () => {
  it('返金額は自己負担のみで、手数料を足さない', () => {
    const orders = [makeOrder('o1', 1000)]
    const selfPay = 1000
    const { pay_amount, pay_user_fee_amount } = computeEventStripePayFields(selfPay)
    expect(pay_amount).toBe(1110)
    expect(pay_user_fee_amount).toBe(110)
    expect(computeStripeRefundAmountForMemberOrders(orders)).toBe(1000)
  })

  it('割引後の自己負担だけを返す', () => {
    expect(computeStripeRefundAmountForMemberOrders([makeOrder('o1', 1000, { subsidy: 300 })])).toBe(700)
    expect(computeStripeRefundAmountForMemberOrders([makeOrder('o1', 1000, { communityBill: 400 })])).toBe(600)
  })

  it('複数注文の自己負担合計であり、セッション手数料は含めない', () => {
    const orders = [makeOrder('o1', 1000), makeOrder('o2', 1000)]
    expect(computeStripeRefundAmountForMemberOrders(orders)).toBe(2000)
    expect(computeEventStripePayFields(2000).pay_user_fee_amount).toBe(220)
  })

  it('自己負担合計が pay_amount（手数料込み）以下なので上限チェックは通る', () => {
    const refundAmount = computeStripeRefundAmountForMemberOrders([makeOrder('o1', 1000)])
    const { pay_amount } = computeEventStripePayFields(1000)
    expect(refundAmount).toBeLessThan(pay_amount)
    expect(refundAmount + (pay_amount - refundAmount)).toBe(pay_amount)
  })
})
