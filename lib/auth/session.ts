import type { AccessDecisionReason } from "@/lib/access/decision"
import type { AccessStatusRow } from "@/lib/supabase/access-status"
import type { SupabaseAuthUser } from "@/lib/supabase/server"

type SessionSupabaseAuthUser = SupabaseAuthUser & {
  new_email?: string | null
  email_change?: string | null
  email_change_sent_at?: string | null
}

export interface AuthSessionUser {
  id: string
  email: string | null
  displayName: string
  provider: string | null
  emailConfirmedAt: string | null
  emailVerified: boolean
  hasPassword: boolean | null
  emailChangePending: string | null
}

export interface AuthSession {
  user: AuthSessionUser
  access?: {
    record: AccessStatusRow | null
    decision: {
      allowed: boolean
      mode: "full" | "read_only" | "blocked"
      reason: AccessDecisionReason
    }
  } | null
}

function pickFirstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  return null
}

export function getAuthDisplayName(
  user: Pick<SessionSupabaseAuthUser, "email" | "user_metadata">,
): string {
  const metadata = user.user_metadata ?? {}
  const candidate = pickFirstString(
    metadata.full_name,
    metadata.name,
    metadata.display_name,
    metadata.user_name,
  )

  if (candidate) {
    return candidate
  }

  if (typeof user.email === "string" && user.email.includes("@")) {
    return user.email.split("@")[0] || "Twoje konto"
  }

  return "Twoje konto"
}

export function getAuthProviders(user: Pick<SessionSupabaseAuthUser, "app_metadata">): string[] {
  const rawProviders = user.app_metadata?.providers

  if (!Array.isArray(rawProviders)) {
    return []
  }

  return rawProviders.filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  )
}

export function inferHasPassword(
  user: Pick<SessionSupabaseAuthUser, "app_metadata">,
  provider: string | null = null,
): boolean | null {
  const providers = getAuthProviders(user)

  if (providers.includes("email")) {
    return true
  }

  if (provider === "email" || provider === "email_password") {
    return true
  }

  if (providers.length === 0 && !provider) {
    return null
  }

  return false
}

export function inferEmailChangePending(
  user: Pick<SessionSupabaseAuthUser, "new_email" | "email_change" | "email_change_sent_at">,
): string | null {
  if (!user.email_change_sent_at) {
    return null
  }

  return pickFirstString(user.new_email, user.email_change)
}

export function mapSupabaseUserToSessionUser(
  user: SupabaseAuthUser,
  provider: string | null = null,
): AuthSessionUser {
  const sessionUser = user as SessionSupabaseAuthUser

  return {
    id: sessionUser.id,
    email: sessionUser.email ?? null,
    displayName: getAuthDisplayName(sessionUser),
    provider,
    emailConfirmedAt: sessionUser.email_confirmed_at ?? null,
    emailVerified: Boolean(sessionUser.email_confirmed_at),
    hasPassword: inferHasPassword(sessionUser, provider),
    emailChangePending: inferEmailChangePending(sessionUser),
  }
}
