import { describe, expect, it } from 'vitest'
import { convertNumberToYen } from '@shokujii/common/utils/converter.js'
import {
  NIJUNI_COMPANY_NAME,
  NIJUNI_INVOICE_REGISTRATION_NUMBER,
  RECEIPT_PAYMENT_METHOD_FALLBACK,
  buildEventReceiptMenuLines,
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
    orders: [{ menu_name: 'カレー', menu_price: 1000, status: 'ordered' }],
  }

  it('出前館型 2 ブロックの税内訳', () => {
    const data = buildEventReceiptMergeData(base)
    expect(data.hasFee).toBe(true)
    expect(data.shop).toBe('テスト食堂')
    expect(data.invoiceId).toBe('T1234567890123')
    expect(data.shopInvoiceLine).toBe('適格請求書登録番号：T1234567890123')
    expect(data.footer).toBe('お食事代に係る領収書は、販売元の委託に基づき、ニジュウニ株式会社が代理発行しています。')
    expect(data.nijuniName).toBe(NIJUNI_COMPANY_NAME)
    expect(data.nijuniInvoiceId).toBe(NIJUNI_INVOICE_REGISTRATION_NUMBER)
    expect(data.shopSubtotal).toBe(convertNumberToYen(1000))
    expect(data.hasShopInvoice).toBe(true)
    expect(data.shop8).toBe(convertNumberToYen(1000))
    expect(data.shop8Tax).toBe(convertNumberToYen(75))
    expect(data.shopExTax).toBe(convertNumberToYen(925))
    expect(data.fee).toBe(convertNumberToYen(110))
    expect(data.fee10).toBe(convertNumberToYen(110))
    expect(data.fee10Tax).toBe(convertNumberToYen(10))
    expect(data.feeExTax).toBe(convertNumberToYen(100))
    expect(data.nijuniPostalCode).toBe('〒101-0064')
    expect(data.nijuniEmail).toBe('support@nijuni.jp')
    expect(data.grandTotal).toBe(convertNumberToYen(1110))
    expect(data.price).toBe(data.grandTotal)
    expect(data.menus).toEqual([{ menu_name: 'カレー', count: 1, price: convertNumberToYen(1000) }])
    expect(data.paymentMethod).toBe(RECEIPT_PAYMENT_METHOD_FALLBACK)
    expect(data.event).toBe('カレー会 / お食事代および決済手数料として')
  })

  it('店番号が無いときは適格請求書ではないと書き、手数料 0 はお食事代のみ', () => {
    const data = buildEventReceiptMergeData({
      ...base,
      shopInvoiceNumber: '  ',
      payAmount: 1000,
      payUserFeeAmount: undefined,
    })
    expect(data.hasShopInvoice).toBe(false)
    expect(data.invoiceId).toBe('')
    expect(data.shopInvoiceLine).toBe('お食事代部分は適格請求書ではありません')
    expect(data.hasFee).toBe(false)
    expect(data.fee).toBe(convertNumberToYen(0))
    expect(data.event).toBe('カレー会 / お食事代として')
    expect(data.grandTotal).toBe(convertNumberToYen(1000))
  })

  it('補助・主催者負担がある行は自己負担単価を出し小計と一致する', () => {
    const data = buildEventReceiptMergeData({
      ...base,
      payAmount: 810,
      payUserFeeAmount: 110,
      orders: [
        {
          menu_name: 'カレー',
          menu_price: 1000,
          status: 'ordered',
          pay_community_bill_off_amount: 300,
        },
      ],
    })
    expect(data.menus).toEqual([{ menu_name: 'カレー', count: 1, price: convertNumberToYen(700) }])
    expect(data.shopSubtotal).toBe(convertNumberToYen(700))
    expect(data.grandTotal).toBe(convertNumberToYen(810))
  })

  it('部分キャンセル後は残注文の自己負担だけを内訳にする', () => {
    const data = buildEventReceiptMergeData({
      ...base,
      payAmount: 2110,
      payUserFeeAmount: 110,
      refundedTotal: 1000,
      orders: [
        { menu_name: 'カレー', menu_price: 1000, status: 'ordered' },
        { menu_name: 'カレー', menu_price: 1000, status: 'canceled' },
      ],
    })
    expect(data.menus).toEqual([{ menu_name: 'カレー', count: 1, price: convertNumberToYen(1000) }])
    expect(data.shopSubtotal).toBe(convertNumberToYen(1000))
    expect(data.grandTotal).toBe(convertNumberToYen(1110))
  })
})

describe('buildEventReceiptMenuLines', () => {
  it('同じ自己負担単価の行を集約し、自己負担0は出さない', () => {
    expect(
      buildEventReceiptMenuLines([
        { menu_name: 'カレー', menu_price: 1000, status: 'ordered' },
        { menu_name: 'カレー', menu_price: 1000, status: 'ordered' },
        {
          menu_name: 'サラダ',
          menu_price: 500,
          status: 'ordered',
          pay_enterprise_subsidy_amount: 500,
        },
        { menu_name: 'うどん', menu_price: 800, status: 'canceled' },
      ]),
    ).toEqual([{ menu_name: 'カレー', count: 2, price: convertNumberToYen(1000) }])
  })
})
