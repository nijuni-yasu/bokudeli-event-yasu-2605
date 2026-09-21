import { describe, expect, it } from 'vitest'
import { matchesSearch } from './search'

describe('matchesSearch', () => {
  it('空文字・空白のみは全件一致', () => {
    expect(matchesSearch(['店舗A'], '')).toBe(true)
    expect(matchesSearch(['店舗A'], '   ')).toBe(true)
  })

  it('いずれかのフィールドに部分一致すれば true', () => {
    expect(matchesSearch(['中野カレー', 'shop@example.com'], 'カレー')).toBe(true)
    expect(matchesSearch(['中野カレー', 'shop@example.com'], 'SHOP@')).toBe(true)
  })

  it('どのフィールドにも無ければ false', () => {
    expect(matchesSearch(['中野カレー', null, undefined], 'うどん')).toBe(false)
  })
})
