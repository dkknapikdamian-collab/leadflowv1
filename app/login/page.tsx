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
      subtitle="Nowa skórka systemu operatora. Wejdź przez Google albo e-mail i hasło."
      footer={<p style={{ margin: 0, color: "var(--muted)" }}>Nie masz konta? <Link href="/signup">Załóż konto</Link></p>}
    >
      <a href={googleUrl} className="secondary-button button-link block center">
        Kontynuuj przez Google
      </a>

      <form onSubmit={handleSubmit} className="auth-form">
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" className="text-input" />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Hasło" className="text-input" />
        {error ? <div className="danger-text">{error}</div> : null}
        <button type="submit" disabled={isLoading} className="primary-button">
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
      <div className="muted-small">Przygotowuję formularz logowania...</div>
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
