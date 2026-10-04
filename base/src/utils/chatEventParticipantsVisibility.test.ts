import { describe, expect, it } from 'vitest'
import { shouldShowChatEventParticipants } from './chatEventParticipantsVisibility.js'

const readyEvent = {
  roomType: 'event',
  participantMetaReady: true,
  isShowMember: true,
  memberCount: 3,
  enterpriseId: null,
  membersVisibleMinCount: 3,
}

describe('shouldShowChatEventParticipants', () => {
  it('イベントルームで表示条件を満たすと出す', () => {
    expect(shouldShowChatEventParticipants(readyEvent)).toBe(true)
  })

  it('イベント以外のルームでは出さない', () => {
    expect(shouldShowChatEventParticipants({ ...readyEvent, roomType: 'direct' })).toBe(false)
  })

  it('表示メタが揃うまでは出さない', () => {
    expect(shouldShowChatEventParticipants({ ...readyEvent, participantMetaReady: false })).toBe(false)
  })

  it('コミュニティが参加者表示オフなら出さない', () => {
    expect(shouldShowChatEventParticipants({ ...readyEvent, isShowMember: false })).toBe(false)
  })

  it('コミュニティ設定の取得前は出さない', () => {
    expect(shouldShowChatEventParticipants({ ...readyEvent, isShowMember: null })).toBe(false)
  })

  it('PF は表示開始人数未満なら出さない', () => {
    expect(shouldShowChatEventParticipants({ ...readyEvent, memberCount: 2 })).toBe(false)
  })

  it('参加者 0 人では出さない', () => {
    expect(shouldShowChatEventParticipants({ ...readyEvent, memberCount: 0, membersVisibleMinCount: undefined })).toBe(
      false,
    )
  })

  it('enterprise は 1 人以上で出す', () => {
    expect(
      shouldShowChatEventParticipants({
        ...readyEvent,
        memberCount: 1,
        enterpriseId: 'ent-1',
        membersVisibleMinCount: 3,
      }),
    ).toBe(true)
  })
})
