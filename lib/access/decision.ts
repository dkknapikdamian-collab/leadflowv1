export type AccessState = "allowed" | "blocked" | "trial" | "expired"

export type AccessDecisionInput = {
  workspaceId: string | null
  trialEndsAt?: string | null
  subscriptionStatus?: string | null
  workspaceStatus?: string | null
}

export type AccessDecision = {
  state: AccessState
  reason: string
}

export function decideAccess(input: AccessDecisionInput): AccessDecision {
  if (!input.workspaceId) {
    return { state: "blocked", reason: "missing-workspace" }
  }

  if (input.workspaceStatus === "blocked") {
    return { state: "blocked", reason: "workspace-blocked" }
  }

  if (input.subscriptionStatus === "active") {
    return { state: "allowed", reason: "active-subscription" }
  }

  if (input.trialEndsAt) {
    const trialEnd = new Date(input.trialEndsAt).getTime()
    if (!Number.isNaN(trialEnd) && trialEnd >= Date.now()) {
      return { state: "trial", reason: "trial-active" }
    }
  }

  return { state: "expired", reason: "no-active-access" }
}
