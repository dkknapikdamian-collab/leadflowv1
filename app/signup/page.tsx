"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AuthShell } from "@/components/auth-shell"
import { postJson } from "@/lib/supabase/browser"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [googleUrl, setGoogleUrl] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/today")}`
    const params = new URLSearchParams({ provider: "google", flow_type: "implicit", redirect_to: redirectTo })
    setGoogleUrl(`${base}/auth/v1/authorize?${params.toString()}`)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await postJson<{ redirectTo?: string; error?: string }>("/api/auth/signup", { email, password })
    setIsLoading(false)

    if (!result.ok) {
      setError(result.data.error || "Nie udało się założyć konta.")
      return
    }

    router.replace(result.data.redirectTo || `/check-email?email=${encodeURIComponent(email)}`)
  }

  return (
    <AuthShell
      title="Załóż konto"
      subtitle="Google i e-mail z hasłem prowadzą do tego samego konta dla tego samego adresu e-mail."
      footer={<p style={{ margin: 0, color: "var(--muted)" }}>Masz już konto? <Link href="/login">Zaloguj się</Link></p>}
    >
      {googleUrl ? (
        <a href={googleUrl} className="secondary-button button-link block center">
          Zarejestruj się przez Google
        </a>
      ) : null}

      <form onSubmit={handleSubmit} className="auth-form">
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" className="text-input" />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Hasło" className="text-input" />
        {error ? <div className="danger-text">{error}</div> : null}
        <button type="submit" disabled={isLoading} className="primary-button">
          {isLoading ? "Tworzenie konta..." : "Załóż konto"}
        </button>
      </form>
    </AuthShell>
  )
}
