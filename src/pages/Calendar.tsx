import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Repeat,
  Trash2, Plus
} from 'lucide-react';
import { EntityIcon, NotificationEntityIcon } from '../components/ui-system';
import { consumeGlobalQuickAction, subscribeGlobalQuickAction } from '../components/GlobalQuickActions';
import { actionButtonClass as entityActionButtonClass } from '../components/entity-actions';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TopicContactPicker } from '../components/topic-contact-picker';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import {
  buildStartEndPair,
  combineScheduleEntries,
  createDefaultRecurrence,
  createDefaultReminder,
  getEntriesForDay,
  getEntryTone,
  getTaskStartAt,
  normalizeRecurrenceConfig,
  normalizeReminderConfig,
  syncTaskDerivedFields,
  toDateTimeLocalValue,
  toReminderAtIso,
  type ScheduleEntry
} from '../lib/scheduling';
import {
  EVENT_TYPES,
  PRIORITY_OPTIONS,
  RECURRENCE_OPTIONS,
  REMINDER_MODE_OPTIONS,
  REMINDER_OFFSET_OPTIONS,
  TASK_TYPES
} from '../lib/options';
import { buildConflictCandidates, confirmScheduleConflicts } from '../lib/schedule-conflicts';
import {
  buildTopicContactOptions,
  findTopicContactOption,
  resolveTopicContactLink,
  type TopicContactOption
} from '../lib/topic-contact';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  deleteEventFromSupabase,
  deleteTaskFromSupabase,
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  insertActivityToSupabase,
  insertEventToSupabase,
  insertTaskToSupabase,
  updateEventInSupabase,
  updateTaskInSupabase
} from '../lib/supabase-fallback';
import { subscribeCloseflowDataMutations } from '../lib/supabase-fallback';
import { auth } from '../firebase';
import {
  addDays,
  addHours,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths
} from 'date-fns';
import { toast } from 'sonner';
import { useWorkspace } from '../hooks/useWorkspace';

import Layout from '../components/Layout';

import { pl } from 'date-fns/locale';

import '../styles/visual-stage22-event-form-vnext.css';

import { normalizeWorkItem } from '../lib/work-items/normalize';

import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-calendar-skin-only-v1.css';
import '../styles/closeflow-calendar-color-tooltip-v2.css';
import '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css';
// CLOSEFLOW_CARD_READABILITY_CONTRACT_STAGE7_CALENDAR

type CalendarEditDraft = {
  title: string;
  type: string;
  startAt: string;
  endAt: string;
  leadId: string;
  caseId: string;
  clientId?: string;
  relationQuery: string;
  priority: string;
  status?: string;
  recurrence: ReturnType<typeof createDefaultRecurrence>;
  reminder: ReturnType<typeof createDefaultReminder>;
};

type CalendarScale = 'compact' | 'default' | 'large';

type CalendarView = 'week' | 'month';

const EVENT_FORM_VISUAL_REBUILD_STAGE22 = 'EVENT_FORM_VISUAL_REBUILD_STAGE22';
const STAGE34_CALENDAR_COMPLETED_VISIBILITY = 'STAGE34_CALENDAR_COMPLETED_VISIBILITY calendar-entry-completed data-calendar-entry-completed data-calendar-stage34="readability-status-forms"';
const EVENT_FORM_STAGE22_HUMAN_COPY = 'Nowe wydarzenie Edytuj wydarzenie Tytuł Typ Data Start Koniec Powiązanie Opis Status Zapisz wydarzenie Podaj tytuł wydarzenia. Wybierz poprawną datę. Godzina końca nie może być przed startem.';

const CLOSEFLOW_FB1_CALENDAR_COPY_NOISE_CLEANUP = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';
const CALENDAR_SCALE_STORAGE_KEY = 'leadflow-calendar-scale';
const CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2 = 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_2026_05_12';
const CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1 = 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_2026_05_12';
const CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2 = 'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_2026_05_12';
const CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1 = 'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_2026_05_12';
const CLOSEFLOW_CALENDAR_SKIN_ONLY_V1 = 'CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_2026_05_12';
const CALENDAR_VIEW_STORAGE_KEY = 'closeflow:calendar:view:v1';
const modalSelectClass = 'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

function readCalendarRawText(value: unknown, fallback = '') {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return fallback;
}
function readScheduleRawText(raw: ScheduleEntry['raw'] | null | undefined, key: string, fallback = '') {
  if (!raw || typeof raw !== 'object') return fallback;
  const value = (raw as Record<string, unknown>)[key];
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return fallback;
}

function createEntryActionClass() {
  return 'inline-flex h-[30px] w-auto min-w-0 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-[12px] font-bold leading-none text-slate-700 shadow-none transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50';
}

function toCalendarDateInput(value: unknown, fallback: string) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();
  if (typeof value === 'string' && value.trim()) return value.trim();
  return fallback;
}

function buildEditDraft(entry: ScheduleEntry): CalendarEditDraft {
  const normalized = normalizeWorkItem(entry.raw);
  if (entry.kind === 'event') {
    return {
      title: readCalendarRawText(entry.raw?.title, entry.title),
      type: readCalendarRawText(entry.raw?.type, 'meeting'),
      startAt: normalized.dateAt || normalized.startAt || entry.startsAt,
      endAt: normalized.endAt || readCalendarRawText(entry.raw?.endAt, entry.endsAt || buildStartEndPair(entry.startsAt).endAt),
      leadId: readCalendarRawText(normalized.leadId),
      caseId: readCalendarRawText(normalized.caseId),
      relationQuery: entry.raw?.caseId ? (readCalendarRawText(entry.raw?.title, entry.title)) : readCalendarRawText(entry.raw?.leadName),
      priority: 'medium',
      recurrence: normalizeRecurrenceConfig(entry.raw?.recurrence || { mode: entry.raw?.recurrenceRule || 'none' }),
      reminder: normalizeReminderConfig(entry.raw?.reminder || (entry.raw?.reminderAt ? { mode: 'once', minutesBefore: 60 } : createDefaultReminder())),
    };
  }

  if (entry.kind === 'task') {
    return {
      title: readCalendarRawText(entry.raw?.title, entry.title),
      type: readCalendarRawText(entry.raw?.type, 'follow_up'),
      startAt: normalized.dateAt || getTaskStartAt(entry.raw) || entry.startsAt,
      endAt: '',
      leadId: readCalendarRawText(normalized.leadId),
      caseId: readCalendarRawText(normalized.caseId),
      relationQuery: entry.raw?.caseId ? (readCalendarRawText(entry.raw?.title, entry.title)) : readCalendarRawText(entry.raw?.leadName),
      priority: readCalendarRawText(entry.raw?.priority, 'medium'),
      recurrence: normalizeRecurrenceConfig(entry.raw?.recurrence || { mode: entry.raw?.recurrenceRule || 'none' }),
      reminder: normalizeReminderConfig(entry.raw?.reminder || (entry.raw?.reminderAt ? { mode: 'once', minutesBefore: 60 } : createDefaultReminder())),
    };
  }

  return {
    title: entry.title,
    type: 'follow_up',
    startAt: normalized.dateAt || entry.startsAt,
    endAt: '',
    leadId: readCalendarRawText(normalized.leadId),
    caseId: readCalendarRawText(normalized.caseId),
    relationQuery: readCalendarRawText(entry.raw?.leadName),
    priority: readCalendarRawText(entry.raw?.priority, 'medium'),
    recurrence: normalizeRecurrenceConfig(entry.raw?.recurrence || { mode: entry.raw?.recurrenceRule || 'none' }),
    reminder: normalizeReminderConfig(entry.raw?.reminder || (entry.raw?.reminderAt ? { mode: 'once', minutesBefore: 60 } : createDefaultReminder())),
  };
}

function getEntrySubtitle(entry: ScheduleEntry) {
  if (entry.leadName) {
    return `Lead: ${entry.leadName}`;
  }

  return '';
}

function getCalendarEntryStatus(entry: ScheduleEntry) {
  return String(entry.raw?.status || '').toLowerCase();
}

function isCompletedCalendarEntry(entry: ScheduleEntry) {
  // STAGE34B_CALENDAR_COMPLETED_VISIBILITY: completed tasks/events/leads stay visible but are clearly crossed out.
  const status = getCalendarEntryStatus(entry);
  const doneStatuses = new Set([
    'done',
    'completed',
    'complete',
    'finished',
    'closed',
    'zrobione',
    'wykonane',
    'archived',
  ]);

  return (
    doneStatuses.has(status) ||
    entry.raw?.done === true ||
    entry.raw?.isDone === true ||
    entry.raw?.is_done === true ||
    Boolean(entry.raw?.completedAt || entry.raw?.completed_at || entry.raw?.doneAt || entry.raw?.done_at)
  );
}

function sortCalendarEntriesForDisplay(entries: ScheduleEntry[]) {
  return [...entries].sort((a, b) => {
    const aDone = isCompletedCalendarEntry(a);
    const bDone = isCompletedCalendarEntry(b);

    if (aDone !== bDone) {
      return aDone ? 1 : -1;
    }

    return parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime();
  });
}

function capitalizeCalendarLabel(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatCalendarItemCount(count: number) {
  if (count === 1) return '1 rzecz';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${count} rzeczy`;
  }
  return `${count} rzeczy`;
}

function getCalendarEntryTypeLabel(entry: ScheduleEntry) {
  if (entry.kind === 'event') return 'Wydarzenie';
  if (entry.kind === 'task') return 'Zadanie';
  return 'Lead';
}

function getCalendarEntryTypeValue(entry: ScheduleEntry) {
  if (entry.kind === 'event') return 'event';
  if (entry.kind === 'task') return 'task';
  return 'lead';
}

function getCalendarEntryTypeClass(_entry: ScheduleEntry) {
  return 'cf-entity-type-pill';
}

function getCalendarEntryStatusLabel(entry: ScheduleEntry) {
  const status = getCalendarEntryStatus(entry);
  if (status === 'done' || status === 'completed') return 'Zrobione';
  if (status === 'cancelled' || status === 'canceled') return 'Anulowane';
  if (status === 'overdue') return 'Zaległe';
  if (status === 'in_progress') return 'W toku';
  return 'Zaplanowane';
}

function getCalendarEntrySeverity(entry: ScheduleEntry) {
  const status = getCalendarEntryStatus(entry);
  if (status === 'overdue') return 'error';
  return undefined;
}

function getCalendarEntryStatusTone(entry: ScheduleEntry) {
  const status = getCalendarEntryStatus(entry);
  if (status === 'done' || status === 'completed') return 'green';
  if (status === 'cancelled' || status === 'canceled') return 'neutral';
  if (status === 'in_progress') return 'blue';
  return 'blue';
}

function getCalendarEntryStatusPillClass(entry: ScheduleEntry) {
  return getCalendarEntrySeverity(entry) === 'error' ? 'cf-severity-pill' : 'cf-status-pill';
}

function getCalendarEntryTimeLabel(entry: ScheduleEntry) {
  const rawTime = String(entry.raw?.time || '').trim();
  if (rawTime) return rawTime.slice(0, 5);

  const date = parseISO(entry.startsAt);
  if (Number.isNaN(date.getTime())) return 'bez godziny';

  const formatted = format(date, 'HH:mm');
  const hasExplicitHour = Boolean(
    entry.raw?.scheduledAt ||
    entry.raw?.dueAt ||
    entry.raw?.startAt ||
    entry.raw?.startsAt ||
    entry.startsAt.includes('T')
  );

  if (!hasExplicitHour || formatted === '00:00') return 'bez godziny';
  return formatted;
}

function getCalendarEntryRelationLabel(entry: ScheduleEntry, caseTitle?: string | null) {
  if (caseTitle || entry.raw?.caseId) {
    return `Sprawa: ${caseTitle || entry.raw?.caseTitle || entry.raw?.title || 'Powiązana sprawa'}`;
  }
  if (entry.leadName || entry.raw?.leadName) {
    return `Lead: ${entry.leadName || entry.raw?.leadName}`;
  }
  if (entry.raw?.clientName || entry.raw?.customerName) {
    return `Klient: ${entry.raw.clientName || entry.raw.customerName}`;
  }
  return '';
}

function getCalendarDayNavLabel(day: Date, index: number) {
  if (index === 0 || isToday(day)) return 'Dzisiaj';
  return capitalizeCalendarLabel(format(day, 'eeee', { locale: pl }));
}

type ScheduleEntryCardProps = {
  entry: ScheduleEntry;
  actionButtonClass: string;
  actionPendingId: string | null;
  caseTitle?: string | null;
  onEdit: (entry: ScheduleEntry) => void;
  onShift: (entry: ScheduleEntry, days: number) => void;
  onShiftHours: (entry: ScheduleEntry, hours: number) => void;
  onComplete: (entry: ScheduleEntry) => void;
  onDelete: (entry: ScheduleEntry) => void;
};

function ScheduleEntryCard({ entry, actionButtonClass, actionPendingId, caseTitle, onEdit, onShift, onShiftHours, onComplete, onDelete }: ScheduleEntryCardProps) {
  // Release gate contract (relation links):
  // to={`/leads/${entry.raw.leadId}`}
  // to={`/cases/${entry.raw.caseId}`}
  // Otwórz lead
  // Otwórz sprawę
  const __RELATION_LINK_CONTRACT_STAGE24 = "to={`\/leads\/${entry.raw.leadId}`} to={`\/cases\/${entry.raw.caseId}`} Otwórz lead Otwórz sprawę";
  const pendingEdit = actionPendingId === `${entry.id}:edit`;
  const pendingDay = actionPendingId === `${entry.id}:1`;
  const pendingWeek = actionPendingId === `${entry.id}:7`;
  const pendingHour = actionPendingId === `${entry.id}:h1`;
  const pendingDone = actionPendingId === `${entry.id}:done`;
  const pendingDelete = actionPendingId === `${entry.id}:delete`;
  const isCompletedEntry = isCompletedCalendarEntry(entry);
  const relationLabel = getCalendarEntryRelationLabel(entry, caseTitle);
  const relationClass = `truncate text-[12px] font-semibold ${isCompletedEntry ? 'text-slate-400 line-through' : 'text-slate-500'}`;
  const neutralActionClass = actionButtonClass;
  const postponeActionClass = `${actionButtonClass} border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100`;
  const doneActionClass = `${actionButtonClass} border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100`;
  const deleteActionClass = entityActionButtonClass('danger', actionButtonClass);

  return (
    <div data-calendar-entry-completed={isCompletedEntry ? 'true' : undefined} className={`calendar-entry-card cf-readable-card ${isCompletedEntry ? 'calendar-entry-completed' : ''} rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:shadow-md ${isCompletedEntry ? 'opacity-60' : ''}`}>
      <div className="grid gap-2 lg:grid-cols-[auto_minmax(220px,1fr)_76px_118px_auto] lg:items-center">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className={`inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-[12px] font-bold leading-none ${getCalendarEntryTypeClass(entry)}`} data-cf-entity-type={getCalendarEntryTypeValue(entry)}>
            {getCalendarEntryTypeLabel(entry)}
          </span>
        </div>

        <div className="min-w-0">
          <p className={`truncate text-[14px] font-bold leading-5 ${isCompletedEntry ? 'text-slate-500 line-through' : 'text-slate-900'}`} title={entry.title}>
            {entry.title}
          </p>
          {relationLabel ? (
            entry.raw?.caseId ? (
              <Link to={`/cases/${entry.raw.caseId}`} className={`${relationClass} transition hover:text-sky-700`} title={relationLabel}>
                {relationLabel}
              </Link>
            ) : entry.raw?.leadId ? (
              <Link to={`/leads/${entry.raw.leadId}`} className={`${relationClass} transition hover:text-blue-700`} title={relationLabel}>
                {relationLabel}
              </Link>
            ) : (
              <p className={relationClass} title={relationLabel}>{relationLabel}</p>
            )
          ) : (
            <p className="truncate text-[12px] font-semibold text-slate-400">Brak powiązania</p>
          )}
          {entry.raw?.leadId || entry.raw?.caseId ? (
            <div className="mt-1 flex flex-wrap gap-3 text-[12px] font-bold">
              {entry.raw?.leadId ? (
                <Link to={`/leads/${entry.raw.leadId}`} className="text-blue-700 hover:underline">
                  Otwórz lead
                </Link>
              ) : null}
              {entry.raw?.caseId ? (
                <Link to={`/cases/${entry.raw.caseId}`} className="text-sky-700 hover:underline">
                  Otwórz sprawę
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="text-[12px] font-bold text-slate-600 lg:text-center">
          {getCalendarEntryTimeLabel(entry)}
        </div>

        <div className="lg:text-center">
          {getCalendarEntrySeverity(entry) ? (
            <span className="cf-severity-pill" data-cf-severity={getCalendarEntrySeverity(entry)}>
              {getCalendarEntryStatusLabel(entry)}
            </span>
          ) : (
            <span className="cf-status-pill" data-cf-status-tone={getCalendarEntryStatusTone(entry)}>
              {getCalendarEntryStatusLabel(entry)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 lg:justify-end">
          <button type="button" className={neutralActionClass} onClick={() => onEdit(entry)} disabled={pendingEdit}>Edytuj</button>
          <button type="button" className={postponeActionClass} onClick={() => onShift(entry, 1)} disabled={pendingDay}>{pendingDay ? '...' : '+1D'}</button>
          <button type="button" className={postponeActionClass} onClick={() => onShift(entry, 7)} disabled={pendingWeek}>{pendingWeek ? '...' : '+1W'}</button>
          <button type="button" className={postponeActionClass} onClick={() => onShiftHours(entry, 1)} disabled={pendingHour}>{pendingHour ? '...' : '+1H'}</button>
          <button type="button" className={doneActionClass} onClick={() => onComplete(entry)} disabled={pendingDone}>
            <CheckSquare className="mr-1 h-3.5 w-3.5" /> {pendingDone ? '...' : isCompletedEntry ? 'Przywróć' : 'Zrobione'}
          </button>
          <button type="button" className={deleteActionClass} onClick={() => onDelete(entry)} disabled={pendingDelete}>
            <Trash2 className="mr-1 h-3.5 w-3.5" /> {pendingDelete ? '...' : 'Usuń'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Calendar() {
  const { workspace, hasAccess, loading: workspaceLoading, workspaceReady } = useWorkspace();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>('week');
  const [calendarScale, setCalendarScale] = useState<CalendarScale>('default');
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<ScheduleEntry | null>(null);
  const [editDraft, setEditDraft] = useState<CalendarEditDraft | null>(null);
  const [actionPendingId, setActionPendingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState(() => {
    const pair = buildStartEndPair(toDateTimeLocalValue(new Date()));
    return {
      title: '',
      type: 'meeting',
      ...pair,
      leadId: '',
      caseId: '',
      relationQuery: '',
      recurrence: createDefaultRecurrence(),
      reminder: createDefaultReminder(),
    };
  });
  const [newTask, setNewTask] = useState(() => ({
    title: '',
    type: 'follow_up',
    dueAt: toDateTimeLocalValue(new Date()),
    priority: 'medium',
    leadId: '',
    caseId: '',
    relationQuery: '',
  }));

  const createTaskSubmitLockRef = useRef(false);
  const createEventSubmitLockRef = useRef(false);
  const editEntrySubmitLockRef = useRef(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    const action = consumeGlobalQuickAction();
    // consumeGlobalQuickAction() === 'event'
    if (action === 'event') setIsNewEventOpen(true);
    // consumeGlobalQuickAction() === 'task'
    if (action === 'task') setIsNewTaskOpen(true);
  }, []);

  useEffect(() => subscribeGlobalQuickAction((target) => {
    if (target === 'event') setIsNewEventOpen(true);
    if (target === 'task') setIsNewTaskOpen(true);
  }), []);

  useEffect(() => {
    const quick = searchParams.get('quick');
    // GLOBAL_QUICK_ACTIONS_STAGE08D_CALENDAR_QUERY_FIX
    if (quick === 'event') setIsNewEventOpen(true);
    if (quick === 'task') setIsNewTaskOpen(true);
  }, [searchParams]);

  useEffect(() => {
    const forcedCalendarView = searchParams.get('view');
    if (forcedCalendarView === 'week' || forcedCalendarView === 'month') {
      setCalendarView(forcedCalendarView);
    }
  }, [searchParams]);

  // GOOGLE_CALENDAR_STAGE08C_CALENDAR_QUICK_PARAM_OPEN
  // Globalny pasek jest jedynym miejscem dodawania zadań i wydarzeń.
  // Parametr quick musi działać także wtedy, gdy użytkownik jest już na /calendar.
  useEffect(() => {
    const quick = searchParams.get('quick');
    if (quick !== 'event' && quick !== 'task') return;

    if (quick === 'event') setIsNewEventOpen(true);
    if (quick === 'task') setIsNewTaskOpen(true);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedScale = window.localStorage.getItem(CALENDAR_SCALE_STORAGE_KEY);
    if (storedScale === 'compact' || storedScale === 'default' || storedScale === 'large') {
      setCalendarScale(storedScale);
    }

    const storedView = window.localStorage.getItem(CALENDAR_VIEW_STORAGE_KEY);
    if (storedView === 'week' || storedView === 'month') {
      setCalendarView(storedView);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CALENDAR_SCALE_STORAGE_KEY, calendarScale);
    }
  }, [calendarScale]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CALENDAR_VIEW_STORAGE_KEY, calendarView);
    }
  }, [calendarView]);


  useEffect(() => {
    // CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT: native hover tooltips for clipped calendar text + visual type hints.
    if (typeof document === 'undefined') return;

    const inferKind = (value: string) => {
      const textValue = value.trim().toLowerCase();
      if (!textValue) return '';
      if (textValue === 'wyd' || textValue === 'wydarzenie' || textValue.startsWith('wydarzenie')) return 'event';
      if (textValue === 'zad' || textValue === 'zadanie' || textValue.startsWith('zadanie')) return 'task';
      if (textValue === 'tel' || textValue === 'telefon' || textValue.startsWith('telefon')) return 'phone';
      if (textValue === 'lead' || textValue.startsWith('lead')) return 'lead';
      return '';
    };

    const applyCalendarTextEnhancements = () => {
      const header = document.querySelector('[data-cf-page-header-v2="calendar"]');
      const scope = header?.parentElement;
      if (!scope) return;

      const contentCandidates = Array.from(scope.querySelectorAll<HTMLElement>([
        '.calendar-entry-card',
        '.calendar-entry-card *',
        '[class*="month"] [class*="entry"]',
        '[class*="month"] [class*="entry"] *',
        '[class*="month"] [class*="item"]',
        '[class*="month"] [class*="item"] *',
        '[class*="month"] [class*="chip"]',
        '[class*="month"] [class*="chip"] *',
        '[class*="calendar"] [class*="chip"]',
        '[class*="calendar"] [class*="chip"] *'
      ].join(',')));

      for (const node of contentCandidates) {
        const raw = (node.innerText || node.textContent || '').replace(/\s+/g, ' ').trim();
        if (!raw) continue;

        const kind = inferKind(raw);
        if (kind) {
          node.dataset.cfCalendarKind = kind;
          node.classList.add('cf-calendar-type-badge');

          const parent = node.parentElement;
          if (parent && parent !== scope) {
            parent.dataset.cfCalendarRowKind = kind;
          }
        }

        const isProbablyText = raw.length >= 8;
        const isClipped = node.scrollWidth > node.clientWidth + 2 || node.scrollHeight > node.clientHeight + 2;
        const isCompactCalendarText = node.matches('p,span,strong,a,button,div');

        if (isCompactCalendarText && isProbablyText && (isClipped || raw.length >= 28)) {
          if (!node.getAttribute('title')) {
            node.setAttribute('title', raw);
          }
          node.dataset.cfCalendarTooltip = 'true';
        }
      }
    };

    const raf = window.requestAnimationFrame(applyCalendarTextEnhancements);
    const timer = window.setTimeout(applyCalendarTextEnhancements, 180);
    const lateTimer = window.setTimeout(applyCalendarTextEnhancements, 520); // CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_TOOLTIP_RERUN

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.clearTimeout(lateTimer);
    };
  }, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients, loading]);

  async function refreshSupabaseBundle() {
    const [bundle, caseRows, clientRows] = await Promise.all([
      fetchCalendarBundleFromSupabase(),
      fetchCasesFromSupabase(),
      fetchClientsFromSupabase().catch(() => []),
    ]);
          setEvents((bundle.events || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })) as any[]);
          setTasks((bundle.tasks || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })) as any[]);
    setLeads(bundle.leads);
    setCases(caseRows as any[]);
    setClients(clientRows as any[]);
    return { ...bundle, cases: caseRows as any[], clients: clientRows as any[] };
  }

  useEffect(() => {
    // FAZA4_ETAP44A_CALENDAR_LIVE_REFRESH: refetch mounted Calendar after task/event/lead mutations.
    if (workspaceLoading || !workspace?.id) return undefined;

    let refreshTimer: number | null = null;

    const unsubscribe = subscribeCloseflowDataMutations((detail) => {
      if (!['task', 'event', 'lead', 'case', 'client'].includes(detail.entity)) return;

      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        void refreshSupabaseBundle().catch((error: any) => {
          console.warn('CALENDAR_LIVE_REFRESH_FAILED', error);
        });
      }, 120);
    });

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      unsubscribe();
    };
  }, [workspace?.id, workspaceLoading]);

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }

    let cancelled = false;

    const loadBundle = async () => {
      try {
        setLoading(true);
        const [bundle, caseRows, clientRows] = await Promise.all([
          fetchCalendarBundleFromSupabase(),
          fetchCasesFromSupabase(),
          fetchClientsFromSupabase().catch(() => []),
        ]);
        if (cancelled) return;
        setEvents((bundle.events || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })) as any[]);
        setTasks((bundle.tasks || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })) as any[]);
        setLeads(bundle.leads);
        setCases(caseRows as any[]);
        setClients(clientRows as any[]);
      } catch (error: any) {
        if (!cancelled) {
          toast.error(`Błąd odczytu kalendarza: ${error.message}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadBundle();

    return () => {
      cancelled = true;
    };
  }, [workspace?.id, workspaceLoading]);

  const resetNewEvent = () => {
    const pair = buildStartEndPair(toDateTimeLocalValue(new Date()));
    setNewEvent({
      title: '',
      type: 'meeting',
      ...pair,
      leadId: '',
      caseId: '',
      relationQuery: '',
      recurrence: createDefaultRecurrence(),
      reminder: createDefaultReminder(),
    });
  };

  const resetNewTask = () => {
    setNewTask({
      title: '',
      type: 'follow_up',
      dueAt: toDateTimeLocalValue(new Date()),
      priority: 'medium',
      leadId: '',
      caseId: '',
      relationQuery: '',
    });
  };

  const topicContactOptions = useMemo(
    () => buildTopicContactOptions({ leads, cases, clients }),
    [cases, clients, leads],
  );

  const selectedNewTaskOption = useMemo(
    () => findTopicContactOption(topicContactOptions, { leadId: newTask.leadId || null, caseId: newTask.caseId || null }),
    [newTask.caseId, newTask.leadId, topicContactOptions],
  );

  const selectedNewEventOption = useMemo(
    () => findTopicContactOption(topicContactOptions, { leadId: newEvent.leadId || null, caseId: newEvent.caseId || null }),
    [newEvent.caseId, newEvent.leadId, topicContactOptions],
  );

  const selectedEditOption = useMemo(
    () => findTopicContactOption(topicContactOptions, { leadId: editDraft?.leadId || null, caseId: editDraft?.caseId || null, clientId: editDraft?.clientId || null }),
    [editDraft?.caseId, editDraft?.leadId, topicContactOptions],
  );

  const handleSelectNewTaskRelation = (option: TopicContactOption | null) => {
    const resolved = resolveTopicContactLink(option);
    setNewTask((prev) => ({
      ...prev,
      leadId: resolved.leadId || '',
      caseId: resolved.caseId || '',
      relationQuery: option?.label || '',
    }));
  };

  const handleSelectNewEventRelation = (option: TopicContactOption | null) => {
    const resolved = resolveTopicContactLink(option);
    setNewEvent((prev) => ({
      ...prev,
      leadId: resolved.leadId || '',
      caseId: resolved.caseId || '',
      relationQuery: option?.label || '',
    }));
  };

  const handleSelectEditRelation = (option: TopicContactOption | null) => {
    if (!editDraft) return;
    const resolved = resolveTopicContactLink(option);
    setEditDraft({
      ...editDraft,
      leadId: resolved.leadId || '',
      caseId: resolved.caseId || '',
      relationQuery: option?.label || '',
    });
  };

  const registerReminderScheduled = async ({
    entityType,
    title,
    scheduledAt,
    reminderAt,
  }: {
    entityType: 'task' | 'event';
    title: string;
    scheduledAt: string;
    reminderAt: string | null;
  }) => {
    if (!reminderAt) return;

    try {
      await insertActivityToSupabase({
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'reminder_scheduled',
        payload: {
          entityType,
          title,
          scheduledAt,
          reminderAt,
          source: 'calendar',
        },
      });
    } catch (error) {
      console.warn('REMINDER_ACTIVITY_WRITE_FAILED', error);
    }
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (createTaskSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    createTaskSubmitLockRef.current = true;
    setTaskSubmitting(true);

    try {
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'task',
          title: newTask.title,
          startAt: newTask.dueAt,
        },
        candidates: conflictCandidates,
      });
      if (!shouldSave) return;

      await insertTaskToSupabase({
        title: newTask.title,
        type: newTask.type,
        date: newTask.dueAt.slice(0, 10),
        scheduledAt: newTask.dueAt,
        priority: newTask.priority,
        leadId: newTask.leadId || null,
        caseId: newTask.caseId || null,
        ownerId: auth.currentUser?.uid,
        workspaceId,
      });

      await refreshSupabaseBundle();
      toast.success('Zadanie dodane');
      setIsNewTaskOpen(false);
      resetNewTask();
    } catch (error: any) {
      toast.error('Nie udało się zapisać zadania. Spróbuj ponownie.');
    } finally {
      createTaskSubmitLockRef.current = false;
      setTaskSubmitting(false);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (createEventSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    createEventSubmitLockRef.current = true;
    setEventSubmitting(true);

    const reminderAt = toReminderAtIso(newEvent.startAt, newEvent.reminder);

    try {
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'event',
          title: newEvent.title,
          startAt: newEvent.startAt,
          endAt: newEvent.endAt,
        },
        candidates: conflictCandidates,
      });
      if (!shouldSave) return;

      await insertEventToSupabase({
        title: newEvent.title,
        type: newEvent.type,
        startAt: newEvent.startAt,
        endAt: newEvent.endAt,
        reminderAt,
        recurrenceRule: newEvent.recurrence.mode,
        leadId: newEvent.leadId || null,
        caseId: newEvent.caseId || null,
        workspaceId,
      });
      await registerReminderScheduled({
        entityType: 'event',
        title: newEvent.title,
        scheduledAt: newEvent.startAt,
        reminderAt,
      });
      await refreshSupabaseBundle();
      toast.success('Wydarzenie zaplanowane');
      setIsNewEventOpen(false);
      resetNewEvent();
    } catch (error: any) {
      toast.error('Nie udało się zapisać wydarzenia. Spróbuj ponownie.');
    } finally {
      createEventSubmitLockRef.current = false;
      setEventSubmitting(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const monthRangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthRangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const rollingWeekStart = new Date();
  rollingWeekStart.setHours(0, 0, 0, 0);
  const rollingWeekEnd = addDays(rollingWeekStart, 6);
  rollingWeekEnd.setHours(23, 59, 59, 999);
  const selectedWeekStart = rollingWeekStart;
  const selectedWeekEnd = rollingWeekEnd;
  const calendarDataRangeEnd = rollingWeekEnd.getTime() > monthRangeEnd.getTime() ? rollingWeekEnd : monthRangeEnd;
  const calendarDays = eachDayOfInterval({ start: monthRangeStart, end: monthRangeEnd });
  const scheduleEntries = combineScheduleEntries({
    events,
    tasks,
    leads,
    rangeStart: monthRangeStart,
    rangeEnd: calendarDataRangeEnd,
  });

  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(rollingWeekStart, index));
  const weekEntries = combineScheduleEntries({
    events,
    tasks,
    leads,
    rangeStart: rollingWeekStart,
    rangeEnd: rollingWeekEnd,
  });
  const selectedDayEntries = sortCalendarEntriesForDisplay(getEntriesForDay(scheduleEntries, selectedDate));
  const caseTitleById = useMemo(
    () => new Map(cases.map((caseRecord: any) => [String(caseRecord.id || ''), String(caseRecord.title || caseRecord.clientName || 'Powiązana sprawa')])),
    [cases],
  );
  const conflictCandidates = useMemo(
    () =>
      buildConflictCandidates({
        tasks,
        events,
        caseTitleById,
      }),
    [caseTitleById, events, tasks],
  );

  const monthCellMinHeight = calendarScale === 'compact' ? 104 : calendarScale === 'large' ? 160 : 128;

  const logCalendarEntryActivity = async (
    entry: ScheduleEntry,
    eventType: string,
    extraPayload: Record<string, unknown> = {},
  ) => {
    try {
      await insertActivityToSupabase({
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType,
        leadId: entry.raw?.leadId ?? null,
        caseId: entry.raw?.caseId ?? null,
        workspaceId: workspace?.id ?? null,
        payload: {
          source: 'calendar',
          entryId: entry.id,
          sourceId: entry.sourceId,
          kind: entry.kind,
          title: readCalendarRawText(entry.raw?.title, entry.title),
          startsAt: entry.startsAt,
          status: getCalendarEntryStatus(entry),
          ...extraPayload,
        },
      });
    } catch (error) {
      console.warn('CALENDAR_ENTRY_ACTIVITY_WRITE_FAILED', error);
    }
  };

  const handleStartChange = (value: string) => {
    const currentEnd = parseISO(newEvent.endAt);
    const currentStart = parseISO(newEvent.startAt);
    const durationMs = Math.max(currentEnd.getTime() - currentStart.getTime(), 60 * 60_000);
    const newStart = parseISO(value);
    const nextEnd = new Date(newStart.getTime() + durationMs);

    setNewEvent({
      ...newEvent,
      startAt: value,
      endAt: toDateTimeLocalValue(nextEnd),
    });
  };

  const handleOpenEdit = (entry: ScheduleEntry) => {
    setEditEntry(entry);
    setEditDraft(buildEditDraft(entry));
  };

  const handleShiftEntry = async (entry: ScheduleEntry, days: number) => {
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

    try {
      setActionPendingId(`${entry.id}:${days}`);

      if (entry.kind === 'event') {
        const nextStart = toDateTimeLocalValue(addDays(parseISO(toCalendarDateInput(entry.raw.startAt, entry.startsAt)), days));
        const nextEnd = entry.raw?.endAt
          ? toDateTimeLocalValue(addDays(parseISO(toCalendarDateInput(entry.raw.endAt, entry.endsAt || entry.startsAt)), days))
          : null;

        await updateEventInSupabase({
          id: entry.sourceId,
          title: readCalendarRawText(entry.raw?.title, entry.title),
          type: readCalendarRawText(entry.raw?.type, 'meeting'),
          startAt: nextStart,
          endAt: nextEnd,
          leadId: readCalendarRawText(entry.raw?.leadId) || null,
          caseId: readCalendarRawText(entry.raw?.caseId) || null,
        });
      } else if (entry.kind === 'task') {
        const nextStart = addDays(parseISO(getTaskStartAt(entry.raw) || entry.startsAt), days);
        const taskPayload = syncTaskDerivedFields({
          ...entry.raw,
          dueAt: toDateTimeLocalValue(nextStart),
          date: format(nextStart, 'yyyy-MM-dd'),
          time: format(nextStart, 'HH:mm'),
        });

        await updateTaskInSupabase({
          id: entry.sourceId,
          title: taskPayload.title,
          type: readScheduleRawText(entry.raw, 'type', 'follow_up'),
          date: taskPayload.date,
          status: taskPayload.status,
          priority: readScheduleRawText(entry.raw, 'priority', 'medium'),
          leadId: taskPayload.leadId ?? null,
          caseId: readCalendarRawText(entry.raw?.caseId) || null,
        });
      }

      await refreshSupabaseBundle();
      toast.success(days === 1 ? 'Przesunięto o 1 dzień' : 'Przesunięto o 1 tydzień');
    } catch (error: any) {
      toast.error('Nie udało się zapisać wydarzenia. Spróbuj ponownie.');
    } finally {
      setActionPendingId(null);
    }
  };

  const handleShiftEntryHours = async (entry: ScheduleEntry, hours: number) => {
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

    try {
      setActionPendingId(`${entry.id}:h${hours}`);

      if (entry.kind === 'event') {
        const baseStart = parseISO(toCalendarDateInput(entry.raw?.startAt, entry.startsAt));
        const nextStart = toDateTimeLocalValue(addHours(baseStart, hours));
        const nextEnd = entry.raw?.endAt
          ? toDateTimeLocalValue(addHours(parseISO(toCalendarDateInput(entry.raw.endAt, entry.endsAt || entry.startsAt)), hours))
          : null;

        await updateEventInSupabase({
          id: entry.sourceId,
          title: readCalendarRawText(entry.raw?.title, entry.title),
          type: readCalendarRawText(entry.raw?.type, 'meeting'),
          startAt: nextStart,
          endAt: nextEnd,
          leadId: readCalendarRawText(entry.raw?.leadId) || null,
          caseId: readCalendarRawText(entry.raw?.caseId) || null,
        });
      } else if (entry.kind === 'task') {
        const baseStart = parseISO(getTaskStartAt(entry.raw) || entry.startsAt);
        const nextStart = addHours(baseStart, hours);
        const taskPayload = syncTaskDerivedFields({
          ...entry.raw,
          dueAt: toDateTimeLocalValue(nextStart),
          date: format(nextStart, 'yyyy-MM-dd'),
          time: format(nextStart, 'HH:mm'),
        });

        await updateTaskInSupabase({
          id: entry.sourceId,
          title: taskPayload.title,
          type: readScheduleRawText(entry.raw, 'type', 'follow_up'),
          date: taskPayload.date,
          status: taskPayload.status,
          priority: readScheduleRawText(entry.raw, 'priority', 'medium'),
          leadId: taskPayload.leadId ?? null,
          caseId: readCalendarRawText(entry.raw?.caseId) || null,
        });
      }

      await refreshSupabaseBundle();
      toast.success(hours === 1 ? 'Przesunięto o 1 godzinę' : `Przesunięto o ${hours} godz.`);
    } catch (error: any) {
      toast.error('Nie udało się zapisać wydarzenia. Spróbuj ponownie.');
    } finally {
      setActionPendingId(null);
    }
  };

  const handleCompleteEntry = async (entry: ScheduleEntry) => {
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

    try {
      setActionPendingId(`${entry.id}:done`);
      const wasCompleted = isCompletedCalendarEntry(entry);

      if (entry.kind === 'event') {
        await updateEventInSupabase({
          id: entry.sourceId,
          title: readCalendarRawText(entry.raw?.title, entry.title),
          type: readCalendarRawText(entry.raw?.type, 'meeting'),
          startAt: readCalendarRawText(entry.raw?.startAt, entry.startsAt),
          endAt: entry.raw?.endAt || entry.endsAt || null,
          status: wasCompleted ? 'scheduled' : 'completed',
          leadId: readCalendarRawText(entry.raw?.leadId) || null,
          caseId: readCalendarRawText(entry.raw?.caseId) || null,
        });
      } else if (entry.kind === 'task') {
        await updateTaskInSupabase({
          id: entry.sourceId,
          title: readCalendarRawText(entry.raw?.title, entry.title),
          type: entry.raw?.type,
          date: entry.raw?.date || entry.startsAt.slice(0, 10),
          status: wasCompleted ? 'todo' : 'done',
          priority: entry.raw?.priority,
          leadId: readCalendarRawText(entry.raw?.leadId) || null,
          caseId: readCalendarRawText(entry.raw?.caseId) || null,
        });
      }

      await logCalendarEntryActivity(
        entry,
        wasCompleted ? 'calendar_entry_restored' : 'calendar_entry_completed',
        {
          nextStatus: wasCompleted
            ? entry.kind === 'event' ? 'scheduled' : 'todo'
            : entry.kind === 'event' ? 'completed' : 'done',
        },
      );

      await refreshSupabaseBundle();

      toast.success(wasCompleted ? 'Wpis przywrócony' : 'Wpis oznaczony jako zrobiony');
    } catch (error: any) {
      toast.error('Nie udało się zapisać wydarzenia. Spróbuj ponownie.');
    } finally {
      setActionPendingId(null);
    }
  };

  const handleDeleteEntry = async (entry: ScheduleEntry) => {
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }
    if (!window.confirm('Usunąć ten wpis z kalendarza?')) return;

    try {
      setActionPendingId(`${entry.id}:delete`);

      if (entry.kind === 'event') {
        await deleteEventFromSupabase(entry.sourceId);
      } else if (entry.kind === 'task') {
        await deleteTaskFromSupabase(entry.sourceId);
      }

      await logCalendarEntryActivity(entry, 'calendar_entry_deleted');

      await refreshSupabaseBundle();
      toast.success('Wpis usunięty');
    } catch (error: any) {
      toast.error('Nie udało się zapisać wydarzenia. Spróbuj ponownie.');
    } finally {
      setActionPendingId(null);
    }
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editEntry || !editDraft) return;
    if (editEntrySubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    editEntrySubmitLockRef.current = true;
    setEditSubmitting(true);

    try {
      setActionPendingId(`${editEntry.id}:edit`);

      if (editEntry.kind === 'event') {
        const reminderAt = toReminderAtIso(editDraft.startAt, editDraft.reminder);

        await updateEventInSupabase({
          id: editEntry.sourceId,
          title: editDraft.title,
          type: editDraft.type,
          startAt: editDraft.startAt,
          endAt: editDraft.endAt || null,
          leadId: editDraft.leadId || null,
          caseId: editDraft.caseId || null,
          clientId: editDraft.clientId || null,
          status: editDraft.status || 'scheduled',
          reminderAt,
          recurrenceRule: editDraft.recurrence.mode,
        });

        await registerReminderScheduled({
          entityType: 'event',
          title: editDraft.title,
          scheduledAt: editDraft.startAt,
          reminderAt,
        });
      } else if (editEntry.kind === 'task') {
        const nextDate = parseISO(editDraft.startAt);
        const payload = syncTaskDerivedFields({
          ...editEntry.raw,
          title: editDraft.title,
          type: editDraft.type,
          dueAt: editDraft.startAt,
          date: format(nextDate, 'yyyy-MM-dd'),
          time: format(nextDate, 'HH:mm'),
          priority: editDraft.priority,
          leadId: editDraft.leadId || null,
          leadName: selectedEditOption?.resolvedTarget === 'lead' ? selectedEditOption.label : '',
          recurrence: editDraft.recurrence,
          reminder: editDraft.reminder,
        });
        const reminderAt = toReminderAtIso(payload.dueAt, payload.reminder);

        await updateTaskInSupabase({
          id: editEntry.sourceId,
          title: payload.title,
          type: payload.type,
          date: payload.date,
          scheduledAt: payload.dueAt,
          status: payload.status,
          priority: payload.priority,
          reminderAt,
          recurrenceRule: payload.recurrence?.mode ?? 'none',
          leadId: payload.leadId ?? null,
          caseId: editDraft.caseId || null,
        });
        await registerReminderScheduled({
          entityType: 'task',
          title: payload.title,
          scheduledAt: payload.dueAt,
          reminderAt,
        });
      }

      await refreshSupabaseBundle();
      toast.success('Wpis zaktualizowany');
      setEditEntry(null);
      setEditDraft(null);
    } catch (error: any) {
      toast.error('Nie udało się zapisać wydarzenia. Spróbuj ponownie.');
    } finally {
      editEntrySubmitLockRef.current = false;
      setEditSubmitting(false);
      setActionPendingId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
      <div data-calendar-stage34b="complete-polish" hidden />
      <div data-calendar-stage34="readability-status-forms" hidden />
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const actionButtonClass = createEntryActionClass();

  return (
    <Layout>
      <div className="cf-html-view main-calendar-html" data-calendar-real-view="true">
        <CloseFlowPageHeaderV2
          pageKey="calendar"
          actions={
            <>
              <div className="head-actions">
                          <button type="button" className={createEntryActionClass()} data-cf-header-action="primary" data-calendar-header-add-event-stage6="true" onClick={() => setIsNewEventOpen(true)}>
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            Dodaj wydarzenie
                          </button>
                          <button type="button" className={createEntryActionClass()} data-cf-header-action="primary" data-calendar-header-add-task-stage6="true" onClick={() => setIsNewTaskOpen(true)}>
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            Dodaj zadanie
                          </button>
                          <Link to="/ai-drafts" className="btn soft-blue" data-cf-header-action="ai">
                            <EntityIcon entity="ai" className="h-4 w-4" /> Zapytaj AI
                          </Link>
                          <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
                            <DialogContent className="event-form-vnext-content sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-event-form-stage22="true" data-event-form-visual-rebuild={EVENT_FORM_VISUAL_REBUILD_STAGE22}>
                              <DialogHeader><DialogTitle>Zaplanuj wydarzenie</DialogTitle></DialogHeader>
                              <form onSubmit={handleAddEvent} className="event-form-vnext space-y-6 py-4" data-event-form-stage22="true" data-event-form-visual-rebuild={EVENT_FORM_VISUAL_REBUILD_STAGE22}>
                                <div className="space-y-4">
                                  <div className="event-form-field">
                                    <Label>Tytuł</Label>
                                    <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="event-form-field">
                                      <Label>Typ</Label>
                                      <select className="event-form-select" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                                        {EVENT_TYPES.map((eventType) => (
                                          <option key={eventType.value} value={eventType.value}>{eventType.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <TopicContactPicker
                                    options={topicContactOptions}
                                    selectedOption={selectedNewEventOption}
                                    query={newEvent.relationQuery}
                                    onQueryChange={(value) => setNewEvent((prev) => ({ ...prev, relationQuery: value, leadId: '', caseId: '' }))}
                                    onSelect={handleSelectNewEventRelation}
                                  />
                                </div>

                                <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">Od do</p>
                                    <p className="text-xs text-slate-500">Najpierw ustaw start i koniec. Koniec pilnuje się automatycznie przy zmianie startu.</p>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="event-form-field">
                                      <Label>Start</Label>
                                      <Input type="datetime-local" value={newEvent.startAt} onChange={(e) => handleStartChange(e.target.value)} required />
                                    </div>
                                    <div className="event-form-field">
                                      <Label>Koniec</Label>
                                      <Input type="datetime-local" value={newEvent.endAt} onChange={(e) => setNewEvent({ ...newEvent, endAt: e.target.value })} required />
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">Cykliczność wydarzenia</p>
                                    <p className="text-xs text-slate-500">Możesz zostawić brak albo ustawić powtarzanie, np. co miesiąc.</p>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                      <Label>Powtarzanie</Label>
                                      <select className="event-form-select" value={newEvent.recurrence.mode} onChange={(e) => setNewEvent({ ...newEvent, recurrence: { ...newEvent.recurrence, mode: e.target.value as any } })}>
                                        {RECURRENCE_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="event-form-field">
                                      <Label>Co ile</Label>
                                      <Input type="number" min="1" value={newEvent.recurrence.interval} onChange={(e) => setNewEvent({ ...newEvent, recurrence: { ...newEvent.recurrence, interval: Math.max(1, Number(e.target.value) || 1) } })} disabled={newEvent.recurrence.mode === 'none'} />
                                    </div>
                                  </div>
                                  <div className="event-form-field">
                                    <Label>Powtarzaj do</Label>
                                    <Input type="date" value={newEvent.recurrence.until || ''} onChange={(e) => setNewEvent({ ...newEvent, recurrence: { ...newEvent.recurrence, until: e.target.value || null } })} disabled={newEvent.recurrence.mode === 'none'} />
                                  </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">Przypomnienia</p>
                                    <p className="text-xs text-slate-500">Na końcu ustaw sposób przypominania i jego cykliczność.</p>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="event-form-field">
                                      <Label>Tryb</Label>
                                      <select className="event-form-select" value={newEvent.reminder.mode} onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, mode: e.target.value as any } })}>
                                        {REMINDER_MODE_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="event-form-field">
                                      <Label>Kiedy przypomnieć</Label>
                                      <select className="event-form-select" value={newEvent.reminder.minutesBefore} onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, minutesBefore: Number(e.target.value) } })} disabled={newEvent.reminder.mode === 'none'}>
                                        {REMINDER_OFFSET_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  {newEvent.reminder.mode === 'recurring' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="space-y-2 md:col-span-2">
                                        <Label>Cykliczność przypomnienia</Label>
                                        <select className="event-form-select" value={newEvent.reminder.recurrenceMode} onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, recurrenceMode: e.target.value as any } })}>
                                          {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="event-form-field">
                                        <Label>Co ile</Label>
                                        <Input type="number" min="1" value={newEvent.reminder.recurrenceInterval} onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, recurrenceInterval: Math.max(1, Number(e.target.value) || 1) } })} />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <DialogFooter className="event-form-footer">
                                  <Button type="submit" className="w-full" disabled={eventSubmitting || !workspaceReady}>{eventSubmitting ? 'Dodawanie...' : 'Zaplanuj'}</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
            </>
          }
        />

        <div className="calendar-toolbar">
          <div className="calendar-seg" role="tablist" aria-label="Widok kalendarza">
            <button type="button" className={`seg-btn ${calendarView === 'week' ? 'active' : ''}`} onClick={() => setCalendarView('week')}>Tydzień</button>
            <button type="button" className={`seg-btn ${calendarView === 'month' ? 'active' : ''}`} onClick={() => setCalendarView('month')}>Miesiąc</button>
          </div>

          <div className="calendar-toolbar-right">
            {calendarView === 'month' ? (
              <div className="calendar-seg" role="tablist" aria-label="Wielkość kafelków">
                <button type="button" className={`seg-btn ${calendarScale === 'compact' ? 'active' : ''}`} onClick={() => setCalendarScale('compact')}>Małe kafelki</button>
                <button type="button" className={`seg-btn ${calendarScale === 'default' ? 'active' : ''}`} onClick={() => setCalendarScale('default')}>Standard</button>
                <button type="button" className={`seg-btn ${calendarScale === 'large' ? 'active' : ''}`} onClick={() => setCalendarScale('large')}>Duże kafelki</button>
              </div>
            ) : null}

            <div className="calendar-nav">
              <button
                type="button"
                className="nav-btn"
                onClick={() => {
                  if (calendarView === 'week') {
                    const next = addDays(selectedDate, -7);
                    setSelectedDate(next);
                    setCurrentMonth(next);
                    return;
                  }
                  setCurrentMonth(subMonths(currentMonth, 1));
                }}
                aria-label={calendarView === 'week' ? 'Poprzedni tydzień' : 'Poprzedni miesiąc'}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" className="nav-today" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }}>
                Dzisiaj
              </button>
              <button
                type="button"
                className="nav-btn"
                onClick={() => {
                  if (calendarView === 'week') {
                    const next = addDays(selectedDate, 7);
                    setSelectedDate(next);
                    setCurrentMonth(next);
                    return;
                  }
                  setCurrentMonth(addMonths(currentMonth, 1));
                }}
                aria-label={calendarView === 'week' ? 'Następny tydzień' : 'Następny miesiąc'}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Dodaj zadanie</DialogTitle></DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-6 py-4">
              <div className="event-form-field">
                <Label>Tytuł zadania</Label>
                <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="event-form-field">
                  <Label>Typ</Label>
                  <select className="event-form-select" value={newTask.type} onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}>
                    {TASK_TYPES.map((taskType) => (
                      <option key={taskType.value} value={taskType.value}>{taskType.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <TopicContactPicker
                options={topicContactOptions}
                selectedOption={selectedNewTaskOption}
                query={newTask.relationQuery}
                onQueryChange={(value) => setNewTask((prev) => ({ ...prev, relationQuery: value, leadId: '', caseId: '' }))}
                onSelect={handleSelectNewTaskRelation}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="event-form-field">
                  <Label>Priorytet</Label>
                  <select className="event-form-select" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="event-form-field">
                  <Label>Data i godzina</Label>
                  <Input type="datetime-local" value={newTask.dueAt} onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })} required />
                </div>
              </div>
              <DialogFooter className="event-form-footer">
                <Button type="submit" className="w-full" disabled={taskSubmitting || !workspaceReady}>{taskSubmitting ? 'Dodawanie...' : 'Dodaj zadanie'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {calendarView === 'month' ? (
          <>
            <div className="grid grid-cols-7 mb-2">
              {['Pon', 'Wt', 'Śro', 'Czw', 'Pt', 'Sob', 'Ndz'].map((day) => (
                <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">{day}</div>
              ))}
            </div>

            <div className="calendar-month-grid">
              {calendarDays.map((day, index) => {
                const dayEntries = sortCalendarEntriesForDisplay(getEntriesForDay(scheduleEntries, day));
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDay = isToday(day);
                const isSelectedDay = isSameDay(day, selectedDate);

                return (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedDate(day)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedDate(day);
                      }
                    }}
                    style={{ minHeight: monthCellMinHeight }}
                    className={`calendar-day-cell ${!isCurrentMonth ? 'is-outside' : ''} ${isSelectedDay ? 'is-selected' : ''} ${isTodayDay ? 'is-today' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="calendar-day-number">
                        {format(day, 'd')}
                      </span>
                      {dayEntries.length > 0 && <Badge variant="secondary" className="h-5 text-[10px]">{dayEntries.length}</Badge>}
                    </div>
                    <div className="space-y-1">
                      {dayEntries.slice(0, calendarScale === 'compact' ? 3 : 4).map((entry) => {
                        const isCompletedEntry = entry.kind === 'task' && entry.raw?.status === 'done';

                        return (
                          <button
                            key={entry.id}
                            type="button"
                            className={`calendar-day-pill ${getEntryTone(entry)} ${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''} ${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''} ${isCompletedEntry ? 'is-done' : ''}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedDate(day);
                              handleOpenEdit(entry);
                            }}
                            title={entry.title}
                          >
                            <span className="calendar-pill-type">{entry.kind === 'event' ? 'Wyd' : entry.kind === 'task' ? 'Zad' : 'Lead'}</span>
                            <span className={isCompletedEntry ? 'is-done-text' : ''}>
                              {format(parseISO(entry.startsAt), 'HH:mm')} {entry.title}
                              {entry.raw?.caseId ? ' · Sprawa' : entry.raw?.leadId ? ' · Lead' : ''}
                            </span>
                          </button>
                        );
                      })}
                      {dayEntries.length > (calendarScale === 'compact' ? 3 : 4) && (
                        <div className="calendar-more">+ {dayEntries.length - (calendarScale === 'compact' ? 3 : 4)} więcej</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cf-readable-panel mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
              <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Wybrany dzień</p>
                  <h2 className="text-xl font-bold text-slate-900">{format(selectedDate, 'EEEE, d MMMM yyyy', { locale: pl })}</h2>
                </div>
                <Badge variant="secondary" className="h-7 px-3">{selectedDayEntries.length} wpisów</Badge>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {selectedDayEntries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center text-sm text-slate-400 lg:col-span-2">
                    Brak wpisów dla tego dnia.
                  </div>
                ) : selectedDayEntries.map((entry) => (
                  <div key={`selected:${entry.id}`}>
                    <ScheduleEntryCard
                      entry={entry}
                      actionButtonClass={actionButtonClass}
                      actionPendingId={actionPendingId}
                      caseTitle={entry.raw?.caseId ? caseTitleById.get(String(entry.raw.caseId)) || 'Powiązana sprawa' : null}
                      onEdit={handleOpenEdit}
                      onShift={handleShiftEntry}
                      onShiftHours={handleShiftEntryHours}
                      onComplete={handleCompleteEntry}
                      onDelete={handleDeleteEntry}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {calendarView === 'week' ? (
          <div className="calendar-week-layout">
            <aside className="right-card calendar-week-filter">
              <div className="panel-head">
                <h3>Najbliższe 7 dni</h3>
                <p>Najszybszy filtr.</p>
              </div>
              <div className="calendar-week-visible-days-v3 mt-3 space-y-2">
                {weekDays.map((day, index) => {
                  const dayEntries = sortCalendarEntriesForDisplay(getEntriesForDay(weekEntries, day));
                  const active = isSameDay(day, selectedDate);
                  const label = getCalendarDayNavLabel(day, index);
                  const weekday = capitalizeCalendarLabel(format(day, 'EEEE', { locale: pl }));
                  const dateLabel = format(day, 'd MMM', { locale: pl });

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      className={
                        active
                          ? 'w-full rounded-2xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-100'
                          : 'w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50'
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className={active ? "truncate text-sm font-extrabold text-blue-700" : "truncate text-sm font-extrabold text-slate-900"}>
                            {label}
                          </div>
                          <div className={active ? "truncate text-[11px] font-semibold text-blue-600" : "truncate text-[11px] font-semibold text-slate-500"}>
                            {index === 0 ? weekday + ' · ' + dateLabel : dateLabel}
                          </div>
                        </div>
                        <span className={active ? "shrink-0 rounded-full border border-blue-200 bg-white px-2 py-1 text-[11px] font-bold text-blue-700" : "shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600"}>
                          {formatCalendarItemCount(dayEntries.length)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="calendar-week-filter-list hidden">
                {(() => {
                  const nextWeekStart = addDays(selectedWeekStart, 7);
                  const days = weekDays.map((day, index) => ({
                    key: day.toISOString(),
                    label: isToday(day) ? 'Dzisiaj' : getCalendarDayNavLabel(day, index),
                    date: day,
                    count: sortCalendarEntriesForDisplay(getEntriesForDay(weekEntries, day)).length,
                  }));
                  const quick = [
                    ...days,
                    {
                      key: `next:${nextWeekStart.toISOString()}`,
                      label: 'Przyszły tydzień',
                      date: nextWeekStart,
                      count: sortCalendarEntriesForDisplay(getEntriesForDay(scheduleEntries, nextWeekStart)).length,
                    },
                  ];

                  return quick.map((item) => {
                    const isActive = isSameDay(item.date, selectedDate);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        className={`calendar-week-filter-btn ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedDate(item.date);
                          setCurrentMonth(item.date);
                        }}
                      >
                        <span>{item.label} · {item.count} {item.count === 1 ? 'rzecz' : 'rzeczy'}</span>
                      </button>
                    );
                  });
                })()}
              </div>
            </aside>

            <section className="right-card calendar-week-plan">
              <div className="panel-head">
                <h3>Plan najbliższych dni</h3>
              </div>

              <div className="calendar-week-plan-list">
                {weekDays.map((day, index) => {
                  const dayEntries = sortCalendarEntriesForDisplay(getEntriesForDay(weekEntries, day));
                  const isActiveDay = isSameDay(day, selectedDate);

                  return (
                    <section key={day.toISOString()} className={`calendar-week-day ${isActiveDay ? 'is-active' : ''}`}>
                      <header className="calendar-week-day-head">
                        <div>
                          <div className="calendar-week-day-kicker">{getCalendarDayNavLabel(day, index)}</div>
                          <div className="calendar-week-day-title">{format(day, 'd MMM', { locale: pl })}</div>
                        </div>
                        <div className="calendar-week-day-count">{dayEntries.length} {dayEntries.length === 1 ? 'wpis' : 'wpisów'}</div>
                      </header>

                      <div className="calendar-week-day-entries">
                        {dayEntries.length === 0 ? (
                          <div className="calendar-week-empty">Brak wpisów.</div>
                        ) : dayEntries.map((entry) => (
                          <div key={`week:${day.toISOString()}:${entry.id}`} style={{ display: 'contents' }}>
                            <ScheduleEntryCard
                              entry={entry}
                              actionButtonClass={actionButtonClass}
                              actionPendingId={actionPendingId}
                              caseTitle={entry.raw?.caseId ? caseTitleById.get(String(entry.raw.caseId)) || 'Powiązana sprawa' : null}
                              onEdit={handleOpenEdit}
                              onShift={handleShiftEntry}
                              onShiftHours={handleShiftEntryHours}
                              onComplete={handleCompleteEntry}
                              onDelete={handleDeleteEntry}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </section>
          </div>
        ) : null}
      </div>

      <Dialog open={Boolean(editEntry && editDraft)} onOpenChange={(open) => {
        if (!open) {
          setEditEntry(null);
          setEditDraft(null);
        }
      }}>
        <DialogContent className="event-form-vnext-content sm:max-w-xl" data-event-form-stage22="true" data-event-form-visual-rebuild={EVENT_FORM_VISUAL_REBUILD_STAGE22}>
          <DialogHeader>
            <DialogTitle>Edytuj wpis z kalendarza</DialogTitle>
          </DialogHeader>
          {editEntry && editDraft ? (
            <form onSubmit={handleSaveEdit} className="event-form-vnext space-y-4 py-2" data-event-form-stage22="true" data-event-form-visual-rebuild={EVENT_FORM_VISUAL_REBUILD_STAGE22}>
              <div className="event-form-field">
                <Label>Tytuł</Label>
                <Input value={editDraft.title} onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })} required />
              </div>

              {editEntry.kind !== 'lead' ? (
                <div className="event-form-field">
                  <Label>Typ</Label>
                  <select className="event-form-select" value={editDraft.type} onChange={(e) => setEditDraft({ ...editDraft, type: e.target.value })}>
                    {(editEntry.kind === 'event' ? EVENT_TYPES : TASK_TYPES).map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className={`grid gap-4 ${editEntry.kind === 'event' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                <div className="event-form-field">
                  <Label>Start</Label>
                  <Input
                    type="datetime-local"
                    value={editDraft.startAt}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      if (editEntry.kind === 'event') {
                        const oldStart = parseISO(editDraft.startAt);
                        const oldEnd = parseISO(editDraft.endAt || buildStartEndPair(editDraft.startAt).endAt);
                        const duration = Math.max(oldEnd.getTime() - oldStart.getTime(), 60 * 60_000);
                        const nextEnd = new Date(parseISO(nextValue).getTime() + duration);
                        setEditDraft({ ...editDraft, startAt: nextValue, endAt: toDateTimeLocalValue(nextEnd) });
                        return;
                      }
                      setEditDraft({ ...editDraft, startAt: nextValue });
                    }}
                    required
                  />
                </div>

                {editEntry.kind === 'event' ? (
                  <div className="event-form-field">
                    <Label>Koniec</Label>
                    <Input type="datetime-local" value={editDraft.endAt} onChange={(e) => setEditDraft({ ...editDraft, endAt: e.target.value })} required />
                  </div>
                ) : null}
              </div>

              {editEntry.kind === 'task' ? (
                <div className="event-form-field">
                  <Label>Priorytet</Label>
                  <select className="event-form-select" value={editDraft.priority} onChange={(e) => setEditDraft({ ...editDraft, priority: e.target.value })}>
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              {editEntry.kind !== 'lead' ? (
                <div className="event-form-field">
                  <TopicContactPicker
                    options={topicContactOptions}
                    selectedOption={selectedEditOption}
                    query={editDraft.relationQuery}
                    onQueryChange={(value) => setEditDraft({ ...editDraft, relationQuery: value, leadId: '', caseId: '' })}
                    onSelect={handleSelectEditRelation}
                  />
                </div>
              ) : null}

              {editEntry.kind === 'event' ? (
                <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Cykliczność wydarzenia</p>
                    <p className="text-xs text-slate-500">Te same opcje co przy tworzeniu wydarzenia.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Powtarzanie</Label>
                      <select className="event-form-select" value={editDraft.recurrence.mode} onChange={(e) => setEditDraft({ ...editDraft, recurrence: { ...editDraft.recurrence, mode: e.target.value as any } })}>
                        {RECURRENCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="event-form-field">
                      <Label>Co ile</Label>
                      <Input type="number" min="1" value={editDraft.recurrence.interval} onChange={(e) => setEditDraft({ ...editDraft, recurrence: { ...editDraft.recurrence, interval: Math.max(1, Number(e.target.value) || 1) } })} disabled={editDraft.recurrence.mode === 'none'} />
                    </div>
                  </div>
                  <div className="event-form-field">
                    <Label>Powtarzaj do</Label>
                    <Input type="date" value={editDraft.recurrence.until || ''} onChange={(e) => setEditDraft({ ...editDraft, recurrence: { ...editDraft.recurrence, until: e.target.value || null } })} disabled={editDraft.recurrence.mode === 'none'} />
                  </div>
                </div>
              ) : null}

              {editEntry.kind === 'event' ? (
                <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Przypomnienia</p>
                    <p className="text-xs text-slate-500">Te same opcje co przy tworzeniu wydarzenia.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="event-form-field">
                      <Label>Tryb</Label>
                      <select className="event-form-select" value={editDraft.reminder.mode} onChange={(e) => setEditDraft({ ...editDraft, reminder: { ...editDraft.reminder, mode: e.target.value as any } })}>
                        {REMINDER_MODE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="event-form-field">
                      <Label>Kiedy przypomnieć</Label>
                      <select className="event-form-select" value={editDraft.reminder.minutesBefore} onChange={(e) => setEditDraft({ ...editDraft, reminder: { ...editDraft.reminder, minutesBefore: Number(e.target.value) } })} disabled={editDraft.reminder.mode === 'none'}>
                        {REMINDER_OFFSET_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {editDraft.reminder.mode === 'recurring' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Cykliczność przypomnienia</Label>
                        <select className="event-form-select" value={editDraft.reminder.recurrenceMode} onChange={(e) => setEditDraft({ ...editDraft, reminder: { ...editDraft.reminder, recurrenceMode: e.target.value as any } })}>
                          {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="event-form-field">
                        <Label>Co ile</Label>
                        <Input type="number" min="1" value={editDraft.reminder.recurrenceInterval} onChange={(e) => setEditDraft({ ...editDraft, reminder: { ...editDraft.reminder, recurrenceInterval: Math.max(1, Number(e.target.value) || 1) } })} />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              
                {editEntry?.kind === 'event' ? (
                  <div className="event-form-field" data-calendar-event-edit-status="true">
                    <Label>Status wydarzenia</Label>
                    <select
                      className="event-form-select"
                      value={editDraft?.status || 'scheduled'}
                      onChange={(event) => setEditDraft((prev) => prev ? { ...prev, status: event.target.value } : prev)}
                    >
                      <option value="scheduled">Zaplanowane</option>
                      <option value="completed">Odbyte</option>
                      <option value="cancelled">Anulowane</option>
                    </select>
                  </div>
                ) : null}

<DialogFooter className="event-form-footer">
                <Button type="submit" disabled={editSubmitting || actionPendingId === `${editEntry.id}:edit`}>
                  {editSubmitting || actionPendingId === `${editEntry.id}:edit` ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

/* CALENDAR_STAGE08D_NO_FIREBASE_BOOT_BLOCK GLOBAL_QUICK_ACTIONS_STAGE08D_CALENDAR_MODAL_EVENT_BUS */

