import { defineString } from 'firebase-functions/params'
import type { VerificationTestOutboxMode } from '@shokujii/common/apis/verificationTest.js'
import { saveVerificationTestOutboxRecord } from '../stores/verificationTestOutbox.js'

const VERIFICATION_TEST_OUTBOX_MODE = defineString('VERIFICATION_TEST_OUTBOX_MODE', {
  default: 'off',
})

/** 通常検証用。本番では off のまま。 */
const ALLOWED_EMAIL_SUFFIX = '@verify.shokujii.test'

const VERIFICATION_PROJECTS = new Set([
  'bokudeli-event-yasu-2603',
  'bokudeli-event-yasu-2606',
  'bokudeli-event-yasu-2607',
  'bokudeli-event-yasu-2608',
])

export const getVerificationTestOutboxMode = (): VerificationTestOutboxMode => {
  const raw = VERIFICATION_TEST_OUTBOX_MODE.value()
  if (raw === 'record_skip_send' && VERIFICATION_PROJECTS.has(process.env.GCLOUD_PROJECT ?? '')) {
    return 'record_skip_send'
  }
  return 'off'
}

export const isVerificationTestEmail = (email: string): boolean => {
  const normalized = email.trim().toLowerCase()
  return normalized.endsWith(ALLOWED_EMAIL_SUFFIX)
}

export const deliverUserPassCodeForLogin = async (params: {
  email: string
  passCode: string
  verificationRunId: string | null
  sendViaSendGrid: () => Promise<unknown>
}): Promise<void> => {
  const mode = getVerificationTestOutboxMode()
  const isTestEmail = isVerificationTestEmail(params.email)

  if (mode === 'record_skip_send' && isTestEmail) {
    await saveVerificationTestOutboxRecord({
      email: params.email.trim().toLowerCase(),
      pass_code: params.passCode,
      verification_run_id: params.verificationRunId,
    })
    return
  }

  await params.sendViaSendGrid()
}
