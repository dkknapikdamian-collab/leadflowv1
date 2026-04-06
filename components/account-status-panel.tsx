"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getAccountStatusPresentation, formatAccountStatusDate } from "@/lib/access/account-status"
import { useAppStore } from "@/lib/store"
import { postJson } from "@/lib/supabase/browser"

function getToneStyles(tone: ReturnType<typeof getAccountStatusPresentation>["tone"]) {
  if (tone === "success") {
    return {
      border: "1px solid rgba(74, 222, 128, 0.28)",
      background: "rgba(74, 222, 128, 0.08)",
      badgeBackground: "rgba(74, 222, 128, 0.14)",
      badgeColor: "#ccf7da",
      badgeBorder: "1px solid rgba(74, 222, 128, 0.25)",
    }
  }

  if (tone === "warning") {
    return {
      border: "1px solid rgba(245, 158, 11, 0.28)",
      background: "rgba(245, 158, 11, 0.08)",
      badgeBackground: "rgba(245, 158, 11, 0.14)",
      badgeColor: "#ffebb6",
      badgeBorder: "1px solid rgba(245, 158, 11, 0.25)",
    }
  }

  if (tone === "danger") {
    return {
      border: "1px solid rgba(248, 113, 113, 0.28)",
      background: "rgba(248, 113, 113, 0.08)",
      badgeBackground: "rgba(248, 113, 113, 0.14)",
      badgeColor: "#ffd5d5",
      badgeBorder: "1px solid rgba(248, 113, 113, 0.25)",
    }
  }

  return {
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(255, 255, 255, 0.03)",
    badgeBackground: "rgba(255, 255, 255, 0.06)",
    badgeColor: "#d9d4cc",
    badgeBorder: "1px solid rgba(255, 255, 255, 0.08)",
  }
}

function BillingLinkButton({ label }: { label: string }) {
  return (
    <Link
      href="/billing"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 40,
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.12)",
        color: "var(--text)",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Link>
  )
}

function StatusInfoCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 16,
        background: "var(--card)",
        padding: 16,
      }}
    >
      <div style={{ color: "var(--muted)", fontSize: 12, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: detail ? 8 : 0 }}>{value}</div>
      {detail ? <div style={{ color: "var(--muted)", lineHeight: 1.45 }}>{detail}</div> : null}
    </div>
  )
}

function RedeemCodeCard() {
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
      effectType?: string | null
    }>("/api/access/redeem-code", {
      code: trimmedCode,
    })

    if (!result.ok) {
      setError(result.data.error || "Nie udało się aktywować kodu.")
      setIsSubmitting(false)
      return
    }

    setSuccess(
      result.data.effectType === "paid_access_until_date"
        ? "Kod aktywował płatny dostęp. Odświeżam billing..."
        : "Kod został aktywowany. Odświeżam billing...",
    )
    setCode("")
    setIsSubmitting(false)
    window.location.assign("/billing?code_redeemed=1")
    router.refresh()
  }

  return (
    <div className="panel-card large-card">
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Masz kod dostępu?</div>
      <div style={{ color: "var(--muted)", lineHeight: 1.6, marginBottom: 12 }}>
        Jeśli dostałeś kod testowy albo specjalny dostęp, możesz aktywować go także tutaj, bez czekania na ekran blokady.
      </div>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
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
      </form>
      {error ? <div style={{ color: "#f87171", fontSize: 14, marginTop: 10 }}>{error}</div> : null}
      {success ? <div style={{ color: "#4ade80", fontSize: 14, marginTop: 10 }}>{success}</div> : null}
    </div>
  )
}

export function AccountStatusBanner() {
  const { snapshot } = useAppStore()
  const status = useMemo(
    () => getAccountStatusPresentation(snapshot, { timeZone: snapshot.settings.timezone }),
    [snapshot],
  )
  const tone = getToneStyles(status.tone)

  return (
    <section
      aria-label="Status konta"
      style={{
        margin: "16px 16px 0",
        padding: 16,
        borderRadius: 16,
        border: tone.border,
        background: tone.background,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 28,
              padding: "4px 10px",
              borderRadius: 999,
              background: tone.badgeBackground,
              color: tone.badgeColor,
              border: tone.badgeBorder,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            {status.badgeLabel}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{status.title}</div>
          <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>{status.description}</div>
          {status.primaryDateLabel ? (
            <div style={{ color: "var(--text)", marginTop: 10, fontSize: 13, fontWeight: 700 }}>
              {status.primaryDateLabel}
            </div>
          ) : null}
          {status.secondaryDateLabel ? (
            <div style={{ color: "var(--muted)", marginTop: 4, fontSize: 13 }}>{status.secondaryDateLabel}</div>
          ) : null}
        </div>
        <BillingLinkButton label={status.ctaLabel} />
      </div>
    </section>
  )
}

export function BillingStatusPageView() {
  const { snapshot } = useAppStore()
  const status = useMemo(
    () => getAccountStatusPresentation(snapshot, { timeZone: snapshot.settings.timezone }),
    [snapshot],
  )
  const trialEndsLabel = formatAccountStatusDate(snapshot.billing.trialEndsAt, snapshot.settings.timezone)
  const paidUntilLabel = formatAccountStatusDate(snapshot.billing.renewAt, snapshot.settings.timezone)
  const overrideUntilLabel = formatAccountStatusDate(snapshot.context.accessOverrideExpiresAt, snapshot.settings.timezone)
  const tone = getToneStyles(status.tone)

  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Billing</h1>
          <p className="page-subtitle">Tutaj użytkownik ma zawsze widzieć stan konta, trial i aktywny okres dostępu.</p>
        </div>
      </div>

      <div
        style={{
          borderRadius: 18,
          border: tone.border,
          background: tone.background,
          padding: 18,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 30,
            padding: "4px 10px",
            borderRadius: 999,
            background: tone.badgeBackground,
            color: tone.badgeColor,
            border: tone.badgeBorder,
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          {status.badgeLabel}
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>{status.title}</div>
        <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>{status.description}</div>
        {status.isExpiringSoon ? (
          <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 700, marginTop: 12 }}>
            Uwaga: konto wymaga uwagi zawczasu, zanim dostęp zostanie zablokowany.
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <StatusInfoCard label="Obecny status" value={status.badgeLabel} detail={status.description} />
        <StatusInfoCard label="Koniec triala" value={trialEndsLabel} detail="Ta data pokazuje, do kiedy trwa okres próbny zwykłego użytkownika." />
        <StatusInfoCard
          label="Koniec aktywnego dostępu"
          value={snapshot.context.accessOverrideMode ? overrideUntilLabel : paidUntilLabel}
          detail={
            snapshot.context.accessOverrideMode
              ? snapshot.context.accessOverrideExpiresAt
                ? "Ta data pokazuje, do kiedy działa override testowy."
                : "To konto ma aktywny override bez limitu czasu."
              : "Ta data pokazuje, do kiedy konto jest aktywne po płatności albo do końca bieżącego okresu."
          }
        />
      </div>

      <div className="panel-card large-card">
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Co to oznacza</div>
        <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          {status.isBlocked
            ? "Konto nie ma teraz pełnego dostępu do normalnej pracy w aplikacji. Dane nadal zostają, ale trzeba wejść w billing i przywrócić dostęp."
            : snapshot.context.accessOverrideMode === "admin_unlimited"
              ? "To konto działa z administracyjnym bypass'em i nie wpada w zwykły trial ani blokadę płatności."
              : snapshot.context.accessOverrideMode === "tester_unlimited"
                ? "To konto działa z override testowym. Zwykła logika triala i blokady płatności nie wyłącza teraz dostępu, dopóki override jest aktywny."
                : "Konto ma aktywny dostęp. Jeśli trial albo plan zbliża się do końca, ta sekcja pokazuje to wcześniej, a nie dopiero po blokadzie."}
        </div>
      </div>

      <RedeemCodeCard />
    </section>
  )
}
