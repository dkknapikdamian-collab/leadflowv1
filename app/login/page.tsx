"use client"

import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { postJson } from "@/lib/supabase/browser"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/today"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [googleUrl, setGoogleUrl] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    const params = new URLSearchParams({ provider: "google", flow_type: "implicit", redirect_to: redirectTo })
    setGoogleUrl(`${base}/auth/v1/authorize?${params.toString()}`)
  }, [next])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await postJson<{ redirectTo?: string; error?: string }>("/api/auth/login", { email, password })
    setIsLoading(false)

    if (!result.ok) {
      setError(result.data.error || "Nie udało się zalogować.")
      return
    }

    router.replace(result.data.redirectTo || next)
    router.refresh()
  }

  return (
    <AuthShell
      title="Zaloguj się"
      subtitle="Wejdź przez Google albo e-mail i hasło. Dostęp zależy od statusu konta w bazie."
      footer={<p style={{ margin: 0, color: "var(--muted)" }}>Nie masz konta? <Link href="/signup">Załóż konto</Link></p>}
    >
      {googleUrl ? (
        <a href={googleUrl} style={{ display: "block", textAlign: "center", padding: 14, borderRadius: 12, border: "1px solid var(--border-light)", background: "transparent" }}>
          Kontynuuj przez Google
        </a>
      ) : null}

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
