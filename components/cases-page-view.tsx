"use client"

import { useMemo, useState } from "react"
import { ViewState } from "@/components/ui/view-state"
import { useAppStore } from "@/lib/store"
import {
  buildCasesDashboard,
  filterCaseCards,
  type CaseDashboardCard,
  type CaseFilterKey,
} from "@/lib/domain/cases-dashboard"
import type { Case, CaseItem } from "@/lib/types"
import { formatDateTime, normalizeSearchValue } from "@/lib/utils"

const CASE_FILTERS: Array<{ key: CaseFilterKey; label: string }> = [
  { key: "all", label: "Wszystkie" },
  { key: "waiting_for_client", label: "Czeka na klienta" },
  { key: "blocked", label: "Zablokowane" },
  { key: "ready_to_start", label: "Gotowe do startu" },
  { key: "overdue", label: "Przeterminowane" },
]

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="stat-card">
      <div className="muted-small uppercase">{label}</div>
      <div className="stat-value" style={color ? { color } : undefined}>{value}</div>
    </div>
  )
}

function CaseStatusBadge({ statusLabel, status }: { statusLabel: string; status: string }) {
  return <span className={`badge status-${status}`}>{statusLabel}</span>
}

function formatDueLabel(dueAt: string | null, isOverdue: boolean, dateOptions: { timeZone: string }) {
  if (!dueAt) return "Brak terminu"
  const prefix = isOverdue ? "Po terminie: " : "Termin: "
  return `${prefix}${formatDateTime(dueAt, dateOptions)}`
}

function CaseCard({
  card,
  dateOptions,
  onOpen,
}: {
  card: CaseDashboardCard
  dateOptions: { timeZone: string }
  onOpen: () => void
}) {
  return (
    <button type="button" className="lead-mobile-row" onClick={onOpen}>
      <div className="lead-mobile-top" style={{ alignItems: "flex-start" }}>
        <div className="lead-mobile-main">
          <div className="lead-mobile-text" style={{ width: "100%" }}>
            <div className="lead-name">{card.title}</div>
            <div className="lead-mobile-meta-line">
              <span>{card.clientName}</span>
              <span>•</span>
              <span>{card.typeLabel}</span>
            </div>
            <div className="lead-mobile-meta-line" style={{ marginTop: 6 }}>
              <span>{formatDueLabel(card.dueAt, card.isOverdue, dateOptions)}</span>
            </div>
            <div className="lead-mobile-meta-line" style={{ marginTop: 4 }}>
              <span>Kompletność: {card.completenessPercent}%</span>
              <span>•</span>
              <span>Braki: {card.missingElementsCount}</span>
            </div>
            <div className="lead-mobile-meta-line" style={{ marginTop: 4 }}>
              <span>Ostatnia aktywność: {formatDateTime(card.lastActivityAt, dateOptions)}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
          <CaseStatusBadge statusLabel={card.statusLabel} status={card.status} />
          {card.needsActionToday ? <span className="badge priority-high">Wymaga ruchu dziś</span> : null}
        </div>
      </div>
    </button>
  )
}

function CaseDetailDrawer({
  card,
  caseRecord,
  caseItems,
  onClose,
  dateOptions,
}: {
  card: CaseDashboardCard
  caseRecord: Case
  caseItems: CaseItem[]
  onClose: () => void
  dateOptions: { timeZone: string }
}) {
  const sortedItems = [...caseItems].sort((left, right) => left.sortOrder - right.sortOrder)

  return (
    <div className="drawer-backdrop" role="presentation">
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="Szczegóły sprawy">
        <div className="drawer-header">
          <div>
            <div className="drawer-title">{card.title}</div>
            <div className="muted-small">{card.clientName}</div>
          </div>
          <div className="drawer-actions wrap">
            <CaseStatusBadge statusLabel={card.statusLabel} status={card.status} />
            <button className="close-button" onClick={onClose} type="button" aria-label="Zamknij drawer">
              ×
            </button>
          </div>
        </div>

        <div className="drawer-content" style={{ display: "grid", gap: 12 }}>
          <section className="info-card" style={{ display: "grid", gap: 8 }}>
            <div className="info-row"><strong>Typ</strong><span>{card.typeLabel}</span></div>
            <div className="info-row"><strong>Status operacyjny</strong><span>{card.statusLabel}</span></div>
            <div className="info-row"><strong>Kompletność</strong><span>{card.completenessPercent}%</span></div>
            <div className="info-row"><strong>Brakujące elementy</strong><span>{card.missingElementsCount}</span></div>
            <div className="info-row"><strong>Stoi od</strong><span>{card.daysStuck} dni</span></div>
            <div className="info-row"><strong>Przypomnienie wysłane</strong><span>{card.reminderSent ? "Tak" : "Nie"}</span></div>
            <div className="info-row"><strong>Kolejny ruch</strong><span>{card.nextMove}</span></div>
            <div className="info-row"><strong>Termin</strong><span>{formatDueLabel(card.dueAt, card.isOverdue, dateOptions)}</span></div>
            <div className="info-row"><strong>Ostatnia aktywność</strong><span>{formatDateTime(card.lastActivityAt, dateOptions)}</span></div>
          </section>

          <section className="info-card" style={{ display: "grid", gap: 10 }}>
            <div className="drawer-title" style={{ fontSize: 18 }}>Elementy sprawy</div>
            {sortedItems.length === 0 ? <div className="empty-box">Brak elementów checklisty dla tej sprawy.</div> : null}
            {sortedItems.map((item) => (
              <div key={item.id} className="timeline-row">
                <div>
                  <div className="timeline-title">{item.title}</div>
                  <div className="muted-small">{item.required ? "Wymagane" : "Opcjonalne"}</div>
                </div>
                <span className={`badge status-${item.status}`}>{item.status}</span>
              </div>
            ))}
          </section>

          <section className="info-card" style={{ display: "grid", gap: 8 }}>
            <div className="info-row"><strong>ID sprawy</strong><span>{caseRecord.id}</span></div>
            <div className="info-row"><strong>Utworzona</strong><span>{formatDateTime(caseRecord.createdAt, dateOptions)}</span></div>
            <div className="info-row"><strong>Zaktualizowana</strong><span>{formatDateTime(caseRecord.updatedAt, dateOptions)}</span></div>
          </section>
        </div>
      </aside>
    </div>
  )
}

export function CasesPageView() {
  const { snapshot } = useAppStore()
  const [filter, setFilter] = useState<CaseFilterKey>("all")
  const [query, setQuery] = useState("")
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const dashboard = useMemo(() => buildCasesDashboard(snapshot, dateOptions), [dateOptions, snapshot])

  const normalizedQuery = normalizeSearchValue(query)
  const filteredCards = useMemo(() => {
    const byFilter = filterCaseCards(dashboard.cards, filter)
    if (!normalizedQuery) return byFilter
    return byFilter.filter((card) =>
      normalizeSearchValue(`${card.title} ${card.clientName} ${card.typeLabel} ${card.statusLabel}`).includes(normalizedQuery),
    )
  }, [dashboard.cards, filter, normalizedQuery])

  const selectedCaseCard = selectedCaseId ? dashboard.cards.find((entry) => entry.id === selectedCaseId) ?? null : null
  const selectedCase = selectedCaseId ? snapshot.cases?.find((entry) => entry.id === selectedCaseId) ?? null : null
  const selectedCaseItems = selectedCaseId ? (snapshot.caseItems ?? []).filter((item) => item.caseId === selectedCaseId) : []

  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Sprawy</h1>
          <p className="page-subtitle">Operacyjny obraz realizacji po sprzedaży: status, kompletność, blokery i kolejny ruch.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Sprawy aktywne" value={dashboard.stats.active} />
        <StatCard label="Czeka na klienta" value={dashboard.stats.waitingForClient} color="#d97706" />
        <StatCard label="Zablokowane" value={dashboard.stats.blocked} color="#dc2626" />
        <StatCard label="Gotowe do startu" value={dashboard.stats.readyToStart} color="#16a34a" />
      </div>

      <div className="panel-card large-card">
        <div className="toolbar-row wrap">
          <input
            className="text-input"
            placeholder="Szukaj po nazwie sprawy, kliencie, typie lub statusie..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select className="select-input" value={filter} onChange={(event) => setFilter(event.target.value as CaseFilterKey)}>
            {CASE_FILTERS.map((option) => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
        </div>

        <section style={{ marginBottom: 14, display: "grid", gap: 8 }}>
          <div className="muted-small uppercase">Wymagają ruchu dziś</div>
          {dashboard.needsActionToday.length === 0 ? (
            <div className="empty-box">Brak spraw wymagających ruchu dziś.</div>
          ) : (
            dashboard.needsActionToday.slice(0, 5).map((card) => (
              <button
                key={`today-${card.id}`}
                type="button"
                className="timeline-row"
                onClick={() => setSelectedCaseId(card.id)}
              >
                <div>
                  <div className="timeline-title">{card.title}</div>
                  <div className="muted-small">{card.clientName} • {card.nextMove}</div>
                </div>
                <span className="badge priority-high">Ruch dziś</span>
              </button>
            ))
          )}
        </section>

        <div className="stack-list">
          {filteredCards.length === 0 ? (
            <ViewState
              title={(snapshot.cases ?? []).length === 0 ? "Brak spraw operacyjnych." : "Brak spraw dla wybranego filtra."}
              description="Utwórz sprawę z karty leada w sekcji Start realizacji albo zmień filtr."
            />
          ) : null}
          {filteredCards.map((card) => (
            <CaseCard key={card.id} card={card} dateOptions={dateOptions} onOpen={() => setSelectedCaseId(card.id)} />
          ))}
        </div>
      </div>

      {selectedCaseCard && selectedCase ? (
        <CaseDetailDrawer
          card={selectedCaseCard}
          caseRecord={selectedCase}
          caseItems={selectedCaseItems}
          onClose={() => setSelectedCaseId(null)}
          dateOptions={dateOptions}
        />
      ) : null}
    </section>
  )
}
