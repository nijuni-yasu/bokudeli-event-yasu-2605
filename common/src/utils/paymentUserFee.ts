/**
 * Stripe 実課金の自己負担額に対するユーザー決済手数料。
 * `MIN(220, MAX(110, FLOOR(自己負担 × 0.1, 100) × 1.1))` と同等。自己負担 0 以下は 0。
 *
 * @see documents/01_マネタイズと決済/02_ユーザー決済手数料.md
 */
import type { CommunityBillSettingsType, EventPaymentType } from '../schemas/Event.js'

/** 1,000 円刻みの税込手数料単位（最低額でもある） */
export const USER_PAYMENT_FEE_UNIT = 110
/** 1 セッションあたりの手数料上限 */
export const USER_PAYMENT_FEE_MAX = 220

export function computeUserPaymentFeeFromSelfPay(selfPay: number): number {
  if (selfPay <= 0) return 0
  return Math.min(
    USER_PAYMENT_FEE_MAX,
    Math.max(USER_PAYMENT_FEE_UNIT, Math.floor(selfPay / 1000) * USER_PAYMENT_FEE_UNIT),
  )
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

/** amount_total が無いセッションは検証スキップ。あるときは pay_amount か legacy_self_pay と一致必須。 */
export function isCheckoutAmountTotalMatchingPayAmount(
  amountTotal: number | null | undefined,
  payAmount: number,
  legacySelfPayAmount?: number,
): boolean {
  return (
    amountTotal == null ||
    amountTotal === payAmount ||
    (legacySelfPayAmount != null && amountTotal === legacySelfPayAmount)
  )
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

/** カート用のプレビュー。注文履歴の確定後は EventStripe.pay_user_fee_amount。 */
export function previewUserPaymentFee(
  eventPayment: EventPaymentType,
  selfPay: number,
  communityBillSettings?: Pick<CommunityBillSettingsType, 'type'> | null,
): number {
  if (!shouldApplyUserPaymentFee(eventPayment, selfPay, communityBillSettings)) return 0
  return computeUserPaymentFeeFromSelfPay(selfPay)
}

export type ChargedFeeOrderRef = {
  status: string
  stripe_id?: string
}

/**
 * 注文履歴に出す確定手数料。
 * キャンセル以外の注文が参照する stripe の pay_user_fee_amount を合算する。
 * フィールド未設定・ドキュメント無しは 0（リリース前の決済）。
 */
export function sumChargedUserPaymentFee(
  orders: readonly ChargedFeeOrderRef[],
  feeByStripeId: Readonly<Record<string, number | undefined>>,
): number {
  const stripeIds = new Set<string>()
  for (const order of orders) {
    if (order.status === 'canceled') continue
    const stripeId = order.stripe_id
    if (stripeId == null || stripeId === '') continue
    stripeIds.add(stripeId)
  }
  let sum = 0
  for (const stripeId of stripeIds) {
    const fee = feeByStripeId[stripeId] ?? 0
    if (fee > 0) sum += fee
  }
  return sum
}
