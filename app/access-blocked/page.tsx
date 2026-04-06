"use client"

import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"

function getBlockedCopy(reason: string | null) {
  switch (reason) {
    case "trial-expired":
      return {
        title: "Trial wygasł",
        subtitle: "Twój okres testowy się skończył. Opłać plan, żeby wrócić do pracy.",
      }
    case "plan-expired":
      return {
        title: "Plan wygasł",
        subtitle: "Dostęp do aplikacji wygasł. Opłać plan, żeby odzyskać normalny dostęp.",
      }
    case "payment-failed":
      return {
        title: "Płatność nie powiodła się",
        subtitle: "Dostęp został zablokowany do czasu naprawienia płatności.",
      }
    case "canceled":
      return {
        title: "Plan jest nieaktywny",
        subtitle: "Subskrypcja nie daje już dostępu do pracy w aplikacji. Opłać plan, żeby wrócić.",
      }
    default:
      return {
        title: "Dostęp zablokowany",
        subtitle: "To konto jest zalogowane, ale nie ma teraz aktywnego dostępu do pracy w aplikacji.",
      }
  }
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
        Logowanie samo w sobie nie daje pełnego dostępu. Aplikacja sprawdza centralnie status triala albo planu w bazie i dopiero wtedy wpuszcza do pracy.
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
