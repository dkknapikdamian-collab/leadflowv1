"use client"

import Link from "next/link"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { parseOAuthHash, postJson } from "@/lib/supabase/browser"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawNext = searchParams.get("next") || "/today"
  const next = useMemo(() => (rawNext.startsWith("/") ? rawNext : "/today"), [rawNext])
  const [message, setMessage] = useState("Kończę logowanie przez Google...")
  const [error, setError] = useState("")

  useEffect(() => {
    let isCancelled = false

    async function completeOAuth() {
      if (typeof window === "undefined") return

      const hashPayload = parseOAuthHash(window.location.hash)
      if (hashPayload.error) {
        if (!isCancelled) {
          setError("Nie udało się dokończyć logowania przez Google. Spróbuj ponownie.")
        }
        return
      }

      if (!hashPayload.accessToken || !hashPayload.refreshToken) {
        if (!isCancelled) {
          setError("Brakuje danych sesji z logowania Google. Spróbuj ponownie.")
        }
        return
      }

      const result = await postJson<{ redirectTo?: string; error?: string }>("/api/auth/oauth-session", {
        accessToken: hashPayload.accessToken,
        refreshToken: hashPayload.refreshToken,
        provider: "google",
      })

      if (!result.ok) {
        if (!isCancelled) {
          setError(result.data.error || "Nie udało się zapisać sesji logowania.")
        }
        return
      }

      if (!isCancelled) {
        setMessage("Sesja gotowa. Przekierowuję do aplikacji...")
        router.replace(next)
        router.refresh()
      }
    }

    void completeOAuth()

    return () => {
      isCancelled = true
    }
  }, [next, router])

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
