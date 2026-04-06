import type { AccessStatusValue } from "@/lib/supabase/access-status"

export type AccessOverrideMode = "none" | "admin_unlimited" | "tester_unlimited"

export type AccessMachineReason =
  | "ok"
  | "access-override"
  | "email-not-verified"
  | "missing-access-status"
  | "trial-expired"
  | "plan-expired"
  | "payment-failed"
  | "canceled"

export interface AccessStatusLike {
  accessStatus: AccessStatusValue
  trialStart?: string | null
  trialEnd: string | null
  paidUntil: string | null
  gracePeriodEnd?: string | null
  accessOverrideMode?: AccessOverrideMode | null
  accessOverrideExpiresAt?: string | null
  accessOverrideNote?: string | null
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
  accessOverrideActive: boolean
  accessOverrideMode: AccessOverrideMode
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

function getActiveAccessOverrideMode(accessStatus: AccessStatusLike, now: number): AccessOverrideMode {
  const mode = accessStatus.accessOverrideMode ?? "none"
  if (mode === "none") {
    return "none"
  }

  if (!accessStatus.accessOverrideExpiresAt) {
    return mode
  }

  return isActiveUntil(accessStatus.accessOverrideExpiresAt, now) ? mode : "none"
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
    accessOverrideActive: false,
    accessOverrideMode: input.accessStatus?.accessOverrideMode ?? "none",
    ...patch,
  }
}

export function resolveAccessState(input: AccessMachineInput): AccessMachineResult {
  const now = getNowTimestamp(input.now)

  if (input.accessStatus) {
    const activeOverrideMode = getActiveAccessOverrideMode(input.accessStatus, now)

    if (activeOverrideMode === "admin_unlimited") {
      return buildResult(input, {
        allowed: true,
        canUseApp: true,
        mustSeeBillingWall: false,
        mustVerifyEmail: false,
        reason: "access-override",
        accessOverrideActive: true,
        accessOverrideMode: "admin_unlimited",
      })
    }

    if (activeOverrideMode === "tester_unlimited") {
      return buildResult(input, {
        allowed: true,
        canUseApp: true,
        mustSeeBillingWall: false,
        mustVerifyEmail: false,
        reason: "access-override",
        accessOverrideActive: true,
        accessOverrideMode: "tester_unlimited",
      })
    }
  }

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
  const gracePeriodActive = canUseGracePeriod(accessStatus, now)

  if (accessStatus.accessStatus === "paid_active") {
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
  }

  if (accessStatus.accessStatus === "trial_active") {
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
  }

  if (accessStatus.accessStatus === "payment_failed") {
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
  }

  if (accessStatus.accessStatus === "canceled") {
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
  }

  if (accessStatus.accessStatus === "trial_expired") {
    return buildResult(input, {
      reason: "trial-expired",
    })
  }

  return buildResult(input, {
    reason: "missing-access-status",
  })
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
