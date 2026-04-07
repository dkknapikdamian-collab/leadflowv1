"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { postJson } from "@/lib/supabase/browser"

const authLinkStyle = {
  display: "block",
  textAlign: "center" as const,
  padding: 14,
  borderRadius: 12,
  border: "1px solid var(--border-light)",
  background: "transparent",
}

const accentLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(245,158,11,0.28)",
  background: "rgba(245,158,11,0.14)",
  color: "var(--accent)",
  textDecoration: "none",
  fontWeight: 700,
}

function LoginPageContent() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/today"
  const googleUrl = `/api/auth/oauth-start?next=${encodeURIComponent(next)}`
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await postJson<{ redirectTo?: string; error?: string }>("/api/auth/login", {
      email,
      password,
      next,
    })
    setIsLoading(false)

    if (!result.ok) {
      setError(result.data.error || "Nie udało się zalogować.")
      return
    }

    window.location.replace(result.data.redirectTo || next)
  }

  return (
    <AuthShell
      title="Zaloguj się"
      subtitle="Wejdź do swojego panelu."
      footer={
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ margin: 0, color: "var(--muted)" }}>Nie masz jeszcze konta?</div>
          <Link href="/signup" style={accentLinkStyle}>
            Załóż konto
          </Link>
        </div>
      }
    >
      <a href={googleUrl} style={authLinkStyle}>
        Kontynuuj przez Google
      </a>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border-light)", background: "#111", color: "var(--text)", padding: "12px 14px" }} />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Hasło" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border-light)", background: "#111", color: "var(--text)", padding: "12px 14px" }} />
        {error ? <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div> : null}
        <button type="submit" disabled={isLoading} style={{ borderRadius: 12, border: "1px solid rgba(245,158,11,0.28)", background: "rgba(245,158,11,0.14)", color: "var(--accent)", padding: "12px 14px", fontWeight: 700 }}>
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>

      <Link href="/forgot-password">Nie pamiętasz hasła?</Link>
    </AuthShell>
  )
}

function LoginPageFallback() {
  return (
    <AuthShell title="Zaloguj się" subtitle="Ładowanie formularza logowania...">
      <div style={{ color: "var(--muted)" }}>Przygotowuję formularz logowania...</div>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}
