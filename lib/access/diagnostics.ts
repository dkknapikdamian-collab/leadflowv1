import { resolveAccessState } from "@/lib/access/machine"
import type { ServerAccessStatusRow } from "@/lib/repository/access-state.server"

export const PRIMARY_ADMIN_EMAIL = "dk.knapikdamian@gmail.com"

export function normalizeEmail(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase() ?? ""
  return normalized || null
}

export function isPrimaryAdminEmail(value: string | null | undefined) {
  return normalizeEmail(value) === PRIMARY_ADMIN_EMAIL
}

export interface AccessDiagnosticsPayload {
  targetEmail: string | null
  diagnosticTimestamp: string
  userFound: boolean
  profileFound: boolean
  accessStatusFound: boolean
  sessionUserId: string | null
  sessionEmail: string | null
  subjectUserId: string | null
  subjectEmail: string | null
  isAdminEmail: boolean
  isEmailVerified: boolean
  hasAccessStatus: boolean
  accessStatus: string | null
  trialStart: string | null
  trialEnd: string | null
  paidUntil: string | null
  gracePeriodEnd: string | null
  accessOverrideMode: string | null
  accessOverrideExpiresAt: string | null
  accessOverrideNote: string | null
  resolvedCanUseApp: boolean
  resolvedMustSeeBillingWall: boolean
  resolvedMustVerifyEmail: boolean
  resolvedReason: string
  isOverrideActive: boolean
}

export function buildAccessDiagnosticsPayload(input: {
  targetEmail?: string | null
  sessionUserId?: string | null
  sessionEmail?: string | null
  subjectUserId?: string | null
  subjectEmail?: string | null
  userFound?: boolean
  profileFound?: boolean
  isEmailVerified?: boolean
  accessStatus?: ServerAccessStatusRow | null
  now?: Date
}): AccessDiagnosticsPayload {
  const now = input.now ?? new Date()
  const state = resolveAccessState({
    isEmailVerified: input.isEmailVerified ?? false,
    accessStatus: input.accessStatus ?? null,
    now,
  })

  return {
    targetEmail: normalizeEmail(input.targetEmail ?? input.subjectEmail ?? null),
    diagnosticTimestamp: now.toISOString(),
    userFound: input.userFound ?? false,
    profileFound: input.profileFound ?? false,
    accessStatusFound: Boolean(input.accessStatus),
    sessionUserId: input.sessionUserId ?? null,
    sessionEmail: normalizeEmail(input.sessionEmail ?? null),
    subjectUserId: input.subjectUserId ?? null,
    subjectEmail: normalizeEmail(input.subjectEmail ?? null),
    isAdminEmail: isPrimaryAdminEmail(input.subjectEmail ?? null),
    isEmailVerified: Boolean(input.isEmailVerified),
    hasAccessStatus: Boolean(input.accessStatus),
    accessStatus: input.accessStatus?.accessStatus ?? null,
    trialStart: input.accessStatus?.trialStart ?? null,
    trialEnd: input.accessStatus?.trialEnd ?? null,
    paidUntil: input.accessStatus?.paidUntil ?? null,
    gracePeriodEnd: input.accessStatus?.gracePeriodEnd ?? null,
    accessOverrideMode: input.accessStatus?.accessOverrideMode ?? null,
    accessOverrideExpiresAt: input.accessStatus?.accessOverrideExpiresAt ?? null,
    accessOverrideNote: input.accessStatus?.accessOverrideNote ?? null,
    resolvedCanUseApp: state.canUseApp,
    resolvedMustSeeBillingWall: state.mustSeeBillingWall,
    resolvedMustVerifyEmail: state.mustVerifyEmail,
    resolvedReason: state.reason,
    isOverrideActive: state.accessOverrideActive,
  }
}
