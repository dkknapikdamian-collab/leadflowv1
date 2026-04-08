"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { postJson } from "@/lib/supabase/browser"

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
      subtitle="Wejdź do swojego panelu i pilnuj ruchu sprzedażowego bez chaosu."
      footer={
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ margin: 0, color: "var(--muted)" }}>Nie masz jeszcze konta?</div>
          <Link href="/signup" className="auth-link-button">
            Załóż konto
          </Link>
        </div>
      }
    >
      <a href={googleUrl} className="auth-link-button">
        Kontynuuj przez Google
      </a>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-mail"
          className="text-input"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Hasło"
          className="text-input"
        />
        {error ? <div style={{ color: "#dc2626", fontSize: 14 }}>{error}</div> : null}
        <button type="submit" disabled={isLoading} className="auth-primary-button">
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>

      <Link href="/forgot-password" className="auth-muted-link">
        Nie pamiętasz hasła?
      </Link>
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
