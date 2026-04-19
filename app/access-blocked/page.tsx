"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { postJson } from "@/lib/supabase/browser"

function getBlockedCopy(reason: string | null) {
  switch (reason) {
    case "trial-expired":
      return {
        title: "Trial wygasł",
        subtitle: "Twój okres testowy się skończył. Opłać plan albo użyj kodu dostępowego, jeśli masz dostęp testowy.",
      }
    case "plan-expired":
      return {
        title: "Plan wygasł",
        subtitle: "Dostęp do aplikacji wygasł. Opłać plan albo użyj kodu dostępowego, jeśli został Ci przyznany.",
      }
    case "payment-failed":
      return {
        title: "Płatność nie powiodła się",
        subtitle: "Dostęp został zablokowany do czasu naprawienia płatności. Jeśli masz osobny dostęp testowy, możesz aktywować go kodem.",
      }
    case "canceled":
      return {
        title: "Plan jest nieaktywny",
        subtitle: "Subskrypcja nie daje już dostępu do pracy w aplikacji. Opłać plan albo użyj ważnego kodu dostępowego.",
      }
    default:
      return {
        title: "Dostęp zablokowany",
        subtitle: "To konto jest zalogowane, ale nie ma teraz aktywnego dostępu do pracy w aplikacji.",
      }
  }
}

function AccessCodeCard() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedCode = code.trim()
    if (!trimmedCode) {
      setError("Wpisz kod dostępu.")
      setSuccess("")
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    const result = await postJson<{
      ok?: boolean
      error?: string
      accessOverrideMode?: string | null
      accessOverrideExpiresAt?: string | null
    }>("/api/access/redeem-code", {
      code: trimmedCode,
    })

    if (!result.ok) {
      setError(result.data.error || "Nie udało się aktywować kodu.")
      setIsSubmitting(false)
      return
    }

    setSuccess("Kod został aktywowany. Przekierowuję do aplikacji...")
    setCode("")
    setIsSubmitting(false)
    router.replace("/today")
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 10,
        padding: 14,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700 }}>Masz kod dostępu?</div>
      <div style={{ color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>
        Jeśli dostałeś specjalny dostęp testowy, wpisz kod poniżej. Po poprawnej aktywacji aplikacja odblokuje konto centralnie po stronie backendu.
      </div>
      <input
        value={code}
        onChange={(event) => setCode(event.target.value.toUpperCase())}
        placeholder="Wpisz kod dostępu"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        disabled={isSubmitting}
        style={{
          width: "100%",
          minHeight: 44,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.14)",
          color: "var(--text)",
          padding: "0 12px",
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          minHeight: 44,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "var(--text)",
          fontWeight: 700,
          cursor: isSubmitting ? "default" : "pointer",
        }}
      >
        {isSubmitting ? "Aktywuję kod..." : "Aktywuj kod"}
      </button>
      {error ? <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div> : null}
      {success ? <div style={{ color: "#4ade80", fontSize: 14 }}>{success}</div> : null}
    </form>
  )
}

function AccessBlockedContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")
  const copy = getBlockedCopy(reason)

  return (
    <AuthShell
      title={copy.title}
      subtitle={copy.subtitle}
      footer={
        <div style={{ display: "grid", gap: 8 }}>
          <Link href="/billing">Przejdź do billing</Link>
          <Link href="/today">Spróbuj ponownie</Link>
        </div>
      }
    >
      <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
        Logowanie samo w sobie nie daje pełnego dostępu. Aplikacja sprawdza centralnie status triala, planu albo override dostępu w bazie i dopiero wtedy wpuszcza do pracy.
      </div>
      <Link
        href="/billing"
        style={{
          display: "block",
          textAlign: "center",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(245,158,11,0.28)",
          background: "rgba(245,158,11,0.14)",
          color: "var(--accent)",
          fontWeight: 700,
        }}
      >
        Opłać, żeby wrócić
      </Link>
      <AccessCodeCard />
    </AuthShell>
  )
}

function AccessBlockedFallback() {
  return (
    <AuthShell title="Dostęp zablokowany" subtitle="Sprawdzam status dostępu...">
      <div style={{ color: "var(--muted)" }}>Ładuję dane blokady dostępu...</div>
    </AuthShell>
  )
}

export default function AccessBlockedPage() {
  return (
    <Suspense fallback={<AccessBlockedFallback />}>
      <AccessBlockedContent />
    </Suspense>
  )
}
