import { describe, expect, it } from 'vitest'
import {
  getCommunitiesLocation,
  getEventsLocation,
  getOrdersLocation,
  getShopsLocation,
  parseErrorCodeFromRoute,
} from './utils'

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

describe('一覧 location', () => {
  it('フィルタ付きクエリを組み立てる', () => {
    expect(getEventsLocation({ acceptingOrder: true })).toEqual({
      path: '/events',
      query: { status: 'accepting_order' },
    })
    expect(getEventsLocation({ applyingReservation: true })).toEqual({
      path: '/events',
      query: { status: 'applying_reservation' },
    })
    expect(getCommunitiesLocation({ pendingApproval: true })).toEqual({
      path: '/communities',
      query: { is_approved: 'false' },
    })
    expect(getShopsLocation({ pendingApproval: true })).toEqual({
      path: '/shops',
      query: { is_approved: 'false' },
    })
    expect(getOrdersLocation({ recentDays: 7 })).toEqual({
      path: '/orders',
      query: { recent: '7' },
    })
  })
})
