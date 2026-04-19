const buckets = new Map<string, number[]>()

export type AuthRateLimitAction =
  | "signup"
  | "login"
  | "resend-confirmation"
  | "forgot-password"
  | "verify-token"

const config: Record<AuthRateLimitAction, { limit: number; windowMs: number; cooldownMs: number }> = {
  signup: { limit: 5, windowMs: 15 * 60 * 1000, cooldownMs: 60 * 1000 },
  login: { limit: 10, windowMs: 15 * 60 * 1000, cooldownMs: 30 * 1000 },
  "resend-confirmation": { limit: 3, windowMs: 15 * 60 * 1000, cooldownMs: 60 * 1000 },
  "forgot-password": { limit: 5, windowMs: 15 * 60 * 1000, cooldownMs: 60 * 1000 },
  "verify-token": { limit: 20, windowMs: 15 * 60 * 1000, cooldownMs: 15 * 1000 },
}

export type RateLimitResult = {
  ok: boolean
  retryAfterSeconds: number
}

export function checkAuthRateLimit(action: AuthRateLimitAction, key: string): RateLimitResult {
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
