import type { BonusKind } from "@/lib/types"
import type { AccountStatusEmailKind } from "@/lib/mail/templates"

export interface AccessStatusEmailRow {
  workspaceId: string
  userId: string
  accessStatus: "trial_active" | "trial_expired" | "paid_active" | "payment_failed" | "canceled"
  trialStart: string
  trialEnd: string
  paidUntil: string | null
  planName: string
  bonusCodeUsed: string | null
  bonusKind: BonusKind | null
  bonusAppliedAt: string | null
}

export interface ProfileEmailRow {
  userId: string
  email: string | null
  displayName: string
  isEmailVerified: boolean
}

export interface PlannedStatusEmailJob {
  workspaceId: string
  userId: string
  to: string
  displayName: string
  planName: string
  kind: AccountStatusEmailKind
  dedupeKey: string
  dateValue: string | null
}

function startOfUtcDay(value: string | Date) {
  const date = new Date(value)
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function daysUntil(target: string, now: string | Date) {
  return Math.round((startOfUtcDay(target) - startOfUtcDay(now)) / 86_400_000)
}

function pushJob(
  jobs: PlannedStatusEmailJob[],
  existingDedupeKeys: Set<string>,
  job: PlannedStatusEmailJob,
) {
  if (existingDedupeKeys.has(job.dedupeKey)) return
  jobs.push(job)
}

export function buildStatusEmailJobs(input: {
  accessRows: AccessStatusEmailRow[]
  profiles: ProfileEmailRow[]
  existingDedupeKeys: Set<string>
  now?: string | Date
}) {
  const now = input.now ?? new Date()
  const profilesByUserId = new Map(input.profiles.map((profile) => [profile.userId, profile]))
  const jobs: PlannedStatusEmailJob[] = []

  for (const row of input.accessRows) {
    const profile = profilesByUserId.get(row.userId)
    const email = profile?.email?.trim() || ""

    if (!profile || !profile.isEmailVerified || !email) {
      continue
    }

    const base = {
      workspaceId: row.workspaceId,
      userId: row.userId,
      to: email,
      displayName: profile.displayName || "Użytkowniku",
      planName: row.planName || "Solo",
    }

    if (row.accessStatus === "trial_active") {
      const diff = daysUntil(row.trialEnd, now)
      if (diff === 3) {
        pushJob(jobs, input.existingDedupeKeys, {
          ...base,
          kind: "trial_ends_3d",
          dedupeKey: `trial-ends-3d:${row.workspaceId}:${row.trialEnd.slice(0, 10)}`,
          dateValue: row.trialEnd,
        })
      }
      if (diff === 1) {
        pushJob(jobs, input.existingDedupeKeys, {
          ...base,
          kind: "trial_ends_1d",
          dedupeKey: `trial-ends-1d:${row.workspaceId}:${row.trialEnd.slice(0, 10)}`,
          dateValue: row.trialEnd,
        })
      }
      if (diff < 0) {
        pushJob(jobs, input.existingDedupeKeys, {
          ...base,
          kind: "plan_expired",
          dedupeKey: `plan-expired:trial:${row.workspaceId}:${row.trialEnd.slice(0, 10)}`,
          dateValue: row.trialEnd,
        })
      }
    }

    if (row.accessStatus === "trial_expired") {
      pushJob(jobs, input.existingDedupeKeys, {
        ...base,
        kind: "plan_expired",
        dedupeKey: `plan-expired:trial:${row.workspaceId}:${row.trialEnd.slice(0, 10)}`,
        dateValue: row.trialEnd,
      })
    }

    if ((row.accessStatus === "paid_active" || row.accessStatus === "canceled") && row.paidUntil) {
      const diff = daysUntil(row.paidUntil, now)
      if (diff >= 0) {
        pushJob(jobs, input.existingDedupeKeys, {
          ...base,
          kind: "account_active_until",
          dedupeKey: `account-active-until:${row.workspaceId}:${row.paidUntil.slice(0, 10)}`,
          dateValue: row.paidUntil,
        })
      } else {
        pushJob(jobs, input.existingDedupeKeys, {
          ...base,
          kind: "plan_expired",
          dedupeKey: `plan-expired:paid:${row.workspaceId}:${row.paidUntil.slice(0, 10)}`,
          dateValue: row.paidUntil,
        })
      }
    }

    if (row.accessStatus === "payment_failed") {
      pushJob(jobs, input.existingDedupeKeys, {
        ...base,
        kind: "payment_failed",
        dedupeKey: `payment-failed:${row.workspaceId}:${row.paidUntil ? row.paidUntil.slice(0, 10) : "none"}`,
        dateValue: row.paidUntil,
      })
    }
  }

  return jobs
}
