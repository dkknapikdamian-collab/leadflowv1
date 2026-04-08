import test from "node:test"
import assert from "node:assert/strict"
import { getAuthDisplayName, mapSupabaseUserToSessionUser } from "../lib/auth/session"
import { buildUserScopedStorageKey } from "../lib/data/storage-key"

test("getAuthDisplayName bierze pełną nazwę z user_metadata, jeśli istnieje", () => {
  const displayName = getAuthDisplayName({
    email: "user@example.com",
    user_metadata: {
      full_name: "Damian Testowy",
    },
  })

  assert.equal(displayName, "Damian Testowy")
})

test("getAuthDisplayName spada do lokalnej części e-maila, jeśli metadata jest pusta", () => {
  const displayName = getAuthDisplayName({
    email: "solo@example.com",
    user_metadata: {},
  })

  assert.equal(displayName, "solo")
})

test("mapSupabaseUserToSessionUser buduje stabilny obiekt sesji", () => {
  const payload = mapSupabaseUserToSessionUser(
    {
      id: "user-123",
      email: "session@example.com",
      email_confirmed_at: "2026-04-06T10:00:00.000Z",
      user_metadata: {
        display_name: "Sesyjny Użytkownik",
      },
    },
    "google",
  )

  assert.deepEqual(payload, {
    id: "user-123",
    email: "session@example.com",
    displayName: "Sesyjny Użytkownik",
    provider: "google",
    emailConfirmedAt: "2026-04-06T10:00:00.000Z",
    emailVerified: true,
    hasPassword: false,
    emailChangePending: null,
  })
})

test("buildUserScopedStorageKey rozdziela cache między użytkownikami", () => {
  assert.equal(buildUserScopedStorageKey("clientpilot-cache", "user-a"), "clientpilot-cache:user-a")
  assert.equal(buildUserScopedStorageKey("clientpilot-cache", "user-b"), "clientpilot-cache:user-b")
  assert.equal(buildUserScopedStorageKey("clientpilot-cache", null), "clientpilot-cache:anonymous")
})

