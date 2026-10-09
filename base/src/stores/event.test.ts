import { FirebaseError } from 'firebase/app'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

const getDocMock = vi.hoisted(() => vi.fn())
const getDocsMock = vi.hoisted(() => vi.fn())
const onSnapshotMock = vi.hoisted(() => vi.fn())
const useUserStoreMock = vi.hoisted(() =>
  vi.fn((userId: string) => {
    void userId
    return { user: { user_name: 'Test User' } }
  }),
)
const fetchUsersByIdsMock = vi.hoisted(() =>
  vi.fn(async (userIds: readonly string[]) => {
    const users = new Map<string, { user_name: string } | null>()
    for (const userId of userIds) {
      users.set(userId, { user_name: userId })
    }
    return users
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
  fetchUsersByIds: (userIds: readonly string[]) => fetchUsersByIdsMock(userIds),
}))

import { BokudeliEvent, fetchEventInCommunityDocument, useEventStore } from '@shokujii/base/stores/event.js'
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
    fetchUsersByIdsMock.mockReset()
    fetchUsersByIdsMock.mockImplementation(async (userIds: readonly string[]) => {
      const users = new Map<string, { user_name: string } | null>()
      for (const userId of userIds) {
        users.set(userId, { user_name: userId })
      }
      return users
    })
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

  it('previewMembers は参加者全員を返し users を購読しない', async () => {
    const memberCount = 20
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
        docs: [],
      })
      return vi.fn()
    })

    const store = useEventStore('event-preview')
    await vi.waitFor(() => {
      expect(store.event?.members).toHaveLength(memberCount)
    })

    const memberIds = Array.from({ length: memberCount }, (_, index) => `user-${index}`)
    expect(store.previewMembers).toHaveLength(memberCount)
    expect(store.previewMembers?.map((member) => member.user_id)).toEqual(memberIds)
    expect(useUserStoreMock).not.toHaveBeenCalled()
    const userListenerPaths = onSnapshotMock.mock.calls
      .map((call) => call[0]?.path)
      .filter((path): path is string => typeof path === 'string' && path.startsWith('users/'))
    expect(userListenerPaths).toEqual([])
    expect(fetchUsersByIdsMock).toHaveBeenCalledWith(memberIds)

    await vi.waitFor(() => {
      expect(store.previewMembers?.[memberCount - 1]?.user_name).toBe(`user-${memberCount - 1}`)
    })
    expect(fetchUsersByIdsMock).toHaveBeenCalledTimes(1)
  })

  it('deferLiveSubscription では ensureSubscribed まで購読しない', () => {
    const store = useEventStore('event-defer', { deferLiveSubscription: true })
    expect(getDocsMock).not.toHaveBeenCalled()
    expect(onSnapshotMock).not.toHaveBeenCalled()
    store.ensureSubscribed()
    expect(getDocsMock).toHaveBeenCalled()
  })

  it('preview の user 取得が一時失敗したら取り直す', async () => {
    vi.useFakeTimers()
    fetchUsersByIdsMock
      .mockRejectedValueOnce(new FirebaseError('unavailable', 'down'))
      .mockImplementation(async (userIds: readonly string[]) => {
        const users = new Map<string, { user_name: string } | null>()
        for (const userId of userIds) {
          users.set(userId, { user_name: userId })
        }
        return users
      })
    onSnapshotMock.mockImplementation((_ref, onNext) => {
      if (typeof onNext !== 'function') {
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
    })

    const store = useEventStore('event-preview-retry')
    await Promise.resolve()
    await Promise.resolve()
    expect(store.event?.members).toEqual(['user-a'])
    expect(store.previewMembers).toHaveLength(1)
    expect(fetchUsersByIdsMock).toHaveBeenCalledTimes(1)
    expect(store.previewMembers?.[0]?.user_name).toBe('')

    await vi.advanceTimersByTimeAsync(1000)
    await Promise.resolve()
    await Promise.resolve()
    expect(fetchUsersByIdsMock).toHaveBeenCalledTimes(2)
    expect(store.previewMembers?.[0]?.user_name).toBe('user-a')
    const userListenerPaths = onSnapshotMock.mock.calls
      .map((call) => call[0]?.path)
      .filter((path): path is string => typeof path === 'string' && path.startsWith('users/'))
    expect(userListenerPaths).toEqual([])
    vi.useRealTimers()
  })

  it('参加者変更後の古い取得結果は previewMembers を上書きしない', async () => {
    const pending: Array<(users: Map<string, { user_name: string } | null>) => void> = []
    let emitMembers: ((members: string[]) => void) | undefined
    fetchUsersByIdsMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          pending.push(resolve)
        }),
    )
    onSnapshotMock.mockImplementation((_ref, callback) => {
      if (typeof callback !== 'function') {
        return vi.fn()
      }
      emitMembers = (members: string[]) => {
        callback({
          ref: { path: mockEventRef.path },
          exists: () => true,
          data: () =>
            ({
              members,
            }) as BokudeliEvent,
          docs: [],
        })
      }
      emitMembers(['user-a'])
      return vi.fn()
    })

    const store = useEventStore('event-preview-stale')
    await vi.waitFor(() => {
      expect(store.event?.members).toEqual(['user-a'])
    })
    expect(store.previewMembers?.[0]?.user_id).toBe('user-a')
    expect(store.previewMembers?.[0]?.user_name).toBe('')
    expect(pending).toHaveLength(1)

    emitMembers?.(['user-b'])
    expect(store.previewMembers?.[0]?.user_id).toBe('user-b')
    expect(store.previewMembers?.[0]?.user_name).toBe('')
    expect(pending).toHaveLength(2)

    pending[0]?.(new Map([['user-a', { user_name: 'stale-a' }]]))
    await Promise.resolve()
    await Promise.resolve()
    expect(store.previewMembers?.[0]?.user_id).toBe('user-b')
    expect(store.previewMembers?.[0]?.user_name).toBe('')

    pending[1]?.(new Map([['user-b', { user_name: 'user-b' }]]))
    await Promise.resolve()
    await Promise.resolve()
    expect(store.previewMembers?.[0]?.user_name).toBe('user-b')
  })

  it('unsubscribe 後に完了した取得結果は previewMembers を上書きしない', async () => {
    const pending: Array<(users: Map<string, { user_name: string } | null>) => void> = []
    fetchUsersByIdsMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          pending.push(resolve)
        }),
    )
    onSnapshotMock.mockImplementation((_ref, callback) => {
      if (typeof callback !== 'function') {
        return vi.fn()
      }
      callback({
        ref: { path: mockEventRef.path },
        exists: () => true,
        data: () =>
          ({
            members: ['user-a'],
          }) as BokudeliEvent,
        docs: [],
      })
      return vi.fn()
    })

    const store = useEventStore('event-preview-unsub')
    await vi.waitFor(() => {
      expect(store.event?.members).toEqual(['user-a'])
    })
    expect(store.previewMembers?.[0]?.user_name).toBe('')
    expect(pending).toHaveLength(1)

    store.unsubscribe()
    pending[0]?.(new Map([['user-a', { user_name: 'late-name' }]]))
    await Promise.resolve()
    await Promise.resolve()
    expect(store.previewMembers?.[0]?.user_id).toBe('user-a')
    expect(store.previewMembers?.[0]?.user_name).toBe('')
  })

  it('遅延で作った store を通常呼び出しすると購読を始める', () => {
    const deferred = useEventStore('event-shared', { deferLiveSubscription: true })
    expect(getDocsMock).not.toHaveBeenCalled()
    const live = useEventStore('event-shared')
    expect(live).toBe(deferred)
    expect(getDocsMock).toHaveBeenCalledTimes(1)
  })

  it('購読していない store には一覧の取得結果を反映する', () => {
    const stale = Object.assign(Object.create(BokudeliEvent.prototype), {
      id: 'event-hydrate',
      event_name: '旧',
    }) as BokudeliEvent
    const store = useEventStore(stale, { deferLiveSubscription: true })
    expect(onSnapshotMock).not.toHaveBeenCalled()
    expect(store.event?.event_name).toBe('旧')

    const fresh = Object.assign(Object.create(BokudeliEvent.prototype), {
      id: 'event-hydrate',
      event_name: '新',
    }) as BokudeliEvent
    const again = useEventStore(fresh, { deferLiveSubscription: true })
    expect(again).toBe(store)
    expect(store.event?.event_name).toBe('新')
    expect(onSnapshotMock).not.toHaveBeenCalled()
  })

  it('ライブ購読中の store は一覧の取得結果で上書きしない', async () => {
    const store = useEventStore('event-live')
    await Promise.resolve()
    await Promise.resolve()
    expect(store.event?.members).toEqual(['user-a', 'user-b'])

    const listed = Object.assign(Object.create(BokudeliEvent.prototype), {
      id: 'event-live',
      event_name: '一覧',
      members: ['other'],
    }) as BokudeliEvent
    useEventStore(listed, { deferLiveSubscription: true })
    expect(store.event?.members).toEqual(['user-a', 'user-b'])
  })
})
