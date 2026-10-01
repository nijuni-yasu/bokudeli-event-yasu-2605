import { describe, expect, it } from 'vitest'
import {
  assertStripeCheckoutLineItemLimit,
  STRIPE_CHECKOUT_LINE_ITEM_LIMIT,
  formatStripeProductName,
} from './stripeCheckoutLineItems.js'

describe('assertStripeCheckoutLineItemLimit', () => {
  it('上限件数までは通す（食事 99 + システム利用料 1 を含む最終件数）', () => {
    expect(() => assertStripeCheckoutLineItemLimit(STRIPE_CHECKOUT_LINE_ITEM_LIMIT)).not.toThrow()
  })

  it('上限件数を超えると failed-precondition を投げる（食事 100 + システム利用料 1）', () => {
    try {
      assertStripeCheckoutLineItemLimit(STRIPE_CHECKOUT_LINE_ITEM_LIMIT + 1)
      throw new Error('expected HttpsError')
    } catch (error) {
      expect(error).toMatchObject({ code: 'failed-precondition' })
    }
  })
})

describe('formatStripeProductName', () => {
  it('上限までの名前を維持する', () => {
    expect(formatStripeProductName('あ'.repeat(250))).toBe('あ'.repeat(250))
  })

  it('省略記号を含め250文字にする', () => {
    expect(formatStripeProductName('あ'.repeat(251))).toBe(`${'あ'.repeat(249)}…`)
  })

  it('サロゲートペアの途中で切らない', () => {
    expect(formatStripeProductName('🍱'.repeat(251))).toBe(`${'🍱'.repeat(249)}…`)
  })
})
