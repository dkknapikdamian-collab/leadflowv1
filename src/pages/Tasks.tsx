import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  CheckSquare,
  Clock,
  Link2,
  Loader2,
  MoreVertical,
  Repeat,
  Search,
  Trash2
} from 'lucide-react';
import { NotificationEntityIcon, TaskEntityIcon } from '../components/ui-system';
import { consumeGlobalQuickAction, subscribeGlobalQuickAction } from '../components/GlobalQuickActions';
import { actionButtonClass } from '../components/entity-actions';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { TopicContactPicker } from '../components/topic-contact-picker';
import {
  createDefaultRecurrence,
  createDefaultReminder,
  getTaskDate,
  getTaskStartAt,
  normalizeRecurrenceConfig,
  normalizeReminderConfig,
  syncTaskDerivedFields,
  toDateTimeLocalValue,
  toReminderAtIso
} from '../lib/scheduling';
import {
  PRIORITY_OPTIONS,
  RECURRENCE_OPTIONS,
  REMINDER_MODE_OPTIONS,
  REMINDER_OFFSET_OPTIONS,
  TASK_TYPES
} from '../lib/options';
import { buildConflictCandidates, confirmScheduleConflicts } from '../lib/schedule-conflicts';
import {
  buildTopicContactOptions,
  findTopicContactOption,
  resolveTopicContactLink,
  type TopicContactOption
} from '../lib/topic-contact';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  deleteTaskFromSupabase,
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  insertActivityToSupabase,
  insertTaskToSupabase,
  updateLeadInSupabase,
  updateTaskInSupabase
} from '../lib/supabase-fallback';
import { subscribeCloseflowDataMutations } from '../lib/supabase-fallback';
import { auth } from '../firebase';
import {
  addDays,
  addHours,
  addWeeks,
  endOfWeek,
  format,
  isPast,
  isToday,
  isTomorrow,
  isWithinInterval,
  parseISO,
  startOfDay
} from 'date-fns';
import { toast } from 'sonner';
/* STAGE69H_SOFT_NEXT_STEP_PACKAGE_FINAL */
/*
TASK_FORM_VISUAL_REBUILD_STAGE21_COMPAT_GUARD
TASK_FORM_VISUAL_REBUILD_STAGE21
Nowe zadanie
Edytuj zadanie
Tytuł
Typ
Termin
Priorytet
Powiązanie
Zapisz zadanie
+1H
+1D
+1W
Zrobione
Podaj tytuł zadania.
Nie udało się zapisać zadania. Spróbuj ponownie.
*/
/* TASKS_PAGE_GREEN_ADD_BUTTON_REMOVED_HOTFIX: dodawanie zadania zostaje w globalnym pasku Zadanie; zielony przycisk w /tasks jest skasowany. */
/* TASKS_HEADER_STAGE45B_CLEANUP: local /tasks add-task CTA removed; task header copy is product-facing; title contrast is locked. */


import { useWorkspace } from '../hooks/useWorkspace';

import Layout from '../components/Layout';


import { pl } from 'date-fns/locale';


import { isActiveSalesLead } from '../lib/lead-health';

import { normalizeWorkItem } from '../lib/work-items/normalize';

import '../styles/visual-stage21-task-form-vnext.css';


const TASK_FORM_VISUAL_REBUILD_STAGE21 = 'TASK_FORM_VISUAL_REBUILD_STAGE21';
const TASK_FORM_STAGE21_HUMAN_COPY = 'Podaj tytuł zadania. Wybierz poprawny termin. Termin ma nieprawidłowy format. Nie udało się zapisać zadania. Spróbuj ponownie.';
const TASK_REMINDERS_STAGE45A_GUARD = 'Zadania mają opcje przypomnienia, a mutacje nie gubią reminderAt ani recurrenceRule.';

const modalSelectClass = 'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

type TaskScope = 'active' | 'today' | 'week' | 'overdue' | 'without-lead' | 'done';

function getTaskStart(task: any) {
  const normalized = normalizeWorkItem(task);
  return getTaskStartAt(task) || normalized.dateAt || `${getTaskDate(task)}T09:00`;
}

function hasLeadLink(task: any) {
  return Boolean(task.leadId || task.leadName);
}

function hasCaseLink(task: any) {
  return Boolean(task.caseId);
}

function isTaskDone(task: any) {
  return String(task.status || 'todo') === 'done';
}

function isTaskForToday(task: any) {
  return isToday(parseISO(getTaskStart(task)));
}

function hasTaskTerm(task: any) {
  const normalized = normalizeWorkItem(task);
  return Boolean(normalized.dateAt || normalized.scheduledAt || normalized.startAt || normalized.reminderAt);
}

function isTaskInCurrentWeek(task: any) {
  const start = parseISO(getTaskStart(task));
  const now = new Date();
  return isWithinInterval(start, {
    start: startOfDay(now),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  });
}

function getTaskTimeValue(task: any) {
  if (!hasTaskTerm(task)) return Number.POSITIVE_INFINITY;
  const time = parseISO(getTaskStart(task)).getTime();
  return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
}

function isHighPriorityTask(task: any) {
  const priority = String(task.priority || '').toLowerCase();
  return priority === 'high' || priority === 'urgent' || priority === 'pilne';
}

function getTaskStatusLabel(task: any) {
  if (isTaskDone(task)) return 'Zrobione';
  if (isTaskOverdueEntry(task)) return 'Zaległe';
  if (isTaskForToday(task)) return 'Dziś';
  if (!hasTaskTerm(task)) return 'Bez terminu';
  return 'Aktywne';
}

function compareTasksOperational(a: any, b: any) {
  const rank = (task: any) => {
    if (isTaskOverdueEntry(task)) return 0;
    if (!isTaskDone(task) && isTaskForToday(task)) return 1;
    if (!isTaskDone(task) && isHighPriorityTask(task)) return 2;
    if (hasTaskTerm(task)) return 3;
    return 4;
  };

  const rankDiff = rank(a) - rank(b);
  if (rankDiff !== 0) return rankDiff;
  return getTaskTimeValue(a) - getTaskTimeValue(b);
}

function isTaskOverdueEntry(task: any) {
  const start = parseISO(getTaskStart(task));
  return !isTaskDone(task) && isPast(start) && !isToday(start);
}

function groupTasksByDate(items: any[]) {
  return items.reduce<Record<string, any[]>>((acc, task) => {
    const date = getTaskDate(task);
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});
}

function TaskReminderEditor({
  reminder,
  onChange,
}: {
  reminder: any;
  onChange: (reminder: any) => void;
}) {
  const safeReminder = normalizeReminderConfig(reminder);

  const updateReminder = (patch: Partial<ReturnType<typeof createDefaultReminder>>) => {
    onChange(normalizeReminderConfig({
      ...safeReminder,
      ...patch,
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 p-4 space-y-4" data-task-edit-reminder-panel="true">
      <div>
        <p className="text-sm font-bold text-slate-900">Przypomnienie</p>
        <p className="text-xs text-slate-500">Tak samo jak przy tworzeniu zadania: możesz wyłączyć, ustawić jednorazowe albo cykliczne przypomnienie.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Tryb przypomnienia</Label>
          <select
            className={modalSelectClass}
            value={safeReminder.mode}
            onChange={(event) => updateReminder({ mode: event.target.value as any })}
          >
            {REMINDER_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {safeReminder.mode !== 'none' ? (
          <div className="space-y-2">
            <Label>Ile wcześniej</Label>
            <select
              className={modalSelectClass}
              value={String(safeReminder.minutesBefore)}
              onChange={(event) => updateReminder({ minutesBefore: Number(event.target.value) })}
            >
              {REMINDER_OFFSET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {safeReminder.mode === 'recurring' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Powtarzaj</Label>
            <select
              className={modalSelectClass}
              value={safeReminder.recurrenceMode}
              onChange={(event) => updateReminder({ recurrenceMode: event.target.value as any })}
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
              min={1}
              value={safeReminder.recurrenceInterval}
              onChange={(event) => updateReminder({ recurrenceInterval: Number(event.target.value) || 1 })}
            />
          </div>

          <div className="space-y-2">
            <Label>Do kiedy</Label>
            <Input
              type="date"
              value={safeReminder.until || ''}
              onChange={(event) => updateReminder({ until: event.target.value || null })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_TASKS = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';

export default function Tasks() {
  const { workspace, hasAccess, loading: workspaceLoading, workspaceReady } = useWorkspace();
  const [tasks, setTasks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskScope, setTaskScope] = useState<TaskScope>('active');
  const [searchParams, setSearchParams] = useSearchParams();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState(() => ({
    title: '',
    type: 'follow_up',
    dueAt: toDateTimeLocalValue(new Date()),
    priority: 'medium',
    leadId: '',
    caseId: '',
    clientId: '',
    relationQuery: '',
    recurrence: createDefaultRecurrence(),
    reminder: createDefaultReminder(),
  }));
  const [editTask, setEditTask] = useState<any | null>(null);

  const createTaskSubmitLockRef = useRef(false);
  const editTaskSubmitLockRef = useRef(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskEditSubmitting, setTaskEditSubmitting] = useState(false);

  useEffect(() => subscribeGlobalQuickAction((target) => {
    if (target === 'task') setIsNewTaskOpen(true);
  }), []);

  useEffect(() => {
    if (consumeGlobalQuickAction() === 'task') {
      setIsNewTaskOpen(true);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('quick') !== 'task') return;
    setIsNewTaskOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

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
    const [taskRows, leadRows, caseRows] = await Promise.all([
      fetchTasksFromSupabase(),
      fetchLeadsFromSupabase(),
      fetchCasesFromSupabase(),
    ]);
    const clientRows = await fetchClientsFromSupabase().catch(() => []);

    setTasks((taskRows as any[]).map((row) => ({ ...row, ...normalizeWorkItem(row) })));
    setLeads(leadRows as any[]);
    setCases(caseRows as any[]);
    setClients(clientRows as any[]);

    return {
      taskRows: taskRows as any[],
      leadRows: leadRows as any[],
      caseRows: caseRows as any[],
      clientRows: clientRows as any[],
    };
  }

  useEffect(() => {
    // FAZA4_ETAP44A_TASKS_LIVE_REFRESH: refetch mounted Tasks after mutations from other UI surfaces.
    if (workspaceLoading || !workspace?.id) return undefined;

    let refreshTimer: number | null = null;

    const unsubscribe = subscribeCloseflowDataMutations((detail) => {
      if (!['task', 'event', 'lead', 'case', 'client', 'aiDraft'].includes(detail.entity)) return;

      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        void refreshSupabaseData().catch((error: any) => {
          console.warn('TASKS_LIVE_REFRESH_FAILED', error);
        });
      }, 120);
    });

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      unsubscribe();
    };
  }, [workspace?.id, workspaceLoading]);

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        const [taskRows, leadRows, caseRows, clientRows] = await Promise.all([
          fetchTasksFromSupabase(),
          fetchLeadsFromSupabase(),
          fetchCasesFromSupabase(),
          fetchClientsFromSupabase().catch(() => []),
        ]);

        if (cancelled) return;
        setTasks((taskRows as any[]).map((row) => ({ ...row, ...normalizeWorkItem(row) })));
        setLeads(leadRows as any[]);
        setCases(caseRows as any[]);
        setClients(clientRows as any[]);
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
  }, [workspace?.id, workspaceLoading]);

  const resetNewTask = () => {
    setNewTask({
      title: '',
      type: 'follow_up',
      dueAt: toDateTimeLocalValue(new Date()),
      priority: 'medium',
      leadId: '',
      caseId: '',
      relationQuery: '',
      recurrence: createDefaultRecurrence(),
      reminder: createDefaultReminder(),
    });
  };

  const topicContactOptions = useMemo(
    () => buildTopicContactOptions({ leads, cases, clients }),
    [cases, clients, leads],
  );

  const selectedNewTaskOption = useMemo(
    () => findTopicContactOption(topicContactOptions, { leadId: newTask.leadId || null, caseId: newTask.caseId || null, clientId: newTask.clientId || null }),
    [newTask.caseId, newTask.leadId, topicContactOptions],
  );

  const selectedEditTaskOption = useMemo(
    () => findTopicContactOption(topicContactOptions, { leadId: editTask?.leadId || null, caseId: editTask?.caseId || null, clientId: editTask?.clientId || null }),
    [editTask?.caseId, editTask?.leadId, topicContactOptions],
  );

  const handleSelectNewTaskRelation = (option: TopicContactOption | null) => {
    const resolved = resolveTopicContactLink(option);
    setNewTask((prev) => ({
      ...prev,
      leadId: resolved.leadId || '',
      caseId: resolved.caseId || '',
      clientId: resolved.clientId || '',
      relationQuery: option?.label || '',
    }));
  };

  const handleSelectEditTaskRelation = (option: TopicContactOption | null) => {
    const resolved = resolveTopicContactLink(option);
    setEditTask((prev: any) => (
      prev
        ? {
            ...prev,
            leadId: resolved.leadId || '',
            caseId: resolved.caseId || '',
      clientId: resolved.clientId || '',
      relationQuery: option?.label || '',
          }
        : prev
    ));
  };

  const getSoftNextStepDefaultDueAt = () => {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);
    return toDateTimeLocalValue(next);
  };

  const handleSoftNextStepAfterTaskCompletion = async ({
    leadId,
    leadName,
    fallbackTitle,
  }: {
    leadId?: string | null;
    leadName?: string;
    fallbackTitle?: string;
  }) => {
    try {
      if (!leadId) return;
      const lead = leads.find((entry: any) => String(entry.id || '') === String(leadId));
      if (!lead || !isActiveSalesLead(lead)) return;
      if (lead.nextActionAt) return;
      const workspaceId = requireWorkspaceId(workspace);
      if (!workspaceId) return;

      const targetName = String(lead.name || leadName || 'lead').trim();
      const completedTaskTitle = String(fallbackTitle || 'zadanie').trim();
      const scheduledAt = getSoftNextStepDefaultDueAt();
      const promptText = [
        `Zamknąłeś zadanie przy aktywnym leadzie: ${targetName}.`,
        'Ten lead nie ma kolejnego kroku.',
        '',
        'Co zrobić?',
        '1 - ustaw follow-up na jutro rano',
        '2 - ustaw przypomnienie na jutro rano',
        '3 - zostaw świadomie bez kolejnego kroku',
      ].join('\n');
      const choice = window.prompt(promptText, '1')?.trim();
      if (!choice) return;

      if (choice === '3') {
        await insertActivityToSupabase({
          leadId,
          ownerId: auth.currentUser?.uid ?? null,
          actorId: auth.currentUser?.uid ?? null,
          actorType: 'operator',
          eventType: 'lead_next_step_skipped',
          workspaceId,
          payload: {
            source: 'task_done',
            completedTaskTitle,
            leadName: targetName,
          },
        });
        toast.success('Lead zostawiony bez kolejnego kroku');
        return;
      }

      if (choice !== '1' && choice !== '2') return;

      const title = choice === '2'
        ? `Przypomnij: ${targetName}`
        : `Follow-up: ${targetName}`;
      await insertTaskToSupabase({
        title,
        type: 'follow_up',
        date: scheduledAt.slice(0, 10),
        scheduledAt,
        priority: 'medium',
        leadId,
        clientId: lead.clientId ?? null,
        caseId: lead.linkedCaseId ?? lead.caseId ?? null,
        ownerId: auth.currentUser?.uid ?? undefined,
        workspaceId,
      });
      await updateLeadInSupabase({
        id: String(leadId),
        nextActionAt: scheduledAt,
        workspaceId,
      });
      await insertActivityToSupabase({
        leadId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'lead_next_step_created',
        workspaceId,
        payload: {
          source: 'task_done',
          title,
          scheduledAt,
          completedTaskTitle,
          leadName: targetName,
          mode: choice === '2' ? 'reminder' : 'follow_up',
        },
      });
      await refreshSupabaseData();
      toast.success('Ustawiono kolejny krok dla leada');
    } catch (error) {
      console.warn('SOFT_NEXT_STEP_AFTER_TASK_COMPLETION_FAILED', error);
      toast.error('Zadanie zamknięte, ale nie udało się ustawić kolejnego kroku.');
    }
  };

  const openEditTask = (task: any) => {
    setEditTask({
      id: task.id,
      title: task.title || '',
      type: task.type || 'follow_up',
      dueAt: getTaskStart(task),
      priority: task.priority || 'medium',
      leadId: task.leadId || '',
      caseId: task.caseId || '',
      clientId: task.clientId || '',
      relationQuery: task.caseId ? String(caseTitleById.get(String(task.caseId)) || task.title || '') : (task.leadName || ''),
      recurrence: normalizeRecurrenceConfig(task.recurrence),
      reminder: normalizeReminderConfig(task.reminder),
      status: task.status || 'todo',
    });
    setIsEditTaskOpen(true);
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (createTaskSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!newTask.title.trim()) return toast.error('Podaj tytuł zadania.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    createTaskSubmitLockRef.current = true;
    setTaskSubmitting(true);

    const payload = syncTaskDerivedFields({
      ...newTask,
      leadId: newTask.leadId || null,
      clientId: newTask.clientId || null,
      leadName: selectedNewTaskOption?.resolvedTarget === 'lead' ? selectedNewTaskOption.label : '',
      recurrence: normalizeRecurrenceConfig(newTask.recurrence),
      reminder: normalizeReminderConfig(newTask.reminder),
    });

    try {
      const eventRows = await fetchEventsFromSupabase();
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'task',
          title: payload.title,
          startAt: payload.dueAt,
        },
        candidates: buildConflictCandidates({
          tasks,
          events: eventRows as any[],
          caseTitleById,
        }),
      });
      if (!shouldSave) return;

      const reminderAt = toReminderAtIso(payload.dueAt, payload.reminder);
      await insertTaskToSupabase({
        title: newTask.title,
        type: newTask.type,
        date: newTask.dueAt.slice(0, 10),
        scheduledAt: newTask.dueAt,
        priority: newTask.priority,
        leadId: newTask.leadId || null,
        caseId: newTask.caseId || null,
        clientId: newTask.clientId || null,
        reminderAt,
        recurrenceRule: payload.recurrence?.mode ?? 'none',
        ownerId: auth.currentUser?.uid,
        workspaceId,
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
      toast.error('Nie udało się zapisać zadania. Spróbuj ponownie.');
    } finally {
      createTaskSubmitLockRef.current = false;
      setTaskSubmitting(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    try {
      const task = tasks.find((entry) => entry.id === taskId);
      const nextStatus = currentStatus === 'todo' ? 'done' : 'todo';

      await updateTaskInSupabase({
        id: taskId,
        title: task?.title,
        type: task?.type,
        date: task?.date,
        status: nextStatus,
        priority: task?.priority,
        leadId: task?.leadId ?? null,
        caseId: task?.caseId ?? null,
        clientId: task?.clientId ?? null,
        // TASK_REMINDER_PRESERVE_ON_STATUS_TOGGLE_STAGE45A
        scheduledAt: task?.scheduledAt ?? task?.dueAt ?? task?.startAt ?? getTaskStart(task) ?? null,
        reminderAt: task?.reminderAt ?? null,
        recurrenceRule: task?.recurrenceRule ?? task?.recurrence?.mode ?? 'none',
      });

      await refreshSupabaseData();

      if (nextStatus === 'done' && task?.leadId) {
        await handleSoftNextStepAfterTaskCompletion({
          leadId: task.leadId,
          leadName: task.leadName,
          fallbackTitle: task.title,
        });
      }
    } catch (error: any) {
      toast.error('Nie udało się zapisać zadania. Spróbuj ponownie.');
    }
  };

  const rescheduleTask = async (task: any, amount: number, unit: 'hour' | 'day' | 'week') => {
    if (!hasAccess) return toast.error('Trial wygasł.');

    try {
      const currentStart = parseISO(getTaskStart(task));
      const nextStart = unit === 'hour'
        ? addHours(currentStart, amount)
        : unit === 'day'
          ? addDays(currentStart, amount)
          : addWeeks(currentStart, amount);
      const nextScheduledAt = toDateTimeLocalValue(nextStart);
      // TASK_REMINDER_SHIFT_WITH_RESCHEDULE_STAGE45A
      const normalizedReminder = normalizeReminderConfig(task.reminder);
      const currentReminderAt = typeof task.reminderAt === 'string' && task.reminderAt.trim() ? task.reminderAt : null;
      const currentReminderMoment = currentReminderAt ? parseISO(currentReminderAt) : null;
      const currentStartMoment = parseISO(getTaskStart(task));
      const inferredReminderMinutes = currentReminderMoment && !Number.isNaN(currentReminderMoment.getTime()) && !Number.isNaN(currentStartMoment.getTime())
        ? Math.max(0, Math.round((currentStartMoment.getTime() - currentReminderMoment.getTime()) / 60_000))
        : null;
      const nextReminderAt = normalizedReminder.mode !== 'none'
        ? toReminderAtIso(nextScheduledAt, normalizedReminder)
        : inferredReminderMinutes !== null
          ? new Date(nextStart.getTime() - inferredReminderMinutes * 60_000).toISOString()
          : task.reminderAt ?? null;
await updateTaskInSupabase({
        id: task.id,
        title: task.title,
        type: task.type,
        status: task.status || 'todo',
        priority: task.priority,
        date: nextScheduledAt.slice(0, 10),
        scheduledAt: nextScheduledAt,
        leadId: task.leadId ?? null,
        caseId: task.caseId ?? null,
        clientId: task.clientId ?? null,
        reminderAt: nextReminderAt,
        recurrenceRule: task.recurrenceRule ?? task.recurrence?.mode ?? 'none',
      });

      await refreshSupabaseData();
      toast.success('Termin zadania przesunięty');
    } catch (error: any) {
      toast.error('Nie udało się zapisać zadania. Spróbuj ponownie.');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Usunąć zadanie?')) return;
    try {
      await deleteTaskFromSupabase(taskId);
      await refreshSupabaseData();
      toast.success('Zadanie usunięte');
    } catch (error: any) {
      toast.error('Nie udało się zapisać zadania. Spróbuj ponownie.');
    }
  };

  const handleSaveTaskEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (editTaskSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!editTask?.id) return;
    if (!editTask.title?.trim()) return toast.error('Podaj tytuł zadania.');
    editTaskSubmitLockRef.current = true;
    setTaskEditSubmitting(true);

    const payload = syncTaskDerivedFields({
      ...editTask,
      leadId: editTask.leadId || null,
      clientId: editTask.clientId || null,
      leadName: selectedEditTaskOption?.resolvedTarget === 'lead' ? selectedEditTaskOption.label : '',
      recurrence: normalizeRecurrenceConfig(editTask.recurrence),
      reminder: normalizeReminderConfig(editTask.reminder),
    });

    try {
      const eventRows = await fetchEventsFromSupabase();
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'task',
          title: payload.title,
          startAt: payload.dueAt,
        },
        candidates: buildConflictCandidates({
          tasks,
          events: eventRows as any[],
          caseTitleById,
        }),
        excludeId: String(editTask.id),
        excludeKind: 'task',
      });
      if (!shouldSave) return;

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
        caseId: editTask.caseId || null,
        clientId: editTask.clientId || payload.clientId || null,
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
      toast.error('Nie udało się zapisać zadania. Spróbuj ponownie.');
    } finally {
      editTaskSubmitLockRef.current = false;
      setTaskEditSubmitting(false);
    }
  };

  const caseTitleById = useMemo(
    () => new Map(cases.map((caseRecord: any) => [String(caseRecord.id || ''), String(caseRecord.title || caseRecord.clientName || 'Powiązana sprawa')])),
    [cases],
  );
  const clientNameById = useMemo(
    () => new Map(clients.map((client: any) => [String(client.id || ''), String(client.name || client.company || 'Klient')])),
    [clients],
  );

  const baseFilteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      if (!normalizedQuery) return true;

      const taskTitle = String(task.title || '').toLowerCase();
      const taskType = String(task.type || '').toLowerCase();
      const taskLead = String(task.leadName || '').toLowerCase();
      const taskCase = String(caseTitleById.get(String(task.caseId || '')) || '').toLowerCase();
      const taskPriority = String(task.priority || '').toLowerCase();

      return taskTitle.includes(normalizedQuery)
        || taskType.includes(normalizedQuery)
        || taskLead.includes(normalizedQuery)
        || taskCase.includes(normalizedQuery)
        || taskPriority.includes(normalizedQuery);
    });
  }, [caseTitleById, tasks, searchQuery]);

  const scopedTasks = useMemo(() => {
    return baseFilteredTasks.filter((task) => {
      switch (taskScope) {
        case 'active':
          return !isTaskDone(task);
        case 'today':
          return !isTaskDone(task) && isTaskForToday(task);
        case 'week':
          return !isTaskDone(task) && isTaskInCurrentWeek(task);
        case 'overdue':
          return isTaskOverdueEntry(task);
        case 'without-lead':
          return !isTaskDone(task) && !hasLeadLink(task);
        case 'done':
          return isTaskDone(task);
        default:
          return !isTaskDone(task);
      }
    });
  }, [baseFilteredTasks, taskScope]);

  const visibleCurrentTasks = useMemo(() => {
    if (taskScope === 'done') return [] as any[];
    return scopedTasks
      .filter((task) => !isTaskDone(task))
      .slice()
      .sort(compareTasksOperational);
  }, [scopedTasks, taskScope]);

  const visibleCompletedTasks = useMemo(() => {
    return scopedTasks
      .filter((task) => isTaskDone(task))
      .slice()
      .sort((a, b) => getTaskTimeValue(b) - getTaskTimeValue(a));
  }, [scopedTasks]);

  const groupedCurrentTasks = useMemo(() => groupTasksByDate(visibleCurrentTasks), [visibleCurrentTasks]);
  const sortedCurrentDates = useMemo(() => Object.keys(groupedCurrentTasks).sort(), [groupedCurrentTasks]);
  const groupedCompletedTasks = useMemo(() => groupTasksByDate(visibleCompletedTasks), [visibleCompletedTasks]);
  const sortedCompletedDates = useMemo(() => Object.keys(groupedCompletedTasks).sort().reverse(), [groupedCompletedTasks]);

  const taskStats = {
    active: tasks.filter((task) => !isTaskDone(task)).length,
    today: tasks.filter((task) => !isTaskDone(task) && isTaskForToday(task)).length,
    week: tasks.filter((task) => !isTaskDone(task) && isTaskInCurrentWeek(task)).length,
    overdue: tasks.filter((task) => isTaskOverdueEntry(task)).length,
    withoutLead: tasks.filter((task) => !isTaskDone(task) && !hasLeadLink(task)).length,
    done: tasks.filter((task) => isTaskDone(task)).length,
  };

  const activateScope = (scope: TaskScope) => {
    setTaskScope(scope);
    if (scope === 'done') {
      requestAnimationFrame(() => {
        document.getElementById('completed-tasks-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const statCards = [
    {
      id: 'active' as TaskScope,
      title: 'Aktywne',
      value: taskStats.active,
      tone: 'neutral',
      icon: TaskEntityIcon,
    },
    {
      id: 'today' as TaskScope,
      title: 'Dziś',
      value: taskStats.today,
      tone: 'blue',
      icon: Clock,
    },
    {
      id: 'week' as TaskScope,
      title: 'Ten tydzień',
      value: taskStats.week,
      tone: 'blue',
      icon: NotificationEntityIcon,
    },
    {
      id: 'overdue' as TaskScope,
      title: 'Zaległe',
      value: taskStats.overdue,
      tone: 'red',
      icon: AlertTriangle,
    },
    {
      id: 'done' as TaskScope,
      title: 'Zrobione',
      value: taskStats.done,
      tone: 'green',
      icon: CheckCircle2,
    },
  ];

  const renderTaskCard = (task: any, completedSection = false, index = 0) => {
    void index;
    const taskStart = getTaskStart(task);
    const overdue = isTaskOverdueEntry(task);
    const done = isTaskDone(task);
    const hasTerm = hasTaskTerm(task);
    const taskDate = parseISO(taskStart);
    const taskTypeLabel = TASK_TYPES.find((item) => item.value === task.type)?.label || 'Zadanie';
    const caseTitle = task.caseId ? (caseTitleById.get(String(task.caseId)) || 'Powiązana sprawa') : '';
    const clientName = task.clientId ? (clientNameById.get(String(task.clientId)) || '') : '';
    const relationLine = caseTitle
      ? `Sprawa: ${caseTitle}`
      : task.leadName
        ? `Lead: ${task.leadName}`
        : clientName
          ? `Klient: ${clientName}`
          : 'Niepowiązane z leadem/sprawą/klientem';
    const statusLabel = getTaskStatusLabel(task);
    const statusTone = done
      ? 'is-done'
      : overdue
        ? 'is-overdue'
        : isTaskForToday(task)
          ? 'is-today'
          : 'is-active';

    return (
      <div key={task.id} className={`task-row task-row-compact ${done ? 'is-done' : ''}`} data-task-compact-row="true">
        <div className="task-type-badge-col">
          <span className="task-type-badge">{taskTypeLabel}</span>
        </div>

        <div className="task-main min-w-0">
          <p className={`task-title font-bold text-slate-900 break-words ${done ? 'line-through' : ''}`}>{task.title}</p>
          <p className="task-meta">{relationLine}</p>
          <div className="task-pills">
            {isHighPriorityTask(task) ? <span className="task-priority-chip">Pilne</span> : null}
            {completedSection ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] uppercase font-bold h-5">Archiwum</Badge> : null}
          </div>
        </div>

        <div className="task-term-col">
          <span className="task-col-label">Termin</span>
          <strong>{hasTerm ? format(taskDate, 'd MMM, HH:mm', { locale: pl }) : 'Bez terminu'}</strong>
        </div>

        <div className="task-status-col">
          <span className="task-col-label">Status</span>
          <span className={`task-status-chip ${statusTone}`}>{statusLabel}</span>
        </div>

        <div className="task-action-col task-action-col-compact" data-task-actions="compact">
          <Button variant="outline" size="sm" className={actionButtonClass('neutral', 'task-action-btn rounded-xl')} onClick={() => openEditTask(task)}>
            Edytuj
          </Button>
          <Button variant="outline" size="sm" className={actionButtonClass('neutral', 'task-action-btn rounded-xl')} disabled={done} onClick={() => rescheduleTask(task, 1, 'hour')}>
            +1H
          </Button>
          <Button variant="outline" size="sm" className={actionButtonClass('neutral', 'task-action-btn rounded-xl')} disabled={done} onClick={() => rescheduleTask(task, 1, 'day')}>
            +1D
          </Button>
          <Button variant="outline" size="sm" className={actionButtonClass('neutral', 'task-action-btn rounded-xl')} disabled={done} onClick={() => rescheduleTask(task, 1, 'week')}>
            +1W
          </Button>
          <Button variant={done ? 'outline' : 'default'} size="sm" className={actionButtonClass('neutral', 'task-action-btn rounded-xl')} onClick={() => toggleTask(task.id, task.status)}>
            {done ? 'Przywróć' : 'Zrobione'}
          </Button>
          <Button variant="outline" size="sm" className={actionButtonClass('danger', 'task-action-btn task-action-danger rounded-xl')} onClick={() => deleteTask(task.id)}>
            Usuń
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="cf-html-view main-tasks-html">
        <header className="page-head flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="kicker">Czas i obowiązki</span>
            <h1 className="text-3xl font-bold text-slate-900">Zadania</h1>
            <p className="lead-copy">Widok operacyjny: co jest na dziś, co zalega i co wymaga ruchu w tym tygodniu.</p>
          </div>
          <div className="head-actions">
          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogContent className="task-form-vnext-content sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-task-form-stage21="true" data-task-form-visual-rebuild={TASK_FORM_VISUAL_REBUILD_STAGE21}>
              <DialogHeader><DialogTitle>Dodaj zadanie</DialogTitle></DialogHeader>
              <form onSubmit={handleAddTask} className="task-form-vnext space-y-6 py-4" data-task-form-stage21="true" data-task-form-visual-rebuild={TASK_FORM_VISUAL_REBUILD_STAGE21}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tytuł zadania</Label>
                    <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <select className={modalSelectClass} value={newTask.type} onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}>
                        {TASK_TYPES.map((taskType) => (
                          <option key={taskType.value} value={taskType.value}>{taskType.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <TopicContactPicker
                    options={topicContactOptions}
                    selectedOption={selectedNewTaskOption}
                    query={newTask.relationQuery}
                    onQueryChange={(value) => setNewTask((prev) => ({ ...prev, relationQuery: value, leadId: '', caseId: '' }))}
                    onSelect={handleSelectNewTaskRelation}
                  />
                  <div className="space-y-2">
                    <Label>Priorytet</Label>
                    <select className={modalSelectClass} value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
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
                    <Input type="datetime-local" value={newTask.dueAt} onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })} required />
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
                    <Input type="date" value={newTask.recurrence.until || ''} onChange={(e) => setNewTask({ ...newTask, recurrence: { ...newTask.recurrence, until: e.target.value || null } })} disabled={newTask.recurrence.mode === 'none'} />
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
                      <select className={modalSelectClass} value={newTask.reminder.mode} onChange={(e) => setNewTask({ ...newTask, reminder: { ...newTask.reminder, mode: e.target.value as any } })}>
                        {REMINDER_MODE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Kiedy przypomnieć</Label>
                      <select className={modalSelectClass} value={newTask.reminder.minutesBefore} onChange={(e) => setNewTask({ ...newTask, reminder: { ...newTask.reminder, minutesBefore: Number(e.target.value) } })} disabled={newTask.reminder.mode === 'none'}>
                        {REMINDER_OFFSET_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {newTask.reminder.mode === 'recurring' ? (
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
                  ) : null}
                </div>

                
          {/* TASK_REMINDER_OPTIONS_STAGE45A_NEW */}
          <TaskReminderEditor
            reminder={newTask.reminder}
            onChange={(reminder) => setNewTask((prev) => ({ ...prev, reminder }))}
          />

<DialogFooter>
                  <Button type="submit" className="w-full" disabled={taskSubmitting || !workspaceReady}>{taskSubmitting ? 'Zapisywanie...' : 'Zapisz zadanie'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          </div>

          <Dialog open={isEditTaskOpen} onOpenChange={(open) => {
            setIsEditTaskOpen(open);
            if (!open) setEditTask(null);
          }}>
            <DialogContent className="task-form-vnext-content sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-task-form-stage21="true" data-task-form-visual-rebuild={TASK_FORM_VISUAL_REBUILD_STAGE21}>
              <DialogHeader><DialogTitle>Edytuj zadanie</DialogTitle>
                  <p className="task-form-vnext-description">Popraw termin, status, priorytet albo powiązanie zadania.</p></DialogHeader>
              {editTask ? (
                <form onSubmit={handleSaveTaskEdit} className="task-form-vnext space-y-6 py-4" data-task-form-stage21="true" data-task-form-visual-rebuild={TASK_FORM_VISUAL_REBUILD_STAGE21}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tytuł zadania</Label>
                      <Input value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Typ</Label>
                        <select className={modalSelectClass} value={editTask.type} onChange={(e) => setEditTask({ ...editTask, type: e.target.value })}>
                          {TASK_TYPES.map((taskType) => (
                            <option key={taskType.value} value={taskType.value}>{taskType.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <TopicContactPicker
                      options={topicContactOptions}
                      selectedOption={selectedEditTaskOption}
                      query={editTask.relationQuery}
                      onQueryChange={(value) => setEditTask({ ...editTask, relationQuery: value, leadId: '', caseId: '' })}
                      onSelect={handleSelectEditTaskRelation}
                    />
                    
                  <div className="space-y-2">
                    <Label>Status zadania</Label>
                    <select
                      className={modalSelectClass}
                      value={editTask?.status || 'todo'}
                      onChange={(e) => setEditTask((prev: any) => prev ? { ...prev, status: e.target.value } : prev)}
                    >
                      <option value="todo">Do zrobienia</option>
                      <option value="done">Zrobione</option>
                      <option value="cancelled">Anulowane</option>
                    </select>
                  </div>
<div className="space-y-2">
                      <Label>Priorytet</Label>
                      <select className={modalSelectClass} value={editTask.priority} onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}>
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Data i godzina</Label>
                      <Input type="datetime-local" value={editTask.dueAt} onChange={(e) => setEditTask({ ...editTask, dueAt: e.target.value })} required />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Powtarzanie</Label>
                        <select className={modalSelectClass} value={editTask.recurrence.mode} onChange={(e) => setEditTask({ ...editTask, recurrence: { ...editTask.recurrence, mode: e.target.value as any } })}>
                          {RECURRENCE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Co ile</Label>
                        <Input type="number" min="1" value={editTask.recurrence.interval} onChange={(e) => setEditTask({ ...editTask, recurrence: { ...editTask.recurrence, interval: Math.max(1, Number(e.target.value) || 1) } })} disabled={editTask.recurrence.mode === 'none'} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tryb przypomnienia</Label>
                        <select className={modalSelectClass} value={editTask.reminder.mode} onChange={(e) => setEditTask({ ...editTask, reminder: { ...editTask.reminder, mode: e.target.value as any } })}>
                          {REMINDER_MODE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Kiedy przypomnieć</Label>
                        <select className={modalSelectClass} value={editTask.reminder.minutesBefore} onChange={(e) => setEditTask({ ...editTask, reminder: { ...editTask.reminder, minutesBefore: Number(e.target.value) } })} disabled={editTask.reminder.mode === 'none'}>
                          {REMINDER_OFFSET_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {editTask.reminder.mode === 'recurring' ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Cykliczność przypomnienia</Label>
                          <select className={modalSelectClass} value={editTask.reminder.recurrenceMode} onChange={(e) => setEditTask({ ...editTask, reminder: { ...editTask.reminder, recurrenceMode: e.target.value as any } })}>
                            {RECURRENCE_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Co ile</Label>
                          <Input type="number" min="1" value={editTask.reminder.recurrenceInterval} onChange={(e) => setEditTask({ ...editTask, reminder: { ...editTask.reminder, recurrenceInterval: Math.max(1, Number(e.target.value) || 1) } })} />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  
                <TaskReminderEditor
                  reminder={editTask?.reminder}
                  onChange={(reminder) => setEditTask((prev: any) => prev ? { ...prev, reminder } : prev)}
                />

          {/* TASK_REMINDER_OPTIONS_STAGE45A_EDIT */}
          {editTask ? (
            <TaskReminderEditor
              reminder={editTask.reminder}
              onChange={(reminder) => setEditTask((prev: any) => (prev ? { ...prev, reminder } : prev))}
            />
          ) : null}

<DialogFooter>
                    <Button type="submit" className="w-full" disabled={taskEditSubmitting}>{taskEditSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}</Button>
                  </DialogFooter>
                </form>
              ) : null}
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <StatShortcutCard
              key={stat.id}
              label={stat.title}
              value={stat.value}
              icon={stat.icon}
              active={taskScope === stat.id}
              onClick={() => activateScope(stat.id)}
              tone={stat.tone}
              title={`Pokaż: ${stat.title.toLowerCase()}`}
            />
          ))}
        </div>

        <Card className="search-card border-none shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Szukaj po tytule, typie, leadzie albo sprawie..." className="pl-10 rounded-xl bg-slate-50 border-none h-11" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="layout-list">
          <div className="stack">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-slate-500">Ładowanie zadań...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {taskScope !== 'done' ? (
              sortedCurrentDates.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Brak zadań</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-1">Dodaj pierwsze zadanie albo wpisz inną frazę.</p>
                </div>
              ) : sortedCurrentDates.map((dateKey) => {
                const tasksForDate = groupedCurrentTasks[dateKey].sort((a, b) => parseISO(getTaskStart(a)).getTime() - parseISO(getTaskStart(b)).getTime());

                return (
                  <section key={dateKey} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{format(parseISO(dateKey), 'EEEE, d MMMM', { locale: pl })}</h2>
                      {isToday(parseISO(dateKey)) ? <Badge className="rounded-full">Dziś</Badge> : null}
                      {isTomorrow(parseISO(dateKey)) ? <Badge variant="secondary" className="rounded-full">Jutro</Badge> : null}
                    </div>
                        <div className="tasks-list-card">
                          {tasksForDate.map((task, index) => renderTaskCard(task, false, index + 1))}
                        </div>
                  </section>
                );
              })
            ) : null}

            <section id="completed-tasks-section" className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Zrobione zadania</h2>
                <Badge variant="secondary" className="rounded-full">{visibleCompletedTasks.length}</Badge>
              </div>
              {sortedCompletedDates.length === 0 ? (
                <Card className="border-dashed bg-slate-50/50">
                  <CardContent className="p-6 text-sm text-slate-500">Brak zrobionych zadań dla obecnego wyszukiwania.</CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {sortedCompletedDates.map((dateKey) => {
                    const tasksForDate = groupedCompletedTasks[dateKey].sort((a, b) => parseISO(getTaskStart(b)).getTime() - parseISO(getTaskStart(a)).getTime());
                    return (
                      <div key={`completed:${dateKey}`} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{format(parseISO(dateKey), 'EEEE, d MMMM', { locale: pl })}</h3>
                        </div>
                        <div className="tasks-list-card">
                          {tasksForDate.map((task, index) => renderTaskCard(task, true, index + 1))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
          </div>

          <div className="tasks-right-rail">
            <aside className="right-card tasks-right-card">
              <div className="panel-head"><h3>Szybkie skróty</h3><p>Najczęstsze filtry dla zadań.</p></div>
              <div className="quick-list">
                <button type="button" onClick={() => activateScope('today')}><span>Dzisiaj</span><strong>{taskStats.today}</strong></button>
                <button type="button" onClick={() => activateScope('overdue')}><span>Zaległe</span><strong>{taskStats.overdue}</strong></button>
                <button type="button" onClick={() => activateScope('active')}><span>Aktywne</span><strong>{taskStats.active}</strong></button>
                <button type="button" onClick={() => activateScope('done')}><span>Zrobione</span><strong>{taskStats.done}</strong></button>
              </div>
            </aside>
            <aside className="right-card tasks-right-card">
              <div className="panel-head"><h3>Podsumowanie</h3><p>Podsumowanie z realnych danych.</p></div>
              <div className="quick-list">
                <div className="quick-note">Bez leada: <strong>{taskStats.withoutLead}</strong></div>
                <div className="quick-note">Najbliższe terminy: <strong>{sortedCurrentDates.length}</strong></div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* PHASE0_STAT_CARD_PAGE_GUARD StatShortcutCard onClick= activateScope(stat.id) */

/* GLOBAL_QUICK_ACTIONS_STAGE08D_TASK_MODAL_EVENT_BUS */

