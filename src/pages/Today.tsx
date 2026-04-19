import { useState, useEffect, FormEvent, ReactNode } from 'react';
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
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Loader2,
  Bell,
  Repeat,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  format,
  isPast,
  addDays,
  parseISO,
  isToday,
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
  buildStartEndPair,
  combineScheduleEntries,
  createDefaultRecurrence,
  createDefaultReminder,
  getTaskDate,
  getTaskStartAt,
  normalizeRecurrenceConfig,
  normalizeReminderConfig,
  syncTaskDerivedFields,
  toReminderAtIso,
  toDateTimeLocalValue,
} from '../lib/scheduling';
import {
  EVENT_TYPES,
  PRIORITY_OPTIONS,
  RECURRENCE_OPTIONS,
  REMINDER_OFFSET_OPTIONS,
  REMINDER_MODE_OPTIONS,
  SOURCE_OPTIONS,
  TASK_TYPES,
} from '../lib/options';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import {
  insertEventToSupabase,
  insertLeadToSupabase,
  insertTaskToSupabase,
  isSupabaseConfigured,
  updateTaskInSupabase,
} from '../lib/supabase-fallback';

const TODAY_TILE_STORAGE_KEY = 'closeflow:today:collapsed:v1';
const modalSelectClass = 'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

type TileCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  collapsedMap: Record<string, boolean>;
  onToggle: (id: string) => void;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  headerRight?: ReactNode;
  bodyClassName?: string;
};

function TileCard({
  id,
  title,
  subtitle,
  collapsedMap,
  onToggle,
  children,
  className = '',
  titleClassName = 'text-slate-900',
  subtitleClassName = 'text-slate-500',
  headerRight,
  bodyClassName = '',
}: TileCardProps) {
  const collapsed = Boolean(collapsedMap[id]);

  return (
    <Card className={`shadow-sm border-slate-100 ${className}`}>
      <CardContent className="p-0">
        <button
          type="button"
          onClick={() => onToggle(id)}
          className="w-full p-4 flex items-center justify-between gap-4 text-left"
        >
          <div className="min-w-0">
            <p className={`font-semibold break-words ${titleClassName}`}>{title}</p>
            {subtitle ? (
              <p className={`mt-1 text-xs break-words ${subtitleClassName}`}>{subtitle}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {headerRight}
            {collapsed ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>
        {!collapsed ? (
          <div className={`border-t border-slate-100 p-4 pt-3 ${bodyClassName}`}>
            {children}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function Today() {
  const { workspace, profile, hasAccess, loading: wsLoading } = useWorkspace();
  const [leads, setLeads] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [collapsedTiles, setCollapsedTiles] = useState<Record<string, boolean>>({});

  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    dealValue: '',
    source: 'other',
    status: 'new',
    nextStep: '',
    nextActionAt: '',
  });

  const [newTask, setNewTask] = useState(() => ({
    title: '',
    type: 'follow_up',
    dueAt: toDateTimeLocalValue(new Date()),
    priority: 'medium',
    leadId: 'none',
    leadName: '',
    recurrence: createDefaultRecurrence(),
    reminder: createDefaultReminder(),
  }));

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
    try {
      const raw = window.localStorage.getItem(TODAY_TILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setCollapsedTiles(parsed);
      }
    } catch {
      // Ignore invalid local storage state.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(TODAY_TILE_STORAGE_KEY, JSON.stringify(collapsedTiles));
    } catch {
      // Ignore storage write failures.
    }
  }, [collapsedTiles]);

  const toggleTile = (id: string) => {
    setCollapsedTiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  async function refreshSupabaseBundle() {
    const bundle = await fetchCalendarBundleFromSupabase();
    setLeads(bundle.leads);
    setTasks(bundle.tasks);
    setEvents(bundle.events);
  }

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    if (isSupabaseConfigured()) {
      let cancelled = false;

      const loadBundle = async () => {
        try {
          setLoading(true);
          const bundle = await fetchCalendarBundleFromSupabase();
          if (cancelled) return;
          setLeads(bundle.leads);
          setTasks(bundle.tasks);
          setEvents(bundle.events);
        } catch (error: any) {
          if (!cancelled) {
            toast.error(`BĹ‚Ä…d odczytu planu dnia: ${error.message}`);
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
    }

    const leadsQuery = query(
      collection(db, 'leads'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      where('status', '==', 'todo'),
      orderBy('date', 'asc')
    );

    const eventsQuery = query(
      collection(db, 'events'),
      where('ownerId', '==', auth.currentUser.uid),
      where('status', '==', 'scheduled'),
      orderBy('startAt', 'asc')
    );

    const unsubscribeLeads = onSnapshot(leadsQuery, (snap) => {
      setLeads(snap.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });

    const unsubscribeTasks = onSnapshot(tasksQuery, (snap) => {
      setTasks(snap.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });

    const unsubscribeEvents = onSnapshot(eventsQuery, (snap) => {
      setEvents(snap.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      setLoading(false);
    });

    return () => {
      unsubscribeLeads();
      unsubscribeTasks();
      unsubscribeEvents();
    };
  }, [workspace]);

  const resetNewTask = () => {
    setNewTask({
      title: '',
      type: 'follow_up',
      dueAt: toDateTimeLocalValue(new Date()),
      priority: 'medium',
      leadId: 'none',
      leadName: '',
      recurrence: createDefaultRecurrence(),
      reminder: createDefaultReminder(),
    });
  };

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

  const handleAddLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('TwĂłj trial wygasĹ‚. OpĹ‚aÄ‡ subskrypcjÄ™, aby dodawaÄ‡ leady.');
    try {
      if (isSupabaseConfigured()) {
        await insertLeadToSupabase({
          ...newLead,
          dealValue: Number(newLead.dealValue) || 0,
          ownerId: auth.currentUser?.uid,
          workspaceId: workspace.id,
        });
        await refreshSupabaseBundle();
      } else {
        await addDoc(collection(db, 'leads'), {
          ...newLead,
          dealValue: Number(newLead.dealValue) || 0,
          ownerId: auth.currentUser?.uid,
          workspaceId: workspace.id,
          isAtRisk: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      toast.success('Lead dodany');
      setIsLeadOpen(false);
      setNewLead({ name: '', email: '', dealValue: '', source: 'other', status: 'new', nextStep: '', nextActionAt: '' });
    } catch (error: any) {
      toast.error('BĹ‚Ä…d: ' + error.message);
    }
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('TwĂłj trial wygasĹ‚.');
    try {
      const selectedLead = leads.find((lead) => lead.id === newTask.leadId);
      if (isSupabaseConfigured()) {
        await insertTaskToSupabase({
          title: newTask.title,
          type: newTask.type,
          date: newTask.dueAt.slice(0, 10),
          scheduledAt: newTask.dueAt,
          priority: newTask.priority,
          leadId: selectedLead?.id ?? null,
          reminderAt: toReminderAtIso(newTask.dueAt, newTask.reminder),
          recurrenceRule: newTask.recurrence.mode,
          ownerId: auth.currentUser?.uid,
          workspaceId: workspace.id,
        });
        await refreshSupabaseBundle();
      } else {
        await addDoc(collection(db, 'tasks'), {
          ...syncTaskDerivedFields({
            ...newTask,
            leadId: selectedLead?.id ?? null,
            leadName: selectedLead?.name ?? '',
            recurrence: normalizeRecurrenceConfig(newTask.recurrence),
            reminder: normalizeReminderConfig(newTask.reminder),
          }),
          status: 'todo',
          ownerId: auth.currentUser?.uid,
          workspaceId: workspace.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      toast.success('Zadanie dodane');
      setIsTaskOpen(false);
      resetNewTask();
    } catch (error: any) {
      toast.error('BĹ‚Ä…d: ' + error.message);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('TwĂłj trial wygasĹ‚.');
    try {
      const selectedLead = leads.find((lead) => lead.id === newEvent.leadId);
      if (isSupabaseConfigured()) {
        await insertEventToSupabase({
          title: newEvent.title,
          type: newEvent.type,
          startAt: newEvent.startAt,
          endAt: newEvent.endAt,
          reminderAt: toReminderAtIso(newEvent.startAt, newEvent.reminder),
          recurrenceRule: newEvent.recurrence.mode,
          leadId: selectedLead?.id ?? null,
          workspaceId: workspace.id,
        });
        await refreshSupabaseBundle();
      } else {
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
      }
      toast.success('Wydarzenie dodane');
      setIsEventOpen(false);
      resetNewEvent();
    } catch (error: any) {
      toast.error('BĹ‚Ä…d: ' + error.message);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    try {
      if (isSupabaseConfigured()) {
        const task = tasks.find((entry) => entry.id === taskId);
        await updateTaskInSupabase({
          id: taskId,
          status: currentStatus === 'todo' ? 'done' : 'todo',
          title: task?.title,
          type: task?.type,
          date: task?.date,
          priority: task?.priority,
          leadId: task?.leadId ?? null,
        });
        await refreshSupabaseBundle();
      } else {
        await updateDoc(doc(db, 'tasks', taskId), {
          status: currentStatus === 'todo' ? 'done' : 'todo',
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error: any) {
      toast.error('BĹ‚Ä…d: ' + error.message);
    }
  };

  const handleEventStartChange = (value: string) => {
    const currentStart = parseISO(newEvent.startAt);
    const currentEnd = parseISO(newEvent.endAt);
    const duration = Math.max(currentEnd.getTime() - currentStart.getTime(), 60 * 60_000);
    const nextEnd = new Date(parseISO(value).getTime() + duration);
    setNewEvent({ ...newEvent, startAt: value, endAt: toDateTimeLocalValue(nextEnd) });
  };

  if (wsLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const today = new Date();
  const todayEntries = combineScheduleEntries({
    events,
    tasks,
    leads,
    rangeStart: today,
    rangeEnd: new Date(today.getTime() + 24 * 60 * 60_000 - 1),
  });
  const todayTasks = todayEntries.filter((entry) => entry.kind === 'task');
  const todayEvents = todayEntries.filter((entry) => entry.kind === 'event');
  const todayLeadActions = todayEntries.filter((entry) => entry.kind === 'lead');
  const overdueTasks = tasks.filter((task) => {
    const startAt = getTaskStartAt(task);
    return task.status !== 'done' && startAt && isPast(parseISO(startAt)) && !isToday(parseISO(startAt));
  });
  const noStepLeads = leads.filter((lead) => !lead.nextActionAt && lead.status !== 'won' && lead.status !== 'lost');
  const topValuableLeads = [...leads].sort((a, b) => (b.dealValue || 0) - (a.dealValue || 0)).slice(0, 3);

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Witaj, {profile?.fullName?.split(' ')[0]}!</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Dialog open={isLeadOpen} onOpenChange={setIsLeadOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Szybkie dodanie leada</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddLead} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>ImiÄ™ i nazwisko / Firma</Label>
                    <Input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>WartoĹ›Ä‡ (PLN)</Label>
                      <Input type="number" value={newLead.dealValue} onChange={(e) => setNewLead({ ...newLead, dealValue: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>ĹąrĂłdĹ‚o</Label>
                      <select
                        className={modalSelectClass}
                        value={newLead.source}
                        onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                      >
                        {SOURCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Kolejny krok</Label>
                      <Input value={newLead.nextStep} onChange={(e) => setNewLead({ ...newLead, nextStep: e.target.value })} placeholder="np. Telefon z ofertÄ…" />
                    </div>
                    <div className="space-y-2">
                      <Label>Termin ruchu</Label>
                      <Input type="date" value={newLead.nextActionAt} onChange={(e) => setNewLead({ ...newLead, nextActionAt: e.target.value })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Dodaj leada</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Zadanie
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nowe zadanie</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddTask} className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>TytuĹ‚ zadania</Label>
                      <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Typ</Label>
                        <select
                          className={modalSelectClass}
                          value={newTask.type}
                          onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                        >
                          {TASK_TYPES.map((taskType) => (
                            <option key={taskType.value} value={taskType.value}>{taskType.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Lead</Label>
                        <select
                          className={modalSelectClass}
                          value={newTask.leadId}
                          onChange={(e) => setNewTask({ ...newTask, leadId: e.target.value })}
                        >
                          <option value="none">Bez leada</option>
                          {leads.map((lead) => (
                            <option key={lead.id} value={lead.id}>{lead.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Priorytet</Label>
                        <select
                          className={modalSelectClass}
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                          {PRIORITY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Termin</p>
                      <p className="text-xs text-slate-500">Najpierw ustaw moment wykonania zadania.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Data i godzina</Label>
                      <Input type="datetime-local" value={newTask.dueAt} onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })} required />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">CyklicznoĹ›Ä‡</p>
                      <p className="text-xs text-slate-500">MoĹĽesz ustawiÄ‡ zadanie jednorazowe albo cykliczne.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Powtarzanie</Label>
                        <select
                          className={modalSelectClass}
                          value={newTask.recurrence.mode}
                          onChange={(e) => setNewTask({ ...newTask, recurrence: { ...newTask.recurrence, mode: e.target.value as any } })}
                        >
                          {RECURRENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Co ile</Label>
                        <Input type="number" min="1" value={newTask.recurrence.interval} onChange={(e) => setNewTask({ ...newTask, recurrence: { ...newTask.recurrence, interval: Math.max(1, Number(e.target.value) || 1) } })} disabled={newTask.recurrence.mode === 'none'} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Powtarzaj do</Label>
                      <Input type="date" value={newTask.recurrence.until ?? ''} onChange={(e) => setNewTask({ ...newTask, recurrence: { ...newTask.recurrence, until: e.target.value || null } })} disabled={newTask.recurrence.mode === 'none'} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Przypomnienia</p>
                      <p className="text-xs text-slate-500">Na koĹ„cu ustaw przypomnienie i jego cyklicznoĹ›Ä‡.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tryb</Label>
                        <select
                          className={modalSelectClass}
                          value={newTask.reminder.mode}
                          onChange={(e) => setNewTask({ ...newTask, reminder: { ...newTask.reminder, mode: e.target.value as any } })}
                        >
                          {REMINDER_MODE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Kiedy przypomnieÄ‡</Label>
                        <select
                          className={modalSelectClass}
                          value={newTask.reminder.minutesBefore}
                          onChange={(e) => setNewTask({ ...newTask, reminder: { ...newTask.reminder, minutesBefore: Number(e.target.value) } })}
                          disabled={newTask.reminder.mode === 'none'}
                        >
                          {REMINDER_OFFSET_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>
                    </div>
                    {newTask.reminder.mode === 'recurring' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label>CyklicznoĹ›Ä‡ przypomnienia</Label>
                          <select
                            className={modalSelectClass}
                            value={newTask.reminder.recurrenceMode}
                            onChange={(e) => setNewTask({ ...newTask, reminder: { ...newTask.reminder, recurrenceMode: e.target.value as any } })}
                          >
                            {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Co ile</Label>
                          <Input type="number" min="1" value={newTask.reminder.recurrenceInterval} onChange={(e) => setNewTask({ ...newTask, reminder: { ...newTask.reminder, recurrenceInterval: Math.max(1, Number(e.target.value) || 1) } })} />
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Dodaj zadanie</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Wydarzenie
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Zaplanuj wydarzenie</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>TytuĹ‚</Label>
                      <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Typ</Label>
                        <select
                          className={modalSelectClass}
                          value={newEvent.type}
                          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                        >
                          {EVENT_TYPES.map((eventType) => <option key={eventType.value} value={eventType.value}>{eventType.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Lead</Label>
                        <select
                          className={modalSelectClass}
                          value={newEvent.leadId}
                          onChange={(e) => setNewEvent({ ...newEvent, leadId: e.target.value })}
                        >
                          <option value="none">Bez leada</option>
                          {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Od do</p>
                      <p className="text-xs text-slate-500">Najpierw ustaw start i koniec. Koniec aktualizuje siÄ™ automatycznie po zmianie startu.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start</Label>
                        <Input type="datetime-local" value={newEvent.startAt} onChange={(e) => handleEventStartChange(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Koniec</Label>
                        <Input type="datetime-local" value={newEvent.endAt} onChange={(e) => setNewEvent({ ...newEvent, endAt: e.target.value })} required />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">CyklicznoĹ›Ä‡ wydarzenia</p>
                      <p className="text-xs text-slate-500">MoĹĽesz ustawiÄ‡ np. wydarzenie miesiÄ™czne i bÄ™dzie widoczne dynamicznie w kalendarzu.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Powtarzanie</Label>
                        <select
                          className={modalSelectClass}
                          value={newEvent.recurrence.mode}
                          onChange={(e) => setNewEvent({ ...newEvent, recurrence: { ...newEvent.recurrence, mode: e.target.value as any } })}
                        >
                          {RECURRENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Co ile</Label>
                        <Input type="number" min="1" value={newEvent.recurrence.interval} onChange={(e) => setNewEvent({ ...newEvent, recurrence: { ...newEvent.recurrence, interval: Math.max(1, Number(e.target.value) || 1) } })} disabled={newEvent.recurrence.mode === 'none'} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Powtarzaj do</Label>
                      <Input type="date" value={newEvent.recurrence.until ?? ''} onChange={(e) => setNewEvent({ ...newEvent, recurrence: { ...newEvent.recurrence, until: e.target.value || null } })} disabled={newEvent.recurrence.mode === 'none'} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Przypomnienia</p>
                      <p className="text-xs text-slate-500">Na koĹ„cu ustaw przypomnienie jednorazowe albo cykliczne.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tryb</Label>
                        <select
                          className={modalSelectClass}
                          value={newEvent.reminder.mode}
                          onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, mode: e.target.value as any } })}
                        >
                          {REMINDER_MODE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Kiedy przypomnieÄ‡</Label>
                        <select
                          className={modalSelectClass}
                          value={newEvent.reminder.minutesBefore}
                          onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, minutesBefore: Number(e.target.value) } })}
                          disabled={newEvent.reminder.mode === 'none'}
                        >
                          {REMINDER_OFFSET_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>
                    </div>
                    {newEvent.reminder.mode === 'recurring' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label>CyklicznoĹ›Ä‡ przypomnienia</Label>
                          <select
                            className={modalSelectClass}
                            value={newEvent.reminder.recurrenceMode}
                            onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, recurrenceMode: e.target.value as any } })}
                          >
                            {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
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
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {overdueTasks.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-lg font-bold">ZalegĹ‚e</h2>
                  <Badge variant="destructive" className="rounded-full">{overdueTasks.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {overdueTasks.map((task) => {
                    const startAt = getTaskStartAt(task) ?? `${getTaskDate(task)}T09:00`;
                    return (
                      <TileCard
                        key={task.id}
                        id={`overdue-task:${task.id}`}
                        title={task.title}
                        subtitle={format(parseISO(startAt), 'd MMMM HH:mm', { locale: pl })}
                        collapsedMap={collapsedTiles}
                        onToggle={toggleTile}
                        className="border-rose-100 bg-rose-50/30"
                        subtitleClassName="text-rose-500 font-medium"
                        headerRight={
                          <Badge variant="destructive" className="rounded-full">
                            ZalegĹ‚e
                          </Badge>
                        }
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-sm text-slate-600">
                            Zadanie wymaga reakcji. MoĹĽesz je od razu oznaczyÄ‡ jako wykonane albo przejĹ›Ä‡ do peĹ‚nej listy zadaĹ„.
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleTask(task.id, task.status)}
                            >
                              {task.status === 'done' ? 'PrzywrĂłÄ‡' : 'Oznacz jako zrobione'}
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to="/tasks">OtwĂłrz listÄ™</Link>
                            </Button>
                          </div>
                        </div>
                      </TileCard>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Dzisiaj</h2>
                  <p className="text-sm text-slate-500">Plan dnia z aktualizacjÄ… live.</p>
                </div>
                <Badge variant="secondary" className="rounded-full">{todayEntries.length}</Badge>
              </div>

              <div className="space-y-4">
                <TileCard
                  id="today-section-leads"
                  title="Leady do ruchu"
                  subtitle={`${todayLeadActions.length} wpisów`}
                  collapsedMap={collapsedTiles}
                  onToggle={toggleTile}
                >
                  {todayLeadActions.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto pr-1 space-y-3">
                      {todayLeadActions.map((entry) => (
                        <Card key={entry.id} className="border-amber-100">
                          <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 break-words">{entry.leadName}</p>
                              <p className="text-sm text-slate-500 break-words">{entry.title}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-bold text-amber-600">{format(parseISO(entry.startsAt), 'HH:mm')}</span>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={entry.link ?? '/leads'}>Otwórz</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-slate-50/50">
                      <CardContent className="p-6 text-sm text-slate-500">Brak leadów z ruchem na dziś.</CardContent>
                    </Card>
                  )}
                </TileCard>

                <TileCard
                  id="today-section-events"
                  title="Wydarzenia"
                  subtitle={`${todayEvents.length} wpisów`}
                  collapsedMap={collapsedTiles}
                  onToggle={toggleTile}
                >
                  {todayEvents.length > 0 ? (
                    <div className="grid gap-3">
                      {todayEvents.map((entry) => (
                        <Card key={entry.id} className="border-indigo-100">
                          <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 break-words">{entry.title}</p>
                              <p className="text-sm text-slate-500 break-words">{EVENT_TYPES.find((item) => item.value === entry.raw.type)?.label ?? 'Wydarzenie'}{entry.leadName ? ` • Lead: ${entry.leadName}` : ''}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                {entry.raw?.recurrence?.mode && entry.raw.recurrence.mode !== 'none' ? (
                                  <Badge variant="outline" className="text-[10px] uppercase">
                                    <Repeat className="w-3 h-3 mr-1" /> {RECURRENCE_OPTIONS.find((option) => option.value === entry.raw.recurrence.mode)?.label}
                                  </Badge>
                                ) : null}
                                {entry.raw?.reminder?.mode && entry.raw.reminder.mode !== 'none' ? (
                                  <Badge variant="outline" className="text-[10px] uppercase">
                                    <Bell className="w-3 h-3 mr-1" /> Przypomnienie
                                  </Badge>
                                ) : null}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-bold text-indigo-600">{format(parseISO(entry.startsAt), 'HH:mm')}</span>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to="/calendar">Kalendarz</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-slate-50/50">
                      <CardContent className="p-6 text-sm text-slate-500">Brak wydarzeń na dziś.</CardContent>
                    </Card>
                  )}
                </TileCard>

                <TileCard
                  id="today-section-tasks"
                  title="Zadania na dziś"
                  subtitle={`${todayTasks.length} wpisów`}
                  collapsedMap={collapsedTiles}
                  onToggle={toggleTile}
                >
                  {todayTasks.length > 0 ? (
                    <div className="grid gap-3">
                      {todayTasks.map((entry) => (
                        <Card key={entry.id} className="hover:border-primary/30 transition-colors">
                          <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 break-words">{entry.title}</p>
                              <p className="text-sm text-slate-500 break-words">{TASK_TYPES.find((item) => item.value === entry.raw.type)?.label ?? 'Zadanie'} • {format(parseISO(entry.startsAt), 'HH:mm')}{entry.leadName ? ` • Lead: ${entry.leadName}` : ''}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                {entry.raw?.recurrence?.mode && entry.raw.recurrence.mode !== 'none' ? (
                                  <Badge variant="outline" className="text-[10px] uppercase">
                                    <Repeat className="w-3 h-3 mr-1" /> {RECURRENCE_OPTIONS.find((option) => option.value === entry.raw.recurrence.mode)?.label}
                                  </Badge>
                                ) : null}
                                {entry.raw?.reminder?.mode && entry.raw.reminder.mode !== 'none' ? (
                                  <Badge variant="outline" className="text-[10px] uppercase">
                                    <Bell className="w-3 h-3 mr-1" /> Przypomnienie
                                  </Badge>
                                ) : null}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleTask(entry.sourceId, entry.raw.status)}
                            >
                              {entry.raw.status === 'done' ? 'Przywróć' : 'Zakończ'}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-slate-50/50">
                      <CardContent className="p-8 text-center">
                        <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Brak zadań na dziś.</p>
                      </CardContent>
                    </Card>
                  )}
                </TileCard>
              </div>
            </section>

            {noStepLeads.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Bez nastÄ™pnego kroku</h2>
                  <Badge variant="outline" className="rounded-full border-amber-200 text-amber-700 bg-amber-50">{noStepLeads.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {noStepLeads.slice(0, 4).map((lead) => (
                    <TileCard
                      key={lead.id}
                      id={`no-step:${lead.id}`}
                      title={lead.name}
                      subtitle={lead.company || 'Brak firmy'}
                      collapsedMap={collapsedTiles}
                      onToggle={toggleTile}
                      className="hover:shadow-md transition-shadow"
                      headerRight={
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                          Zaniedbany
                        </Badge>
                      }
                    >
                      <Button variant="outline" size="sm" className="w-full rounded-lg" asChild>
                        <Link to={`/leads/${lead.id}`}>
                          Ustal kolejny krok <ArrowRight className="w-3 h-3 ml-2" />
                        </Link>
                      </Button>
                    </TileCard>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            <TileCard
              id="pipeline-summary"
              title="WartoĹ›Ä‡ lejka"
              subtitle={`${leads.reduce((acc, lead) => acc + (lead.dealValue || 0), 0).toLocaleString()} PLN`}
              collapsedMap={collapsedTiles}
              onToggle={toggleTile}
              className="bg-slate-900 text-white border-none shadow-xl"
              titleClassName="text-white"
              subtitleClassName="text-slate-300 text-2xl font-bold"
              headerRight={
                <TrendingUp className="w-10 h-10 text-white/20" />
              }
              bodyClassName="border-t border-slate-800"
            >
              <p className="text-xs text-slate-400">Suma aktywnych szans sprzedaĹĽy</p>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Aktywne leady</p>
                  <p className="text-xl font-bold text-white">{leads.filter((lead) => lead.status !== 'won' && lead.status !== 'lost').length}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Zadania</p>
                  <p className="text-xl font-bold text-white">{tasks.length}</p>
                </div>
              </div>
            </TileCard>

            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">NajbliĹĽsze dni</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((days) => {
                  const date = addDays(new Date(), days);
                  const dayEntries = combineScheduleEntries({
                    events,
                    tasks,
                    leads,
                    rangeStart: date,
                    rangeEnd: new Date(date.getTime() + 24 * 60 * 60_000 - 1),
                  });
                  const count = dayEntries.length;
                  if (count === 0) return null;

                  return (
                    <TileCard
                      key={days}
                      id={`upcoming-day:${days}`}
                      title={`${format(date, 'EEE', { locale: pl }).toUpperCase()} ${format(date, 'd')}`}
                      subtitle={`${count} ${count === 1 ? 'rzecz' : 'rzeczy'}`}
                      collapsedMap={collapsedTiles}
                      onToggle={toggleTile}
                    >
                      <p className="text-[10px] text-slate-500">
                        {dayEntries.filter((entry) => entry.kind === 'event').length} wydarzeĹ„ â€˘ {dayEntries.filter((entry) => entry.kind === 'task').length} zadaĹ„ â€˘ {dayEntries.filter((entry) => entry.kind === 'lead').length} leadĂłw
                      </p>
                    </TileCard>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Najcenniejsze</h2>
              <div className="space-y-3">
                {topValuableLeads.map((lead) => (
                  <TileCard
                    key={lead.id}
                    id={`valuable:${lead.id}`}
                    title={lead.name}
                    subtitle={lead.company || lead.source}
                    collapsedMap={collapsedTiles}
                    onToggle={toggleTile}
                    headerRight={
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{(lead.dealValue || 0).toLocaleString()} PLN</p>
                        <Badge variant="outline" className="text-[8px] h-4 px-1">TOP</Badge>
                      </div>
                    }
                  >
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/leads/${lead.id}`}>OtwĂłrz lead</Link>
                    </Button>
                  </TileCard>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <TileCard
                id="info-recurring"
                title="CyklicznoĹ›Ä‡ dziaĹ‚a live"
                subtitle="Powtarzalne zadania i wydarzenia wpadajÄ… teraz do planu dnia bez rÄ™cznego odĹ›wieĹĽania."
                collapsedMap={collapsedTiles}
                onToggle={toggleTile}
                headerRight={<Repeat className="w-4 h-4 text-slate-400" />}
              >
                <p className="text-sm text-slate-500">Sekcja zostaje w widoku jako szybka notatka, ale moĹĽesz jÄ… zwinÄ…Ä‡, ĹĽeby nie zabieraĹ‚a miejsca.</p>
              </TileCard>

              <TileCard
                id="info-reminders"
                title="Przypomnienia zapisujÄ… siÄ™ w danych"
                subtitle="Warstwa konfiguracji przypomnieĹ„ jest juĹĽ spiÄ™ta z formularzami."
                collapsedMap={collapsedTiles}
                onToggle={toggleTile}
                headerRight={<Bell className="w-4 h-4 text-slate-400" />}
              >
                <p className="text-sm text-slate-500">Osobny silnik wysyĹ‚ki to nadal osobny brak V1, ale ustawienia przypomnieĹ„ sÄ… juĹĽ zapisywane i gotowe do dalszego rozwijania.</p>
              </TileCard>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
