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
  normalizeRecurrenceConfig,
  normalizeReminderConfig,
  toDateTimeLocalValue,
} from '../lib/scheduling';
import {
  EVENT_TYPES,
  RECURRENCE_OPTIONS,
  REMINDER_MODE_OPTIONS,
} from '../lib/options';

export default function Calendar() {
  const { workspace, hasAccess } = useWorkspace();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
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
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const scheduleEntries = combineScheduleEntries({
    events,
    tasks,
    leads,
    rangeStart: startDate,
    rangeEnd: endDate,
  });

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
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 capitalize">{format(currentMonth, 'MMMM yyyy', { locale: pl })}</h1>
            <p className="text-slate-500">Kalendarz live dla zadań, wydarzeń i ruchów leadowych.</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="rounded-lg"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" onClick={() => setCurrentMonth(new Date())} className="text-sm font-bold px-4">Dzisiaj</Button>
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

            return (
              <div
                key={index}
                className={`min-h-[128px] p-2 border-r border-b border-slate-100 transition-colors hover:bg-slate-50/50 ${!isCurrentMonth ? 'bg-slate-50/30 text-slate-300' : 'text-slate-900'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isTodayDay ? 'bg-primary text-white' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayEntries.length > 0 && <Badge variant="secondary" className="h-5 text-[10px]">{dayEntries.length}</Badge>}
                </div>
                <div className="space-y-1">
                  {dayEntries.slice(0, 4).map((entry) => (
                    <Link key={entry.id} to={entry.link ?? '/calendar'} className={`block text-[10px] p-1 rounded border truncate font-medium ${getEntryTone(entry)}`}>
                      {format(parseISO(entry.startsAt), 'HH:mm')} {entry.title}
                    </Link>
                  ))}
                  {dayEntries.length > 4 && (
                    <div className="text-[10px] text-slate-500 font-medium px-1">+ {dayEntries.length - 4} więcej</div>
                  )}
                </div>
              </div>
            );
          })}
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
    </Layout>
  );
}
