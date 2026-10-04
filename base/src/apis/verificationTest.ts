import { httpsCallable, type HttpsCallableResult } from 'firebase/functions'
import { functions } from '@shokujii/base/firebase'
import {
  FetchVerificationTestPassCodeRequest,
  FetchVerificationTestPassCodeResponse,
} from '@shokujii/common/apis/verificationTest.js'

export const fetchVerificationTestPassCode = async (
  input: FetchVerificationTestPassCodeRequest,
): Promise<HttpsCallableResult<FetchVerificationTestPassCodeResponse>> => {
  const f = httpsCallable<FetchVerificationTestPassCodeRequest, FetchVerificationTestPassCodeResponse>(
    functions,
    'fetchVerificationTestPassCode',
  )
  return f(input)
}
