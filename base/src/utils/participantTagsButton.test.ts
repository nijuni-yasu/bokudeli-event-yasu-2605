import { describe, expect, it } from 'vitest'
import { resolveParticipantTagsButtonClick, shouldShowParticipantTagsButton } from './participantTagsButton.js'

describe('shouldShowParticipantTagsButton', () => {
  it('氏名公開なら常に表示', () => {
    expect(shouldShowParticipantTagsButton({ isShowMember: true })).toBe(true)
  })

  it('氏名非公開なら出さない', () => {
    expect(shouldShowParticipantTagsButton({ isShowMember: false })).toBe(false)
  })
})

describe('resolveParticipantTagsButtonClick', () => {
  it('未設定かつタグ行が閉じている押下は開いて案内', () => {
    expect(
      resolveParticipantTagsButtonClick({
        tagsVisible: false,
        isLoggedIn: true,
        myTagsReady: true,
        myTagCount: 0,
      }),
    ).toBe('reveal-and-prompt')
  })

  it('未設定かつタグ行が開いている押下は隠す', () => {
    expect(
      resolveParticipantTagsButtonClick({
        tagsVisible: true,
        isLoggedIn: true,
        myTagsReady: true,
        myTagCount: 0,
      }),
    ).toBe('hide')
  })

  it('設定済みは開閉', () => {
    expect(
      resolveParticipantTagsButtonClick({
        tagsVisible: false,
        isLoggedIn: true,
        myTagsReady: true,
        myTagCount: 2,
      }),
    ).toBe('reveal')
    expect(
      resolveParticipantTagsButtonClick({
        tagsVisible: true,
        isLoggedIn: true,
        myTagsReady: true,
        myTagCount: 2,
      }),
    ).toBe('hide')
  })

  it('未ログインとユーザードキュメント未取得は開閉だけ', () => {
    expect(
      resolveParticipantTagsButtonClick({
        tagsVisible: false,
        isLoggedIn: false,
        myTagsReady: false,
        myTagCount: 0,
      }),
    ).toBe('reveal')
    expect(
      resolveParticipantTagsButtonClick({
        tagsVisible: false,
        isLoggedIn: true,
        myTagsReady: false,
        myTagCount: 0,
      }),
    ).toBe('reveal')
  })
})
