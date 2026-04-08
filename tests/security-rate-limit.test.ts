import test from "node:test"
import assert from "node:assert/strict"
import { checkSecurityRateLimit } from "../lib/security/rate-limit"

test("portal-invalid-token limit blokuje po przekroczeniu progu", () => {
  const key = `ip-test-${Date.now()}`
  let blocked = false

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const result = checkSecurityRateLimit("portal-invalid-token", key)
    if (!result.ok) {
      blocked = true
      assert.ok(result.retryAfterSeconds > 0)
      break
    }
  }

  assert.equal(blocked, true)
})

test("portal-upload limit po kilku probach zwraca retry-after", () => {
  const key = `upload-test-${Date.now()}`
  let retryAfter = 0

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = checkSecurityRateLimit("portal-upload", key)
    if (!result.ok) {
      retryAfter = result.retryAfterSeconds
      break
    }
  }

  assert.ok(retryAfter > 0)
})
