import {
  getCommunityUrl as buildCommunityUrl,
  getEventUrl as buildEventUrl,
  getUserUrl as buildUserUrl,
} from '@shokujii/common/utils/urls.js'

/** env のホスト値からプロトコル・末尾スラッシュを除去する（`https://host` / `https//host` / `host` を許容）。 */
export const normalizeOriginHost = (raw: string): string =>
  raw
    .trim()
    .replace(/\/+$/, '')
    .replace(/^(?:https?:\/\/|https\/\/|http:\/\/)/i, '')

/** user アプリのホスト。運営管理画面からは常に user アプリ側の公開 URL へリンクする。 */
const originHost = (): string => normalizeOriginHost(import.meta.env.VITE_ORIGIN_HOST)

export const getCommunityUrl = (communityAccount: string): string => buildCommunityUrl(originHost(), communityAccount)

export const getEventUrl = (communityAccount: string, eventId: string): string =>
  buildEventUrl(originHost(), communityAccount, eventId)

export const getUserUrl = (userId: string): string => buildUserUrl(originHost(), userId)
