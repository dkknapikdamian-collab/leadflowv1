import { useEffect, useMemo, useState, type FormEvent } from 'react';
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
  Target,
} from 'lucide-react';
import {
  addDays,
  endOfDay,
  format,
  isPast,
  isToday,
  parseISO,
  subDays,
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
  toDateTimeLocalValue,
} from '../lib/scheduling';
import {
  EVENT_TYPES,
  PRIORITY_OPTIONS,
  RECURRENCE_OPTIONS,
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

const modalSelectClass =
  'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

const quickDateButtonClass =
  'inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50';

type LeadInsight = {
  lead: any;
  reason: string;
  score: number;
  overdue: boolean;
  missingNextStep: boolean;
  waitingTooLong: boolean;
  highValueAtRisk: boolean;
  nextActionDate: Date | null;
  daysSinceTouch: number;
};

function toDateSafe(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string') {
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

function isClosedLead(status?: string) {
  return status === 'won' || status === 'lost';
}

function hasLeadNextStep(lead: any) {
  return Boolean(String(lead?.nextStep || '').trim()) && Boolean(String(lead?.nextActionAt || '').trim());
}

function getLeadTouchDate(lead: any) {
  return (
    toDateSafe(lead?.lastContactAt) ||
    toDateSafe(lead?.updatedAt) ||
    toDateSafe(lead?.createdAt) ||
    null
  );
}

function getDaysSince(date: Date | null) {
  if (!date) return 999;
  const diff = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

function getNextActionDate(lead: any) {
  return toDateSafe(lead?.nextActionAt);
}

function isLeadOverdue(lead: any) {
  if (isClosedLead(String(lead?.status || 'new'))) return false;
  const nextActionDate = getNextActionDate(lead);
  return Boolean(nextActionDate && isPast(nextActionDate));
}

function isLeadMissingNextStep(lead: any) {
  if (isClosedLead(String(lead?.status || 'new'))) return false;
  return !hasLeadNextStep(lead);
}

function isLeadWaitingTooLong(lead: any, daysSinceTouch: number) {
  const status = String(lead?.status || 'new');
  if (isClosedLead(status)) return false;
  if (!['contacted', 'proposal_sent', 'follow_up', 'negotiation'].includes(status)) return false;
  return daysSinceTouch >= 4;
}

function isLeadHighValueAtRisk(lead: any, overdue: boolean, missingNextStep: boolean, daysSinceTouch: number) {
  const value = Number(lead?.dealValue || 0);
  if (value < 4000) return false;
  return overdue || missingNextStep || daysSinceTouch >= 5;
}

function buildLeadReason(
  lead: any,
  overdue: boolean,
  missingNextStep: boolean,
  waitingTooLong: boolean,
  highValueAtRisk: boolean,
  daysSinceTouch: number
) {
  if (overdue) return 'Termin kolejnego ruchu już minął';
  if (missingNextStep) return 'Lead nie ma ustawionego kolejnego kroku';
  if (waitingTooLong) return `Lead czeka za długo bez ruchu (${daysSinceTouch} dni)`;
  if (highValueAtRisk) return 'Wysoka wartość i brak wystarczającego ruchu';
  return 'Lead wymaga uwagi';
}

function getLeadPriorityScore(
  lead: any,
  overdue: boolean,
  missingNextStep: boolean,
  waitingTooLong: boolean,
  highValueAtRisk: boolean,
  daysSinceTouch: number
) {
  let score = 0;
  const value = Number(lead?.dealValue || 0);

  if (overdue) score += 100;
  if (missingNextStep) score += 80;
  if (waitingTooLong) score += 55;
  if (highValueAtRisk) score += 45;
  score += Math.min(value / 200, 40);
  score += Math.min(daysSinceTouch * 2, 24);

  return score;
}

function buildLeadInsight(lead: any): LeadInsight | null {
  const status = String(lead?.status || 'new');
  if (isClosedLead(status)) return null;

  const nextActionDate = getNextActionDate(lead);
  const daysSinceTouch = getDaysSince(getLeadTouchDate(lead));
  const overdue = isLeadOverdue(lead);
  const missingNextStep = isLeadMissingNextStep(lead);
  const waitingTooLong = isLeadWaitingTooLong(lead, daysSinceTouch);
  const highValueAtRisk = isLeadHighValueAtRisk(lead, overdue, missingNextStep, daysSinceTouch);

  return {
    lead,
    reason: buildLeadReason(lead, overdue, missingNextStep, waitingTooLong, highValueAtRisk, daysSinceTouch),
    score: getLeadPriorityScore(lead, overdue, missingNextStep, waitingTooLong, highValueAtRisk, daysSinceTouch),
    overdue,
    missingNextStep,
    waitingTooLong,
    highValueAtRisk,
    nextActionDate,
    daysSinceTouch,
  };
}

function sortLeadInsights(items: LeadInsight[]) {
  return [...items].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aTime = a.nextActionDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bTime = b.nextActionDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  });
}

function formatLeadActionDate(date: Date | null) {
  if (!date) return 'Brak terminu';
  return format(date, 'd MMMM HH:mm', { locale: pl });
}

function getLeadSectionTone(insight: LeadInsight) {
  if (insight.overdue) return 'border-rose-100 bg-rose-50/30';
  if (insight.missingNextStep) return 'border-amber-100 bg-amber-50/30';
  if (insight.waitingTooLong) return 'border-orange-100 bg-orange-50/30';
  if (insight.highValueAtRisk) return 'border-indigo-100 bg-indigo-50/30';
  return 'border-slate-100 bg-white';
}

function getQuickLeadDateLabel(days: number) {
  if (days === 0) return 'Dziś';
  if (days === 1) return 'Jutro';
  if (days === 3) return 'Za 3 dni';
  return 'Za tydzień';
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
            toast.error(`Błąd odczytu planu dnia: ${error.message}`);
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
    if (!hasAccess) return toast.error('Twój trial wygasł. Opłać subskrypcję, aby dodawać leady.');
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
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    try {
      const selectedLead = leads.find((lead) => lead.id === newTask.leadId);
      if (isSupabaseConfigured()) {
        await insertTaskToSupabase({
          title: newTask.title,
          type: newTask.type,
          date: newTask.dueAt.slice(0, 10),
          priority: newTask.priority,
          leadId: selectedLead?.id ?? null,
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
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    try {
      const selectedLead = leads.find((lead) => lead.id === newEvent.leadId);
      if (isSupabaseConfigured()) {
        await insertEventToSupabase({
          title: newEvent.title,
          type: newEvent.type,
          startAt: newEvent.startAt,
          endAt: newEvent.endAt,
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
      toast.error('Błąd: ' + error.message);
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
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleEventStartChange = (value: string) => {
    const currentStart = parseISO(newEvent.startAt);
    const currentEnd = parseISO(newEvent.endAt);
    const duration = Math.max(currentEnd.getTime() - currentStart.getTime(), 60 * 60_000);
    const nextEnd = new Date(parseISO(value).getTime() + duration);
    setNewEvent({ ...newEvent, startAt: value, endAt: toDateTimeLocalValue(nextEnd) });
  };

  const quickLeadDates = useMemo(
    () => [0, 1, 3, 7].map((days) => ({
      label: getQuickLeadDateLabel(days),
      value: format(addDays(new Date(), days), 'yyyy-MM-dd'),
    })),
    []
  );

  const leadInsights = useMemo(() => {
    return sortLeadInsights(
      leads
        .map((lead) => buildLeadInsight(lead))
        .filter((entry): entry is LeadInsight => Boolean(entry))
    );
  }, [leads]);

  const overdueLeadInsights = useMemo(
    () => leadInsights.filter((entry) => entry.overdue),
    [leadInsights]
  );

  const missingStepLeadInsights = useMemo(
    () => leadInsights.filter((entry) => entry.missingNextStep),
    [leadInsights]
  );

  const waitingLeadInsights = useMemo(
    () => leadInsights.filter((entry) => entry.waitingTooLong),
    [leadInsights]
  );

  const highValueLeadInsights = useMemo(
    () => leadInsights.filter((entry) => entry.highValueAtRisk),
    [leadInsights]
  );

  const topPriorityLeadInsights = useMemo(
    () => leadInsights.slice(0, 5),
    [leadInsights]
  );

  const next7DaysLeadInsights = useMemo(() => {
    const limitDate = endOfDay(addDays(new Date(), 7));
    return sortLeadInsights(
      leadInsights.filter((entry) => {
        if (!entry.nextActionDate) return false;
        return !entry.overdue && entry.nextActionDate <= limitDate;
      })
    ).slice(0, 5);
  }, [leadInsights]);

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

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Witaj, {profile?.fullName?.split(' ')[0]}!</h1>
            <p className="text-slate-500">Dziś zbieramy w jednym miejscu leady, zadania i wydarzenia.</p>
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
                    <Label>Imię i nazwisko / Firma</Label>
                    <Input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Wartość (PLN)</Label>
                      <Input type="number" value={newLead.dealValue} onChange={(e) => setNewLead({ ...newLead, dealValue: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Źródło</Label>
                      <select className={modalSelectClass} value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}>
                        {SOURCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Kolejny krok</Label>
                    <Input value={newLead.nextStep} onChange={(e) => setNewLead({ ...newLead, nextStep: e.target.value })} placeholder="np. Telefon z ofertą" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label>Termin ruchu</Label>
                      <div className="flex flex-wrap gap-2">
                        {quickLeadDates.map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            className={quickDateButtonClass}
                            onClick={() => setNewLead((prev) => ({ ...prev, nextActionAt: option.value }))}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Input type="date" value={newLead.nextActionAt} onChange={(e) => setNewLead({ ...newLead, nextActionAt: e.target.value })} />
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
                      <Label>Tytuł zadania</Label>
                      <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <div className="space-y-2">
                        <Label>Priorytet</Label>
                        <select className={modalSelectClass} value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
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
                      <p className="text-sm font-bold text-slate-900">Cykliczność</p>
                      <p className="text-xs text-slate-500">Możesz ustawić zadanie jednorazowe albo cykliczne.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Powtarzanie</Label>
                        <select className={modalSelectClass} value={newTask.recurrence.mode} onChange={(e) => setNewTask({ ...newTask, recurrence: { ...newTask.recurrence, mode: e.target.value as any } })}>
                          {RECURRENCE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
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
                      <p className="text-xs text-slate-500">Na końcu ustaw przypomnienie i jego cykliczność.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tryb</Label>
                        <select className={modalSelectClass} value={newTask.reminder.mode} onChange={(e) => setNewTask({ ...newTask, reminder: { ...newTask.reminder, mode: e.target.value as any } })}>
                          {REMINDER_MODE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Ile minut wcześniej</Label>
                        <Input type="number" min="0" value={newTask.reminder.minutesBefore} onChange={(e) => setNewTask({ ...newTask, reminder: { ...newTask.reminder, minutesBefore: Math.max(0, Number(e.target.value) || 0) } })} disabled={newTask.reminder.mode === 'none'} />
                      </div>
                    </div>
                    {newTask.reminder.mode === 'recurring' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Cykliczność przypomnienia</Label>
                          <select className={modalSelectClass} value={newTask.reminder.recurrenceMode} onChange={(e) => setNewTask({ ...newTask, reminder: { ...newTask.reminder, recurrenceMode: e.target.value as any } })}>
                            {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
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
                      <p className="text-xs text-slate-500">Najpierw ustaw start i koniec. Koniec aktualizuje się automatycznie po zmianie startu.</p>
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
                      <p className="text-sm font-bold text-slate-900">Cykliczność wydarzenia</p>
                      <p className="text-xs text-slate-500">Możesz ustawić np. wydarzenie miesięczne i będzie widoczne dynamicznie w kalendarzu.</p>
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
                      <Input type="date" value={newEvent.recurrence.until ?? ''} onChange={(e) => setNewEvent({ ...newEvent, recurrence: { ...newEvent.recurrence, until: e.target.value || null } })} disabled={newEvent.recurrence.mode === 'none'} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Przypomnienia</p>
                      <p className="text-xs text-slate-500">Na końcu ustaw przypomnienie jednorazowe albo cykliczne.</p>
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
                        <Label>Ile minut wcześniej</Label>
                        <Input type="number" min="0" value={newEvent.reminder.minutesBefore} onChange={(e) => setNewEvent({ ...newEvent, reminder: { ...newEvent.reminder, minutesBefore: Math.max(0, Number(e.target.value) || 0) } })} disabled={newEvent.reminder.mode === 'none'} />
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
        </header>

        {topPriorityLeadInsights.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Najważniejsze ruchy dziś</h2>
              <Badge variant="secondary" className="rounded-full">{topPriorityLeadInsights.length}</Badge>
            </div>
            <div className="grid gap-3">
              {topPriorityLeadInsights.map((insight) => (
                <Card key={`priority:${insight.lead.id}`} className={`${getLeadSectionTone(insight)} shadow-sm`}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-slate-900 break-words">{insight.lead.name}</p>
                        {insight.overdue ? <Badge variant="destructive">Przeterminowany</Badge> : null}
                        {insight.missingNextStep ? <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Brak kroku</Badge> : null}
                        {insight.waitingTooLong ? <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Czeka za długo</Badge> : null}
                        {insight.highValueAtRisk ? <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Wysoka wartość</Badge> : null}
                      </div>
                      <p className="text-sm text-slate-700">{insight.reason}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {insight.lead.nextStep ? `Krok: ${insight.lead.nextStep}` : 'Krok: brak ustawionego kroku'} • {formatLeadActionDate(insight.nextActionDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Wartość</p>
                        <p className="text-sm font-bold text-slate-900">{(Number(insight.lead.dealValue) || 0).toLocaleString()} PLN</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/leads/${insight.lead.id}`}>Otwórz</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {overdueTasks.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Zaległe</h2>
                  <Badge variant="destructive" className="rounded-full">{overdueTasks.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {overdueTasks.map((task) => {
                    const startAt = getTaskStartAt(task) ?? `${getTaskDate(task)}T09:00`;
                    return (
                      <Card key={task.id} className="border-rose-100 bg-rose-50/30">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleTask(task.id, task.status)} className="w-5 h-5 rounded border border-rose-300 flex items-center justify-center">
                              {task.status === 'done' ? <CheckSquare className="w-4 h-4 text-rose-600" /> : null}
                            </button>
                            <div>
                              <p className="font-medium text-slate-900">{task.title}</p>
                              <p className="text-xs text-rose-500 font-medium">{format(parseISO(startAt), 'd MMMM HH:mm', { locale: pl })}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to="/tasks"><ChevronRight className="w-4 h-4" /></Link>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {overdueLeadInsights.length > 0 ? (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Przeterminowane leady</h2>
                  <Badge variant="destructive" className="rounded-full">{overdueLeadInsights.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {overdueLeadInsights.slice(0, 4).map((insight) => (
                    <Card key={`overdue:${insight.lead.id}`} className="border-rose-100 bg-rose-50/30">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{insight.lead.name}</p>
                          <p className="text-sm text-slate-700">{insight.reason}</p>
                          <p className="text-xs text-rose-500 font-medium">{formatLeadActionDate(insight.nextActionDate)}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/leads/${insight.lead.id}`}>Otwórz</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            {waitingLeadInsights.length > 0 ? (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Czekają za długo</h2>
                  <Badge variant="outline" className="rounded-full border-orange-200 text-orange-700 bg-orange-50">{waitingLeadInsights.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {waitingLeadInsights.slice(0, 4).map((insight) => (
                    <Card key={`waiting:${insight.lead.id}`} className="border-orange-100 bg-orange-50/30">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{insight.lead.name}</p>
                          <p className="text-sm text-slate-700">{insight.reason}</p>
                          <p className="text-xs text-orange-600 font-medium">Bez mocnego ruchu od {insight.daysSinceTouch} dni</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/leads/${insight.lead.id}`}>Otwórz</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Dzisiaj</h2>
                  <p className="text-sm text-slate-500">Plan dnia z aktualizacją live.</p>
                </div>
                <Badge variant="secondary" className="rounded-full">{todayEntries.length}</Badge>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Leady do ruchu</h3>
                  {todayLeadActions.length > 0 ? (
                    <div className="grid gap-3">
                      {todayLeadActions.map((entry) => (
                        <Card key={entry.id} className="shadow-sm border-amber-100">
                          <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold text-amber-600">{format(parseISO(entry.startsAt), 'HH:mm')}</p>
                              <p className="font-semibold text-slate-900">{entry.leadName}</p>
                              <p className="text-xs text-slate-500">{entry.title}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={entry.link ?? '/leads'}>Otwórz</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-slate-50/50">
                      <CardContent className="p-6 text-sm text-slate-500">Brak leadów z ruchem na dziś.</CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Wydarzenia</h3>
                  {todayEvents.length > 0 ? (
                    <div className="grid gap-3">
                      {todayEvents.map((entry) => (
                        <Card key={entry.id} className="border-indigo-100 shadow-sm">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 text-center border-r border-slate-100 pr-4">
                              <p className="text-xs font-bold text-indigo-600">{format(parseISO(entry.startsAt), 'HH:mm')}</p>
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <p className="font-semibold text-slate-900">{entry.title}</p>
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
                              <p className="text-xs text-slate-500">
                                {EVENT_TYPES.find((item) => item.value === entry.raw.type)?.label ?? 'Wydarzenie'}
                                {entry.leadName ? ` • Lead: ${entry.leadName}` : ''}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to="/calendar"><ChevronRight className="w-4 h-4" /></Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-slate-50/50">
                      <CardContent className="p-6 text-sm text-slate-500">Brak wydarzeń na dziś.</CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Zadania na dziś</h3>
                  {todayTasks.length > 0 ? (
                    <div className="grid gap-3">
                      {todayTasks.map((entry) => (
                        <Card key={entry.id} className="hover:border-primary/30 transition-colors shadow-sm">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <button onClick={() => toggleTask(entry.sourceId, entry.raw.status)} className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center hover:border-primary">
                                {entry.raw.status === 'done' ? <CheckSquare className="w-4 h-4 text-primary" /> : null}
                              </button>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-slate-900">{entry.title}</p>
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
                                <p className="text-xs text-slate-500">
                                  {TASK_TYPES.find((item) => item.value === entry.raw.type)?.label ?? 'Zadanie'} • {format(parseISO(entry.startsAt), 'HH:mm')}
                                  {entry.leadName ? ` • Lead: ${entry.leadName}` : ''}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-[10px] uppercase">{entry.raw.type}</Badge>
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
                </div>
              </div>
            </section>

            {missingStepLeadInsights.length > 0 ? (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Bez następnego kroku</h2>
                  <Badge variant="outline" className="rounded-full border-amber-200 text-amber-700 bg-amber-50">{missingStepLeadInsights.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {missingStepLeadInsights.slice(0, 4).map((insight) => (
                    <Card key={`missing:${insight.lead.id}`} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900">{insight.lead.name}</h4>
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Zaniedbany</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">{insight.lead.company || 'Brak firmy'}</p>
                        <Button variant="outline" size="sm" className="w-full rounded-lg" asChild>
                          <Link to={`/leads/${insight.lead.id}`}>Ustal kolejny krok <ArrowRight className="w-3 h-3 ml-2" /></Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="space-y-8">
            <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-24 h-24" />
              </div>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-400">Wartość lejka</p>
                <div className="text-3xl font-bold mb-1">{leads.reduce((acc, lead) => acc + (lead.dealValue || 0), 0).toLocaleString()} PLN</div>
                <p className="text-xs text-slate-400">Suma aktywnych szans sprzedaży</p>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Aktywne leady</p>
                    <p className="text-xl font-bold">{leads.filter((lead) => !isClosedLead(String(lead.status || 'new'))).length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Zadania</p>
                    <p className="text-xl font-bold">{tasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Ten tydzień</h2>
              <div className="space-y-3">
                {next7DaysLeadInsights.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-sm text-slate-500">
                    Brak leadów z ustawionym ruchem w najbliższym tygodniu.
                  </div>
                ) : next7DaysLeadInsights.map((insight) => (
                  <Link key={`week:${insight.lead.id}`} to={`/leads/${insight.lead.id}`} className="block">
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-colors hover:border-primary/30">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{insight.lead.name}</p>
                        <p className="text-[10px] text-slate-500">{insight.lead.nextStep || 'Brak opisu kroku'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-700">{formatLeadActionDate(insight.nextActionDate)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Najcenniejsze do ruszenia dziś</h2>
              <div className="space-y-3">
                {(highValueLeadInsights.length > 0 ? highValueLeadInsights : topPriorityLeadInsights).slice(0, 3).map((insight) => (
                  <Link key={`value:${insight.lead.id}`} to={`/leads/${insight.lead.id}`} className="block">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-primary/30 transition-colors shadow-sm">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{insight.lead.name}</p>
                        <p className="text-[10px] text-slate-500">{insight.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{(Number(insight.lead.dealValue) || 0).toLocaleString()} PLN</p>
                        <Badge variant="outline" className="text-[8px] h-4 px-1">TOP</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Repeat className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-900">Cykliczność działa live</h3>
                </div>
                <p className="text-sm text-slate-500">Powtarzalne zadania i wydarzenia wpadają teraz do planu dnia bez ręcznego odświeżania.</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-900">Przypomnienia zapisują się w danych</h3>
                </div>
                <p className="text-sm text-slate-500">Warstwa konfiguracji przypomnień jest już spięta z formularzami. Osobny silnik wysyłki to nadal osobny brak V1.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
