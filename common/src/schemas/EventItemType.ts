import { z } from 'zod'

export const EVENT_ITEM_TYPE_VALUES = ['partner_menu', 'organizer_menu', 'ticket'] as const
export type EventItemTypeType = (typeof EVENT_ITEM_TYPE_VALUES)[number]

export const EventItemTypeSchema = z.enum(EVENT_ITEM_TYPE_VALUES).default('partner_menu')

/** 予約ドキュメント ID（注文なし参加） */
export const NO_ORDER_PARTICIPATION_MENU_ID = 'no_order_participation'

/** 予約 EventMenu の表示名（Firestore 永続・参加者向け UI） */
export const NO_ORDER_PARTICIPATION_MENU_NAME = '注文なしで参加（食事は持参）'

/** 予約 EventMenu の説明文（Firestore 永続・参加者向け UI） */
export const NO_ORDER_PARTICIPATION_MENU_DESCRIPTION =
  'メニューを注文できない方向けです。アレルギー、好みが合わない、お弁当持参など、どうしても注文できない場合のみこちらをお選びください。当日の食事はご自身でご用意いただきます。'

/** メニュー一覧末尾固定の sort 番号 */
export const NO_ORDER_PARTICIPATION_SORT_NUMBER = 999999
