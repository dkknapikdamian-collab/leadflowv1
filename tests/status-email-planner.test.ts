import test from "node:test"
import assert from "node:assert/strict"
import { buildStatusEmailJobs } from "../lib/mail/status-planner"

const profiles = [
  {
    userId: "user-1",
    email: "user@example.com",
    displayName: "Damian",
    isEmailVerified: true,
  },
]

test("buildStatusEmailJobs tworzy mail trial za 3 dni", () => {
  const jobs = buildStatusEmailJobs({
    accessRows: [
      {
        workspaceId: "workspace-1",
        userId: "user-1",
        accessStatus: "trial_active",
        trialStart: "2026-04-01T10:00:00.000Z",
        trialEnd: "2026-04-09T10:00:00.000Z",
        paidUntil: null,
        planName: "Solo",
        bonusCodeUsed: null,
        bonusKind: null,
        bonusAppliedAt: null,
      },
    ],
    profiles,
    existingDedupeKeys: new Set(),
    now: "2026-04-06T08:00:00.000Z",
  })

  assert.equal(jobs.length, 1)
  assert.equal(jobs[0]?.kind, "trial_ends_3d")
})

test("buildStatusEmailJobs tworzy mail trial jutro", () => {
  const jobs = buildStatusEmailJobs({
    accessRows: [
      {
        workspaceId: "workspace-1",
        userId: "user-1",
        accessStatus: "trial_active",
        trialStart: "2026-04-01T10:00:00.000Z",
        trialEnd: "2026-04-07T10:00:00.000Z",
        paidUntil: null,
        planName: "Solo",
        bonusCodeUsed: null,
        bonusKind: null,
        bonusAppliedAt: null,
      },
    ],
    profiles,
    existingDedupeKeys: new Set(),
    now: "2026-04-06T08:00:00.000Z",
  })

  assert.equal(jobs.length, 1)
  assert.equal(jobs[0]?.kind, "trial_ends_1d")
})

test("buildStatusEmailJobs tworzy mail plan aktywny do dnia X", () => {
  const jobs = buildStatusEmailJobs({
    accessRows: [
      {
        workspaceId: "workspace-1",
        userId: "user-1",
        accessStatus: "paid_active",
        trialStart: "2026-04-01T10:00:00.000Z",
        trialEnd: "2026-04-08T10:00:00.000Z",
        paidUntil: "2026-05-01T10:00:00.000Z",
        planName: "Solo",
        bonusCodeUsed: null,
        bonusKind: null,
        bonusAppliedAt: null,
      },
    ],
    profiles,
    existingDedupeKeys: new Set(),
    now: "2026-04-06T08:00:00.000Z",
  })

  assert.equal(jobs.length, 1)
  assert.equal(jobs[0]?.kind, "account_active_until")
})

test("buildStatusEmailJobs tworzy mail plan wygasł", () => {
  const jobs = buildStatusEmailJobs({
    accessRows: [
      {
        workspaceId: "workspace-1",
        userId: "user-1",
        accessStatus: "trial_expired",
        trialStart: "2026-04-01T10:00:00.000Z",
        trialEnd: "2026-04-05T10:00:00.000Z",
        paidUntil: null,
        planName: "Solo",
        bonusCodeUsed: null,
        bonusKind: null,
        bonusAppliedAt: null,
      },
    ],
    profiles,
    existingDedupeKeys: new Set(),
    now: "2026-04-06T08:00:00.000Z",
  })

  assert.equal(jobs.length, 1)
  assert.equal(jobs[0]?.kind, "plan_expired")
})

test("buildStatusEmailJobs tworzy mail payment_failed", () => {
  const jobs = buildStatusEmailJobs({
    accessRows: [
      {
        workspaceId: "workspace-1",
        userId: "user-1",
        accessStatus: "payment_failed",
        trialStart: "2026-04-01T10:00:00.000Z",
        trialEnd: "2026-04-05T10:00:00.000Z",
        paidUntil: "2026-04-10T10:00:00.000Z",
        planName: "Solo",
        bonusCodeUsed: null,
        bonusKind: null,
        bonusAppliedAt: null,
      },
    ],
    profiles,
    existingDedupeKeys: new Set(),
    now: "2026-04-06T08:00:00.000Z",
  })

  assert.equal(jobs.length, 1)
  assert.equal(jobs[0]?.kind, "payment_failed")
})

test("buildStatusEmailJobs nie tworzy duplikatu, jeśli dedupe key już istnieje", () => {
  const jobs = buildStatusEmailJobs({
    accessRows: [
      {
        workspaceId: "workspace-1",
        userId: "user-1",
        accessStatus: "trial_active",
        trialStart: "2026-04-01T10:00:00.000Z",
        trialEnd: "2026-04-09T10:00:00.000Z",
        paidUntil: null,
        planName: "Solo",
        bonusCodeUsed: null,
        bonusKind: null,
        bonusAppliedAt: null,
      },
    ],
    profiles,
    existingDedupeKeys: new Set(["trial-ends-3d:workspace-1:2026-04-09"]),
    now: "2026-04-06T08:00:00.000Z",
  })

  assert.equal(jobs.length, 0)
})
