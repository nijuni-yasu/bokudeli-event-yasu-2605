export type VerificationTestOutboxMode = 'off' | 'record_skip_send'

export type RequestEmailLoginRequestWithRun = {
  email: string
  /** テスト受け口で記録を分離する任意 ID（verify.shokujii.test 宛のみ有効） */
  verification_run_id?: string
}

export type FetchVerificationTestPassCodeRequest = {
  email: string
  verification_run_id?: string
}

export type FetchVerificationTestPassCodeResponse = {
  pass_code: string
}
