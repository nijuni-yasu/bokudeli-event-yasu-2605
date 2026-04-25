import { describe, expect, it } from 'vitest'
import { judgeOrderTransition } from './orderStatusTransition.js'

describe('judgeOrderTransition', () => {
  it('returns ADD when transition to ordered', () => {
    expect(judgeOrderTransition(undefined, 'ordered')).toBe('ADD')
    expect(judgeOrderTransition('in_cart', 'ordered')).toBe('ADD')
    expect(judgeOrderTransition('canceled', 'ordered')).toBe('ADD')
  })

  it('returns REMOVE when transition from ordered', () => {
    expect(judgeOrderTransition('ordered', 'canceled')).toBe('REMOVE')
    expect(judgeOrderTransition('ordered', 'in_cart')).toBe('REMOVE')
    expect(judgeOrderTransition('ordered', undefined)).toBe('REMOVE')
  })

  it('returns NOOP when ordered remains ordered', () => {
    expect(judgeOrderTransition('ordered', 'ordered')).toBe('NOOP')
  })

  it('returns NOOP when ordered is not involved', () => {
    expect(judgeOrderTransition(undefined, undefined)).toBe('NOOP')
    expect(judgeOrderTransition(undefined, 'in_cart')).toBe('NOOP')
    expect(judgeOrderTransition('in_cart', 'canceled')).toBe('NOOP')
    expect(judgeOrderTransition('canceled', 'canceled')).toBe('NOOP')
  })
})
