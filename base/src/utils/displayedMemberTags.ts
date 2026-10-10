/**
 * 参加者カードに出すタグ。
 * イベント詳細の参加者プロフィールは一度取得したスナップショットなので、
 * 自分のカードだけ購読中のプロフィールタグを使う。
 */
export function resolveDisplayedMemberTags(input: {
  memberUserId: string
  memberTags: readonly string[] | undefined
  currentUserId: string | null | undefined
  /** 未取得のときは undefined。空配列は取得済みで 0 件 */
  currentUserTags: readonly string[] | null | undefined
}): string[] {
  const isCurrentUser = input.currentUserId != null && input.memberUserId === input.currentUserId
  if (isCurrentUser && input.currentUserTags != null) {
    return [...input.currentUserTags]
  }
  return [...(input.memberTags ?? [])]
}
