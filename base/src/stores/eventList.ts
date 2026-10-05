import { ref } from 'vue'
import { defineStore } from 'pinia'
import { db } from '@shokujii/base/firebase'
import { eventConverter, type BokudeliEvent } from '@shokujii/base/stores/event.js'
import {
  collectionGroup,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  getCountFromServer,
  type QueryDocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore'
import { TaskExecutor } from '@shokujii/base/utils/executors'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'
import { useEventStore, type EventStore } from './event'

export type EventListStore = ReturnType<typeof useEventListStore>

export type EventListStoreOptions = {
  /**
   * true のとき、1ページ取得後に loadedCount < totalCount なら store 側で next() を連鎖する。
   * manage イベント一覧グリッドなど、IncrementalLoader のビューポート判定に依存しない全件読み込み向け。
   */
  autoContinue?: boolean
  /**
   * Pinia store ID の一部。QueryConstraint の JSON.stringify は type しか残らず、
   * 別クエリ同士が衝突することがあるため、画面固有の一覧では明示する。
   */
  storeKey?: string
  /**
   * true のとき、一覧の各 event store は取得済み文書のままにし、onSnapshot を張らない。
   * 参加者アバターを出さないトップ一覧向け。詳細を開いた画面が購読を始める。
   */
  deferEventSubscription?: boolean
}

export const useEventListStore = (
  filters: QueryConstraint[] | null = null,
  pageSize: number = 3,
  options: EventListStoreOptions = {},
) => {
  const storeId =
    options.storeKey != null
      ? `eventList/${options.storeKey}/${pageSize}`
      : filters == null
        ? 'eventList'
        : `eventList/${JSON.stringify(filters)}/${pageSize}`
  const store = defineStore(storeId, () => {
    const paginationExecutor = new TaskExecutor(1)
    const eventStores = ref<EventStore[] | null>(null)
    const totalCount = ref<number | null>(null)
    let currentRequestId = 0

    const eventsSnapsthot: QueryDocumentSnapshot<BokudeliEvent>[] = []

    const next = () => {
      if (filters == null) {
        return
      }
      if (options.autoContinue !== true && paginationExecutor.totalTaskLength > 0) {
        return
      }
      const requestId = currentRequestId
      // autoContinue 時は TaskExecutor が直列実行するため、実行中でも addTask でキューに積む（早期 return すると連鎖が途切れる）
      paginationExecutor.addTask(async () => {
        if (totalCount.value == null) {
          const q = query(collectionGroup(db, 'events'), where('is_deleted', '==', false), ...filters)
          const count = (await getCountFromServer(q)).data().count
          if (requestId !== currentRequestId) {
            return
          }
          totalCount.value = count
        }
        const lastVisibleDocument = eventsSnapsthot[eventsSnapsthot.length - 1]
        const q = query(
          collectionGroup(db, 'events'),
          where('is_deleted', '==', false),
          ...filters,
          ...(lastVisibleDocument == null ? [] : [startAfter(lastVisibleDocument)]),
          limit(pageSize),
        ).withConverter(eventConverter)
        const querySnapshot = await getDocs(q)
        if (requestId !== currentRequestId) {
          return
        }
        eventsSnapsthot.push(...querySnapshot.docs)
        eventStores.value = eventsSnapsthot.flatMap((doc) => {
          try {
            return useEventStore(
              doc.data(),
              options.deferEventSubscription === true ? { deferLiveSubscription: true } : {},
            )
          } catch (err) {
            console.error(err)
            reportClientError(err, { documentPath: doc.ref.path, severity: 'warn' })
            return []
          }
        })
        if (
          options.autoContinue === true &&
          querySnapshot.docs.length > 0 &&
          totalCount.value != null &&
          eventsSnapsthot.length < totalCount.value
        ) {
          next()
        }
      })
    }

    const reload = () => {
      currentRequestId += 1
      paginationExecutor.clear()
      eventsSnapsthot.splice(0) // clear
      eventStores.value = null
      totalCount.value = null
      next()
    }

    reload()

    return {
      totalCount,
      eventStores,
      reload,
      next,
    }
  })
  return store()
}
