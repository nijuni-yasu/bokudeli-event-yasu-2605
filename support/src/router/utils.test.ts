import { describe, expect, it } from 'vitest'
import { parseErrorCodeFromRoute } from './utils'

describe('parseErrorCodeFromRoute', () => {
  it('明示パス /404 /520 を解決する', () => {
    expect(parseErrorCodeFromRoute('/404', undefined)).toBe('404')
    expect(parseErrorCodeFromRoute('/520', undefined)).toBe('520')
  })

  it('catch-all の string パラメータを解決する', () => {
    expect(parseErrorCodeFromRoute('/unknown', '404')).toBe('404')
    expect(parseErrorCodeFromRoute('/unknown', 'missing-page')).toBe('404')
  })

  it('catch-all の配列パラメータの末尾セグメントを解決する', () => {
    expect(parseErrorCodeFromRoute('/unknown', ['foo', '520'])).toBe('520')
  })
})
