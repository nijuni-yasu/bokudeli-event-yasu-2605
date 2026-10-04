const SAME_LINE_TOLERANCE_PX = 2

/** 上端座標の列から、指定行数に収まる先頭要素数を返す */
export function visibleCountWithinLines(tops: readonly number[], maxLines: number): number {
  if (tops.length === 0 || maxLines <= 0) {
    return 0
  }
  const lineTops: number[] = []
  for (const top of tops) {
    const known = lineTops.some((lineTop) => Math.abs(lineTop - top) <= SAME_LINE_TOLERANCE_PX)
    if (!known) {
      lineTops.push(top)
    }
  }
  if (lineTops.length <= maxLines) {
    return tops.length
  }
  const overflowTop = lineTops[maxLines]
  if (overflowTop == null) {
    return tops.length
  }
  const index = tops.findIndex((top) => top >= overflowTop - SAME_LINE_TOLERANCE_PX)
  return index < 0 ? tops.length : index
}
