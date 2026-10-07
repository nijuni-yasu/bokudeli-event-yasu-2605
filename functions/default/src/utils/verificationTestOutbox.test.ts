import { readFileSync } from 'node:fs'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../stores/verificationTestOutbox.js', () => ({
  saveVerificationTestOutboxRecord: vi.fn(),
}))

import {
  deliverUserPassCodeForLogin,
  isVerificationTestEmail,
  getVerificationTestOutboxMode,
} from './verificationTestOutbox.js'
import { saveVerificationTestOutboxRecord } from '../stores/verificationTestOutbox.js'

const setMode = (mode: string | undefined) => {
  if (mode === undefined) {
    delete process.env.VERIFICATION_TEST_OUTBOX_MODE
    return
  }
  vi.stubEnv('VERIFICATION_TEST_OUTBOX_MODE', mode)
}

describe('verificationTestOutbox', () => {
  beforeEach(() => {
    vi.stubEnv('GCLOUD_PROJECT', 'bokudeli-event-yasu-2603')
    setMode('off')
    vi.mocked(saveVerificationTestOutboxRecord).mockReset()
  })

  afterEach(() => vi.unstubAllEnvs())

  it('Firebase params として宣言しない', () => {
    const source = readFileSync(new URL('./verificationTestOutbox.ts', import.meta.url), 'utf8')
    expect(source).not.toMatch(/defineString\s*\(/)
  })

  it('未設定は off', () => {
    setMode(undefined)
    expect(getVerificationTestOutboxMode()).toBe('off')
  })

  it('isVerificationTestEmail は verify.shokujii.test のみ true', () => {
    expect(isVerificationTestEmail('a@verify.shokujii.test')).toBe(true)
    expect(isVerificationTestEmail('a@example.com')).toBe(false)
  })

  it('record_skip_send かつテスト宛先では SendGrid を呼ばず受け口に保存する', async () => {
    setMode('record_skip_send')
    const send = vi.fn()
    await deliverUserPassCodeForLogin({
      email: 'pstack@verify.shokujii.test',
      passCode: '123456',
      verificationRunId: 'run-1',
      sendViaSendGrid: send,
    })
    expect(saveVerificationTestOutboxRecord).toHaveBeenCalledOnce()
    expect(send).not.toHaveBeenCalled()
  })

  it('record_skip_send かつテスト宛先で run ID が無いときは保存しない', async () => {
    setMode('record_skip_send')
    const send = vi.fn()
    await expect(
      deliverUserPassCodeForLogin({
        email: 'pstack@verify.shokujii.test',
        passCode: '123456',
        verificationRunId: null,
        sendViaSendGrid: send,
      }),
    ).rejects.toThrow(/verification run id is required/)
    expect(saveVerificationTestOutboxRecord).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })

  it('off のときは SendGrid を呼ぶ', async () => {
    const send = vi.fn().mockResolvedValue(undefined)
    await deliverUserPassCodeForLogin({
      email: 'pstack@verify.shokujii.test',
      passCode: '123456',
      verificationRunId: null,
      sendViaSendGrid: send,
    })
    expect(send).toHaveBeenCalledOnce()
    expect(saveVerificationTestOutboxRecord).not.toHaveBeenCalled()
  })

  it.each(['bokudeli-event-new', 'unknown', 'bokudeli-event-yasu-9999', ''])(
    '未許可プロジェクト %s は有効設定でも off',
    (project) => {
      vi.stubEnv('GCLOUD_PROJECT', project)
      setMode('record_skip_send')
      expect(getVerificationTestOutboxMode()).toBe('off')
    },
  )

  it('通常宛先にはテスト環境でも通常配送する', async () => {
    setMode('record_skip_send')
    const send = vi.fn()
    await deliverUserPassCodeForLogin({
      email: 'user@example.com',
      passCode: '123456',
      verificationRunId: 'run',
      sendViaSendGrid: send,
    })
    expect(send).toHaveBeenCalledOnce()
    expect(saveVerificationTestOutboxRecord).not.toHaveBeenCalled()
  })
})
