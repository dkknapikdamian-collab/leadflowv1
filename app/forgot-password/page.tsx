"use client"

import Link from "next/link"
import { type FormEvent, useState } from "react"
import { AuthShell } from "@/components/auth-shell"
import { postJson } from "@/lib/supabase/browser"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    const result = await postJson<{ message?: string; error?: string }>("/api/auth/forgot-password", {
      email,
    })

    setIsLoading(false)

    if (!result.ok) {
      setError(result.data.error || "Nie udało się wysłać instrukcji resetu.")
      return
    }

    setMessage(
      result.data.message || "Jeśli konto istnieje, wysłaliśmy wiadomość z instrukcją resetu hasła.",
    )
  }

  return (
    <AuthShell
      title="Reset hasła"
      subtitle="Podaj e-mail. Jeśli konto istnieje, wyślemy link do ustawienia nowego hasła."
      footer={<p style={{ margin: 0, color: "var(--muted)" }}>Pamiętasz hasło? <Link href="/login">Wróć do logowania</Link></p>}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" className="text-input" />
        {message ? <div className="muted-small">{message}</div> : null}
        {error ? <div className="danger-text">{error}</div> : null}
        <button type="submit" disabled={isLoading} className="primary-button">
          {isLoading ? "Wysyłanie..." : "Wyślij link resetu"}
        </button>
      </form>
    </AuthShell>
  )
}
