// LEAD_TO_CASE_FLOW_STAGE24_CASE_DETAIL
// CASE_DETAIL_VISUAL_REBUILD_STAGE13
import {
 useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  History,
  ListChecks,
  Loader2,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  StickyNote,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
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
  fetchLeadByIdFromSupabase,
} from '../lib/supabase-fallback';
import { resolveCaseLifecycleV1 } from '../lib/case-lifecycle-v1';
import { getEventMainDate, getTaskMainDate } from '../lib/scheduling';
import '../styles/visual-stage13-case-detail-vnext.css';

type CaseDetailTab = 'service' | 'path' | 'checklists' | 'history';
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
  createdAt?: any;
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

type WorkItem = {
  id: string;
  kind: 'task' | 'event' | 'missing' | 'note';
  title: string;
  subtitle: string;
  status: string;
  statusClass: string;
  dateLabel: string;
  sortTime: number;
  source: TaskRecord | EventRecord | CaseItem | CaseActivity;
};

const CASE_STATUS_LABELS: Record<string, string> = {
  new: 'Nowa',
  waiting_on_client: 'Czeka na klienta',
  in_progress: 'W realizacji',
  to_approve: 'Do sprawdzenia',
  blocked: 'Zablokowana',
  ready_to_start: 'Gotowa do startu',
  completed: 'Zrobiona',
  canceled: 'Anulowana',
};

const CASE_STATUS_HINTS: Record<string, string> = {
  new: 'Dodaj pierwszy brak albo zaplanuj pierwszą akcję.',
  waiting_on_client: 'Czekamy na klienta. Najpierw zdejmij braki po jego stronie.',
  in_progress: 'Sprawa jest w pracy. Pilnuj najbliższej akcji i terminów.',
  to_approve: 'Klient coś przesłał. Sprawdź i zaakceptuj albo odrzuć.',
  blocked: 'Sprawa stoi. Usuń blokery zanim przejdziesz dalej.',
  ready_to_start: 'Sprawa jest gotowa do dalszej pracy operacyjnej.',
  completed: 'Sprawa zrobiona. Historia zostaje jako ślad pracy.',
  canceled: 'Sprawa została anulowana.',
};

const ITEM_STATUS_LABELS: Record<string, string> = {
  missing: 'Brak',
  uploaded: 'Do akceptacji',
  accepted: 'Zaakceptowane',
  rejected: 'Odrzucone',
  sent: 'Wysłane',
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  file: 'Plik',
  decision: 'Decyzja',
  text: 'Tekst',
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
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
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
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function sortTime(value: any, fallback = Number.MAX_SAFE_INTEGER) {
  return toDate(value)?.getTime() || fallback;
}

function toIsoFromLocalInput(value: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function toDateOnlyFromLocalInput(value: string) {
  return value ? value.slice(0, 10) : '';
}

function buildQuickRescheduleIso(daysFromNow: number, sourceDate?: any, fallbackHour = 9) {
  const source = toDate(sourceDate);
  const target = new Date();
  target.setDate(target.getDate() + daysFromNow);
  if (source) target.setHours(source.getHours(), source.getMinutes(), 0, 0);
  else target.setHours(fallbackHour, 0, 0, 0);
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

function getCaseTitle(caseData?: CaseRecord | null) {
  return String(caseData?.title || caseData?.clientName || 'Sprawa bez nazwy');
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
  if (!status) return 'Brak';
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

function getStatusClass(status?: string) {
  if (['accepted', 'done', 'completed', 'ready_to_start'].includes(String(status || ''))) return 'case-detail-pill-green';
  if (['uploaded', 'to_approve', 'in_progress', 'scheduled', 'planned', 'open'].includes(String(status || ''))) return 'case-detail-pill-blue';
  if (['rejected', 'blocked', 'overdue'].includes(String(status || ''))) return 'case-detail-pill-red';
  if (['missing', 'waiting_on_client', 'on_hold'].includes(String(status || ''))) return 'case-detail-pill-amber';
  return 'case-detail-pill-muted';
}

function getActivityText(activity: CaseActivity) {
  const actor = activity.actorType === 'operator' ? 'Ty' : 'Klient';
  const title = activity.payload?.title || activity.payload?.itemTitle || 'element';

  if (activity.eventType === 'item_added') return `${actor} dodał brak: ${title}`;
  if (activity.eventType === 'status_changed') return `${actor} zmienił status „${title}” na: ${getItemStatusLabel(activity.payload?.status)}`;
  if (activity.eventType === 'file_uploaded') return `${actor} wgrał plik do: ${title}`;
  if (activity.eventType === 'decision_made') return `${actor} podjął decyzję w: ${title}`;
  if (activity.eventType === 'operator_note') return `${actor} dodał notatkę`;
  if (activity.eventType === 'task_added') return `${actor} dodał zadanie: ${title}`;
  if (activity.eventType === 'event_added') return `${actor} dodał wydarzenie: ${title}`;
  if (activity.eventType === 'task_status_changed') return `${actor} zmienił status zadania „${title}” na: ${getTaskStatusLabel(activity.payload?.status)}`;
  if (activity.eventType === 'event_status_changed') return `${actor} zmienił status wydarzenia „${title}” na: ${getEventStatusLabel(activity.payload?.status)}`;
  if (activity.eventType === 'task_rescheduled') return `${actor} przełożył zadanie „${title}” na: ${formatDateTime(activity.payload?.scheduledAt)}`;
  if (activity.eventType === 'event_rescheduled') return `${actor} przełożył wydarzenie „${title}” na: ${formatDateTime(activity.payload?.startAt)}`;
  if (activity.eventType === 'case_lifecycle_started') return 'Rozpoczęto realizację sprawy';
  if (activity.eventType === 'case_lifecycle_completed') return 'Oznaczono sprawę jako zrobioną';
  if (activity.eventType === 'case_lifecycle_reopened') return 'Przywrócono sprawę do pracy';
  return `${actor} wykonał akcję`;
}

function sortCaseItems(items: CaseItem[]) {
  return [...items].sort((first, second) => {
    const firstOrder = typeof first.order === 'number' ? first.order : Number.MAX_SAFE_INTEGER;
    const secondOrder = typeof second.order === 'number' ? second.order : Number.MAX_SAFE_INTEGER;
    if (firstOrder !== secondOrder) return firstOrder - secondOrder;
    return sortTime(first.dueDate) - sortTime(second.dueDate);
  });
}

function sortActivities(activities: CaseActivity[]) {
  return [...activities].sort((first, second) => sortTime(second.createdAt, 0) - sortTime(first.createdAt, 0));
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
  const token = typeof tokenPayload.token === 'string' ? tokenPayload.token : typeof tokenPayload.portalToken === 'string' ? tokenPayload.portalToken : '';
  return token ? `${window.location.origin}/portal/${caseId}/${token}` : `${window.location.origin}/portal/${caseId}`;
}

function belongsToCase(
  entry: { caseId?: string | null; leadId?: string | null; clientId?: string | null },
  caseId?: string,
  caseRecord?: CaseRecord | null,
) {
  if (String(entry.caseId || '') && String(entry.caseId || '') === String(caseId || '')) return true;
  if (String(entry.leadId || '') && String(entry.leadId || '') === String(caseRecord?.leadId || '')) return true;
  if (String(entry.clientId || '') && String(entry.clientId || '') === String(caseRecord?.clientId || '')) return true;
  return false;
}

function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[], activities: CaseActivity[]) {
  const taskItems: WorkItem[] = tasks.map((task) => ({
    id: `task-${task.id}`,
    kind: 'task',
    title: task.title || 'Zadanie bez tytułu',
    subtitle: task.type ? `Zadanie · ${task.type}` : 'Zadanie powiązane ze sprawą',
    status: getTaskStatusLabel(task.status),
    statusClass: getStatusClass(task.status),
    dateLabel: formatDateTime(getTaskMainDate(task) || task.reminderAt, 'Bez terminu'),
    sortTime: sortTime(getTaskMainDate(task) || task.reminderAt),
    source: task,
  }));

  const eventItems: WorkItem[] = events.map((event) => ({
    id: `event-${event.id}`,
    kind: 'event',
    title: event.title || 'Wydarzenie bez tytułu',
    subtitle: event.endAt ? `Wydarzenie do ${formatDateTime(event.endAt)}` : 'Wydarzenie powiązane ze sprawą',
    status: getEventStatusLabel(event.status),
    statusClass: getStatusClass(event.status),
    dateLabel: formatDateTime(getEventMainDate(event) || event.reminderAt, 'Bez terminu'),
    sortTime: sortTime(getEventMainDate(event) || event.reminderAt),
    source: event,
  }));

  const missingItems: WorkItem[] = items
    .filter((item) => item.status !== 'accepted')
    .map((item) => ({
      id: `item-${item.id}`,
      kind: 'missing',
      title: item.title || 'Brak w sprawie',
      subtitle: item.description || getItemTypeLabel(item.type),
      status: getItemStatusLabel(item.status),
      statusClass: getStatusClass(item.status),
      dateLabel: formatDate(item.dueDate, 'Bez terminu'),
      sortTime: sortTime(item.dueDate),
      source: item,
    }));

  const noteItems: WorkItem[] = activities.slice(0, 6).map((activity) => ({
    id: `activity-${activity.id}`,
    kind: 'note',
    title: getActivityText(activity),
    subtitle: typeof activity.payload?.note === 'string' ? activity.payload.note : 'Historia sprawy',
    status: 'Historia',
    statusClass: 'case-detail-pill-muted',
    dateLabel: formatDateTime(activity.createdAt, 'Brak daty'),
    sortTime: sortTime(activity.createdAt, 0),
    source: activity,
  }));

  return [...taskItems, ...eventItems, ...missingItems, ...noteItems].sort((first, second) => first.sortTime - second.sortTime);
}

function WorkKindIcon({ kind }: { kind: WorkItem['kind'] }) {
  if (kind === 'task') return <ListChecks className="h-4 w-4" />;
  if (kind === 'event') return <CalendarClock className="h-4 w-4" />;
  if (kind === 'missing') return <FileText className="h-4 w-4" />;
  return <History className="h-4 w-4" />;
}

function getWorkKindLabel(kind: WorkItem['kind']) {
  if (kind === 'task') return 'Zadanie';
  if (kind === 'event') return 'Wydarzenie';
  if (kind === 'missing') return 'Brak';
  return 'Notatka';
}

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseRecord | null>(null);
  const [items, setItems] = useState<CaseItem[]>([]);
  const [activities, setActivities] = useState<CaseActivity[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [sourceLead, setSourceLead] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CaseDetailTab>('service');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
  const [newTask, setNewTask] = useState({ title: '', type: 'follow_up', scheduledAt: '', reminderAt: '', priority: 'normal' });
  const [newEvent, setNewEvent] = useState({ title: '', type: 'meeting', startAt: '', endAt: '', reminderAt: '' });

  const refreshCaseData = useCallback(async () => {
    if (!caseId) {
      setLoadError('Brak identyfikatora sprawy w adresie.');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setLoadError('Brak konfiguracji Supabase. Sprawdź zmienne środowiskowe aplikacji.');
      setLoading(false);
      return;
    }

    let timeoutId: number | undefined;

    try {
      setLoading(true);
      setLoadError(null);
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error('TIMEOUT_CASE_DETAIL_LOAD')), 12000);
      });
      const dataPromise = Promise.all([
        fetchCaseByIdFromSupabase(caseId),
        fetchCaseItemsFromSupabase(caseId).catch(() => []),
        fetchActivitiesFromSupabase({ caseId, limit: 80 }).catch(() => []),
        fetchTasksFromSupabase().catch(() => []),
        fetchEventsFromSupabase().catch(() => []),
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
      setCaseData(null);
      setItems([]);
      setActivities([]);
      setTasks([]);
      setEvents([]);
      setLoadError(error?.message === 'TIMEOUT_CASE_DETAIL_LOAD' ? 'Ładowanie sprawy trwa za długo. Spróbuj ponownie.' : `Nie można wczytać sprawy: ${error?.message || 'REQUEST_FAILED'}`);
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

  const openTasks = useMemo(() => tasks.filter((task) => !['done', 'completed', 'cancelled'].includes(String(task.status || ''))), [tasks]);
  const plannedEvents = useMemo(() => events.filter((event) => !['done', 'completed', 'cancelled'].includes(String(event.status || ''))), [events]);
  const missingItems = useMemo(() => items.filter((item) => item.status === 'missing'), [items]);
  const uploadedItems = useMemo(() => items.filter((item) => item.status === 'uploaded'), [items]);
  const blockers = useMemo(() => items.filter((item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected')), [items]);
  const effectiveStatus = useMemo(() => resolveCaseStatusFromItems(items, caseData?.status || 'in_progress'), [caseData?.status, items]);
  const caseLifecycleV1 = useMemo(
    () =>
      resolveCaseLifecycleV1({
        status: effectiveStatus,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          status: item.status,
          isRequired: item.isRequired,
          dueDate: item.dueDate,
        })),
        tasks: tasks.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          scheduledAt: task.scheduledAt,
          dueAt: (task as any).dueAt,
          date: task.date,
        })),
        events: events.map((event) => ({
          id: event.id,
          title: event.title,
          status: event.status,
          startAt: event.startAt,
          dueAt: event.endAt,
        })),
        now: new Date(),
      }),
    [effectiveStatus, events, items, tasks],
  );
  const workItems = useMemo(() => buildWorkItems(openTasks, plannedEvents, items, activities), [activities, items, openTasks, plannedEvents]);
  const nextAction = useMemo(() => workItems.find((item) => item.kind === 'task' || item.kind === 'event' || item.kind === 'missing') || null, [workItems]);
  const lastActivityAt = caseData?.lastActivityAt || caseData?.updatedAt || activities[0]?.createdAt || caseData?.createdAt;
  const sourceLeadLabel = sourceLead ? String(sourceLead.name || sourceLead.company || 'Źródłowy lead') : caseData?.leadId ? 'Źródłowy lead podpięty' : 'Brak źródłowego leada';

  const recordActivity = async (eventType: string, payload: Record<string, any>) => {
    if (!caseId) return;
    await insertActivityToSupabase({ caseId, actorType: 'operator', eventType, payload }).catch(() => null);
  };

  const refreshStatusAfterMutation = async (nextStatus?: string) => {
    if (!caseId) return;
    const status = nextStatus || resolveCaseStatusFromItems(items, caseData?.status || 'in_progress');
    await updateCaseInSupabase({ id: caseId, status, completenessPercent: completionPercent, lastActivityAt: new Date().toISOString() }).catch(() => null);
  };

  const handleCopyPortal = async () => {
    if (!caseId) return;
    try {
      const payload = await createClientPortalTokenInSupabase(caseId);
      const url = buildPortalUrl(caseId, (payload || {}) as Record<string, unknown>);
      await navigator.clipboard.writeText(url);
      toast.success('Link do portalu skopiowany');
    } catch (error: any) {
      toast.error(`Nie udało się skopiować portalu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleAddItem = async () => {
    if (!caseId || !newItem.title.trim()) {
      toast.error('Podaj nazwę braku');
      return;
    }
    try {
      const created = await insertCaseItemToSupabase({
        caseId,
        title: newItem.title.trim(),
        description: newItem.description.trim(),
        type: newItem.type,
        isRequired: newItem.isRequired,
        dueDate: newItem.dueDate || null,
        status: 'missing',
        order: items.length + 1,
      });
      await recordActivity('item_added', { title: newItem.title.trim(), itemId: (created as any)?.id || null });
      setNewItem({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
      setIsAddItemOpen(false);
      await refreshCaseData();
      toast.success('Brak dodany do sprawy');
    } catch (error: any) {
      toast.error(`Nie udało się dodać braku: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleItemStatusChange = async (item: CaseItem, status: CaseItemStatus) => {
    if (!caseId) return;
    try {
      await updateCaseItemInSupabase({ id: item.id, caseId, status, approvedAt: status === 'accepted' ? new Date().toISOString() : null });
      await recordActivity(status === 'accepted' ? 'decision_made' : 'status_changed', { itemId: item.id, title: item.title, status });
      await refreshStatusAfterMutation();
      await refreshCaseData();
      toast.success('Status braku zmieniony');
    } catch (error: any) {
      toast.error(`Nie udało się zmienić statusu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleDeleteItem = async (item: CaseItem) => {
    if (!window.confirm('Usunąć ten brak ze sprawy?')) return;
    try {
      await deleteCaseItemFromSupabase(item.id);
      await recordActivity('item_deleted', { itemId: item.id, title: item.title });
      await refreshCaseData();
      toast.success('Brak usunięty');
    } catch (error: any) {
      toast.error(`Nie udało się usunąć braku: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleAddTask = async () => {
    if (!caseId || !newTask.title.trim()) {
      toast.error('Podaj tytuł zadania');
      return;
    }
    try {
      const scheduledAt = toIsoFromLocalInput(newTask.scheduledAt);
      const reminderAt = toIsoFromLocalInput(newTask.reminderAt);
      const created = await insertTaskToSupabase({
        caseId,
        leadId: caseData?.leadId || null,
        clientId: caseData?.clientId || null,
        title: newTask.title.trim(),
        type: newTask.type,
        date: toDateOnlyFromLocalInput(newTask.scheduledAt),
        scheduledAt: scheduledAt || null,
        dueAt: scheduledAt || null,
        reminderAt: reminderAt || null,
        priority: newTask.priority,
        status: 'todo',
      });
      await recordActivity('task_added', { title: newTask.title.trim(), taskId: (created as any)?.id || null });
      setNewTask({ title: '', type: 'follow_up', scheduledAt: '', reminderAt: '', priority: 'normal' });
      setIsAddTaskOpen(false);
      await refreshCaseData();
      toast.success('Zadanie dodane');
    } catch (error: any) {
      toast.error(`Nie udało się dodać zadania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleTaskDone = async (task: TaskRecord) => {
    try {
      await updateTaskInSupabase({ id: task.id, status: 'done' });
      await recordActivity('task_status_changed', { title: task.title, taskId: task.id, status: 'done' });
      await refreshCaseData();
      toast.success('Zrobione');
    } catch (error: any) {
      toast.error(`Nie udało się zamknąć zadania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleTaskTomorrow = async (task: TaskRecord) => {
    const nextDate = buildQuickRescheduleIso(1, getTaskMainDate(task) || task.reminderAt, 9);
    try {
      await updateTaskInSupabase({ id: task.id, scheduledAt: nextDate, dueAt: nextDate, date: buildDateOnlyFromIso(nextDate) });
      await recordActivity('task_rescheduled', { title: task.title, taskId: task.id, scheduledAt: nextDate });
      await refreshCaseData();
      toast.success('Zadanie przełożone na jutro');
    } catch (error: any) {
      toast.error(`Nie udało się przełożyć zadania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleAddEvent = async () => {
    if (!caseId || !newEvent.title.trim() || !newEvent.startAt) {
      toast.error('Podaj tytuł i start wydarzenia');
      return;
    }
    try {
      const startAt = toIsoFromLocalInput(newEvent.startAt);
      const endAt = toIsoFromLocalInput(newEvent.endAt) || addDurationToIso(startAt, 60 * 60 * 1000);
      const reminderAt = toIsoFromLocalInput(newEvent.reminderAt);
      const created = await insertEventToSupabase({
        caseId,
        leadId: caseData?.leadId || null,
        clientId: caseData?.clientId || null,
        title: newEvent.title.trim(),
        type: newEvent.type,
        startAt,
        endAt,
        reminderAt: reminderAt || null,
        status: 'scheduled',
      });
      await recordActivity('event_added', { title: newEvent.title.trim(), eventId: (created as any)?.id || null });
      setNewEvent({ title: '', type: 'meeting', startAt: '', endAt: '', reminderAt: '' });
      setIsAddEventOpen(false);
      await refreshCaseData();
      toast.success('Wydarzenie dodane');
    } catch (error: any) {
      toast.error(`Nie udało się dodać wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleEventDone = async (event: EventRecord) => {
    try {
      await updateEventInSupabase({ id: event.id, status: 'done' });
      await recordActivity('event_status_changed', { title: event.title, eventId: event.id, status: 'done' });
      await refreshCaseData();
      toast.success('Wydarzenie oznaczone jako zrobione');
    } catch (error: any) {
      toast.error(`Nie udało się zamknąć wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleEventTomorrow = async (event: EventRecord) => {
    const nextStart = buildQuickRescheduleIso(1, getEventMainDate(event) || event.reminderAt, 9);
    const nextEnd = addDurationToIso(nextStart, getEventDurationMs(event));
    try {
      await updateEventInSupabase({ id: event.id, startAt: nextStart, endAt: nextEnd });
      await recordActivity('event_rescheduled', { title: event.title, eventId: event.id, startAt: nextStart });
      await refreshCaseData();
      toast.success('Wydarzenie przełożone na jutro');
    } catch (error: any) {
      toast.error(`Nie udało się przełożyć wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleAddNote = async () => {
    if (!caseId || !newNote.trim()) {
      toast.error('Notatka nie może być pusta');
      return;
    }
    try {
      await insertActivityToSupabase({ caseId, actorType: 'operator', eventType: 'operator_note', payload: { note: newNote.trim(), title: 'Notatka' } });
      setNewNote('');
      setIsAddNoteOpen(false);
      await refreshCaseData();
      toast.success('Notatka dodana');
    } catch (error: any) {
      toast.error(`Nie udało się dodać notatki: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const setCaseLifecycleStatusV1 = async (status: string) => {
    if (!caseId) return;
    try {
      const previousStatus = caseData?.status || null;
      await updateCaseInSupabase({ id: caseId, status, lastActivityAt: new Date().toISOString() });
      await recordActivity(status === 'completed' ? 'case_lifecycle_completed' : previousStatus === 'completed' ? 'case_lifecycle_reopened' : 'case_lifecycle_started', {
        status,
        previousStatus,
        source: 'case_detail_v1_command_center',
      });
      await refreshCaseData();
      toast.success('Status sprawy zaktualizowany');
    } catch (error: any) {
      toast.error(`Nie udało się zmienić statusu sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <main className="case-detail-vnext-page">
          <section className="case-detail-loading-card">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Ładowanie sprawy...</span>
          </section>
        </main>
      </Layout>
    );
  }

  if (loadError || !caseData) {
    return (
      <Layout>
        <main className="case-detail-vnext-page">
          <section className="case-detail-empty-card">
            <AlertCircle className="h-8 w-8" />
            <h1>Nie można otworzyć sprawy</h1>
            <p>{loadError || 'Nie znaleziono tej sprawy w aktualnym workspace.'}</p>
            <Button type="button" variant="outline" onClick={() => navigate('/cases')}>
              <ArrowLeft className="h-4 w-4" />
              Wróć do spraw
            </Button>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="case-detail-vnext-page">
        <header className="case-detail-header">
          <div className="case-detail-header-copy">
            <button type="button" className="case-detail-back-button" onClick={() => navigate('/cases')}>
              <ArrowLeft className="h-4 w-4" />
              Sprawy
            </button>
            <p className="case-detail-breadcrumb">Sprawy / {getCaseTitle(caseData)}</p>
            <div className="case-detail-title-row">
              <h1>{getCaseTitle(caseData)}</h1>
              <span className={`case-detail-pill ${getStatusClass(effectiveStatus)}`}>{getCaseStatusLabel(effectiveStatus)}</span>
            </div>
            <div className="case-detail-header-meta">
              <span>Klient: {caseData.clientName || 'Brak klienta'}</span>
              <span>Ostatnia zmiana: {formatDateTime(lastActivityAt)}</span>
              <span>Źródło: {caseData.leadId ? 'Lead' : caseData.createdFromLead ? 'Lead' : 'Sprawa ręczna'}</span>
            </div>
          </div>
          <div className="case-detail-header-actions">
            <Button type="button" variant="outline" className="cf-btn-tone-portal" onClick={handleCopyPortal}>
              <Copy className="h-4 w-4" />
              Kopiuj portal
            </Button>
            <Button type="button" variant="outline" className="cf-btn-tone-gap" onClick={() => setIsAddItemOpen(true)}>
              <Paperclip className="h-4 w-4" />
              Dodaj brak
            </Button>
            <div hidden data-case-detail-stage35-removed-local-create-actions="true" />
          </div>
        </header>

        <section className="case-detail-top-grid">
          <article className="case-detail-top-card case-detail-top-card-blue">
            <div className="case-detail-card-title-row">
              <Clock className="h-4 w-4" />
              <h2>Najbliższa akcja</h2>
            </div>
            <strong>{nextAction ? nextAction.title : 'Brak zaplanowanego ruchu'}</strong>
            <p>{nextAction ? `${getWorkKindLabel(nextAction.kind)} · ${nextAction.dateLabel}` : 'Dodaj zadanie, wydarzenie albo brak, żeby sprawa miała najbliższa zaplanowana akcja.'}</p>
          </article>
          <article className="case-detail-top-card case-detail-top-card-green">
            <div className="case-detail-card-title-row">
              <CheckCircle2 className="h-4 w-4" />
              <h2>Postęp sprawy</h2>
            </div>
            <strong>{completionPercent}%</strong>
            <p>{items.length > 0 ? `${items.filter((item) => item.status === 'accepted').length} z ${items.length} elementów zaakceptowanych` : 'Brak checklisty do przeliczenia.'}</p>
            <div className="case-detail-progress"><span style={{ width: `${completionPercent}%` }} /></div>
          </article>
          <article className="case-detail-top-card case-detail-top-card-amber">
            <div className="case-detail-card-title-row">
              <AlertCircle className="h-4 w-4" />
              <h2>Blokady / braki</h2>
            </div>
            <strong>{blockers.length}</strong>
            <p>{blockers[0] ? `${blockers[0].title || 'Brak'} · ${getItemStatusLabel(blockers[0].status)}` : 'Brak aktywnych blokerów po stronie sprawy.'}</p>
          </article>
          <article className="case-detail-top-card case-detail-top-card-muted">
            <div className="case-detail-card-title-row">
              <ShieldStatusIcon status={effectiveStatus} />
              <h2>Status operacyjny</h2>
            </div>
            <strong>{getCaseStatusLabel(effectiveStatus)}</strong>
            <p>{getCaseStatusHint(effectiveStatus)}</p>
          </article>
        </section>

        <div className="case-detail-shell">
          <section className="case-detail-main-column">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CaseDetailTab)}>
              <nav aria-label="Zakładki sprawy">
                <TabsList className="case-detail-tabs">
                  {[
                    { key: 'service', label: 'Obsługa' },
                    { key: 'path', label: 'Ścieżka' },
                    { key: 'checklists', label: 'Checklisty' },
                    { key: 'history', label: 'Historia' },
                  ].map((tab) => (
                    <TabsTrigger key={tab.key} value={tab.key} className={activeTab === tab.key ? 'case-detail-tab-active' : ''}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </nav>
            </Tabs>

            {activeTab === 'service' ? (
              <section className="case-detail-section-card">
                <div className="case-detail-section-head">
                  <div>
                    <h2>Najważniejsze działania</h2>
                    <p>Zadania, wydarzenia, braki i notatki powiązane ze sprawą.</p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setIsAddNoteOpen(true)}>
                    <StickyNote className="h-4 w-4" />
                    Dodaj notatkę
                  </Button>
                </div>
                <div className="case-detail-work-list">
                  {workItems.length === 0 ? (
                    <div className="case-detail-light-empty">Brak działań do pokazania. Dodaj brak, zadanie albo wydarzenie.</div>
                  ) : (
                    workItems.map((entry) => (
                      <div key={entry.id} style={{ display: 'contents' }}>
                        <WorkItemRow
                          entry={entry}
                          onTaskDone={handleTaskDone}
                          onTaskTomorrow={handleTaskTomorrow}
                          onEventDone={handleEventDone}
                          onEventTomorrow={handleEventTomorrow}
                          onItemAccept={(item) => handleItemStatusChange(item, 'accepted')}
                          onItemReject={(item) => handleItemStatusChange(item, 'rejected')}
                          onItemDelete={handleDeleteItem}
                        />
                      </div>
                    ))
                  )}
                </div>
              </section>
            ) : null}

            {activeTab === 'path' ? (
              <section className="case-detail-section-card">
                <div className="case-detail-section-head">
                  <div>
                    <h2>Ścieżka sprawy</h2>
                    <p>Operacyjny skrót tego, co blokuje start albo realizację.</p>
                  </div>
                </div>
                <div className="case-detail-path-grid">
                  <PathCard label="Braki" value={missingItems.length} helper="Elementy, które trzeba jeszcze dostać." tone="amber" />
                  <PathCard label="Do akceptacji" value={uploadedItems.length} helper="Elementy przesłane i czekające na decyzję." tone="blue" />
                  <PathCard label="Zadania" value={openTasks.length} helper="Otwarte zadania powiązane ze sprawą." tone="green" />
                  <PathCard label="Wydarzenia" value={plannedEvents.length} helper="Zaplanowane spotkania i terminy." tone="neutral" />
                </div>
              </section>
            ) : null}

            {activeTab === 'checklists' ? (
              <section className="case-detail-section-card">
                <div className="case-detail-section-head">
                  <div>
                    <h2>Checklisty i braki</h2>
                    <p>Dokumenty, decyzje, informacje i inne rzeczy potrzebne do pracy.</p>
                  </div>
                  <Button type="button" onClick={() => setIsAddItemOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Dodaj brak
                  </Button>
                </div>
                <div className="case-detail-checklist-list">
                  {items.length === 0 ? (
                    <div className="case-detail-light-empty">Brak checklisty. Dodaj pierwszy wymagany element sprawy.</div>
                  ) : (
                    items.map((item) => (
                      <article key={item.id} className="case-detail-checklist-row">
                        <div>
                          <span className="case-detail-kind-pill">{getItemTypeLabel(item.type)}</span>
                          <h3>{item.title || 'Element sprawy'}</h3>
                          <p>{item.description || 'Bez opisu'} · Termin: {formatDate(item.dueDate)}</p>
                        </div>
                        <span className={`case-detail-pill ${getStatusClass(item.status)}`}>{getItemStatusLabel(item.status)}</span>
                        <div className="case-detail-row-actions">
                          <button type="button" onClick={() => handleItemStatusChange(item, 'uploaded')}>Wysłane</button>
                          <button type="button" onClick={() => handleItemStatusChange(item, 'accepted')}>Akceptuj</button>
                          <button type="button" onClick={() => handleItemStatusChange(item, 'rejected')}>Odrzuć</button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ) : null}

            {activeTab === 'history' ? (
              <section className="case-detail-section-card">
                <div className="case-detail-section-head">
                  <div>
                    <h2>Historia</h2>
                    <p>Krótka oś działań bez technicznych danych i bez JSON-a.</p>
                  </div>
                </div>
                <div className="case-detail-history-list">
                  {activities.length === 0 ? (
                    <div className="case-detail-light-empty">Brak historii do pokazania.</div>
                  ) : (
                    activities.map((activity) => (
                      <article key={activity.id} className="case-detail-history-row">
                        <span><History className="h-4 w-4" /></span>
                        <div>
                          <h3>{getActivityText(activity)}</h3>
                          <p>{formatDateTime(activity.createdAt)} · {activity.actorType === 'operator' ? 'Operator' : 'Klient'}</p>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ) : null}
          </section>

          <aside className="case-detail-right-rail" aria-label="Panel sprawy">
            <section className="right-card case-detail-right-card">
              <div className="case-detail-card-title-row">
                <Send className="h-4 w-4" />
                <h2>Szybkie akcje</h2>
              </div>
              <div className="case-detail-right-actions">
                <button type="button" className="cf-btn-tone-gap" onClick={() => setIsAddItemOpen(true)}>Dodaj brak</button>
                <button type="button" className="cf-btn-tone-note" onClick={() => setIsAddNoteOpen(true)}>Dodaj notatkę</button>
              </div>
            </section>

            <section className="right-card case-detail-right-card">
              <div className="case-detail-card-title-row">
                <UserRound className="h-4 w-4" />
                <h2>Klient w tle</h2>
              </div>
              <p>{caseData.clientName || 'Brak klienta'}</p>
              <small>{caseData.clientPhone || 'Brak telefonu'}</small>
              <small>{caseData.clientEmail || 'Brak e-maila'}</small>
              <div className="case-detail-right-actions case-detail-right-actions-inline">
                <button type="button" disabled={!caseData.clientId} onClick={() => navigate(`/clients/${String(caseData.clientId)}`)}>Otwórz klienta</button>
                <button type="button" disabled={!caseData.leadId} onClick={() => navigate(`/leads/${String(caseData.leadId)}`)}>Otwórz lead</button>
              </div>
            </section>

            <section className="right-card case-detail-right-card">
              <div className="case-detail-card-title-row">
                <MessageSquare className="h-4 w-4" />
                <h2>Status operacyjny</h2>
              </div>
              <div className="case-detail-right-metrics">
                <span><strong>{getCaseStatusLabel(effectiveStatus)}</strong> stan sprawy</span>
                <span><strong>{completionPercent}%</strong> gotowość</span>
                <span><strong>{openTasks.length}</strong> powiązane zadania</span>
                <span><strong>{plannedEvents.length}</strong> powiązane wydarzenia</span>
              </div>
              <p className="case-detail-right-note">{getCaseStatusHint(effectiveStatus)}</p>
              <div className="case-detail-right-actions case-detail-right-actions-inline">
                <CaseDetailV1CommandCenter
                  status={effectiveStatus}
                  lifecycle={caseLifecycleV1}
                  onSetStatus={setCaseLifecycleStatusV1}
                  onOpenAddItem={() => setIsAddItemOpen(true)}
                  onCopyPortal={handleCopyPortal}
                />
              </div>
            </section>

            <section className="right-card case-detail-right-card">
              <div className="case-detail-card-title-row">
                <ExternalLink className="h-4 w-4" />
                <h2>Portal i źródła</h2>
              </div>
              <p>{caseData.portalReady ? 'Portal klienta jest gotowy' : 'Portal można skopiować z akcji w nagłówku'}</p>
              <small>Powiązany lead: {caseData.leadId || 'Brak'}</small>
              <Button type="button" size="sm" variant="outline" className="cf-btn-tone-portal" onClick={handleCopyPortal}>Kopiuj portal</Button>
            </section>
          </aside>
        </div>

        <CaseItemDialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen} value={newItem} onChange={setNewItem} onSubmit={handleAddItem} />
        <CaseTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} value={newTask} onChange={setNewTask} onSubmit={handleAddTask} />
        <CaseEventDialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen} value={newEvent} onChange={setNewEvent} onSubmit={handleAddEvent} />
        <CaseNoteDialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen} value={newNote} onChange={setNewNote} onSubmit={handleAddNote} />
      </main>
    </Layout>
  );
}

function CaseDetailV1CommandCenter({
  status,
  lifecycle,
  onSetStatus,
  onOpenAddItem,
  onCopyPortal,
}: {
  status: string;
  lifecycle: ReturnType<typeof resolveCaseLifecycleV1>;
  onSetStatus: (status: string) => void;
  onOpenAddItem: () => void;
  onCopyPortal: () => void;
}) {
  const isCompleted = status === 'completed' || lifecycle.bucket === 'completed';

  return (
    <section className="case-detail-command-center" data-testid="case-detail-v1-command-center">
      <div className="case-detail-card-title-row">
        <FileText className="h-4 w-4" />
        <h2>Centrum dowodzenia sprawy V1</h2>
      </div>

      <div className="case-detail-command-actions">
        <button type="button" onClick={onOpenAddItem}>Dodaj brak</button>
        <button type="button" onClick={onCopyPortal}>Portal klienta</button>
      </div>

      <div className="case-detail-command-status">
        <button type="button" onClick={() => onSetStatus('in_progress')} disabled={!isCompleted && status === 'in_progress'}>
          Start
        </button>
        <button type="button" onClick={() => onSetStatus('completed')} disabled={isCompleted}>
          Zrobione
        </button>
        <button type="button" onClick={() => onSetStatus('in_progress')} disabled={!isCompleted}>
          Przywróć
        </button>
      </div>
    </section>
  );
}

function ShieldStatusIcon({ status }: { status?: string }) {
  if (status === 'blocked') return <AlertCircle className="h-4 w-4" />;
  if (status === 'completed' || status === 'ready_to_start') return <CheckCircle2 className="h-4 w-4" />;
  return <Clock className="h-4 w-4" />;
}

function PathCard({ label, value, helper, tone }: { label: string; value: number; helper: string; tone: 'amber' | 'blue' | 'green' | 'neutral' }) {
  return (
    <article className={`case-detail-path-card case-detail-path-card-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
      <p>{helper}</p>
    </article>
  );
}

function WorkItemRow({
  entry,
  onTaskDone,
  onTaskTomorrow,
  onEventDone,
  onEventTomorrow,
  onItemAccept,
  onItemReject,
  onItemDelete,
}: {
  entry: WorkItem;
  onTaskDone: (task: TaskRecord) => void;
  onTaskTomorrow: (task: TaskRecord) => void;
  onEventDone: (event: EventRecord) => void;
  onEventTomorrow: (event: EventRecord) => void;
  onItemAccept: (item: CaseItem) => void;
  onItemReject: (item: CaseItem) => void;
  onItemDelete: (item: CaseItem) => void;
}) {
  return (
    <article className="case-detail-work-row">
      <span className="case-detail-work-icon"><WorkKindIcon kind={entry.kind} /></span>
      <div className="case-detail-work-main">
        <span className="case-detail-kind-pill">{getWorkKindLabel(entry.kind)}</span>
        <h3>{entry.title}</h3>
        <p>{entry.subtitle}</p>
      </div>
      <div className="case-detail-work-date">
        <small>Termin</small>
        <strong>{entry.dateLabel}</strong>
      </div>
      <span className={`case-detail-pill ${entry.statusClass}`}>{entry.status}</span>
      <div className="case-detail-row-actions">
        {entry.kind === 'task' ? (
          <>
            <button type="button" onClick={() => onTaskDone(entry.source as TaskRecord)}>Zrobione</button>
            <button type="button" onClick={() => onTaskTomorrow(entry.source as TaskRecord)}>Jutro</button>
          </>
        ) : null}
        {entry.kind === 'event' ? (
          <>
            <button type="button" onClick={() => onEventDone(entry.source as EventRecord)}>Zrobione</button>
            <button type="button" onClick={() => onEventTomorrow(entry.source as EventRecord)}>Jutro</button>
          </>
        ) : null}
        {entry.kind === 'missing' ? (
          <>
            <button type="button" onClick={() => onItemAccept(entry.source as CaseItem)}>Akceptuj</button>
            <button type="button" onClick={() => onItemReject(entry.source as CaseItem)}>Odrzuć</button>
            <button type="button" className="case-detail-row-action-danger" onClick={() => onItemDelete(entry.source as CaseItem)}>Usuń</button>
          </>
        ) : null}
      </div>
    </article>
  );
}

function CaseItemDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; description: string; type: string; isRequired: boolean; dueDate: string };
  onChange: (value: { title: string; description: string; type: string; isRequired: boolean; dueDate: string }) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Dodaj brak</DialogTitle></DialogHeader>
        <div className="case-detail-dialog-grid">
          <label>Tytuł<Input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} placeholder="np. Umowa, skan dokumentu, decyzja" /></label>
          <label>Opis<Textarea value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} placeholder="Krótko opisz, czego brakuje." /></label>
          <label>Typ<select value={value.type} onChange={(event) => onChange({ ...value, type: event.target.value })}><option value="file">Plik</option><option value="decision">Decyzja</option><option value="text">Tekst</option></select></label>
          <label>Termin<Input type="date" value={value.dueDate} onChange={(event) => onChange({ ...value, dueDate: event.target.value })} /></label>
          <label className="case-detail-checkbox-label"><input type="checkbox" checked={value.isRequired} onChange={(event) => onChange({ ...value, isRequired: event.target.checked })} /> Wymagane do startu / realizacji</label>
        </div>
        <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button><Button type="button" className="cf-btn-tone-gap" onClick={onSubmit}>Dodaj brak</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CaseTaskDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; type: string; scheduledAt: string; reminderAt: string; priority: string };
  onChange: (value: { title: string; type: string; scheduledAt: string; reminderAt: string; priority: string }) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Dodaj zadanie</DialogTitle></DialogHeader>
        <div className="case-detail-dialog-grid">
          <label>Tytuł<Input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} placeholder="np. Oddzwonić do klienta" /></label>
          <label>Typ<Input value={value.type} onChange={(event) => onChange({ ...value, type: event.target.value })} /></label>
          <label>Termin<Input type="datetime-local" value={value.scheduledAt} onChange={(event) => onChange({ ...value, scheduledAt: event.target.value })} /></label>
          <label>Przypomnienie<Input type="datetime-local" value={value.reminderAt} onChange={(event) => onChange({ ...value, reminderAt: event.target.value })} /></label>
          <label>Priorytet<select value={value.priority} onChange={(event) => onChange({ ...value, priority: event.target.value })}><option value="low">Niski</option><option value="normal">Normalny</option><option value="high">Wysoki</option></select></label>
        </div>
        <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button><Button type="button" className="cf-btn-tone-task" onClick={onSubmit}>Dodaj zadanie</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CaseEventDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; type: string; startAt: string; endAt: string; reminderAt: string };
  onChange: (value: { title: string; type: string; startAt: string; endAt: string; reminderAt: string }) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Dodaj wydarzenie</DialogTitle></DialogHeader>
        <div className="case-detail-dialog-grid">
          <label>Tytuł<Input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} placeholder="np. Spotkanie z klientem" /></label>
          <label>Typ<Input value={value.type} onChange={(event) => onChange({ ...value, type: event.target.value })} /></label>
          <label>Start<Input type="datetime-local" value={value.startAt} onChange={(event) => onChange({ ...value, startAt: event.target.value })} /></label>
          <label>Koniec<Input type="datetime-local" value={value.endAt} onChange={(event) => onChange({ ...value, endAt: event.target.value })} /></label>
          <label>Przypomnienie<Input type="datetime-local" value={value.reminderAt} onChange={(event) => onChange({ ...value, reminderAt: event.target.value })} /></label>
        </div>
        <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button><Button type="button" className="cf-btn-tone-event" onClick={onSubmit}>Dodaj wydarzenie</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CaseNoteDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Dodaj notatkę</DialogTitle></DialogHeader>
        <div className="case-detail-dialog-grid">
          <label>Treść notatki<Textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="Krótka notatka do historii sprawy" /></label>
        </div>
        <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button><Button type="button" onClick={onSubmit}>Dodaj notatkę</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

