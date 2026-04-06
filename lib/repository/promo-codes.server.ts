import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"
import type { AccessOverrideMode } from "@/lib/access/machine"

type RedeemRow = {
  applied: boolean
  access_override_mode: AccessOverrideMode | null
  access_override_expires_at: string | null
  access_override_note: string | null
  access_status: string | null
  paid_until: string | null
  effect_type: string | null
}

async function serviceRpcRequest<T>(rpcName: string, body: Record<string, unknown>) {
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/rpc/${rpcName}`, {
    method: "POST",
    headers: {
      apikey: getSupabaseServiceRoleKey(),
      Authorization: `Bearer ${getSupabaseServiceRoleKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const text = await response.text()
  const json = text ? (JSON.parse(text) as T | { message?: string }) : null

  if (!response.ok) {
    return {
      data: null,
      error: (json as { message?: string } | null)?.message || "service-rpc-error",
      status: response.status,
    }
  }

  return {
    data: json as T,
    error: null,
    status: response.status,
  }
}

export async function redeemPromoCode(input: { userId: string; code: string }) {
  const result = await serviceRpcRequest<RedeemRow[] | RedeemRow | null>("redeem_promo_code", {
    target_user_id: input.userId,
    raw_code: input.code,
  })

  const row = Array.isArray(result.data) ? (result.data[0] ?? null) : (result.data ?? null)

  return {
    ...result,
    data: row
      ? {
          applied: row.applied,
          accessOverrideMode: row.access_override_mode,
          accessOverrideExpiresAt: row.access_override_expires_at,
          accessOverrideNote: row.access_override_note,
          accessStatus: row.access_status,
          paidUntil: row.paid_until,
          effectType: row.effect_type,
        }
      : null,
  }
}
