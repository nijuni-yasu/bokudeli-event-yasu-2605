import { describe, expect, it } from 'vitest'
import { EventFormConfig } from './EventFormConfig.js'

describe('EventFormConfig', () => {
  it('旧ドキュメントの設問コピーを読み捨て、フォームIDだけ残す', () => {
    const legacy = {
      source_form_id: 'form-1',
      definition_version: 3,
      purpose: '旧目的',
      fields: [
        {
          field_id: 'fld_1',
          type: 'text',
          label: '氏名',
          description: '',
          required: true,
          hidden_for_new: false,
        },
      ],
      created_at: 1_700_000_000_000,
      updated_at: 1_700_000_000_000,
    }
    const config = new EventFormConfig('current', legacy)
    expect(config.source_form_id).toBe('form-1')
    expect(config).not.toHaveProperty('fields')
    expect(config).not.toHaveProperty('purpose')
    expect(config).not.toHaveProperty('definition_version')
    expect(config.toFirestore()).toEqual(
      expect.objectContaining({
        source_form_id: 'form-1',
      }),
    )
    expect(config.toFirestore()).not.toHaveProperty('fields')
  })
})
