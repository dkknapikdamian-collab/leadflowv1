import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { addDays, addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import { pl } from 'date-fns/locale';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Calendar as CalendarIcon, CheckSquare, ChevronLeft, ChevronRight, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { auth, db } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import { RecurrenceEndType, RecurrenceRule, SnoozePreset, applySnoozePreset } from '../lib/scheduling';
import { deleteEventFromSupabase, insertEventToSupabase, isSupabaseConfigured, updateEventInSupabase, updateTaskInSupabase } from '../lib/supabase-fallback';
import { fetchCalendarBundleFromSupabase, normalizeCalendarEvent, normalizeCalendarLeadAction, normalizeCalendarTask, type CalendarEventItem, type CalendarLeadActionItem, type CalendarTaskItem } from '../lib/calendar-items';
import Layout from '../components/Layout';
import { TaskEditorDialog } from '../components/task-editor-dialog';
import { LeadPicker, type LeadPickerOption } from '../components/lead-picker';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getTaskTypeLabel } from '../lib/tasks';

type LeadCalendarItem = LeadPickerOption & {
  nextActionAt?: string;
  nextStep?: string;
  status?: string;
  dealValue?: number;
};

const RECURRENCE_OPTIONS: { value: RecurrenceRule; label: string }[] = [
  { value: 'none', label: 'Brak' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'every_2_days', label: 'Co 2 dni' },
  { value: 'weekly', label: 'Co tydzień' },
  { value: 'monthly', label: 'Co miesiąc' },
  { value: 'weekday', label: 'Dzień roboczy' },
];

function getLeadLabel(item: { leadId?: string; leadName?: string }, leads: LeadPickerOption[]) {
  return item.leadName || leads.find((lead) => lead.id === item.leadId)?.name || '';
}

function formatWeekRangeLabel(anchorDate: Date) {
  const weekStart = startOfWeek(anchorDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  if (format(weekStart, 'yyyy-MM', { locale: pl }) === format(weekEnd, 'yyyy-MM', { locale: pl })) {
    return `${format(weekStart, 'd', { locale: pl })}–${format(weekEnd, 'd MMMM yyyy', { locale: pl })}`;
  }

  if (format(weekStart, 'yyyy', { locale: pl }) === format(weekEnd, 'yyyy', { locale: pl })) {
    return `${format(weekStart, 'd MMMM', { locale: pl })} – ${format(weekEnd, 'd MMMM yyyy', { locale: pl })}`;
  }

  return `${format(weekStart, 'd MMMM yyyy', { locale: pl })} – ${format(weekEnd, 'd MMMM yyyy', { locale: pl })}`;
}

export default function Calendar() {
  const [searchParams] = useSearchParams();
  const { workspace, hasAccess } = useWorkspace();
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [tasks, setTasks] = useState<CalendarTaskItem[]>([]);
  const [leads, setLeads] = useState<LeadCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CalendarTaskItem | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'meeting',
    startAt: format(new Date(), "yyyy-MM-dd'T'10:00"),
    endAt: format(new Date(), "yyyy-MM-dd'T'11:00"),
    reminderAt: '',
    recurrenceRule: 'none' as RecurrenceRule,
    recurrenceEndType: 'never' as RecurrenceEndType,
    recurrenceEndAt: '',
    recurrenceCount: '5',
    leadId: '',
    leadSearch: '',
  });

  useEffect(() => {
    if (!auth.currentUser || !workspace) {
      setEvents([]);
      setTasks([]);
      setLeads([]);
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      setLoading(true);
      void fetchCalendarBundleFromSupabase()
        .then((bundle) => {
          setEvents(bundle.events);
          setTasks(bundle.tasks);
          setLeads(bundle.leads.map((lead) => ({
            id: lead.id,
            name: lead.name,
            phone: lead.phone,
            nextActionAt: lead.nextActionAt,
            nextStep: lead.nextStep,
            status: lead.status,
            dealValue: lead.dealValue,
          })));
        })
        .catch(() => {
          setEvents([]);
          setTasks([]);
          setLeads([]);
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);

    const unsubscribers = [
      onSnapshot(query(collection(db, 'events'), where('ownerId', '==', auth.currentUser.uid), orderBy('startAt', 'asc')), (snapshot) => {
        setEvents(snapshot.docs
          .map((entry) => normalizeCalendarEvent({ id: entry.id, ...(entry.data() as Record<string, unknown>) }))
          .filter((item): item is CalendarEventItem => Boolean(item)));
      }, () => setEvents([])),
      onSnapshot(query(collection(db, 'tasks'), where('ownerId', '==', auth.currentUser.uid), orderBy('date', 'asc')), (snapshot) => {
        setTasks(snapshot.docs
          .map((entry) => normalizeCalendarTask({ id: entry.id, ...(entry.data() as Record<string, unknown>) }))
          .filter((item): item is CalendarTaskItem => Boolean(item)));
      }, () => setTasks([])),
      onSnapshot(query(collection(db, 'leads'), where('ownerId', '==', auth.currentUser.uid), orderBy('nextActionAt', 'asc')), (snapshot) => {
        setLeads(snapshot.docs
          .map((entry) => normalizeCalendarLeadAction({ id: entry.id, ...(entry.data() as Record<string, unknown>) }))
          .filter((item): item is CalendarLeadActionItem => Boolean(item))
          .map((item) => ({
            id: item.id,
            name: item.name,
            phone: item.phone,
            nextActionAt: item.nextActionAt,
            nextStep: item.nextStep,
            status: item.status,
            dealValue: item.dealValue,
          })));
        setLoading(false);
      }, () => {
        setLeads([]);
        setLoading(false);
      }),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [workspace]);

  useEffect(() => {
    const focus = searchParams.get('focus');
    if (!focus) return;
    const parsed = parseISO(focus);
    if (Number.isNaN(parsed.getTime())) return;
    setAnchorDate(parsed);
    setViewMode('week');
  }, [searchParams]);

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');

    try {
      if (isSupabaseConfigured()) {
        const inserted = await insertEventToSupabase({
          title: newEvent.title,
          type: newEvent.type,
          startAt: newEvent.startAt,
          endAt: newEvent.endAt || undefined,
          reminderAt: newEvent.reminderAt || undefined,
          recurrenceRule: newEvent.recurrenceRule,
          status: 'scheduled',
          leadId: newEvent.leadId || null,
          workspaceId: workspace?.id,
        });
        const normalized = normalizeCalendarEvent(inserted as Record<string, unknown>);
        if (normalized) setEvents((prev) => [normalized, ...prev]);
      } else {
        await addDoc(collection(db, 'events'), {
          title: newEvent.title,
          type: newEvent.type,
          startAt: newEvent.startAt,
          endAt: newEvent.endAt || null,
          reminderAt: newEvent.reminderAt || null,
          recurrenceRule: newEvent.recurrenceRule,
          recurrenceEndType: newEvent.recurrenceEndType,
          recurrenceEndAt: newEvent.recurrenceEndAt || null,
          recurrenceCount: Number(newEvent.recurrenceCount) || null,
          status: 'scheduled',
          leadId: newEvent.leadId || null,
          ownerId: auth.currentUser?.uid,
          workspaceId: workspace?.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      toast.success('Wydarzenie zaplanowane');
      setIsNewEventOpen(false);
      setNewEvent({
        title: '',
        type: 'meeting',
        startAt: format(new Date(), "yyyy-MM-dd'T'10:00"),
        endAt: format(new Date(), "yyyy-MM-dd'T'11:00"),
        reminderAt: '',
        recurrenceRule: 'none',
        recurrenceEndType: 'never',
        recurrenceEndAt: '',
        recurrenceCount: '5',
        leadId: '',
        leadSearch: '',
      });
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const toggleTaskDone = async (task: CalendarTaskItem) => {
    try {
      const status = task.status === 'done' ? 'todo' : 'done';
      if (isSupabaseConfigured()) {
        await updateTaskInSupabase({ id: task.id, status });
        setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, status } : item)));
      } else {
        await updateDoc(doc(db, 'tasks', task.id), { status, updatedAt: serverTimestamp() });
      }
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const snoozeTask = async (task: CalendarTaskItem, preset: SnoozePreset) => {
    try {
      const snoozeUntil = applySnoozePreset(preset);
      const nextDate = snoozeUntil.slice(0, 10);
      if (isSupabaseConfigured()) {
        await updateTaskInSupabase({ id: task.id, status: 'postponed', date: nextDate });
        setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, status: 'postponed', date: nextDate } : item)));
      } else {
        await updateDoc(doc(db, 'tasks', task.id), {
          status: 'postponed',
          snoozeUntil,
          date: nextDate,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const shiftTaskByDays = async (task: CalendarTaskItem, days: number) => {
    try {
      const current = parseISO(task.date);
      const nextDate = format(addDays(current, days), 'yyyy-MM-dd');
      if (isSupabaseConfigured()) {
        await updateTaskInSupabase({ id: task.id, date: nextDate, status: 'todo' });
        setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, date: nextDate, status: 'todo' } : item)));
      } else {
        await updateDoc(doc(db, 'tasks', task.id), {
          date: nextDate,
          status: 'todo',
          updatedAt: serverTimestamp(),
        });
      }
      toast.success(days === 1 ? 'Zadanie przesunięte o 1 dzień' : 'Zadanie przesunięte o 1 tydzień');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const postponeEvent = async (event: CalendarEventItem, preset: SnoozePreset) => {
    try {
      const snoozeUntil = applySnoozePreset(preset);
      if (isSupabaseConfigured()) {
        await updateEventInSupabase({ id: event.id, status: 'postponed', startAt: snoozeUntil });
        setEvents((prev) => prev.map((item) => (item.id === event.id ? { ...item, status: 'postponed', startAt: snoozeUntil } : item)));
      } else {
        await updateDoc(doc(db, 'events', event.id), {
          status: 'postponed',
          startAt: snoozeUntil,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const removeEvent = async (eventId: string) => {
    try {
      if (isSupabaseConfigured()) {
        await deleteEventFromSupabase(eventId);
        setEvents((prev) => prev.filter((item) => item.id !== eventId));
      } else {
        await deleteDoc(doc(db, 'events', eventId));
      }
      toast.success('Wydarzenie usunięte');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const saveTaskEdits = async (payload: {
    id: string;
    title: string;
    type: string;
    date: string;
    priority: string;
    reminderAt: string | null;
    recurrenceRule: RecurrenceRule;
    recurrenceEndType: RecurrenceEndType;
    recurrenceEndAt: string | null;
    recurrenceCount: number | null;
    leadId: string | null;
  }) => {
    if (!payload.title.trim()) {
      toast.error('Wpisz tytuł zadania.');
      return;
    }

    try {
      const updates: Record<string, unknown> = {
        title: payload.title.trim(),
        type: payload.type,
        date: payload.date,
        priority: payload.priority,
        leadId: payload.leadId,
      };

      if (isSupabaseConfigured()) {
        updates.reminderAt = payload.reminderAt;
        updates.recurrenceRule = payload.recurrenceRule;
        await updateTaskInSupabase({ id: payload.id, ...updates });
      } else {
        updates.reminderAt = payload.reminderAt;
        updates.recurrenceRule = payload.recurrenceRule;
        updates.recurrenceEndType = payload.recurrenceEndType;
        updates.recurrenceEndAt = payload.recurrenceEndAt;
        updates.recurrenceCount = payload.recurrenceCount;
        updates.updatedAt = serverTimestamp();
        await updateDoc(doc(db, 'tasks', payload.id), updates);
      }

      setTasks((prev) => prev.map((task) => (
        task.id === payload.id
          ? {
              ...task,
              ...updates,
              leadId: payload.leadId || undefined,
              leadName: payload.leadId ? leads.find((lead) => lead.id === payload.leadId)?.name : undefined,
            }
          : task
      )));
      setEditingTask(null);
      toast.success('Zadanie zapisane');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const weekStart = useMemo(() => startOfWeek(anchorDate, { weekStartsOn: 1 }), [anchorDate]);
  const weekDays = useMemo(() => eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) }), [weekStart]);
  const headerLabel = useMemo(
    () => (viewMode === 'week' ? formatWeekRangeLabel(anchorDate) : format(anchorDate, 'MMMM yyyy', { locale: pl })),
    [anchorDate, viewMode]
  );

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(anchorDate);
    const monthEnd = endOfMonth(monthStart);
    const rangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: rangeStart, end: rangeEnd });
  }, [anchorDate]);

  const leadActions = useMemo(() => leads.filter((lead) => typeof lead.nextActionAt === 'string' && lead.nextActionAt.trim()), [leads]);

  const navigateWeek = (direction: -1 | 1) => {
    setAnchorDate((current) => addWeeks(startOfWeek(current, { weekStartsOn: 1 }), direction));
  };

  const navigateMonth = (direction: -1 | 1) => {
    setAnchorDate((current) => addMonths(current, direction));
  };

  const focusWeekOfDay = (day: Date) => {
    setAnchorDate(day);
    setViewMode('week');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold app-text capitalize">{headerLabel}</h1>
            <p className="app-muted">Wspólny kalendarz dla zadań, wydarzeń i ruchów na leadach.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'week' | 'month')}>
              <TabsList>
                <TabsTrigger value="week">Tydzień</TabsTrigger>
                <TabsTrigger value="month">Miesiąc</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1))}
                className="rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => setAnchorDate(new Date())} className="px-4 text-sm font-bold">Dzisiaj</Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (viewMode === 'week' ? navigateWeek(1) : navigateMonth(1))}
                className="rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-lg shadow-primary/20"><Plus className="mr-2 h-4 w-4" /> Wydarzenie</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Zaplanuj wydarzenie</DialogTitle>
                  <DialogDescription>Dodaj wydarzenie do kalendarza i opcjonalnie połącz je z leadem.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tytuł</Label>
                    <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                  </div>
                  <LeadPicker
                    leads={leads}
                    selectedLeadId={newEvent.leadId || undefined}
                    query={newEvent.leadSearch}
                    onQueryChange={(value) => setNewEvent({ ...newEvent, leadSearch: value, leadId: '' })}
                    onSelect={(lead) => setNewEvent({ ...newEvent, leadId: lead?.id || '', leadSearch: lead?.name || '' })}
                    label="Powiąż z leadem"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm">
                        <option value="meeting">Spotkanie</option>
                        <option value="phone_call">Rozmowa</option>
                        <option value="follow_up">Follow-up</option>
                        <option value="deadline">Deadline</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Przypomnienie</Label>
                      <Input type="datetime-local" value={newEvent.reminderAt} onChange={(e) => setNewEvent({ ...newEvent, reminderAt: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start</Label>
                      <Input type="datetime-local" value={newEvent.startAt} onChange={(e) => setNewEvent({ ...newEvent, startAt: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Koniec</Label>
                      <Input type="datetime-local" value={newEvent.endAt} onChange={(e) => setNewEvent({ ...newEvent, endAt: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Cykliczność</Label>
                      <select value={newEvent.recurrenceRule} onChange={(e) => setNewEvent({ ...newEvent, recurrenceRule: e.target.value as RecurrenceRule })} className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm">
                        {RECURRENCE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Koniec cyklu</Label>
                      <select value={newEvent.recurrenceEndType} onChange={(e) => setNewEvent({ ...newEvent, recurrenceEndType: e.target.value as RecurrenceEndType })} className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm">
                        <option value="never">Bez końca</option>
                        <option value="until_date">Do daty</option>
                        <option value="count">Liczba razy</option>
                      </select>
                    </div>
                  </div>
                  {newEvent.recurrenceEndType === 'until_date' ? <Input type="date" value={newEvent.recurrenceEndAt} onChange={(e) => setNewEvent({ ...newEvent, recurrenceEndAt: e.target.value })} /> : null}
                  {newEvent.recurrenceEndType === 'count' ? <Input type="number" min="1" value={newEvent.recurrenceCount} onChange={(e) => setNewEvent({ ...newEvent, recurrenceCount: e.target.value })} /> : null}
                  <DialogFooter><Button type="submit">Zaplanuj</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {viewMode === 'week' ? (
          <div id="calendar-week-view" className="grid gap-3 md:grid-cols-7">
            {weekDays.map((day) => {
              const dayEvents = events.filter((event) => event.status !== 'cancelled' && isSameDay(parseISO(event.startAt), day));
              const dayTasks = tasks.filter((task) => task.status !== 'done' && isSameDay(parseISO(task.date), day));
              const dayLeadActions = leadActions.filter((lead) => isSameDay(parseISO(lead.nextActionAt as string), day));

              return (
                <Card key={day.toISOString()} className="border-none app-surface-strong">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{format(day, 'EEE d', { locale: pl })}</CardTitle>
                    {isToday(day) ? <Badge variant="secondary">Dziś</Badge> : null}
                  </CardHeader>
                  <CardContent className="space-y-2 p-3">
                    {dayLeadActions.map((lead) => (
                      <div key={lead.id} className="rounded-xl border border-cyan-200 bg-cyan-50 p-2 text-xs">
                        <p className="font-semibold text-cyan-900">{lead.name}</p>
                        <p className="text-[10px] text-cyan-700">{lead.nextStep || 'Ruch na leadzie'}</p>
                        <p className="text-[10px] text-cyan-700">{format(parseISO(lead.nextActionAt as string), 'HH:mm', { locale: pl })}</p>
                        <Button size="sm" variant="outline" className="mt-2 h-7 px-2 text-[10px]" asChild>
                          <Link to={`/leads/${lead.id}`}>Lead</Link>
                        </Button>
                      </div>
                    ))}
                    {dayEvents.map((event) => (
                      <div key={event.id} className="rounded-xl border p-2 text-xs">
                        <p className="font-semibold">{event.title}</p>
                        {getLeadLabel(event, leads) ? <p className="text-[10px] text-slate-500">Lead: {getLeadLabel(event, leads)}</p> : null}
                        <p className="text-slate-500">{format(parseISO(event.startAt), 'HH:mm', { locale: pl })}</p>
                        <div className="mt-2 flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={() => postponeEvent(event, 'tomorrow')}>Odłóż</Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => removeEvent(event.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                    {dayTasks.map((task) => (
                      <button
                        type="button"
                        key={task.id}
                        className="w-full rounded-xl border p-2 text-left text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        onClick={() => setEditingTask(task)}
                      >
                        <p className="font-semibold">{task.title}</p>
                        {getLeadLabel(task, leads) ? <p className="text-[10px] text-slate-500">Lead: {getLeadLabel(task, leads)}</p> : null}
                        {task.type ? <p className="text-[10px] text-slate-500">{getTaskTypeLabel(task.type)}</p> : null}
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={(event) => { event.stopPropagation(); setEditingTask(task); }}>Edytuj</Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={(event) => { event.stopPropagation(); shiftTaskByDays(task, 1); }}>+1D</Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={(event) => { event.stopPropagation(); shiftTaskByDays(task, 7); }}>+1W</Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={(event) => { event.stopPropagation(); toggleTaskDone(task); }}><CheckSquare className="mr-1 h-3 w-3" />Zrobione</Button>
                        </div>
                      </button>
                    ))}
                    {dayEvents.length === 0 && dayTasks.length === 0 && dayLeadActions.length === 0 ? <p className="text-xs text-slate-400">Brak</p> : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}

        {viewMode === 'month' ? (
          <Card className="border-none app-surface-strong">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-lg"><CalendarIcon className="h-5 w-5" /> Miesiąc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 grid grid-cols-7">
                {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map((day) => (
                  <div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-slate-100 bg-white">
                {monthDays.map((day) => {
                  const dayEvents = events.filter((event) => event.status !== 'cancelled' && isSameDay(parseISO(event.startAt), day));
                  const dayTasks = tasks.filter((task) => task.status !== 'done' && isSameDay(parseISO(task.date), day));
                  const dayLeadActions = leadActions.filter((lead) => isSameDay(parseISO(lead.nextActionAt as string), day));
                  return (
                    <button
                      type="button"
                      onClick={() => focusWeekOfDay(day)}
                      key={day.toISOString()}
                      className={`min-h-[110px] border-b border-r border-slate-100 p-2 text-left ${!isSameMonth(day, anchorDate) ? 'bg-slate-50/30 text-slate-300' : 'text-slate-900'}`}
                    >
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isToday(day) ? 'bg-primary text-white' : ''}`}>{format(day, 'd')}</div>
                      <div className="mt-2 space-y-1">
                        {dayLeadActions.slice(0, 2).map((lead) => <div key={lead.id} className="truncate rounded border border-cyan-100 bg-cyan-50 p-1 text-[10px] text-cyan-700">{lead.name}</div>)}
                        {dayEvents.slice(0, 2).map((event) => <div key={event.id} className="truncate rounded border border-indigo-100 bg-indigo-50 p-1 text-[10px] text-indigo-700">{event.title}</div>)}
                        {dayTasks.slice(0, 2).map((task) => <div key={task.id} className="truncate rounded border border-emerald-100 bg-emerald-50 p-1 text-[10px] text-emerald-700">{task.title}</div>)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="text-sm app-muted">
          Każda rzecz z datą wpada teraz w ten sam kalendarz: zadania, wydarzenia i ruchy na leadach.
        </div>
      </div>
      <TaskEditorDialog open={Boolean(editingTask)} onOpenChange={(open) => { if (!open) setEditingTask(null); }} task={editingTask} leads={leads} onSave={saveTaskEdits} />
    </Layout>
  );
}
