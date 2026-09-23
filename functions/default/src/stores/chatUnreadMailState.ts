import {
  DocumentData,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Transaction,
} from 'firebase-admin/firestore'
import { CHAT_UNREAD_MAIL_STATE_DOC_ID, ChatUnreadMailState } from '@shokujii/common/schemas/ChatUnreadMailState.js'

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
