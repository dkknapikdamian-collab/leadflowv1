"use client"

import Link from "next/link"
import { useMemo } from "react"
import { getAccountStatusPresentation, formatAccountStatusDate } from "@/lib/access/account-status"
import { resolveSnapshotAccessPolicy } from "@/lib/access/policy"
import { useAppStore } from "@/lib/store"

function getToneStyles(tone: ReturnType<typeof getAccountStatusPresentation>["tone"]) {
  if (tone === "success") {
    return {
      border: "1px solid rgba(34, 197, 94, 0.20)",
      background: "rgba(34, 197, 94, 0.08)",
      badgeBackground: "rgba(34, 197, 94, 0.12)",
      badgeColor: "#15803d",
      badgeBorder: "1px solid rgba(34, 197, 94, 0.20)",
    }
  }

  if (tone === "warning") {
    return {
      border: "1px solid rgba(245, 158, 11, 0.24)",
      background: "rgba(245, 158, 11, 0.08)",
      badgeBackground: "rgba(245, 158, 11, 0.12)",
      badgeColor: "#b45309",
      badgeBorder: "1px solid rgba(245, 158, 11, 0.20)",
    }
  }

  if (tone === "danger") {
    return {
      border: "1px solid rgba(239, 68, 68, 0.24)",
      background: "rgba(239, 68, 68, 0.08)",
      badgeBackground: "rgba(239, 68, 68, 0.12)",
      badgeColor: "#b91c1c",
      badgeBorder: "1px solid rgba(239, 68, 68, 0.20)",
    }
  }

  return {
    border: "1px solid var(--border)",
    background: "var(--card)",
    badgeBackground: "color-mix(in srgb, var(--card-hover) 86%, transparent)",
    badgeColor: "var(--muted)",
    badgeBorder: "1px solid var(--border)",
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
        minHeight: 36,
        padding: "8px 12px",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--card)",
        color: "var(--text)",
        textDecoration: "none",
        whiteSpace: "nowrap",
        fontWeight: 700,
        fontSize: 13,
      }}
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
  const tone = getToneStyles(status.tone)

  return (
    <section
      aria-label="Status konta"
      style={{
        margin: "10px 16px 0",
        padding: 12,
        borderRadius: 16,
        border: tone.border,
        background: tone.background,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 260px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 24,
              padding: "3px 9px",
              borderRadius: 999,
              background: tone.badgeBackground,
              color: tone.badgeColor,
              border: tone.badgeBorder,
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {status.badgeLabel}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: "var(--text)" }}>{status.title}</div>
          <div style={{ color: "var(--muted)", lineHeight: 1.45, fontSize: 13 }}>{status.description}</div>
          {status.primaryDateLabel ? (
            <div style={{ color: "var(--text)", marginTop: 8, fontSize: 12, fontWeight: 700 }}>
              {status.primaryDateLabel}
            </div>
          ) : null}
          {status.secondaryDateLabel ? (
            <div style={{ color: "var(--muted)", marginTop: 3, fontSize: 12 }}>{status.secondaryDateLabel}</div>
          ) : null}
        </div>
        <BillingLinkButton label={status.ctaLabel} />
      </div>
    </section>
  )
}

function StatusInfoCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 16,
        background: "var(--card)",
        color: "var(--text)",
        padding: 16,
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04), 0 10px 28px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div style={{ color: "var(--muted)", fontSize: 12, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: detail ? 8 : 0, color: "var(--text)" }}>{value}</div>
      {detail ? <div style={{ color: "var(--muted)", lineHeight: 1.45 }}>{detail}</div> : null}
    </div>
  )
}

export function BillingStatusPageView() {
  const { snapshot } = useAppStore()
  const status = useMemo(
    () => getAccountStatusPresentation(snapshot, { timeZone: snapshot.settings.timezone }),
    [snapshot],
  )
  const accessPolicy = useMemo(() => resolveSnapshotAccessPolicy(snapshot), [snapshot])
  const trialEndsLabel = formatAccountStatusDate(snapshot.billing.trialEndsAt, snapshot.settings.timezone)
  const paidUntilLabel = formatAccountStatusDate(snapshot.billing.renewAt, snapshot.settings.timezone)
  const tone = getToneStyles(status.tone)
  const portalPolicyLabel =
    accessPolicy.clientPortalPolicy === "active"
      ? "Panel klienta jest aktywny dla istniejących spraw."
      : accessPolicy.clientPortalPolicy === "read_only"
        ? "Panel klienta pozostaje widoczny dla istniejących spraw, ale akcje klienta są wstrzymane do czasu odnowienia dostępu."
        : "Panel klienta jest wyłączony do czasu przywrócenia dostępu."

  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Rozliczenia</h1>
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
        <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>{status.title}</div>
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
        <StatusInfoCard label="Koniec triala" value={trialEndsLabel} detail="Ta data pokazuje, do kiedy trwa okres próbny." />
        <StatusInfoCard
          label="Koniec aktywnego dostępu"
          value={paidUntilLabel}
          detail="Ta data pokazuje, do kiedy konto jest aktywne po płatności albo do końca bieżącego okresu."
        />
      </div>

      <div className="panel-card large-card">
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "var(--text)" }}>Co to oznacza</div>
        <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          {status.isBlocked
            ? "Konto nie ma teraz pełnego dostępu do normalnej pracy w aplikacji. Dane nadal zostają, ale trzeba wejść w billing i przywrócić dostęp."
            : "Konto ma aktywny dostęp. Jeśli trial albo plan zbliża się do końca, ta sekcja pokazuje to wcześniej, a nie dopiero po blokadzie."}
        </div>
      </div>

      <div className="panel-card large-card">
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "var(--text)" }}>Zakres planu</div>
        <div style={{ color: "var(--muted)", lineHeight: 1.6, marginBottom: 10 }}>
          Billing obejmuje cały system: leady, sprawy, szablony, zadania i portal klienta.
        </div>
        <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          {accessPolicy.canWork
            ? "Konto ma tryb pełnej pracy: możesz normalnie tworzyć i prowadzić leady oraz sprawy."
            : "Konto działa w trybie podglądu danych: widzisz historię i stan pracy, ale nie tworzysz nowych leadów ani nowych spraw do czasu odnowienia dostępu."}
        </div>
        <div style={{ color: "var(--muted)", lineHeight: 1.6, marginTop: 8 }}>{portalPolicyLabel}</div>
      </div>
    </section>
  )
}
