import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  HttpsError,
  getConfigGlobal,
  getCommunity,
  getEventInCommunity,
  getEventInvoicePayment,
  recordInvoicePaymentMailSent,
  sendCommunityBillInvoiceMail,
} = vi.hoisted(() => {
  class HttpsError extends Error {
    constructor(
      public code: string,
      message: string,
    ) {
      super(message)
    }
  }
  return {
    HttpsError,
    getConfigGlobal: vi.fn(),
    getCommunity: vi.fn(),
    getEventInCommunity: vi.fn(),
    getEventInvoicePayment: vi.fn(),
    recordInvoicePaymentMailSent: vi.fn(),
    sendCommunityBillInvoiceMail: vi.fn(),
  }
})

vi.mock('firebase-functions/https', () => ({
  HttpsError,
  onCall: (_options: unknown, handler?: unknown) => (typeof _options === 'function' ? _options : handler),
}))

vi.mock('./stores/config.js', () => ({
  getConfigGlobal,
}))

vi.mock('./stores/community.js', () => ({
  getCommunity,
}))

vi.mock('./stores/event.js', () => ({
  getEventInCommunity,
}))

vi.mock('./stores/eventInvoicePayment.js', () => ({
  getEventInvoicePayment,
  recordInvoicePaymentMailSent,
}))

vi.mock('./eventBillInvoice.js', () => ({
  sendCommunityBillInvoiceMail,
}))

vi.mock('./utils/logger.js', () => ({
  createModuleLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}))

import { resendCommunityBillInvoiceMail } from './resendCommunityBillInvoiceMail.js'

const callResend = resendCommunityBillInvoiceMail as unknown as (request: {
  auth?: { uid: string }
  data: { communityId: string; eventId: string }
}) => Promise<{ to: string; sentAt: number }>

const now = Date.now()

beforeEach(() => {
  vi.clearAllMocks()
  getConfigGlobal.mockResolvedValue({ isSupport: () => true })
  getCommunity.mockResolvedValue({ community_id: 'c1' })
  getEventInCommunity.mockResolvedValue({
    event_payment: 'community_bill',
    bill_email: 'bill@example.com',
    organizer_email: 'org@example.com',
    event_start_datetime: now - 1000,
    event_end_datetime: now - 500,
  })
  getEventInvoicePayment.mockResolvedValue({
    status: 'unpaid',
    last_mail_sent_at: undefined,
  })
  sendCommunityBillInvoiceMail.mockResolvedValue({ to: 'bill@example.com', invoiceId: 'inv-1' })
  recordInvoicePaymentMailSent.mockResolvedValue({ last_mail_sent_at: now })
})

describe('resendCommunityBillInvoiceMail', () => {
  it('未ログインは unauthenticated', async () => {
    await expect(callResend({ data: { communityId: 'c1', eventId: 'e1' } })).rejects.toMatchObject({
      code: 'unauthenticated',
    })
  })

  it('非 support は permission-denied', async () => {
    getConfigGlobal.mockResolvedValue({ isSupport: () => false })
    await expect(
      callResend({ auth: { uid: 'user-1' }, data: { communityId: 'c1', eventId: 'e1' } }),
    ).rejects.toMatchObject({ code: 'permission-denied' })
    expect(sendCommunityBillInvoiceMail).not.toHaveBeenCalled()
  })

  it('未払い以外は failed-precondition', async () => {
    getEventInvoicePayment.mockResolvedValue({ status: 'paid' })
    await expect(
      callResend({ auth: { uid: 'support-1' }, data: { communityId: 'c1', eventId: 'e1' } }),
    ).rejects.toMatchObject({ code: 'failed-precondition', message: 'not_unpaid' })
    expect(sendCommunityBillInvoiceMail).not.toHaveBeenCalled()
  })

  it('bill_email 空は failed-precondition', async () => {
    getEventInCommunity.mockResolvedValue({
      event_payment: 'community_bill',
      bill_email: '',
      event_start_datetime: now - 1000,
    })
    await expect(
      callResend({ auth: { uid: 'support-1' }, data: { communityId: 'c1', eventId: 'e1' } }),
    ).rejects.toMatchObject({ code: 'failed-precondition', message: 'missing_bill_email' })
  })

  it('クールダウン中は failed-precondition', async () => {
    getEventInvoicePayment.mockResolvedValue({
      status: 'unpaid',
      last_mail_sent_at: now - 1000,
    })
    await expect(
      callResend({ auth: { uid: 'support-1' }, data: { communityId: 'c1', eventId: 'e1' } }),
    ).rejects.toMatchObject({ code: 'failed-precondition', message: 'cooldown' })
  })

  it('条件を満たせば督促メールを送り last_mail を更新する', async () => {
    const result = await callResend({
      auth: { uid: 'support-1' },
      data: { communityId: 'c1', eventId: 'e1' },
    })
    expect(sendCommunityBillInvoiceMail).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'reminder')
    expect(recordInvoicePaymentMailSent).toHaveBeenCalledWith('c1', 'e1', 'support-1')
    expect(result.to).toBe('bill@example.com')
  })
})
