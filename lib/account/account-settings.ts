export function validateNewPassword(password: string, confirmPassword: string) {
  if (!password || !confirmPassword) {
    return "Podaj i potwierdź nowe hasło."
  }

  if (password !== confirmPassword) {
    return "Hasła nie są takie same."
  }

  if (password.length < 8) {
    return "Hasło musi mieć minimum 8 znaków."
  }

  return null
}
