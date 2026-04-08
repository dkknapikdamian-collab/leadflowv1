"use client"

import Link from "next/link"
import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { postJson } from "@/lib/supabase/browser"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    const result = await postJson<{ message?: string; redirectTo?: string; error?: string }>(
      "/api/auth/update-password",
      {
        password,
        passwordConfirm,
      },
    )

    setIsLoading(false)

    if (!result.ok) {
      setError(result.data.error || "Nie udało się ustawić nowego hasła.")
      return
    }

    setMessage(result.data.message || "Hasło zostało ustawione.")
    router.replace(result.data.redirectTo || "/today")
    router.refresh()
  }

  return (
    <AuthShell
      title="Ustaw nowe hasło"
      subtitle="Ten ekran działa po wejściu z poprawnego linku resetu albo w aktywnej sesji użytkownika."
      footer={
        <div style={{ display: "grid", gap: 8 }}>
          <Link href="/login">Wróć do logowania</Link>
          <Link href="/forgot-password">Potrzebujesz nowego linku resetu?</Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nowe hasło" className="text-input" />
        <input type="password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} placeholder="Powtórz hasło" className="text-input" />
        {message ? <div className="muted-small">{message}</div> : null}
        {error ? <div className="danger-text">{error}</div> : null}
        <button type="submit" disabled={isLoading} className="primary-button">
          {isLoading ? "Zapisywanie..." : "Ustaw nowe hasło"}
        </button>
      </form>
    </AuthShell>
  )
}
