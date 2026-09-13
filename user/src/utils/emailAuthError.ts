import { FirebaseError } from 'firebase/app'

/** `requestEmailRegistration` / `confirmEmailRegistration` の登録済みメール */
export const isAlreadyRegisteredEmailError = (error: unknown): boolean =>
  error instanceof FirebaseError && error.code === 'functions/already-exists'
