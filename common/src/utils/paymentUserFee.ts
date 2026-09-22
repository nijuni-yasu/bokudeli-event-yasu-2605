/**
 * Stripe 実課金の自己負担額に対するユーザー決済手数料。
 * `MAX(110, FLOOR(自己負担 × 0.1, 100) × 1.1)` と同等。自己負担 0 以下は 0。
 *
 * @see documents/01_マネタイズと決済/02_ユーザー決済手数料.md
 */
import type { CommunityBillSettingsType, EventPaymentType } from '../schemas/Event.js'

export function computeUserPaymentFeeFromSelfPay(selfPay: number): number {
  if (selfPay <= 0) return 0
  return Math.max(110, Math.floor(selfPay / 1000) * 110)
}

export function computeCheckoutTotalFromSelfPay(selfPay: number): { selfPay: number; fee: number; total: number } {
  const fee = computeUserPaymentFeeFromSelfPay(selfPay)
  return { selfPay, fee, total: selfPay + fee }
}

/** Webhook が EventStripe に書く pay_amount / pay_user_fee_amount。手数料 0 のレガシーは fee フィールドを省略。 */
export function computeEventStripePayFields(selfPay: number): {
  pay_amount: number
  pay_user_fee_amount?: number
} {
  const fee = computeUserPaymentFeeFromSelfPay(selfPay)
  return {
    pay_amount: selfPay + fee,
    ...(fee > 0 ? { pay_user_fee_amount: fee } : {}),
  }
}

/** amount_total が無いセッションは検証スキップ。あるときは pay_amount と一致必須。 */
export function isCheckoutAmountTotalMatchingPayAmount(
  amountTotal: number | null | undefined,
  payAmount: number,
): boolean {
  return amountTotal == null || amountTotal === payAmount
}

/** Stripe Checkout に手数料を載せる支払い方式か（自己負担 0 は対象外） */
export function shouldApplyUserPaymentFee(
  eventPayment: EventPaymentType,
  selfPay: number,
  communityBillSettings?: Pick<CommunityBillSettingsType, 'type'> | null,
): boolean {
  if (selfPay <= 0) return false
  if (eventPayment === 'user_advance') return true
  if (eventPayment === 'enterprise_subsidy') return true
  return eventPayment === 'community_bill' && communityBillSettings?.type === 'discount'
}

/** カート・マイページ用のプレビュー。確定後の正本は EventStripe.pay_user_fee_amount。 */
export function previewUserPaymentFee(
  eventPayment: EventPaymentType,
  selfPay: number,
  communityBillSettings?: Pick<CommunityBillSettingsType, 'type'> | null,
): number {
  if (!shouldApplyUserPaymentFee(eventPayment, selfPay, communityBillSettings)) return 0
  return computeUserPaymentFeeFromSelfPay(selfPay)
}
