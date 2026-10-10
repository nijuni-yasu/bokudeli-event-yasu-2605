import { describe, expect, it } from 'vitest'
import { resolveDisplayedMemberTags } from './displayedMemberTags.js'

describe('resolveDisplayedMemberTags', () => {
  it('他の参加者は取得済みのタグを出す', () => {
    expect(
      resolveDisplayedMemberTags({
        memberUserId: 'other',
        memberTags: ['食べ歩き'],
        currentUserId: 'me',
        currentUserTags: ['食べ歩き', 'スタートアップ'],
      }),
    ).toEqual(['食べ歩き'])
  })

  it('自分のカードは購読中のタグを出す', () => {
    expect(
      resolveDisplayedMemberTags({
        memberUserId: 'me',
        memberTags: ['カメラ'],
        currentUserId: 'me',
        currentUserTags: ['カメラ', 'スタートアップ'],
      }),
    ).toEqual(['カメラ', 'スタートアップ'])
  })

  it('購読中のタグが空なら取得済みの自分のタグは出さない', () => {
    expect(
      resolveDisplayedMemberTags({
        memberUserId: 'me',
        memberTags: ['カメラ'],
        currentUserId: 'me',
        currentUserTags: [],
      }),
    ).toEqual([])
  })

  it('自分のタグを外したあとは購読中の一覧から消す', () => {
    expect(
      resolveDisplayedMemberTags({
        memberUserId: 'me',
        memberTags: ['カメラ', 'スタートアップ'],
        currentUserId: 'me',
        currentUserTags: ['カメラ'],
      }),
    ).toEqual(['カメラ'])
  })

  it('プロフィール未取得の自分は取得済みタグに戻す', () => {
    expect(
      resolveDisplayedMemberTags({
        memberUserId: 'me',
        memberTags: ['カメラ'],
        currentUserId: 'me',
        currentUserTags: undefined,
      }),
    ).toEqual(['カメラ'])
  })

  it('未ログインのカードは取得済みタグを出す', () => {
    expect(
      resolveDisplayedMemberTags({
        memberUserId: 'other',
        memberTags: ['カメラ'],
        currentUserId: null,
        currentUserTags: undefined,
      }),
    ).toEqual(['カメラ'])
  })
})
