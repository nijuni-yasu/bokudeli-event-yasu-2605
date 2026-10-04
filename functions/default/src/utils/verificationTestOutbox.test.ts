import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

const modeValue = vi.hoisted(() => ({ current: 'off' as string }))

vi.mock('firebase-functions/params', () => ({
  defineString: () => ({
    value: () => modeValue.current,
  }),
}))

vi.mock('../stores/verificationTestOutbox.js', () => ({
  saveVerificationTestOutboxRecord: vi.fn(),
}))

import {
  deliverUserPassCodeForLogin,
  isVerificationTestEmail,
  getVerificationTestOutboxMode,
} from './verificationTestOutbox.js'
import { saveVerificationTestOutboxRecord } from '../stores/verificationTestOutbox.js'

describe('verificationTestOutbox', () => {
  beforeEach(() => {
    vi.stubEnv('GCLOUD_PROJECT', 'bokudeli-event-yasu-2603')
    modeValue.current = 'off'
    vi.mocked(saveVerificationTestOutboxRecord).mockReset()
  })

  it('isVerificationTestEmail は verify.shokujii.test のみ true', () => {
    expect(isVerificationTestEmail('a@verify.shokujii.test')).toBe(true)
    expect(isVerificationTestEmail('a@example.com')).toBe(false)
  })

  it('record_skip_send かつテスト宛先では SendGrid を呼ばず受け口に保存する', async () => {
    modeValue.current = 'record_skip_send'
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

  afterEach(() => vi.unstubAllEnvs())

  it.each(['bokudeli-event-new', 'unknown', 'bokudeli-event-yasu-9999', ''])(
    '未許可プロジェクト %s は有効設定でも off',
    (project) => {
      vi.stubEnv('GCLOUD_PROJECT', project)
      modeValue.current = 'record_skip_send'
      expect(getVerificationTestOutboxMode()).toBe('off')
    },
  )

  it('通常宛先にはテスト環境でも通常配送する', async () => {
    modeValue.current = 'record_skip_send'
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
