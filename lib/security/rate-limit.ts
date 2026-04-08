import type { NextRequest } from "next/server"

const buckets = new Map<string, number[]>()

export type SecurityRateLimitAction =
  | "portal-view"
  | "portal-invalid-token"
  | "portal-action"
  | "portal-upload"
  | "portal-acceptance"
  | "portal-attachment-read"
  | "workflow-reminder-trigger"

const config: Record<SecurityRateLimitAction, { limit: number; windowMs: number; cooldownMs: number }> = {
  "portal-view": { limit: 60, windowMs: 15 * 60 * 1000, cooldownMs: 30 * 1000 },
  "portal-invalid-token": { limit: 20, windowMs: 15 * 60 * 1000, cooldownMs: 5 * 60 * 1000 },
  "portal-action": { limit: 30, windowMs: 15 * 60 * 1000, cooldownMs: 60 * 1000 },
  "portal-upload": { limit: 12, windowMs: 15 * 60 * 1000, cooldownMs: 120 * 1000 },
  "portal-acceptance": { limit: 20, windowMs: 15 * 60 * 1000, cooldownMs: 60 * 1000 },
  "portal-attachment-read": { limit: 45, windowMs: 15 * 60 * 1000, cooldownMs: 30 * 1000 },
  "workflow-reminder-trigger": { limit: 12, windowMs: 60 * 1000, cooldownMs: 10 * 1000 },
}

export type SecurityRateLimitResult = {
  ok: boolean
  retryAfterSeconds: number
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export function getRequestClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown-ip"
}

export function checkSecurityRateLimit(action: SecurityRateLimitAction, key: string): SecurityRateLimitResult {
  const now = Date.now()
  const normalizedKey = `${action}:${normalize(key)}`
  const current = buckets.get(normalizedKey) ?? []
  const policy = config[action]
  const active = current.filter((timestamp) => now - timestamp < policy.windowMs)

  if (active.length >= policy.limit) {
    const oldest = active[0] ?? now
    const retryAfterSeconds = Math.max(1, Math.ceil((policy.cooldownMs - (now - oldest)) / 1000))

    buckets.set(normalizedKey, active)
    return { ok: false, retryAfterSeconds }
  }

  active.push(now)
  buckets.set(normalizedKey, active)
  return { ok: true, retryAfterSeconds: 0 }
}
