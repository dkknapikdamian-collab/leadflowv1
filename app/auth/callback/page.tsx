"use client"

import Link from "next/link"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { parseOAuthHash, postJson } from "@/lib/supabase/browser"

function AuthCallbackContent() {
  const searchParams = useSearchParams()
  const rawNext = searchParams.get("next") || "/today"
  const next = useMemo(() => (rawNext.startsWith("/") ? rawNext : "/today"), [rawNext])
  const [message, setMessage] = useState("Finalizing Google sign-in...")
  const [error, setError] = useState("")

  useEffect(() => {
    let isCancelled = false

    async function completeOAuth() {
      if (typeof window === "undefined") return

      const payload = parseOAuthHash(window.location.hash)
      if (payload.error) {
        if (!isCancelled) {
          setError("Google sign-in could not be completed. Try again.")
        }
        return
      }

      if (!payload.accessToken || !payload.refreshToken) {
        if (!isCancelled) {
          setError("Missing session data from Google sign-in. Try again.")
        }
        return
      }

      const result = await postJson<{ redirectTo?: string; error?: string }>("/api/auth/oauth-session", {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        provider: "google",
        next,
      })

      if (!result.ok) {
        if (!isCancelled) {
          setError(result.data.error || "Session could not be saved.")
        }
        return
      }

      if (!isCancelled) {
        setMessage("Session ready. Redirecting...")
        window.location.replace(result.data.redirectTo || next)
      }
    }

    void completeOAuth()

    return () => {
      isCancelled = true
    }
  }, [next])

  return (
    <AuthShell
      title="Kończenie logowania"
      subtitle="Domykam sesję po stronie aplikacji i przekierowuję dalej."
      footer={
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Problem z logowaniem? <Link href="/login">Wróć do logowania</Link>
        </p>
      }
    >
      <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>{message}</div>
      {error ? <div style={{ color: "#f87171", fontSize: 14, lineHeight: 1.5 }}>{error}</div> : null}
    </AuthShell>
  )
}

function AuthCallbackFallback() {
  return (
    <AuthShell title="Kończenie logowania" subtitle="Przygotowuję finalizację sesji...">
      <div style={{ color: "var(--muted)" }}>Ładuję dane powrotu z Google...</div>
    </AuthShell>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  )
}
