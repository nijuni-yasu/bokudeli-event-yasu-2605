import { onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { User } from '@shokujii/common/schemas/User.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'
import { getUserRef } from './user.js'

export type ChatEventParticipantRoster = {
  /** キーが無い間は未取得。null は文書なし、またはそのユーザーの読み取り失敗 */
  usersById: ReadonlyMap<string, User | null>
}

const uniqueMemberIds = (memberIds: readonly string[]): string[] => {
  return [...new Set(memberIds.filter((memberId) => memberId !== ''))]
}

/**
 * 参加者ドロワーを開いている間だけユーザーを購読する。
 * useUserStore は Pinia 上に購読が残るため、ここはローカルな onSnapshot にして閉じたら外す。
 */
export const subscribeChatEventParticipantRoster = (
  memberIds: readonly string[],
  onUpdate: (roster: ChatEventParticipantRoster) => void,
): Unsubscribe => {
  let active = true
  const usersById = new Map<string, User | null>()
  const unsubscribes: Unsubscribe[] = []

  const emit = (): void => {
    if (!active) {
      return
    }
    onUpdate({
      usersById: new Map(usersById),
    })
  }

  const ids = uniqueMemberIds(memberIds)
  for (const memberId of ids) {
    const unsubscribeUser = onSnapshot(
      getUserRef(memberId),
      (snapshot) => {
        try {
          usersById.set(memberId, snapshot.exists() ? snapshot.data() : null)
        } catch (err) {
          console.error(err)
          reportClientError(err, { documentPath: `users/${memberId}`, severity: 'warn' })
          usersById.set(memberId, null)
        }
        emit()
      },
      (err) => {
        console.error('subscribe chat participant user', err)
        reportClientError(err, { documentPath: `users/${memberId}`, severity: 'warn' })
        usersById.set(memberId, null)
        emit()
      },
    )
    unsubscribes.push(unsubscribeUser)
  }
  emit()

  return () => {
    active = false
    for (const unsubscribe of unsubscribes) {
      unsubscribe()
    }
  }
}
