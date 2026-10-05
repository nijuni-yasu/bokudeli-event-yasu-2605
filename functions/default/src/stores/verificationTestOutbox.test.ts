import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Timestamp } from 'firebase-admin/firestore'
import { PASS_CODE_DURATION } from '@shokujii/common/schemas/PassCode.js'

const { query, batch } = vi.hoisted(() => ({
  query: { withConverter: vi.fn(), where: vi.fn(), orderBy: vi.fn(), limit: vi.fn(), get: vi.fn() },
  batch: { delete: vi.fn(), commit: vi.fn() },
}))
vi.mock('firebase-admin/firestore', async (importOriginal) => {
  const original = await importOriginal<typeof import('firebase-admin/firestore')>()
  return { ...original, getFirestore: () => ({ collection: () => query, batch: () => batch }) }
})
import {
  deleteExpiredVerificationTestOutboxRecords,
  getLatestVerificationTestPassCode,
} from './verificationTestOutbox.js'

const now = 1770000000000
beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(Timestamp, 'now').mockReturnValue(Timestamp.fromMillis(now))
  for (const method of [query.withConverter, query.where, query.orderBy, query.limit]) method.mockReturnValue(query)
  batch.commit.mockResolvedValue([])
})

describe('検証用 OTP の期限', () => {
  it.each([now - 1, now, now + 1])('期限 %s と現在時刻を比較する', async (expiresAt) => {
    query.get.mockResolvedValueOnce({
      docs: [{ data: () => ({ pass_code: '123456', expires_at: expiresAt }) }],
    })
    const result = await getLatestVerificationTestPassCode('pstack.participant@verify.shokujii.test', 'run-1')
    expect(result).toBe(expiresAt > now ? '123456' : undefined)
    expect(query.where).toHaveBeenCalledWith('verification_run_id', '==', 'run-1')
  })

  it('古い記録を認証本体と同じ期間で削除し、取得直後には削除しない', async () => {
    const ref = { id: 'old-record' }
    query.get.mockResolvedValue({ empty: false, size: 1, docs: [{ ref }] })
    expect(await deleteExpiredVerificationTestOutboxRecords()).toBe(1)
    expect(query.where).toHaveBeenCalledWith('created_at', '<=', Timestamp.fromMillis(now - PASS_CODE_DURATION))
    expect(batch.delete).toHaveBeenCalledWith(ref)
    expect(batch.commit).toHaveBeenCalledOnce()
  })
})
