"use client"

import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { postJson } from "@/lib/supabase/browser"

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    if (remainingSeconds <= 0) return

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => (current <= 1 ? 0 : current - 1))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [remainingSeconds])

  async function handleResend() {
    if (!email || remainingSeconds > 0) return

    setIsLoading(true)
    setError("")
    setMessage("")

    const result = await postJson<{ message?: string; error?: string }>("/api/auth/resend-confirmation", { email })

    setIsLoading(false)

    if (!result.ok) {
      setError(result.data.error || "Nie udało się ponowić wysyłki wiadomości.")
      return
    }

    setRemainingSeconds(60)
    setMessage(
      result.data.message || "Jeśli konto istnieje i wymaga potwierdzenia, wysłaliśmy kolejną wiadomość.",
    )
  }

  return (
    <AuthShell
      title="Sprawdź e-mail"
      subtitle="Dla kont zakładanych hasłem czekamy na potwierdzenie adresu e-mail przed pełnym wejściem do aplikacji."
      footer={
        <div style={{ display: "grid", gap: 8 }}>
          <Link href="/login">Wróć do logowania</Link>
          <Link href="/forgot-password">Masz konto, ale nie pamiętasz hasła?</Link>
        </div>
      }
    >
      <div style={{ display: "grid", gap: 10, color: "var(--muted)", lineHeight: 1.6 }}>
        <div>
          Jeśli konto jest nowe, wysłaliśmy wiadomość potwierdzającą
          {email ? ` na adres ${email}.` : "."}
        </div>
        <div>Po kliknięciu linku wrócisz do aplikacji i dokończysz logowanie.</div>
      </div>

      {message ? <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>{message}</div> : null}
      {error ? <div style={{ color: "#f87171", fontSize: 14, lineHeight: 1.5 }}>{error}</div> : null}

      <button
        type="button"
        onClick={handleResend}
        disabled={!email || isLoading || remainingSeconds > 0}
        style={{
          borderRadius: 12,
          border: "1px solid rgba(245,158,11,0.28)",
          background: "rgba(245,158,11,0.14)",
          color: "var(--accent)",
          padding: "12px 14px",
          fontWeight: 700,
        }}
      >
        {isLoading
          ? "Wysyłanie..."
          : remainingSeconds > 0
            ? `Wyślij ponownie za ${remainingSeconds}s`
            : "Wyślij ponownie link potwierdzający"}
      </button>
    </AuthShell>
  )
}

function CheckEmailFallback() {
  return (
    <AuthShell title="Sprawdź e-mail" subtitle="Ładuję dane potwierdzenia...">
      <div style={{ color: "var(--muted)" }}>Przygotowuję ekran potwierdzenia e-mail...</div>
    </AuthShell>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<CheckEmailFallback />}>
      <CheckEmailContent />
    </Suspense>
  )
}
