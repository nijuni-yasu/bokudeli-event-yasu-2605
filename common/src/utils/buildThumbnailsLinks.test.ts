import { describe, expect, it } from 'vitest'
import { buildThumbnailsLinks, resolveUserAvatarThumbnailSize } from './buildThumbnailsLinks.js'

const FIREBASE_STORAGE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/'

describe('buildThumbnailsLinks', () => {
  it('gs:// URL から Storage サムネイル URL を生成する', () => {
    const url = new URL('gs://test-project.appspot.com/users/uid1/avatar')
    const result = buildThumbnailsLinks('uid1', url, FIREBASE_STORAGE_BASE_URL)
    expect(result).not.toBeNull()
    expect(result?.small).toContain('users%2Fuid1%2Favatar_thumb_small')
    expect(result?.medium).toContain('users%2Fuid1%2Favatar_thumb_medium')
    expect(result?.large).toContain('users%2Fuid1%2Favatar_thumb_large')
  })

  it('gs:// URL に cacheBuster を付与できる', () => {
    const url = new URL('gs://test-project.appspot.com/users/uid1/avatar')
    const result = buildThumbnailsLinks('uid1', url, FIREBASE_STORAGE_BASE_URL, 1234567890)
    expect(result?.large).toContain('?alt=media&t=1234567890')
  })

  it('Google URL は汎用 https 分岐でサイズ付き URL を返す', () => {
    const googleUrl = new URL('https://lh3.googleusercontent.com/a/ACg8ocExample=s96-c')
    const result = buildThumbnailsLinks('uid1', googleUrl, FIREBASE_STORAGE_BASE_URL)
    expect(result).not.toBeNull()
    expect(result?.small).toBe('https://lh3.googleusercontent.com/a/ACg8ocExample=s50-c')
    expect(result?.medium).toBe('https://lh3.googleusercontent.com/a/ACg8ocExample=s100-c')
    expect(result?.large).toBe('https://lh3.googleusercontent.com/a/ACg8ocExample=s500-c')
  })

  it('Facebook graph URL は null を返す', () => {
    const url = new URL('https://graph.facebook.com/123/picture')
    expect(buildThumbnailsLinks('uid1', url, FIREBASE_STORAGE_BASE_URL)).toBeNull()
  })
})

describe('resolveUserAvatarThumbnailSize', () => {
  it('表示 50px 以下は small、100px 以下は medium、それより大きいか未指定は large', () => {
    expect(resolveUserAvatarThumbnailSize(50)).toBe('small')
    expect(resolveUserAvatarThumbnailSize(56)).toBe('medium')
    expect(resolveUserAvatarThumbnailSize(96)).toBe('medium')
    expect(resolveUserAvatarThumbnailSize(101)).toBe('large')
    expect(resolveUserAvatarThumbnailSize(undefined)).toBe('large')
  })

  it('thumbnailSize を指定したときは表示サイズより優先する', () => {
    expect(resolveUserAvatarThumbnailSize(56, 'large')).toBe('large')
    expect(resolveUserAvatarThumbnailSize(96, 'large')).toBe('large')
  })
})
