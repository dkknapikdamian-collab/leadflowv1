export type AccessDecisionReason =
  | "ok"
  | "missing-access-status"
  | "trial-expired"
  | "plan-expired"
  | "payment-failed"
  | "canceled"

export interface AccessStatusDecisionInput {
  accessStatus: {
    accessStatus: "trial_active" | "trial_expired" | "paid_active" | "payment_failed" | "canceled"
    trialEnd: string
    paidUntil: string | null
  } | null
  now?: string | Date
}

export interface AccessStatusDecision {
  allowed: boolean
  reason: AccessDecisionReason
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

export function evaluateAccessStatusDecision(input: AccessStatusDecisionInput): AccessStatusDecision {
  if (!input.accessStatus) {
    return { allowed: false, reason: "missing-access-status" }
  }

  const now = getNowTimestamp(input.now)
  const trialEnd = toTimestamp(input.accessStatus.trialEnd)
  const paidUntil = toTimestamp(input.accessStatus.paidUntil)

  switch (input.accessStatus.accessStatus) {
    case "trial_active":
      return trialEnd !== null && trialEnd >= now
        ? { allowed: true, reason: "ok" }
        : { allowed: false, reason: "trial-expired" }
    case "paid_active":
      return paidUntil !== null && paidUntil >= now
        ? { allowed: true, reason: "ok" }
        : { allowed: false, reason: "plan-expired" }
    case "canceled":
      return paidUntil !== null && paidUntil >= now
        ? { allowed: true, reason: "ok" }
        : { allowed: false, reason: "canceled" }
    case "payment_failed":
      return { allowed: false, reason: "payment-failed" }
    case "trial_expired":
      return { allowed: false, reason: "trial-expired" }
    default:
      return { allowed: false, reason: "missing-access-status" }
  }
}
