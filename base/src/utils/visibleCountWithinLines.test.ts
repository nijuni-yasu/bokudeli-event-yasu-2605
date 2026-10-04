import { describe, expect, it } from 'vitest'
import { visibleCountWithinLines } from './visibleCountWithinLines.js'

describe('visibleCountWithinLines', () => {
  it('空、または行数が 0 のときは 0', () => {
    expect(visibleCountWithinLines([], 2)).toBe(0)
    expect(visibleCountWithinLines([0, 24], 0)).toBe(0)
  })

  it('指定行数に収まるときは全件', () => {
    expect(visibleCountWithinLines([0, 0, 24, 24], 2)).toBe(4)
  })

  it('3 行目以降を数えない', () => {
    expect(visibleCountWithinLines([0, 0, 24, 24, 48, 48], 2)).toBe(4)
  })

  it('数 px のずれは同じ行とみなす', () => {
    expect(visibleCountWithinLines([10, 11, 40], 1)).toBe(2)
  })
})
