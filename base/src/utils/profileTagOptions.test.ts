import { describe, expect, it } from 'vitest'
import { isMasterTagLabel } from '@shokujii/common/constants/tags.js'
import { getProfileTagCandidates, PROFILE_TAG_PAGE_SIZE } from './profileTagOptions.js'

describe('プロフィールタグの候補', () => {
  it('最初の候補は既存マスタから重複なく12個提示する', () => {
    const candidates = getProfileTagCandidates('')
    expect(candidates.slice(0, PROFILE_TAG_PAGE_SIZE.mobile)).toEqual([
      'コーヒー',
      '食べ歩き',
      'カレー',
      'サウナ',
      '国内旅行',
      '映画',
      '音楽フェス',
      'ランニング',
    ])
    expect(candidates.every(isMasterTagLabel)).toBe(true)
    expect(candidates).toHaveLength(PROFILE_TAG_PAGE_SIZE.desktop)
    expect(new Set(candidates).size).toBe(candidates.length)
  })

  it('全角・前後空白・英字の大小を吸収して全ジャンルを検索し、完全一致を先頭にする', () => {
    const candidates = getProfileTagCandidates('　ａｉ　')
    expect(candidates[0]).toBe('AI')
    expect(candidates).toEqual(expect.arrayContaining(['AI', '生成AI', 'AIエージェント']))
    expect(candidates.every(isMasterTagLabel)).toBe(true)
  })

  it('該当しない検索語は空の候補にし、自由入力の判断へ渡せる', () => {
    expect(getProfileTagCandidates('存在しないタグの検索語')).toEqual([])
  })

  it('空白だけの検索では最初の候補を表示する', () => {
    expect(getProfileTagCandidates('　 ')).toEqual(getProfileTagCandidates(''))
  })
})
