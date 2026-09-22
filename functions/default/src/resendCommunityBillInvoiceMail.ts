import { onCall, HttpsError } from 'firebase-functions/https'
import { DateTime } from 'luxon'
import {
  resendCommunityBillInvoiceMailRequestSchema,
  type ResendCommunityBillInvoiceMailRequest,
  type ResendCommunityBillInvoiceMailResponse,
} from '@shokujii/common/apis/communityBillInvoice.js'
import { getInvoiceReminderBlockReason } from '@shokujii/common/utils/invoicePayment.js'
import { getConfigGlobal } from './stores/config.js'
import { getCommunity } from './stores/community.js'
import { getEventInCommunity } from './stores/event.js'
import { getEventInvoicePayment, recordInvoicePaymentMailSent } from './stores/eventInvoicePayment.js'
import { sendCommunityBillInvoiceMail } from './eventBillInvoice.js'
import { createModuleLogger } from './utils/logger.js'

const logger = createModuleLogger('resendCommunityBillInvoiceMail')

export const resendCommunityBillInvoiceMail = onCall<
  ResendCommunityBillInvoiceMailRequest,
  Promise<ResendCommunityBillInvoiceMailResponse>
>(
  {
    secrets: ['SENDGRID_API_KEY', 'PDF_SERVICES_CLIENT_ID', 'PDF_SERVICES_CLIENT_SECRET'],
    timeoutSeconds: 120,
  },
  async (request) => {
    const uid = request.auth?.uid
    if (uid == null) {
      throw new HttpsError('unauthenticated', 'Login required to use this feature.')
    }

    const { communityId, eventId } = resendCommunityBillInvoiceMailRequestSchema.parse(request.data)
    const config = await getConfigGlobal()
    if (config?.isSupport(uid) !== true) {
      throw new HttpsError('permission-denied', 'Forbidden')
    }

    const [event, community, payment] = await Promise.all([
      getEventInCommunity(communityId, eventId),
      getCommunity(communityId),
      getEventInvoicePayment(communityId, eventId),
    ])
    if (event == null) {
      throw new HttpsError('not-found', 'Event not found')
    }
    if (community == null) {
      throw new HttpsError('not-found', 'Community not found')
    }

    const now = DateTime.now().toMillis()
    const blockReason = getInvoiceReminderBlockReason({
      eventPayment: event.event_payment,
      status: payment?.status,
      billEmail: event.bill_email,
      eventStartDatetime: event.event_start_datetime,
      lastMailSentAt: payment?.last_mail_sent_at,
      now,
    })
    if (blockReason != null) {
      throw new HttpsError('failed-precondition', blockReason)
    }

    const sent = await sendCommunityBillInvoiceMail(community, event, 'reminder')
    const recorded = await recordInvoicePaymentMailSent(communityId, eventId, uid)
    logger.info('Reminder invoice mail sent', { eventId, to: sent.to })

    return {
      to: sent.to,
      ...(sent.cc != null ? { cc: sent.cc } : {}),
      sentAt: recorded.last_mail_sent_at ?? now,
    }
  },
)
