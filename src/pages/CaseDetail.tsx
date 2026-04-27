import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  History,
  ListChecks,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Plus,
  Send,
  ShieldAlert,
  StickyNote,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  createClientPortalTokenInSupabase,
  deleteCaseItemFromSupabase,
  fetchActivitiesFromSupabase,
  fetchCaseByIdFromSupabase,
  fetchCaseItemsFromSupabase,
  fetchEventsFromSupabase,
  fetchTasksFromSupabase,
  insertActivityToSupabase,
  insertCaseItemToSupabase,
  insertEventToSupabase,
  insertTaskToSupabase,
  isSupabaseConfigured,
  updateCaseInSupabase,
  updateCaseItemInSupabase,
  updateEventInSupabase,
  updateTaskInSupabase,
} from '../lib/supabase-fallback';
import { getEventMainDate, getEventStartAt, getTaskMainDate } from '../lib/scheduling';
import { resolveCaseLifecycleV1, type CaseLifecycleResultV1 } from '../lib/case-lifecycle-v1';
import '../styles/closeflow-case-detail-focus.css';

type CaseItemStatus = 'missing' | 'uploaded' | 'accepted' | 'rejected' | string;

type CaseRecord = {
  id: string;
  title?: string;
  clientName?: string;
  clientId?: string | null;
  clientEmail?: string;
  clientPhone?: string;
  status?: string;
  completenessPercent?: number;
  leadId?: string | null;
  createdFromLead?: boolean;
  serviceStartedAt?: string | null;
  portalReady?: boolean;
  updatedAt?: any;
  lastActivityAt?: string | null;
};

type CaseItem = {
  id: string;
  caseId?: string;
  title?: string;
  description?: string;
  type?: string;
  status?: CaseItemStatus;
  isRequired?: boolean;
  dueDate?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  response?: string | null;
  order?: number;
  approvedAt?: string | null;
  createdAt?: any;
};

type TaskRecord = {
  id: string;
  title?: string;
  type?: string;
  date?: string | null;
  scheduledAt?: string | null;
  reminderAt?: string | null;
  priority?: string;
  status?: string;
  caseId?: string | null;
  leadId?: string | null;
  clientId?: string | null;
};

type EventRecord = {
  id: string;
  title?: string;
  type?: string;
  startAt?: string | null;
  endAt?: string | null;
  reminderAt?: string | null;
  status?: string;
  caseId?: string | null;
  leadId?: string | null;
  clientId?: string | null;
};

type CaseActivity = {
  id: string;
  actorType?: string;
  eventType?: string;
  payload?: Record<string, any>;
  createdAt?: any;
};

type NewCaseItemState = {
  title: string;
  description: string;
  type: string;
  isRequired: boolean;
  dueDate: string;
};

type NewTaskState = {
  title: string;
  type: string;
  scheduledAt: string;
  reminderAt: string;
  priority: string;
};

type NewEventState = {
  title: string;
  type: string;
  startAt: string;
  endAt: string;
  reminderAt: string;
};

type WorkPathEntry = {
  id: string;
  kind: 'task' | 'event' | 'item' | 'activity';
  title: string;
  subtitle: string;
  statusLabel: string;
  statusClass: string;
  dateValue: any;
  dateLabel: string;
  sortTime: number;
};

const CASE_STATUS_LABELS: Record<string, string> = {
  new: 'Nowa',
  waiting_on_client: 'Czeka na klienta',
  in_progress: 'W realizacji',
  to_approve: 'Do sprawdzenia',
  blocked: 'Zablokowana',
  ready_to_start: 'Gotowa do startu',
  completed: 'Zrobiona',
};

const CASE_STATUS_HINTS: Record<string, string> = {
  new: 'Sprawa została utworzona. Dodaj pierwszy brak albo zaplanuj pierwszą akcję.',
  waiting_on_client: 'Czekamy na klienta. Najpierw zdejmij braki po jego stronie.',
  in_progress: 'Sprawa jest w pracy. Pilnuj najbliższej akcji i terminów.',
  to_approve: 'Klient coś przesłał. Sprawdź i zaakceptuj albo odrzuć.',
  blocked: 'Sprawa stoi. Usuń blokery zanim przejdziesz dalej.',
  ready_to_start: 'Sprawa jest gotowa do dalszej pracy operacyjnej.',
  completed: 'Sprawa zrobiona. Historia zostaje jako ślad pracy.',
};

const ITEM_STATUS_LABELS: Record<string, string> = {
  missing: 'Czeka',
  uploaded: 'Do sprawdzenia',
  accepted: 'Gotowe',
  rejected: 'Bloker',
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  file: 'Plik',
  decision: 'Decyzja',
  text: 'Tekst',
  access: 'Dostępy',
};

const TASK_STATUS_LABELS: Record<string, string> = {
  todo: 'Do zrobienia',
  open: 'Otwarte',
  in_progress: 'W trakcie',
  done: 'Zrobione',
  completed: 'Zrobione',
  cancelled: 'Anulowane',
};

const EVENT_STATUS_LABELS: Record<string, string> = {
  planned: 'Zaplanowane',
  open: 'Zaplanowane',
  scheduled: 'Zaplanowane',
  done: 'Odbyte',
  completed: 'Odbyte',
  cancelled: 'Anulowane',
};

function normalizeRecord<T>(value: unknown): T | null {
  if (Array.isArray(value)) return (value[0] || null) as T | null;
  if (value && typeof value === 'object') return value as T;
  return null;
}

function toDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === 'function') {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function formatDateTime(value: any, fallback = 'Brak daty') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(value: any, fallback = 'Bez terminu') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function sortTime(value: any, fallback = Number.MAX_SAFE_INTEGER) {
  return toDate(value)?.getTime() || fallback;
}

function toIsoFromLocalInput(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

function toDateOnlyFromLocalInput(value: string) {
  if (!value) return '';
  return value.slice(0, 10);
}

function buildQuickRescheduleIso(daysFromNow: number, sourceDate?: any, fallbackHour = 9) {
  const source = toDate(sourceDate);
  const target = new Date();
  target.setDate(target.getDate() + daysFromNow);

  if (source) {
    target.setHours(source.getHours(), source.getMinutes(), 0, 0);
  } else {
    target.setHours(fallbackHour, 0, 0, 0);
  }

  return target.toISOString();
}

function buildDateOnlyFromIso(value: string) {
  return value ? value.slice(0, 10) : '';
}

function addDurationToIso(startIso: string, durationMs: number) {
  const start = toDate(startIso);
  if (!start) return '';
  return new Date(start.getTime() + durationMs).toISOString();
}

function getEventDurationMs(event: EventRecord) {
  const start = toDate(event.startAt);
  const end = toDate(event.endAt);
  if (start && end && end.getTime() > start.getTime()) return end.getTime() - start.getTime();
  return 60 * 60 * 1000;
}

function getCaseStatusLabel(status?: string) {
  if (!status) return 'Bez statusu';
  return CASE_STATUS_LABELS[status] || status;
}

function getCaseStatusHint(status?: string) {
  if (!status) return 'Ustal status sprawy i najbliższy ruch.';
  return CASE_STATUS_HINTS[status] || 'Sprawdź najbliższe działania i blokery.';
}

function getItemStatusLabel(status?: string) {
  if (!status) return 'Czeka';
  return ITEM_STATUS_LABELS[status] || status;
}

function getItemTypeLabel(type?: string) {
  if (!type) return 'Element';
  return ITEM_TYPE_LABELS[type] || type;
}

function getTaskStatusLabel(status?: string) {
  if (!status) return 'Do zrobienia';
  return TASK_STATUS_LABELS[status] || status;
}

function getEventStatusLabel(status?: string) {
  if (!status) return 'Zaplanowane';
  return EVENT_STATUS_LABELS[status] || status;
}

function getItemStatusClass(status?: string) {
  if (status === 'accepted') return 'cf-status-ok';
  if (status === 'uploaded') return 'cf-status-info';
  if (status === 'rejected') return 'cf-status-danger';
  return 'cf-status-warning';
}

function getTaskStatusClass(status?: string) {
  if (status === 'done' || status === 'completed') return 'cf-status-ok';
  if (status === 'cancelled') return 'cf-status-neutral';
  if (status === 'in_progress') return 'cf-status-info';
  return 'cf-status-warning';
}

function getEventStatusClass(status?: string) {
  if (status === 'done' || status === 'completed') return 'cf-status-ok';
  if (status === 'cancelled') return 'cf-status-neutral';
  return 'cf-status-info';
}

function getStatusBadgeClass(status?: string) {
  if (status === 'completed' || status === 'ready_to_start') return 'cf-status-ok';
  if (status === 'in_progress') return 'cf-status-info';
  if (status === 'blocked') return 'cf-status-danger';
  if (status === 'to_approve' || status === 'waiting_on_client') return 'cf-status-warning';
  return 'cf-status-neutral';
}

function getActivityText(activity: CaseActivity) {
  const actor = activity.actorType === 'operator' ? 'Ty' : 'Klient';
  const title = activity.payload?.title || activity.payload?.itemTitle || 'element';

  if (activity.eventType === 'item_added') return `${actor} dodał element: ${title}`;
  if (activity.eventType === 'status_changed') {
    return `${actor} zmienił status „${title}” na: ${getItemStatusLabel(activity.payload?.status)}`;
  }
  if (activity.eventType === 'file_uploaded') return `${actor} wgrał plik do: ${title}`;
  if (activity.eventType === 'decision_made') return `${actor} podjął decyzję w: ${title}`;
  if (activity.eventType === 'operator_note') return `${actor} dodał notatkę`;
  if (activity.eventType === 'task_added') return `${actor} dodał zadanie: ${title}`;
  if (activity.eventType === 'event_added') return `${actor} dodał wydarzenie: ${title}`;
  if (activity.eventType === 'task_status_changed') {
    return `${actor} zmienił status zadania „${title}” na: ${getTaskStatusLabel(activity.payload?.status)}`;
  }
  if (activity.eventType === 'event_status_changed') {
    return `${actor} zmienił status wydarzenia „${title}” na: ${getEventStatusLabel(activity.payload?.status)}`;
  }
  if (activity.eventType === 'task_rescheduled') {
    return `${actor} przełożył zadanie „${title}” na: ${formatDateTime(activity.payload?.scheduledAt)}`;
  }
  if (activity.eventType === 'event_rescheduled') {
    return `${actor} przełożył wydarzenie „${title}” na: ${formatDateTime(activity.payload?.startAt)}`;
  }
  return `${actor} wykonał akcję`;
}

function sortCaseItems(items: CaseItem[]) {
  return [...items].sort((first, second) => {
    const firstOrder = typeof first.order === 'number' ? first.order : Number.MAX_SAFE_INTEGER;
    const secondOrder = typeof second.order === 'number' ? second.order : Number.MAX_SAFE_INTEGER;

    if (firstOrder !== secondOrder) return firstOrder - secondOrder;

    const firstDate = toDate(first.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;
    const secondDate = toDate(second.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;

    return firstDate - secondDate;
  });
}

function sortActivities(activities: CaseActivity[]) {
  return [...activities].sort((first, second) => {
    const firstDate = toDate(first.createdAt)?.getTime() || 0;
    const secondDate = toDate(second.createdAt)?.getTime() || 0;
    return secondDate - firstDate;
  });
}

function calculateCompletion(items: CaseItem[]) {
  if (items.length === 0) return 0;
  const accepted = items.filter((item) => item.status === 'accepted').length;
  return Math.round((accepted / items.length) * 100);
}

function resolveCaseStatusFromItems(items: CaseItem[], fallback = 'in_progress') {
  if (items.length === 0) return fallback;

  const allAccepted = items.every((item) => item.status === 'accepted');
  const hasBlocked = items.some((item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected'));
  const hasToApprove = items.some((item) => item.status === 'uploaded');

  if (allAccepted) return 'ready_to_start';
  if (hasBlocked) return 'blocked';
  if (hasToApprove) return 'to_approve';
  return 'waiting_on_client';
}

function buildPortalUrl(caseId: string, tokenPayload: Record<string, unknown>) {
  const explicitUrl = typeof tokenPayload.url === 'string' ? tokenPayload.url : '';
  if (explicitUrl) return explicitUrl;

  const token =
    typeof tokenPayload.token === 'string'
      ? tokenPayload.token
      : typeof tokenPayload.portalToken === 'string'
        ? tokenPayload.portalToken
        : '';

  return token ? `${window.location.origin}/portal/${caseId}/${token}` : `${window.location.origin}/portal/${caseId}`;
}

function belongsToCase(
  entry: { caseId?: string | null; leadId?: string | null; clientId?: string | null },
  caseId?: string,
  caseRecord?: CaseRecord | null,
) {
  const entryCaseId = String(entry.caseId || '');
  const currentCaseId = String(caseId || '');
  if (currentCaseId && entryCaseId === currentCaseId) return true;

  const entryLeadId = String(entry.leadId || '');
  const currentLeadId = String(caseRecord?.leadId || '');
  if (currentLeadId && entryLeadId === currentLeadId) return true;

  const entryClientId = String(entry.clientId || '');
  const currentClientId = String(caseRecord?.clientId || '');
  if (currentClientId && entryClientId === currentClientId) return true;

  return false;
}

function buildWorkPathEntries(
  tasks: TaskRecord[],
  events: EventRecord[],
  items: CaseItem[],
  activities: CaseActivity[],
): WorkPathEntry[] {
  const taskEntries: WorkPathEntry[] = tasks.map((task) => ({
    id: `task-${task.id}`,
    kind: 'task',
    title: task.title || 'Zadanie bez tytułu',
    subtitle: task.type ? `Zadanie: ${task.type}` : 'Zadanie powiązane ze sprawą',
    statusLabel: getTaskStatusLabel(task.status),
    statusClass: getTaskStatusClass(task.status),
    dateValue: getTaskMainDate(task) || task.reminderAt,
    dateLabel: formatDateTime(getTaskMainDate(task) || task.reminderAt, 'Bez terminu'),
    sortTime: sortTime(getTaskMainDate(task) || task.reminderAt),
  }));

  const eventEntries: WorkPathEntry[] = events.map((event) => ({
    id: `event-${event.id}`,
    kind: 'event',
    title: event.title || 'Wydarzenie bez tytułu',
    subtitle: event.endAt ? `Wydarzenie do ${formatDateTime(event.endAt)}` : 'Wydarzenie powiązane ze sprawą',
    statusLabel: getEventStatusLabel(event.status),
    statusClass: getEventStatusClass(event.status),
    dateValue: getEventMainDate(event) || event.reminderAt,
    dateLabel: formatDateTime(getEventMainDate(event) || event.reminderAt, 'Bez terminu'),
    sortTime: sortTime(getEventMainDate(event) || event.reminderAt),
  }));

  const itemEntries: WorkPathEntry[] = items
    .filter((item) => item.dueDate || item.status !== 'accepted')
    .map((item) => ({
      id: `item-${item.id}`,
      kind: 'item',
      title: item.title || 'Element sprawy',
      subtitle: item.description || getItemTypeLabel(item.type),
      statusLabel: getItemStatusLabel(item.status),
      statusClass: getItemStatusClass(item.status),
      dateValue: item.dueDate,
      dateLabel: formatDate(item.dueDate, 'Bez terminu'),
      sortTime: sortTime(item.dueDate),
    }));

  const activityEntries: WorkPathEntry[] = activities.slice(0, 8).map((activity) => ({
    id: `activity-${activity.id}`,
    kind: 'activity',
    title: getActivityText(activity),
    subtitle: typeof activity.payload?.note === 'string' ? activity.payload.note : 'Historia sprawy',
    statusLabel: 'Historia',
    statusClass: 'cf-status-neutral',
    dateValue: activity.createdAt,
    dateLabel: formatDateTime(activity.createdAt, 'Brak daty'),
    sortTime: sortTime(activity.createdAt, 0),
  }));

  return [...taskEntries, ...eventEntries, ...itemEntries, ...activityEntries].sort((first, second) => {
    const firstHasDate = first.dateValue ? 0 : 1;
    const secondHasDate = second.dateValue ? 0 : 1;

    if (firstHasDate !== secondHasDate) return firstHasDate - secondHasDate;
    return first.sortTime - second.sortTime;
  });
}

function WorkPathIcon({ kind }: { kind: WorkPathEntry['kind'] }) {
  if (kind === 'task') return <ListChecks className="w-4 h-4" />;
  if (kind === 'event') return <CalendarClock className="w-4 h-4" />;
  if (kind === 'item') return <FileText className="w-4 h-4" />;
  return <History className="w-4 h-4" />;
}



type CaseDetailV1CommandCenterProps = {
  lifecycle: CaseLifecycleResultV1;
  onAddItem?: () => void;
  onAddTask?: () => void;
  onAddEvent?: () => void;
  onPortal?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  onReopen?: () => void;
};

function CaseDetailV1CommandCenter({
  lifecycle,
  onAddItem,
  onAddTask,
  onAddEvent,
  onPortal,
  onStart,
  onComplete,
  onReopen,
}: CaseDetailV1CommandCenterProps) {
  return (
    <Card data-testid="case-detail-v1-command-center" className="border-slate-200 bg-white shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Centrum dowodzenia sprawy V1</p>
            <p className="mt-1 text-xs text-slate-500">{lifecycle.headline}</p>
            <p className="mt-1 text-xs font-semibold text-slate-700">{lifecycle.nextOperatorAction}</p>
          </div>
          <Badge variant="outline">{lifecycle.label}</Badge>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Button type="button" variant="outline" onClick={onAddItem}>Dodaj element</Button>
          <Button type="button" variant="outline" onClick={onAddTask}>Dodaj zadanie</Button>
          <Button type="button" variant="outline" onClick={onAddEvent}>Dodaj wydarzenie</Button>
          <Button type="button" variant="outline" onClick={onPortal}>Portal klienta</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={onStart}>Start realizacji</Button>
          <Button type="button" size="sm" variant="outline" onClick={onComplete}>Zrobione sprawę</Button>
          <Button type="button" size="sm" variant="outline" onClick={onReopen}>Przywróć sprawę</Button>
        </div>
      </CardContent>
    </Card>
  );
}

const setCaseLifecycleStatusV1 = async ({
  caseId,
  status,
  currentStatus,
  refresh,
}: {
  caseId: string;
  status: string;
  currentStatus?: string | null;
  refresh?: () => Promise<void> | void;
}) => {
  const eventType = status === 'completed'
    ? 'case_lifecycle_completed'
    : currentStatus === 'completed'
      ? 'case_lifecycle_reopened'
      : 'case_lifecycle_started';

  await updateCaseInSupabase({
    id: caseId,
    status,
    lastActivityAt: new Date().toISOString(),
  });

  await insertActivityToSupabase({
    caseId,
    actorType: 'operator',
    eventType,
    payload: {
      status,
      previousStatus: currentStatus || null,
      source: 'case_detail_v1_command_center',
    },
  });

  await refresh?.();
};

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<CaseRecord | null>(null);
  const [items, setItems] = useState<CaseItem[]>([]);
  const [activities, setActivities] = useState<CaseActivity[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newItem, setNewItem] = useState<NewCaseItemState>({
    title: '',
    description: '',
    type: 'file',
    isRequired: true,
    dueDate: '',
  });
  const [newTask, setNewTask] = useState<NewTaskState>({
    title: '',
    type: 'follow_up',
    scheduledAt: '',
    reminderAt: '',
    priority: 'normal',
  });
  const [newEvent, setNewEvent] = useState<NewEventState>({
    title: '',
    type: 'meeting',
    startAt: '',
    endAt: '',
    reminderAt: '',
  });

  const refreshCaseData = useCallback(async () => {
    if (!caseId) {
      setLoadError('Brak identyfikatora sprawy w adresie.');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setLoadError('Brak konfiguracji Supabase. Lista spraw może działać tylko po poprawnym ustawieniu VITE_SUPABASE_URL.');
      setLoading(false);
      return;
    }

    let timeoutId: number | undefined;

    try {
      setLoading(true);
      setLoadError(null);

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error('TIMEOUT_CASE_DETAIL_LOAD'));
        }, 12_000);
      });

      const dataPromise = Promise.all([
        fetchCaseByIdFromSupabase(caseId),
        fetchCaseItemsFromSupabase(caseId).catch((error) => {
          console.error('CaseDetail Supabase items load failed', error);
          return [];
        }),
        fetchActivitiesFromSupabase({ caseId, limit: 80 }).catch((error) => {
          console.error('CaseDetail Supabase activities load failed', error);
          return [];
        }),
        fetchTasksFromSupabase().catch((error) => {
          console.error('CaseDetail Supabase tasks load failed', error);
          return [];
        }),
        fetchEventsFromSupabase().catch((error) => {
          console.error('CaseDetail Supabase events load failed', error);
          return [];
        }),
      ]);

      const [caseRowRaw, itemRowsRaw, activityRowsRaw, taskRowsRaw, eventRowsRaw] = await Promise.race([dataPromise, timeoutPromise]);

      const normalizedCase = normalizeRecord<CaseRecord>(caseRowRaw);

      if (!normalizedCase?.id) {
        setCaseData(null);
        setItems([]);
        setActivities([]);
        setTasks([]);
        setEvents([]);
        setLoadError('Nie znaleziono tej sprawy w aktualnym workspace.');
        return;
      }

      setCaseData(normalizedCase);
      setItems(sortCaseItems((Array.isArray(itemRowsRaw) ? itemRowsRaw : []) as CaseItem[]));
      setActivities(sortActivities((Array.isArray(activityRowsRaw) ? activityRowsRaw : []) as CaseActivity[]));
      setTasks(((Array.isArray(taskRowsRaw) ? taskRowsRaw : []) as TaskRecord[]).filter((task) => belongsToCase(task, caseId, normalizedCase)));
      setEvents(((Array.isArray(eventRowsRaw) ? eventRowsRaw : []) as EventRecord[]).filter((event) => belongsToCase(event, caseId, normalizedCase)));
    } catch (error: any) {
      console.error('CaseDetail Supabase load failed', error);
      setCaseData(null);
      setItems([]);
      setActivities([]);
      setTasks([]);
      setEvents([]);

      if (error?.message === 'TIMEOUT_CASE_DETAIL_LOAD') {
        setLoadError('Ładowanie sprawy trwa za długo. API nie odpowiedziało w bezpiecznym czasie.');
      } else {
        setLoadError(`Nie mogę wczytać tej sprawy z API: ${error?.message || 'REQUEST_FAILED'}`);
      }
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!active) return;
      await refreshCaseData();
    };

    run();

    return () => {
      active = false;
    };
  }, [refreshCaseData]);

  const completionPercent = useMemo(() => {
    if (items.length > 0) return calculateCompletion(items);
    if (typeof caseData?.completenessPercent === 'number') return Math.round(caseData.completenessPercent);
    return 0;
  }, [caseData?.completenessPercent, items]);

  const caseStats = useMemo(() => {
    const accepted = items.filter((item) => item.status === 'accepted');
    const uploaded = items.filter((item) => item.status === 'uploaded');
    const missing = items.filter((item) => item.status === 'missing');
    const rejected = items.filter((item) => item.status === 'rejected');
    const requiredBlockers = items.filter(
      (item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected'),
    );
    const openItems = items.filter((item) => item.status !== 'accepted');

    const openTasks = tasks.filter((task) => !['done', 'completed', 'cancelled'].includes(String(task.status || '')));
    const plannedEvents = events.filter((event) => !['done', 'completed', 'cancelled'].includes(String(event.status || '')));

    const dueItems = openItems
      .filter((item) => item.dueDate)
      .sort((first, second) => {
        const firstDate = toDate(first.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;
        const secondDate = toDate(second.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;
        return firstDate - secondDate;
      });

    const dueTasks = openTasks
      .filter((task) => getTaskMainDate(task) || task.reminderAt)
      .sort((first, second) => sortTime(getTaskMainDate(first) || first.reminderAt) - sortTime(getTaskMainDate(second) || second.reminderAt));

    const dueEvents = plannedEvents
      .filter((event) => getEventMainDate(event) || event.reminderAt)
      .sort((first, second) => sortTime(getEventMainDate(first) || first.reminderAt) - sortTime(getEventMainDate(second) || second.reminderAt));

    const mainBlocker = rejected[0] || requiredBlockers[0] || uploaded[0] || missing[0] || openItems[0] || null;
    const nextActionItem = dueTasks[0] || dueEvents[0] || dueItems[0] || mainBlocker;

    return {
      accepted,
      uploaded,
      missing,
      rejected,
      requiredBlockers,
      openItems,
      openTasks,
      plannedEvents,
      mainBlocker,
      nextActionItem,
    };
  }, [events, items, tasks]);

  const workPathEntries = useMemo(
    () => buildWorkPathEntries(tasks, events, items, activities),
    [activities, events, items, tasks],
  );

  const syncCaseSummary = async (nextItems: CaseItem[]) => {
    if (!caseId) return;

    const completenessPercent = calculateCompletion(nextItems);
    const status = resolveCaseStatusFromItems(nextItems, caseData?.status || 'in_progress');

    await updateCaseInSupabase({
      id: caseId,
      completenessPercent,
      status,
      lastActivityAt: new Date().toISOString(),
    }).catch((error) => {
      console.error('CaseDetail case summary sync failed', error);
    });
  };

  const handleAddItem = async () => {
    if (!caseId || !newItem.title.trim()) {
      toast.error('Podaj nazwę elementu');
      return;
    }

    try {
      const input = {
        caseId,
        title: newItem.title.trim(),
        description: newItem.description.trim(),
        type: newItem.type,
        isRequired: newItem.isRequired,
        dueDate: newItem.dueDate || null,
        status: 'missing',
        order: items.length,
      };

      const createdRaw = await insertCaseItemToSupabase(input);
      const createdItem = normalizeRecord<CaseItem>(createdRaw) || ({ ...input, id: `local-${Date.now()}` } as CaseItem);
      const nextItems = sortCaseItems([...items, createdItem]);

      setItems(nextItems);
      await syncCaseSummary(nextItems);

      await insertActivityToSupabase({
        caseId,
        actorType: 'operator',
        eventType: 'item_added',
        payload: { title: input.title },
      }).catch((error) => console.error('CaseDetail item activity failed', error));

      setIsAddItemOpen(false);
      setNewItem({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
      toast.success('Element dodany');
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się dodać elementu'));
    }
  };

  const handleAddTask = async () => {
    if (!caseId || !newTask.title.trim()) {
      toast.error('Podaj nazwę zadania');
      return;
    }

    try {
      const scheduledAt = toIsoFromLocalInput(newTask.scheduledAt);
      const reminderAt = toIsoFromLocalInput(newTask.reminderAt);

      const input = {
        title: newTask.title.trim(),
        type: newTask.type,
        date: toDateOnlyFromLocalInput(newTask.scheduledAt),
        scheduledAt: scheduledAt || undefined,
        reminderAt: reminderAt || undefined,
        priority: newTask.priority,
        status: 'todo',
        caseId,
        clientId: caseData?.clientId || null,
        leadId: caseData?.leadId || null,
      };

      const createdRaw = await insertTaskToSupabase(input);
      const createdTask =
        normalizeRecord<TaskRecord>(createdRaw) ||
        ({
          id: `local-task-${Date.now()}`,
          ...input,
        } as TaskRecord);

      setTasks((current) => [...current, createdTask]);

      await insertActivityToSupabase({
        caseId,
        actorType: 'operator',
        eventType: 'task_added',
        payload: { title: input.title, scheduledAt: input.scheduledAt || input.date || null },
      }).catch((error) => console.error('CaseDetail task activity failed', error));

      await updateCaseInSupabase({
        id: caseId,
        lastActivityAt: new Date().toISOString(),
      }).catch((error) => console.error('CaseDetail task case touch failed', error));

      setIsAddTaskOpen(false);
      setNewTask({
        title: '',
        type: 'follow_up',
        scheduledAt: '',
        reminderAt: '',
        priority: 'normal',
      });

      toast.success('Zadanie dodane do sprawy');
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się dodać zadania'));
    }
  };

  const handleAddEvent = async () => {
    if (!caseId || !newEvent.title.trim()) {
      toast.error('Podaj nazwę wydarzenia');
      return;
    }

    const startAt = toIsoFromLocalInput(newEvent.startAt);
    if (!startAt) {
      toast.error('Podaj datę i godzinę wydarzenia');
      return;
    }

    try {
      const endAt = toIsoFromLocalInput(newEvent.endAt);
      const reminderAt = toIsoFromLocalInput(newEvent.reminderAt);

      const input = {
        title: newEvent.title.trim(),
        type: newEvent.type,
        startAt,
        endAt: endAt || undefined,
        reminderAt: reminderAt || undefined,
        status: 'planned',
        caseId,
        clientId: caseData?.clientId || null,
        leadId: caseData?.leadId || null,
      };

      const createdRaw = await insertEventToSupabase(input);
      const createdEvent =
        normalizeRecord<EventRecord>(createdRaw) ||
        ({
          id: `local-event-${Date.now()}`,
          ...input,
        } as EventRecord);

      setEvents((current) => [...current, createdEvent]);

      await insertActivityToSupabase({
        caseId,
        actorType: 'operator',
        eventType: 'event_added',
        payload: { title: input.title, startAt: input.startAt },
      }).catch((error) => console.error('CaseDetail event activity failed', error));

      await updateCaseInSupabase({
        id: caseId,
        lastActivityAt: new Date().toISOString(),
      }).catch((error) => console.error('CaseDetail event case touch failed', error));

      setIsAddEventOpen(false);
      setNewEvent({
        title: '',
        type: 'meeting',
        startAt: '',
        endAt: '',
        reminderAt: '',
      });

      toast.success('Wydarzenie dodane do sprawy');
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się dodać wydarzenia'));
    }
  };

  const handleAddNote = async () => {
    if (!caseId || !newNote.trim()) {
      toast.error('Wpisz treść notatki');
      return;
    }

    try {
      await insertActivityToSupabase({
        caseId,
        actorType: 'operator',
        eventType: 'operator_note',
        payload: { note: newNote.trim() },
      });

      setIsAddNoteOpen(false);
      setNewNote('');
      toast.success('Notatka dodana');
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się dodać notatki'));
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string, title: string) => {
    if (!caseId) return;

    try {
      await updateTaskInSupabase({
        id: taskId,
        status,
        caseId,
      });

      setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)));

      await insertActivityToSupabase({
        caseId,
        actorType: 'operator',
        eventType: 'task_status_changed',
        payload: { title, status },
      }).catch((error) => console.error('CaseDetail task status activity failed', error));

      await updateCaseInSupabase({
        id: caseId,
        lastActivityAt: new Date().toISOString(),
      }).catch((error) => console.error('CaseDetail task status case touch failed', error));

      toast.success(status === 'done' || status === 'completed' ? 'Zadanie oznaczone jako zrobione' : 'Status zadania zaktualizowany');
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się zmienić statusu zadania'));
    }
  };

  const handleUpdateEventStatus = async (eventId: string, status: string, title: string) => {
    if (!caseId) return;

    try {
      await updateEventInSupabase({
        id: eventId,
        status,
        caseId,
      });

      setEvents((current) => current.map((event) => (event.id === eventId ? { ...event, status } : event)));

      await insertActivityToSupabase({
        caseId,
        actorType: 'operator',
        eventType: 'event_status_changed',
        payload: { title, status },
      }).catch((error) => console.error('CaseDetail event status activity failed', error));

      await updateCaseInSupabase({
        id: caseId,
        lastActivityAt: new Date().toISOString(),
      }).catch((error) => console.error('CaseDetail event status case touch failed', error));

      toast.success(status === 'done' || status === 'completed' ? 'Wydarzenie oznaczone jako odbyte' : 'Status wydarzenia zaktualizowany');
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się zmienić statusu wydarzenia'));
    }
  };

  const handleQuickRescheduleTask = async (task: TaskRecord, daysFromNow: number, label: string) => {
    if (!caseId) return;

    const scheduledAt = buildQuickRescheduleIso(daysFromNow, getTaskMainDate(task) || task.reminderAt);
    const date = buildDateOnlyFromIso(scheduledAt);

    try {
      await updateTaskInSupabase({
        id: task.id,
        caseId,
        scheduledAt,
        date,
        reminderAt: scheduledAt,
        status: task.status === 'cancelled' ? 'todo' : task.status || 'todo',
      });

      setTasks((current) =>
        current.map((currentTask) =>
          currentTask.id === task.id
            ? {
                ...currentTask,
                scheduledAt,
                date,
                reminderAt: scheduledAt,
                status: currentTask.status === 'cancelled' ? 'todo' : currentTask.status || 'todo',
              }
            : currentTask,
        ),
      );

      await insertActivityToSupabase({
        caseId,
        actorType: 'operator',
        eventType: 'task_rescheduled',
        payload: { title: task.title || 'Zadanie', scheduledAt, label },
      }).catch((error) => console.error('CaseDetail task reschedule activity failed', error));

      await updateCaseInSupabase({
        id: caseId,
        lastActivityAt: new Date().toISOString(),
      }).catch((error) => console.error('CaseDetail task reschedule case touch failed', error));

      toast.success(`Zadanie przełożone: ${label}`);
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się przełożyć zadania'));
    }
  };

  const handleQuickRescheduleEvent = async (event: EventRecord, daysFromNow: number, label: string) => {
    if (!caseId) return;

    const startAt = buildQuickRescheduleIso(daysFromNow, getEventMainDate(event) || event.reminderAt, 10);
    const endAt = addDurationToIso(startAt, getEventDurationMs(event));

    try {
      await updateEventInSupabase({
        id: event.id,
        caseId,
        startAt,
        endAt: endAt || undefined,
        reminderAt: startAt,
        status: event.status === 'cancelled' ? 'planned' : event.status || 'planned',
      });

      setEvents((current) =>
        current.map((currentEvent) =>
          currentEvent.id === event.id
            ? {
                ...currentEvent,
                startAt,
                endAt: endAt || currentEvent.endAt,
                reminderAt: startAt,
                status: currentEvent.status === 'cancelled' ? 'planned' : currentEvent.status || 'planned',
              }
            : currentEvent,
        ),
      );

      await insertActivityToSupabase({
        caseId,
        actorType: 'operator',
        eventType: 'event_rescheduled',
        payload: { title: event.title || 'Wydarzenie', startAt, endAt: endAt || null, label },
      }).catch((error) => console.error('CaseDetail event reschedule activity failed', error));

      await updateCaseInSupabase({
        id: caseId,
        lastActivityAt: new Date().toISOString(),
      }).catch((error) => console.error('CaseDetail event reschedule case touch failed', error));

      toast.success(`Wydarzenie przełożone: ${label}`);
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się przełożyć wydarzenia'));
    }
  };

  const handleUpdateItemStatus = async (itemId: string, status: string, title: string) => {
    if (!caseId) return;

    try {
      await updateCaseItemInSupabase({
        id: itemId,
        caseId,
        status,
        approvedAt: status === 'accepted' ? new Date().toISOString() : null,
      });

      const nextItems = items.map((item) =>
        item.id === itemId
          ? { ...item, status, approvedAt: status === 'accepted' ? new Date().toISOString() : null }
          : item,
      );

      setItems(nextItems);
      await syncCaseSummary(nextItems);

      await insertActivityToSupabase({
        caseId,
        actorType: 'operator',
        eventType: 'status_changed',
        payload: { title, status },
      }).catch((error) => console.error('CaseDetail status activity failed', error));

      toast.success('Status zaktualizowany');
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się zmienić statusu'));
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!caseId) return;

    try {
      await deleteCaseItemFromSupabase(itemId);

      const nextItems = items.filter((item) => item.id !== itemId);
      setItems(nextItems);
      await syncCaseSummary(nextItems);

      toast.success('Element usunięty');
      await refreshCaseData();
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'Nie udało się usunąć elementu'));
    }
  };

  const generatePortalLink = async () => {
    if (!caseId) return;

    try {
      const tokenPayload = await createClientPortalTokenInSupabase(caseId);
      const url = buildPortalUrl(caseId, tokenPayload || {});

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success('Link do panelu klienta skopiowany');
      } else {
        toast.success('Link do panelu klienta gotowy');
      }
    } catch (error: any) {
      toast.error('Nie udało się przygotować linku: ' + (error?.message || 'REQUEST_FAILED'));
    }
  };

  const handleReminderCopy = () => {
    toast.info('Na teraz bez fałszywej wysyłki maila. Użyj linku do portalu albo dodaj brak na checklistę.');
  };

  const handleNotReadyYet = (label: string) => {
    toast.info(`${label} będzie osobnym etapem. Ten patch porządkuje widok sprawy i pokazuje powiązane akcje.`);
  };

  if (loadError) {
    return (
      <Layout>
        <div className="cf-case-page">
          <main className="cf-case-main">
            <Card className="cf-panel-card">
              <CardContent className="cf-empty-box cf-empty-box-large">
                <AlertCircle className="w-12 h-12" />
                <strong>Nie mogę otworzyć tej sprawy</strong>
                <span>{loadError}</span>
                <div className="cf-command-actions">
                  <Button variant="outline" onClick={() => navigate('/cases')}>
                    Wróć do spraw
                  </Button>
                  <Button onClick={refreshCaseData}>
                    Spróbuj ponownie
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="cf-case-page">
          <main className="cf-case-main">
            <Card className="cf-panel-card">
              <CardContent className="cf-empty-box cf-empty-box-large">
                <Clock className="w-12 h-12" />
                <strong>Ładuję sprawę</strong>
                <span>Pobieram dane sprawy, checklisty, zadania, wydarzenia i historię.</span>
              </CardContent>
            </Card>
          </main>
        </div>
      </Layout>
    );
  }

  if (!caseData) {
    return (
      <Layout>
        <div className="cf-case-page">
          <main className="cf-case-main">
            <Card className="cf-panel-card">
              <CardContent className="cf-empty-box cf-empty-box-large">
                <AlertCircle className="w-12 h-12" />
                <strong>Brak danych sprawy</strong>
                <span>Nie znaleziono danych do pokazania dla tej sprawy.</span>
                <Button variant="outline" onClick={() => navigate('/cases')}>
                  Wróć do spraw
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </Layout>
    );
  }

  const mainBlocker = caseStats.mainBlocker;
  const nextActionItem = caseStats.nextActionItem;
  const isCompleted = caseData.status === 'completed';
  const hasBlockers = caseStats.requiredBlockers.length > 0 || caseStats.rejected.length > 0;
  const lastNote = activities.find((activity) => activity.eventType === 'operator_note')?.payload?.note;

  return (
    <Layout>
      <div className="cf-case-page">
        <header className="cf-case-topbar">
          <div className="cf-case-topbar-inner">
            <div className="cf-case-title-row">
              <Link to="/cases" className="cf-icon-link" aria-label="Wróć do spraw">
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <div className="cf-case-heading">
                <div className="cf-breadcrumbs">
                  <span>Sprawy</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="cf-breadcrumb-current">Obsługa sprawy</span>
                </div>
                <h1>{caseData.title || 'Sprawa bez tytułu'}</h1>
                <div className="cf-case-meta">
                  <Badge className={`cf-status-badge ${getStatusBadgeClass(caseData.status)}`}>
                    {getCaseStatusLabel(caseData.status)}
                  </Badge>
                  <span>Klient: {caseData.clientName || 'Brak danych'}</span>
                  <span>Ostatnia zmiana: {formatDateTime(caseData.updatedAt || caseData.lastActivityAt, 'Brak danych')}</span>
                </div>
              </div>
            </div>

            <div className="cf-case-header-actions">
              <Button variant="outline" size="sm" className="gap-2" onClick={generatePortalLink}>
                <Copy className="w-4 h-4" />
                Kopiuj portal
              </Button>
              <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Dodaj brak
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dodaj wymagany element</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nazwa elementu</Label>
                      <Input
                        placeholder="np. Zgoda na publikację"
                        value={newItem.title}
                        onChange={(event) => setNewItem({ ...newItem, title: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Opis / instrukcja</Label>
                      <Textarea
                        placeholder="Napisz krótko, czego brakuje i co klient ma zrobić."
                        value={newItem.description}
                        onChange={(event) => setNewItem({ ...newItem, description: event.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Typ</Label>
                        <select
                          className="cf-native-select"
                          value={newItem.type}
                          onChange={(event) => setNewItem({ ...newItem, type: event.target.value })}
                        >
                          <option value="file">Plik</option>
                          <option value="decision">Decyzja</option>
                          <option value="text">Tekst / odpowiedź</option>
                          <option value="access">Dostępy / hasła</option>
                        </select>
                      </div>
                      <div className="cf-checkbox-line">
                        <input
                          type="checkbox"
                          id="required"
                          checked={newItem.isRequired}
                          onChange={(event) => setNewItem({ ...newItem, isRequired: event.target.checked })}
                        />
                        <Label htmlFor="required">Obowiązkowy</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Termin opcjonalnie</Label>
                      <Input
                        type="date"
                        value={newItem.dueDate}
                        onChange={(event) => setNewItem({ ...newItem, dueDate: event.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                      Anuluj
                    </Button>
                    <Button onClick={handleAddItem}>Dodaj element</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="cf-case-main">
          <section className="cf-command-grid" aria-label="Najważniejsze informacje o sprawie">
            <Card className="cf-command-card cf-command-card-primary">
              <CardContent className="cf-command-content">
                <div className="cf-command-eyebrow">
                  <ShieldAlert className="w-4 h-4" />
                  Co teraz blokuje?
                </div>
                <h2>
                  {isCompleted
                    ? 'Sprawa jest zrobiona'
                    : mainBlocker
                      ? mainBlocker.title || 'Brak wymagany do obsługi'
                      : hasBlockers
                        ? 'Są blokery do zdjęcia'
                        : 'Brak krytycznych blokerów'}
                </h2>
                <p>
                  {isCompleted
                    ? 'Nie ma aktywnej pracy operacyjnej. Historia zostaje do wglądu.'
                    : mainBlocker?.description || getCaseStatusHint(caseData.status)}
                </p>
                <div className="cf-command-actions">
                  {mainBlocker ? (
                    <Button variant="secondary" size="sm" onClick={handleReminderCopy}>
                      <Send className="w-4 h-4" />
                      Przygotuj przypomnienie
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleNotReadyYet('Oznaczenie gotowości')}>
                      <CheckCircle2 className="w-4 h-4" />
                      Oznacz jako gotowe
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="cf-command-card">
              <CardContent className="cf-command-content">
                <div className="cf-command-eyebrow">
                  <CalendarClock className="w-4 h-4" />
                  Najbliższa akcja
                </div>
                <h2>{nextActionItem ? nextActionItem.title || 'Sprawdź element sprawy' : 'Brak zaplanowanej akcji'}</h2>
                <p>
                  {'scheduledAt' in (nextActionItem || {})
                    ? `Termin: ${formatDateTime((nextActionItem as TaskRecord).scheduledAt || (nextActionItem as TaskRecord).date || (nextActionItem as TaskRecord).reminderAt)}`
                    : 'startAt' in (nextActionItem || {})
                      ? `Termin: ${formatDateTime((nextActionItem as EventRecord).startAt || (nextActionItem as EventRecord).reminderAt)}`
                      : nextActionItem && 'dueDate' in nextActionItem
                        ? `Termin: ${formatDate((nextActionItem as CaseItem).dueDate)}`
                        : nextActionItem
                          ? 'Ten element wymaga reakcji, ale nie ma terminu.'
                          : 'Dodaj zadanie, wydarzenie albo brak, żeby sprawa nie wisiała w powietrzu.'}
                </p>
                <div className="cf-command-actions">
                  {nextActionItem ? (
                    <Badge
                      className={`cf-status-badge ${
                        'scheduledAt' in nextActionItem
                          ? getTaskStatusClass((nextActionItem as TaskRecord).status)
                          : 'startAt' in nextActionItem
                            ? getEventStatusClass((nextActionItem as EventRecord).status)
                            : getItemStatusClass((nextActionItem as CaseItem).status)
                      }`}
                    >
                      {'scheduledAt' in nextActionItem
                        ? getTaskStatusLabel((nextActionItem as TaskRecord).status)
                        : 'startAt' in nextActionItem
                          ? getEventStatusLabel((nextActionItem as EventRecord).status)
                          : getItemStatusLabel((nextActionItem as CaseItem).status)}
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsAddItemOpen(true)}>
                      <Plus className="w-4 h-4" />
                      Dodaj pierwszy ruch
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="cf-command-card">
              <CardContent className="cf-command-content">
                <div className="cf-command-eyebrow">
                  <ListChecks className="w-4 h-4" />
                  Postęp sprawy
                </div>
                <div className="cf-progress-head">
                  <h2>{completionPercent}% gotowe</h2>
                  <span>{caseStats.accepted.length}/{items.length || 0}</span>
                </div>
                <Progress value={completionPercent} className="cf-progress-bar" />
                <div className="cf-mini-stats">
                  <span>{caseStats.requiredBlockers.length} blokerów</span>
                  <span>{caseStats.openTasks.length} zadań</span>
                  <span>{caseStats.plannedEvents.length} wydarzeń</span>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="cf-case-layout">
            <div className="cf-case-left">
              <Card className="cf-panel-card">
                
                <CardContent className="cf-panel-body">
                  <Tabs defaultValue="work" className="cf-tabs">
                    <TabsList className="cf-tabs-list">
                      <TabsTrigger value="work">Obsługa</TabsTrigger>
                      <TabsTrigger value="path">Ścieżka</TabsTrigger>
                      <TabsTrigger value="items">Checklisty</TabsTrigger>
                      <TabsTrigger value="history">Historia</TabsTrigger>
                    </TabsList>

                    <TabsContent value="work" className="cf-tab-content">
                      <div className="cf-work-grid">
                        <Card className="cf-sub-card">
                          <CardHeader className="cf-sub-card-header">
                            <CardTitle>Najważniejsze działania</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => setIsAddItemOpen(true)}>
                              <Plus className="w-4 h-4" />
                              Dodaj
                            </Button>
                          </CardHeader>
                          <CardContent className="cf-list-content">
                            {caseStats.openItems.length === 0 && caseStats.openTasks.length === 0 && caseStats.plannedEvents.length === 0 ? (
                              <div className="cf-empty-box">
                                <CheckCircle2 className="w-10 h-10" />
                                <strong>Nie ma aktywnych działań</strong>
                                <span>Dodaj brak, zadanie albo wydarzenie, gdy sprawa wymaga kolejnego ruchu.</span>
                              </div>
                            ) : (
                              <div className="cf-case-items-list">
                                {caseStats.openTasks.slice(0, 3).map((task) => (
                                  <div key={`task-${task.id}`} className="cf-action-item cf-action-task">
                                    <div className={`cf-item-icon ${getTaskStatusClass(task.status)}`}>
                                      <ListChecks className="w-4 h-4" />
                                    </div>
                                    <div className="cf-action-main">
                                      <strong>{task.title || 'Zadanie bez tytułu'}</strong>
                                      <span>{formatDateTime(getTaskMainDate(task) || task.reminderAt, 'Bez terminu')}</span>
                                      <div className="cf-action-meta">
                                        <Badge className={`cf-status-badge ${getTaskStatusClass(task.status)}`}>
                                          {getTaskStatusLabel(task.status)}
                                        </Badge>
                                        {task.priority && <span>Priorytet: {task.priority}</span>}
                                      </div>
                                    </div>
                                    <div className="cf-action-controls">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="cf-mini-action cf-mini-action-ok"
                                        onClick={() => handleUpdateTaskStatus(task.id, 'done', task.title || 'Zadanie')}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        Zrobione
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="cf-mini-action cf-mini-action-warn"
                                        onClick={() => handleQuickRescheduleTask(task, 1, 'jutro')}
                                      >
                                        <Clock className="w-3.5 h-3.5" />
                                        Jutro
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="cf-mini-action"
                                        onClick={() => handleUpdateTaskStatus(task.id, 'cancelled', task.title || 'Zadanie')}
                                      >
                                        <X className="w-3.5 h-3.5" />
                                        Anuluj
                                      </Button>
                                    </div>
                                  </div>
                                ))}

                                {caseStats.plannedEvents.slice(0, 3).map((event) => (
                                  <div key={`event-${event.id}`} className="cf-action-item cf-action-event">
                                    <div className={`cf-item-icon ${getEventStatusClass(event.status)}`}>
                                      <CalendarClock className="w-4 h-4" />
                                    </div>
                                    <div className="cf-action-main">
                                      <strong>{event.title || 'Wydarzenie bez tytułu'}</strong>
                                      <span>{formatDateTime(getEventMainDate(event) || event.reminderAt, 'Bez terminu')}</span>
                                      <div className="cf-action-meta">
                                        <Badge className={`cf-status-badge ${getEventStatusClass(event.status)}`}>
                                          {getEventStatusLabel(event.status)}
                                        </Badge>
                                        {event.type && <span>{event.type}</span>}
                                      </div>
                                    </div>
                                    <div className="cf-action-controls">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="cf-mini-action cf-mini-action-ok"
                                        onClick={() => handleUpdateEventStatus(event.id, 'done', event.title || 'Wydarzenie')}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        Odbyte
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="cf-mini-action cf-mini-action-warn"
                                        onClick={() => handleQuickRescheduleEvent(event, 1, 'jutro')}
                                      >
                                        <Clock className="w-3.5 h-3.5" />
                                        Jutro
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="cf-mini-action"
                                        onClick={() => handleUpdateEventStatus(event.id, 'cancelled', event.title || 'Wydarzenie')}
                                      >
                                        <X className="w-3.5 h-3.5" />
                                        Anuluj
                                      </Button>
                                    </div>
                                  </div>
                                ))}

                                {caseStats.openItems.slice(0, 4).map((item) => (
                                  <div key={item.id} className="cf-action-item">
                                    <div className={`cf-item-icon ${getItemStatusClass(item.status)}`}>
                                      {item.status === 'uploaded' ? (
                                        <Clock className="w-4 h-4" />
                                      ) : item.status === 'rejected' ? (
                                        <AlertCircle className="w-4 h-4" />
                                      ) : (
                                        <FileText className="w-4 h-4" />
                                      )}
                                    </div>
                                    <div className="cf-action-main">
                                      <strong>{item.title || 'Element sprawy'}</strong>
                                      <span>{item.description || 'Brak opisu'}</span>
                                      <div className="cf-action-meta">
                                        <Badge className={`cf-status-badge ${getItemStatusClass(item.status)}`}>
                                          {getItemStatusLabel(item.status)}
                                        </Badge>
                                        <span>{getItemTypeLabel(item.type)}</span>
                                        {item.dueDate && <span>{formatDate(item.dueDate)}</span>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card className="cf-sub-card cf-status-card">
                          <CardHeader className="cf-sub-card-header">
                            <CardTitle>Status operacyjny</CardTitle>
                          </CardHeader>
                          <CardContent className="cf-status-summary">
                            <div>
                              <span>Stan sprawy</span>
                              <strong>{getCaseStatusLabel(caseData.status)}</strong>
                            </div>
                            <div>
                              <span>Gotowość</span>
                              <strong>{hasBlockers ? 'Nie można startować' : 'Można przejść dalej'}</strong>
                            </div>
                            <div>
                              <span>Powiązane zadania</span>
                              <strong>{tasks.length}</strong>
                            </div>
                            <div>
                              <span>Powiązane wydarzenia</span>
                              <strong>{events.length}</strong>
                            </div>
                            <div>
                              <span>Ostatni ruch</span>
                              <strong>{activities[0] ? formatDateTime(activities[0].createdAt) : 'Brak aktywności'}</strong>
                            </div>
                            <div className="cf-operator-note">
                              <strong>Prosty komunikat:</strong>
                              <span>{getCaseStatusHint(caseData.status)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="path" className="cf-tab-content">
                      <div className="cf-checklist-head">
                        <div>
                          <h3>Ścieżka pracy</h3>
                          <p>Zielona oś prowadzi przez zadania, wydarzenia, braki i historię sprawy w jednej kolejności.</p>
                        </div>
                      </div>

                      {workPathEntries.length === 0 ? (
                        <div className="cf-empty-box cf-empty-box-large">
                          <History className="w-12 h-12" />
                          <strong>Brak ścieżki pracy</strong>
                          <span>Dodaj zadanie, wydarzenie, brak albo notatkę, żeby zbudować czytelny przebieg sprawy.</span>
                        </div>
                      ) : (
                        <div className="cf-work-path">
                          {workPathEntries.map((entry, index) => (
                            <div key={entry.id} className={`cf-work-path-row ${index === 0 ? 'cf-work-path-row-current' : ''}`}>
                              <div className="cf-work-path-date">
                                <strong>{entry.dateLabel}</strong>
                                <span>
                                  {entry.kind === 'task'
                                    ? 'Zadanie'
                                    : entry.kind === 'event'
                                      ? 'Wydarzenie'
                                      : entry.kind === 'item'
                                        ? 'Brak / element'
                                        : 'Historia'}
                                </span>
                              </div>
                              <div className={`cf-work-path-dot ${entry.statusClass}`}>
                                <WorkPathIcon kind={entry.kind} />
                              </div>
                              <div className="cf-work-path-card">
                                <div className="cf-work-path-card-head">
                                  <strong>{entry.title}</strong>
                                  <Badge className={`cf-status-badge ${entry.statusClass}`}>{entry.statusLabel}</Badge>
                                </div>
                                <p>{entry.subtitle}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="items" className="cf-tab-content">
                      <div className="cf-checklist-head">
                        <div>
                          <h3>Checklisty i blokery</h3>
                          <p>Lista ma mówić jasno: gotowe, czeka, blokuje. Zero tabelkowego dymu.</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setIsAddItemOpen(true)}>
                          <Plus className="w-4 h-4" />
                          Dodaj element
                        </Button>
                      </div>

                      {items.length === 0 ? (
                        <div className="cf-empty-box cf-empty-box-large">
                          <FileText className="w-12 h-12" />
                          <strong>Brak elementów sprawy</strong>
                          <span>Dodaj pierwszy brak, decyzję albo materiał, żeby sprawa miała czytelny start.</span>
                          <Button onClick={() => setIsAddItemOpen(true)}>
                            <Plus className="w-4 h-4" />
                            Dodaj pierwszy element
                          </Button>
                        </div>
                      ) : (
                        <div className="cf-checklist-list">
                          {items.map((item) => (
                            <div key={item.id} className="cf-checklist-row">
                              <div className={`cf-check-dot ${getItemStatusClass(item.status)}`}>
                                {item.status === 'accepted' ? (
                                  <Check className="w-4 h-4" />
                                ) : item.status === 'rejected' ? (
                                  <X className="w-4 h-4" />
                                ) : item.status === 'uploaded' ? (
                                  <Clock className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </div>

                              <div className="cf-check-main">
                                <div className="cf-check-title-line">
                                  <h4>{item.title || 'Element sprawy'}</h4>
                                  {item.isRequired && <Badge variant="outline">Wymagane</Badge>}
                                </div>
                                <p>{item.description || 'Brak opisu'}</p>

                                <div className="cf-check-meta">
                                  <Badge className={`cf-status-badge ${getItemStatusClass(item.status)}`}>
                                    {getItemStatusLabel(item.status)}
                                  </Badge>
                                  <span>{getItemTypeLabel(item.type)}</span>
                                  {item.dueDate && <span>Termin: {formatDate(item.dueDate)}</span>}
                                </div>

                                {(item.fileUrl || item.response) && (
                                  <div className="cf-client-response">
                                    {item.fileUrl && (
                                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <Paperclip className="w-3.5 h-3.5" />
                                        {item.fileName || 'Pobierz plik'}
                                      </a>
                                    )}
                                    {item.response && (
                                      <p>
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        {item.response}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="cf-check-actions">
                                {item.status !== 'accepted' && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="cf-accept-btn"
                                    title="Akceptuj"
                                    onClick={() => handleUpdateItemStatus(item.id, 'accepted', item.title || 'Element')}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                )}
                                {item.status !== 'rejected' && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="cf-reject-btn"
                                    title="Odrzuć"
                                    onClick={() => handleUpdateItemStatus(item.id, 'rejected', item.title || 'Element')}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleUpdateItemStatus(item.id, 'missing', item.title || 'Element')}>
                                      Oznacz jako czeka
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateItemStatus(item.id, 'uploaded', item.title || 'Element')}>
                                      Oznacz do sprawdzenia
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteItem(item.id)}>
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Usuń
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="history" className="cf-tab-content">
                      {activities.length === 0 ? (
                        <div className="cf-empty-box cf-empty-box-large">
                          <History className="w-12 h-12" />
                          <strong>Brak historii</strong>
                          <span>Historia pojawi się po dodaniu elementów, notatek albo zmianie statusu.</span>
                        </div>
                      ) : (
                        <ScrollArea className="cf-history-scroll">
                          <div className="cf-timeline">
                            {activities.map((activity) => (
                              <div key={activity.id} className="cf-timeline-item">
                                <div className="cf-timeline-dot" />
                                <strong>{getActivityText(activity)}</strong>
                                {activity.payload?.note && <p>{activity.payload.note}</p>}
                                <span>{formatDateTime(activity.createdAt)}</span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <aside className="cf-case-right">
              <Card className="cf-side-card cf-side-actions">
                <CardHeader>
                  <CardTitle>Szybkie akcje</CardTitle>
                  <p>Proste przyciski robocze, bez zakopywania funkcji.</p>
                </CardHeader>
                <CardContent className="cf-side-stack">
                  <Button className="cf-wide-action cf-wide-action-primary" onClick={() => setIsAddItemOpen(true)}>
                    <Plus className="w-4 h-4" />
                    <span>
                      <strong>Dodaj brak</strong>
                      <small>Materiał, decyzja albo odpowiedź</small>
                    </span>
                  </Button>

                  <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="cf-wide-action cf-wide-action-task">
                        <ListChecks className="w-4 h-4" />
                        <span>
                          <strong>Dodaj zadanie</strong>
                          <small>Telefon, follow-up, rzecz do zrobienia</small>
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dodaj zadanie do sprawy</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nazwa zadania</Label>
                          <Input
                            placeholder="np. Zadzwonić do klienta"
                            value={newTask.title}
                            onChange={(event) => setNewTask({ ...newTask, title: event.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Typ</Label>
                            <select
                              className="cf-native-select"
                              value={newTask.type}
                              onChange={(event) => setNewTask({ ...newTask, type: event.target.value })}
                            >
                              <option value="follow_up">Follow-up</option>
                              <option value="call">Telefon</option>
                              <option value="email">E-mail</option>
                              <option value="todo">Do zrobienia</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>Priorytet</Label>
                            <select
                              className="cf-native-select"
                              value={newTask.priority}
                              onChange={(event) => setNewTask({ ...newTask, priority: event.target.value })}
                            >
                              <option value="low">Niski</option>
                              <option value="normal">Normalny</option>
                              <option value="high">Wysoki</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Termin zadania</Label>
                            <Input
                              type="datetime-local"
                              value={newTask.scheduledAt}
                              onChange={(event) => setNewTask({ ...newTask, scheduledAt: event.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Przypomnienie opcjonalnie</Label>
                            <Input
                              type="datetime-local"
                              value={newTask.reminderAt}
                              onChange={(event) => setNewTask({ ...newTask, reminderAt: event.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                          Anuluj
                        </Button>
                        <Button onClick={handleAddTask}>Dodaj zadanie</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="cf-wide-action cf-wide-action-event">
                        <CalendarClock className="w-4 h-4" />
                        <span>
                          <strong>Dodaj wydarzenie</strong>
                          <small>Spotkanie, termin albo blok w kalendarzu</small>
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dodaj wydarzenie do sprawy</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nazwa wydarzenia</Label>
                          <Input
                            placeholder="np. Spotkanie z klientem"
                            value={newEvent.title}
                            onChange={(event) => setNewEvent({ ...newEvent, title: event.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Typ</Label>
                          <select
                            className="cf-native-select"
                            value={newEvent.type}
                            onChange={(event) => setNewEvent({ ...newEvent, type: event.target.value })}
                          >
                            <option value="meeting">Spotkanie</option>
                            <option value="call">Rozmowa</option>
                            <option value="presentation">Prezentacja</option>
                            <option value="deadline">Termin</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start</Label>
                            <Input
                              type="datetime-local"
                              value={newEvent.startAt}
                              onChange={(event) => setNewEvent({ ...newEvent, startAt: event.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Koniec opcjonalnie</Label>
                            <Input
                              type="datetime-local"
                              value={newEvent.endAt}
                              onChange={(event) => setNewEvent({ ...newEvent, endAt: event.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Przypomnienie opcjonalnie</Label>
                          <Input
                            type="datetime-local"
                            value={newEvent.reminderAt}
                            onChange={(event) => setNewEvent({ ...newEvent, reminderAt: event.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                          Anuluj
                        </Button>
                        <Button onClick={handleAddEvent}>Dodaj wydarzenie</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="cf-wide-action cf-wide-action-note">
                        <StickyNote className="w-4 h-4" />
                        <span>
                          <strong>Dodaj notatkę</strong>
                          <small>Krótki ślad dla operatora</small>
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dodaj notatkę do sprawy</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        className="min-h-[140px]"
                        placeholder="Co warto zapamiętać przy tej sprawie?"
                        value={newNote}
                        onChange={(event) => setNewNote(event.target.value)}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddNoteOpen(false)}>
                          Anuluj
                        </Button>
                        <Button onClick={handleAddNote}>Zapisz notatkę</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="cf-wide-action" onClick={generatePortalLink}>
                    <Copy className="w-4 h-4" />
                    <span>
                      <strong>Kopiuj portal</strong>
                      <small>Link dla klienta</small>
                    </span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="cf-side-card">
                <CardHeader>
                  <CardTitle>Powiązania sprawy</CardTitle>
                  <p>Tu widać, czy zadania i wydarzenia są naprawdę podpięte.</p>
                </CardHeader>
                <CardContent className="cf-info-list">
                  <div>
                    <span>Zadania</span>
                    <strong>{tasks.length}</strong>
                  </div>
                  <div>
                    <span>Wydarzenia</span>
                    <strong>{events.length}</strong>
                  </div>
                  <div>
                    <span>Elementy checklisty</span>
                    <strong>{items.length}</strong>
                  </div>
                  <div>
                    <span>Historia</span>
                    <strong>{activities.length}</strong>
                  </div>
                </CardContent>
              </Card>

              <Card className="cf-side-card">
                <CardHeader>
                  <CardTitle>Klient w tle</CardTitle>
                  <p>Klient jest kontekstem. Praca dzieje się tutaj, w sprawie.</p>
                </CardHeader>
                <CardContent className="cf-info-list">
                  <div>
                    <span>Osoba / firma</span>
                    <strong>{caseData.clientName || 'Brak danych'}</strong>
                  </div>
                  <div>
                    <span>Telefon</span>
                    <strong>{caseData.clientPhone || 'Brak'}</strong>
                  </div>
                  <div>
                    <span>E-mail</span>
                    <strong>{caseData.clientEmail || 'Brak'}</strong>
                  </div>
                  <div>
                    <span>Powiązany lead</span>
                    <strong>{caseData.leadId ? 'Tak' : 'Nie'}</strong>
                  </div>
                  {caseData.leadId && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/leads/${caseData.leadId}`}>
                        Otwórz lead <ExternalLink className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="cf-side-card cf-note-card">
                <CardHeader>
                  <CardTitle>Krótka notatka</CardTitle>
                  <p>Ostatni kontekst bez czytania całej historii.</p>
                </CardHeader>
                <CardContent>
                  <div className="cf-note-preview">
                    {typeof lastNote === 'string' && lastNote.trim()
                      ? lastNote
                      : mainBlocker
                        ? `Najpierw zdejmij blokadę: ${mainBlocker.title || 'element sprawy'}.`
                        : 'Brak osobnej notatki. Dodaj ją, jeśli jest coś ważnego do zapamiętania.'}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </section>
        </main>
      </div>
    </Layout>
  );
}

