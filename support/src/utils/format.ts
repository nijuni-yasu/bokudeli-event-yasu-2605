import { DateTime } from 'luxon'
import {
  DEFAULT_TIME_ZONE,
  convertToDateWeekdayShort,
  convertToDatetime,
  convertToTimeString,
} from '@shokujii/common/utils/datetime.js'

/** 同一暦日なら日付を1回、時刻だけ範囲表示する。 */
export const formatScheduleRange = (startMillis: number, endMillis: number): string => {
  const start = DateTime.fromMillis(startMillis, { zone: DEFAULT_TIME_ZONE, locale: 'ja' })
  const end = DateTime.fromMillis(endMillis, { zone: DEFAULT_TIME_ZONE, locale: 'ja' })
  if (start.hasSame(end, 'day')) {
    return `${convertToDateWeekdayShort(startMillis)} ${convertToTimeString(startMillis)}–${convertToTimeString(endMillis)}`
  }
  return `${convertToDatetime(startMillis)} – ${convertToDatetime(endMillis)}`
}

/** 相対時刻。now を渡すとテスト可能。 */
export const formatRelativeJa = (millis: number, nowMillis = Date.now()): string => {
  const dt = DateTime.fromMillis(millis, { zone: DEFAULT_TIME_ZONE, locale: 'ja' })
  const now = DateTime.fromMillis(nowMillis, { zone: DEFAULT_TIME_ZONE, locale: 'ja' })
  const relative = dt.toRelative({ base: now })
  if (relative == null) {
    return convertToDatetime(millis)
  }
  return relative.replace(/(\d+)\s+/g, '$1')
}

export const summarizeRangeMinOrders = (
  items: { range: number | null; min_orders: number | null }[],
): { shortestKm: number; smallestCount: number } | null => {
  const ranges = items.flatMap((item) => (item.range == null ? [] : [item.range]))
  const counts = items.flatMap((item) => (item.min_orders == null ? [] : [item.min_orders]))
  if (ranges.length === 0 || counts.length === 0) {
    return null
  }
  return {
    shortestKm: Math.min(...ranges),
    smallestCount: Math.min(...counts),
  }
}

export const userInitial = (name: string): string => {
  const trimmed = name.trim()
  return trimmed === '' ? '?' : ([...trimmed][0] ?? '?')
}
