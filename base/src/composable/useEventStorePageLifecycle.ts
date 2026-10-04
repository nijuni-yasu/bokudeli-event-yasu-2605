import { onMounted, onUnmounted } from 'vue'
import type { EventStore } from '@shokujii/base/stores/event.js'

/** イベント詳細画面の出入りに event store の Firestore 購読を結び付ける */
export const useEventStorePageLifecycle = (eventStore: EventStore): void => {
  onMounted(() => {
    eventStore.ensureSubscribed()
  })
  onUnmounted(() => {
    eventStore.unsubscribe()
  })
}
