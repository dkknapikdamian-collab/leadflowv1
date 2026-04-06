import test from "node:test"
import assert from "node:assert/strict"
import { canUseApp, mustSeeBillingWall, mustVerifyEmail, resolveAccessState } from "../lib/access/machine"

test("mustVerifyEmail blokuje wejście, jeśli e-mail nie jest potwierdzony", () => {
  const state = resolveAccessState({
    isEmailVerified: false,
    accessStatus: {
      accessStatus: "trial_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: null,
    },
    now: "2026-04-10T10:00:00.000Z",
  })

  assert.equal(mustVerifyEmail({
    isEmailVerified: false,
    accessStatus: {
      accessStatus: "trial_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: null,
    },
    now: "2026-04-10T10:00:00.000Z",
  }), true)
  assert.equal(state.canUseApp, false)
  assert.equal(state.mustSeeBillingWall, false)
  assert.equal(state.reason, "email-not-verified")
})

test("trial_active z ważnym trial_end wpuszcza do aplikacji", () => {
  assert.equal(canUseApp({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "trial_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: null,
    },
    now: "2026-04-10T10:00:00.000Z",
  }), true)
})

test("trial_active po końcu triala pokazuje billing wall", () => {
  assert.equal(mustSeeBillingWall({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "trial_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: null,
    },
    now: "2026-04-14T10:00:00.000Z",
  }), true)
})

test("payment_failed z aktywnym grace_period_end nadal wpuszcza do aplikacji", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "payment_failed",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: "2026-04-20T10:00:00.000Z",
      gracePeriodEnd: "2026-04-21T10:00:00.000Z",
    },
    now: "2026-04-20T11:00:00.000Z",
  })

  assert.equal(state.canUseApp, true)
  assert.equal(state.isGracePeriod, true)
  assert.equal(state.mustSeeBillingWall, false)
})

test("payment_failed bez grace period blokuje aplikację", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "payment_failed",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: "2026-04-20T10:00:00.000Z",
      gracePeriodEnd: "2026-04-20T09:00:00.000Z",
    },
    now: "2026-04-20T11:00:00.000Z",
  })

  assert.equal(state.canUseApp, false)
  assert.equal(state.mustSeeBillingWall, true)
  assert.equal(state.reason, "payment-failed")
})

test("manual override allow po stronie serwera wpuszcza mimo wygasłego triala", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "trial_expired",
      trialEnd: "2026-04-01T10:00:00.000Z",
      paidUntil: null,
      manualOverrideMode: "allow",
      manualOverrideUntil: "2026-04-30T10:00:00.000Z",
    },
    now: "2026-04-20T10:00:00.000Z",
  })

  assert.equal(state.canUseApp, true)
  assert.equal(state.reason, "admin-allowed")
})

test("manual override block po stronie serwera blokuje nawet aktywny plan", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "paid_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: "2026-05-10T10:00:00.000Z",
      manualOverrideMode: "block",
      manualOverrideUntil: "2026-04-30T10:00:00.000Z",
    },
    now: "2026-04-20T10:00:00.000Z",
  })

  assert.equal(state.canUseApp, false)
  assert.equal(state.mustSeeBillingWall, true)
  assert.equal(state.reason, "admin-blocked")
})
