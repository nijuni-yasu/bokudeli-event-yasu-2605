/**
 * sandbox / ローカルで fetchVerificationTestPassCode を呼ぶ（エージェント検証用）。
 *
 *   cd functions/default
 *   GCLOUD_PROJECT=bokudeli-event-yasu-2606 node ../../scripts/pstack/fetch-test-pass-code.mjs \
 *     --email pstack.participant@verify.shokujii.test --run-id 2026-10-04T12:00:00Z-test
 */
import { initializeApp } from 'firebase-admin/app'

const args = process.argv.slice(2)
const emailIdx = args.indexOf('--email')
const runIdx = args.indexOf('--run-id')
const email = emailIdx >= 0 ? args[emailIdx + 1] : undefined
const runId = runIdx >= 0 ? args[runIdx + 1] : undefined

if (email == null) {
  console.error('usage: --email <addr> [--run-id <id>]')
  process.exit(1)
}

const projectId = process.env.GCLOUD_PROJECT
if (projectId == null || projectId === '') {
  console.error('GCLOUD_PROJECT を設定してください')
  process.exit(1)
}

initializeApp({ projectId })

// Admin SDK から Callable を直接叩く代わりに HTTP v1 を使う
const region = 'asia-northeast1'
const url = `https://${region}-${projectId}.cloudfunctions.net/fetchVerificationTestPassCode`

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      email,
      verification_run_id: runId,
    },
  }),
})

const body = await res.json()
if (!res.ok) {
  console.error(JSON.stringify(body, null, 2))
  process.exit(1)
}
const passCode = body?.result?.pass_code
if (typeof passCode !== 'string') {
  console.error('pass_code not in response', body)
  process.exit(1)
}
process.stdout.write(passCode)
