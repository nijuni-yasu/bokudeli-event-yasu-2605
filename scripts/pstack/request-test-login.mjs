/**
 * requestEmailLogin を HTTP で呼ぶ（UI 操作の代替・検証用）。
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

const region = 'asia-northeast1'
const url = `https://${region}-${projectId}.cloudfunctions.net/requestEmailLogin`

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      email,
      ...(runId != null ? { verification_run_id: runId } : {}),
    },
  }),
})

const body = await res.json()
if (!res.ok) {
  console.error(JSON.stringify(body, null, 2))
  process.exit(1)
}
console.log(JSON.stringify(body?.result ?? { success: true }))
