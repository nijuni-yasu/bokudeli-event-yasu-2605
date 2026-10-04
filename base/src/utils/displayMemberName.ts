const EMAIL_ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmailDisplayName(name: string): boolean {
  return EMAIL_ADDRESS.test(name.trim())
}

/** 空、または表示名そのものがメールアドレスのときはゲスト表記にする */
export function resolveMemberDisplayName(name: string | null | undefined, guestLabel: string): string {
  const trimmed = name?.trim() ?? ''
  if (trimmed === '' || isEmailDisplayName(trimmed)) {
    return guestLabel
  }
  return trimmed
}
