import {
  collection,
  collectionGroup,
  getCountFromServer,
  query,
  where,
  type Query,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@shokujii/base/firebase.js'

/**
 * 運営管理画面（support）の横断集計。
 *
 * Event ドキュメントには注文の集計フィールドが無いため、一覧の行ごとに
 * `member_orders` の collectionGroup を count する。count 集計は 1000 ドキュメントあたり
 * 1 read 相当なので、一覧の行数ぶん発行してもコストは実用範囲に収まる。
 *
 * いずれの関数もテナント条件（enterprise_id）を付けない。Rules の `isSupport()` によって
 * サポートアカウントのみテナント横断の read が許可されている（#2087）。
 */

const countOf = async (target: Query, filters: QueryConstraint[]): Promise<number> => {
  return (await getCountFromServer(query(target, ...filters))).data().count
}

/** イベントの注文済み件数 */
export const countOrderedByEventId = async (eventId: string): Promise<number> => {
  return countOf(collectionGroup(db, 'member_orders'), [
    where('event_id', '==', eventId),
    where('status', '==', 'ordered'),
  ])
}

/** コミュニティのイベント数（論理削除を除く） */
export const countEventsByCommunityId = async (communityId: string): Promise<number> => {
  return countOf(collectionGroup(db, 'events'), [
    where('community_id', '==', communityId),
    where('is_deleted', '==', false),
  ])
}

/** コミュニティのメンバー数 */
export const countCommunityMembers = async (communityId: string): Promise<number> => {
  return countOf(collection(db, 'communities', communityId, 'members'), [])
}

/** 運営承認待ちのコミュニティ数 */
export const countPendingCommunities = async (): Promise<number> => {
  return countOf(collection(db, 'communities'), [where('is_approved', '==', false)])
}

/** 運営承認待ちの店舗数 */
export const countPendingShops = async (): Promise<number> => {
  return countOf(collectionGroup(db, 'shops'), [where('is_approved', '==', false)])
}

/** 注文受付中のイベント数 */
export const countAcceptingOrderEvents = async (): Promise<number> => {
  return countOf(collectionGroup(db, 'events'), [
    where('event_status.value', '==', 'accepting_order'),
    where('is_deleted', '==', false),
  ])
}

/** 予約申請中のイベント数 */
export const countApplyingReservationEvents = async (): Promise<number> => {
  return countOf(collectionGroup(db, 'events'), [
    where('event_status.value', '==', 'applying_reservation'),
    where('is_deleted', '==', false),
  ])
}

/** 指定日時以降に確定した注文件数 */
export const countOrdersOrderedSince = async (since: Date): Promise<number> => {
  return countOf(collectionGroup(db, 'member_orders'), [
    where('status', '==', 'ordered'),
    where('ordered_at', '>=', since),
  ])
}
