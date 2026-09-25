import {
  doc,
  getDoc,
  type DocumentData,
  type DocumentReference,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from 'firebase/firestore'
import { db } from '@shokujii/base/firebase.js'
import { EventStripe } from '@shokujii/common/schemas/EventStripe.js'
import { sumChargedUserPaymentFee, type ChargedFeeOrderRef } from '@shokujii/common/utils/paymentUserFee.js'

const eventStripeConverter: FirestoreDataConverter<EventStripe> = {
  toFirestore(stripe: EventStripe): DocumentData {
    return stripe.toFirestore()
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): EventStripe {
    const data = snapshot.data(options)
    return new EventStripe(snapshot.id, data)
  },
}

/** communities/{communityId}/events/{eventId}/stripes/{stripeId} */
export const getEventStripeRef = (
  communityId: string,
  eventId: string,
  stripeId: string,
): DocumentReference<EventStripe> => {
  return doc(db, 'communities', communityId, 'events', eventId, 'stripes', stripeId).withConverter(eventStripeConverter)
}

export const fetchEventStripe = async (
  communityId: string,
  eventId: string,
  stripeId: string,
): Promise<EventStripe | null> => {
  const snapshot = await getDoc(getEventStripeRef(communityId, eventId, stripeId))
  if (!snapshot.exists()) return null
  return snapshot.data()
}

/** 残注文が参照する EventStripe の pay_user_fee_amount 合計。未設定は 0。 */
export const fetchChargedUserPaymentFee = async (
  communityId: string,
  eventId: string,
  orders: readonly ChargedFeeOrderRef[],
): Promise<number> => {
  const stripeIds = new Set<string>()
  for (const order of orders) {
    if (order.status === 'canceled') continue
    if (order.stripe_id == null || order.stripe_id === '') continue
    stripeIds.add(order.stripe_id)
  }

  const feeByStripeId: Record<string, number | undefined> = {}
  await Promise.all(
    [...stripeIds].map(async (stripeId) => {
      const stripe = await fetchEventStripe(communityId, eventId, stripeId)
      feeByStripeId[stripeId] = stripe?.pay_user_fee_amount
    }),
  )
  return sumChargedUserPaymentFee(orders, feeByStripeId)
}
