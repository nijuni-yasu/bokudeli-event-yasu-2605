import { describe, expect, it, vi } from 'vitest'

vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: null }),
}))
vi.mock('@shokujii/base/stores/event', () => ({
  useEventStore: () => ({}),
  buildEventStoreOptions: () => ({}),
}))
vi.mock('@shokujii/base/composable/useMenuLimitRemaining.js', () => ({
  loadMenuLimitRemainingMap: async () => null,
}))

import { findProfileGap } from './cartOrderGate'

describe('findProfileGap', () => {
  const readyUser = { user_name: '太郎', user_image_url: 'https://example.com/a.png' }
  const readyPersonal = { user_email: 'a@example.com' }

  it('氏名・画像・メールが揃っていれば不足はない', () => {
    expect(findProfileGap(readyUser, readyPersonal)).toBeNull()
  })

  it('氏名が空なら氏名不足', () => {
    expect(findProfileGap({ ...readyUser, user_name: '' }, readyPersonal)).toBe('name')
    expect(findProfileGap(null, readyPersonal)).toBe('name')
  })

  it('画像が無ければ画像不足', () => {
    expect(findProfileGap({ ...readyUser, user_image_url: '' }, readyPersonal)).toBe('image')
  })

  it('メールが無ければメール不足', () => {
    expect(findProfileGap(readyUser, { user_email: '' })).toBe('email')
    expect(findProfileGap(readyUser, null)).toBe('email')
  })
})
