export type EventParticipantsVisibilitySource = {
  enterprise_id?: string | null
  members_visible_min_count?: number
}

/** 「指定人数に達してから表示」を選んだときの人数初期値（#2289）。新規イベントの初期選択は常時表示（#2395） */
export const DEFAULT_PF_MEMBERS_VISIBLE_MIN_COUNT = 3

export type PfMembersVisibleMode = 'always' | 'threshold'

/** 参加者一覧の表示モードに対応する `members_visible_min_count`。人数指定で未設定なら 3。 */
export function membersVisibleMinCountForMode(
  mode: PfMembersVisibleMode,
  current: number | undefined,
): number | undefined {
  if (mode === 'always') {
    return undefined
  }
  if (current == null) {
    return DEFAULT_PF_MEMBERS_VISIBLE_MIN_COUNT
  }
  return current
}

/**
 * イベント詳細の参加者セクション表示可否。
 * 参加者 0 人のときは PF / enterprise とも非表示。
 * PF: `members_visible_min_count` 未設定は 1 人以上で表示、設定時は閾値以上で表示。
 * enterprise: しきい値設定はなく、1 人以上で表示（#2289）。
 */
export function shouldShowEventParticipantsSection(
  event: EventParticipantsVisibilitySource,
  memberCount: number,
): boolean {
  if (memberCount <= 0) {
    return false
  }
  if (event.enterprise_id != null && event.enterprise_id !== '') {
    return true
  }
  const threshold = event.members_visible_min_count
  if (threshold == null) {
    return true
  }
  return memberCount >= threshold
}
