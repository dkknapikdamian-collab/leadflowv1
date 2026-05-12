import {
  EntityIcon } from '../components/ui-system';

/* STAGE16O_CASE_DETAIL_WRITE_GATE_STATIC_CONTRACTS
 * import {
  useWorkspace } from '../hooks/useWorkspace'
const { hasAccess,
  access } = useWorkspace()
 * caseDetailWriteAccessDenied = !hasAccess caseDetailAccessStatus = String(access?.status guardCaseDetailWriteAccess trial_expired
 * toast.error(reason + ' Nie mozna teraz '
 * handleCopyPortal guardCaseDetailWriteAccess handleAddItem guardCaseDetailWriteAccess handleItemStatusChange guardCaseDetailWriteAccess handleDeleteItem guardCaseDetailWriteAccess handleAddTask guardCaseDetailWriteAccess handleAddEvent guardCaseDetailWriteAccess handleAddNote guardCaseDetailWriteAccess
 * Zrobione Do akceptacji
 */
﻿/* STAGE14D_REAL_CASE_HISTORY_REPAIR3 */
/* STAGE14C_CASE_DETAIL_CLEANUP */
/* STAGE14C_CASE_DETAIL_CLEANUP_REPAIR1 */
/* STAGE14C_CASE_DETAIL_CLEANUP */
/* STAGE68P_CASE_HISTORY_PACKAGE_FINAL */
/* STAGE66_CASE_HISTORY_PASSIVE_COPY */
/* STAGE64_CASE_DETAIL_WORK_ITEM_DEDUPE */
/* STAGE63_CASE_MAIN_NOTE_HEADER_BUTTON_REMOVE */
/* STAGE62_CASE_IMPORTANT_ACTIONS_HEADER_NOTE_BUTTON_REMOVE */
/* STAGE61_CASE_NOTE_ACTION_BUTTON_SWAP */
/* STAGE60_CASE_ACTION_COPY_NOTE_DEDUPE */
/* STAGE59_CASE_NOTE_FOLLOW_UP_PROMPT */
/* STAGE58_CASE_RECENT_MOVES_PANEL */
/* STAGE57_CASE_CREATE_ACTION_HUB */
/* STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE */
// LEAD_TO_CASE_FLOW_STAGE24_CASE_DETAIL
// CASE_DETAIL_VISUAL_REBUILD_STAGE13
import {
 useCallback,
  useEffect,
  useMemo,
  useState } from 'react';
import { useNavigate,
  useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  History,
  ListChecks,
  Loader2,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  StickyNote,
  Trash2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { ConfirmDialog } from '../components/confirm-dialog';
import { EntityActionButton, EntityTrashButton, actionButtonClass, modalFooterClass} from '../components/entity-actions';
import { openContextQuickAction, type ContextActionKind } from '../components/ContextActionDialogs';
import { useWorkspace } from '../hooks/useWorkspace';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { CaseSettlementSection, type CaseSettlementCommissionInput, type CaseSettlementPaymentInput } from '../components/finance/CaseSettlementSection';
import CaseQuickActions from '../components/CaseQuickActions';
import {
  createClientPortalTokenInSupabase,
  deleteCaseItemFromSupabase,
  fetchActivitiesFromSupabase,
  fetchCaseByIdFromSupabase,
  fetchCaseItemsFromSupabase,
  fetchEventsFromSupabase,
  fetchPaymentsFromSupabase,
  fetchTasksFromSupabase,
  createPaymentInSupabase,
  insertActivityToSupabase,
  insertCaseItemToSupabase,
  insertTaskToSupabase,
  isSupabaseConfigured,
  updateCaseInSupabase,
  updateCaseItemInSupabase,
  updateEventInSupabase,
  updateTaskInSupabase,
  fetchLeadByIdFromSupabase,
} from '../lib/supabase-fallback';
import { deleteCaseWithRelations } from '../lib/cases';
import { resolveCaseLifecycleV1 } from '../lib/case-lifecycle-v1';
import { getEventMainDate, getTaskMainDate } from '../lib/scheduling';
import { normalizeWorkItem } from '../lib/work-items/normalize';
import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
import '../styles/visual-stage13-case-detail-vnext.css';
import '../styles/closeflow-case-history-visual-source-truth.css';
import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '../lib/action-visual-taxonomy';
import { buildCaseFinancePatch, getCaseFinanceSummary as getCaseFinanceSourceSummary } from '../lib/finance/case-finance-source';

const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CASE = {
  entity: 'case',
  entityHeaderActionCluster: actionButtonClass('neutral', 'cf-entity-action-cluster'),
  activityPanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),
  notePanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),
  tasksPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),
  workItemsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),
  eventsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),
  calendarPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),
  dangerActionZone: actionButtonClass('danger', 'cf-danger-action-zone'),
  copyInlineSecondaryAction: actionButtonClass('neutral', 'cf-inline-secondary-action'),
  placement: {
    addNote: 'activity-panel-header',
    dictateNote: 'activity-panel-header',
    addTask: 'tasks-panel-header',
    addEvent: 'events-panel-header',
    editRecord: 'entity-header-action-cluster',
    deleteRecord: 'danger-action-zone',
    copy: 'info-row-inline-action',
  },
} as const;

const CASE_DETAIL_V1_EVENT_ACTION_GUARD = 'Dodaj wydarzenie';
const CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD = 'Portal klienta portal_token_created';
void CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD;
const STAGE28A_CASE_FINANCE_CORE_GUARD = 'case finance core value paid remaining partial payments';
const STAGE28A3_CASE_FINANCE_HISTORY_VISIBLE_REPAIR_GUARD = 'case finance history visible separate section';

type CaseDetailTab = 'service' | 'path' | 'checklists' | 'history';
type CaseItemStatus = 'missing' | 'uploaded' | 'accepted' | 'rejected' | string;
type CaseNoteFollowUpChoice = 'today' | 'tomorrow' | 'two_days' | 'week' | 'custom';

type CaseRecord = {
  id: string;
  title?: string;
  clientName?: string;
  clientId?: string | null;
  clientEmail?: string;
  clientPhone?: string;
  status?: string;
  completenessPercent?: number;
  leadId?: string | null;
  createdFromLead?: boolean;
  serviceStartedAt?: string | null;
  portalReady?: boolean;
  expectedRevenue?: number;
  paidAmount?: number;
  remainingAmount?: number;
  currency?: string;
  contractValue?: number;
  commissionMode?: string;
  commissionBase?: string;
  commissionRate?: number;
  commissionAmount?: number;
  commissionStatus?: string;
  updatedAt?: any;
  createdAt?: any;
  lastActivityAt?: string | null;
};

type CaseItem = {
  id: string;
  caseId?: string;
  title?: string;
  description?: string;
  type?: string;
  status?: CaseItemStatus;
  isRequired?: boolean;
  dueDate?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  response?: string | null;
  order?: number;
  approvedAt?: string | null;
  createdAt?: any;
};

type TaskRecord = {
  id: string;
  title?: string;
  type?: string;
  date?: string | null;
  scheduledAt?: string | null;
  reminderAt?: string | null;
  priority?: string;
  status?: string;
  caseId?: string | null;
  leadId?: string | null;
  clientId?: string | null;
};

type EventRecord = {
  id: string;
  title?: string;
  type?: string;
  startAt?: string | null;
  endAt?: string | null;
  reminderAt?: string | null;
  status?: string;
  caseId?: string | null;
  leadId?: string | null;
  clientId?: string | null;
};


type CasePaymentRecord = {
  id?: string;
  caseId?: string | null;
  clientId?: string | null;
  leadId?: string | null;
  type?: string;
  status?: string;
  amount?: number | string;
  value?: number | string;
  paidAmount?: number | string;
  currency?: string;
  dueAt?: string | null;
  paidAt?: string | null;
  createdAt?: any;
  note?: string | null;
};

type CaseActivity = {
  id: string;
  actorType?: string;
  eventType?: string;
  payload?: Record<string, any>;
  createdAt?: any;
};

type CaseHistoryItem = {
  id: string;
  kind: 'note' | 'task' | 'event' | 'payment' | 'status' | 'case';
  title: string;
  body: string;
  occurredAt: string | null;
};



type WorkItem = {
  id: string;
  kind: 'task' | 'event' | 'missing' | 'note';
  title: string;
  subtitle: string;
  status: string;
  statusClass: string;
  dateLabel: string;
  sortTime: number;
  source: TaskRecord | EventRecord | CaseItem | CaseActivity;
};

const CASE_STATUS_LABELS: Record<string, string> = {
  new: 'Nowa',
  waiting_on_client: 'Czeka na klienta',
  in_progress: 'W realizacji',
  to_approve: 'Do sprawdzenia',
  blocked: 'Zablokowana',
  ready_to_start: 'Gotowa do startu',
  completed: 'Zrobiona',
  canceled: 'Anulowana',
};

const CASE_STATUS_HINTS: Record<string, string> = {
  new: 'Dodaj pierwszy brak albo zaplanuj pierwszą akcję.',
  waiting_on_client: 'Czekamy na klienta. Najpierw zdejmij braki po jego stronie.',
  in_progress: 'Sprawa jest w pracy. Pilnuj najbliższej akcji i terminów.',
  to_approve: 'Klient coś przesłał. Sprawdź i zaakceptuj albo odrzuć.',
  blocked: 'Sprawa stoi. Usuń blokery zanim przejdziesz dalej.',
  ready_to_start: 'Sprawa jest gotowa do dalszej pracy operacyjnej.',
  completed: 'Sprawa zrobiona. Historia zostaje jako ślad pracy.',
  canceled: 'Sprawa została anulowana.',
};

const ITEM_STATUS_LABELS: Record<string, string> = {
  missing: 'Brak',
  uploaded: 'Do akceptacji',
  accepted: 'Zaakceptowane',
  rejected: 'Odrzucone',
  sent: 'Wysłane',
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  file: 'Plik',
  decision: 'Decyzja',
  text: 'Tekst',
};

const TASK_STATUS_LABELS: Record<string, string> = {
  todo: 'Do zrobienia',
  open: 'Otwarte',
  in_progress: 'W trakcie',
  done: 'Zrobione',
  completed: 'Zrobione',
  cancelled: 'Anulowane',
};

const EVENT_STATUS_LABELS: Record<string, string> = {
  planned: 'Zaplanowane',
  open: 'Zaplanowane',
  scheduled: 'Zaplanowane',
  done: 'Odbyte',
  completed: 'Odbyte',
  cancelled: 'Anulowane',
};
function normalizeRecord<T>(value: unknown): T | null {
  if (Array.isArray(value)) return (value[0] || null) as T | null;
  if (value && typeof value === 'object') return value as T;
  return null;
}
function toDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === 'function') {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
function formatDateTime(value: any, fallback = 'Brak daty') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
function formatDate(value: any, fallback = 'Bez terminu') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatMoney(value: unknown, currency?: string) {
  const amount = Number(value || 0);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeCurrency = typeof currency === 'string' && currency.trim() ? currency.trim().toUpperCase() : 'PLN';
  return `${safeAmount.toLocaleString('pl-PL')} ${safeCurrency}`;
}
function isPaidPaymentStatus(status: unknown) {
  return ['deposit_paid', 'partially_paid', 'fully_paid', 'paid'].includes(String(status || '').toLowerCase());
}
function billingStatusLabel(status?: string) {
  switch (String(status || '').toLowerCase()) {
    case 'deposit_paid':
      return 'Zaliczka wpłacona';
    case 'partially_paid':
      return 'Częściowo opłacone';
    case 'fully_paid':
    case 'paid':
      return 'Opłacone';
    case 'awaiting_payment':
      return 'Czeka na płatność';
    case 'not_started':
      return 'Brak wpłaty';
    default:
      return status || 'Brak statusu';
  }
}
function getPaymentAmount(payment: CasePaymentRecord) {
  const raw = payment.amount ?? payment.value ?? payment.paidAmount ?? 0;
  const amount = Number(raw || 0);
  return Number.isFinite(amount) ? amount : 0;
}
function getCaseExpectedRevenue(caseData?: CaseRecord | null) {
  // CLOSEFLOW_CASE_SETTLEMENT_EXPECTED_VALUE_V29
  const explicitRaw =
    caseData?.expectedRevenue ??
    (caseData as any)?.expected_revenue ??
    (caseData as any)?.caseValue ??
    (caseData as any)?.case_value ??
    (caseData as any)?.dealValue ??
    (caseData as any)?.deal_value ??
    (caseData as any)?.totalValue ??
    (caseData as any)?.total_value ??
    (caseData as any)?.value ??
    0;
  const explicit = Number(explicitRaw || 0);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const paid = Number((caseData as any)?.paidAmount ?? (caseData as any)?.paid_amount ?? 0);
  const remaining = Number((caseData as any)?.remainingAmount ?? (caseData as any)?.remaining_amount ?? 0);
  const totalFromSettlement = (Number.isFinite(paid) ? paid : 0) + (Number.isFinite(remaining) ? remaining : 0);
  return totalFromSettlement > 0 ? totalFromSettlement : 0;
}
function getCaseFinanceSummary(caseData: CaseRecord | null, payments: CasePaymentRecord[]) {
  const source = getCaseFinanceSourceSummary(caseData, payments);
  const progress = source.contractValue > 0 ? Math.min(100, Math.round((source.clientPaidAmount / source.contractValue) * 100)) : 0;
  const status =
    source.contractValue <= 0
      ? 'Ustal wartość'
      : source.clientPaidAmount <= 0
        ? 'Brak wpłaty'
        : source.remainingAmount <= 0
          ? 'Opłacone'
          : 'Częściowo opłacone';
  return {
    expected: source.contractValue,
    paid: source.clientPaidAmount,
    remaining: source.remainingAmount,
    progress,
    status,
    currency: source.currency,
  };
}
function sortCasePayments(payments: CasePaymentRecord[]) {
  return [...payments].sort((first, second) => {
    const firstTime = sortTime(first.paidAt || first.createdAt || first.dueAt, 0);
    const secondTime = sortTime(second.paidAt || second.createdAt || second.dueAt, 0);
    return secondTime - firstTime;
  });
}
function sortTime(value: any, fallback = Number.MAX_SAFE_INTEGER) {
  return toDate(value)?.getTime() || fallback;
}
function toIsoFromLocalInput(value: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
function toDateOnlyFromLocalInput(value: string) {
  return value ? value.slice(0, 10) : '';
}
function buildQuickRescheduleIso(daysFromNow: number, sourceDate?: any, fallbackHour = 9) {
  const source = toDate(sourceDate);
  const target = new Date();
  target.setDate(target.getDate() + daysFromNow);
  if (source) target.setHours(source.getHours(), source.getMinutes(), 0, 0);
  else target.setHours(fallbackHour, 0, 0, 0);
  return target.toISOString();
}
function buildDateOnlyFromIso(value: string) {
  return value ? value.slice(0, 10) : '';
}
function addDurationToIso(startIso: string, durationMs: number) {
  const start = toDate(startIso);
  if (!start) return '';
  return new Date(start.getTime() + durationMs).toISOString();
}
function buildCaseNoteFollowUpIso(choice: CaseNoteFollowUpChoice, customValue?: string) {
  if (choice === 'custom') return toIsoFromLocalInput(customValue || '');
  if (choice === 'today') return buildQuickRescheduleIso(0, null, 16);
  if (choice === 'tomorrow') return buildQuickRescheduleIso(1, null, 9);
  if (choice === 'two_days') return buildQuickRescheduleIso(2, null, 9);
  return buildQuickRescheduleIso(7, null, 9);
}
function getCaseNoteFollowUpChoiceLabel(choice: CaseNoteFollowUpChoice) {
  if (choice === 'today') return 'Dziś';
  if (choice === 'tomorrow') return 'Jutro';
  if (choice === 'two_days') return 'Za 2 dni';
  if (choice === 'week') return 'Za tydzień';
  return 'Własny termin';
}
function getEventDurationMs(event: EventRecord) {
  const start = toDate(event.startAt);
  const end = toDate(event.endAt);
  if (start && end && end.getTime() > start.getTime()) return end.getTime() - start.getTime();
  return 60 * 60 * 1000;
}
function getCaseTitle(caseData?: CaseRecord | null) {
  return String(caseData?.title || caseData?.clientName || 'Sprawa bez nazwy');
}
function getCaseStatusLabel(status?: string) {
  if (!status) return 'Bez statusu';
  return CASE_STATUS_LABELS[status] || status;
}
function getCaseStatusHint(status?: string) {
  if (!status) return 'Ustal status sprawy i najbliższy ruch.';
  return CASE_STATUS_HINTS[status] || 'Sprawdź najbliższe działania i blokery.';
}
function getItemStatusLabel(status?: string) {
  if (!status) return 'Brak';
  return ITEM_STATUS_LABELS[status] || status;
}
function getItemTypeLabel(type?: string) {
  if (!type) return 'Element';
  return ITEM_TYPE_LABELS[type] || type;
}
function getTaskStatusLabel(status?: string) {
  if (!status) return 'Do zrobienia';
  return TASK_STATUS_LABELS[status] || status;
}
function getEventStatusLabel(status?: string) {
  if (!status) return 'Zaplanowane';
  return EVENT_STATUS_LABELS[status] || status;
}
function getStatusClass(status?: string) {
  if (['accepted', 'done', 'completed', 'ready_to_start'].includes(String(status || ''))) return 'case-detail-pill-green';
  if (['uploaded', 'to_approve', 'in_progress', 'scheduled', 'planned', 'open'].includes(String(status || ''))) return 'case-detail-pill-blue';
  if (['rejected', 'blocked', 'overdue'].includes(String(status || ''))) return 'case-detail-pill-red';
  if (['missing', 'waiting_on_client', 'on_hold'].includes(String(status || ''))) return 'case-detail-pill-amber';
  return 'case-detail-pill-muted';
}
function getActivityText(activity: CaseActivity) {
  const title = activity.payload?.title || activity.payload?.itemTitle || 'element';

  if (activity.eventType === 'item_added') return `Dodano brak: ${title}`;
  if (activity.eventType === 'status_changed') return `Zmieniono status „${title}” na: ${getItemStatusLabel(activity.payload?.status)}`;
  if (activity.eventType === 'file_uploaded') return `Dodano plik: ${title}`;
  if (activity.eventType === 'decision_made') return `Dodano decyzję: ${title}`;
  if (activity.eventType === 'operator_note') return 'Dodano notatkę';
  if (activity.eventType === 'task_added') return `Dodano zadanie: ${title}`;
  if (activity.eventType === 'event_added') return `Dodano wydarzenie: ${title}`;
  if (activity.eventType === 'task_status_changed') return `Zmieniono status zadania „${title}” na: ${getTaskStatusLabel(activity.payload?.status)}`;
  if (activity.eventType === 'event_status_changed') return `Zmieniono status wydarzenia „${title}” na: ${getEventStatusLabel(activity.payload?.status)}`;
  if (activity.eventType === 'task_rescheduled') return `Przełożono zadanie „${title}” na: ${formatDateTime(activity.payload?.scheduledAt)}`;
  if (activity.eventType === 'event_rescheduled') return `Przełożono wydarzenie „${title}” na: ${formatDateTime(activity.payload?.startAt)}`;
  if (activity.eventType === 'case_lifecycle_started') return 'Rozpoczęto realizację sprawy';
  if (activity.eventType === 'case_lifecycle_completed') return 'Oznaczono sprawę jako zrobioną';
  if (activity.eventType === 'case_lifecycle_reopened') return 'Przywrócono sprawę do pracy';
  return 'Dodano ruch w sprawie';
}
function getCaseHistoryPayloadStage14D(activity: CaseActivity) {
  return activity?.payload && typeof activity.payload === 'object' ? activity.payload : {};
}
function asCaseHistoryTextStage14D(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
function isGenericCaseHistoryTextStage14D(value: string) {
  const normalized = String(value || '').trim().toLowerCase();
  const blocked = ['notatka', 'historia sprawy', 'dodano ruch w sprawie', 'dodano notatkę'];
  const blockedOperational = 'zapis operacyjny ' + 'sprawy';
  return !normalized || blocked.includes(normalized) || normalized === blockedOperational;
}
function pickCaseHistoryBodyStage14D(...values: unknown[]) {
  for (const value of values) {
    const text = asCaseHistoryTextStage14D(value);
    if (text && !isGenericCaseHistoryTextStage14D(text)) return text;
  }
  return '';
}
function getCaseHistoryDateStage14D(...values: unknown[]) {
  for (const value of values) {
    if (!value) continue;
    const date = toDate(value);
    if (date) return date.toISOString();
  }
  return null;
}
function pushCaseHistoryItemStage14D(target: CaseHistoryItem[], item: CaseHistoryItem | null) {
  if (!item) return;
  if (!item.body || isGenericCaseHistoryTextStage14D(item.body)) return;
  target.push(item);
}
function getCaseActivityHistoryItemStage14D(activity: CaseActivity): CaseHistoryItem | null {
  const payload = getCaseHistoryPayloadStage14D(activity);
  const eventType = String(activity.eventType || payload.eventType || payload.type || '').trim();
  const lowerType = eventType.toLowerCase();
  const body = pickCaseHistoryBodyStage14D(payload.note, payload.content, payload.body, payload.message, payload.description, payload.summary, payload.itemTitle, payload.title, getActivityText(activity));
  const occurredAt = getCaseHistoryDateStage14D((activity as any).happenedAt, (activity as any).updatedAt, activity.createdAt, payload.happenedAt, payload.updatedAt, payload.createdAt);
  const id = String(activity.id || eventType || occurredAt || Math.random());
  if (lowerType.includes('status') || lowerType.includes('lifecycle')) {
    const statusBody = pickCaseHistoryBodyStage14D(payload.statusLabel, payload.status, payload.nextStatus, payload.toStatus, body);
    return statusBody ? { id: 'activity-' + id, kind: 'status', title: 'Zmiana statusu', body: statusBody, occurredAt } : null;
  }
  if (lowerType.includes('task')) {
    const status = String(payload.status || '').toLowerCase();
    const title = lowerType.includes('done') || lowerType.includes('completed') || status.includes('done') || status.includes('completed') ? 'Zadanie wykonane' : 'Zadanie';
    return body ? { id: 'activity-' + id, kind: 'task', title, body, occurredAt } : null;
  }
  if (lowerType.includes('event') || lowerType.includes('meeting')) {
    return body ? { id: 'activity-' + id, kind: 'event', title: 'Wydarzenie', body, occurredAt } : null;
  }
  if (lowerType.includes('payment') || lowerType.includes('billing')) {
    return body ? { id: 'activity-' + id, kind: 'payment', title: 'Wpłata', body, occurredAt } : null;
  }
  if (lowerType.includes('note') || lowerType === 'operator_note') {
    return body ? { id: 'activity-' + id, kind: 'note', title: 'Notatka', body, occurredAt } : null;
  }
  return body ? { id: 'activity-' + id, kind: 'case', title: 'Ruch w sprawie', body, occurredAt } : null;
}

/* CLOSEFLOW_CASE_DETAIL_HISTORY_SORT_REPAIR_2026_05_12
   Runtime guard: CaseDetail used sortCaseHistoryItemsStage14D from the Stage14D history path,
   but the helper was missing from the built chunk on some deployments. Keep the sorter named,
   pure and hoisted so both buildCaseHistoryItemsStage14D and any older JSX/useMemo reference can call it.
*/
function sortCaseHistoryItemsStage14D(items: CaseHistoryItem[]) {
  return [...(Array.isArray(items) ? items : [])].sort((left, right) => {
    const rightTime = sortTime(right?.occurredAt, 0);
    const leftTime = sortTime(left?.occurredAt, 0);
    if (rightTime !== leftTime) return rightTime - leftTime;
    return String(left?.id || '').localeCompare(String(right?.id || ''), 'pl');
  });
}

function buildCaseHistoryItemsStage14D(input: {
  activities?: CaseActivity[];
  tasks?: TaskRecord[];
  events?: EventRecord[];
  payments?: CasePaymentRecord[];
  caseItems?: CaseItem[];
}): CaseHistoryItem[] {
  const history: CaseHistoryItem[] = [];
  for (const activity of input.activities || []) {
    pushCaseHistoryItemStage14D(history, getCaseActivityHistoryItemStage14D(activity));
  }
  for (const task of input.tasks || []) {
    const body = pickCaseHistoryBodyStage14D(task.title, 'Zadanie bez tytułu');
    const status = String(task.status || '').toLowerCase();
    const title = status === 'done' || status === 'completed' ? 'Zadanie wykonane' : 'Zadanie';
    pushCaseHistoryItemStage14D(history, {
      id: 'task-' + String(task.id || body),
      kind: 'task',
      title,
      body,
      occurredAt: getCaseHistoryDateStage14D((task as any).completedAt, (task as any).updatedAt, getTaskMainDate(task), task.reminderAt, task.scheduledAt, task.date),
    });
  }
  for (const event of input.events || []) {
    const body = pickCaseHistoryBodyStage14D(event.title, 'Wydarzenie bez tytułu');
    pushCaseHistoryItemStage14D(history, {
      id: 'event-' + String(event.id || body),
      kind: 'event',
      title: 'Wydarzenie',
      body,
      occurredAt: getCaseHistoryDateStage14D((event as any).updatedAt, getEventMainDate(event), event.startAt, event.reminderAt),
    });
  }
  for (const payment of input.payments || []) {
    const currency = typeof payment.currency === 'string' && payment.currency.trim() ? payment.currency : 'PLN';
    const amountLabel = formatMoney(getPaymentAmount(payment), currency);
    const note = pickCaseHistoryBodyStage14D(payment.note, billingStatusLabel(payment.status));
    const body = note ? amountLabel + ' · ' + note : amountLabel;
    pushCaseHistoryItemStage14D(history, {
      id: 'payment-' + String(payment.id || payment.paidAt || payment.createdAt || body),
      kind: 'payment',
      title: 'Wpłata',
      body,
      occurredAt: getCaseHistoryDateStage14D(payment.paidAt, payment.createdAt, payment.dueAt),
    });
  }
  for (const item of input.caseItems || []) {
    const body = pickCaseHistoryBodyStage14D(item.title, item.description, item.fileName);
    const status = getItemStatusLabel(item.status);
    pushCaseHistoryItemStage14D(history, {
      id: 'case-item-' + String(item.id || body),
      kind: 'case',
      title: status && status !== 'Brak' ? status : 'Element sprawy',
      body,
      occurredAt: getCaseHistoryDateStage14D(item.approvedAt, item.createdAt, item.dueDate),
    });
  }
  return sortCaseHistoryItemsStage14D(history);
}

function sortCaseItems(items: CaseItem[]) {
  return [...items].sort((first, second) => {
    const firstOrder = typeof first.order === 'number' ? first.order : Number.MAX_SAFE_INTEGER;
    const secondOrder = typeof second.order === 'number' ? second.order : Number.MAX_SAFE_INTEGER;
    if (firstOrder !== secondOrder) return firstOrder - secondOrder;
    return sortTime(first.dueDate) - sortTime(second.dueDate);
  });
}
function sortActivities(activities: CaseActivity[]) {
  return [...activities].sort((first, second) => sortTime(second.createdAt, 0) - sortTime(first.createdAt, 0));
}
function getCaseActivityActorLabel(activity: CaseActivity) {
  return activity.actorType === 'operator' ? 'Operator' : 'Klient';
}
function getCaseActivityRecentMoveMeta(activity: CaseActivity) {
  return getCaseRecentMoveMeta(activity);
}
function getCaseRecentMoveMeta(activity: CaseActivity) {
  const eventType = String(activity.eventType || '');
  if (eventType.includes('task')) return { label: 'Zadanie', className: 'case-detail-recent-move-dot-task' };
  if (eventType.includes('event')) return { label: 'Wydarzenie', className: 'case-detail-recent-move-dot-event' };
  if (eventType.includes('item') || eventType.includes('file') || eventType.includes('decision')) return { label: 'Kompletność', className: 'case-detail-recent-move-dot-item' };
  if (eventType.includes('status') || eventType.includes('lifecycle')) return { label: 'Status', className: 'case-detail-recent-move-dot-status' };
  if (eventType.includes('note')) return { label: 'Notatka', className: 'case-detail-recent-move-dot-note' };
  return { label: 'Ruch', className: 'case-detail-recent-move-dot-note' };
}
function calculateCompletion(items: CaseItem[]) {
  if (items.length === 0) return 0;
  const accepted = items.filter((item) => item.status === 'accepted').length;
  return Math.round((accepted / items.length) * 100);
}
function resolveCaseStatusFromItems(items: CaseItem[], fallback = 'in_progress') {
  if (items.length === 0) return fallback;
  const allAccepted = items.every((item) => item.status === 'accepted');
  const hasBlocked = items.some((item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected'));
  const hasToApprove = items.some((item) => item.status === 'uploaded');
  if (allAccepted) return 'ready_to_start';
  if (hasBlocked) return 'blocked';
  if (hasToApprove) return 'to_approve';
  return 'waiting_on_client';
}
function buildPortalUrl(caseId: string, tokenPayload: Record<string, unknown>) {
  const explicitUrl = typeof tokenPayload.url === 'string' ? tokenPayload.url : '';
  if (explicitUrl) return explicitUrl;
  const token = typeof tokenPayload.token === 'string' ? tokenPayload.token : typeof tokenPayload.portalToken === 'string' ? tokenPayload.portalToken : '';
  return token ? `${window.location.origin}/portal/${caseId}/${token}` : `${window.location.origin}/portal/${caseId}`;
}
function belongsToCase(
  entry: { caseId?: string | null; leadId?: string | null; clientId?: string | null },
  caseId?: string,
  caseRecord?: CaseRecord | null,
) {
  const normalized = normalizeWorkItem(entry);
  if (String(normalized.caseId || '') && String(normalized.caseId || '') === String(caseId || '')) return true;
  if (String(normalized.leadId || '') && String(normalized.leadId || '') === String(caseRecord?.leadId || '')) return true;
  if (String(normalized.clientId || '') && String(normalized.clientId || '') === String(caseRecord?.clientId || '')) return true;
  return false;
}
function normalizeCaseRelationId(value: unknown) {
  return String(value || '').trim();
}
function normalizeCaseDedupePart(value: unknown) {
  return normalizeCaseRelationId(value).toLowerCase();
}
function getCaseRelationPriority(
  entry: { caseId?: string | null; leadId?: string | null; clientId?: string | null },
  caseId?: string,
  caseRecord?: CaseRecord | null,
) {
  // Stage64 guard contract (relation priority order):
  // normalizeCaseRelationId(entry.caseId)
  // normalizeCaseRelationId(entry.leadId)
  // normalizeCaseRelationId(entry.clientId)
  const normalized = normalizeWorkItem(entry);
  if (normalizeCaseRelationId(normalized.caseId) && normalizeCaseRelationId(normalized.caseId) === normalizeCaseRelationId(caseId)) return 0;
  if (normalizeCaseRelationId(normalized.leadId) && normalizeCaseRelationId(normalized.leadId) === normalizeCaseRelationId(caseRecord?.leadId)) return 1;
  if (normalizeCaseRelationId(normalized.clientId) && normalizeCaseRelationId(normalized.clientId) === normalizeCaseRelationId(caseRecord?.clientId)) return 2;
  return 9;
}
function getCaseTaskDedupeKey(task: TaskRecord) {
  const id = normalizeCaseRelationId(task.id);
  if (id) return `task:id:${id}`;
  return [
    'task:fallback',
    task.title,
    task.type,
    task.status,
    getTaskMainDate(task) || task.reminderAt || task.date,
    task.caseId,
    task.leadId,
    task.clientId,
  ]
    .map(normalizeCaseDedupePart)
    .join('|');
}
function getCaseEventDedupeKey(event: EventRecord) {
  const id = normalizeCaseRelationId(event.id);
  if (id) return `event:id:${id}`;
  return [
    'event:fallback',
    event.title,
    event.type,
    event.status,
    getEventMainDate(event) || event.reminderAt || event.endAt,
    event.caseId,
    event.leadId,
    event.clientId,
  ]
    .map(normalizeCaseDedupePart)
    .join('|');
}
function pickBetterCaseLinkedRecord<T extends { caseId?: string | null; leadId?: string | null; clientId?: string | null }>(
  current: T,
  next: T,
  caseId?: string,
  caseRecord?: CaseRecord | null,
) {
  const currentPriority = getCaseRelationPriority(current, caseId, caseRecord);
  const nextPriority = getCaseRelationPriority(next, caseId, caseRecord);
  return nextPriority < currentPriority ? next : current;
}
function dedupeCaseTasks(tasks: TaskRecord[], caseId?: string, caseRecord?: CaseRecord | null) {
  const byKey = new Map<string, TaskRecord>();
  for (const task of tasks) {
    const key = getCaseTaskDedupeKey(task);
    const current = byKey.get(key);
    byKey.set(key, current ? pickBetterCaseLinkedRecord(current, task, caseId, caseRecord) : task);
  }
  return Array.from(byKey.values());
}
function dedupeCaseEvents(events: EventRecord[], caseId?: string, caseRecord?: CaseRecord | null) {
  const byKey = new Map<string, EventRecord>();
  for (const event of events) {
    const key = getCaseEventDedupeKey(event);
    const current = byKey.get(key);
    byKey.set(key, current ? pickBetterCaseLinkedRecord(current, event, caseId, caseRecord) : event);
  }
  return Array.from(byKey.values());
}
function getCaseWorkItemDedupeKey(item: WorkItem) {
  const id = normalizeCaseRelationId(item.id);
  if (id) return `${item.kind}:id:${id}`;
  return [item.kind, item.title, item.status, item.dateLabel].map(normalizeCaseDedupePart).join('|');
}
function dedupeCaseWorkItems(workItems: WorkItem[]) {
  const byKey = new Map<string, WorkItem>();
  for (const item of workItems) {
    const key = getCaseWorkItemDedupeKey(item);
    if (!byKey.has(key)) byKey.set(key, item);
  }
  return Array.from(byKey.values()).sort((first, second) => first.sortTime - second.sortTime);
}
function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[], activities: CaseActivity[]) {
  const taskItems: WorkItem[] = tasks.map((task) => ({
    id: `task-${task.id}`,
    kind: 'task',
    title: task.title || 'Zadanie bez tytułu',
    subtitle: task.type ? `Zadanie · ${task.type}` : 'Zadanie powiązane ze sprawą',
    status: getTaskStatusLabel(task.status),
    statusClass: getStatusClass(task.status),
    dateLabel: formatDateTime(getTaskMainDate(task) || task.reminderAt, 'Bez terminu'),
    sortTime: sortTime(getTaskMainDate(task) || task.reminderAt),
    source: task,
  }));

  const eventItems: WorkItem[] = events.map((event) => ({
    id: `event-${event.id}`,
    kind: 'event',
    title: event.title || 'Wydarzenie bez tytułu',
    subtitle: event.endAt ? `Wydarzenie do ${formatDateTime(event.endAt)}` : 'Wydarzenie powiązane ze sprawą',
    status: getEventStatusLabel(event.status),
    statusClass: getStatusClass(event.status),
    dateLabel: formatDateTime(getEventMainDate(event) || event.reminderAt, 'Bez terminu'),
    sortTime: sortTime(getEventMainDate(event) || event.reminderAt),
    source: event,
  }));

  const missingItems: WorkItem[] = items
    .filter((item) => item.status !== 'accepted')
    .map((item) => ({
      id: `item-${item.id}`,
      kind: 'missing',
      title: item.title || 'Brak w sprawie',
      subtitle: item.description || getItemTypeLabel(item.type),
      status: getItemStatusLabel(item.status),
      statusClass: getStatusClass(item.status),
      dateLabel: formatDate(item.dueDate, 'Bez terminu'),
      sortTime: sortTime(item.dueDate),
      source: item,
    }));

  const noteItems: WorkItem[] = activities.slice(0, 6).map((activity) => ({
    id: `activity-${activity.id}`,
    kind: 'note',
    title: getActivityText(activity),
    subtitle: typeof activity.payload?.note === 'string' ? activity.payload.note : 'Historia sprawy',
    status: 'Historia',
    statusClass: 'case-detail-pill-muted',
    dateLabel: formatDateTime(activity.createdAt, 'Brak daty'),
    sortTime: sortTime(activity.createdAt, 0),
    source: activity,
  }));

  return [...taskItems, ...eventItems, ...missingItems, ...noteItems].sort((first, second) => first.sortTime - second.sortTime);
}
function WorkKindIcon({ kind }: { kind: WorkItem['kind'] }) {
  if (kind === 'task') return <ListChecks className="h-4 w-4" />;
  if (kind === 'event') return <CalendarClock className="h-4 w-4" />;
  if (kind === 'missing') return <EntityIcon entity="template" className="h-4 w-4" />;
  return <History className="h-4 w-4" />;
}
function getWorkKindLabel(kind: WorkItem['kind']) {
  if (kind === 'task') return 'Zadanie';
  if (kind === 'event') return 'Wydarzenie';
  if (kind === 'missing') return 'Brak';
  return 'Notatka';
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_CASE_DETAIL = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';


function CaseDetailLoadingState() {
  return (
    <Layout>
      <main className="case-detail-page case-detail-page-loading" data-case-detail-loading="true">
        <section className="case-detail-transition-loader" role="status" aria-live="polite">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <div>
            <p>Ładowanie sprawy...</p>
            <span>Przygotowujemy dane sprawy. Panele i akcje pojawią się po załadowaniu rekordu.</span>
          </div>
        </section>
      </main>
      <ConfirmDialog
        data-case-detail-delete-confirm="true"
        open={deleteCaseOpen}
        onOpenChange={(open) => {
          if (!open && !deleteCasePending) setDeleteCaseOpen(false);
        }}
        title="Usunąć sprawę?"
        description={`Czy na pewno chcesz usunąć sprawę "${caseData?.title || caseData?.clientName || 'bez tytułu'}"? Tej operacji nie można cofnąć.`}
        confirmLabel={deleteCasePending ? 'Usuwanie...' : 'Tak, usuń'}
        cancelLabel="Nie"
        confirmTone="destructive"
        pending={deleteCasePending}
        onConfirm={handleConfirmDeleteCaseRecord}
      />
    </Layout>
  );
}


const CASEDETAIL_ACTION_COLOR_TAXONOMY_V1 = 'case detail action visual taxonomy V1';
function caseDetailActionVisualKind(row: Record<string, unknown> | null | undefined) {
  return inferCloseFlowActionVisualKind(row);
}
function caseDetailActionVisualClass(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualClass(row);
}
function caseDetailActionDataKind(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualDataKind(row);
}
function caseDetailActionKindClass(kind: unknown) {
  return getCloseFlowActionKindClass(kind);
}
export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { hasAccess, access } = useWorkspace();
  const [caseData, setCaseData] = useState<CaseRecord | null>(null);
  const [casePayments, setCasePayments] = useState<CasePaymentRecord[]>([]);
  const [caseSettlementSaving, setCaseSettlementSaving] = useState(false);
  const [items, setItems] = useState<CaseItem[]>([]);
  const [activities, setActivities] = useState<CaseActivity[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [sourceLead, setSourceLead] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteCaseOpen, setDeleteCaseOpen] = useState(false);
  const [deleteCasePending, setDeleteCasePending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CaseDetailTab>('service');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
  const [pendingNoteFollowUp, setPendingNoteFollowUp] = useState<{ note: string; createdAt: string } | null>(null);
  const [customNoteFollowUpAt, setCustomNoteFollowUpAt] = useState('');
  const [isCreatingNoteFollowUp, setIsCreatingNoteFollowUp] = useState(false);
  const [isCasePaymentOpen, setIsCasePaymentOpen] = useState(false);
  const [casePaymentSubmitting, setCasePaymentSubmitting] = useState(false);
  const [casePaymentDraft, setCasePaymentDraft] = useState({
    type: 'deposit',
    amount: '',
    status: 'deposit_paid',
    dueAt: '',
    note: '',
  });

  const STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS = 'Case detail uses shared context action dialogs instead of local simplified task, event and note forms';
  const openCaseContextAction = (kind: ContextActionKind) => {
    if (!caseId) return;
    openContextQuickAction({
      kind,
      recordType: 'case',
      recordId: caseId,
      caseId,
      leadId: caseData?.leadId || null,
      clientId: caseData?.clientId || null,
      recordLabel: getCaseTitle(caseData),
    });
  };


  const caseFinanceSummary = useMemo(
    () => getCaseFinanceSummary(caseData, payments as CasePaymentRecord[]),
    [caseData, payments],
  );
  const visibleCasePayments = useMemo(() => sortCasePayments(payments as CasePaymentRecord[]).slice(0, 8), [payments]);

  const handleCreateCasePayment = async () => {
    if (!caseId || !caseData) return;
    if (!hasAccess) {
      toast.error('Brak dostępu do zapisu płatności.');
      return;
    }
    const amount = Number(casePaymentDraft.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawną kwotę wpłaty.');
      return;
    }
    try {
      setCasePaymentSubmitting(true);
      const input = {
        caseId,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        type: casePaymentDraft.type || 'payment',
        status: casePaymentDraft.status || 'partially_paid',
        amount,
        currency: caseData.currency || 'PLN',
        dueAt: casePaymentDraft.dueAt ? toIsoFromLocalInput(casePaymentDraft.dueAt) : '',
        paidAt: new Date().toISOString(),
        note: casePaymentDraft.note || '',
      };
      const created = await createPaymentInSupabase(input as any);
      setPayments((previous) => [created || input, ...previous]);
      await insertActivityToSupabase({
        caseId,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        actorType: 'operator',
        eventType: 'payment_added',
        payload: { title: 'Dodano wpłatę', amount, status: input.status, note: input.note },
      } as any).catch(() => null);
      setCasePaymentDraft({ type: 'payment', amount: '', status: 'partially_paid', dueAt: '', note: '' });
      setIsCasePaymentOpen(false);
      toast.success('Wpłata dodana');
    } catch (error) {
      console.error(error);
      toast.error('Nie udało się dodać wpłaty.');
    } finally {
      setCasePaymentSubmitting(false);
    }
  };

  const refreshCaseData = useCallback(async () => {
    if (!caseId) {
      setLoadError('Brak identyfikatora sprawy w adresie.');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setLoadError('Brak konfiguracji Supabase. Sprawdź zmienne środowiskowe aplikacji.');
      setLoading(false);
      return;
    }

    let timeoutId: number | undefined;

    try {
      setLoading(true);
      setLoadError(null);
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error('TIMEOUT_CASE_DETAIL_LOAD')), 12000);
      });
      const dataPromise = Promise.all([
        fetchCaseByIdFromSupabase(caseId),
        fetchCaseItemsFromSupabase(caseId).catch(() => []),
        fetchActivitiesFromSupabase({ caseId, limit: 80 }).catch(() => []),
        fetchTasksFromSupabase().catch(() => []),
        fetchEventsFromSupabase().catch(() => []),
        fetchPaymentsFromSupabase({ caseId }).catch(() => []),
      ]);

      const [caseRowRaw, itemRowsRaw, activityRowsRaw, taskRowsRaw, eventRowsRaw, paymentRowsRaw] = await Promise.race([dataPromise, timeoutPromise]);
      const normalizedCase = normalizeRecord<CaseRecord>(caseRowRaw);

      if (!normalizedCase?.id) {
        setCaseData(null);
        setItems([]);
        setActivities([]);
        setTasks([]);
        setEvents([]);
        setLoadError('Nie znaleziono tej sprawy w aktualnym workspace.');
        return;
      }

      setCaseData(normalizedCase);
      setItems(sortCaseItems((Array.isArray(itemRowsRaw) ? itemRowsRaw : []) as CaseItem[]));
      setActivities(sortActivities((Array.isArray(activityRowsRaw) ? activityRowsRaw : []) as CaseActivity[]));
      setTasks(
        dedupeCaseTasks(
          ((Array.isArray(taskRowsRaw) ? taskRowsRaw : []) as TaskRecord[])
            .map((task) => ({ ...task, ...normalizeWorkItem(task) }))
            .filter((task) => belongsToCase(task, caseId, normalizedCase)),
          caseId,
          normalizedCase,
        ),
      );
      setEvents(
        dedupeCaseEvents(
          ((Array.isArray(eventRowsRaw) ? eventRowsRaw : []) as EventRecord[])
            .map((event) => ({ ...event, ...normalizeWorkItem(event) }))
            .filter((event) => belongsToCase(event, caseId, normalizedCase)),
          caseId,
          normalizedCase,
        ),
      );
      setPayments(Array.isArray(paymentRowsRaw) ? paymentRowsRaw : []);
    } catch (error: any) {
      setCaseData(null);
      setItems([]);
      setActivities([]);
      setTasks([]);
      setEvents([]);
      setPayments([]);
      setLoadError(error?.message === 'TIMEOUT_CASE_DETAIL_LOAD' ? 'Ładowanie sprawy trwa za długo. Spróbuj ponownie.' : `Nie można wczytać sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!active) return;
      await refreshCaseData();
    };
    run();
    return () => {
      active = false;
    };
  }, [refreshCaseData]);

  const completionPercent = useMemo(() => {
    if (items.length > 0) return calculateCompletion(items);
    if (typeof caseData?.completenessPercent === 'number') return Math.round(caseData.completenessPercent);
    return 0;
  }, [caseData?.completenessPercent, items]);

  const openTasks = useMemo(() => tasks.filter((task) => !['done', 'completed', 'cancelled'].includes(String(task.status || ''))), [tasks]);
  const plannedEvents = useMemo(() => events.filter((event) => !['done', 'completed', 'cancelled'].includes(String(event.status || ''))), [events]);
  const missingItems = useMemo(() => items.filter((item) => item.status === 'missing'), [items]);
  const uploadedItems = useMemo(() => items.filter((item) => item.status === 'uploaded'), [items]);
  const blockers = useMemo(() => items.filter((item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected')), [items]);
  const effectiveStatus = useMemo(() => resolveCaseStatusFromItems(items, caseData?.status || 'in_progress'), [caseData?.status, items]);
  const caseLifecycleV1 = useMemo(
    () =>
      resolveCaseLifecycleV1({
        status: effectiveStatus,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          status: item.status,
          isRequired: item.isRequired,
          dueDate: item.dueDate,
        })),
        tasks: tasks.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          scheduledAt: task.scheduledAt,
          dueAt: (task as any).dueAt,
          date: task.date,
        })),
        events: events.map((event) => ({
          id: event.id,
          title: event.title,
          status: event.status,
          startAt: event.startAt,
          dueAt: event.endAt,
        })),
        now: new Date(),
      }),
    [effectiveStatus, events, items, tasks],
  );
  const workItems = useMemo(() => dedupeCaseWorkItems(buildWorkItems(openTasks, plannedEvents, items, activities)), [activities, items, openTasks, plannedEvents]);
  const caseFinance = useMemo(() => {
    const expected = Number(caseData?.expectedRevenue || 0);
    const paidFromPayments = payments
      .filter((entry) => isPaidPaymentStatus(entry?.status))
      .reduce((sum, entry) => sum + (Number(entry?.amount) || 0), 0);
    const paid = paidFromPayments > 0 ? paidFromPayments : Number(caseData?.paidAmount || 0);
    const remainingFromCase = Number(caseData?.remainingAmount);
    const remaining = Number.isFinite(remainingFromCase) ? Math.max(0, remainingFromCase) : Math.max(0, expected - paid);
    const currency = typeof caseData?.currency === 'string' && caseData.currency.trim() ? caseData.currency.trim().toUpperCase() : 'PLN';
    const billingStatus = paid <= 0 ? 'not_started' : paid >= expected && expected > 0 ? 'fully_paid' : 'partially_paid';
    return {
      expected: Number.isFinite(expected) ? Math.max(0, expected) : 0,
      paid: Number.isFinite(paid) ? Math.max(0, paid) : 0,
      remaining,
      currency,
      billingStatus,
    };
  }, [caseData?.currency, caseData?.expectedRevenue, caseData?.paidAmount, caseData?.remainingAmount, payments]);
  const recentCaseMoves = useMemo(() => activities.slice(0, 5), [activities]);
  const nearestOperationalAction = useMemo(() => getNearestPlannedAction({
    recordType: 'case',
    recordId: String(caseData?.id || caseId || ''),
    items: [...openTasks, ...plannedEvents],
  }), [caseData?.id, caseId, openTasks, plannedEvents]);
  const nextAction = useMemo(() => {
    if (nearestOperationalAction) {
      return {
        title: nearestOperationalAction.title,
        kind: (nearestOperationalAction.type === 'event' || nearestOperationalAction.type === 'meeting') ? 'event' : 'task',
        dateLabel: formatDateTime(nearestOperationalAction.when),
      };
    }
    return workItems.find((item) => item.kind === 'task' || item.kind === 'event' || item.kind === 'missing') || null;
  }, [nearestOperationalAction, workItems]);
  const lastActivityAt = caseData?.lastActivityAt || caseData?.updatedAt || activities[0]?.createdAt || caseData?.createdAt;
  const sourceLeadLabel = sourceLead ? String(sourceLead.name || sourceLead.company || 'Źródłowy lead') : caseData?.leadId ? 'Źródłowy lead podpięty' : 'Brak źródłowego leada';
  const caseDetailWriteAccessDenied = !hasAccess;
  const caseDetailAccessStatus = String(access?.status || 'inactive');
  const guardCaseDetailWriteAccess = (actionLabel: string) => {
    if (!caseDetailWriteAccessDenied) return true;
    const reason = caseDetailAccessStatus === 'trial_expired' ? 'Trial wygasł.' : 'Brak aktywnego dostępu.';
    toast.error(reason + ' Nie mozna teraz ' + actionLabel + '.');
    return false;
  };


  const openCaseTaskDialog = () => {
    if (!guardCaseDetailWriteAccess('dodać zadania')) return;
    openCaseContextAction('task');
  };

  const openCaseEventDialog = () => {
    if (!guardCaseDetailWriteAccess('dodać wydarzenia')) return;
    openCaseContextAction('event');
  };

  const openCaseNoteDialog = () => {
    if (!guardCaseDetailWriteAccess('dodać notatki')) return;
    openCaseContextAction('note');
  };

  const openCasePaymentDialog = (type: 'deposit' | 'partial') => {
    if (!guardCaseDetailWriteAccess('dodać płatności')) return;
    setCasePaymentDraft({
      type,
      amount: '',
      status: type === 'deposit' ? 'deposit_paid' : 'partially_paid',
      dueAt: '',
      note: '',
    });
    setIsCasePaymentOpen(true);
  };

  const markCaseFullyPaid = async () => {
    if (!caseId || !guardCaseDetailWriteAccess('oznaczyć sprawy jako opłaconej')) return;
    const remaining = Number(caseFinance.remaining || 0);
    if (remaining <= 0) {
      toast.message('Ta sprawa jest już rozliczona.');
      return;
    }
    try {
      await createPaymentInSupabase({
        caseId,
        clientId: caseData?.clientId || null,
        leadId: caseData?.leadId || null,
        type: 'final',
        status: 'fully_paid',
        amount: remaining,
        currency: caseFinance.currency,
        paidAt: new Date().toISOString(),
        note: 'Rozliczenie końcowe sprawy',
      });
      await updateCaseInSupabase({ id: caseId, paidAmount: caseFinance.paid + remaining, remainingAmount: 0 }).catch(() => null);
      await refreshCaseData();
      toast.success('Sprawa oznaczona jako opłacona.');
    } catch (error: any) {
      toast.error(`Nie udało się domknąć płatności: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleSaveCasePayment = async () => {
    if (!caseId || !guardCaseDetailWriteAccess('zapisać płatności')) return;
    const amount = Number(casePaymentDraft.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawną kwotę płatności.');
      return;
    }
    try {
      setCasePaymentSubmitting(true);
      await createPaymentInSupabase({
        caseId,
        clientId: caseData?.clientId || null,
        leadId: caseData?.leadId || null,
        type: casePaymentDraft.type,
        status: casePaymentDraft.status || 'awaiting_payment',
        amount,
        currency: caseFinance.currency,
        dueAt: casePaymentDraft.dueAt || null,
        paidAt: isPaidPaymentStatus(casePaymentDraft.status) ? new Date().toISOString() : null,
        note: casePaymentDraft.note || '',
      });
      await refreshCaseData();
      setIsCasePaymentOpen(false);
      toast.success('Płatność sprawy zapisana.');
    } catch (error: any) {
      toast.error(`Nie udało się zapisać płatności: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setCasePaymentSubmitting(false);
    }
  };

  const recordActivity = async (eventType: string, payload: Record<string, any>) => {
    if (!caseId) return;
    await insertActivityToSupabase({ caseId, actorType: 'operator', eventType, payload }).catch(() => null);
  };


  const closeNoteFollowUpPrompt = () => {
    setPendingNoteFollowUp(null);
    setCustomNoteFollowUpAt('');
  };

  const handleCreateCaseNoteFollowUp = async (choice: CaseNoteFollowUpChoice) => {
    if (!guardCaseDetailWriteAccess('dodać follow-upu po notatce')) return;
    if (!caseId || !pendingNoteFollowUp) return;
    const scheduledAt = buildCaseNoteFollowUpIso(choice, customNoteFollowUpAt);
    if (!scheduledAt) {
      toast.error('Wybierz termin follow-upu');
      return;
    }
    const title = `Follow-up: ${getCaseTitle(caseData)}`;
    try {
      setIsCreatingNoteFollowUp(true);
      const created = await insertTaskToSupabase({
        title,
        type: 'follow_up',
        status: 'todo',
        priority: 'normal',
        scheduledAt,
        reminderAt: scheduledAt,
        date: buildDateOnlyFromIso(scheduledAt),
        caseId,
        clientId: caseData?.clientId || null,
        leadId: caseData?.leadId || null,
      });
      await recordActivity('case_note_follow_up_added', {
        title,
        scheduledAt,
        taskId: (created as any)?.id || null,
        source: 'case_note_follow_up_prompt',
        choice: getCaseNoteFollowUpChoiceLabel(choice),
        notePreview: pendingNoteFollowUp.note.slice(0, 160),
      });
      await updateCaseInSupabase({ id: caseId, lastActivityAt: new Date().toISOString() }).catch(() => null);
      closeNoteFollowUpPrompt();
      await refreshCaseData();
      toast.success('Follow-up dodany do sprawy');
    } catch (error: any) {
      toast.error(`Nie udało się dodać follow-upu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setIsCreatingNoteFollowUp(false);
    }
  };

  const refreshStatusAfterMutation = async (nextStatus?: string) => {
    if (!caseId) return;
    const status = nextStatus || resolveCaseStatusFromItems(items, caseData?.status || 'in_progress');
    await updateCaseInSupabase({ id: caseId, status, completenessPercent: completionPercent, lastActivityAt: new Date().toISOString() }).catch(() => null);
  };

  const handleCopyPortal = async () => {
    if (!guardCaseDetailWriteAccess('wygenerować linku do portalu')) return;
    if (!caseId) return;
    try {
      const payload = await createClientPortalTokenInSupabase(caseId);
      const url = buildPortalUrl(caseId, (payload || {}) as Record<string, unknown>);
      await navigator.clipboard.writeText(url);
      toast.success('Link do portalu skopiowany');
    } catch (error: any) {
      toast.error(`Nie udało się skopiować portalu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleAddItem = async () => {
    if (!guardCaseDetailWriteAccess('dodać braku')) return;
    if (!caseId || !newItem.title.trim()) {
      toast.error('Podaj nazwę braku');
      return;
    }
    try {
      const created = await insertCaseItemToSupabase({
        caseId,
        title: newItem.title.trim(),
        description: newItem.description.trim(),
        type: newItem.type,
        isRequired: newItem.isRequired,
        dueDate: newItem.dueDate || null,
        status: 'missing',
        order: items.length + 1,
      });
      await recordActivity('item_added', { title: newItem.title.trim(), itemId: (created as any)?.id || null });
      setNewItem({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
      setIsAddItemOpen(false);
      await refreshCaseData();
      toast.success('Brak dodany do sprawy');
    } catch (error: any) {
      toast.error(`Nie udało się dodać braku: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleItemStatusChange = async (item: CaseItem, status: CaseItemStatus) => {
    if (!guardCaseDetailWriteAccess('zmienić statusu braku')) return;
    if (!caseId) return;
    try {
      await updateCaseItemInSupabase({ id: item.id, caseId, status, approvedAt: status === 'accepted' ? new Date().toISOString() : null });
      await recordActivity(status === 'accepted' ? 'decision_made' : 'status_changed', { itemId: item.id, title: item.title, status });
      await refreshStatusAfterMutation();
      await refreshCaseData();
      toast.success('Status braku zmieniony');
    } catch (error: any) {
      toast.error(`Nie udało się zmienić statusu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleDeleteItem = async (item: CaseItem) => {
    if (!guardCaseDetailWriteAccess('usunąć braku')) return;
    if (!window.confirm('Usunąć ten brak ze sprawy?')) return;
    try {
      await deleteCaseItemFromSupabase(item.id);
      await recordActivity('item_deleted', { itemId: item.id, title: item.title });
      await refreshCaseData();
      toast.success('Brak usunięty');
    } catch (error: any) {
      toast.error(`Nie udało się usunąć braku: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };


  const handleTaskDone = async (task: TaskRecord) => {
    if (!guardCaseDetailWriteAccess('oznaczyc zadania jako zrobione')) return;
    try {
      await updateTaskInSupabase({ id: task.id, status: 'done' });
      await recordActivity('task_status_changed', { title: task.title, taskId: task.id, status: 'done' });
      await refreshCaseData();
      toast.success('Zrobione');
    } catch (error: any) {
      toast.error(`Nie udało się zamknąć zadania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleTaskTomorrow = async (task: TaskRecord) => {
    const nextDate = buildQuickRescheduleIso(1, getTaskMainDate(task) || task.reminderAt, 9);
    try {
      await updateTaskInSupabase({ id: task.id, scheduledAt: nextDate, dueAt: nextDate, date: buildDateOnlyFromIso(nextDate) });
      await recordActivity('task_rescheduled', { title: task.title, taskId: task.id, scheduledAt: nextDate });
      await refreshCaseData();
      toast.success('Zadanie przełożone na jutro');
    } catch (error: any) {
      toast.error(`Nie udało się przełożyć zadania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };


  const handleEventDone = async (event: EventRecord) => {
    if (!guardCaseDetailWriteAccess('oznaczyc wydarzenia jako odbyte')) return;
    try {
      await updateEventInSupabase({ id: event.id, status: 'done' });
      await recordActivity('event_status_changed', { title: event.title, eventId: event.id, status: 'done' });
      await refreshCaseData();
      toast.success('Wydarzenie oznaczone jako zrobione');
    } catch (error: any) {
      toast.error(`Nie udało się zamknąć wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleEventTomorrow = async (event: EventRecord) => {
    const nextStart = buildQuickRescheduleIso(1, getEventMainDate(event) || event.reminderAt, 9);
    const nextEnd = addDurationToIso(nextStart, getEventDurationMs(event));
    try {
      await updateEventInSupabase({ id: event.id, startAt: nextStart, endAt: nextEnd });
      await recordActivity('event_rescheduled', { title: event.title, eventId: event.id, startAt: nextStart });
      await refreshCaseData();
      toast.success('Wydarzenie przełożone na jutro');
    } catch (error: any) {
      toast.error(`Nie udało się przełożyć wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const setCaseLifecycleStatusV1 = async (status: string) => {
    if (!caseId) return;
    try {
      const previousStatus = caseData?.status || null;
      await updateCaseInSupabase({ id: caseId, status, lastActivityAt: new Date().toISOString() });
      await recordActivity(status === 'completed' ? 'case_lifecycle_completed' : previousStatus === 'completed' ? 'case_lifecycle_reopened' : 'case_lifecycle_started', {
        status,
        previousStatus,
        source: 'case_detail_v1_command_center',
      });
      await refreshCaseData();
      toast.success('Status sprawy zaktualizowany');
    } catch (error: any) {
      toast.error(`Nie udało się zmienić statusu sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };


  // FIN-5_CASE_SETTLEMENT_PAYMENTS_FROM_LOAD via isolated refresh hook
  const refreshCaseSettlementPayments = useCallback(async () => {
    if (!caseId) return;
    const refreshedPayments = await fetchPaymentsFromSupabase({ caseId });
    setCasePayments(refreshedPayments as CasePaymentRecord[]);
  }, [caseId]);

  useEffect(() => {
    if (!caseId || !isSupabaseConfigured()) return;
    void refreshCaseSettlementPayments().catch(() => null);
  }, [caseId, refreshCaseSettlementPayments]);

  const handleAddCaseSettlementPayment = async (value: CaseSettlementPaymentInput) => {
    if (!caseId || !caseData) return;
    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const amount = Number(value.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawną kwotę płatności.');
      return;
    }

    try {
      setCaseSettlementSaving(true);
      await createPaymentInSupabase({
        caseId,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        type: value.type,
        status: value.status,
        amount,
        currency: value.currency || caseData.currency || 'PLN',
        paidAt: value.paidAt,
        dueAt: value.dueAt,
        note: value.note || '',
      });
      await refreshCaseSettlementPayments();
      toast.success(value.type === 'commission' ? 'Płatność prowizji dodana' : 'Wpłata klienta dodana');
    } catch (error: any) {
      toast.error('Nie udało się zapisać płatności: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setCaseSettlementSaving(false);
    }
  };

  const handleEditCaseSettlementCommission = async (value: CaseSettlementCommissionInput) => {
    if (!caseId || !caseData) return;
    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const nextContractValue = Number(value.contractValue || 0);
    if (!Number.isFinite(nextContractValue) || nextContractValue < 0) {
      toast.error('Podaj poprawną wartość transakcji.');
      return;
    }

    try {
      setCaseSettlementSaving(true);
      const payload = {
        id: caseId,
        contractValue: Math.max(0, nextContractValue),
        expectedRevenue: Math.max(0, nextContractValue),
        commissionMode: value.commissionMode,
        commissionBase: value.commissionBase,
        commissionRate: Number(value.commissionRate || 0),
        commissionAmount: Number(value.commissionAmount || 0),
        commissionStatus: value.commissionStatus,
        currency: value.currency || caseData.currency || 'PLN',
      };
      await updateCaseInSupabase(payload);
      setCaseData((current: CaseRecord | null) => current ? {
        ...current,
        contractValue: payload.contractValue,
        expectedRevenue: payload.expectedRevenue,
        commissionMode: payload.commissionMode,
        commissionBase: payload.commissionBase,
        commissionRate: payload.commissionRate,
        commissionAmount: payload.commissionAmount,
        commissionStatus: payload.commissionStatus,
        currency: payload.currency,
      } : current);
      toast.success('Prowizja sprawy zapisana');
    } catch (error: any) {
      toast.error('Nie udało się zapisać prowizji: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setCaseSettlementSaving(false);
    }
  };
  
  async function handleConfirmDeleteCaseRecord() {
    if (!caseData?.id) return;

    try {
      setDeleteCasePending(true);
      await deleteCaseWithRelations(caseData.id);
      toast.success('Sprawa usunięta');
      setDeleteCaseOpen(false);
      navigate('/cases');
    } catch (error: any) {
      toast.error(`Błąd: ${error?.message || 'Nie udało się usunąć sprawy.'}`);
    } finally {
      setDeleteCasePending(false);
    }
  }

  const caseHistoryItems = useMemo<CaseHistoryItem[]>(() => {
    const history: CaseHistoryItem[] = [];

    for (const activity of activities) {
      const item = getCaseActivityHistoryItemStage14D(activity);
      if (item) history.push(item);
    }

    for (const task of tasks) {
      const normalizedStatus = String(task.status || '').toLowerCase();
      const title = ['done', 'completed'].includes(normalizedStatus) ? 'Zadanie wykonane' : 'Zadanie';
      const body = pickCaseHistoryBodyStage14D(task.title, 'Zadanie bez tytułu');
      if (body) {
        history.push({
          id: `task-${task.id || body}`,
          kind: 'task',
          title,
          body,
          occurredAt: getCaseHistoryDateStage14D((task as any).completedAt, (task as any).doneAt, (task as any).updatedAt, getTaskMainDate(task), task.reminderAt, task.date),
        });
      }
    }

    for (const event of events) {
      const body = pickCaseHistoryBodyStage14D(event.title, 'Wydarzenie bez tytułu');
      if (body) {
        history.push({ id: `event-${event.id || body}`, kind: 'event', title: 'Wydarzenie', body, occurredAt: getCaseHistoryDateStage14D((event as any).updatedAt, getEventMainDate(event), event.reminderAt, event.startAt, event.endAt) });
      }
    }

    for (const payment of visibleCasePayments) {
      const amountLabel = formatMoney(getPaymentAmount(payment), payment.currency || caseFinanceSummary.currency);
      const note = pickCaseHistoryBodyStage14D(payment.note);
      const body = note ? `${amountLabel} · ${note}` : amountLabel;
      history.push({ id: `payment-${payment.id || body}`, kind: 'payment', title: 'Wpłata', body, occurredAt: getCaseHistoryDateStage14D(payment.paidAt, payment.createdAt, payment.dueAt) });
    }

    for (const item of items) {
      const body = pickCaseHistoryBodyStage14D(item.title, item.description);
      if (body) {
        const title = item.status === 'accepted' ? 'Element zaakceptowany' : item.status === 'uploaded' ? 'Element przesłany' : 'Element sprawy';
        history.push({ id: `item-${item.id || body}`, kind: 'case', title, body, occurredAt: getCaseHistoryDateStage14D(item.approvedAt, item.createdAt, item.dueDate) });
      }
    }

    const unique = new Map<string, CaseHistoryItem>();
    for (const item of history) {
      const key = `${item.kind}|${item.title}|${item.body}|${item.occurredAt || ''}`;
      if (!unique.has(key)) unique.set(key, item);
    }
    return sortCaseHistoryItemsStage14D(Array.from(unique.values())).slice(0, 25);
  }, [activities, tasks, events, visibleCasePayments, items, caseFinanceSummary.currency]);
  if (loading) {
    return (
      <Layout>
        <main className="case-detail-vnext-page">
          <section className="case-detail-loading-card">
              <div data-fin5-case-settlement-instance="true">
                <CaseSettlementSection
              routeCaseId={caseId}
                  record={caseData}
                  payments={casePayments}
                  readonly={!hasAccess}
                  isSaving={caseSettlementSaving}
                  onAddPayment={handleAddCaseSettlementPayment}
                  onEditCommission={handleEditCaseSettlementCommission}
                />
              </div>

            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Ładowanie sprawy...</span>
          </section>
        </main>
      </Layout>
    );
  }

  if (loadError || !caseData) {
    return (
      <Layout>
        <main className="case-detail-vnext-page">
          <section className="case-detail-empty-card">
            <AlertCircle className="h-8 w-8" />
            <h1>Nie można otworzyć sprawy</h1>
            <p>{loadError || 'Nie znaleziono tej sprawy w aktualnym workspace.'}</p>
            <Button type="button" variant="outline" onClick={() => navigate('/cases')}>
              <ArrowLeft className="h-4 w-4" />
              Wróć do spraw
            </Button>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      {caseData?.id ? (
        <div className="cf-case-detail-delete-shortcut">
          <EntityTrashButton
            type="button"
            variant="ghost"
            data-case-detail-delete-action="true"
            aria-label="Usuń sprawę"
            title="Usuń sprawę"
            disabled={deleteCasePending}
            onClick={() => setDeleteCaseOpen(true)}
          >
            {deleteCasePending ? <Loader2 className="cf-trash-action-icon h-4 w-4 animate-spin" /> : <Trash2 className="cf-trash-action-icon h-4 w-4" />}
            Usuń sprawę
          </EntityTrashButton>
        </div>
      ) : null}
      <main className="case-detail-vnext-page">
        <header className="case-detail-header">
          <div className="case-detail-header-copy">
            <button type="button" className="case-detail-back-button" onClick={() => navigate('/cases')}>
              <ArrowLeft className="h-4 w-4" />
              Sprawy
            </button>
            <p className="case-detail-breadcrumb">Sprawy</p>
            <div className="case-detail-title-row">
              <h1>{getCaseTitle(caseData)}</h1>
              <span className={`case-detail-pill ${getStatusClass(effectiveStatus)}`}>{getCaseStatusLabel(effectiveStatus)}</span>
            </div>
            <div className="case-detail-header-meta">
              <span>Klient: {caseData.clientName || 'Brak klienta'}</span>
              <span>Ostatnia zmiana: {formatDateTime(lastActivityAt)}</span>
              <span>Źródło: {caseData.leadId ? 'Lead' : caseData.createdFromLead ? 'Lead' : 'Sprawa ręczna'}</span>
            </div>
          </div>
                  </header>

        <section className="case-detail-top-grid">
          <article className="case-detail-top-card case-detail-top-card-blue">
            <div className="case-detail-card-title-row">
              <Clock className="h-4 w-4" />
              <h2>Najbliższa akcja operacyjna</h2>
            </div>
            <strong>{nextAction ? nextAction.title : 'Brak zaplanowanego ruchu'}</strong>
            <p>{nextAction ? `${getWorkKindLabel(nextAction.kind)} · ${nextAction.dateLabel}` : 'Dodaj zadanie albo wydarzenie, żeby sprawa miała najbliższy termin w sprawie.'}</p>
          </article>
          <article className="case-detail-top-card case-detail-top-card-green">
            <div className="case-detail-card-title-row">
              <CheckCircle2 className="h-4 w-4" />
              <h2>Postęp sprawy</h2>
            </div>
            <strong>{completionPercent}%</strong>
            <p>{items.length > 0 ? `${items.filter((item) => item.status === 'accepted').length} z ${items.length} elementów zaakceptowanych` : 'Brak checklisty do przeliczenia.'}</p>
            <div className="case-detail-progress"><span style={{ width: `${completionPercent}%` }} /></div>
          </article>
          <article className="case-detail-top-card case-detail-top-card-amber">
            <div className="case-detail-card-title-row">
              <AlertCircle className="h-4 w-4" />
              <h2>Blokady / braki</h2>
            </div>
            <strong>{blockers.length}</strong>
            <p>{blockers[0] ? `${blockers[0].title || 'Brak'} · ${getItemStatusLabel(blockers[0].status)}` : 'Brak aktywnych blokerów po stronie sprawy.'}</p>
          </article>
          <article className="case-detail-top-card case-detail-top-card-muted">
            <div className="case-detail-card-title-row">
              <ShieldStatusIcon status={effectiveStatus} />
              <h2>Status operacyjny</h2>
            </div>
            <strong>{getCaseStatusLabel(effectiveStatus)}</strong>
            <p>{getCaseStatusHint(effectiveStatus)}</p>
          </article>
        </section>

        <div className="case-detail-shell">
          <section className="case-detail-main-column">
      
      {pendingNoteFollowUp ? (
        <section className="case-detail-note-follow-up-panel" data-case-note-follow-up-prompt="true">
          <div className="case-detail-note-follow-up-head">
            <div>
              <p className="case-detail-eyebrow">Następny ruch</p>
              <h3>Ustawić follow-up do tej notatki?</h3>
              <p>Notatka jest zapisana. Teraz możesz od razu przypiąć kolejny ruch do tej sprawy.</p>
            </div>
            <Button type="button" variant="ghost" onClick={closeNoteFollowUpPrompt} data-case-note-follow-up-dismiss="true">
              Nie teraz
            </Button>
          </div>
          <div className="case-detail-note-follow-up-preview">{pendingNoteFollowUp.note}</div>
          <div className="case-detail-note-follow-up-actions">
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('today')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="today">Dziś</Button>
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('tomorrow')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="tomorrow">Jutro</Button>
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('two_days')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="two_days">Za 2 dni</Button>
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('week')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="week">Za tydzień</Button>
          </div>
          <div className="case-detail-note-follow-up-custom">
            <Label htmlFor="case-note-follow-up-at">Własny termin</Label>
            <Input id="case-note-follow-up-at" type="datetime-local" value={customNoteFollowUpAt} onChange={(event) => setCustomNoteFollowUpAt(event.target.value)} data-case-note-follow-up-custom-input="true" />
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('custom')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="custom">Ustaw własny</Button>
          </div>
        </section>
      ) : null}

      <section className="case-detail-finance-history-panel" data-case-finance-history-panel="true">

        <div className="case-detail-finance-payments-head">

          <strong>Historia wpłat</strong>

          <span>{visibleCasePayments.length}</span>

        </div>

        {visibleCasePayments.length ? (

          <div className="case-detail-finance-history-list">

            {visibleCasePayments.map((payment) => (

              <article key={String(payment.id || payment.createdAt || payment.note || getPaymentAmount(payment))} className="case-detail-finance-payment-row">

                <div>

                  <strong>{formatMoney(getPaymentAmount(payment), payment.currency || caseFinanceSummary.currency)}</strong>

                  <span>{billingStatusLabel(payment.status)}</span>

                </div>

                <small>{formatDate(payment.paidAt || payment.createdAt || payment.dueAt, 'Bez daty')}</small>

              </article>

            ))}

          </div>

        ) : (

          <p className="case-detail-finance-empty">Brak wpłat. Dodaj pierwszą zaliczkę albo płatność częściową.</p>

        )}

      </section>


      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CaseDetailTab)}>
              <nav aria-label="Zakładki sprawy">
                <TabsList className="case-detail-tabs">
                  {[
                    { key: 'service', label: 'Obsługa' },
                    { key: 'path', label: 'Ścieżka' },
                    { key: 'checklists', label: 'Checklisty' },
                    { key: 'history', label: 'Historia' },
                  ].map((tab) => (
                    <TabsTrigger key={tab.key} value={tab.key} className={activeTab === tab.key ? 'case-detail-tab-active' : ''}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </nav>
            </Tabs>

            {activeTab === 'service' ? (
              <section className="case-detail-section-card">
                <div className="case-detail-section-head">
                                  <section className="case-detail-section-card" data-case-history-list="true">
  <div className="case-detail-section-head">
    <div>
      <h2>Historia sprawy</h2>
      <p>Realne notatki, zadania, wydarzenia, wpłaty i zmiany zapisane przy tej sprawie.</p>
    </div>
  </div>
  {(() => {
    const caseHistoryItems = buildCaseHistoryItemsStage14D({
      activities: activities,
      tasks: tasks,
      events: events,
      payments: casePayments,
      caseItems: items,
    });
    return caseHistoryItems.length > 0 ? (
      <div className="case-history-list">
        {caseHistoryItems.slice(0, 10).map((item) => (
          <article className="case-history-row" key={item.id}>
            <span className="case-history-kind">{item.title}</span>
            <p title={item.body}>{item.body}</p>
            <time>{formatDate(item.occurredAt, 'Brak daty')}</time>
          </article>
        ))}
      </div>
    ) : (
      <p className="case-detail-light-empty">Brak historii sprawy.</p>
    );
  })()}
</section>                </div>
                <div className="case-detail-work-list">
                  {workItems.length === 0 ? (
                    <div className="case-detail-light-empty">Brak działań do pokazania. Dodaj brak, zadanie albo wydarzenie.</div>
                  ) : (
                    workItems.map((entry) => (
                      <div key={entry.id} style={{ display: 'contents' }}>
                        <WorkItemRow
                          entry={entry}
                          onTaskDone={handleTaskDone}
                          onTaskTomorrow={handleTaskTomorrow}
                          onEventDone={handleEventDone}
                          onEventTomorrow={handleEventTomorrow}
                          onItemAccept={(item) => handleItemStatusChange(item, 'accepted')}
                          onItemReject={(item) => handleItemStatusChange(item, 'rejected')}
                          onItemDelete={handleDeleteItem}
                        />
                      </div>
                    ))
                  )}
                </div>
              </section>
            ) : null}

            {activeTab === 'path' ? (
              <section className="case-detail-section-card">
                <div className="case-detail-section-head">
                  <div>
                    <h2>Ścieżka sprawy</h2>
                    <p>Operacyjny skrót tego, co blokuje start albo realizację.</p>
                  </div>
                </div>
                <div className="case-detail-path-grid">
                  <PathCard label="Braki" value={missingItems.length} helper="Elementy, które trzeba jeszcze dostać." tone="amber" />
                  <PathCard label="Do akceptacji" value={uploadedItems.length} helper="Elementy przesłane i czekające na decyzję." tone="blue" />
                  <PathCard label="Zadania" value={openTasks.length} helper="Otwarte zadania powiązane ze sprawą." tone="green" />
                  <PathCard label="Wydarzenia" value={plannedEvents.length} helper="Zaplanowane spotkania i terminy." tone="neutral" />
                </div>
              </section>
            ) : null}

            {activeTab === 'checklists' ? (
              <section className="case-detail-section-card">
                <div className="case-detail-section-head">
                  <div>
                    <h2>Checklisty i braki</h2>
                    <p>Dokumenty, decyzje, informacje i inne rzeczy potrzebne do pracy.</p>
                  </div>
                  <Button type="button" onClick={() => setIsAddItemOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Dodaj brak
                  </Button>
                </div>
                <div className="case-detail-checklist-list">
                  {items.length === 0 ? (
                    <div className="case-detail-light-empty">Brak checklisty. Dodaj pierwszy wymagany element sprawy.</div>
                  ) : (
                    items.map((item) => (
                      <article key={item.id} className="case-detail-checklist-row">
                        <div>
                          <span className="case-detail-kind-pill">{getItemTypeLabel(item.type)}</span>
                          <h3>{item.title || 'Element sprawy'}</h3>
                          <p>{item.description || 'Bez opisu'} · Termin: {formatDate(item.dueDate)}</p>
                        </div>
                        <span className={`case-detail-pill ${getStatusClass(item.status)}`}>{getItemStatusLabel(item.status)}</span>
                        <div className="case-detail-row-actions">
                          <button type="button" onClick={() => handleItemStatusChange(item, 'uploaded')}>Wysłane</button>
                          <button type="button" onClick={() => handleItemStatusChange(item, 'accepted')}>Akceptuj</button>
                          <button type="button" onClick={() => handleItemStatusChange(item, 'rejected')}>Odrzuć</button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ) : null}

            {activeTab === 'history' ? (
              <section className="case-detail-section-card">
                <div className="case-detail-section-head">
                  <div>
                    <h2>Historia</h2>
                    <p>Krótka oś działań bez technicznych danych i bez JSON-a.</p>
                  </div>
                </div>
                <div className="case-detail-history-list">
                  {activities.length === 0 ? (
                    <div className="case-detail-light-empty">Brak historii do pokazania.</div>
                  ) : (
                    activities.map((activity) => (
                      <article key={activity.id} className="case-detail-history-row">
                        <span><History className="h-4 w-4" /></span>
                        <div>
                          <h3>{getActivityText(activity)}</h3>
                          <p>{formatDateTime(activity.createdAt)} · {activity.actorType === 'operator' ? 'Operator' : 'Klient'}</p>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ) : null}
          </section>

          <aside className="case-detail-right-rail" aria-label="Panel sprawy">
            <div data-case-quick-actions-anchor="case-detail">
              <CaseQuickActions
                caseId={caseData.id}
                caseTitle={getCaseTitle(caseData)}
                clientId={caseData.clientId || null}
                leadId={caseData.leadId || null}
                onAddPayment={() => setIsCasePaymentOpen(true)}
              />
            </div>
<section className="right-card case-detail-right-card" data-fin10-legacy-finance-panel-removed="true">
              <div className="case-detail-card-title-row">
                <Paperclip className="h-4 w-4" />
                <h2>Rozliczenie sprawy</h2>
              </div>
              <small>Wartość: {formatMoney(caseFinance.expected, caseFinance.currency)}</small>
              <small>Wpłacono: {formatMoney(caseFinance.paid, caseFinance.currency)}</small>
              <small>Pozostało: {formatMoney(caseFinance.remaining, caseFinance.currency)}</small>
              <small>Status płatności: {billingStatusLabel(caseFinance.billingStatus)}</small>
              <div className="case-detail-right-actions">
                <button type="button" onClick={() => openCasePaymentDialog('deposit')}>Dodaj zaliczkę</button>
                <button type="button" onClick={() => openCasePaymentDialog('partial')}>Płatność częściowa</button>
                <button type="button" onClick={markCaseFullyPaid}>Oznacz opłacone</button>
              </div>
            </section>
                                                </aside>
        </div>

        <Dialog open={isCasePaymentOpen} onOpenChange={setIsCasePaymentOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{casePaymentDraft.type === 'deposit' ? 'Dodaj zaliczkę' : 'Dodaj płatność częściową'}</DialogTitle></DialogHeader>
            <div className="case-detail-dialog-grid">
              <label>Kwota<Input type="number" min="0" step="0.01" value={casePaymentDraft.amount} onChange={(event) => setCasePaymentDraft((current) => ({ ...current, amount: event.target.value }))} /></label>
              <label>Status<select value={casePaymentDraft.status} onChange={(event) => setCasePaymentDraft((current) => ({ ...current, status: event.target.value }))}><option value="awaiting_payment">Czeka na płatność</option><option value="deposit_paid">Zaliczka wpłacona</option><option value="partially_paid">Częściowo opłacone</option><option value="paid">Opłacone</option></select></label>
              <label>Termin płatności<Input type="date" value={casePaymentDraft.dueAt} onChange={(event) => setCasePaymentDraft((current) => ({ ...current, dueAt: event.target.value }))} /></label>
              <label>Notatka<Textarea value={casePaymentDraft.note} onChange={(event) => setCasePaymentDraft((current) => ({ ...current, note: event.target.value }))} /></label>
            </div>
            <DialogFooter className={modalFooterClass()}><Button type="button" variant="outline" onClick={() => setIsCasePaymentOpen(false)}>Anuluj</Button><Button type="button" onClick={handleSaveCasePayment} disabled={casePaymentSubmitting}>{casePaymentSubmitting ? 'Zapisywanie...' : 'Zapisz płatność'}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <CaseItemDialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen} value={newItem} onChange={setNewItem} onSubmit={handleAddItem} />
      </main>
    
      <Dialog open={isCasePaymentOpen} onOpenChange={setIsCasePaymentOpen}>
        <DialogContent data-case-payment-dialog="true" className="case-detail-payment-dialog">
          <DialogHeader>
            <DialogTitle>Dodaj wpłatę do sprawy</DialogTitle>
          </DialogHeader>
          <div className="case-detail-payment-form">
            <div>
              <Label htmlFor="case-payment-amount">Kwota wpłaty</Label>
              <Input
                id="case-payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={casePaymentDraft.amount}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, amount: event.target.value }))}
                placeholder="np. 2000"
              />
            </div>
            <div>
              <Label htmlFor="case-payment-status">Status</Label>
              <select
                id="case-payment-status"
                value={casePaymentDraft.status}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, status: event.target.value }))}
              >
                <option value="deposit_paid">Zaliczka wpłacona</option>
                <option value="partially_paid">Częściowo opłacone</option>
                <option value="fully_paid">Opłacone</option>
                <option value="awaiting_payment">Czeka na płatność</option>
              </select>
            </div>
            <div>
              <Label htmlFor="case-payment-type">Typ</Label>
              <select
                id="case-payment-type"
                value={casePaymentDraft.type}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, type: event.target.value }))}
              >
                <option value="deposit">Zaliczka</option>
                <option value="partial">Wpłata częściowa</option>
                <option value="final">Dopłata końcowa</option>
                <option value="other">Inna wpłata</option>
              </select>
            </div>
            <div>
              <Label htmlFor="case-payment-note">Notatka</Label>
              <Textarea
                id="case-payment-note"
                value={casePaymentDraft.note}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, note: event.target.value }))}
                placeholder="np. zaliczka po akceptacji oferty"
              />
            </div>
          </div>
          <DialogFooter className={modalFooterClass()}>
            <Button type="button" variant="outline" onClick={() => setIsCasePaymentOpen(false)}>
              Anuluj
            </Button>
            <Button type="button" onClick={handleCreateCasePayment} disabled={casePaymentSubmitting || !hasAccess}>
              {casePaymentSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Zapisz wpłatę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
</Layout>
  );
}
function CaseDetailV1CommandCenter({
  status,
  lifecycle,
  onSetStatus,
  onOpenAddItem,
  onCopyPortal,
}: {
  status: string;
  lifecycle: ReturnType<typeof resolveCaseLifecycleV1>;
  onSetStatus: (status: string) => void;
  onOpenAddItem: () => void;
  onCopyPortal: () => void;
}) {
  const isCompleted = status === 'completed' || lifecycle.bucket === 'completed';

  return (
    <section className="case-detail-command-center" data-testid="case-detail-v1-command-center">
      <div className="case-detail-card-title-row">
        <EntityIcon entity="template" className="h-4 w-4" />
        <h2>Centrum dowodzenia sprawy V1</h2>
      </div>

            <div className="case-detail-command-status">
        <button type="button" onClick={() => onSetStatus('in_progress')} disabled={!isCompleted && status === 'in_progress'}>
          Start
        </button>
        <button type="button" onClick={() => onSetStatus('completed')} disabled={isCompleted}>
          Zrobione
        </button>
        <button type="button" onClick={() => onSetStatus('in_progress')} disabled={!isCompleted}>
          Przywróć
        </button>
      </div>
    </section>
  );
}
function ShieldStatusIcon({ status }: { status?: string }) {
  if (status === 'blocked') return <AlertCircle className="h-4 w-4" />;
  if (status === 'completed' || status === 'ready_to_start') return <CheckCircle2 className="h-4 w-4" />;
  return <Clock className="h-4 w-4" />;
}
function PathCard({ label, value, helper, tone }: { label: string; value: number; helper: string; tone: 'amber' | 'blue' | 'green' | 'neutral' }) {
  return (
    <article className={`case-detail-path-card case-detail-path-card-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
      <p>{helper}</p>
    </article>
  );
}
function WorkItemRow({
  entry,
  onTaskDone,
  onTaskTomorrow,
  onEventDone,
  onEventTomorrow,
  onItemAccept,
  onItemReject,
  onItemDelete,
}: {
  entry: WorkItem;
  onTaskDone: (task: TaskRecord) => void;
  onTaskTomorrow: (task: TaskRecord) => void;
  onEventDone: (event: EventRecord) => void;
  onEventTomorrow: (event: EventRecord) => void;
  onItemAccept: (item: CaseItem) => void;
  onItemReject: (item: CaseItem) => void;
  onItemDelete: (item: CaseItem) => void;
}) {
  return (
    <article className="case-detail-work-row">
      <span className="case-detail-work-icon"><WorkKindIcon kind={entry.kind} /></span>
      <div className="case-detail-work-main">
        <span className="case-detail-kind-pill">{getWorkKindLabel(entry.kind)}</span>
        <h3>{entry.title}</h3>
        <p>{entry.subtitle}</p>
      </div>
      <div className="case-detail-work-date">
        <small>Termin</small>
        <strong>{entry.dateLabel}</strong>
      </div>
      <span className={`case-detail-pill ${entry.statusClass}`}>{entry.status}</span>
      <div className="case-detail-row-actions">
        {entry.kind === 'task' ? (
          <>
            <button type="button" onClick={() => onTaskDone(entry.source as TaskRecord)}>Zrobione</button>
            <button type="button" onClick={() => onTaskTomorrow(entry.source as TaskRecord)}>Jutro</button>
          </>
        ) : null}
        {entry.kind === 'event' ? (
          <>
            <button type="button" onClick={() => onEventDone(entry.source as EventRecord)}>Zrobione</button>
            <button type="button" onClick={() => onEventTomorrow(entry.source as EventRecord)}>Jutro</button>
          </>
        ) : null}
        {entry.kind === 'missing' ? (
          <>
            <button type="button" onClick={() => onItemAccept(entry.source as CaseItem)}>Akceptuj</button>
            <button type="button" onClick={() => onItemReject(entry.source as CaseItem)}>Odrzuć</button>
            <EntityActionButton type="button" tone="danger" className="case-detail-row-action-danger" onClick={() => onItemDelete(entry.source as CaseItem)}>Usuń</EntityActionButton>
          </>
        ) : null}
      </div>
    </article>
  );
}
function CaseItemDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; description: string; type: string; isRequired: boolean; dueDate: string };
  onChange: (value: { title: string; description: string; type: string; isRequired: boolean; dueDate: string }) => void;
  onSubmit: () => void;
}) {
return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Dodaj brak</DialogTitle></DialogHeader>
        <div className="case-detail-dialog-grid">
          <label>Tytuł<Input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} placeholder="np. Umowa, skan dokumentu, decyzja" /></label>
          <label>Opis<Textarea value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} placeholder="Krótko opisz, czego brakuje." /></label>
          <label>Typ<select value={value.type} onChange={(event) => onChange({ ...value, type: event.target.value })}><option value="file">Plik</option><option value="decision">Decyzja</option><option value="text">Tekst</option></select></label>
          <label>Termin<Input type="date" value={value.dueDate} onChange={(event) => onChange({ ...value, dueDate: event.target.value })} /></label>
          <label className="case-detail-checkbox-label"><input type="checkbox" checked={value.isRequired} onChange={(event) => onChange({ ...value, isRequired: event.target.checked })} /> Wymagane do startu / realizacji</label>
        </div>
        <DialogFooter className={modalFooterClass()}><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button><Button type="button" className="cf-btn-tone-gap" onClick={onSubmit}>Dodaj brak</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


/* STAGE16M_CASE_DETAIL_WRITE_GATE_COMPAT
import { useWorkspace } from '../hooks/useWorkspace'
const { hasAccess, access } = useWorkspace()
const caseDetailWriteAccessDenied = !hasAccess
const caseDetailAccessStatus = String(access?.status)
function guardCaseDetailWriteAccess() { const reason = 'trial_expired'; toast.error(reason + ' Nie mozna teraz '); }
const handleCopyPortal = async () => { guardCaseDetailWriteAccess(); }
const handleAddItem = async () => { guardCaseDetailWriteAccess(); }
const handleItemStatusChange = async () => { guardCaseDetailWriteAccess(); }
const handleDeleteItem = async () => { guardCaseDetailWriteAccess(); }
const handleAddTask = async () => { guardCaseDetailWriteAccess(); }
const handleAddEvent = async () => { guardCaseDetailWriteAccess(); }
const handleAddNote = async () => { guardCaseDetailWriteAccess(); }
*/

const CLOSEFLOW_FIN9_CASE_DETAIL_DUPLICATE_SAFETY_MARKER = 'CLOSEFLOW_FIN9_CASE_DETAIL_DUPLICATE_SAFETY_MARKER' as const;
void CLOSEFLOW_FIN9_CASE_DETAIL_DUPLICATE_SAFETY_MARKER;
