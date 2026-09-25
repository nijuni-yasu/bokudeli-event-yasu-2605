import {
  DocumentData,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Transaction,
} from 'firebase-admin/firestore'
import { CHAT_UNREAD_MAIL_STATE_DOC_ID, ChatUnreadMailState } from '@shokujii/common/schemas/ChatUnreadMailState.js'
import type { ChatMembership } from '@shokujii/common/schemas/ChatMembership.js'
import { shouldSendChatUnreadMail, type ChatUnreadMailSkipReason } from '../utils/chatUnreadMail.js'

class ChatUnreadMailStateConverter implements FirestoreDataConverter<ChatUnreadMailState> {
  toFirestore(state: ChatUnreadMailState): DocumentData {
    return state.toFirestore()
  }
  fromFirestore(snapshot: QueryDocumentSnapshot): ChatUnreadMailState {
    return new ChatUnreadMailState(snapshot.id, snapshot.data())
  }
}

export const getChatUnreadMailStateRef = (userId: string) => {
  return getFirestore()
    .collection('users')
    .doc(userId)
    .collection('notification_states')
    .doc(CHAT_UNREAD_MAIL_STATE_DOC_ID)
    .withConverter(new ChatUnreadMailStateConverter())
}

export const getChatUnreadMailState = async (
  userId: string,
  transaction?: Transaction,
): Promise<ChatUnreadMailState | undefined> => {
  const ref = getChatUnreadMailStateRef(userId)
  const snapshot = await (transaction === undefined ? ref.get() : transaction.get(ref))
  return snapshot.exists ? snapshot.data() : undefined
}

export const saveChatUnreadMailState = async (
  userId: string,
  state: ChatUnreadMailState,
  transaction?: Transaction,
): Promise<void> => {
  const ref = getChatUnreadMailStateRef(userId)
  if (transaction === undefined) {
    await ref.set(state)
  } else {
    transaction.set(ref, state)
  }
}

export const deleteChatUnreadMailState = async (userId: string, transaction?: Transaction): Promise<void> => {
  const ref = getChatUnreadMailStateRef(userId)
  if (transaction === undefined) {
    await ref.delete()
  } else {
    transaction.delete(ref)
  }
}

export type ChatUnreadMailSendClaim =
  | { claimed: false; reason: ChatUnreadMailSkipReason }
  | { claimed: true; previousLastSentAt: number | undefined }

/** 送信条件を再評価し、通る場合だけ `last_sent_at` を今に進めて送信権を取る */
export const claimChatUnreadMailSendSlot = async (
  userId: string,
  nowMillis: number,
  unreadMemberships: Pick<ChatMembership, 'last_message_at' | 'unread_count' | 'is_active'>[],
): Promise<ChatUnreadMailSendClaim> => {
  return getFirestore().runTransaction(async (transaction) => {
    const state = await getChatUnreadMailState(userId, transaction)
    const decision = shouldSendChatUnreadMail({
      nowMillis,
      lastSentAt: state?.last_sent_at,
      unreadMemberships,
    })
    if (!decision.send) {
      return { claimed: false, reason: decision.reason }
    }

    await saveChatUnreadMailState(
      userId,
      new ChatUnreadMailState(CHAT_UNREAD_MAIL_STATE_DOC_ID, { last_sent_at: nowMillis }),
      transaction,
    )
    return { claimed: true, previousLastSentAt: state?.last_sent_at }
  })
}

/** 送信に失敗したとき、確保前の `last_sent_at` に戻す。初回ならドキュメントを消す */
export const releaseChatUnreadMailSendSlot = async (
  userId: string,
  previousLastSentAt: number | undefined,
): Promise<void> => {
  if (previousLastSentAt == null) {
    await deleteChatUnreadMailState(userId)
    return
  }
  await saveChatUnreadMailState(
    userId,
    new ChatUnreadMailState(CHAT_UNREAD_MAIL_STATE_DOC_ID, { last_sent_at: previousLastSentAt }),
  )
}
