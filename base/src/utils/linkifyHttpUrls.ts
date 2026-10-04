import { buildLinkifiedSegments, type LinkifiedSegment } from '../directives/linkify/utils/linkifiedSegments.js'

export type HttpLinkedSegment = { kind: 'text'; value: string } | { kind: 'url'; href: string; label: string }

const isSafeHttpUrl = (href: string): boolean => {
  try {
    const url = new URL(href)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const toHttpSegment = (segment: LinkifiedSegment): HttpLinkedSegment => {
  if (segment.kind === 'url' && isSafeHttpUrl(segment.href)) {
    return { kind: 'url', href: segment.href, label: segment.label }
  }
  if (segment.kind === 'text') {
    return segment
  }
  return { kind: 'text', value: segment.label }
}

/** `http://` と `https://` だけをリンク用セグメントに分ける。HTML や改行はそのまま残す。 */
export const linkifyHttpUrls = (text: string): HttpLinkedSegment[] => {
  return buildLinkifiedSegments(text).map(toHttpSegment)
}
