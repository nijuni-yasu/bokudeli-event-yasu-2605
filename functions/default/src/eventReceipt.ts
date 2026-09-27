import { onCall, HttpsError } from 'firebase-functions/https'
import { getFirestore } from 'firebase-admin/firestore'
import path from 'path'
import { DateTime } from 'luxon'
import { EventReceiptRequest, EventReceiptResponse } from '@shokujii/common/apis/eventReceipt.js'
import { convertDateToId } from '@shokujii/common/utils/datetime.js'
import { getMemberOrderDiscountAmount } from '@shokujii/common/utils/paymentEnterpriseSubsidyAmount.js'
import { createModuleLogger } from './utils/logger.js'
import { getEvent } from './stores/event.js'
import { getPartner } from './stores/partner.js'
import { getOrdersByIds, getStripe, saveStripe } from './stores/memberOrder.js'
import { buildEventReceiptMergeData } from './utils/eventReceiptMergeData.js'
import { PdfGenerator } from './utils/PdfGenerator.js'

const logger = createModuleLogger('eventReceipt')

export const eventReceipt = onCall<EventReceiptRequest, Promise<EventReceiptResponse>>(
  {
    secrets: ['PDF_SERVICES_CLIENT_ID', 'PDF_SERVICES_CLIENT_SECRET'],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be logged in')
    }

    const { uid } = request.auth
    const { eventId, stripeId } = request.data
    logger.info(`uid: ${uid}, eventId: ${eventId}, stripeId: ${stripeId}`)

    const event = await getEvent(eventId)
    if (event === undefined) {
      throw new HttpsError('not-found', 'Event not found')
    }

    const partner = await getPartner(event.partner_id)
    if (partner == null) {
      throw new HttpsError('not-found', 'Partner not found')
    }

    const shop = await partner.getShop(event.shop_id)
    if (shop === undefined) {
      throw new HttpsError('not-found', 'Shop not found')
    }

    const db = getFirestore()
    const { receiptNumber, reissue, stripe, orders } = await db.runTransaction(async (transaction) => {
      const stripeRow = await getStripe(event.community_id, eventId, stripeId, transaction)
      if (stripeRow === undefined) {
        throw new HttpsError('not-found', 'Stripe not found')
      }
      if (stripeRow.user_id !== uid) {
        throw new HttpsError('permission-denied', 'Forbidden')
      }

      if (stripeRow.pay_amount === 0) {
        throw new HttpsError('failed-precondition', '支払額 ¥0 の注文には領収書を発行できません')
      }

      const sessionOrders = await getOrdersByIds(event.community_id, eventId, uid, stripeRow.order_ids, transaction)
      if (sessionOrders.length !== stripeRow.order_ids.length) {
        throw new HttpsError('failed-precondition', '領収書対象の注文が不足しています')
      }

      if (stripeRow.receipt_number != null) {
        return {
          receiptNumber: stripeRow.receipt_number,
          reissue: true,
          stripe: stripeRow,
          orders: sessionOrders,
        }
      }
      const num = convertDateToId(stripeRow.created_at)
      stripeRow.receipt_number = num
      await saveStripe(event.community_id, eventId, stripeRow, transaction)
      return { receiptNumber: num, reissue: false, stripe: stripeRow, orders: sessionOrders }
    })

    const refundedTotal = stripe.refunds.reduce((sum, r) => sum + r.amount, 0)
    const orderSelfPayById = new Map(
      orders.map((order) => [order.id, order.menu_price - getMemberOrderDiscountAmount(order)]),
    )
    const fullyRefundedOrderIds = new Set<string>()
    for (const refund of stripe.refunds) {
      const refundableAmount = refund.order_ids.reduce((sum, orderId) => sum + (orderSelfPayById.get(orderId) ?? 0), 0)
      if (refundableAmount > 0 && refund.amount === refundableAmount) {
        refund.order_ids.forEach((orderId) => fullyRefundedOrderIds.add(orderId))
      }
    }
    const receiptOrders = orders
      .filter((order) => !fullyRefundedOrderIds.has(order.id))
      .map((order) => ({
        menu_name: order.menu_name,
        menu_price: order.menu_price,
        status: order.status === 'canceled' ? 'ordered' : order.status,
        pay_community_bill_off_amount: order.pay_community_bill_off_amount,
        pay_enterprise_subsidy_amount: order.pay_enterprise_subsidy_amount,
      }))
    // 個別キャンセル後は食事の返金分だけ差し引く。システム利用料は満額のまま（番号は初回採番）
    const jsonDataForMerge = buildEventReceiptMergeData({
      eventName: event.event_name,
      eventStartDatetime: event.event_start_datetime,
      shopName: shop.shop_name ?? '',
      shopInvoiceNumber: shop.shop_invoice_number,
      shopAddress: shop.fullAddress,
      receiptNumber,
      reissue,
      orderCreatedAt: stripe.created_at,
      issuedAt: DateTime.now().toMillis(),
      payAmount: stripe.pay_amount,
      payUserFeeAmount: stripe.pay_user_fee_amount,
      refundedTotal,
      orders: receiptOrders,
    })

    const pdfGenerator = new PdfGenerator()
    const url = await pdfGenerator.executeDocumentMergeForUrl(path.join('templates', 'receipt.docx'), jsonDataForMerge)
    if (url === undefined) {
      throw new HttpsError('internal', 'Failed to generate PDF')
    }
    return { url }
  },
)
