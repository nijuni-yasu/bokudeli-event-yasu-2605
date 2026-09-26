import { describe, expect, it } from 'vitest'
import { assertStripeCheckoutLineItemLimit, STRIPE_CHECKOUT_LINE_ITEM_LIMIT } from './stripeCheckoutLineItems.js'

describe('assertStripeCheckoutLineItemLimit', () => {
  it('上限件数までは通す', () => {
    expect(() => assertStripeCheckoutLineItemLimit(STRIPE_CHECKOUT_LINE_ITEM_LIMIT)).not.toThrow()
  })

  it('上限件数を超えると failed-precondition を投げる', () => {
    try {
      assertStripeCheckoutLineItemLimit(STRIPE_CHECKOUT_LINE_ITEM_LIMIT + 1)
      throw new Error('expected HttpsError')
    } catch (error) {
      expect(error).toMatchObject({ code: 'failed-precondition' })
    }
  })
})
