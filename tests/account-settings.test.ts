import test from "node:test"
import assert from "node:assert/strict"
import {
  canChangeLocalPassword,
  getAccountModeDescription,
  getAccountProviderLabel,
  getLocalPasswordLabel,
  getPasswordChangeUnavailableMessage,
  validateAccountEmailChange,
  validateNewPassword,
} from "../lib/account/account-settings"

test("getAccountProviderLabel zwraca czytelną etykietę dla Google", () => {
  assert.equal(getAccountProviderLabel("google"), "Google")
})

test("getAccountProviderLabel zwraca czytelną etykietę dla logowania hasłem", () => {
  assert.equal(getAccountProviderLabel("email"), "E-mail + hasło")
  assert.equal(getAccountProviderLabel("email_password"), "E-mail + hasło")
})

test("getLocalPasswordLabel pokazuje brak osobnego hasła dla konta Google bez hasła", () => {
  assert.equal(getLocalPasswordLabel(false), "Brak osobnego hasła")
})

test("getAccountModeDescription jasno opisuje konto Google bez lokalnego hasła", () => {
  assert.equal(
    getAccountModeDescription({
      provider: "google",
      hasPassword: false,
    }),
    "Logujesz się przez Google. To konto nie ma osobnego hasła w aplikacji.",
  )
})

test("getPasswordChangeUnavailableMessage daje ludzki komunikat dla Google bez hasła", () => {
  assert.equal(
    getPasswordChangeUnavailableMessage({
      provider: "google",
      hasPassword: false,
    }),
    "To konto loguje się przez Google. Nie ma tu osobnego hasła do zmiany.",
  )
})

test("validateNewPassword odrzuca zbyt krótkie hasło", () => {
  assert.equal(validateNewPassword("krótkie", "krótkie"), "Hasło musi mieć co najmniej 8 znaków.")
})

test("validateNewPassword odrzuca różne wartości", () => {
  assert.equal(validateNewPassword("bardzo-tajne", "inne-haslo"), "Oba pola hasła muszą być identyczne.")
})

test("validateNewPassword przepuszcza poprawny komplet", () => {
  assert.equal(validateNewPassword("bardzo-tajne", "bardzo-tajne"), null)
})

test("validateAccountEmailChange odrzuca zły format", () => {
  assert.equal(validateAccountEmailChange("zly-format", "old@example.com"), "Wpisz poprawny adres e-mail.")
})

test("validateAccountEmailChange odrzuca ten sam adres", () => {
  assert.equal(
    validateAccountEmailChange("OLD@example.com", "old@example.com"),
    "Nowy adres e-mail musi być inny niż obecny.",
  )
})

test("validateAccountEmailChange przepuszcza poprawny nowy adres", () => {
  assert.equal(validateAccountEmailChange("new@example.com", "old@example.com"), null)
})

test("canChangeLocalPassword blokuje martwy wariant dla Google bez lokalnego hasła", () => {
  assert.equal(
    canChangeLocalPassword({
      provider: "google",
      hasPassword: false,
    }),
    false,
  )
})

test("canChangeLocalPassword przepuszcza konto Google z aktywnym lokalnym hasłem", () => {
  assert.equal(
    canChangeLocalPassword({
      provider: "google",
      hasPassword: true,
    }),
    true,
  )
})
