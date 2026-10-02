import { describe, expect, it } from 'vitest'
import { normalizeFormFields } from './normalizeFormFields.js'

describe('normalizeFormFields', () => {
  it('空白だけの設問名を拒否する', () => {
    const result = normalizeFormFields([
      {
        type: 'text',
        label: '   ',
        required: false,
      },
    ])
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.message).toBe('設問名を入力してください')
    }
  })

  it('非表示の選択肢は定義から外し、残った選択肢のIDは維持する', () => {
    const result = normalizeFormFields(
      [
        {
          field_id: 'fld_role',
          type: 'radio',
          label: '参加区分',
          required: true,
          options: [
            { option_id: 'o_old', label: '旧', hidden_for_new: true },
            { option_id: 'o_host', label: '主催', hidden_for_new: false },
          ],
        },
      ],
      [
        {
          field_id: 'fld_role',
          type: 'radio',
          label: '参加区分',
          description: '',
          required: true,
          hidden_for_new: false,
          options: [
            { option_id: 'o_old', label: '旧', hidden_for_new: true },
            { option_id: 'o_host', label: '主催', hidden_for_new: false },
          ],
        },
      ],
    )
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.fields[0]).toMatchObject({
        field_id: 'fld_role',
        type: 'radio',
        hidden_for_new: false,
      })
      expect(result.fields[0].type === 'radio' && result.fields[0].options).toEqual([
        { option_id: 'o_host', label: '主催', hidden_for_new: false },
      ])
    }
  })

  it('既存定義に無い設問IDは再利用せず新規採番する', () => {
    const result = normalizeFormFields(
      [
        {
          field_id: 'fld_deleted',
          type: 'text',
          label: '新しい設問',
          required: false,
        },
      ],
      [
        {
          field_id: 'fld_keep',
          type: 'text',
          label: '残す設問',
          description: '',
          required: false,
          hidden_for_new: false,
        },
      ],
    )
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.fields[0]?.field_id).not.toBe('fld_deleted')
      expect(result.fields[0]?.field_id).toMatch(/^fld_/)
    }
  })

  it('既存定義に無い選択肢IDは再利用せず新規採番する', () => {
    const result = normalizeFormFields(
      [
        {
          field_id: 'fld_role',
          type: 'radio',
          label: '参加区分',
          required: true,
          options: [{ option_id: 'o_deleted', label: '新規' }],
        },
      ],
      [
        {
          field_id: 'fld_role',
          type: 'radio',
          label: '参加区分',
          description: '',
          required: true,
          hidden_for_new: false,
          options: [{ option_id: 'o_host', label: '主催', hidden_for_new: false }],
        },
      ],
    )
    expect(result.ok).toBe(true)
    if (result.ok && result.fields[0]?.type === 'radio') {
      expect(result.fields[0].options[0]?.option_id).not.toBe('o_deleted')
      expect(result.fields[0].options[0]?.option_id).toMatch(/^opt_/)
    }
  })

  it('必須の選択式設問で表示選択肢が無いと拒否する', () => {
    const result = normalizeFormFields([
      {
        type: 'radio',
        label: '参加区分',
        required: true,
        options: [{ label: '旧', hidden_for_new: true }],
      },
    ])
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.message).toBe('必須の選択式設問には表示する選択肢を1件以上設定してください')
    }
  })
})
