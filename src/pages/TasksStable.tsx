import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, CheckSquare, Clock, Loader2, RefreshCcw, Search, Trash2 } from 'lucide-react';
/*
P0_TASKS_STABLE_REBUILD
*/


import Layout from '../components/Layout';
import { OperatorMetricTiles, type OperatorMetricTileItem } from '../components/ui-system';
import { actionButtonClass, modalFooterClass, EntityTrashButton, trashActionIconClass } from '../components/entity-actions';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle} from '../components/ui/dialog';

import { toast } from 'sonner';
import {
  deleteTaskFromSupabase,
  fetchCasesFromSupabase,
  fetchTasksFromSupabase,
  insertTaskToSupabase,
  updateTaskInSupabase,
} from '../lib/supabase-fallback';
import { useWorkspace } from '../hooks/useWorkspace';
import { requireWorkspaceId } from '../lib/workspace-context';
import { toDateTimeLocalValue } from '../lib/scheduling';
import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import { ConfirmDialog } from '../components/confirm-dialog';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-canvas-source-truth-stage211e.css';
import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '../lib/action-visual-taxonomy';
const P0_TASKS_STABLE_REBUILD = 'P0_TASKS_STABLE_REBUILD';
void P0_TASKS_STABLE_REBUILD;
const TASKS_VISIBLE_ACTIONS_STAGE47 = 'TASKS_VISIBLE_ACTIONS_STAGE47';
void TASKS_VISIBLE_ACTIONS_STAGE47;
const STAGE83_TASK_DONE_NEXT_STEP_PROMPT = 'STAGE83_TASK_DONE_NEXT_STEP_PROMPT';
void STAGE83_TASK_DONE_NEXT_STEP_PROMPT;
const STAGE220A23B_TASKS_STABLE_DIALOGS_VST = 'active TasksStable delete and next-step dialogs use production VST modals';
void STAGE220A23B_TASKS_STABLE_DIALOGS_VST;
const CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR = 'tasks cases visual mobile repair scoped to /tasks';
void CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR;
const CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK = 'tasks metric tile compact parity final lock';
void CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK;

type TaskScope = 'active' | 'today' | 'overdue' | 'done' | 'high' | 'unlinked';

type NextStepPromptState = {
  sourceTask: any;
  title: string;
  dueAt: string;
  priority: string;
};

type TaskFormState = {
  id?: string;
  title: string;
  type: string;
  dueAt: string;
  priority: string;
  status?: string;
  leadId?: string | null;
  caseId?: string | null;
  clientId?: string | null;
};

const defaultTaskForm = (): TaskFormState => ({
  title: '',
  type: 'follow_up',
  dueAt: toDateTimeLocalValue(new Date()),
  priority: 'medium',
  status: 'todo',
  leadId: null,
  caseId: null,
  clientId: null,
});

function localDateKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function readText(record: any, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function getTaskMomentRaw(task: any) {
  const direct = readText(task, ['scheduledAt', 'scheduled_at', 'dueAt', 'due_at', 'startAt', 'start_at', 'startsAt', 'starts_at', 'dateTime', 'date_time']);
  if (direct) return direct;

  const date = readText(task, ['date'], '');
  if (!date) return '';
  const time = readText(task, ['time'], '09:00');
  return date.includes('T') ? date : date + 'T' + time;
}

function getTaskDateKey(task: any) {
  return getTaskMomentRaw(task).slice(0, 10);
}

function parseTaskTime(task: any) {
  const raw = getTaskMomentRaw(task);
  if (!raw) return Number.POSITIVE_INFINITY;
  const parsed = new Date(raw.includes('T') ? raw : raw + 'T09:00');
  const time = parsed.getTime();
  return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
}

function isTaskDone(task: any) {
  const status = String(task?.status || '').trim().toLowerCase();
  return status === 'done' || status === 'completed' || status === 'closed' || status === 'cancelled' || status === 'canceled';
}

function isTaskToday(task: any) {
  return getTaskDateKey(task) === localDateKey();
}

function isTaskOverdue(task: any) {
  const dateKey = getTaskDateKey(task);
  return Boolean(dateKey) && dateKey < localDateKey() && !isTaskDone(task);
}


type TaskGroupId = 'overdue' | 'today' | 'upcoming' | 'no_due' | 'done';

function isTaskHighPriority(task: any) {
  const priority = readText(task, ['priority'], '').trim().toLowerCase();
  return priority === 'high' || priority === 'urgent' || priority === 'wysoki' || priority === 'pilne';
}

function isTaskUnlinked(task: any) {
  const relationIds = getTaskRelationIds(task);
  return !relationIds.leadId && !relationIds.caseId && !relationIds.clientId;
}

function getTaskGroupId(task: any): TaskGroupId {
  if (isTaskDone(task)) return 'done';
  if (isTaskOverdue(task)) return 'overdue';
  if (isTaskToday(task)) return 'today';
  const raw = getTaskMomentRaw(task);
  if (!raw) return 'no_due';
  return 'upcoming';
}

function buildTaskGroups(tasksToGroup: any[]) {
  const groups: Array<{ id: TaskGroupId; label: string; hint: string; tasks: any[] }> = [
    { id: 'overdue', label: 'Zaleg\u0142e', hint: 'najpierw odblokuj ryzyko', tasks: [] },
    { id: 'today', label: 'Dzi\u015b', hint: 'zadania na teraz', tasks: [] },
    { id: 'upcoming', label: 'Nadchodz\u0105ce', hint: 'najbli\u017csze terminy', tasks: [] },
    { id: 'no_due', label: 'Bez terminu', hint: 'do uporz\u0105dkowania', tasks: [] },
    { id: 'done', label: 'Zrobione', hint: 'zamkni\u0119te dzia\u0142ania', tasks: [] },
  ];

  const byId = new Map(groups.map((group) => [group.id, group]));
  for (const task of tasksToGroup) {
    byId.get(getTaskGroupId(task))?.tasks.push(task);
  }

  return groups.filter((group) => group.tasks.length > 0);
}

function getUrgentTasks(tasksToRank: any[]) {
  return tasksToRank
    .filter((task) => !isTaskDone(task))
    .slice()
    .sort((a, b) => {
      const scoreA = (isTaskOverdue(a) ? -2000000000000000 : 0) + (isTaskToday(a) ? -1000000000000000 : 0) + (isTaskHighPriority(a) ? -500000000000000 : 0) + parseTaskTime(a);
      const scoreB = (isTaskOverdue(b) ? -2000000000000000 : 0) + (isTaskToday(b) ? -1000000000000000 : 0) + (isTaskHighPriority(b) ? -500000000000000 : 0) + parseTaskTime(b);
      return scoreA - scoreB;
    })
    .slice(0, 5);
}

function getTaskTitle(task: any) {
  return readText(task, ['title', 'name'], 'Zadanie bez tytułu');
}

function formatTaskMoment(task: any) {
  const raw = getTaskMomentRaw(task);
  if (!raw) return 'Brak terminu';
  const dateKey = raw.slice(0, 10);
  const time = raw.includes('T') ? raw.slice(11, 16) : '09:00';
  return dateKey + (time ? ', ' + time : '');
}

function getCaseTitle(caseRecord: any) {
  return readText(caseRecord, ['title', 'clientName', 'client_name', 'name'], 'Sprawa');
}

function getStatusBadge(task: any) {
  if (isTaskDone(task)) return 'Zrobione';
  if (isTaskOverdue(task)) return 'Zaległe';
  if (isTaskToday(task)) return 'Dziś';
  return 'Aktywne';
}

function getTaskStatusTone(task: any) {
  if (isTaskDone(task)) return 'green';
  if (isTaskOverdue(task)) return 'red';
  if (isTaskToday(task)) return 'blue';
  return 'neutral';
}

function getTaskRelationIds(task: any) {
  return {
    leadId: task?.leadId || task?.lead_id || null,
    caseId: task?.caseId || task?.case_id || null,
    clientId: task?.clientId || task?.client_id || null,
  };
}

function shouldOfferNextStepPrompt(task: any) {
  const relationIds = getTaskRelationIds(task);
  const taskType = readText(task, ['type'], '').toLowerCase();
  return Boolean(relationIds.leadId || relationIds.caseId || relationIds.clientId || taskType.includes('follow'));
}

function buildNextStepDefaultDueAt() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(9, 0, 0, 0);
  return toDateTimeLocalValue(date);
}

function buildNextStepPromptState(task: any): NextStepPromptState {
  const cleanTitle = getTaskTitle(task).replace(/^follow[- ]?up:\s*/i, '').trim();
  return {
    sourceTask: task,
    title: cleanTitle ? 'Kolejny krok: ' + cleanTitle : 'Kolejny follow-up',
    dueAt: buildNextStepDefaultDueAt(),
    priority: readText(task, ['priority'], 'medium') || 'medium',
  };
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_TASKS_STABLE = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';
const tasksStableModalSelectClassStage220A23B = 'cf-vst-input h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none';


const TASKS_ACTION_COLOR_TAXONOMY_V1 = 'tasks action visual taxonomy V1';
function tasksActionVisualKind(row: Record<string, unknown> | null | undefined) {
  return inferCloseFlowActionVisualKind(row);
}
function tasksActionVisualClass(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualClass(row);
}
function tasksActionDataKind(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualDataKind(row);
}
function tasksActionKindClass(kind: unknown) {
  return getCloseFlowActionKindClass(kind);
}
export default function TasksStable() {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [tasks, setTasks] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState<TaskScope>('active');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<TaskFormState>(() => defaultTaskForm());
  const [nextStepPrompt, setNextStepPrompt] = useState<NextStepPromptState | null>(null);
  const [nextStepSaving, setNextStepSaving] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<any | null>(null);
  const [taskDeletePending, setTaskDeletePending] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRows, caseRows] = await Promise.all([
        fetchTasksFromSupabase().catch(() => []),
        fetchCasesFromSupabase().catch(() => []),
      ]);
      setTasks(Array.isArray(taskRows) ? taskRows : []);
      setCases(Array.isArray(caseRows) ? caseRows : []);
    } catch (error: any) {
      toast.error('Nie udało się pobrać zadań.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  useEffect(() => {
    const handleFocus = () => void refreshData();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void refreshData();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshData]);

  const casesById = useMemo(() => new Map(cases.map((caseRecord: any) => [String(caseRecord.id || ''), caseRecord])), [cases]);

  const stats = useMemo(() => ({
    active: tasks.filter((task) => !isTaskDone(task)).length,
    today: tasks.filter((task) => !isTaskDone(task) && isTaskToday(task)).length,
    overdue: tasks.filter((task) => isTaskOverdue(task)).length,
    done: tasks.filter((task) => isTaskDone(task)).length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tasks
      .filter((task) => {
        if (scope === 'done') return isTaskDone(task);
        if (scope === 'today') return !isTaskDone(task) && isTaskToday(task);
        if (scope === 'overdue') return isTaskOverdue(task);
        if (scope === 'high') return !isTaskDone(task) && isTaskHighPriority(task);
        if (scope === 'unlinked') return !isTaskDone(task) && isTaskUnlinked(task);
        return !isTaskDone(task);
      })
      .filter((task) => {
        if (!query) return true;
        const caseRecord = task.caseId ? casesById.get(String(task.caseId)) : null;
        return [
          getTaskTitle(task),
          readText(task, ['type'], ''),
          readText(task, ['priority'], ''),
          readText(task, ['leadName', 'lead_name'], ''),
          caseRecord ? getCaseTitle(caseRecord) : '',
        ].join(' ').toLowerCase().includes(query);
      })
      .slice()
      .sort((a, b) => {
        if (scope === 'done') return parseTaskTime(b) - parseTaskTime(a);
        if (isTaskOverdue(a) !== isTaskOverdue(b)) return isTaskOverdue(a) ? -1 : 1;
        return parseTaskTime(a) - parseTaskTime(b);
      });
  }, [casesById, scope, searchQuery, tasks]);


  const groupedTasks = useMemo(() => buildTaskGroups(filteredTasks), [filteredTasks]);
  const urgentTasks = useMemo(() => getUrgentTasks(tasks), [tasks]);

  const taskScopeFilters = useMemo(() => ([
    { id: 'active' as TaskScope, label: 'Aktywne', count: stats.active, tone: 'blue' },
    { id: 'today' as TaskScope, label: 'Dzi\u015b', count: stats.today, tone: 'blue' },
    { id: 'overdue' as TaskScope, label: 'Zaleg\u0142e', count: stats.overdue, tone: 'red' },
    { id: 'high' as TaskScope, label: 'Wysoki priorytet', count: tasks.filter((task) => !isTaskDone(task) && isTaskHighPriority(task)).length, tone: 'amber' },
    { id: 'unlinked' as TaskScope, label: 'Bez powi\u0105zania', count: tasks.filter((task) => !isTaskDone(task) && isTaskUnlinked(task)).length, tone: 'neutral' },
    { id: 'done' as TaskScope, label: 'Zrobione', count: stats.done, tone: 'green' },
  ]), [stats, tasks]);

  const openNewTask = () => {
    setForm(defaultTaskForm());
    setIsDialogOpen(true);
  };

  const openEditTask = (task: any) => {
    setForm({
      id: String(task.id || ''),
      title: getTaskTitle(task),
      type: readText(task, ['type'], 'follow_up'),
      dueAt: getTaskMomentRaw(task) || toDateTimeLocalValue(new Date()),
      priority: readText(task, ['priority'], 'medium'),
      status: readText(task, ['status'], 'todo'),
      leadId: task.leadId || task.lead_id || null,
      caseId: task.caseId || task.case_id || null,
      clientId: task.clientId || task.client_id || null,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setIsDialogOpen(false);
    setForm(defaultTaskForm());
  };

  const handleSaveTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!form.title.trim()) return toast.error('Podaj tytuł zadania.');

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        type: form.type || 'follow_up',
        date: form.dueAt.slice(0, 10),
        scheduledAt: form.dueAt,
        priority: form.priority || 'medium',
        status: form.status || 'todo',
        leadId: form.leadId || null,
        caseId: form.caseId || null,
        clientId: form.clientId || null,
        workspaceId,
      };

      if (form.id) {
        await updateTaskInSupabase({ id: form.id, ...payload });
        toast.success('Zadanie zapisane');
      } else {
        await insertTaskToSupabase(payload);
        toast.success('Zadanie dodane');
      }

      setIsDialogOpen(false);
      setForm(defaultTaskForm());
      await refreshData();
    } catch (error: any) {
      toast.error('Nie udało się zapisać zadania.');
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (task: any) => {
    const nextStatus = isTaskDone(task) ? 'todo' : 'done';
    try {
      const relationIds = getTaskRelationIds(task);
      await updateTaskInSupabase({
        id: String(task.id),
        title: getTaskTitle(task),
        type: readText(task, ['type'], 'follow_up'),
        date: getTaskDateKey(task),
        scheduledAt: getTaskMomentRaw(task),
        priority: readText(task, ['priority'], 'medium'),
        status: nextStatus,
        leadId: relationIds.leadId,
        caseId: relationIds.caseId,
        clientId: relationIds.clientId,
      });
      await refreshData();

      if (nextStatus === 'done') {
        toast.success('Zadanie oznaczone jako zrobione');
        if (shouldOfferNextStepPrompt(task)) {
          setNextStepPrompt(buildNextStepPromptState(task));
        }
      } else {
        toast.success('Zadanie przywrócone');
      }
    } catch {
      toast.error('Nie udało się zapisać zadania.');
    }
  };

  const closeNextStepPrompt = () => {
    if (nextStepSaving) return;
    setNextStepPrompt(null);
  };

  const handleCreateNextStepTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!nextStepPrompt) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!nextStepPrompt.title.trim()) return toast.error('Podaj tytuł kolejnego kroku.');

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    const relationIds = getTaskRelationIds(nextStepPrompt.sourceTask);

    setNextStepSaving(true);
    try {
      await insertTaskToSupabase({
        title: nextStepPrompt.title.trim(),
        type: 'follow_up',
        date: nextStepPrompt.dueAt.slice(0, 10),
        scheduledAt: nextStepPrompt.dueAt,
        priority: nextStepPrompt.priority || 'medium',
        status: 'todo',
        leadId: relationIds.leadId,
        caseId: relationIds.caseId,
        clientId: relationIds.clientId,
        workspaceId,
      });
      toast.success('Kolejny krok dodany');
      setNextStepPrompt(null);
      await refreshData();
    } catch {
      toast.error('Nie udało się dodać kolejnego kroku.');
    } finally {
      setNextStepSaving(false);
    }
  };

  const requestDeleteTask = (task: any) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete?.id) return;
    try {
      setTaskDeletePending(true);
      await deleteTaskFromSupabase(String(taskToDelete.id));
      toast.success('Zadanie usunięte');
      setTaskToDelete(null);
      await refreshData();
    } catch {
      toast.error('Nie udało się usunąć zadania.');
    } finally {
      setTaskDeletePending(false);
    }
  };

  const statCards: OperatorMetricTileItem<TaskScope>[] = [
    {
      id: 'active' as TaskScope,
      label: 'Aktywne',
      value: stats.active,
      icon: CheckSquare,
      tone: 'neutral',
    },
    {
      id: 'today' as TaskScope,
      label: 'Dziś',
      value: stats.today,
      icon: Clock,
      tone: 'blue',
    },
    {
      id: 'overdue' as TaskScope,
      label: 'Zaległe',
      value: stats.overdue,
      icon: AlertTriangle,
      tone: 'red',
    },
    {
      id: 'done' as TaskScope,
      label: 'Zrobione',
      value: stats.done,
      icon: CheckCircle2,
      tone: 'green',
    },
  ];

  return (
    <Layout>
      {/* STAGE220A23B_TASK_DELETE_CONFIRM */}
      <ConfirmDialog
        open={Boolean(taskToDelete)}
        onOpenChange={(open) => {
          if (!open && !taskDeletePending) setTaskToDelete(null);
        }}
        title="Usunąć zadanie?"
        description={`Zadanie „${String(taskToDelete?.title || 'Zadanie')}” zostanie usunięte. Tej akcji nie można cofnąć.`}
        confirmLabel={taskDeletePending ? 'Usuwanie...' : 'Usuń zadanie'}
        cancelLabel="Anuluj"
        confirmTone="destructive"
        pending={taskDeletePending}
        onConfirm={confirmDeleteTask}
      />
      <main className="cf-route-work-root flex w-full flex-col gap-5 p-4 sm:p-6" data-p0-tasks-stable-rebuild="true" data-tasks-compact-stage48="true" data-stage83-task-done-next-step-prompt="true" data-stage16c-tasks-cases-repair="tasks" data-stage178-tasks-operational-panel="true">
        <CloseFlowPageHeaderV2
          pageKey="tasks"
          actions={
            <>
              <div className="cf-page-hero-actions flex flex-wrap gap-2">
                            <Button type="button" variant="outline" className={actionButtonClass('neutral', 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800')} onClick={() => openNewTask()} data-cf-header-action="primary" data-page-header-new-task-stage6="true">
                              Nowe zadanie
                            </Button>
                            <Button type="button" variant="outline" className={actionButtonClass('neutral', 'border-slate-300 bg-white text-slate-950 hover:bg-slate-50 hover:text-slate-950')} onClick={() => void refreshData()} disabled={loading || workspaceLoading} data-tasks-refresh-visible-stage45m="true">
                              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                              Odśwież
                            </Button>
                          </div>
            </>
          }
        />

        <OperatorMetricTiles
          items={statCards}
          activeId={scope}
          onSelect={(card) => setScope(card.id)}
          columns={4}
          className="tasks-operator-metric-grid"
          aria-label="Statystyki zadań"
          data-cf-metric-replacement="vs5v"
          data-eliteflow-task-stat-grid="true"
          data-stage16a-metric-visual-parity="true"
          data-stage16d-task-metric-final-lock="replaced-by-operator-metric-tiles"
        />

        <div className="tasks-stage178-workspace" data-stage178-tasks-workspace="true">
          <div className="tasks-stage178-main-stack">
            <Card className="border-slate-100 shadow-sm" data-tasks-search-panel-stage178="true">
              <CardContent className="p-4 sm:p-5">
                <div className="tasks-stage178-search-row">
                  <div className="relative w-full cf-main-search cf-main-search-stage175 cf-main-search-stage178" data-cf-main-search-source="stage173" data-cf-main-search-stage175="true" data-cf-main-search-stage178="true">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Szukaj zadania, sprawy albo priorytetu..." />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">Widoczne: {filteredTasks.length}</p>
                </div>
              </CardContent>
            </Card>

            <section className="tasks-stage178-grouped-list" data-tasks-compact-list-stage48="true" data-stage178-tasks-grouped-list="true">
              {loading ? (
                <Card className="border-slate-100"><CardContent className="flex items-center gap-3 p-5 text-slate-600"><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie zadań...</CardContent></Card>
              ) : filteredTasks.length ? groupedTasks.map((group) => (
                <div key={group.id} className="tasks-stage178-group" data-stage178-task-group={group.id}>
                  <div className="tasks-stage178-group-header">
                    <div className="tasks-stage178-group-title">
                      <strong>{group.label}</strong>
                      <span>{group.hint}</span>
                    </div>
                    <span className="tasks-stage178-group-count">{group.tasks.length}</span>
                  </div>

                  {group.tasks.map((task) => {
                    const caseRecord = task.caseId ? casesById.get(String(task.caseId)) : null;
                    return (
                      <Card key={String(task.id || getTaskTitle(task))} className="border-slate-100 shadow-sm tasks-stage48-task-card">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="cf-status-pill" data-cf-status-tone={getTaskStatusTone(task)}>{getStatusBadge(task)}</span>
                                <Badge variant="outline" className="rounded-full">{readText(task, ['priority'], 'medium')}</Badge>
                                <Badge variant="outline" className="rounded-full">{readText(task, ['type'], 'task')}</Badge>
                              </div>
                              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1" data-task-title-date-row-stage48="true">
                                <h2 className={'text-base font-bold text-slate-950 sm:text-lg ' + (isTaskDone(task) ? 'line-through opacity-60' : '')}>{getTaskTitle(task)}</h2>
                                <span className="text-xs font-bold text-slate-500" data-task-date-inline-stage48="true">{formatTaskMoment(task)}</span>
                              </div>
                              {caseRecord ? <p className="mt-1 text-sm text-slate-600">Sprawa: {getCaseTitle(caseRecord)}</p> : null}
                              {readText(task, ['leadName', 'lead_name'], '') ? <p className="mt-1 text-sm text-slate-600">Lead: {readText(task, ['leadName', 'lead_name'], '')}</p> : null}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" variant="outline" className={actionButtonClass('neutral', 'tasks-stage47-action-button tasks-stage48-task-action-button')} data-task-action-visible-stage48="done-toggle" onClick={() => void toggleTask(task)}>
                                {isTaskDone(task) ? 'Przywróć' : 'Zrobione'}
                              </Button>
                              <Button type="button" variant="outline" className={actionButtonClass('neutral', 'tasks-stage47-action-button tasks-stage48-task-action-button')} data-task-action-visible-stage48="edit" onClick={() => openEditTask(task)}>
                                Edytuj
                              </Button>
                              <EntityTrashButton type="button" variant="outline" className="tasks-stage47-action-button tasks-stage48-task-action-button tasks-stage48-danger-action" data-task-action-visible-stage48="delete" onClick={() => requestDeleteTask(task)}>
                                <Trash2 className={trashActionIconClass("mr-2 h-4 w-4")} /> Usuń
                              </EntityTrashButton>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )) : (
                <Card className="border-slate-100"><CardContent className="p-6 text-sm text-slate-500">Brak zadań w tym widoku.</CardContent></Card>
              )}
            </section>
          </div>

          <aside className="tasks-stage178-right-rail cf-operator-right-rail" data-stage178-tasks-right-rail="true" aria-label="Panel operacyjny zadań">
            <section className="tasks-stage178-rail-card" data-stage178-tasks-filter-card="true">
              <div className="tasks-stage178-rail-head">
                <h2>Filtry zadań</h2>
              </div>
              <div className="tasks-stage178-filter-list">
                {taskScopeFilters.map((filter) => (
                  <button key={filter.id} type="button" className="tasks-stage178-filter-button" data-active={scope === filter.id ? 'true' : 'false'} data-tone={filter.tone} onClick={() => setScope(filter.id)}>
                    <span className="tasks-stage178-filter-label">{filter.label}</span>
                    <span className="tasks-stage178-filter-count">{filter.count}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="tasks-stage178-rail-card" data-stage178-tasks-urgent-card="true">
              <div className="tasks-stage178-rail-head">
                <h3>Najpilniejsze zadania</h3>
              </div>
              {urgentTasks.length ? (
                <div className="tasks-stage178-urgent-list">
                  {urgentTasks.map((task) => (
                    <button
                      key={String(task.id || getTaskTitle(task))}
                      type="button"
                      className="tasks-stage178-urgent-button"
                      title={getTaskTitle(task) + ' - ' + formatTaskMoment(task)}
                      aria-label={getTaskTitle(task) + ' - ' + formatTaskMoment(task)}
                      data-stage181g-urgent-custom-tooltip="true"
                      data-cf-tooltip={getTaskTitle(task) + ' - ' + formatTaskMoment(task)}
                      onClick={() => { setScope(isTaskDone(task) ? 'done' : 'active'); setSearchQuery(getTaskTitle(task)); }}
                    >
                      <span className="tasks-stage178-urgent-title" title={getTaskTitle(task)}>{getTaskTitle(task)}</span>
                      <span className="tasks-stage178-urgent-meta">{formatTaskMoment(task)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="tasks-stage178-empty-rail-note">Brak aktywnych pilnych zadań.</p>
              )}
            </section>
</aside>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
          <DialogContent className="cf-vst-dialog tasks-stable-dialog-stage220a23b max-w-xl" data-stage220a23b-task-form-dialog="true" data-cf-vst-dialog="true">
            <DialogHeader>
              <DialogTitle>{form.id ? 'Edytuj zadanie' : 'Nowe zadanie'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="space-y-2">
                <Label>Tytuł</Label>
                <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Co trzeba zrobić?" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Termin</Label>
                  <Input type="datetime-local" value={form.dueAt} onChange={(event) => setForm((prev) => ({ ...prev, dueAt: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Priorytet</Label>
                  <select className={tasksStableModalSelectClassStage220A23B} value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}>
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="normal">Normalny</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Typ</Label>
                  <select className={tasksStableModalSelectClassStage220A23B} value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
                    <option value="follow_up">Follow-up</option>
                    <option value="todo">Do zrobienia</option>
                    <option value="phone">Telefon</option>
                    <option value="meeting">Spotkanie</option>
                    <option value="other">Inne</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className={tasksStableModalSelectClassStage220A23B} value={form.status || 'todo'} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}>
                    <option value="todo">Do zrobienia</option>
                    <option value="done">Zrobione</option>
                  </select>
                </div>
              </div>
              <DialogFooter className={modalFooterClass("tasks-stable-dialog-stage220a23b-footer cf-vst-dialog-footer")}>
                <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>
                <Button type="submit" className="tasks-stable-dialog-stage220a23b-primary" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Zapisz zadanie</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(nextStepPrompt)} onOpenChange={(open) => (!open ? closeNextStepPrompt() : undefined)}>
          <DialogContent className="cf-vst-dialog task-next-step-dialog-stage220a23b max-w-lg" data-stage83-task-done-next-step-prompt="dialog" data-stage220a23b-task-next-step-dialog="true" data-cf-vst-dialog="true">
            <DialogHeader>
              <DialogTitle>Ustaw kolejny krok</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateNextStepTask} className="space-y-4">
              <p className="text-sm text-slate-600">
                Zadanie jest zrobione. Ustaw następny follow-up, żeby lead albo sprawa nie wypadły z procesu.
              </p>
              <div className="space-y-2">
                <Label>Tytuł kolejnego kroku</Label>
                <Input
                  value={nextStepPrompt?.title || ''}
                  onChange={(event) => setNextStepPrompt((current) => (current ? { ...current, title: event.target.value } : current))}
                  placeholder="Np. Zadzwonić ponownie / wysłać ofertę"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Termin</Label>
                  <Input
                    type="datetime-local"
                    value={nextStepPrompt?.dueAt || ''}
                    onChange={(event) => setNextStepPrompt((current) => (current ? { ...current, dueAt: event.target.value } : current))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priorytet</Label>
                  <select
                    className={tasksStableModalSelectClassStage220A23B}
                    value={nextStepPrompt?.priority || 'medium'}
                    onChange={(event) => setNextStepPrompt((current) => (current ? { ...current, priority: event.target.value } : current))}
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="normal">Normalny</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>
              </div>
              <DialogFooter className={modalFooterClass()}>
                <Button type="button" variant="outline" onClick={closeNextStepPrompt} disabled={nextStepSaving}>Pomiń</Button>
                <Button type="submit" className="tasks-stable-dialog-stage220a23b-primary" disabled={nextStepSaving}>
                  {nextStepSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Ustaw kolejny krok
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </Layout>
  );
}

const FIN14_REPAIR4_TASKS_HEADER_CLICK_GUARD = 'FIN-14_REPAIR4_TASKS_HEADER_CLICK_GUARD_inline_openNewTask';
void FIN14_REPAIR4_TASKS_HEADER_CLICK_GUARD;

const FIN14_REPAIR5_TASKS_HEADER_PLUS_GUARD = 'FIN-14_REPAIR5_TASKS_HEADER_PLUS_GUARD_no_plus_icon_in_new_task_button';
void FIN14_REPAIR5_TASKS_HEADER_PLUS_GUARD;





