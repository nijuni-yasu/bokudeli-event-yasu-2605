import { onCall, HttpsError } from 'firebase-functions/https'
import {
  FetchVerificationTestPassCodeRequest,
  FetchVerificationTestPassCodeResponse,
} from '@shokujii/common/apis/verificationTest.js'
import { fetchPassCodeFromTestOutbox, getVerificationTestOutboxMode } from './utils/verificationTestOutbox.js'

export const fetchVerificationTestPassCode = onCall<
  FetchVerificationTestPassCodeRequest,
  Promise<FetchVerificationTestPassCodeResponse>
>(async (request) => {
  if (getVerificationTestOutboxMode() === 'off') {
    throw new HttpsError('permission-denied', 'verification test outbox is disabled')
  }

  const { email, verification_run_id: verificationRunId } = request.data
  if (email == null || email.trim() === '') {
    throw new HttpsError('invalid-argument', 'email is required')
  }

  const passCode = await fetchPassCodeFromTestOutbox(
    email,
    verificationRunId == null || verificationRunId === '' ? null : verificationRunId,
  )
  if (passCode == null) {
    throw new HttpsError('not-found', 'pass code not found in test outbox')
  }

  return { pass_code: passCode }
})
