import { useState, useEffect, FormEvent, useMemo, useRef } from 'react';
import { auth } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  Bell,
  Repeat,
  CheckSquare,
  Trash2,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  eachDayOfInterval,
  parseISO,
  isSameDay,
  addDays,
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TopicContactPicker } from '../components/topic-contact-picker';
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
  toReminderAtIso,
  toDateTimeLocalValue,
  type ScheduleEntry,
} from '../lib/scheduling';
import {
  EVENT_TYPES,
  PRIORITY_OPTIONS,
  RECURRENCE_OPTIONS,
  REMINDER_OFFSET_OPTIONS,
  REMINDER_MODE_OPTIONS,
  TASK_TYPES,
} from '../lib/options';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import { buildConflictCandidates, confirmScheduleConflicts } from '../lib/schedule-conflicts';
import { buildTopicContactOptions, findTopicContactOption, resolveTopicContactLink, type TopicContactOption } from '../lib/topic-contact';
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
  updateTaskInSupabase,
} from '../lib/supabase-fallback';

type CalendarEditDraft = {
  title: string;
  type: string;
  startAt: string;
  endAt: string;
  leadId: string;
  caseId: string;
  relationQuery: string;
  priority: string;
  recurrence: ReturnType<typeof createDefaultRecurrence>;
  reminder: ReturnType<typeof createDefaultReminder>;
};

type CalendarScale = 'compact' | 'default' | 'large';

type CalendarView = 'week' | 'month';

const CALENDAR_SCALE_STORAGE_KEY = 'leadflow-calendar-scale';
const CALENDAR_VIEW_STORAGE_KEY = 'closeflow:calendar:view:v1';
const modalSelectClass = 'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

function createEntryActionClass() {
  return 'inline-flex h-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-[11px] font-semibold text-white transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50';
}

function buildEditDraft(entry: ScheduleEntry): CalendarEditDraft {
  if (entry.kind === 'event') {
    return {
      title: entry.raw?.title || entry.title,
      type: entry.raw?.type || 'meeting',
      startAt: entry.raw?.startAt || entry.startsAt,
      endAt: entry.raw?.endAt || entry.endsAt || buildStartEndPair(entry.startsAt).endAt,
      leadId: entry.raw?.leadId || '',
      caseId: entry.raw?.caseId || '',
      relationQuery: entry.raw?.caseId ? (entry.raw?.title || entry.title) : (entry.raw?.leadName || ''),
      priority: 'medium',
      recurrence: normalizeRecurrenceConfig(entry.raw?.recurrence || { mode: entry.raw?.recurrenceRule || 'none' }),
      reminder: normalizeReminderConfig(entry.raw?.reminder || (entry.raw?.reminderAt ? { mode: 'once', minutesBefore: 60 } : createDefaultReminder())),
    };
  }

  if (entry.kind === 'task') {
    return {
      title: entry.raw?.title || entry.title,
      type: entry.raw?.type || 'follow_up',
      startAt: getTaskStartAt(entry.raw) || entry.startsAt,
      endAt: '',
      leadId: entry.raw?.leadId || '',
      caseId: entry.raw?.caseId || '',
      relationQuery: entry.raw?.caseId ? (entry.raw?.title || entry.title) : (entry.raw?.leadName || ''),
      priority: entry.raw?.priority || 'medium',
      recurrence: normalizeRecurrenceConfig(entry.raw?.recurrence || { mode: entry.raw?.recurrenceRule || 'none' }),
      reminder: normalizeReminderConfig(entry.raw?.reminder || (entry.raw?.reminderAt ? { mode: 'once', minutesBefore: 60 } : createDefaultReminder())),
    };
  }

  return {
    title: entry.title,
    type: 'follow_up',
    startAt: entry.startsAt,
    endAt: '',
    leadId: entry.raw?.leadId || '',
    caseId: entry.raw?.caseId || '',
    relationQuery: entry.raw?.leadName || '',
    priority: entry.raw?.priority || 'medium',
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
  const status = getCalendarEntryStatus(entry);

  return (
    (entry.kind === 'task' && status === 'done') ||
    (entry.kind === 'event' && (status === 'completed' || status === 'done'))
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

type ScheduleEntryCardProps = {
  entry: ScheduleEntry;
  actionButtonClass: string;
  actionPendingId: string | null;
  caseTitle?: string | null;
  onEdit: (entry: ScheduleEntry) => void;
  onShift: (entry: ScheduleEntry, days: number) => void;
  onComplete: (entry: ScheduleEntry) => void;
  onDelete: (entry: ScheduleEntry) => void;
};

function ScheduleEntryCard({ entry, actionButtonClass, actionPendingId, caseTitle, onEdit, onShift, onComplete, onDelete }: ScheduleEntryCardProps) {
  const pendingEdit = actionPendingId === `${entry.id}:edit`;
  const pendingDay = actionPendingId === `${entry.id}:1`;
  const pendingWeek = actionPendingId === `${entry.id}:7`;
  const pendingDone = actionPendingId === `${entry.id}:done`;
  const pendingDelete = actionPendingId === `${entry.id}:delete`;
  const isCompletedEntry = isCompletedCalendarEntry(entry);
  const subtitle = getEntrySubtitle(entry);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-3 shadow-sm ${isCompletedEntry ? 'opacity-60' : ''}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Badge className={`${getEntryTone(entry)} border`}>{entry.badgeLabel || entry.kind}</Badge>
          {entry.leadName ? (
            <span className="inline-flex h-5 items-center rounded-full border border-emerald-200 bg-emerald-50 px-1.5 text-[9px] font-semibold text-emerald-700">
              Lead
            </span>
          ) : null}
          {entry.raw?.caseId ? (
            <span className="inline-flex h-5 items-center rounded-full border border-sky-200 bg-sky-50 px-1.5 text-[9px] font-semibold text-sky-700">
              Sprawa
            </span>
          ) : null}
        </div>
        <span className="text-[10px] font-semibold text-slate-500">
          {format(parseISO(entry.startsAt), 'HH:mm')}
        </span>
      </div>

      <div className="mb-3 min-w-0">
        <div className="min-w-0">
          <p className={`text-sm font-bold break-words ${isCompletedEntry ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{entry.title}</p>
          {subtitle ? <p className={`text-[11px] break-words ${isCompletedEntry ? 'text-slate-400 line-through' : 'text-slate-500'}`}>{subtitle}</p> : null}
          {caseTitle ? <p className={`text-[11px] break-words ${isCompletedEntry ? 'text-slate-400 line-through' : 'text-slate-500'}`}>Sprawa: {caseTitle}</p> : null}
          {(entry.raw?.leadId || entry.raw?.caseId) ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {entry.raw?.leadId ? (
                <Link
                  to={`/leads/${entry.raw.leadId}`}
                  className="inline-flex h-7 items-center rounded-lg border border-slate-200 bg-slate-50 px-2 text-[11px] font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Otwórz lead
                </Link>
              ) : null}
              {entry.raw?.caseId ? (
                <Link
                  to={`/cases/${entry.raw.caseId}`}
                  className="inline-flex h-7 items-center rounded-lg border border-slate-200 bg-slate-50 px-2 text-[11px] font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                >
                  Otwórz sprawę
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <button type="button" className={actionButtonClass} onClick={() => onEdit(entry)} disabled={pendingEdit}>Edytuj</button>
        <button type="button" className={actionButtonClass} onClick={() => onShift(entry, 1)} disabled={pendingDay}>{pendingDay ? '...' : '+1D'}</button>
        <button type="button" className={actionButtonClass} onClick={() => onShift(entry, 7)} disabled={pendingWeek}>{pendingWeek ? '...' : '+1W'}</button>
        <button type="button" className={actionButtonClass} onClick={() => onComplete(entry)} disabled={pendingDone}>
          <CheckSquare className="mr-1 h-3.5 w-3.5" /> {pendingDone ? '...' : isCompletedEntry ? 'Przywróć' : 'Zrobione'}
        </button>
        <button type="button" className={actionButtonClass} onClick={() => onDelete(entry)} disabled={pendingDelete}>
          <Trash2 className="mr-1 h-3.5 w-3.5" /> {pendingDelete ? '...' : 'Usuń'}
        </button>
      </div>
    </div>
  );
}

export default function Calendar() {
  const { workspace, hasAccess, loading: workspaceLoading, workspaceReady } = useWorkspace();
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

  async function refreshSupabaseBundle() {
    const [bundle, caseRows, clientRows] = await Promise.all([
      fetchCalendarBundleFromSupabase(),
      fetchCasesFromSupabase(),
      fetchClientsFromSupabase().catch(() => []),
    ]);
    setEvents(bundle.events);
    setTasks(bundle.tasks);
    setLeads(bundle.leads);
    setCases(caseRows as any[]);
    setClients(clientRows as any[]);
    return { ...bundle, cases: caseRows as any[], clients: clientRows as any[] };
  }

  useEffect(() => {
    if (!auth.currentUser || workspaceLoading || !workspace?.id) {
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
        setEvents(bundle.events);
        setTasks(bundle.tasks);
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
    () => findTopicContactOption(topicContactOptions, { leadId: editDraft?.leadId || null, caseId: editDraft?.caseId || null }),
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
      toast.error('Błąd: ' + error.message);
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
      toast.error('Błąd: ' + error.message);
    } finally {
      createEventSubmitLockRef.current = false;
      setEventSubmitting(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const monthRangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthRangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: monthRangeStart, end: monthRangeEnd });
  const scheduleEntries = combineScheduleEntries({
    events,
    tasks,
    leads,
    rangeStart: monthRangeStart,
    rangeEnd: monthRangeEnd,
  });

  const selectedWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const selectedWeekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: selectedWeekStart, end: selectedWeekEnd });
  const weekEntries = combineScheduleEntries({
    events,
    tasks,
    leads,
    rangeStart: selectedWeekStart,
    rangeEnd: selectedWeekEnd,
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
  const weekColumnMinWidth = calendarScale === 'compact' ? '150px' : calendarScale === 'large' ? '210px' : '170px';

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
        const nextStart = toDateTimeLocalValue(addDays(parseISO(entry.raw.startAt || entry.startsAt), days));
        const nextEnd = entry.raw?.endAt
          ? toDateTimeLocalValue(addDays(parseISO(entry.raw.endAt), days))
          : null;

        await updateEventInSupabase({
          id: entry.sourceId,
          title: entry.raw?.title || entry.title,
          type: entry.raw?.type || 'meeting',
          startAt: nextStart,
          endAt: nextEnd,
          leadId: entry.raw?.leadId ?? null,
          caseId: entry.raw?.caseId ?? null,
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
          type: taskPayload.type,
          date: taskPayload.date,
          status: taskPayload.status,
          priority: taskPayload.priority,
          leadId: taskPayload.leadId ?? null,
          caseId: entry.raw?.caseId ?? null,
        });
      }

      await refreshSupabaseBundle();
      toast.success(days === 1 ? 'Przesunięto o 1 dzień' : 'Przesunięto o 1 tydzień');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
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
          title: entry.raw?.title || entry.title,
          type: entry.raw?.type || 'meeting',
          startAt: entry.raw?.startAt || entry.startsAt,
          endAt: entry.raw?.endAt || entry.endsAt || null,
          status: wasCompleted ? 'scheduled' : 'completed',
          leadId: entry.raw?.leadId ?? null,
          caseId: entry.raw?.caseId ?? null,
        });
      } else if (entry.kind === 'task') {
        await updateTaskInSupabase({
          id: entry.sourceId,
          title: entry.raw?.title || entry.title,
          type: entry.raw?.type,
          date: entry.raw?.date || entry.startsAt.slice(0, 10),
          status: wasCompleted ? 'todo' : 'done',
          priority: entry.raw?.priority,
          leadId: entry.raw?.leadId ?? null,
          caseId: entry.raw?.caseId ?? null,
        });
      }

      await refreshSupabaseBundle();

      toast.success(wasCompleted ? 'Wpis przywrócony' : 'Wpis oznaczony jako zrobiony');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
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

      await refreshSupabaseBundle();
      toast.success('Wpis usunięty');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
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
          endAt: editDraft.endAt,
          reminderAt,
          recurrenceRule: editDraft.recurrence.mode,
          status: editEntry.raw?.status || 'scheduled',
          leadId: editDraft.leadId || null,
          caseId: editDraft.caseId || null,
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
      toast.error('Błąd: ' + error.message);
    } finally {
      editEntrySubmitLockRef.current = false;
      setEditSubmitting(false);
      setActionPendingId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const actionButtonClass = createEntryActionClass();

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 capitalize">
              {calendarView === 'week'
                ? `${format(selectedWeekStart, 'd MMM', { locale: pl })} - ${format(selectedWeekEnd, 'd MMM yyyy', { locale: pl })}`
                : format(currentMonth, 'MMMM yyyy', { locale: pl })}
            </h1>
            <p className="text-slate-500">Kalendarz dla zadań, wydarzeń i terminów ruchu z leadów.</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <Button
                variant={calendarView === 'week' ? 'default' : 'ghost'}
                className="h-9 rounded-lg px-3 text-sm font-semibold"
                onClick={() => setCalendarView('week')}
              >
                Tydzień
              </Button>
              <Button
                variant={calendarView === 'month' ? 'default' : 'ghost'}
                className="h-9 rounded-lg px-3 text-sm font-semibold"
                onClick={() => setCalendarView('month')}
              >
                Miesiąc
              </Button>
            </div>
            {calendarView === 'month' ? (
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                <Button variant={calendarScale === 'compact' ? 'default' : 'ghost'} className="h-9 rounded-lg px-3 text-sm font-semibold" onClick={() => setCalendarScale('compact')}>
                  Małe kafelki
                </Button>
                <Button variant={calendarScale === 'default' ? 'default' : 'ghost'} className="h-9 rounded-lg px-3 text-sm font-semibold" onClick={() => setCalendarScale('default')}>
                  Standard
                </Button>
                <Button variant={calendarScale === 'large' ? 'default' : 'ghost'} className="h-9 rounded-lg px-3 text-sm font-semibold" onClick={() => setCalendarScale('large')}>
                  Duże kafelki
                </Button>
              </div>
            ) : null}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (calendarView === 'week') {
                    const next = addDays(selectedDate, -7);
                    setSelectedDate(next);
                    setCurrentMonth(next);
                    return;
                  }
                  setCurrentMonth(subMonths(currentMonth, 1));
                }}
                className="rounded-lg text-primary hover:bg-primary/10 hover:text-primary"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} className="text-sm font-bold px-4 text-slate-700 hover:text-slate-900">
                Dzisiaj
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (calendarView === 'week') {
                    const next = addDays(selectedDate, 7);
                    setSelectedDate(next);
                    setCurrentMonth(next);
                    return;
                  }
                  setCurrentMonth(addMonths(currentMonth, 1));
                }}
                className="rounded-lg text-primary hover:bg-primary/10 hover:text-primary"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl" disabled={!workspaceReady}>
                  <Plus className="w-4 h-4 mr-2" /> Zadanie
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Dodaj zadanie</DialogTitle></DialogHeader>
                <form onSubmit={handleAddTask} className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Tytuł zadania</Label>
                    <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <select className={modalSelectClass} value={newTask.type} onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}>
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
                    <div className="space-y-2">
                      <Label>Priorytet</Label>
                      <select className={modalSelectClass} value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Data i godzina</Label>
                      <Input type="datetime-local" value={newTask.dueAt} onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })} required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full" disabled={taskSubmitting || !workspaceReady}>{taskSubmitting ? 'Dodawanie...' : 'Dodaj zadanie'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-lg shadow-primary/20" disabled={!workspaceReady}><Plus className="w-4 h-4 mr-2" /> Wydarzenie</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Zaplanuj wydarzenie</DialogTitle></DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tytuł</Label>
                      <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Typ</Label>
                        <select className={modalSelectClass} value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
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
                      <div className="space-y-2">
                        <Label>Start</Label>
                        <Input type="datetime-local" value={newEvent.startAt} onChange={(e) => handleStartChange(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
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
                        <select className={modalSelectClass} value={newEvent.recurrence.mode} onChange={(e) => setNewEvent({ ...newEvent, recurrence: { ...newEvent.recurrence, mode: e.target.value as any } })}>
                          {RECURRENCE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Co ile</Label>
                        <Input type="number" min="1" value={newEvent.recurrence.interval} onChange={(e) => setNewEvent({ ...newEvent, recurrence: { ...newEvent.recurrence, interval: Math.max(1, Number(e.target.value) || 1) } })} disabled={newEvent.recurrence.mode === 'none'} />
                      </div>
                    </div>
                    <div className="space-y-2">
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
                      <div className="space-y-2">
                        <Label>Tryb</Label>
                        <select className={modalSelectClass} value={newEvent.reminder.mode} onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, mode: e.target.value as any } })}>
                          {REMINDER_MODE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Kiedy przypomnieć</Label>
                        <select className={modalSelectClass} value={newEvent.reminder.minutesBefore} onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, minutesBefore: Number(e.target.value) } })} disabled={newEvent.reminder.mode === 'none'}>
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
                          <select className={modalSelectClass} value={newEvent.reminder.recurrenceMode} onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, recurrenceMode: e.target.value as any } })}>
                            {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Co ile</Label>
                          <Input type="number" min="1" value={newEvent.reminder.recurrenceInterval} onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, recurrenceInterval: Math.max(1, Number(e.target.value) || 1) } })} />
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="w-full" disabled={eventSubmitting || !workspaceReady}>{eventSubmitting ? 'Dodawanie...' : 'Zaplanuj'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Tydzień operacyjny</p>
              <h2 className="text-lg font-bold text-slate-900">
                {format(selectedWeekStart, 'd MMM', { locale: pl })} - {format(selectedWeekEnd, 'd MMM yyyy', { locale: pl })}
              </h2>
            </div>
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              Wybrany dzień: {format(selectedDate, 'EEEE, d MMMM', { locale: pl })}
            </div>
          </div>
        </div>

        {calendarView === 'month' ? (
          <>
            <div className="grid grid-cols-7 mb-2">
              {['Pon', 'Wt', 'Śro', 'Czw', 'Pt', 'Sob', 'Ndz'].map((day) => (
                <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-t border-l border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              {calendarDays.map((day, index) => {
                const dayEntries = sortCalendarEntriesForDisplay(getEntriesForDay(scheduleEntries, day));
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDay = isToday(day);
                const isSelectedDay = isSameDay(day, selectedDate);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    style={{ minHeight: monthCellMinHeight }}
                    className={`p-2 border-r border-b border-slate-100 text-left transition-colors hover:bg-slate-50/50 ${!isCurrentMonth ? 'bg-slate-50/30 text-slate-300' : 'text-slate-900'} ${isSelectedDay ? 'ring-2 ring-inset ring-primary/30 bg-primary/5' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isTodayDay ? 'bg-primary text-white' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      {dayEntries.length > 0 && <Badge variant="secondary" className="h-5 text-[10px]">{dayEntries.length}</Badge>}
                    </div>
                    <div className="space-y-1">
                      {dayEntries.slice(0, calendarScale === 'compact' ? 3 : 4).map((entry) => {
                        const isCompletedEntry = entry.kind === 'task' && entry.raw?.status === 'done';

                        return (
                          <div key={entry.id} className={`rounded border p-1 text-[10px] font-medium ${getEntryTone(entry)} ${isCompletedEntry ? 'opacity-60' : ''}`}>
                            <span className={`break-words ${isCompletedEntry ? 'line-through' : ''}`}>{format(parseISO(entry.startsAt), 'HH:mm')} {entry.title}</span>
                          </div>
                        );
                      })}
                      {dayEntries.length > (calendarScale === 'compact' ? 3 : 4) && (
                        <div className="text-[10px] text-slate-500 font-medium px-1">+ {dayEntries.length - (calendarScale === 'compact' ? 3 : 4)} więcej</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
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
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Widok tygodniowy</h3>
              </div>
              <Badge variant="secondary" className="h-7 px-3">{weekEntries.length} wpisów</Badge>
            </div>

            <div className="overflow-x-auto pb-1 xl:overflow-visible">
              <div className="grid grid-flow-col gap-3 min-w-[980px] xl:min-w-0 xl:grid-flow-row xl:grid-cols-7" style={{ gridAutoColumns: `minmax(${weekColumnMinWidth}, 1fr)` }}>
                {weekDays.map((day) => {
                  const dayEntries = sortCalendarEntriesForDisplay(getEntriesForDay(weekEntries, day));
                  const isActiveDay = isSameDay(day, selectedDate);

                  return (
                    <div key={day.toISOString()} className={`rounded-xl border p-2.5 ${isActiveDay ? 'border-primary/40 bg-primary/5' : 'border-slate-200 bg-slate-50/40'}`}>
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{format(day, 'EEEE', { locale: pl })}</p>
                          <p className="text-base font-bold text-slate-900">{format(day, 'd MMM', { locale: pl })}</p>
                        </div>
                        {isToday(day) ? <Badge className="bg-primary/15 text-primary hover:bg-primary/15">Dziś</Badge> : null}
                      </div>

                      <div className="space-y-2">
                        {dayEntries.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-2.5 py-4 text-center text-[11px] text-slate-400">
                            Brak wpisów
                          </div>
                        ) : dayEntries.map((entry) => (
                          <div key={entry.id}>
                            <ScheduleEntryCard
                              entry={entry}
                              actionButtonClass={actionButtonClass}
                              actionPendingId={actionPendingId}
                              caseTitle={entry.raw?.caseId ? caseTitleById.get(String(entry.raw.caseId)) || 'Powiązana sprawa' : null}
                              onEdit={handleOpenEdit}
                              onShift={handleShiftEntry}
                              onComplete={handleCompleteEntry}
                              onDelete={handleDeleteEntry}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Dialog open={Boolean(editEntry && editDraft)} onOpenChange={(open) => {
        if (!open) {
          setEditEntry(null);
          setEditDraft(null);
        }
      }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edytuj wpis z kalendarza</DialogTitle>
          </DialogHeader>
          {editEntry && editDraft ? (
            <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Tytuł</Label>
                <Input value={editDraft.title} onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })} required />
              </div>

              {editEntry.kind !== 'lead' ? (
                <div className="space-y-2">
                  <Label>Typ</Label>
                  <select className={modalSelectClass} value={editDraft.type} onChange={(e) => setEditDraft({ ...editDraft, type: e.target.value })}>
                    {(editEntry.kind === 'event' ? EVENT_TYPES : TASK_TYPES).map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className={`grid gap-4 ${editEntry.kind === 'event' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label>Koniec</Label>
                    <Input type="datetime-local" value={editDraft.endAt} onChange={(e) => setEditDraft({ ...editDraft, endAt: e.target.value })} required />
                  </div>
                ) : null}
              </div>

              {editEntry.kind === 'task' ? (
                <div className="space-y-2">
                  <Label>Priorytet</Label>
                  <select className={modalSelectClass} value={editDraft.priority} onChange={(e) => setEditDraft({ ...editDraft, priority: e.target.value })}>
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              {editEntry.kind !== 'lead' ? (
                <div className="space-y-2">
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
                      <select className={modalSelectClass} value={editDraft.recurrence.mode} onChange={(e) => setEditDraft({ ...editDraft, recurrence: { ...editDraft.recurrence, mode: e.target.value as any } })}>
                        {RECURRENCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Co ile</Label>
                      <Input type="number" min="1" value={editDraft.recurrence.interval} onChange={(e) => setEditDraft({ ...editDraft, recurrence: { ...editDraft.recurrence, interval: Math.max(1, Number(e.target.value) || 1) } })} disabled={editDraft.recurrence.mode === 'none'} />
                    </div>
                  </div>
                  <div className="space-y-2">
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
                    <div className="space-y-2">
                      <Label>Tryb</Label>
                      <select className={modalSelectClass} value={editDraft.reminder.mode} onChange={(e) => setEditDraft({ ...editDraft, reminder: { ...editDraft.reminder, mode: e.target.value as any } })}>
                        {REMINDER_MODE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Kiedy przypomnieć</Label>
                      <select className={modalSelectClass} value={editDraft.reminder.minutesBefore} onChange={(e) => setEditDraft({ ...editDraft, reminder: { ...editDraft.reminder, minutesBefore: Number(e.target.value) } })} disabled={editDraft.reminder.mode === 'none'}>
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
                        <select className={modalSelectClass} value={editDraft.reminder.recurrenceMode} onChange={(e) => setEditDraft({ ...editDraft, reminder: { ...editDraft.reminder, recurrenceMode: e.target.value as any } })}>
                          {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Co ile</Label>
                        <Input type="number" min="1" value={editDraft.reminder.recurrenceInterval} onChange={(e) => setEditDraft({ ...editDraft, reminder: { ...editDraft.reminder, recurrenceInterval: Math.max(1, Number(e.target.value) || 1) } })} />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <DialogFooter>
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
