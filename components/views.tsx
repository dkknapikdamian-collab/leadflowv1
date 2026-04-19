"use client"

import { useSearchParams } from "next/navigation"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react"
import {
  ITEM_TYPE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  REMINDER_OPTIONS,
  SOURCE_OPTIONS,
  THEME_OPTIONS,
} from "@/lib/constants"
import { useAppStore } from "@/lib/store"
import type { Lead, WorkItem } from "@/lib/types"
import {
  findLeadByText,
  formatDateKeyMonthDay,
  formatDateKeyWeekday,
  formatDateTime,
  formatDayLabel,
  formatMoney,
  formatTime,
  formatWeekRangeLabel,
  fromInputValue,
  getCalendarItems,
  getCurrentDateKey,
  getDayOfMonth,
  getLeadActiveItemStats,
  getItemLeadLabel,
  getItemPrimaryDate,
  getItemTypeMeta,
  getNextDaySnoozeAtPreferredTime,
  getNextSnoozeByHours,
  getMonthGrid,
  getMonthIndex,
  getPriorityLabel,
  getStatusLabel,
  getTaskListItems,
  getWeekDays,
  getWeekOffsetFromCurrent,
  initials,
  isDone,
  isOverdue,
  isToday,
  normalizeSearchValue,
  nowIso,
  toDateKey,
  toInputValue,
} from "@/lib/utils"

function Avatar({ name }: { name: string }) {
  return <div className="avatar">{initials(name)}</div>
}

function LeadStatusBadge({ status }: { status: Lead["status"] }) {
  return <span className={`badge status-${status}`}>{getStatusLabel(status)}</span>
}

function PriorityBadge({ priority }: { priority: Lead["priority"] | WorkItem["priority"] }) {
  return <span className={`badge priority-${priority}`}>{getPriorityLabel(priority)}</span>
}

function ItemCard({
  item,
  leadName,
  onEdit,
  dateOptions,
}: {
  item: WorkItem
  leadName?: string
  onEdit?: () => void
  dateOptions?: { timeZone: string }
}) {
  const meta = getItemTypeMeta(item.type)
  return (
    <button className={`item-card ${isOverdue(item, dateOptions) ? "overdue" : ""}`} onClick={onEdit} type="button">
      <div className="item-card-top">
        <span className="item-icon">{meta.icon}</span>
        <div>
          <div className={`item-title ${isDone(item) ? "done" : ""}`}>{item.title}</div>
          <div className="item-meta-row">
            <span>{formatDayLabel(getItemPrimaryDate(item), dateOptions)}</span>
            <span>{leadName ?? "Bez leada"}</span>
          </div>
        </div>
      </div>
      {item.description ? <div className="item-description">{item.description}</div> : null}
    </button>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="stat-card">
      <div className="muted-small uppercase">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  )
}

function FieldLabel({ label, help }: { label: string; help?: string }) {
  return (
    <span className="field-label-row">
      <span>{label}</span>
      {help ? (
        <span className="field-help" title={help} aria-label={help} tabIndex={0}>
          ?
        </span>
      ) : null}
    </span>
  )
}

export function LeadDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const { snapshot, updateLead, deleteLead, toggleItemDone } = useAppStore()
  const dateOptions = { timeZone: snapshot.settings.timezone }
  const [tab, setTab] = useState<"info" | "timeline">("info")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const liveLead = snapshot.leads.find((entry) => entry.id === lead.id) ?? lead
  const [form, setForm] = useState(() => ({
    name: liveLead.name,
    company: liveLead.company,
    email: liveLead.email,
    phone: liveLead.phone,
    source: liveLead.source,
    value: String(liveLead.value ?? 0),
    summary: liveLead.summary,
    notes: liveLead.notes,
    status: liveLead.status,
    priority: liveLead.priority,
    nextActionTitle: liveLead.nextActionTitle,
    nextActionAt: liveLead.nextActionAt,
  }))

  useEffect(() => {
    setForm({
      name: liveLead.name,
      company: liveLead.company,
      email: liveLead.email,
      phone: liveLead.phone,
      source: liveLead.source,
      value: String(liveLead.value ?? 0),
      summary: liveLead.summary,
      notes: liveLead.notes,
      status: liveLead.status,
      priority: liveLead.priority,
      nextActionTitle: liveLead.nextActionTitle,
      nextActionAt: liveLead.nextActionAt,
    })
  }, [liveLead])

  const relatedItems = snapshot.items
    .filter((item) => item.leadId === liveLead.id)
    .sort((a, b) => getItemPrimaryDate(b).localeCompare(getItemPrimaryDate(a)))

  const hasChanges =
    form.name !== liveLead.name ||
    form.company !== liveLead.company ||
    form.email !== liveLead.email ||
    form.phone !== liveLead.phone ||
    form.source !== liveLead.source ||
    Number(form.value || 0) !== (liveLead.value ?? 0) ||
    form.summary !== liveLead.summary ||
    form.notes !== liveLead.notes ||
    form.status !== liveLead.status ||
    form.priority !== liveLead.priority ||
    form.nextActionTitle !== liveLead.nextActionTitle ||
    form.nextActionAt !== liveLead.nextActionAt

  function resetForm() {
    setForm({
      name: liveLead.name,
      company: liveLead.company,
      email: liveLead.email,
      phone: liveLead.phone,
      source: liveLead.source,
      value: String(liveLead.value ?? 0),
      summary: liveLead.summary,
      notes: liveLead.notes,
      status: liveLead.status,
      priority: liveLead.priority,
      nextActionTitle: liveLead.nextActionTitle,
      nextActionAt: liveLead.nextActionAt,
    })
  }

  function handleSave() {
    if (!form.name.trim()) return
    updateLead(liveLead.id, {
      name: form.name.trim(),
      company: form.company,
      email: form.email,
      phone: form.phone,
      source: form.source as Lead["source"],
      value: Number.isFinite(Number(form.value)) ? Number(form.value) : 0,
      summary: form.summary,
      notes: form.notes,
      status: form.status as Lead["status"],
      priority: form.priority as Lead["priority"],
      nextActionTitle: form.nextActionTitle,
      nextActionAt: form.nextActionAt,
    })
    onClose()
  }

  return (
    <div className="drawer-backdrop" role="presentation">
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="Szczegóły leada">
        <div className="drawer-header">
          <div className="drawer-user">
            <Avatar name={liveLead.name} />
            <div>
              <div className="drawer-title">{liveLead.name}</div>
              <div className="muted-small">{liveLead.company || "Bez firmy"}</div>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="drawer-tabs">
          <button className={tab === "info" ? "active" : ""} onClick={() => setTab("info")}>
            Dane
          </button>
          <button className={tab === "timeline" ? "active" : ""} onClick={() => setTab("timeline")}>
            Historia
          </button>
        </div>

        {tab === "info" ? (
          <div className="drawer-content">
            <div className="form-grid drawer-form-grid">
              <label className="field-block">
                <FieldLabel label="Lead *" help="Główna nazwa kontaktu albo firmy widoczna na listach." />
                <input className="text-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
              <label className="field-block">
                <FieldLabel label="Firma" help="Opcjonalna nazwa firmy przypisanej do leada." />
                <input className="text-input" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
              </label>
            </div>

            <div className="form-grid drawer-form-grid">
              <label className="field-block">
                <FieldLabel label="Status" help="Aktualny etap pracy z leadem." />
                <select
                  className="select-input"
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value as Lead["status"] })}
                >
                  {LEAD_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block">
                <FieldLabel label="Priorytet" help="Pomaga ustalić kolejność działania." />
                <select
                  className="select-input"
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value as Lead["priority"] })}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-grid drawer-form-grid">
              <label className="field-block">
                <FieldLabel label="Źródło" help="Skąd przyszedł ten lead." />
                <select
                  className="select-input"
                  value={form.source}
                  onChange={(event) => setForm({ ...form, source: event.target.value as Lead["source"] })}
                >
                  {SOURCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block">
                <FieldLabel label="Wartość" help="Szacowana wartość leada lub dealu." />
                <input
                  type="number"
                  min="0"
                  step="100"
                  className="text-input"
                  value={form.value}
                  onChange={(event) => setForm({ ...form, value: event.target.value })}
                />
              </label>
            </div>

            <div className="form-grid drawer-form-grid">
              <label className="field-block">
                <FieldLabel label="E-mail" help="Adres mailowy kontaktu." />
                <input className="text-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              </label>
              <label className="field-block">
                <FieldLabel label="Telefon" help="Numer telefonu kontaktu." />
                <input className="text-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </label>
            </div>

            <div className="form-grid drawer-form-grid">
              <label className="field-block">
                <FieldLabel label="Next action" help="Najbliższa planowana akcja przy tym leadzie." />
                <input
                  className="text-input"
                  value={form.nextActionTitle}
                  onChange={(event) => setForm({ ...form, nextActionTitle: event.target.value })}
                />
              </label>
              <label className="field-block">
                <FieldLabel label="Termin" help="Data i godzina tej planowanej akcji." />
                <input
                  type="datetime-local"
                  className="text-input date-time-input"
                  value={toInputValue(form.nextActionAt)}
                  onChange={(event) => setForm({ ...form, nextActionAt: fromInputValue(event.target.value) })}
                />
              </label>
            </div>

            <label className="field-block">
              <FieldLabel label="Opis" help="Krótki opis sytuacji lub kontekstu leada." />
              <textarea className="text-area" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
            </label>

            <label className="field-block">
              <FieldLabel label="Notatki" help="Twoje robocze notatki do leada." />
              <textarea className="text-area" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </label>

            <div className="info-card">
              <div className="info-row">
                <strong>Aktywne działania</strong>
                <span>{relatedItems.filter((item) => item.status !== "done").length}</span>
              </div>
              <div className="info-row">
                <strong>Historia wpisów</strong>
                <span>{relatedItems.length}</span>
              </div>
              <div className="info-row">
                <strong>Utworzono</strong>
                <span>{formatDateTime(liveLead.createdAt, dateOptions)}</span>
              </div>
              <div className="info-row">
                <strong>Aktualizacja</strong>
                <span>{formatDateTime(liveLead.updatedAt, dateOptions)}</span>
              </div>
            </div>

            <div className="drawer-actions drawer-actions-between wrap">
              <button className="danger-button" onClick={() => setShowDeleteConfirm(true)} type="button">
                Usuń leada
              </button>
              <div className="drawer-actions wrap">
                <button className="ghost-button" onClick={resetForm} type="button" disabled={!hasChanges}>
                  Cofnij zmiany
                </button>
                <button className="primary-button" onClick={handleSave} type="button" disabled={!hasChanges || !form.name.trim()}>
                  Zapisz zmiany
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="drawer-content">
            {relatedItems.length === 0 ? <div className="empty-box">Brak historii dla tego leada.</div> : null}
            {relatedItems.map((item) => (
              <div key={item.id} className="timeline-row">
                <div>
                  <div className="timeline-title">{item.title}</div>
                  <div className="muted-small">{formatDateTime(getItemPrimaryDate(item), dateOptions)}</div>
                </div>
                <button className="ghost-button small" onClick={() => toggleItemDone(item.id)} type="button">
                  {item.status === "done" ? "Przywróć" : "Zrobione"}
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Usunąć leada?"
        description="Usunięcie leada skasuje też powiązane działania i wydarzenia. Tej operacji nie cofnisz."
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteLead(liveLead.id)
          setShowDeleteConfirm(false)
          onClose()
        }}
      />
    </div>
  )
}

export function LeadsPageView() {
  const { snapshot } = useAppStore()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const isMobileProfile = snapshot.settings.viewProfile === "mobile"

  const normalizedQuery = normalizeSearchValue(query)
  const filtered = snapshot.leads.filter((lead) => {
    const searchableText = normalizeSearchValue(`${lead.name} ${lead.company} ${lead.email} ${lead.phone} ${lead.source}`)
    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery)
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesQuery && matchesStatus
  })

  return (
    <>
      <section className="hero-row">
        <div>
          <h1 className="page-title">Leady</h1>
          <p className="page-subtitle">Pełna lista leadów z szybkim podglądem statusu, wartości i aktywnych działań.</p>
        </div>
      </section>

      <section className={`panel-card lead-table-card${isMobileProfile ? " lead-mobile-card" : ""}`}>
        <div className="toolbar-row wrap">
          <input
            className="text-input"
            placeholder="Szukaj po nazwie, firmie, mailu, telefonie lub źródle"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select className="select-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Wszystkie statusy</option>
            {LEAD_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isMobileProfile ? (
          <div className="lead-mobile-list">
            {filtered.length === 0 ? <div className="empty-box">{snapshot.leads.length === 0 && !query && statusFilter === "all" ? "Dodaj pierwszego leada." : "Brak wyników."}</div> : null}
            {filtered.map((lead) => {
              const stats = getLeadActiveItemStats(lead.id, snapshot.items, { timeZone: snapshot.settings.timezone })
              return (
                <button key={lead.id} className="lead-mobile-row" onClick={() => setSelectedLead(lead)} type="button">
                  <div className="lead-mobile-top">
                    <div className="lead-mobile-main">
                      <Avatar name={lead.name} />
                      <div className="lead-mobile-text">
                        <div className="lead-name">{lead.name}</div>
                        <div className="lead-mobile-meta-line">
                          <span>{lead.company || lead.source}</span>
                          <span>•</span>
                          <span>{formatMoney(lead.value)}</span>
                          <span>•</span>
                          <span>
                            {stats.activeCount > 0 ? `${stats.activeCount} zad.` : "0 zad."}
                            {stats.overdueCount > 0 ? <span className="lead-table-overdue"> · {stats.overdueCount} zaległe</span> : null}
                          </span>
                        </div>
                      </div>
                    </div>
                    <LeadStatusBadge status={lead.status} />
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="lead-table">
            <div className="lead-table-header" role="row">
              <div>KLIENT</div>
              <div>STATUS</div>
              <div>ŹRÓDŁO</div>
              <div>WARTOŚĆ</div>
              <div>AKTYWNE ZADANIA</div>
            </div>

            <div className="lead-table-body">
              {filtered.length === 0 ? <div className="empty-box">{snapshot.leads.length === 0 && !query && statusFilter === "all" ? "Dodaj pierwszego leada." : "Brak wyników."}</div> : null}
              {filtered.map((lead) => {
                const stats = getLeadActiveItemStats(lead.id, snapshot.items, { timeZone: snapshot.settings.timezone })
                return (
                  <button key={lead.id} className="lead-table-row" onClick={() => setSelectedLead(lead)} type="button">
                    <div className="lead-table-client">
                      <Avatar name={lead.name} />
                      <div className="lead-table-client-text">
                        <div className="lead-name">{lead.name}</div>
                        <div className="muted-small">{lead.company || "Bez firmy"}</div>
                      </div>
                    </div>
                    <div className="lead-table-status">
                      <LeadStatusBadge status={lead.status} />
                    </div>
                    <div className="lead-table-source">{lead.source}</div>
                    <div className="lead-table-value">{formatMoney(lead.value)}</div>
                    <div className="lead-table-tasks">
                      <span>{stats.activeCount > 0 ? stats.activeCount : "—"}</span>
                      {stats.overdueCount > 0 ? <span className="lead-table-overdue">({stats.overdueCount}↑)</span> : null}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {selectedLead ? <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} /> : null}
    </>
  )
}

export function TasksPageView() {
  const { snapshot, deleteItem, snoozeItem, toggleItemDone } = useAppStore()
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<WorkItem | null>(null)
  const [tab, setTab] = useState<"today" | "overdue" | "done">("today")

  const taskItems = useMemo(() => getTaskListItems(snapshot.items), [snapshot.items])

  const list = useMemo(() => {
    if (tab === "today") {
      return taskItems.filter((item) => isToday(getItemPrimaryDate(item), { timeZone: snapshot.settings.timezone }))
    }
    if (tab === "overdue") {
      return taskItems.filter((item) => isOverdue(item, { timeZone: snapshot.settings.timezone }))
    }
    return taskItems.filter((item) => item.status === "done")
  }, [snapshot.settings.timezone, tab, taskItems])

  return (
    <>
      <section className="hero-row">
        <div>
          <h1 className="page-title">Zadania</h1>
          <p className="page-subtitle">Tu masz taski, follow-upy i szybkie odkładanie na później.</p>
        </div>
      </section>

      <section className="panel-card">
        <div className="segmented-tabs">
          {[
            { key: "today", label: "Dziś" },
            { key: "overdue", label: "Zaległe" },
            { key: "done", label: "Zrobione" },
          ].map((tabOption) => (
            <button
              key={tabOption.key}
              className={tab === tabOption.key ? "active" : ""}
              onClick={() => setTab(tabOption.key as typeof tab)}
            >
              {tabOption.label}
            </button>
          ))}
        </div>

        <div className="stack-list">
          {list.length === 0 ? <div className="empty-box">{taskItems.length === 0 ? "Dodaj pierwsze zadanie." : "Brak wpisów w tej sekcji."}</div> : null}
          {list.map((item) => (
            <div key={item.id} className="task-row">
              <ItemCard
                item={item}
                leadName={getItemLeadLabel(item, snapshot.leads)}
                onEdit={() => setEditingItem(item)}
                dateOptions={{ timeZone: snapshot.settings.timezone }}
              />
              <div className="task-actions">
                <button className="ghost-button small" onClick={() => toggleItemDone(item.id)}>
                  {item.status === "done" ? "Cofnij" : "Zrobione"}
                </button>
                <button
                  className="ghost-button small"
                  onClick={() =>
                    snoozeItem(
                      item.id,
                      getNextSnoozeByHours(getItemPrimaryDate(item), 1, { timeZone: snapshot.settings.timezone }),
                    )
                  }
                >
                  +1h
                </button>
                <button
                  className="ghost-button small"
                  onClick={() =>
                    snoozeItem(
                      item.id,
                      getNextDaySnoozeAtPreferredTime(getItemPrimaryDate(item), { timeZone: snapshot.settings.timezone }),
                    )
                  }
                >
                  Jutro
                </button>
                <button className="danger-button small" onClick={() => setItemToDelete(item)}>
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editingItem ? <ItemModal item={editingItem} onClose={() => setEditingItem(null)} /> : null}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        title="Usunąć działanie?"
        description="To działanie zostanie trwale usunięte z listy i kalendarza."
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (!itemToDelete) return
          deleteItem(itemToDelete.id)
          setItemToDelete(null)
        }}
      />
    </>
  )
}

export function CalendarPageView() {
  const { snapshot } = useAppStore()
  const searchParams = useSearchParams()
  const requestedDay = searchParams.get("day")
  const fallbackDay = getCurrentDateKey({ timeZone: snapshot.settings.timezone })
  const safeRequestedDay = requestedDay && /^\d{4}-\d{2}-\d{2}$/.test(requestedDay) ? requestedDay : fallbackDay
  const [weekOffset, setWeekOffset] = useState(() => getWeekOffsetFromCurrent(safeRequestedDay, { timeZone: snapshot.settings.timezone }))
  const [selectedDay, setSelectedDay] = useState<string>(safeRequestedDay)
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [showMobileWeek, setShowMobileWeek] = useState(true)
  const [showMobileMonth, setShowMobileMonth] = useState(true)
  const isMobileProfile = snapshot.settings.viewProfile === "mobile"

  useEffect(() => {
    setSelectedDay(safeRequestedDay)
    setWeekOffset(getWeekOffsetFromCurrent(safeRequestedDay, { timeZone: snapshot.settings.timezone }))
  }, [safeRequestedDay, snapshot.settings.timezone])

  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const week = getWeekDays(weekOffset, selectedDay || fallbackDay, dateOptions)
  const weekLabel = useMemo(() => {
    return formatWeekRangeLabel(week)
  }, [week])

  const selectedMonthBase = useMemo(() => (selectedDay ? selectedDay : getCurrentDateKey(dateOptions)), [dateOptions, selectedDay])
  const monthGrid = useMemo(() => getMonthGrid(selectedMonthBase, dateOptions), [dateOptions, selectedMonthBase])
  const currentMonth = getMonthIndex(selectedMonthBase, dateOptions)
  const calendarItems = useMemo(() => getCalendarItems(snapshot.items), [snapshot.items])
  const hasCalendarItems = calendarItems.length > 0

  const itemsByDay = useMemo(() => {
    const mapped = new Map<string, WorkItem[]>()
    calendarItems.forEach((item) => {
      const key = toDateKey(getItemPrimaryDate(item), dateOptions)
      if (!key) return
      const list = mapped.get(key) ?? []
      list.push(item)
      mapped.set(key, list)
    })
    mapped.forEach((list, key) => {
      mapped.set(
        key,
        [...list].sort((a, b) => getItemPrimaryDate(a).localeCompare(getItemPrimaryDate(b))),
      )
    })
    return mapped
  }, [calendarItems, dateOptions])

  function renderWeekPill(item: WorkItem) {
    const meta = getItemTypeMeta(item.type)
    const leadLabel = getItemLeadLabel(item, snapshot.leads)
    const timeLabel = formatTime(getItemPrimaryDate(item), dateOptions)

    return (
      <button key={item.id} className={`week-pill week-pill-${item.priority}`} onClick={() => setEditingItem(item)} type="button">
        <div className="week-pill-top">
          <span className="week-pill-meta">
            <span className="week-pill-icon" aria-hidden="true">{meta.icon}</span>
            <span>{timeLabel}</span>
          </span>
        </div>
        <div className="week-pill-title">{item.title}</div>
        {leadLabel ? <div className="week-pill-lead">{leadLabel}</div> : null}
      </button>
    )
  }

  const selectedDayItems = itemsByDay.get(selectedDay) ?? []
  const todayKey = getCurrentDateKey(dateOptions)

  return (
    <>
      <section className="hero-row split">
        <div>
          <h1 className="page-title">Kalendarz</h1>
          <p className="page-subtitle">{weekLabel}</p>
        </div>
        <div className="header-actions">
          <button className="ghost-button" onClick={() => setWeekOffset((value) => value - 1)}>
            ←
          </button>
          <button
            className="ghost-button"
            onClick={() => {
              setWeekOffset(0)
              setSelectedDay(fallbackDay)
            }}
          >
            Dziś
          </button>
          <button className="ghost-button" onClick={() => setWeekOffset((value) => value + 1)}>
            →
          </button>
        </div>
      </section>

      {isMobileProfile ? (
        <section className="calendar-mobile-stack">
          <div className="calendar-mobile-visibility-row">
            <label className="switch-row calendar-mobile-visibility-toggle">
              <input type="checkbox" checked={showMobileWeek} onChange={(event) => setShowMobileWeek(event.target.checked)} />
              <span>Pokaż tydzień</span>
            </label>
            <label className="switch-row calendar-mobile-visibility-toggle">
              <input type="checkbox" checked={showMobileMonth} onChange={(event) => setShowMobileMonth(event.target.checked)} />
              <span>Pokaż miesiąc</span>
            </label>
          </div>

          {showMobileWeek ? (
            <div className="calendar-mobile-week-list">
              {week.map((day) => {
                const dayKey = toDateKey(day, dateOptions)
                const items = itemsByDay.get(dayKey) ?? []
                const isOpen = selectedDay === dayKey

                return (
                  <article key={day} className={`calendar-mobile-day ${isOpen ? "open" : ""}`}>
                    <button
                      className="calendar-mobile-day-button"
                      type="button"
                      onClick={() => setSelectedDay((current) => (current === dayKey ? "" : dayKey))}
                    >
                      <div>
                        <div className="calendar-mobile-day-label">{formatDateKeyWeekday(day, { weekday: "long" })}</div>
                        <div className="calendar-mobile-day-date">{formatDateKeyMonthDay(day, { numericMonth: true, day: "2-digit" })}</div>
                      </div>
                    </button>
                    {isOpen ? (
                      <div className="calendar-mobile-day-items">
                        {items.length === 0 ? <div className="empty-box">{hasCalendarItems ? "Brak wydarzeń w tym dniu." : "Dodaj pierwsze wydarzenie."}</div> : items.map((item) => renderWeekPill(item))}
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          ) : null}

          {showMobileMonth ? (
            <div className="calendar-mobile-month-view">
              <div className="calendar-mobile-month-grid">
                {monthGrid.map((day) => {
                  const dayKey = toDateKey(day, dateOptions)
                  const hasItems = (itemsByDay.get(dayKey) ?? []).length > 0
                  const isCurrentMonth = getMonthIndex(day, dateOptions) === currentMonth
                  const isSelected = selectedDay === dayKey
                  const isToday = todayKey === dayKey
                  return (
                    <button
                      key={day}
                      type="button"
                      className={`calendar-mobile-month-cell ${!isCurrentMonth ? "dimmed" : ""} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                      onClick={() => {
                        setSelectedDay(dayKey)
                        setWeekOffset(getWeekOffsetFromCurrent(dayKey, { timeZone: snapshot.settings.timezone }))
                      }}
                    >
                      <span>{getDayOfMonth(day)}</span>
                      {hasItems ? <span className="calendar-mobile-month-dot" /> : null}
                    </button>
                  )
                })}
              </div>
              <div className="calendar-mobile-selected-list">
                {selectedDayItems.length === 0 ? <div className="empty-box">{hasCalendarItems ? "Brak wydarzeń w wybranym dniu." : "Dodaj pierwsze wydarzenie."}</div> : selectedDayItems.map((item) => renderWeekPill(item))}
              </div>
            </div>
          ) : null}

          {!showMobileWeek && !showMobileMonth ? <div className="empty-box">Zaznacz tydzień albo miesiąc.</div> : null}
        </section>
      ) : (
        <section className="calendar-layout calendar-layout-week-only">
          <div className="panel-card grow-panel calendar-week-panel">
            {hasCalendarItems ? (
              <div className="week-grid week-grid-tight">
                {week.map((day) => {
                  const dayKey = toDateKey(day, dateOptions)
                  const items = itemsByDay.get(dayKey) ?? []

                  return (
                    <div key={day} className={`week-column ${selectedDay === dayKey ? "selected" : ""}`}>
                      <button className="week-head" onClick={() => setSelectedDay(dayKey)}>
                        <span>{formatDateKeyWeekday(day, { weekday: "short" })}</span>
                        <strong>{getDayOfMonth(day)}</strong>
                      </button>
                      <div className="week-items">
                        {items.length === 0 ? <div className="week-empty" /> : null}
                        {items.map((item) => renderWeekPill(item))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="empty-box">Dodaj pierwsze wydarzenie.</div>
            )}
          </div>
        </section>
      )}

      {editingItem ? <ItemModal item={editingItem} onClose={() => setEditingItem(null)} /> : null}
    </>
  )
}

export function BillingPageView() {
  const { snapshot } = useAppStore()
  const statusLabel =
    snapshot.billing.status === "active"
      ? "Aktywna"
      : snapshot.billing.status === "trial"
        ? "Trial"
        : "Wymaga płatności"

  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Billing</h1>
          <p className="page-subtitle">Plan konta i stan dostępu do aplikacji.</p>
        </div>
      </div>

      <div className="panel-card large-card">
        <div className="billing-price">{snapshot.billing.planName}</div>
        <div className="billing-status-row">
          <span className={`badge plan-${snapshot.billing.status}`}>{statusLabel}</span>
          <span className="muted-small">Odnowienie: {formatDateTime(snapshot.billing.renewAt, { timeZone: snapshot.settings.timezone })}</span>
        </div>
        <p className="note-text">Stan planu i dostęp do tworzenia nowych wpisów są widoczne tutaj.</p>
      </div>
    </section>
  )
}
export function SettingsPageView() {
  const { snapshot, updateSettings } = useAppStore()
  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Ustawienia</h1>
          <p className="page-subtitle">Preferencje przypomnień, workspace i podstawowe ustawienia aplikacji.</p>
        </div>
      </div>

      <div className="panel-card settings-grid">
        <label className="field-block">
          <span>Workspace</span>
          <input
            className="text-input"
            value={snapshot.settings.workspaceName}
            onChange={(event) => updateSettings({ workspaceName: event.target.value })}
          />
        </label>
        <label className="field-block">
          <span>Strefa czasowa</span>
          <input
            className="text-input"
            value={snapshot.settings.timezone}
            onChange={(event) => updateSettings({ timezone: event.target.value })}
          />
        </label>
        <label className="switch-row">
          <input
            type="checkbox"
            checked={snapshot.settings.inAppReminders}
            onChange={(event) => updateSettings({ inAppReminders: event.target.checked })}
          />
          <span>Przypomnienia in-app</span>
        </label>
        <label className="switch-row">
          <input
            type="checkbox"
            checked={snapshot.settings.emailReminders}
            onChange={(event) => updateSettings({ emailReminders: event.target.checked })}
          />
          <span>Przypomnienia e-mail</span>
        </label>
        <label className="field-block full-span">
          <span>Domyślne przypomnienie</span>
          <select
            className="select-input"
            value={snapshot.settings.defaultReminder}
            onChange={(event) => updateSettings({ defaultReminder: event.target.value as typeof snapshot.settings.defaultReminder })}
          >
            {REMINDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="field-block full-span">
          <span>Szata graficzna</span>
          <div className="theme-picker-grid" role="radiogroup" aria-label="Wybór szaty graficznej">
            {THEME_OPTIONS.map((option) => {
              const isActive = snapshot.settings.theme === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`theme-card${isActive ? " active" : ""}`}
                  onClick={() => updateSettings({ theme: option.value })}
                  role="radio"
                  aria-checked={isActive}
                >
                  <div className={`theme-card-preview theme-card-preview-${option.value}`} aria-hidden="true">
                    <span className="theme-card-swatch" />
                    <span className="theme-card-swatch" />
                    <span className="theme-card-swatch" />
                    <span className="theme-card-swatch" />
                  </div>
                  <div className="theme-card-title-row">
                    <strong>{option.label}</strong>
                    {isActive ? <span className="badge theme-card-badge">Aktywny</span> : null}
                  </div>
                  <div className="muted-small">{option.description}</div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="muted-small full-span">Zmiany zapisują się automatycznie po edycji pól.</div>
      </div>
    </section>
  )
}
export function LeadModal({ onClose }: { onClose: () => void }) {
  const { addLead, snapshot } = useAppStore()
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: SOURCE_OPTIONS[0],
    value: "0",
    summary: "",
    notes: "",
    status: LEAD_STATUS_OPTIONS[0].value,
    priority: PRIORITY_OPTIONS[1].value,
    nextActionTitle: "",
    nextActionAt: nowIso(),
  })

  const blocked = !snapshot.billing.canCreate

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (blocked || !form.name.trim()) return
    addLead({ ...form, value: Number.isFinite(Number(form.value)) ? Number(form.value) : 0 })
    onClose()
  }

  return (
    <ModalShell title="Dodaj lead" onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <label className="field-block">
          <span>Imię i nazwisko *</span>
          <input className="text-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <div className="form-grid">
          <label className="field-block">
            <span>Firma</span>
            <input className="text-input" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
          </label>
          <label className="field-block">
            <span>Źródło</span>
            <select className="select-input" value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value as Lead["source"] })}>
              {SOURCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field-block">
          <span>Wartość</span>
          <input
            type="number"
            min="0"
            step="100"
            className="text-input"
            value={form.value}
            onChange={(event) => setForm({ ...form, value: event.target.value })}
          />
        </label>
        <div className="form-grid">
          <label className="field-block">
            <span>E-mail</span>
            <input className="text-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label className="field-block">
            <span>Telefon</span>
            <input className="text-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </label>
        </div>
        <label className="field-block">
          <span>Krótki opis</span>
          <textarea className="text-area" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
        </label>
        <label className="field-block">
          <span>Notatki</span>
          <textarea className="text-area" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        </label>
        <div className="form-grid">
          <label className="field-block">
            <span>Status</span>
            <select className="select-input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Lead["status"] })}>
              {LEAD_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-block">
            <span>Priorytet</span>
            <select className="select-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Lead["priority"] })}>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-grid">
          <label className="field-block">
            <span>Next action</span>
            <input className="text-input" value={form.nextActionTitle} onChange={(event) => setForm({ ...form, nextActionTitle: event.target.value })} />
          </label>
          <label className="field-block">
            <span>Termin</span>
            <input
              type="datetime-local"
              className="text-input date-time-input"
              value={toInputValue(form.nextActionAt)}
              onChange={(event) => setForm({ ...form, nextActionAt: fromInputValue(event.target.value) })}
            />
          </label>
        </div>
        <div className="toolbar-row end">
          <button type="button" className="ghost-button" onClick={onClose}>
            Anuluj
          </button>
          <button type="submit" className="primary-button" disabled={blocked}>
            Dodaj
          </button>
        </div>
        {blocked ? <div className="danger-text">Dodawanie zablokowane przez status subskrypcji.</div> : null}
      </form>
    </ModalShell>
  )
}

export function ItemModal({ item, onClose }: { item?: WorkItem; onClose: () => void }) {
  const { addItem, deleteItem, snapshot, updateItem } = useAppStore()
  const suggestionValues = useMemo(
    () => Array.from(new Set(snapshot.leads.map((lead) => lead.name.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pl")),
    [snapshot.leads],
  )
  const [form, setForm] = useState(() => ({
    type: item?.type ?? ITEM_TYPE_OPTIONS[0].value,
    leadText: item ? getItemLeadLabel(item, snapshot.leads) : "",
    title: item?.title ?? "",
    description: item?.description ?? "",
    priority: item?.priority ?? PRIORITY_OPTIONS[1].value,
    date: toInputValue(item?.startAt || item?.scheduledAt || nowIso()),
    reminder: item?.reminder ?? snapshot.settings.defaultReminder,
    recurrence: item?.recurrence ?? "none",
    showInTasks: item?.showInTasks ?? true,
    showInCalendar: item?.showInCalendar ?? true,
  }))

  const blocked = !snapshot.billing.canCreate && !item
  const isEvent = ["meeting", "deadline", "other"].includes(form.type)
  const normalizedLeadText = form.leadText.trim()
  const matchedLead = normalizedLeadText ? findLeadByText(normalizedLeadText, snapshot.leads) : undefined
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const hasLeadLink = Boolean(matchedLead)
  const leadRelationHint = normalizedLeadText
    ? hasLeadLink
      ? `Powiązanie z leadem: ${matchedLead?.name}`
      : "Nie znaleziono istniejącego leada. Wpis zapisze się bez powiązania." 
    : "Pozostaw puste, jeśli wpis nie ma być powiązany z leadem."

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.title.trim() || blocked) return

    const payload = {
      leadId: matchedLead?.id ?? null,
      leadLabel: matchedLead?.name ?? "",
      recordType: (isEvent ? "event" : "task") as WorkItem["recordType"],
      type: form.type as WorkItem["type"],
      title: form.title.trim(),
      description: form.description,
      status: item?.status ?? "todo",
      priority: form.priority as WorkItem["priority"],
      scheduledAt: isEvent ? "" : fromInputValue(form.date),
      startAt: isEvent ? fromInputValue(form.date) : "",
      endAt: isEvent ? fromInputValue(form.date) : "",
      recurrence: form.recurrence as WorkItem["recurrence"],
      reminder: form.reminder as WorkItem["reminder"],
      showInTasks: form.showInTasks,
      showInCalendar: form.showInCalendar,
    }

    if (item) {
      updateItem(item.id, payload)
    } else {
      addItem(payload)
    }
    onClose()
  }

  return (
    <>
      <ModalShell title={item ? "Edytuj działanie" : "Dodaj działanie"} onClose={onClose} size="compact">
        <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field-block">
            <FieldLabel label="Typ" help="Typ określa, czy to jest zadanie, follow-up, rozmowa albo wydarzenie w kalendarzu." />
            <select className="select-input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as WorkItem["type"] })}>
              {ITEM_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-block">
            <FieldLabel
              label="Lead"
              help="Wybierz istniejącego leada z podpowiedzi albo zostaw pole puste. Sam tekst bez dopasowania nie tworzy powiązania."
            />
            <input
              list="lead-suggestions"
              className="text-input"
              value={form.leadText}
              onChange={(event) => setForm({ ...form, leadText: event.target.value })}
              placeholder="Np. Marcin Nowak"
            />
            <datalist id="lead-suggestions">
              {suggestionValues.map((value) => (
                <option key={value} value={value} />
              ))}
            </datalist>
            <div className={`field-hint ${normalizedLeadText && !hasLeadLink ? "danger-text" : ""}`}>{leadRelationHint}</div>
          </label>
        </div>

        <label className="field-block">
          <FieldLabel label="Tytuł *" help="Krótka nazwa wpisu widoczna na listach i w kalendarzu." />
          <input className="text-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </label>

        <label className="field-block">
          <FieldLabel label="Opis" help="Tu możesz dopisać szczegóły zadania, rozmowy albo spotkania." />
          <textarea className="text-area" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </label>

        <div className="form-grid">
          <label className="field-block">
            <FieldLabel
              label={isEvent ? "Data i godzina" : "Termin"}
              help={
                isEvent
                  ? "To termin tego konkretnego spotkania lub wydarzenia, a nie data poznania leada."
                  : "To termin wykonania tego zadania albo follow-upu, a nie data poznania leada."
              }
            />
            <input
              type="datetime-local"
              className="text-input date-time-input"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </label>
          <label className="field-block">
            <FieldLabel label="Priorytet" help="Priorytet pomaga szybciej ocenić, co zrobić najpierw." />
            <select className="select-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as WorkItem["priority"] })}>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-grid">
          <label className="field-block">
            <FieldLabel label="Przypomnienie" help="Ustawia, kiedy aplikacja ma przypomnieć o tym wpisie." />
            <select className="select-input" value={form.reminder} onChange={(event) => setForm({ ...form, reminder: event.target.value as WorkItem["reminder"] })}>
              {REMINDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-block">
            <FieldLabel label="Cykliczność" help="Jeśli wpis ma wracać regularnie, ustaw to tutaj." />
            <select className="select-input" value={form.recurrence} onChange={(event) => setForm({ ...form, recurrence: event.target.value as WorkItem["recurrence"] })}>
              {REMINDER_OPTIONS.filter((option) => option.value !== "at_time" && option.value !== "1h_before").map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="checkbox-row">
          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.showInTasks}
              onChange={(event) => setForm({ ...form, showInTasks: event.target.checked })}
            />
            <span title="Po włączeniu wpis będzie widoczny na listach zadań i na ekranie Dziś.">Pokaż w zadaniach</span>
          </label>
          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.showInCalendar}
              onChange={(event) => setForm({ ...form, showInCalendar: event.target.checked })}
            />
            <span title="Po włączeniu wpis będzie widoczny w kalendarzu tygodniowym i mini miesiącu.">Pokaż w kalendarzu</span>
          </label>
        </div>

        <div className="toolbar-row end wrap">
          {item ? (
            <button type="button" className="danger-button" onClick={() => setShowDeleteConfirm(true)}>
              Usuń
            </button>
          ) : null}
          <button type="button" className="ghost-button" onClick={onClose}>
            Anuluj
          </button>
          <button type="submit" className="primary-button" disabled={blocked}>
            {item ? "Zapisz" : "Dodaj"}
          </button>
        </div>
        {blocked ? <div className="danger-text">Dodawanie zablokowane przez status subskrypcji.</div> : null}
      </form>
      </ModalShell>
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Usunąć działanie?"
        description="To działanie zostanie trwale usunięte z listy i kalendarza."
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (!item) return
          deleteItem(item.id)
          setShowDeleteConfirm(false)
          onClose()
        }}
      />
    </>
  )
}

function ModalShell({
  title,
  children,
  onClose,
  size = "default",
}: {
  title: string
  children: ReactNode
  onClose: () => void
  size?: "default" | "compact"
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className={`modal-card${size === "compact" ? " modal-card-compact" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
