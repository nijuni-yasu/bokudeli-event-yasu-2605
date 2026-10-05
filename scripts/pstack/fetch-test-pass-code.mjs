/** 既存の ADC（開発者認証）でテスト受け口を読む。公開 HTTP エンドポイントは使わない。 */
import { initializeApp } from 'firebase-admin/app'

const args = process.argv.slice(2)
const email = args[args.indexOf('--email') + 1]
const runId = args[args.indexOf('--run-id') + 1]
const projectId = process.env.GCLOUD_PROJECT
const allowedProjects = [
  'bokudeli-event-yasu-2603',
  'bokudeli-event-yasu-2606',
  'bokudeli-event-yasu-2607',
  'bokudeli-event-yasu-2608',
]
if (!allowedProjects.includes(projectId)) {
  throw new Error('GCLOUD_PROJECT は登録済み pstack sandbox のみ指定できます')
}
if (
  !args.includes('--email') ||
  !args.includes('--run-id') ||
  email == null ||
  !email.endsWith('@verify.shokujii.test') ||
  runId == null ||
  runId === '' ||
  runId.startsWith('--')
) {
  throw new Error('usage: --email <addr@verify.shokujii.test> --run-id <id>')
}

// common の server 用 TimestampSchema を選択してから store を動的ロードする。
Object.defineProperty(globalThis, 'IS_SERVER', { value: true })
initializeApp({ projectId })
const { getLatestVerificationTestPassCode } = await import(
  '../../functions/default/dist/stores/verificationTestOutbox.js'
)
const passCode = await getLatestVerificationTestPassCode(email.trim().toLowerCase(), runId)
if (passCode == null) {
  throw new Error('指定した宛先・実行 ID の OTP がありません')
}
process.stdout.write(passCode)
