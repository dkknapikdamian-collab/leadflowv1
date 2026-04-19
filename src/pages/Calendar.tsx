import { useState, useEffect, FormEvent } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
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
import { Link } from 'react-router-dom';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
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
  type ScheduleEntry,
} from '../lib/scheduling';
import {
  EVENT_TYPES,
  RECURRENCE_OPTIONS,
  REMINDER_MODE_OPTIONS,
  TASK_TYPES,
  getScheduleEntryIcon,
} from '../lib/options';

type CalendarEditDraft = {
  title: string;
  type: string;
  startAt: string;
  endAt: string;
  leadId: string;
};

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

type ScheduleEntryCardProps = {
  entry: ScheduleEntry;
  actionButtonClass: string;
  actionPendingId: string | null;
  onEdit: (entry: ScheduleEntry) => void;
  onShift: (entry: ScheduleEntry, days: number) => void;
  onComplete: (entry: ScheduleEntry) => void;
};

function ScheduleEntryCard({ entry, actionButtonClass, actionPendingId, onEdit, onShift, onComplete }: ScheduleEntryCardProps) {
  const pendingEdit = actionPendingId === `${entry.id}:edit`;
  const pendingDay = actionPendingId === `${entry.id}:1`;
  const pendingWeek = actionPendingId === `${entry.id}:7`;
  const pendingDone = actionPendingId === `${entry.id}:done`;
  const EntryIcon = getScheduleEntryIcon(entry.kind, entry.raw?.type);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
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
            <p className="truncate text-sm font-bold text-slate-900">{entry.title}</p>
            <p className="truncate text-[11px] text-slate-500">{getEntrySubtitle(entry)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={actionButtonClass} onClick={() => onEdit(entry)} disabled={pendingEdit}>Edytuj</button>
        <button type="button" className={actionButtonClass} onClick={() => onShift(entry, 1)} disabled={pendingDay}>{pendingDay ? '...' : '+1D'}</button>
        <button type="button" className={actionButtonClass} onClick={() => onShift(entry, 7)} disabled={pendingWeek}>{pendingWeek ? '...' : '+1W'}</button>
        <button type="button" className={actionButtonClass} onClick={() => onComplete(entry)} disabled={pendingDone}>
          <CheckSquare className="mr-2 h-4 w-4" /> {pendingDone ? '...' : 'Zrobione'}
        </button>
      </div>
    </div>
  );
}

export default function Calendar() {
  const { workspace, hasAccess } = useWorkspace();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
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

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    const eventsQuery = query(
      collection(db, 'events'),
      where('ownerId', '==', auth.currentUser.uid),
      where('status', '==', 'scheduled'),
      orderBy('startAt', 'asc')
    );

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      where('status', '==', 'todo'),
      orderBy('date', 'asc')
    );

    const leadsQuery = query(
      collection(db, 'leads'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (snap) => {
      setEvents(snap.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });

    const unsubscribeTasks = onSnapshot(tasksQuery, (snap) => {
      setTasks(snap.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      setLoading(false);
    });

    const unsubscribeLeads = onSnapshot(leadsQuery, (snap) => {
      setLeads(snap.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });

    return () => {
      unsubscribeEvents();
      unsubscribeTasks();
      unsubscribeLeads();
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

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');

    const selectedLead = leads.find((lead) => lead.id === newEvent.leadId);

    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        leadId: selectedLead?.id ?? null,
        leadName: selectedLead?.name ?? '',
        recurrence: normalizeRecurrenceConfig(newEvent.recurrence),
        reminder: normalizeReminderConfig(newEvent.reminder),
        status: 'scheduled',
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
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
  const selectedDayEntries = getEntriesForDay(scheduleEntries, selectedDate);

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

        await updateDoc(doc(db, 'events', entry.sourceId), {
          startAt: nextStart,
          endAt: nextEnd,
          updatedAt: serverTimestamp(),
        });
      } else if (entry.kind === 'task') {
        const nextStart = addDays(parseISO(getTaskStartAt(entry.raw) || entry.startsAt), days);
        const taskPayload = syncTaskDerivedFields({
          ...entry.raw,
          dueAt: toDateTimeLocalValue(nextStart),
          date: format(nextStart, 'yyyy-MM-dd'),
          time: format(nextStart, 'HH:mm'),
        });

        await updateDoc(doc(db, 'tasks', entry.sourceId), {
          ...taskPayload,
          updatedAt: serverTimestamp(),
        });
      } else {
        const currentLeadAt = typeof entry.raw?.nextActionAt === 'string' && entry.raw.nextActionAt
          ? entry.raw.nextActionAt
          : entry.startsAt;
        const nextStart = addDays(parseISO(currentLeadAt.includes('T') ? currentLeadAt : `${currentLeadAt}T09:00`), days);

        await updateDoc(doc(db, 'leads', entry.sourceId), {
          nextActionAt: toDateTimeLocalValue(nextStart),
          updatedAt: serverTimestamp(),
        });
      }

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

      if (entry.kind === 'event') {
        await updateDoc(doc(db, 'events', entry.sourceId), {
          status: 'completed',
          updatedAt: serverTimestamp(),
        });
      } else if (entry.kind === 'task') {
        await updateDoc(doc(db, 'tasks', entry.sourceId), {
          status: 'done',
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, 'leads', entry.sourceId), {
          nextStep: '',
          nextActionAt: null,
          lastContactAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      toast.success('Wpis oznaczony jako zrobiony');
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
        await updateDoc(doc(db, 'events', editEntry.sourceId), {
          title: editDraft.title,
          type: editDraft.type,
          startAt: editDraft.startAt,
          endAt: editDraft.endAt,
          leadId: selectedLead?.id ?? null,
          leadName: selectedLead?.name ?? '',
          updatedAt: serverTimestamp(),
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

        await updateDoc(doc(db, 'tasks', editEntry.sourceId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, 'leads', editEntry.sourceId), {
          nextStep: editDraft.title,
          nextActionAt: editDraft.startAt,
          updatedAt: serverTimestamp(),
        });
      }

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
            <h1 className="text-3xl font-bold text-slate-900 capitalize">{format(currentMonth, 'MMMM yyyy', { locale: pl })}</h1>
            <p className="text-slate-500">Kalendarz live dla zadań, wydarzeń i ruchów leadowych.</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="rounded-lg"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} className="text-sm font-bold px-4">Dzisiaj</Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="rounded-lg"><ChevronRight className="w-4 h-4" /></Button>
            </div>
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
                        <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {EVENT_TYPES.map((eventType) => (
                              <SelectItem key={eventType.value} value={eventType.value}>{eventType.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Lead</Label>
                        <Select value={newEvent.leadId} onValueChange={(value) => setNewEvent({ ...newEvent, leadId: value })}>
                          <SelectTrigger><SelectValue placeholder="Bez leada" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Bez leada</SelectItem>
                            {leads.map((lead) => (
                              <SelectItem key={lead.id} value={lead.id}>{lead.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          value={newEvent.recurrence.mode}
                          onValueChange={(value) => setNewEvent({
                            ...newEvent,
                            recurrence: {
                              ...newEvent.recurrence,
                              mode: value as any,
                            },
                          })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {RECURRENCE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Co ile</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newEvent.recurrence.interval}
                          onChange={(e) => setNewEvent({
                            ...newEvent,
                            recurrence: {
                              ...newEvent.recurrence,
                              interval: Math.max(1, Number(e.target.value) || 1),
                            },
                          })}
                          disabled={newEvent.recurrence.mode === 'none'}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Powtarzaj do</Label>
                      <Input
                        type="date"
                        value={newEvent.recurrence.until ?? ''}
                        onChange={(e) => setNewEvent({
                          ...newEvent,
                          recurrence: {
                            ...newEvent.recurrence,
                            until: e.target.value || null,
                          },
                        })}
                        disabled={newEvent.recurrence.mode === 'none'}
                      />
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
                        <Select
                          value={newEvent.reminder.mode}
                          onValueChange={(value) => setNewEvent({
                            ...newEvent,
                            reminder: {
                              ...newEvent.reminder,
                              mode: value as any,
                            },
                          })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {REMINDER_MODE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Ile minut wcześniej</Label>
                        <Input
                          type="number"
                          min="0"
                          value={newEvent.reminder.minutesBefore}
                          onChange={(e) => setNewEvent({
                            ...newEvent,
                            reminder: {
                              ...newEvent.reminder,
                              minutesBefore: Math.max(0, Number(e.target.value) || 0),
                            },
                          })}
                          disabled={newEvent.reminder.mode === 'none'}
                        />
                      </div>
                    </div>
                    {newEvent.reminder.mode === 'recurring' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Cykliczność przypomnienia</Label>
                          <Select
                            value={newEvent.reminder.recurrenceMode}
                            onValueChange={(value) => setNewEvent({
                              ...newEvent,
                              reminder: {
                                ...newEvent.reminder,
                                recurrenceMode: value as any,
                              },
                            })}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Co ile</Label>
                          <Input
                            type="number"
                            min="1"
                            value={newEvent.reminder.recurrenceInterval}
                            onChange={(e) => setNewEvent({
                              ...newEvent,
                              reminder: {
                                ...newEvent.reminder,
                                recurrenceInterval: Math.max(1, Number(e.target.value) || 1),
                              },
                            })}
                          />
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
              <p className="text-sm text-slate-500">Taski, leady i wydarzenia mają teraz identyczny pasek akcji: Edytuj, +1D, +1W, Zrobione.</p>
            </div>
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              Wybrany dzień: {format(selectedDate, 'EEEE, d MMMM', { locale: pl })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map((day) => (
            <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-t border-l border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
          {calendarDays.map((day, index) => {
            const dayEntries = getEntriesForDay(scheduleEntries, day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDay = isToday(day);
            const isSelectedDay = isSameDay(day, selectedDate);

            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={`min-h-[128px] p-2 border-r border-b border-slate-100 text-left transition-colors hover:bg-slate-50/50 ${!isCurrentMonth ? 'bg-slate-50/30 text-slate-300' : 'text-slate-900'} ${isSelectedDay ? 'ring-2 ring-inset ring-primary/30 bg-primary/5' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isTodayDay ? 'bg-primary text-white' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayEntries.length > 0 && <Badge variant="secondary" className="h-5 text-[10px]">{dayEntries.length}</Badge>}
                </div>
                <div className="space-y-1">
                  {dayEntries.slice(0, 4).map((entry) => {
                    const EntryIcon = getScheduleEntryIcon(entry.kind, entry.raw?.type);

                    return (
                      <div key={entry.id} className={`flex items-center gap-1 rounded border p-1 text-[10px] font-medium ${getEntryTone(entry)}`}>
                        <EntryIcon className="h-3 w-3 shrink-0" />
                        <span className="truncate">{format(parseISO(entry.startsAt), 'HH:mm')} {entry.title}</span>
                      </div>
                    );
                  })}
                  {dayEntries.length > 4 && (
                    <div className="text-[10px] text-slate-500 font-medium px-1">+ {dayEntries.length - 4} więcej</div>
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
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Widok tygodniowy</h3>
              <p className="text-sm text-slate-500">Każdy wpis ma ten sam zestaw akcji, niezależnie czy to zadanie, lead czy wydarzenie.</p>
            </div>
            <Badge variant="secondary" className="h-7 px-3">{weekEntries.length} wpisów</Badge>
          </div>

          <div className="grid gap-4 xl:grid-cols-7">
            {weekDays.map((day) => {
              const dayEntries = getEntriesForDay(weekEntries, day);
              const isActiveDay = isSameDay(day, selectedDate);

              return (
                <div key={day.toISOString()} className={`rounded-2xl border p-3 ${isActiveDay ? 'border-primary/40 bg-primary/5' : 'border-slate-200 bg-slate-50/40'}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{format(day, 'EEEE', { locale: pl })}</p>
                      <p className="text-base font-bold text-slate-900">{format(day, 'd MMM', { locale: pl })}</p>
                    </div>
                    {isToday(day) ? <Badge className="bg-primary/15 text-primary hover:bg-primary/15">Dziś</Badge> : null}
                  </div>

                  <div className="space-y-3">
                    {dayEntries.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-6 text-center text-xs text-slate-400">
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
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Repeat className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Cykliczne wpisy</h2>
            </div>
            <p className="text-sm text-slate-500">W tym miesiącu kalendarz rozwija powtarzalne zadania i wydarzenia bez ręcznego odświeżania.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Przypomnienia</h2>
            </div>
            <p className="text-sm text-slate-500">Tryb przypomnień zapisuje się już w danych. Warstwa wysyłki powiadomień wymaga jeszcze domknięcia logiki V1.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Live plan</h2>
            </div>
            <p className="text-sm text-slate-500">Kalendarz zbiera teraz wydarzenia, zadania oraz terminy kolejnego ruchu z leadów.</p>
          </div>
        </div>
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
                <Input
                  value={editDraft.title}
                  onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                  required
                />
              </div>

              {editEntry.kind !== 'lead' ? (
                <div className="space-y-2">
                  <Label>Typ</Label>
                  <Select value={editDraft.type} onValueChange={(value) => setEditDraft({ ...editDraft, type: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(editEntry.kind === 'event' ? EVENT_TYPES : TASK_TYPES).map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Input
                      type="datetime-local"
                      value={editDraft.endAt}
                      onChange={(e) => setEditDraft({ ...editDraft, endAt: e.target.value })}
                      required
                    />
                  </div>
                ) : null}
              </div>

              {editEntry.kind !== 'lead' ? (
                <div className="space-y-2">
                  <Label>Lead</Label>
                  <Select value={editDraft.leadId} onValueChange={(value) => setEditDraft({ ...editDraft, leadId: value })}>
                    <SelectTrigger><SelectValue placeholder="Bez leada" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Bez leada</SelectItem>
                      {leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>{lead.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
