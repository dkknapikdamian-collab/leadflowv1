import { useEffect, useMemo, useState, FormEvent } from 'react';
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
  deleteDoc,
} from 'firebase/firestore';
import { useWorkspace } from '../hooks/useWorkspace';
import Layout from '../components/Layout';
import AccessLockNotice from '../components/access-lock-notice';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  CheckSquare,
  Square,
  Clock,
  AlertTriangle,
  Search,
  MoreVertical,
  Trash2,
  Calendar,
  Loader2,
  Sparkles,
  ListTodo,
} from 'lucide-react';
import {
  format,
  isToday,
  isPast,
  parseISO,
  isTomorrow,
  addDays,
  isWithinInterval,
  startOfToday,
  endOfDay,
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import { getWriteLockMessage } from '../lib/access';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Link } from 'react-router-dom';

const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'phone', label: 'Telefon' },
  { value: 'reply', label: 'Odpisać' },
  { value: 'send_offer', label: 'Wysłać ofertę' },
  { value: 'meeting', label: 'Spotkanie' },
  { value: 'other', label: 'Inne' },
] as const;

type TaskRecord = {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'todo' | 'done';
  priority?: 'low' | 'medium' | 'high';
  leadId?: string;
  leadName?: string;
  nextStep?: string;
};

type LeadOption = {
  id: string;
  name?: string;
  status?: string;
};

type ViewMode = 'active' | 'today' | 'week' | 'overdue' | 'done';
type LeadFilter = 'all' | 'with_lead' | 'without_lead';

function getDateLabel(date: Date) {
  if (isToday(date)) return 'Dzisiaj';
  if (isTomorrow(date)) return 'Jutro';
  return format(date, 'EEEE, d MMMM', { locale: pl });
}

function getTaskTone(task: TaskRecord) {
  const date = parseISO(task.date);
  if (task.status === 'done') return 'done';
  if (isPast(date) && !isToday(date)) return 'overdue';
  if (isToday(date)) return 'today';
  return 'default';
}

export default function Tasks() {
  const { workspace, hasAccess, hasWriteAccess } = useWorkspace();
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [leadOptions, setLeadOptions] = useState<LeadOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [leadFilter, setLeadFilter] = useState<LeadFilter>('all');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'follow_up',
    date: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    leadId: 'none',
  });

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    const q = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('date', 'asc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<TaskRecord, 'id'>) })));
      setLoading(false);
    });

    const leadsQuery = query(
      collection(db, 'leads'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      setLeadOptions(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<LeadOption, 'id'>) })));
    });

    return () => {
      unsubscribe();
      unsubscribeLeads();
    };
  }, [workspace]);

  const counts = useMemo(() => {
    const todayStart = startOfToday();
    const weekEnd = endOfDay(addDays(todayStart, 6));

    return tasks.reduce(
      (acc, task) => {
        const date = parseISO(task.date);
        const isDone = task.status === 'done';
        const overdue = !isDone && isPast(date) && !isToday(date);
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
    if (!hasAccess) return toast.error(getWriteLockMessage(workspace));
    if (!newTask.title.trim()) return toast.error('Wpisz tytuł zadania');

    try {
      const linkedLead = newTask.leadId !== 'none' ? leadOptions.find((lead) => lead.id === newTask.leadId) : null;

      await addDoc(collection(db, 'tasks'), {
        ...newTask,
        leadId: linkedLead?.id || null,
        leadName: linkedLead?.name || null,
        status: 'todo',
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Zadanie dodane');
      setIsNewTaskOpen(false);
      setNewTask({
        title: '',
        type: 'follow_up',
        date: format(new Date(), 'yyyy-MM-dd'),
        priority: 'medium',
        leadId: 'none',
      });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    if (!hasWriteAccess) {
      toast.error(getWriteLockMessage(workspace));
      return;
    }
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: currentStatus === 'todo' ? 'done' : 'todo',
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!hasWriteAccess) {
      toast.error(getWriteLockMessage(workspace));
      return;
    }
    if (!window.confirm('Usunąć zadanie?')) return;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      toast.success('Zadanie usunięte');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const filteredTasks = useMemo(() => {
    const todayStart = startOfToday();
    const weekEnd = endOfDay(addDays(todayStart, 6));

    return tasks
      .filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || task.type === typeFilter;
        const date = parseISO(task.date);
        const isDone = task.status === 'done';
        const overdue = !isDone && isPast(date) && !isToday(date);
        const today = !isDone && isToday(date);
        const thisWeek = !isDone && isWithinInterval(date, { start: todayStart, end: weekEnd });

        const matchesLead =
          leadFilter === 'all'
            ? true
            : leadFilter === 'with_lead'
              ? Boolean(task.leadId)
              : !task.leadId;

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

        return matchesSearch && matchesType && matchesLead && matchesView;
      })
      .sort((a, b) => {
        const aDate = parseISO(a.date);
        const bDate = parseISO(b.date);
        const aDone = a.status === 'done';
        const bDone = b.status === 'done';

        if (aDone !== bDone) return aDone ? 1 : -1;
        const aOverdue = !aDone && isPast(aDate) && !isToday(aDate);
        const bOverdue = !bDone && isPast(bDate) && !isToday(bDate);
        if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
        const aToday = !aDone && isToday(aDate);
        const bToday = !bDone && isToday(bDate);
        if (aToday !== bToday) return aToday ? -1 : 1;
        return aDate.getTime() - bDate.getTime();
      });
  }, [leadFilter, searchQuery, tasks, typeFilter, viewMode]);

  const groupedTasks = useMemo(() => {
    return filteredTasks.reduce<Record<string, TaskRecord[]>>((acc, task) => {
      const key = task.date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
  }, [filteredTasks]);

  const sortedDates = Object.keys(groupedTasks).sort();

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
        <AccessLockNotice workspace={workspace} />
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
              <Sparkles className="h-3.5 w-3.5" /> Egzekucja dnia
            </div>
            <div>
              <h1 className="text-3xl font-bold app-text">Zadania</h1>
              <p className="max-w-2xl text-sm md:text-base app-muted">
                Tu masz cały aktywny ruch. Najpierw zaległe, potem dziś, potem reszta tygodnia.
              </p>
            </div>
          </div>

          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-2xl px-5 font-semibold" disabled={!hasWriteAccess}>
                <Plus className="mr-2 h-4 w-4" /> Nowe zadanie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj zadanie</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Tytuł zadania</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Np. Odpisać po ofercie"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Typ</Label>
                    <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                      <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TASK_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={newTask.date}
                      onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Priorytet</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niski</SelectItem>
                      <SelectItem value="medium">Średni</SelectItem>
                      <SelectItem value="high">Wysoki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Powiąż z leadem</Label>
                  <Select value={newTask.leadId} onValueChange={(value) => setNewTask({ ...newTask, leadId: value })}>
                    <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Bez leada" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Bez leada</SelectItem>
                      {leadOptions.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>{lead.name || 'Lead bez nazwy'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto" disabled={!hasWriteAccess}>Dodaj zadanie</Button>
                </DialogFooter>
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
                <div className="rounded-2xl p-3 app-primary-chip">
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
                <Input
                  placeholder="Szukaj zadania..."
                  className="h-11 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-11 w-full sm:w-[220px]"><SelectValue placeholder="Typ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie typy</SelectItem>
                    {TASK_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={leadFilter} onValueChange={(value) => setLeadFilter(value as LeadFilter)}>
                  <SelectTrigger className="h-11 w-full sm:w-[220px]"><SelectValue placeholder="Powiązanie" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie zadania</SelectItem>
                    <SelectItem value="with_lead">Tylko z leadem</SelectItem>
                    <SelectItem value="without_lead">Bez leada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full p-4 app-primary-chip">
                  <CheckSquare className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold app-text">Brak zadań w tym widoku</h3>
                <p className="mt-2 max-w-sm text-sm app-muted">
                  Wszystko wygląda czysto. Dodaj nowe zadanie albo zmień filtr, jeśli szukasz czegoś konkretnego.
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedDates.map((dateKey) => {
              const dateObj = parseISO(dateKey);
              const isOverdueGroup = isPast(dateObj) && !isToday(dateObj);
              const dateLabel = getDateLabel(dateObj);

              return (
                <section key={dateKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {isOverdueGroup ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : <Calendar className="h-4 w-4 app-muted" />}
                    <h2 className={`text-sm font-bold uppercase tracking-[0.18em] ${isOverdueGroup ? 'text-rose-500' : 'app-muted'}`}>
                      {dateLabel}
                    </h2>
                    <Badge variant="outline" className="rounded-full">{groupedTasks[dateKey].length}</Badge>
                  </div>

                  <div className="grid gap-3">
                    {groupedTasks[dateKey].map((task) => {
                      const tone = getTaskTone(task);
                      const typeLabel = TASK_TYPES.find((item) => item.value === task.type)?.label ?? 'Inne';

                      return (
                        <Card key={task.id} className={task.status === 'done' ? 'opacity-70' : undefined}>
                          <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 items-start gap-4">
                              <button
                                onClick={() => toggleTask(task.id, task.status)}
                                disabled={!hasWriteAccess}
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                  task.status === 'done'
                                    ? 'app-button-primary'
                                    : tone === 'overdue'
                                      ? 'border-rose-500/40 text-rose-500 hover:bg-rose-500/10'
                                      : 'app-button-outline'
                                }`}
                                aria-label={task.status === 'done' ? 'Oznacz jako do zrobienia' : 'Oznacz jako zrobione'}
                              >
                                {task.status === 'done' ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className={`font-semibold app-text ${task.status === 'done' ? 'line-through opacity-80' : ''}`}>{task.title}</p>
                                  {tone === 'overdue' ? <Badge variant="destructive">Zaległe</Badge> : null}
                                  {tone === 'today' ? <Badge variant="secondary">Dziś</Badge> : null}
                                  {task.priority === 'high' ? <Badge variant="destructive">Wysoki priorytet</Badge> : null}
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs app-muted">
                                  <Badge variant="outline">{typeLabel}</Badge>
                                  <span>{format(dateObj, 'd MMMM yyyy', { locale: pl })}</span>
                                  {task.leadName ? <span>Lead: {task.leadName}</span> : null}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 md:justify-end">
                              <div className="text-xs app-muted">
                                {tone === 'overdue'
                                  ? 'Najpierw rusz to zadanie'
                                  : tone === 'today'
                                    ? 'Dobre do zamknięcia dziś'
                                    : task.status === 'done'
                                      ? 'Zamknięte'
                                      : 'Zaplanowane'}
                              </div>
                              <div className="flex items-center gap-2">
                                {task.leadId ? (
                                  <Button variant="outline" size="sm" asChild>
                                    <Link to={`/leads/${task.leadId}`}>Lead</Link>
                                  </Button>
                                ) : null}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-xl">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => toggleTask(task.id, task.status)}>
                                      {task.status === 'done' ? <Square className="mr-2 h-4 w-4" /> : <CheckSquare className="mr-2 h-4 w-4" />}
                                      {task.status === 'done' ? 'Przywróć do aktywnych' : 'Oznacz jako zrobione'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-rose-500">
                                      <Trash2 className="mr-2 h-4 w-4" /> Usuń
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
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
