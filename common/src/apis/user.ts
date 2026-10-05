import { User } from '../schemas/User.js'

export type RequestEmailLoginRequest = {
  email: string
  /** 検証用受け口（verify.shokujii.test）で記録を分離する任意 ID */
  verification_run_id?: string
}
export type RequestEmailLoginResponse = { success: true }

export type ConfirmEmailLoginRequest = { email: string; passCode: string }
export type ConfirmEmailLoginResponse = { token: string }

export type RequestEmailRegistrationRequest = { email: string }
export type RequestEmailRegistrationResponse = { success: true }

export type ConfirmEmailRegistrationRequest = { email: string; passCode: string }
export type ConfirmEmailRegistrationResponse = { token: string }

export type RequestEmailChangeRequest = { newEmail: string }

export type ConfirmEmailChangeRequest = { newEmail: string; passCode: string }
export type ConfirmEmailChangeResponse = { token: string }

export type UpdateProfileFromProvidersRequest = { additionalInfo: Partial<User> }
export type UpdateProfileFromProvidersResponse = { user: User & { user_email?: string } }
