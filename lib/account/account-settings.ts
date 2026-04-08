const MIN_PASSWORD_LENGTH = 8

export function validateNewPassword(password: string, confirmPassword: string) {
  const normalizedPassword = password.trim()
  const normalizedConfirm = confirmPassword.trim()

  if (!normalizedPassword || !normalizedConfirm) {
    return "Podaj nowe haslo i jego potwierdzenie."
  }

  if (normalizedPassword.length < MIN_PASSWORD_LENGTH) {
    return `Haslo musi miec co najmniej ${MIN_PASSWORD_LENGTH} znakow.`
  }

  if (normalizedPassword !== normalizedConfirm) {
    return "Hasla nie sa takie same."
  }

  return ""
}
