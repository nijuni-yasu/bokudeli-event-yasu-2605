import { ref, computed, watch, toRaw } from 'vue'
import { defineStore } from 'pinia'
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  updateDoc,
  getDoc,
  setDoc,
  query,
  where,
  onSnapshot,
  type DocumentReference,
  type Unsubscribe,
  type FirestoreDataConverter,
  type DocumentData,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from 'firebase/firestore'
import { db } from '@shokujii/base/firebase.js'
import { EventMemberOrder } from '@shokujii/common/schemas/EventMemberOrder.js'
import { EventMenu } from '@shokujii/common/schemas/EventMenu.js'
import { User } from '@shokujii/common/schemas/User.js'
import { getUserRef, useUserStore, type UserStore } from './user.js'
import { Event as _Event } from '@shokujii/common/schemas/Event.js'
import { getAuth } from 'firebase/auth'
import {
  AddToCartRequest,
  RemoveFromCartRequest,
  ConfirmOrderRequest,
  ConfirmOrderResponse,
} from '@shokujii/common/apis/order.js'
import { generateTinymceImageStoragePath, getEventCoverStoragePath } from '@shokujii/common/utils/storagePaths.js'
import {
  addToCart as _addToCart,
  removeFromCart as _removeFromCart,
  confirmOrder as _confirmOrder,
} from '@shokujii/base/apis/order.js'
import { updateEventMenus as _updateEventMenus } from '@shokujii/base/apis/eventMenu.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'
import { createFirestoreListenRetry, type FirestoreListenRetry } from '@shokujii/base/utils/firestoreListenRetry.js'
import { ZodError } from 'zod'
import { copyCommunityCoverToEvent as callCopyCommunityCoverToEvent } from '@shokujii/base/apis/copyCommunityCoverToEvent.js'
import { preparePfEventDraft, type EventDraftPreparer } from '@shokujii/base/stores/eventDraft.js'
export type { EventStoreOptions } from '@shokujii/base/stores/eventStoreOptions.js'
export {
  buildEventStoreOptions,
  resolveEventStoreOptionsFromInjectedEnterpriseId,
} from '@shokujii/base/stores/eventStoreOptions.js'
import type { EventStoreOptions } from '@shokujii/base/stores/eventStoreOptions.js'
import { resizeImage } from '@shokujii/base/utils/image.js'
import { uploadImage, convertStoragePathToURL } from '@shokujii/base/utils/storage.js'

const TINYMCE_MAX_IMAGE_SIZE = 600

/** イベント詳細で同時に users/{uid} を購読する人数。全員分張るとメニュー・バナー購読が失敗しやすい。 */
export const EVENT_DETAIL_MEMBER_PREVIEW_LIMIT = 12

/** メニューの onSnapshot がスナップショットもエラーも返さないとき、この時間で張り直す。 */
const MENU_LISTEN_SILENCE_MS = 8000

/** 詳細カードの並びと同じ。注文 updated_at の最大。注文が無い参加者は 0。 */
export const latestOrderUpdatedAt = (orders: readonly { updated_at: number }[]): number => {
  return orders.reduce((max, order) => Math.max(max, order.updated_at), 0)
}

/**
 * イベント詳細に出す参加者 id。
 * 上限以下はそのまま。注文未取得の間は配列の先頭。取得後は詳細カードと同じ順の先頭だけ。
 */
export const selectPreviewMemberIds = (
  memberIds: readonly string[],
  orders: readonly { user_id: string; updated_at: number }[] | null,
  limit: number = EVENT_DETAIL_MEMBER_PREVIEW_LIMIT,
): string[] => {
  if (memberIds.length <= limit) {
    return [...memberIds]
  }
  if (orders == null) {
    return memberIds.slice(0, limit)
  }
  const latestByUserId = new Map<string, number>()
  for (const order of orders) {
    const latest = latestByUserId.get(order.user_id)
    if (latest == null || order.updated_at > latest) {
      latestByUserId.set(order.user_id, order.updated_at)
    }
  }
  return [...memberIds]
    .sort((memberIdA, memberIdB) => (latestByUserId.get(memberIdA) ?? 0) - (latestByUserId.get(memberIdB) ?? 0))
    .slice(0, limit)
}

class EventRefUpdatedEvent extends Event {
  constructor(
    type: string,
    public eventRef: DocumentReference<BokudeliEvent>,
  ) {
    super(type)
  }
}

/**
 * 将来的にユーティリティ関数などを定義する
 */
export class BokudeliEvent extends _Event {
  constructor(community_id: string, event_id: string | null, src: Partial<_Event>) {
    event_id = event_id ?? doc(collection(db, 'communities', community_id, 'events')).id
    super(event_id, { ...src, community_id })
  }
}

/**
 * 将来的にユーティリティ関数などを定義する
 */
export class BokudeliEventMember extends User {
  // 多重継承が出来ないので CommunityMember のプロパティを手動で追加する
  orders: EventMemberOrder[] = []
}

/**
 * EventMember は UI 上で新規作成はしないので、いまのところコンストラクタを用意しない
 */
export class BokudeliEventMenu extends EventMenu {}

export { prepareEnterpriseEventDraft as applyEnterpriseSubsidySnapshotForDraft } from './eventDraft.js'

// eventList で使用するために export するが、他では使用しないように
export const eventConverter: FirestoreDataConverter<BokudeliEvent> = {
  toFirestore(event: BokudeliEvent): DocumentData {
    const userId = getAuth().currentUser?.uid
    if (userId == null) {
      throw new Error('Not logged in')
    }
    return event.toFirestore(userId)
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): BokudeliEvent {
    const data = snapshot.data(options)
    const community_id = snapshot.ref.parent.parent!.id
    return new BokudeliEvent(community_id, snapshot.id, data)
  },
}

/** communities/{communityId}/events/{eventId} への直接参照（collectionGroup 不使用） */
export const getEventInCommunityRef = (communityId: string, eventId: string) => {
  return doc(db, 'communities', communityId, 'events', eventId).withConverter(eventConverter)
}

/** communities/{communityId}/events/{eventId} を 1 回読む（chat onOpenEvent 等） */
export const fetchEventInCommunityDocument = async (
  communityId: string,
  eventId: string,
): Promise<BokudeliEvent | undefined> => {
  const snapshot = await getDoc(getEventInCommunityRef(communityId, eventId))
  if (!snapshot.exists()) {
    return undefined
  }
  return snapshot.data()
}

const menuConverter: FirestoreDataConverter<EventMenu> = {
  toFirestore(menu: EventMenu): DocumentData {
    return menu.toFirestore()
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): EventMenu {
    const data = snapshot.data(options)
    const event_id = snapshot.ref.parent.parent!.id
    return new EventMenu(event_id, snapshot.id, data)
  },
}

const memberOrderConverter: FirestoreDataConverter<EventMemberOrder> = {
  toFirestore(order: EventMemberOrder): DocumentData {
    return order.toFirestore()
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): EventMemberOrder {
    const data = snapshot.data(options)
    return new EventMemberOrder(snapshot.id, data)
  },
}

export const createNewEvent = async (
  event: BokudeliEvent,
  coverImage: File | null,
  options?: { draftPreparer?: EventDraftPreparer },
): Promise<BokudeliEvent> => {
  const communityRef = doc(db, 'communities', event.community_id)
  const community = await getDoc(communityRef)
  if (!community.exists()) {
    throw new Error(`community ${event.community_id} does not exists`)
  }
  const enterpriseId = community.data()?.enterprise_id as string | null | undefined
  if (enterpriseId != null && enterpriseId !== '' && event.enterprise_id == null) {
    event.enterprise_id = enterpriseId
  }
  const draftPreparer = options?.draftPreparer ?? preparePfEventDraft
  await draftPreparer(event, enterpriseId)
  if (coverImage == null) {
    // Callable でコミュニティカバーをコピー。Storage にコミュニティカバーが無い場合は Callable が失敗し setDoc には進まない。
    await callCopyCommunityCoverToEvent({ communityId: community.id, eventId: event.id })
  } else {
    await uploadImage(coverImage, getEventCoverStoragePath(community.id, event.id))
  }
  const newEventRef = doc(communityRef, 'events', event.id).withConverter(eventConverter)
  await setDoc(newEventRef, event, { merge: true })
  return event
}

export const updateEventMenus = async (
  eventId: string,
  communityId: string,
  selectedMenuIds: string[],
): Promise<void> => {
  await _updateEventMenus({
    eventId,
    communityId,
    selectedMenuIds,
  })
}

export type EventStore = ReturnType<typeof useEventStore>

let defaultEventStoreOptions: EventStoreOptions = {}

export const setDefaultEventStoreOptions = (options: EventStoreOptions): void => {
  defaultEventStoreOptions = options
}

export const getDefaultEventStoreOptions = (): EventStoreOptions => defaultEventStoreOptions

/** PF / enterprise の cart CG 等で使用。partner（default 空）は `'none'` */
export type OrdersEnterpriseIdQueryFilter = string | null | 'none'

export const resolveOrdersEnterpriseIdForQuery = (): OrdersEnterpriseIdQueryFilter => {
  const defaults = getDefaultEventStoreOptions()
  if ('ordersEnterpriseId' in defaults) {
    return defaults.ordersEnterpriseId ?? null
  }
  return 'none'
}

const mergeEventStoreOptions = (options: EventStoreOptions): EventStoreOptions => ({
  ...getDefaultEventStoreOptions(),
  ...options,
})

const resolveEventStorePiniaId = (eventId: string, options: EventStoreOptions): string => {
  const hasOrdersFilter = 'ordersEnterpriseId' in options
  const hasEventsFilter = 'eventsEnterpriseId' in options
  const ordersId = hasOrdersFilter ? options.ordersEnterpriseId : undefined
  const eventsId = hasEventsFilter ? options.eventsEnterpriseId : undefined
  const enterpriseId =
    typeof ordersId === 'string' && ordersId !== ''
      ? ordersId
      : typeof eventsId === 'string' && eventsId !== ''
        ? eventsId
        : null
  let baseId: string
  if (enterpriseId != null && enterpriseId !== '') {
    baseId = `/events/${eventId}/e/${enterpriseId}`
  } else if (hasOrdersFilter || hasEventsFilter) {
    baseId = `/events/${eventId}/pf`
  } else {
    baseId = `/events/${eventId}`
  }
  if (options.skipOrdersEnterpriseFilter === true) {
    return `${baseId}/menu-limit-orders`
  }
  return baseId
}

export const useEventStore = (target: string | BokudeliEvent, options: EventStoreOptions = {}) => {
  let eventId: string
  if (target instanceof BokudeliEvent) {
    eventId = target.id
  } else {
    eventId = target
  }
  const mergedOptions = mergeEventStoreOptions(options)
  const draftPreparer = mergedOptions.draftPreparer ?? preparePfEventDraft
  const piniaStoreId = resolveEventStorePiniaId(eventId, mergedOptions)
  const store = defineStore(piniaStoreId, () => {
    const EVENT_TYPE_EVENT_REF_UPDATED = `onEventRefUpdated_${eventId}`
    const exists = ref<boolean | null>(null)
    const schemaError = ref<unknown>(null)
    const event = ref<BokudeliEvent | null>(target instanceof BokudeliEvent ? target : null)
    const _coverImageCacheBuster = ref(0)
    const _orders = ref<EventMemberOrder[] | null>(null)
    const _memberIds = ref<string[] | null>(null)
    const _memberUserStores = new Map<string, UserStore>()
    const _menus = ref<EventMenu[] | null>(null)
    const _eventRef = ref<DocumentReference<BokudeliEvent> | null>(null)

    watch(
      _eventRef,
      (newValue) => {
        if (newValue == null) {
          throw new Error('_eventRef can be null just as the initial value.')
        }
        document.dispatchEvent(new EventRefUpdatedEvent(EVENT_TYPE_EVENT_REF_UPDATED, toRaw(newValue)))
      },
      { immediate: false },
    )

    const getEventRef = async (): Promise<DocumentReference<BokudeliEvent>> => {
      return new Promise((resolve, reject) => {
        if (_eventRef.value == null) {
          const listener = (event: Event) => {
            document.removeEventListener(EVENT_TYPE_EVENT_REF_UPDATED, listener)
            resolve((event as EventRefUpdatedEvent).eventRef)
          }
          document.addEventListener(EVENT_TYPE_EVENT_REF_UPDATED, listener)
          // Timeout
          window.setTimeout(() => {
            document.removeEventListener(EVENT_TYPE_EVENT_REF_UPDATED, listener)
            reject(new Error('getEventRef timeout'))
          }, 5000)
        } else {
          resolve(toRaw(_eventRef.value))
        }
      })
    }

    const orders = computed<EventMemberOrder[] | null>(() => {
      subscribeOrders()
      return _orders.value
    })

    const menus = computed<EventMenu[] | null>(() => {
      // 参照されたときだけ購読を始める。失敗後の張り直しは retry が行い、再評価されなくても続く。
      ensureMenusSubscription()
      if (_menus.value == null) {
        return null
      }
      return [..._menus.value].sort((a, b) => a.menu_sort_number - b.menu_sort_number)
    })

    const confirmedOrders = computed<EventMemberOrder[] | null>(() => {
      subscribeOrders()
      return _orders.value?.filter((order) => order.status === 'ordered') ?? null
    })

    const getMemberUserStore = (memberId: string): UserStore => {
      let store = _memberUserStores.get(memberId)
      if (store == null) {
        store = useUserStore(memberId)
        _memberUserStores.set(memberId, store)
      }
      return store
    }

    const memberWithOrders = (memberId: string, user: User | null): BokudeliEventMember => {
      const target = _orders.value?.filter((order) => order.user_id === memberId) ?? ([] as EventMemberOrder[])
      const orders = new Proxy(target, {
        get: (target, prop, receiver) => {
          subscribeOrders()
          return Reflect.get(target, prop, receiver)
        },
      })
      const member =
        user == null
          ? // User をローディングする間にダミーの写真を表示するためにダミーユーザーを作成するが、
            // この一時代入は良くないので、明示的にローディング中であることを判断できる仕組みが必要
            new BokudeliEventMember(memberId, { user_name: '' })
          : new BokudeliEventMember(memberId, user)
      member.orders = orders
      return member
    }

    const buildMembers = (memberIds: string[]): BokudeliEventMember[] => {
      return memberIds.flatMap((memberId) => memberWithOrders(memberId, getMemberUserStore(memberId).user))
    }

    /** プレビュー専用。useUserStore は共有なので外すと他画面の購読も切れる */
    const previewUserListeners = new Map<string, FirestoreListenRetry>()
    const previewUsers = ref(new Map<string, User | null>())

    const replacePreviewUsers = (mutate: (draft: Map<string, User | null>) => void): void => {
      const next = new Map(previewUsers.value)
      mutate(next)
      previewUsers.value = next
    }

    const stopPreviewUserListener = (memberId: string): void => {
      previewUserListeners.get(memberId)?.stop()
      previewUserListeners.delete(memberId)
      replacePreviewUsers((draft) => {
        draft.delete(memberId)
      })
    }

    const syncPreviewUserListeners = (memberIds: readonly string[]): void => {
      const keep = new Set(memberIds)
      for (const memberId of [...previewUserListeners.keys()]) {
        if (!keep.has(memberId)) {
          stopPreviewUserListener(memberId)
        }
      }
      for (const memberId of memberIds) {
        if (previewUserListeners.has(memberId)) {
          continue
        }
        const holder: { current: FirestoreListenRetry | null } = { current: null }
        let reportedPreviewUserError = false
        const listen = createFirestoreListenRetry(
          ({ onError }) =>
            onSnapshot(
              getUserRef(memberId),
              (snapshot) => {
                holder.current?.markHealthy()
                reportedPreviewUserError = false
                try {
                  replacePreviewUsers((draft) => {
                    draft.set(memberId, snapshot.data() ?? new User(memberId, {}))
                  })
                } catch (err) {
                  console.error(err)
                  reportClientError(err, { documentPath: `users/${memberId}`, severity: 'warn' })
                }
              },
              onError,
            ),
          {
            onError: (err) => {
              console.error('preview user snapshot error', err)
              if (reportedPreviewUserError) {
                return
              }
              reportedPreviewUserError = true
              reportClientError(err, { documentPath: `users/${memberId}`, severity: 'warn' })
            },
          },
        )
        holder.current = listen
        previewUserListeners.set(memberId, listen)
        listen.ensure()
      }
    }

    const stopPreviewUserListeners = (): void => {
      for (const memberId of [...previewUserListeners.keys()]) {
        stopPreviewUserListener(memberId)
      }
    }

    const members = computed<BokudeliEventMember[] | null>(() => {
      if (_memberIds.value == null) {
        return null
      }
      return buildMembers(_memberIds.value)
    })

    /** イベント詳細の初期表示用。人数に比例して users 購読を張らない */
    const previewMembers = computed<BokudeliEventMember[] | null>(() => {
      if (_memberIds.value == null) {
        return null
      }
      // 並び替えに注文が要る。collection group は 1 購読のまま、user 文書は選んだ人数だけ張る。
      if (_memberIds.value.length > EVENT_DETAIL_MEMBER_PREVIEW_LIMIT) {
        subscribeOrders()
      }
      const ids = selectPreviewMemberIds(_memberIds.value, _orders.value, EVENT_DETAIL_MEMBER_PREVIEW_LIMIT)
      syncPreviewUserListeners(ids)
      const users = previewUsers.value
      return ids.map((memberId) => memberWithOrders(memberId, users.get(memberId) ?? null))
    })

    const coverImageUrl = computed<string | undefined>(() => {
      const communityId = event.value?.community_id
      const eid = event.value?.id
      if (communityId == null || eid == null) {
        return undefined
      }
      const base = convertStoragePathToURL(getEventCoverStoragePath(communityId, eid))
      return _coverImageCacheBuster.value > 0 ? `${base}&t=${_coverImageCacheBuster.value}` : base
    })

    const updateEvent = async (data: BokudeliEvent) => {
      await draftPreparer(data, mergedOptions.eventsEnterpriseId ?? mergedOptions.ordersEnterpriseId ?? null)
      const eventRef = await getEventRef()
      await setDoc(eventRef, data, { merge: true })
    }

    const updateCoverImage = async (coverImage: File) => {
      const eventRef = await getEventRef()
      const communityId = eventRef.parent?.parent?.id
      if (communityId == null) {
        console.warn(`These values must be set. eventRef: ${eventRef} communityId: ${communityId}`)
        return
      }
      await uploadImage(coverImage, getEventCoverStoragePath(communityId, eventId))
      _coverImageCacheBuster.value = Date.now()
    }

    const uploadTinymceImage = async (image: File): Promise<string> => {
      const eventRef = await getEventRef()
      const communityId = eventRef.parent?.parent?.id
      if (communityId == null) {
        console.warn(`These values must be set. eventRef: ${eventRef} communityId: ${communityId}`)
        throw new Error('communityId is undefined. Cannot upload image during new event creation.')
      }
      const resized = await resizeImage(image, TINYMCE_MAX_IMAGE_SIZE)
      const storagePath = generateTinymceImageStoragePath(communityId, eventId)
      await uploadImage(resized, storagePath)
      return convertStoragePathToURL(storagePath)
    }

    const addToCart = async (data: AddToCartRequest): Promise<void> => {
      await _addToCart(data)
    }

    const removeFromCart = async (data: RemoveFromCartRequest): Promise<void> => {
      await _removeFromCart(data)
    }

    const confirmOrder = async (data: ConfirmOrderRequest): Promise<ConfirmOrderResponse> => {
      const result = await _confirmOrder(data)
      return result.data
    }

    const deleteEvent = async (): Promise<void> => {
      return updateDoc(await getEventRef(), { is_deleted: true })
    }

    let pendingLoadedEventReject: ((reason: unknown) => void) | null = null
    let pendingLoadedEventCleanup: (() => void) | null = null

    const rejectPendingLoadedEvent = (reason: unknown) => {
      const reject = pendingLoadedEventReject
      const cleanup = pendingLoadedEventCleanup
      pendingLoadedEventReject = null
      pendingLoadedEventCleanup = null
      cleanup?.()
      reject?.(reason)
    }

    let unsubscribeEvent: Unsubscribe | null = null
    const subscribeEvent = (eventRef: DocumentReference<BokudeliEvent>) => {
      if (unsubscribeEvent == null) {
        unsubscribeEvent = onSnapshot(
          eventRef,
          (doc) => {
            try {
              event.value = doc.data() ?? null
              schemaError.value = null
              _memberIds.value = event.value?.members ?? []
            } catch (err) {
              console.error(err)
              reportClientError(err, { documentPath: doc.ref.path, severity: 'warn' })
              if (err instanceof ZodError) {
                schemaError.value = err
                rejectPendingLoadedEvent(err)
              }
            }
          },
          (err) => {
            console.error('subscribeEvent snapshot error', err)
            reportClientError(err, { documentPath: eventRef.path, severity: 'warn' })
            unsubscribeEvent?.()
            unsubscribeEvent = null
            // 購読が切れた以上 event は更新されないため、待機中の getLoadedEvent を timeout 前に失敗させる
            rejectPendingLoadedEvent(err)
          },
        )
      }
    }

    const ordersListenHolder: { current: FirestoreListenRetry | null } = { current: null }
    let reportedOrdersError = false
    const subscribeOrders = () => {
      if (ordersListenHolder.current == null) {
        ordersListenHolder.current = createFirestoreListenRetry(
          ({ onError }) => {
            const orderConstraints = [where('event_id', '==', eventId)]
            if ('ordersEnterpriseId' in mergedOptions && mergedOptions.skipOrdersEnterpriseFilter !== true) {
              // undefined を渡すと where() が実行時エラーになるため null に正規化する
              orderConstraints.push(where('enterprise_id', '==', mergedOptions.ordersEnterpriseId ?? null))
            }
            const ordersQuery = query(collectionGroup(db, 'member_orders'), ...orderConstraints).withConverter(
              memberOrderConverter,
            )
            return onSnapshot(
              ordersQuery,
              (ordersSnapshot) => {
                ordersListenHolder.current?.markHealthy()
                reportedOrdersError = false
                _orders.value = ordersSnapshot.docs.flatMap((orderDoc) => {
                  try {
                    return orderDoc.data()
                  } catch (err) {
                    console.error(err)
                    reportClientError(err, { documentPath: orderDoc.ref.path, severity: 'warn' })
                    return []
                  }
                })
              },
              onError,
            )
          },
          {
            onError: (err) => {
              console.error('subscribeOrders snapshot error', err)
              if (reportedOrdersError) {
                return
              }
              reportedOrdersError = true
              reportClientError(err, { documentPath: `events/${eventId}/member_orders`, severity: 'warn' })
            },
          },
        )
      }
      ordersListenHolder.current.ensure()
    }

    const menusListenHolder: { current: FirestoreListenRetry | null } = { current: null }
    let reportedMenusError = false
    const subscribeMenus = (eventRef: DocumentReference) => {
      if (menusListenHolder.current == null) {
        const menusRef = collection(eventRef, 'menus').withConverter(menuConverter)
        menusListenHolder.current = createFirestoreListenRetry(
          ({ onError }) =>
            onSnapshot(
              menusRef,
              (menusSnapshot) => {
                menusListenHolder.current?.markHealthy()
                reportedMenusError = false
                _menus.value = menusSnapshot.docs.flatMap((m) => {
                  try {
                    return m.data()
                  } catch (err) {
                    console.error(err)
                    reportClientError(err, { documentPath: m.ref.path, severity: 'warn' })
                    return []
                  }
                })
              },
              onError,
            ),
          {
            onError: (err) => {
              console.error('subscribeMenus snapshot error', err)
              if (reportedMenusError) {
                return
              }
              reportedMenusError = true
              reportClientError(err, { documentPath: `${eventRef.path}/menus`, severity: 'warn' })
            },
            onGiveUp: () => {
              if (_menus.value == null) {
                _menus.value = []
              }
            },
            silenceTimeoutMs: MENU_LISTEN_SILENCE_MS,
          },
        )
      }
      menusListenHolder.current.ensure()
    }

    /** menus を読んだ、または getLoadedMenus を待ったあとに true。一覧カードだけでは購読しない。 */
    let menusRequested = false
    const ensureMenusSubscription = (): void => {
      menusRequested = true
      const eventRef = _eventRef.value
      if (eventRef == null) {
        return
      }
      subscribeMenus(toRaw(eventRef))
    }

    /**
     * Wait for the event to be loaded.
     * It's better not to use this method in UI components because of the performance issue.
     *
     * @param timeout [ms]
     * @returns Promise<BokudeliEvent> when the event is loaded
     * @throws Error when the event is not loaded within the timeout
     */
    const getLoadedEvent = async (timeout: number = 5000): Promise<BokudeliEvent> => {
      return await new Promise((resolve, reject) => {
        let unwatch: (() => void) | undefined
        const cleanup = () => {
          clearTimeout(timeoutId)
          unwatch?.()
          if (pendingLoadedEventReject === reject) {
            pendingLoadedEventReject = null
            pendingLoadedEventCleanup = null
          }
        }
        const timeoutId = setTimeout(() => {
          cleanup()
          reject(new Error(`Event not loaded within ${timeout}ms`))
        }, timeout)
        pendingLoadedEventReject = reject
        pendingLoadedEventCleanup = cleanup
        unwatch = watch(
          event,
          (e) => {
            if (e != null) {
              cleanup()
              resolve(e)
            }
          },
          { immediate: true },
        )
      })
    }

    /**
     * Wait for the members to be loaded.
     * It's better not to use this method in UI components because of the performance issue.
     *
     * @param timeout [ms]
     * @returns Promise<BokudeliEventMember[]> when the members are loaded
     * @throws Error when the members are not loaded within the timeout
     */
    const getLoadedMembers = async (timeout: number = 5000): Promise<BokudeliEventMember[]> => {
      return await new Promise((resolve, reject) => {
        let unwatch: (() => void) | undefined
        const timeoutId = setTimeout(() => {
          unwatch?.()
          reject(new Error(`Members not loaded within ${timeout}ms`))
        }, timeout)
        unwatch = watch(
          members,
          (ms) => {
            if (ms != null) {
              clearTimeout(timeoutId)
              unwatch?.()
              resolve(ms)
            }
          },
          { immediate: true },
        )
      })
    }

    /**
     * Wait for the menus to be loaded.
     * It's better not to use this method in UI components because of the performance issue.
     *
     * @param timeout [ms]
     * @returns Promise<EventMenu[]> when the menus are loaded
     * @throws Error when the menus are not loaded within the timeout
     */
    const getLoadedMenus = async (timeout: number = 5000): Promise<EventMenu[]> => {
      ensureMenusSubscription()
      return await new Promise((resolve, reject) => {
        let unwatch: (() => void) | undefined
        const timeoutId = setTimeout(() => {
          unwatch?.()
          reject(new Error(`Menus not loaded within ${timeout}ms`))
        }, timeout)
        unwatch = watch(
          menus,
          (ms) => {
            if (ms != null) {
              clearTimeout(timeoutId)
              unwatch?.()
              resolve(ms)
            }
          },
          { immediate: true },
        )
      })
    }

    let retry = 0
    let subscribeSession = 0
    let subscribeRetryTimer: ReturnType<typeof setTimeout> | null = null
    /** getDocs で event ref を解決している間は、同じ store への再入で二重に購読を始めない */
    let resolvingEventRef = false

    const subscribe = () => {
      if (resolvingEventRef || unsubscribeEvent != null) {
        return
      }
      resolvingEventRef = true
      const session = subscribeSession
      const eventConstraints = [where('event_id', '==', eventId)]
      if ('eventsEnterpriseId' in mergedOptions) {
        // undefined を渡すと where() が実行時エラーになるため null に正規化する
        eventConstraints.push(where('enterprise_id', '==', mergedOptions.eventsEnterpriseId ?? null))
      }
      getDocs(query(collectionGroup(db, 'events'), ...eventConstraints).withConverter(eventConverter))
        .then((querySnapshot) => {
          if (session !== subscribeSession) {
            return
          }
          resolvingEventRef = false
          const eventRef = querySnapshot.docs[0]?.ref?.withConverter(eventConverter)
          if (eventRef == null) {
            if (retry++ < 16) {
              console.warn(
                `The event "${eventId}" does not exist. It may not have been created yet. It will retry in 500 ms.`,
              )
              subscribeRetryTimer = setTimeout(() => {
                subscribeRetryTimer = null
                subscribe()
              }, 500)
              return
            }
            exists.value = false
            console.error(`The event "${eventId}" does not exist. It ceased attempting to retry.`)
            // TODO: マイページ動作しないため、一時的にコメントアウト
            // router.replace('/404')
            return
          }
          retry = 0
          _eventRef.value = eventRef
          subscribeEvent(eventRef)
          // メニューをまだ読んでいなければ張らない。読んだあとの ref 解決ではここで開始する。
          if (menusRequested) {
            subscribeMenus(eventRef)
          }
        })
        .catch((err) => {
          if (session !== subscribeSession) {
            return
          }
          resolvingEventRef = false
          console.error('event subscribe getDocs error', err)
          reportClientError(err, { documentPath: `events/${eventId}`, severity: 'warn' })
        })
    }

    const unsubscribe = () => {
      subscribeSession += 1
      resolvingEventRef = false
      if (subscribeRetryTimer != null) {
        clearTimeout(subscribeRetryTimer)
        subscribeRetryTimer = null
      }
      retry = 0
      unsubscribeEvent?.()
      unsubscribeEvent = null
      ordersListenHolder.current?.stop()
      ordersListenHolder.current = null
      reportedOrdersError = false
      menusListenHolder.current?.stop()
      menusListenHolder.current = null
      reportedMenusError = false
      stopPreviewUserListeners()
    }

    /** 画面再入場時。Pinia store は残るが unsubscribe 後は listener を張り直す */
    const ensureSubscribed = (): void => {
      const eventRef = _eventRef.value
      if (eventRef != null) {
        subscribeEvent(toRaw(eventRef))
        if (menusRequested) {
          subscribeMenus(toRaw(eventRef))
        }
        return
      }
      subscribe()
    }

    /**
     * 一覧が取得した文書を、購読していない store に反映する。
     * ライブ購読中はスナップショットを正とし、取得結果では上書きしない。
     */
    const applyListedEvent = (listed: BokudeliEvent): void => {
      if (unsubscribeEvent != null) {
        return
      }
      event.value = listed
    }

    return {
      event,
      coverImageUrl,
      exists,
      schemaError,
      orders,
      confirmedOrders,
      members,
      previewMembers,
      menus,
      getLoadedEvent,
      getLoadedMembers,
      getLoadedMenus,
      updateEvent,
      updateCoverImage,
      uploadTinymceImage,
      addToCart,
      removeFromCart,
      confirmOrder,
      deleteEvent,
      subscribe,
      unsubscribe,
      ensureSubscribed,
      applyListedEvent,
      $reset: () => {
        unsubscribe()
        subscribe()
      },
    }
  })
  const instance = store()
  // setup は store 初回生成時だけ走る。遅延で先に作られた store でも、通常呼び出しではここで購読を始める。
  if (target instanceof BokudeliEvent) {
    instance.applyListedEvent(target)
  }
  if (mergedOptions.deferLiveSubscription !== true) {
    instance.ensureSubscribed()
  }
  return instance
}
