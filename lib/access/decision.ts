import { resolveAccessState, type AccessMachineInput } from "@/lib/access/machine"

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
  reason: AccessDecisionReason
}

export function evaluateAccessStatusDecision(input: AccessStatusDecisionInput): AccessStatusDecision {
  const state = resolveAccessState({
    accessStatus: input.accessStatus,
    isEmailVerified: input.isEmailVerified ?? true,
    now: input.now,
  })

  if (state.canUseApp) {
    return { allowed: true, reason: "ok" }
  }

  switch (state.reason) {
    case "email-not-verified":
      return { allowed: false, reason: "email-not-verified" }
    case "trial-expired":
      return { allowed: false, reason: "trial-expired" }
    case "plan-expired":
      return { allowed: false, reason: "plan-expired" }
    case "payment-failed":
      return { allowed: false, reason: "payment-failed" }
    case "canceled":
      return { allowed: false, reason: "canceled" }
    case "missing-access-status":
    default:
      return { allowed: false, reason: "missing-access-status" }
  }
}
