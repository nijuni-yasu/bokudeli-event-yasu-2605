import { describe, expect, it } from 'vitest'
import { linkifyHttpUrls } from './linkifyHttpUrls.js'

describe('linkifyHttpUrls', () => {
  it('returns empty array for empty input', () => {
    expect(linkifyHttpUrls('')).toEqual([])
  })

  it('keeps plain text', () => {
    expect(linkifyHttpUrls('個人情報は取得しません')).toEqual([{ kind: 'text', value: '個人情報は取得しません' }])
  })

  it('linkifies https and http URLs', () => {
    expect(linkifyHttpUrls('方針は https://example.com/privacy と http://example.com/terms です')).toEqual([
      { kind: 'text', value: '方針は' },
      { kind: 'text', value: ' ' },
      { kind: 'url', href: 'https://example.com/privacy', label: 'https://example.com/privacy' },
      { kind: 'text', value: ' ' },
      { kind: 'text', value: 'と' },
      { kind: 'text', value: ' ' },
      { kind: 'url', href: 'http://example.com/terms', label: 'http://example.com/terms' },
      { kind: 'text', value: ' ' },
      { kind: 'text', value: 'です' },
    ])
  })

  it('linkifies a URL after Japanese text and keeps the trailing punctuation', () => {
    expect(linkifyHttpUrls('詳細はこちらhttps://example.com/privacy。')).toEqual([
      { kind: 'text', value: '詳細はこちら' },
      { kind: 'url', href: 'https://example.com/privacy', label: 'https://example.com/privacy' },
      { kind: 'text', value: '。' },
    ])
  })

  it('preserves newlines', () => {
    expect(linkifyHttpUrls('1行目\nhttps://example.com\n3行目')).toEqual([
      { kind: 'text', value: '1行目\n' },
      { kind: 'url', href: 'https://example.com', label: 'https://example.com' },
      { kind: 'text', value: '\n3行目' },
    ])
  })

  it('keeps HTML as text and still linkifies a URL in the same text', () => {
    const segments = linkifyHttpUrls('<b>太字</b> https://example.com <script>alert(1)</script>')
    expect(segments.some((segment) => segment.kind === 'url' && segment.href === 'https://example.com')).toBe(true)
    expect(
      segments
        .filter((segment) => segment.kind === 'text')
        .map((segment) => segment.value)
        .join(''),
    ).toBe('<b>太字</b>  <script>alert(1)</script>')
  })

  it('does not linkify email, ftp, or schemeless text', () => {
    const segments = linkifyHttpUrls('foo@example.com ftp://example.com www.example.com javascript:alert(1)')
    expect(segments.every((segment) => segment.kind === 'text')).toBe(true)
    expect(segments.map((segment) => (segment.kind === 'text' ? segment.value : '')).join('')).toBe(
      'foo@example.com ftp://example.com www.example.com javascript:alert(1)',
    )
  })

  it('linkifies an uppercase scheme', () => {
    expect(linkifyHttpUrls('HTTPS://Example.COM/Privacy')).toEqual([
      { kind: 'url', href: 'HTTPS://Example.COM/Privacy', label: 'HTTPS://Example.COM/Privacy' },
    ])
  })
})
