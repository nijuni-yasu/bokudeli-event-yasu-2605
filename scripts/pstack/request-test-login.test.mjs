import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cli = fileURLToPath(new URL('./request-test-login.mjs', import.meta.url))
const fakeFetch =
  'globalThis.fetch = async (url, options) => ({ok: true, json: async () => ({result: {sent: JSON.parse(options.body).data.verification_run_id}})})'
const run = (args) =>
  spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(fakeFetch)}`, cli, ...args], {
    encoding: 'utf8',
    env: { ...process.env, GCLOUD_PROJECT: 'bokudeli-event-yasu-2603' },
  })

for (const tail of [[], ['--run-id'], ['--run-id', ''], ['--run-id', '--other']]) {
  test(`run ID不足を送信前に拒否する: ${JSON.stringify(tail)}`, () => {
    const result = run(['--email', 'pstack.participant@verify.shokujii.test', ...tail])
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /usage:/)
    assert.equal(result.stdout, '')
  })
}
test('発行リクエストへrun IDを引き継ぐ', () => {
  const result = run(['--email', 'pstack.participant@verify.shokujii.test', '--run-id', 'run-1'])
  assert.equal(result.status, 0)
  assert.equal(JSON.parse(result.stdout).sent, 'run-1')
})
