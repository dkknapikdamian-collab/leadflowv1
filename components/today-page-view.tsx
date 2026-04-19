"use client"

import { useMemo, useState } from "react"
import { ItemModal, LeadDrawer } from "@/components/views"
import { useAppStore } from "@/lib/store"
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
import type { FontScale, Lead, WorkItem } from "@/lib/types"
import {
  formatRelativeDateTimeShort,
  getItemLeadLabel,
  getItemPrimaryDate,
  getItemTypeMeta,
  getStatusLabel,
  initials,
  isOverdue,
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
  const options: { value: FontScale; label: string }[] = [
    { value: "compact", label: "Mała" },
    { value: "default", label: "Średnia" },
    { value: "large", label: "Duża" },
  ]

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

function TodayItemRow({
  item,
  leadName,
  onEdit,
  dateOptions,
}: {
  item: WorkItem
  leadName?: string
  onEdit: () => void
  dateOptions: { timeZone: string }
}) {
  const meta = getItemTypeMeta(item.type)
  const overdue = isOverdue(item, dateOptions)

  return (
    <button className="today-item-row" onClick={onEdit} type="button">
      <div className="today-item-icon" aria-hidden="true">
        {meta.icon}
      </div>
      <div className="today-item-content">
        <div className="today-item-title">{item.title}</div>
        {overdue ? <div className="today-item-flag">ZALEGŁE</div> : null}
        <div className="today-item-meta">{formatRelativeDateTimeShort(getItemPrimaryDate(item), dateOptions)}</div>
        {leadName ? <div className="today-item-lead">· {leadName}</div> : null}
      </div>
    </button>
  )
}

function TodayLeadRow({ lead, onOpen }: { lead: Lead; onOpen: () => void }) {
  return (
    <button className="today-lead-row" type="button" onClick={onOpen}>
      <div className="today-lead-main">
        <Avatar name={lead.name} />
        <div className="today-lead-text">
          <div className="today-lead-name">{lead.name}</div>
          <div className="today-lead-company">{lead.company || lead.source}</div>
        </div>
      </div>
      <StatusBadge status={lead.status} />
    </button>
  )
}

function TodaySectionBlock({
  section,
  collapsed,
  onToggle,
  onFocus,
  onEditItem,
  onOpenLead,
  getLeadName,
  dateOptions,
}: {
  section: TodaySection
  collapsed: boolean
  onToggle: () => void
  onFocus: () => void
  onEditItem: (item: WorkItem) => void
  onOpenLead: (lead: Lead) => void
  getLeadName: (item: WorkItem) => string
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
                <TodayItemRow key={item.id} item={item} leadName={getLeadName(item)} onEdit={() => onEditItem(item)} dateOptions={dateOptions} />
              ))
            ) : (
              <div className="empty-box">Brak wpisów w tej sekcji.</div>
            )
          ) : section.leads.length > 0 ? (
            section.leads.map((lead) => <TodayLeadRow key={lead.id} lead={lead} onOpen={() => onOpenLead(lead)} />)
          ) : (
            <div className="empty-box">Brak leadów w tej sekcji.</div>
          )}
        </div>
      ) : null}
    </section>
  )
}

export function TodayPageView() {
  const { snapshot } = useAppStore()
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [sectionOrder, setSectionOrder] = useState<TodaySectionKey[]>(TODAY_SECTION_ORDER)
  const [manualCollapsed, setManualCollapsed] = useState<Record<TodaySectionKey, boolean>>(TODAY_DEFAULT_COLLAPSED)
  const [transientExpandedKey, setTransientExpandedKey] = useState<TodaySectionKey | null>(null)

  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const viewModel = useMemo(() => buildTodayViewModel(snapshot, dateOptions), [dateOptions, snapshot])
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

  const getLeadName = (item: WorkItem) => getItemLeadLabel(item, snapshot.leads)

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

  return (
    <div className={`today-page today-font-${fontScale}${isMobileProfile ? " today-profile-mobile" : ""}`}>
      <section className="hero-row split">
        <div>
          <h1 className="page-title">Dzisiaj</h1>
          <div className="today-date-label">{viewModel.dateLabel}</div>
          <p className="page-subtitle">Tu masz dokładnie to, co wymaga ruchu dzisiaj i co już wisi zaległe.</p>
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
            onOpenLead={setSelectedLead}
            getLeadName={getLeadName}
            dateOptions={dateOptions}
          />
        ))}
      </section>

      {editingItem ? <ItemModal item={editingItem} onClose={() => setEditingItem(null)} /> : null}
      {selectedLead ? <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} /> : null}
    </div>
  )
}
