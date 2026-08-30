import { format } from 'date-fns'

export const convertToDate = (millis: number) => format(millis, 'yyyy/MM/dd')

/** 店舗メニューカード向け: 同一年内は終了日から年を省略（例: 2026/3/1〜3/31） */
export const formatLimitedPeriodRange = (startMillis: number, endMillis: number): string => {
  const startFormatted = format(startMillis, 'yyyy/M/d')
  const startYear = format(startMillis, 'yyyy')
  const endYear = format(endMillis, 'yyyy')
  if (startYear === endYear) {
    return `${startFormatted}〜${format(endMillis, 'M/d')}`
  }
  return `${startFormatted}〜${format(endMillis, 'yyyy/M/d')}`
}
