import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/config"
import { stripPortalTokenPublicValues } from "@/lib/security/portal-token"
import type { AppSnapshot } from "@/lib/types"

interface RawAppSnapshotRow {
  user_id: string
  workspace_id: string
  snapshot_json: AppSnapshot
}

export async function getAppSnapshotForUser(accessToken: string, userId: string) {
  const params = new URLSearchParams({
    select: "user_id,workspace_id,snapshot_json",
    user_id: `eq.${userId}`,
    limit: "1",
  })

  const response = await fetch(`${getSupabaseUrl()}/rest/v1/app_snapshots?${params.toString()}`, {
    method: "GET",
    headers: {
      apikey: getSupabasePublishableKey(),
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  })

  const text = await response.text()
  const json = text ? (JSON.parse(text) as RawAppSnapshotRow[] | { message?: string }) : []

  if (!response.ok) {
    const error = Array.isArray(json) ? "snapshot-load-error" : json.message || "snapshot-load-error"
    return { data: null, error, status: response.status }
  }

  const row = Array.isArray(json) ? json[0] ?? null : null
  if (!row) {
    return { data: null, error: null, status: response.status }
  }

  return {
    data: {
      userId: row.user_id,
      workspaceId: row.workspace_id,
      snapshot: stripPortalTokenPublicValues(row.snapshot_json),
    },
    error: null,
    status: response.status,
  }
}

export async function upsertAppSnapshotForUser(
  accessToken: string,
  input: {
    userId: string
    workspaceId: string
    snapshot: AppSnapshot
  },
) {
  const sanitizedSnapshot = stripPortalTokenPublicValues(input.snapshot)

  const response = await fetch(`${getSupabaseUrl()}/rest/v1/app_snapshots`, {
    method: "POST",
    headers: {
      apikey: getSupabasePublishableKey(),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      user_id: input.userId,
      workspace_id: input.workspaceId,
      snapshot_json: sanitizedSnapshot,
    }),
    cache: "no-store",
  })

  const text = await response.text()
  const json = text ? (JSON.parse(text) as RawAppSnapshotRow[] | { message?: string }) : []

  if (!response.ok) {
    const error = Array.isArray(json) ? "snapshot-save-error" : json.message || "snapshot-save-error"
    return { data: null, error, status: response.status }
  }

  const row = Array.isArray(json) ? json[0] ?? null : null
  return {
    data: row
      ? {
          userId: row.user_id,
          workspaceId: row.workspace_id,
          snapshot: stripPortalTokenPublicValues(row.snapshot_json),
        }
      : null,
    error: null,
    status: response.status,
  }
}
