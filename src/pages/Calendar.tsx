import { useState, useEffect, FormEvent } from 'react';
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
import {
  buildStartEndPair,
  combineScheduleEntries,
  createDefaultRecurrence,
  createDefaultReminder,
  getEntriesForDay,
  getEntryTone,
  getTaskStartAt,
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
  getScheduleEntryIcon,
} from '../lib/options';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import {
  deleteEventFromSupabase,
  deleteTaskFromSupabase,
  insertActivityToSupabase,
  insertEventToSupabase,
  insertTaskToSupabase,
  updateEventInSupabase,
  updateLeadInSupabase,
  updateTaskInSupabase,
} from '../lib/supabase-fallback';

type CalendarEditDraft = {
  title: string;
  type: string;
  startAt: string;
  endAt: string;
  leadId: string;
};

type CalendarScale = 'compact' | 'default' | 'large';

type CalendarView = 'week' | 'month';

const CALENDAR_SCALE_STORAGE_KEY = 'leadflow-calendar-scale';
const CALENDAR_VIEW_STORAGE_KEY = 'closeflow:calendar:view:v1';
const modalSelectClass = 'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

function createEntryActionClass() {
  return 'inline-flex h-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 px-3 text-xs font-semibold text-white transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50';
}

function buildEditDraft(entry: ScheduleEntry): CalendarEditDraft {
  if (entry.kind === 'event') {
    return {
      title: entry.raw?.title || entry.title,
      type: entry.raw?.type || 'meeting',
      startAt: entry.raw?.startAt || entry.startsAt,
      endAt: entry.raw?.endAt || entry.endsAt || buildStartEndPair(entry.startsAt).endAt,
      leadId: entry.raw?.leadId || 'none',
    };
  }

  if (entry.kind === 'task') {
    return {
      title: entry.raw?.title || entry.title,
      type: entry.raw?.type || 'follow_up',
      startAt: getTaskStartAt(entry.raw) || entry.startsAt,
      endAt: '',
      leadId: entry.raw?.leadId || 'none',
    };
  }

  return {
    title: entry.raw?.nextStep || entry.title,
    type: 'lead_follow_up',
    startAt: entry.raw?.nextActionAt?.includes?.('T') ? entry.raw.nextActionAt : entry.startsAt,
    endAt: '',
    leadId: entry.raw?.id || entry.sourceId,
  };
}

function getEntrySubtitle(entry: ScheduleEntry) {
  const typedLabel = typeof entry.raw?.type === 'string' && entry.raw.type
    ? `Typ: ${entry.raw.type}`
    : entry.kind === 'event'
      ? 'Wydarzenie w kalendarzu'
      : entry.kind === 'task'
        ? 'Zadanie w planie'
        : 'Ruch leadowy';

  if (entry.leadName) {
    return `Lead: ${entry.leadName} • ${typedLabel}`;
  }

  return typedLabel;
}

function sortCalendarEntriesForDisplay(entries: ScheduleEntry[]) {
  return [...entries].sort((a, b) => {
    const aDone = a.kind === 'task' && a.raw?.status === 'done';
    const bDone = b.kind === 'task' && b.raw?.status === 'done';

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
  onEdit: (entry: ScheduleEntry) => void;
  onShift: (entry: ScheduleEntry, days: number) => void;
  onComplete: (entry: ScheduleEntry) => void;
  onDelete: (entry: ScheduleEntry) => void;
};

function ScheduleEntryCard({ entry, actionButtonClass, actionPendingId, onEdit, onShift, onComplete, onDelete }: ScheduleEntryCardProps) {
  const pendingEdit = actionPendingId === `${entry.id}:edit`;
  const pendingDay = actionPendingId === `${entry.id}:1`;
  const pendingWeek = actionPendingId === `${entry.id}:7`;
  const pendingDone = actionPendingId === `${entry.id}:done`;
  const pendingDelete = actionPendingId === `${entry.id}:delete`;
  const EntryIcon = getScheduleEntryIcon(entry.kind, entry.raw?.type);
  const isCompletedTask = entry.kind === 'task' && entry.raw?.status === 'done';

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-3 shadow-sm ${isCompletedTask ? 'opacity-60' : ''}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <Badge className={`${getEntryTone(entry)} border`}>{entry.badgeLabel || entry.kind}</Badge>
        <span className="text-[11px] font-semibold text-slate-500">
          {format(parseISO(entry.startsAt), 'HH:mm')}
        </span>
      </div>

      <div className="mb-3 min-w-0">
        <div className="flex items-start gap-2">
          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${getEntryTone(entry)}`}>
            <EntryIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-bold break-words ${isCompletedTask ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{entry.title}</p>
            <p className={`text-[11px] break-words ${isCompletedTask ? 'text-slate-400 line-through' : 'text-slate-500'}`}>{getEntrySubtitle(entry)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button type="button" className={actionButtonClass} onClick={() => onEdit(entry)} disabled={pendingEdit}>Edytuj</button>
        <button type="button" className={actionButtonClass} onClick={() => onShift(entry, 1)} disabled={pendingDay}>{pendingDay ? '...' : '+1D'}</button>
        <button type="button" className={actionButtonClass} onClick={() => onShift(entry, 7)} disabled={pendingWeek}>{pendingWeek ? '...' : '+1W'}</button>
        <button type="button" className={actionButtonClass} onClick={() => onComplete(entry)} disabled={pendingDone}>
          <CheckSquare className="mr-2 h-4 w-4" /> {pendingDone ? '...' : 'Zrobione'}
        </button>
        <button type="button" className={actionButtonClass} onClick={() => onDelete(entry)} disabled={pendingDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> {pendingDelete ? '...' : 'Usuń'}
        </button>
      </div>
    </div>
  );
}

export default function Calendar() {
  const { workspace, hasAccess } = useWorkspace();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>('week');
  const [calendarScale, setCalendarScale] = useState<CalendarScale>('default');
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
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
      leadId: 'none',
      leadName: '',
      recurrence: createDefaultRecurrence(),
      reminder: createDefaultReminder(),
    };
  });
  const [newTask, setNewTask] = useState(() => ({
    title: '',
    type: 'follow_up',
    dueAt: toDateTimeLocalValue(new Date()),
    priority: 'medium',
    leadId: 'none',
  }));

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
    const bundle = await fetchCalendarBundleFromSupabase();
    setEvents(bundle.events);
    setTasks(bundle.tasks);
    setLeads(bundle.leads);
    return bundle;
  }

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    let cancelled = false;

    const loadBundle = async () => {
      try {
        setLoading(true);
        const bundle = await fetchCalendarBundleFromSupabase();
        if (cancelled) return;
        setEvents(bundle.events);
        setTasks(bundle.tasks);
        setLeads(bundle.leads);
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
  }, [workspace]);

  const resetNewEvent = () => {
    const pair = buildStartEndPair(toDateTimeLocalValue(new Date()));
    setNewEvent({
      title: '',
      type: 'meeting',
      ...pair,
      leadId: 'none',
      leadName: '',
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
      leadId: 'none',
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

  const handleSoftNextStepAfterEntryCompletion = async ({
    leadId,
    leadName,
    fallbackTitle,
  }: {
    leadId?: string | null;
    leadName?: string;
    fallbackTitle?: string;
  }) => {
    if (!leadId) return;

    const bundle = await refreshSupabaseBundle();
    const latestLead = bundle.leads.find((lead) => lead.id === leadId);

    if (!latestLead || latestLead.status === 'won' || latestLead.status === 'lost' || latestLead.nextActionAt) {
      return;
    }

    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);

    const choice = window.prompt(
      `Lead "${leadName || latestLead.name || 'Lead'}" zostal bez kolejnego kroku.` +
      `\n1 = ustaw krok teraz` +
      `\n2 = przypomnij jutro` +
      `\n3 = zostaw bez kroku`,
      '2',
    );

    if (!choice) return;

    if (choice === '1') {
      const nextStep = window.prompt('Wpisz kolejny krok', fallbackTitle || 'Follow-up');
      if (!nextStep?.trim()) return;

      const nextActionAt = window.prompt(
        'Podaj termin w formacie RRRR-MM-DDTHH:mm',
        toDateTimeLocalValue(next),
      );
      if (!nextActionAt?.trim()) return;

      await updateLeadInSupabase({
        id: String(leadId),
        nextStep: nextStep.trim(),
        nextActionAt,
      });
      await refreshSupabaseBundle();
      toast.success('Kolejny krok zapisany');
      return;
    }

    if (choice === '2') {
      await updateLeadInSupabase({
        id: String(leadId),
        nextStep: fallbackTitle || 'Follow-up',
        nextActionAt: toDateTimeLocalValue(next),
      });
      await refreshSupabaseBundle();
      toast.success('Ustawiono przypomnienie na jutro');
    }
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');

    const selectedLead = leads.find((lead) => lead.id === newTask.leadId);

    try {
      await insertTaskToSupabase({
        title: newTask.title,
        type: newTask.type,
        date: newTask.dueAt.slice(0, 10),
        scheduledAt: newTask.dueAt,
        priority: newTask.priority,
        leadId: selectedLead?.id ?? null,
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
      });

      await refreshSupabaseBundle();
      toast.success('Zadanie dodane');
      setIsNewTaskOpen(false);
      resetNewTask();
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');

    const selectedLead = leads.find((lead) => lead.id === newEvent.leadId);
    const reminderAt = toReminderAtIso(newEvent.startAt, newEvent.reminder);

    try {
      await insertEventToSupabase({
        title: newEvent.title,
        type: newEvent.type,
        startAt: newEvent.startAt,
        endAt: newEvent.endAt,
        reminderAt,
        recurrenceRule: newEvent.recurrence.mode,
        leadId: selectedLead?.id ?? null,
        workspaceId: workspace.id,
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
        });
      } else {
        const currentLeadAt = typeof entry.raw?.nextActionAt === 'string' && entry.raw.nextActionAt
          ? entry.raw.nextActionAt
          : entry.startsAt;
        const nextStart = addDays(parseISO(currentLeadAt.includes('T') ? currentLeadAt : `${currentLeadAt}T09:00`), days);

        await updateLeadInSupabase({
          id: entry.sourceId,
          nextStep: entry.raw?.nextStep || entry.title,
          nextActionAt: toDateTimeLocalValue(nextStart),
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

      let softLeadId: string | null = null;
      let softLeadName = entry.leadName || '';
      let softFallbackTitle = entry.title;

      if (entry.kind === 'event') {
        softLeadId = entry.raw?.leadId ?? null;
        await updateEventInSupabase({
          id: entry.sourceId,
          title: entry.raw?.title || entry.title,
          type: entry.raw?.type || 'meeting',
          startAt: entry.raw?.startAt || entry.startsAt,
          endAt: entry.raw?.endAt || entry.endsAt || null,
          status: 'completed',
          leadId: entry.raw?.leadId ?? null,
        });
      } else if (entry.kind === 'task') {
        softLeadId = entry.raw?.leadId ?? null;
        await updateTaskInSupabase({
          id: entry.sourceId,
          title: entry.raw?.title || entry.title,
          type: entry.raw?.type,
          date: entry.raw?.date || entry.startsAt.slice(0, 10),
          status: 'done',
          priority: entry.raw?.priority,
          leadId: entry.raw?.leadId ?? null,
        });
      } else {
        await updateLeadInSupabase({
          id: entry.sourceId,
          nextStep: '',
          nextActionAt: null,
        });
      }

      await refreshSupabaseBundle();

      if (softLeadId) {
        await handleSoftNextStepAfterEntryCompletion({
          leadId: softLeadId,
          leadName: softLeadName,
          fallbackTitle: softFallbackTitle,
        });
      }

      toast.success('Wpis oznaczony jako zrobiony');
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
      } else {
        await updateLeadInSupabase({
          id: entry.sourceId,
          nextStep: '',
          nextActionAt: null,
        });
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
    if (!hasAccess) return toast.error('Trial wygasł.');

    try {
      setActionPendingId(`${editEntry.id}:edit`);

      if (editEntry.kind === 'event') {
        const selectedLead = leads.find((lead) => lead.id === editDraft.leadId);
        const reminderAt = toReminderAtIso(editDraft.startAt, editEntry.raw?.reminder);
        await updateEventInSupabase({
          id: editEntry.sourceId,
          title: editDraft.title,
          type: editDraft.type,
          startAt: editDraft.startAt,
          endAt: editDraft.endAt,
          leadId: selectedLead?.id ?? null,
        });
        await registerReminderScheduled({
          entityType: 'event',
          title: editDraft.title,
          scheduledAt: editDraft.startAt,
          reminderAt,
        });
      } else if (editEntry.kind === 'task') {
        const selectedLead = leads.find((lead) => lead.id === editDraft.leadId);
        const nextDate = parseISO(editDraft.startAt);
        const payload = syncTaskDerivedFields({
          ...editEntry.raw,
          title: editDraft.title,
          type: editDraft.type,
          dueAt: editDraft.startAt,
          date: format(nextDate, 'yyyy-MM-dd'),
          time: format(nextDate, 'HH:mm'),
          leadId: selectedLead?.id ?? null,
          leadName: selectedLead?.name ?? '',
        });
        const reminderAt = toReminderAtIso(payload.dueAt, payload.reminder);

        await updateTaskInSupabase({
          id: editEntry.sourceId,
          title: payload.title,
          type: payload.type,
          date: payload.date,
          status: payload.status,
          priority: payload.priority,
          leadId: payload.leadId ?? null,
        });
        await registerReminderScheduled({
          entityType: 'task',
          title: payload.title,
          scheduledAt: payload.dueAt,
          reminderAt,
        });
      } else {
        await updateLeadInSupabase({
          id: editEntry.sourceId,
          nextStep: editDraft.title,
          nextActionAt: editDraft.startAt,
        });
      }

      await refreshSupabaseBundle();
      toast.success('Wpis zaktualizowany');
      setEditEntry(null);
      setEditDraft(null);
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    } finally {
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
                <Button variant="outline" className="rounded-xl">
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
                    <div className="space-y-2">
                      <Label>Lead</Label>
                      <select className={modalSelectClass} value={newTask.leadId} onChange={(e) => setNewTask({ ...newTask, leadId: e.target.value })}>
                        <option value="none">Bez leada</option>
                        {leads.map((lead) => (
                          <option key={lead.id} value={lead.id}>{lead.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
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
                    <Button type="submit" className="w-full">Dodaj zadanie</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Wydarzenie</Button>
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
                      <div className="space-y-2">
                        <Label>Lead</Label>
                        <select className={modalSelectClass} value={newEvent.leadId} onChange={(e) => setNewEvent({ ...newEvent, leadId: e.target.value })}>
                          <option value="none">Bez leada</option>
                          {leads.map((lead) => (
                            <option key={lead.id} value={lead.id}>{lead.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
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
                    <Button type="submit" className="w-full">Zaplanuj</Button>
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
              <p className="text-sm text-slate-500">Zadania, leady i wydarzenia mają ten sam zestaw akcji: Edytuj, +1D, +1W, Zrobione, Usuń.</p>
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
                        const EntryIcon = getScheduleEntryIcon(entry.kind, entry.raw?.type);
                        const isCompletedTask = entry.kind === 'task' && entry.raw?.status === 'done';

                        return (
                          <div key={entry.id} className={`flex items-center gap-1 rounded border p-1 text-[10px] font-medium ${getEntryTone(entry)} ${isCompletedTask ? 'opacity-60' : ''}`}>
                            <EntryIcon className="h-3 w-3 shrink-0" />
                            <span className={`break-words ${isCompletedTask ? 'line-through' : ''}`}>{format(parseISO(entry.startsAt), 'HH:mm')} {entry.title}</span>
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
                <p className="text-sm text-slate-500">Każdy wpis ma ten sam zestaw akcji, niezależnie od tego, czy to zadanie, lead czy wydarzenie.</p>
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
                <Label>{editEntry.kind === 'lead' ? 'Next step' : 'Tytuł'}</Label>
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
                  <Label>{editEntry.kind === 'lead' ? 'Termin ruchu' : 'Start'}</Label>
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

              {editEntry.kind !== 'lead' ? (
                <div className="space-y-2">
                  <Label>Lead</Label>
                  <select className={modalSelectClass} value={editDraft.leadId} onChange={(e) => setEditDraft({ ...editDraft, leadId: e.target.value })}>
                    <option value="none">Bez leada</option>
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>{lead.name}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              <DialogFooter>
                <Button type="submit" disabled={actionPendingId === `${editEntry.id}:edit`}>
                  {actionPendingId === `${editEntry.id}:edit` ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
