import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  query,
  startAfter,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from 'firebase/firestore'
import { User } from '@shokujii/common/schemas/User.js'
import { db } from '@shokujii/base/firebase.js'
import { TaskExecutor } from '@shokujii/base/utils/executors.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'

const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return user.toFirestore()
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
    const data = snapshot.data(options)
    return new User(snapshot.id, data)
  },
}

export type UserListStore = ReturnType<typeof useUserListStore>

/**
 * users コレクションのページング付き一覧。運営管理画面（support）のユーザー一覧で使用する。
 * `users` は Rules 上 `allow read: if true` なので、テナント条件は不要。
 */
export const useUserListStore = (filters: QueryConstraint[], pageSize: number = 20) => {
  const store = defineStore(`/userList/${JSON.stringify(filters)}/${pageSize}`, () => {
    const paginationExecutor = new TaskExecutor(1)
    const users = ref<User[] | null>(null)
    const totalCount = ref<number | null>(null)
    const hasMore = ref(true)
    const loadError = ref(false)

    const usersSnapshot: QueryDocumentSnapshot<User>[] = []

    const next = () => {
      if (paginationExecutor.totalTaskLength > 0) {
        return
      }
      paginationExecutor.addTask(async () => {
        try {
          if (totalCount.value == null) {
            totalCount.value = (await getCountFromServer(query(collection(db, 'users'), ...filters))).data().count
          }
          const lastVisibleDocument = usersSnapshot[usersSnapshot.length - 1]
          const q = query(
            collection(db, 'users'),
            ...filters,
            ...(lastVisibleDocument == null ? [] : [startAfter(lastVisibleDocument)]),
            limit(pageSize),
          ).withConverter(userConverter)
          const querySnapshot = await getDocs(q)
          if (querySnapshot.docs.length < pageSize) {
            hasMore.value = false
          }
          usersSnapshot.push(...querySnapshot.docs)
          users.value = usersSnapshot.flatMap((userSnapshot) => {
            try {
              return [userSnapshot.data()]
            } catch (err) {
              console.error(err)
              reportClientError(err, { documentPath: userSnapshot.ref.path, severity: 'warn' })
              return []
            }
          })
        } catch (error) {
          console.error('Failed to fetch users:', error)
          reportClientError(error, { componentInfo: 'userList', severity: 'error' })
          loadError.value = true
          hasMore.value = false
          if (users.value == null) {
            users.value = []
          }
        }
      })
    }

    const reload = () => {
      usersSnapshot.splice(0) // clear
      users.value = null
      totalCount.value = null
      hasMore.value = true
      loadError.value = false
      next()
    }

    reload()

    return {
      totalCount,
      users,
      hasMore,
      loadError,
      reload,
      next,
    }
  })
  return store()
}
