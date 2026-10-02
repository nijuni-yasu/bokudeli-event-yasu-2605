import { describe, expect, it } from 'vitest'
import { CommunityForm } from './CommunityForm.js'

describe('CommunityForm', () => {
  it('定義バージョンが無い既存データは 1 として読む', () => {
    const form = new CommunityForm('form-1', {
      community_id: 'c1',
      name: '事前アンケート',
      fields: [],
      created_by: 'u1',
      updated_by: 'u1',
    })
    expect(form.definition_version).toBe(1)
    expect(form.toFirestore()).toEqual(
      expect.objectContaining({
        definition_version: 1,
      }),
    )
  })
})
