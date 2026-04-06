import type { AccessOverrideMode } from "@/lib/access/machine"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"
import type { AccessStatusRow } from "@/lib/supabase/access-status"

export interface ServerAccessStatusRow extends AccessStatusRow {
  accessOverrideMode: AccessOverrideMode
  accessOverrideExpiresAt: string | null
  accessOverrideNote: string | null
}

interface RawServerAccessStatusRow {
  workspace_id: string
  user_id: string
  access_status: AccessStatusRow["accessStatus"]
  trial_start: string | null
  trial_end: string | null
  paid_until: string | null
  grace_period_end: string | null
  billing_customer_id: string | null
  billing_subscription_id: string | null
  plan_name: string
  bonus_code_used: string | null
  bonus_kind: AccessStatusRow["bonusKind"]
  bonus_applied_at: string | null
  access_override_mode: AccessOverrideMode | null
  access_override_expires_at: string | null
  access_override_note: string | null
}

interface EnsureUserCoreStateRow {
  workspace_id: string | null
}

async function serverAccessStatusRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${getSupabaseUrl()}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: getSupabaseServiceRoleKey(),
      Authorization: `Bearer ${getSupabaseServiceRoleKey()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  })

  const text = await response.text()
  const json = text ? (JSON.parse(text) as T | { message?: string }) : null

  if (!response.ok) {
    return {
      data: null,
      error: (json as { message?: string } | null)?.message || "server-access-status-error",
      status: response.status,
    }
  }

  return {
    data: json as T,
    error: null,
    status: response.status,
  }
}

function mapServerAccessStatusRow(row: RawServerAccessStatusRow): ServerAccessStatusRow {
  return {
    workspaceId: row.workspace_id,
    userId: row.user_id,
    accessStatus: row.access_status,
    trialStart: row.trial_start,
    trialEnd: row.trial_end,
    paidUntil: row.paid_until,
    gracePeriodEnd: row.grace_period_end,
    billingCustomerId: row.billing_customer_id,
    billingSubscriptionId: row.billing_subscription_id,
    planName: row.plan_name,
    bonusCodeUsed: row.bonus_code_used,
    bonusKind: row.bonus_kind,
    bonusAppliedAt: row.bonus_applied_at,
    accessOverrideMode: row.access_override_mode ?? "none",
    accessOverrideExpiresAt: row.access_override_expires_at,
    accessOverrideNote: row.access_override_note,
  }
}

export function sanitizeAccessStatusForClient(row: ServerAccessStatusRow): AccessStatusRow {
  return {
    workspaceId: row.workspaceId,
    userId: row.userId,
    accessStatus: row.accessStatus,
    trialStart: row.trialStart,
    trialEnd: row.trialEnd,
    paidUntil: row.paidUntil,
    gracePeriodEnd: row.gracePeriodEnd ?? null,
    accessOverrideMode: row.accessOverrideMode,
    accessOverrideExpiresAt: row.accessOverrideExpiresAt,
    accessOverrideNote: row.accessOverrideNote,
    billingCustomerId: row.billingCustomerId,
    billingSubscriptionId: row.billingSubscriptionId,
    planName: row.planName,
    bonusCodeUsed: row.bonusCodeUsed,
    bonusKind: row.bonusKind,
    bonusAppliedAt: row.bonusAppliedAt,
  }
}

export async function ensureUserCoreState(userId: string) {
  const result = await serverAccessStatusRequest<EnsureUserCoreStateRow[] | EnsureUserCoreStateRow | null>(
    "/rpc/ensure_user_core_state",
    {
      method: "POST",
      body: JSON.stringify({
        target_user_id: userId,
      }),
    },
  )

  const row = Array.isArray(result.data) ? (result.data[0] ?? null) : (result.data ?? null)

  return {
    ...result,
    data: row
      ? {
          workspaceId: row.workspace_id,
        }
      : null,
  }
}

export async function getServerAccessStatusForUser(userId: string) {
  const params = new URLSearchParams({
    select: [
      "workspace_id",
      "user_id",
      "access_status",
      "trial_start",
      "trial_end",
      "paid_until",
      "grace_period_end",
      "billing_customer_id",
      "billing_subscription_id",
      "plan_name",
      "bonus_code_used",
      "bonus_kind",
      "bonus_applied_at",
      "access_override_mode",
      "access_override_expires_at",
      "access_override_note",
    ].join(","),
    user_id: `eq.${userId}`,
    limit: "1",
  })

  const result = await serverAccessStatusRequest<RawServerAccessStatusRow[]>(`/access_status?${params.toString()}`)
  const row = result.data?.[0]

  return {
    ...result,
    data: row ? mapServerAccessStatusRow(row) : null,
  }
}

export async function upsertServerAccessOverride(input: {
  userId: string
  mode: Exclude<AccessOverrideMode, "none">
  expiresAt?: string | null
  note?: string | null
}) {
  const params = new URLSearchParams({
    user_id: `eq.${input.userId}`,
  })

  return serverAccessStatusRequest<unknown>(`/access_status?${params.toString()}`, {
    method: "PATCH",
    headers: {
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      access_override_mode: input.mode,
      access_override_expires_at: input.expiresAt ?? null,
      access_override_note: input.note ?? null,
    }),
  })
}
