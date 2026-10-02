import { describe, expect, it } from 'vitest'
import type { FormField } from '../schemas/formFields.js'
import { nextCommunityFormDefinitionVersion } from './communityFormDefinition.js'

const field: FormField = {
  field_id: 'fld_1',
  type: 'text',
  label: '氏名',
  description: '',
  required: true,
  hidden_for_new: false,
}

describe('nextCommunityFormDefinitionVersion', () => {
  it('名前だけの変更では上げない', () => {
    expect(
      nextCommunityFormDefinitionVersion({
        currentVersion: 2,
        existingFields: [field],
        existingPurpose: '交流のため',
        nextFields: [field],
        nextPurpose: '交流のため',
      }),
    ).toBe(2)
  })

  it('利用目的の前後空白だけが変わっても上げる', () => {
    expect(
      nextCommunityFormDefinitionVersion({
        currentVersion: 2,
        existingFields: [field],
        existingPurpose: '交流のため',
        nextFields: [field],
        nextPurpose: ' 交流のため ',
      }),
    ).toBe(3)
  })

  it('設問または目的文が変わると上げる', () => {
    expect(
      nextCommunityFormDefinitionVersion({
        currentVersion: 2,
        existingFields: [field],
        existingPurpose: '交流のため',
        nextFields: [{ ...field, label: 'お名前' }],
        nextPurpose: '交流のため',
      }),
    ).toBe(3)
    expect(
      nextCommunityFormDefinitionVersion({
        currentVersion: 2,
        existingFields: [field],
        existingPurpose: '交流のため',
        nextFields: [field],
        nextPurpose: '出欠確認',
      }),
    ).toBe(3)
  })
})
