"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { buildCasesDashboard } from "@/lib/domain/cases-dashboard"
import {
  buildLeadsWithComputedState,
  formatLeadAlarmReasonLabel,
} from "@/lib/domain/lead-state"
import {
  buildCaseOwnerSummary,
  buildLeadOwnerSummary,
} from "@/lib/domain/owner-view-summary"
import { formatDateTime, formatMoney, getStatusLabel } from "@/lib/utils"

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: "default" | "danger" | "warning" | "success"
}) {
  const color =
    tone === "danger"
      ? "#b91c1c"
      : tone === "warning"
        ? "#b45309"
        : tone === "success"
          ? "#15803d"
          : undefined

  return (
    <div className="stat-card">
      <div className="muted-small uppercase">{label}</div>
      <div className="stat-value" style={color ? { color } : undefined}>
        {value}
      </div>
    </div>
  )
}

function CaseStatusBadge({ status, label }: { status: string; label: string }) {
  return <span className={`badge status-${status}`}>{label}</span>
}

function LeadStatusBadge({ status }: { status: string }) {
  return <span className={`badge status-${status}`}>{getStatusLabel(status as never)}</span>
}

export function OperatorCenterPageView() {
  const { snapshot } = useAppStore()
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])

  const leads = useMemo(() => buildLeadsWithComputedState(snapshot, dateOptions), [snapshot, dateOptions])
  const leadSummary = useMemo(() => buildLeadOwnerSummary(leads), [leads])

  const casesDashboard = useMemo(() => buildCasesDashboard(snapshot, dateOptions), [snapshot, dateOptions])
  const caseSummary = useMemo(() => buildCaseOwnerSummary(casesDashboard.cards), [casesDashboard.cards])

  const topLeadMoves = useMemo(
    () =>
      leads
        .filter((lead) => lead.computed.dailyPriorityScore > 0 || lead.computed.isAtRisk || !lead.computed.hasNextStep)
        .sort((left, right) => right.computed.dailyPriorityScore - left.computed.dailyPriorityScore)
        .slice(0, 5),
    [leads],
  )

  const topCaseMoves = useMemo(
    () =>
      [...casesDashboard.cards]
        .filter((card) => card.needsActionToday || card.status === "blocked" || card.status === "ready_to_start")
        .sort((left, right) => {
          const leftWeight = left.status === "blocked" ? 3 : left.needsActionToday ? 2 : left.status === "ready_to_start" ? 1 : 0
          const rightWeight = right.status === "blocked" ? 3 : right.needsActionToday ? 2 : right.status === "ready_to_start" ? 1 : 0
          return rightWeight - leftWeight || right.daysStuck - left.daysStuck
        })
        .slice(0, 5),
    [casesDashboard.cards],
  )

  return (
    <section className="single-column-page">
      <div className="hero-row split">
        <div>
          <h1 className="page-title">Operator Center</h1>
          <p className="page-subtitle">
            Jedno miejsce do oceny: co wymaga ruchu teraz, co jest zagrożone i co jest gotowe do ruszenia.
          </p>
        </div>
        <div className="drawer-actions wrap">
          <Link className="ghost-button" href="/today">
            Dzisiaj
          </Link>
          <Link className="ghost-button" href="/leads">
            Leady
          </Link>
          <Link className="ghost-button" href="/cases">
            Sprawy
          </Link>
        </div>
      </div>

      <section className="panel-card large-card" style={{ display: "grid", gap: 18 }}>
        <div>
          <div className="drawer-title" style={{ fontSize: 18 }}>Sprzedaż</div>
          <div className="muted-small">Spójne liczniki leadów wymagających decyzji operatora.</div>
        </div>
        <div className="stats-grid">
          <MetricCard label="Wszystkie leady" value={leadSummary.total} />
          <MetricCard label="Wymagają uwagi" value={leadSummary.needsAttention} tone="danger" />
          <MetricCard label="Brak next stepu" value={leadSummary.missingNextStep} tone="warning" />
          <MetricCard label="Overdue next step" value={leadSummary.overdueNextStep} tone="danger" />
          <MetricCard label="Waiting too long" value={leadSummary.waitingTooLong} tone="warning" />
          <MetricCard label="High priority" value={leadSummary.highPriority} tone="success" />
        </div>
      </section>

      <section className="panel-card large-card" style={{ display: "grid", gap: 18 }}>
        <div>
          <div className="drawer-title" style={{ fontSize: 18 }}>Operacje</div>
          <div className="muted-small">Sprawy, które dziś pchają albo blokują cały proces.</div>
        </div>
        <div className="stats-grid">
          <MetricCard label="Sprawy aktywne" value={caseSummary.total} />
          <MetricCard label="Wymaga ruchu dziś" value={caseSummary.needsActionToday} tone="danger" />
          <MetricCard label="Czeka na klienta" value={caseSummary.waitingForClient} tone="warning" />
          <MetricCard label="Zablokowane" value={caseSummary.blocked} tone="danger" />
          <MetricCard label="Gotowe do startu" value={caseSummary.readyToStart} tone="success" />
          <MetricCard label="Po terminie" value={caseSummary.overdue} tone="danger" />
        </div>
      </section>

      <section className="panel-card large-card" style={{ display: "grid", gap: 18 }}>
        <div className="drawer-title" style={{ fontSize: 18 }}>Top leady do ruchu</div>
        {topLeadMoves.length === 0 ? (
          <div className="empty-box">Brak alarmowych leadów.</div>
        ) : (
          <div className="stack-list">
            {topLeadMoves.map((lead) => (
              <div key={lead.id} className="timeline-row" style={{ alignItems: "flex-start" }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div className="timeline-title">{lead.name}</div>
                  <div className="muted-small">
                    {lead.company || lead.source} | {formatMoney(lead.value)}
                  </div>
                  <div className="muted-small">
                    {formatLeadAlarmReasonLabel(lead.computed.riskReason) || "Najwyższy priorytet dnia"}
                  </div>
                  <div className="muted-small">
                    Next step: {lead.nextActionTitle || "Brak"} | Score: {lead.computed.dailyPriorityScore}
                  </div>
                </div>
                <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                  <LeadStatusBadge status={lead.status} />
                  <Link className="ghost-button small" href="/leads">
                    Otwórz leady
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel-card large-card" style={{ display: "grid", gap: 18 }}>
        <div className="drawer-title" style={{ fontSize: 18 }}>Top sprawy do ruchu</div>
        {topCaseMoves.length === 0 ? (
          <div className="empty-box">Brak spraw wymagających ruchu.</div>
        ) : (
          <div className="stack-list">
            {topCaseMoves.map((card) => (
              <div key={card.id} className="timeline-row" style={{ alignItems: "flex-start" }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div className="timeline-title">{card.title}</div>
                  <div className="muted-small">
                    {card.clientName} | {card.typeLabel}
                  </div>
                  <div className="muted-small">
                    {card.nextMove}
                  </div>
                  <div className="muted-small">
                    Ostatnia aktywność: {formatDateTime(card.lastActivityAt, dateOptions)}
                  </div>
                </div>
                <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                  <CaseStatusBadge status={card.status} label={card.statusLabel} />
                  <Link className="ghost-button small" href="/cases">
                    Otwórz sprawy
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
