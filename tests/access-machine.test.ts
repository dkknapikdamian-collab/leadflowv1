import test from "node:test"
import assert from "node:assert/strict"
import { canUseApp, mustSeeBillingWall, mustVerifyEmail, resolveAccessState } from "../lib/access/machine"

test("mustVerifyEmail blokuje wejście, jeśli e-mail nie jest potwierdzony", () => {
  const state = resolveAccessState({
    isEmailVerified: false,
    accessStatus: {
      accessStatus: "trial_active",
      trialEnd: null,
      paidUntil: null,
    },
    now: "2026-04-10T10:00:00.000Z",
  })

  assert.equal(
    mustVerifyEmail({
      isEmailVerified: false,
      accessStatus: {
        accessStatus: "trial_active",
        trialEnd: null,
        paidUntil: null,
      },
      now: "2026-04-10T10:00:00.000Z",
    }),
    true,
  )
  assert.equal(state.canUseApp, false)
  assert.equal(state.mustSeeBillingWall, false)
  assert.equal(state.reason, "email-not-verified")
})

test("admin_unlimited ma najwyższy priorytet i wpuszcza nawet przy payment_failed oraz braku potwierdzenia maila", () => {
  const state = resolveAccessState({
    isEmailVerified: false,
    accessStatus: {
      accessStatus: "payment_failed",
      trialEnd: null,
      paidUntil: null,
      accessOverrideMode: "admin_unlimited",
      accessOverrideExpiresAt: null,
    },
    now: "2026-04-10T10:00:00.000Z",
  })

  assert.equal(state.canUseApp, true)
  assert.equal(state.mustVerifyEmail, false)
  assert.equal(state.mustSeeBillingWall, false)
  assert.equal(state.reason, "access-override")
  assert.equal(state.accessOverrideMode, "admin_unlimited")
})

test("tester_unlimited ma wyższy priorytet niż trial_expired", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "trial_expired",
      trialEnd: "2026-04-01T10:00:00.000Z",
      paidUntil: null,
      accessOverrideMode: "tester_unlimited",
      accessOverrideExpiresAt: "2026-04-30T10:00:00.000Z",
    },
    now: "2026-04-20T10:00:00.000Z",
  })

  assert.equal(state.canUseApp, true)
  assert.equal(state.reason, "access-override")
  assert.equal(state.accessOverrideMode, "tester_unlimited")
})

test("wygasły tester override nie omija normalnej blokady", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "trial_expired",
      trialEnd: "2026-04-01T10:00:00.000Z",
      paidUntil: null,
      accessOverrideMode: "tester_unlimited",
      accessOverrideExpiresAt: "2026-04-05T10:00:00.000Z",
    },
    now: "2026-04-20T10:00:00.000Z",
  })

  assert.equal(state.canUseApp, false)
  assert.equal(state.mustSeeBillingWall, true)
  assert.equal(state.reason, "trial-expired")
})

test("paid_active z ważnym paid_until ma wyższy priorytet niż trial i wpuszcza do aplikacji", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "paid_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: "2026-05-13T10:00:00.000Z",
    },
    now: "2026-04-10T10:00:00.000Z",
  })

  assert.equal(state.canUseApp, true)
  assert.equal(state.reason, "ok")
})

test("paid_active po końcu paid_until blokuje jako plan-expired", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "paid_active",
      trialEnd: "2026-04-30T10:00:00.000Z",
      paidUntil: "2026-04-10T09:00:00.000Z",
    },
    now: "2026-04-10T10:00:00.000Z",
  })

  assert.equal(state.canUseApp, false)
  assert.equal(state.mustSeeBillingWall, true)
  assert.equal(state.reason, "plan-expired")
})

test("trial_active z ważnym trial_end wpuszcza do aplikacji", () => {
  assert.equal(
    canUseApp({
      isEmailVerified: true,
      accessStatus: {
        accessStatus: "trial_active",
        trialEnd: "2026-04-13T10:00:00.000Z",
        paidUntil: null,
      },
      now: "2026-04-10T10:00:00.000Z",
    }),
    true,
  )
})

test("trial_active bez trial_end po potwierdzeniu maila nie wpuszcza do aplikacji", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "trial_active",
      trialEnd: null,
      paidUntil: null,
    },
    now: "2026-04-10T10:00:00.000Z",
  })

  assert.equal(state.canUseApp, false)
  assert.equal(state.mustSeeBillingWall, true)
  assert.equal(state.reason, "missing-access-status")
})

test("trial_active po końcu triala pokazuje billing wall", () => {
  assert.equal(
    mustSeeBillingWall({
      isEmailVerified: true,
      accessStatus: {
        accessStatus: "trial_active",
        trialEnd: "2026-04-13T10:00:00.000Z",
        paidUntil: null,
      },
      now: "2026-04-14T10:00:00.000Z",
    }),
    true,
  )
})

test("payment_failed z aktywnym grace_period_end nadal wpuszcza do aplikacji", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "payment_failed",
      trialEnd: null,
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
      trialEnd: null,
      paidUntil: "2026-04-20T10:00:00.000Z",
      gracePeriodEnd: "2026-04-20T09:00:00.000Z",
    },
    now: "2026-04-20T11:00:00.000Z",
  })

  assert.equal(state.canUseApp, false)
  assert.equal(state.mustSeeBillingWall, true)
  assert.equal(state.reason, "payment-failed")
})

test("canceled po końcu ważności blokuje dostęp", () => {
  const state = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "canceled",
      trialEnd: null,
      paidUntil: "2026-04-10T09:00:00.000Z",
    },
    now: "2026-04-10T10:00:00.000Z",
  })

  assert.equal(state.canUseApp, false)
  assert.equal(state.mustSeeBillingWall, true)
  assert.equal(state.reason, "canceled")
})
