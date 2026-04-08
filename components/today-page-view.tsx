"use client"

import { useMemo, useState } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { ItemModal, LeadDrawer } from "@/components/views"
import { useAppStore } from "@/lib/store"
import {
  buildTodayViewModel,
  getEffectiveCollapsed,
  getNextManualCollapsedState,
  getSectionKeyFromTopStat,
  moveSectionToTop,
  TODAY_DEFAULT_COLLAPSED,
  TODAY_SECTION_ORDER,
  type TodaySectionKey,
} from "@/lib/today"
import type { FontScale, Lead, WorkItem } from "@/lib/types"
import {
  formatDateTime,
  formatMoney,
  formatRelativeDateTimeShort,
  getCurrentDateKey,
  getNextDaySnoozeAtPreferredTime,
  getItemLeadLabel,
  getItemPrimaryDate,
  getItemTypeMeta,
  getStatusLabel,
  initials,
  nowIso,
  toDateKey,
} from "@/lib/utils"

function Avatar({ name }: { name: string }) {
  return <div className="avatar">{initials(name)}</div>
}

function StatusBadge({ status }: { status: Lead["status"] }) {
  return <span className={`badge status-${status}`}>{getStatusLabel(status)}</span>
}

function getLeadAlarmReason(lead: Lead, todayKey: string, dateOptions: { timeZone: string }) {
  if (!lead.nextActionTitle.trim()) return "Brak next step"
  if (!lead.nextActionAt) return "Brak terminu"
  const day = toDateKey(lead.nextActionAt, dateOptions)
  if (!day) return "Nieprawidłowy termin"
  if (day < todayKey) return "Termin minął"
  if (day === todayKey) return "Termin dziś"
  return "Nadchodzący termin"
}

function TodayAlarmCard({
  lead,
  reason,
  dateOptions,
  onOpen,
  onSnoozeTomorrow,
}: {
  lead: Lead
  reason: string
  dateOptions: { timeZone: string }
  onOpen: () => void
  onSnoozeTomorrow: () => void
}) {
  return (
    <article className="panel-card today-alarm-card">
      <div className="today-alarm-head">
        <div>
          <div className="today-alarm-title">{lead.name}</div>
          <div className="muted-small">{lead.company || lead.source || "Bez firmy"}</div>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="today-alarm-grid">
        <div>
          <div className="muted-small uppercase">Lead</div>
          <div>{lead.name}</div>
        </div>
        <div>
          <div className="muted-small uppercase">Powód</div>
          <div>{reason}</div>
        </div>
        <div>
          <div className="muted-small uppercase">Next Step</div>
          <div>{lead.nextActionTitle?.trim() || "Ustal next step"}</div>
        </div>
        <div>
          <div className="muted-small uppercase">Termin</div>
          <div>{lead.nextActionAt ? formatDateTime(lead.nextActionAt, dateOptions) : "Brak"}</div>
        </div>
        <div>
          <div className="muted-small uppercase">Wartość</div>
          <div>{formatMoney(lead.value)}</div>
        </div>
      </div>

      <div className="today-alarm-actions">
        <button className="secondary-button small" type="button" onClick={onOpen}>
          Otwórz
        </button>
        <button className="ghost-button small" type="button" onClick={onSnoozeTomorrow}>
          Przenieś na jutro
        </button>
      </div>
    </article>
  )
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
  return (
    <button className="today-item-row" onClick={onEdit} type="button">
      <div className="today-item-icon" aria-hidden="true">
        {meta.icon}
      </div>
      <div className="today-item-content">
        <div className="today-item-title">{item.title}</div>
        <div className="today-item-meta">{formatRelativeDateTimeShort(getItemPrimaryDate(item), dateOptions)}</div>
        {leadName ? <div className="today-item-lead">• {leadName}</div> : null}
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
          <div className="muted-small">Next step: {lead.nextActionTitle || "Brak"}</div>
        </div>
      </div>
      <StatusBadge status={lead.status} />
    </button>
  )
}

export function TodayPageView() {
  const { snapshot, updateLead } = useAppStore()
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const fontScale = snapshot.settings.fontScale || "compact"
  const isMobileProfile = snapshot.settings.viewProfile === "mobile"
  const todayKey = getCurrentDateKey(dateOptions)

  const [sectionOrder, setSectionOrder] = useState<TodaySectionKey[]>(() => TODAY_SECTION_ORDER)
  const [manualCollapsed, setManualCollapsed] = useState<Record<TodaySectionKey, boolean>>(() => TODAY_DEFAULT_COLLAPSED)
  const [transientExpandedKey, setTransientExpandedKey] = useState<TodaySectionKey | null>(null)

  const viewModel = useMemo(() => buildTodayViewModel(snapshot, dateOptions), [dateOptions, snapshot])
  const sectionsByKey = useMemo(() => {
    const mapped = new Map<TodaySectionKey, (typeof viewModel)["sections"][number]>()
    viewModel.sections.forEach((section) => {
      mapped.set(section.key, section)
    })
    return mapped
  }, [viewModel.sections])

  const alarmLeads = useMemo(() => {
    return snapshot.leads
      .filter((lead) => lead.status !== "won" && lead.status !== "lost")
      .filter((lead) => {
        if (!lead.nextActionAt) return true
        const day = toDateKey(lead.nextActionAt, dateOptions)
        if (!day) return true
        return day <= todayKey
      })
      .sort((a, b) => {
        const aScore = a.nextActionAt ? (toDateKey(a.nextActionAt, dateOptions) || "9999-12-31") : "0000-00-00"
        const bScore = b.nextActionAt ? (toDateKey(b.nextActionAt, dateOptions) || "9999-12-31") : "0000-00-00"
        return aScore.localeCompare(bScore)
      })
  }, [dateOptions, snapshot.leads, todayKey])

  function handleLeadSnoozeTomorrow(lead: Lead) {
    const nextAt = getNextDaySnoozeAtPreferredTime(lead.nextActionAt || nowIso(), dateOptions)
    updateLead(lead.id, {
      nextActionTitle: lead.nextActionTitle?.trim() ? lead.nextActionTitle : "Follow-up",
      nextActionAt: nextAt,
    })
  }

  if (viewModel.isEmptyWorkspace) {
    return (
      <div className={`today-page today-font-${fontScale}${isMobileProfile ? " today-profile-mobile" : ""}`}>
        <PageShell title="Dziś" subtitle="Zacznij od pustego workspace i dodaj pierwszy lead albo działanie." actions={<FontScaleControl />}>
          {null}
        </PageShell>
      </div>
    )
  }

  return (
    <div className={`today-page today-font-${fontScale}${isMobileProfile ? " today-profile-mobile" : ""}`}>
      <PageShell title="Dziś" subtitle={viewModel.dateLabel} actions={<FontScaleControl />}>
        <section className="today-top-stats-grid" aria-label="Statystyki dnia">
          {viewModel.topStats.map((stat) => (
            <article
              key={stat.key}
              className="today-top-stat-card interactive"
              style={{ ["--stat-color" as string]: stat.color }}
              onClick={() => {
                const sectionKey = getSectionKeyFromTopStat(stat.key)
                setSectionOrder((current) => moveSectionToTop(current, sectionKey))
                setTransientExpandedKey(sectionKey)
              }}
            >
              <div className="today-top-stat-label" style={{ color: stat.color }}>
                {stat.label}
              </div>
              <button className="today-top-stat-value" style={{ color: stat.color }} type="button" disabled>
                {stat.value}
              </button>
            </article>
          ))}
        </section>

        {alarmLeads.length > 0 ? (
          <section aria-label="Alarmy" className="today-sections-stack">
            {alarmLeads.slice(0, 3).map((lead) => (
              <TodayAlarmCard
                key={lead.id}
                lead={lead}
                reason={getLeadAlarmReason(lead, todayKey, dateOptions)}
                dateOptions={dateOptions}
                onOpen={() => setSelectedLead(lead)}
                onSnoozeTomorrow={() => handleLeadSnoozeTomorrow(lead)}
              />
            ))}
          </section>
        ) : null}

        <section className="today-sections-stack" aria-label="Sekcje dnia">
          {sectionOrder.map((sectionKey) => {
            const section = sectionsByKey.get(sectionKey)
            if (!section) return null

            const isCollapsed = getEffectiveCollapsed(manualCollapsed, transientExpandedKey, section.key)

            return (
              <article key={section.key} className="today-section-card" style={{ ["--section-accent" as string]: section.color }}>
                <div className="today-section-header">
                  <button
                    className="today-section-title-wrap"
                    type="button"
                    onClick={() => {
                      setManualCollapsed((current) => getNextManualCollapsedState(current, transientExpandedKey, section.key))
                      setTransientExpandedKey(null)
                    }}
                  >
                    <span className="today-section-accent" aria-hidden="true" />
                    <h2 className="today-section-title">{section.title}</h2>
                  </button>

                  <div className="today-section-actions">
                    <span className="today-section-count">{section.count}</span>
                    <button
                      className="today-section-toggle"
                      type="button"
                      onClick={() => {
                        setManualCollapsed((current) => getNextManualCollapsedState(current, transientExpandedKey, section.key))
                        setTransientExpandedKey(null)
                      }}
                    >
                      {isCollapsed ? "Pokaż" : "Zwiń"}
                    </button>
                  </div>
                </div>

                {!isCollapsed ? (
                  <div className="today-section-body">
                    {section.kind === "items" ? (
                      <>
                        {section.items.length === 0 ? <div className="empty-box">Brak wpisów.</div> : null}
                        {section.items.slice(0, 12).map((item) => (
                          <TodayItemRow
                            key={item.id}
                            item={item}
                            leadName={getItemLeadLabel(item, snapshot.leads)}
                            onEdit={() => setEditingItem(item)}
                            dateOptions={dateOptions}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        {section.leads.length === 0 ? <div className="empty-box">Brak leadów.</div> : null}
                        {section.leads.slice(0, 12).map((lead) => (
                          <TodayLeadRow key={lead.id} lead={lead} onOpen={() => setSelectedLead(lead)} />
                        ))}
                        {section.key === "all_leads" && section.leads.length > 12 ? (
                          <button className="ghost-button" type="button" onClick={() => (window.location.href = "/leads")}>
                            Otwórz pełną listę leadów
                          </button>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : null}
              </article>
            )
          })}
        </section>

        {editingItem ? <ItemModal item={editingItem} onClose={() => setEditingItem(null)} /> : null}
        {selectedLead ? <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} /> : null}
      </PageShell>
    </div>
  )
}

