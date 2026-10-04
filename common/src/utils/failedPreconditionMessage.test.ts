import { describe, expect, it } from 'vitest'
import { getUserFacingFailedPreconditionMessage } from './failedPreconditionMessage.js'
import {
  NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_IN_CART_MESSAGE,
  NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_ORDERED_MESSAGE,
} from './noOrderParticipationMessages.js'

describe('getUserFacingFailedPreconditionMessage', () => {
  it('returns no-order participation messages for cart and ordered partner blocks', () => {
    expect(getUserFacingFailedPreconditionMessage(NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_IN_CART_MESSAGE)).toBe(
      NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_IN_CART_MESSAGE,
    )
    expect(getUserFacingFailedPreconditionMessage(NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_ORDERED_MESSAGE)).toBe(
      NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_ORDERED_MESSAGE,
    )
  })

  it('returns null for unknown failed-precondition messages', () => {
    expect(getUserFacingFailedPreconditionMessage('注文なし参加と店舗メニューは同時にカートに追加できません')).toBeNull()
  })
})
