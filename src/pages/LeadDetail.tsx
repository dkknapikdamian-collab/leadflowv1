import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, DollarSign, Edit2, Loader2, Mail, Mic, MicOff, MoreVertical, Phone, Plus, Trash2 } from 'lucide-react';
import { EntityIcon } from '../components/ui-system';
// LEAD_TO_CASE_FLOW_STAGE24_LEAD_DETAIL
/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP */
/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP_REPAIR1_BUILD_FIX */
/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP_REPAIR7_FINALIZE */
/*
LEAD_DETAIL_VISUAL_REBUILD_STAGE14
Active lead is sales work. Moved lead is acquisition history with a link to Case.
*/
const A16_V2_VOICE_NOTE_AUTOSAVE_ALLOWED = 'voice-notes-may-autosave-after-dictation-silence';
const A24_LEAD_TO_CASE_COPY_LOCK = 'Rozpocznij obsługę | Ten temat jest już w obsłudze | Otwórz sprawę';
const STAGE84_LEAD_DETAIL_WORK_CENTER = 'Lead Detail pokazuje centrum pracy: ostatni ruch, dni bez ruchu, najblizsza akcja i powod ryzyka';
const STAGE88_LEAD_DETAIL_ADMIN_FEEDBACK_HOTFIX = 'LeadDetail cleans noisy helper copy and protects right rail readability';
const STAGE115C_LEAD_INLINE_NOTE_SUBMIT_CONTRACT = 'LeadDetail history note submit stays inline; work-center note action is explicitly modal';
void STAGE115C_LEAD_INLINE_NOTE_SUBMIT_CONTRACT;
const STAGE115D_LEAD_OVERDUE_WORK_ITEMS_RED_CONTRACT = 'LeadDetail overdue work items show Zaległe with red danger tone and readable separators';
void STAGE115D_LEAD_OVERDUE_WORK_ITEMS_RED_CONTRACT;
const STAGE115E_LEAD_FINANCE_ACTIONS_DIALOG_CONTRACT = 'LeadDetail finance actions open payment dialog and persist payment records';
void STAGE115E_LEAD_FINANCE_ACTIONS_DIALOG_CONTRACT;
const CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_V1 = 'Lead status visible in header, duplicated right-rail status card removed';
const STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL = 'LeadDetail header renders lead status pill once in title row';
void STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL;
const CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_2026_05_12 = 'LeadDetail service case small fallback quote fixed';
const CLOSEFLOW_LEAD_DETAIL_ADMIN_FEEDBACK_P1_2026_05_13 = 'Right rail noisy AI/status cards removed and contact history uses shared activity timeline formatter';
const STAGE216G_LEAD_DETAIL_LAYOUT_CLEANUP_LOCAL_ONLY = 'LeadDetail local-only cockpit layout: compact header, left work stack, sticky decision rail, actionable empty states';
void STAGE216G_LEAD_DETAIL_LAYOUT_CLEANUP_LOCAL_ONLY;

const STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_CARD = 'Static AI follow-up card removed from LeadDetail right rail; AI draft engine remains available outside the rail.';
void STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_CARD;
const STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_RAIL = 'LeadDetail does not render the static AI follow-up right-rail card';
void STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_RAIL;



import { toast } from 'sonner';
import Layout from '../components/Layout';
import EntityContactCard from '../components/entity-contact-card';
import { actionButtonClass, modalFooterClass} from '../components/entity-actions';
import { openContextQuickAction, type ContextActionKind } from '../components/ContextActionDialogs';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import { EVENT_TYPES, PRIORITY_OPTIONS, TASK_TYPES } from '../lib/options';
import { isLeadMovedToService } from '../lib/lead-health';
import { isLeadInServiceStatus } from '../lib/lead-service-state';
import { buildStartEndPair, toDateTimeLocalValue } from '../lib/scheduling';
import { normalizeWorkItem } from '../lib/work-items/normalize';
import { getNearestPlannedAction } from '../lib/nearest-action';
import { getActivityTimelineDescription, getActivityTimelineTitle } from '../lib/activity-timeline';
import { requireWorkspaceId } from '../lib/workspace-context';
import { startLeadToCaseHandoff } from '../lib/lead-case-handoff';
import {
  deleteEventFromSupabase,
  deleteLeadFromSupabase,
  deleteTaskFromSupabase,
  fetchActivitiesFromSupabase,
  fetchCasesFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadByIdFromSupabase,
  fetchPaymentsFromSupabase,
  fetchTasksFromSupabase,
  insertActivityToSupabase,
  createPaymentInSupabase,
  insertEventToSupabase,
  insertTaskToSupabase,
  isSupabaseConfigured,
  startLeadServiceInSupabase,
  updateActivityInSupabase,
  deleteActivityFromSupabase,
  updateEventInSupabase,
  updateLeadInSupabase,
  updateTaskInSupabase,
  updateCaseInSupabase,
} from '../lib/supabase-fallback';
import '../styles/visual-stage14-lead-detail-vnext.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '../lib/action-visual-taxonomy';

const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_LEAD = {
  entity: 'lead',
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

const LEAD_STATUS_LABELS_STAGE77 = {
  new: 'Nowy',
  contacted: 'Skontaktowany',
  qualification: 'Kwalifikacja',
  proposal_sent: 'Oferta wysłana',
  waiting_response: 'Czeka na odpowiedź',
  accepted: 'Zaakceptowany',
  moved_to_service: 'Przeniesiony do obsługi',
  negotiation: 'Negocjacje',
  lost: 'Przegrany',
} as const;

const STATUS_OPTIONS = [
  { value: 'new', label: LEAD_STATUS_LABELS_STAGE77.new },
  { value: 'contacted', label: LEAD_STATUS_LABELS_STAGE77.contacted },
  { value: 'qualification', label: LEAD_STATUS_LABELS_STAGE77.qualification },
  { value: 'proposal_sent', label: LEAD_STATUS_LABELS_STAGE77.proposal_sent },
  { value: 'waiting_response', label: LEAD_STATUS_LABELS_STAGE77.waiting_response },
  { value: 'accepted', label: LEAD_STATUS_LABELS_STAGE77.accepted },
  { value: 'moved_to_service', label: LEAD_STATUS_LABELS_STAGE77.moved_to_service },
  { value: 'negotiation', label: LEAD_STATUS_LABELS_STAGE77.negotiation },
  { value: 'lost', label: LEAD_STATUS_LABELS_STAGE77.lost },
];

const SOURCE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'form', label: 'Formularz' },
  { value: 'phone', label: 'Telefon' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'other', label: 'Inne' },
];

const SIMPLE_RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Bez powtarzania' },
  { value: 'daily', label: 'Codzieńnie' },
  { value: 'weekly', label: 'Co tydzień' },
  { value: 'monthly', label: 'Co miesiąc' },
];

const modalSelectClass = 'lead-detail-modal-select';

type TimelineEntry = {
  id: string;
  kind: 'task' | 'event';
  title: string;
  status: string;
  statusLabel: string;
  isOverdue: boolean;
  dateValue: string;
  dateLabel: string;
  raw: any;
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
function joinTranscript(previous: string, addition: string) {
  // ADMIN_FEEDBACK_P1_NOTE_TRANSCRIPT_DEDUPE
  const base = previous.trim();
  const next = addition.trim().replace(/\s+/g, ' ');
  if (!next) return base;
  if (!base) return next;

  const baseNorm = base.toLowerCase();
  const nextNorm = next.toLowerCase();

  if (baseNorm.endsWith(nextNorm) || baseNorm.includes(nextNorm)) return base;
  if (nextNorm.startsWith(baseNorm)) return next;

  const baseWords = base.split(/\s+/);
  const nextWords = next.split(/\s+/);
  const maxOverlap = Math.min(baseWords.length, nextWords.length, 12);

  for (let size = maxOverlap; size > 0; size -= 1) {
    const left = baseWords.slice(-size).join(' ').toLowerCase();
    const right = nextWords.slice(0, size).join(' ').toLowerCase();
    if (left === right) {
      return `${base} ${nextWords.slice(size).join(' ')}`.trim();
    }
  }

  return `${base} ${next}`.trim();
}
function asDate(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object' && value && 'toDate' in (value as Record<string, unknown>)) {
    try {
      const converted = (value as { toDate: () => Date }).toDate();
      return Number.isNaN(converted.getTime()) ? null : converted;
    } catch {
      return null;
    }
  }
  return null;
}
function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
function formatDate(value: unknown, fallback = 'Brak daty') {
  const parsed = asDate(value);
  if (!parsed) return fallback;
  return parsed.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDateTime(value: unknown, fallback = 'Bez terminu') {
  const parsed = asDate(value);
  if (!parsed) return fallback;
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
function formatMoney(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? `${amount.toLocaleString('pl-PL')} PLN` : '0 PLN';
}
function getLeadFinance(lead: Record<string, unknown> | null) {
  // CLOSEFLOW_LEAD_SETTLEMENT_DYNAMIC_V29
  const rawDealValue =
    lead?.dealValue ??
    (lead as any)?.deal_value ??
    (lead as any)?.expectedRevenue ??
    (lead as any)?.expected_revenue ??
    (lead as any)?.value ??
    0;
  const dealValue = Number(rawDealValue || 0);
  const formatted = formatMoney(Number.isFinite(dealValue) ? dealValue : 0);
  const currency = typeof lead?.currency === 'string' && lead.currency.trim() ? lead.currency.trim() : 'PLN';
  return { dealValue: Number.isFinite(dealValue) ? dealValue : 0, currency, formatted };
}
function isPaidPaymentStatus(status: unknown) {
  return ['deposit_paid', 'partially_paid', 'fully_paid', 'paid'].includes(String(status || '').toLowerCase());
}
function deriveBillingStatus(potential: number, paid: number, payments: any[]) {
  const normalizedPotential = Math.max(0, Number(potential) || 0);
  const normalizedPaid = Math.max(0, Number(paid) || 0);
  const hasDeposit = payments.some((entry) => String(entry?.type || '').toLowerCase() === 'deposit' && isPaidPaymentStatus(entry?.status));
  if (normalizedPaid <= 0) return 'not_started';
  if (normalizedPotential > 0 && normalizedPaid >= normalizedPotential) return 'fully_paid';
  if (hasDeposit) return 'deposit_paid';
  return 'partially_paid';
}
function getLeadName(lead: any) {
  return String(lead?.name || lead?.company || 'Lead bez nazwy');
}
function statusLabel(status?: string) {
  const normalized = String(status || '').trim();
  return LEAD_STATUS_LABELS_STAGE77[normalized as keyof typeof LEAD_STATUS_LABELS_STAGE77] || normalized || 'Lead';
}
function sourceLabel(source?: string) {
  return SOURCE_OPTIONS.find((entry) => entry.value === source)?.label || source || 'Brak źródła';
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
    case 'source_only':
      return 'Źródłowe dane leada';
    case 'not_started':
      return 'Brak wpłaty';
    default:
      return status || 'Brak statusu';
  }
}
function taskTypeLabel(type?: string) {
  return TASK_TYPES.find((entry) => entry.value === type)?.label || 'Zadanie';
}
function eventTypeLabel(type?: string) {
  return EVENT_TYPES.find((entry) => entry.value === type)?.label || 'Wydarzenie';
}
function taskStatusLabel(status?: string, dateValue?: unknown) {
  const normalized = String(status || '').toLowerCase();
  if (isWorkItemOverdue(dateValue, normalized)) return 'Zaległe';
  if (normalized === 'done' || normalized === 'completed') return 'Zrobione';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'Anulowane';
  if (normalized === 'in_progress') return 'W trakcie';
  return 'Do zrobienia';
}
function eventStatusLabel(status?: string, dateValue?: unknown) {
  const normalized = String(status || '').toLowerCase();
  if (isWorkItemOverdue(dateValue, normalized)) return 'Zaległe';
  if (normalized === 'done' || normalized === 'completed') return 'Zrobione';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'Anulowane';
  return 'Zaplanowane';
}
function statusClass(status?: string, dateValue?: unknown) {
  const normalized = String(status || '').toLowerCase();
  if (isWorkItemOverdue(dateValue, normalized) || normalized === 'overdue') return 'lead-detail-pill-danger';
  if (normalized === 'done' || normalized === 'completed') return 'lead-detail-pill-green';
  if (normalized === 'lost' || normalized === 'cancelled' || normalized === 'canceled') return 'lead-detail-pill-muted';
  if (normalized === 'waiting_response' || normalized === 'proposal_sent' || normalized === 'negotiation') return 'lead-detail-pill-amber';
  if (normalized === 'moved_to_service' || normalized === 'accepted') return 'lead-detail-pill-purple';
  return 'lead-detail-pill-blue';
}
function getTaskDate(task: any) {
  const normalized = normalizeWorkItem(task);
  return String(normalized.scheduledAt || normalized.reminderAt || task?.updatedAt || task?.createdAt || '');
}
function getEventDate(event: any) {
  const normalized = normalizeWorkItem(event);
  return String(normalized.startAt || normalized.scheduledAt || normalized.reminderAt || event?.updatedAt || event?.createdAt || '');
}
function isDoneStatus(status: unknown) {
  return ['done', 'completed', 'cancelled', 'canceled', 'archived'].includes(String(status || '').toLowerCase());
}
function isWorkItemOverdue(dateValue: unknown, status: unknown) {
  const parsed = asDate(dateValue);
  if (!parsed || isDoneStatus(status)) return false;
  return parsed.getTime() < Date.now();
}
function dedupeById<T extends Record<string, unknown>>(items: T[]) {
  const map = new Map<string, T>();
  for (const item of items) {
    const key = String(item.id || '');
    if (!key) continue;
    if (!map.has(key)) map.set(key, item);
  }
  return [...map.values()];
}
function isLinkedThroughLeadOrCase(item: Record<string, unknown>, leadId: string, caseId?: string | null) {
  const normalized = normalizeWorkItem(item);
  const directLeadId = String(normalized.leadId || '');
  const directCaseId = String(normalized.caseId || '');
  if (directLeadId === leadId) return true;
  if (caseId && directCaseId === caseId) return true;
  return false;
}
function getActivityTitle(activity: any) {
  return getActivityTimelineTitle(activity, { statusLabel, formatDateTime, formatMoney });
}
function getActivityDescription(activity: any) {
  return getActivityTimelineDescription(activity, { statusLabel, formatDateTime, formatMoney });
}
function addDuration(value: unknown, amountMs: number) {
  const base = asDate(value) || new Date();
  return new Date(base.getTime() + amountMs).toISOString();
}
function toLocalDateTime(value: unknown) {
  const parsed = asDate(value) || new Date();
  return toDateTimeLocalValue(parsed);
}
function buildTimeline(tasks: any[], events: any[]): TimelineEntry[] {
  const taskEntries = tasks.map((task) => {
    const status = String(task.status || 'todo');
    const dateValue = getTaskDate(task);
    const isOverdue = isWorkItemOverdue(dateValue, status);
    return {
      id: `task:${String(task.id || '')}`,
      kind: 'task' as const,
      title: String(task.title || 'Zadanie bez tytułu'),
      status,
      statusLabel: taskStatusLabel(status, dateValue),
      isOverdue,
      dateValue,
      dateLabel: formatDateTime(dateValue),
      raw: task,
    };
  });

  const eventEntries = events.map((event) => {
    const status = String(event.status || 'scheduled');
    const dateValue = getEventDate(event);
    const isOverdue = isWorkItemOverdue(dateValue, status);
    return {
      id: `event:${String(event.id || '')}`,
      kind: 'event' as const,
      title: String(event.title || 'Wydarzenie bez tytułu'),
      status,
      statusLabel: eventStatusLabel(status, dateValue),
      isOverdue,
      dateValue,
      dateLabel: formatDateTime(dateValue),
      raw: event,
    };
  });

  return [...taskEntries, ...eventEntries].sort((left, right) => {
    const leftDone = isDoneStatus(left.status) ? 1 : 0;
    const rightDone = isDoneStatus(right.status) ? 1 : 0;
    if (leftDone !== rightDone) return leftDone - rightDone;
    return (asDate(left.dateValue)?.getTime() ?? Number.MAX_SAFE_INTEGER) - (asDate(right.dateValue)?.getTime() ?? Number.MAX_SAFE_INTEGER);
  });
}
function LeadActionButton({ children, onClick, disabled }: { children: ReactNode; onClick?: () => void; disabled?: boolean }) {
  const isStartServiceActionStage14F = children === 'Rozpocznij obsługę';
  return (
    <button
      type="button"
      className={isStartServiceActionStage14F ? "lead-detail-chip-button cf-action-button cf-action-button-primary" : "lead-detail-chip-button cf-action-button"}
      data-lead-start-service={isStartServiceActionStage14F ? "true" : undefined}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_LEAD_DETAIL = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';


const LEADDETAIL_ACTION_COLOR_TAXONOMY_V1 = 'lead detail action visual taxonomy V1';
function leadDetailActionVisualKind(row: Record<string, unknown> | null | undefined) {
  return inferCloseFlowActionVisualKind(row);
}
function leadDetailActionVisualClass(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualClass(row);
}
function leadDetailActionDataKind(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualDataKind(row);
}
function leadDetailActionKindClass(kind: unknown) {
  return getCloseFlowActionKindClass(kind);
}
export default function LeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { hasAccess, workspace, workspaceReady } = useWorkspace();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [associatedCase, setAssociatedCase] = useState<any>(null);
  const [allCases, setAllCases] = useState<any[]>([]);
  const [linkedTasks, setLinkedTasks] = useState<any[]>([]);
  const [linkedEvents, setLinkedEvents] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [noteListening, setNoteListening] = useState(false);
  const [noteInterimText, setNoteInterimText] = useState('');
  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [createCasePending, setCreateCasePending] = useState(false);
  const [editLead, setEditLead] = useState<any>(null);
  const [linkCaseId, setLinkCaseId] = useState('');
  const [linkingCase, setLinkingCase] = useState(false);
  const [createCaseDraft, setCreateCaseDraft] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    status: 'ready_to_start',
  });
  const [startServiceSuccess, setStartServiceSuccess] = useState<{ caseId: string; title: string } | null>(null);
  const [linkedEntryActionId, setLinkedEntryActionId] = useState<string | null>(null);
  const [leadPayments, setLeadPayments] = useState<any[]>([]);
  const [leadPaymentDialogType, setLeadPaymentDialogType] = useState<'deposit' | 'partial' | null>(null);
  const [leadPaymentAmount, setLeadPaymentAmount] = useState('');
  const [leadPaymentNote, setLeadPaymentNote] = useState('');
  const [leadPaymentSaving, setLeadPaymentSaving] = useState(false);
  const [editLinkedTask, setEditLinkedTask] = useState<any | null>(null);
  const [editLinkedEvent, setEditLinkedEvent] = useState<any | null>(null);
  const [editLinkedTaskSubmitting, setEditLinkedTaskSubmitting] = useState(false);
  const [editLinkedEventSubmitting, setEditLinkedEventSubmitting] = useState(false);
  const noteRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const noteVoiceDirtyRef = useRef(false);

  const loadLead = async () => {
    if (!leadId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const [leadRow, caseRows, taskRows, eventRows, activityRows, paymentRows] = await Promise.all([
        fetchLeadByIdFromSupabase(leadId),
        fetchCasesFromSupabase(),
        fetchTasksFromSupabase(),
        fetchEventsFromSupabase(),
        fetchActivitiesFromSupabase({ leadId, limit: 100 }),
        fetchPaymentsFromSupabase({ leadId }),
      ]);

      const allCaseRows = Array.isArray(caseRows) ? (caseRows as Record<string, unknown>[]) : [];
      const currentCase =
        allCaseRows.find((item) => String(item.leadId || '') === leadId) ||
        allCaseRows.find((item) => String(item.id || '') === String((leadRow as any)?.linkedCaseId || (leadRow as any)?.caseId || '')) ||
        null;
      const currentCaseId = currentCase?.id ? String(currentCase.id) : null;
      const linkedTaskRows = dedupeById(
        (Array.isArray(taskRows) ? taskRows : [])
          .map((item: any) => ({ ...item, ...normalizeWorkItem(item) }))
          .filter((item: any) => isLinkedThroughLeadOrCase(item, leadId, currentCaseId)),
      );
      const linkedEventRows = dedupeById(
        (Array.isArray(eventRows) ? eventRows : [])
          .map((item: any) => ({ ...item, ...normalizeWorkItem(item) }))
          .filter((item: any) => isLinkedThroughLeadOrCase(item, leadId, currentCaseId)),
      );

      setLead(leadRow || null);
      setEditLead(leadRow || null);
      setAssociatedCase(currentCase);
      setAllCases(allCaseRows);
      setLinkedTasks(linkedTaskRows);
      setLinkedEvents(linkedEventRows);
      setActivities(Array.isArray(activityRows) ? activityRows : []);
      setLeadPayments(Array.isArray(paymentRows) ? paymentRows : []);
      setLinkCaseId(currentCase?.id ? String(currentCase.id) : '');
      setCreateCaseDraft({
        title: `${String((leadRow as any)?.name || 'Lead').trim() || 'Lead'} - obsługa`,
        clientName: String((leadRow as any)?.name || ''),
        clientEmail: String((leadRow as any)?.email || ''),
        clientPhone: String((leadRow as any)?.phone || ''),
        status: 'ready_to_start',
      });
    } catch (error: any) {
      const message = error?.message || 'Nie udało się pobrać danych leada';
      setLoadError(message);
      toast.error(`Błąd odczytu leada: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!leadId || !workspaceReady) return;
    if (!isSupabaseConfigured()) {
      setLoadError('Brak konfiguracji Supabase.');
      setLoading(false);
      return;
    }
    void loadLead();
  }, [leadId, workspaceReady]);

  const leadMovedToService = isLeadMovedToService(lead);
  const serviceCaseId = String(startServiceSuccess?.caseId || associatedCase?.id || lead?.linkedCaseId || lead?.caseId || '');
  const serviceCaseTitle = String(startServiceSuccess?.title || associatedCase?.title || associatedCase?.clientName || 'Powiązana sprawa');
  const serviceCaseStatusLabel = String(associatedCase?.status || createCaseDraft.status || 'ready_to_start').replaceAll('_', ' ');
  const serviceMovedAtLabel = formatDateTime(lead?.movedToServiceAt || lead?.serviceStartedAt || associatedCase?.serviceStartedAt || associatedCase?.createdAt);
  const leadOperationalArchive = Boolean(leadMovedToService || associatedCase || startServiceSuccess);
  const leadInService = Boolean(leadOperationalArchive || isLeadInServiceStatus(lead?.status));
  const leadRiskReasonStage14F =
    asText(lead?.riskReason) ||
    asText((lead as any)?.risk_reason) ||
    asText(lead?.riskNote) ||
    asText((lead as any)?.risk_note) ||
    asText(lead?.atRiskReason) ||
    asText((lead as any)?.at_risk_reason);
  const showServiceBanner = leadInService;
  const leadFinance = useMemo(() => getLeadFinance(lead), [lead]);
  const leadFinancePanel = useMemo(() => {
    const potential = Math.max(0, Number(leadFinance.dealValue || 0));
    const amountOfPayment = (payment: any) =>
      Number(
        payment?.amount ??
          payment?.grossAmount ??
          payment?.totalAmount ??
          payment?.value ??
          payment?.price ??
          0,
      ) || 0;
    const paidFromPayments = leadPayments
      .filter((payment) => isPaidPaymentStatus(payment?.status))
      .reduce((sum, payment) => sum + amountOfPayment(payment), 0);
    const paidFromLead = Number(lead?.paidAmount ?? lead?.paid_amount ?? 0) || 0;
    const paid = Math.max(0, paidFromPayments, paidFromLead);
    const remaining = Math.max(0, potential - paid);
    return {
      potential,
      paid,
      remaining,
      billingStatus: deriveBillingStatus(potential, paid, leadPayments),
    };
  }, [lead, leadFinance.dealValue, leadPayments]);

  const leadSourceNoteText = useMemo(() => {
    return (
      asText(lead?.note) ||
      asText(lead?.notes) ||
      asText(lead?.noteText) ||
      asText(lead?.note_text)
    );
  }, [lead?.note, lead?.notes, lead?.noteText, lead?.note_text]);

  const leadNoteActivityItems = useMemo(() => {
    return [...activities]
      .filter((activity) => {
        const type = String(activity?.eventType || activity?.event_type || activity?.type || activity?.activityType || '').toLowerCase();
        return type === 'note_added' || type === 'lead_note_added' || type === 'operator_note' || type.includes('note');
      })
      .map((activity, index) => {
        const payload = activity?.payload && typeof activity.payload === 'object' ? activity.payload : {};
        const content =
          asText(payload?.content) ||
          asText(payload?.note) ||
          asText(payload?.text) ||
          asText(activity?.content) ||
          asText(activity?.note) ||
          getActivityDescription(activity);
        const dateValue = activity?.happenedAt || activity?.createdAt || activity?.updatedAt || payload?.createdAt || payload?.happenedAt;
        return {
          id: String(activity?.id || activity?.eventType || activity?.createdAt || index),
          content,
          dateValue,
          dateLabel: formatDateTime(dateValue, 'Brak daty'),
        };
      })
      .filter((entry) => Boolean(entry.content))
      .sort((left, right) => (asDate(right.dateValue)?.getTime() || 0) - (asDate(left.dateValue)?.getTime() || 0));
  }, [activities]);

  const leadPrimaryNoteText = useMemo(() => {
    return leadSourceNoteText || leadNoteActivityItems[0]?.content || '';
  }, [leadNoteActivityItems, leadSourceNoteText]);

  const hasLeadNotesStage115B = Boolean(leadSourceNoteText || leadNoteActivityItems.length);


  const leadServiceLockedMessage = 'Ten temat jest już w obsłudze. Dalszą pracę prowadź w sprawie.';
  const STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS = 'Lead detail uses shared context action dialogs instead of local simplified quick forms';
  const openLeadContextAction = (kind: ContextActionKind) => {
    if (!leadId) return;
    openContextQuickAction({
      kind,
      recordType: 'lead',
      recordId: leadId,
      leadId,
      recordLabel: getLeadName(lead),
    });
  };
  const handleCreateQuickTask = () => {
    if (leadOperationalArchive) return toast.error('Dodawaj dalsze zadania w sprawie.');
    openLeadContextAction('task');
  };
  const handleCreateQuickEvent = () => {
    if (leadOperationalArchive) return toast.error('Dodawaj dalsze wydarzenia w sprawie.');
    openLeadContextAction('event');
  };
  const openLeadPaymentDialog = (type: 'deposit' | 'partial') => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    setLeadPaymentDialogType(type);
    setLeadPaymentAmount('');
    setLeadPaymentNote('');
  };

  const closeLeadPaymentDialog = () => {
    if (leadPaymentSaving) return;
    setLeadPaymentDialogType(null);
    setLeadPaymentAmount('');
    setLeadPaymentNote('');
  };

  const handleSaveLeadPayment = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!leadId || !leadPaymentDialogType) return;
    if (!hasAccess) return toast.error('Trial wygasł.');

    const amount = Number(String(leadPaymentAmount || '').replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawną kwotę płatności.');
      return;
    }

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    const paidAt = new Date().toISOString();
    const currency = leadFinance.currency || 'PLN';
    const paymentType = leadPaymentDialogType;
    const paymentLabel = paymentType === 'deposit' ? 'Zaliczka' : 'Płatność częściowa';

    try {
      setLeadPaymentSaving(true);
      await createPaymentInSupabase({
        leadId,
        caseId: serviceCaseId || null,
        clientId: lead?.clientId ? String(lead.clientId) : null,
        type: paymentType,
        status: 'paid',
        amount,
        currency,
        paidAt,
        note: leadPaymentNote.trim(),
        workspaceId,
      });

      await addActivity('payment_recorded', {
        type: paymentType,
        label: paymentLabel,
        amount,
        currency,
        paidAt,
        note: leadPaymentNote.trim(),
      });

      toast.success(`${paymentLabel} zapisana`);
      setLeadPaymentDialogType(null);
      setLeadPaymentAmount('');
      setLeadPaymentNote('');
      await loadLead();
    } catch (error: any) {
      toast.error(`Nie udało się zapisać płatności: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLeadPaymentSaving(false);
    }
  };

useEffect(() => {
    if (!startServiceSuccess?.caseId) return;
    navigate(`/case/${startServiceSuccess.caseId}`);
  }, [startServiceSuccess?.caseId, navigate]);

  const sortedLinkedTasks = useMemo(
    () => [...linkedTasks].sort((left, right) => (asDate(getTaskDate(left))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (asDate(getTaskDate(right))?.getTime() ?? Number.MAX_SAFE_INTEGER)),
    [linkedTasks],
  );

  const sortedLinkedEvents = useMemo(
    () => [...linkedEvents].sort((left, right) => (asDate(getEventDate(left))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (asDate(getEventDate(right))?.getTime() ?? Number.MAX_SAFE_INTEGER)),
    [linkedEvents],
  );

  const timeline = useMemo(() => buildTimeline(sortedLinkedTasks, sortedLinkedEvents), [sortedLinkedEvents, sortedLinkedTasks]);
  const nearestPlannedAction = useMemo(() => getNearestPlannedAction({
    leadId: String(leadId || ''),
    caseId: associatedCase?.id ? String(associatedCase.id) : undefined,
    tasks: linkedTasks,
    events: linkedEvents,
  }), [associatedCase?.id, leadId, linkedEvents, linkedTasks]);
  const nextTimelineEntry = useMemo(() => {
    if (!nearestPlannedAction?.id) return timeline.find((entry) => !isDoneStatus(entry.status)) || null;
    return timeline.find((entry) => String(entry.raw?.id || '') === nearestPlannedAction.id) || timeline.find((entry) => !isDoneStatus(entry.status)) || null;
  }, [nearestPlannedAction, timeline]);
  const leadWorkCenter = useMemo(() => {
    const nowMs = Date.now();
    const activityDates = activities
      .map((activity) => asDate(activity?.happenedAt || activity?.createdAt || activity?.updatedAt || activity?.payload?.createdAt))
      .filter(Boolean) as Date[];
    const taskDates = sortedLinkedTasks.map((task) => asDate(getTaskDate(task))).filter(Boolean) as Date[];
    const eventDates = sortedLinkedEvents.map((event) => asDate(getEventDate(event))).filter(Boolean) as Date[];
    const leadDates = [lead?.lastContactAt, lead?.lastActivityAt, lead?.updatedAt, lead?.createdAt]
      .map((value) => asDate(value))
      .filter(Boolean) as Date[];
    const dates = [...activityDates, ...taskDates, ...eventDates, ...leadDates].sort((left, right) => right.getTime() - left.getTime());
    const lastTouch = dates[0] || null;
    const daysWithoutMovement = lastTouch ? Math.max(0, Math.floor((nowMs - lastTouch.getTime()) / 86400000)) : null;
    const nextActionDate = asDate(nextTimelineEntry?.dateValue);
    const isOverdue = Boolean(nextActionDate && nextActionDate.getTime() < nowMs && !leadInService);
    const hasNoPlannedAction = Boolean(!nextTimelineEntry && !leadInService);
    const isWaitingTooLong = Boolean(String(lead?.status || '') === 'waiting_response' && typeof daysWithoutMovement === 'number' && daysWithoutMovement >= 3 && !leadInService);
    const dealValue = Number(lead?.dealValue || 0);
    const isHighValueCold = Boolean(dealValue >= 5000 && typeof daysWithoutMovement === 'number' && daysWithoutMovement >= 5 && !leadInService);

    let riskLabel = 'Ogarnięty';
    let riskTone = 'good';
    let riskReason = leadInService
      ? 'Temat jest już w obsłudze. Dalsza praca powinna iść przez sprawę.'
      : 'Lead ma zaplanowany ruch albo nie wymaga pilnej reakcji.';

    if (isOverdue) {
      riskLabel = 'Po terminie';
      riskTone = 'danger';
      riskReason = 'Najbliższa zaplanowana akcja ma termin w przeszłości.';
    } else if (hasNoPlannedAction) {
      riskLabel = 'Brak akcji';
      riskTone = 'danger';
      riskReason = 'Aktywny lead nie ma żadnego zaplanowanego zadania ani wydarzenia.';
    } else if (isWaitingTooLong) {
      riskLabel = 'Czeka za długo';
      riskTone = 'warn';
      riskReason = 'Lead jest w statusie oczekiwania i nie miał ruchu od kilku dni.';
    } else if (isHighValueCold) {
      riskLabel = 'Wysoka wartość bez ruchu';
      riskTone = 'warn';
      riskReason = 'Lead ma wysoką wartość i długo nie było przy nim aktywności.';
    }

    return {
      lastTouchLabel: lastTouch ? formatDateTime(lastTouch) : 'Brak zapisanego ruchu',
      daysWithoutMovementLabel: typeof daysWithoutMovement === 'number' ? `${daysWithoutMovement} dni` : 'Brak danych',
      nextActionLabel: nextTimelineEntry ? `${nextTimelineEntry.title} • ${nextTimelineEntry.statusLabel} • ${nextTimelineEntry.dateLabel}` : '-',
      isOverdue,
      hasNoPlannedAction,
      riskLabel,
      riskTone,
      riskReason,
    };
  }, [activities, lead, leadInService, nextTimelineEntry, sortedLinkedEvents, sortedLinkedTasks]);

  const workCenterPanel = (
    <section className="lead-detail-work-center" data-stage="stage84-lead-detail-work-center">
      <div className="lead-detail-work-center-header">
        <div>
          <span>Centrum pracy leada</span>
          <h2>AI wsparcie</h2>

        </div>
        <span className={`lead-detail-work-risk lead-detail-work-risk-${leadWorkCenter.riskTone}`}>
          {leadWorkCenter.riskLabel}
        </span>
      </div>

      <div className="lead-detail-work-center-grid">
        <div className="lead-detail-work-metric">
          <small>Ostatni ruch</small>
          <strong>{leadWorkCenter.lastTouchLabel}</strong>
        </div>
        <div className="lead-detail-work-metric">
          <small>Dni bez ruchu</small>
          <strong>{leadWorkCenter.daysWithoutMovementLabel}</strong>
        </div>
        <div className="lead-detail-work-metric lead-detail-work-metric-wide">
          <small>Najbliższa zaplanowana akcja</small>
          <strong>{leadWorkCenter.nextActionLabel}</strong>
        </div>
      </div>

      <div className="lead-detail-work-reason" data-lead-risk-reason="true">
  <small>Powód ryzyka</small>
  {leadRiskReasonStage14F ? (
    <p className="lead-detail-risk-reason" title={leadRiskReasonStage14F}>
      Powód: {leadRiskReasonStage14F}
    </p>
  ) : (
    <p className="lead-detail-risk-reason">Powód: -</p>
  )}
</div>

      {!leadInService ? (
        <div className="lead-detail-work-actions" aria-label="Szybkie akcje na leadzie">
          <LeadActionButton onClick={handleCreateQuickTask} disabled={!hasAccess}>
            <Phone className="h-4 w-4" /> Zaplanuj telefon / follow-up
          </LeadActionButton>
          <LeadActionButton onClick={handleCreateQuickEvent} disabled={!hasAccess}>
            <EntityIcon entity="event" className="h-4 w-4" /> Zaplanuj spotkanie
          </LeadActionButton>
          <LeadActionButton onClick={() => handleUpdateStatus('contacted')} disabled={!hasAccess}>
            <CheckCircle2 className="h-4 w-4" /> Kontakt wykonany
          </LeadActionButton>
          <LeadActionButton onClick={() => handleUpdateStatus('proposal_sent')} disabled={!hasAccess}>
            <Mail className="h-4 w-4" /> Oferta wysłana
          </LeadActionButton>
          <LeadActionButton onClick={() => handleUpdateStatus('waiting_response')} disabled={!hasAccess}>
            <Clock className="h-4 w-4" /> Oznacz waiting
          </LeadActionButton>
          <LeadActionButton onClick={() => openLeadContextAction('note')} disabled={!hasAccess}>
            <EntityIcon entity="template" className="h-4 w-4" /> Otwórz szybki formularz notatki
          </LeadActionButton>
          {serviceCaseId ? (
            <LeadActionButton onClick={() => navigate(`/cases/${serviceCaseId}`)}>
              <EntityIcon entity="case" className="h-4 w-4" /> Otwórz sprawę
            </LeadActionButton>
          ) : null}
        </div>
      ) : (
        <div className="lead-detail-work-actions lead-detail-work-actions-service">
          <LeadActionButton onClick={() => serviceCaseId && navigate(`/cases/${serviceCaseId}`)} disabled={!serviceCaseId}>
            <EntityIcon entity="case" className="h-4 w-4" /> Otwórz sprawę
          </LeadActionButton>
          <span>{leadServiceLockedMessage}</span>
        </div>
      )}
    </section>
  );

  const availableCasesToLink = useMemo(
    () => allCases.filter((item) => !String(item.leadId || '') || String(item.leadId || '') === leadId),
    [allCases, leadId],
  );

  const addActivity = async (eventType: string, payload: Record<string, unknown>) => {
    if (!leadId) return;
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return;
    try {
      await insertActivityToSupabase({
        leadId,
        ownerId: null,
        actorId: null,
        actorType: 'operator',
        eventType,
        payload,
        workspaceId,
      });
      const rows = await fetchActivitiesFromSupabase({ leadId, limit: 100 });
      setActivities(rows as any[]);
    } catch {
      // activity is best effort
    }
  };

  const patchLead = async (payload: Record<string, unknown>, successMessage?: string) => {
    if (!leadId) return;
    try {
      await updateLeadInSupabase({ id: leadId, ...payload });
      if (successMessage) toast.success(successMessage);
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zapisu: ${error?.message || 'REQUEST_FAILED'}`);
      throw error;
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (leadInService) return toast.error('Ten temat jest już w obsłudze. Dalszą pracę prowadź w sprawie.');
    await patchLead({ status }, 'Status zaktualizowany');
    await addActivity('status_changed', { status });
  };

  const handleUpdateLead = async () => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!editLead || !leadId) return;
    await patchLead(
      {
        name: editLead.name || '',
        company: editLead.company || '',
        email: editLead.email || '',
        phone: editLead.phone || '',
        source: editLead.source || 'other',
        dealValue: Number(editLead.dealValue) || 0,
        note: editLead.note || editLead.notes || '',
      },
      leadInService ? 'Dane źródłowe leada zaktualizowane' : 'Dane zaktualizowane',
    );
    setIsEditing(false);
  };


  const resetLeadEditDraft = () => {
    if (!lead) return;
    setEditLead({ ...lead });
  };

  const handleStartLeadEditing = () => {
    resetLeadEditDraft();
    setIsEditing(true);
  };

  const handleCancelLeadEditing = () => {
    resetLeadEditDraft();
    setIsEditing(false);
  };
  const copyValue = async (label: string, value: string) => {
    const cleanValue = String(value || '').trim();
    if (!cleanValue || cleanValue === '-') return toast.error(`Brak wartości: ${label}`);
    try {
      await navigator.clipboard.writeText(cleanValue);
      toast.success(`${label} skopiowano`);
    } catch {
      toast.error('Nie udało się skopiować.');
    }
  };



  const handleDeleteLead = async () => {
    if (!leadId) return;
    if (!window.confirm('Czy na pewno chcesz usunąć tego leada?')) return;
    try {
      await deleteLeadFromSupabase(leadId);
      toast.success('Lead usunięty');
      navigate('/leads');
    } catch (error: any) {
      toast.error(`Błąd usuwania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const stopNoteSpeech = () => {
    const recognition = noteRecognitionRef.current;
    noteRecognitionRef.current = null;
    setNoteListening(false);
    setNoteInterimText('');
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

  const handleToggleNoteSpeech = () => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (noteListening) {
      stopNoteSpeech();
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
          noteVoiceDirtyRef.current = true;
          setNote((current) => joinTranscript(current, finalTranscript));
        }
        setNoteInterimText(interimTranscript);
      };
      recognition.onerror = () => {
        toast.error('Nie udało się dokończyć dyktowania notatki.');
        stopNoteSpeech();
      };
      recognition.onend = () => {
        noteRecognitionRef.current = null;
        setNoteListening(false);
        setNoteInterimText('');
      };
      noteRecognitionRef.current = recognition;
      recognition.start();
      setNoteListening(true);
      toast.success('Dyktowanie notatki włączone');
    } catch {
      toast.error('Nie udało się uruchomić dyktowania.');
      stopNoteSpeech();
    }
  };

  const handleAddNote = async (event?: FormEvent, options?: { silent?: boolean }) => {
    event?.preventDefault();
    const content = note.trim();
    if (!content || !hasAccess || addingNote) return;
    try {
      setAddingNote(true);
      await addActivity('note_added', { content });
      setNote('');
      noteVoiceDirtyRef.current = false;
      if (!options?.silent) toast.success('Notatka dodana');
    } finally {
      setAddingNote(false);
    }
  };

  useEffect(() => {
    if (!noteVoiceDirtyRef.current) return;
    if (!note.trim() || addingNote || !hasAccess) return;
    const timer = window.setTimeout(() => {
      void handleAddNote(undefined, { silent: true });
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [note, addingNote, hasAccess]);

  useEffect(() => () => stopNoteSpeech(), []);

  const openEditNote = (activity: any) => {
    setEditingNote(activity);
    setEditingNoteContent(String(activity?.payload?.content || activity?.payload?.note || ''));
  };

  const handleSaveEditedNote = async () => {
    if (!leadId || !editingNote?.id) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    const content = editingNoteContent.trim();
    if (!content) return toast.error('Treść notatki nie może być pusta');

    try {
      await updateActivityInSupabase({
        id: String(editingNote.id),
        leadId,
        payload: { ...(editingNote.payload || {}), content, editedAt: new Date().toISOString() },
      });
      toast.success('Notatka zaktualizowana');
      setEditingNote(null);
      setEditingNoteContent('');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd edycji notatki: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleDeleteNote = async (activityId: string) => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!window.confirm('Usunąć tę notatkę?')) return;
    try {
      await deleteActivityFromSupabase(activityId);
      toast.success('Notatka usunięta');
      if (editingNote?.id && String(editingNote.id) === activityId) {
        setEditingNote(null);
        setEditingNoteContent('');
      }
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd usuwania notatki: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const openLinkedTaskEditor = (task: any) => {
    const scheduledSource = task.scheduledAt || task.dueAt || task.date || task.updatedAt || new Date();
    setEditLinkedTask({
      id: String(task.id || ''),
      title: String(task.title || ''),
      type: String(task.type || 'follow_up'),
      dueAt: toLocalDateTime(scheduledSource),
      priority: String(task.priority || 'medium'),
      status: String(task.status || 'todo'),
      leadId: task.leadId ? String(task.leadId) : leadId || null,
      caseId: task.caseId ? String(task.caseId) : '',
      reminderAt: task.reminderAt ? toLocalDateTime(task.reminderAt) : '',
      recurrenceRule: String(task.recurrenceRule || 'none'),
    });
  };

  const openLinkedEventEditor = (event: any) => {
    const startSource = event.startAt || event.updatedAt || new Date();
    const pair = buildStartEndPair(toLocalDateTime(startSource));
    setEditLinkedEvent({
      id: String(event.id || ''),
      title: String(event.title || ''),
      type: String(event.type || 'meeting'),
      startAt: toLocalDateTime(startSource),
      endAt: event.endAt ? toLocalDateTime(event.endAt) : pair.endAt,
      status: String(event.status || 'scheduled'),
      leadId: event.leadId ? String(event.leadId) : leadId || null,
      caseId: event.caseId ? String(event.caseId) : '',
      reminderAt: event.reminderAt ? toLocalDateTime(event.reminderAt) : '',
      recurrenceRule: String(event.recurrenceRule || 'none'),
    });
  };

  const handleToggleLinkedTask = async (task: any) => {
    const nextStatus = isDoneStatus(task.status) ? 'todo' : 'done';
    try {
      setLinkedEntryActionId(`task:${task.id}:toggle`);
      const scheduledAt = getTaskDate(task) || new Date().toISOString();
      await updateTaskInSupabase({
        id: String(task.id),
        title: String(task.title || ''),
        type: String(task.type || 'follow_up'),
        date: String(scheduledAt).slice(0, 10),
        scheduledAt,
        dueAt: scheduledAt,
        priority: String(task.priority || 'medium'),
        status: nextStatus,
        leadId: task.leadId ? String(task.leadId) : null,
        caseId: task.caseId ? String(task.caseId) : null,
      });
      await addActivity('task_status_toggled', { title: String(task.title || 'Zadanie'), status: nextStatus, taskId: task.id });
      toast.success(nextStatus === 'done' ? 'Zadanie oznaczone jako zrobione' : 'Zadanie przywrócone');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zmiany statusu zadania: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };

  const handleRescheduleLinkedTask = async (task: any, amountMs: number, label: string) => {
    try {
      setLinkedEntryActionId(`task:${task.id}:snooze`);
      const scheduledAt = addDuration(getTaskDate(task), amountMs);
      await updateTaskInSupabase({
        id: String(task.id),
        title: String(task.title || ''),
        type: String(task.type || 'follow_up'),
        date: scheduledAt.slice(0, 10),
        scheduledAt,
        dueAt: scheduledAt,
        priority: String(task.priority || 'medium'),
        status: String(task.status || 'todo'),
        leadId: task.leadId ? String(task.leadId) : null,
        caseId: task.caseId ? String(task.caseId) : null,
      });
      await addActivity('task_updated', { title: String(task.title || 'Zadanie'), scheduledAt, label });
      toast.success(`Zadanie przesunięte: ${label}`);
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zmiany terminu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };

  const handleDeleteLinkedTask = async (task: any) => {
    if (!window.confirm('Usunąć to zadanie?')) return;
    try {
      setLinkedEntryActionId(`task:${task.id}:delete`);
      await deleteTaskFromSupabase(String(task.id));
      await addActivity('task_deleted', { title: String(task.title || 'Zadanie'), taskId: task.id });
      toast.success('Zadanie usunięte');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd usuwania zadania: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };

  const handleToggleLinkedEvent = async (event: any) => {
    const nextStatus = isDoneStatus(event.status) ? 'scheduled' : 'completed';
    try {
      setLinkedEntryActionId(`event:${event.id}:toggle`);
      await updateEventInSupabase({
        id: String(event.id),
        title: String(event.title || ''),
        type: String(event.type || 'meeting'),
        startAt: getEventDate(event) || new Date().toISOString(),
        endAt: String(event.endAt || getEventDate(event) || new Date().toISOString()),
        status: nextStatus,
        leadId: event.leadId ? String(event.leadId) : null,
        caseId: event.caseId ? String(event.caseId) : null,
      });
      await addActivity('event_status_toggled', { title: String(event.title || 'Wydarzenie'), status: nextStatus, eventId: event.id });
      toast.success(nextStatus === 'completed' ? 'Wydarzenie oznaczone jako zrobione' : 'Wydarzenie przywrócone');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zmiany statusu wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };

  const handleRescheduleLinkedEvent = async (event: any, amountMs: number, label: string) => {
    try {
      setLinkedEntryActionId(`event:${event.id}:snooze`);
      const startAt = addDuration(getEventDate(event), amountMs);
      const currentStart = asDate(getEventDate(event));
      const currentEnd = asDate(event.endAt);
      const duration = currentStart && currentEnd && currentEnd.getTime() > currentStart.getTime() ? currentEnd.getTime() - currentStart.getTime() : 60 * 60 * 1000;
      const endAt = new Date(new Date(startAt).getTime() + duration).toISOString();
      await updateEventInSupabase({
        id: String(event.id),
        title: String(event.title || ''),
        type: String(event.type || 'meeting'),
        startAt,
        endAt,
        status: String(event.status || 'scheduled'),
        leadId: event.leadId ? String(event.leadId) : null,
        caseId: event.caseId ? String(event.caseId) : null,
      });
      await addActivity('event_updated', { title: String(event.title || 'Wydarzenie'), startAt, label });
      toast.success(`Wydarzenie przesunięte: ${label}`);
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zmiany terminu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };

  const handleDeleteLinkedEvent = async (event: any) => {
    if (!window.confirm('Usunąć to wydarzenie?')) return;
    try {
      setLinkedEntryActionId(`event:${event.id}:delete`);
      await deleteEventFromSupabase(String(event.id));
      await addActivity('event_deleted', { title: String(event.title || 'Wydarzenie'), eventId: event.id });
      toast.success('Wydarzenie usunięte');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd usuwania wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };

  const handleSaveLinkedTaskEdit = async () => {
    if (!editLinkedTask?.id) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!editLinkedTask.title.trim()) return toast.error('Podaj tytuł zadania');
    try {
      setEditLinkedTaskSubmitting(true);
      await updateTaskInSupabase({
        id: editLinkedTask.id,
        title: editLinkedTask.title.trim(),
        type: editLinkedTask.type,
        date: String(editLinkedTask.dueAt || '').slice(0, 10),
        scheduledAt: editLinkedTask.dueAt,
        dueAt: editLinkedTask.dueAt,
        priority: editLinkedTask.priority,
        status: editLinkedTask.status,
        leadId: editLinkedTask.leadId === 'none' ? null : editLinkedTask.leadId || null,
        caseId: editLinkedTask.caseId || null,
        reminderAt: editLinkedTask.reminderAt || null,
        recurrenceRule: editLinkedTask.recurrenceRule === 'none' ? null : editLinkedTask.recurrenceRule,
      });
      await addActivity('task_updated', { title: editLinkedTask.title.trim(), taskId: editLinkedTask.id });
      toast.success('Zadanie zaktualizowane');
      setEditLinkedTask(null);
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zapisu zadania: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setEditLinkedTaskSubmitting(false);
    }
  };

  const handleSaveLinkedEventEdit = async () => {
    if (!editLinkedEvent?.id) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!editLinkedEvent.title.trim()) return toast.error('Podaj tytuł wydarzenia');
    try {
      setEditLinkedEventSubmitting(true);
      await updateEventInSupabase({
        id: editLinkedEvent.id,
        title: editLinkedEvent.title.trim(),
        type: editLinkedEvent.type,
        startAt: editLinkedEvent.startAt,
        endAt: editLinkedEvent.endAt,
        status: editLinkedEvent.status,
        leadId: editLinkedEvent.leadId === 'none' ? null : editLinkedEvent.leadId || null,
        caseId: editLinkedEvent.caseId || null,
        reminderAt: editLinkedEvent.reminderAt || null,
        recurrenceRule: editLinkedEvent.recurrenceRule === 'none' ? null : editLinkedEvent.recurrenceRule,
      });
      await addActivity('event_updated', { title: editLinkedEvent.title.trim(), eventId: editLinkedEvent.id });
      toast.success('Wydarzenie zaktualizowane');
      setEditLinkedEvent(null);
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zapisu wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setEditLinkedEventSubmitting(false);
    }
  };

  const handleStartService = async (event?: FormEvent) => {
    event?.preventDefault?.();

    if (!leadId || !lead) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (leadInService && serviceCaseId) {
      navigate(`/cases/${serviceCaseId}`);
      return;
    }

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    try {
      setCreateCasePending(true);
      const result = await startLeadToCaseHandoff({
        leadId,
        lead,
        draft: createCaseDraft,
        workspaceId,
        tasks: linkedTasks,
        events: linkedEvents,
        startLeadService: startLeadServiceInSupabase,
        updateTask: updateTaskInSupabase,
        updateEvent: updateEventInSupabase,
      });

      setStartServiceSuccess({ caseId: result.caseId, title: result.caseTitle });
      setAssociatedCase(result.case);
      setLead((prev: any) => ({
        ...(prev || lead),
        ...result.lead,
        linkedCaseId: result.caseId,
        clientId: result.clientId || result.lead.clientId,
        status: 'moved_to_service',
        leadVisibility: 'archived',
        salesOutcome: 'moved_to_service',
        movedToService: true,
        movedToServiceAt: result.movedToServiceAt,
      }));
      setIsCreateCaseOpen(false);
      toast.success('Sprawa utworzona. Przechodzę do obsługi.');
      await loadLead();
      navigate(`/cases/${result.caseId}`);
    } catch (error: any) {
      const message = String(error?.message || 'REQUEST_FAILED');
      if (message.includes('LEAD_ALREADY_HAS_CASE') && serviceCaseId) {
        toast.success('Temat jest już w obsłudze. Otwieram sprawę.');
        navigate(`/cases/${serviceCaseId}`);
        return;
      }
      toast.error(`Nie udało się rozpocząć obsługi: ${message}`);
    } finally {
      setCreateCasePending(false);
    }
  };

  const handleLinkExistingCase = async () => {
    if (!leadId || !linkCaseId) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    try {
      setLinkingCase(true);
      const selected = allCases.find((entry) => String(entry.id || '') === linkCaseId);
      await updateLeadInSupabase({ id: leadId, status: 'moved_to_service', linkedCaseId: linkCaseId, caseId: linkCaseId, movedToServiceAt: new Date().toISOString() });
      if (selected?.id) {
        // best effort: API accepts PATCH on cases in the current codebase
        const { updateCaseInSupabase } = await import('../lib/supabase-fallback');
        await updateCaseInSupabase({ id: linkCaseId, leadId }).catch(() => null);
      }
      await addActivity('case_linked', { caseId: linkCaseId, title: selected?.title || selected?.clientName || 'Powiązana sprawa' });
      toast.success('Sprawa podpięta do leada');
      await loadLead();
    } catch (error: any) {
      toast.error(`Nie udało się podpiąć sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkingCase(false);
    }
  };

  const openCase = () => {
    if (serviceCaseId) navigate(`/cases/${serviceCaseId}`);
  };

  if (loading) {
    return (
      <Layout>
        <main className="lead-detail-vnext-page">
          <section className="lead-detail-loading-card">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Ładowanie leada...</span>
          </section>
        </main>
      </Layout>
    );
  }

  if (loadError || !lead) {
    return (
      <Layout>
        <main className="lead-detail-vnext-page">
          <section className="lead-detail-empty-card">
            <EntityIcon entity="lead" className="h-8 w-8" />
            <h1>Nie znaleziono leada</h1>
            <p>{loadError || 'Ten rekord mógł zostać usunięty albo nie należy do aktualnego workspace.'}</p>
            <Button type="button" variant="outline" onClick={() => navigate('/leads')}>
              <ArrowLeft className="h-4 w-4" />
              Wróć do leadów
            </Button>
          </section>
        </main>
      </Layout>
    );
  }


  return (
    <Layout>
      <main className="lead-detail-vnext-page">
        <header className="lead-detail-header">
          <div className="lead-detail-header-copy">
            <button type="button" className="lead-detail-back-button" onClick={() => navigate('/leads')}>
              <ArrowLeft className="h-4 w-4" />
              Leady
            </button>
            <div className="lead-detail-title-row">
              <h1>{getLeadName(lead)}</h1>
              <span
                className={`lead-detail-pill ${statusClass(lead?.status)}`}
                data-fb3-lead-status-header-pill="true"
              >
                {statusLabel(lead?.status)}
              </span>
            </div>
            <div className="lead-detail-header-meta">
              <span>Zrodlo: {sourceLabel(lead.source)}</span>
              <span>Ostatnia aktywnosc: {formatDate(lead.updatedAt || activities[0]?.createdAt || lead.createdAt)}</span>
              <span>Kontakt: {lead.phone || lead.email || 'Brak kontaktu'}</span>
            </div>
          </div>
          <div className="lead-detail-header-actions">
            {leadInService ? (
              <Button type="button" onClick={openCase} disabled={!serviceCaseId}>
                <EntityIcon entity="case" className="h-4 w-4" />
                Otwórz sprawę
              </Button>
            ) : (
              <Button type="button" onClick={() => setIsCreateCaseOpen(true)} disabled={!hasAccess}>
                <EntityIcon entity="case" className="h-4 w-4" />
                Rozpocznij obsługę
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleStartLeadEditing}>
              <Edit2 className="h-4 w-4" />
              Edytuj
            </Button>
          </div>
        </header>

        {showServiceBanner ? (
          <section className="lead-detail-service-box" data-lead-in-service-box="true">
            <div>
              <p className="lead-detail-box-kicker">LEAD JUŻ W OBSŁUDZE</p>
              <h2>Ten temat jest już w obsłudze</h2>
              <p>Lead zostaje jako historia pozyskania. Dalszą pracę prowadź w powiązanej sprawie.</p>
            </div>
            <div className="lead-detail-service-meta">
              <span><strong>Sprawa</strong>{serviceCaseTitle}</span>
              <span><strong>Status sprawy</strong>{serviceCaseStatusLabel}</span>
              <span><strong>Data przejścia</strong>{serviceMovedAtLabel}</span>
            </div>
            <Button type="button" onClick={openCase} disabled={!serviceCaseId}>
              Otwórz sprawę <ArrowRight className="h-4 w-4" />
            </Button>
          </section>
        ) : null}

        <div className="lead-detail-shell">
          <aside
            className="lead-detail-left-rail"
            aria-label="Dane kontaktowe leada"
            data-stage115-lead-contact-client-parity="true"
          >
            <EntityContactCard
              entity="lead"
              name={String(lead.name || lead.company || 'Lead bez nazwy')}
              subtitle={leadInService ? 'Lead · historia pozyskania' : 'Lead · aktywny kontakt sprzedażowy'}
              initialsSource={String(lead.name || lead.company || 'Lead')}
              phone={String(lead.phone || '')}
              email={String(lead.email || '')}
              company={String(lead.company || 'Brak firmy')}
              lastContact={formatDate(lead.updatedAt || activities[0]?.createdAt || lead.createdAt)}
              onCopy={copyValue}
              className="lead-detail-client-parity-contact-card"
              dataStage="stage115-lead-contact-client-parity"
            />
          </aside>

          <section className="lead-detail-main-column" data-stage117-lead-detail-vertical-rhythm="true">
            <section
              className="lead-detail-section-card lead-detail-notes-section"
              data-stage115-lead-notes-section="true"
              data-lead-primary-note-text={leadPrimaryNoteText ? 'true' : 'false'}
              aria-label="Notatki leada"
            >
              <div className="lead-detail-section-head">
                <div>
                  <h2>Notatki leada</h2>
                  <p>Notatka z tworzenia leada i ostatnia notatka z historii kontaktu.</p>
                </div>
              </div>
              {hasLeadNotesStage115B ? (
                <div className="lead-detail-notes-stack" data-lead-notes-stack="true">
                  {leadSourceNoteText ? (
                    <article className="lead-detail-note-source-card" data-lead-source-note="true">
                      <small>Notatka źródłowa z leada</small>
                      <strong>{formatDateTime(lead?.noteUpdatedAt || lead?.updatedAt || lead?.createdAt, 'Brak daty')}</strong>
                      <p className="lead-detail-note-text" lang="pl-PL">{leadSourceNoteText}</p>
                    </article>
                  ) : null}
                  {leadNoteActivityItems[0] ? (
                    <article className="lead-detail-note-source-card" data-lead-activity-note="true">
                      <small>Ostatnia notatka z historii</small>
                      <strong>{leadNoteActivityItems[0].dateLabel}</strong>
                      <p className="lead-detail-note-text" lang="pl-PL">{leadNoteActivityItems[0].content}</p>
                    </article>
                  ) : null}
                </div>
              ) : (
                <div className="lead-detail-light-empty" data-lead-notes-empty="true">
                  Brak notatek zapisanych przy tym leadzie.
                </div>
              )}
            </section>

          {!leadInService ? (
              <section className="lead-detail-top-grid">
                <article className="lead-detail-top-card lead-detail-callout-blue">
                  <div className="lead-detail-card-title-row"><Clock className="h-4 w-4" /><h2>Najbliższa zaplanowana akcja</h2></div>
                  {nextTimelineEntry ? (
                    <>
                      <strong>{nextTimelineEntry.title}</strong>
                      <p>{nextTimelineEntry.kind === 'task' ? 'Zadanie' : 'Wydarzenie'} • {nextTimelineEntry.statusLabel} • {nextTimelineEntry.dateLabel}</p>
                      <span className={`lead-detail-pill ${statusClass(nextTimelineEntry.status, nextTimelineEntry.dateValue)}`}>{nextTimelineEntry.statusLabel}</span>
                    </>
                  ) : (
                    <div className="lead-detail-action-empty lead-detail-action-empty-compact">
                      <strong>Brak zaplanowanej akcji</strong>
                      <span>Ten lead może wypaść z procesu. Dodaj follow-up albo wydarzenie.</span>
                    </div>
                  )}
                </article>
                <article className="lead-detail-top-card lead-detail-callout-green">
                  <div className="lead-detail-card-title-row"><DollarSign className="h-4 w-4" /><h2>Wartość</h2></div>
                  <strong>{leadFinance.formatted}</strong>
                  <p>{sourceLabel(lead.source)} • {statusLabel(lead.status)}</p>
                </article>
                <article className="lead-detail-top-card lead-detail-callout-amber">
                  <div className="lead-detail-card-title-row"><EntityIcon entity="lead" className="h-4 w-4" /><h2>Aktywny lead</h2></div>
                  <strong>{sortedLinkedTasks.length + sortedLinkedEvents.length}</strong>
                  <p>powiązane zadania i wydarzenia sprzedażowe.</p>
                </article>
              </section>
            ) : null}

            {!leadInService ? (
              <section className="lead-detail-section-card">
                <div className="lead-detail-section-head">
                  <div>
                    <h2>Zadania i wydarzenia</h2>
</div>
                  <div hidden data-lead-detail-stage35-removed-local-create-actions="true" />
                </div>
                <div className="lead-detail-work-list">
                  {timeline.length === 0 ? (
                    <div className="lead-detail-light-empty lead-detail-action-empty">
                      <strong>Brak zaplanowanych działań.</strong>
                      <span>Ten lead nie ma zadania ani wydarzenia. Zaplanuj następny kontakt, żeby nie zniknął z procesu.</span>
                      <div className="lead-detail-empty-actions">
                        <Button type="button" size="sm" onClick={handleCreateQuickTask} disabled={!hasAccess}>Dodaj follow-up</Button>
                        <Button type="button" size="sm" variant="outline" onClick={handleCreateQuickEvent} disabled={!hasAccess}>Dodaj wydarzenie</Button>
                      </div>
                    </div>
                  ) : (
                    timeline.map((entry) => (
                      <article
                        key={entry.id}
                        className={`lead-detail-work-row ${entry.isOverdue ? 'lead-detail-work-row-overdue' : ''}`}
                        data-lead-work-item-overdue={entry.isOverdue ? 'true' : 'false'}
                      >
                        <span className="lead-detail-work-icon">{entry.kind === 'task' ? <CheckCircle2 className="h-4 w-4" /> : <EntityIcon entity="event" className="h-4 w-4" />}</span>
                        <div>
                          <small>{entry.kind === 'task' ? 'Zadanie' : 'Wydarzenie'}</small>
                          <h3>{entry.title}</h3>
                          <p>{entry.dateLabel}</p>
                        </div>
                        <span className={`lead-detail-pill ${statusClass(entry.status, entry.dateValue)}`}>{entry.statusLabel}</span>
                        <div className="lead-detail-row-actions">
                          <LeadActionButton onClick={() => (entry.kind === 'task' ? openLinkedTaskEditor(entry.raw) : openLinkedEventEditor(entry.raw))}>Edytuj</LeadActionButton>
                          <LeadActionButton onClick={() => (entry.kind === 'task' ? handleRescheduleLinkedTask(entry.raw, 60 * 60 * 1000, '+1H') : handleRescheduleLinkedEvent(entry.raw, 60 * 60 * 1000, '+1H'))} disabled={linkedEntryActionId !== null}>+1H</LeadActionButton>
                          <LeadActionButton onClick={() => (entry.kind === 'task' ? handleRescheduleLinkedTask(entry.raw, 24 * 60 * 60 * 1000, '+1D') : handleRescheduleLinkedEvent(entry.raw, 24 * 60 * 60 * 1000, '+1D'))} disabled={linkedEntryActionId !== null}>+1D</LeadActionButton>
                          <LeadActionButton onClick={() => (entry.kind === 'task' ? handleRescheduleLinkedTask(entry.raw, 7 * 24 * 60 * 60 * 1000, '+1W') : handleRescheduleLinkedEvent(entry.raw, 7 * 24 * 60 * 60 * 1000, '+1W'))} disabled={linkedEntryActionId !== null}>+1W</LeadActionButton>
                          <LeadActionButton onClick={() => (entry.kind === 'task' ? handleToggleLinkedTask(entry.raw) : handleToggleLinkedEvent(entry.raw))} disabled={linkedEntryActionId !== null}>Zrobione</LeadActionButton>
                          <LeadActionButton onClick={() => (entry.kind === 'task' ? handleDeleteLinkedTask(entry.raw) : handleDeleteLinkedEvent(entry.raw))} disabled={linkedEntryActionId !== null}>Usuń</LeadActionButton>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ) : null}

            <section className="lead-detail-section-card" id="lead-history">
              <div className="lead-detail-section-head">
                <div>
                  <h2>Historia kontaktu</h2>

                </div>
              </div>
              {!leadInService ? (
                <form className="lead-detail-note-form" data-stage115c-inline-note-form="true" onSubmit={handleAddNote}>
                  <Textarea id="lead-detail-note-box" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Dodaj krótką notatkę po kontakcie..." className="lead-detail-note-input" lang="pl-PL" />
                  {noteInterimText ? <p className="lead-detail-note-transcript" lang="pl-PL">Dyktowanie: {noteInterimText}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={handleToggleNoteSpeech} disabled={!hasAccess}>
                      {noteListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {noteListening ? 'Zatrzymaj dyktowanie' : 'Dyktuj notatkę'}
                    </Button>
                    <Button
                      type="submit"
                      data-stage115c-inline-note-submit="true"
                      disabled={!note.trim() || !hasAccess || addingNote}
                    >
                      {addingNote ? 'Zapisywanie...' : 'Dodaj notatkę'}
                    </Button>
                  </div>
                </form>
              ) : null}
              <div className="lead-detail-history-list">
                {activities.length === 0 ? (
                  <div className="lead-detail-light-empty">Brak historii kontaktu.</div>
                ) : (
                  activities.map((activity) => (
                    <article key={String(activity.id || activity.eventType || activity.createdAt)} className="lead-detail-history-row">
                      <span className="lead-detail-history-dot"><Clock className="h-4 w-4" /></span>
                      <div>
                        <h3>{getActivityTitle(activity)}</h3>
                        <p>{getActivityDescription(activity)}</p>
                        <small>{formatDateTime(activity.createdAt, 'Brak daty')}</small>
                      </div>
                      {activity.eventType === 'note_added' ? (
                        <div className="lead-detail-history-actions">
                          <LeadActionButton onClick={() => openEditNote(activity)}>Edytuj</LeadActionButton>
                          <LeadActionButton onClick={() => handleDeleteNote(String(activity.id))}>Usuń</LeadActionButton>
                        </div>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </section>
          </section>

          {!leadInService ? (
          <aside className="lead-detail-right-rail" aria-label="Panel leada">
{/* CLOSEFLOW_LEAD_DETAIL_ADMIN_FEEDBACK_P1_2026_05_13: removed noisy right-rail card (Lead aktywny.) */}


            <section className="right-card lead-detail-right-card">
              <div className="lead-detail-card-title-row"><EntityIcon entity="case" className="h-4 w-4" /><h2>Powiązana sprawa</h2></div>
              <p>{serviceCaseId ? serviceCaseTitle : 'Lead nie został jeszcze przejęty do obsługi.'}</p>
              <small>{serviceCaseId ? serviceCaseStatusLabel : 'Utwórz klienta i sprawę, gdy temat jest gotowy do realizacji.'}</small>
              {serviceCaseId ? (
                <Button type="button" size="sm" variant="outline" onClick={openCase}>Otwórz sprawę</Button>
              ) : (
                <Button type="button" size="sm" onClick={() => setIsCreateCaseOpen(true)} disabled={!hasAccess}>Rozpocznij obsługę</Button>
              )}
            </section>

            <section className="right-card lead-detail-right-card" data-lead-finance-panel="true" data-stage115e-lead-finance-actions="true">
              <div className="lead-detail-card-title-row"><DollarSign className="h-4 w-4" /><h2>Finanse leada</h2></div>
              <small>Potencjał: {Number(leadFinancePanel.potential || 0).toLocaleString('pl-PL')} {leadFinance.currency}</small>
              <small>Wpłacono: {Number(leadFinancePanel.paid || 0).toLocaleString('pl-PL')} {leadFinance.currency}</small>
              <small>Do zapłaty: {Number(leadFinancePanel.remaining || 0).toLocaleString('pl-PL')} {leadFinance.currency}</small>
              <small>Status płatności: {billingStatusLabel(String(leadFinancePanel.billingStatus || lead?.billingStatus || 'not_started'))}</small>
              {!leadInService ? (
                <div className="lead-detail-right-actions">
                  <button type="button" data-stage115e-open-deposit-payment="true" onClick={() => openLeadPaymentDialog('deposit')} disabled={!hasAccess}>Dodaj zaliczkę</button>
                  <button type="button" data-stage115e-open-partial-payment="true" onClick={() => openLeadPaymentDialog('partial')} disabled={!hasAccess}>Płatność częściowa</button>
                </div>
              ) : null}
            </section>

            {!leadInService ? (
              <section className="right-card lead-detail-right-card">
                <div className="lead-detail-card-title-row"><Plus className="h-4 w-4" /><h2>Szybkie akcje</h2></div>
                <div className="lead-detail-right-actions">
                  <button type="button" onClick={() => setIsCreateCaseOpen(true)}>Rozpocznij obsługę</button>
                </div>
              </section>
            ) : null}

            <section className="right-card lead-detail-right-card">
              <div className="lead-detail-card-title-row"><Clock className="h-4 w-4" /><h2>Najbliższa akcja</h2></div>
              {nextTimelineEntry ? (
                <p>{nextTimelineEntry.title}</p>
              ) : (
                <p className="lead-detail-empty-value" data-lead-next-action-empty="-">-</p>
              )}
              <small>{nextTimelineEntry ? nextTimelineEntry.dateLabel : ''}</small>
            </section>


          {/* CLOSEFLOW_LEAD_DETAIL_ADMIN_FEEDBACK_P1_2026_05_13: removed noisy right-rail card (LeadAiNextAction) */}

          </aside>
          ) : null}
        </div>



        <Dialog open={isCreateCaseOpen} onOpenChange={setIsCreateCaseOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Rozpocznij obsługę</DialogTitle>
<DialogDescription>Uzupełnij dane i zapisz zmiany w kartotece leada.</DialogDescription></DialogHeader>
            <div className="lead-detail-dialog-grid">
              <Label>Tytuł sprawy<Input value={createCaseDraft.title} onChange={(event) => setCreateCaseDraft((current) => ({ ...current, title: event.target.value }))} /></Label>
              <Label>Klient<Input value={createCaseDraft.clientName} onChange={(event) => setCreateCaseDraft((current) => ({ ...current, clientName: event.target.value }))} /></Label>
              <Label>E-mail<Input value={createCaseDraft.clientEmail} onChange={(event) => setCreateCaseDraft((current) => ({ ...current, clientEmail: event.target.value }))} /></Label>
              <Label>Telefon<Input value={createCaseDraft.clientPhone} onChange={(event) => setCreateCaseDraft((current) => ({ ...current, clientPhone: event.target.value }))} /></Label>
              {availableCasesToLink.length > 0 ? (
                <Label>Podłącz istniejącą sprawę
                  <select className={modalSelectClass} value={linkCaseId} onChange={(event) => setLinkCaseId(event.target.value)}>
                    <option value="">Nie podpinaj</option>
                    {availableCasesToLink.map((entry: any) => (
                      <option key={String(entry.id)} value={String(entry.id)}>{String(entry.title || entry.clientName || 'Sprawa bez nazwy')}</option>
                    ))}
                  </select>
                </Label>
              ) : null}
            </div>
            <DialogFooter className={modalFooterClass()}>
              <Button type="button" variant="outline" onClick={() => setIsCreateCaseOpen(false)}>Anuluj</Button>
              {linkCaseId ? <Button type="button" variant="outline" onClick={handleLinkExistingCase} disabled={linkingCase}>{linkingCase ? 'Podpinam...' : 'Podepnij sprawę'}</Button> : null}
              <Button type="button" onClick={handleStartService} disabled={createCasePending}>{createCasePending ? 'Tworzę...' : 'Rozpocznij obsługę'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        <Dialog open={Boolean(leadPaymentDialogType)} onOpenChange={(open) => !open && closeLeadPaymentDialog()}>
          <DialogContent className="lead-detail-finance-dialog" data-stage115e-lead-payment-dialog="true">
            <DialogHeader>
              <DialogTitle>{leadPaymentDialogType === 'deposit' ? 'Dodaj zaliczkę' : 'Płatność częściowa'}</DialogTitle>
              <DialogDescription>Uzupełnij dane i zapisz zmiany w kartotece leada.</DialogDescription>
            </DialogHeader>
            <form className="lead-detail-dialog-grid lead-detail-finance-dialog-form" onSubmit={handleSaveLeadPayment}>
              <div className="lead-detail-finance-dialog-summary">
                <span>Potencjał: <strong>{Number(leadFinancePanel.potential || 0).toLocaleString('pl-PL')} {leadFinance.currency}</strong></span>
                <span>Wpłacono: <strong>{Number(leadFinancePanel.paid || 0).toLocaleString('pl-PL')} {leadFinance.currency}</strong></span>
                <span>Do zapłaty: <strong>{Number(leadFinancePanel.remaining || 0).toLocaleString('pl-PL')} {leadFinance.currency}</strong></span>
              </div>
              <Label>Kwota
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={leadPaymentAmount}
                  onChange={(event) => setLeadPaymentAmount(event.target.value)}
                  placeholder="0,00"
                  autoFocus
                />
              </Label>
              <Label>Notatka
                <Textarea
                  value={leadPaymentNote}
                  onChange={(event) => setLeadPaymentNote(event.target.value)}
                  placeholder="Opcjonalnie: czego dotyczy płatność"
                />
              </Label>
              <DialogFooter className={modalFooterClass()}>
                <Button type="button" variant="outline" onClick={closeLeadPaymentDialog} disabled={leadPaymentSaving}>Anuluj</Button>
                <Button type="submit" disabled={leadPaymentSaving || !leadPaymentAmount.trim()}>
                  {leadPaymentSaving ? 'Zapisuję...' : 'Zapisz płatność'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edytuj leada</DialogTitle>
<DialogDescription>Uzupełnij dane leada i zapisz zmiany w kartotece.</DialogDescription></DialogHeader>
            <div className="lead-detail-dialog-grid">
              <Label>Nazwa<Input value={editLead?.name || ''} onChange={(event) => setEditLead((current: any) => ({ ...current, name: event.target.value }))} /></Label>
              <Label>Firma<Input value={editLead?.company || ''} onChange={(event) => setEditLead((current: any) => ({ ...current, company: event.target.value }))} /></Label>
              <Label>Telefon<Input value={editLead?.phone || ''} onChange={(event) => setEditLead((current: any) => ({ ...current, phone: event.target.value }))} /></Label>
              <Label>E-mail<Input value={editLead?.email || ''} onChange={(event) => setEditLead((current: any) => ({ ...current, email: event.target.value }))} /></Label>
              <Label>Źródło<select className={modalSelectClass} value={editLead?.source || 'other'} onChange={(event) => setEditLead((current: any) => ({ ...current, source: event.target.value }))}>{SOURCE_OPTIONS.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select></Label>
              <Label>Wartość<Input type="number" value={editLead?.dealValue || ''} onChange={(event) => setEditLead((current: any) => ({ ...current, dealValue: event.target.value }))} /></Label>
              <Label>Notatka<Textarea value={editLead?.note || editLead?.notes || ''} onChange={(event) => setEditLead((current: any) => ({ ...current, note: event.target.value }))} /></Label>
            </div>
            <DialogFooter className={modalFooterClass()}><Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Anuluj</Button><Button type="button" onClick={handleUpdateLead}>Zapisz</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(editLinkedTask)} onOpenChange={(open) => !open && setEditLinkedTask(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edytuj zadanie</DialogTitle>
<DialogDescription>Uzupełnij dane zadania i zapisz, aby zaplanować pracę przy leadzie.</DialogDescription></DialogHeader>
            {editLinkedTask ? <div className="lead-detail-dialog-grid">
              <Label>Tytuł<Input value={editLinkedTask.title} onChange={(event) => setEditLinkedTask((current: any) => ({ ...current, title: event.target.value }))} /></Label>
              <Label>Typ<select className={modalSelectClass} value={editLinkedTask.type} onChange={(event) => setEditLinkedTask((current: any) => ({ ...current, type: event.target.value }))}>{TASK_TYPES.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select></Label>
              <Label>Termin<Input type="datetime-local" value={editLinkedTask.dueAt} onChange={(event) => setEditLinkedTask((current: any) => ({ ...current, dueAt: event.target.value }))} /></Label>
              <Label>Status<select className={modalSelectClass} value={editLinkedTask.status} onChange={(event) => setEditLinkedTask((current: any) => ({ ...current, status: event.target.value }))}><option value="todo">Do zrobienia</option><option value="in_progress">W trakcie</option><option value="done">Zrobione</option></select></Label>
              <Label>Powtarzanie<select className={modalSelectClass} value={editLinkedTask.recurrenceRule} onChange={(event) => setEditLinkedTask((current: any) => ({ ...current, recurrenceRule: event.target.value }))}>{SIMPLE_RECURRENCE_OPTIONS.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select></Label>
            </div> : null}
            <DialogFooter className={modalFooterClass()}><Button type="button" variant="outline" onClick={() => setEditLinkedTask(null)}>Anuluj</Button><Button type="button" onClick={handleSaveLinkedTaskEdit} disabled={editLinkedTaskSubmitting}>{editLinkedTaskSubmitting ? 'Zapisuję...' : 'Zapisz'}</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(editLinkedEvent)} onOpenChange={(open) => !open && setEditLinkedEvent(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edytuj wydarzenie</DialogTitle>
<DialogDescription>Uzupełnij dane wydarzenia i zapisz, aby zaplanować termin przy leadzie.</DialogDescription></DialogHeader>
            {editLinkedEvent ? <div className="lead-detail-dialog-grid">
              <Label>Tytuł<Input value={editLinkedEvent.title} onChange={(event) => setEditLinkedEvent((current: any) => ({ ...current, title: event.target.value }))} /></Label>
              <Label>Typ<select className={modalSelectClass} value={editLinkedEvent.type} onChange={(event) => setEditLinkedEvent((current: any) => ({ ...current, type: event.target.value }))}>{EVENT_TYPES.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select></Label>
              <Label>Start<Input type="datetime-local" value={editLinkedEvent.startAt} onChange={(event) => setEditLinkedEvent((current: any) => ({ ...current, startAt: event.target.value }))} /></Label>
              <Label>Koniec<Input type="datetime-local" value={editLinkedEvent.endAt} onChange={(event) => setEditLinkedEvent((current: any) => ({ ...current, endAt: event.target.value }))} /></Label>
              <Label>Status<select className={modalSelectClass} value={editLinkedEvent.status} onChange={(event) => setEditLinkedEvent((current: any) => ({ ...current, status: event.target.value }))}><option value="scheduled">Zaplanowane</option><option value="completed">Zrobione</option><option value="cancelled">Anulowane</option></select></Label>
            </div> : null}
            <DialogFooter className={modalFooterClass()}><Button type="button" variant="outline" onClick={() => setEditLinkedEvent(null)}>Anuluj</Button><Button type="button" onClick={handleSaveLinkedEventEdit} disabled={editLinkedEventSubmitting}>{editLinkedEventSubmitting ? 'Zapisuję...' : 'Zapisz'}</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(editingNote)} onOpenChange={(open) => !open && setEditingNote(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edytuj notatkę</DialogTitle>
<DialogDescription>Uzupełnij treść notatki i zapisz ją w historii leada.</DialogDescription></DialogHeader>
            <Textarea value={editingNoteContent} onChange={(event) => setEditingNoteContent(event.target.value)} />
            <DialogFooter className={modalFooterClass()}><Button type="button" variant="outline" onClick={() => setEditingNote(null)}>Anuluj</Button><Button type="button" onClick={handleSaveEditedNote}>Zapisz</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </Layout>
  );
}
