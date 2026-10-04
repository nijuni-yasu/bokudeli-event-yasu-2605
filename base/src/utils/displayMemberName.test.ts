import { describe, expect, it } from 'vitest'
import { isEmailDisplayName, resolveMemberDisplayName } from './displayMemberName.js'

describe('resolveMemberDisplayName', () => {
  it('空の表示名はゲストになる', () => {
    expect(resolveMemberDisplayName(null, 'ゲスト')).toBe('ゲスト')
    expect(resolveMemberDisplayName(undefined, 'ゲスト')).toBe('ゲスト')
    expect(resolveMemberDisplayName('   ', 'ゲスト')).toBe('ゲスト')
  })

  it('メールアドレスそのものはゲストになる', () => {
    expect(isEmailDisplayName('naohiro.yasukawa+2602173@gmail.com')).toBe(true)
    expect(resolveMemberDisplayName('naohiro.yasukawa+2602173@gmail.com', 'ゲスト')).toBe('ゲスト')
  })

  it('名前はそのまま返す', () => {
    expect(resolveMemberDisplayName('桐生 真央', 'ゲスト')).toBe('桐生 真央')
    expect(resolveMemberDisplayName(' yamada taro ', 'ゲスト')).toBe('yamada taro')
  })
})
