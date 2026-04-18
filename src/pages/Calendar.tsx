import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Calendar as CalendarIcon, CheckSquare, ChevronLeft, ChevronRight, Clock, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { auth, db } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import { RecurrenceEndType, RecurrenceRule, SnoozePreset, applySnoozePreset } from '../lib/scheduling';
import { deleteEventFromSupabase, fetchEventsFromSupabase, fetchLeadsFromSupabase, fetchTasksFromSupabase, insertEventToSupabase, isSupabaseConfigured, updateEventInSupabase, updateTaskInSupabase } from '../lib/supabase-fallback';
import Layout from '../components/Layout';
import { LeadPicker, type LeadPickerOption } from '../components/lead-picker';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

type CalendarTask = {
  id: string;
  title: string;
  date: string;
  status: 'todo' | 'done' | 'overdue' | 'postponed';
  leadId?: string;
  leadName?: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  type: string;
  startAt: string;
  endAt?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  reminderAt?: string | null;
  recurrenceRule?: RecurrenceRule;
  recurrenceEndType?: RecurrenceEndType;
  recurrenceEndAt?: string | null;
  recurrenceCount?: number | null;
  leadId?: string;
  leadName?: string;
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

export default function Calendar() {
  const { workspace, hasAccess } = useWorkspace();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [leads, setLeads] = useState<LeadPickerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
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
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      setLoading(true);
      void Promise.all([fetchEventsFromSupabase(), fetchTasksFromSupabase(), fetchLeadsFromSupabase()])
        .then(([eventItems, taskItems, leadItems]) => {
          setEvents(eventItems as CalendarEvent[]);
          setTasks(taskItems as CalendarTask[]);
          setLeads(leadItems as LeadPickerOption[]);
        })
        .catch(() => {
          setEvents([]);
          setTasks([]);
          setLeads([]);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    setLoading(true);

    const eventsQuery = query(
      collection(db, 'events'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('startAt', 'asc')
    );
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('date', 'asc')
    );

    const unsubscribeEvents = onSnapshot(
      eventsQuery,
      (snap) => setEvents(snap.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<CalendarEvent, 'id'>) }))),
      () => {
        setEvents([]);
        setLoading(false);
      }
    );
    const unsubscribeTasks = onSnapshot(
      tasksQuery,
      (snap) => {
        setTasks(snap.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<CalendarTask, 'id'>) })));
        setLoading(false);
      },
      () => {
        setTasks([]);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeEvents();
      unsubscribeTasks();
    };
  }, [workspace]);

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
        setEvents((prev) => [inserted as CalendarEvent, ...prev]);
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

  const toggleTaskDone = async (task: CalendarTask) => {
    try {
      const status = task.status === 'done' ? 'todo' : 'done';
      if (isSupabaseConfigured()) {
        await updateTaskInSupabase({ id: task.id, status });
        setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, status } : item)));
      } else {
        await updateDoc(doc(db, 'tasks', task.id), {
          status,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const snoozeTask = async (task: CalendarTask, preset: SnoozePreset) => {
    try {
      const snoozeUntil = applySnoozePreset(preset);
      if (isSupabaseConfigured()) {
        const nextDate = snoozeUntil.slice(0, 10);
        await updateTaskInSupabase({ id: task.id, status: 'postponed', date: nextDate });
        setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, status: 'postponed', date: nextDate } : item)));
      } else {
        await updateDoc(doc(db, 'tasks', task.id), {
          status: 'postponed',
          snoozeUntil,
          date: snoozeUntil.slice(0, 10),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const postponeEvent = async (event: CalendarEvent, preset: SnoozePreset) => {
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

  const weekStart = useMemo(() => startOfWeek(currentMonth, { weekStartsOn: 1 }), [currentMonth]);
  const weekDays = useMemo(() => eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) }), [weekStart]);

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const rangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: rangeStart, end: rangeEnd });
  }, [currentMonth]);

  const focusWeekOfDay = (day: Date) => {
    setCurrentMonth(day);
    setViewMode('week');
    requestAnimationFrame(() => {
      document.getElementById('calendar-week-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 capitalize">{format(currentMonth, 'MMMM yyyy', { locale: pl })}</h1>
            <p className="text-slate-500">Widok tygodnia z boczną nawigacją po dniach.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'week' | 'month')}>
              <TabsList>
                <TabsTrigger value="week">Tydzień</TabsTrigger>
                <TabsTrigger value="month">Miesiąc</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="rounded-lg"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" onClick={() => setCurrentMonth(new Date())} className="text-sm font-bold px-4">Dzisiaj</Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="rounded-lg"><ChevronRight className="w-4 h-4" /></Button>
            </div>
            <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Wydarzenie</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Zaplanuj wydarzenie</DialogTitle>
                  <DialogDescription>
                    Dodaj wydarzenie do kalendarza. Cykliczność możesz ustawić bez problematycznych list rozwijanych.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tytuł</Label>
                    <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                  </div>
                  {isSupabaseConfigured() ? (
                    <LeadPicker
                      leads={leads}
                      selectedLeadId={newEvent.leadId || undefined}
                      query={newEvent.leadSearch}
                      onQueryChange={(value) => setNewEvent({ ...newEvent, leadSearch: value, leadId: '' })}
                      onSelect={(lead) => setNewEvent({ ...newEvent, leadId: lead?.id || '', leadSearch: lead?.name || '' })}
                      label="Powiąż z istniejącym leadem"
                    />
                  ) : null}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                        className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                      >
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
                      <select
                        value={newEvent.recurrenceRule}
                        onChange={(e) => setNewEvent({ ...newEvent, recurrenceRule: e.target.value as RecurrenceRule })}
                        className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                      >
                        {RECURRENCE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Koniec cyklu</Label>
                      <select
                        value={newEvent.recurrenceEndType}
                        onChange={(e) => setNewEvent({ ...newEvent, recurrenceEndType: e.target.value as RecurrenceEndType })}
                        className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                      >
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
          <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
            <Card className="border-none app-surface-strong xl:sticky xl:top-4 xl:self-start">
              <CardContent className="space-y-3 p-3">
                <div className="flex items-center justify-between gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4" /></Button>
                  <div className="text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Mini miesiąc</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">{format(currentMonth, 'LLLL yyyy', { locale: pl })}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map((day) => (
                    <div key={day} className="py-0.5 text-center text-[9px] font-bold uppercase tracking-widest text-slate-400">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day) => {
                    const dayEvents = events.filter((event) => event.status !== 'cancelled' && isSameDay(parseISO(event.startAt), day));
                    const dayTasks = tasks.filter((task) => task.status !== 'done' && isSameDay(parseISO(task.date), day));
                    const hasEvent = dayEvents.length > 0;
                    const hasTask = dayTasks.length > 0;

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => focusWeekOfDay(day)}
                        title={hasEvent || hasTask ? `Wydarzenia: ${dayEvents.length}, zadania: ${dayTasks.length}` : 'Brak aktywności'}
                        className={[
                          'flex h-7 items-center justify-center rounded-md text-[11px] font-semibold transition-colors',
                          !isSameMonth(day, currentMonth) ? 'text-slate-300' : 'text-slate-800',
                          isToday(day)
                            ? 'bg-primary text-white'
                            : hasEvent && hasTask
                              ? 'bg-amber-100 text-amber-800'
                              : hasEvent
                                ? 'bg-indigo-100 text-indigo-800'
                                : hasTask
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'hover:bg-slate-100',
                        ].join(' ')}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
                <Button variant="outline" className="h-8 w-full rounded-lg text-[11px]" onClick={() => setCurrentMonth(new Date())}>Dzisiaj</Button>
              </CardContent>
            </Card>
            <div id="calendar-week-view" className="grid gap-3 md:grid-cols-7">
            {weekDays.map((day) => {
              const dayEvents = events.filter((event) => event.status !== 'cancelled' && isSameDay(parseISO(event.startAt), day));
              const dayTasks = tasks.filter((task) => task.status !== 'done' && isSameDay(parseISO(task.date), day));
              return (
                <Card key={day.toISOString()} className="border-none app-surface-strong">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{format(day, 'EEE d', { locale: pl })}</CardTitle>
                    {isToday(day) ? <Badge variant="secondary">Dziś</Badge> : null}
                  </CardHeader>
                  <CardContent className="space-y-2 p-3">
                    {dayEvents.map((event) => (
                      <div key={event.id} className="rounded-xl border p-2 text-xs">
                        <p className="font-semibold">{event.title}</p>
                        {getLeadLabel(event, leads) ? <p className="text-[10px] text-slate-500">Lead: {getLeadLabel(event, leads)}</p> : null}
                        <p className="text-slate-500">{format(parseISO(event.startAt), 'HH:mm', { locale: pl })}</p>
                        <div className="mt-2 flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={() => postponeEvent(event, 'tomorrow')}>Snooze</Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => removeEvent(event.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                    {dayTasks.map((task) => (
                      <div key={task.id} className="rounded-xl border p-2 text-xs">
                        <p className="font-semibold">{task.title}</p>
                        {getLeadLabel(task, leads) ? <p className="text-[10px] text-slate-500">Lead: {getLeadLabel(task, leads)}</p> : null}
                        <div className="mt-2 flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={() => toggleTaskDone(task)}><CheckSquare className="h-3 w-3 mr-1" />Done</Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={() => snoozeTask(task, 'tomorrow')}>Snooze</Button>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length === 0 && dayTasks.length === 0 ? <p className="text-xs text-slate-400">Brak</p> : null}
                  </CardContent>
                </Card>
              );
            })}
            </div>

          </div>
        ) : null}

        {viewMode === 'month' ? (
        <Card className="border-none app-surface-strong">
          <CardHeader>
            <CardTitle className="text-lg inline-flex items-center gap-2"><CalendarIcon className="h-5 w-5" /> Miesiąc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 mb-2">
              {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map((day) => (
                <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 border-t border-l border-slate-100 rounded-2xl overflow-hidden bg-white">
              {monthDays.map((day) => {
                const dayEvents = events.filter((event) => event.status !== 'cancelled' && isSameDay(parseISO(event.startAt), day));
                const dayTasks = tasks.filter((task) => task.status !== 'done' && isSameDay(parseISO(task.date), day));
                return (
                  <button type="button" onClick={() => focusWeekOfDay(day)} key={day.toISOString()} className={`min-h-[110px] p-2 border-r border-b border-slate-100 text-left ${!isSameMonth(day, currentMonth) ? 'bg-slate-50/30 text-slate-300' : 'text-slate-900'}`}>
                    <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-primary text-white' : ''}`}>{format(day, 'd')}</div>
                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => <div key={event.id} className="text-[10px] p-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 truncate">{event.title}</div>)}
                      {dayTasks.slice(0, 2).map((task) => <div key={task.id} className="text-[10px] p-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 truncate">{task.title}</div>)}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        ) : null}

        <div className="text-sm app-muted">
          Szybki skrót: snooze działa dla tasków i wydarzeń. Pełna praca dzienna jest na ekranach <Link to="/today" className="font-semibold text-[color:var(--app-primary)]">Dziś</Link> i <Link to="/tasks" className="font-semibold text-[color:var(--app-primary)]">Zadania</Link>.
        </div>
      </div>
    </Layout>
  );
}




