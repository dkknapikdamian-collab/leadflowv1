"use client"

import { useMemo, useState } from "react"
import { ItemModal, LeadDrawer } from "@/components/views"
import { useAppStore } from "@/lib/store"
import {
  formatLeadAlarmReasonLabel,
  type LeadWithComputedState,
} from "@/lib/domain/lead-state"
import {
  buildTodayViewModel,
  getEffectiveCollapsed,
  getNextManualCollapsedState,
  getSectionKeyFromTopStat,
  getTodaySectionMeta,
  moveSectionToTop,
  TODAY_DEFAULT_COLLAPSED,
  TODAY_SECTION_ORDER,
  type TodaySection,
  type TodaySectionKey,
} from "@/lib/today"
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
  const nextItem = items
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
    return `Waiting ${lead.computed.daysSinceLastTouch} dni`
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
      <button className="today-row-open" onClick={onEdit} type="button" style={{ width: "100%", border: "none", background: "transparent", color: "inherit", padding: 0, textAlign: "left" }}>
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
      <button className="today-row-open" type="button" onClick={onOpen} style={{ width: "100%", border: "none", background: "transparent", color: "inherit", padding: 0, textAlign: "left" }}>
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

function TodaySectionBlock({
  section,
  collapsed,
  onToggle,
  onFocus,
  onEditItem,
  onItemDone,
  onItemSnoozeTomorrow,
  onOpenLead,
  onCreateLeadFollowUpTomorrow,
  getLeadById,
  getLeadNextStepInfoById,
  dateOptions,
}: {
  section: TodaySection
  collapsed: boolean
  onToggle: () => void
  onFocus: () => void
  onEditItem: (item: WorkItem) => void
  onItemDone: (item: WorkItem) => void
  onItemSnoozeTomorrow: (item: WorkItem) => void
  onOpenLead: (lead: Lead) => void
  onCreateLeadFollowUpTomorrow: (lead: LeadWithComputedState) => void
  getLeadById: (leadId: string | null) => Lead | null
  getLeadNextStepInfoById: (leadId: string) => { title: string; at: string | null }
  dateOptions: { timeZone: string }
}) {
  const meta = getTodaySectionMeta(section.key)

  return (
    <section className="today-section-card" data-section={section.key}>
      <div className="today-section-header">
        <div className="today-section-title-group">
          <button className="today-section-title-wrap" type="button" onClick={onToggle}>
            <div className="today-section-accent" style={{ backgroundColor: meta.color }} />
            <h2 className="today-section-title" style={{ color: meta.color }}>
              {section.title}
            </h2>
          </button>
          <button
            className="today-section-count"
            type="button"
            onClick={onFocus}
            style={{
              color: meta.color,
              backgroundColor: `${meta.color}1a`,
              borderColor: `${meta.color}33`,
            }}
            aria-label={`Przenieś sekcję ${section.title} na górę`}
            title="Kliknij, aby przenieść sekcję na górę i ją otworzyć"
          >
            {section.count}
          </button>
        </div>

        <div className="today-section-actions">
          <button className="today-section-toggle" type="button" onClick={onToggle} aria-expanded={!collapsed}>
            {collapsed ? "Rozwiń" : "Zwiń"}
          </button>
        </div>
      </div>

      {!collapsed ? (
        <div className="today-section-body">
          {section.kind === "items" ? (
            section.items.length > 0 ? (
              section.items.map((item) => (
                <TodayItemRow
                  key={item.id}
                  item={item}
                  lead={getLeadById(item.leadId)}
                  sectionKey={section.key}
                  onEdit={() => onEditItem(item)}
                  onDone={() => onItemDone(item)}
                  onSnoozeTomorrow={() => onItemSnoozeTomorrow(item)}
                  dateOptions={dateOptions}
                />
              ))
            ) : (
              <div className="empty-box">Brak wpisów w tej sekcji.</div>
            )
          ) : section.leads.length > 0 ? (
            section.leads.map((lead) => (
              <TodayLeadRow
                key={lead.id}
                lead={lead}
                sectionKey={section.key}
                onOpen={() => onOpenLead(lead)}
                onCreateTomorrowFollowUp={() => onCreateLeadFollowUpTomorrow(lead)}
                nextStepTitle={getLeadNextStepInfoById(lead.id).title}
                nextStepAt={getLeadNextStepInfoById(lead.id).at}
                dateOptions={dateOptions}
              />
            ))
          ) : (
            <div className="empty-box">Brak leadów w tej sekcji.</div>
          )}
        </div>
      ) : null}
    </section>
  )
}

export function TodayPageView() {
  const { snapshot, toggleItemDone, snoozeItem, addItem } = useAppStore()
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [sectionOrder, setSectionOrder] = useState<TodaySectionKey[]>(TODAY_SECTION_ORDER)
  const [manualCollapsed, setManualCollapsed] = useState<Record<TodaySectionKey, boolean>>(TODAY_DEFAULT_COLLAPSED)
  const [transientExpandedKey, setTransientExpandedKey] = useState<TodaySectionKey | null>(null)

  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const viewModel = useMemo(() => buildTodayViewModel(snapshot, dateOptions), [dateOptions, snapshot])
  const leadMap = useMemo(() => new Map(snapshot.leads.map((lead) => [lead.id, lead])), [snapshot.leads])
  const leadNextStepMap = useMemo(
    () => new Map(snapshot.leads.map((lead) => [lead.id, getLeadNextStepInfo(snapshot.items, lead.id)])),
    [snapshot.items, snapshot.leads],
  )
  const sections = useMemo(() => {
    const mapped = new Map(viewModel.sections.map((section) => [section.key, section]))
    return sectionOrder
      .map((key) => mapped.get(key))
      .filter((section): section is TodaySection => Boolean(section))
  }, [sectionOrder, viewModel.sections])
  const topStats = viewModel.topStats
  const fontScale = snapshot.settings.fontScale || "compact"
  const isMobileProfile = snapshot.settings.viewProfile === "mobile"

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

  function toggleSection(key: TodaySectionKey) {
    setManualCollapsed((current) => getNextManualCollapsedState(current, transientExpandedKey, key))
    setTransientExpandedKey((current) => (current === key ? null : current))
  }

  function focusSection(key: TodaySectionKey) {
    setSectionOrder((current) => moveSectionToTop(current, key))
    setTransientExpandedKey(key)
  }

  function focusFromTopStat(statKey: (typeof topStats)[number]["key"]) {
    focusSection(getSectionKeyFromTopStat(statKey))
  }

  function handleItemDone(item: WorkItem) {
    toggleItemDone(item.id)
  }

  function handleItemSnoozeTomorrow(item: WorkItem) {
    snoozeItem(item.id, createTomorrowAtNineIso())
  }

  function handleCreateLeadFollowUpTomorrow(lead: LeadWithComputedState) {
    const payload: WorkItemInput = {
      leadId: lead.id,
      leadLabel: lead.name,
      recordType: "task",
      type: lead.status === "waiting" ? "check_reply" : "follow_up",
      title: lead.status === "waiting" ? `Sprawdzić odpowiedź — ${lead.name}` : `Follow-up — ${lead.name}`,
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
        <section className="today-top-stats-grid">
          {topStats.map((stat) => {
            const target = getSectionKeyFromTopStat(stat.key)
            return (
              <article
                key={stat.key}
                className={`today-top-stat-card today-top-stat-card--${stat.key} interactive`}
                data-stat={stat.key}
                style={{ ["--stat-color" as string]: stat.color }}
                onClick={() => focusSection(target)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    focusFromTopStat(stat.key)
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
                    focusFromTopStat(stat.key)
                  }}
                  aria-label={`Przenieś ${stat.label} na górę listy`}
                >
                  {stat.value}
                </button>
              </article>
            )
          })}
        </section>
      ) : null}

      <section className="today-sections-stack">
        {sections.map((section) => (
          <TodaySectionBlock
            key={section.key}
            section={section}
            collapsed={getEffectiveCollapsed(manualCollapsed, transientExpandedKey, section.key)}
            onToggle={() => toggleSection(section.key)}
            onFocus={() => focusSection(section.key)}
            onEditItem={setEditingItem}
            onItemDone={handleItemDone}
            onItemSnoozeTomorrow={handleItemSnoozeTomorrow}
            onOpenLead={setSelectedLead}
            onCreateLeadFollowUpTomorrow={handleCreateLeadFollowUpTomorrow}
            getLeadById={getLeadById}
            getLeadNextStepInfoById={(leadId) => leadNextStepMap.get(leadId) ?? { title: "Brak next step", at: null }}
            dateOptions={dateOptions}
          />
        ))}
      </section>

      {editingItem ? <ItemModal item={editingItem} onClose={() => setEditingItem(null)} /> : null}
      {selectedLead ? <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} /> : null}
    </div>
  )
}
