import { z } from 'zod'

/** PartnerMenu / EventMenu の limit_per_event 上限 */
export const MENU_LIMIT_PER_EVENT_MAX = 1000

/**
 * AppSchema 読み込み時の正規化。
 * 上限超過・非整数・1未満など不正値は null（無制限）として扱い、既存データによる読み込み失敗を防ぐ。
 */
export function normalizeLimitPerEventForApp(val: unknown): number | null {
  if (val == null) {
    return null
  }
  if (typeof val !== 'number' || !Number.isInteger(val) || val < 1 || val > MENU_LIMIT_PER_EVENT_MAX) {
    return null
  }
  return val
}

export const LimitPerEventAppFieldSchema = z.preprocess(
  normalizeLimitPerEventForApp,
  z.number().int().positive().max(MENU_LIMIT_PER_EVENT_MAX).nullable().default(null),
)

export const LimitPerEventDbFieldSchema = z.number().int().positive().max(MENU_LIMIT_PER_EVENT_MAX).nullable()
