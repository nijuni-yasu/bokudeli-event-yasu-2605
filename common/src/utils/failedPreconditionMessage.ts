import { SOLD_OUT_MENU_ERROR_MESSAGE } from './assertEventMenusOrderable.js'
import { MENU_LIMIT_EXCEEDED_MESSAGE } from './menuLimit.js'

/** 利用者向けにそのまま表示してよい failed-precondition メッセージか判定し、該当時は文言を返す */
export function getUserFacingFailedPreconditionMessage(message: string): string | null {
  if (message.includes(SOLD_OUT_MENU_ERROR_MESSAGE) || message.includes(MENU_LIMIT_EXCEEDED_MESSAGE)) {
    return message
  }
  return null
}
