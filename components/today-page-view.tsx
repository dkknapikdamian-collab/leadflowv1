"use client"

import { useMemo, useState } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { ItemModal, LeadDrawer } from "@/components/views"
import { buildCasesDashboard } from "@/lib/repository/cases-dashboard"
import { useAppStore } from "@/lib/store"
import { getTodaySectionMeta } from "@/lib/today"
import type { FontScale, Lead, WorkItem } from "@/lib/types"
import {
  formatRelativeDateTimeShort,
  getCurrentDateKey,
  getItemLeadLabel,
  getItemPrimaryDate,
  getItemTypeMeta,
  getStatusLabel,
  getTaskListItems,
  initials,
  isOverdue,
  isToday,
  toDateKey,
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
  return (
    <button className="today-item-row" onClick={onEdit} type="button">
      <div className="today-item-icon" aria-hidden="true">
        {meta.icon}
      </div>
      <div className="today-item-content">
        <div className="today-item-title">{item.title}</div>
        {isOverdue(item, dateOptions) ? <div className="today-item-flag">OVERDUE</div> : null}
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

function TodayCaseRow({
  entry,
  onOpen,
}: {
  entry: {
    id: string
    caseName: string
    client: string
    operationalStatus: string
    missingItems: number
    stalledDays: number
    nextMove: string
  }
  onOpen: (caseId: string) => void
}) {
  return (
    <button className="today-lead-row" type="button" onClick={() => onOpen(entry.id)}>
      <div className="today-lead-main">
        <div className="today-lead-text">
          <div className="today-lead-name">{entry.caseName}</div>
          <div className="today-lead-company">
            {entry.client} • brakujace: {entry.missingItems} • stoi: {entry.stalledDays} dni
          </div>
          <div className="muted-small">Kolejny ruch: {entry.nextMove}</div>
        </div>
      </div>
      <span className="badge">{entry.operationalStatus}</span>
    </button>
  )
}

export function TodayPageView() {
  const { snapshot } = useAppStore()
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const fontScale = snapshot.settings.fontScale || "compact"
  const isMobileProfile = snapshot.settings.viewProfile === "mobile"
  const todayKey = getCurrentDateKey(dateOptions)

  const casesDashboard = useMemo(() => buildCasesDashboard(snapshot, "all"), [snapshot])

  const salesLeadsDueToday = useMemo(() => {
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

  const waitingOrBlockedCases = useMemo(
    () =>
      casesDashboard.all.filter(
        (entry) => entry.operationalStatus === "waiting_for_client" || entry.operationalStatus === "blocked",
      ),
    [casesDashboard.all],
  )

  const readyCases = useMemo(
    () => casesDashboard.all.filter((entry) => entry.operationalStatus === "ready_to_start"),
    [casesDashboard.all],
  )

  const pendingTaskItems = useMemo(
    () => getTaskListItems(snapshot.items.filter((item) => item.status !== "done")),
    [snapshot.items],
  )
  const overdueItems = useMemo(
    () => pendingTaskItems.filter((item) => isOverdue(item, dateOptions)),
    [dateOptions, pendingTaskItems],
  )
  const todayItems = useMemo(
    () => pendingTaskItems.filter((item) => isToday(getItemPrimaryDate(item), dateOptions) && !isOverdue(item, dateOptions)),
    [dateOptions, pendingTaskItems],
  )
  const weekItems = useMemo(
    () =>
      pendingTaskItems.filter((item) => {
        const day = toDateKey(getItemPrimaryDate(item), dateOptions)
        if (!day || day <= todayKey) return false
        return day <= "9999-12-31" && day <= addDaysKey(todayKey, 7)
      }),
    [dateOptions, pendingTaskItems, todayKey],
  )
  const leadsWithoutNextStep = useMemo(
    () => snapshot.leads.filter((lead) => lead.status !== "won" && lead.status !== "lost" && !lead.nextActionAt),
    [snapshot.leads],
  )

  const isEmptyWorkspace = snapshot.leads.length === 0 && snapshot.items.length === 0

  if (isEmptyWorkspace) {
    return (
      <div className={`today-page today-font-${fontScale}${isMobileProfile ? " today-profile-mobile" : ""}`}>
        <PageShell
          title="Dziś"
          subtitle="Zacznij od pustego workspace i dodaj pierwszy lead lub sprawę."
          actions={<FontScaleControl />}
        >
          {null}
        </PageShell>
      </div>
    )
  }

  const topStats = [
    {
      key: "leads_due_today",
      label: "Leady do ruchu dziś",
      value: salesLeadsDueToday.length,
      color: getTodaySectionMeta("today").color,
    },
    {
      key: "cases_waiting_client",
      label: "Sprawy czekajace na klienta",
      value: casesDashboard.stats.waitingForClient,
      color: "#7c3aed",
    },
    {
      key: "cases_blocked",
      label: "Sprawy zablokowane",
      value: casesDashboard.stats.blocked,
      color: "#ef4444",
    },
    {
      key: "cases_ready_to_start",
      label: "Sprawy gotowe do startu",
      value: casesDashboard.stats.readyToStart,
      color: "#10b981",
    },
  ]

  return (
    <div className={`today-page today-font-${fontScale}${isMobileProfile ? " today-profile-mobile" : ""}`}>
      <PageShell
        title="Dziś"
        subtitle="Jedno centrum dowodzenia: kasa, blokady i konkretne ruchy na dziś."
        actions={<FontScaleControl />}
      >

        <section className="today-top-stats-grid">
          {topStats.map((stat) => (
            <article key={stat.key} className="today-top-stat-card" style={{ ["--stat-color" as string]: stat.color }}>
              <div className="today-top-stat-label" style={{ color: stat.color }}>
                {stat.label}
              </div>
              <div className="today-top-stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </article>
          ))}
        </section>

        <section className="today-section-card today-tone-sales">
          <div className="today-section-header">
            <div className="today-section-title-group">
              <span className="today-section-accent" aria-hidden="true" />
              <h2 className="today-section-title">Sekcja 1: sprzedaż wymaga ruchu</h2>
            </div>
          </div>
          <div className="today-section-body">
            {salesLeadsDueToday.length === 0 ? <div className="empty-box">Brak leadów wymagających ruchu.</div> : null}
            {salesLeadsDueToday.map((lead) => (
              <TodayLeadRow key={lead.id} lead={lead} onOpen={() => setSelectedLead(lead)} />
            ))}
          </div>
        </section>

        <section className="today-section-card today-tone-waiting">
          <div className="today-section-header">
            <div className="today-section-title-group">
              <span className="today-section-accent" aria-hidden="true" />
              <h2 className="today-section-title">Sekcja 2: realizacja stoi przez klienta</h2>
            </div>
          </div>
          <div className="today-section-body">
            {waitingOrBlockedCases.length === 0 ? <div className="empty-box">Brak spraw czekających lub zablokowanych.</div> : null}
            {waitingOrBlockedCases.map((entry) => (
              <TodayCaseRow key={entry.id} entry={entry} onOpen={(id) => (window.location.href = `/cases?caseId=${id}`)} />
            ))}
          </div>
        </section>

        <section className="today-section-card today-tone-ready">
          <div className="today-section-header">
            <div className="today-section-title-group">
              <span className="today-section-accent" aria-hidden="true" />
              <h2 className="today-section-title">Sekcja 3: gotowe do ruszenia</h2>
            </div>
          </div>
          <div className="today-section-body">
            {readyCases.length === 0 ? <div className="empty-box">Brak spraw gotowych do startu.</div> : null}
            {readyCases.map((entry) => (
              <TodayCaseRow key={entry.id} entry={entry} onOpen={(id) => (window.location.href = `/cases?caseId=${id}`)} />
            ))}
          </div>
        </section>

        <section className="today-section-card today-tone-work">
          <div className="today-section-header">
            <div className="today-section-title-group">
              <span className="today-section-accent" aria-hidden="true" />
              <h2 className="today-section-title">Sekcja 4: dziś / overdue / ten tydzień / bez next step</h2>
            </div>
          </div>
          <div className="today-section-body">
            <div className="toolbar-row wrap">
              <span className="badge">dziś: {todayItems.length}</span>
              <span className="badge">overdue: {overdueItems.length}</span>
              <span className="badge">ten tydzień: {weekItems.length}</span>
              <span className="badge">bez next step: {leadsWithoutNextStep.length}</span>
            </div>

            {overdueItems.slice(0, 8).map((item) => (
              <TodayItemRow
                key={`over-${item.id}`}
                item={item}
                leadName={getItemLeadLabel(item, snapshot.leads)}
                onEdit={() => setEditingItem(item)}
                dateOptions={dateOptions}
              />
            ))}
            {todayItems.slice(0, 8).map((item) => (
              <TodayItemRow
                key={`today-${item.id}`}
                item={item}
                leadName={getItemLeadLabel(item, snapshot.leads)}
                onEdit={() => setEditingItem(item)}
                dateOptions={dateOptions}
              />
            ))}
            {weekItems.slice(0, 6).map((item) => (
              <TodayItemRow
                key={`week-${item.id}`}
                item={item}
                leadName={getItemLeadLabel(item, snapshot.leads)}
                onEdit={() => setEditingItem(item)}
                dateOptions={dateOptions}
              />
            ))}
            {leadsWithoutNextStep.slice(0, 6).map((lead) => (
              <TodayLeadRow key={`nonext-${lead.id}`} lead={lead} onOpen={() => setSelectedLead(lead)} />
            ))}
          </div>
        </section>

      {editingItem ? <ItemModal item={editingItem} onClose={() => setEditingItem(null)} /> : null}
      {selectedLead ? <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} /> : null}
      </PageShell>
    </div>
  )
}

function addDaysKey(dateKey: string, days: number) {
  const base = new Date(`${dateKey}T00:00:00.000Z`)
  base.setUTCDate(base.getUTCDate() + days)
  return base.toISOString().slice(0, 10)
}

