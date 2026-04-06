import type { AccessStatusValue } from "@/lib/supabase/access-status"

export type ManualOverrideMode = "none" | "allow" | "block"

export type AccessMachineReason =
  | "ok"
  | "email-not-verified"
  | "missing-access-status"
  | "trial-expired"
  | "plan-expired"
  | "payment-failed"
  | "canceled"
  | "admin-blocked"
  | "admin-allowed"

export interface AccessStatusLike {
  accessStatus: AccessStatusValue
  trialStart?: string | null
  trialEnd: string | null
  paidUntil: string | null
  gracePeriodEnd?: string | null
  manualOverrideMode?: ManualOverrideMode | null
  manualOverrideUntil?: string | null
  manualOverrideReason?: string | null
}

export interface AccessMachineInput {
  isEmailVerified: boolean
  accessStatus: AccessStatusLike | null
  now?: string | Date
}

export interface AccessMachineResult {
  allowed: boolean
  canUseApp: boolean
  mustSeeBillingWall: boolean
  mustVerifyEmail: boolean
  reason: AccessMachineReason
  effectiveAccessStatus: AccessStatusValue | "missing"
  trialEndsAt: string | null
  paidUntil: string | null
  gracePeriodEnd: string | null
  isGracePeriod: boolean
  manualOverrideActive: boolean
  manualOverrideMode: ManualOverrideMode
}

function toTimestamp(value: string | null | undefined) {
  if (!value) return null
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? null : parsed
}

function getNowTimestamp(now?: string | Date) {
  if (now instanceof Date) return now.getTime()
  if (typeof now === "string") {
    const parsed = Date.parse(now)
    return Number.isNaN(parsed) ? Date.now() : parsed
  }
  return Date.now()
}

function isActiveUntil(value: string | null | undefined, now: number) {
  const timestamp = toTimestamp(value)
  return timestamp !== null && timestamp >= now
}

function hasActiveManualOverride(accessStatus: AccessStatusLike, now: number) {
  const mode = accessStatus.manualOverrideMode ?? "none"
  if (mode === "none") {
    return false
  }

  if (!accessStatus.manualOverrideUntil) {
    return true
  }

  return isActiveUntil(accessStatus.manualOverrideUntil, now)
}

function canUseGracePeriod(accessStatus: AccessStatusLike, now: number) {
  if (!["paid_active", "payment_failed", "canceled"].includes(accessStatus.accessStatus)) {
    return false
  }

  return isActiveUntil(accessStatus.gracePeriodEnd, now)
}

function buildResult(
  input: AccessMachineInput,
  patch: Partial<AccessMachineResult>,
): AccessMachineResult {
  return {
    allowed: false,
    canUseApp: false,
    mustSeeBillingWall: true,
    mustVerifyEmail: false,
    reason: "missing-access-status",
    effectiveAccessStatus: input.accessStatus?.accessStatus ?? "missing",
    trialEndsAt: input.accessStatus?.trialEnd ?? null,
    paidUntil: input.accessStatus?.paidUntil ?? null,
    gracePeriodEnd: input.accessStatus?.gracePeriodEnd ?? null,
    isGracePeriod: false,
    manualOverrideActive: false,
    manualOverrideMode: input.accessStatus?.manualOverrideMode ?? "none",
    ...patch,
  }
}

export function resolveAccessState(input: AccessMachineInput): AccessMachineResult {
  const now = getNowTimestamp(input.now)

  if (!input.isEmailVerified) {
    return buildResult(input, {
      reason: "email-not-verified",
      mustVerifyEmail: true,
      mustSeeBillingWall: false,
    })
  }

  if (!input.accessStatus) {
    return buildResult(input, {
      reason: "missing-access-status",
      mustSeeBillingWall: true,
    })
  }

  const accessStatus = input.accessStatus

  if (hasActiveManualOverride(accessStatus, now)) {
    if (accessStatus.manualOverrideMode === "allow") {
      return buildResult(input, {
        allowed: true,
        canUseApp: true,
        mustSeeBillingWall: false,
        reason: "admin-allowed",
        manualOverrideActive: true,
      })
    }

    return buildResult(input, {
      reason: "admin-blocked",
      manualOverrideActive: true,
      mustSeeBillingWall: true,
    })
  }

  const gracePeriodActive = canUseGracePeriod(accessStatus, now)

  switch (accessStatus.accessStatus) {
    case "trial_active":
      if (!accessStatus.trialEnd) {
        return buildResult(input, {
          reason: "missing-access-status",
        })
      }

      if (isActiveUntil(accessStatus.trialEnd, now)) {
        return buildResult(input, {
          allowed: true,
          canUseApp: true,
          mustSeeBillingWall: false,
          reason: "ok",
        })
      }

      return buildResult(input, {
        reason: "trial-expired",
      })

    case "trial_expired":
      return buildResult(input, {
        reason: "trial-expired",
      })

    case "paid_active":
      if (isActiveUntil(accessStatus.paidUntil, now) || gracePeriodActive) {
        return buildResult(input, {
          allowed: true,
          canUseApp: true,
          mustSeeBillingWall: false,
          reason: "ok",
          isGracePeriod: !isActiveUntil(accessStatus.paidUntil, now) && gracePeriodActive,
        })
      }

      return buildResult(input, {
        reason: "plan-expired",
      })

    case "payment_failed":
      if (gracePeriodActive) {
        return buildResult(input, {
          allowed: true,
          canUseApp: true,
          mustSeeBillingWall: false,
          reason: "ok",
          isGracePeriod: true,
        })
      }

      return buildResult(input, {
        reason: "payment-failed",
      })

    case "canceled":
      if (isActiveUntil(accessStatus.paidUntil, now) || gracePeriodActive) {
        return buildResult(input, {
          allowed: true,
          canUseApp: true,
          mustSeeBillingWall: false,
          reason: "ok",
          isGracePeriod: !isActiveUntil(accessStatus.paidUntil, now) && gracePeriodActive,
        })
      }

      return buildResult(input, {
        reason: "canceled",
      })

    default:
      return buildResult(input, {
        reason: "missing-access-status",
      })
  }
}

export function canUseApp(input: AccessMachineInput) {
  return resolveAccessState(input).canUseApp
}

export function mustSeeBillingWall(input: AccessMachineInput) {
  return resolveAccessState(input).mustSeeBillingWall
}

export function mustVerifyEmail(input: AccessMachineInput) {
  return resolveAccessState(input).mustVerifyEmail
}
