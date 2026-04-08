"use client"

import { useSearchParams } from "next/navigation"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { CaseCreateModal } from "@/components/case-create-modal"
import { ViewState } from "@/components/ui/view-state"
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react"
import {
  CASE_OPERATIONAL_STATUS_OPTIONS,
  ITEM_TYPE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  REMINDER_OPTIONS,
  SOURCE_OPTIONS,
  THEME_OPTIONS,
} from "@/lib/constants"
import { useAppStore } from "@/lib/store"
import {
  buildLeadComputedState,
  buildLeadsWithComputedState,
  formatLeadAlarmReasonLabel,
  getLeadLastTouch,
  getLeadNextStep,
  type LeadWithComputedState,
} from "@/lib/domain/lead-state"
import type { CaseStatus, Lead, WorkItem, WorkItemInput } from "@/lib/types"
import {
  findLeadByText,
  formatDateKeyMonthDay,
  formatDateKeyWeekday,
  formatDateTime,
  formatDayLabel,
  getDateKeyDiff,
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

function getCaseOperationalStatusLabel(status: CaseStatus) {
  return CASE_OPERATIONAL_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status
}

function CaseOperationalStatusBadge({ status }: { status: CaseStatus }) {
  return <span className={`badge status-${status}`}>Operacje: {getCaseOperationalStatusLabel(status)}</span>
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
  const { snapshot, addItem, updateLead, deleteLead, toggleItemDone, startCaseFromLead, issueClientPortalLink } = useAppStore()
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const [tab, setTab] = useState<"overview" | "timeline">("overview")
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCaseCreateModal, setShowCaseCreateModal] = useState(false)
  const liveLead = snapshot.leads.find((entry) => entry.id === lead.id) ?? lead
  const relatedCase = snapshot.cases?.find((entry) => entry.id === liveLead.caseId) ?? null
  const operationalStatus = relatedCase?.status ?? "not_started"
  const canStartOperations = liveLead.status === "won" || operationalStatus === "ready_to_start"
  const caseTemplates = snapshot.caseTemplates ?? []
  const [startMode, setStartMode] = useState<"empty" | "template" | "template_with_link">("empty")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const computed = useMemo(() => buildLeadComputedState(snapshot, liveLead, dateOptions), [dateOptions, liveLead, snapshot])
  const nextStep = useMemo(() => getLeadNextStep(snapshot, liveLead, dateOptions), [dateOptions, liveLead, snapshot])
  const lastTouch = useMemo(() => getLeadLastTouch(snapshot, liveLead, dateOptions), [dateOptions, liveLead, snapshot])
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
    setMode("view")
    setTab("overview")
  }, [liveLead])

  useEffect(() => {
    const fallbackTemplate = caseTemplates.find((item) => item.isDefault) ?? caseTemplates[0]
    setSelectedTemplateId(fallbackTemplate?.id ?? "")
  }, [caseTemplates])

  const relatedItems = useMemo(
    () =>
      snapshot.items
        .filter((item) => item.leadId === liveLead.id)
        .sort((a, b) => getItemPrimaryDate(b).localeCompare(getItemPrimaryDate(a))),
    [liveLead.id, snapshot.items],
  )

  const openItems = relatedItems.filter((item) => item.status !== "done" && item.recordType !== "note")
  const latestTimeline = relatedItems.slice(0, 6)
  const riskLabel = formatLeadAlarmReasonLabel(computed.riskReason) || "Lead pod kontrolą"
  const statusTone = computed.isAtRisk ? "#dc2626" : "#16a34a"

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
    setMode("view")
  }

  function createQuickItem(input: Partial<WorkItemInput> & Pick<WorkItemInput, "type" | "title">) {
    const payload: WorkItemInput = {
      leadId: liveLead.id,
      leadLabel: liveLead.name,
      recordType: input.recordType ?? (input.type === "meeting" || input.type === "deadline" ? "event" : "task"),
      type: input.type,
      title: input.title,
      description: input.description ?? "Dodane szybkim ruchem z widoku leada.",
      status: input.status ?? "todo",
      priority: input.priority ?? liveLead.priority,
      scheduledAt: input.scheduledAt ?? (input.recordType === "event" ? "" : liveLead.nextActionAt || nowIso()),
      startAt: input.startAt ?? "",
      endAt: input.endAt ?? "",
      recurrence: input.recurrence ?? "none",
      reminder: input.reminder ?? snapshot.settings.defaultReminder,
      showInTasks: input.showInTasks ?? true,
      showInCalendar: input.showInCalendar ?? (input.type === "meeting"),
    }
    addItem(payload)
  }

  function addTomorrowFollowUp() {
    const expectsReply = liveLead.status === "offer_sent" || liveLead.status === "follow_up"
    createQuickItem({
      type: expectsReply ? "check_reply" : "follow_up",
      title: expectsReply ? `Sprawdzić odpowiedź — ${liveLead.name}` : `Follow-up — ${liveLead.name}`,
      scheduledAt: getNextDaySnoozeAtPreferredTime(liveLead.nextActionAt || nowIso(), dateOptions),
    })
  }

  function addCallTask() {
    createQuickItem({
      type: "call",
      title: `Zadzwonić — ${liveLead.name}`,
      scheduledAt: getNextSnoozeByHours(nowIso(), 1, dateOptions),
    })
  }

  function addMeetingTask() {
    const startAt = getNextDaySnoozeAtPreferredTime(nowIso(), { ...dateOptions, fallbackHour: 10 })
    createQuickItem({
      type: "meeting",
      title: `Spotkanie — ${liveLead.name}`,
      recordType: "event",
      startAt,
      endAt: startAt,
      showInCalendar: true,
      showInTasks: false,
    })
  }

  function addNoteTimeline() {
    createQuickItem({
      type: "note",
      title: `Notatka — ${liveLead.name}`,
      description: liveLead.summary || liveLead.notes || "Krótka notatka do dalszego uzupełnienia.",
      recordType: "note",
      showInCalendar: false,
      showInTasks: false,
      scheduledAt: "",
    })
    setTab("timeline")
  }

  function setLeadStatus(status: Lead["status"]) {
    updateLead(liveLead.id, { status })
  }

  return (
    <div className="drawer-backdrop" role="presentation">
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="Szczegóły leada">
        <div className="drawer-header">
          <div className="drawer-user" style={{ alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar name={liveLead.name} />
              <div>
                <div className="drawer-title">{liveLead.name}</div>
                <div className="muted-small">{liveLead.company || liveLead.source || "Bez firmy"}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>
              <LeadStatusBadge status={liveLead.status} />
              <CaseOperationalStatusBadge status={operationalStatus} />
              <PriorityBadge priority={liveLead.priority} />
              {computed.isAtRisk ? <span className="badge priority-high">Ryzyko</span> : <span className="badge status-won">Stabilny</span>}
            </div>
          </div>
          <div className="drawer-actions wrap" style={{ marginTop: 14, justifyContent: "space-between" }}>
            <div className="drawer-actions wrap">
              <button className={`ghost-button small ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")} type="button">
                Podgląd
              </button>
              <button className={`ghost-button small ${tab === "timeline" ? "active" : ""}`} onClick={() => setTab("timeline")} type="button">
                Historia
              </button>
            </div>
            <div className="drawer-actions wrap">
              {mode === "view" ? (
                <button className="primary-button" onClick={() => setMode("edit")} type="button">
                  Edytuj
                </button>
              ) : (
                <>
                  <button className="ghost-button" onClick={() => { resetForm(); setMode("view") }} type="button">
                    Anuluj edycję
                  </button>
                  <button className="primary-button" onClick={handleSave} type="button" disabled={!hasChanges || !form.name.trim()}>
                    Zapisz zmiany
                  </button>
                </>
              )}
              <button className="close-button" onClick={onClose} type="button" aria-label="Zamknij drawer">
                ×
              </button>
            </div>
          </div>
        </div>

        {tab === "overview" ? (
          <div className="drawer-content drawer-body">
            <section className="info-card" style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 14 }}>
                  <div className="muted-small uppercase">Ostatni kontakt</div>
                  <div style={{ marginTop: 6 }}>{lastTouch.at ? formatDateTime(lastTouch.at, dateOptions) : "Brak historii kontaktu"}</div>
                </div>
                <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 14 }}>
                  <div className="muted-small uppercase">Kolejny krok</div>
                  <div style={{ marginTop: 6 }}>{nextStep.title || liveLead.nextActionTitle || "Brak next stepu"}</div>
                </div>
                <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 14 }}>
                  <div className="muted-small uppercase">Termin</div>
                  <div style={{ marginTop: 6 }}>{nextStep.at ? formatDateTime(nextStep.at, dateOptions) : liveLead.nextActionAt ? formatDateTime(liveLead.nextActionAt, dateOptions) : "Brak terminu"}</div>
                </div>
                <div className="today-row-meta-card" style={{ border: `1px solid ${computed.isAtRisk ? "#fecaca" : "var(--border)"}`, borderRadius: 14, padding: 14, background: computed.isAtRisk ? "#fff7f7" : "#fff" }}>
                  <div className="muted-small uppercase">Stan ryzyka</div>
                  <div style={{ marginTop: 6, color: statusTone, fontWeight: 700 }}>{riskLabel}</div>
                </div>
              </div>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                <div className="info-row"><strong>Dni bez ruchu</strong><span>{computed.daysSinceLastTouch}</span></div>
                <div className="info-row"><strong>Otwarte działania</strong><span>{openItems.length}</span></div>
                <div className="info-row"><strong>Wartość</strong><span>{formatMoney(liveLead.value)}</span></div>
                <div className="info-row"><strong>Priorytet dnia</strong><span>{computed.dailyPriorityScore}</span></div>
              </div>
            </section>

            <section className="info-card" style={{ display: "grid", gap: 12 }}>
              <div>
                <div className="drawer-title" style={{ fontSize: 18 }}>Szybkie akcje</div>
                <div className="muted-small">Pchnij lead dalej bez wychodzenia z karty.</div>
              </div>
              <div className="drawer-actions wrap">
                <button className="primary-button" type="button" onClick={addTomorrowFollowUp}>Follow-up jutro</button>
                <button className="ghost-button" type="button" onClick={addCallTask}>Zadzwoń</button>
                <button className="ghost-button" type="button" onClick={addMeetingTask}>Spotkanie</button>
                <button className="ghost-button" type="button" onClick={addNoteTimeline}>Notatka</button>
                <button className="ghost-button" type="button" onClick={() => setLeadStatus("follow_up")}>Follow-up</button>
                <button className="ghost-button" type="button" onClick={() => setLeadStatus("won")}>Won</button>
                <button className="ghost-button" type="button" onClick={() => setLeadStatus("lost")}>Przegrany</button>
              </div>
            </section>

            <section className="info-card" style={{ display: "grid", gap: 12 }}>
              <div>
                <div className="drawer-title" style={{ fontSize: 18 }}>Start realizacji</div>
                <div className="muted-small">Ta sekcja ma przygotować przejście z wygranego leada do modułu spraw.</div>
              </div>
              <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 14 }}>
                <div className="muted-small uppercase">Status operacyjny</div>
                <div style={{ marginTop: 6 }}>
                  <CaseOperationalStatusBadge status={operationalStatus} />
                </div>
              </div>
              <div className="today-row-meta-card" style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 14 }}>
                {canStartOperations ? (
                  <>
                    <div style={{ fontWeight: 700 }}>Lead jest gotowy do uruchomienia realizacji.</div>
                    <div className="muted-small" style={{ marginTop: 6 }}>
                      Sprzedaz jest domknieta, a operacje prowadzisz osobnym statusem sprawy ({getCaseOperationalStatusLabel(operationalStatus)}).
                    </div>
                    {!relatedCase ? (
                      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                        <div className="drawer-actions wrap">
                          <button className="ghost-button" type="button" onClick={() => setShowCaseCreateModal(true)}>
                            Otworz CaseCreateModal
                          </button>
                          <a className="ghost-button" href="/templates">
                            Moduł Templates
                          </a>
                        </div>
                        <div className="muted-small uppercase">Tryb utworzenia sprawy</div>
                        <label className="switch-row">
                          <input type="radio" name={`start-mode-${liveLead.id}`} checked={startMode === "empty"} onChange={() => setStartMode("empty")} />
                          <span>Pusta sprawa</span>
                        </label>
                        <label className="switch-row">
                          <input type="radio" name={`start-mode-${liveLead.id}`} checked={startMode === "template"} onChange={() => setStartMode("template")} />
                          <span>Sprawa z szablonu</span>
                        </label>
                        <label className="switch-row">
                          <input type="radio" name={`start-mode-${liveLead.id}`} checked={startMode === "template_with_link"} onChange={() => setStartMode("template_with_link")} />
                          <span>Szablon + od razu link klienta</span>
                        </label>
                        {startMode !== "empty" ? (
                          caseTemplates.length > 0 ? (
                            <label className="field-block" style={{ marginTop: 4 }}>
                              <FieldLabel label="Szablon startowy" />
                              <select className="select-input" value={selectedTemplateId} onChange={(event) => setSelectedTemplateId(event.target.value)}>
                                {caseTemplates.map((template) => (
                                  <option key={template.id} value={template.id}>
                                    {template.title}
                                  </option>
                                ))}
                              </select>
                            </label>
                          ) : (
                            <div className="muted-small">Brak szablonów. Możesz utworzyć pustą sprawę.</div>
                          )
                        ) : null}
                        <div className="drawer-actions wrap" style={{ marginTop: 6 }}>
                          <button
                            className="primary-button"
                            type="button"
                            onClick={() =>
                              startCaseFromLead(
                                liveLead.id,
                                startMode,
                                startMode === "empty" ? null : selectedTemplateId || null,
                              )
                            }
                            disabled={startMode !== "empty" && !selectedTemplateId && caseTemplates.length > 0}
                          >
                            Utwórz sprawę
                          </button>
                          <button
                            className="ghost-button"
                            type="button"
                            onClick={() => startCaseFromLead(liveLead.id, "template", selectedTemplateId || null)}
                            disabled={caseTemplates.length === 0}
                          >
                            Uruchom checklistę startową
                          </button>
                          <button
                            className="ghost-button"
                            type="button"
                            onClick={() => startCaseFromLead(liveLead.id, "template_with_link", selectedTemplateId || null)}
                            disabled={caseTemplates.length === 0}
                          >
                            Wyślij link klientowi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                        <div className="muted-small">
                          Sprawa została utworzona i lead pozostaje w historii sprzedaży.
                        </div>
                        <div className="drawer-actions wrap">
                          <a className="ghost-button" href="/cases">Otwórz sprawę w module Sprawy</a>
                          <button className="ghost-button" type="button" onClick={() => issueClientPortalLink(liveLead.id)}>
                            Wyślij link klientowi
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 700 }}>Jeszcze nie uruchamiaj realizacji.</div>
                    <div className="muted-small" style={{ marginTop: 6 }}>
                      Sekcja odblokuje się po statusie sprzedaży „Wygrany” lub po operacyjnym „Gotowe do startu”.
                    </div>
                  </>
                )}
              </div>
            </section>

            {mode === "edit" ? (
              <section className="info-card" style={{ display: "grid", gap: 14 }}>
                <div className="drawer-title" style={{ fontSize: 18 }}>Edycja leada</div>
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
                    <select className="select-input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Lead["status"] })}>
                      {LEAD_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field-block">
                    <FieldLabel label="Priorytet" help="Pomaga ustalić kolejność działania." />
                    <select className="select-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Lead["priority"] })}>
                      {PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="form-grid drawer-form-grid">
                  <label className="field-block">
                    <FieldLabel label="Źródło" help="Skąd przyszedł ten lead." />
                    <select className="select-input" value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value as Lead["source"] })}>
                      {SOURCE_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field-block">
                    <FieldLabel label="Wartość" help="Szacowana wartość leada lub dealu." />
                    <input type="number" min="0" step="100" className="text-input" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} />
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
                    <input className="text-input" value={form.nextActionTitle} onChange={(event) => setForm({ ...form, nextActionTitle: event.target.value })} />
                  </label>
                  <label className="field-block">
                    <FieldLabel label="Termin" help="Data i godzina tej planowanej akcji." />
                    <input type="datetime-local" className="text-input date-time-input" value={toInputValue(form.nextActionAt)} onChange={(event) => setForm({ ...form, nextActionAt: fromInputValue(event.target.value) })} />
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
                <div className="drawer-actions drawer-actions-between wrap">
                  <button className="danger-button" onClick={() => setShowDeleteConfirm(true)} type="button">Usuń leada</button>
                  <div className="drawer-actions wrap">
                    <button className="ghost-button" onClick={resetForm} type="button" disabled={!hasChanges}>Cofnij zmiany</button>
                    <button className="primary-button" onClick={handleSave} type="button" disabled={!hasChanges || !form.name.trim()}>Zapisz zmiany</button>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="info-card" style={{ display: "grid", gap: 12 }}>
              <div className="drawer-title" style={{ fontSize: 18 }}>Ostatnie ruchy</div>
              {latestTimeline.length === 0 ? <div className="empty-box">Brak historii dla tego leada.</div> : null}
              {latestTimeline.map((item) => (
                <div key={item.id} className="timeline-row">
                  <div>
                    <div className="timeline-title">{item.title}</div>
                    <div className="muted-small">{formatDateTime(getItemPrimaryDate(item), dateOptions)}</div>
                  </div>
                  {item.status !== "done" ? (
                    <button className="ghost-button small" onClick={() => toggleItemDone(item.id)} type="button">Zrobione</button>
                  ) : null}
                </div>
              ))}
            </section>
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
                <div className="drawer-actions wrap">
                  <span className={`badge priority-${item.priority}`}>{getPriorityLabel(item.priority)}</span>
                  <button className="ghost-button small" onClick={() => toggleItemDone(item.id)} type="button">
                    {item.status === "done" ? "Przywróć" : "Zrobione"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
      {showCaseCreateModal ? (
        <CaseCreateModal lead={liveLead} onClose={() => setShowCaseCreateModal(false)} />
      ) : null}
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
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])

  const normalizedQuery = normalizeSearchValue(query)
  const leadsWithComputed = useMemo(() => buildLeadsWithComputedState(snapshot, dateOptions), [dateOptions, snapshot])

  const filtered = useMemo(
    () =>
      leadsWithComputed.filter((lead) => {
        const searchableText = normalizeSearchValue(`${lead.name} ${lead.company} ${lead.email} ${lead.phone} ${lead.source}`)
        const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery)
        const matchesStatus = statusFilter === "all" || lead.status === statusFilter
        return matchesQuery && matchesStatus
      }),
    [leadsWithComputed, normalizedQuery, statusFilter],
  )

  return (
    <>
      <section className="hero-row">
        <div>
          <h1 className="page-title">Leady</h1>
          <p className="page-subtitle">Tu widzisz status, wartość, aktywne działania, zaległości, ostatni kontakt, kolejny krok i ryzyko dla każdego leada.</p>
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
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {isMobileProfile ? (
          <div className="lead-mobile-list">
            {filtered.length === 0 ? (
              <ViewState
                title={snapshot.leads.length === 0 && !query && statusFilter === "all" ? "Dodaj pierwszego leada." : "Brak wyników."}
                description="Zmień filtr lub wyszukiwane hasło, aby zobaczyć pasujące rekordy."
              />
            ) : null}
            {filtered.map((lead) => {
              const stats = getLeadActiveItemStats(lead.id, snapshot.items, dateOptions)
              const nextStep = getLeadNextStep(snapshot, lead, dateOptions)
              const lastTouch = getLeadLastTouch(snapshot, lead, dateOptions)
              const riskLabel = formatLeadAlarmReasonLabel(lead.computed.riskReason) || "Pod kontrolą"

              return (
                <button key={lead.id} className="lead-mobile-row" onClick={() => setSelectedLead(lead)} type="button">
                  <div className="lead-mobile-top" style={{ alignItems: "flex-start" }}>
                    <div className="lead-mobile-main">
                      <Avatar name={lead.name} />
                      <div className="lead-mobile-text" style={{ width: "100%" }}>
                        <div className="lead-name">{lead.name}</div>
                        <div className="lead-mobile-meta-line">
                          <span>{lead.company || lead.source}</span>
                          <span>•</span>
                          <span>{formatMoney(lead.value)}</span>
                        </div>
                        <div className="lead-mobile-meta-line" style={{ marginTop: 8, display: "grid", gap: 6 }}>
                          <span>Status: {getStatusLabel(lead.status)}</span>
                          <span>Aktywne działania: {stats.activeCount}{stats.overdueCount > 0 ? ` · zaległe ${stats.overdueCount}` : ""}</span>
                          <span>Ostatni kontakt: {lastTouch.at ? formatDateTime(lastTouch.at, dateOptions) : "Brak"}</span>
                          <span>Kolejny krok: {nextStep.title || "Brak next stepu"}</span>
                          <span>Risk: {riskLabel}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                      <LeadStatusBadge status={lead.status} />
                      {lead.computed.isAtRisk ? <span className="badge priority-high">Ryzyko</span> : null}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="lead-table">
            <div className="lead-table-header lead-table-header-final" role="row">
              <div>KLIENT</div>
              <div>STATUS</div>
              <div>WARTOŚĆ</div>
              <div>AKCJE</div>
              <div>OVERDUE</div>
              <div>OSTATNI KONTAKT</div>
              <div>KOLEJNY KROK</div>
              <div>RISK</div>
            </div>

            <div className="lead-table-body">
              {filtered.length === 0 ? (
                <ViewState
                  title={snapshot.leads.length === 0 && !query && statusFilter === "all" ? "Dodaj pierwszego leada." : "Brak wyników."}
                  description="Zmień filtr lub wyszukiwane hasło, aby zobaczyć pasujące rekordy."
                />
              ) : null}
              {filtered.map((lead) => {
                const stats = getLeadActiveItemStats(lead.id, snapshot.items, dateOptions)
                const nextStep = getLeadNextStep(snapshot, lead, dateOptions)
                const lastTouch = getLeadLastTouch(snapshot, lead, dateOptions)
                const riskLabel = formatLeadAlarmReasonLabel(lead.computed.riskReason) || "Pod kontrolą"
                return (
                  <button key={lead.id} className="lead-table-row lead-table-row-final" onClick={() => setSelectedLead(lead)} type="button">
                    <div className="lead-table-client">
                      <Avatar name={lead.name} />
                      <div className="lead-table-client-text">
                        <div className="lead-name">{lead.name}</div>
                        <div className="muted-small">{lead.company || lead.source}</div>
                      </div>
                    </div>
                    <div className="lead-table-status"><LeadStatusBadge status={lead.status} /></div>
                    <div className="lead-table-value">{formatMoney(lead.value)}</div>
                    <div className="lead-table-tasks">{stats.activeCount > 0 ? stats.activeCount : "—"}</div>
                    <div className="lead-table-overdue">{stats.overdueCount > 0 ? stats.overdueCount : "—"}</div>
                    <div className="lead-table-source">{lastTouch.at ? formatDayLabel(lastTouch.at, dateOptions) : "Brak"}</div>
                    <div className="lead-table-source">{nextStep.title || "Brak next stepu"}</div>
                    <div className={`lead-table-source lead-risk-label ${lead.computed.isAtRisk ? "lead-risk-label-at-risk" : ""}`}>{riskLabel}</div>
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
  const [tab, setTab] = useState<"active" | "today" | "week" | "overdue" | "without_lead" | "done">("active")
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])

  const taskItems = useMemo(() => getTaskListItems(snapshot.items), [snapshot.items])
  const currentDateKey = getCurrentDateKey(dateOptions)

  function priorityOrder(priority: WorkItem["priority"]) {
    return priority === "high" ? 0 : priority === "medium" ? 1 : 2
  }

  function sortActiveItems(items: WorkItem[]) {
    return [...items].sort((left, right) => {
      const overdueDiff = Number(isOverdue(left, dateOptions)) === Number(isOverdue(right, dateOptions)) ? 0 : Number(isOverdue(right, dateOptions)) - Number(isOverdue(left, dateOptions))
      if (overdueDiff !== 0) return overdueDiff

      const todayDiff = Number(isToday(getItemPrimaryDate(right), dateOptions)) - Number(isToday(getItemPrimaryDate(left), dateOptions))
      if (todayDiff !== 0) return todayDiff

      const priorityDiff = priorityOrder(left.priority) - priorityOrder(right.priority)
      if (priorityDiff !== 0) return priorityDiff

      return getItemPrimaryDate(left).localeCompare(getItemPrimaryDate(right))
    })
  }

  const activeItems = useMemo(() => taskItems.filter((item) => item.status !== "done"), [taskItems])

  const list = useMemo(() => {
    if (tab === "done") {
      return [...taskItems.filter((item) => item.status === "done")].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    }

    if (tab === "today") {
      return sortActiveItems(activeItems.filter((item) => isToday(getItemPrimaryDate(item), dateOptions)))
    }

    if (tab === "week") {
      return sortActiveItems(
        activeItems.filter((item) => {
          const diff = getDateKeyDiff(toDateKey(getItemPrimaryDate(item), dateOptions), currentDateKey)
          return diff >= 0 && diff <= 6
        }),
      )
    }

    if (tab === "overdue") {
      return sortActiveItems(activeItems.filter((item) => isOverdue(item, dateOptions)))
    }

    if (tab === "without_lead") {
      return sortActiveItems(activeItems.filter((item) => !item.leadId))
    }

    return sortActiveItems(activeItems)
  }, [activeItems, currentDateKey, dateOptions, tab, taskItems])

  const tabMeta = [
    { key: "active", label: "Wszystkie aktywne", count: activeItems.length },
    { key: "today", label: "Dziś", count: activeItems.filter((item) => isToday(getItemPrimaryDate(item), dateOptions)).length },
    { key: "week", label: "Ten tydzień", count: activeItems.filter((item) => { const diff = getDateKeyDiff(toDateKey(getItemPrimaryDate(item), dateOptions), currentDateKey); return diff >= 0 && diff <= 6 }).length },
    { key: "overdue", label: "Zaległe", count: activeItems.filter((item) => isOverdue(item, dateOptions)).length },
    { key: "without_lead", label: "Bez leada", count: activeItems.filter((item) => !item.leadId).length },
    { key: "done", label: "Zrobione", count: taskItems.filter((item) => item.status === "done").length },
  ] as const

  return (
    <>
      <section className="hero-row">
        <div>
          <h1 className="page-title">Zadania</h1>
          <p className="page-subtitle">Pełny ruch operacyjny. Tu widzisz backlog aktywnych zadań, ten tydzień, zaległości i wpisy bez przypiętego leada.</p>
        </div>
      </section>

      <section className="panel-card">
        <div className="segmented-tabs segmented-tabs-wrap">
          {tabMeta.map((tabOption) => (
            <button key={tabOption.key} className={tab === tabOption.key ? "active" : ""} onClick={() => setTab(tabOption.key)}>
              {tabOption.label} <span className="muted-small">{tabOption.count}</span>
            </button>
          ))}
        </div>

        <div className="stack-list">
          {list.length === 0 ? (
            <ViewState
              title={taskItems.length === 0 ? "Dodaj pierwsze zadanie." : "Brak wpisów w tej sekcji."}
              description="Wybierz inną zakładkę lub dodaj nowe działanie."
            />
          ) : null}
          {list.map((item) => {
            const leadLabel = getItemLeadLabel(item, snapshot.leads)
            const overdue = isOverdue(item, dateOptions)
            const typeMeta = getItemTypeMeta(item.type)
            return (
              <div key={item.id} className="task-row" style={{ display: "grid", gap: 12 }}>
                <button className={`item-card ${overdue ? "overdue" : ""}`} onClick={() => setEditingItem(item)} type="button">
                  <div className="item-card-top">
                    <span className="item-icon">{typeMeta.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div className={`item-title ${isDone(item) ? "done" : ""}`}>{item.title}</div>
                      <div className="item-meta-row" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <span>Typ: {typeMeta.label}</span>
                        <span>Lead: {leadLabel || "Bez leada"}</span>
                        <span>Termin: {formatDateTime(getItemPrimaryDate(item), dateOptions)}</span>
                        {overdue ? <span className="lead-table-overdue">Po terminie</span> : null}
                      </div>
                    </div>
                  </div>
                  {item.description ? <div className="item-description">{item.description}</div> : null}
                </button>
                <div className="task-actions">
                  <span className={`badge priority-${item.priority}`}>{getPriorityLabel(item.priority)}</span>
                  <button className="ghost-button small" onClick={() => toggleItemDone(item.id)}>
                    {item.status === "done" ? "Cofnij" : "Zrobione"}
                  </button>
                  <button className="ghost-button small" onClick={() => snoozeItem(item.id, getNextSnoozeByHours(getItemPrimaryDate(item), 1, dateOptions))}>+1h</button>
                  <button className="ghost-button small" onClick={() => snoozeItem(item.id, getNextDaySnoozeAtPreferredTime(getItemPrimaryDate(item), dateOptions))}>Jutro</button>
                  <button className="danger-button small" onClick={() => setItemToDelete(item)}>Usuń</button>
                </div>
              </div>
            )
          })}
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
                        {items.length === 0 ? (
                          <ViewState
                            title={hasCalendarItems ? "Brak wydarzeń w tym dniu." : "Dodaj pierwsze wydarzenie."}
                            description="Wybierz inny dzień albo dodaj nowe działanie kalendarzowe."
                          />
                        ) : items.map((item) => renderWeekPill(item))}
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
                {selectedDayItems.length === 0 ? (
                  <ViewState
                    title={hasCalendarItems ? "Brak wydarzeń w wybranym dniu." : "Dodaj pierwsze wydarzenie."}
                    description="Wybierz inny termin albo dodaj nowe wydarzenie."
                  />
                ) : selectedDayItems.map((item) => renderWeekPill(item))}
              </div>
            </div>
          ) : null}

          {!showMobileWeek && !showMobileMonth ? (
            <ViewState
              title="Zaznacz tydzień albo miesiąc."
              description="Włącz przynajmniej jeden widok kalendarza."
            />
          ) : null}
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
              <ViewState
                title="Dodaj pierwsze wydarzenie."
                description="Kalendarz jest gotowy na pierwsze działania i terminy."
              />
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
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
