import { convertNumberToYen } from '@shokujii/common/utils/converter.js'
import { convertToDate, convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { computeInclusive8ExTaxAndTax, computeInclusive10ExTaxAndTax } from '@shokujii/common/utils/invoice.js'
import type { StripeMenuType } from '@shokujii/common/schemas/EventStripe.js'

/** ニジュウニ株式会社の適格請求書発行事業者登録番号（店舗マスタに持たない） */
export const NIJUNI_INVOICE_REGISTRATION_NUMBER = 'T8010001198825'
export const NIJUNI_COMPANY_NAME = 'ニジュウニ株式会社'
export const RECEIPT_PAYMENT_METHOD_FALLBACK = 'オンライン決済'
export const RECEIPT_SHOP_FOOTER = 'このお食事代の領収書はイベント開催店舗により発行するものです。'

export type EventReceiptMergeInput = {
  eventName: string
  eventStartDatetime: number
  shopName: string
  shopInvoiceNumber: string | null | undefined
  shopAddress: string
  receiptNumber: string
  reissue: boolean
  orderCreatedAt: number
  issuedAt: number
  payAmount: number
  payUserFeeAmount: number | undefined
  refundedTotal: number
  menus: StripeMenuType[]
  paymentMethod?: string
}

export type EventReceiptMergeData = {
  reissue: boolean
  hasFee: boolean
  number: string
  date: string
  issuedAt: string
  orderDate: string
  eventDate: string
  event: string
  shop: string
  invoiceId: string
  address: string
  paymentMethod: string
  menus: { menu_name: string; count: number; price: string }[]
  shopSubtotal: string
  shop8: string
  shop8Tax: string
  shop10: string
  shop10Tax: string
  rawPrice: string
  tax: string
  fee: string
  fee8: string
  fee8Tax: string
  fee10: string
  fee10Tax: string
  nijuniName: string
  nijuniInvoiceId: string
  grandTotal: string
  price: string
  footer: string
}

export function computeEventReceiptAmounts(input: {
  payAmount: number
  payUserFeeAmount: number | undefined
  refundedTotal: number
}): {
  fee: number
  shopSubtotal: number
  grandTotal: number
} {
  const fee = input.payUserFeeAmount ?? 0
  const foodCharged = Math.max(0, input.payAmount - fee)
  const shopSubtotal = Math.max(0, foodCharged - input.refundedTotal)
  return { fee, shopSubtotal, grandTotal: shopSubtotal + fee }
}

export function buildEventReceiptMergeData(input: EventReceiptMergeInput): EventReceiptMergeData {
  const { fee, shopSubtotal, grandTotal } = computeEventReceiptAmounts(input)
  const shopTax = computeInclusive8ExTaxAndTax(shopSubtotal)
  const feeTax = computeInclusive10ExTaxAndTax(fee)
  const hasFee = fee > 0
  const issuedAt = convertToDatetime(input.issuedAt)
  const shopSubtotalYen = convertNumberToYen(shopSubtotal)
  const shop8TaxYen = convertNumberToYen(shopTax.taxPrice)
  const grandTotalYen = convertNumberToYen(grandTotal)
  const zeroYen = convertNumberToYen(0)

  return {
    reissue: input.reissue,
    hasFee,
    number: input.receiptNumber,
    date: issuedAt,
    issuedAt,
    orderDate: convertToDatetime(input.orderCreatedAt),
    eventDate: convertToDate(input.eventStartDatetime),
    event: `${input.eventName} / お食事代として`,
    shop: input.shopName,
    invoiceId: input.shopInvoiceNumber ?? 'なし',
    address: input.shopAddress,
    paymentMethod: input.paymentMethod ?? RECEIPT_PAYMENT_METHOD_FALLBACK,
    menus: input.menus.map((menu) => ({
      menu_name: menu.menu_name,
      count: menu.count,
      price: convertNumberToYen(menu.menu_price),
    })),
    shopSubtotal: shopSubtotalYen,
    shop8: shopSubtotalYen,
    shop8Tax: shop8TaxYen,
    shop10: zeroYen,
    shop10Tax: zeroYen,
    rawPrice: convertNumberToYen(shopTax.exTaxPrice),
    tax: shop8TaxYen,
    fee: convertNumberToYen(fee),
    fee8: zeroYen,
    fee8Tax: zeroYen,
    fee10: convertNumberToYen(fee),
    fee10Tax: convertNumberToYen(feeTax.taxPrice),
    nijuniName: NIJUNI_COMPANY_NAME,
    nijuniInvoiceId: NIJUNI_INVOICE_REGISTRATION_NUMBER,
    grandTotal: grandTotalYen,
    price: grandTotalYen,
    footer: RECEIPT_SHOP_FOOTER,
  }
}
