import { z } from 'zod'

export const EVENT_ITEM_TYPE_VALUES = ['partner_menu', 'organizer_menu', 'ticket'] as const
export type EventItemTypeType = (typeof EVENT_ITEM_TYPE_VALUES)[number]

export const EventItemTypeSchema = z.enum(EVENT_ITEM_TYPE_VALUES).default('partner_menu')

/** 予約ドキュメント ID（注文なし参加） */
export const NO_ORDER_PARTICIPATION_MENU_ID = 'no_order_participation'

/** メニュー一覧末尾固定の sort 番号 */
export const NO_ORDER_PARTICIPATION_SORT_NUMBER = 999999
