import { describe, expect, it } from 'vitest'
import { DateTime } from 'luxon'
import { DEFAULT_TIME_ZONE } from '@shokujii/common/utils/datetime.js'
import { formatRelativeJa, formatScheduleRange, summarizeRangeMinOrders, userInitial } from './format'

const atTokyo = (iso: string): number => DateTime.fromISO(iso, { zone: DEFAULT_TIME_ZONE }).toMillis()

describe('formatScheduleRange', () => {
  it('同一暦日は日付を1回だけ出す', () => {
    expect(formatScheduleRange(atTokyo('2026-09-21T13:00:00'), atTokyo('2026-09-21T18:00:00'))).toBe(
      '2026/09/21 (月) 13:00–18:00',
    )
  })

  it('日をまたぐ場合は両端を日時で出す', () => {
    expect(formatScheduleRange(atTokyo('2026-09-21T22:00:00'), atTokyo('2026-09-22T01:00:00'))).toBe(
      '2026/9/21 22:00 – 2026/9/22 1:00',
    )
  })
})

describe('formatRelativeJa', () => {
  it('未来の締切を相対表示する', () => {
    const now = atTokyo('2026-09-21T12:00:00')
    const deadline = atTokyo('2026-09-21T15:00:00')
    expect(formatRelativeJa(deadline, now)).toBe('3時間後')
  })
})

describe('summarizeRangeMinOrders', () => {
  it('最短距離と最小個数を返す', () => {
    expect(
      summarizeRangeMinOrders([
        { range: 2, min_orders: 4 },
        { range: 10, min_orders: 8 },
      ]),
    ).toEqual({ shortestKm: 2, smallestCount: 4 })
  })

  it('null だけの配列は null', () => {
    expect(summarizeRangeMinOrders([{ range: null, min_orders: null }])).toBeNull()
  })
})

describe('userInitial', () => {
  it('先頭の1文字を返す', () => {
    expect(userInitial('山田太郎')).toBe('山')
  })

  it('空文字はプレースホルダ', () => {
    expect(userInitial('  ')).toBe('?')
  })
})
