import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/config"

export interface AccessStatusRow {
  workspaceId: string
  userId: string
  accessStatus: "trial_active" | "trial_expired" | "paid_active" | "payment_failed" | "canceled"
  trialStart: string
  trialEnd: string
  paidUntil: string | null
  billingCustomerId: string | null
  billingSubscriptionId: string | null
  planName: string
  bonusCodeUsed: string | null
  bonusKind: "promo_code" | "referral" | "manual" | null
  bonusAppliedAt: string | null
}

interface RawAccessStatusRow {
  workspace_id: string
  user_id: string
  access_status: AccessStatusRow["accessStatus"]
  trial_start: string
  trial_end: string
  paid_until: string | null
  billing_customer_id: string | null
  billing_subscription_id: string | null
  plan_name: string
  bonus_code_used: string | null
  bonus_kind: AccessStatusRow["bonusKind"]
  bonus_applied_at: string | null
}

export async function getAccessStatusForUser(accessToken: string, userId: string) {
  const params = new URLSearchParams({
    select: [
      "workspace_id",
      "user_id",
      "access_status",
      "trial_start",
      "trial_end",
      "paid_until",
      "billing_customer_id",
      "billing_subscription_id",
      "plan_name",
      "bonus_code_used",
      "bonus_kind",
      "bonus_applied_at",
    ].join(","),
    user_id: `eq.${userId}`,
    limit: "1",
  })

  const response = await fetch(`${getSupabaseUrl()}/rest/v1/access_status?${params.toString()}`, {
    method: "GET",
    headers: {
      apikey: getSupabasePublishableKey(),
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  })

  const text = await response.text()
  const json = text ? (JSON.parse(text) as RawAccessStatusRow[] | { message?: string }) : []

  if (!response.ok) {
    const error = Array.isArray(json) ? "access-status-error" : json.message || "access-status-error"
    return { data: null, error, status: response.status }
  }

  const row = Array.isArray(json) ? json[0] : null
  if (!row) {
    return { data: null, error: null, status: response.status }
  }

  return {
    data: {
      workspaceId: row.workspace_id,
      userId: row.user_id,
      accessStatus: row.access_status,
      trialStart: row.trial_start,
      trialEnd: row.trial_end,
      paidUntil: row.paid_until,
      billingCustomerId: row.billing_customer_id,
      billingSubscriptionId: row.billing_subscription_id,
      planName: row.plan_name,
      bonusCodeUsed: row.bonus_code_used,
      bonusKind: row.bonus_kind,
      bonusAppliedAt: row.bonus_applied_at,
    } satisfies AccessStatusRow,
    error: null,
    status: response.status,
  }
}
