import test from "node:test"
import assert from "node:assert/strict"
import { parseOAuthHash } from "../lib/supabase/browser"
import { normalizeAndValidateEmail } from "../lib/auth/email"
import { checkAuthRateLimit } from "../lib/auth/rate-limit"

test("parseOAuthHash odczytuje access i refresh token z hash OAuth", () => {
  const payload = parseOAuthHash(
    "#access_token=token-123&refresh_token=refresh-456&token_type=bearer",
  )

  assert.equal(payload.accessToken, "token-123")
  assert.equal(payload.refreshToken, "refresh-456")
  assert.equal(payload.error, null)
})

test("parseOAuthHash zwraca opis błędu z hash OAuth", () => {
  const payload = parseOAuthHash("#error=access_denied&error_description=User%20cancelled")

  assert.equal(payload.accessToken, null)
  assert.equal(payload.refreshToken, null)
  assert.equal(payload.error, "User cancelled")
})

test("normalizeAndValidateEmail normalizuje i waliduje adres", () => {
  const payload = normalizeAndValidateEmail("  USER@Example.COM ")

  assert.equal(payload.email, "user@example.com")
  assert.equal(payload.isValid, true)
})

test("checkAuthRateLimit blokuje po przekroczeniu limitu dla konkretnej akcji i klucza", () => {
  const key = `unit-test-${Date.now()}`
  const attempts = Array.from({ length: 6 }, () => checkAuthRateLimit("signup", key))

  assert.equal(attempts.slice(0, 5).every((result) => result.ok), true)
  assert.equal(attempts[5]?.ok, false)
  assert.ok((attempts[5]?.retryAfterSeconds ?? 0) >= 1)
})
