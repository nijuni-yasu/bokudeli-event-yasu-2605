import { describe, expect, it } from 'vitest'
import { NO_ORDER_PARTICIPATION_MENU_ID } from '@shokujii/common/schemas/EventItemType.js'
import { inCartNoOrderIdsToReplace } from './replaceInCartNoOrderParticipation.js'

const partnerMenu = { id: 'food', item_type: 'partner_menu' as const }
const noOrderMenu = { id: NO_ORDER_PARTICIPATION_MENU_ID, item_type: 'organizer_menu' as const }
const noOrderInCart = { menu_id: NO_ORDER_PARTICIPATION_MENU_ID, order_id: 'cart-no-order' }

describe('inCartNoOrderIdsToReplace', () => {
  it('店舗メニューを追加するときはカート内の注文なし参加を返す', () => {
    expect(inCartNoOrderIdsToReplace([{ menu_id: 'food', count: 1 }], [partnerMenu], [noOrderInCart])).toEqual([
      'cart-no-order',
    ])
  })

  it('注文なし参加だけの追加では削除しない', () => {
    expect(
      inCartNoOrderIdsToReplace(
        [{ menu_id: NO_ORDER_PARTICIPATION_MENU_ID, count: 1 }],
        [noOrderMenu],
        [noOrderInCart],
      ),
    ).toEqual([])
  })

  it('数量 0 の店舗メニューでは削除しない', () => {
    expect(inCartNoOrderIdsToReplace([{ menu_id: 'food', count: 0 }], [partnerMenu], [noOrderInCart])).toEqual([])
  })

  it('正数と負数が相殺されても店舗メニューの追加として削除する', () => {
    expect(
      inCartNoOrderIdsToReplace(
        [
          { menu_id: 'food', count: 1 },
          { menu_id: 'food', count: -1 },
        ],
        [partnerMenu],
        [noOrderInCart],
      ),
    ).toEqual(['cart-no-order'])
  })

  it('item_type 未設定の店舗メニューでも削除する', () => {
    expect(
      inCartNoOrderIdsToReplace(
        [{ menu_id: 'food', count: 2 }],
        [{ id: 'food' }],
        [
          noOrderInCart,
          { menu_id: NO_ORDER_PARTICIPATION_MENU_ID, order_id: 'cart-no-order-2' },
          { menu_id: 'food', order_id: 'cart-food' },
        ],
      ),
    ).toEqual(['cart-no-order', 'cart-no-order-2'])
  })

  it('主催者メニューの追加では削除しない', () => {
    expect(
      inCartNoOrderIdsToReplace(
        [{ menu_id: 'ticket', count: 1 }],
        [{ id: 'ticket', item_type: 'ticket' }],
        [noOrderInCart],
      ),
    ).toEqual([])
  })
})
