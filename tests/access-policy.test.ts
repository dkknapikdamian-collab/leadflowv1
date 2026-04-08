import test from "node:test"
import assert from "node:assert/strict"
import { applyAccessStatusToSnapshot } from "../lib/access/account-status"
import { resolveSnapshotAccessPolicy, resolveWorkspaceAccessPolicy } from "../lib/access/policy"
import { createInitialSnapshot } from "../lib/seed"

test("resolveWorkspaceAccessPolicy po trialu daje tryb podgladu danych", () => {
  const policy = resolveWorkspaceAccessPolicy({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: "trial_expired",
      trialEnd: "2026-04-05T10:00:00.000Z",
      paidUntil: null,
    },
    now: "2026-04-08T10:00:00.000Z",
  })

  assert.equal(policy.canViewData, true)
  assert.equal(policy.canWork, false)
  assert.equal(policy.canCreateLeads, false)
  assert.equal(policy.canCreateCases, false)
  assert.equal(policy.clientPortalPolicy, "read_only")
})

test("resolveWorkspaceAccessPolicy dla niepotwierdzonego maila blokuje rowniez podglad", () => {
  const policy = resolveWorkspaceAccessPolicy({
    isEmailVerified: false,
    accessStatus: {
      accessStatus: "trial_active",
      trialEnd: "2026-04-10T10:00:00.000Z",
      paidUntil: null,
    },
    now: "2026-04-08T10:00:00.000Z",
  })

  assert.equal(policy.canViewData, false)
  assert.equal(policy.canWork, false)
  assert.equal(policy.clientPortalPolicy, "disabled")
})

test("resolveSnapshotAccessPolicy dla snapshotu lokalnego utrzymuje pelny dostep", () => {
  const policy = resolveSnapshotAccessPolicy(createInitialSnapshot())

  assert.equal(policy.canViewData, true)
  assert.equal(policy.canWork, true)
  assert.equal(policy.clientPortalPolicy, "active")
  assert.equal(policy.reason, "ok")
})

test("resolveSnapshotAccessPolicy po trial_expired utrzymuje odczyt i blokuje normalna prace", () => {
  const blockedSnapshot = applyAccessStatusToSnapshot(
    createInitialSnapshot(),
    {
      workspaceId: "workspace-1",
      userId: "user-1",
      accessStatus: "trial_expired",
      trialStart: "2026-04-01T10:00:00.000Z",
      trialEnd: "2026-04-05T10:00:00.000Z",
      paidUntil: null,
      gracePeriodEnd: null,
      accessOverrideMode: null,
      accessOverrideExpiresAt: null,
      accessOverrideNote: null,
      billingCustomerId: null,
      billingSubscriptionId: null,
      planName: "Solo",
      bonusCodeUsed: null,
      bonusKind: null,
      bonusAppliedAt: null,
    },
    new Date("2026-04-08T10:00:00.000Z"),
  )

  const policy = resolveSnapshotAccessPolicy(blockedSnapshot)
  assert.equal(policy.canViewData, true)
  assert.equal(policy.canWork, false)
  assert.equal(policy.clientPortalPolicy, "read_only")
})
