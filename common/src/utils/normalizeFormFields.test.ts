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
