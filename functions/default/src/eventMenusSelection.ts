import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { getFirestore } from 'firebase-admin/firestore'
import { createModuleLogger } from './utils/logger.js'
import { getEventInCommunity, ShokujiiEvent } from './stores/event.js'
import { getCommunity } from './stores/community.js'
import { getConfigGlobal } from './stores/config.js'
import { UpdateEventMenusRequest } from '@shokujii/common/apis/eventMenu.js'
import { NO_ORDER_PARTICIPATION_MENU_ID } from '@shokujii/common/schemas/EventItemType.js'
import type { EventMenu } from '@shokujii/common/schemas/EventMenu.js'
import {
  buildNoOrderParticipationEventMenu,
  updateEventMenusIsSelected,
  shouldRegenerateFromPartnerMenus,
  shouldUpdateExistingMenusOnly,
} from '@shokujii/common/utils/eventMenuConverter.js'
import { savePartnerMenusToEventMenus } from './eventMenusSnapshot.js'
import type { Transaction } from 'firebase-admin/firestore'

const logger = createModuleLogger('eventMenusSelection')

/** Transaction 内の read は全 write より前に済ませる必要があるため、既読の menus を受け取る */
async function upsertNoOrderParticipationMenu(
  event: ShokujiiEvent,
  existingMenus: EventMenu[],
  isSelected: boolean,
  transaction: Transaction,
): Promise<void> {
  const existing = existingMenus.find((m) => m.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
  // トグル OFF かつ未作成の場合は予約ドキュメントを作らない（UI は doc 無しでも false 扱い）
  if (existing == null && !isSelected) {
    return
  }
  const menu = buildNoOrderParticipationEventMenu(event.id, isSelected)
  if (
    existing == null ||
    existing.is_selected !== isSelected ||
    existing.menu_name !== menu.menu_name ||
    existing.menu_description !== menu.menu_description
  ) {
    await event.saveMenu(menu, transaction)
  }
}

/**
 * イベントのメニューを更新するCallable Function
 * 主催者がイベント保存時に、selectedMenuIdsを受け取り、
 * event_statusによって処理を分岐:
 * - accepting_order状態: 既存EventMenuのis_selectedのみ更新（満席・締切時も同様）
 * - finished状態: 更新不可（エラー）
 * - それ以外: 最新のPartnerMenuから全EventMenuを生成して保存（is_selectedフラグで選択状態を管理）
 *
 * 重要:
 * - 全てのPartnerMenuがEventMenuとして保存され、is_selectedフラグで選択状態を管理
 * - メニューの有効期間チェックが実行され、期間外のメニューは自動的に除外される
 * - メニュー内容の固定判定にはevent_status.valueを使用（満席や締切でも承認後は固定）
 * - 編集禁止判定にはcalculatedEventStatusを使用（イベント終了時刻を過ぎていれば自動的にfinished判定）
 *
 * @param request.data.eventId - イベントID
 * @param request.data.communityId - コミュニティID
 * @param request.data.selectedMenuIds - 選択されたmenu_idの配列（`no_order_participation` を含む場合あり）
 *
 * @throws {HttpsError} unauthenticated - 認証されていない場合
 * @throws {HttpsError} invalid-argument - 必須パラメータが不足している場合
 * @throws {HttpsError} permission-denied - ユーザーに編集権限がない場合
 * @throws {HttpsError} not-found - イベントまたはPartnerが見つからない場合
 * @throws {HttpsError} failed-precondition - イベントがfinished状態の場合
 * @throws {HttpsError} internal - その他のエラー
 */
export const updateEventMenus = onCall<UpdateEventMenusRequest>({ region: 'asia-northeast1' }, async (request) => {
  // 認証チェック
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated')
  }

  const { eventId, communityId, selectedMenuIds } = request.data

  // パラメータバリデーション
  if (!eventId || !communityId || !Array.isArray(selectedMenuIds)) {
    throw new HttpsError('invalid-argument', 'eventId, communityId, and selectedMenuIds (array) are required')
  }

  const noOrderSelected = selectedMenuIds.includes(NO_ORDER_PARTICIPATION_MENU_ID)
  const partnerSelectedIds = selectedMenuIds.filter((id) => id !== NO_ORDER_PARTICIPATION_MENU_ID)

  if (partnerSelectedIds.length === 0) {
    throw new HttpsError('invalid-argument', 'At least one menu must be selected')
  }

  // 認可チェック: コミュニティのマネージャーまたはサポートユーザーである必要がある
  const community = await getCommunity(communityId)
  if (!community) {
    throw new HttpsError('not-found', `Community ${communityId} not found`)
  }
  const userId = request.auth.uid
  const isManager = await community.hasRole(userId, 'manager')
  const config = await getConfigGlobal()
  const isSupport = config?.isSupport(userId) ?? false
  if (!isManager && !isSupport) {
    throw new HttpsError('permission-denied', 'User does not have permission to update this event')
  }

  try {
    const regenerateParams = await getFirestore().runTransaction(async (transaction) => {
      const event = await getEventInCommunity(communityId, eventId, transaction)
      if (event == null) {
        throw new HttpsError('not-found', `Event ${eventId} not found`)
      }

      const eventStatus = event.event_status.value
      const calculatedStatus = event.calculatedEventStatus

      if (calculatedStatus === 'finished' || calculatedStatus === 'event_canceled') {
        throw new HttpsError('failed-precondition', 'Cannot update menus after event is finished or canceled.')
      }

      if (shouldUpdateExistingMenusOnly(eventStatus)) {
        const existingEventMenus = await event.getMenus(transaction)
        const { changedMenus } = updateEventMenusIsSelected(existingEventMenus, selectedMenuIds)

        await Promise.all(
          changedMenus.map(async (menu) => {
            await event.saveMenu(menu, transaction)
          }),
        )

        await upsertNoOrderParticipationMenu(event, existingEventMenus, noOrderSelected, transaction)

        logger.info('Updated is_selected flags in accepting_order status', {
          eventId,
          communityId,
          status: eventStatus,
          selectedMenusCount: selectedMenuIds.length,
          changedMenusCount: changedMenus.length,
          noOrderSelected,
        })
        return null
      }

      if (shouldRegenerateFromPartnerMenus(eventStatus)) {
        if (event.partner_id === '') {
          throw new HttpsError('failed-precondition', 'Partner must be set before saving menus')
        }
        return {
          partnerId: event.partner_id,
          startDatetime: event.event_start_datetime,
          noOrderSelected,
        }
      }

      throw new HttpsError('failed-precondition', `Unexpected event status: ${eventStatus}`)
    })

    if (regenerateParams != null) {
      await savePartnerMenusToEventMenus(
        regenerateParams.partnerId,
        eventId,
        communityId,
        regenerateParams.startDatetime,
        partnerSelectedIds,
      )

      await getFirestore().runTransaction(async (transaction) => {
        const event = await getEventInCommunity(communityId, eventId, transaction)
        if (event == null) {
          throw new HttpsError('not-found', `Event ${eventId} not found`)
        }
        const existingMenus = await event.getMenus(transaction)
        await upsertNoOrderParticipationMenu(event, existingMenus, regenerateParams.noOrderSelected, transaction)
      })

      logger.info('Updated all menus from latest PartnerMenus with is_selected flag', {
        eventId,
        communityId,
        selectedMenusCount: selectedMenuIds.length,
        noOrderSelected,
      })
    }

    return { success: true }
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error
    }
    logger.error('Failed to update event menus', {
      eventId,
      communityId,
      selectedMenuIds,
      error,
    })
    throw new HttpsError('internal', 'Failed to update event menus')
  }
})
