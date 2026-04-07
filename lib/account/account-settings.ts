import { normalizeAndValidateEmail } from "../auth/email"
import type { AuthSessionUser } from "../auth/session"

export const MIN_ACCOUNT_PASSWORD_LENGTH = 8

export function getAccountProviderLabel(provider: string | null) {
  if (provider === "google") return "Google"
  if (provider === "email" || provider === "email_password") return "E-mail + hasło"
  if (!provider) return "Nie udało się ustalić"

  return provider
}

export function getLocalPasswordLabel(hasPassword: boolean | null) {
  if (hasPassword === true) return "Ustawione"
  if (hasPassword === false) return "Brak osobnego hasła"
  return "Nie udało się ustalić"
}

export function canChangeLocalPassword(user: Pick<AuthSessionUser, "provider" | "hasPassword">) {
  if (user.hasPassword === true) return true
  return user.provider === "email" || user.provider === "email_password"
}

export function getAccountModeDescription(user: Pick<AuthSessionUser, "provider" | "hasPassword">) {
  if (user.provider === "google" && user.hasPassword === false) {
    return "Logujesz się przez Google. To konto nie ma osobnego hasła w aplikacji."
  }

  if (user.provider === "google" && user.hasPassword === true) {
    return "Logujesz się przez Google, ale do tego konta jest też przypisane hasło lokalne."
  }

  if (user.provider === "email" || user.provider === "email_password") {
    return "To konto działa w trybie e-mail + hasło."
  }

  return "Sposób logowania tego konta nie został jeszcze jednoznacznie rozpoznany."
}

export function getPasswordChangeUnavailableMessage(user: Pick<AuthSessionUser, "provider" | "hasPassword">) {
  if (canChangeLocalPassword(user)) {
    return null
  }

  if (user.provider === "google") {
    return "To konto loguje się przez Google. Nie ma tu osobnego hasła do zmiany."
  }

  return "Zmiana hasła nie jest teraz dostępna dla tego konta."
}

export function validateNewPassword(password: string, confirmPassword: string) {
  if (password.length < MIN_ACCOUNT_PASSWORD_LENGTH) {
    return `Hasło musi mieć co najmniej ${MIN_ACCOUNT_PASSWORD_LENGTH} znaków.`
  }

  if (password !== confirmPassword) {
    return "Oba pola hasła muszą być identyczne."
  }

  return null
}

export function validateAccountEmailChange(email: string, currentEmail: string | null) {
  const { email: normalizedEmail, isValid } = normalizeAndValidateEmail(email)

  if (!isValid) {
    return "Wpisz poprawny adres e-mail."
  }

  if (currentEmail && normalizedEmail === currentEmail.trim().toLowerCase()) {
    return "Nowy adres e-mail musi być inny niż obecny."
  }

  return null
}
