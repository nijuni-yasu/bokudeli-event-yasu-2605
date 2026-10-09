import { describe, expect, it } from 'vitest'
import { resolveParticipantTagsButtonClick, shouldShowParticipantTagsButton } from './participantTagsButton.js'

const visibleBase = {
  isShowMember: true,
  isCurrentUserParticipant: false,
  previewProfilesReady: true,
  previewHasAnyTags: true,
}

describe('shouldShowParticipantTagsButton', () => {
  it('非参加者かつタグなしなら非表示', () => {
    expect(shouldShowParticipantTagsButton({ ...visibleBase, previewHasAnyTags: false })).toBe(false)
  })

  it('非参加者でも誰かにタグがあれば表示', () => {
    expect(shouldShowParticipantTagsButton(visibleBase)).toBe(true)
  })

  it('タグが無くても自分が参加者なら表示', () => {
    expect(
      shouldShowParticipantTagsButton({
        ...visibleBase,
        isCurrentUserParticipant: true,
        previewHasAnyTags: false,
        previewProfilesReady: false,
      }),
    ).toBe(true)
  })

  it('プロフィール未取得の非参加者は非表示のまま', () => {
    expect(shouldShowParticipantTagsButton({ ...visibleBase, previewProfilesReady: false })).toBe(false)
  })

  it('氏名非公開なら出さない', () => {
    expect(shouldShowParticipantTagsButton({ ...visibleBase, isShowMember: false })).toBe(false)
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
