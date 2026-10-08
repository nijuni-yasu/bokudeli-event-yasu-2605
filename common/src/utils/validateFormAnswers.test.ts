import { describe, expect, it } from 'vitest'
import type { FormField } from '../schemas/formFields.js'
import { FormAnswerInputSchema } from '../apis/form.js'
import {
  answersToInputs,
  compactFormAnswerInput,
  formatFormAnswerDisplay,
  hasUnansweredRequiredField,
  validateFormAnswers,
} from './validateFormAnswers.js'

const textField = (overrides?: Partial<FormField> & { type?: 'text' }): FormField => ({
  field_id: 'f_name',
  type: 'text',
  label: '氏名',
  description: '',
  required: true,
  hidden_for_new: false,
  ...overrides,
})

const choiceField = (): FormField => ({
  field_id: 'f_role',
  type: 'radio',
  label: '参加区分',
  description: '',
  required: true,
  hidden_for_new: false,
  options: [
    { option_id: 'o_host', label: '主催', hidden_for_new: false },
    { option_id: 'o_guest', label: 'ゲスト', hidden_for_new: false },
    { option_id: 'o_old', label: '旧選択肢', hidden_for_new: true },
  ],
})

describe('hasUnansweredRequiredField', () => {
  it('必須が未入力のときだけ true を返す', () => {
    const fields = [textField(), textField({ field_id: 'f_note', label: 'メモ', required: false })]
    expect(hasUnansweredRequiredField(fields, [])).toBe(true)
    expect(hasUnansweredRequiredField(fields, [{ field_id: 'f_name', text_value: '   ' }])).toBe(true)
    expect(hasUnansweredRequiredField(fields, [{ field_id: 'f_name', text_value: '山田' }])).toBe(false)
    expect(hasUnansweredRequiredField([choiceField()], [])).toBe(true)
    expect(hasUnansweredRequiredField([choiceField()], [{ field_id: 'f_role', option_id: 'o_host' }])).toBe(false)
    const checkbox: FormField = {
      field_id: 'f_check',
      type: 'checkbox',
      label: '確認',
      description: '',
      required: true,
      hidden_for_new: false,
      options: [{ option_id: 'o_yes', label: 'はい', hidden_for_new: false }],
    }
    expect(hasUnansweredRequiredField([checkbox], [])).toBe(true)
    expect(hasUnansweredRequiredField([checkbox], [{ field_id: 'f_check', option_ids: ['o_yes'] }])).toBe(false)
    expect(hasUnansweredRequiredField([textField({ hidden_for_new: true, required: true })], [])).toBe(false)
  })
})

describe('validateFormAnswers', () => {
  it('必須の空文字を拒否する', () => {
    const result = validateFormAnswers({
      fields: [textField()],
      answers: [{ field_id: 'f_name', text_value: '   ' }],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues[0]).toEqual({ field_id: 'f_name', code: 'required' })
    }
  })

  it('未知の選択肢を拒否する', () => {
    const result = validateFormAnswers({
      fields: [choiceField()],
      answers: [{ field_id: 'f_role', option_id: 'o_unknown' }],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe('unknown_option')
    }
  })

  it('新規では選べない選択肢を拒否する', () => {
    const result = validateFormAnswers({
      fields: [choiceField()],
      answers: [{ field_id: 'f_role', option_id: 'o_old' }],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe('unknown_option')
    }
  })

  it('未知の設問を拒否する', () => {
    const result = validateFormAnswers({
      fields: [textField({ required: false })],
      answers: [{ field_id: 'unknown', text_value: 'x' }],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues[0]).toEqual({ field_id: 'unknown', code: 'unknown_field' })
    }
  })

  it('同じ field_id の回答が複数あると type で拒否する', () => {
    const result = validateFormAnswers({
      fields: [textField()],
      answers: [
        { field_id: 'f_name', text_value: '山田' },
        { field_id: 'f_name', text_value: '佐藤' },
      ],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.issues).toEqual([{ field_id: 'f_name', code: 'type' }])
  })

  it('短文の上限を超える回答を拒否する', () => {
    const result = validateFormAnswers({
      fields: [textField()],
      answers: [{ field_id: 'f_name', text_value: 'あ'.repeat(201) }],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe('too_long')
    }
  })

  it('定義バージョン不一致を拒否する', () => {
    const result = validateFormAnswers({
      fields: [textField({ required: false })],
      answers: [],
      definitionVersion: 2,
      expectedDefinitionVersion: 1,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe('version_mismatch')
    }
  })

  it('設問タイプと異なる回答形を拒否する', () => {
    const checkbox: FormField = {
      field_id: 'f_check',
      type: 'checkbox',
      label: '希望',
      description: '',
      required: false,
      hidden_for_new: false,
      options: [{ option_id: 'o1', label: '昼', hidden_for_new: false }],
    }
    const result = validateFormAnswers({
      fields: [checkbox],
      answers: [{ field_id: 'f_check', text_value: '昼' }],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues[0]).toEqual({ field_id: 'f_check', code: 'type' })
    }
  })

  it('checkbox の重複 option_id を拒否する', () => {
    const checkbox: FormField = {
      field_id: 'f_check',
      type: 'checkbox',
      label: '希望',
      description: '',
      required: false,
      hidden_for_new: false,
      options: [
        { option_id: 'o1', label: '昼', hidden_for_new: false },
        { option_id: 'o2', label: '夜', hidden_for_new: false },
      ],
    }
    const result = validateFormAnswers({
      fields: [checkbox],
      answers: [{ field_id: 'f_check', option_ids: ['o1', 'o1'] }],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues[0]).toEqual({ field_id: 'f_check', code: 'type' })
    }
  })

  it('任意項目だけのフォームは空回答を許可する', () => {
    const result = validateFormAnswers({
      fields: [textField({ required: false })],
      answers: [],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.answers).toEqual([])
    }
  })

  it('有効な回答のスナップショットを作る', () => {
    const result = validateFormAnswers({
      fields: [textField(), choiceField()],
      answers: [
        { field_id: 'f_name', text_value: '山田' },
        { field_id: 'f_role', option_id: 'o_guest' },
      ],
      definitionVersion: 1,
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.answers[0]?.text_value).toBe('山田')
      expect(result.answers[1]?.option_labels?.[0]?.label).toBe('ゲスト')
      expect(formatFormAnswerDisplay(result.answers[1]!)).toBe('ゲスト')
      const input = answersToInputs(result.answers)[0]
      expect(input?.text_value).toBe('山田')
      expect(input).not.toHaveProperty('option_id')
      expect(input).not.toHaveProperty('option_ids')
      expect(
        compactFormAnswerInput({
          field_id: 'f_name',
          text_value: undefined,
          option_id: '',
          option_ids: [],
        }),
      ).toEqual({ field_id: 'f_name' })
      expect(
        FormAnswerInputSchema.parse({
          field_id: 'f_name',
          text_value: null,
          option_id: null,
          option_ids: null,
        }),
      ).toEqual({ field_id: 'f_name' })
    }
  })

  it('メールと日付の形式を検証する', () => {
    const fields: FormField[] = [
      {
        field_id: 'f_mail',
        type: 'email',
        label: 'メール',
        description: '',
        required: true,
        hidden_for_new: false,
      },
      {
        field_id: 'f_date',
        type: 'date',
        label: '日付',
        description: '',
        required: true,
        hidden_for_new: false,
      },
    ]
    const invalid = validateFormAnswers({
      fields,
      answers: [
        { field_id: 'f_mail', text_value: 'not-mail' },
        { field_id: 'f_date', text_value: '2026/10/01' },
      ],
      definitionVersion: 1,
    })
    expect(invalid.ok).toBe(false)

    const valid = validateFormAnswers({
      fields,
      answers: [
        { field_id: 'f_mail', text_value: 'a@example.com' },
        { field_id: 'f_date', text_value: '2026-10-01' },
      ],
      definitionVersion: 1,
    })
    expect(valid.ok).toBe(true)
  })
})
