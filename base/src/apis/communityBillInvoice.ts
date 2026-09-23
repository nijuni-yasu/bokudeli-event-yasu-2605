import { httpsCallable } from 'firebase/functions'
import {
  resendCommunityBillInvoiceMailRequestSchema,
  type ResendCommunityBillInvoiceMailRequest,
  type ResendCommunityBillInvoiceMailResponse,
} from '@shokujii/common/apis/communityBillInvoice.js'
import { functions } from '@shokujii/base/firebase.js'

export const resendCommunityBillInvoiceMail = async (input: ResendCommunityBillInvoiceMailRequest) => {
  const f = httpsCallable<ResendCommunityBillInvoiceMailRequest, ResendCommunityBillInvoiceMailResponse>(
    functions,
    'resendCommunityBillInvoiceMail',
  )
  return f(resendCommunityBillInvoiceMailRequestSchema.parse(input))
}
