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
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nowe hasło"
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid var(--border-light)",
            background: "#111",
            color: "var(--text)",
            padding: "12px 14px",
          }}
        />
        <input
          type="password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          placeholder="Powtórz hasło"
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
          {isLoading ? "Zapisywanie..." : "Ustaw nowe hasło"}
        </button>
      </form>
    </AuthShell>
  )
}
