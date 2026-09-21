import { describe, expect, it } from 'vitest'
import { isQueryFlagActive, withQueryFlag } from './queryFlag'

describe('isQueryFlagActive', () => {
  it('期待値と一致するときだけ true', () => {
    expect(isQueryFlagActive('false', 'false')).toBe(true)
    expect(isQueryFlagActive('true', 'false')).toBe(false)
    expect(isQueryFlagActive(['false'], 'false')).toBe(false)
  })
})

describe('withQueryFlag', () => {
  it('有効化でフラグを足し、無効化で消す', () => {
    expect(withQueryFlag({}, 'is_approved', 'false', true)).toEqual({ is_approved: 'false' })
    expect(withQueryFlag({ is_approved: 'false', other: '1' }, 'is_approved', 'false', false)).toEqual({
      other: '1',
    })
  })
})
