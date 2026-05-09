import {
  ClientEntityIcon,
  EntityIcon,
  LeadEntityIcon,
  TemplateEntityIcon } from '../components/ui-system';
// LEAD_TO_CASE_FLOW_STAGE24_LEAD_DETAIL
/*
LEAD_DETAIL_VISUAL_REBUILD_STAGE14
Active lead is sales work. Moved lead is acquisition history with a link to Case.
*/
const A16_V2_VOICE_NOTE_AUTOSAVE_ALLOWED = 'voice-notes-may-autosave-after-dictation-silence';
const A24_LEAD_TO_CASE_COPY_LOCK = 'Rozpocznij obsługę | Ten temat jest już w obsłudze | Otwórz sprawę';
const STAGE84_LEAD_DETAIL_WORK_CENTER = 'Lead Detail pokazuje centrum pracy: ostatni ruch, dni bez ruchu, najblizsza akcja i powod ryzyka';
const STAGE88_LEAD_DETAIL_ADMIN_FEEDBACK_HOTFIX = 'LeadDetail cleans noisy helper copy and protects right rail readability';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode } from 'react';
import { useNavigate,
  useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit2,
  Loader2,
  Mail,
  MoreVertical,
  Mic,
  MicOff,
  Phone,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { actionButtonClass, modalFooterClass} from '../components/entity-actions';
import { openContextQuickAction, type ContextActionKind } from '../components/ContextActionDialogs';
import LeadAiFollowupDraft from '../components/LeadAiFollowupDraft';
import LeadAiNextAction from '../components/LeadAiNextAction';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
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

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nowy' },
  { value: 'contacted', label: 'Skontaktowany' },
  { value: 'qualification', label: 'Kwalifikacja' },
  { value: 'proposal_sent', label: 'Oferta wysłana' },
  { value: 'waiting_response', label: 'Czeka na odpowiedź' },
  { value: 'accepted', label: 'Zaakceptowany' },
  { value: 'moved_to_service', label: 'Przeniesiony do obsługi' },
  { value: 'negotiation', label: 'Negocjacje' },
  { value: 'lost', label: 'Przegrany' },
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
  return STATUS_OPTIONS.find((entry) => entry.value === status)?.label || status || 'Lead';
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
function taskStatusLabel(status?: string) {
  if (status === 'done' || status === 'completed') return 'Zrobione';
  if (status === 'cancelled' || status === 'canceled') return 'Anulowane';
  if (status === 'in_progress') return 'W trakcie';
  return 'Do zrobienia';
}
function eventStatusLabel(status?: string) {
  if (status === 'done' || status === 'completed') return 'Zrobione';
  if (status === 'cancelled' || status === 'canceled') return 'Anulowane';
  return 'Zaplanowane';
}
function statusClass(status?: string) {
  if (status === 'done' || status === 'completed') return 'lead-detail-pill-green';
  if (status === 'lost' || status === 'cancelled' || status === 'canceled') return 'lead-detail-pill-muted';
  if (status === 'waiting_response' || status === 'proposal_sent' || status === 'negotiation') return 'lead-detail-pill-amber';
  if (status === 'moved_to_service' || status === 'accepted') return 'lead-detail-pill-purple';
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
  switch (activity?.eventType) {
    case 'status_changed':
      return 'Zmieniono status';
    case 'note_added':
      return 'Dodano notatkę';
    case 'case_created':
      return 'Utworzono sprawę';
    case 'case_linked':
      return 'Podpięto sprawę';
    case 'lead_moved_to_service':
      return 'Ten temat jest już w obsłudze';
    case 'task_updated':
    case 'task_status_toggled':
      return 'Zmieniono zadanie';
    case 'task_deleted':
      return 'Usunięto zadanie';
    case 'event_updated':
    case 'event_status_toggled':
      return 'Zmieniono wydarzenie';
    case 'event_deleted':
      return 'Usunięto wydarzenie';
    default:
      return 'Aktywność';
  }
}
function getActivityDescription(activity: any) {
  const payload = activity?.payload || {};
  return (
    asText(payload.content) ||
    asText(payload.note) ||
    asText(payload.title) ||
    asText(payload.status && statusLabel(String(payload.status))) ||
    'Ruch zapisany w historii leada.'
  );
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
  const taskEntries = tasks.map((task) => ({
    id: `task:${String(task.id || '')}`,
    kind: 'task' as const,
    title: String(task.title || 'Zadanie bez tytułu'),
    status: String(task.status || 'todo'),
    statusLabel: taskStatusLabel(String(task.status || 'todo')),
    dateValue: getTaskDate(task),
    dateLabel: formatDateTime(getTaskDate(task)),
    raw: task,
  }));

  const eventEntries = events.map((event) => ({
    id: `event:${String(event.id || '')}`,
    kind: 'event' as const,
    title: String(event.title || 'Wydarzenie bez tytułu'),
    status: String(event.status || 'scheduled'),
    statusLabel: eventStatusLabel(String(event.status || 'scheduled')),
    dateValue: getEventDate(event),
    dateLabel: formatDateTime(getEventDate(event)),
    raw: event,
  }));

  return [...taskEntries, ...eventEntries].sort((left, right) => {
    const leftDone = isDoneStatus(left.status) ? 1 : 0;
    const rightDone = isDoneStatus(right.status) ? 1 : 0;
    if (leftDone !== rightDone) return leftDone - rightDone;
    return (asDate(left.dateValue)?.getTime() ?? Number.MAX_SAFE_INTEGER) - (asDate(right.dateValue)?.getTime() ?? Number.MAX_SAFE_INTEGER);
  });
}
function InfoLine({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="lead-detail-info-line">
      <span><Icon className="h-4 w-4" /></span>
      <div>
        <small>{label}</small>
        <strong>{value || '-'}</strong>
      </div>
    </div>
  );
}
function LeadActionButton({ children, onClick, disabled }: { children: ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button type="button" className="lead-detail-chip-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_LEAD_DETAIL = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';

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
  const [leadPayments, setLeadPayments] = useState<any[]>([]);
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
  const [editLinkedTask, setEditLinkedTask] = useState<any | null>(null);
  const [editLinkedEvent, setEditLinkedEvent] = useState<any | null>(null);
  const [editLinkedTaskSubmitting, setEditLinkedTaskSubmitting] = useState(false);
  const [editLinkedEventSubmitting, setEditLinkedEventSubmitting] = useState(false);
  const [isLeadPaymentOpen, setIsLeadPaymentOpen] = useState(false);
  const [leadPaymentSubmitting, setLeadPaymentSubmitting] = useState(false);
  const [leadPaymentDraft, setLeadPaymentDraft] = useState({
    type: 'deposit',
    amount: '',
    status: 'deposit_paid',
    dueAt: '',
    note: '',
  });
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
      // CLOSEFLOW_LEAD_SETTLEMENT_DYNAMIC_V29_PAYMENTS
      const basePaymentRows = Array.isArray(paymentRows) ? paymentRows : [];
      const casePaymentRows = currentCaseId
        ? await fetchPaymentsFromSupabase({ caseId: currentCaseId }).catch(() => [])
        : [];
      const mergedPaymentRows = dedupeById([
        ...basePaymentRows,
        ...(Array.isArray(casePaymentRows) ? casePaymentRows : []),
      ] as any[]);
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
      setLeadPayments(mergedPaymentRows);
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
  const showServiceBanner = leadInService;
  const leadFinance = useMemo(() => getLeadFinance(lead), [lead]);
  const leadFinancePanel = useMemo(() => {
    const paidFromPayments = leadPayments
      .filter((entry) => isPaidPaymentStatus(entry?.status))
      .reduce((sum, entry) => sum + (Number(entry?.amount) || 0), 0);
    const legacyPaid = Array.isArray(lead?.partialPayments)
      ? lead.partialPayments.reduce((sum: number, entry: any) => sum + (Number(entry?.amount) || 0), 0)
      : 0;
    const paid = paidFromPayments > 0 ? paidFromPayments : legacyPaid;
    // CLOSEFLOW_LEAD_SETTLEMENT_DYNAMIC_V29_CASE_VALUE
    const casePotentialRaw =
      associatedCase?.expectedRevenue ??
      (associatedCase as any)?.expected_revenue ??
      (associatedCase as any)?.caseValue ??
      (associatedCase as any)?.case_value ??
      (associatedCase as any)?.dealValue ??
      (associatedCase as any)?.deal_value ??
      (associatedCase as any)?.value ??
      0;
    const casePotential = Number(casePotentialRaw || 0);
    const potential = Math.max(0, Number.isFinite(casePotential) && casePotential > 0 ? casePotential : Number(leadFinance.dealValue || 0));
    const remaining = Math.max(0, potential - paid);
    const billingStatus = deriveBillingStatus(potential, paid, leadPayments);
    return { potential, paid, remaining, billingStatus };
  }, [associatedCase, lead?.partialPayments, leadFinance.dealValue, leadPayments]);

  const leadPrimaryNoteText = useMemo(() => {
    const directNote =
      asText(lead?.note) ||
      asText(lead?.notes) ||
      asText(lead?.noteText) ||
      asText(lead?.note_text);

    if (directNote) return directNote;

    const noteActivities = [...activities]
      .filter((activity) => {
        const type = String(activity?.eventType || activity?.event_type || activity?.type || '').toLowerCase();
        return type === 'note_added' || type.includes('note');
      })
      .sort((left, right) => {
        const leftDate = asDate(left?.happenedAt || left?.createdAt || left?.updatedAt);
        const rightDate = asDate(right?.happenedAt || right?.createdAt || right?.updatedAt);
        return (rightDate?.getTime() || 0) - (leftDate?.getTime() || 0);
      });

    return noteActivities[0] ? getActivityDescription(noteActivities[0]) : '';
  }, [activities, lead?.note, lead?.notes, lead?.noteText, lead?.note_text]);

  
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
    setLeadPaymentDraft({
      type,
      amount: '',
      status: type === 'deposit' ? 'deposit_paid' : 'partially_paid',
      dueAt: '',
      note: '',
    });
    setIsLeadPaymentOpen(true);
  };
  const handleSaveLeadPayment = async () => {
    if (!leadId || !hasAccess) return;
    const amount = Number(leadPaymentDraft.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawną kwotę płatności.');
      return;
    }
    try {
      setLeadPaymentSubmitting(true);
      await createPaymentInSupabase({
        leadId,
        clientId: lead?.clientId || null,
        caseId: serviceCaseId || null,
        type: leadPaymentDraft.type,
        status: leadPaymentDraft.status || 'awaiting_payment',
        amount,
        currency: leadFinance.currency || 'PLN',
        dueAt: leadPaymentDraft.dueAt || null,
        paidAt: isPaidPaymentStatus(leadPaymentDraft.status) ? new Date().toISOString() : null,
        note: leadPaymentDraft.note || '',
      });
      const paidAfter = leadFinancePanel.paid + (isPaidPaymentStatus(leadPaymentDraft.status) ? amount : 0);
      const nextBillingStatus = deriveBillingStatus(leadFinancePanel.potential, paidAfter, [
        ...leadPayments,
        { type: leadPaymentDraft.type, status: leadPaymentDraft.status, amount },
      ]);
      await updateLeadInSupabase({ id: leadId, billingStatus: nextBillingStatus }).catch(() => null);
      // CLOSEFLOW_LEAD_SETTLEMENT_DYNAMIC_V29_CASE_UPDATE
      if (serviceCaseId) {
        await updateCaseInSupabase({
          id: serviceCaseId,
          paidAmount: paidAfter,
          remainingAmount: Math.max(0, leadFinancePanel.potential - paidAfter),
          billingStatus: nextBillingStatus,
        }).catch(() => null);
      }
      setIsLeadPaymentOpen(false);
      await loadLead();
      toast.success('Płatność leada zapisana.');
    } catch (error: any) {
      toast.error(`Nie udało się zapisać płatności: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLeadPaymentSubmitting(false);
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
      nextActionLabel: nextTimelineEntry ? `${nextTimelineEntry.title} · ${nextTimelineEntry.dateLabel}` : 'Brak zaplanowanych działań',
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
          <h2>Co tu trzeba zrobić teraz</h2>
          <p>Krótki panel decyzyjny bez skakania po zadaniach, kalendarzu i historii.</p>
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

      <div className="lead-detail-work-reason">
        <small>Powód ryzyka</small>
        <p>{leadWorkCenter.riskReason}</p>
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
            <EntityIcon entity="template" className="h-4 w-4" /> Dopisz notatkę
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

  const noteText = String(lead.note || lead.notes || 'Brak notatki.');

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
              <span className={`lead-detail-pill ${statusClass(String(lead.status || 'new'))}`}>{statusLabel(String(lead.status || 'new'))}</span>
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
          <section className="lead-detail-main-column">
            {!leadInService ? (
              <section className="lead-detail-top-grid">
                <article className="lead-detail-top-card lead-detail-callout-blue">
                  <div className="lead-detail-card-title-row"><Clock className="h-4 w-4" /><h2>Najbliższa zaplanowana akcja</h2></div>
                  {nextTimelineEntry ? (
                    <>
                      <strong>{nextTimelineEntry.title}</strong>
                      <p>{nextTimelineEntry.kind === 'task' ? 'Zadanie' : 'Wydarzenie'} · {nextTimelineEntry.dateLabel}</p>
                      <span className={`lead-detail-pill ${statusClass(nextTimelineEntry.status)}`}>{nextTimelineEntry.statusLabel}</span>
                    </>
                  ) : (
                    <p>Brak zaplanowanych działań.</p>
                  )}
                </article>
                <article className="lead-detail-top-card lead-detail-callout-green">
                  <div className="lead-detail-card-title-row"><DollarSign className="h-4 w-4" /><h2>Wartość</h2></div>
                  <strong>{leadFinance.formatted}</strong>
                  <p>{sourceLabel(lead.source)} · {statusLabel(lead.status)}</p>
                </article>
                <article className="lead-detail-top-card lead-detail-callout-amber">
                  <div className="lead-detail-card-title-row"><EntityIcon entity="lead" className="h-4 w-4" /><h2>Aktywny lead</h2></div>
                  <strong>{sortedLinkedTasks.length + sortedLinkedEvents.length}</strong>
                  <p>powiązane zadania i wydarzenia sprzedażowe.</p>
                </article>
              </section>
            ) : null}

            <section className="lead-detail-section-card">
              <div className="lead-detail-section-head">
                <div>
                  <h2>Dane kontaktowe</h2>
                  <p>Najważniejsze dane źródłowe leada.</p>
                </div>
              </div>
              <div className="lead-detail-contact-grid">
                <InfoLine icon={ClientEntityIcon} label="Osoba" value={String(lead.name || '-')} />
                <InfoLine icon={Phone} label="Telefon" value={String(lead.phone || '-')} />
                <InfoLine icon={Mail} label="E-mail" value={String(lead.email || '-')} />
                <InfoLine icon={TemplateEntityIcon} label="Firma" value={String(lead.company || '-')} />
                <InfoLine icon={LeadEntityIcon} label="Zrodlo" value={sourceLabel(lead.source)} />
              </div>
              <div className="lead-detail-note-box">
                <small>Notatka</small>
                <p className="lead-detail-note-text" lang="pl-PL">{leadPrimaryNoteText || 'Brak notatki.'}</p>
              </div>
            </section>

            {!leadInService ? (
              <section className="lead-detail-section-card">
                <div className="lead-detail-section-head">
                  <div>
                    <h2>Zadania i wydarzenia</h2>
                    <p></p>
                  </div>
                  <div hidden data-lead-detail-stage35-removed-local-create-actions="true" />
                </div>
                <div className="lead-detail-work-list">
                  {timeline.length === 0 ? (
                    <div className="lead-detail-light-empty">Brak zaplanowanych działań.</div>
                  ) : (
                    timeline.map((entry) => (
                      <article key={entry.id} className="lead-detail-work-row">
                        <span className="lead-detail-work-icon">{entry.kind === 'task' ? <CheckCircle2 className="h-4 w-4" /> : <EntityIcon entity="event" className="h-4 w-4" />}</span>
                        <div>
                          <small>{entry.kind === 'task' ? 'Zadanie' : 'Wydarzenie'}</small>
                          <h3>{entry.title}</h3>
                          <p>{entry.dateLabel}</p>
                        </div>
                        <span className={`lead-detail-pill ${statusClass(entry.status)}`}>{entry.statusLabel}</span>
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
                <form className="lead-detail-note-form" onSubmit={handleAddNote}>
                  <Textarea id="lead-detail-note-box" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Dodaj krotka notatke po kontakcie..." className="lead-detail-note-input" lang="pl-PL" />
                  {noteInterimText ? <p className="lead-detail-note-transcript" lang="pl-PL">Dyktowanie: {noteInterimText}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={handleToggleNoteSpeech} disabled={!hasAccess}>
                      {noteListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {noteListening ? 'Zatrzymaj dyktowanie' : 'Dyktuj notatk'}
                    </Button>
                    <Button type="submit" disabled={!note.trim() || !hasAccess || addingNote}>
                      {addingNote ? 'Zapisywanie...' : 'Dodaj notatk'}
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
            <section className="right-card lead-detail-right-card">
              <div className="lead-detail-card-title-row"><EntityIcon entity="lead" className="h-4 w-4" /><h2>Status leada</h2></div>
              <span className={`lead-detail-pill ${statusClass(String(lead.status || 'new'))}`}>{statusLabel(String(lead.status || 'new'))}</span>
              <p>{leadInService ? 'Lead jest już źródłem historii. Pracuj dalej w sprawie.' : 'Lead aktywny. Możesz prowadzić kontakt sprzedażowy.'}</p>
            </section>

            <section className="right-card lead-detail-right-card">
              <div className="lead-detail-card-title-row"><EntityIcon entity="case" className="h-4 w-4" /><h2>Powiązana sprawa</h2></div>
              <p>{serviceCaseId ? serviceCaseTitle : 'Brak powiązanej sprawy'}</p>
              <small>{serviceCaseId ? serviceCaseStatusLabel : 'Po rozpoczęciu obsługi pojawi się tutaj link do sprawy.'}</small>
              {serviceCaseId ? <Button type="button" size="sm" variant="outline" onClick={openCase}>Otwórz sprawę</Button> : null}
            </section>

            <section className="right-card lead-detail-right-card" data-lead-finance-panel="true">
              <div className="lead-detail-card-title-row"><DollarSign className="h-4 w-4" /><h2>Finanse leada</h2></div>
              <small>Potencjał: {Number(leadFinancePanel.potential || 0).toLocaleString('pl-PL')} {leadFinance.currency}</small>
              <small>Wpłacono: {Number(leadFinancePanel.paid || 0).toLocaleString('pl-PL')} {leadFinance.currency}</small>
              <small>Do zapłaty: {Number(leadFinancePanel.remaining || 0).toLocaleString('pl-PL')} {leadFinance.currency}</small>
              <small>Status płatności: {billingStatusLabel(String(lead?.billingStatus || leadFinancePanel.billingStatus || 'not_started'))}</small>
              {!leadInService ? (
                <div className="lead-detail-right-actions">
                  <button type="button" onClick={() => openLeadPaymentDialog('deposit')} disabled={!hasAccess}>Dodaj zaliczkę</button>
                  <button type="button" onClick={() => openLeadPaymentDialog('partial')} disabled={!hasAccess}>Płatność częściowa</button>
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
              <p>{nextTimelineEntry ? nextTimelineEntry.title : 'Brak zaplanowanych działań.'}</p>
              <small>{nextTimelineEntry ? nextTimelineEntry.dateLabel : ''}</small>
            </section>

            <section className="right-card lead-detail-right-card">
              <div className="lead-detail-card-title-row"><EntityIcon entity="ai" className="h-4 w-4" /><h2>AI wsparcie</h2></div>
              {workCenterPanel}
              <Tabs defaultValue="next-action">
                <TabsList className="lead-detail-ai-tabs-list w-full">
                  <TabsTrigger value="next-action" className="lead-detail-ai-tabs-trigger flex-1">Nastepny ruch</TabsTrigger>
                  <TabsTrigger value="followup" className="lead-detail-ai-tabs-trigger flex-1">Follow-up</TabsTrigger>
                </TabsList>
                <TabsContent value="next-action" className="lead-detail-ai-tabs-content mt-3">
                  <LeadAiNextAction
                    lead={lead}
                    tasks={linkedTasks}
                    events={linkedEvents}
                     activities={activities}
                     disabled={leadInService}
                     onTaskCreated={() => void loadLead()}
                   />
                </TabsContent>
                <TabsContent value="followup" className="lead-detail-ai-tabs-content mt-3">
                  {!leadInService && (<LeadAiFollowupDraft lead={lead} tasks={linkedTasks} events={linkedEvents} activities={activities} disabled={leadInService} />)}
                </TabsContent>
              </Tabs>
            </section>
          </aside>
          ) : null}
        </div>

        <Dialog open={isLeadPaymentOpen} onOpenChange={setIsLeadPaymentOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{leadPaymentDraft.type === 'deposit' ? 'Dodaj zaliczkę' : 'Dodaj płatność częściową'}</DialogTitle></DialogHeader>
            <div className="lead-detail-dialog-grid">
              <Label>Kwota<Input type="number" min="0" step="0.01" value={leadPaymentDraft.amount} onChange={(event) => setLeadPaymentDraft((current) => ({ ...current, amount: event.target.value }))} /></Label>
              <Label>Status<select className={modalSelectClass} value={leadPaymentDraft.status} onChange={(event) => setLeadPaymentDraft((current) => ({ ...current, status: event.target.value }))}><option value="awaiting_payment">Czeka na płatność</option><option value="deposit_paid">Zaliczka wpłacona</option><option value="partially_paid">Częściowo opłacone</option><option value="paid">Opłacone</option></select></Label>
              <Label>Termin płatności<Input type="date" value={leadPaymentDraft.dueAt} onChange={(event) => setLeadPaymentDraft((current) => ({ ...current, dueAt: event.target.value }))} /></Label>
              <Label>Notatka<Textarea value={leadPaymentDraft.note} onChange={(event) => setLeadPaymentDraft((current) => ({ ...current, note: event.target.value }))} /></Label>
            </div>
            <DialogFooter className={modalFooterClass()}><Button type="button" variant="outline" onClick={() => setIsLeadPaymentOpen(false)}>Anuluj</Button><Button type="button" onClick={handleSaveLeadPayment} disabled={leadPaymentSubmitting}>{leadPaymentSubmitting ? 'Zapisywanie...' : 'Zapisz płatność'}</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateCaseOpen} onOpenChange={setIsCreateCaseOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Rozpocznij obsługę</DialogTitle></DialogHeader>
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

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edytuj leada</DialogTitle></DialogHeader>
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
            <DialogHeader><DialogTitle>Edytuj zadanie</DialogTitle></DialogHeader>
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
            <DialogHeader><DialogTitle>Edytuj wydarzenie</DialogTitle></DialogHeader>
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
            <DialogHeader><DialogTitle>Edytuj notatkę</DialogTitle></DialogHeader>
            <Textarea value={editingNoteContent} onChange={(event) => setEditingNoteContent(event.target.value)} />
            <DialogFooter className={modalFooterClass()}><Button type="button" variant="outline" onClick={() => setEditingNote(null)}>Anuluj</Button><Button type="button" onClick={handleSaveEditedNote}>Zapisz</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </Layout>
  );
}



