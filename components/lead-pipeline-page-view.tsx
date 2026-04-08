"use client"

import { useMemo } from "react"
import { LEAD_STATUS_OPTIONS } from "@/lib/constants"
import { buildLeadsWithComputedState, formatLeadAlarmReasonLabel } from "@/lib/domain/lead-state"
import { useAppStore } from "@/lib/store"
import type { LeadStatus } from "@/lib/types"
import { formatMoney, formatRelativeDateTimeShort } from "@/lib/utils"

const PIPELINE_ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "qualification",
  "offer_sent",
  "follow_up",
  "won",
  "lost",
]

const STATUS_LABEL_MAP = Object.fromEntries(LEAD_STATUS_OPTIONS.map((option) => [option.value, option.label])) as Record<LeadStatus, string>

function sortPipelineLeads<T extends { value: number; name: string; computed: { isAtRisk: boolean; dailyPriorityScore: number } }>(leads: T[]) {
  return [...leads].sort((left, right) => {
    return (
      Number(right.computed.isAtRisk) - Number(left.computed.isAtRisk) ||
      right.computed.dailyPriorityScore - left.computed.dailyPriorityScore ||
      right.value - left.value ||
      left.name.localeCompare(right.name, "pl")
    )
  })
}

function PipelineLeadCard({
  lead,
  onMoveTo,
}: {
  lead: ReturnType<typeof buildLeadsWithComputedState>[number]
  onMoveTo: (nextStatus: LeadStatus) => void
}) {
  const currentIndex = PIPELINE_ORDER.indexOf(lead.status)
  const previousStatus = currentIndex > 0 ? PIPELINE_ORDER[currentIndex - 1] : null
  const nextStatus = currentIndex < PIPELINE_ORDER.length - 1 ? PIPELINE_ORDER[currentIndex + 1] : null
  const riskLabel = formatLeadAlarmReasonLabel(lead.computed.riskReason) || (lead.computed.isAtRisk ? "Lead zagrożony" : "Stabilny")

  return (
    <article
      className="lead-mobile-row"
      style={{
        borderRadius: 16,
        gap: 12,
      }}
    >
      <div className="lead-mobile-top">
        <div className="lead-mobile-main">
          <div className="avatar">{lead.name.slice(0, 2).toUpperCase()}</div>
          <div className="lead-mobile-text">
            <div className="lead-name">{lead.name}</div>
            <div className="lead-mobile-meta-line">
              <span>{lead.company || lead.source}</span>
              <span>•</span>
              <span>{formatMoney(lead.value)}</span>
            </div>
          </div>
        </div>
        <span className={`badge status-${lead.status}`}>{STATUS_LABEL_MAP[lead.status]}</span>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div className="muted-small uppercase">Powód</div>
        <div style={{ fontWeight: 700, lineHeight: 1.4 }}>{riskLabel}</div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div className="muted-small uppercase">Następny krok</div>
        <div style={{ fontWeight: 700, lineHeight: 1.4 }}>{lead.nextActionTitle || "Brak next step"}</div>
        <div className="muted-small">
          {lead.computed.nextStepAt ? formatRelativeDateTimeShort(lead.computed.nextStepAt, { timeZone: "Europe/Warsaw" }) : "Bez terminu"}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div className="lead-mobile-meta-line">
          <span>Priorytet dnia: {lead.computed.dailyPriorityScore}</span>
          <span>•</span>
          <span>{lead.computed.openActionsCount} aktywne</span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="ghost-button small"
            onClick={() => previousStatus && onMoveTo(previousStatus)}
            disabled={!previousStatus}
          >
            ← Wstecz
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => nextStatus && onMoveTo(nextStatus)}
            disabled={!nextStatus}
            style={{ minHeight: 36, padding: "8px 12px" }}
          >
            Dalej →
          </button>
          <select
            className="select-input"
            value={lead.status}
            onChange={(event) => onMoveTo(event.target.value as LeadStatus)}
            style={{ minWidth: 170, maxWidth: 220 }}
          >
            {LEAD_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </article>
  )
}

export function LeadPipelinePageView() {
  const { snapshot, updateLead } = useAppStore()
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const leads = useMemo(() => buildLeadsWithComputedState(snapshot, dateOptions), [dateOptions, snapshot])

  const columns = useMemo(
    () =>
      PIPELINE_ORDER.map((status) => {
        const statusLeads = sortPipelineLeads(leads.filter((lead) => lead.status === status))
        return {
          status,
          title: STATUS_LABEL_MAP[status],
          count: statusLeads.length,
          valueSum: statusLeads.reduce((sum, lead) => sum + lead.value, 0),
          atRiskCount: statusLeads.filter((lead) => lead.computed.isAtRisk).length,
          leads: statusLeads,
        }
      }),
    [leads],
  )

  const activeLeads = leads.filter((lead) => lead.status !== "won" && lead.status !== "lost")
  const activeAtRiskCount = activeLeads.filter((lead) => lead.computed.isAtRisk).length
  const missingNextStepCount = activeLeads.filter((lead) => !lead.computed.hasNextStep).length
  const wonValue = leads.filter((lead) => lead.status === "won").reduce((sum, lead) => sum + lead.value, 0)

  function handleMoveLead(leadId: string, nextStatus: LeadStatus) {
    updateLead(leadId, { status: nextStatus })
  }

  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Pipeline</h1>
          <p className="page-subtitle">
            Szybki obraz procesu sprzedaży bez ciężkiego CRM-a. Widzisz statusy, wartość i leady zagrożone, a zmianę statusu robisz od razu z kolumny.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="muted-small uppercase">Aktywne leady</div>
          <div className="stat-value">{activeLeads.length}</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Zagrożone</div>
          <div className="stat-value">{activeAtRiskCount}</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Bez next step</div>
          <div className="stat-value">{missingNextStepCount}</div>
        </div>
        <div className="stat-card">
          <div className="muted-small uppercase">Wartość wygranych</div>
          <div className="stat-value">{formatMoney(wonValue)}</div>
        </div>
      </div>

      <div className="panel-card large-card" style={{ overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(280px, 1fr))",
            gap: 16,
            alignItems: "start",
            minWidth: 2040,
          }}
        >
          {columns.map((column) => (
            <section
              key={column.status}
              style={{
                display: "grid",
                gap: 12,
                alignContent: "start",
                minWidth: 0,
              }}
            >
              <div className="info-card" style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <strong>{column.title}</strong>
                  <span className={`badge status-${column.status}`}>{column.count}</span>
                </div>
                <div className="muted-small">Wartość: {formatMoney(column.valueSum)}</div>
                <div className="muted-small">Zagrożone: {column.atRiskCount}</div>
              </div>

              <div className="stack-list">
                {column.leads.length === 0 ? <div className="empty-box">Brak leadów w tym statusie.</div> : null}
                {column.leads.map((lead) => (
                  <PipelineLeadCard key={lead.id} lead={lead} onMoveTo={(nextStatus) => handleMoveLead(lead.id, nextStatus)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
