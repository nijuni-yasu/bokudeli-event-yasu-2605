import { describe, expect, it } from 'vitest'
import { recomputeDerived } from './friendsService.js'

describe('recomputeDerived', () => {
  it('returns undefined for empty history', () => {
    expect(recomputeDerived([])).toBeUndefined()
  })

  it('calculates derived fields from single entry', () => {
    const result = recomputeDerived([
      {
        event_id: 'e1',
        community_id: 'c1',
        event_at: 1700000000000,
      },
    ])
    expect(result).toEqual({
      first_met_at: 1700000000000,
      last_met_at: 1700000000000,
      meet_count: 1,
    })
  })

  it('uses min/max event_at and unique event_id count', () => {
    const result = recomputeDerived([
      { event_id: 'e2', community_id: 'c1', event_at: 1702000000000 },
      { event_id: 'e1', community_id: 'c1', event_at: 1700000000000 },
      { event_id: 'e2', community_id: 'c1', event_at: 1703000000000 },
      { event_id: 'e3', community_id: 'c2', event_at: 1701000000000 },
    ])
    expect(result).toEqual({
      first_met_at: 1700000000000,
      last_met_at: 1703000000000,
      meet_count: 3,
    })
  })
})
