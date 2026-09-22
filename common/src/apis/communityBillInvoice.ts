import { z } from 'zod'

export const resendCommunityBillInvoiceMailRequestSchema = z.object({
  communityId: z.string().nonempty(),
  eventId: z.string().nonempty(),
})

export type ResendCommunityBillInvoiceMailRequest = z.infer<typeof resendCommunityBillInvoiceMailRequestSchema>

export type ResendCommunityBillInvoiceMailResponse = {
  to: string
  cc?: string
  sentAt: number
}
