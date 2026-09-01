import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCommunityUrl, getEventUrl, getUserUrl } from './urls'

vi.stubEnv('VITE_ORIGIN_HOST', 'example.shokujii.jp')

afterEach(() => {
  vi.unstubAllEnvs()
  vi.stubEnv('VITE_ORIGIN_HOST', 'example.shokujii.jp')
})

describe('support の外部リンク生成', () => {
  it('コミュニティ URL は user アプリのホストを指す', () => {
    expect(getCommunityUrl('my-community')).toBe('https://example.shokujii.jp/c/my-community')
  })

  it('イベント URL は user アプリのホストを指す', () => {
    expect(getEventUrl('my-community', 'event-1')).toBe('https://example.shokujii.jp/c/my-community/e/event-1')
  })

  it('ユーザー URL は user アプリのホストを指す', () => {
    expect(getUserUrl('user-1')).toBe('https://example.shokujii.jp/u/user-1')
  })

  it('ホストは呼び出しごとに解決する（env 差し替えが反映される）', () => {
    vi.stubEnv('VITE_ORIGIN_HOST', 'other.shokujii.jp')
    expect(getCommunityUrl('my-community')).toBe('https://other.shokujii.jp/c/my-community')
  })
})
