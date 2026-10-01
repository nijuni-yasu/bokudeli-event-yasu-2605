import { TAG_GENRES, type MasterTag } from '@shokujii/common/constants/tags.js'
import { normalizeTag } from '@shokujii/common/utils/normalizeTag.js'

export const PROFILE_TAG_PAGE_SIZE = { desktop: 12, mobile: 8 }

const STARTER_TAGS: readonly MasterTag[] = [
  'コーヒー',
  '食べ歩き',
  'カレー',
  'サウナ',
  '国内旅行',
  '映画',
  '音楽フェス',
  'ランニング',
  'カメラ',
  '読書会',
  'ゲーム',
  'スタートアップ',
]

const ALL_TAGS = [...new Set<string>(TAG_GENRES.flatMap((genre) => [...genre.tags]))]

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
