import {
  DocumentData,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Transaction,
} from 'firebase-admin/firestore'
import { EventInvoicePayment, INVOICE_PAYMENT_DOC_ID } from '@shokujii/common/schemas/EventInvoicePayment.js'

const invoicePaymentConverter: FirestoreDataConverter<EventInvoicePayment> = {
  toFirestore(payment: EventInvoicePayment): DocumentData {
    return payment.toFirestore()
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): EventInvoicePayment {
    return new EventInvoicePayment(snapshot.id, snapshot.data())
  },
}

export const getEventInvoicePaymentRef = (communityId: string, eventId: string) => {
  const db = getFirestore()
  return db
    .collection('communities')
    .doc(communityId)
    .collection('events')
    .doc(eventId)
    .collection('invoice_payments')
    .doc(INVOICE_PAYMENT_DOC_ID)
    .withConverter(invoicePaymentConverter)
}

export const getEventInvoicePayment = async (
  communityId: string,
  eventId: string,
  transaction?: Transaction,
): Promise<EventInvoicePayment | undefined> => {
  const ref = getEventInvoicePaymentRef(communityId, eventId)
  const snapshot = await (transaction === undefined ? ref.get() : transaction.get(ref))
  return snapshot.exists ? snapshot.data() : undefined
}

export const saveEventInvoicePayment = async (
  payment: EventInvoicePayment,
  communityId: string,
  eventId: string,
  transaction?: Transaction,
): Promise<void> => {
  const ref = getEventInvoicePaymentRef(communityId, eventId)
  if (transaction === undefined) {
    await ref.set(payment, { merge: true })
  } else {
    transaction.set(ref, payment, { merge: true })
  }
}

export const recordInvoicePaymentMailSent = async (
  communityId: string,
  eventId: string,
  uid: string,
): Promise<EventInvoicePayment> => {
  const db = getFirestore()
  return db.runTransaction(async (transaction) => {
    const existing = await getEventInvoicePayment(communityId, eventId, transaction)
    const now = Date.now()
    const payment = new EventInvoicePayment(INVOICE_PAYMENT_DOC_ID, {
      status: existing?.status ?? 'unpaid',
      memo: existing?.memo,
      updated_by: existing?.updated_by ?? uid,
      paid_at: existing?.paid_at,
      paid_by: existing?.paid_by,
      last_mail_sent_at: now,
      last_mail_sent_by: uid,
      mail_send_count: (existing?.mail_send_count ?? 0) + 1,
    })
    await saveEventInvoicePayment(payment, communityId, eventId, transaction)
    return payment
  })
}
