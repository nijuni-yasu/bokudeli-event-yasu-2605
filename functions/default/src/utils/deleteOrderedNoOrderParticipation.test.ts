import { describe, expect, it } from 'vitest'
import { NO_ORDER_PARTICIPATION_MENU_ID } from '@shokujii/common/schemas/EventItemType.js'
import { orderedNoOrderIdsToDelete } from './deleteOrderedNoOrderParticipation.js'

const noOrder = (status: string, id = 'no-order') => ({
  id,
  menu_id: NO_ORDER_PARTICIPATION_MENU_ID,
  status,
})

describe('orderedNoOrderIdsToDelete', () => {
  it('店舗メニューの確定では ordered の注文なし参加だけを返す', () => {
    expect(
      orderedNoOrderIdsToDelete(
        [noOrder('ordered'), noOrder('in_cart', 'cart'), noOrder('canceled', 'canceled')],
        [{ id: 'food', item_type: 'partner_menu' }],
      ),
    ).toEqual(['no-order'])
  })

  it('注文なし参加だけの確定では削除しない', () => {
    expect(
      orderedNoOrderIdsToDelete([noOrder('ordered')], [{ id: 'no-order', item_type: 'organizer_menu' }]),
    ).toEqual([])
  })

  it('item_type 未設定の店舗注文でも ordered の注文なし参加を返す', () => {
    expect(orderedNoOrderIdsToDelete([noOrder('ordered')], [{ id: 'food' }])).toEqual(['no-order'])
  })
})
