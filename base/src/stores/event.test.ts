import { FirebaseError } from 'firebase/app'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import type { BokudeliEvent } from '@shokujii/base/stores/event.js'

const getDocMock = vi.hoisted(() => vi.fn())
const getDocsMock = vi.hoisted(() => vi.fn())
const onSnapshotMock = vi.hoisted(() => vi.fn())
const useUserStoreMock = vi.hoisted(() =>
  vi.fn((userId: string) => {
    void userId
    return { user: { user_name: 'Test User' } }
  }),
)
const mockEventRef = vi.hoisted(() => ({
  path: 'communities/community-a/events/event-a',
  parent: { parent: { id: 'community-a' } },
  withConverter: vi.fn(function (this: unknown) {
    return this
  }),
}))

vi.mock('@shokujii/base/stores/eventDraft.js', () => ({
  preparePfEventDraft: async () => {},
  prepareEnterpriseEventDraft: async () => {},
}))

vi.mock('@shokujii/base/utils/reportClientError.js', () => ({
  reportClientError: vi.fn(),
}))

vi.mock('@shokujii/base/utils/storage.js', () => ({
  convertStoragePathToURL: vi.fn(() => 'https://example.com/cover.jpg'),
  uploadImage: vi.fn(),
}))

vi.mock('@shokujii/base/utils/image.js', () => ({
  resizeImage: vi.fn(),
}))

vi.mock('@shokujii/base/apis/order.js', () => ({
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  confirmOrder: vi.fn(),
}))

vi.mock('@shokujii/base/apis/eventMenu.js', () => ({
  updateEventMenus: vi.fn(),
}))

vi.mock('@shokujii/base/apis/copyCommunityCoverToEvent.js', () => ({
  copyCommunityCoverToEvent: vi.fn(),
}))

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>()
  return {
    ...actual,
    getDoc: (...args: unknown[]) => getDocMock(...args),
    getDocs: (...args: unknown[]) => getDocsMock(...args),
    onSnapshot: (...args: unknown[]) => onSnapshotMock(...args),
    collection: vi.fn(() => ({ withConverter: vi.fn(() => ({})) })),
    collectionGroup: vi.fn(() => ({})),
    query: vi.fn(() => ({
      withConverter: vi.fn(() => ({})),
    })),
    where: vi.fn(() => ({})),
    doc: vi.fn(() => ({
      withConverter: vi.fn(() => mockEventRef),
    })),
  }
})

vi.mock('@shokujii/base/firebase.js', () => ({
  db: {},
}))

vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'test-user' } }),
}))

vi.mock('@shokujii/base/stores/user.js', () => ({
  useUserStore: (userId: string) => useUserStoreMock(userId),
  getUserRef: (userId: string) => ({ path: `users/${userId}` }),
}))

import {
  fetchEventInCommunityDocument,
  EVENT_DETAIL_MEMBER_PREVIEW_LIMIT,
  latestOrderUpdatedAt,
  selectPreviewMemberIds,
  useEventStore,
} from '@shokujii/base/stores/event.js'
import {
  buildEventStoreOptions,
  resolveEventStoreOptionsFromInjectedEnterpriseId,
} from '@shokujii/base/stores/eventStoreOptions.js'

describe('fetchEventInCommunityDocument', () => {
  beforeEach(() => {
    getDocMock.mockReset()
  })

  it('ドキュメントが存在するとき BokudeliEvent を返す', async () => {
    const event = { community_account: 'foo-community' } as BokudeliEvent
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => event,
    })

    await expect(fetchEventInCommunityDocument('community-a', 'event-a')).resolves.toBe(event)
    expect(getDocMock).toHaveBeenCalledWith(mockEventRef)
  })

  it('ドキュメントが存在しないとき undefined を返す', async () => {
    getDocMock.mockResolvedValue({
      exists: () => false,
    })

    await expect(fetchEventInCommunityDocument('community-a', 'missing-event')).resolves.toBeUndefined()
  })
})

describe('resolveEventStoreOptionsFromInjectedEnterpriseId', () => {
  it('非空 enterpriseId で tenant 固定 options を返す', () => {
    const options = resolveEventStoreOptionsFromInjectedEnterpriseId('ent-a')
    expect(options.eventsEnterpriseId).toBe('ent-a')
    expect(options.ordersEnterpriseId).toBe('ent-a')
    expect('draftPreparer' in options).toBe(true)
  })

  it('undefined は空オブジェクト（partner 無フィルタ / user default merge）', () => {
    const options = resolveEventStoreOptionsFromInjectedEnterpriseId(undefined)
    expect(options).toEqual({})
    expect('eventsEnterpriseId' in options).toBe(false)
  })

  it('空文字は空オブジェクト', () => {
    expect(resolveEventStoreOptionsFromInjectedEnterpriseId('')).toEqual({})
  })
})

describe('buildEventStoreOptions', () => {
  it('PF 明示は null キー付き', () => {
    const options = buildEventStoreOptions(undefined)
    expect(options.eventsEnterpriseId).toBeNull()
    expect('eventsEnterpriseId' in options).toBe(true)
  })
})

describe('selectPreviewMemberIds', () => {
  const limit = 2

  it('上限以下は並びを変えず全員を返す', () => {
    expect(selectPreviewMemberIds(['user-b', 'user-a'], [{ user_id: 'user-a', updated_at: 1 }], limit)).toEqual([
      'user-b',
      'user-a',
    ])
  })

  it('注文未取得の間は配列の先頭だけ返す', () => {
    expect(selectPreviewMemberIds(['user-0', 'user-1', 'user-2'], null, limit)).toEqual(['user-0', 'user-1'])
  })

  it('注文取得後は詳細カードと同じ順の先頭だけ返す', () => {
    const memberIds = ['user-0', 'user-1', 'user-2']
    const orders = [
      { user_id: 'user-0', updated_at: 300 },
      { user_id: 'user-2', updated_at: 10 },
    ]
    const selected = selectPreviewMemberIds(memberIds, orders, limit)
    const byCardOrder = [...memberIds].sort(
      (memberIdA, memberIdB) =>
        latestOrderUpdatedAt(orders.filter((order) => order.user_id === memberIdA)) -
        latestOrderUpdatedAt(orders.filter((order) => order.user_id === memberIdB)),
    )
    expect(selected).toEqual(byCardOrder.slice(0, limit))
    expect(selected).toEqual(['user-1', 'user-2'])
  })
})

describe('useEventStore lazy members', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('document', {
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    getDocsMock.mockReset()
    onSnapshotMock.mockReset()
    useUserStoreMock.mockClear()
    getDocsMock.mockResolvedValue({
      docs: [{ ref: mockEventRef }],
    })
    onSnapshotMock.mockImplementation((_ref, callback) => {
      if (typeof callback !== 'function') {
        return vi.fn()
      }
      callback({
        ref: { path: mockEventRef.path },
        exists: () => true,
        data: () =>
          ({
            members: ['user-a', 'user-b'],
          }) as BokudeliEvent,
        docs: [],
      })
      return vi.fn()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('members computed 未参照時は useUserStore を呼ばない', async () => {
    const store = useEventStore('event-a')
    await vi.waitFor(() => {
      expect(store.event?.members).toEqual(['user-a', 'user-b'])
    })
    expect(useUserStoreMock).not.toHaveBeenCalled()
  })

  it('members computed 初回評価時に member 数だけ useUserStore を呼ぶ', async () => {
    const store = useEventStore('event-b')
    await vi.waitFor(() => {
      expect(store.event?.members).toEqual(['user-a', 'user-b'])
    })

    const members = store.members
    expect(members).toHaveLength(2)
    expect(useUserStoreMock).toHaveBeenCalledTimes(2)
    expect(useUserStoreMock).toHaveBeenCalledWith('user-a')
    expect(useUserStoreMock).toHaveBeenCalledWith('user-b')
  })

  it('menus は参照するまで購読しない', async () => {
    const store = useEventStore('event-menus')
    await vi.waitFor(() => {
      expect(store.event?.members).toEqual(['user-a', 'user-b'])
    })
    expect(onSnapshotMock).toHaveBeenCalledTimes(1)
    expect(store.menus).toEqual([])
    expect(onSnapshotMock).toHaveBeenCalledTimes(2)
  })

  it('previewMembers は上限人数だけ useUserStore を呼ぶ', async () => {
    onSnapshotMock.mockImplementation((_ref, callback) => {
      if (typeof callback !== 'function') {
        return vi.fn()
      }
      callback({
        ref: { path: mockEventRef.path },
        exists: () => true,
        data: () =>
          ({
            members: Array.from({ length: EVENT_DETAIL_MEMBER_PREVIEW_LIMIT + 8 }, (_, index) => `user-${index}`),
          }) as BokudeliEvent,
        docs: [],
      })
      return vi.fn()
    })

    const store = useEventStore('event-preview')
    await vi.waitFor(() => {
      expect(store.event?.members).toHaveLength(EVENT_DETAIL_MEMBER_PREVIEW_LIMIT + 8)
    })

    const preview = store.previewMembers
    expect(preview).toHaveLength(EVENT_DETAIL_MEMBER_PREVIEW_LIMIT)
    expect(useUserStoreMock).not.toHaveBeenCalled()
    const userListenerPaths = onSnapshotMock.mock.calls
      .map((call) => call[0]?.path)
      .filter((path): path is string => typeof path === 'string' && path.startsWith('users/'))
    expect(userListenerPaths).toHaveLength(EVENT_DETAIL_MEMBER_PREVIEW_LIMIT)
    expect(userListenerPaths).toContain('users/user-0')
    expect(userListenerPaths).not.toContain(`users/user-${EVENT_DETAIL_MEMBER_PREVIEW_LIMIT}`)
  })

  it('previewMembers は注文の並びで上限人数を選ぶ', async () => {
    const memberCount = EVENT_DETAIL_MEMBER_PREVIEW_LIMIT + 8
    onSnapshotMock.mockImplementation((_ref, callback) => {
      if (typeof callback !== 'function') {
        return vi.fn()
      }
      callback({
        ref: { path: mockEventRef.path },
        exists: () => true,
        data: () =>
          ({
            members: Array.from({ length: memberCount }, (_, index) => `user-${index}`),
          }) as BokudeliEvent,
        docs: Array.from({ length: EVENT_DETAIL_MEMBER_PREVIEW_LIMIT }, (_, index) => ({
          ref: { path: `orders/user-${index}` },
          data: () => ({ user_id: `user-${index}`, updated_at: 500 }),
        })),
      })
      return vi.fn()
    })

    const store = useEventStore('event-preview-by-order')
    await vi.waitFor(() => {
      expect(store.event?.members).toHaveLength(memberCount)
    })

    const preview = store.previewMembers
    expect(preview).toHaveLength(EVENT_DETAIL_MEMBER_PREVIEW_LIMIT)
    expect(useUserStoreMock).not.toHaveBeenCalled()
    const userListenerPaths = onSnapshotMock.mock.calls
      .map((call) => call[0]?.path)
      .filter((path): path is string => typeof path === 'string' && path.startsWith('users/'))
    expect(userListenerPaths).toContain(`users/user-${memberCount - 1}`)
    expect(userListenerPaths).not.toContain(`users/user-${EVENT_DETAIL_MEMBER_PREVIEW_LIMIT - 1}`)
  })

  it('previewMembers は選外になった users 購読を外す', async () => {
    const memberCount = EVENT_DETAIL_MEMBER_PREVIEW_LIMIT + 8
    const userUnsubscribes = new Map<string, ReturnType<typeof vi.fn>>()
    type PreviewOrdersSnapshot = {
      docs: { data: () => { user_id: string; updated_at: number } }[]
    }
    const ordersCallbacks: Array<(snapshot: PreviewOrdersSnapshot) => void> = []
    onSnapshotMock.mockImplementation((ref: { path?: string }, callback: (snapshot: unknown) => void) => {
      const path = ref?.path ?? ''
      if (path.startsWith('users/')) {
        const unsubscribe = vi.fn()
        userUnsubscribes.set(path, unsubscribe)
        return unsubscribe
      }
      if (path.startsWith('communities/')) {
        callback({
          ref: { path },
          exists: () => true,
          data: () =>
            ({
              members: Array.from({ length: memberCount }, (_, index) => `user-${index}`),
            }) as BokudeliEvent,
          docs: [],
        })
        return vi.fn()
      }
      ordersCallbacks.push((snapshot: PreviewOrdersSnapshot) => {
        callback(snapshot)
      })
      return vi.fn()
    })

    const store = useEventStore('event-preview-release')
    await vi.waitFor(() => {
      expect(store.event?.members).toHaveLength(memberCount)
    })

    expect(store.previewMembers).toHaveLength(EVENT_DETAIL_MEMBER_PREVIEW_LIMIT)
    expect(userUnsubscribes.size).toBe(EVENT_DETAIL_MEMBER_PREVIEW_LIMIT)
    const notifyOrders = ordersCallbacks[0]
    expect(notifyOrders).toBeTypeOf('function')
    if (notifyOrders == null) {
      throw new Error('orders listener was not registered')
    }
    notifyOrders({
      docs: Array.from({ length: EVENT_DETAIL_MEMBER_PREVIEW_LIMIT }, (_, index) => ({
        data: () => ({ user_id: `user-${index}`, updated_at: 500 }),
      })),
    })

    const preview = store.previewMembers
    expect(preview).toHaveLength(EVENT_DETAIL_MEMBER_PREVIEW_LIMIT)
    expect(userUnsubscribes.get('users/user-4')).toHaveBeenCalled()
    expect(userUnsubscribes.get('users/user-0')).not.toHaveBeenCalled()
    expect(userUnsubscribes.has('users/user-12')).toBe(true)
    expect(useUserStoreMock).not.toHaveBeenCalled()
  })

  it('deferLiveSubscription では ensureSubscribed まで購読しない', () => {
    const store = useEventStore('event-defer', { deferLiveSubscription: true })
    expect(getDocsMock).not.toHaveBeenCalled()
    expect(onSnapshotMock).not.toHaveBeenCalled()
    store.ensureSubscribed()
    expect(getDocsMock).toHaveBeenCalled()
  })

  it('preview の user 購読が一時失敗したら張り直す', async () => {
    vi.useFakeTimers()
    const userListenCounts = new Map<string, number>()
    onSnapshotMock.mockImplementation(
      (ref: { path?: string }, onNext: (snapshot: unknown) => void, onError?: (err: unknown) => void) => {
        const path = ref?.path ?? ''
        if (path.startsWith('users/')) {
          const count = (userListenCounts.get(path) ?? 0) + 1
          userListenCounts.set(path, count)
          if (count === 1) {
            onError?.(new FirebaseError('unavailable', 'down'))
          }
          return vi.fn()
        }
        onNext({
          ref: { path: mockEventRef.path },
          exists: () => true,
          data: () =>
            ({
              members: ['user-a'],
            }) as BokudeliEvent,
          docs: [],
        })
        return vi.fn()
      },
    )

    const store = useEventStore('event-preview-retry')
    await Promise.resolve()
    await Promise.resolve()
    expect(store.event?.members).toEqual(['user-a'])
    expect(store.previewMembers).toHaveLength(1)
    expect(userListenCounts.get('users/user-a')).toBe(1)

    await vi.advanceTimersByTimeAsync(1000)
    expect(userListenCounts.get('users/user-a')).toBe(2)
    vi.useRealTimers()
  })
})
