import { resolveAccessState, type AccessMachineInput, type AccessMachineResult } from "./machine"
import type { AppSnapshot, AccessStatus } from "../types"

export type ClientPortalPolicy = "active" | "read_only" | "disabled"

export interface WorkspaceAccessPolicy {
  canViewData: boolean
  canWork: boolean
  canCreateLeads: boolean
  canCreateCases: boolean
  canManageClientPortal: boolean
  clientPortalPolicy: ClientPortalPolicy
  reason: AccessMachineResult["reason"] | "local"
}

export type EffectiveSnapshotStatus = Exclude<AccessStatus, "local"> | "local"

export function getEffectiveSnapshotStatus(snapshot: AppSnapshot): EffectiveSnapshotStatus {
  if (snapshot.context.accessStatus !== "local") {
    return snapshot.context.accessStatus
  }

  if (snapshot.billing.status === "trial") return "trial_active"
  if (snapshot.billing.status === "active") return "paid_active"
  if (snapshot.billing.status === "past_due") return "trial_expired"
  return "local"
}

export function resolveWorkspaceAccessPolicy(input: AccessMachineInput): WorkspaceAccessPolicy {
  const state = resolveAccessState(input)
  const canViewData = !state.mustVerifyEmail && state.effectiveAccessStatus !== "missing"
  const canWork = state.canUseApp

  return {
    canViewData,
    canWork,
    canCreateLeads: canWork,
    canCreateCases: canWork,
    canManageClientPortal: canWork,
    clientPortalPolicy: canWork ? "active" : canViewData ? "read_only" : "disabled",
    reason: state.reason,
  }
}

export function resolveSnapshotAccessPolicy(
  snapshot: AppSnapshot,
  options: { now?: string | Date; isEmailVerified?: boolean } = {},
): WorkspaceAccessPolicy {
  const effectiveStatus = getEffectiveSnapshotStatus(snapshot)

  if (effectiveStatus === "local") {
    return {
      canViewData: true,
      canWork: true,
      canCreateLeads: true,
      canCreateCases: true,
      canManageClientPortal: true,
      clientPortalPolicy: "active",
      reason: "local",
    }
  }

  return resolveWorkspaceAccessPolicy({
    isEmailVerified: options.isEmailVerified ?? true,
    accessStatus: {
      accessStatus: effectiveStatus,
      trialEnd: snapshot.billing.trialEndsAt,
      paidUntil: snapshot.billing.renewAt,
    },
    now: options.now,
  })
}
