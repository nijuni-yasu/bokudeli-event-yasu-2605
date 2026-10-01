/**
 * Stripe 実課金の自己負担額に対するシステム利用料（画面上の名称）。
 * 自己負担がある場合は定額。自己負担 0 以下は 0。
 *
 * @see documents/01_マネタイズと決済/02_ユーザー決済手数料.md
 */
import type { CommunityBillSettingsType, EventPaymentType } from '../schemas/Event.js'

/** 新規 Checkout 1 セッションあたりの税込手数料。料金改定はこの定数を変更する。 */
export const USER_PAYMENT_FEE_AMOUNT = 110

export function computeUserPaymentFeeFromSelfPay(selfPay: number): number {
  if (selfPay <= 0) return 0
  return USER_PAYMENT_FEE_AMOUNT
}

export function computeCheckoutTotalFromSelfPay(selfPay: number): { selfPay: number; fee: number; total: number } {
  const fee = computeUserPaymentFeeFromSelfPay(selfPay)
  return { selfPay, fee, total: selfPay + fee }
}

/** EventStripe に書く金額。Webhook は Checkout の実際の手数料を必ず渡す。手数料 0 は fee を省略。 */
export function computeEventStripePayFields(
  selfPay: number,
  chargedFee: number,
): {
  pay_amount: number
  pay_user_fee_amount?: number
} {
  return {
    pay_amount: selfPay + chargedFee,
    ...(chargedFee > 0 ? { pay_user_fee_amount: chargedFee } : {}),
  }
}

/** Stripe の実課金額と保存予定額が一致することを確認する。金額欠落は確定不可。 */
export function isCheckoutAmountTotalMatchingPayAmount(
  amountTotal: number | null | undefined,
  payAmount: number,
): boolean {
  return amountTotal != null && amountTotal === payAmount
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
