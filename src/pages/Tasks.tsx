import { useEffect, useMemo, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { addDays, endOfDay, format, isPast, isToday, isTomorrow, isValid, isWithinInterval, parseISO, startOfToday } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  Clock,
  ListTodo,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  Square,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { auth, db } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import { ensureCurrentUserWorkspace } from '../lib/workspace';
import { deleteTaskFromSupabase, fetchLeadsFromSupabase, fetchTasksFromSupabase, insertTaskToSupabase, isSupabaseConfigured, updateTaskInSupabase } from '../lib/supabase-fallback';
import { RecurrenceEndType, RecurrenceRule, SnoozePreset, applySnoozePreset, canScheduleNextRecurrence, nextRecurringDate } from '../lib/scheduling';
import Layout from '../components/Layout';
import { LeadPicker, type LeadPickerOption } from '../components/lead-picker';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'phone', label: 'Telefon' },
  { value: 'reply', label: 'Odpisać' },
  { value: 'send_offer', label: 'Wyślij ofertę' },
  { value: 'meeting', label: 'Spotkanie' },
  { value: 'other', label: 'Inne' },
] as const;

const RECURRENCE_OPTIONS: { value: RecurrenceRule; label: string }[] = [
  { value: 'none', label: 'Brak' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'every_2_days', label: 'Co 2 dni' },
  { value: 'weekly', label: 'Co tydzień' },
  { value: 'monthly', label: 'Co miesiąc' },
  { value: 'weekday', label: 'Dzień roboczy' },
];

type TaskStatus = 'todo' | 'done' | 'overdue' | 'postponed';
type ViewMode = 'active' | 'today' | 'week' | 'overdue' | 'done';

type TaskRecord = {
  id: string;
  title: string;
  type: string;
  date: string;
  status: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  reminderAt?: string | null;
  recurrenceRule?: RecurrenceRule;
  recurrenceEndType?: RecurrenceEndType;
  recurrenceEndAt?: string | null;
  recurrenceCount?: number | null;
  recurrenceDoneCount?: number | null;
  snoozeUntil?: string | null;
  leadId?: string;
  leadName?: string;
  clientId?: string;
  clientName?: string;
  caseId?: string;
  caseTitle?: string;
};

function getDateLabel(date: Date) {
  if (isToday(date)) return 'Dzisiaj';
  if (isTomorrow(date)) return 'Jutro';
  return format(date, 'EEEE, d MMMM', { locale: pl });
}

function parseTaskDate(value?: string | null) {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

function getSafeTaskDate(task: TaskRecord) {
  return parseTaskDate(task.date) ?? startOfToday();
}

function getEffectiveStatus(task: TaskRecord): TaskStatus {
  if (task.status === 'done') return 'done';
  const date = getSafeTaskDate(task);
  if (isPast(date) && !isToday(date)) return 'overdue';
  return task.status === 'postponed' ? 'postponed' : 'todo';
}

function getLeadLabel(task: TaskRecord, leads: LeadPickerOption[]) {
  return task.leadName || leads.find((lead) => lead.id === task.leadId)?.name || '';
}

export default function Tasks() {
  const { workspace, hasAccess } = useWorkspace();
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [leads, setLeads] = useState<LeadPickerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'follow_up',
    date: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
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
      setTasks([]);
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      setLoading(true);
      void Promise.all([fetchTasksFromSupabase(), fetchLeadsFromSupabase()])
        .then(([items, leadItems]) => {
          setTasks(items as TaskRecord[]);
          setLeads(leadItems as LeadPickerOption[]);
        })
        .catch(() => {
          setTasks([]);
          setLeads([]);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('date', 'asc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setTasks(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<TaskRecord, 'id'>) })));
        setLoading(false);
      },
      () => {
        setTasks([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [workspace]);

  const counts = useMemo(() => {
    const todayStart = startOfToday();
    const weekEnd = endOfDay(addDays(todayStart, 6));

    return tasks.reduce(
      (acc, task) => {
        const status = getEffectiveStatus(task);
        const date = getSafeTaskDate(task);
        const isDone = status === 'done';
        const overdue = status === 'overdue';
        const today = !isDone && isToday(date);
        const thisWeek = !isDone && isWithinInterval(date, { start: todayStart, end: weekEnd });
        const active = !isDone;

        if (active) acc.active += 1;
        if (today) acc.today += 1;
        if (thisWeek) acc.week += 1;
        if (overdue) acc.overdue += 1;
        if (isDone) acc.done += 1;
        return acc;
      },
      { active: 0, today: 0, week: 0, overdue: 0, done: 0 }
    );
  }, [tasks]);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error('Brak aktywnej sesji.');
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!newTask.title.trim()) return toast.error('Wpisz tytuł zadania.');

    try {
      const ensuredWorkspace = workspace ?? await ensureCurrentUserWorkspace();
      const usingSupabase = isSupabaseConfigured();
      if (usingSupabase) {
        await insertTaskToSupabase({
          title: newTask.title,
          type: newTask.type,
          date: newTask.date,
          priority: newTask.priority,
          status: 'todo',
          leadId: newTask.leadId || null,
          ownerId: auth.currentUser.uid,
          workspaceId: ensuredWorkspace.id,
        });
      } else {
        await addDoc(collection(db, 'tasks'), {
          title: newTask.title,
          type: newTask.type,
          date: newTask.date,
          priority: newTask.priority,
          reminderAt: newTask.reminderAt || null,
          recurrenceRule: newTask.recurrenceRule,
          recurrenceEndType: newTask.recurrenceEndType,
          recurrenceEndAt: newTask.recurrenceEndAt || null,
          recurrenceCount: Number(newTask.recurrenceCount) || null,
          recurrenceDoneCount: 0,
          status: 'todo',
          ownerId: auth.currentUser.uid,
          workspaceId: ensuredWorkspace.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      if (usingSupabase) {
        setTasks((prev) => [
          {
            id: crypto.randomUUID(),
            title: newTask.title,
            type: newTask.type,
            date: newTask.date,
            priority: newTask.priority as TaskRecord['priority'],
            status: 'todo',
            leadId: newTask.leadId || undefined,
            leadName: leads.find((lead) => lead.id === newTask.leadId)?.name,
          },
          ...prev,
        ]);
      }

      toast.success('Zadanie dodane');
      setIsNewTaskOpen(false);
      setNewTask({
        title: '',
        type: 'follow_up',
        date: format(new Date(), 'yyyy-MM-dd'),
        priority: 'medium',
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

  const toggleTask = async (task: TaskRecord) => {
    try {
      const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
      if (isSupabaseConfigured()) {
        await updateTaskInSupabase({
          id: task.id,
          status: nextStatus,
        });
        setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, status: nextStatus } : item)));
      } else {
        await updateDoc(doc(db, 'tasks', task.id), {
          status: nextStatus,
          updatedAt: serverTimestamp(),
        });
      }

      if (
        !isSupabaseConfigured() &&
        nextStatus === 'done'
        && task.recurrenceRule
        && task.recurrenceRule !== 'none'
        && canScheduleNextRecurrence(task.recurrenceEndType, task.recurrenceEndAt || undefined, task.recurrenceDoneCount || undefined, task.recurrenceCount || undefined)
      ) {
        const nextDate = nextRecurringDate(task.date, task.recurrenceRule);
        if (nextDate) {
          const ensuredWorkspace = workspace ?? await ensureCurrentUserWorkspace();
          await addDoc(collection(db, 'tasks'), {
            title: task.title,
            type: task.type,
            date: nextDate,
            priority: task.priority || 'medium',
            reminderAt: task.reminderAt || null,
            recurrenceRule: task.recurrenceRule,
            recurrenceEndType: task.recurrenceEndType || 'never',
            recurrenceEndAt: task.recurrenceEndAt || null,
            recurrenceCount: task.recurrenceCount || null,
            recurrenceDoneCount: (task.recurrenceDoneCount || 0) + 1,
            status: 'todo',
            ownerId: auth.currentUser?.uid,
            workspaceId: ensuredWorkspace.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const snoozeTask = async (task: TaskRecord, preset: SnoozePreset) => {
    try {
      const snoozeUntil = applySnoozePreset(preset);
      if (isSupabaseConfigured()) {
        const nextDate = snoozeUntil.slice(0, 10);
        await updateTaskInSupabase({
          id: task.id,
          status: 'postponed',
          date: nextDate,
        });
        setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, status: 'postponed', date: nextDate } : item)));
      } else {
        await updateDoc(doc(db, 'tasks', task.id), {
          status: 'postponed',
          snoozeUntil,
          date: snoozeUntil.slice(0, 10),
          updatedAt: serverTimestamp(),
        });
      }
      toast.success('Zadanie odłożone');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Usuń zadanie?')) return;
    try {
      if (isSupabaseConfigured()) {
        await deleteTaskFromSupabase(taskId);
        setTasks((prev) => prev.filter((item) => item.id !== taskId));
      } else {
        await deleteDoc(doc(db, 'tasks', taskId));
      }
      toast.success('Zadanie usunięte');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const filteredTasks = useMemo(() => {
    const todayStart = startOfToday();
    const weekEnd = endOfDay(addDays(todayStart, 6));

    return tasks
      .filter((task) => {
        const status = getEffectiveStatus(task);
        const date = getSafeTaskDate(task);
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || task.type === typeFilter;
        const isDone = status === 'done';
        const overdue = status === 'overdue';
        const today = !isDone && isToday(date);
        const thisWeek = !isDone && isWithinInterval(date, { start: todayStart, end: weekEnd });

        const matchesView =
          viewMode === 'active'
            ? !isDone
            : viewMode === 'today'
              ? today
              : viewMode === 'week'
                ? thisWeek
                : viewMode === 'overdue'
                  ? overdue
                  : isDone;

        return matchesSearch && matchesType && matchesView;
      })
      .sort((a, b) => getSafeTaskDate(a).getTime() - getSafeTaskDate(b).getTime());
  }, [searchQuery, tasks, typeFilter, viewMode]);

  const groupedTasks = useMemo(() => {
    return filteredTasks.reduce<Record<string, TaskRecord[]>>((acc, task) => {
      const dateKey = parseTaskDate(task.date) ? task.date : '__missing_date__';
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(task);
      return acc;
    }, {});
  }, [filteredTasks]);

  const sortedDates = Object.keys(groupedTasks).sort();

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
              <Sparkles className="h-3.5 w-3.5" /> Egzekucja dnia
            </div>
            <h1 className="text-3xl font-bold app-text">Zadania</h1>
          </div>
          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-2xl px-5 font-semibold"><Plus className="mr-2 h-4 w-4" /> Nowe zadanie</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj zadanie</DialogTitle>
                <DialogDescription>
                  Dodaj termin i priorytet zadania. Pola cykliczności są dostępne poniżej.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Tytuł</Label>
                  <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                </div>
                {isSupabaseConfigured() ? (
                    <LeadPicker
                      leads={leads}
                      selectedLeadId={newTask.leadId || undefined}
                      query={newTask.leadSearch}
                      onQueryChange={(value) => setNewTask({ ...newTask, leadSearch: value, leadId: '' })}
                      onSelect={(lead) => setNewTask({ ...newTask, leadId: lead?.id || '', leadSearch: lead?.name || '' })}
                      label="Następny krok dla leada"
                    />
                ) : null}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Typ</Label>
                    <select
                      value={newTask.type}
                      onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                      className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                    >
                      {TASK_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input type="date" value={newTask.date} onChange={(e) => setNewTask({ ...newTask, date: e.target.value })} required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Priorytet</Label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="low">Niski</option>
                      <option value="medium">Średni</option>
                      <option value="high">Wysoki</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Przypomnienie</Label>
                    <Input type="datetime-local" value={newTask.reminderAt} onChange={(e) => setNewTask({ ...newTask, reminderAt: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Cykliczność</Label>
                    <select
                      value={newTask.recurrenceRule}
                      onChange={(e) => setNewTask({ ...newTask, recurrenceRule: e.target.value as RecurrenceRule })}
                      className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                    >
                      {RECURRENCE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Koniec cyklu</Label>
                    <select
                      value={newTask.recurrenceEndType}
                      onChange={(e) => setNewTask({ ...newTask, recurrenceEndType: e.target.value as RecurrenceEndType })}
                      className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                    >
                        <option value="never">Bez końca</option>
                        <option value="until_date">Do daty</option>
                        <option value="count">Liczba razy</option>
                      </select>
                  </div>
                </div>
                {newTask.recurrenceEndType === 'until_date' ? (
                  <div className="space-y-2">
                    <Label>Data końcowa</Label>
                    <Input type="date" value={newTask.recurrenceEndAt} onChange={(e) => setNewTask({ ...newTask, recurrenceEndAt: e.target.value })} />
                  </div>
                ) : null}
                {newTask.recurrenceEndType === 'count' ? (
                  <div className="space-y-2">
                    <Label>Liczba powtórzeń</Label>
                    <Input type="number" min="1" value={newTask.recurrenceCount} onChange={(e) => setNewTask({ ...newTask, recurrenceCount: e.target.value })} />
                  </div>
                ) : null}
                <DialogFooter><Button type="submit">Dodaj zadanie</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { key: 'active', label: 'Aktywne', value: counts.active, icon: ListTodo },
            { key: 'today', label: 'Dziś', value: counts.today, icon: Clock },
            { key: 'week', label: 'Tydzień', value: counts.week, icon: Calendar },
            { key: 'overdue', label: 'Zaległe', value: counts.overdue, icon: AlertTriangle },
            { key: 'done', label: 'Zrobione', value: counts.done, icon: CheckSquare },
          ].map((stat) => (
            <Card key={stat.key} className="border-none">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] app-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold app-text">{stat.value}</p>
                </div>
                <div className="rounded-2xl p-3 app-primary-chip"><stat.icon className="h-5 w-5" /></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
                <Input className="h-11 pl-10" placeholder="Szukaj zadania..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-11 w-full sm:w-[220px]"><SelectValue placeholder="Typ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  {TASK_TYPES.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl p-2 md:grid-cols-5">
                <TabsTrigger value="active" className="min-h-10 rounded-xl">Aktywne</TabsTrigger>
                <TabsTrigger value="today" className="min-h-10 rounded-xl">Dziś</TabsTrigger>
                <TabsTrigger value="week" className="min-h-10 rounded-xl">Ten tydzień</TabsTrigger>
                <TabsTrigger value="overdue" className="min-h-10 rounded-xl">Zaległe</TabsTrigger>
                <TabsTrigger value="done" className="min-h-10 rounded-xl">Zrobione</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="mb-4 h-8 w-8 animate-spin" style={{ color: 'var(--app-primary)' }} />
              <p className="app-muted">Ładowanie zadań...</p>
            </div>
          ) : sortedDates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-sm app-muted">Brak zadań w tym widoku.</CardContent>
            </Card>
          ) : (
            sortedDates.map((dateKey) => {
              const dateObj = parseTaskDate(dateKey);
              const dateLabel = dateObj ? getDateLabel(dateObj) : 'Bez poprawnej daty';
              return (
                <section key={dateKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 app-muted" />
                    <h2 className="text-sm font-bold uppercase tracking-[0.18em] app-muted">{dateLabel}</h2>
                    <Badge variant="outline" className="rounded-full">{groupedTasks[dateKey].length}</Badge>
                  </div>
                  <div className="grid gap-3">
                    {groupedTasks[dateKey].map((task) => {
                      const status = getEffectiveStatus(task);
                      const isDone = status === 'done';
                      const taskDate = parseTaskDate(task.date);
                      return (
                        <Card key={task.id} className={isDone ? 'opacity-70' : undefined}>
                          <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 items-start gap-4">
                              <button
                                onClick={() => toggleTask(task)}
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${isDone ? 'app-button-primary' : 'app-button-outline'}`}
                                aria-label={isDone ? 'Przywróć do aktywnych' : 'Oznacz jako zrobione'}
                              >
                                {isDone ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                              </button>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className={`font-semibold app-text ${isDone ? 'line-through opacity-80' : ''}`}>{task.title}</p>
                                  {status === 'overdue' ? <Badge variant="destructive">Zaległe</Badge> : null}
                                  {status === 'postponed' ? <Badge variant="outline">Odłożone</Badge> : null}
                                  {taskDate && isToday(taskDate) && !isDone ? <Badge variant="secondary">Dziś</Badge> : null}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs app-muted">
                                  <Badge variant="outline">{TASK_TYPES.find((item) => item.value === task.type)?.label || 'Inne'}</Badge>
                                  {getLeadLabel(task, leads) ? <span>Lead: {getLeadLabel(task, leads)}</span> : null}
                                  <span>{taskDate ? format(taskDate, 'd MMMM yyyy', { locale: pl }) : 'Brak poprawnej daty'}</span>
                                  {task.reminderAt && parseTaskDate(task.reminderAt) ? <span>Przypomnienie: {format(parseTaskDate(task.reminderAt) as Date, 'd MMM, HH:mm', { locale: pl })}</span> : null}
                                  {task.recurrenceRule && task.recurrenceRule !== 'none' ? <span>Cyklicznie: {RECURRENCE_OPTIONS.find((item) => item.value === task.recurrenceRule)?.label}</span> : null}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {task.clientId ? <Link to={`/clients/${task.clientId}`}><Button variant="outline" className="rounded-xl px-3 text-xs">Klient</Button></Link> : null}
                              {task.caseId ? <Link to={`/case/${task.caseId}`}><Button variant="outline" className="rounded-xl px-3 text-xs">Sprawa</Button></Link> : null}
                              {task.leadId && !task.caseId ? <Link to={`/leads/${task.leadId}`}><Button variant="outline" className="rounded-xl px-3 text-xs">Lead</Button></Link> : null}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => toggleTask(task)}>{isDone ? 'Przywróć do aktywnych' : 'Oznacz jako zrobione'}</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => snoozeTask(task, 'plus_1h')}>Odłóż +1h</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => snoozeTask(task, 'tomorrow')}>Odłóż na jutro</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => snoozeTask(task, 'plus_2d')}>Odłóż +2 dni</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => snoozeTask(task, 'next_week')}>Odłóż na przyszły tydzień</DropdownMenuItem>
                                  <DropdownMenuItem className="text-rose-500" onClick={() => deleteTask(task.id)}><Trash2 className="mr-2 h-4 w-4" /> Usuń</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}





