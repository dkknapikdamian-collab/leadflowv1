"use client"

import { useMemo, useState } from "react"
import { ViewState } from "@/components/ui/view-state"
import { CASE_CHECKLIST_STATUS_OPTIONS, CASE_OPERATIONAL_STATUS_OPTIONS } from "@/lib/constants"
import { useAppStore } from "@/lib/store"
import {
  buildCasesDashboard,
  filterCaseCards,
  type CaseDashboardCard,
  type CaseFilterKey,
} from "@/lib/domain/cases-dashboard"
import type { ActivityLogEntry, Case, CaseItem, CaseItemStatus, CaseStatus } from "@/lib/types"
import { formatDateTime, normalizeSearchValue, nowIso } from "@/lib/utils"

const CASE_FILTERS: Array<{ key: CaseFilterKey; label: string }> = [
  { key: "all", label: "Wszystkie" },
  { key: "waiting_for_client", label: "Czeka na klienta" },
  { key: "blocked", label: "Zablokowane" },
  { key: "ready_to_start", label: "Gotowe do startu" },
  { key: "overdue", label: "Przeterminowane" },
]

const DONE_STATUSES = new Set<CaseItemStatus>(["accepted", "not_applicable"])

const KIND_LABELS: Record<CaseItem["kind"], string> = {
  task: "Zadanie",
  checklist: "Checklista",
  milestone: "Kamien milowy",
  document: "Dokument",
  approval: "Akceptacja",
  file: "Plik",
  decision: "Decyzja",
  response: "Odpowiedz",
  access: "Dostep",
}

const STATUS_LABELS = CASE_CHECKLIST_STATUS_OPTIONS.reduce<Record<CaseItemStatus, string>>((map, option) => {
  map[option.value] = option.label
  return map
}, {} as Record<CaseItemStatus, string>)

const OPERATIONAL_STATUS_LABELS = CASE_OPERATIONAL_STATUS_OPTIONS.reduce<Record<CaseStatus, string>>((map, option) => {
  map[option.value] = option.label
  return map
}, {} as Record<CaseStatus, string>)

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

function isPendingItem(item: CaseItem) {
  return !DONE_STATUSES.has(item.status)
}

function detectBlockers(caseRecord: Case, items: CaseItem[]) {
  const lower = (value: string) => value.trim().toLowerCase()
  const hasPendingByMatcher = (matcher: (title: string, item: CaseItem) => boolean) =>
    items.some((item) => item.required && isPendingItem(item) && matcher(lower(item.title), item))

  const blockers = [
    {
      key: "logo",
      title: "Brak logo",
      active: hasPendingByMatcher((title) => title.includes("logo")),
    },
    {
      key: "access",
      title: "Brak dostepu",
      active: caseRecord.status === "blocked" || hasPendingByMatcher((title) => title.includes("dostep") || title.includes("login")),
    },
    {
      key: "variant",
      title: "Brak akceptacji wariantu",
      active: hasPendingByMatcher((title, item) => item.kind === "approval" || title.includes("akcept")),
    },
    {
      key: "signature",
      title: "Brak podpisu",
      active: hasPendingByMatcher((title) => title.includes("podpis") || title.includes("umow")),
    },
    {
      key: "brief",
      title: "Brak briefu",
      active: hasPendingByMatcher((title) => title.includes("brief")),
    },
  ]

  if (blockers.some((entry) => entry.active)) return blockers

  return blockers.map((entry, index) => ({
    ...entry,
    active: index === 0 && items.some((item) => item.required && isPendingItem(item)),
  }))
}

type ActivityPoint = {
  id: string
  label: string
  event: ActivityLogEntry | null
  fallback: string
}

function getLastActivityByMatcher(entries: ActivityLogEntry[], matcher: (entry: ActivityLogEntry) => boolean) {
  return entries.find(matcher) ?? null
}

function buildRecentActivityPoints(entries: ActivityLogEntry[]): ActivityPoint[] {
  return [
    {
      id: "request_sent",
      label: "Wyslano prosbe",
      event: getLastActivityByMatcher(entries, (entry) =>
        entry.type === "approval_requested" ||
        (entry.type === "case_item_updated" && String(entry.payload?.status ?? "") === "request_sent"),
      ),
      fallback: "Brak wyslanej prosby",
    },
    {
      id: "client_file_uploaded",
      label: "Klient dodal plik",
      event: getLastActivityByMatcher(entries, (entry) => entry.type === "file_uploaded"),
      fallback: "Brak nowego pliku od klienta",
    },
    {
      id: "client_accepted",
      label: "Klient zaakceptowal",
      event: getLastActivityByMatcher(entries, (entry) => entry.type === "approval_decision"),
      fallback: "Brak potwierdzonej akceptacji",
    },
    {
      id: "client_no_response",
      label: "Klient nie odpowiedzial",
      event: getLastActivityByMatcher(entries, (entry) => entry.type === "reminder_triggered"),
      fallback: "Brak sygnalu o braku odpowiedzi",
    },
    {
      id: "system_reminder",
      label: "System wyslal przypomnienie",
      event: getLastActivityByMatcher(entries, (entry) =>
        entry.type === "notification_sent" || entry.type === "reminder_triggered",
      ),
      fallback: "System nie wysylal przypomnien",
    },
  ]
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
              <span>|</span>
              <span>{card.typeLabel}</span>
            </div>
            <div className="lead-mobile-meta-line" style={{ marginTop: 6 }}>
              <span>{formatDueLabel(card.dueAt, card.isOverdue, dateOptions)}</span>
            </div>
            <div className="lead-mobile-meta-line" style={{ marginTop: 4 }}>
              <span>Kompletnosc: {card.completenessPercent}%</span>
              <span>|</span>
              <span>Braki: {card.missingElementsCount}</span>
            </div>
            <div className="lead-mobile-meta-line" style={{ marginTop: 4 }}>
              <span>Ostatnia aktywnosc: {formatDateTime(card.lastActivityAt, dateOptions)}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
          <CaseStatusBadge statusLabel={card.statusLabel} status={card.status} />
          {card.needsActionToday ? <span className="badge priority-high">Wymaga ruchu dzis</span> : null}
        </div>
      </div>
    </button>
  )
}

function CaseDetailDrawer({
  card,
  caseRecord,
  caseItems,
  recentEntries,
  onClose,
  dateOptions,
  onUpdateCase,
  onUpdateCaseItem,
  onAppendCaseActivity,
  onAddManualNote,
  onRevokeClientLink,
  clientPortalLink,
}: {
  card: CaseDashboardCard
  caseRecord: Case
  caseItems: CaseItem[]
  recentEntries: ActivityLogEntry[]
  onClose: () => void
  dateOptions: { timeZone: string }
  onUpdateCase: (caseId: string, patch: Partial<Case>) => void
  onUpdateCaseItem: (caseItemId: string, patch: Partial<CaseItem>) => void
  onAppendCaseActivity: (
    caseId: string,
    activityType: ActivityLogEntry["type"],
    source?: "sales" | "operations" | "system",
    payload?: Record<string, unknown>,
    caseItemId?: string | null,
  ) => void
  onAddManualNote: (note: string) => void
  onRevokeClientLink: (caseId: string) => void
  clientPortalLink: string
}) {
  const sortedItems = [...caseItems].sort((left, right) => left.sortOrder - right.sortOrder)
  const blockers = detectBlockers(caseRecord, sortedItems)
  const recentPoints = buildRecentActivityPoints(recentEntries)
  const [caseStatusDraft, setCaseStatusDraft] = useState<CaseStatus>(caseRecord.status)
  const [manualNote, setManualNote] = useState("")
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  const conflictingStatus =
    (caseRecord.status === "ready_to_start" || caseRecord.status === "in_progress" || caseRecord.status === "closed") &&
    card.missingElementsCount > 0

  const requiredPending = sortedItems.filter((item) => item.required && isPendingItem(item))

  const handleSendReminder = () => {
    if (requiredPending.length > 0) {
      const firstPending = requiredPending[0]
      onUpdateCaseItem(firstPending.id, { status: "request_sent" })
      onAppendCaseActivity(caseRecord.id, "case_item_updated", "system", { status: "request_sent" }, firstPending.id)
    }
    onUpdateCase(caseRecord.id, { status: "waiting_for_client" })
    onAppendCaseActivity(caseRecord.id, "reminder_triggered", "system", {
      note: "Przypomnienie wyslane z panelu szybkich akcji.",
    })
    setActionFeedback("Przypomnienie zostalo wyslane i sprawa przestawiona na 'Czeka na klienta'.")
  }

  const handleCopyClientLink = async () => {
    try {
      await navigator.clipboard.writeText(clientPortalLink)
      setActionFeedback("Link klienta skopiowany do schowka.")
    } catch {
      setActionFeedback(`Skopiuj recznie: ${clientPortalLink}`)
    }
  }

  const handleMarkAsVerified = () => {
    const toVerify = sortedItems.filter((item) => item.status === "under_review" || item.status === "delivered")
    toVerify.forEach((item) => {
      onUpdateCaseItem(item.id, { status: "accepted" })
      onAppendCaseActivity(caseRecord.id, "case_item_completed", "operations", { status: "accepted" }, item.id)
    })

    onUpdateCase(caseRecord.id, { status: "ready_to_start" })
    onAppendCaseActivity(caseRecord.id, "approval_decision", "operations", {
      decision: "accepted",
      source: "quick_action_panel",
    })

    setActionFeedback("Elementy do weryfikacji oznaczone jako zaakceptowane.")
  }

  const handleBlockByMissingRequired = () => {
    if (requiredPending.length === 0) {
      setActionFeedback("Brak aktywnych brakow obowiazkowych.")
      return
    }

    onUpdateCase(caseRecord.id, { status: "blocked" })
    onAppendCaseActivity(caseRecord.id, "case_status_changed", "operations", {
      status: "blocked",
      reason: "missing_required_items",
      missingRequiredCount: requiredPending.length,
    })
    setActionFeedback("Sprawa zablokowana do czasu uzupelnienia elementow obowiazkowych.")
  }

  const handleApplyStatus = () => {
    onUpdateCase(caseRecord.id, { status: caseStatusDraft })
    onAppendCaseActivity(caseRecord.id, "case_status_changed", "operations", { status: caseStatusDraft })
    setActionFeedback(`Status operacyjny zmieniony na: ${OPERATIONAL_STATUS_LABELS[caseStatusDraft]}.`)
  }

  const handleAddManualNote = () => {
    const normalized = manualNote.trim()
    if (!normalized) {
      setActionFeedback("Wpisz tresc notatki.")
      return
    }

    onAddManualNote(normalized)
    onAppendCaseActivity(caseRecord.id, "case_updated", "operations", {
      note: normalized,
      source: "manual_note",
    })
    setManualNote("")
    setActionFeedback("Dodano reczna notatke.")
  }

  return (
    <div className="drawer-backdrop" role="presentation">
      <aside className="drawer-panel case-detail-drawer" role="dialog" aria-modal="true" aria-label="Szczegoly sprawy">
        <div className="drawer-header">
          <div>
            <div className="drawer-title">{card.title}</div>
            <div className="muted-small">{card.clientName}</div>
          </div>
          <div className="drawer-actions wrap">
            <CaseStatusBadge statusLabel={card.statusLabel} status={card.status} />
            <button className="close-button" onClick={onClose} type="button" aria-label="Zamknij drawer">
              x
            </button>
          </div>
        </div>

        <div className="drawer-content case-detail-body">
          <section className="info-card case-detail-summary">
            <div className="info-row"><strong>Klient</strong><span>{card.clientName}</span></div>
            <div className="info-row"><strong>Typ uslugi</strong><span>{card.typeLabel}</span></div>
            <div className="info-row"><strong>Status sprzedazowy</strong><span>Wygrany</span></div>
            <div className="info-row"><strong>Status operacyjny</strong><span>{card.statusLabel}</span></div>
            <div className="info-row"><strong>Flaga blokady</strong><span>{caseRecord.blockedByMissingRequired ? "Aktywna" : "Brak"}</span></div>
            <div className="info-row"><strong>Kompletnosc</strong><span>{card.completenessPercent}%</span></div>
            <div className="info-row"><strong>Brakujace elementy</strong><span>{card.missingElementsCount}</span></div>
            <div className="info-row"><strong>Czekamy na klienta</strong><span>{card.daysStuck} dni</span></div>
            <div className="info-row"><strong>Kolejny ruch</strong><span>{card.nextMove}</span></div>
            {conflictingStatus ? (
              <div className="danger-text">
                Uwaga: status operacyjny i kompletnosc sa niespojne. Sprawa ma braki, a status jest zaawansowany.
              </div>
            ) : null}
          </section>

          <section className="info-card case-detail-checklist">
            <div className="drawer-title" style={{ fontSize: 18 }}>Lista wymaganych rzeczy</div>
            {sortedItems.length === 0 ? <div className="empty-box">Brak elementow checklisty dla tej sprawy.</div> : null}
            {sortedItems.map((item) => (
              <div key={item.id} className="case-checklist-row">
                <div className="case-checklist-main">
                  <div className="timeline-title">{item.title}</div>
                  <div className="muted-small">
                    {KIND_LABELS[item.kind]} | {item.required ? "Wymagane" : "Opcjonalne"}
                  </div>
                  <div className="muted-small">
                    Termin: {item.dueAt ? formatDateTime(item.dueAt, dateOptions) : "Brak terminu"} | Odpowiedzialny: {item.ownerUserId ? "Przypisany" : "Operator"}
                  </div>
                </div>
                <div className="case-checklist-actions">
                  <select
                    className="select-input"
                    value={item.status}
                    onChange={(event) => {
                      const nextStatus = event.target.value as CaseItemStatus
                      onUpdateCaseItem(item.id, { status: nextStatus })
                      onAppendCaseActivity(caseRecord.id, "case_item_updated", "operations", { status: nextStatus }, item.id)
                    }}
                  >
                    {CASE_CHECKLIST_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="ghost-button small"
                    disabled={item.status === "accepted"}
                    onClick={() => {
                      onUpdateCaseItem(item.id, { status: "accepted" })
                      onAppendCaseActivity(caseRecord.id, "case_item_completed", "operations", { status: "accepted" }, item.id)
                    }}
                  >
                    {item.status === "accepted" ? "Zweryfikowane" : "Oznacz jako zweryfikowane"}
                  </button>
                  <button
                    type="button"
                    className="ghost-button small"
                    disabled={item.status === "needs_correction"}
                    onClick={() => {
                      onUpdateCaseItem(item.id, { status: "needs_correction" })
                      onAppendCaseActivity(caseRecord.id, "case_item_updated", "operations", { status: "needs_correction" }, item.id)
                    }}
                  >
                    {item.status === "needs_correction" ? "Odeslane do poprawy" : "Odeslij do poprawy"}
                  </button>
                  <span className={`badge status-${item.status}`}>{STATUS_LABELS[item.status]}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="info-card case-detail-activity">
            <div className="drawer-title" style={{ fontSize: 18 }}>Ostatnie aktywnosci</div>
            {recentPoints.map((point) => (
              <div key={point.id} className="timeline-row">
                <div>
                  <div className="timeline-title">{point.label}</div>
                  <div className="muted-small">
                    {point.event ? formatDateTime(point.event.createdAt, dateOptions) : point.fallback}
                  </div>
                </div>
                <span className={`badge ${point.event ? "status-won" : "status-not_started"}`}>
                  {point.event ? "Jest wpis" : "Brak wpisu"}
                </span>
              </div>
            ))}
          </section>

          <section className="info-card case-detail-blockers">
            <div className="drawer-title" style={{ fontSize: 18 }}>Blokery</div>
            {blockers.map((blocker) => (
              <div key={blocker.key} className="timeline-row">
                <div className="timeline-title">{blocker.title}</div>
                <span className={`badge ${blocker.active ? "status-blocked" : "status-won"}`}>
                  {blocker.active ? "Aktywny" : "Brak"}
                </span>
              </div>
            ))}
          </section>

          <aside className="info-card case-detail-quick-actions">
            <div className="drawer-title" style={{ fontSize: 18 }}>Szybkie akcje</div>
            <button type="button" className="ghost-button" onClick={handleSendReminder}>Wyslij przypomnienie</button>
            <button type="button" className="ghost-button" onClick={() => void handleCopyClientLink()}>Skopiuj link klienta</button>
            <button
              type="button"
              className="danger-button"
              onClick={() => {
                onRevokeClientLink(caseRecord.id)
                setActionFeedback("Dostep klienta został odwołany.")
              }}
            >
              Odwołaj dostep
            </button>
            <button type="button" className="ghost-button" onClick={handleMarkAsVerified}>Oznacz jako zweryfikowane</button>
            <button type="button" className="danger-button" onClick={handleBlockByMissingRequired}>Zablokuj przez braki</button>
            <div className="field-block">
              <span>Zmien status sprawy</span>
              <select
                className="select-input"
                value={caseStatusDraft}
                onChange={(event) => setCaseStatusDraft(event.target.value as CaseStatus)}
              >
                {CASE_OPERATIONAL_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button type="button" className="ghost-button small" onClick={handleApplyStatus}>Zastosuj status</button>
            </div>
            <div className="field-block">
              <span>Dodaj reczna notatke</span>
              <textarea
                className="text-area"
                value={manualNote}
                placeholder="Krotka notatka operacyjna..."
                onChange={(event) => setManualNote(event.target.value)}
              />
              <button type="button" className="ghost-button small" onClick={handleAddManualNote}>Zapisz notatke</button>
            </div>
            {actionFeedback ? <div className="muted-small">{actionFeedback}</div> : null}
            <div className="muted-small">Termin: {formatDueLabel(card.dueAt, card.isOverdue, dateOptions)}</div>
          </aside>
        </div>
      </aside>
    </div>
  )
}

export function CasesPageView() {
  const {
    snapshot,
    addItem,
    appendCaseActivity,
    revokeClientPortalToken,
    updateCase,
    updateCaseItem,
  } = useAppStore()
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
  const selectedCaseActivity = selectedCaseId
    ? (snapshot.activityLog ?? [])
        .filter((entry) => entry.caseId === selectedCaseId)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    : []

  const selectedPortalToken = selectedCaseId
    ? (snapshot.clientPortalTokens ?? []).find((token) => token.caseId === selectedCaseId && !token.revokedAt)
    : null

  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Sprawy</h1>
          <p className="page-subtitle">Operacyjny obraz realizacji po sprzedazy: status, kompletnosc, blokery i kolejny ruch.</p>
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
          <div className="muted-small uppercase">Wymagaja ruchu dzis</div>
          {dashboard.needsActionToday.length === 0 ? (
            <div className="empty-box">Brak spraw wymagajacych ruchu dzis.</div>
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
                  <div className="muted-small">{card.clientName} | {card.nextMove}</div>
                </div>
                <span className="badge priority-high">Ruch dzis</span>
              </button>
            ))
          )}
        </section>

        <div className="stack-list">
          {filteredCards.length === 0 ? (
            <ViewState
              title={(snapshot.cases ?? []).length === 0 ? "Brak spraw operacyjnych." : "Brak spraw dla wybranego filtra."}
              description="Utworz sprawe z karty leada w sekcji Start realizacji albo zmien filtr."
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
          recentEntries={selectedCaseActivity}
          onClose={() => setSelectedCaseId(null)}
          dateOptions={dateOptions}
          onUpdateCase={updateCase}
          onUpdateCaseItem={updateCaseItem}
          onAppendCaseActivity={appendCaseActivity}
          onAddManualNote={(note) => {
            addItem({
              leadId: selectedCase.sourceLeadId ?? null,
              leadLabel: selectedCaseCard.clientName,
              recordType: "note",
              type: "note",
              title: `Notatka do sprawy: ${selectedCase.title}`,
              description: note,
              status: "todo",
              priority: "medium",
              scheduledAt: nowIso(),
              startAt: "",
              endAt: "",
              recurrence: "none",
              reminder: "none",
              showInTasks: false,
              showInCalendar: false,
            })
          }}
          onRevokeClientLink={revokeClientPortalToken}
          clientPortalLink={
            selectedPortalToken
              ? `https://clientpilot.app/portal/${selectedPortalToken.tokenHash}`
              : `https://clientpilot.app/portal?case=${selectedCase.id}`
          }
        />
      ) : null}
    </section>
  )
}
