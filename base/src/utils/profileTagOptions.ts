import { TAG_GENRES, type MasterTag } from '@shokujii/common/constants/tags.js'
import { normalizeTag } from '@shokujii/common/utils/normalizeTag.js'

export const PROFILE_TAG_PAGE_SIZE = { desktop: 12, mobile: 8 }

const STARTER_TAGS: readonly MasterTag[] = [
  '生成AI',
  'コミュマネ',
  '筋トレ',
  '食べ歩き',
  'カレー',
  'サウナ',
  '地域創生',
  '二拠点生活',
  '音楽フェス',
  'カメラ',
  '読書会',
  'スタートアップ',
]

const ALL_TAGS = [...new Set<string>(TAG_GENRES.flatMap((genre) => [...genre.tags]))]

/** 正規化と大文字小文字を無視したマスタの完全一致。返す表記はマスタのまま。 */
export function findExactMasterTag(query: string): string | undefined {
  const key = normalizeTag(query).toLowerCase()
  if (key === '') return undefined
  return ALL_TAGS.find((tag) => normalizeTag(tag).toLowerCase() === key)
}

/** 検索時はジャンルを横断し、完全一致を先頭にする。保存する表記はマスタを維持する。 */
export function getProfileTagCandidates(query: string): readonly string[] {
  const normalizedQuery = normalizeTag(query).toLowerCase()
  if (normalizedQuery !== '') {
    return ALL_TAGS.filter((tag) => normalizeTag(tag).toLowerCase().includes(normalizedQuery)).sort(
      (a, b) =>
        Number(normalizeTag(b).toLowerCase() === normalizedQuery) -
        Number(normalizeTag(a).toLowerCase() === normalizedQuery),
    )
  }
  return STARTER_TAGS
}
