"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ItemModal, LeadDrawer } from "@/components/views"
import { useAppStore } from "@/lib/store"
import {
  formatLeadAlarmReasonLabel,
  type LeadWithComputedState,
} from "@/lib/domain/lead-state"
import { buildTodayViewModel, type TodaySectionKey, type TodayTopStat } from "@/lib/today"
import type { Lead, WorkItem, WorkItemInput } from "@/lib/types"
import {
  formatRelativeDateTimeShort,
  getItemPrimaryDate,
  getItemTypeMeta,
  getStatusLabel,
  initials,
} from "@/lib/utils"

function Avatar({ name }: { name: string }) {
  return <div className="avatar">{initials(name)}</div>
}

function StatusBadge({ status }: { status: Lead["status"] }) {
  return <span className={`badge status-${status}`}>{getStatusLabel(status)}</span>
}

function FontScaleControl() {
  const { snapshot, updateSettings } = useAppStore()
  const currentScale = snapshot.settings.fontScale || "compact"
  const options = [
    { value: "compact", label: "Mała" },
    { value: "default", label: "Średnia" },
    { value: "large", label: "Duża" },
  ] as const

  return (
    <div className="today-font-control" aria-label="Skala czcionki sekcji Dziś">
      <span className="today-font-control-label">Czcionka</span>
      <div className="today-font-control-buttons">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`today-font-control-button${currentScale === option.value ? " active" : ""}`}
            onClick={() => updateSettings({ fontScale: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function formatCurrency(value: number) {
  if (!value) return "—"

  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value)
}

function createTomorrowAtNineIso() {
  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + 1)
  nextDate.setHours(9, 0, 0, 0)
  return nextDate.toISOString()
}

function getLeadNextStepInfo(items: WorkItem[], leadId: string) {
  const nextItem =
    items
      .filter((item) => item.leadId === leadId && item.status !== "done" && item.recordType !== "note" && item.type !== "note")
      .sort((left, right) => {
        const leftDate = getItemPrimaryDate(left) || left.createdAt
        const rightDate = getItemPrimaryDate(right) || right.createdAt
        return leftDate.localeCompare(rightDate)
      })[0] ?? null

  return {
    title: nextItem?.title ?? "Brak next step",
    at: nextItem ? getItemPrimaryDate(nextItem) || null : null,
  }
}

function getLeadReasonLabel(lead: LeadWithComputedState, sectionKey: TodaySectionKey) {
  if (sectionKey === "waiting_too_long") {
    return `Brak odpowiedzi ${lead.computed.daysSinceLastTouch} dni`
  }

  if (sectionKey === "stale") {
    return `Brak ruchu od ${lead.computed.daysSinceLastTouch} dni`
  }

  if (sectionKey === "high_value_at_risk") {
    return lead.computed.riskReason === "next_step_overdue"
      ? "Wysoka wartość i overdue next step"
      : "Wysoka wartość i brak ruchu"
  }

  if (sectionKey === "top_moves_today") {
    return formatLeadAlarmReasonLabel(lead.computed.riskReason) || "Najwyższy priorytet dnia"
  }

  return formatLeadAlarmReasonLabel(lead.computed.riskReason) || "Aktywny lead bez planu"
}

function getItemReasonLabel(item: WorkItem, sectionKey: TodaySectionKey) {
  if (sectionKey === "today") {
    if (item.type === "call") return "Call na dziś"
    if (item.type === "meeting") return "Spotkanie dziś"
    if (item.type === "proposal") return "Oferta do wysłania dziś"
    if (item.type === "follow_up" || item.type === "check_reply") return "Follow-up dziś"
    return "Ruch zaplanowany na dziś"
  }

  if (sectionKey === "this_week") {
    if (item.type === "meeting") return "Spotkanie w tym tygodniu"
    if (item.type === "call") return "Call w tym tygodniu"
    return "Ruch zaplanowany w tym tygodniu"
  }

  if (item.type === "call") return "Overdue call"
  if (item.type === "meeting") return "Overdue meeting"
  if (item.type === "proposal") return "Oferta po terminie"
  if (item.type === "follow_up" || item.type === "check_reply") return "Brak follow-up"
  return "Zaległe działanie"
}

function TodayQuickActionButton({
  label,
  onClick,
  variant = "ghost",
}: {
  label: string
  onClick: () => void
  variant?: "ghost" | "primary"
}) {
  return (
    <button
      type="button"
      className={variant === "primary" ? "primary-button" : "ghost-button small"}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      {label}
    </button>
  )
}

function TodayItemRow({
  item,
  lead,
  sectionKey,
  onEdit,
  onDone,
  onSnoozeTomorrow,
  dateOptions,
}: {
  item: WorkItem
  lead: Lead | null
  sectionKey: TodaySectionKey
  onEdit: () => void
  onDone: () => void
  onSnoozeTomorrow: () => void
  dateOptions: { timeZone: string }
}) {
  const meta = getItemTypeMeta(item.type)
  const reasonLabel = getItemReasonLabel(item, sectionKey)

  return (
    <article className="today-item-row" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12 }}>
      <button
        className="today-row-open"
        onClick={onEdit}
        type="button"
        style={{ width: "100%", border: "none", background: "transparent", color: "inherit", padding: 0, textAlign: "left" }}
      >
        <div className="today-row-open-top" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div className="today-item-icon" aria-hidden="true">
            {meta.icon}
          </div>
          <div className="today-item-content" style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <div className="today-item-title">{lead?.name || item.leadLabel || item.title}</div>
            <div className="today-item-flag">{reasonLabel}</div>
          </div>
        </div>

        <div className="today-row-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginTop: 12 }}>
          <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <div className="muted-small uppercase">Następny krok</div>
            <div style={{ marginTop: 6, lineHeight: 1.4 }}>{item.title}</div>
          </div>
          <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <div className="muted-small uppercase">Termin</div>
            <div style={{ marginTop: 6, lineHeight: 1.4 }}>{formatRelativeDateTimeShort(getItemPrimaryDate(item), dateOptions)}</div>
          </div>
          <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <div className="muted-small uppercase">Wartość</div>
            <div style={{ marginTop: 6, lineHeight: 1.4 }}>{formatCurrency(lead?.value || 0)}</div>
          </div>
          <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <div className="muted-small uppercase">Lead</div>
            <div style={{ marginTop: 6, lineHeight: 1.4 }}>{lead?.name || item.leadLabel || "Wewnętrzne"}</div>
          </div>
        </div>
      </button>

      <div className="today-quick-actions" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <TodayQuickActionButton label="Zrobione" variant="primary" onClick={onDone} />
        <TodayQuickActionButton label="Jutro" onClick={onSnoozeTomorrow} />
        <TodayQuickActionButton label="Otwórz" onClick={onEdit} />
      </div>
    </article>
  )
}

function TodayLeadRow({
  lead,
  sectionKey,
  onOpen,
  onCreateTomorrowFollowUp,
  nextStepTitle,
  nextStepAt,
  dateOptions,
}: {
  lead: LeadWithComputedState
  sectionKey: TodaySectionKey
  onOpen: () => void
  onCreateTomorrowFollowUp: () => void
  nextStepTitle: string
  nextStepAt: string | null
  dateOptions: { timeZone: string }
}) {
  const reasonLabel = getLeadReasonLabel(lead, sectionKey)

  return (
    <article className="today-lead-row" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12 }}>
      <button
        className="today-row-open"
        type="button"
        onClick={onOpen}
        style={{ width: "100%", border: "none", background: "transparent", color: "inherit", padding: 0, textAlign: "left" }}
      >
        <div className="today-lead-topbar" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div className="today-lead-main">
            <Avatar name={lead.name} />
            <div className="today-lead-text">
              <div className="today-lead-name">{lead.name}</div>
              <div className="today-lead-company">{lead.company || lead.source}</div>
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="today-item-flag">{reasonLabel}</div>

        <div className="today-row-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginTop: 12 }}>
          <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <div className="muted-small uppercase">Następny krok</div>
            <div style={{ marginTop: 6, lineHeight: 1.4 }}>{nextStepTitle}</div>
          </div>
          <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <div className="muted-small uppercase">Termin</div>
            <div style={{ marginTop: 6, lineHeight: 1.4 }}>
              {nextStepAt ? formatRelativeDateTimeShort(nextStepAt, dateOptions) : "Brak terminu"}
            </div>
          </div>
          <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <div className="muted-small uppercase">Wartość</div>
            <div style={{ marginTop: 6, lineHeight: 1.4 }}>{formatCurrency(lead.value)}</div>
          </div>
          <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <div className="muted-small uppercase">Priorytet dnia</div>
            <div style={{ marginTop: 6, lineHeight: 1.4 }}>{lead.computed.dailyPriorityScore}</div>
          </div>
        </div>
      </button>

      <div className="today-quick-actions" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <TodayQuickActionButton label="Otwórz" variant="primary" onClick={onOpen} />
        <TodayQuickActionButton label="Dodaj krok jutro" onClick={onCreateTomorrowFollowUp} />
      </div>
    </article>
  )
}

function TodayStatsSection({
  title,
  cards,
  onCardClick,
}: {
  title: string
  cards: Array<{ key: string; label: string; value: number; color: string }>
  onCardClick: (key: string) => void
}) {
  return (
    <section style={{ display: "grid", gap: 10 }}>
      <div className="muted-small uppercase">{title}</div>
      <div className="today-top-stats-grid">
        {cards.map((stat) => (
          <article
            key={stat.key}
            className={`today-top-stat-card today-top-stat-card--${stat.key} interactive`}
            data-stat={stat.key}
            style={{ ["--stat-color" as string]: stat.color }}
            onClick={() => onCardClick(stat.key)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onCardClick(stat.key)
              }
            }}
            aria-label={`Pokaż sekcję ${stat.label}`}
          >
            <div className="today-top-stat-label" style={{ color: stat.color }}>
              {stat.label}
            </div>
            <button
              className="today-top-stat-value"
              style={{ color: stat.color }}
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onCardClick(stat.key)
              }}
              aria-label={`Przenieś ${stat.label} na górę listy`}
            >
              {stat.value}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export function TodayPageView() {
  const router = useRouter()
  const { snapshot, toggleItemDone, snoozeItem, addItem } = useAppStore()
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [sectionOrder, setSectionOrder] = useState<Array<"sales" | "blocked" | "ready" | "execution">>([
    "sales",
    "blocked",
    "ready",
    "execution",
  ])
  const [collapsed, setCollapsed] = useState<Record<"sales" | "blocked" | "ready" | "execution", boolean>>({
    sales: false,
    blocked: false,
    ready: false,
    execution: false,
  })

  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const viewModel = useMemo(() => buildTodayViewModel(snapshot, dateOptions), [dateOptions, snapshot])
  const command = viewModel.commandCenter
  const leadMap = useMemo(() => new Map(snapshot.leads.map((lead) => [lead.id, lead])), [snapshot.leads])
  const leadNextStepMap = useMemo(
    () => new Map(snapshot.leads.map((lead) => [lead.id, getLeadNextStepInfo(snapshot.items, lead.id)])),
    [snapshot.items, snapshot.leads],
  )
  const todaySectionsMap = useMemo(
    () => new Map(viewModel.sections.map((section) => [section.key, section] as const)),
    [viewModel.sections],
  )
  const executionTopStats = viewModel.topStats
  const commandTopStats = command.topStats
  const fontScale = snapshot.settings.fontScale || "compact"
  const isMobileProfile = snapshot.settings.viewProfile === "mobile"

  function getTodayLeadSection(sectionKey: TodaySectionKey) {
    const section = todaySectionsMap.get(sectionKey)
    if (!section || section.kind !== "leads") return []
    return section.leads
  }

  function getTodayItemsSection(sectionKey: TodaySectionKey) {
    const section = todaySectionsMap.get(sectionKey)
    if (!section || section.kind !== "items") return []
    return section.items
  }

  if (viewModel.isEmptyWorkspace) {
    return (
      <div className={`today-page today-font-${fontScale}${isMobileProfile ? " today-profile-mobile" : ""}`}>
        <section className="hero-row split">
          <div>
            <h1 className="page-title">Dzisiaj</h1>
            <div className="today-date-label">{viewModel.dateLabel}</div>
            <p className="page-subtitle">Zacznij od pustego, prawdziwego workspace i dodaj tylko swoje dane.</p>
          </div>
          <FontScaleControl />
        </section>

        <section className="panel-card">
          <div className="stack-list">
            <div className="empty-box">Dodaj pierwszego leada.</div>
            <div className="empty-box">Dodaj pierwsze zadanie.</div>
            <div className="empty-box">Dodaj pierwsze wydarzenie.</div>
          </div>
        </section>
      </div>
    )
  }

  function getLeadById(leadId: string | null) {
    if (!leadId) return null
    return leadMap.get(leadId) ?? null
  }

  function toggleSection(key: "sales" | "blocked" | "ready" | "execution") {
    setCollapsed((current) => ({ ...current, [key]: !current[key] }))
  }

  function focusSection(key: "sales" | "blocked" | "ready" | "execution") {
    setSectionOrder((current) => [key, ...current.filter((item) => item !== key)])
    setCollapsed((current) => ({ ...current, [key]: false }))
  }

  function focusFromCommandTopStat(statKey: (typeof commandTopStats)[number]["key"]) {
    if (statKey === "leads_to_move_today") return focusSection("sales")
    if (statKey === "cases_ready_to_start") return focusSection("ready")
    return focusSection("blocked")
  }

  function focusFromExecutionTopStat(statKey: TodayTopStat["key"]) {
    if (statKey === "waiting_too_long" || statKey === "high_value_at_risk") {
      return focusSection("sales")
    }

    return focusSection("execution")
  }

  function handleItemDone(item: WorkItem) {
    toggleItemDone(item.id)
  }

  function handleItemSnoozeTomorrow(item: WorkItem) {
    snoozeItem(item.id, createTomorrowAtNineIso())
  }

  function handleCreateLeadFollowUpTomorrow(lead: LeadWithComputedState) {
    const expectsReply = lead.status === "offer_sent" || lead.status === "follow_up"
    const payload: WorkItemInput = {
      leadId: lead.id,
      leadLabel: lead.name,
      recordType: "task",
      type: expectsReply ? "check_reply" : "follow_up",
      title: expectsReply ? `Sprawdzić odpowiedź — ${lead.name}` : `Follow-up — ${lead.name}`,
      description: "Dodane szybkim ruchem z ekranu Dziś.",
      status: "todo",
      priority: lead.priority,
      scheduledAt: createTomorrowAtNineIso(),
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: snapshot.settings.defaultReminder,
      showInTasks: true,
      showInCalendar: true,
    }

    addItem(payload)
  }

  function renderLeadGroup(title: string, leads: LeadWithComputedState[], sectionKey: TodaySectionKey) {
    if (leads.length === 0) return null

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div className="muted-small uppercase">{title}</div>
        {leads.map((lead) => (
          <TodayLeadRow
            key={`${sectionKey}-${lead.id}`}
            lead={lead}
            sectionKey={sectionKey}
            onOpen={() => setSelectedLead(lead)}
            onCreateTomorrowFollowUp={() => handleCreateLeadFollowUpTomorrow(lead)}
            nextStepTitle={leadNextStepMap.get(lead.id)?.title ?? "Brak next step"}
            nextStepAt={leadNextStepMap.get(lead.id)?.at ?? null}
            dateOptions={dateOptions}
          />
        ))}
      </div>
    )
  }

  function renderItemGroup(title: string, items: WorkItem[], sectionKey: TodaySectionKey) {
    if (items.length === 0) return null

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div className="muted-small uppercase">{title}</div>
        {items.map((item) => (
          <TodayItemRow
            key={`${sectionKey}-${item.id}`}
            item={item}
            lead={getLeadById(item.leadId)}
            sectionKey={sectionKey}
            onEdit={() => setEditingItem(item)}
            onDone={() => handleItemDone(item)}
            onSnoozeTomorrow={() => handleItemSnoozeTomorrow(item)}
            dateOptions={dateOptions}
          />
        ))}
      </div>
    )
  }

  function renderSalesSection() {
    const shownLeadIds = new Set<string>()

    const topMoves = getTodayLeadSection("top_moves_today")
    topMoves.forEach((lead) => shownLeadIds.add(lead.id))

    const waitingTooLong = getTodayLeadSection("waiting_too_long").filter((lead) => !shownLeadIds.has(lead.id))
    waitingTooLong.forEach((lead) => shownLeadIds.add(lead.id))

    const highValueAtRisk = getTodayLeadSection("high_value_at_risk").filter((lead) => !shownLeadIds.has(lead.id))
    highValueAtRisk.forEach((lead) => shownLeadIds.add(lead.id))

    const stale = getTodayLeadSection("stale").filter((lead) => !shownLeadIds.has(lead.id))
    stale.forEach((lead) => shownLeadIds.add(lead.id))

    const fallbackSales = command.sections.salesRequiresAction.filter((lead) => !shownLeadIds.has(lead.id))
    fallbackSales.forEach((lead) => shownLeadIds.add(lead.id))

    const renderedGroups = [
      renderLeadGroup("Najważniejsze ruchy dziś", topMoves, "top_moves_today"),
      renderLeadGroup("Waiting too long", waitingTooLong, "waiting_too_long"),
      renderLeadGroup("High value at risk", highValueAtRisk, "high_value_at_risk"),
      renderLeadGroup("Zaniedbane leady", stale, "stale"),
      renderLeadGroup("Pozostałe leady do ruchu", fallbackSales, "top_moves_today"),
    ].filter(Boolean)

    if (renderedGroups.length === 0) {
      return <div className="empty-box">Brak leadów wymagających ruchu dziś.</div>
    }

    return <div style={{ display: "grid", gap: 18 }}>{renderedGroups}</div>
  }

  function renderBlockedCasesSection() {
    if (command.sections.realizationBlockedByClient.length === 0) {
      return <div className="empty-box">Brak spraw zablokowanych przez klienta.</div>
    }

    return command.sections.realizationBlockedByClient.map((card) => (
      <article key={card.id} className="today-item-row">
        <div className="today-row-grid" style={{ display: "grid", gap: 10 }}>
          <div className="today-item-title">{card.title}</div>
          <div className="today-item-flag">{card.clientName} | {card.nextMove}</div>
          <div className="muted-small">Braki: {card.missingElementsCount} | Kompletnosc: {card.completenessPercent}%</div>
          <div className="muted-small">Status: {card.statusLabel} | Utknieta: {card.daysStuck} dni</div>
        </div>
        <div className="today-quick-actions" style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <TodayQuickActionButton label="Otworz Sprawy" variant="primary" onClick={() => router.push("/cases")} />
        </div>
      </article>
    ))
  }

  function renderReadyCasesSection() {
    if (command.sections.readyToStart.length === 0) {
      return <div className="empty-box">Brak spraw gotowych do startu.</div>
    }

    return command.sections.readyToStart.map((card) => (
      <article key={card.id} className="today-item-row">
        <div className="today-row-grid" style={{ display: "grid", gap: 10 }}>
          <div className="today-item-title">{card.title}</div>
          <div className="today-item-flag">{card.clientName}</div>
          <div className="muted-small">Kompletnosc: {card.completenessPercent}% | Braki: {card.missingElementsCount}</div>
        </div>
        <div className="today-quick-actions" style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <TodayQuickActionButton label="Przejdz do realizacji" variant="primary" onClick={() => router.push("/cases")} />
        </div>
      </article>
    ))
  }

  function renderExecutionQueueSection() {
    const overdueItems = getTodayItemsSection("overdue")
    const todayItems = getTodayItemsSection("today")
    const thisWeekItems = getTodayItemsSection("this_week")
    const leadsWithoutNextStep = getTodayLeadSection("missing_next_step")

    const renderedGroups = [
      renderItemGroup("Overdue", overdueItems, "overdue"),
      renderItemGroup("Dziś", todayItems, "today"),
      renderItemGroup("Ten tydzień", thisWeekItems, "this_week"),
      renderLeadGroup("Bez next step", leadsWithoutNextStep, "missing_next_step"),
    ].filter(Boolean)

    if (renderedGroups.length === 0) {
      return <div className="empty-box">Brak pozycji w kolejce wykonawczej.</div>
    }

    return <div style={{ display: "grid", gap: 18 }}>{renderedGroups}</div>
  }

  return (
    <div className={`today-page today-font-${fontScale}${isMobileProfile ? " today-profile-mobile" : ""}`}>
      <section className="hero-row split">
        <div>
          <h1 className="page-title">Dzisiaj</h1>
          <div className="today-date-label">{viewModel.dateLabel}</div>
          <p className="page-subtitle">Tu od razu widzisz, co ruszyć teraz, co nie ma next stepu i co grozi zgubieniem.</p>
        </div>
        <FontScaleControl />
      </section>

      {!isMobileProfile ? (
        <section style={{ display: "grid", gap: 16 }}>
          <TodayStatsSection
            title="Alarmy i next step"
            cards={executionTopStats}
            onCardClick={(key) => focusFromExecutionTopStat(key as TodayTopStat["key"])}
          />
          <TodayStatsSection
            title="Sprzedaż i operacje"
            cards={commandTopStats}
            onCardClick={(key) => focusFromCommandTopStat(key as (typeof commandTopStats)[number]["key"])}
          />
        </section>
      ) : null}

      <section className="today-sections-stack">
        {sectionOrder.map((sectionKey) => (
          <section key={sectionKey} className="today-section-card">
            <div className="today-section-header">
              <div className="today-section-title-group">
                <button className="today-section-title-wrap" type="button" onClick={() => toggleSection(sectionKey)}>
                  <h2 className="today-section-title">
                    {sectionKey === "sales" ? "Sprzedaż wymaga ruchu" : null}
                    {sectionKey === "blocked" ? "Realizacja stoi przez klienta" : null}
                    {sectionKey === "ready" ? "Gotowe do ruszenia" : null}
                    {sectionKey === "execution" ? "Overdue / dziś / ten tydzień / bez next step" : null}
                  </h2>
                </button>
                <button className="today-section-count" type="button" onClick={() => focusSection(sectionKey)}>
                  {sectionKey === "sales" ? command.sections.salesRequiresAction.length : null}
                  {sectionKey === "blocked" ? command.sections.realizationBlockedByClient.length : null}
                  {sectionKey === "ready" ? command.sections.readyToStart.length : null}
                  {sectionKey === "execution"
                    ? getTodayItemsSection("overdue").length
                      + getTodayItemsSection("today").length
                      + getTodayItemsSection("this_week").length
                      + getTodayLeadSection("missing_next_step").length
                    : null}
                </button>
              </div>
              <div className="today-section-actions">
                <button className="today-section-toggle" type="button" onClick={() => toggleSection(sectionKey)} aria-expanded={!collapsed[sectionKey]}>
                  {collapsed[sectionKey] ? "Rozwin" : "Zwin"}
                </button>
              </div>
            </div>

            {!collapsed[sectionKey] ? (
              <div className="today-section-body">
                {sectionKey === "sales" ? renderSalesSection() : null}
                {sectionKey === "blocked" ? renderBlockedCasesSection() : null}
                {sectionKey === "ready" ? renderReadyCasesSection() : null}
                {sectionKey === "execution" ? renderExecutionQueueSection() : null}
              </div>
            ) : null}
          </section>
        ))}
      </section>

      {editingItem ? <ItemModal item={editingItem} onClose={() => setEditingItem(null)} /> : null}
      {selectedLead ? <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} /> : null}
    </div>
  )
}
