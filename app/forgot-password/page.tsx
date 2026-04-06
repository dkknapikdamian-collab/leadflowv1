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
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-mail"
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid var(--border-light)",
            background: "#111",
            color: "var(--text)",
            padding: "12px 14px",
          }}
        />
        {message ? <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>{message}</div> : null}
        {error ? <div style={{ color: "#f87171", fontSize: 14, lineHeight: 1.5 }}>{error}</div> : null}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            borderRadius: 12,
            border: "1px solid rgba(245,158,11,0.28)",
            background: "rgba(245,158,11,0.14)",
            color: "var(--accent)",
            padding: "12px 14px",
            fontWeight: 700,
          }}
        >
          {isLoading ? "Wysyłanie..." : "Wyślij link resetu"}
        </button>
      </form>
    </AuthShell>
  )
}
