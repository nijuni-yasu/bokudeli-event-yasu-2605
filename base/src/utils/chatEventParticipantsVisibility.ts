import { shouldShowEventParticipantsSection } from '@shokujii/common/utils/eventParticipantsVisibility.js'

export type ChatEventParticipantsVisibilityInput = {
  roomType: string
  participantMetaReady: boolean
  /** null はコミュニティ設定の取得前 */
  isShowMember: boolean | null
  memberCount: number
  enterpriseId?: string | null
  membersVisibleMinCount?: number
}

/**
 * チャットの参加者一覧を出してよいか。
 * イベントページと同じ条件（コミュニティの参加者表示と、PF の表示開始人数）。
 */
export const shouldShowChatEventParticipants = (input: ChatEventParticipantsVisibilityInput): boolean => {
  if (input.roomType !== 'event' || input.participantMetaReady !== true || input.isShowMember !== true) {
    return false
  }
  return shouldShowEventParticipantsSection(
    {
      enterprise_id: input.enterpriseId,
      members_visible_min_count: input.membersVisibleMinCount,
    },
    input.memberCount,
  )
}
