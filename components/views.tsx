"use client"

import { useSearchParams } from "next/navigation"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { PageShell } from "@/components/layout/page-shell"
import { buildRiskLabel, hoursSince } from "@/components/ui/risk"
import { ViewState } from "@/components/ui/view-state"
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react"
import { generatePortalTokenRaw, isPortalTokenActive, sha256Hex } from "@/lib/client-portal-token"
import type { CaseTemplateInput } from "@/lib/snapshot"
import { createSignedAttachmentAccess } from "@/lib/storage/signed-access"
import { formatFileSize } from "@/lib/storage/upload-policy"
import {
  ITEM_TYPE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  REMINDER_OPTIONS,
  SOURCE_OPTIONS,
  THEME_OPTIONS,
} from "@/lib/constants"
import { useAppStore } from "@/lib/store"
import type { CaseOperationalStatus, CaseTemplate, Lead, TemplateItem, TemplateItemKind, WorkItem, WorkItemInput } from "@/lib/types"
import { buildCasesDashboard, type CaseListFilter, type CaseListRow } from "@/lib/repository/cases-dashboard"
import { canLeadStartCase } from "@/lib/repository/lead-case.domain"
import {
  createId,
  findLeadByText,
  formatDateKeyMonthDay,
  formatDateKeyWeekday,
  formatDateTime,
  formatDayLabel,
  formatMoney,
  formatTime,
  formatWeekRangeLabel,
  fromInputValue,
  addHours,
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
  getOperationalStatusLabel,
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

type CaseBootstrapMode = "empty_case" | "template_case" | "template_case_with_portal"
type TemplateEditorItem = {
  title: string
  itemType: TemplateItemKind
  description: string
  required: boolean
}

const TEMPLATE_ITEM_TYPE_OPTIONS: Array<{ value: TemplateItemKind; label: string }> = [
  { value: "file", label: "Plik" },
  { value: "decision", label: "Decyzja" },
  { value: "approval", label: "Akceptacja" },
  { value: "response", label: "Odpowiedz" },
  { value: "access", label: "Dostep" },
]

const STARTER_CASE_TYPES = ["strona www", "branding", "kampania reklamowa", "onboarding klienta"]
const CASE_REMINDER_FREQUENCY_OPTIONS: Array<{
  value: "daily" | "every_2_days" | "weekly"
  label: string
}> = [
  { value: "daily", label: "Codziennie" },
  { value: "every_2_days", label: "Co 2 dni" },
  { value: "weekly", label: "Co tydzien" },
]

function Avatar({ name }: { name: string }) {
  return <div className="avatar">{initials(name)}</div>
}

function LeadStatusBadge({ status }: { status: Lead["status"] }) {
  return <span className={`badge status-${status}`}>{getStatusLabel(status)}</span>
}

function OperationalStatusBadge({ status }: { status: CaseOperationalStatus }) {
  return <span className={`badge status-op-${status}`}>{getOperationalStatusLabel(status)}</span>
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
  const {
    snapshot,
    updateLead,
    deleteLead,
    toggleItemDone,
    addItem,
    issueClientPortalToken,
    revokeClientPortalToken,
    addNotification,
  } = useAppStore()
  const dateOptions = { timeZone: snapshot.settings.timezone }
  const [tab, setTab] = useState<"info" | "timeline">("info")
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCaseCreateModal, setShowCaseCreateModal] = useState(false)
  const [realizationInfo, setRealizationInfo] = useState("")
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
    setIsEditing(false)
  }, [liveLead])

  const relatedItems = snapshot.items
    .filter((item) => item.leadId === liveLead.id)
    .sort((a, b) => getItemPrimaryDate(b).localeCompare(getItemPrimaryDate(a)))
  const relatedActiveCount = relatedItems.filter((item) => item.status !== "done").length
  const relatedOverdueCount = relatedItems.filter((item) => isOverdue(item, dateOptions)).length
  const recentHistory = relatedItems.slice(0, 3)
  const canStartRealization = canLeadStartCase(liveLead.status)
  const hasOperationalCase = Boolean(liveLead.caseId)
  const caseDeepLink = liveLead.caseId ? `/cases?caseId=${liveLead.caseId}&leadId=${liveLead.id}` : ""

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
    setIsEditing(false)
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
    setIsEditing(false)
  }

  function buildPortalLink(token: string) {
    if (typeof window === "undefined") return `/client-portal/${token}`
    return `${window.location.origin}/client-portal/${token}`
  }

  function appendRealizationNote(note: string) {
    const currentNotes = liveLead.notes?.trim() ?? ""
    return currentNotes ? `${currentNotes}\n${note}` : note
  }

  async function handleCreateCase(mode: CaseBootstrapMode, templateId?: string) {
    if (!canStartRealization || hasOperationalCase) return

    const createdCaseId = createId("case")
    const resolvedContactId = liveLead.contactId ?? createId("contact")
    const createdAt = formatDateTime(nowIso(), dateOptions)
    const modeLabel =
      mode === "empty_case"
        ? "pusta sprawa"
        : mode === "template_case"
          ? "sprawa z szablonu"
          : "sprawa z szablonu + link klienta"

    const selectedTemplate = templateId ? snapshot.caseTemplates.find((entry) => entry.id === templateId) : null
    updateLead(liveLead.id, {
      caseId: createdCaseId,
      contactId: resolvedContactId,
      notes: appendRealizationNote(
        `[START REALIZACJI] ${createdAt} | ${modeLabel} | case: ${createdCaseId}${
          selectedTemplate ? ` | template: ${selectedTemplate.name}` : ""
        }`,
      ),
    })

    if (mode !== "empty_case" && selectedTemplate) {
      const rows = snapshot.templateItems
        .filter((item) => item.templateId === selectedTemplate.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)

      rows.forEach((item) => {
        addItem({
          workspaceId: liveLead.workspaceId ?? null,
          leadId: liveLead.id,
          leadLabel: liveLead.name,
          recordType: "task",
          type: mapTemplateItemToWorkItemType(item.itemType),
          title: item.title,
          description: `[case:${createdCaseId}] ${item.description || "Pozycja checklisty z szablonu."}`,
          status: "todo",
          priority: item.required ? "high" : "medium",
          scheduledAt: nowIso(),
          startAt: "",
          endAt: "",
          recurrence: "none",
          reminder: snapshot.settings.defaultReminder,
          showInTasks: true,
          showInCalendar: false,
        })
      })
    }

    if (mode === "template_case_with_portal") {
      const rawToken = await buildOrReusePortalLinkForCase(
        createdCaseId,
        snapshot.clientPortalTokens,
        issueClientPortalToken,
        revokeClientPortalToken,
      )
      const portalLink = buildPortalLink(rawToken)
      void navigator.clipboard?.writeText(portalLink).catch(() => null)
      addNotification({
        userId: "client_portal",
        channel: "in_app",
        kind: "client_link_sent",
        dedupeKey: `manual-client-link:${createdCaseId}:${nowIso().slice(0, 10)}`,
        title: "Wydano link klienta",
        message: `Link dla sprawy ${createdCaseId} zostal wygenerowany i skopiowany.`,
        relatedLeadId: liveLead.id,
        relatedCaseId: createdCaseId,
        recipient: liveLead.email || "client@example.com",
      })
      setRealizationInfo(`Sprawa ${createdCaseId} utworzona. Link klienta skopiowany.`)
      return
    }

    setRealizationInfo(`Sprawa ${createdCaseId} utworzona (${modeLabel}).`)
  }

  function handleStartChecklist() {
    if (!hasOperationalCase || !liveLead.caseId) return
    addItem({
      leadId: liveLead.id,
      leadLabel: liveLead.name,
      recordType: "task",
      type: "task",
      title: "Start realizacji: checklista",
      description: `Uruchomienie checklisty dla sprawy ${liveLead.caseId}`,
      status: "todo",
      priority: "high",
      scheduledAt: nowIso(),
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: snapshot.settings.defaultReminder,
      showInTasks: true,
      showInCalendar: false,
    })
    setRealizationInfo("Checklista startowa dodana do zadan.")
  }

  async function handleSendClientLink() {
    if (!hasOperationalCase || !liveLead.caseId) return
    const rawToken = await buildOrReusePortalLinkForCase(
      liveLead.caseId,
      snapshot.clientPortalTokens,
      issueClientPortalToken,
      revokeClientPortalToken,
    )
    const portalLink = buildPortalLink(rawToken)
    void navigator.clipboard?.writeText(portalLink).catch(() => null)
    addNotification({
      userId: "client_portal",
      channel: "in_app",
      kind: "client_link_sent",
      dedupeKey: `manual-client-link:${liveLead.caseId}:${nowIso().slice(0, 10)}`,
      title: "Wyslano link klientowi",
      message: `Nowy link dla sprawy ${liveLead.caseId} zostal wygenerowany.`,
      relatedLeadId: liveLead.id,
      relatedCaseId: liveLead.caseId,
      recipient: liveLead.email || "client@example.com",
    })
    setRealizationInfo("Link klienta skopiowany.")
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
            <section className="lead-detail-status-bar" aria-label="Pasek stanu leada">
              <LeadStatusBadge status={liveLead.status} />
              <PriorityBadge priority={liveLead.priority} />
              <span className="badge">Aktywne: {relatedActiveCount}</span>
              <span className="badge">Overdue: {relatedOverdueCount}</span>
            </section>

            <section className="info-card">
              <div className="section-head">
                <strong>Szybkie akcje</strong>
              </div>
              <div className="drawer-actions wrap">
                <button className="secondary-button" type="button" onClick={() => setIsEditing(true)}>
                  Edytuj
                </button>
                <button className="ghost-button" type="button" onClick={() => setTab("timeline")}>
                  Pelna historia
                </button>
                <button className="ghost-button" type="button" onClick={() => setShowDeleteConfirm(true)}>
                  Usun
                </button>
              </div>
            </section>

            <section className="info-card">
              <div className="section-head">
                <strong>Historia</strong>
                <span className="muted-small">Ostatnie wpisy</span>
              </div>
              {recentHistory.length === 0 ? <ViewState kind="empty">Brak historii dla tego leada.</ViewState> : null}
              <div className="stack-list">
                {recentHistory.map((item) => (
                  <div key={item.id} className="timeline-row">
                    <div>
                      <div className="timeline-title">{item.title}</div>
                      <div className="muted-small">{formatDateTime(getItemPrimaryDate(item), dateOptions)}</div>
                    </div>
                    <button className="ghost-button small" onClick={() => toggleItemDone(item.id)} type="button">
                      {item.status === "done" ? "Przywroc" : "Zrobione"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="info-card">
              <div className="section-head">
                <strong>Sekcja start realizacji</strong>
              </div>
              {!canStartRealization ? (
                <ViewState kind="empty">
                  Sekcja aktywuje sie po statusie sprzedazowym `wygrany` albo `gotowy do startu`.
                </ViewState>
              ) : null}
              {canStartRealization ? (
                <div className="stack-list">
                  {!hasOperationalCase ? (
                    <>
                      <label className="field-block">
                        <FieldLabel
                          label="Tryby uruchomienia sprawy"
                          help="Pusta sprawa, sprawa z szablonu lub sprawa z szablonu + natychmiastowy link klienta."
                        />
                        <div className="muted-small">Uruchom modal i wybierz finalny wariant.</div>
                      </label>
                      <div className="drawer-actions wrap">
                        <button className="primary-button" type="button" onClick={() => setShowCaseCreateModal(true)}>
                          Utworz sprawe
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="info-row">
                        <strong>Sprawa utworzona</strong>
                        <button
                          className="ghost-button small"
                          type="button"
                          onClick={() => (window.location.href = caseDeepLink)}
                        >
                          {liveLead.caseId}
                        </button>
                      </div>
                      <div className="drawer-actions wrap">
                        <button className="secondary-button" type="button" onClick={handleStartChecklist}>
                          Uruchom checkliste startowa
                        </button>
                        <button className="ghost-button" type="button" onClick={handleSendClientLink}>
                          Wyslij link klientowi
                        </button>
                      </div>
                    </>
                  )}
                  {realizationInfo ? <div className="muted-small">{realizationInfo}</div> : null}
                </div>
              ) : null}
            </section>

            {!isEditing ? (
              <>
                <section className="info-card">
                  <div className="section-head">
                    <strong>Nagłówek</strong>
                    <span className="muted-small">Podgląd</span>
                  </div>
                  <div className="info-row">
                    <strong>Lead</strong>
                    <span>{liveLead.name}</span>
                  </div>
                  <div className="info-row">
                    <strong>Firma</strong>
                    <span>{liveLead.company || "—"}</span>
                  </div>
                  <div className="info-row">
                    <strong>Status</strong>
                    <span>{getStatusLabel(liveLead.status)}</span>
                  </div>
                  <div className="info-row">
                    <strong>Priorytet</strong>
                    <span>{getPriorityLabel(liveLead.priority)}</span>
                  </div>
                  <div className="info-row">
                    <strong>Źródło</strong>
                    <span>{liveLead.source || "—"}</span>
                  </div>
                  <div className="info-row">
                    <strong>Wartość</strong>
                    <span>{formatMoney(liveLead.value)}</span>
                  </div>
                  <div className="info-row">
                    <strong>E-mail</strong>
                    <span>{liveLead.email || "—"}</span>
                  </div>
                  <div className="info-row">
                    <strong>Telefon</strong>
                    <span>{liveLead.phone || "—"}</span>
                  </div>
                  <div className="info-row">
                    <strong>Next action</strong>
                    <span>{liveLead.nextActionTitle || "—"}</span>
                  </div>
                  <div className="info-row">
                    <strong>Termin</strong>
                    <span>{liveLead.nextActionAt ? formatDateTime(liveLead.nextActionAt, dateOptions) : "—"}</span>
                  </div>
                </section>

                {liveLead.summary ? (
                  <section className="info-card">
                    <div className="section-head">
                      <strong>Opis</strong>
                    </div>
                    <div className="muted-small" style={{ whiteSpace: "pre-wrap" }}>
                      {liveLead.summary}
                    </div>
                  </section>
                ) : null}

                {liveLead.notes ? (
                  <section className="info-card">
                    <div className="section-head">
                      <strong>Notatki</strong>
                    </div>
                    <div className="muted-small" style={{ whiteSpace: "pre-wrap" }}>
                      {liveLead.notes}
                    </div>
                  </section>
                ) : null}
              </>
            ) : (
              <>
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
              </>
            )}

            <div className="info-card">
              <div className="info-row">
                <strong>Aktywne działania</strong>
                <span>{relatedActiveCount}</span>
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
              {!isEditing ? (
                <button className="primary-button" onClick={() => setIsEditing(true)} type="button">
                  Edytuj
                </button>
              ) : (
                <div className="drawer-actions wrap">
                  <button className="ghost-button" onClick={resetForm} type="button" disabled={!hasChanges}>
                    Cofnij zmiany
                  </button>
                  <button className="primary-button" onClick={handleSave} type="button" disabled={!hasChanges || !form.name.trim()}>
                    Zapisz zmiany
                  </button>
                </div>
              )}
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
      {showCaseCreateModal ? (
        <CaseCreateModal
          lead={liveLead}
          templates={snapshot.caseTemplates}
          templateItems={snapshot.templateItems}
          onClose={() => setShowCaseCreateModal(false)}
          onCreate={(payload) => {
            void handleCreateCase(payload.mode, payload.templateId)
            setShowCaseCreateModal(false)
          }}
        />
      ) : null}
    </div>
  )
}

export function CaseCreateModal({
  lead,
  templates,
  templateItems,
  onClose,
  onCreate,
}: {
  lead: Lead
  templates: CaseTemplate[]
  templateItems: TemplateItem[]
  onClose: () => void
  onCreate: (payload: { mode: CaseBootstrapMode; templateId?: string }) => void
}) {
  const [mode, setMode] = useState<CaseBootstrapMode>("empty_case")
  const caseTypeOptions = useMemo(
    () =>
      Array.from(new Set([...STARTER_CASE_TYPES, ...templates.map((entry) => entry.caseType).filter(Boolean)])).sort((a, b) =>
        a.localeCompare(b, "pl"),
      ),
    [templates],
  )
  const [caseType, setCaseType] = useState(caseTypeOptions[0] ?? STARTER_CASE_TYPES[0])

  const templatesForType = useMemo(
    () => templates.filter((entry) => entry.caseType === caseType).sort((a, b) => a.name.localeCompare(b.name, "pl")),
    [caseType, templates],
  )
  const [selectedTemplateId, setSelectedTemplateId] = useState("")

  useEffect(() => {
    if (mode === "empty_case") return
    const preferred = templatesForType.find((entry) => entry.isDefault)?.id ?? templatesForType[0]?.id ?? ""
    setSelectedTemplateId(preferred)
  }, [mode, templatesForType])

  const selectedTemplate = templatesForType.find((entry) => entry.id === selectedTemplateId) ?? null
  const selectedItems = useMemo(
    () =>
      selectedTemplate
        ? templateItems
            .filter((item) => item.templateId === selectedTemplate.id)
            .sort((a, b) => a.sortOrder - b.sortOrder)
        : [],
    [selectedTemplate, templateItems],
  )

  const isTemplateMode = mode === "template_case" || mode === "template_case_with_portal"
  const isSubmitDisabled = isTemplateMode && !selectedTemplate

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitDisabled) return
    onCreate({ mode, templateId: isTemplateMode ? selectedTemplate?.id : undefined })
  }

  return (
    <ModalShell title={`Utworz sprawe (${lead.name})`} onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <label className="field-block">
          <span>Tryb utworzenia sprawy</span>
          <select className="select-input" value={mode} onChange={(event) => setMode(event.target.value as CaseBootstrapMode)}>
            <option value="empty_case">Pusta sprawa</option>
            <option value="template_case">Sprawa z szablonu</option>
            <option value="template_case_with_portal">Sprawa z szablonu + od razu link klienta</option>
          </select>
        </label>

        {isTemplateMode ? (
          <>
            <div className="form-grid">
              <label className="field-block">
                <span>Typ sprawy</span>
                <select className="select-input" value={caseType} onChange={(event) => setCaseType(event.target.value)}>
                  {caseTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block">
                <span>Szablon</span>
                <select
                  className="select-input"
                  value={selectedTemplateId}
                  onChange={(event) => setSelectedTemplateId(event.target.value)}
                  disabled={templatesForType.length === 0}
                >
                  {templatesForType.length === 0 ? <option value="">Brak szablonow dla typu</option> : null}
                  {templatesForType.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name}
                      {entry.isDefault ? " (domyslny)" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <article className="info-card">
              <div className="section-head">
                <strong>Podglad checklisty</strong>
                <span className="muted-small">{selectedItems.length} pozycji</span>
              </div>
              {selectedItems.length === 0 ? (
                <ViewState kind="empty">Wybrany szablon nie ma jeszcze pozycji.</ViewState>
              ) : (
                <div className="stack-list">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="timeline-row">
                      <div>
                        <div className="timeline-title">{item.sortOrder}. {item.title}</div>
                        <div className="muted-small">{getTemplateItemTypeLabel(item.itemType)}</div>
                      </div>
                      <span className="badge">{item.required ? "obowiazkowe" : "opcjonalne"}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </>
        ) : null}

        <div className="toolbar-row end">
          <button type="button" className="ghost-button" onClick={onClose}>
            Anuluj
          </button>
          <button type="submit" className="primary-button" disabled={isSubmitDisabled}>
            Utworz sprawe
          </button>
        </div>
      </form>
    </ModalShell>
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
    const searchableText = normalizeSearchValue(`${lead.name} ${lead.company} ${lead.email} ${lead.phone} ${lead.source} ${lead.nextActionTitle}`)
    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery)
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesQuery && matchesStatus
  })

  return (
    <>
      <PageShell title="Leady" subtitle="Finalna lista leadow: status, wartosc, aktywne dzialania, overdue, ostatni kontakt, kolejny krok i risk.">
        <section className={`panel-card lead-table-card${isMobileProfile ? " lead-mobile-card" : ""}`}>
          <div className="toolbar-row wrap">
            <input
              className="text-input"
              placeholder="Szukaj po nazwie, firmie, mailu, telefonie, zrodle lub next step"
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

          {filtered.length === 0 ? (
            <ViewState kind="empty">
              {snapshot.leads.length === 0 && !query && statusFilter === "all" ? "Dodaj pierwszego leada." : "Brak wynikow."}
            </ViewState>
          ) : null}

          {isMobileProfile ? (
            <div className="lead-mobile-list">
              {filtered.map((lead) => {
                const stats = getLeadActiveItemStats(lead.id, snapshot.items, { timeZone: snapshot.settings.timezone })
                const leadItems = snapshot.items.filter((item) => item.leadId === lead.id)
                const lastContact = leadItems.length > 0 ? leadItems.map((item) => getItemPrimaryDate(item)).sort().at(-1) ?? lead.updatedAt : lead.updatedAt
                const staleHours = hoursSince(lastContact)
                const riskLabel = buildRiskLabel(stats.overdueCount, staleHours)

                return (
                  <button key={lead.id} className="lead-mobile-row" onClick={() => setSelectedLead(lead)} type="button">
                    <div className="lead-mobile-top">
                      <div className="lead-mobile-main">
                        <Avatar name={lead.name} />
                        <div className="lead-mobile-text">
                          <div className="lead-name">{lead.name}</div>
                           <div className="lead-mobile-meta-line">
                             <span>{lead.company || lead.source}</span>
                             <span>·</span>
                             <span>{formatMoney(lead.value)}</span>
                             <span>·</span>
                             <span>{stats.activeCount} aktywne</span>
                             <span>·</span>
                             <span className="lead-table-overdue">{stats.overdueCount} zalegle</span>
                           </div>
                          <div className="lead-mobile-meta-line">
                            <span>Ostatni kontakt: {formatDateTime(lastContact, { timeZone: snapshot.settings.timezone })}</span>
                          </div>
                           <div className="lead-mobile-meta-line">
                             <span>Kolejny krok: {lead.nextActionTitle || "Brak"}</span>
                             <span>·</span>
                             <span>Risk: {riskLabel}</span>
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
            <div className="lead-table lead-table-v2">
              <div className="lead-table-header" role="row">
                <div>KLIENT</div>
                <div>STATUS</div>
                <div>WARTOSC</div>
                <div>AKTYWNE</div>
                <div>OVERDUE</div>
                <div>OSTATNI KONTAKT</div>
                <div>KOLEJNY KROK</div>
                <div>RISK</div>
              </div>

              <div className="lead-table-body">
                {filtered.map((lead) => {
                  const stats = getLeadActiveItemStats(lead.id, snapshot.items, { timeZone: snapshot.settings.timezone })
                  const leadItems = snapshot.items.filter((item) => item.leadId === lead.id)
                  const lastContact = leadItems.length > 0 ? leadItems.map((item) => getItemPrimaryDate(item)).sort().at(-1) ?? lead.updatedAt : lead.updatedAt
                  const staleHours = hoursSince(lastContact)
                  const riskLabel = buildRiskLabel(stats.overdueCount, staleHours)

                  return (
                    <button key={lead.id} className="lead-table-row lead-table-row-v2" onClick={() => setSelectedLead(lead)} type="button">
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
                      <div className="lead-table-value">{formatMoney(lead.value)}</div>
                      <div className="lead-table-tasks">{stats.activeCount}</div>
                      <div className="lead-table-overdue">{stats.overdueCount}</div>
                      <div className="muted-small">{formatDateTime(lastContact, { timeZone: snapshot.settings.timezone })}</div>
                      <div className="muted-small">{lead.nextActionTitle || "Brak"}</div>
                      <div className={`risk-badge risk-${riskLabel.toLowerCase()}`}>{riskLabel}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </PageShell>

      {selectedLead ? <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} /> : null}
    </>
  )
}

function getTemplateItemTypeLabel(kind: TemplateItemKind) {
  return TEMPLATE_ITEM_TYPE_OPTIONS.find((option) => option.value === kind)?.label ?? kind
}

function mapTemplateItemToWorkItemType(kind: TemplateItemKind): WorkItem["type"] {
  if (kind === "approval" || kind === "decision") return "deadline"
  if (kind === "response") return "follow_up"
  return "task"
}

function buildTemplateEditorItems(items: TemplateItem[]): TemplateEditorItem[] {
  return items
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      title: item.title,
      itemType: item.itemType,
      description: item.description,
      required: item.required,
    }))
}

async function buildOrReusePortalLinkForCase(
  caseId: string,
  tokens: Array<{ id: string; caseId: string; tokenHash: string; expiresAt: string; revokedAt: string; lockedUntil?: string }>,
  issueToken: (payload: { caseId: string; tokenHash: string; expiresAt: string }) => void,
  revokeToken: (tokenId: string, reason?: string) => void,
) {
  const active = tokens.filter((token) => token.caseId === caseId && isPortalTokenActive(token))
  active.forEach((token) => revokeToken(token.id, "rotated"))

  const rawToken = generatePortalTokenRaw()
  const tokenHash = await sha256Hex(rawToken)
  const expiresAt = addHours(72)
  issueToken({ caseId, tokenHash, expiresAt })
  return rawToken
}

export function TasksPageView() {
  const { snapshot, deleteItem, snoozeItem, toggleItemDone } = useAppStore()
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<WorkItem | null>(null)
  const [tab, setTab] = useState<"all_active" | "today" | "week" | "overdue" | "no_lead" | "done">("all_active")

  const taskItems = useMemo(() => getTaskListItems(snapshot.items), [snapshot.items])
  const weekDays = useMemo(() => getWeekDays(0, getCurrentDateKey({ timeZone: snapshot.settings.timezone }), { timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const weekStart = weekDays[0]
  const weekEnd = weekDays[weekDays.length - 1]

  const list = useMemo(() => {
    if (tab === "all_active") {
      return taskItems.filter((item) => item.status !== "done")
    }
    if (tab === "today") {
      return taskItems.filter((item) => isToday(getItemPrimaryDate(item), { timeZone: snapshot.settings.timezone }))
    }
    if (tab === "week") {
      return taskItems.filter((item) => {
        const day = toDateKey(getItemPrimaryDate(item), { timeZone: snapshot.settings.timezone })
        return Boolean(day && day >= weekStart && day <= weekEnd && item.status !== "done")
      })
    }
    if (tab === "overdue") {
      return taskItems.filter((item) => isOverdue(item, { timeZone: snapshot.settings.timezone }))
    }
    if (tab === "no_lead") {
      return taskItems.filter((item) => !item.leadId && item.status !== "done")
    }
    return taskItems.filter((item) => item.status === "done")
  }, [snapshot.settings.timezone, tab, taskItems, weekEnd, weekStart])

  return (
    <PageShell title="Zadania" subtitle="Finalne zakladki operacyjne: wszystkie aktywne, dzis, ten tydzien, zalegle, bez leada i zrobione.">
      <section className="panel-card">
        <div className="segmented-tabs">
          {[
            { key: "all_active", label: "Wszystkie aktywne" },
            { key: "today", label: "Dziś" },
            { key: "week", label: "Ten tydzien" },
            { key: "overdue", label: "Zalegle" },
            { key: "no_lead", label: "Bez leada" },
            { key: "done", label: "Zrobione" },
          ].map((tabOption) => (
            <button key={tabOption.key} className={tab === tabOption.key ? "active" : ""} onClick={() => setTab(tabOption.key as typeof tab)}>
              {tabOption.label}
            </button>
          ))}
        </div>

        <div className="stack-list">
          {list.length === 0 ? <ViewState kind="empty">{taskItems.length === 0 ? "Dodaj pierwsze zadanie." : "Brak wpisow w tej sekcji."}</ViewState> : null}
          {list.map((item) => (
            <div key={item.id} className="task-row">
              <ItemCard item={item} leadName={getItemLeadLabel(item, snapshot.leads)} onEdit={() => setEditingItem(item)} dateOptions={{ timeZone: snapshot.settings.timezone }} />
              <div className="task-actions">
                <button className="ghost-button small" onClick={() => toggleItemDone(item.id)}>{item.status === "done" ? "Cofnij" : "Zrobione"}</button>
                <button className="ghost-button small" onClick={() => snoozeItem(item.id, getNextSnoozeByHours(getItemPrimaryDate(item), 1, { timeZone: snapshot.settings.timezone }))}>+1h</button>
                <button className="ghost-button small" onClick={() => snoozeItem(item.id, getNextDaySnoozeAtPreferredTime(getItemPrimaryDate(item), { timeZone: snapshot.settings.timezone }))}>Jutro</button>
                <button className="danger-button small" onClick={() => setItemToDelete(item)}>Usun</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editingItem ? <ItemModal item={editingItem} onClose={() => setEditingItem(null)} /> : null}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        title="Usunac dzialanie?"
        description="To dzialanie zostanie trwale usuniete z listy i kalendarza."
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (!itemToDelete) return
          deleteItem(itemToDelete.id)
          setItemToDelete(null)
        }}
      />
    </PageShell>
  )
}

export function CasesPageView() {
  const {
    snapshot,
    addItem,
    updateItem,
    updateLead,
    issueClientPortalToken,
    revokeClientPortalToken,
    addNotification,
    addFileAttachment,
    addApproval,
  } = useAppStore()
  const searchParams = useSearchParams()
  const focusedCaseId = searchParams.get("caseId")
  const [filter, setFilter] = useState<CaseListFilter>("all")
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(focusedCaseId)
  const dashboard = useMemo(() => buildCasesDashboard(snapshot, filter), [filter, snapshot])
  const selectedCase = dashboard.all.find((entry) => entry.id === (selectedCaseId ?? focusedCaseId ?? "")) ?? null
  const selectedLead = selectedCase ? snapshot.leads.find((entry) => entry.id === selectedCase.leadId) ?? null : null
  const selectedCaseItems = selectedCase ? snapshot.items.filter((item) => item.leadId === selectedCase.leadId) : []
  const filterOptions: { value: CaseListFilter; label: string }[] = [
    { value: "all", label: "Wszystkie" },
    { value: "waiting_for_client", label: "Czeka na klienta" },
    { value: "blocked", label: "Zablokowane" },
    { value: "ready_to_start", label: "Gotowe do startu" },
    { value: "overdue", label: "Przeterminowane" },
  ]

  return (
    <PageShell
      title="Sprawy"
      subtitle="Pelnoprawny modul operacyjny po sprzedazy: dashboard, filtry i szybki obraz blokad."
    >
      <section className="stat-grid">
        <StatCard label="Sprawy aktywne" value={dashboard.stats.active} />
        <StatCard label="Czeka na klienta" value={dashboard.stats.waitingForClient} />
        <StatCard label="Zablokowane" value={dashboard.stats.blocked} />
        <StatCard label="Gotowe do startu" value={dashboard.stats.readyToStart} />
      </section>

      <section className="panel-card">
        {dashboard.all.length === 0 ? (
          <ViewState kind="empty">
            Brak spraw operacyjnych. Po statusie leada `won` albo `ready_to_start` mozna uruchomic sprawe z Lead Detail.
          </ViewState>
        ) : (
          <div className="stack-list">
            <article className="cases-filter-card">
              <div className="section-head cases-filter-head">
                <strong>Filtry</strong>
              </div>
              <div className="drawer-actions wrap">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    className={filter === option.value ? "secondary-button small" : "ghost-button small"}
                    type="button"
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </article>

            <article className="info-card">
              <div className="section-head">
                <strong>Wymagaja ruchu dzis</strong>
              </div>
              {dashboard.requiresMoveToday.length === 0 ? (
                <ViewState kind="empty">Brak spraw wymagajacych ruchu dzisiaj.</ViewState>
              ) : (
                <div className="stack-list">
                  {dashboard.requiresMoveToday.slice(0, 5).map((entry) => (
                    <button key={entry.id} className="timeline-row case-inline-row" type="button" onClick={() => setSelectedCaseId(entry.id)}>
                      <div>
                        <div className="timeline-title">{entry.caseName}</div>
                        <div className="muted-small">
                          {entry.client} · stoi {entry.stalledDays} dni · brakujace: {entry.missingItems}
                        </div>
                      </div>
                      <OperationalStatusBadge status={entry.operationalStatus} />
                    </button>
                  ))}
                </div>
              )}
            </article>

            <article className="info-card">
              <div className="section-head">
                <strong>Lista spraw</strong>
                <span className="muted-small">{dashboard.filtered.length} wynikow</span>
              </div>
              {dashboard.filtered.length === 0 ? (
                <ViewState kind="empty">Brak spraw dla wybranego filtra.</ViewState>
              ) : (
                <div className="case-list-grid">
                  {dashboard.filtered.map((entry) => (
                    <button
                      key={entry.id}
                      className={`case-card ${selectedCase?.id === entry.id ? "active" : ""}`}
                      type="button"
                      onClick={() => setSelectedCaseId(entry.id)}
                    >
                      <div className="case-card-head">
                        <div>
                          <div className="case-card-title">{entry.caseName}</div>
                          <div className="muted-small">{entry.client}</div>
                        </div>
                        <OperationalStatusBadge status={entry.operationalStatus} />
                      </div>

                      <div className="case-card-grid">
                        <div><strong>Typ:</strong> {entry.typeLabel}</div>
                        <div><strong>Kompletnosc:</strong> {entry.completenessPercent}%</div>
                        <div><strong>Brakujace:</strong> {entry.missingItems}</div>
                        <div><strong>Termin:</strong> {formatDateTime(entry.dueAt, { timeZone: snapshot.settings.timezone })}</div>
                        <div><strong>Ostatnia aktywnosc:</strong> {formatDateTime(entry.lastActivityAt, { timeZone: snapshot.settings.timezone })}</div>
                        <div><strong>Stoi:</strong> {entry.stalledDays} dni</div>
                        <div><strong>Przypomnienie:</strong> {entry.reminderSent ? "wyslane" : "brak"}</div>
                        <div><strong>Kolejny ruch:</strong> {entry.nextMove}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </article>

            {selectedCase && selectedLead ? (
              <CaseDetailPanel
                entry={selectedCase}
                lead={selectedLead}
                items={selectedCaseItems}
                focusedCaseId={focusedCaseId}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onUpdateLead={updateLead}
                clientPortalTokens={snapshot.clientPortalTokens}
                onIssueClientPortalToken={issueClientPortalToken}
                onRevokeClientPortalToken={revokeClientPortalToken}
                onAddNotification={addNotification}
                onAddFileAttachment={addFileAttachment}
                onAddApproval={addApproval}
                fileAttachments={snapshot.fileAttachments}
                approvals={snapshot.approvals}
              />
            ) : null}
          </div>
        )}
      </section>
    </PageShell>
  )
}

function ChecklistRow({
  row,
  onApprove,
  onSendBack,
}: {
  row: {
    id: string
    name: string
    type: string
    status: string
    dueAt: string
    owner: string
    canApprove: boolean
    canSendBack: boolean
  }
  onApprove: () => void
  onSendBack: () => void
}) {
  return (
    <div className="case-checklist-row">
      <div>{row.name}</div>
      <div>{row.type}</div>
      <div><span className="badge">{row.status}</span></div>
      <div>{row.dueAt || "Brak terminu"}</div>
      <div>{row.owner}</div>
      <div className="drawer-actions wrap">
        <button className="ghost-button small" type="button" onClick={onApprove} disabled={!row.canApprove}>
          Zatwierdz
        </button>
        <button className="ghost-button small" type="button" onClick={onSendBack} disabled={!row.canSendBack}>
          Odeslij
        </button>
      </div>
    </div>
  )
}

function ActivityTimeline({ rows }: { rows: Array<{ label: string; at: string; kind: "done" | "pending" }> }) {
  return (
    <article className="info-card">
      <div className="section-head">
        <strong>Ostatnie aktywnosci</strong>
      </div>
      <div className="stack-list">
        {rows.map((row) => (
          <div key={`${row.label}-${row.at}`} className="timeline-row">
            <div>
              <div className="timeline-title">{row.label}</div>
              <div className="muted-small">{row.at}</div>
            </div>
            <span className={`badge ${row.kind === "done" ? "status-won" : ""}`}>{row.kind === "done" ? "gotowe" : "oczekuje"}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

function BlockerPanel({ blockers }: { blockers: Array<{ label: string; active: boolean }> }) {
  return (
    <article className="info-card">
      <div className="section-head">
        <strong>Blokery</strong>
      </div>
      <div className="stack-list">
        {blockers.map((blocker) => (
          <div key={blocker.label} className="timeline-row">
            <div className="timeline-title">{blocker.label}</div>
            <span className={`badge ${blocker.active ? "status-follow_up" : "status-won"}`}>
              {blocker.active ? "blokuje" : "ok"}
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}

function QuickActionPanel({
  onSendReminder,
  onCopyClientLink,
  onRevokeClientLink,
  onMarkVerified,
  onChangeCaseStatus,
  onAddManualNote,
}: {
  onSendReminder: () => void
  onCopyClientLink: () => void
  onRevokeClientLink: () => void
  onMarkVerified: () => void
  onChangeCaseStatus: () => void
  onAddManualNote: () => void
}) {
  return (
    <article className="info-card case-quick-panel">
      <div className="section-head">
        <strong>Quick actions</strong>
      </div>
      <div className="stack-list">
        <button className="secondary-button" type="button" onClick={onSendReminder}>Wyslij przypomnienie</button>
        <button className="ghost-button" type="button" onClick={onCopyClientLink}>Skopiuj link klienta</button>
        <button className="ghost-button" type="button" onClick={onRevokeClientLink}>Odwolaj aktywny link</button>
        <button className="ghost-button" type="button" onClick={onMarkVerified}>Oznacz jako zweryfikowane</button>
        <button className="ghost-button" type="button" onClick={onChangeCaseStatus}>Zmien status sprawy</button>
        <button className="ghost-button" type="button" onClick={onAddManualNote}>Dodaj reczna notatke</button>
      </div>
    </article>
  )
}

function CaseDetailPanel({
  entry,
  lead,
  items,
  focusedCaseId,
  onAddItem,
  onUpdateItem,
  onUpdateLead,
  clientPortalTokens,
  onIssueClientPortalToken,
  onRevokeClientPortalToken,
  onAddNotification,
  onAddFileAttachment,
  onAddApproval,
  fileAttachments,
  approvals,
}: {
  entry: CaseListRow
  lead: Lead
  items: WorkItem[]
  focusedCaseId: string | null
  onAddItem: (payload: WorkItemInput) => void
  onUpdateItem: (itemId: string, patch: Partial<WorkItem>) => void
  onUpdateLead: (leadId: string, patch: Partial<Lead>) => void
  clientPortalTokens: Array<{ id: string; caseId: string; tokenHash: string; expiresAt: string; revokedAt: string; lockedUntil?: string }>
  onIssueClientPortalToken: (payload: { caseId: string; tokenHash: string; expiresAt: string }) => void
  onRevokeClientPortalToken: (tokenId: string, reason?: string) => void
  onAddNotification: (payload: {
    userId: string
    channel: "in_app" | "email"
    kind?: string
    dedupeKey?: string
    title: string
    message: string
    relatedLeadId?: string | null
    relatedCaseId?: string | null
    recipient?: string
  }) => void
  onAddFileAttachment: (payload: {
    caseId: string
    caseItemId?: string | null
    fileName: string
    mimeType: string
    fileSizeBytes: number
    storagePath?: string
    uploadedByRole?: "client" | "operator" | "system"
    uploadedByLabel?: string
  }) => void
  onAddApproval: (payload: {
    caseId: string
    caseItemId?: string | null
    requestedToEmail: string
    status: "not_sent" | "sent" | "reminder_sent" | "responded" | "overdue"
    decision?: "accepted" | "rejected" | "needs_changes" | "option_a" | "option_b" | "option_c" | "submitted" | "answered"
    optionValue?: string
    actorRole?: "client" | "operator" | "system"
    actorLabel?: string
    note: string
    decidedAt?: string
  }) => void
  fileAttachments: Array<{
    id: string
    caseId: string | null
    caseItemId: string | null
    fileName: string
    mimeType: string
    fileSizeBytes: number
    createdAt: string
    uploadedByRole: "client" | "operator" | "system"
    uploadedByLabel: string
  }>
  approvals: Array<{
    id: string
    caseId: string | null
    caseItemId: string | null
    decision: "accepted" | "rejected" | "needs_changes" | "option_a" | "option_b" | "option_c" | "submitted" | "answered"
    note: string
    optionValue: string
    actorLabel: string
    createdAt: string
  }>
}) {
  const checklistRows = useMemo(() => {
    if (items.length === 0) {
      return [
        {
          id: "req-1",
          name: "Brief klienta",
          type: "dokument",
          status: "brak",
          dueAt: "",
          owner: "Klient",
          canApprove: false,
          canSendBack: false,
        },
        {
          id: "req-2",
          name: "Dostep do materialow",
          type: "dostep",
          status: "brak",
          dueAt: "",
          owner: "Klient",
          canApprove: false,
          canSendBack: false,
        },
      ]
    }

    return items.map((item) => ({
      id: item.id,
      name: item.title,
      type: getItemTypeMeta(item.type).label,
      status: item.status === "done" ? "zaakceptowane" : item.status === "snoozed" ? "do weryfikacji" : "wyslano prosbe",
      dueAt: formatDateTime(getItemPrimaryDate(item), {}),
      owner: item.leadLabel || lead.name || "Operator",
      canApprove: item.status === "snoozed",
      canSendBack: item.status === "snoozed" || item.status === "done",
    }))
  }, [items, lead.name])

  const activityRows = useMemo(() => {
    const lastUpdated = formatDateTime(entry.lastActivityAt, {})
    return [
      { label: "Wyslano prosbe", at: lastUpdated, kind: "done" as const },
      { label: "Klient dodal plik", at: entry.reminderSent ? lastUpdated : "oczekuje", kind: entry.reminderSent ? ("done" as const) : ("pending" as const) },
      { label: "Klient zaakceptowal", at: entry.completenessPercent >= 80 ? lastUpdated : "oczekuje", kind: entry.completenessPercent >= 80 ? ("done" as const) : ("pending" as const) },
      { label: "Klient nie odpowiedzial", at: entry.stalledDays >= 2 ? `${entry.stalledDays} dni temu` : "brak", kind: entry.stalledDays >= 2 ? ("pending" as const) : ("done" as const) },
      { label: "System wyslal przypomnienie", at: entry.reminderSent ? lastUpdated : "brak", kind: entry.reminderSent ? ("done" as const) : ("pending" as const) },
    ]
  }, [entry.completenessPercent, entry.lastActivityAt, entry.reminderSent, entry.stalledDays])

  const blockers = useMemo(() => {
    const notes = (lead.notes || "").toLowerCase()
    const has = (word: string) => notes.includes(word)
    return [
      { label: "Brak logo", active: !has("logo") },
      { label: "Brak dostepu", active: !has("dostep") },
      { label: "Brak akceptacji wariantu", active: !has("akcept") },
      { label: "Brak podpisu", active: !has("podpis") },
      { label: "Brak briefu", active: !has("brief") },
    ]
  }, [lead.notes])

  const attachmentsForCase = useMemo(
    () =>
      fileAttachments
        .filter((attachment) => attachment.caseId === entry.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [entry.id, fileAttachments],
  )

  const caseApprovals = useMemo(
    () =>
      approvals
        .filter((approval) => approval.caseId === entry.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [approvals, entry.id],
  )

  const blockedByRequired = useMemo(
    () => items.some((item) => item.priority === "high" && item.status !== "done"),
    [items],
  )
  const [signedAccessMap, setSignedAccessMap] = useState<Record<string, { sig: string; expiresAt: string }>>({})

  function appendLeadNote(note: string) {
    const current = lead.notes?.trim() ?? ""
    return current ? `${current}\n${note}` : note
  }

  function onSendReminder() {
    onAddItem({
      workspaceId: lead.workspaceId ?? null,
      leadId: lead.id,
      leadLabel: lead.name,
      recordType: "task",
      type: "deadline",
      title: `Przypomnienie do klienta (${entry.caseName})`,
      description: "Przypomnienie operacyjne ze szczegolow sprawy.",
      status: "todo",
      priority: "high",
      scheduledAt: nowIso(),
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "at_time",
      showInTasks: true,
      showInCalendar: false,
    })
  }

  async function onCopyClientLink() {
    const rawToken = await buildOrReusePortalLinkForCase(
      entry.id,
      clientPortalTokens,
      onIssueClientPortalToken,
      onRevokeClientPortalToken,
    )
    const link = typeof window === "undefined" ? `/client-portal/${rawToken}` : `${window.location.origin}/client-portal/${rawToken}`
    void navigator.clipboard?.writeText(link).catch(() => null)
    onAddNotification({
      userId: "client_portal",
      channel: "in_app",
      title: "Wygenerowano link klienta",
      message: `Nowy link dla sprawy ${entry.caseName} jest aktywny przez 72h.`,
      relatedLeadId: lead.id,
      relatedCaseId: entry.id,
    })
  }

  function onMarkVerified() {
    const firstPending = items.find((item) => item.status === "snoozed")
    if (!firstPending) return
    onUpdateItem(firstPending.id, { status: "done" })
    onAddApproval({
      caseId: entry.id,
      caseItemId: firstPending.id,
      requestedToEmail: lead.email || "klient@example.com",
      status: "responded",
      decision: "accepted",
      actorRole: "operator",
      actorLabel: "Operator",
      note: "Operator zatwierdzil element.",
      decidedAt: nowIso(),
    })
  }

  function onChangeCaseStatus() {
    const cycle: CaseOperationalStatus[] = ["waiting_for_client", "blocked", "ready_to_start", "in_progress"]
    const currentIndex = cycle.indexOf(entry.operationalStatus)
    const next = cycle[(currentIndex + 1) % cycle.length] ?? "in_progress"
    const cleaned = (lead.notes || "").replace(/\[op_status:[^\]]+\]/g, "").trim()
    onUpdateLead(lead.id, { notes: `${cleaned}\n[op_status:${next}]`.trim() })
  }

  function onAddManualNote() {
    const value = typeof window === "undefined" ? "" : window.prompt("Dodaj notatke do sprawy:", "")
    if (!value?.trim()) return
    onUpdateLead(lead.id, { notes: appendLeadNote(`[NOTATKA] ${value.trim()}`) })
  }

  function onRevokeClientLink() {
    const activeTokens = clientPortalTokens.filter((token) => token.caseId === entry.id && isPortalTokenActive(token))
    if (activeTokens.length === 0) return
    activeTokens.forEach((token) => onRevokeClientPortalToken(token.id, "manual_revoke"))
    onAddNotification({
      userId: "client_portal",
      channel: "in_app",
      title: "Odwolano link klienta",
      message: `Aktywne linki dla sprawy ${entry.caseName} zostaly odwolane.`,
      relatedLeadId: lead.id,
      relatedCaseId: entry.id,
    })
  }

  function onPortalClientAction(itemId: string, actionType: "file" | "response" | "approval") {
    const target = items.find((item) => item.id === itemId)
    if (!target) return

    if (actionType === "file") {
      onAddFileAttachment({
        caseId: entry.id,
        caseItemId: target.id,
        fileName: `${target.title.replace(/\s+/g, "_").toLowerCase()}-upload.pdf`,
        mimeType: "application/pdf",
        fileSizeBytes: 240000,
        uploadedByRole: "client",
        uploadedByLabel: lead.name || "Klient",
      })
      onUpdateItem(target.id, { status: "snoozed" })
      onAddApproval({
        caseId: entry.id,
        caseItemId: target.id,
        requestedToEmail: lead.email || "klient@example.com",
        status: "responded",
        decision: "submitted",
        actorRole: "client",
        actorLabel: lead.name || "Klient",
        note: "Doslano plik.",
        decidedAt: nowIso(),
      })
    }

    if (actionType === "response") {
      onAddApproval({
        caseId: entry.id,
        caseItemId: target.id,
        requestedToEmail: lead.email || "klient@example.com",
        status: "responded",
        decision: "answered",
        actorRole: "client",
        actorLabel: lead.name || "Klient",
        note: "Klient odpowiedzial z panelu.",
        decidedAt: nowIso(),
      })
      onUpdateItem(target.id, { status: "snoozed" })
    }

    if (actionType === "approval") {
      onAddApproval({
        caseId: entry.id,
        caseItemId: target.id,
        requestedToEmail: lead.email || "klient@example.com",
        status: "responded",
        decision: "accepted",
        actorRole: "client",
        actorLabel: lead.name || "Klient",
        note: "Zaakceptowano w panelu klienta.",
        decidedAt: nowIso(),
      })
      onUpdateItem(target.id, { status: "done" })
    }
  }

  function onChecklistApprove(itemId: string) {
    const match = items.find((item) => item.id === itemId)
    if (!match) return
    onUpdateItem(match.id, { status: "done" })
    onAddApproval({
      caseId: entry.id,
      caseItemId: match.id,
      requestedToEmail: lead.email || "klient@example.com",
      status: "responded",
      decision: "accepted",
      actorRole: "operator",
      actorLabel: "Operator",
      note: "Operator zatwierdzil po weryfikacji.",
      decidedAt: nowIso(),
    })
  }

  function onChecklistSendBack(itemId: string) {
    const match = items.find((item) => item.id === itemId)
    if (!match) return
    onUpdateItem(match.id, { status: "todo" })
    onAddApproval({
      caseId: entry.id,
      caseItemId: match.id,
      requestedToEmail: lead.email || "klient@example.com",
      status: "reminder_sent",
      decision: "needs_changes",
      actorRole: "operator",
      actorLabel: "Operator",
      note: "Element odeslany do poprawy.",
      decidedAt: nowIso(),
    })
  }

  async function onGenerateSignedAccess(attachmentId: string) {
    const seed = `${lead.id}:${entry.id}:${lead.workspaceId ?? "local"}`
    const signed = await createSignedAttachmentAccess(attachmentId, seed, 15)
    setSignedAccessMap((current) => ({ ...current, [attachmentId]: { sig: signed.sig, expiresAt: signed.expiresAt } }))
  }

  return (
    <article className="info-card case-detail-shell">
      <div className="section-head case-detail-head">
        <div>
          <strong>CaseDetail</strong>
          <div className="muted-small">{focusedCaseId === entry.id ? "otwarta z Lead Detail" : "wybrana z listy"}</div>
        </div>
      </div>

      <section className="case-top-summary">
        <div className="info-row"><strong>Nazwa klienta</strong><span>{entry.client}</span></div>
        <div className="info-row"><strong>Typ uslugi</strong><span>{entry.typeLabel}</span></div>
        <div className="info-row"><strong>Status sprzedazowy</strong><LeadStatusBadge status="won" /></div>
        <div className="info-row"><strong>Status operacyjny</strong><OperationalStatusBadge status={entry.operationalStatus} /></div>
        <div className="info-row"><strong>Kompletnosc</strong><span>{entry.completenessPercent}%</span></div>
        <div className="info-row"><strong>Ile rzeczy brakuje</strong><span>{entry.missingItems}</span></div>
        <div className="info-row"><strong>Czekamy na klienta</strong><span>{entry.operationalStatus === "waiting_for_client" ? `${entry.stalledDays} dni` : "0 dni"}</span></div>
        <div className="info-row"><strong>Kolejny ruch</strong><span>{entry.nextMove}</span></div>
        <div className="info-row">
          <strong>Blokada wymaganych</strong>
          <span className={`badge ${blockedByRequired ? "status-blocked" : "status-won"}`}>{blockedByRequired ? "tak" : "nie"}</span>
        </div>
      </section>

      <div className="case-detail-columns">
        <div className="case-detail-main">
          <article className="info-card">
            <div className="section-head">
              <strong>Lista wymaganych rzeczy</strong>
            </div>
            <div className="case-checklist-header">
              <div>Nazwa</div>
              <div>Typ</div>
              <div>Status</div>
              <div>Termin</div>
              <div>Odpowiedzialny</div>
              <div>Akcja</div>
            </div>
            <div className="stack-list">
              {checklistRows.map((row) => (
                <ChecklistRow
                  key={row.id}
                  row={row}
                  onApprove={() => onChecklistApprove(row.id)}
                  onSendBack={() => onChecklistSendBack(row.id)}
                />
              ))}
            </div>
          </article>

          <article className="info-card">
            <div className="section-head">
              <strong>Pliki i metadane</strong>
              <span className="muted-small">{attachmentsForCase.length} plikow</span>
            </div>
            {attachmentsForCase.length === 0 ? <ViewState kind="empty">Brak doslanych plikow.</ViewState> : null}
            <div className="stack-list">
              {attachmentsForCase.map((attachment) => (
                <div key={attachment.id} className="timeline-row">
                  <div>
                    <div className="timeline-title">{attachment.fileName}</div>
                    <div className="muted-small">
                      {attachment.mimeType} · {formatFileSize(attachment.fileSizeBytes)} · {formatDateTime(attachment.createdAt, {})}
                    </div>
                    <div className="muted-small">Dodal: {attachment.uploadedByLabel || attachment.uploadedByRole}</div>
                  </div>
                  <div className="drawer-actions wrap">
                    <button className="ghost-button small" type="button" onClick={() => void onGenerateSignedAccess(attachment.id)}>
                      Generuj link
                    </button>
                    {signedAccessMap[attachment.id] ? (
                      <span className="muted-small">
                        link: {signedAccessMap[attachment.id].sig.slice(0, 10)}... wazny do {formatDateTime(signedAccessMap[attachment.id].expiresAt, {})}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="info-card">
            <div className="section-head">
              <strong>Decyzje i akceptacje</strong>
              <span className="muted-small">{caseApprovals.length} wpisow</span>
            </div>
            {caseApprovals.length === 0 ? <ViewState kind="empty">Brak decyzji i akceptacji.</ViewState> : null}
            <div className="stack-list">
              {caseApprovals.slice(0, 10).map((approval) => (
                <div key={approval.id} className="timeline-row">
                  <div>
                    <div className="timeline-title">
                      {approval.decision}
                      {approval.optionValue ? ` (${approval.optionValue})` : ""}
                    </div>
                    <div className="muted-small">{approval.note || "Bez notatki"}</div>
                  </div>
                  <span className="muted-small">{approval.actorLabel}</span>
                </div>
              ))}
            </div>
          </article>

          <ActivityTimeline rows={activityRows} />
          <BlockerPanel blockers={blockers} />
        </div>

        <div className="case-detail-side">
          <QuickActionPanel
            onSendReminder={onSendReminder}
            onCopyClientLink={() => void onCopyClientLink()}
            onRevokeClientLink={onRevokeClientLink}
            onMarkVerified={onMarkVerified}
            onChangeCaseStatus={onChangeCaseStatus}
            onAddManualNote={onAddManualNote}
          />
          <article className="info-card">
            <div className="section-head">
              <strong>Symulacja panelu klienta</strong>
            </div>
            <div className="stack-list">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="timeline-row">
                  <div className="timeline-title">{item.title}</div>
                  <div className="drawer-actions wrap">
                    <button className="ghost-button small" type="button" onClick={() => onPortalClientAction(item.id, "file")}>
                      Dodaj plik
                    </button>
                    <button className="ghost-button small" type="button" onClick={() => onPortalClientAction(item.id, "response")}>
                      Odpowiedz
                    </button>
                    <button className="ghost-button small" type="button" onClick={() => onPortalClientAction(item.id, "approval")}>
                      Zaakceptuj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </article>
  )
}

export function ActivityPageView() {
  const { snapshot } = useAppStore()
  const itemRows = useMemo(
    () =>
      [...snapshot.items]
        .sort((a, b) => getItemPrimaryDate(b).localeCompare(getItemPrimaryDate(a)))
        .slice(0, 30)
        .map((item) => ({
          id: item.id,
          title: item.title,
          at: getItemPrimaryDate(item),
          badge: getItemTypeMeta(item.type).label,
        })),
    [snapshot.items],
  )
  const logRows = useMemo(
    () =>
      [...snapshot.activityLog]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 30)
        .map((entry) => ({
          id: entry.id,
          title: entry.eventTitle,
          at: entry.createdAt,
          badge: `log:${entry.eventType}`,
        })),
    [snapshot.activityLog],
  )
  const activityRows = useMemo(
    () =>
      [...itemRows, ...logRows]
        .sort((a, b) => b.at.localeCompare(a.at))
        .slice(0, 40),
    [itemRows, logRows],
  )
  const deliveryRows = useMemo(
    () =>
      [...snapshot.notificationDeliveryLog]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 25),
    [snapshot.notificationDeliveryLog],
  )

  return (
    <PageShell
      title="Aktywność"
      subtitle="Wspolny feed dzialan sprzedazowych i operacyjnych oraz log wysylek."
    >
      <section className="panel-card">
        {activityRows.length === 0 ? <ViewState kind="empty">Brak aktywnosci do pokazania.</ViewState> : null}
        <div className="stack-list">
          {activityRows.map((item) => (
            <article key={item.id} className="timeline-row">
              <div>
                <div className="timeline-title">{item.title}</div>
                <div className="muted-small">{formatDateTime(item.at, { timeZone: snapshot.settings.timezone })}</div>
              </div>
              <div className="badge">{item.badge}</div>
            </article>
          ))}
        </div>
      </section>
      <section className="panel-card">
        <div className="section-head">
          <strong>Log wysylek</strong>
          <span className="muted-small">{deliveryRows.length} wpisow</span>
        </div>
        {deliveryRows.length === 0 ? <ViewState kind="empty">Brak logu wysylek.</ViewState> : null}
        <div className="stack-list">
          {deliveryRows.map((entry) => (
            <article key={entry.id} className="timeline-row">
              <div>
                <div className="timeline-title">
                  {entry.channel} {"->"} {entry.recipient || "brak"}
                </div>
                <div className="muted-small">{formatDateTime(entry.createdAt, { timeZone: snapshot.settings.timezone })}</div>
              </div>
              <span className={`badge${entry.status === "failed" ? " danger" : ""}`}>{entry.status}</span>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
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
    <PageShell
      title="Kalendarz"
      subtitle={weekLabel}
      actions={
        <>
          <button className="ghost-button" onClick={() => setWeekOffset((value) => value - 1)} type="button">
            ←
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              setWeekOffset(0)
              setSelectedDay(fallbackDay)
            }}
          >
            Dziś
          </button>
          <button className="ghost-button" onClick={() => setWeekOffset((value) => value + 1)} type="button">
            →
          </button>
        </>
      }
    >
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
                          <div className="empty-box">{hasCalendarItems ? "Brak wydarzeń w tym dniu." : "Dodaj pierwsze wydarzenie."}</div>
                        ) : (
                          items.map((item) => renderWeekPill(item))
                        )}
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
                  <div className="empty-box">{hasCalendarItems ? "Brak wydarzeń w wybranym dniu." : "Dodaj pierwsze wydarzenie."}</div>
                ) : (
                  selectedDayItems.map((item) => renderWeekPill(item))
                )}
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
                      <button className="week-head" onClick={() => setSelectedDay(dayKey)} type="button">
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
    </PageShell>
  )
}

function TemplateEditorModal({
  template,
  templateItems,
  onClose,
  onSave,
}: {
  template: CaseTemplate | null
  templateItems: TemplateItem[]
  onClose: () => void
  onSave: (payload: CaseTemplateInput) => void
}) {
  const editingItems = useMemo(
    () => (template ? buildTemplateEditorItems(templateItems.filter((item) => item.templateId === template.id)) : []),
    [template, templateItems],
  )
  const [form, setForm] = useState(() => ({
    name: template?.name ?? "",
    caseType: template?.caseType ?? STARTER_CASE_TYPES[0],
    description: template?.description ?? "",
    isDefault: template?.isDefault ?? false,
    items:
      editingItems.length > 0
        ? editingItems
        : [{ title: "", itemType: "file" as TemplateItemKind, description: "", required: true }],
  }))

  function updateItem(index: number, patch: Partial<TemplateEditorItem>) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }))
  }

  function removeItem(index: number) {
    setForm((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function addItemRow() {
    setForm((current) => ({
      ...current,
      items: [...current.items, { title: "", itemType: "file", description: "", required: true }],
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim() || !form.caseType.trim()) return

    const cleanItems = form.items
      .map((item, index) => ({
        title: item.title.trim(),
        itemType: item.itemType,
        description: item.description,
        required: item.required,
        sortOrder: index + 1,
      }))
      .filter((item) => Boolean(item.title))

    onSave({
      name: form.name.trim(),
      caseType: form.caseType.trim(),
      description: form.description.trim(),
      isDefault: form.isDefault,
      items: cleanItems,
    })
  }

  return (
    <ModalShell title={template ? "Edytuj szablon checklisty" : "Nowy szablon checklisty"} onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field-block">
            <span>Nazwa szablonu</span>
            <input className="text-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="field-block">
            <span>Typ sprawy</span>
            <input className="text-input" value={form.caseType} onChange={(event) => setForm({ ...form, caseType: event.target.value })} />
          </label>
        </div>

        <label className="field-block">
          <span>Opis</span>
          <textarea
            className="text-area"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>

        <label className="switch-row">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(event) => setForm({ ...form, isDefault: event.target.checked })}
          />
          <span>Ustaw jako domyslny dla tego typu</span>
        </label>

        <article className="info-card">
          <div className="section-head">
            <strong>Pozycje checklisty</strong>
            <button className="ghost-button small" type="button" onClick={addItemRow}>
              Dodaj pozycje
            </button>
          </div>
          <div className="stack-list">
            {form.items.map((item, index) => (
              <div key={`${item.title}-${index}`} className="template-item-row">
                <label className="field-block">
                  <span>Nazwa</span>
                  <input className="text-input" value={item.title} onChange={(event) => updateItem(index, { title: event.target.value })} />
                </label>
                <label className="field-block">
                  <span>Typ itemu</span>
                  <select
                    className="select-input"
                    value={item.itemType}
                    onChange={(event) => updateItem(index, { itemType: event.target.value as TemplateItemKind })}
                  >
                    {TEMPLATE_ITEM_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-block">
                  <span>Opis</span>
                  <input
                    className="text-input"
                    value={item.description}
                    onChange={(event) => updateItem(index, { description: event.target.value })}
                  />
                </label>
                <label className="switch-row">
                  <input
                    type="checkbox"
                    checked={item.required}
                    onChange={(event) => updateItem(index, { required: event.target.checked })}
                  />
                  <span>Obowiazkowe</span>
                </label>
                <button className="ghost-button small" type="button" onClick={() => removeItem(index)} disabled={form.items.length <= 1}>
                  Usun
                </button>
              </div>
            ))}
          </div>
        </article>

        <div className="toolbar-row end">
          <button type="button" className="ghost-button" onClick={onClose}>
            Anuluj
          </button>
          <button type="submit" className="primary-button">
            Zapisz szablon
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

export function TemplatesPageView() {
  const { snapshot, addCaseTemplate, updateCaseTemplate, deleteCaseTemplate, duplicateCaseTemplate, setDefaultCaseTemplate } = useAppStore()
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(snapshot.caseTemplates[0]?.id ?? null)
  const [editorTargetId, setEditorTargetId] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<CaseTemplate | null>(null)
  const activeTemplate = snapshot.caseTemplates.find((entry) => entry.id === activeTemplateId) ?? null
  const activeTemplateItems = activeTemplate
    ? snapshot.templateItems.filter((item) => item.templateId === activeTemplate.id).sort((a, b) => a.sortOrder - b.sortOrder)
    : []

  useEffect(() => {
    if (!activeTemplateId && snapshot.caseTemplates[0]) {
      setActiveTemplateId(snapshot.caseTemplates[0].id)
      return
    }
    if (activeTemplateId && !snapshot.caseTemplates.some((entry) => entry.id === activeTemplateId)) {
      setActiveTemplateId(snapshot.caseTemplates[0]?.id ?? null)
    }
  }, [activeTemplateId, snapshot.caseTemplates])

  return (
    <>
      <PageShell
        title="Szablony"
        subtitle="Szablony checklist przyspieszaja start sprawy: pusta, z szablonu, albo z szablonu + link dla klienta."
      >
        <section className="panel-card">
          <div className="section-head">
            <strong>Szablony checklist</strong>
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                setEditorTargetId(null)
                setShowEditor(true)
              }}
            >
              Nowy szablon
            </button>
          </div>

          {snapshot.caseTemplates.length === 0 ? (
            <ViewState kind="empty">Brak szablonow. Dodaj pierwszy szablon checklisty.</ViewState>
          ) : (
            <div className="template-layout">
              <div className="template-list">
                {snapshot.caseTemplates
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name, "pl"))
                  .map((template) => {
                    const count = snapshot.templateItems.filter((item) => item.templateId === template.id).length
                    return (
                      <button
                        key={template.id}
                        className={`template-card${activeTemplateId === template.id ? " active" : ""}`}
                        type="button"
                        onClick={() => setActiveTemplateId(template.id)}
                      >
                        <div className="template-card-head">
                          <strong>{template.name}</strong>
                          {template.isDefault ? <span className="badge">domyslny</span> : null}
                        </div>
                        <div className="muted-small">Typ: {template.caseType}</div>
                        <div className="muted-small">{count} pozycji</div>
                      </button>
                    )
                  })}
              </div>

              <article className="info-card">
                {!activeTemplate ? (
                  <ViewState kind="empty">Wybierz szablon z listy.</ViewState>
                ) : (
                  <div className="stack-list">
                    <div className="section-head">
                      <strong>{activeTemplate.name}</strong>
                      <div className="drawer-actions wrap">
                        <button
                          className="ghost-button small"
                          type="button"
                          onClick={() => {
                            setEditorTargetId(activeTemplate.id)
                            setShowEditor(true)
                          }}
                        >
                          Edytuj
                        </button>
                        <button className="ghost-button small" type="button" onClick={() => duplicateCaseTemplate(activeTemplate.id)}>
                          Kopiuj
                        </button>
                        <button className="ghost-button small" type="button" onClick={() => setDefaultCaseTemplate(activeTemplate.id)}>
                          Ustaw domyslny
                        </button>
                        <button className="danger-button small" type="button" onClick={() => setTemplateToDelete(activeTemplate)}>
                          Usun
                        </button>
                      </div>
                    </div>

                    <div className="info-row">
                      <strong>Typ sprawy</strong>
                      <span>{activeTemplate.caseType}</span>
                    </div>
                    <div className="info-row">
                      <strong>Opis</strong>
                      <span>{activeTemplate.description || "Brak opisu"}</span>
                    </div>

                    <div className="stack-list">
                      {activeTemplateItems.length === 0 ? <ViewState kind="empty">Szablon nie ma jeszcze pozycji.</ViewState> : null}
                      {activeTemplateItems.map((item) => (
                        <div key={item.id} className="timeline-row">
                          <div>
                            <div className="timeline-title">{item.sortOrder}. {item.title}</div>
                            <div className="muted-small">{item.description || getTemplateItemTypeLabel(item.itemType)}</div>
                          </div>
                          <span className="badge">{item.required ? "obowiazkowe" : "opcjonalne"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          )}
        </section>
      </PageShell>

      {showEditor ? (
        <TemplateEditorModal
          template={editorTargetId ? snapshot.caseTemplates.find((entry) => entry.id === editorTargetId) ?? null : null}
          templateItems={snapshot.templateItems}
          onClose={() => setShowEditor(false)}
          onSave={(payload) => {
            if (editorTargetId) {
              updateCaseTemplate(editorTargetId, payload)
            } else {
              addCaseTemplate(payload)
            }
            setShowEditor(false)
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(templateToDelete)}
        title="Usunac szablon?"
        description="Usuniecie szablonu usuwa tez jego pozycje checklisty."
        onCancel={() => setTemplateToDelete(null)}
        onConfirm={() => {
          if (!templateToDelete) return
          deleteCaseTemplate(templateToDelete.id)
          setTemplateToDelete(null)
        }}
      />
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
    <PageShell title="Rozliczenia" subtitle="Plan konta i stan dostepu do aplikacji.">
      <div className="panel-card large-card">
        <div className="billing-price">{snapshot.billing.planName}</div>
        <div className="billing-status-row">
          <span className={`badge plan-${snapshot.billing.status}`}>{statusLabel}</span>
          <span className="muted-small">Odnowienie: {formatDateTime(snapshot.billing.renewAt, { timeZone: snapshot.settings.timezone })}</span>
        </div>
        <p className="note-text">Stan planu i dostep do tworzenia nowych wpisow sa widoczne tutaj.</p>
      </div>
    </PageShell>
  )
}
export function SettingsPageView() {
  const { snapshot, updateSettings } = useAppStore()
  return (
    <PageShell title="Ustawienia" subtitle="Preferencje przypomnien, workspace i podstawowe ustawienia aplikacji.">
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
        <label className="field-block full-span">
          <span>Czestotliwosc przypomnien dla spraw</span>
          <select
            className="select-input"
            value={snapshot.settings.caseReminderFrequency}
            onChange={(event) =>
              updateSettings({
                caseReminderFrequency: event.target.value as typeof snapshot.settings.caseReminderFrequency,
              })}
          >
            {CASE_REMINDER_FREQUENCY_OPTIONS.map((option) => (
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
        <div className="muted-small full-span">Zmiany zapisuja sie automatycznie po edycji pol.</div>
      </div>
    </PageShell>
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







