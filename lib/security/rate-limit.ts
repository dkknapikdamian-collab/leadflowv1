const buckets = new Map<string, number[]>()

export type SecurityRateLimitAction =
  | "public-portal-open"
  | "public-upload"
  | "public-acceptance"
  | "reminder-trigger"

const config: Record<SecurityRateLimitAction, { limit: number; windowMs: number; cooldownMs: number }> = {
  "public-portal-open": { limit: 25, windowMs: 15 * 60 * 1000, cooldownMs: 60 * 1000 },
  "public-upload": { limit: 10, windowMs: 15 * 60 * 1000, cooldownMs: 90 * 1000 },
  "public-acceptance": { limit: 30, windowMs: 15 * 60 * 1000, cooldownMs: 30 * 1000 },
  "reminder-trigger": { limit: 12, windowMs: 10 * 60 * 1000, cooldownMs: 60 * 1000 },
}

export type SecurityRateLimitResult = {
  ok: boolean
  retryAfterSeconds: number
}

export function checkSecurityRateLimit(action: SecurityRateLimitAction, key: string): SecurityRateLimitResult {
  const now = Date.now()
  const normalizedKey = `${action}:${key.trim().toLowerCase()}`
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
