import {
  doc,
  getDoc,
  setDoc,
  type DocumentData,
  type DocumentReference,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from 'firebase/firestore'
import { db } from '@shokujii/base/firebase.js'
import {
  EventInvoicePayment,
  INVOICE_PAYMENT_DOC_ID,
  type CommunityBillPaymentStatusType,
} from '@shokujii/common/schemas/EventInvoicePayment.js'

const invoicePaymentConverter: FirestoreDataConverter<EventInvoicePayment> = {
  toFirestore(payment: EventInvoicePayment): DocumentData {
    return payment.toFirestore()
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): EventInvoicePayment {
    return new EventInvoicePayment(snapshot.id, snapshot.data(options))
  },
}

export const getEventInvoicePaymentRef = (
  communityId: string,
  eventId: string,
): DocumentReference<EventInvoicePayment> => {
  return doc(
    db,
    'communities',
    communityId,
    'events',
    eventId,
    'invoice_payments',
    INVOICE_PAYMENT_DOC_ID,
  ).withConverter(invoicePaymentConverter)
}

export const getEventInvoicePayment = async (
  communityId: string,
  eventId: string,
): Promise<EventInvoicePayment | undefined> => {
  const snapshot = await getDoc(getEventInvoicePaymentRef(communityId, eventId))
  return snapshot.exists() ? snapshot.data() : undefined
}

export const saveEventInvoicePayment = async (
  communityId: string,
  eventId: string,
  payment: EventInvoicePayment,
): Promise<void> => {
  await setDoc(getEventInvoicePaymentRef(communityId, eventId), payment, { merge: true })
}

export const updateEventInvoicePaymentStatus = async (
  communityId: string,
  eventId: string,
  updatedBy: string,
  update: { status: CommunityBillPaymentStatusType; memo?: string },
): Promise<EventInvoicePayment> => {
  const existing = await getEventInvoicePayment(communityId, eventId)
  const now = Date.now()
  const isPaid = update.status === 'paid'
  const payment = new EventInvoicePayment(INVOICE_PAYMENT_DOC_ID, {
    status: update.status,
    memo: update.memo,
    updated_by: updatedBy,
    paid_at: isPaid ? (existing?.paid_at ?? now) : undefined,
    paid_by: isPaid ? (existing?.paid_by ?? updatedBy) : undefined,
    last_mail_sent_at: existing?.last_mail_sent_at,
    last_mail_sent_by: existing?.last_mail_sent_by,
    mail_send_count: existing?.mail_send_count,
  })
  await saveEventInvoicePayment(communityId, eventId, payment)
  return payment
}
