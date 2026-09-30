import { describe, expect, it } from 'vitest'
import {
  MENU_DESCRIPTION_MAX_LENGTH,
  MenuDescriptionAppFieldSchema,
  MenuDescriptionDbFieldSchema,
} from './menuDescriptionField.js'

describe('MenuDescriptionFieldSchema', () => {
  it('最大文字数の説明文を受け入れる', () => {
    const description = 'あ'.repeat(MENU_DESCRIPTION_MAX_LENGTH)

    expect(MenuDescriptionDbFieldSchema.parse(description)).toBe(description)
    expect(MenuDescriptionAppFieldSchema.parse(description)).toBe(description)
  })

  it('最大文字数を超える説明文を拒否する', () => {
    const description = 'あ'.repeat(MENU_DESCRIPTION_MAX_LENGTH + 1)

    expect(MenuDescriptionDbFieldSchema.safeParse(description).success).toBe(false)
    expect(MenuDescriptionAppFieldSchema.safeParse(description).success).toBe(false)
  })

  it('前後の空白を除去し、空白だけの説明文をDB保存では拒否する', () => {
    expect(MenuDescriptionDbFieldSchema.parse('  説明文  ')).toBe('説明文')
    expect(MenuDescriptionDbFieldSchema.safeParse('   ').success).toBe(false)
    expect(MenuDescriptionAppFieldSchema.parse('   ')).toBe('')
  })
})
