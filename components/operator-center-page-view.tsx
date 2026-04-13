"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { buildCasesDashboard } from "@/lib/domain/cases-dashboard"
import { buildLeadProcessSurfaceSummaryMap } from "@/lib/domain/lead-process-surface"
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

function getLeadProcessStageLabel(stage: string) {
  switch (stage) {
    case "sales_attention":
      return "Sprzedaż wymaga ruchu"
    case "sales_scheduled":
      return "Sprzedaż ustawiona"
    case "ready_for_operations":
      return "Gotowy do operacji"
    case "in_operations":
      return "W operacjach"
    case "closed":
      return "Zamknięty"
    default:
      return stage
  }
}

export function OperatorCenterPageView() {
  const { snapshot } = useAppStore()
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])

  const leads = useMemo(() => buildLeadsWithComputedState(snapshot, dateOptions), [snapshot, dateOptions])
  const leadSummary = useMemo(() => buildLeadOwnerSummary(leads), [leads])
  const leadProcessSurfaceMap = useMemo(() => buildLeadProcessSurfaceSummaryMap(snapshot, dateOptions), [snapshot, dateOptions])

  const casesDashboard = useMemo(() => buildCasesDashboard(snapshot, dateOptions), [snapshot, dateOptions])
  const caseSummary = useMemo(() => buildCaseOwnerSummary(casesDashboard.cards), [casesDashboard.cards])

  const readyForOperationsCount = useMemo(
    () => Object.values(leadProcessSurfaceMap).filter((surface) => surface.stage === "ready_for_operations").length,
    [leadProcessSurfaceMap],
  )

  const alreadyInOperationsCount = useMemo(
    () => Object.values(leadProcessSurfaceMap).filter((surface) => surface.stage === "in_operations").length,
    [leadProcessSurfaceMap],
  )

  const topLeadMoves = useMemo(
    () =>
      leads
        .filter((lead) => {
          const surface = leadProcessSurfaceMap[lead.id]
          return Boolean(
            surface && (
              surface.stage === "sales_attention"
              || surface.stage === "ready_for_operations"
              || surface.stage === "in_operations"
            ),
          )
        })
        .sort((left, right) => {
          const leftSurface = leadProcessSurfaceMap[left.id]
          const rightSurface = leadProcessSurfaceMap[right.id]
          const leftWeight = leftSurface?.stage === "ready_for_operations" ? 3 : leftSurface?.stage === "sales_attention" ? 2 : leftSurface?.stage === "in_operations" ? 1 : 0
          const rightWeight = rightSurface?.stage === "ready_for_operations" ? 3 : rightSurface?.stage === "sales_attention" ? 2 : rightSurface?.stage === "in_operations" ? 1 : 0
          return rightWeight - leftWeight || right.computed.dailyPriorityScore - left.computed.dailyPriorityScore
        })
        .slice(0, 5),
    [leadProcessSurfaceMap, leads],
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
            Jedno miejsce do oceny: co wymaga ruchu teraz, co przechodzi z leadu do case i co już żyje operacyjnie.
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
          <MetricCard label="Gotowe do operacji" value={readyForOperationsCount} tone="success" />
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
          <MetricCard label="Leady już w operacjach" value={alreadyInOperationsCount} tone="success" />
        </div>
      </section>

      <section className="panel-card large-card" style={{ display: "grid", gap: 18 }}>
        <div className="drawer-title" style={{ fontSize: 18 }}>Top leady do ruchu</div>
        {topLeadMoves.length === 0 ? (
          <div className="empty-box">Brak alarmowych leadów.</div>
        ) : (
          <div className="stack-list">
            {topLeadMoves.map((lead) => {
              const surface = leadProcessSurfaceMap[lead.id]
              return (
                <div key={lead.id} className="timeline-row" style={{ alignItems: "flex-start" }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div className="timeline-title">{lead.name}</div>
                    <div className="muted-small">
                      {lead.company || lead.source} | {formatMoney(lead.value)}
                    </div>
                    <div className="muted-small">
                      Etap: {getLeadProcessStageLabel(surface?.stage ?? "sales_attention")}
                    </div>
                    <div className="muted-small">
                      {formatLeadAlarmReasonLabel(lead.computed.riskReason) || "Proces pod kontrolą"}
                    </div>
                    <div className="muted-small">
                      Następny ruch: {surface?.nextMoveLabel || lead.nextActionTitle || "Ustal next step"}
                    </div>
                    <div className="muted-small">
                      Otwarte: {surface?.openTaskCount ?? 0} | Overdue: {surface?.overdueTaskCount ?? 0} | Kalendarz: {surface?.calendarVisibleCount ?? 0}
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                    <LeadStatusBadge status={lead.status} />
                    <Link className="ghost-button small" href="/leads">
                      Otwórz leady
                    </Link>
                  </div>
                </div>
              )
            })}
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
