import { useState, useEffect, FormEvent } from 'react';
import { auth } from '../firebase';
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
  Link2,
  ListTodo,
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
  toReminderAtIso,
  toDateTimeLocalValue,
} from '../lib/scheduling';
import {
  PRIORITY_OPTIONS,
  RECURRENCE_OPTIONS,
  REMINDER_OFFSET_OPTIONS,
  REMINDER_MODE_OPTIONS,
  TASK_TYPES,
} from '../lib/options';
import {
  deleteTaskFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  insertActivityToSupabase,
  insertTaskToSupabase,
  updateTaskInSupabase,
} from '../lib/supabase-fallback';

const modalSelectClass = 'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

export default function Tasks() {
  const { workspace, hasAccess } = useWorkspace();
  const [tasks, setTasks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todo');
  const [typeFilter, setTypeFilter] = useState('all');
  const [linkFilter, setLinkFilter] = useState('all');

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
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
  const [editTask, setEditTask] = useState<any | null>(null);

  const registerReminderScheduled = async ({
    title,
    scheduledAt,
    reminderAt,
  }: {
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
          entityType: 'task',
          title,
          scheduledAt,
          reminderAt,
          source: 'tasks',
        },
      });
    } catch (error) {
      console.warn('REMINDER_ACTIVITY_WRITE_FAILED', error);
    }
  };

  async function refreshSupabaseData() {
    const [taskRows, leadRows] = await Promise.all([
      fetchTasksFromSupabase(),
      fetchLeadsFromSupabase(),
    ]);

    setTasks(taskRows as any[]);
    setLeads(leadRows as any[]);
  }

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        const [taskRows, leadRows] = await Promise.all([
          fetchTasksFromSupabase(),
          fetchLeadsFromSupabase(),
        ]);

        if (cancelled) return;
        setTasks(taskRows as any[]);
        setLeads(leadRows as any[]);
      } catch (error: any) {
        if (!cancelled) {
          toast.error(`Błąd odczytu zadań: ${error.message}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
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

  const openEditTask = (task: any) => {
    setEditTask({
      id: task.id,
      title: task.title || '',
      type: task.type || 'follow_up',
      dueAt: getTaskStartAt(task) || `${getTaskDate(task)}T09:00`,
      priority: task.priority || 'medium',
      leadId: task.leadId || 'none',
      recurrence: normalizeRecurrenceConfig(task.recurrence),
      reminder: normalizeReminderConfig(task.reminder),
      status: task.status || 'todo',
    });
    setIsEditTaskOpen(true);
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
      const reminderAt = toReminderAtIso(payload.dueAt, payload.reminder);
      await insertTaskToSupabase({
        title: newTask.title,
        type: newTask.type,
        date: newTask.dueAt.slice(0, 10),
        scheduledAt: newTask.dueAt,
        priority: newTask.priority,
        leadId: selectedLead?.id ?? null,
        reminderAt,
        recurrenceRule: payload.recurrence?.mode ?? 'none',
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
      });
      await registerReminderScheduled({
        title: newTask.title,
        scheduledAt: newTask.dueAt,
        reminderAt,
      });
      await refreshSupabaseData();

      toast.success('Zadanie dodane');
      setIsNewTaskOpen(false);
      resetNewTask();
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    try {
      const task = tasks.find((entry) => entry.id === taskId);
      await updateTaskInSupabase({
        id: taskId,
        title: task?.title,
        type: task?.type,
        date: task?.date,
        status: currentStatus === 'todo' ? 'done' : 'todo',
        priority: task?.priority,
        leadId: task?.leadId ?? null,
      });
      await refreshSupabaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Usunąć zadanie?')) return;
    try {
      await deleteTaskFromSupabase(taskId);
      await refreshSupabaseData();
      toast.success('Zadanie usunięte');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleSaveTaskEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!editTask?.id) return;
    if (!editTask.title?.trim()) return toast.error('Wpisz tytuł zadania');

    const selectedLead = leads.find((lead) => lead.id === editTask.leadId);
    const payload = syncTaskDerivedFields({
      ...editTask,
      leadId: selectedLead?.id ?? null,
      leadName: selectedLead?.name ?? '',
      recurrence: normalizeRecurrenceConfig(editTask.recurrence),
      reminder: normalizeReminderConfig(editTask.reminder),
    });

    try {
      const reminderAt = toReminderAtIso(payload.dueAt, payload.reminder);
      await updateTaskInSupabase({
        id: editTask.id,
        title: payload.title,
        type: payload.type,
        status: payload.status,
        priority: payload.priority,
        date: payload.date,
        scheduledAt: payload.dueAt,
        leadId: payload.leadId ?? null,
        reminderAt,
        recurrenceRule: payload.recurrence?.mode ?? 'none',
      });
      await registerReminderScheduled({
        title: payload.title,
        scheduledAt: payload.dueAt,
        reminderAt,
      });
      await refreshSupabaseData();

      toast.success('Zadanie zaktualizowane');
      setIsEditTaskOpen(false);
      setEditTask(null);
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const taskTitle = String(task.title || '').toLowerCase();
    const matchesSearch = taskTitle.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    const hasLead = Boolean(task.leadId || task.leadName);
    const matchesLink =
      linkFilter === 'all'
      || (linkFilter === 'with-lead' && hasLead)
      || (linkFilter === 'without-lead' && !hasLead);

    return matchesSearch && matchesStatus && matchesType && matchesLink;
  });

  const groupedTasks = filteredTasks.reduce<Record<string, any[]>>((acc, task) => {
    const date = getTaskDate(task);
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedTasks).sort();

  const taskStats = {
    active: tasks.filter((task) => task.status !== 'done').length,
    today: tasks.filter((task) => {
      const taskStart = getTaskStartAt(task) || `${getTaskDate(task)}T09:00`;
      return task.status !== 'done' && isToday(parseISO(taskStart));
    }).length,
    overdue: tasks.filter((task) => {
      const taskStart = getTaskStartAt(task) || `${getTaskDate(task)}T09:00`;
      return task.status !== 'done' && isPast(parseISO(taskStart)) && !isToday(parseISO(taskStart));
    }).length,
    withoutLead: tasks.filter((task) => !task.leadId && !task.leadName).length,
  };

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
                      <select
                        className={modalSelectClass}
                        value={newTask.recurrence.mode}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          recurrence: {
                            ...newTask.recurrence,
                            mode: e.target.value as any,
                          },
                        })}
                      >
                        {RECURRENCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
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
                      value={newTask.recurrence.until || ''}
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
                      <select
                        className={modalSelectClass}
                        value={newTask.reminder.mode}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          reminder: {
                            ...newTask.reminder,
                            mode: e.target.value as any,
                          },
                        })}
                      >
                        {REMINDER_MODE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Kiedy przypomnieć</Label>
                      <select
                        className={modalSelectClass}
                        value={newTask.reminder.minutesBefore}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          reminder: {
                            ...newTask.reminder,
                            minutesBefore: Number(e.target.value),
                          },
                        })}
                        disabled={newTask.reminder.mode === 'none'}
                      >
                        {REMINDER_OFFSET_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {newTask.reminder.mode === 'recurring' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Cykliczność przypomnienia</Label>
                        <select
                          className={modalSelectClass}
                          value={newTask.reminder.recurrenceMode}
                          onChange={(e) => setNewTask({
                            ...newTask,
                            reminder: {
                              ...newTask.reminder,
                              recurrenceMode: e.target.value as any,
                            },
                          })}
                        >
                          {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
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
          <Dialog open={isEditTaskOpen} onOpenChange={(open) => {
            setIsEditTaskOpen(open);
            if (!open) setEditTask(null);
          }}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Edytuj zadanie</DialogTitle></DialogHeader>
              {editTask ? (
                <form onSubmit={handleSaveTaskEdit} className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tytuł zadania</Label>
                      <Input value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Typ</Label>
                        <select
                          className={modalSelectClass}
                          value={editTask.type}
                          onChange={(e) => setEditTask({ ...editTask, type: e.target.value })}
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
                          value={editTask.leadId}
                          onChange={(e) => setEditTask({ ...editTask, leadId: e.target.value })}
                        >
                          <option value="none">Bez leada</option>
                          {leads.map((lead) => (
                            <option key={lead.id} value={lead.id}>{lead.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Priorytet</Label>
                      <select
                        className={modalSelectClass}
                        value={editTask.priority}
                        onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                      >
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Data i godzina</Label>
                      <Input
                        type="datetime-local"
                        value={editTask.dueAt}
                        onChange={(e) => setEditTask({ ...editTask, dueAt: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Powtarzanie</Label>
                        <select
                          className={modalSelectClass}
                          value={editTask.recurrence.mode}
                          onChange={(e) => setEditTask({
                            ...editTask,
                            recurrence: {
                              ...editTask.recurrence,
                              mode: e.target.value as any,
                            },
                          })}
                        >
                          {RECURRENCE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Co ile</Label>
                        <Input
                          type="number"
                          min="1"
                          value={editTask.recurrence.interval}
                          onChange={(e) => setEditTask({
                            ...editTask,
                            recurrence: {
                              ...editTask.recurrence,
                              interval: Math.max(1, Number(e.target.value) || 1),
                            },
                          })}
                          disabled={editTask.recurrence.mode === 'none'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tryb przypomnienia</Label>
                        <select
                          className={modalSelectClass}
                          value={editTask.reminder.mode}
                          onChange={(e) => setEditTask({
                            ...editTask,
                            reminder: {
                              ...editTask.reminder,
                              mode: e.target.value as any,
                            },
                          })}
                        >
                          {REMINDER_MODE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Kiedy przypomnieć</Label>
                        <select
                          className={modalSelectClass}
                          value={editTask.reminder.minutesBefore}
                          onChange={(e) => setEditTask({
                            ...editTask,
                            reminder: {
                              ...editTask.reminder,
                              minutesBefore: Number(e.target.value),
                            },
                          })}
                          disabled={editTask.reminder.mode === 'none'}
                        >
                          {REMINDER_OFFSET_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {editTask.reminder.mode === 'recurring' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Cykliczność przypomnienia</Label>
                          <select
                            className={modalSelectClass}
                            value={editTask.reminder.recurrenceMode}
                            onChange={(e) => setEditTask({
                              ...editTask,
                              reminder: {
                                ...editTask.reminder,
                                recurrenceMode: e.target.value as any,
                              },
                            })}
                          >
                            {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Co ile</Label>
                          <Input
                            type="number"
                            min="1"
                            value={editTask.reminder.recurrenceInterval}
                            onChange={(e) => setEditTask({
                              ...editTask,
                              reminder: {
                                ...editTask.reminder,
                                recurrenceInterval: Math.max(1, Number(e.target.value) || 1),
                              },
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="w-full">Zapisz zmiany</Button>
                  </DialogFooter>
                </form>
              ) : null}
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktywne</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{taskStats.active}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                <ListTodo className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Na dziś</p>
                <p className="mt-2 text-2xl font-bold text-blue-600">{taskStats.today}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-500">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zaległe</p>
                <p className="mt-2 text-2xl font-bold text-rose-600">{taskStats.overdue}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bez leada</p>
                <p className="mt-2 text-2xl font-bold text-amber-600">{taskStats.withoutLead}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-500">
                <Link2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

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
              <Select value={linkFilter} onValueChange={setLinkFilter}>
                <SelectTrigger className="w-[170px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Powiązanie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie wpisy</SelectItem>
                  <SelectItem value="with-lead">Tylko z leadem</SelectItem>
                  <SelectItem value="without-lead">Tylko bez leada</SelectItem>
                </SelectContent>
              </Select>
              {(statusFilter !== 'todo' || typeFilter !== 'all' || linkFilter !== 'all' || searchQuery) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStatusFilter('todo');
                    setTypeFilter('all');
                    setLinkFilter('all');
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
                return parseISO(getTaskStartAt(a) || `${getTaskDate(a)}T09:00`).getTime() - parseISO(getTaskStartAt(b) || `${getTaskDate(b)}T09:00`).getTime();
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
                      const taskStart = getTaskStartAt(task) || `${getTaskDate(task)}T09:00`;
                      const overdue = task.status !== 'done' && isPast(parseISO(taskStart)) && !isToday(parseISO(taskStart));
                      const recurrence = normalizeRecurrenceConfig(task.recurrence);
                      const reminder = task.reminder
                        ? normalizeReminderConfig(task.reminder)
                        : task.reminderAt
                          ? { ...createDefaultReminder(), mode: 'once' as const }
                          : normalizeReminderConfig(task.reminder);

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
                                  <Badge variant="secondary" className="text-[10px] uppercase font-bold h-5">{TASK_TYPES.find((item) => item.value === task.type)?.label || 'Zadanie'}</Badge>
                                  {task.priority === 'high' && <Badge variant="destructive" className="text-[10px] uppercase font-bold h-5">Wysoki</Badge>}
                                  {overdue && <Badge variant="destructive" className="text-[10px] uppercase font-bold h-5">Zaległe</Badge>}
                                  {!task.leadName && !task.leadId && <Badge variant="outline" className="text-[10px] uppercase font-bold h-5">Bez leada</Badge>}
                                  {recurrence.mode !== 'none' && <Badge variant="outline" className="text-[10px] uppercase font-bold h-5"><Repeat className="w-3 h-3 mr-1" /> {RECURRENCE_OPTIONS.find((item) => item.value === recurrence.mode)?.label}</Badge>}
                                  {reminder.mode !== 'none' && <Badge variant="outline" className="text-[10px] uppercase font-bold h-5"><Bell className="w-3 h-3 mr-1" /> {reminder.mode === 'recurring' ? 'Cykliczne przypomnienie' : 'Przypomnienie'}</Badge>}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {format(parseISO(taskStart), 'HH:mm')}</span>
                                  {task.leadName ? <span>Lead: {task.leadName}</span> : <span>Brak powiązanego leada</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => openEditTask(task)}>
                                Edytuj
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="w-4 h-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditTask(task)}>
                                    Edytuj
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleTask(task.id, task.status)}>
                                    <CheckSquare className="w-4 h-4 mr-2" /> {task.status === 'todo' ? 'Oznacz jako zrobione' : 'Przywróć do zrobienia'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-rose-600">
                                    <Trash2 className="w-4 h-4 mr-2" /> Usuń
                                  </DropdownMenuItem>
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
