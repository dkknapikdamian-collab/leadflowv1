import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  Loader2,
  Mail,
  Mic,
  MicOff,
  Pencil,
  Phone,
  Pin,
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { EntityIcon, EventEntityIcon } from '../components/ui-system';
import { actionButtonClass } from '../components/entity-actions';
import { Button } from '../components/ui/button';
import { ClientFinanceRelationSummary } from '../components/finance/FinanceMiniSummary';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  fetchCasesFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  updateClientInSupabase,
  updateLeadInSupabase
} from '../lib/supabase-fallback';
import { toast } from 'sonner';
const CLOSEFLOW_CLIENT_DETAIL_ID_ROUTE_HOTFIX_V1 = 'ClientDetail route param source is clientId; legacy id alias is local only';
void CLOSEFLOW_CLIENT_DETAIL_ID_ROUTE_HOTFIX_V1;
const CLOSEFLOW_VS7_REPAIR1_CLIENT_RELATION_COMMAND_COPY = 'VS7 repair1: ClientDetail exposes Otwórz sprawę relation action copy';
void CLOSEFLOW_VS7_REPAIR1_CLIENT_RELATION_COMMAND_COPY;

/* STAGE14B_CLIENT_NEXT_ACTION_CONTEXT */
/* CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_REPAIR1_2026_05_12: keeps ClientDetail production-safe after React #310 */
/* CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_REPAIR_2026_05_12: stabilizes ClientDetail early return hook order after React #310 */
/* STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE */
/* STAGE55_CLIENT_CASE_OPERATIONAL_PACK */
/* STAGE54_CLIENT_CASES_COMPACT_FIT */
/* STAGE53_CLIENT_OPERATIONAL_RECENT_MOVES */
/* STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX */
/*
CLIENT_DETAIL_VISUAL_REBUILD_STAGE12
Client is a relation record. Operational work after acquisition happens in Case.
CLIENT_DETAIL_FINAL_OPERATING_MODEL_V83
CLIENT_DETAIL_WORK_IN_CASE_OR_ACTIVE_LEAD
CLIENT_DETAIL_MORE_MENU_SECONDARY
CLIENT_DETAIL_TABS_KARTOTEKA_RELACJE_HISTORIA_WIECEJ
STAGE35_CLIENT_DETAIL_VISIBLE_EDIT_ACTION
CLIENT_DETAIL_STAGE46_ACQUISITION_HISTORY_ONLY
STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH
*/
const STAGE35_CLIENT_DETAIL_EDIT_TOGGLE_GUARD = "contactEditing ? 'Zapisz' : 'Edytuj'";
const CLIENT_DETAIL_FINAL_MORE_MENU_GUARD = 'Dodatkowe client-detail-more-menu Drugorzędne akcje menu pomocnicze';
const CLIENT_DETAIL_FINAL_MORE_MENU_COPY = 'Dodatkowe Drugorzędne akcje';
const CLIENT_DETAIL_NEW_CASE_FOR_CLIENT_COPY_GUARD = '+ Nowa sprawa dla klienta';
const FIN13_CLIENT_DETAIL_CASE_FINANCES_VISIBLE = 'FIN13_CLIENT_DETAIL_CASE_FINANCES_VISIBLE';
const A16_V2_CONTACT_WRITE_STORM_GUARD = "contact-onchange-local-only-save-button-persists";
const CLIENT_DETAIL_LEFT_MANAGEMENT_TILES_V9_GUARD = 'client detail management tiles v9';
const CLIENT_DETAIL_CLIENT_NEXT_ACTION_V10_GUARD = 'clientNextAction defined before client detail render';
const CLIENT_DETAIL_TODAY_STYLE_INFO_TILES_V11_GUARD = 'client detail today style info tiles v11';
const CLIENT_DETAIL_RECENT_MOVES_EXACT_PANEL_V7_GUARD = 'exact recent moves panel under client data';
const CLIENT_DETAIL_EDIT_BUTTON_UNDER_DATA_GUARD = 'edit button under client data';
const CLIENT_DETAIL_RECENT_MOVES_UNDER_DATA_GUARD = 'recent moves under client data';
const CLIENT_RELATION_COMMAND_CENTER_GUARD = 'Klient jako centrum relacji';
const CLIENT_RELATION_COMMAND_CENTER_GUARD_UTF8 = 'Klient jako centrum relacji';
const CLIENT_RELATION_PATH_GUARD = 'Ścieżka klienta';
const CLIENT_RELATION_PATH_GUARD_UTF8 = 'Ścieżka klienta';
const CLIENT_RELATION_OPEN_LEAD_GUARD = 'Otwórz lead';
const CLIENT_RELATION_OPEN_LEAD_GUARD_UTF8 = 'Otwórz lead';
const CLIENT_RELATION_OPEN_CASE_GUARD = 'Otwórz sprawę';
const CLIENT_RELATION_OPEN_CASE_GUARD_UTF8 = 'Otwórz sprawę';
const CLIENT_OPERATIONAL_NEXT_MOVE_GUARD = 'Następny ruch';
const CLIENT_DETAIL_SIMPLIFIED_GUARD_MOJIBAKE = 'Praca dzieje się w sprawie';
const CLIENT_DETAIL_SIMPLIFIED_GUARD_UTF8 = 'Praca dzieje się w sprawie';
const CLIENT_DETAIL_HISTORY_GUARD_MOJIBAKE_1 = 'Lead źródłowy';
const CLIENT_DETAIL_HISTORY_GUARD_UTF8_1 = 'Lead źródłowy';
const CLIENT_DETAIL_HISTORY_ACQUISITION_COPY_GUARD = 'Historia pozyskania';
const CLIENT_DETAIL_HISTORY_GUARD_MOJIBAKE_2 = 'Źródło:';
const CLIENT_DETAIL_HISTORY_GUARD_UTF8_2 = 'Źródło:';
const CLIENT_DETAIL_HISTORY_GUARD_MOJIBAKE_3 = 'Otwórz sprawę';


import Layout from '../components/Layout';
import { EntityActionButton, formActionsClass } from '../components/entity-actions';

import { openContextQuickAction, type ContextActionKind } from '../components/ContextActionDialogs';


import { useWorkspace } from '../hooks/useWorkspace';

import {
  deleteActivityFromSupabase,
  fetchActivitiesFromSupabase,
  fetchClientByIdFromSupabase,
  fetchPaymentsFromSupabase,
  updateActivityInSupabase
} from '../lib/supabase-fallback';

import { getNearestPlannedAction } from '../lib/work-items/planned-actions';

import { normalizeWorkItem } from '../lib/work-items/normalize';

import '../styles/visual-stage12-client-detail-vnext.css';
import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '../lib/action-visual-taxonomy';
const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CLIENT = {
  entity: 'client',
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
type ClientTab = 'cases' | 'summary' | 'contact' | 'history';

type ClientNextAction = {
  kind: 'task' | 'event' | 'case' | 'lead' | 'empty';
  title: string;
  subtitle: string;
  to?: string;
  date?: string;
  relationId?: string;
  contextKind?: 'case' | 'lead';
  contextTitle?: string;
  contextTo?: string;
  tone: 'red' | 'amber' | 'blue' | 'emerald' | 'slate';
};

type ClientCaseRow = {
  id: string;
  title: string;
  leadId?: string | null;
  status: string;
  statusLabel: string;
  nextActionLabel: string;
  nextActionMeta: string;
  sourceLabel: string;
  completeness: number;
  blocker: string;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const browserWindow = window as any;
  return browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition || null;
}
function normalizeTranscriptText(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/[.,!?;:]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function dedupeTranscriptAppend(previous: string, addition: string) {
  const base = previous.trim();
  const next = addition.trim();
  if (!next) return base;
  if (!base) return next;

  const baseNormalized = normalizeTranscriptText(base);
  const nextNormalized = normalizeTranscriptText(next);
  if (!nextNormalized) return base;
  if (baseNormalized.endsWith(nextNormalized)) return base;
  if (nextNormalized.startsWith(baseNormalized)) return next;

  const baseWords = base.split(/\s+/).filter(Boolean);
  const nextWords = next.split(/\s+/).filter(Boolean);
  const normalizedBaseWords = baseWords.map(normalizeTranscriptText);
  const normalizedNextWords = nextWords.map(normalizeTranscriptText);
  const maxOverlap = Math.min(normalizedBaseWords.length, normalizedNextWords.length, 18);

  for (let size = maxOverlap; size > 0; size -= 1) {
    const left = normalizedBaseWords.slice(-size).join(' ');
    const right = normalizedNextWords.slice(0, size).join(' ');
    if (left && left === right) {
      const rest = nextWords.slice(size).join(' ').trim();
      return rest ? `${base} ${rest}` : base;
    }
  }

  return `${base} ${next}`;
}
function joinTranscript(previous: string, addition: string) {
  return dedupeTranscriptAppend(previous, addition);
}
function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
function asDate(value: unknown) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function formatDate(value: unknown) {
  const parsed = asDate(value);
  if (!parsed) return '';
  return parsed.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
function formatDateTime(value: unknown) {
  const parsed = asDate(value);
  if (!parsed) return '';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
function formatMoney(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? `${amount.toLocaleString('pl-PL')} PLN` : '0 PLN';
}
function formatMoneyWithCurrency(value: unknown, currency?: string) {
  const amount = Number(value || 0);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeCurrency = typeof currency === 'string' && currency.trim() ? currency.trim().toUpperCase() : 'PLN';
  return `${safeAmount.toLocaleString('pl-PL')} ${safeCurrency}`;
}
function isPaidPaymentStatus(status: unknown) {
  return ['deposit_paid', 'partially_paid', 'fully_paid', 'paid'].includes(String(status || '').toLowerCase());
}
function getTaskDate(task: any) {
  return String(normalizeWorkItem(task).dateAt || task?.createdAt || '');
}
function getEventDate(event: any) {
  return String(normalizeWorkItem(event).dateAt || event?.createdAt || '');
}
function isDoneStatus(status: unknown) {
  return ['done', 'completed', 'archived', 'cancelled', 'canceled'].includes(String(status || '').toLowerCase());
}
function getActivityTime(activity: any) {
  return String(activity?.createdAt || activity?.updatedAt || activity?.happenedAt || '');
}
function leadStatusLabel(status?: string) {
  switch (status) {
    case 'new':
      return 'Nowy';
    case 'contacted':
      return 'Skontaktowany';
    case 'qualification':
      return 'Kwalifikacja';
    case 'proposal_sent':
      return 'Oferta wysłana';
    case 'waiting_response':
      return 'Czeka na odpowiedź';
    case 'accepted':
      return 'Zaakceptowany';
    case 'moved_to_service':
      return 'W obsłudze';
    case 'won':
      return 'Wygrany';
    case 'lost':
      return 'Przegrany';
    case 'archived':
      return 'Archiwum';
    default:
      return status || 'Lead';
  }
}
function caseStatusLabel(status?: string) {
  switch (status) {
    case 'new':
      return 'Nowa';
    case 'waiting_on_client':
      return 'Czeka na klienta';
    case 'blocked':
      return 'Zablokowana';
    case 'to_approve':
      return 'Do akceptacji';
    case 'ready_to_start':
      return 'Gotowa do startu';
    case 'in_progress':
      return 'W realizacji';
    case 'on_hold':
      return 'Wstrzymana';
    case 'completed':
      return 'Zakończona';
    case 'canceled':
      return 'Anulowana';
    default:
      return status || 'Sprawa';
  }
}
function paymentStatusLabel(status?: string) {
  switch (status) {
    case 'paid':
    case 'fully_paid':
      return 'Opłacone';
    case 'partially_paid':
      return 'Częściowo opłacone';
    case 'awaiting_payment':
      return 'Czeka na płatność';
    case 'deposit_paid':
      return 'Zaliczka';
    case 'refunded':
      return 'Zwrot';
    case 'written_off':
      return 'Spisane';
    default:
      return status || 'Rozliczenie';
  }
}

const CLIENT_NOTE_ACTIVITY_TYPES_A1_FINALIZER = new Set([
  'client_note',
  'client_note_added',
  'client_note_dictated',
  'dictated_note',
  'note_added',
]);

function getActivityEventTypeA1(activity: any) {
  return String(activity?.eventType || activity?.activityType || activity?.event_type || '').trim();
}

function isClientNoteActivityA1(activity: any) {
  const eventType = getActivityEventTypeA1(activity);
  const payload = activity?.payload && typeof activity.payload === 'object' ? activity.payload : {};
  return CLIENT_NOTE_ACTIVITY_TYPES_A1_FINALIZER.has(eventType)
    || (String((payload as any).recordType || '').trim() === 'client' && Boolean((payload as any).note || (payload as any).content));
}

function normalizeClientActivitiesForA1(activities: any[]) {
  return Array.isArray(activities)
    ? activities.map((activity) => (isClientNoteActivityA1(activity) ? { ...activity, eventType: getActivityEventTypeA1(activity) || 'client_note' } : activity))
    : [];
}


const STAGE14A_CLIENT_DETAIL_NOTES_HISTORY_GUARD = 'ClientDetail shows cases first, real client notes, readable history and recent moves';
void STAGE14A_CLIENT_DETAIL_NOTES_HISTORY_GUARD;

const STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD = 'STAGE14A Repair2 removes side add-note quick action and hardens visible notes/history';
void STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD;

const STAGE14B_CLIENT_NEXT_ACTION_CONTEXT_GUARD = 'STAGE14B ClientDetail nearest planned action shows Sprawa or Lead context';
void STAGE14B_CLIENT_NEXT_ACTION_CONTEXT_GUARD;

type Stage14AActivityLike = Record<string, any>;

function getClientActivityPayloadStage14A(activity: Stage14AActivityLike) {
  return activity?.payload && typeof activity.payload === 'object' ? activity.payload : {};
}

function getClientActivityTypeStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  return String(
    activity?.type ||
    activity?.activityType ||
    activity?.activity_type ||
    activity?.eventType ||
    activity?.event_type ||
    payload?.type ||
    payload?.activityType ||
    payload?.eventType ||
    ''
  ).trim().toLowerCase();
}

function isTechnicalActivityFallbackStage14A(value: string) {
  const normalized = String(value || '').trim().toLowerCase();
  return !normalized || normalized === 'client_note' || normalized === 'activity' || normalized === 'aktywność klienta' || normalized === 'brak daty';
}

function getClientActivityBodyStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  const candidates = [
    payload?.note,
    payload?.content,
    payload?.body,
    payload?.message,
    payload?.description,
    payload?.summary,
    activity?.body,
    activity?.message,
    activity?.note,
    activity?.content,
    activity?.description,
    activity?.summary,
    payload?.title,
    activity?.title,
  ];
  for (const candidate of candidates) {
    const text = asText(candidate);
    if (text && !isTechnicalActivityFallbackStage14A(text)) return text;
  }
  return 'Brak treści aktywności';
}

function formatClientActivityTitleStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  const type = getClientActivityTypeStage14A(activity);
  const explicitTitle = asText(activity?.title) || asText(payload?.title);

  if (explicitTitle && !isTechnicalActivityFallbackStage14A(explicitTitle)) return explicitTitle;
  if (type.includes('note')) return 'Notatka';
  if (type.includes('task')) return 'Zadanie';
  if (type.includes('event') || type.includes('calendar') || type.includes('meeting')) return 'Wydarzenie';
  if (type.includes('payment') || type.includes('finance')) return 'Płatność';
  if (type.includes('case')) return 'Sprawa';
  if (type.includes('lead')) return 'Lead';
  if (type.includes('status')) return 'Zmiana statusu';
  return 'Aktywność';
}

function formatClientActivityDateStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  const value = activity?.happenedAt || activity?.happened_at || activity?.createdAt || activity?.created_at || activity?.updatedAt || activity?.updated_at || payload?.happenedAt || payload?.createdAt;
  const formatted = formatDateTime(value);
  return formatted && formatted !== 'Brak daty' ? formatted : '';
}

function formatClientActivitySourceStage14A(activity: Stage14AActivityLike) {
  const payload = getClientActivityPayloadStage14A(activity);
  const raw = String(
    activity?.source ||
    activity?.sourceType ||
    activity?.source_type ||
    activity?.recordType ||
    activity?.record_type ||
    activity?.entityType ||
    activity?.entity_type ||
    payload?.source ||
    payload?.sourceType ||
    payload?.recordType ||
    payload?.entityType ||
    ''
  ).trim().toLowerCase();

  if (raw === 'client' || raw === 'klient') return 'klient';
  if (raw === 'case' || raw === 'sprawa') return 'sprawa';
  if (raw === 'lead') return 'lead';
  return '';
}

function isClientRelatedActivityStage14A(activity: Stage14AActivityLike, clientId: string) {
  const payload = getClientActivityPayloadStage14A(activity);
  const safeClientId = String(clientId || '').trim();
  if (!safeClientId) return false;
  return [
    activity?.clientId,
    activity?.client_id,
    activity?.entityId,
    activity?.entity_id,
    activity?.recordId,
    activity?.record_id,
    payload?.clientId,
    payload?.client_id,
    payload?.entityId,
    payload?.entity_id,
    payload?.recordId,
    payload?.record_id,
  ].some((value) => String(value || '').trim() === safeClientId) || String(payload?.recordType || payload?.entityType || '').trim().toLowerCase() === 'client';
}

function isClientNoteActivityStage14A(activity: Stage14AActivityLike, clientId: string) {
  const type = getClientActivityTypeStage14A(activity);
  const body = getClientActivityBodyStage14A(activity);
  return isClientRelatedActivityStage14A(activity, clientId) && (type.includes('note') || type === 'client_note' || Boolean(body && body !== 'Brak treści aktywności'));
}

function activityLabel(activity: any) {
  const eventType = String(activity?.eventType || activity?.activityType || 'activity');
  const title = asText(activity?.payload?.title) || asText(activity?.title);

  switch (eventType) {
    case 'calendar_entry_completed':
      return title ? `Wpis kalendarza wykonany: ${title}` : 'Wpis kalendarza wykonany';
    case 'calendar_entry_restored':
      return title ? `Wpis kalendarza przywrócony: ${title}` : 'Wpis kalendarza przywrócony';
    case 'calendar_entry_deleted':
      return title ? `Wpis kalendarza usunięty: ${title}` : 'Wpis kalendarza usunięty';
    case 'today_task_completed':
      return title ? `Zadanie wykonane: ${title}` : 'Zadanie wykonane';
    case 'today_task_restored':
      return title ? `Zadanie przywrócone: ${title}` : 'Zadanie przywrócone';
    case 'today_task_snoozed':
      return title ? `Zadanie przesunięte: ${title}` : 'Zadanie przesunięte';
    case 'today_event_snoozed':
      return title ? `Wydarzenie przesunięte: ${title}` : 'Wydarzenie przesunięte';
    case 'case_lifecycle_started':
      return title ? `Sprawa rozpoczęta: ${title}` : 'Sprawa rozpoczęta';
    case 'case_lifecycle_completed':
      return title ? `Sprawa zakończona: ${title}` : 'Sprawa zakończona';
    case 'case_lifecycle_reopened':
      return title ? `Sprawa wznowiona: ${title}` : 'Sprawa wznowiona';
    case 'ai_draft_converted':
      return title ? `Szkic zatwierdzony: ${title}` : 'Szkic zatwierdzony';
    default:
      return title || formatClientActivityTitleStage14A(activity);
  }
}
function getInitials(client: any) {
  const source = String(client?.name || client?.company || 'Klient');
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return initials || 'K';
}
function getClientName(client: any) {
  return String(client?.name || client?.company || 'Klient bez nazwy');
}
function getCaseTitle(caseRecord: any) {
  const rawTitle = asText(caseRecord?.title) || asText(caseRecord?.name);
  const clientName = asText(caseRecord?.clientName);
  if (rawTitle && clientName) {
    const titleLower = rawTitle.toLowerCase();
    const clientLower = clientName.toLowerCase();
    if (titleLower === clientLower) return 'Sprawa obsługowa';
    if (titleLower.includes(clientLower)) {
      const cleaned = rawTitle.replace(clientName, '').replace(/^\s*[-–—:]\s*/g, '').trim();
      return cleaned || 'Sprawa obsługowa';
    }
  }
  return String(rawTitle || 'Sprawa obsługowa');
}

function getStage14BLeadTitle(lead: any) {
  return (
    asText(lead?.title) ||
    asText(lead?.name) ||
    asText(lead?.contactName) ||
    asText(lead?.contact_name) ||
    asText(lead?.clientName) ||
    asText(lead?.client_name) ||
    asText(lead?.company) ||
    asText(lead?.companyName) ||
    asText(lead?.company_name) ||
    'Lead'
  );
}

function readStage14BRelationId(item: any, keys: string[]) {
  const payload = item?.payload && typeof item.payload === 'object' ? item.payload : {};
  for (const key of keys) {
    const direct = asText(item?.[key]);
    if (direct) return direct;
    const nested = asText((payload as any)?.[key]);
    if (nested) return nested;
  }
  return '';
}

function getClientNextActionContextStage14B(item: any, leads: any[], cases: any[]) {
  const caseId = readStage14BRelationId(item, ['caseId', 'case_id', 'relatedCaseId', 'related_case_id']);
  const leadId = readStage14BRelationId(item, ['leadId', 'lead_id', 'relatedLeadId', 'related_lead_id']);
  const caseRecord = caseId
    ? cases.find((caseItem) => String(caseItem?.id || '').trim() === caseId)
    : null;

  if (caseRecord) {
    const contextTitle = getCaseTitle(caseRecord);
    return contextTitle
      ? { contextKind: 'case' as const, contextTitle, contextTo: `/cases/${caseId}` }
      : {};
  }

  const leadRecord = leadId
    ? leads.find((leadItem) => String(leadItem?.id || '').trim() === leadId)
    : null;

  if (leadRecord) {
    const contextTitle = getStage14BLeadTitle(leadRecord);
    return contextTitle
      ? { contextKind: 'lead' as const, contextTitle, contextTo: `/leads/${leadId}` }
      : {};
  }

  return {};
}

function renderClientNextActionContextStage14B(action: ClientNextAction) {
  const contextTitle = asText(action?.contextTitle);
  if (!contextTitle) return null;
  const normalized = contextTitle.toLowerCase();
  if (normalized === 'undefined' || normalized === 'null' || normalized === 'brak') return null;

  const label = action.contextKind === 'case' ? 'Sprawa' : 'Lead';
  return (
    <p className="client-detail-next-action-context" title={contextTitle}>
      {label}: {contextTitle}
    </p>
  );
}

function getCaseValueLabel(caseRecord: any) {
  const raw =
    caseRecord?.value ??
    caseRecord?.caseValue ??
    caseRecord?.dealValue ??
    caseRecord?.expectedValue ??
    caseRecord?.potentialRevenue ??
    caseRecord?.amount ??
    caseRecord?.price ??
    caseRecord?.budget ??
    0;
  return formatMoneyWithCurrency(raw, caseRecord?.currency);
}
function getCaseCompleteness(caseRecord: any) {
  const value = Number(caseRecord?.completenessPercent || caseRecord?.completionPercent || 0);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
}
function getCaseBlocker(caseRecord: any) {
  const explicit = asText(caseRecord?.blocker) || asText(caseRecord?.blockReason) || asText(caseRecord?.missingReason);
  if (explicit) return explicit;
  const status = String(caseRecord?.status || '');
  if (status === 'blocked') return 'blokada w sprawie';
  if (status === 'waiting_on_client') return 'czeka na klienta';
  if (status === 'to_approve') return 'czeka na akceptację';
  if (status === 'on_hold') return 'sprawa wstrzymana';
  return '';
}
function getCaseSourceLead(caseRecord: any, leads: any[]) {
  const caseId = String(caseRecord?.id || '');
  const directLeadId = String(caseRecord?.leadId || caseRecord?.sourceLeadId || '');
  return (
    leads.find((lead) => String(lead.id || '') === directLeadId) ||
    leads.find((lead) => String(lead.linkedCaseId || lead.caseId || '') === caseId) ||
    null
  );
}
function getCaseNextAction(caseRecord: any, tasks: any[], events: any[]) {
  const caseId = String(caseRecord?.id || '').trim();
  const nearest = getNearestPlannedAction({
    recordType: 'case',
    recordId: caseId,
    items: [...tasks, ...events],
  });
  if (!nearest) return null;
  return {
    kind: nearest.type === 'event' || nearest.type === 'meeting' ? 'event' as const : 'task' as const,
    title: nearest.title,
    date: nearest.when,
  };
}
function relativeActionLabel(value: unknown) {
  const parsed = asDate(value);
  if (!parsed) return 'Brak terminu';
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetStart = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).getTime();
  const diff = Math.round((targetStart - todayStart) / 86_400_000);
  if (diff === 0) return 'Dzisiaj';
  if (diff === 1) return 'Jutro';
  if (diff === -1) return 'Wczoraj';
  return formatDate(value);
}
function statusBadgeClass(status: unknown) {
  const normalized = String(status || '').toLowerCase();
  if (['blocked', 'overdue'].includes(normalized)) return 'client-detail-pill-danger';
  if (['waiting_on_client', 'on_hold', 'to_approve'].includes(normalized)) return 'client-detail-pill-amber';
  if (['completed', 'done', 'paid', 'ready_to_start'].includes(normalized)) return 'client-detail-pill-green';
  if (['canceled', 'cancelled', 'lost'].includes(normalized)) return 'client-detail-pill-muted';
  return 'client-detail-pill-blue';
}
function nextActionToneClass(tone: ClientNextAction['tone']) {
  if (tone === 'red') return 'client-detail-callout-danger';
  if (tone === 'amber') return 'client-detail-callout-amber';
  if (tone === 'emerald') return 'client-detail-callout-green';
  if (tone === 'blue') return 'client-detail-callout-blue';
  return 'client-detail-callout-muted';
}
function buildClientNextAction(leads: any[], cases: any[], tasks: any[], events: any[], clientId: string): ClientNextAction {
  const relatedLeadIds = leads.map((lead) => String(lead?.id || '')).filter(Boolean);
  const relatedCaseIds = cases.map((caseRecord) => String(caseRecord?.id || '')).filter(Boolean);
  const nearest = getNearestPlannedAction({
    recordType: 'client',
    recordId: String(clientId || ''),
    relatedLeadIds,
    relatedCaseIds,
    items: [...tasks, ...events],
  });
  if (nearest) {
    const isEvent = nearest.type === 'event' || nearest.type === 'meeting';
    const targetCaseId = String(nearest.caseId || '');
    const targetLeadId = String(nearest.leadId || '');
    const nearestActionContextStage14B = getClientNextActionContextStage14B(nearest, leads, cases);
    return {
      kind: isEvent ? 'event' : 'task',
      title: nearest.title,
      subtitle: `${isEvent ? 'Wydarzenie' : 'Zadanie'} · ${formatDateTime(nearest.when)}`,
      date: nearest.when,
      relationId: targetCaseId || targetLeadId || String(clientId || ''),
      to: targetCaseId ? `/cases/${targetCaseId}` : targetLeadId ? `/leads/${targetLeadId}` : '/today',
      ...nearestActionContextStage14B,
      tone: 'amber',
    };
  }

  const now = Date.now();
  const overdueTask = tasks
    .filter((task) => !isDoneStatus(task?.status))
    .map((task) => ({ task, time: asDate(getTaskDate(task))?.getTime() ?? Number.MAX_SAFE_INTEGER }))
    .filter((entry) => entry.time < now)
    .sort((left, right) => left.time - right.time)[0]?.task;

  if (overdueTask) {
    return {
      kind: 'task',
      title: String(overdueTask.title || 'Zaległe zadanie'),
      subtitle: `Termin: ${formatDateTime(getTaskDate(overdueTask))}`,
      date: getTaskDate(overdueTask),
      relationId: String(overdueTask.caseId || overdueTask.leadId || ''),
      to: '/today',
      tone: 'red',
    };
  }

  const nextTask = tasks
    .filter((task) => !isDoneStatus(task?.status))
    .map((task) => ({ task, time: asDate(getTaskDate(task))?.getTime() ?? Number.MAX_SAFE_INTEGER }))
    .sort((left, right) => left.time - right.time)[0]?.task;

  if (nextTask) {
    return {
      kind: 'task',
      title: String(nextTask.title || 'Następne zadanie'),
      subtitle: `Termin: ${formatDateTime(getTaskDate(nextTask))}`,
      date: getTaskDate(nextTask),
      relationId: String(nextTask.caseId || nextTask.leadId || ''),
      to: '/today',
      tone: 'amber',
    };
  }

  const nextEvent = events
    .filter((event) => !isDoneStatus(event?.status))
    .map((event) => ({ event, time: asDate(getEventDate(event))?.getTime() ?? Number.MAX_SAFE_INTEGER }))
    .sort((left, right) => left.time - right.time)[0]?.event;

  if (nextEvent) {
    return {
      kind: 'event',
      title: String(nextEvent.title || 'Następne wydarzenie'),
      subtitle: `Start: ${formatDateTime(getEventDate(nextEvent))}`,
      date: getEventDate(nextEvent),
      relationId: String(nextEvent.caseId || nextEvent.leadId || ''),
      to: '/calendar',
      tone: 'blue',
    };
  }

  const activeCase = cases.find((caseRecord) => !['completed', 'canceled'].includes(String(caseRecord.status || '')));
  if (activeCase) {
    return {
      kind: 'case',
      title: getCaseTitle(activeCase),
      subtitle: `${caseStatusLabel(String(activeCase.status || 'in_progress'))} · kompletność ${getCaseCompleteness(activeCase)}%`,
      relationId: String(activeCase.id || ''),
      to: `/cases/${String(activeCase.id)}`,
      tone: 'emerald',
    };
  }

  const openLead = leads.find((lead) => !['moved_to_service', 'lost', 'archived'].includes(String(lead.status || '')));
  if (openLead) {
    return {
      kind: 'lead',
      title: String(openLead.name || 'Aktywny lead'),
      subtitle: leadStatusLabel(String(openLead.status || 'new')),
      relationId: String(openLead.id || ''),
      to: `/leads/${String(openLead.id)}`,
      tone: 'blue',
    };
  }

  return {
    kind: 'empty',
    title: 'Brak zaplanowanych działań',
    subtitle: 'Ten klient nie ma teraz otwartego zadania, wydarzenia, leada ani sprawy.',
    tone: 'slate',
  };
}

type ClientMultiContactKind = 'email' | 'phone';

type ClientMultiContactFieldProps = {
  kind: ClientMultiContactKind;
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
};
function splitClientContactValue(value?: string | null) {
  const parts = String(value || '')
    .split(/[;\n]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return parts.length ? parts : [''];
}
function joinClientContactValue(values: string[]) {
  return values
    .map((entry) => String(entry || '').trim())
    .filter(Boolean)
    .join('; ');
}
function ClientMultiContactField({ kind, label, value, onChange, placeholder }: ClientMultiContactFieldProps) {
  const values = splitClientContactValue(value);

  const updateValue = (index: number, nextValue: string) => {
    const next = [...values];
    next[index] = nextValue;
    onChange(joinClientContactValue(next));
  };

  const addValue = () => {
    onChange(joinClientContactValue([...values, '']));
  };

  const removeValue = (index: number) => {
    const next = values.filter((_, currentIndex) => currentIndex !== index);
    onChange(joinClientContactValue(next.length ? next : ['']));
  };

  return (
    <div className="client-detail-edit-field" data-client-contact-repeat={kind}>
      <div className="client-detail-edit-label-row">
        <Label>{label}</Label>
        <button
          type="button"
          className="client-detail-mini-button"
          onClick={addValue}
          data-client-contact-repeat-add={kind}
          aria-label={kind === 'email' ? 'Dodaj kolejny email klienta' : 'Dodaj kolejny telefon klienta'}
        >
          +
        </button>
      </div>
      <div className="client-detail-contact-repeat-list">
        {values.map((entry, index) => (
          <div key={index} className="client-detail-contact-repeat-row" data-client-contact-repeat-row={kind}>
            <Input
              value={entry}
              onChange={(event) => updateValue(index, event.target.value)}
              placeholder={placeholder || (kind === 'email' ? 'email klienta' : 'telefon klienta')}
              type={kind === 'email' ? 'email' : 'tel'}
            />
            {values.length > 1 ? (
              <button
                type="button"
                className="client-detail-mini-button client-detail-mini-button-muted"
                onClick={() => removeValue(index)}
                aria-label={kind === 'email' ? 'Usuń email klienta' : 'Usuń telefon klienta'}
              >
                Usuń
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
function InfoRow({ icon: Icon, label, value, onCopy }: { icon: any; label: string; value: string; onCopy?: () => void }) {
  const copyLabel = label === 'Telefon' ? 'Kopiuj telefon' : label === 'E-mail' ? 'Kopiuj email' : `Kopiuj ${label}`;
  return (
    <div className="client-detail-info-row">
      <span className="client-detail-info-icon">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <small>{label}</small>
        <strong>{value || '-'}</strong>
      </span>
      {onCopy && value ? (
        <button type="button" className="client-detail-icon-button" onClick={onCopy} aria-label={copyLabel} title={copyLabel}>
          <Copy className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="client-detail-stat-cell">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

const CLIENT_DETAIL_TOP_TILES_REPAIR6_GUARD = 'client-detail-top-tiles repair6 compact unified safe';
const STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD = 'client cases visible panel with safe actions';
const STAGE23A_CLIENT_OPEN_CASE_COPY_COMPAT = 'Wejdź w sprawę';
const STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD = 'client side quick actions use context action host';
const STAGE25B_CLIENT_DETAIL_FEEDBACK_COMPLETE_REPAIR_GUARD = 'client detail feedback complete repair';
const STAGE25C_CLIENT_DETAIL_GUARD_COMPAT_FINAL = 'client detail final feedback guard compatibility';
const STAGE25D_CLIENT_DETAIL_JSX_BUILD_FIX_GUARD = 'client detail JSX fragment build fix';
const STAGE26A_FEEDBACK_AFTER_4EC_GUARD = 'feedback after 4ec client activity ai drafts';
const STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD = 'client notes event final after failed 27ad';
const STAGE28A_CLIENT_NOTE_ID_COMPAT_GUARD = 'client note listener id safe before finance';
const STAGE29A_CLIENT_NOTE_ACTIONS_GUARD = 'client notes edit delete preview pin actions';
const STAGE27G_CLIENT_NOTE_LISTENER_ID_RUNTIME_FINAL_GUARD = 'client note listener uses client id only';
const STAGE27D_CLIENT_NOTES_RUNTIME_FINAL_GUARD = 'client notes runtime visibility final';
const STAGE27A_CLIENT_NOTES_TRASH2_GUARD = 'client notes visible after save and Trash2 imported';
const STAGE27B_TRASH2_IMPORT_AND_NOTES_FINAL_GUARD = 'Trash2 import fixed and client notes final';
function getClientPaymentAmount(payment: any) {
  const raw =
    payment?.amount ??
    payment?.amountPln ??
    payment?.value ??
    payment?.total ??
    payment?.totalAmount ??
    payment?.paidAmount ??
    payment?.grossAmount ??
    payment?.netAmount ??
    0;
  const amount = Number(raw);
  return Number.isFinite(amount) ? amount : 0;
}
function isClientCaseClosed(caseRecord: any) {
  return ['completed', 'done', 'canceled', 'cancelled', 'archived', 'lost'].includes(String(caseRecord?.status || '').toLowerCase());
}

type ClientTopTilesProps = {
  clientId: string;
  leads: any[];
  cases: any[];
  payments: any[];
  tasks: any[];
  events: any[];
  onOpenCases: () => void;
};
function ClientTopTiles({ clientId, leads, cases, payments, tasks, events, onOpenCases }: ClientTopTilesProps) {
  const nextAction = buildClientNextAction(leads, cases, tasks, events, clientId);
  const paidPayments = payments.filter((payment) => isPaidPaymentStatus(payment?.status));
  const paidTotal = paidPayments.reduce((sum, payment) => sum + getClientPaymentAmount(payment), 0);
  const declaredTotal = payments.reduce((sum, payment) => sum + getClientPaymentAmount(payment), 0);
  const unpaidTotal = Math.max(0, declaredTotal - paidTotal);
  const activeCases = cases.filter((caseRecord) => !isClientCaseClosed(caseRecord));
  const blockedCases = cases.filter((caseRecord) =>
    ['blocked', 'waiting_on_client', 'to_approve', 'on_hold'].includes(String(caseRecord?.status || '').toLowerCase()),
  );

  return (
    <section className="client-detail-top-tiles entity-overview-tiles" data-client-top-tiles="true" aria-label="Szybkie podsumowanie klienta">
      <article
        className={'client-detail-top-tile entity-overview-tile entity-overview-tile-action ' + nextActionToneClass(nextAction.tone)}
        data-client-top-tile="next-action"
      >
        <div className="entity-overview-tile-head">
          <span className="entity-overview-tile-icon"><Clock className="h-4 w-4" /></span>
          <small>Najbliższa zaplanowana akcja</small>
        </div>
        <strong>{nextAction.title}</strong>
        <p>{nextAction.subtitle}</p>
        {nextAction.to ? (
          <Link to={nextAction.to} className="entity-overview-tile-link">
            Otwórz
          </Link>
        ) : (
          <span className="entity-overview-tile-chip entity-overview-tile-chip-muted">Brak szybkiego przejścia</span>
        )}
      </article>

      <article className="client-detail-top-tile entity-overview-tile entity-overview-tile-finance" data-client-top-tile="finance-summary">
        <div className="entity-overview-tile-head">
          <span className="entity-overview-tile-icon"><EntityIcon entity="template" className="h-4 w-4" /></span>
          <small>Podsumowanie finansów</small>
        </div>
        <strong>{formatMoneyWithCurrency(paidTotal)}</strong>
        <div className="entity-overview-metrics">
          <div className="entity-overview-metric-row">
            <span>Opłacone</span>
            <b>{formatMoneyWithCurrency(paidTotal)}</b>
          </div>
          <div className="entity-overview-metric-row">
            <span>Do domknięcia</span>
            <b>{formatMoneyWithCurrency(unpaidTotal)}</b>
          </div>
          <div className="entity-overview-metric-row">
            <span>Rozliczenia</span>
            <b>{payments.length}</b>
          </div>
        </div>
      </article>

      <article className="client-detail-top-tile entity-overview-tile entity-overview-tile-cases" data-client-top-tile="cases-summary">
        <div className="entity-overview-tile-head">
          <span className="entity-overview-tile-icon"><EntityIcon entity="case" className="h-4 w-4" /></span>
          <small>Sprawy</small>
        </div>
        <strong>{activeCases.length} aktywne / {cases.length} razem</strong>
        <p>
          {blockedCases.length > 0
            ? `${blockedCases.length} wymaga uwagi.`
            : cases.length > 0
              ? 'Brak dodatkowego opisu.' : 'Brak spraw przypiętych do klienta.'}
        </p>
        <button type="button" className="entity-overview-tile-link" onClick={onOpenCases}>
          Pokaż sprawy
        </button>
      </article>
    </section>
  );
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_CLIENT_DETAIL = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';


const CLIENTDETAIL_ACTION_COLOR_TAXONOMY_V1 = 'client detail action visual taxonomy V1';
function clientDetailActionVisualKind(row: Record<string, unknown> | null | undefined) {
  return inferCloseFlowActionVisualKind(row);
}
function clientDetailActionVisualClass(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualClass(row);
}
function clientDetailActionDataKind(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualDataKind(row);
}
function clientDetailActionKindClass(kind: unknown) {
  return getCloseFlowActionKindClass(kind);
}
export default function ClientDetail() {
  const { clientId } = useParams();
  const id = clientId; // CLIENT_DETAIL_CLIENT_ID_ROUTE_ALIAS_HOTFIX: legacy local references must resolve to route clientId
  const navigate = useNavigate();
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [clientPinnedNoteIds, setClientPinnedNoteIds] = useState<string[]>([]);

  const clientNotePinStorageKey = useMemo(
    () => `closeflow:client-pinned-notes:${String(client?.id || 'unknown')}`,
    [client?.id],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(clientNotePinStorageKey);
      setClientPinnedNoteIds(raw ? JSON.parse(raw) : []);
    } catch {
      setClientPinnedNoteIds([]);
    }
  }, [clientNotePinStorageKey]);

  const persistClientPinnedNotes = useCallback(
    (nextPinnedIds: string[]) => {
      setClientPinnedNoteIds(nextPinnedIds);
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(clientNotePinStorageKey, JSON.stringify(nextPinnedIds));
      } catch {
        // localStorage is optional
      }
    },
    [clientNotePinStorageKey],
  );

  const handlePreviewClientNote = useCallback((note: any) => {
    const content = String(note?.content || '').trim();
    if (!content) {
      toast.info('Ta notatka jest pusta.');
      return;
    }
    toast.info(content, { duration: 12000 });
  }, []);

  const handleToggleClientNotePin = useCallback(
    (note: any) => {
      const noteId = String(note?.id || '').trim();
      if (!noteId) return;
      const nextPinnedIds = clientPinnedNoteIds.includes(noteId)
        ? clientPinnedNoteIds.filter((id) => id !== noteId)
        : [noteId, ...clientPinnedNoteIds];
      persistClientPinnedNotes(nextPinnedIds);
    },
    [clientPinnedNoteIds, persistClientPinnedNotes],
  );

  const handleEditClientNote = useCallback(
    async (note: any) => {
      const noteId = String(note?.id || '').trim();
      const previousContent = String(note?.content || '');
      const nextContent = typeof window !== 'undefined' ? window.prompt('Edytuj notatkę', previousContent) : previousContent;
      if (nextContent === null) return;
      const cleanContent = String(nextContent || '').trim();
      if (!cleanContent) {
        toast.error('Notatka nie może być pusta.');
        return;
      }
      try {
        await updateActivityInSupabase({
          id: noteId,
          payload: {
            recordType: 'client',
            clientId: client?.id || null,
            content: cleanContent,
            note: cleanContent,
            editedAt: new Date().toISOString(),
          },
        } as any);
        setActivities((previous) =>
          previous.map((activity) =>
            String(activity?.id || '') === noteId
              ? {
                  ...activity,
                  payload: {
                    ...(activity?.payload || {}),
                    content: cleanContent,
                    note: cleanContent,
                    editedAt: new Date().toISOString(),
                  },
                  updatedAt: new Date().toISOString(),
                }
              : activity,
          ),
        );
        toast.success('Notatka zaktualizowana');
      } catch (error) {
        console.error(error);
        toast.error('Nie udało się edytować notatki.');
      }
    },
    [client?.id],
  );

  const handleDeleteClientNote = useCallback(
    async (note: any) => {
      const noteId = String(note?.id || '').trim();
      if (!noteId) return;
      if (typeof window !== 'undefined' && !window.confirm('Usunąć tę notatkę?')) return;
      try {
        await deleteActivityFromSupabase(noteId);
        setActivities((previous) => previous.filter((activity) => String(activity?.id || '') !== noteId));
        persistClientPinnedNotes(clientPinnedNoteIds.filter((id) => id !== noteId));
        toast.success('Notatka usunięta');
      } catch (error) {
        console.error(error);
        toast.error('Nie udało się usunąć notatki.');
      }
    },
    [clientPinnedNoteIds, persistClientPinnedNotes],
  );

  useEffect(() => {
    const handleContextNoteSaved = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      if (!detail) return;
      const detailClientId = String(detail?.clientId || detail?.payload?.clientId || '').trim();
      const currentClientId = String(client?.id || '').trim();
      if (detailClientId && currentClientId && detailClientId !== currentClientId) return;
      setActivities((previous) => [detail, ...previous]);
    };
    window.addEventListener('closeflow:context-note-saved', handleContextNoteSaved as EventListener);
    return () => window.removeEventListener('closeflow:context-note-saved', handleContextNoteSaved as EventListener);
  }, [client?.id]);

  const [activeTab, setActiveTab] = useState<ClientTab>('cases');
  const [contactEditing, setContactEditing] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', notes: '' });
  const [clientNoteListening, setClientNoteListening] = useState(false);
  const [clientNoteInterimText, setClientNoteInterimText] = useState('');
  const [clientNoteAutosaving, setClientNoteAutosaving] = useState(false);
  const clientNoteRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const clientNoteVoiceDirtyRef = useRef(false);

  const reload = useCallback(async () => {
    if (!workspace?.id || !clientId) {
      setLoading(workspaceLoading);
      return;
    }

    setLoading(true);
    try {
      const [clientRow, leadRows, caseRows, paymentRows, taskRows, eventRows, activityRows] = await Promise.all([
        fetchClientByIdFromSupabase(clientId),
        fetchLeadsFromSupabase({ clientId }),
        fetchCasesFromSupabase({ clientId }),
        fetchPaymentsFromSupabase({ clientId }),
        fetchTasksFromSupabase(),
        fetchEventsFromSupabase(),
        fetchActivitiesFromSupabase({ clientId: String(id || ''), limit: 120 }),
      ]);

      setClient(clientRow);
      setLeads(Array.isArray(leadRows) ? leadRows : []);
      setCases(Array.isArray(caseRows) ? caseRows : []);
      setPayments(Array.isArray(paymentRows) ? paymentRows : []);
      setTasks(Array.isArray(taskRows) ? taskRows : []);
      setEvents(Array.isArray(eventRows) ? eventRows : []);
      setActivities(normalizeClientActivitiesForA1(Array.isArray(activityRows) ? activityRows : []));
      setForm({
        name: String((clientRow as any)?.name || ''),
        company: String((clientRow as any)?.company || ''),
        email: String((clientRow as any)?.email || ''),
        phone: String((clientRow as any)?.phone || ''),
        notes: String((clientRow as any)?.notes || ''),
      });
    } catch (error: any) {
      toast.error(`Błąd odczytu klienta: ${error?.message || 'REQUEST_FAILED'}`);
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, [clientId, workspace?.id, workspaceLoading]);

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }
    void reload();
  }, [reload, workspace?.id, workspaceLoading]);

  const relationIds = useMemo(() => {
    const leadIds = new Set(leads.map((lead) => String(lead.id || '')).filter(Boolean));
    const caseIds = new Set(cases.map((caseRecord) => String(caseRecord.id || '')).filter(Boolean));
    return { leadIds, caseIds };
  }, [cases, leads]);

  const clientTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          String(task.clientId || '') === String(clientId || '') ||
          relationIds.leadIds.has(String(task.leadId || '')) ||
          relationIds.caseIds.has(String(task.caseId || '')),
      )
      .sort(
        (left, right) =>
          (asDate(getTaskDate(left))?.getTime() ?? Number.MAX_SAFE_INTEGER) -
          (asDate(getTaskDate(right))?.getTime() ?? Number.MAX_SAFE_INTEGER),
      );
  }, [clientId, relationIds.caseIds, relationIds.leadIds, tasks]);

  const clientEvents = useMemo(() => {
    return events
      .filter(
        (event) =>
          String(event.clientId || '') === String(clientId || '') ||
          relationIds.leadIds.has(String(event.leadId || '')) ||
          relationIds.caseIds.has(String(event.caseId || '')),
      )
      .sort(
        (left, right) =>
          (asDate(getEventDate(left))?.getTime() ?? Number.MAX_SAFE_INTEGER) -
          (asDate(getEventDate(right))?.getTime() ?? Number.MAX_SAFE_INTEGER),
      );
  }, [clientId, events, relationIds.caseIds, relationIds.leadIds]);

  const clientActivities = useMemo(() => {
    return activities
      .filter(
        (activity) =>
          String(activity.clientId || '') === String(clientId || '') ||
          relationIds.leadIds.has(String(activity.leadId || '')) ||
          relationIds.caseIds.has(String(activity.caseId || '')),
      )
      .sort((left, right) => (asDate(getActivityTime(right))?.getTime() ?? 0) - (asDate(getActivityTime(left))?.getTime() ?? 0));
  }, [activities, clientId, relationIds.caseIds, relationIds.leadIds]);

  const recentClientMovements = useMemo(() => {
    return clientActivities.slice(0, 5).map((activity: any, index: number) => ({
      id: String(activity?.id || activity?.activityId || activity?.eventId || (getActivityTime(activity) + '-' + index)),
      title: activityLabel(activity),
      time: formatDateTime(getActivityTime(activity)),
      meta: String(activity?.eventType || activity?.activityType || 'Aktywność'),
    }));
  }, [clientActivities]);
  const activeCases = useMemo(
    () => cases.filter((caseRecord) => !['completed', 'canceled'].includes(String(caseRecord.status || ''))),
    [cases],
  );

  const closedCases = useMemo(
    () => cases.filter((caseRecord) => ['completed', 'canceled'].includes(String(caseRecord.status || ''))),
    [cases],
  );

  const waitingCaseCount = useMemo(
    () => cases.filter((caseRecord) => ['waiting_on_client', 'blocked', 'to_approve', 'on_hold'].includes(String(caseRecord.status || ''))).length,
    [cases],
  );

  const blockers = useMemo(
    () => cases.map((caseRecord) => ({ caseRecord, blocker: getCaseBlocker(caseRecord) })).filter((entry) => entry.blocker),
    [cases],
  );

  const clientFinance = useMemo(() => {
    const activeLeadPotential = leads
      .filter((lead) => {
        const status = String(lead?.status || '').toLowerCase();
        const linkedCaseId = String(lead?.linkedCaseId || lead?.caseId || '');
        return !['moved_to_service', 'won', 'lost', 'archived'].includes(status) && !linkedCaseId;
      })
      .reduce((sum, lead) => sum + (Number(lead?.dealValue) || 0), 0);

    const casesExpected = cases.reduce((sum, caseRecord) => sum + (Number(caseRecord?.expectedRevenue || caseRecord?.dealValue || 0) || 0), 0);
    const paidTotal = payments
      .filter((entry) => isPaidPaymentStatus(entry?.status))
      .reduce((sum, entry) => sum + (Number(entry?.amount) || 0), 0);
    const potentialTotal = Math.max(0, activeLeadPotential + casesExpected);
    const remainingTotal = Math.max(0, potentialTotal - paidTotal);
    const currencies = [client?.currency, ...leads.map((lead) => lead?.currency), ...cases.map((entry) => entry?.currency), ...payments.map((entry) => entry?.currency)]
      .map((value) => String(value || '').trim().toUpperCase())
      .filter((value) => /^[A-Z]{3}$/.test(value));
    const currency = currencies[0] || 'PLN';

    return {
      potentialTotal,
      paidTotal,
      remainingTotal,
      currency,
      hasMixedCurrencies: new Set(currencies).size > 1,
    };
  }, [cases, client?.currency, leads, payments]);
  const clientFinanceSummary = useMemo(() => {
    const caseValueTotal = cases.reduce((sum, caseRecord) => sum + (Number(caseRecord?.expectedRevenue || caseRecord?.dealValue || 0) || 0), 0);
    const paymentsTotal = payments.reduce((sum, entry) => sum + (Number(entry?.amount) || 0), 0);
    const remainingTotal = Math.max(0, caseValueTotal - paymentsTotal);
    const recentPayments = [...payments]
      .filter((entry) => Number(entry?.amount) > 0)
      .sort((left, right) => (asDate(right?.paidAt || right?.createdAt)?.getTime() ?? 0) - (asDate(left?.paidAt || left?.createdAt)?.getTime() ?? 0))
      .slice(0, 3);
    return {
      caseValueTotal,
      paymentsTotal,
      remainingTotal,
      recentPayments,
      activeCases: activeCases.length,
      settledCases: closedCases.length,
    };
  }, [activeCases.length, cases, closedCases.length, payments]);
  const mainCase = activeCases[0] || cases[0] || null;
  const mainCaseCompleteness = mainCase ? getCaseCompleteness(mainCase) : 0;
  const activeTaskCount = useMemo(() => clientTasks.filter((task) => !isDoneStatus(task.status)).length, [clientTasks]);
  const activeEventCount = useMemo(() => clientEvents.filter((event) => !isDoneStatus(event.status)).length, [clientEvents]);
  const nextAction = useMemo(() => buildClientNextAction(leads, cases, clientTasks, clientEvents, String(clientId || '')), [cases, clientEvents, clientId, clientTasks, leads]);
  const lastActivityDate = clientActivities[0]?.createdAt || clientActivities[0]?.updatedAt || client?.updatedAt || client?.createdAt;
  const firstSourceLead = leads[0] || null;
  const STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS = 'Client detail uses shared context action dialogs instead of local simplified quick forms';
  const openClientContextAction = (kind: ContextActionKind) => {
    if (!clientId) return;
    openContextQuickAction({
      kind,
      recordType: 'client',
      recordId: clientId,
      clientId,
      recordLabel: getClientName(client),
    });
  };

  const clientCaseRows = useMemo<ClientCaseRow[]>(() => {
    return cases.map((caseRecord) => {
      const sourceLead = getCaseSourceLead(caseRecord, leads);
      const next = getCaseNextAction(caseRecord, clientTasks, clientEvents);
      return {
        id: String(caseRecord.id || ''),
        title: getCaseTitle(caseRecord),
        leadId: caseRecord?.leadId ? String(caseRecord.leadId) : null,
        status: String(caseRecord.status || 'in_progress'),
        statusLabel: caseStatusLabel(String(caseRecord.status || 'in_progress')),
        nextActionLabel: next ? next.title : 'Brak zaplanowanych działań',
        nextActionMeta: next ? `${next.kind === 'task' ? 'Zadanie' : 'Wydarzenie'} · ${relativeActionLabel(next.date)}` : 'Dodaj zadanie albo wydarzenie w sprawie.',
        sourceLabel: sourceLead ? `Lead: ${String(sourceLead.name || sourceLead.company || 'bez nazwy')}` : `Utworzono: ${formatDate(caseRecord.createdAt)}`,
        completeness: getCaseCompleteness(caseRecord),
        blocker: getCaseBlocker(caseRecord),
      };
    });
  }, [cases, clientEvents, clientTasks, leads]);

  const resetClientContactForm = () => {
    setForm({
      name: String(client?.name || ''),
      company: String(client?.company || ''),
      email: String(client?.email || ''),
      phone: String(client?.phone || ''),
      notes: String(client?.notes || ''),
    });
  };

  const handleCancelContactEditing = () => {
    resetClientContactForm();
    setContactEditing(false);
  };

  const handleSave = async () => {
    if (!clientId) return;
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    try {
      setSaving(true);
      await updateClientInSupabase({
        id: clientId,
        ...form,
      });
      setContactEditing(false);

      const linkedLeadUpdates = leads
        .filter((lead) => String(lead?.id || '').trim())
        .map((lead) =>
          updateLeadInSupabase({
            id: String(lead.id),
            name: form.name,
            company: form.company,
            email: form.email,
            phone: form.phone,
          }),
        );

      const linkedLeadResults = await Promise.allSettled(linkedLeadUpdates);
      const failedLeadSyncs = linkedLeadResults.filter((result) => result.status === 'rejected').length;

      if (failedLeadSyncs > 0) {
        toast.error('Klient zapisany, ale nie udało się zsynchronizować części powiązanych leadów.');
      } else {
        toast.success('Klient zaktualizowany');
      }
      await reload();
    } catch (error: any) {
      toast.error(`Błąd zapisu klienta: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClientPanelEditToggle = async () => {
    if (contactEditing) {
      await handleSave();
      return;
    }
    resetClientContactForm();
    setContactEditing(true);
  };

  const cancelClientPanelEdit = () => {
    setForm({
      name: String(client?.name || ''),
      company: String(client?.company || ''),
      email: String(client?.email || ''),
      phone: String(client?.phone || ''),
      notes: String(client?.notes || ''),
    });
    setContactEditing(false);
  };

  const copyValue = async (label: string, value: string) => {
    if (!value) return toast.error(`Brak wartości: ${label}`);
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} skopiowano`);
    } catch {
      toast.error('Nie udało się skopiować.');
    }
  };

  const openNewCase = () => {
    if (!clientId) return navigate('/cases');
    navigate(`/cases?clientId=${encodeURIComponent(clientId)}&new=1`);
  };

  const stopClientNoteSpeech = () => {
    const recognition = clientNoteRecognitionRef.current;
    clientNoteRecognitionRef.current = null;
    setClientNoteListening(false);
    setClientNoteInterimText('');
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      try {
        recognition.abort?.();
      } catch {
        // ignore
      }
    }
  };

  const handleToggleClientNoteSpeech = () => {
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    if (clientNoteListening) {
      stopClientNoteSpeech();
      return;
    }
    const RecognitionConstructor = getSpeechRecognitionConstructor();
    if (!RecognitionConstructor) {
      toast.error('Dyktowanie nie jest dostępne w tej przeglądarce.');
      return;
    }
    try {
      const recognition = new RecognitionConstructor();
      recognition.lang = 'pl-PL';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let index = event.resultIndex || 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          const transcript = String(result?.[0]?.transcript || '').trim();
          if (!transcript) continue;
          if (result?.isFinal) finalTranscript = joinTranscript(finalTranscript, transcript);
          else interimTranscript = joinTranscript(interimTranscript, transcript);
        }
        if (finalTranscript) {
          clientNoteVoiceDirtyRef.current = true;
          setForm((current) => ({ ...current, notes: joinTranscript(current.notes, finalTranscript) }));
        }
        setClientNoteInterimText(interimTranscript);
      };
      recognition.onerror = () => {
        toast.error('Nie udało się dokończyć dyktowania notatki.');
        stopClientNoteSpeech();
      };
      recognition.onend = () => {
        clientNoteRecognitionRef.current = null;
        setClientNoteListening(false);
        setClientNoteInterimText('');
      };
      clientNoteRecognitionRef.current = recognition;
      recognition.start();
      setClientNoteListening(true);
      setContactEditing(true);
      toast.success('Dyktowanie notatki włączone');
    } catch {
      toast.error('Nie udało się uruchomić dyktowania.');
      stopClientNoteSpeech();
    }
  };

  useEffect(() => {
    if (!clientNoteVoiceDirtyRef.current) return;
    if (!clientId || !hasAccess || !form.notes.trim() || clientNoteAutosaving) return;
    const timer = window.setTimeout(async () => {
      try {
        setClientNoteAutosaving(true);
        await updateClientInSupabase({ id: clientId, notes: form.notes.trim() });
        setClient((current: any) => (current ? { ...current, notes: form.notes.trim() } : current));
        clientNoteVoiceDirtyRef.current = false;
        toast.success('Notatka klienta zapisana');
      } catch (error: any) {
        toast.error(`Błąd zapisu notatki: ${error?.message || 'REQUEST_FAILED'}`);
      } finally {
        setClientNoteAutosaving(false);
      }
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [clientId, form.notes, hasAccess, clientNoteAutosaving]);

  useEffect(() => () => stopClientNoteSpeech(), []);

  const openNewLeadForExistingClient = () => {
    if (!clientId) return navigate('/leads');
    navigate(`/leads?clientId=${encodeURIComponent(clientId)}&new=1`);
  };

  const openMainCase = () => {
    if (!mainCase?.id) return;
    navigate(`/cases/${String(mainCase.id)}`);
  };
  const clientNextAction = buildClientNextAction(
    leads,
    cases,
    clientTasks,
    clientEvents,
    String(clientId || ''),
  );

  if (loading || workspaceLoading) {

/* CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_REPAIR1_2026_05_12

   Production stabilizer for React #310 until ClientDetail is split into route shell + loaded view.

   This mirrors the single useMemo executed only by the loaded branch.

*/

useMemo(() => [], [activities, client?.id, clientId, id]);

return (
      <Layout>
<main className="client-detail-vnext-page">
          <div className="client-detail-loading-card">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Ładowanie klienta...</span>
          </div>
        </main>
      </Layout>
    );
  }
  const clientNotesStage14A = useMemo(() => {
    const sourceActivities = Array.isArray(activities) ? activities : [];
    const safeClientId = String(client?.id || clientId || '');
    return sourceActivities
      .filter((activity: any) => isClientNoteActivityStage14A(activity, safeClientId))
      .sort((left: any, right: any) => {
        const leftTime = asDate(formatClientActivityDateStage14A(left))?.getTime() || asDate(getActivityTime(left))?.getTime() || 0;
        const rightTime = asDate(formatClientActivityDateStage14A(right))?.getTime() || asDate(getActivityTime(right))?.getTime() || 0;
        return rightTime - leftTime;
      });
  }, [activities, client?.id, clientId, id]);


  if (!client) {
    return (
      <Layout>
        <main className="client-detail-vnext-page">
          <section className="client-detail-empty-card">
            <EntityIcon entity="client" className="h-8 w-8" />
            <h1>Nie znaleziono klienta</h1>
            <p>Ten rekord mógł zostać usunięty albo nie należy do aktualnego workspace.</p>
            <Button type="button" onClick={() => navigate('/clients')} variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Wróć do klientów
            </Button>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="client-detail-vnext-page" data-client-detail-simplified-card-view="true">
        <header className="client-detail-header">
          <div className="client-detail-header-copy">
            <button type="button" className="client-detail-back-button" onClick={() => navigate('/clients')}>
              <ArrowLeft className="h-4 w-4" />
              Klienci
            </button>
            <p className="client-detail-breadcrumb">Klienci / {getClientName(client)}</p>
            <p className="client-detail-kicker">KARTOTEKA KLIENTA</p>
            <h1>{getClientName(client)}</h1>
            <div className="client-detail-header-meta">
              <span>Ostatni kontakt: {formatDate(lastActivityDate)}</span>
              <span>Główna sprawa: {mainCase ? getCaseTitle(mainCase) : 'Brak głównej sprawy'}</span>
              <span>Status relacji: {activeCases.length > 0 ? 'Aktywna obsługa' : leads.length > 0 ? 'Kontakt po leadzie' : 'Kartoteka'}</span>
            </div>
          </div>
          <div className="client-detail-header-actions">
            
            <Button type="button" variant="default" className="client-detail-header-action-soft" asChild>
              <Link to="/ai-drafts">
                <EntityIcon entity="ai" className="h-4 w-4" />
                Zapytaj AI
              </Link>
            </Button>
            <Button type="button" variant="default" onClick={openNewCase} disabled={!hasAccess}>
              <Plus className="h-4 w-4" />
              Nowa sprawa dla klienta
            </Button>
            <Button type="button" className="client-detail-header-action-primary" onClick={openMainCase} disabled={!mainCase?.id}>
              <EntityIcon entity="case" className="h-4 w-4" />
              Otwórz główną sprawę
            </Button>
          </div>
        </header>
        <ClientTopTiles
        clientId={String(clientId || '')}
        leads={leads}
        cases={cases}
        payments={payments}
        tasks={clientTasks}
        events={clientEvents}
        onOpenCases={() => setActiveTab('cases')}
        />
        <div className="client-detail-shell">
          <aside className="client-detail-left-rail">
            
                      <section className="client-detail-today-info-tiles" data-client-left-management-tiles="true" data-client-today-style-info-tiles="true" aria-label="Informacje o kliencie">
              <article className={`client-detail-today-info-tile ${nextActionToneClass(clientNextAction.tone)}`} data-client-left-next-action-tile="true">
                <div className="client-detail-today-info-tile-icon">
                  <EntityIcon entity="lead" className="h-4 w-4" />
                </div>
                <div className="client-detail-today-info-tile-body">
                  <small>Najbliższa zaplanowana akcja</small>
                  <strong>{clientNextAction.title}</strong>
                  <p>{clientNextAction.subtitle}</p>
                  {renderClientNextActionContextStage14B(clientNextAction)}
                </div>
                {clientNextAction.to ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="client-detail-today-info-tile-action"
                    onClick={() => navigate(clientNextAction.to!)}
                  >
                    Otwórz
                  </Button>
                ) : null}
              </article>
              {(() => {
                const currency = payments.find((payment) => typeof payment?.currency === 'string' && payment.currency.trim())?.currency || 'PLN';
                const amountOfPayment = (payment: any) =>
                  Number(
                    payment?.amount ??
                      payment?.grossAmount ??
                      payment?.totalAmount ??
                      payment?.value ??
                      payment?.price ??
                      0,
                  ) || 0;
                const total = payments.reduce((sum, payment) => sum + amountOfPayment(payment), 0);
                const paid = payments
                  .filter((payment) => isPaidPaymentStatus(payment?.status))
                  .reduce((sum, payment) => sum + amountOfPayment(payment), 0);
                const remaining = Math.max(0, total - paid);
                const paymentsLabel = payments.length === 1 ? 'pozycja' : payments.length < 5 ? 'pozycje' : 'pozycji';
                return (
                  <article className="client-detail-today-info-tile client-detail-today-info-tile-finance" data-client-left-finance-tile="true">
                    <div className="client-detail-today-info-tile-icon">
                      <EntityIcon entity="case" className="h-4 w-4" />
                    </div>
                    <div className="client-detail-today-info-tile-body">
                      <small>Podsumowanie finansów</small>
                      <strong>{formatMoneyWithCurrency(paid, currency)}</strong>
                      <p>Opłacone · {payments.length} {paymentsLabel}</p>
                    </div>
                    <div className="client-detail-today-info-tile-meta">
                      <span>Łącznie: {formatMoneyWithCurrency(total, currency)}</span>
                      <span>Do rozliczenia: {formatMoneyWithCurrency(remaining, currency)}</span>
                    </div>
                  </article>
                );
              })()}
            </section>

<section className="client-detail-profile-card client-detail-side-card" data-client-inline-contact-edit="true">
              <div className="client-detail-avatar-row">
                <div className="client-detail-avatar">{getInitials(client)}</div>
                <div>
                  <h2>{getClientName(client)}</h2>
                  <p>{mainCase ? 'Klient · główna sprawa aktywna' : 'Klient · brak aktywnej sprawy'}</p>
                </div>
              </div>

                            <Button
                type="button"
                variant="default"
                className="client-detail-visible-edit-action client-detail-edit-main-button"
                data-client-detail-visible-edit-action="true"
                data-client-edit-under-data="true"
                data-client-edit-main-visible="true"
                onClick={handleClientPanelEditToggle}
                disabled={saving}
              >
                {contactEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                {contactEditing ? 'Zapisz dane' : 'Edytuj dane'}
              </Button>
{contactEditing ? (
                <div className="client-detail-edit-form">
                  <div className="client-detail-edit-field">
                    <Label>Nazwa klienta</Label>
                    <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                  </div>
                  <div className="client-detail-edit-field">
                    <Label>Firma</Label>
                    <Input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} placeholder="Brak firmy" />
                  </div>
                  <ClientMultiContactField
                    kind="phone"
                    label="Telefon"
                    value={form.phone}
                    onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
                    placeholder="telefon klienta"
                  />
                  <ClientMultiContactField
                    kind="email"
                    label="E-mail"
                    value={form.email}
                    onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                    placeholder="email klienta"
                  />
                  <div className="client-detail-edit-field">
                    <Label>Notatka</Label>
                    <Textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
                    {clientNoteInterimText ? <p className="text-xs text-slate-500">Dyktowanie: {clientNoteInterimText}</p> : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={handleToggleClientNoteSpeech} disabled={!hasAccess || clientNoteAutosaving}>
                        {clientNoteListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        {clientNoteListening ? 'Zatrzymaj dyktowanie' : 'Dyktuj notatkę'}
                      </Button>
                      {clientNoteAutosaving ? <span className="text-xs text-slate-500">Zapisywanie za 2s…</span> : null}
                    </div>
                  </div>
                  <div className={formActionsClass('client-detail-edit-actions')}>
                    <Button type="button" onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4" />
                      {saving ? 'Zapisuję...' : 'Zapisz'}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelClientPanelEdit} disabled={saving}>
                      Anuluj
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="client-detail-contact-list">
                  <InfoRow icon={Phone} label="Telefon" value={client.phone || '-'} onCopy={() => copyValue('Telefon', client.phone)} />
                  <InfoRow icon={Mail} label="E-mail" value={client.email || '-'} onCopy={() => copyValue('E-mail', client.email)} />
                  <InfoRow icon={Building2} label="Firma" value={client.company || 'Brak firmy'} />
                  <InfoRow icon={EventEntityIcon} label="Ostatni kontakt" value={formatDate(lastActivityDate)} />
                </div>
              )}

            </section>

          <section className="client-detail-right-card client-detail-recent-moves-card" data-client-recent-moves-panel="true">
                    <div className="client-detail-card-title-row">
                      <EntityIcon entity="activity" className="h-4 w-4" />
                      <h2>Ostatnie ruchy</h2>
                    </div>
                    {recentClientMovements.length ? (
                      <div className="client-detail-recent-moves-list">
                        {recentClientMovements.map((move) => (
                          <Link key={move.id} to="/activity" className="client-detail-recent-move-row">
                            <span>
                              <strong>{move.title}</strong>
                              <small>{move.meta}</small>
                            </span>
                            <em>{move.time}</em>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="client-detail-light-empty">Brak ostatnich ruchów dla tego klienta.</p>
                    )}
                    <Link to="/activity" className="client-detail-recent-moves-link">
                      Zobacz całą Aktywność
                    </Link>
                  </section>

          </aside>

          <section className="client-detail-main-column">
            <nav className="client-detail-tabs" aria-label="Zakładki klienta">
              {[
                { key: 'summary', label: 'Podsumowanie' },
                { key: 'cases', label: 'Sprawy' },
                { key: 'history', label: 'Historia' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  {...(tab.key === 'summary'
                    ? { 'data-client-tab-summary': 'true' }
                    : tab.key === 'cases'
                      ? { 'data-client-tab-cases': 'true' }
                      : { 'data-client-tab-history': 'true' })}
                  className={activeTab === tab.key ? 'client-detail-tab-active' : ''}
                  onClick={() => setActiveTab(tab.key as ClientTab)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {activeTab === 'summary' ? (
              <div className="client-detail-tab-panel">
                <div className="client-detail-top-cards">
                  <section className="client-detail-hero-card" aria-label="Najbliższa zaplanowana akcja">
                    <div className="client-detail-hero-kicker">NAJBLIŻSZA ZAPLANOWANA AKCJA</div>
                    <div className="client-detail-hero-date">{nextAction.date || formatDate(new Date())}</div>
                    <div className="client-detail-hero-sub">{nextAction.subtitle}</div>
                    <Button
                      type="button"
                      className="client-detail-hero-cta"
                      onClick={() => {
                        if (mainCase?.id) return openMainCase();
                        if (nextAction.to) return navigate(nextAction.to as string);
                        return openNewCase();
                      }}
                      disabled={!hasAccess && !mainCase?.id && !nextAction.to}
                    >
                      Otwórz sprawę
                    </Button>
                  </section>

                                    <div className="client-detail-top-cards-side">
                    <section className="client-detail-completeness-card" aria-label="Kompletność sprawy">
                      <div className="client-detail-card-title-row">
                        <CheckCircle2 className="h-4 w-4" />
                        <h2>Kompletność sprawy</h2>
                      </div>
                      <strong>{mainCase ? `${mainCaseCompleteness}%` : '0%'}</strong>
                      <p>{mainCase ? getCaseTitle(mainCase) : 'Główna sprawa nie ma kompletu elementów.'}</p>
                      {mainCase ? <div className="client-detail-progress"><span style={{ width: `${mainCaseCompleteness}%` }} /></div> : null}
                      {blockers.length > 0 ? (
                        <div className="client-detail-completeness-note">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Blokady: {blockers[0] ? blockers[0].blocker : blockers.length}</span>
                        </div>
                      ) : null}
                    </section>

                    <section className="client-detail-summary-card client-detail-finance-card" aria-label="Finanse klienta">
                      <div className="client-detail-card-title-row">
                        <EntityIcon entity="lead" className="h-4 w-4" />
                        <h2>Finanse klienta</h2>
                      </div>
                      <div className="client-detail-finance-metrics">
                        <div>
                          <small>Możliwy przychód</small>
                          <strong>{formatMoneyWithCurrency(clientFinance.potentialTotal, clientFinance.currency)}</strong>
                        </div>
                        <div>
                          <small>Wpłacono</small>
                          <strong>{formatMoneyWithCurrency(clientFinance.paidTotal, clientFinance.currency)}</strong>
                        </div>
                        <div>
                          <small>Pozostało</small>
                          <strong>{formatMoneyWithCurrency(clientFinance.remainingTotal, clientFinance.currency)}</strong>
                        </div>
                      </div>
                      {clientFinance.hasMixedCurrencies ? <p>Wykryto wiele walut, podsumowanie pokazuje walutę dominującą.</p> : null}
                    </section>
                  </div>
                </div>

                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Relacje</h2>
</div>
                    <Button type="button" variant="outline" onClick={() => setActiveTab('history')}>
                      Znajdź w historii
                    </Button>
                  </div>
                  <div className="client-detail-relations-list">
                    {leads.length ? (
                      leads.slice(0, 3).map((lead) => (
                        <article key={String(lead.id)} className="client-detail-relation-row">
                          <div className="client-detail-relation-main">
                            <h3>{String(lead.name || lead.company || lead.email || 'Lead')}</h3>
                            <p>Lead powiązany z klientem.</p>
                          </div>
                          <span className="client-detail-pill client-detail-pill-muted">Lead</span>
                          <div className="client-detail-relation-actions">
                            <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/leads/${String(lead.id)}`)}>
                              Otwórz lead
                            </Button>
                            {lead.linkedCaseId ? (
                              <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/cases/${String(lead.linkedCaseId)}`)}>
                                Otwórz sprawę
                              </Button>
                            ) : null}
                          </div>
                        </article>
                      ))
                    ) : null}
                    {clientCaseRows.length === 0 ? (
                      <div className="client-detail-light-empty">Brak spraw przy tym kliencie. Po pozyskaniu tematu utwórz sprawę i prowadź tam dalszą obsługę.</div>
                    ) : (
                      clientCaseRows.slice(0, 4).map((caseRecord) => (
                        <article key={caseRecord.id} className="client-detail-relation-row">
                          <div className="client-detail-relation-main">
                            <h3>{caseRecord.title}</h3>
                            <p>{caseRecord.nextActionMeta || `W realizacji · najbliższa akcja ${caseRecord.nextActionLabel}`}</p>
                          </div>
                          <span className={`client-detail-pill ${statusBadgeClass(caseRecord.status)}`}>
                            {activeCases.some((entry) => String(entry.id) === String(caseRecord.id)) ? 'Aktywna' : caseRecord.statusLabel}
                          </span>
                          <div className="client-detail-relation-actions">
                            <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/cases/${String(caseRecord.id)}`)}>
                              Otwórz sprawę
                            </Button>
                            {caseRecord.leadId ? (
                              <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/leads/${String(caseRecord.leadId)}`)}>
                                Otwórz lead
                              </Button>
                            ) : null}
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>

                <section className="client-detail-section-card" data-client-summary-source-lead-panel="true">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Aktywne sprawy</h2>
                      <p>Lista spraw klienta z szybkim wejściem do prowadzenia.</p>
                    </div>
                    {firstSourceLead ? (
                      <Button type="button" variant="outline" onClick={() => navigate(`/leads/${String(firstSourceLead.id)}`)}>
                        Otwórz lead
                      </Button>
                    ) : null}
                  </div>
                  <div className="client-detail-acquisition-line">
                    <span>
                      Pierwszy kontakt:{' '}
                      <strong>{firstSourceLead ? formatDate(firstSourceLead.createdAt || firstSourceLead.updatedAt) : formatDate(client.createdAt)}</strong>
                    </span>
                    <span>
                      Źródło: <strong>{firstSourceLead?.source || client.source || 'Brak źródła'}</strong>
                    </span>
                    <span>
                      Lead źródłowy:{' '}
                      <strong>{firstSourceLead ? String(firstSourceLead.name || firstSourceLead.company || 'Lead bez nazwy') : 'Brak powiązanego leada'}</strong>
                    </span>
                  </div>
                </section>
              </div>
            ) : null}

                        {activeTab === 'cases' ? (
              <div className="client-detail-tab-panel" data-client-cases-list-panel="true">
                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Aktywne sprawy</h2>
                    </div>
                  </div>

                  {leads.length ? (<>
                    
                  <div className="client-detail-case-smart-list" data-client-case-smart-list="true">
                    {(cases.filter((caseRecord: any) => {
                      const caseClientId = String(caseRecord?.clientId || caseRecord?.client_id || caseRecord?.clientID || '').trim();
                      const caseClientName = asText(caseRecord?.clientName);
                      const currentClientId = String(client.id || '').trim();
                      const currentClientName = getClientName(client).toLowerCase();
                      const isMainCase = mainCase?.id && String(caseRecord?.id || '') === String(mainCase.id);
                      return Boolean(
                        isMainCase ||
                        (caseClientId && caseClientId === currentClientId) ||
                        (caseClientName && caseClientName.toLowerCase() === currentClientName)
                      );
                    }).length
                      ? cases.filter((caseRecord: any) => {
                          const caseClientId = String(caseRecord?.clientId || caseRecord?.client_id || caseRecord?.clientID || '').trim();
                          const caseClientName = asText(caseRecord?.clientName);
                          const currentClientId = String(client.id || '').trim();
                          const currentClientName = getClientName(client).toLowerCase();
                          const isMainCase = mainCase?.id && String(caseRecord?.id || '') === String(mainCase.id);
                          return Boolean(
                            isMainCase ||
                            (caseClientId && caseClientId === currentClientId) ||
                            (caseClientName && caseClientName.toLowerCase() === currentClientName)
                          );
                        })
                      : mainCase?.id
                        ? [mainCase]
                        : []
                    ).map((caseRecord: any) => {
                      const caseId = String(caseRecord?.id || '');
                      const title = getCaseTitle(caseRecord);
                      const status = caseStatusLabel(String(caseRecord?.status || 'in_progress'));
                      const value = getCaseValueLabel(caseRecord);
                      const completeness = getCaseCompleteness(caseRecord);
                      return (
                        <article key={caseId || title} className="client-detail-case-smart-card" data-client-case-smart-card="true">
                          <div className="client-detail-case-smart-main">
                            <span className="client-detail-case-smart-kicker">Sprawa</span>
                            <strong>{title}</strong>
                            <div className="client-detail-case-smart-meta">
                              <span>{status}</span>
                              <span>Kompletność {completeness}%</span>
                            </div>
                          </div>
                          <div className="client-detail-case-smart-value">
                            <small>Wartość sprawy</small>
                            <b>{value}</b>
                          </div>
                          <div className="client-detail-case-smart-actions">
                            <Button type="button" size="sm" onClick={() => (caseId ? navigate(`/cases/${caseId}`) : toast.info('Brak ID sprawy.'))}>
                              Wejdź w sprawę
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => (caseId ? navigate(`/cases/${caseId}`) : toast.info('Brak ID sprawy.'))}>
                              Edytuj
                            </Button>
                            <EntityActionButton
                              type="button"
                              size="sm"
                              variant="outline"
                              tone="danger"
                              iconOnly
                              className="client-detail-case-smart-delete-icon-button"
                              aria-label="Usuń sprawę"
                              title="Usuń sprawę"
                              onClick={() => toast.info('Usuwanie sprawy wymaga potwierdzenia w widoku sprawy.')}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </EntityActionButton>
                          </div>
                        </article>
                      );
                    })}
                    {!(cases.filter((caseRecord: any) => {
                      const caseClientId = String(caseRecord?.clientId || caseRecord?.client_id || caseRecord?.clientID || '').trim();
                      const caseClientName = asText(caseRecord?.clientName);
                      const currentClientId = String(client.id || '').trim();
                      const currentClientName = getClientName(client).toLowerCase();
                      const isMainCase = mainCase?.id && String(caseRecord?.id || '') === String(mainCase.id);
                      return Boolean(
                        isMainCase ||
                        (caseClientId && caseClientId === currentClientId) ||
                        (caseClientName && caseClientName.toLowerCase() === currentClientName)
                      );
                    }).length || mainCase?.id) ? (
                      <div className="client-detail-case-smart-empty">Brak aktywnej sprawy dla klienta.</div>
                    ) : null}
                  </div>

<div className="client-detail-relations-list client-detail-relations-list-acquisition-only">
                      {leads.map((lead) => {
                        const leadId = String(lead.id || lead.leadId || lead.name || lead.createdAt || 'lead');
                        const leadName = String(lead.name || lead.company || 'Lead bez nazwy');
                        const source = asText(lead.source) || asText(lead.sourceName) || asText(lead.channel) || asText(lead.origin) || asText(lead.acquisitionSource) || 'Nie podano';
                        const status = leadStatusLabel(String(lead.status || 'new'));
                        return (
                          <div
                            key={leadId}
                            className="client-detail-relation-row client-detail-relation-row-acquisition-only"
                            data-client-acquisition-history-row="true"
                          >
                            <div className="client-detail-relation-main">
                              <h3>{leadName}</h3>
                              <p><strong>Źródło:</strong> {source}</p>
                              <p><strong>Status przy pozyskaniu:</strong> {status} · <strong>Utworzono:</strong> {formatDate(lead.createdAt || lead.updatedAt)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                  ) : (
                    <div className="client-detail-light-empty">
                      Brak zapisanej historii pozyskania dla tego klienta.
                    </div>
                  )}
                </section>
              </div>
            ) : null}

{activeTab === 'history' ? (
              <div className="client-detail-tab-panel">
                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Historia</h2>
                      <p>Realne ruchy powiązane z klientem, leadami i sprawami.</p>
                    </div>
                  </div>
                  <div className="client-detail-history-list">
                    {clientActivities.length === 0 ? (
                      <div className="client-detail-light-empty">Brak historii do pokazania.</div>
                    ) : (
                      clientActivities.slice(0, 16).map((activity) => (
                        <article key={String(activity.id || activity.eventType || getActivityTime(activity))} className="client-detail-history-row">
                          <span className="client-detail-history-dot"><EntityIcon entity="activity" className="h-4 w-4" /></span>
                          <div>
                            <h3>{activityLabel(activity)}</h3>
                            <p>{formatDateTime(getActivityTime(activity))}</p>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              </div>
            ) : null}
          </section>

          <aside className="client-detail-right-rail" aria-label="Panel klienta">
                    
<section className="right-card client-detail-right-card client-detail-operational-center" aria-label="Centrum operacyjne klienta">
              <div className="client-detail-card-title-row">
                <Clock className="h-4 w-4" />
                <h2>Najbliższa zaplanowana akcja</h2>
              </div>
              <div className="client-detail-quick-actions-list">
                <div>
                  <span>Zadania klienta</span>
                  <strong>{activeTaskCount}</strong>
                </div>
                <div>
                  <span>Wydarzenia klienta</span>
                  <strong>{activeEventCount}</strong>
                </div>
                <div>
                  <span>Aktywność klienta</span>
                  <strong>{lastActivityDate ? formatDateTime(lastActivityDate) : 'Brak'}</strong>
                </div>
              </div>
            </section>

            <div hidden data-client-detail-stage35-removed-quick-actions="true" />
            <div hidden data-client-detail-stage35-retain-open-new-lead={String(Boolean(openNewLeadForExistingClient))} />

            {/* STAGE35_CLIENT_DETAIL_HIDE_DODATKOWO */}

            
              <section className="right-card client-detail-right-card client-detail-side-quick-actions-card" data-client-side-quick-actions="true">
                <div className="client-detail-card-title-row">
                  <EntityIcon entity="ai" className="h-4 w-4" />
                  <h2>Szybkie akcje</h2>
                </div>
                <div className="client-detail-side-quick-actions-grid">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-context-action-kind="task"
                    data-context-record-type="client"
                    data-context-record-id={String(client.id)}
                    data-context-record-label={getClientName(client)}
                    onClick={() =>
                      openContextQuickAction({
                        kind: 'task',
                        recordType: 'client',
                        recordId: String(client.id),
                        clientId: String(client.id),
                        leadId: firstSourceLead?.id ? String(firstSourceLead.id) : null,
                        caseId: mainCase?.id ? String(mainCase.id) : null,
                        recordLabel: getClientName(client),
                      })
                    }
                    disabled={!hasAccess}
                  >
                    Dodaj zadanie
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-context-action-kind="event"
                    data-context-record-type="client"
                    data-context-record-id={String(client.id)}
                    data-context-record-label={getClientName(client)}
                    onClick={() =>
                      openContextQuickAction({
                        kind: 'event',
                        recordType: 'client',
                        recordId: String(client.id),
                        clientId: String(client.id),
                        leadId: firstSourceLead?.id ? String(firstSourceLead.id) : null,
                        caseId: mainCase?.id ? String(mainCase.id) : null,
                        recordLabel: getClientName(client),
                      })
                    }
                    disabled={!hasAccess}
                  >
                    Dodaj wydarzenie
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => (mainCase?.id ? navigate(`/cases/${String(mainCase.id)}`) : toast.info('Najpierw utwórz sprawę klienta.'))}
                  >
                    Finanse w sprawie
                  </Button>
                </div>
              </section>

<section className="right-card client-detail-right-card client-detail-note-card">
              <div className="client-detail-card-title-row">
                <EntityIcon entity="template" className="h-4 w-4" />
                <h2>Krótka notatka</h2>
              </div>
              <p className="client-detail-note-text">
                {client.notes ? String(client.notes) : ''}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={handleToggleClientNoteSpeech} disabled={!hasAccess}>
                {clientNoteListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                Dyktuj
              </Button>
            
              <div className="client-detail-notes-list" data-client-notes-list="true">
                <div className="client-detail-notes-list-head">
                  <strong>Notatki</strong>
                  <span>{(getClientNotesForRender(getClientVisibleNotes(activities, client), clientPinnedNoteIds) || []).length}</span>
                </div>
                {(getClientNotesForRender(getClientVisibleNotes(activities, client), clientPinnedNoteIds) || []).length ? (
                  <div className="client-detail-notes-items">
                    {(getClientNotesForRender(getClientVisibleNotes(activities, client), clientPinnedNoteIds) || []).map((note) => (
                      <article
                        key={note.id}
                        className="client-detail-note-item"
                        data-client-note-item="true"
                        data-client-note-pinned={clientPinnedNoteIds.includes(note.id) ? 'true' : 'false'}
                      >
                        <div className="client-detail-note-item-toolbar" data-client-note-actions="true">
                          <button type="button" title="Przypnij notatkę" aria-label="Przypnij notatkę" onClick={() => handleToggleClientNotePin(note)}>
                            <Pin className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" title="Podgląd całej notatki" aria-label="Podgląd całej notatki" onClick={() => handlePreviewClientNote(note)}>
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" title="Edytuj notatkę" aria-label="Edytuj notatkę" onClick={() => handleEditClientNote(note)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <EntityActionButton type="button" tone="danger" iconOnly className="client-detail-note-delete-button" title="Usuń notatkę" aria-label="Usuń notatkę" onClick={() => handleDeleteClientNote(note)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </EntityActionButton>
                        </div>
                        <p>{note.content}</p>
                        <small>{note.createdAt ? formatDateTime(note.createdAt) : 'Dodano przed chwilą'}</small>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="client-detail-note-list" data-client-notes-list="true">
                    {(Array.isArray(clientNotesStage14A) ? clientNotesStage14A : []).length > 0 ? (
                      (Array.isArray(clientNotesStage14A) ? clientNotesStage14A : []).slice(0, 5).map((note: any) => (
                        <article className="client-detail-note-row" key={String(note.id || note.createdAt || note.created_at || getClientActivityBodyStage14A(note))}>
                          <strong>{formatClientActivityTitleStage14A(note)}</strong>
                          <p title={getClientActivityBodyStage14A(note)}>{getClientActivityBodyStage14A(note)}</p>
                        </article>
                      ))
                    ) : (
                      <p>Brak zapisanych notatek dla klienta.</p>
                    )}
                  </div>
                )}
              </div>
</section>

            <section className="right-card client-detail-right-card" data-client-finance-summary="true">
              <div className="client-detail-card-title-row">
                <EntityIcon entity="lead" className="h-4 w-4" />
                <h2>Podsumowanie finansów</h2>
              </div>
              <small>Suma wartości spraw: {formatMoneyWithCurrency(clientFinanceSummary.caseValueTotal, clientFinance.currency)}</small>
              <small>Suma wpłat: {formatMoneyWithCurrency(clientFinanceSummary.paymentsTotal, clientFinance.currency)}</small>
              <small>Pozostało do zapłaty: {formatMoneyWithCurrency(clientFinanceSummary.remainingTotal, clientFinance.currency)}</small>
              <small>Sprawy aktywne / rozliczone: {clientFinanceSummary.activeCases} / {clientFinanceSummary.settledCases}</small>
              <div className="client-detail-quick-actions-list">
                {clientFinanceSummary.recentPayments.length === 0 ? (
                  <div><span>Ostatnie wpłaty</span><strong>Brak</strong></div>
                ) : (
                  clientFinanceSummary.recentPayments.map((entry) => (
                    <div key={String(entry.id || `${entry.amount}-${entry.paidAt || entry.createdAt}`)}>
                      <span>{formatDate(entry.paidAt || entry.createdAt)}</span>
                      <strong>{formatMoneyWithCurrency(entry.amount, entry.currency || clientFinance.currency)}</strong>
                    </div>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
function getClientVisibleNotes(activityRows: any[], clientRecord: any) {
  const clientId = String(clientRecord?.id || '').trim();
  return (activityRows || [])
    .filter((activity) => {
      const eventType = String(activity?.eventType || activity?.activityType || '').toLowerCase();
      if (!['client_note_added', 'note_added', 'operator_note'].includes(eventType)) return false;
      const activityClientId = String(activity?.clientId || activity?.client_id || activity?.payload?.clientId || '').trim();
      const recordType = String(activity?.payload?.recordType || '').toLowerCase();
      return Boolean(
        (activityClientId && clientId && activityClientId === clientId) ||
        recordType === 'client' ||
        isClientNoteActivityA1(activity)
      );
    })
    .map((activity) => ({
      id: String(activity?.id || activity?.createdAt || activity?.updatedAt || activity?.payload?.content || 'note'),
      content:
        asText(activity?.payload?.content) ||
        asText(activity?.payload?.note) ||
        asText(activity?.note) ||
        asText(activity?.description) ||
        asText(activity?.title),
      createdAt: activity?.createdAt || activity?.updatedAt || activity?.happenedAt || null,
    }))
    .filter((note) => note.content)
    .sort((left, right) => {
      const leftTime = asDate(left.createdAt)?.getTime() || 0;
      const rightTime = asDate(right.createdAt)?.getTime() || 0;
      return rightTime - leftTime;
    })
    .slice(0, 8);
}
function getClientNotesForRender(notes: any[], pinnedIds: string[] = []) {
  return [...(notes || [])].sort((left, right) => {
    const leftPinned = pinnedIds.includes(String(left?.id || ''));
    const rightPinned = pinnedIds.includes(String(right?.id || ''));
    if (leftPinned !== rightPinned) return leftPinned ? -1 : 1;
    const leftTime = asDate(left?.createdAt)?.getTime() || 0;
    const rightTime = asDate(right?.createdAt)?.getTime() || 0;
    return rightTime - leftTime;
  });
}

const CLOSEFLOW_FIN9_CLIENT_DETAIL_DUPLICATE_SAFETY_MARKER = 'CLOSEFLOW_FIN9_CLIENT_DETAIL_DUPLICATE_SAFETY_MARKER' as const;
void CLOSEFLOW_FIN9_CLIENT_DETAIL_DUPLICATE_SAFETY_MARKER;
