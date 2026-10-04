import { SOLD_OUT_MENU_ERROR_MESSAGE } from './assertEventMenusOrderable.js'
import { MENU_LIMIT_EXCEEDED_MESSAGE } from './menuLimit.js'
import { INVALID_MENU_PRICE_MESSAGE, INVALID_OPTION_SELECTION_MESSAGE } from './menuOption.js'
import {
  NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_IN_CART_MESSAGE,
  NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_ORDERED_MESSAGE,
  NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_PROCESSING_MESSAGE,
} from './noOrderParticipationMessages.js'

/** 利用者向けにそのまま表示してよい failed-precondition メッセージか判定し、該当時は文言を返す */
export function getUserFacingFailedPreconditionMessage(message: string): string | null {
  if (
    message.includes(SOLD_OUT_MENU_ERROR_MESSAGE) ||
    message.includes(MENU_LIMIT_EXCEEDED_MESSAGE) ||
    message.includes(INVALID_OPTION_SELECTION_MESSAGE) ||
    message.includes(INVALID_MENU_PRICE_MESSAGE) ||
    message.includes(NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_IN_CART_MESSAGE) ||
    message.includes(NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_ORDERED_MESSAGE) ||
    message.includes(NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_PROCESSING_MESSAGE)
  ) {
    return message
  }
  return null
}
