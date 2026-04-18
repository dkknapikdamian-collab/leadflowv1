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
  deleteDoc,
} from 'firebase/firestore';
import { useWorkspace } from '../hooks/useWorkspace';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  CheckSquare,
  Clock,
  AlertTriangle,
  Search,
  MoreVertical,
  Trash2,
  Loader2,
  X,
  Bell,
  Repeat,
} from 'lucide-react';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
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
import {
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
  PRIORITY_OPTIONS,
  RECURRENCE_OPTIONS,
  REMINDER_MODE_OPTIONS,
  TASK_TYPES,
} from '../lib/options';

export default function Tasks() {
  const { workspace, hasAccess } = useWorkspace();
  const [tasks, setTasks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todo');
  const [typeFilter, setTypeFilter] = useState('all');

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
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

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('date', 'asc'),
      orderBy('createdAt', 'desc')
    );

    const leadsQuery = query(
      collection(db, 'leads'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      setTasks(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      setLoading(false);
    });

    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      setLeads(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });

    return () => {
      unsubscribeTasks();
      unsubscribeLeads();
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

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!newTask.title.trim()) return toast.error('Wpisz tytuł zadania');

    const selectedLead = leads.find((lead) => lead.id === newTask.leadId);
    const payload = syncTaskDerivedFields({
      ...newTask,
      leadId: selectedLead?.id ?? null,
      leadName: selectedLead?.name ?? '',
      recurrence: normalizeRecurrenceConfig(newTask.recurrence),
      reminder: normalizeReminderConfig(newTask.reminder),
    });

    try {
      await addDoc(collection(db, 'tasks'), {
        ...payload,
        status: 'todo',
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Zadanie dodane');
      setIsNewTaskOpen(false);
      resetNewTask();
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
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
    if (!window.confirm('Usunąć zadanie?')) return;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      toast.success('Zadanie usunięte');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const groupedTasks = filteredTasks.reduce<Record<string, any[]>>((acc, task) => {
    const date = getTaskDate(task);
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedTasks).sort();

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Zadania</h1>
            <p className="text-slate-500">Zarządzaj codzienną egzekucją i powtarzalnymi ruchami.</p>
          </div>
          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> Nowe zadanie
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Dodaj zadanie</DialogTitle></DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tytuł zadania</Label>
                    <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TASK_TYPES.map((taskType) => (
                            <SelectItem key={taskType.value} value={taskType.value}>{taskType.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Lead</Label>
                      <Select value={newTask.leadId} onValueChange={(value) => setNewTask({ ...newTask, leadId: value })}>
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
                  <div className="space-y-2">
                    <Label>Priorytet</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Termin</p>
                    <p className="text-xs text-slate-500">Najpierw ustaw konkretny moment wykonania zadania.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Data i godzina</Label>
                    <Input
                      type="datetime-local"
                      value={newTask.dueAt}
                      onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Cykliczność</p>
                    <p className="text-xs text-slate-500">Możesz zostawić brak albo ustawić powtarzanie.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Powtarzanie</Label>
                      <Select
                        value={newTask.recurrence.mode}
                        onValueChange={(value) => setNewTask({
                          ...newTask,
                          recurrence: {
                            ...newTask.recurrence,
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
                        value={newTask.recurrence.interval}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          recurrence: {
                            ...newTask.recurrence,
                            interval: Math.max(1, Number(e.target.value) || 1),
                          },
                        })}
                        disabled={newTask.recurrence.mode === 'none'}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Powtarzaj do</Label>
                    <Input
                      type="date"
                      value={newTask.recurrence.until ?? ''}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        recurrence: {
                          ...newTask.recurrence,
                          until: e.target.value || null,
                        },
                      })}
                      disabled={newTask.recurrence.mode === 'none'}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Przypomnienia</p>
                    <p className="text-xs text-slate-500">Ustaw jednorazowe lub cykliczne przypominanie.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tryb</Label>
                      <Select
                        value={newTask.reminder.mode}
                        onValueChange={(value) => setNewTask({
                          ...newTask,
                          reminder: {
                            ...newTask.reminder,
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
                        value={newTask.reminder.minutesBefore}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          reminder: {
                            ...newTask.reminder,
                            minutesBefore: Math.max(0, Number(e.target.value) || 0),
                          },
                        })}
                        disabled={newTask.reminder.mode === 'none'}
                      />
                    </div>
                  </div>
                  {newTask.reminder.mode === 'recurring' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Cykliczność przypomnienia</Label>
                        <Select
                          value={newTask.reminder.recurrenceMode}
                          onValueChange={(value) => setNewTask({
                            ...newTask,
                            reminder: {
                              ...newTask.reminder,
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
                          value={newTask.reminder.recurrenceInterval}
                          onChange={(e) => setNewTask({
                            ...newTask,
                            reminder: {
                              ...newTask.reminder,
                              recurrenceInterval: Math.max(1, Number(e.target.value) || 1),
                            },
                          })}
                        />
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
        </header>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Szukaj zadania..."
                className="pl-10 rounded-xl bg-slate-50 border-none h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="todo">Do zrobienia</SelectItem>
                  <SelectItem value="done">Zrobione</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  {TASK_TYPES.map((taskType) => (
                    <SelectItem key={taskType.value} value={taskType.value}>{taskType.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(statusFilter !== 'todo' || typeFilter !== 'all' || searchQuery) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStatusFilter('todo');
                    setTypeFilter('all');
                    setSearchQuery('');
                  }}
                  className="h-11 rounded-xl"
                >
                  <X className="w-4 h-4 mr-2" /> Wyczyść
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-slate-500">Ładowanie zadań...</p>
            </div>
          ) : sortedDates.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Brak zadań</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-1">Dodaj pierwsze zadanie albo zmień filtry.</p>
            </div>
          ) : (
            sortedDates.map((dateKey) => {
              const tasksForDate = groupedTasks[dateKey].sort((a, b) => {
                return parseISO(getTaskStartAt(a) ?? `${getTaskDate(a)}T09:00`).getTime() - parseISO(getTaskStartAt(b) ?? `${getTaskDate(b)}T09:00`).getTime();
              });

              return (
                <section key={dateKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{format(parseISO(dateKey), 'EEEE, d MMMM', { locale: pl })}</h2>
                    {isToday(parseISO(dateKey)) && <Badge className="rounded-full">Dziś</Badge>}
                    {isTomorrow(parseISO(dateKey)) && <Badge variant="secondary" className="rounded-full">Jutro</Badge>}
                  </div>
                  <div className="space-y-3">
                    {tasksForDate.map((task: any) => {
                      const taskStart = getTaskStartAt(task) ?? `${getTaskDate(task)}T09:00`;
                      const overdue = task.status !== 'done' && isPast(parseISO(taskStart)) && !isToday(parseISO(taskStart));
                      const recurrence = normalizeRecurrenceConfig(task.recurrence);
                      const reminder = normalizeReminderConfig(task.reminder);

                      return (
                        <Card key={task.id} className={`border-none shadow-sm group transition-all ${task.status === 'done' ? 'opacity-60' : ''}`}>
                          <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <button
                                onClick={() => toggleTask(task.id, task.status)}
                                className={`w-5 h-5 rounded border flex items-center justify-center ${task.status === 'done' ? 'bg-primary border-primary text-white' : 'border-slate-200 hover:border-primary'}`}
                              >
                                {task.status === 'done' && <CheckSquare className="w-4 h-4" />}
                              </button>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <p className={`font-bold text-slate-900 ${task.status === 'done' ? 'line-through' : ''}`}>{task.title}</p>
                                  <Badge variant="secondary" className="text-[10px] uppercase font-bold h-5">{TASK_TYPES.find((item) => item.value === task.type)?.label ?? 'Zadanie'}</Badge>
                                  {task.priority === 'high' && <Badge variant="destructive" className="text-[10px] uppercase font-bold h-5">Wysoki</Badge>}
                                  {overdue && <Badge variant="destructive" className="text-[10px] uppercase font-bold h-5">Zaległe</Badge>}
                                  {recurrence.mode !== 'none' && <Badge variant="outline" className="text-[10px] uppercase font-bold h-5"><Repeat className="w-3 h-3 mr-1" /> {RECURRENCE_OPTIONS.find((item) => item.value === recurrence.mode)?.label}</Badge>}
                                  {reminder.mode !== 'none' && <Badge variant="outline" className="text-[10px] uppercase font-bold h-5"><Bell className="w-3 h-3 mr-1" /> {reminder.mode === 'recurring' ? 'Cykliczne przypomnienie' : 'Przypomnienie'}</Badge>}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {format(parseISO(taskStart), 'HH:mm')}</span>
                                  {task.leadName && <span>Lead: {task.leadName}</span>}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toggleTask(task.id, task.status)}>
                                  <CheckSquare className="w-4 h-4 mr-2" /> {task.status === 'todo' ? 'Oznacz jako zrobione' : 'Przywróć do zrobienia'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-rose-600">
                                  <Trash2 className="w-4 h-4 mr-2" /> Usuń
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
