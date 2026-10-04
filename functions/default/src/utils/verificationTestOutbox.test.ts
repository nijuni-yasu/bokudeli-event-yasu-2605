import { describe, expect, it, vi, beforeEach } from 'vitest'

const modeValue = vi.hoisted(() => ({ current: 'off' as string }))

vi.mock('firebase-functions/params', () => ({
  defineString: () => ({
    value: () => modeValue.current,
  }),
}))

vi.mock('../stores/verificationTestOutbox.js', () => ({
  saveVerificationTestOutboxRecord: vi.fn(),
  getLatestVerificationTestPassCode: vi.fn(),
}))

import {
  deliverUserPassCodeForLogin,
  fetchPassCodeFromTestOutbox,
  isVerificationTestEmail,
} from './verificationTestOutbox.js'
import {
  saveVerificationTestOutboxRecord,
  getLatestVerificationTestPassCode,
} from '../stores/verificationTestOutbox.js'

describe('verificationTestOutbox', () => {
  beforeEach(() => {
    modeValue.current = 'off'
    vi.mocked(saveVerificationTestOutboxRecord).mockReset()
    vi.mocked(getLatestVerificationTestPassCode).mockReset()
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

  it('fetchPassCodeFromTestOutbox は off で undefined', async () => {
    const result = await fetchPassCodeFromTestOutbox('a@verify.shokujii.test', null)
    expect(result).toBeUndefined()
    expect(getLatestVerificationTestPassCode).not.toHaveBeenCalled()
  })

  it('fetchPassCodeFromTestOutbox は record_skip_send で store を読む', async () => {
    modeValue.current = 'record_skip_send'
    vi.mocked(getLatestVerificationTestPassCode).mockResolvedValue('999999')
    const result = await fetchPassCodeFromTestOutbox('a@verify.shokujii.test', 'run-2')
    expect(result).toBe('999999')
    expect(getLatestVerificationTestPassCode).toHaveBeenCalledWith('a@verify.shokujii.test', 'run-2')
  })
})
