import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCommunityUrl, getEventUrl, getUserUrl, normalizeOriginHost } from './urls'

vi.stubEnv('VITE_ORIGIN_HOST', 'example.shokujii.jp')

afterEach(() => {
  vi.unstubAllEnvs()
  vi.stubEnv('VITE_ORIGIN_HOST', 'example.shokujii.jp')
})

describe('normalizeOriginHost', () => {
  it('ホストのみの値はそのまま返す', () => {
    expect(normalizeOriginHost('example.shokujii.jp')).toBe('example.shokujii.jp')
  })

  it('https:// 付きの値からプロトコルを除去する', () => {
    expect(normalizeOriginHost('https://bokudeli-event-yasu-2603.firebaseapp.com')).toBe(
      'bokudeli-event-yasu-2603.firebaseapp.com',
    )
  })

  it('https// の誤記も除去する', () => {
    expect(normalizeOriginHost('https//bokudeli-event-yasu-2603.firebaseapp.com')).toBe(
      'bokudeli-event-yasu-2603.firebaseapp.com',
    )
  })
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

  it('VITE_ORIGIN_HOST に https:// が含まれても二重にならない', () => {
    vi.stubEnv('VITE_ORIGIN_HOST', 'https://bokudeli-event-yasu-2603.firebaseapp.com')
    expect(getEventUrl('infotest04', 'G4YdRg80FTgb6ZWGDihY')).toBe(
      'https://bokudeli-event-yasu-2603.firebaseapp.com/c/infotest04/e/G4YdRg80FTgb6ZWGDihY',
    )
  })
})
