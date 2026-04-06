import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"
import type { BonusKind } from "@/lib/types"

interface SystemEmailEventInsert {
  workspaceId: string
  userId: string
  kind: string
  dedupeKey: string
  recipientEmail: string
  subject: string
  provider: string
  providerMessageId: string | null
  payload: Record<string, unknown>
}

interface RawAccessStatusRow {
  workspace_id: string
  user_id: string
  access_status: "trial_active" | "trial_expired" | "paid_active" | "payment_failed" | "canceled"
  trial_start: string
  trial_end: string
  paid_until: string | null
  plan_name: string
  bonus_code_used: string | null
  bonus_kind: BonusKind | null
  bonus_applied_at: string | null
}

interface RawProfileRow {
  user_id: string
  email: string | null
  display_name: string | null
  is_email_verified: boolean
}

interface RawEmailEventRow {
  dedupe_key: string
}

async function adminRestRequest<T>(path: string, init: RequestInit = {}) {
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
      error: (json as { message?: string } | null)?.message || "supabase-admin-error",
      status: response.status,
    }
  }

  return {
    data: json as T,
    error: null,
    status: response.status,
  }
}

export async function listAccessStatusesForSystemEmails() {
  const params = new URLSearchParams({
    select: "workspace_id,user_id,access_status,trial_start,trial_end,paid_until,plan_name,bonus_code_used,bonus_kind,bonus_applied_at",
  })

  const result = await adminRestRequest<RawAccessStatusRow[]>(`/access_status?${params.toString()}`)
  return {
    ...result,
    data: result.data?.map((row) => ({
      workspaceId: row.workspace_id,
      userId: row.user_id,
      accessStatus: row.access_status,
      trialStart: row.trial_start,
      trialEnd: row.trial_end,
      paidUntil: row.paid_until,
      planName: row.plan_name,
      bonusCodeUsed: row.bonus_code_used,
      bonusKind: row.bonus_kind,
      bonusAppliedAt: row.bonus_applied_at,
    })) ?? null,
  }
}

export async function listProfilesForUserIds(userIds: string[]) {
  if (userIds.length === 0) {
    return { data: [], error: null, status: 200 }
  }

  const params = new URLSearchParams({
    select: "user_id,email,display_name,is_email_verified",
    user_id: `in.(${userIds.join(",")})`,
  })

  const result = await adminRestRequest<RawProfileRow[]>(`/profiles?${params.toString()}`)
  return {
    ...result,
    data: result.data?.map((row) => ({
      userId: row.user_id,
      email: row.email,
      displayName: row.display_name || "Użytkowniku",
      isEmailVerified: row.is_email_verified,
    })) ?? null,
  }
}

export async function listSystemEmailDedupeKeys() {
  const params = new URLSearchParams({
    select: "dedupe_key",
  })

  const result = await adminRestRequest<RawEmailEventRow[]>(`/system_email_events?${params.toString()}`)
  return {
    ...result,
    data: new Set((result.data ?? []).map((row) => row.dedupe_key)),
  }
}

export async function insertSystemEmailEvent(input: SystemEmailEventInsert) {
  return adminRestRequest<unknown>("/system_email_events", {
    method: "POST",
    headers: {
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      workspace_id: input.workspaceId,
      user_id: input.userId,
      kind: input.kind,
      dedupe_key: input.dedupeKey,
      recipient_email: input.recipientEmail,
      subject: input.subject,
      provider: input.provider,
      provider_message_id: input.providerMessageId,
      payload: input.payload,
    }),
  })
}
