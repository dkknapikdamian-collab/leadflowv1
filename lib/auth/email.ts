export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function isValidEmailFormat(value: string): boolean {
  const normalized = normalizeEmail(value)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
}

export function normalizeAndValidateEmail(value: string): { email: string; isValid: boolean } {
  const email = normalizeEmail(value)
  return {
    email,
    isValid: isValidEmailFormat(email),
  }
}
