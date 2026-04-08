"use client"

import Link from "next/link"
import { useMemo } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { getAccountStatusPresentation, formatAccountStatusDate } from "@/lib/access/account-status"
import { useAppStore } from "@/lib/store"

function getToneClass(tone: ReturnType<typeof getAccountStatusPresentation>["tone"]) {
  if (tone === "success") return "tone-success"
  if (tone === "warning") return "tone-warning"
  if (tone === "danger") return "tone-danger"
  return "tone-neutral"
}

function BillingLinkButton({ label }: { label: string }) {
  return (
    <Link
      href="/billing"
      className="ghost-button button-link"
    >
      {label}
    </Link>
  )
}

export function AccountStatusBanner() {
  const { snapshot } = useAppStore()
  const status = useMemo(
    () => getAccountStatusPresentation(snapshot, { timeZone: snapshot.settings.timezone }),
    [snapshot],
  )
  const toneClass = getToneClass(status.tone)

  return (
    <section aria-label="Status konta" className={`tone-card account-status-banner ${toneClass}`}>
      <div className="tone-card-row">
        <div style={{ minWidth: 0 }}>
          <div className="tone-badge">{status.badgeLabel}</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, marginTop: 10 }}>{status.title}</div>
          <div className="page-subtitle">{status.description}</div>
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

function StatusInfoCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="billing-info-card">
      <div className="billing-info-label">{label}</div>
      <div className="billing-info-value">{value}</div>
      {detail ? <div className="billing-info-detail">{detail}</div> : null}
    </div>
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
  const toneClass = getToneClass(status.tone)

  return (
    <PageShell
      title="Rozliczenia"
      subtitle="Rozliczenie dotyczy calego systemu: Leady, Sprawy, Zadania, Kalendarz, Aktywność i portal klienta."
    >
      <div className={`tone-card ${toneClass}`} style={{ marginBottom: 16 }}>
        <div className="tone-badge" style={{ marginBottom: 12 }}>
          {status.badgeLabel}
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>{status.title}</div>
        <div className="page-subtitle">{status.description}</div>
        {status.isExpiringSoon ? (
          <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 700, marginTop: 12 }}>
            Uwaga: konto wymaga uwagi zawczasu, zanim dostęp zostanie zablokowany.
          </div>
        ) : null}
      </div>

      <div className="billing-info-grid">
        <StatusInfoCard label="Obecny status" value={status.badgeLabel} detail={status.description} />
        <StatusInfoCard label="Koniec triala" value={trialEndsLabel} detail="Ta data pokazuje, do kiedy trwa okres próbny." />
        <StatusInfoCard
          label="Koniec aktywnego dostępu"
          value={paidUntilLabel}
          detail="Ta data pokazuje, do kiedy konto jest aktywne po płatności albo do końca bieżącego okresu."
        />
      </div>

      <div className="panel-card large-card">
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Co to oznacza</div>
        <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          {status.isBlocked
            ? "Konto dziala w trybie podgladu: dane sa widoczne, ale normalna praca (tworzenie i edycja) jest zablokowana do czasu odnowienia dostepu."
            : "Konto ma pelny dostep do calego systemu. Sekcja billing ostrzega zawczasu, zanim dostep przejdzie w tryb podgladu."}
        </div>
        <div style={{ color: "var(--muted)", lineHeight: 1.6, marginTop: 10 }}>
          Polityka panelu klienta dla istniejacych spraw: link pozostaje aktywny do wygasniecia tokenu, ale przy zablokowanym koncie operatora panel dziala tylko w podgladzie.
        </div>
      </div>
    </PageShell>
  )
}
