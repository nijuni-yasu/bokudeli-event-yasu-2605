import { describe, expect, it } from 'vitest'
import { convertNumberToYen } from '@shokujii/common/utils/converter.js'
import {
  NIJUNI_COMPANY_NAME,
  NIJUNI_INVOICE_REGISTRATION_NUMBER,
  RECEIPT_PAYMENT_METHOD_FALLBACK,
  buildEventReceiptMergeData,
  computeEventReceiptAmounts,
} from './eventReceiptMergeData.js'

describe('computeEventReceiptAmounts', () => {
  it('食事 1000 + 手数料 110、返金なし', () => {
    expect(computeEventReceiptAmounts({ payAmount: 1110, payUserFeeAmount: 110, refundedTotal: 0 })).toEqual({
      fee: 110,
      shopSubtotal: 1000,
      grandTotal: 1110,
    })
  })

  it('一部キャンセル後は食事残 + 手数料満額', () => {
    expect(computeEventReceiptAmounts({ payAmount: 1110, payUserFeeAmount: 110, refundedTotal: 1000 })).toEqual({
      fee: 110,
      shopSubtotal: 0,
      grandTotal: 110,
    })
  })

  it('レガシー（手数料未設定）は店舗のみ', () => {
    expect(computeEventReceiptAmounts({ payAmount: 1000, payUserFeeAmount: undefined, refundedTotal: 0 })).toEqual({
      fee: 0,
      shopSubtotal: 1000,
      grandTotal: 1000,
    })
  })
})

describe('buildEventReceiptMergeData', () => {
  const base = {
    eventName: 'カレー会',
    eventStartDatetime: Date.UTC(2026, 8, 22, 10, 0),
    shopName: 'テスト食堂',
    shopInvoiceNumber: 'T1234567890123',
    shopAddress: '東京都千代田区1-1-1',
    receiptNumber: '20260922-1',
    reissue: false,
    orderCreatedAt: Date.UTC(2026, 8, 20, 3, 0),
    issuedAt: Date.UTC(2026, 8, 22, 1, 0),
    payAmount: 1110,
    payUserFeeAmount: 110,
    refundedTotal: 0,
    menus: [{ menu_name: 'カレー', menu_price: 1000, count: 1 }],
  }

  it('出前館型 2 ブロックの税内訳', () => {
    const data = buildEventReceiptMergeData(base)
    expect(data.hasFee).toBe(true)
    expect(data.shop).toBe('テスト食堂')
    expect(data.invoiceId).toBe('T1234567890123')
    expect(data.nijuniName).toBe(NIJUNI_COMPANY_NAME)
    expect(data.nijuniInvoiceId).toBe(NIJUNI_INVOICE_REGISTRATION_NUMBER)
    expect(data.shopSubtotal).toBe(convertNumberToYen(1000))
    expect(data.shop8).toBe(convertNumberToYen(1000))
    expect(data.shop8Tax).toBe(convertNumberToYen(75))
    expect(data.shop10).toBe(convertNumberToYen(0))
    expect(data.fee).toBe(convertNumberToYen(110))
    expect(data.fee10).toBe(convertNumberToYen(110))
    expect(data.fee10Tax).toBe(convertNumberToYen(10))
    expect(data.grandTotal).toBe(convertNumberToYen(1110))
    expect(data.price).toBe(data.grandTotal)
    expect(data.menus).toEqual([{ menu_name: 'カレー', count: 1, price: convertNumberToYen(1000) }])
    expect(data.paymentMethod).toBe(RECEIPT_PAYMENT_METHOD_FALLBACK)
    expect(data.event).toContain('お食事代として')
  })

  it('店番号なしは「なし」。手数料 0 はニジュウニブロック非表示', () => {
    const data = buildEventReceiptMergeData({
      ...base,
      shopInvoiceNumber: undefined,
      payAmount: 1000,
      payUserFeeAmount: undefined,
    })
    expect(data.invoiceId).toBe('なし')
    expect(data.hasFee).toBe(false)
    expect(data.fee).toBe(convertNumberToYen(0))
    expect(data.grandTotal).toBe(convertNumberToYen(1000))
  })
})
