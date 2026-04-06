import type { SupabaseAuthUser } from "@/lib/supabase/server"

export interface AuthSessionUser {
  id: string
  email: string | null
  displayName: string
  provider: string | null
  emailConfirmedAt: string | null
}

export interface AuthSession {
  user: AuthSessionUser
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
  user: Pick<SupabaseAuthUser, "email" | "user_metadata">,
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

export function mapSupabaseUserToSessionUser(
  user: SupabaseAuthUser,
  provider: string | null = null,
): AuthSessionUser {
  return {
    id: user.id,
    email: user.email ?? null,
    displayName: getAuthDisplayName(user),
    provider,
    emailConfirmedAt: user.email_confirmed_at ?? null,
  }
}
