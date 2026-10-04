import { onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { getEventCoverStoragePath } from '@shokujii/common/utils/storagePaths.js'
import { convertStoragePathToURL } from '@shokujii/base/utils/storage.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'
import { getCommunityRef } from './community.js'
import { getEventInCommunityRef } from './event.js'

export type RoomDisplayMeta = {
  displayTitle: string
  displayTitleReady: boolean
  coverImageUrl?: string
  /** イベントの members。参加者ドロワーを開くまで users は購読しない */
  memberIds: string[]
  eventMaxPeople: number
  membersVisibleMinCount?: number
  enterpriseId?: string | null
  communityAccount: string
  /** null はコミュニティ文書の取得前 */
  isShowMember: boolean | null
  participantMetaReady: boolean
}

type EventDisplaySlot = {
  communityId: string
  ready: boolean
  title: string
  coverImageUrl?: string
  memberIds: string[]
  eventMaxPeople: number
  membersVisibleMinCount?: number
  enterpriseId?: string | null
  communityAccount: string
}

const cache = new Map<string, RoomDisplayMeta>()
const slots = new Map<string, EventDisplaySlot>()
const listeners = new Map<string, Unsubscribe>()
const subscriberSets = new Map<string, Set<(meta: RoomDisplayMeta) => void>>()
const eventKeysByCommunity = new Map<string, Set<string>>()
const communityListeners = new Map<string, Unsubscribe>()
/** キーが無い間は未取得。false は「非表示」または読み取り失敗 */
const showMemberByCommunity = new Map<string, boolean>()

const eventCacheKey = (communityId: string, eventId: string): string => `${communityId}_${eventId}`

const readShowMember = (communityId: string): boolean | null => {
  if (!showMemberByCommunity.has(communityId)) {
    return null
  }
  return showMemberByCommunity.get(communityId) === true
}

const toMeta = (slot: EventDisplaySlot): RoomDisplayMeta => {
  const isShowMember = readShowMember(slot.communityId)
  return {
    displayTitle: slot.title,
    displayTitleReady: slot.ready,
    coverImageUrl: slot.coverImageUrl,
    memberIds: slot.memberIds,
    eventMaxPeople: slot.eventMaxPeople,
    membersVisibleMinCount: slot.membersVisibleMinCount,
    enterpriseId: slot.enterpriseId,
    communityAccount: slot.communityAccount,
    isShowMember,
    participantMetaReady: slot.ready && isShowMember != null,
  }
}

const notifySubscribers = (key: string): void => {
  const slot = slots.get(key)
  if (slot == null) {
    return
  }
  const meta = toMeta(slot)
  cache.set(key, meta)
  const subscribers = subscriberSets.get(key)
  if (subscribers == null) {
    return
  }
  for (const callback of subscribers) {
    callback(meta)
  }
}

const notifyCommunity = (communityId: string): void => {
  const keys = eventKeysByCommunity.get(communityId)
  if (keys == null) {
    return
  }
  for (const key of keys) {
    notifySubscribers(key)
  }
}

const ensureCommunityListener = (communityId: string): void => {
  if (communityListeners.has(communityId)) {
    return
  }
  const unsubscribe = onSnapshot(
    getCommunityRef(communityId),
    (snapshot) => {
      try {
        if (!snapshot.exists()) {
          showMemberByCommunity.set(communityId, false)
        } else {
          showMemberByCommunity.set(communityId, snapshot.data().is_show_member)
        }
      } catch (err) {
        console.error(err)
        reportClientError(err, { documentPath: `communities/${communityId}`, severity: 'warn' })
        showMemberByCommunity.set(communityId, false)
      }
      notifyCommunity(communityId)
    },
    (err) => {
      console.error('subscribe community for chat participants', err)
      reportClientError(err, { documentPath: `communities/${communityId}`, severity: 'warn' })
      showMemberByCommunity.set(communityId, false)
      notifyCommunity(communityId)
    },
  )
  communityListeners.set(communityId, unsubscribe)
}

const trackCommunity = (communityId: string, eventKey: string): void => {
  let keys = eventKeysByCommunity.get(communityId)
  if (keys == null) {
    keys = new Set()
    eventKeysByCommunity.set(communityId, keys)
  }
  keys.add(eventKey)
  ensureCommunityListener(communityId)
}

const untrackCommunity = (communityId: string, eventKey: string): void => {
  const keys = eventKeysByCommunity.get(communityId)
  if (keys == null) {
    return
  }
  keys.delete(eventKey)
  if (keys.size > 0) {
    return
  }
  eventKeysByCommunity.delete(communityId)
  communityListeners.get(communityId)?.()
  communityListeners.delete(communityId)
  showMemberByCommunity.delete(communityId)
}

const emptySlot = (communityId: string): EventDisplaySlot => {
  return {
    communityId,
    ready: false,
    title: '',
    memberIds: [],
    eventMaxPeople: 0,
    communityAccount: '',
  }
}

const markEventUnavailable = (slot: EventDisplaySlot): void => {
  slot.ready = true
  slot.title = ''
  slot.coverImageUrl = undefined
  slot.memberIds = []
  slot.eventMaxPeople = 0
  slot.membersVisibleMinCount = undefined
  slot.enterpriseId = undefined
  slot.communityAccount = ''
}

const ensureEventListener = (communityId: string, eventId: string): void => {
  const key = eventCacheKey(communityId, eventId)
  if (listeners.has(key)) {
    return
  }

  const ref = getEventInCommunityRef(communityId, eventId)
  const unsubscribe = onSnapshot(
    ref,
    (snapshot) => {
      const slot = slots.get(key) ?? emptySlot(communityId)
      slots.set(key, slot)
      if (!snapshot.exists()) {
        markEventUnavailable(slot)
        notifySubscribers(key)
        return
      }
      try {
        const event = snapshot.data()
        const coverPath = getEventCoverStoragePath(communityId, eventId)
        slot.ready = true
        slot.title = event.event_name
        slot.coverImageUrl = convertStoragePathToURL(coverPath)
        slot.memberIds = [...event.members]
        slot.eventMaxPeople = event.event_max_people
        slot.membersVisibleMinCount = event.members_visible_min_count
        slot.enterpriseId = event.enterprise_id
        slot.communityAccount = event.community_account
      } catch (err) {
        console.error(err)
        reportClientError(err, { documentPath: snapshot.ref.path, severity: 'warn' })
        markEventUnavailable(slot)
      }
      notifySubscribers(key)
    },
    () => {
      const slot = slots.get(key) ?? emptySlot(communityId)
      slots.set(key, slot)
      markEventUnavailable(slot)
      notifySubscribers(key)
    },
  )
  listeners.set(key, unsubscribe)
}

export const subscribeEventRoomDisplay = (
  communityId: string,
  eventId: string,
  onUpdate: (meta: RoomDisplayMeta) => void,
): Unsubscribe => {
  const key = eventCacheKey(communityId, eventId)
  let subscribers = subscriberSets.get(key)
  if (subscribers == null) {
    subscribers = new Set()
    subscriberSets.set(key, subscribers)
  }
  subscribers.add(onUpdate)

  if (!slots.has(key)) {
    slots.set(key, emptySlot(communityId))
  }
  trackCommunity(communityId, key)
  ensureEventListener(communityId, eventId)

  const cached = cache.get(key)
  if (cached != null) {
    onUpdate(cached)
  } else {
    const slot = slots.get(key)
    if (slot != null) {
      onUpdate(toMeta(slot))
    }
  }

  return () => {
    const current = subscriberSets.get(key)
    current?.delete(onUpdate)
    if (current != null && current.size === 0) {
      subscriberSets.delete(key)
      listeners.get(key)?.()
      listeners.delete(key)
      slots.delete(key)
      cache.delete(key)
      untrackCommunity(communityId, key)
    }
  }
}

export const unsubscribeAllEventRoomDisplays = (): void => {
  for (const unsubscribe of listeners.values()) {
    unsubscribe()
  }
  for (const unsubscribe of communityListeners.values()) {
    unsubscribe()
  }
  listeners.clear()
  communityListeners.clear()
  subscriberSets.clear()
  slots.clear()
  cache.clear()
  eventKeysByCommunity.clear()
  showMemberByCommunity.clear()
}
