import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  Edit2,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Target,
  Trash2,
  CheckSquare,
  Briefcase,
  Link2,
} from 'lucide-react';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import { getLeadFinance, normalizePartialPayments } from '../lib/lead-finance';
import { EVENT_TYPES, PRIORITY_OPTIONS, TASK_TYPES } from '../lib/options';
import { isLeadMovedToService } from '../lib/lead-health';
import { getLeadNextAction } from '../lib/lead-next-action';
import { buildStartEndPair, toDateTimeLocalValue } from '../lib/scheduling';
import { buildConflictCandidates, confirmScheduleConflicts } from '../lib/schedule-conflicts';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  deleteEventFromSupabase,
  deleteLeadFromSupabase,
  deleteTaskFromSupabase,
  fetchActivitiesFromSupabase,
  fetchCasesFromSupabase,
  fetchLeadsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadByIdFromSupabase,
  fetchTasksFromSupabase,
  insertActivityToSupabase,
  insertEventToSupabase,
  insertTaskToSupabase,
  isSupabaseConfigured,
  startLeadServiceInSupabase,
  updateActivityInSupabase,
  deleteActivityFromSupabase,
  updateCaseInSupabase,
  updateEventInSupabase,
  updateLeadInSupabase,
  updateTaskInSupabase,
} from '../lib/supabase-fallback';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nowy', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Skontaktowany', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'qualification', label: 'Kwalifikacja', color: 'bg-purple-100 text-purple-700' },
  { value: 'proposal_sent', label: 'Oferta wysłana', color: 'bg-amber-100 text-amber-700' },
  { value: 'waiting_response', label: 'Czeka na odpowiedź', color: 'bg-orange-100 text-orange-700' },
  { value: 'accepted', label: 'Zaakceptowany', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'moved_to_service', label: 'Przeniesiony do obsługi', color: 'bg-violet-100 text-violet-700' },
  { value: 'negotiation', label: 'Negocjacje', color: 'bg-pink-100 text-pink-700' },
  { value: 'lost', label: 'Przegrany', color: 'bg-slate-100 text-slate-700' },
];

const SOURCE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'form', label: 'Formularz' },
  { value: 'phone', label: 'Telefon' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'other', label: 'Inne' },
];

const modalSelectClass = 'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

const SIMPLE_RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Bez powtarzania' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'weekly', label: 'Co tydzień' },
  { value: 'monthly', label: 'Co miesiąc' },
];

function toOptionalDateTimeLocal(value: unknown) {
  const parsed = asDate(value);
  return parsed ? toDateTimeLocalValue(parsed) : '';
}

function asDate(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string') {
    try {
      const parsed = value.includes('T') ? parseISO(value) : new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
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

function formatScheduleDate(value: unknown) {
  const parsed = asDate(value);
  return parsed ? format(parsed, 'd MMM yyyy HH:mm', { locale: pl }) : 'Bez terminu';
}

function taskTypeLabel(type?: string) {
  return TASK_TYPES.find((entry) => entry.value === type)?.label || 'Zadanie';
}

function eventTypeLabel(type?: string) {
  return EVENT_TYPES.find((entry) => entry.value === type)?.label || 'Wydarzenie';
}

function activityTitle(activity: any) {
  switch (activity.eventType) {
    case 'status_changed':
      return `Status: ${STATUS_OPTIONS.find((status) => status.value === activity.payload?.status)?.label || activity.payload?.status || 'Zmiana'}`;
    case 'note_added':
      return 'Notatka';
    case 'case_created':
      return 'Rozpoczęto obsługę i utworzono sprawę';
    case 'case_linked':
      return 'Podpięto istniejącą sprawę';
    
    case 'lead_moved_to_service':
      return 'Przeniesiono temat do obsługi';
    case 'task_updated':
      return 'Zaktualizowano zadanie';
    case 'task_status_toggled':
      return 'Zmieniono status zadania';
    case 'task_deleted':
      return 'Usunięto zadanie';
    case 'event_updated':
      return 'Zaktualizowano wydarzenie';
    case 'event_status_toggled':
      return 'Zmieniono status wydarzenia';
    case 'event_deleted':
      return 'Usunięto wydarzenie';
    default:
      return 'Aktywność';
  }
}

function dedupeById<T extends Record<string, unknown>>(items: T[]) {
  const map = new Map<string, T>();
  for (const item of items) {
    const key = String(item.id || '');
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }
  return [...map.values()];
}

function isLinkedThroughLeadOrCase(item: Record<string, unknown>, leadId: string, caseId?: string | null) {
  const directLeadId = String(item.leadId || '');
  const directCaseId = String(item.caseId || '');
  if (directLeadId === leadId) return true;
  if (caseId && directCaseId === caseId) return true;
  return false;
}

export default function LeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { hasAccess, workspace, workspaceReady } = useWorkspace();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [associatedCase, setAssociatedCase] = useState<any>(null);
  const [allCases, setAllCases] = useState<any[]>([]);
  const [leadOptions, setLeadOptions] = useState<any[]>([]);
  const [linkedTasks, setLinkedTasks] = useState<any[]>([]);
  const [linkedEvents, setLinkedEvents] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [createCasePending, setCreateCasePending] = useState(false);
  const [editLead, setEditLead] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [linkCaseId, setLinkCaseId] = useState('');
  const [linkingCase, setLinkingCase] = useState(false);
  const [createCaseDraft, setCreateCaseDraft] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    status: 'in_progress',
  });
  const [startServiceSuccess, setStartServiceSuccess] = useState<{ caseId: string; title: string } | null>(null);

  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const [isQuickEventOpen, setIsQuickEventOpen] = useState(false);
  const [quickTaskSubmitting, setQuickTaskSubmitting] = useState(false);
  const [quickEventSubmitting, setQuickEventSubmitting] = useState(false);
  const [linkedEntryActionId, setLinkedEntryActionId] = useState<string | null>(null);
  const [editLinkedTask, setEditLinkedTask] = useState<any | null>(null);
  const [editLinkedEvent, setEditLinkedEvent] = useState<any | null>(null);
  const [editLinkedTaskSubmitting, setEditLinkedTaskSubmitting] = useState(false);
  const [editLinkedEventSubmitting, setEditLinkedEventSubmitting] = useState(false);
  const [quickTask, setQuickTask] = useState(() => ({
    title: '',
    type: 'follow_up',
    dueAt: toDateTimeLocalValue(new Date()),
    priority: 'medium',
  }));
  const [quickEvent, setQuickEvent] = useState(() => {
    const pair = buildStartEndPair(toDateTimeLocalValue(new Date()));
    return {
      title: '',
      type: 'meeting',
      startAt: pair.startAt,
      endAt: pair.endAt,
    };
  });


  const loadLead = async () => {
    if (!leadId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const [leadRow, caseRows, taskRows, eventRows, activityRows, leadRows] = await Promise.all([
        fetchLeadByIdFromSupabase(leadId),
        fetchCasesFromSupabase(),
        fetchTasksFromSupabase(),
        fetchEventsFromSupabase(),
        fetchActivitiesFromSupabase({ leadId, limit: 100 }),
        fetchLeadsFromSupabase().catch(() => []),
      ]);

      const normalizedLead = {
        ...(leadRow as Record<string, unknown>),
        partialPayments: normalizePartialPayments((leadRow as Record<string, unknown>)?.partialPayments),
      };

      const allCaseRows = caseRows as Record<string, unknown>[];
      const currentCase = allCaseRows.find((item) => String(item.leadId || '') === leadId) || null;
      const currentCaseId = currentCase?.id ? String(currentCase.id) : null;
      const linkedTaskRows = dedupeById((taskRows as Record<string, unknown>[]).filter((item) => isLinkedThroughLeadOrCase(item, leadId, currentCaseId)));
      const linkedEventRows = dedupeById((eventRows as Record<string, unknown>[]).filter((item) => isLinkedThroughLeadOrCase(item, leadId, currentCaseId)));

      setLead(normalizedLead);
      setEditLead(normalizedLead);
      setAssociatedCase(currentCase);
      setAllCases(allCaseRows);
      setLeadOptions(leadRows as any[]);
      setLinkedTasks(linkedTaskRows);
      setLinkedEvents(linkedEventRows);
      setActivities(activityRows as any[]);
      setLinkCaseId(currentCase?.id ? String(currentCase.id) : '');
      setCreateCaseDraft({
        title: `${String((leadRow as any)?.name || 'Lead').trim() || 'Lead'} - obsługa`,
        clientName: String((leadRow as any)?.name || ''),
        clientEmail: String((leadRow as any)?.email || ''),
        clientPhone: String((leadRow as any)?.phone || ''),
        status: 'ready_to_start',
      });
    } catch (error: any) {
      const message = error?.message || 'Nie udało się pobrać danych leada';
      setLoadError(message);
      toast.error(`Błąd odczytu leada: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!leadId) return;
    if (!isSupabaseConfigured()) return;
    void loadLead();
  }, [leadId]);

  const finance = useMemo(() => getLeadFinance(lead || {}), [lead]);
  const leadMovedToService = isLeadMovedToService(lead);

  const serviceCaseId = String(startServiceSuccess?.caseId || associatedCase?.id || '');
  const serviceCaseTitle = String(startServiceSuccess?.title || associatedCase?.title || associatedCase?.clientName || 'Powiązana sprawa');
  const serviceCaseStatusLabel = String(associatedCase?.status || createCaseDraft.status || 'ready_to_start').replaceAll('_', ' ');
  const serviceMovedAtLabel = formatScheduleDate(lead?.movedToServiceAt || lead?.serviceStartedAt || associatedCase?.serviceStartedAt || associatedCase?.createdAt);
  const showServiceBanner = Boolean(startServiceSuccess || associatedCase || leadMovedToService);
  const leadOperationalArchive = Boolean(leadMovedToService || associatedCase || startServiceSuccess);

  useEffect(() => {
    if (!startServiceSuccess?.caseId) return;
    navigate(`/case/${startServiceSuccess.caseId}`);
  }, [startServiceSuccess?.caseId, navigate]);

  const scrollToHistory = () => {
    document.getElementById('lead-history')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sortedLinkedTasks = useMemo(
    () =>
      [...linkedTasks].sort((left, right) => {
        const leftTime = asDate(left.date || left.dueAt || left.updatedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const rightTime = asDate(right.date || right.dueAt || right.updatedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return leftTime - rightTime;
      }),
    [linkedTasks],
  );

  const sortedLinkedEvents = useMemo(
    () =>
      [...linkedEvents].sort((left, right) => {
        const leftTime = asDate(left.startAt || left.updatedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const rightTime = asDate(right.startAt || right.updatedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return leftTime - rightTime;
      }),
    [linkedEvents],
  );

  const availableCasesToLink = useMemo(
    () =>
      allCases.filter((item) => {
        const itemLeadId = String(item.leadId || '');
        return !itemLeadId || itemLeadId === leadId;
      }),
    [allCases, leadId],
  );
  const caseTitleById = useMemo(
    () => new Map(allCases.map((item: any) => [String(item.id || ''), String(item.title || item.clientName || 'Powiązana sprawa')])),
    [allCases],
  );

  const loadConflictCandidates = async () => {
    const [taskRows, eventRows] = await Promise.all([
      fetchTasksFromSupabase(),
      fetchEventsFromSupabase(),
    ]);
    return buildConflictCandidates({
      tasks: taskRows as any[],
      events: eventRows as any[],
      caseTitleById,
    });
  };

  const addActivity = async (eventType: string, payload: Record<string, unknown>) => {
    if (!leadId) return;
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return;
    try {
      await insertActivityToSupabase({
        leadId,
        ownerId: null,
        actorId: null,
        actorType: 'operator',
        eventType,
        payload,
        workspaceId,
      });
      const rows = await fetchActivitiesFromSupabase({ leadId, limit: 100 });
      setActivities(rows as any[]);
    } catch {
      // best effort only
    }
  };

  const patchLead = async (payload: Record<string, unknown>, successMessage?: string) => {
    if (!leadId) return;
    try {
      await updateLeadInSupabase({ id: leadId, ...payload });
      if (successMessage) toast.success(successMessage);
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zapisu: ${error?.message || 'REQUEST_FAILED'}`);
      throw error;
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (leadMovedToService) return toast.error('Temat został już przeniesiony do obsługi i nie wraca na aktywną listę leadów.');
    await patchLead({ status }, 'Status zaktualizowany');
    await addActivity('status_changed', { status });
  };

  const handleUpdateLead = async () => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!editLead) return;
    await patchLead(
      {
        name: editLead.name || '',
        company: editLead.company || '',
        email: editLead.email || '',
        phone: editLead.phone || '',
        source: editLead.source || 'other',
        dealValue: Number(editLead.dealValue) || 0,
      },
      leadMovedToService ? 'Dane źródłowe leada zaktualizowane' : 'Dane zaktualizowane',
    );
    setIsEditing(false);
  };

  const handleDeleteLead = async () => {
    if (!leadId) return;
    if (!window.confirm('Czy na pewno chcesz usunąć tego leada?')) return;
    try {
      await deleteLeadFromSupabase(leadId);
      toast.success('Lead usunięty');
      navigate('/leads');
    } catch (error: any) {
      toast.error(`Błąd usuwania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !hasAccess) return;
    await addActivity('note_added', { content: note.trim() });
    setNote('');
    toast.success('Notatka dodana');
  };

  const openEditNote = (activity: any) => {
    setEditingNote(activity);
    setEditingNoteContent(String(activity?.payload?.content || ''));
  };

  const handleSaveEditedNote = async () => {
    if (!leadId || !editingNote?.id) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    const content = editingNoteContent.trim();
    if (!content) return toast.error('Treść notatki nie może być pusta');

    try {
      await updateActivityInSupabase({
        id: String(editingNote.id),
        leadId,
        payload: {
          ...(editingNote.payload || {}),
          content,
          editedAt: new Date().toISOString(),
        },
      });
      toast.success('Notatka zaktualizowana');
      setEditingNote(null);
      setEditingNoteContent('');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd edycji notatki: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleDeleteNote = async (activityId: string) => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!window.confirm('Usunąć tę notatkę?')) return;

    try {
      await deleteActivityFromSupabase(activityId);
      toast.success('Notatka usunięta');
      if (editingNote?.id && String(editingNote.id) == activityId) {
        setEditingNote(null);
        setEditingNoteContent('');
      }
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd usuwania notatki: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };


  const resetQuickTask = () => {
    setQuickTask({
      title: '',
      type: 'follow_up',
      dueAt: toDateTimeLocalValue(new Date()),
      priority: 'medium',
    });
  };

  const resetQuickEvent = () => {
    const pair = buildStartEndPair(toDateTimeLocalValue(new Date()));
    setQuickEvent({
      title: '',
      type: 'meeting',
      startAt: pair.startAt,
      endAt: pair.endAt,
    });
  };

  const handleCreateQuickTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!leadId) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (leadOperationalArchive) return toast.error('Ten lead jest już w obsłudze. Dodawaj dalsze zadania w sprawie.');
    if (!quickTask.title.trim()) return toast.error('Podaj tytuł zadania');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    try {
      setQuickTaskSubmitting(true);
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'task',
          title: quickTask.title.trim(),
          startAt: quickTask.dueAt,
        },
        candidates: await loadConflictCandidates(),
      });
      if (!shouldSave) return;

      await insertTaskToSupabase({
        title: quickTask.title.trim(),
        type: quickTask.type,
        date: quickTask.dueAt.slice(0, 10),
        scheduledAt: quickTask.dueAt,
        priority: quickTask.priority,
        leadId,
        workspaceId,
      });
      toast.success('Zadanie dodane');
      setIsQuickTaskOpen(false);
      resetQuickTask();
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd dodawania zadania: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setQuickTaskSubmitting(false);
    }
  };

  const handleCreateQuickEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!leadId) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (leadOperationalArchive) return toast.error('Ten lead jest już w obsłudze. Dodawaj dalsze wydarzenia w sprawie.');
    if (!quickEvent.title.trim()) return toast.error('Podaj tytuł wydarzenia');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    try {
      setQuickEventSubmitting(true);
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'event',
          title: quickEvent.title.trim(),
          startAt: quickEvent.startAt,
          endAt: quickEvent.endAt,
        },
        candidates: await loadConflictCandidates(),
      });
      if (!shouldSave) return;

      await insertEventToSupabase({
        title: quickEvent.title.trim(),
        type: quickEvent.type,
        startAt: quickEvent.startAt,
        endAt: quickEvent.endAt,
        leadId,
        workspaceId,
      });
      toast.success('Wydarzenie dodane');
      setIsQuickEventOpen(false);
      resetQuickEvent();
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd dodawania wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setQuickEventSubmitting(false);
    }
  };


  const openLinkedTaskEditor = (task: any) => {
    const scheduledSource =
      task.scheduledAt
      || task.dueAt
      || (task.date ? `${task.date}T09:00` : '')
      || task.updatedAt
      || toDateTimeLocalValue(new Date());

    setEditLinkedTask({
      id: String(task.id || ''),
      title: String(task.title || ''),
      type: String(task.type || 'follow_up'),
      dueAt: toDateTimeLocalValue(asDate(scheduledSource) || new Date()),
      priority: String(task.priority || 'medium'),
      status: String(task.status || 'todo'),
      leadId: task.leadId ? String(task.leadId) : 'none',
      caseId: task.caseId ? String(task.caseId) : '',
      reminderAt: toOptionalDateTimeLocal(task.reminderAt),
      recurrenceRule: String(task.recurrenceRule || 'none'),
    });
  };

  const handleToggleLinkedTask = async (task: any) => {
    const nextStatus = String(task.status || 'todo') === 'done' ? 'todo' : 'done';
    const scheduledDate = asDate(task.date || task.dueAt || task.updatedAt) || new Date();
    const scheduledAt = toDateTimeLocalValue(scheduledDate);

    try {
      setLinkedEntryActionId(`task:${task.id}:toggle`);
      await updateTaskInSupabase({
        id: String(task.id),
        title: String(task.title || ''),
        type: String(task.type || 'follow_up'),
        date: scheduledAt.slice(0, 10),
        scheduledAt,
        priority: String(task.priority || 'medium'),
        status: nextStatus,
        leadId: task.leadId ? String(task.leadId) : null,
        caseId: task.caseId ? String(task.caseId) : null,
      });
      await addActivity('task_status_toggled', { title: String(task.title || 'Zadanie'), status: nextStatus, taskId: task.id });
      toast.success(nextStatus === 'done' ? 'Zadanie oznaczone jako zrobione' : 'Zadanie przywrócone');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zmiany statusu zadania: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };

  const handleDeleteLinkedTask = async (task: any) => {
    if (!window.confirm('Usunąć to zadanie?')) return;
    try {
      setLinkedEntryActionId(`task:${task.id}:delete`);
      await deleteTaskFromSupabase(String(task.id));
      await addActivity('task_deleted', { title: String(task.title || 'Zadanie'), taskId: task.id });
      toast.success('Zadanie usunięte');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd usuwania zadania: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };

  const openLinkedEventEditor = (event: any) => {
    const startSource = event.startAt || event.updatedAt || toDateTimeLocalValue(new Date());
    const endSource = event.endAt || event.startAt || event.updatedAt || toDateTimeLocalValue(new Date());

    setEditLinkedEvent({
      id: String(event.id || ''),
      title: String(event.title || ''),
      type: String(event.type || 'meeting'),
      startAt: toDateTimeLocalValue(asDate(startSource) || new Date()),
      endAt: toDateTimeLocalValue(asDate(endSource) || (asDate(startSource) || new Date())),
      status: String(event.status || 'scheduled'),
      leadId: event.leadId ? String(event.leadId) : 'none',
      caseId: event.caseId ? String(event.caseId) : '',
      reminderAt: toOptionalDateTimeLocal(event.reminderAt),
      recurrenceRule: String(event.recurrenceRule || 'none'),
    });
  };

  const handleToggleLinkedEvent = async (event: any) => {
    const nextStatus = String(event.status || 'scheduled') === 'completed' ? 'scheduled' : 'completed';
    const startAt = toDateTimeLocalValue(asDate(event.startAt || event.updatedAt) || new Date());
    const endAt = toDateTimeLocalValue(asDate(event.endAt || event.startAt || event.updatedAt) || new Date());

    try {
      setLinkedEntryActionId(`event:${event.id}:toggle`);
      await updateEventInSupabase({
        id: String(event.id),
        title: String(event.title || ''),
        type: String(event.type || 'meeting'),
        startAt,
        endAt,
        status: nextStatus,
        leadId: event.leadId ? String(event.leadId) : null,
        caseId: event.caseId ? String(event.caseId) : null,
      });
      await addActivity('event_status_toggled', { title: String(event.title || 'Wydarzenie'), status: nextStatus, eventId: event.id });
      toast.success(nextStatus === 'completed' ? 'Wydarzenie oznaczone jako wykonane' : 'Wydarzenie przywrócone');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zmiany statusu wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };

  const handleDeleteLinkedEvent = async (event: any) => {
    if (!window.confirm('Usunąć to wydarzenie?')) return;
    try {
      setLinkedEntryActionId(`event:${event.id}:delete`);
      await deleteEventFromSupabase(String(event.id));
      await addActivity('event_deleted', { title: String(event.title || 'Wydarzenie'), eventId: event.id });
      toast.success('Wydarzenie usunięte');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd usuwania wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkedEntryActionId(null);
    }
  };


  const handleSaveLinkedTaskEdit = async () => {
    if (!leadId || !editLinkedTask?.id) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!editLinkedTask.title?.trim()) return toast.error('Podaj tytuł zadania');

    const selectedLead = leadOptions.find((entry: any) => String(entry.id || '') === String(editLinkedTask.leadId || ''));
    const normalizedLeadId = editLinkedTask.leadId && editLinkedTask.leadId !== 'none' ? String(editLinkedTask.leadId) : null;

    try {
      setEditLinkedTaskSubmitting(true);
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'task',
          title: String(editLinkedTask.title).trim(),
          startAt: String(editLinkedTask.dueAt),
        },
        candidates: await loadConflictCandidates(),
        excludeId: String(editLinkedTask.id),
        excludeKind: 'task',
      });
      if (!shouldSave) return;

      await updateTaskInSupabase({
        id: String(editLinkedTask.id),
        title: String(editLinkedTask.title).trim(),
        type: String(editLinkedTask.type || 'follow_up'),
        date: String(editLinkedTask.dueAt).slice(0, 10),
        scheduledAt: String(editLinkedTask.dueAt),
        priority: String(editLinkedTask.priority || 'medium'),
        status: String(editLinkedTask.status || 'todo'),
        reminderAt: editLinkedTask.reminderAt ? String(editLinkedTask.reminderAt) : null,
        recurrenceRule: String(editLinkedTask.recurrenceRule || 'none'),
        leadId: normalizedLeadId,
        caseId: editLinkedTask.caseId ? String(editLinkedTask.caseId) : null,
      });
      await addActivity('task_updated', {
        title: String(editLinkedTask.title).trim(),
        taskId: editLinkedTask.id,
        leadName: selectedLead?.name || '',
      });
      setEditLinkedTask(null);
      toast.success('Zadanie zaktualizowane');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd aktualizacji zadania: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setEditLinkedTaskSubmitting(false);
    }
  };

  const handleSaveLinkedEventEdit = async () => {
    if (!leadId || !editLinkedEvent?.id) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!editLinkedEvent.title?.trim()) return toast.error('Podaj tytuł wydarzenia');

    const selectedLead = leadOptions.find((entry: any) => String(entry.id || '') === String(editLinkedEvent.leadId || ''));
    const normalizedLeadId = editLinkedEvent.leadId && editLinkedEvent.leadId !== 'none' ? String(editLinkedEvent.leadId) : null;

    try {
      setEditLinkedEventSubmitting(true);
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'event',
          title: String(editLinkedEvent.title).trim(),
          startAt: String(editLinkedEvent.startAt),
          endAt: String(editLinkedEvent.endAt),
        },
        candidates: await loadConflictCandidates(),
        excludeId: String(editLinkedEvent.id),
        excludeKind: 'event',
      });
      if (!shouldSave) return;

      await updateEventInSupabase({
        id: String(editLinkedEvent.id),
        title: String(editLinkedEvent.title).trim(),
        type: String(editLinkedEvent.type || 'meeting'),
        startAt: String(editLinkedEvent.startAt),
        endAt: String(editLinkedEvent.endAt),
        status: String(editLinkedEvent.status || 'scheduled'),
        reminderAt: editLinkedEvent.reminderAt ? String(editLinkedEvent.reminderAt) : null,
        recurrenceRule: String(editLinkedEvent.recurrenceRule || 'none'),
        leadId: normalizedLeadId,
        caseId: editLinkedEvent.caseId ? String(editLinkedEvent.caseId) : null,
      });
      await addActivity('event_updated', {
        title: String(editLinkedEvent.title).trim(),
        eventId: editLinkedEvent.id,
        leadName: selectedLead?.name || '',
      });
      setEditLinkedEvent(null);
      toast.success('Wydarzenie zaktualizowane');
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd aktualizacji wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setEditLinkedEventSubmitting(false);
    }
  };

  const handleAddPartialPayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!paymentAmount.trim()) return toast.error('Podaj kwotę wpłaty');
    const amount = Number(paymentAmount);
    if (!Number.isFinite(amount) || amount <= 0) return toast.error('Kwota musi być większa od zera');

    const nextPayments = [
      ...finance.partialPayments,
      {
        id: crypto.randomUUID(),
        amount,
        paidAt: paymentDate || undefined,
        createdAt: new Date().toISOString(),
      },
    ];

    await patchLead({ partialPayments: nextPayments }, 'Wpłata dodana');
    setPaymentAmount('');
    setPaymentDate(new Date().toISOString().slice(0, 10));
  };

  const handleLinkExistingCase = async () => {
    if (!leadId) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!linkCaseId) return toast.error('Wybierz sprawę do powiązania');

    try {
      setLinkingCase(true);
      await updateCaseInSupabase({ id: linkCaseId, leadId, createdFromLead: true, serviceStartedAt: new Date().toISOString() });
      await patchLead({
        status: 'moved_to_service',
        linkedCaseId: linkCaseId,
        movedToServiceAt: new Date().toISOString(),
        leadVisibility: 'archived',
        salesOutcome: 'moved_to_service',
        nextActionAt: null,
      });
      toast.success('Sprawa podpięta do leada');
      await addActivity('case_linked', { caseId: linkCaseId });
      setLinkCaseId('');
      setStartServiceSuccess({
        caseId: linkCaseId,
        title: String(caseTitleById.get(String(linkCaseId)) || 'Powiązana sprawa'),
      });
      await loadLead();
      navigate(`/case/${linkCaseId}`);
    } catch (error: any) {
      toast.error(`Błąd przypięcia sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkingCase(false);
    }
  };

  const handleCreateCaseFromLead = async () => {
    if (!leadId) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!createCaseDraft.title.trim()) return toast.error('Podaj tytuł sprawy');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    try {
      setCreateCasePending(true);
      const created = await startLeadServiceInSupabase({
        id: leadId,
        title: createCaseDraft.title.trim(),
        caseStatus: createCaseDraft.status,
        clientName: createCaseDraft.clientName.trim(),
        clientEmail: createCaseDraft.clientEmail.trim(),
        clientPhone: createCaseDraft.clientPhone.trim(),
        workspaceId,
      });
      const caseId = String((created as any)?.case?.id || '');
      toast.success('Temat został przeniesiony do obsługi');
      setIsCreateCaseOpen(false);
      setStartServiceSuccess({
        caseId,
        title: String((created as any)?.case?.title || createCaseDraft.title.trim()),
      });
      await loadLead();
      if (caseId) {
        navigate(`/case/${caseId}`);
      }
    } catch (error: any) {
      toast.error(`Błąd tworzenia sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setCreateCasePending(false);
    }
  };


  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (loadError || !lead) {
    return (
      <Layout>
        <div className="p-6 max-w-3xl mx-auto w-full">
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-700">Nie udało się otworzyć leada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 break-words">{loadError || 'Lead nie istnieje albo nie został jeszcze zsynchronizowany.'}</p>
              <div className="flex gap-2">
                <Button onClick={() => void loadLead()}>Spróbuj ponownie</Button>
                <Button variant="outline" asChild>
                  <Link to="/leads">Wróć do listy</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const currentStatus = STATUS_OPTIONS.find((status) => status.value === lead.status)
    || (lead.status === 'moved_to_service'
      ? { value: 'moved_to_service', label: 'Przeniesiony do obsługi', color: 'bg-violet-100 text-violet-700' }
      : STATUS_OPTIONS[0]);
  const nextAction = getLeadNextAction(sortedLinkedTasks, sortedLinkedEvents);
  const nextActionDate = asDate(nextAction?.when);
  const updatedAt = asDate(lead.updatedAt);
  const nextActionOverdue = Boolean(nextActionDate && isPast(nextActionDate) && !isToday(nextActionDate));

  return (
    <Layout>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/leads" className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 break-words">{lead.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${currentStatus.color} border-none text-[10px] uppercase font-bold h-5`}>{currentStatus.label}</Badge>
                {lead.isAtRisk && (
                  <Badge variant="destructive" className="text-[10px] uppercase font-bold h-5 animate-pulse">
                    Zagrożony
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!leadMovedToService ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edytuj dane
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteLead} className="text-rose-600">
                    <Trash2 className="w-4 h-4 mr-2" /> Usuń leada
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            {associatedCase?.id ? (
              <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20" asChild>
                <Link to={`/case/${associatedCase.id}`}>
                  <Briefcase className="w-4 h-4" /> Otwórz sprawę
                </Link>
              </Button>
            ) : !leadMovedToService ? (
              <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20" onClick={() => setIsCreateCaseOpen(true)}>
                <Briefcase className="w-4 h-4" /> Rozpocznij obsługę
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-emerald-50 p-3 rounded-2xl">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wartość</p>
                    <p className="text-lg font-bold text-slate-900">{(Number(lead.dealValue) || 0).toLocaleString()} PLN</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-2xl">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Źródło</p>
                    <p className="text-lg font-bold text-slate-900 break-words">{SOURCE_OPTIONS.find((item) => item.value === lead.source)?.label || 'Inne'}</p>
                  </div>
                </CardContent>
              </Card>
              {!leadMovedToService ? (
                <Card className="border-none shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-amber-50 p-3 rounded-2xl">
                      <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Najbliższa akcja</p>
                      <p className={`text-lg font-bold ${nextActionOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                        {nextActionDate ? format(nextActionDate, 'd MMM HH:mm', { locale: pl }) : 'Brak zaplanowanych działań'}
                      </p>
                      {nextAction ? (
                        <p className="text-sm text-slate-500">{nextAction.kind === 'task' ? 'Zadanie' : 'Wydarzenie'}: {nextAction.title}</p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            {showServiceBanner ? (
              <Card className="border-violet-200 bg-violet-50/70 shadow-sm">
                <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="border-none bg-violet-600 text-white">Ten temat jest już w obsłudze</Badge>
                      {serviceCaseTitle ? (
                        <span className="text-sm font-semibold text-violet-900">Sprawa: {serviceCaseTitle}</span>
                      ) : null}
                    </div>
                    <p className="text-sm text-violet-900">To już historia pozyskania. Dalsza praca dzieje się w sprawie.</p>
                    <p className="text-sm text-violet-800">Status sprawy: {serviceCaseStatusLabel}</p>
                    <p className="text-xs text-violet-700">Data przejścia: {serviceMovedAtLabel}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {serviceCaseId ? (
                      <Button asChild variant="outline" className="border-violet-300 bg-white text-violet-900 hover:bg-violet-100">
                        <Link to={`/case/${serviceCaseId}`}>Otwórz sprawę</Link>
                      </Button>
                    ) : null}
                    <Button variant="outline" className="border-violet-300 bg-white text-violet-900 hover:bg-violet-100" onClick={scrollToHistory}>
                      Zobacz historię przejścia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-12 p-0 gap-8">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 font-bold">
                  {leadMovedToService ? 'Historia pozyskania' : 'Przegląd'}
                </TabsTrigger>
                {!leadMovedToService ? (
                  <TabsTrigger value="finance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 font-bold">
                    Finanse
                  </TabsTrigger>
                ) : null}
                {!leadMovedToService ? (
                  <TabsTrigger value="realization" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 font-bold">
                    Realizacja
                  </TabsTrigger>
                ) : null}
              </TabsList>

              <TabsContent value="overview" className="pt-6 space-y-8">
                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Informacje kontaktowe</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-mail</p>
                          <p className="text-sm font-medium break-words">{lead.email || 'Brak'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telefon</p>
                          <p className="text-sm font-medium break-words">{lead.phone || 'Brak'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Firma</p>
                          <p className="text-sm font-medium break-words">{lead.company || 'Brak'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ostatnia aktualizacja</p>
                          <p className="text-sm font-medium">{updatedAt ? format(updatedAt, 'd MMMM HH:mm', { locale: pl }) : '-'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {!leadMovedToService ? (
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Ocena tematu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">
                          Najbliższa akcja jest liczona automatycznie z zadań i wydarzeń przypiętych do tego tematu. Nie ustawiasz już ręcznego kolejnego kroku.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
                        <input
                          type="checkbox"
                          checked={Boolean(lead.isAtRisk)}
                          onChange={(e) => {
                            void patchLead({ isAtRisk: e.target.checked }, 'Zapisano status ryzyka');
                          }}
                          className="w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                        />
                        <Label className="text-rose-700 font-bold">Oznacz jako zagrożony (wymaga natychmiastowej uwagi)</Label>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                {!leadMovedToService ? (
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Powiązane elementy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Zadania</p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">{sortedLinkedTasks.length}</p>
                          <p className="mt-1 text-sm text-slate-500">Widać tu zadania podpięte bezpośrednio do leada oraz zadania przypięte do powiązanej sprawy.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Wydarzenia</p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">{sortedLinkedEvents.length}</p>
                          <p className="mt-1 text-sm text-slate-500">Widać tu wydarzenia podpięte bezpośrednio do leada oraz wydarzenia przypięte do powiązanej sprawy.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sprawa</p>
                          <p className="mt-2 text-lg font-bold text-slate-900 break-words">{associatedCase?.title || 'Brak podpiętej sprawy'}</p>
                          <p className="mt-1 text-sm text-slate-500">Lead może być źródłem sprawy operacyjnej.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <CheckSquare className="w-4 h-4 text-slate-400" />
                              <h3 className="text-sm font-bold text-slate-900">Zadania leada</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => {
                          if (leadOperationalArchive) {
                            toast.error('Ten lead jest już w obsłudze. Dodawaj dalsze zadania w sprawie.');
                            return;
                          }
                          setIsQuickTaskOpen(true);
                        }}>
                                <Plus className="w-4 h-4 mr-2" /> Dodaj
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link to="/tasks">Otwórz zadania</Link>
                              </Button>
                            </div>
                          </div>
                          {sortedLinkedTasks.length === 0 ? (
                            <p className="text-sm text-slate-500">Brak zadań powiązanych z tym leadem.</p>
                          ) : (
                            <div className="space-y-2">
                              {sortedLinkedTasks.slice(0, 6).map((task: any) => (
                                <div key={task.id} className="rounded-xl border border-slate-200 px-3 py-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-slate-900 break-words">{task.title || 'Zadanie bez tytułu'}</p>
                                      <p className="text-xs text-slate-500 break-words">{taskTypeLabel(task.type)} • {formatScheduleDate(task.date || task.dueAt)}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                                      <Badge variant={task.status === 'done' ? 'secondary' : 'outline'}>{task.status === 'done' ? 'Zrobione' : 'Aktywne'}</Badge>
                                      {associatedCase?.id && String(task.caseId || '') === String(associatedCase.id) && String(task.leadId || '') !== String(leadId || '') ? (
                                        <Badge variant="outline">Ze sprawy</Badge>
                                      ) : null}
                                      <Button variant="ghost" size="sm" onClick={() => openLinkedTaskEditor(task)}>
                                        Edytuj
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={() => void handleToggleLinkedTask(task)} disabled={linkedEntryActionId === `task:${task.id}:toggle`}>
                                        {linkedEntryActionId === `task:${task.id}:toggle` ? '...' : task.status === 'done' ? 'Przywróć' : 'Zrób'}
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={() => void handleDeleteLinkedTask(task)} disabled={linkedEntryActionId === `task:${task.id}:delete`}>
                                        {linkedEntryActionId === `task:${task.id}:delete` ? '...' : 'Usuń'}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <h3 className="text-sm font-bold text-slate-900">Wydarzenia leada</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => {
                          if (leadOperationalArchive) {
                            toast.error('Ten lead jest już w obsłudze. Dodawaj dalsze wydarzenia w sprawie.');
                            return;
                          }
                          setIsQuickEventOpen(true);
                        }}>
                                <Plus className="w-4 h-4 mr-2" /> Dodaj
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link to="/calendar">Otwórz kalendarz</Link>
                              </Button>
                            </div>
                          </div>
                          {sortedLinkedEvents.length === 0 ? (
                            <p className="text-sm text-slate-500">Brak wydarzeń powiązanych z tym leadem.</p>
                          ) : (
                            <div className="space-y-2">
                              {sortedLinkedEvents.slice(0, 6).map((event: any) => (
                                <div key={event.id} className="rounded-xl border border-slate-200 px-3 py-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-slate-900 break-words">{event.title || 'Wydarzenie bez tytułu'}</p>
                                      <p className="text-xs text-slate-500 break-words">{eventTypeLabel(event.type)} • {formatScheduleDate(event.startAt)}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                                      <Badge variant={event.status === 'completed' ? 'secondary' : 'outline'}>{event.status === 'completed' ? 'Zrobione' : 'Zaplanowane'}</Badge>
                                      {associatedCase?.id && String(event.caseId || '') === String(associatedCase.id) && String(event.leadId || '') !== String(leadId || '') ? (
                                        <Badge variant="outline">Ze sprawy</Badge>
                                      ) : null}
                                      <Button variant="ghost" size="sm" onClick={() => openLinkedEventEditor(event)}>
                                        Edytuj
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={() => void handleToggleLinkedEvent(event)} disabled={linkedEntryActionId === `event:${event.id}:toggle`}>
                                        {linkedEntryActionId === `event:${event.id}:toggle` ? '...' : event.status === 'completed' ? 'Przywróć' : 'Wykonaj'}
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={() => void handleDeleteLinkedEvent(event)} disabled={linkedEntryActionId === `event:${event.id}:delete`}>
                                        {linkedEntryActionId === `event:${event.id}:delete` ? '...' : 'Usuń'}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Powiązana sprawa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-600">Po pozyskaniu dalsza praca odbywa się na sprawie. Ten lead pozostaje historią i źródłem.</p>
                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sprawa</p>
                        <p className="mt-1 text-base font-semibold text-slate-900 break-words">{serviceCaseTitle}</p>
                        <p className="mt-2 text-sm text-slate-600">Status sprawy: {serviceCaseStatusLabel}</p>
                        <p className="text-sm text-slate-600">Data przejścia: {serviceMovedAtLabel}</p>
                        {serviceCaseId ? (
                          <Button className="mt-3" variant="outline" asChild>
                            <Link to={`/case/${serviceCaseId}`}>Otwórz sprawę</Link>
                          </Button>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="finance" className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500">Suma wpłat</p>
                      <p className="text-2xl font-bold text-emerald-600">{finance.paidAmount.toLocaleString()} PLN</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500">Pozostało</p>
                      <p className="text-2xl font-bold text-amber-600">{finance.remainingAmount.toLocaleString()} PLN</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500">Wartość całkowita</p>
                      <p className="text-2xl font-bold text-slate-900">{(Number(lead.dealValue) || 0).toLocaleString()} PLN</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Dodaj wpłatę częściową</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleAddPartialPayment}>
                      <Input type="number" min="0" step="0.01" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Kwota (PLN)" />
                      <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" /> Dodaj wpłatę
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Historia wpłat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {finance.partialPayments.length === 0 ? (
                      <p className="text-sm text-slate-500">Brak wpłat częściowych.</p>
                    ) : (
                      <div className="space-y-2">
                        {finance.partialPayments.map((payment) => {
                          const paymentDateValue = payment.paidAt || payment.createdAt;
                          const parsed = asDate(paymentDateValue);
                          return (
                            <div key={payment.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                              <span className="text-sm text-slate-600">{parsed ? format(parsed, 'd MMM yyyy', { locale: pl }) : '-'}</span>
                              <span className="font-semibold text-slate-900">{payment.amount.toLocaleString()} PLN</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="realization" className="pt-6 space-y-6">
                <Card className="border-none shadow-sm bg-slate-50">
                  <CardContent className="p-5 space-y-2">
                    <p className="text-sm font-semibold text-slate-900">Jak rozumieć sprawę</p>
                    <p className="text-sm text-slate-600">
                      Lead służy do domykania sprzedaży. Sprawa zaczyna się wtedy, gdy klient przechodzi już do realnej obsługi i trzeba prowadzić wykonanie.
                    </p>
                    <p className="text-sm text-slate-600">
                      Najprościej: najpierw prowadzisz leada zadaniami i wydarzeniami, a gdy wchodzisz w realizację, tworzysz z niego sprawę.
                    </p>
                  </CardContent>
                </Card>

                {associatedCase ? (
                  <Card className="border-none shadow-sm border-l-4 border-l-emerald-500">
                    <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 break-words">{associatedCase.title || 'Sprawa aktywna'}</h4>
                        <p className="text-sm text-slate-500">Temat jest już w obsłudze operacyjnej.</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button className="rounded-xl gap-2" asChild>
                          <Link to={`/case/${associatedCase.id}`}>
                            Przejdź do sprawy <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Brak aktywnej sprawy</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                      Gdy klient przechodzi z etapu sprzedaży do realizacji, utwórz z leada sprawę albo podepnij istniejącą.
                    </p>
                    <Button className="rounded-xl" onClick={() => setIsCreateCaseOpen(true)}>
                      <Briefcase className="w-4 h-4 mr-2" /> Rozpocznij obsługę
                    </Button>
                  </div>
                )}

                {availableCasesToLink.length > 0 && !associatedCase ? (
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-slate-400" />
                        Podepnij istniejącą sprawę
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-500">Tu przypniesz istniejącą sprawę do tego tematu. Po zapisaniu lead przejdzie do historii obsługi.</p>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                        <select
                          className={modalSelectClass}
                          value={linkCaseId}
                          onChange={(e) => setLinkCaseId(e.target.value)}
                        >
                          <option value="">Wybierz sprawę</option>
                          {availableCasesToLink.map((caseRecord: any) => (
                            <option key={caseRecord.id} value={String(caseRecord.id)}>
                              {caseRecord.title || 'Sprawa bez tytułu'}
                            </option>
                          ))}
                        </select>
                        <Button onClick={() => void handleLinkExistingCase()} disabled={!linkCaseId || linkingCase}>
                          <Briefcase className="w-4 h-4 mr-2" />
                          {linkingCase ? 'Podpinanie...' : 'Podepnij sprawę'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            <Card id="lead-history" className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Historia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!leadMovedToService ? (
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <Textarea
                      placeholder="Dodaj notatkę z rozmowy..."
                      className="rounded-xl bg-slate-50 border-none resize-none min-h-[100px]"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <Button type="submit" className="w-full rounded-xl" disabled={!note.trim()}>
                      Dodaj notatkę
                    </Button>
                  </form>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    Ten widok pokazuje historię pozyskania. Dalsze notatki dodawaj już na sprawie.
                  </div>
                )}
                <div className="space-y-2 max-h-[500px] overflow-auto pr-2">
                  {activities.length === 0 ? (
                    <p className="text-sm text-slate-500">Brak aktywności.</p>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="rounded-xl border border-slate-200 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{activityTitle(activity)}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            {activity.eventType === 'note_added' && !leadMovedToService ? (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-lg text-slate-500 hover:text-slate-700"
                                  onClick={() => openEditNote(activity)}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-lg text-rose-500 hover:text-rose-700"
                                  onClick={() => void handleDeleteNote(String(activity.id))}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            ) : null}
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">
                              {asDate(activity.createdAt) ? format(asDate(activity.createdAt)!, 'd MMM HH:mm', { locale: pl }) : ''}
                            </span>
                          </div>
                        </div>
                        {activity.payload?.title ? <p className="text-sm text-slate-600 mt-1 break-words">{String(activity.payload.title)}</p> : null}
                        {activity.payload?.content ? <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-words">{String(activity.payload.content)}</p> : null}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>


      <Dialog open={isQuickTaskOpen} onOpenChange={setIsQuickTaskOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Dodaj szybkie zadanie dla leada</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateQuickTask} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tytuł zadania</Label>
              <Input value={quickTask.title} onChange={(e) => setQuickTask((prev) => ({ ...prev, title: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Typ</Label>
                <select
                  className={modalSelectClass}
                  value={quickTask.type}
                  onChange={(e) => setQuickTask((prev) => ({ ...prev, type: e.target.value }))}
                >
                  {TASK_TYPES.map((taskType) => (
                    <option key={taskType.value} value={taskType.value}>
                      {taskType.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Priorytet</Label>
                <select
                  className={modalSelectClass}
                  value={quickTask.priority}
                  onChange={(e) => setQuickTask((prev) => ({ ...prev, priority: e.target.value }))}
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data i godzina</Label>
              <Input type="datetime-local" value={quickTask.dueAt} onChange={(e) => setQuickTask((prev) => ({ ...prev, dueAt: e.target.value }))} required />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsQuickTaskOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit" disabled={quickTaskSubmitting || !workspaceReady}>
                {quickTaskSubmitting ? 'Dodawanie...' : 'Dodaj zadanie'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isQuickEventOpen} onOpenChange={setIsQuickEventOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Dodaj szybkie wydarzenie dla leada</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateQuickEvent} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tytuł wydarzenia</Label>
              <Input value={quickEvent.title} onChange={(e) => setQuickEvent((prev) => ({ ...prev, title: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Typ</Label>
              <select
                className={modalSelectClass}
                value={quickEvent.type}
                onChange={(e) => setQuickEvent((prev) => ({ ...prev, type: e.target.value }))}
              >
                {EVENT_TYPES.map((eventType) => (
                  <option key={eventType.value} value={eventType.value}>
                    {eventType.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start</Label>
                <Input
                  type="datetime-local"
                  value={quickEvent.startAt}
                  onChange={(e) => {
                    const nextStart = e.target.value;
                    const pair = buildStartEndPair(nextStart);
                    setQuickEvent((prev) => ({ ...prev, startAt: nextStart, endAt: pair.endAt }));
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Koniec</Label>
                <Input type="datetime-local" value={quickEvent.endAt} onChange={(e) => setQuickEvent((prev) => ({ ...prev, endAt: e.target.value }))} required />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsQuickEventOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit" disabled={quickEventSubmitting || !workspaceReady}>
                {quickEventSubmitting ? 'Dodawanie...' : 'Dodaj wydarzenie'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      <Dialog open={Boolean(editLinkedTask)} onOpenChange={(open) => {
        if (!open) setEditLinkedTask(null);
      }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edytuj zadanie leada</DialogTitle>
          </DialogHeader>
          {editLinkedTask ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Tytuł zadania</Label>
                <Input value={editLinkedTask.title} onChange={(e) => setEditLinkedTask((prev: any) => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Typ</Label>
                  <select className={modalSelectClass} value={editLinkedTask.type} onChange={(e) => setEditLinkedTask((prev: any) => ({ ...prev, type: e.target.value }))}>
                    {TASK_TYPES.map((taskType) => (
                      <option key={taskType.value} value={taskType.value}>{taskType.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Priorytet</Label>
                  <select className={modalSelectClass} value={editLinkedTask.priority} onChange={(e) => setEditLinkedTask((prev: any) => ({ ...prev, priority: e.target.value }))}>
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data i godzina</Label>
                  <Input type="datetime-local" value={editLinkedTask.dueAt} onChange={(e) => setEditLinkedTask((prev: any) => ({ ...prev, dueAt: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Lead</Label>
                  <select className={modalSelectClass} value={editLinkedTask.leadId} onChange={(e) => setEditLinkedTask((prev: any) => ({ ...prev, leadId: e.target.value }))}>
                    <option value="none">Bez leada</option>
                    {leadOptions.map((leadEntry: any) => (
                      <option key={leadEntry.id} value={String(leadEntry.id)}>{leadEntry.name || 'Lead bez nazwy'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Przypomnienie</Label>
                  <Input type="datetime-local" value={editLinkedTask.reminderAt || ''} onChange={(e) => setEditLinkedTask((prev: any) => ({ ...prev, reminderAt: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Powtarzanie</Label>
                  <select className={modalSelectClass} value={editLinkedTask.recurrenceRule || 'none'} onChange={(e) => setEditLinkedTask((prev: any) => ({ ...prev, recurrenceRule: e.target.value }))}>
                    {SIMPLE_RECURRENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLinkedTask(null)}>Anuluj</Button>
            <Button onClick={() => void handleSaveLinkedTaskEdit()} disabled={editLinkedTaskSubmitting}>
              {editLinkedTaskSubmitting ? 'Zapisywanie...' : 'Zapisz zadanie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editLinkedEvent)} onOpenChange={(open) => {
        if (!open) setEditLinkedEvent(null);
      }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edytuj wydarzenie leada</DialogTitle>
          </DialogHeader>
          {editLinkedEvent ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Tytuł wydarzenia</Label>
                <Input value={editLinkedEvent.title} onChange={(e) => setEditLinkedEvent((prev: any) => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Typ</Label>
                <select className={modalSelectClass} value={editLinkedEvent.type} onChange={(e) => setEditLinkedEvent((prev: any) => ({ ...prev, type: e.target.value }))}>
                  {EVENT_TYPES.map((eventType) => (
                    <option key={eventType.value} value={eventType.value}>{eventType.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input type="datetime-local" value={editLinkedEvent.startAt} onChange={(e) => setEditLinkedEvent((prev: any) => ({ ...prev, startAt: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Koniec</Label>
                  <Input type="datetime-local" value={editLinkedEvent.endAt} onChange={(e) => setEditLinkedEvent((prev: any) => ({ ...prev, endAt: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lead</Label>
                  <select className={modalSelectClass} value={editLinkedEvent.leadId} onChange={(e) => setEditLinkedEvent((prev: any) => ({ ...prev, leadId: e.target.value }))}>
                    <option value="none">Bez leada</option>
                    {leadOptions.map((leadEntry: any) => (
                      <option key={leadEntry.id} value={String(leadEntry.id)}>{leadEntry.name || 'Lead bez nazwy'}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className={modalSelectClass} value={editLinkedEvent.status} onChange={(e) => setEditLinkedEvent((prev: any) => ({ ...prev, status: e.target.value }))}>
                    <option value="scheduled">Zaplanowane</option>
                    <option value="completed">Wykonane</option>
                    <option value="cancelled">Anulowane</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Przypomnienie</Label>
                  <Input type="datetime-local" value={editLinkedEvent.reminderAt || ''} onChange={(e) => setEditLinkedEvent((prev: any) => ({ ...prev, reminderAt: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Powtarzanie</Label>
                  <select className={modalSelectClass} value={editLinkedEvent.recurrenceRule || 'none'} onChange={(e) => setEditLinkedEvent((prev: any) => ({ ...prev, recurrenceRule: e.target.value }))}>
                    {SIMPLE_RECURRENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLinkedEvent(null)}>Anuluj</Button>
            <Button onClick={() => void handleSaveLinkedEventEdit()} disabled={editLinkedEventSubmitting}>
              {editLinkedEventSubmitting ? 'Zapisywanie...' : 'Zapisz wydarzenie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingNote)} onOpenChange={(open) => {
        if (!open) {
          setEditingNote(null);
          setEditingNoteContent('');
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edytuj notatkę</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Treść notatki</Label>
            <Textarea
              value={editingNoteContent}
              onChange={(e) => setEditingNoteContent(e.target.value)}
              className="min-h-[140px]"
              placeholder="Treść notatki"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingNote(null);
                setEditingNoteContent('');
              }}
            >
              Anuluj
            </Button>
            <Button onClick={() => void handleSaveEditedNote()}>
              Zapisz notatkę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj leada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nazwa</Label>
              <Input value={editLead?.name || ''} onChange={(e) => setEditLead({ ...editLead, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Firma</Label>
              <Input value={editLead?.company || ''} onChange={(e) => setEditLead({ ...editLead, company: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editLead?.email || ''} onChange={(e) => setEditLead({ ...editLead, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input value={editLead?.phone || ''} onChange={(e) => setEditLead({ ...editLead, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Wartość</Label>
                <Input type="number" value={editLead?.dealValue || ''} onChange={(e) => setEditLead({ ...editLead, dealValue: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Źródło</Label>
                <select
                  className={modalSelectClass}
                  value={editLead?.source || 'other'}
                  onChange={(e) => setEditLead({ ...editLead, source: e.target.value })}
                >
                  {SOURCE_OPTIONS.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Anuluj
            </Button>
            <Button onClick={() => void handleUpdateLead()}>Zapisz zmiany</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateCaseOpen} onOpenChange={setIsCreateCaseOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Rozpocząć obsługę tego tematu?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p>Z tego leada zostanie utworzona sprawa.</p>
              <p>Lead nie zniknie.</p>
              <p>Zostanie przeniesiony do historii sprzedażowej.</p>
              <p>Dalej będzie widoczny jako źródło pozyskania tego tematu.</p>
            </div>
            <div className="space-y-2">
              <Label>Tytuł sprawy</Label>
              <Input value={createCaseDraft.title} onChange={(e) => setCreateCaseDraft((prev) => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Nazwa klienta</Label>
              <Input value={createCaseDraft.clientName} onChange={(e) => setCreateCaseDraft((prev) => ({ ...prev, clientName: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail klienta</Label>
                <Input value={createCaseDraft.clientEmail} onChange={(e) => setCreateCaseDraft((prev) => ({ ...prev, clientEmail: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Telefon klienta</Label>
                <Input value={createCaseDraft.clientPhone} onChange={(e) => setCreateCaseDraft((prev) => ({ ...prev, clientPhone: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status startowy sprawy</Label>
              <select
                className={modalSelectClass}
                value={createCaseDraft.status}
                onChange={(e) => setCreateCaseDraft((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="ready_to_start">Gotowa do startu</option>
                <option value="in_progress">W toku</option>
                <option value="waiting_on_client">Czeka na klienta</option>
                <option value="blocked">Zablokowana</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCaseOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={() => void handleCreateCaseFromLead()} disabled={createCasePending || !workspaceReady}>
              {createCasePending ? 'Rozpoczynanie...' : 'Rozpocznij obsługę'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}





