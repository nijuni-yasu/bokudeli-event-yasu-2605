import {
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Timestamp,
  type DocumentData,
} from 'firebase-admin/firestore'
import { PASS_CODE_DURATION } from '@shokujii/common/schemas/PassCode.js'
import {
  VerificationTestOutboxDbSchema,
  VerificationTestOutboxAppSchema,
  type VerificationTestOutboxRecord,
} from '@shokujii/common/schemas/VerificationTestOutbox.js'

const converter: FirestoreDataConverter<VerificationTestOutboxRecord> = {
  toFirestore(record: VerificationTestOutboxRecord): DocumentData {
    return VerificationTestOutboxDbSchema.parse({
      email: record.email,
      pass_code: record.pass_code,
      kind: record.kind,
      verification_run_id: record.verification_run_id,
      created_at: record.created_at,
      expires_at: record.expires_at,
    })
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): VerificationTestOutboxRecord {
    return {
      ...VerificationTestOutboxAppSchema.parse(snapshot.data()),
      id: snapshot.id,
    }
  },
}

const collection = () => getFirestore().collection('verification_test_outbox').withConverter(converter)

export const saveVerificationTestOutboxRecord = async (input: {
  email: string
  pass_code: string
  verification_run_id: string | null
}): Promise<void> => {
  await deleteExpiredVerificationTestOutboxRecords()
  const createdAt = Timestamp.now().toMillis()
  const ref = collection().doc()
  await ref.set({
    id: ref.id,
    email: input.email,
    pass_code: input.pass_code,
    kind: 'user_pass_code',
    verification_run_id: input.verification_run_id,
    created_at: createdAt,
    expires_at: createdAt + PASS_CODE_DURATION,
  })
}

/** 検証時に古い OTP を片付ける。既存の expires_at 未保存記録も対象にする。 */
export const deleteExpiredVerificationTestOutboxRecords = async (): Promise<number> => {
  const expired = await collection()
    .where('created_at', '<=', Timestamp.fromMillis(Timestamp.now().toMillis() - PASS_CODE_DURATION))
    .limit(100)
    .get()
  if (expired.empty) return 0
  const batch = getFirestore().batch()
  for (const doc of expired.docs) batch.delete(doc.ref)
  await batch.commit()
  return expired.size
}

export const getLatestVerificationTestPassCode = async (
  email: string,
  verificationRunId: string | null,
): Promise<string | undefined> => {
  let query = collection().where('email', '==', email).orderBy('created_at', 'desc').limit(1)
  if (verificationRunId != null && verificationRunId !== '') {
    query = collection()
      .where('email', '==', email)
      .where('verification_run_id', '==', verificationRunId)
      .orderBy('created_at', 'desc')
      .limit(1)
  }
  const snapshot = await query.get()
  const doc = snapshot.docs[0]?.data()
  return doc != null && doc.expires_at > Timestamp.now().toMillis() ? doc.pass_code : undefined
}
