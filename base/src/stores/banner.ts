import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  doc,
  onSnapshot,
  type SnapshotOptions,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@shokujii/base/firebase.js'
import { Banners, type Banner } from '@shokujii/common/schemas/Banners.js'
import { FIRESTORE_LOADING } from '@shokujii/base/utils/const.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'
import { createFirestoreListenRetry, type FirestoreListenRetry } from '@shokujii/base/utils/firestoreListenRetry.js'

const bannersConverter: FirestoreDataConverter<Banners> = {
  toFirestore(banners: Banners): DocumentData {
    return banners.toFirestore()
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Banners {
    return new Banners(snapshot.id, snapshot.data(options))
  },
}

export type BannersStore = ReturnType<typeof useBannersStore>
export const useBannersStore = (target: Banners | string) => {
  let bannersId: string
  if (target instanceof Banners) {
    bannersId = target.id
  } else {
    bannersId = target
  }
  const useStore = defineStore(`/assets/${bannersId}`, () => {
    const bannersRef = doc(db, 'assets', bannersId).withConverter(bannersConverter)
    const _banners = ref<Banner[] | typeof FIRESTORE_LOADING | undefined>(
      target instanceof Banners ? target.banners : FIRESTORE_LOADING,
    )

    const listenHolder: { current: FirestoreListenRetry | null } = { current: null }
    let reportedBannerError = false
    listenHolder.current = createFirestoreListenRetry(
      ({ onError }) =>
        onSnapshot(
          bannersRef,
          (snapshot) => {
            listenHolder.current?.markHealthy()
            reportedBannerError = false
            try {
              _banners.value = snapshot.exists() ? snapshot.data().banners : undefined
            } catch (err) {
              console.error(err)
              reportClientError(err, { documentPath: snapshot.ref.path, severity: 'warn' })
              if (_banners.value === FIRESTORE_LOADING) {
                _banners.value = undefined
              }
            }
          },
          onError,
        ),
      {
        onError: (err) => {
          console.error('subscribeBanners snapshot error', err)
          if (reportedBannerError) {
            return
          }
          reportedBannerError = true
          reportClientError(err, { documentPath: `assets/${bannersId}`, severity: 'warn' })
        },
        onGiveUp: () => {
          if (_banners.value === FIRESTORE_LOADING) {
            _banners.value = undefined
          }
        },
      },
    )
    // computed の副作用にすると、失敗後に再評価されず FIRESTORE_LOADING のまま残る
    listenHolder.current.ensure()

    const banners = computed(() => _banners.value)
    return {
      banners,
    }
  })
  return useStore()
}
