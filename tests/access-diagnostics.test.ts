import test from "node:test"
import assert from "node:assert/strict"
import {
  PRIMARY_ADMIN_EMAIL,
  buildAccessDiagnosticsPayload,
  isPrimaryAdminEmail,
  normalizeEmail,
} from "../lib/access/diagnostics"

test("normalizeEmail czyści spacje i normalizuje wielkość znaków", () => {
  assert.equal(normalizeEmail("  DK.KnapikDamian@GMAIL.COM  "), PRIMARY_ADMIN_EMAIL)
  assert.equal(normalizeEmail(""), null)
})

test("isPrimaryAdminEmail rozpoznaje główny mail admina", () => {
  assert.equal(isPrimaryAdminEmail("dk.knapikdamian@gmail.com"), true)
  assert.equal(isPrimaryAdminEmail("inna-osoba@gmail.com"), false)
})

test("buildAccessDiagnosticsPayload zwraca pusty stan dla brakującego usera", () => {
  const payload = buildAccessDiagnosticsPayload({
    targetEmail: "missing@example.com",
    sessionUserId: "session-1",
    sessionEmail: PRIMARY_ADMIN_EMAIL,
    userFound: false,
    profileFound: false,
    isEmailVerified: false,
    accessStatus: null,
    now: new Date("2026-04-07T10:00:00.000Z"),
  })

  assert.equal(payload.userFound, false)
  assert.equal(payload.profileFound, false)
  assert.equal(payload.accessStatusFound, false)
  assert.equal(payload.resolvedCanUseApp, false)
  assert.equal(payload.resolvedReason, "missing-access-status")
})

test("buildAccessDiagnosticsPayload pokazuje aktywny override admina", () => {
  const payload = buildAccessDiagnosticsPayload({
    targetEmail: PRIMARY_ADMIN_EMAIL,
    sessionUserId: "session-1",
    sessionEmail: PRIMARY_ADMIN_EMAIL,
    subjectUserId: "user-1",
    subjectEmail: PRIMARY_ADMIN_EMAIL,
    userFound: true,
    profileFound: true,
    isEmailVerified: true,
    accessStatus: {
      workspaceId: "workspace-1",
      userId: "user-1",
      accessStatus: "trial_active",
      trialStart: "2026-04-01T10:00:00.000Z",
      trialEnd: "2026-04-08T10:00:00.000Z",
      paidUntil: null,
      gracePeriodEnd: null,
      accessOverrideMode: "admin_unlimited",
      accessOverrideExpiresAt: null,
      accessOverrideNote: "System admin bypass for primary owner",
      billingCustomerId: null,
      billingSubscriptionId: null,
      planName: "Solo",
      bonusCodeUsed: null,
      bonusKind: null,
      bonusAppliedAt: null,
    },
    now: new Date("2026-04-07T10:00:00.000Z"),
  })

  assert.equal(payload.isAdminEmail, true)
  assert.equal(payload.isOverrideActive, true)
  assert.equal(payload.resolvedCanUseApp, true)
  assert.equal(payload.resolvedReason, "access-override")
})
