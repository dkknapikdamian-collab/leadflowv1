import { resolveAccessState, type AccessMachineInput } from "./machine"

export type AccessDecisionReason =
  | "ok"
  | "email-not-verified"
  | "missing-access-status"
  | "trial-expired"
  | "plan-expired"
  | "payment-failed"
  | "canceled"

export interface AccessStatusDecisionInput {
  accessStatus: AccessMachineInput["accessStatus"]
  isEmailVerified?: boolean
  now?: string | Date
}

export interface AccessStatusDecision {
  allowed: boolean
  mode: "full" | "read_only" | "blocked"
  reason: AccessDecisionReason
}

export function evaluateAccessStatusDecision(input: AccessStatusDecisionInput): AccessStatusDecision {
  const state = resolveAccessState({
    accessStatus: input.accessStatus,
    isEmailVerified: input.isEmailVerified ?? true,
    now: input.now,
  })

  if (state.canUseApp) {
    return { allowed: true, mode: "full", reason: "ok" }
  }

  if (state.canAccessApp) {
    switch (state.reason) {
      case "trial-expired":
        return { allowed: true, mode: "read_only", reason: "trial-expired" }
      case "plan-expired":
        return { allowed: true, mode: "read_only", reason: "plan-expired" }
      case "payment-failed":
        return { allowed: true, mode: "read_only", reason: "payment-failed" }
      case "canceled":
        return { allowed: true, mode: "read_only", reason: "canceled" }
      default:
        return { allowed: true, mode: "read_only", reason: "ok" }
    }
  }

  switch (state.reason) {
    case "email-not-verified":
      return { allowed: false, mode: "blocked", reason: "email-not-verified" }
    case "trial-expired":
      return { allowed: false, mode: "blocked", reason: "trial-expired" }
    case "plan-expired":
      return { allowed: false, mode: "blocked", reason: "plan-expired" }
    case "payment-failed":
      return { allowed: false, mode: "blocked", reason: "payment-failed" }
    case "canceled":
      return { allowed: false, mode: "blocked", reason: "canceled" }
    case "missing-access-status":
    default:
      return { allowed: false, mode: "blocked", reason: "missing-access-status" }
  }
}
