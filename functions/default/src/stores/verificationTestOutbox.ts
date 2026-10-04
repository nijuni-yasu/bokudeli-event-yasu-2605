import {
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Timestamp,
  type DocumentData,
} from 'firebase-admin/firestore'
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
  const ref = collection().doc()
  await ref.set({
    id: ref.id,
    email: input.email,
    pass_code: input.pass_code,
    kind: 'user_pass_code',
    verification_run_id: input.verification_run_id,
    created_at: Timestamp.now().toMillis(),
  })
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
  return doc?.pass_code
}
