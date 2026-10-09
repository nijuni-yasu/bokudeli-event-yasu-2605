import { beforeEach, describe, expect, it, vi } from 'vitest'

const getDocsMock = vi.hoisted(() => vi.fn())
const whereMock = vi.hoisted(() => vi.fn((...args: unknown[]) => ({ args })))
const reportClientErrorMock = vi.hoisted(() => vi.fn())

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>()
  return {
    ...actual,
    collection: vi.fn(() => ({ path: 'users' })),
    getDocs: (...args: unknown[]) => getDocsMock(...args),
    query: vi.fn(() => ({
      withConverter: vi.fn(() => ({ converted: true })),
    })),
    where: (...args: unknown[]) => whereMock(...args),
    doc: vi.fn(() => ({
      withConverter: vi.fn(function (this: unknown) {
        return this
      }),
    })),
    onSnapshot: vi.fn(),
  }
})

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getMetadata: vi.fn(),
}))

vi.mock('@shokujii/base/firebase.js', () => ({
  db: {},
  storage: {},
}))

vi.mock('@shokujii/base/stores/userImageCache.js', () => ({
  useUserImageCacheStore: () => ({}),
}))

vi.mock('@shokujii/base/utils/reportClientError.js', () => ({
  reportClientError: (...args: unknown[]) => reportClientErrorMock(...args),
}))

import { fetchUsersByIds, USERS_BY_IDS_IN_LIMIT } from '@shokujii/base/stores/user.js'

describe('fetchUsersByIds', () => {
  beforeEach(() => {
    getDocsMock.mockReset()
    whereMock.mockClear()
    reportClientErrorMock.mockClear()
    getDocsMock.mockImplementation(async () => {
      const ids = whereMock.mock.calls.at(-1)?.[2]
      if (!Array.isArray(ids)) {
        throw new Error('where ids missing')
      }
      return {
        docs: ids.flatMap((id) => {
          if (typeof id !== 'string' || id.startsWith('missing')) {
            return []
          }
          return [
            {
              id,
              ref: { path: `users/${id}` },
              data: () => {
                if (id.startsWith('bad')) {
                  throw new Error('invalid user')
                }
                return { user_id: id, user_name: id }
              },
            },
          ]
        }),
      }
    })
  })

  it('空配列ではクエリしない', async () => {
    await expect(fetchUsersByIds([])).resolves.toEqual(new Map())
    expect(getDocsMock).not.toHaveBeenCalled()
  })

  it('重複と空文字を除き、無い文書は null にする', async () => {
    const users = await fetchUsersByIds(['user-a', '', 'user-a', 'missing-b'])
    expect(whereMock).toHaveBeenCalledTimes(1)
    expect(whereMock.mock.calls[0]?.[1]).toBe('in')
    expect(whereMock.mock.calls[0]?.[2]).toEqual(['user-a', 'missing-b'])
    expect(users.get('user-a')).toEqual({ user_id: 'user-a', user_name: 'user-a' })
    expect(users.get('missing-b')).toBeNull()
    expect(users.has('')).toBe(false)
  })

  it('in 句の上限で分割する', async () => {
    const ids = Array.from({ length: USERS_BY_IDS_IN_LIMIT + 1 }, (_, index) => `user-${index}`)
    const users = await fetchUsersByIds(ids)
    expect(whereMock).toHaveBeenCalledTimes(2)
    expect(whereMock.mock.calls[0]?.[2]).toHaveLength(USERS_BY_IDS_IN_LIMIT)
    expect(whereMock.mock.calls[1]?.[2]).toEqual([`user-${USERS_BY_IDS_IN_LIMIT}`])
    expect(users.size).toBe(ids.length)
    expect(users.get(`user-${USERS_BY_IDS_IN_LIMIT}`)).toEqual({
      user_id: `user-${USERS_BY_IDS_IN_LIMIT}`,
      user_name: `user-${USERS_BY_IDS_IN_LIMIT}`,
    })
  })

  it('壊れた文書は null にして他の参加者は残す', async () => {
    const users = await fetchUsersByIds(['user-a', 'bad-b'])
    expect(users.get('user-a')).toEqual({ user_id: 'user-a', user_name: 'user-a' })
    expect(users.get('bad-b')).toBeNull()
    expect(reportClientErrorMock).toHaveBeenCalledWith(expect.any(Error), {
      documentPath: 'users/bad-b',
      severity: 'warn',
    })
  })
})
