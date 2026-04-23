import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  ArrowLeft,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MoreVertical,
  Trash2,
  Check,
  X,
  ExternalLink,
  Copy,
  History,
  Paperclip,
  MessageSquare,
  Loader2,
  Link2,
  Unlink,
  UserRound,
  Mail,
  Phone,
  Target,
  Calendar,
  Edit2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { ScrollArea } from '../components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Layout from '../components/Layout';
import { buildConflictCandidates, confirmScheduleConflicts } from '../lib/schedule-conflicts';
import {
  createClientPortalTokenInSupabase,
  deleteCaseItemFromSupabase,
  deleteEventFromSupabase,
  deleteTaskFromSupabase,
  fetchActivitiesFromSupabase,
  fetchCaseByIdFromSupabase,
  fetchCaseItemsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadByIdFromSupabase,
  fetchLeadsFromSupabase,
  fetchCasesFromSupabase,
  fetchTasksFromSupabase,
  insertActivityToSupabase,
  insertCaseItemToSupabase,
  insertEventToSupabase,
  insertTaskToSupabase,
  updateActivityInSupabase,
  deleteActivityFromSupabase,
  updateCaseInSupabase,
  updateCaseItemInSupabase,
  updateEventInSupabase,
  updateLeadInSupabase,
  updateTaskInSupabase,
} from '../lib/supabase-fallback';

function formatDateTime(value: any) {
  if (!value) return 'Brak';
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'Brak' : parsed.toLocaleString();
  }
  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  return 'Brak';
}

function computeCaseState(items: any[], currentStatus?: string) {
  if (!items.length) {
    return {
      completenessPercent: 0,
      status: currentStatus === 'completed' ? 'completed' : currentStatus === 'in_progress' ? 'in_progress' : 'in_progress',
    };
  }

  const completed = items.filter((entry) => entry.status === 'accepted').length;
  const completenessPercent = (completed / items.length) * 100;
  const hasBlocked = items.some((entry) => entry.isRequired && (entry.status === 'missing' || entry.status === 'rejected'));
  const hasToApprove = items.some((entry) => entry.status === 'uploaded');
  const requiredItems = items.filter((entry) => entry.isRequired);
  const acceptedRequired = requiredItems.filter((entry) => entry.status === 'accepted').length;
  const allRequiredAccepted = requiredItems.length > 0
    ? acceptedRequired === requiredItems.length
    : items.every((entry) => entry.status === 'accepted');

  let status = 'waiting_on_client';

  if (currentStatus === 'completed') {
    status = 'completed';
  } else if (hasBlocked) {
    status = 'blocked';
  } else if (hasToApprove) {
    status = 'to_approve';
  } else if (allRequiredAccepted) {
    status = currentStatus === 'in_progress' ? 'in_progress' : 'ready_to_start';
  } else if (currentStatus === 'in_progress') {
    status = 'in_progress';
  }

  return {
    completenessPercent,
    status,
  };
}

function leadStatusLabel(status?: string) {
  switch (status) {
    case 'new':
      return 'Nowy';
    case 'contacted':
      return 'Skontaktowany';
    case 'qualification':
      return 'Kwalifikacja';
    case 'proposal_sent':
      return 'Oferta wysłana';
    case 'waiting_response':
      return 'Follow-up';
    case 'accepted':
      return 'Zaakceptowany';
    case 'accepted_waiting_start':
      return 'Zaakceptowany, czeka na start';
    case 'active_service':
      return 'Obsługa aktywna';
    case 'negotiation':
      return 'Negocjacje';
    case 'won':
      return 'Wygrany';
    case 'lost':
      return 'Przegrany';
    default:
      return 'Lead';
  }
}

function leadSourceLabel(source?: string) {
  switch (source) {
    case 'instagram':
      return 'Instagram';
    case 'facebook':
      return 'Facebook';
    case 'messenger':
      return 'Messenger';
    case 'whatsapp':
      return 'WhatsApp';
    case 'email':
      return 'E-mail';
    case 'form':
      return 'Formularz';
    case 'phone':
      return 'Telefon';
    case 'referral':
      return 'Polecenie';
    case 'cold_outreach':
      return 'Cold Outreach';
    default:
      return 'Inne';
  }
}

function caseStatusLabel(status?: string) {
  switch (status) {
    case 'new':
      return 'Nowa';
    case 'waiting_on_client':
      return 'Czeka na klienta';
    case 'to_approve':
      return 'Do akceptacji';
    case 'ready_to_start':
      return 'Gotowa do startu';
    case 'in_progress':
      return 'W realizacji';
    case 'blocked':
      return 'Zablokowana';
    case 'completed':
      return 'Zakończona';
    default:
      return 'W realizacji';
  }
}

function toDateTimeLocalValue(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildDefaultEventEnd(startAt: string) {
  const start = new Date(startAt);
  const safeStart = Number.isNaN(start.getTime()) ? new Date() : start;
  return toDateTimeLocalValue(new Date(safeStart.getTime() + 60 * 60_000));
}

const SIMPLE_RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Bez powtarzania' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'weekly', label: 'Co tydzień' },
  { value: 'monthly', label: 'Co miesiąc' },
];

function normalizeDateTimeLocalInput(value: unknown) {
  if (!value) return '';
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? '' : toDateTimeLocalValue(parsed);
}

function parseRecurrenceRule(rule: unknown) {
  const raw = typeof rule === 'string' ? rule.trim() : '';
  if (!raw) {
    return { mode: 'none', until: '' };
  }

  const upper = raw.toUpperCase();
  let mode = 'none';
  if (upper.includes('FREQ=DAILY')) mode = 'daily';
  else if (upper.includes('FREQ=WEEKLY')) mode = 'weekly';
  else if (upper.includes('FREQ=MONTHLY')) mode = 'monthly';

  const untilMatch = upper.match(/UNTIL=([0-9T]{13,16}Z?)/);
  let until = '';
  if (untilMatch?.[1]) {
    const normalized = untilMatch[1].replace('Z', '');
    const iso = normalized.length >= 15
      ? `${normalized.slice(0, 4)}-${normalized.slice(4, 6)}-${normalized.slice(6, 8)}T${normalized.slice(9, 11)}:${normalized.slice(11, 13)}`
      : '';
    until = iso;
  }

  return { mode, until };
}

function buildRecurrenceRule(mode: string, until: string) {
  if (!mode || mode === 'none') return '';

  const freq = mode === 'daily' ? 'DAILY' : mode === 'weekly' ? 'WEEKLY' : 'MONTHLY';
  const parsedUntil = until ? new Date(until) : null;
  const untilPart = parsedUntil && !Number.isNaN(parsedUntil.getTime())
    ? `;UNTIL=${parsedUntil.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`
    : '';

  return `RRULE:FREQ=${freq}${untilPart}`;
}

function getComparableTime(value: unknown) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const parsed = new Date(String(value));
  const time = parsed.getTime();
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
}

type CaseClientOption = {
  key: string;
  name: string;
  email: string;
  phone: string;
  source: 'lead' | 'current' | 'case';
};

function normalizeCaseClientText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildCaseClientOptions(cases: any[], leads: any[], sourceLead: any, caseData: any) {
  const map = new Map<string, CaseClientOption>();

  const push = (rawName: unknown, rawEmail: unknown, rawPhone: unknown, source: 'lead' | 'current' | 'case') => {
    const name = normalizeCaseClientText(rawName);
    const email = normalizeCaseClientText(rawEmail);
    const phone = normalizeCaseClientText(rawPhone);
    if (!name && !email && !phone) return;

    const key = `${name.toLowerCase()}|${email.toLowerCase()}|${phone}`;
    if (map.has(key)) return;

    map.set(key, {
      key,
      name: name || email || phone || 'Klient',
      email,
      phone,
      source,
    });
  };

  push(caseData?.clientName, caseData?.clientEmail, caseData?.clientPhone, 'current');
  push(sourceLead?.name || sourceLead?.company, sourceLead?.email, sourceLead?.phone, 'lead');

  for (const lead of leads || []) {
    push(lead?.name || lead?.company, lead?.email, lead?.phone, 'lead');
  }

  for (const currentCase of cases || []) {
    push(currentCase?.clientName, currentCase?.clientEmail, currentCase?.clientPhone, 'case');
  }

  return [...map.values()].sort((left, right) => left.name.localeCompare(right.name, 'pl', { sensitivity: 'base' }));
}

export default function CaseDetail() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
  const [sourceLead, setSourceLead] = useState<any>(null);
  const [availableLeads, setAvailableLeads] = useState<any[]>([]);
  const [availableCases, setAvailableCases] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [leadRelationPending, setLeadRelationPending] = useState(false);
  const [linkedTasks, setLinkedTasks] = useState<any[]>([]);
  const [linkedEvents, setLinkedEvents] = useState<any[]>([]);
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const [isQuickEventOpen, setIsQuickEventOpen] = useState(false);
  const [quickTaskSubmitting, setQuickTaskSubmitting] = useState(false);
  const [quickEventSubmitting, setQuickEventSubmitting] = useState(false);
  const [quickTask, setQuickTask] = useState(() => ({
    title: '',
    type: 'follow_up',
    scheduledAt: toDateTimeLocalValue(new Date()),
    priority: 'medium',
    reminderAt: '',
    recurrenceMode: 'none',
    recurrenceUntil: '',
  }));
  const [quickEvent, setQuickEvent] = useState(() => {
    const startAt = toDateTimeLocalValue(new Date());
    return {
      title: '',
      type: 'meeting',
      startAt,
      endAt: buildDefaultEventEnd(startAt),
      status: 'scheduled',
      reminderAt: '',
      recurrenceMode: 'none',
      recurrenceUntil: '',
    };
  });
  const [taskActionPendingId, setTaskActionPendingId] = useState<string | null>(null);
  const [eventActionPendingId, setEventActionPendingId] = useState<string | null>(null);
  const [editCaseTask, setEditCaseTask] = useState<any | null>(null);
  const [editCaseEvent, setEditCaseEvent] = useState<any | null>(null);
  const [taskEditSubmitting, setTaskEditSubmitting] = useState(false);
  const [eventEditSubmitting, setEventEditSubmitting] = useState(false);
  const [caseNote, setCaseNote] = useState('');
  const [caseNoteSubmitting, setCaseNoteSubmitting] = useState(false);
  const [editCaseNote, setEditCaseNote] = useState<any | null>(null);
  const [caseNoteEditSubmitting, setCaseNoteEditSubmitting] = useState(false);
  const [caseNoteActionId, setCaseNoteActionId] = useState<string | null>(null);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [showClientCreateFields, setShowClientCreateFields] = useState(false);
  const [caseClientSubmitting, setCaseClientSubmitting] = useState(false);
  const [caseClientDraft, setCaseClientDraft] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
  });

  useEffect(() => {
    setCaseClientDraft({
      clientName: String(caseData?.clientName || ''),
      clientEmail: String(caseData?.clientEmail || ''),
      clientPhone: String(caseData?.clientPhone || ''),
    });
  }, [caseData?.clientEmail, caseData?.clientName, caseData?.clientPhone]);

  const caseClientOptions = useMemo(
    () => buildCaseClientOptions(availableCases, availableLeads, sourceLead, caseData),
    [availableCases, availableLeads, caseData, sourceLead],
  );

  const caseClientSuggestions = useMemo(() => {
    const normalizedQuery = caseClientDraft.clientName.trim().toLowerCase();
    const base = normalizedQuery
      ? caseClientOptions.filter((option) => {
          return [option.name, option.email, option.phone]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery));
        })
      : caseClientOptions;

    return base.slice(0, 6);
  }, [caseClientDraft.clientName, caseClientOptions]);

  const loadConflictCandidates = async () => {
    const [taskRows, eventRows] = await Promise.all([
      fetchTasksFromSupabase(),
      fetchEventsFromSupabase(),
    ]);
    return buildConflictCandidates({
      tasks: taskRows as any[],
      events: eventRows as any[],
    });
  };

  async function refreshSupabaseCase() {
    if (!caseId) return;

    const [caseRow, itemRows, activityRows, leadRows, caseRows, taskRows, eventRows] = await Promise.all([
      fetchCaseByIdFromSupabase(caseId),
      fetchCaseItemsFromSupabase(caseId),
      fetchActivitiesFromSupabase({ caseId, limit: 200 }),
      fetchLeadsFromSupabase(),
      fetchCasesFromSupabase(),
      fetchTasksFromSupabase(),
      fetchEventsFromSupabase(),
    ]);

    setCaseData(caseRow);
    setItems(itemRows);
    setActivities(activityRows);

    const allLeads = (leadRows || []) as any[];
    const allCases = (caseRows || []) as any[];
    const linkedLeadId = String(caseRow?.leadId || '');
    const currentLead = linkedLeadId ? allLeads.find((entry) => String(entry.id || '') === linkedLeadId) || null : null;
    const openLeads = allLeads.filter((entry) => {
      const status = String(entry.status || 'new');
      return !['won', 'lost'].includes(status) || String(entry.id || '') === linkedLeadId;
    });

    setSourceLead(currentLead);
    setAvailableLeads(openLeads);
    setAvailableCases(allCases);
    setSelectedLeadId(linkedLeadId);

    const currentCaseId = String(caseId || '');
    const caseTasks = ((taskRows || []) as any[])
      .filter((entry) => String(entry.caseId || '') === currentCaseId)
      .sort((left, right) => getComparableTime(left.scheduledAt || left.dueAt || left.date) - getComparableTime(right.scheduledAt || right.dueAt || right.date));
    const caseEvents = ((eventRows || []) as any[])
      .filter((entry) => String(entry.caseId || '') === currentCaseId)
      .sort((left, right) => getComparableTime(left.startAt) - getComparableTime(right.startAt));

    setLinkedTasks(caseTasks);
    setLinkedEvents(caseEvents);

    const next = computeCaseState(itemRows, String(caseRow?.status || ''));
    const currentPercent = Math.round(Number(caseRow?.completenessPercent || 0));
    const nextPercent = Math.round(Number(next.completenessPercent || 0));

    if (currentPercent !== nextPercent || String(caseRow?.status || '') !== String(next.status || '')) {
      const updated = await updateCaseInSupabase({
        id: caseId,
        completenessPercent: next.completenessPercent,
        status: next.status,
      });
      if (updated) {
        setCaseData((prev: any) => ({
          ...prev,
          completenessPercent: next.completenessPercent,
          status: next.status,
        }));
      }
    }
  }

  useEffect(() => {
    if (!caseId) return;

    let cancelled = false;
    setLoading(true);

    refreshSupabaseCase()
      .then(() => {
        if (cancelled) return;
        setLoading(false);
      })
      .catch((error: any) => {
        if (cancelled) return;
        toast.error(`Błąd sprawy API: ${error.message}`);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  const handleAddItem = async () => {
    if (!newItem.title || !caseId) return;

    try {
      await insertCaseItemToSupabase({
        caseId,
        title: newItem.title,
        description: newItem.description,
        type: newItem.type,
        isRequired: newItem.isRequired,
        dueDate: newItem.dueDate || null,
        order: items.length,
        status: 'missing',
      });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'item_added',
        payload: { title: newItem.title },
      });

      await refreshSupabaseCase();
      setIsAddItemOpen(false);
      setNewItem({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
      toast.success('Element dodany');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleUpdateItemStatus = async (itemId: string, status: string, title: string) => {
    try {
      await updateCaseItemInSupabase({
        id: itemId,
        caseId: caseId!,
        status,
        approvedAt: status === 'accepted' ? new Date().toISOString() : null,
      });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'status_changed',
        payload: { title, status },
      });

      await refreshSupabaseCase();
      toast.success('Status zaktualizowany');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteCaseItemFromSupabase(itemId);
      await refreshSupabaseCase();
      toast.success('Element usunięty');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const generatePortalLink = async () => {
    try {
      if (!caseId) return;

      const row = await createClientPortalTokenInSupabase(caseId);
      const token = String(row.token || '');
      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'portal_token_created',
        payload: { title: caseData?.title || 'Sprawa' },
      });
      await refreshSupabaseCase();

      const url = `${window.location.origin}/portal/${caseId}/${token}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link do panelu skopiowany!');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  const closeLeadAfterCaseLink = async (leadIdToClose: string) => {
    await updateLeadInSupabase({
      id: leadIdToClose,
      status: 'won',
      nextStep: '',
      nextActionAt: null,
    });

    await insertActivityToSupabase({
      leadId: leadIdToClose,
      ownerId: auth.currentUser?.uid ?? null,
      actorId: auth.currentUser?.uid ?? null,
      actorType: 'operator',
      eventType: 'status_changed',
      payload: {
        status: 'won',
        caseId,
        reason: 'lead_converted_to_case',
      },
    });
  };

  const handleLinkLeadToCase = async () => {
    if (!caseId || !selectedLeadId) return;
    if (String(caseData?.leadId || '') === selectedLeadId) {
      toast.success('Ta sprawa jest już powiązana z wybranym leadem');
      return;
    }

    const selectedLead = availableLeads.find((entry) => String(entry.id || '') === selectedLeadId);
    if (!selectedLead) {
      toast.error('Nie znaleziono wybranego leada');
      return;
    }

    try {
      setLeadRelationPending(true);
      await updateCaseInSupabase({ id: caseId, leadId: selectedLeadId });
      await closeLeadAfterCaseLink(selectedLeadId);

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'lead_linked',
        payload: {
          leadId: selectedLeadId,
          leadName: selectedLead.name || 'Lead',
        },
      });

      await insertActivityToSupabase({
        leadId: selectedLeadId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_linked',
        payload: {
          caseId,
          title: caseData?.title || 'Sprawa',
        },
      });

      await refreshSupabaseCase();
      toast.success('Lead podpięty do sprawy');
    } catch (error: any) {
      toast.error(`Błąd podpinania leada: ${error.message}`);
    } finally {
      setLeadRelationPending(false);
    }
  };

  const handleUnlinkLeadFromCase = async () => {
    if (!caseId || !caseData?.leadId) return;
    if (!window.confirm('Odpiąć źródłowego leada od tej sprawy?')) return;

    const currentLeadId = String(caseData.leadId);
    const currentLead = sourceLead || await fetchLeadByIdFromSupabase(currentLeadId).catch(() => null);

    try {
      setLeadRelationPending(true);
      await updateCaseInSupabase({ id: caseId, leadId: null });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'lead_unlinked',
        payload: {
          leadId: currentLeadId,
          leadName: currentLead?.name || 'Lead',
        },
      });

      await insertActivityToSupabase({
        leadId: currentLeadId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_unlinked',
        payload: {
          caseId,
          title: caseData?.title || 'Sprawa',
        },
      });

      await refreshSupabaseCase();
      toast.success('Lead odpięty od sprawy');
    } catch (error: any) {
      toast.error(`Błąd odpinania leada: ${error.message}`);
    } finally {
      setLeadRelationPending(false);
    }
  };

  const resetQuickTask = () => {
    setQuickTask({
      title: '',
      type: 'follow_up',
      scheduledAt: toDateTimeLocalValue(new Date()),
      priority: 'medium',
      reminderAt: '',
      recurrenceMode: 'none',
      recurrenceUntil: '',
    });
  };

  const resetQuickEvent = () => {
    const startAt = toDateTimeLocalValue(new Date());
    setQuickEvent({
      title: '',
      type: 'meeting',
      startAt,
      endAt: buildDefaultEventEnd(startAt),
      status: 'scheduled',
      reminderAt: '',
      recurrenceMode: 'none',
      recurrenceUntil: '',
    });
  };

  const handleCreateQuickCaseTask = async () => {
    if (!caseId) return;
    if (!quickTask.title.trim()) {
      toast.error('Podaj tytuł zadania');
      return;
    }

    try {
      setQuickTaskSubmitting(true);
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'task',
          title: quickTask.title.trim(),
          startAt: quickTask.scheduledAt,
        },
        candidates: await loadConflictCandidates(),
      });
      if (!shouldSave) return;

      await insertTaskToSupabase({
        title: quickTask.title.trim(),
        type: quickTask.type,
        date: quickTask.scheduledAt.slice(0, 10),
        scheduledAt: quickTask.scheduledAt,
        priority: quickTask.priority,
        status: 'todo',
        caseId,
        leadId: caseData?.leadId || null,
        reminderAt: quickTask.reminderAt || null,
        recurrenceRule: buildRecurrenceRule(quickTask.recurrenceMode, quickTask.recurrenceUntil),
        ownerId: auth.currentUser?.uid ?? undefined,
      });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_task_created',
        payload: {
          title: quickTask.title.trim(),
          scheduledAt: quickTask.scheduledAt,
        },
      });

      await refreshSupabaseCase();
      resetQuickTask();
      setIsQuickTaskOpen(false);
      toast.success('Zadanie dodane do sprawy');
    } catch (error: any) {
      toast.error(`Błąd zadania: ${error.message}`);
    } finally {
      setQuickTaskSubmitting(false);
    }
  };

  const handleCreateQuickCaseEvent = async () => {
    if (!caseId) return;
    if (!quickEvent.title.trim()) {
      toast.error('Podaj tytuł wydarzenia');
      return;
    }

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
        status: quickEvent.status,
        caseId,
        leadId: caseData?.leadId || null,
        reminderAt: quickEvent.reminderAt || undefined,
        recurrenceRule: buildRecurrenceRule(quickEvent.recurrenceMode, quickEvent.recurrenceUntil),
      });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_event_created',
        payload: {
          title: quickEvent.title.trim(),
          startAt: quickEvent.startAt,
        },
      });

      await refreshSupabaseCase();
      resetQuickEvent();
      setIsQuickEventOpen(false);
      toast.success('Wydarzenie dodane do sprawy');
    } catch (error: any) {
      toast.error(`Błąd wydarzenia: ${error.message}`);
    } finally {
      setQuickEventSubmitting(false);
    }
  };


  const openCaseTaskEditor = (task: any) => {
    const recurrence = parseRecurrenceRule(task.recurrenceRule);
    setEditCaseTask({
      id: String(task.id || ''),
      title: String(task.title || ''),
      type: String(task.type || 'follow_up'),
      scheduledAt: String(task.scheduledAt || task.dueAt || `${task.date || ''}T09:00`).slice(0, 16),
      priority: String(task.priority || 'medium'),
      status: String(task.status || 'todo'),
      reminderAt: normalizeDateTimeLocalInput(task.reminderAt),
      recurrenceMode: recurrence.mode,
      recurrenceUntil: recurrence.until,
    });
  };

  const openCaseEventEditor = (event: any) => {
    const recurrence = parseRecurrenceRule(event.recurrenceRule);
    setEditCaseEvent({
      id: String(event.id || ''),
      title: String(event.title || ''),
      type: String(event.type || 'meeting'),
      startAt: String(event.startAt || '').slice(0, 16),
      endAt: String(event.endAt || buildDefaultEventEnd(String(event.startAt || toDateTimeLocalValue(new Date())))).slice(0, 16),
      status: String(event.status || 'scheduled'),
      reminderAt: normalizeDateTimeLocalInput(event.reminderAt),
      recurrenceMode: recurrence.mode,
      recurrenceUntil: recurrence.until,
    });
  };

  const handleToggleCaseTaskStatus = async (task: any) => {
    if (!caseId || !task?.id) return;
    const taskId = String(task.id);
    const nextStatus = String(task.status || 'todo') === 'done' ? 'todo' : 'done';

    try {
      setTaskActionPendingId(taskId);
      await updateTaskInSupabase({
        id: taskId,
        title: task.title,
        type: task.type,
        date: String(task.date || String(task.scheduledAt || task.dueAt || '').slice(0, 10)),
        scheduledAt: task.scheduledAt || task.dueAt,
        status: nextStatus,
        priority: task.priority,
        leadId: task.leadId ?? caseData?.leadId ?? null,
        reminderAt: task.reminderAt || null,
        recurrenceRule: typeof task.recurrenceRule === 'string' ? task.recurrenceRule : '',
        caseId,
      });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_task_status_toggled',
        payload: {
          title: task.title || 'Task',
          status: nextStatus,
        },
      });

      await refreshSupabaseCase();
      toast.success(nextStatus === 'done' ? 'Task oznaczony jako zrobiony' : 'Task przywrócony do pracy');
    } catch (error: any) {
      toast.error(`Błąd taska: ${error.message}`);
    } finally {
      setTaskActionPendingId(null);
    }
  };

  const handleDeleteCaseTask = async (task: any) => {
    if (!caseId || !task?.id) return;
    if (!window.confirm('Usunąć task ze sprawy?')) return;
    const taskId = String(task.id);

    try {
      setTaskActionPendingId(taskId);
      await deleteTaskFromSupabase(taskId);
      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_task_deleted',
        payload: {
          title: task.title || 'Task',
        },
      });
      await refreshSupabaseCase();
      toast.success('Task usunięty');
    } catch (error: any) {
      toast.error(`Błąd usuwania taska: ${error.message}`);
    } finally {
      setTaskActionPendingId(null);
    }
  };

  const handleDeleteCaseEvent = async (event: any) => {
    if (!caseId || !event?.id) return;
    if (!window.confirm('Usunąć wydarzenie ze sprawy?')) return;
    const eventId = String(event.id);

    try {
      setEventActionPendingId(eventId);
      await deleteEventFromSupabase(eventId);
      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_event_deleted',
        payload: {
          title: event.title || 'Wydarzenie',
        },
      });
      await refreshSupabaseCase();
      toast.success('Wydarzenie usunięte');
    } catch (error: any) {
      toast.error(`Błąd usuwania wydarzenia: ${error.message}`);
    } finally {
      setEventActionPendingId(null);
    }
  };

  const handleCompleteCaseEvent = async (event: any) => {
    if (!caseId || !event?.id) return;
    const eventId = String(event.id);

    try {
      setEventActionPendingId(eventId);
      await updateEventInSupabase({
        id: eventId,
        title: event.title,
        type: event.type,
        startAt: event.startAt,
        endAt: event.endAt,
        status: String(event.status || 'scheduled') === 'completed' ? 'scheduled' : 'completed',
        leadId: event.leadId ?? caseData?.leadId ?? null,
        reminderAt: event.reminderAt || null,
        recurrenceRule: typeof event.recurrenceRule === 'string' ? event.recurrenceRule : '',
        caseId,
      });
      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_event_status_toggled',
        payload: {
          title: event.title || 'Wydarzenie',
          status: String(event.status || 'scheduled') === 'completed' ? 'scheduled' : 'completed',
        },
      });
      await refreshSupabaseCase();
      toast.success('Zmieniono status wydarzenia');
    } catch (error: any) {
      toast.error(`Błąd wydarzenia: ${error.message}`);
    } finally {
      setEventActionPendingId(null);
    }
  };

  const handleSaveCaseTaskEdit = async () => {
    if (!caseId || !editCaseTask?.id) return;
    if (!editCaseTask.title?.trim()) {
      toast.error('Podaj tytuł taska');
      return;
    }

    try {
      setTaskEditSubmitting(true);
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'task',
          title: editCaseTask.title.trim(),
          startAt: editCaseTask.scheduledAt,
        },
        candidates: await loadConflictCandidates(),
        excludeId: String(editCaseTask.id),
        excludeKind: 'task',
      });
      if (!shouldSave) return;

      await updateTaskInSupabase({
        id: String(editCaseTask.id),
        title: editCaseTask.title.trim(),
        type: editCaseTask.type,
        date: String(editCaseTask.scheduledAt).slice(0, 10),
        scheduledAt: editCaseTask.scheduledAt,
        status: editCaseTask.status,
        priority: editCaseTask.priority,
        leadId: caseData?.leadId || null,
        reminderAt: editCaseTask.reminderAt || null,
        recurrenceRule: buildRecurrenceRule(editCaseTask.recurrenceMode, editCaseTask.recurrenceUntil),
        caseId,
      });
      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_task_updated',
        payload: {
          title: editCaseTask.title.trim(),
          scheduledAt: editCaseTask.scheduledAt,
        },
      });
      await refreshSupabaseCase();
      setEditCaseTask(null);
      toast.success('Task zaktualizowany');
    } catch (error: any) {
      toast.error(`Błąd edycji taska: ${error.message}`);
    } finally {
      setTaskEditSubmitting(false);
    }
  };

  const handleSaveCaseEventEdit = async () => {
    if (!caseId || !editCaseEvent?.id) return;
    if (!editCaseEvent.title?.trim()) {
      toast.error('Podaj tytuł wydarzenia');
      return;
    }

    try {
      setEventEditSubmitting(true);
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'event',
          title: editCaseEvent.title.trim(),
          startAt: editCaseEvent.startAt,
          endAt: editCaseEvent.endAt,
        },
        candidates: await loadConflictCandidates(),
        excludeId: String(editCaseEvent.id),
        excludeKind: 'event',
      });
      if (!shouldSave) return;

      await updateEventInSupabase({
        id: String(editCaseEvent.id),
        title: editCaseEvent.title.trim(),
        type: editCaseEvent.type,
        startAt: editCaseEvent.startAt,
        endAt: editCaseEvent.endAt,
        status: editCaseEvent.status,
        leadId: caseData?.leadId || null,
        reminderAt: editCaseEvent.reminderAt || null,
        recurrenceRule: buildRecurrenceRule(editCaseEvent.recurrenceMode, editCaseEvent.recurrenceUntil),
        caseId,
      });
      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_event_updated',
        payload: {
          title: editCaseEvent.title.trim(),
          startAt: editCaseEvent.startAt,
        },
      });
      await refreshSupabaseCase();
      setEditCaseEvent(null);
      toast.success('Wydarzenie zaktualizowane');
    } catch (error: any) {
      toast.error(`Błąd edycji wydarzenia: ${error.message}`);
    } finally {
      setEventEditSubmitting(false);
    }
  };


  const handleAddCaseNote = async () => {
    if (!caseId) return;
    if (!caseNote.trim()) {
      toast.error('Wpisz treść notatki');
      return;
    }

    try {
      setCaseNoteSubmitting(true);
      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'note_added',
        payload: {
          content: caseNote.trim(),
        },
      });
      await refreshSupabaseCase();
      setCaseNote('');
      toast.success('Notatka dodana');
    } catch (error: any) {
      toast.error(`Błąd notatki: ${error.message}`);
    } finally {
      setCaseNoteSubmitting(false);
    }
  };

  const openCaseNoteEditor = (activity: any) => {
    setEditCaseNote({
      id: String(activity.id || ''),
      content: String(activity.payload?.content || ''),
    });
  };

  const handleSaveCaseNoteEdit = async () => {
    if (!editCaseNote?.id) return;
    if (!editCaseNote.content?.trim()) {
      toast.error('Wpisz treść notatki');
      return;
    }

    try {
      setCaseNoteEditSubmitting(true);
      await updateActivityInSupabase({
        id: String(editCaseNote.id),
        payload: {
          content: editCaseNote.content.trim(),
        },
      });
      await refreshSupabaseCase();
      setEditCaseNote(null);
      toast.success('Notatka zaktualizowana');
    } catch (error: any) {
      toast.error(`Błąd edycji notatki: ${error.message}`);
    } finally {
      setCaseNoteEditSubmitting(false);
    }
  };

  const handleDeleteCaseNote = async (activity: any) => {
    const activityId = String(activity?.id || '');
    if (!activityId) return;
    if (!window.confirm('Usunąć tę notatkę?')) return;

    try {
      setCaseNoteActionId(activityId);
      await deleteActivityFromSupabase(activityId);
      await refreshSupabaseCase();
      toast.success('Notatka usunięta');
    } catch (error: any) {
      toast.error(`Błąd usuwania notatki: ${error.message}`);
    } finally {
      setCaseNoteActionId(null);
    }
  };

  const handleSelectCaseClientSuggestion = (option: CaseClientOption) => {
    setCaseClientDraft({
      clientName: option.name,
      clientEmail: option.email,
      clientPhone: option.phone,
    });
    setShowClientCreateFields(false);
  };

  const handleSaveCaseClient = async () => {
    if (!caseId) return;
    if (!caseClientDraft.clientName.trim()) {
      toast.error('Podaj nazwę klienta');
      return;
    }

    try {
      setCaseClientSubmitting(true);
      await updateCaseInSupabase({
        id: caseId,
        clientName: caseClientDraft.clientName.trim(),
        clientEmail: caseClientDraft.clientEmail.trim(),
        clientPhone: caseClientDraft.clientPhone.trim(),
      });
      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_client_updated',
        payload: {
          clientName: caseClientDraft.clientName.trim(),
          clientEmail: caseClientDraft.clientEmail.trim(),
          clientPhone: caseClientDraft.clientPhone.trim(),
        },
      });
      await refreshSupabaseCase();
      setIsEditClientOpen(false);
      setShowClientCreateFields(false);
      toast.success('Dane klienta zaktualizowane');
    } catch (error: any) {
      toast.error(`Błąd klienta: ${error.message}`);
    } finally {
      setCaseClientSubmitting(false);
    }
  };

  const handleSendCaseReminder = async () => {
    if (!caseId) return;

    const followUpDate = new Date(Date.now() + 24 * 60 * 60_000);
    followUpDate.setHours(9, 0, 0, 0);
    const followUpAt = followUpDate.toISOString().slice(0, 16);
    const followUpTitle = `Follow-up: ${caseData?.title || 'Sprawa'}`;

    try {
      await insertTaskToSupabase({
        title: followUpTitle,
        type: 'follow_up',
        date: followUpAt.slice(0, 10),
        scheduledAt: followUpAt,
        priority: 'medium',
        status: 'todo',
        caseId,
        reminderAt: new Date(followUpDate.getTime() - 30 * 60_000).toISOString(),
        ownerId: auth.currentUser?.uid ?? undefined,
      });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_reminder_requested',
        payload: {
          title: caseData?.title || 'Sprawa',
          taskTitle: followUpTitle,
          scheduledAt: followUpAt,
        },
      });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'reminder_scheduled',
        payload: {
          entityType: 'task',
          title: followUpTitle,
          scheduledAt: followUpAt,
          reason: 'case_detail_reminder',
        },
      });

      await refreshSupabaseCase();
      toast.success('Przypomnienie zapisane i utworzono follow-up');
    } catch (error: any) {
      toast.error(`Błąd przypomnienia: ${error.message}`);
    }
  };

  const handleStartCaseExecution = async () => {
    if (!caseId) return;

    const now = new Date();
    const scheduledAt = toDateTimeLocalValue(now);
    const startTaskTitle = `Start realizacji: ${caseData?.title || 'Sprawa'}`;

    try {
      await updateCaseInSupabase({
        id: caseId,
        status: 'in_progress',
      });

      await insertTaskToSupabase({
        title: startTaskTitle,
        type: 'follow_up',
        date: scheduledAt.slice(0, 10),
        scheduledAt,
        priority: 'high',
        status: 'todo',
        caseId,
        ownerId: auth.currentUser?.uid ?? undefined,
      });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_started',
        payload: {
          title: caseData?.title || 'Sprawa',
          taskTitle: startTaskTitle,
          scheduledAt,
        },
      });

      await refreshSupabaseCase();
      toast.success('Sprawa weszła do realizacji i utworzono task startowy');
    } catch (error: any) {
      toast.error(`Błąd startu realizacji: ${error.message}`);
    }
  };

  const handleMarkCaseCompleted = async () => {
    if (!caseId) return;
    if (!window.confirm('Oznaczyć tę sprawę jako zakończoną?')) return;

    try {
      await updateCaseInSupabase({
        id: caseId,
        status: 'completed',
        completenessPercent: 100,
      });

      await insertActivityToSupabase({
        caseId,
        ownerId: auth.currentUser?.uid ?? null,
        actorId: auth.currentUser?.uid ?? null,
        actorType: 'operator',
        eventType: 'case_completed',
        payload: {
          title: caseData?.title || 'Sprawa',
        },
      });

      await refreshSupabaseCase();
      toast.success('Sprawa oznaczona jako zakończona');
    } catch (error: any) {
      toast.error(`Błąd zamknięcia sprawy: ${error.message}`);
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

  if (!caseData) return null;

  return (
    <Layout>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/cases" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
                {caseData.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider truncate">
                Klient: {caseData.clientName || 'Brak klienta'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={generatePortalLink}>
              <Copy className="w-4 h-4" />
              Kopiuj link dla klienta
            </Button>
            <Button size="sm" className="gap-2" onClick={() => void handleSendCaseReminder()}>
              <Send className="w-4 h-4" />
              Wyślij przypomnienie
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Start realizacji</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Stan operacyjny</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={caseData.status === 'blocked' ? 'destructive' : caseData.status === 'ready_to_start' ? 'secondary' : 'outline'}>
                        {caseStatusLabel(caseData.status)}
                      </Badge>
                      {(Number(caseData.completenessPercent) || 0) >= 100 ? <Badge variant="secondary">Komplet 100%</Badge> : null}
                      {items.some((entry) => entry.status === 'uploaded') ? <Badge variant="outline">Czeka na akceptację</Badge> : null}
                    </div>
                    <p className="text-sm text-slate-500">
                      {caseData.status === 'ready_to_start'
                        ? 'Sprawa jest gotowa do wejścia w realizację. Teraz operator powinien uruchomić start i przejąć prowadzenie.'
                        : caseData.status === 'in_progress'
                          ? 'Sprawa jest już w aktywnej realizacji. Kolejny ruch to pilnowanie tasków, klienta i historii zmian.'
                          : caseData.status === 'completed'
                            ? 'Sprawa jest domknięta. Możesz wrócić do środka tylko po historię lub kontrolę końcową.'
                            : caseData.status === 'blocked'
                              ? 'Sprawa ma realny blok i najpierw trzeba go odblokować.'
                              : 'Sprawa nie jest jeszcze gotowa do startu. Najpierw domknij brakujące lub oczekujące elementy.'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Szybkie akcje</p>
                    <div className="flex flex-wrap gap-2">
                      {caseData.status === 'ready_to_start' ? (
                        <Button onClick={() => void handleStartCaseExecution()}>
                          <Send className="w-4 h-4 mr-2" /> Start realizacji
                        </Button>
                      ) : null}
                      {caseData.status !== 'completed' ? (
                        <Button variant="outline" onClick={() => void handleSendCaseReminder()}>
                          <Clock className="w-4 h-4 mr-2" /> Follow-up do sprawy
                        </Button>
                      ) : null}
                      {caseData.status === 'in_progress' ? (
                        <Button variant="outline" onClick={() => void handleMarkCaseCompleted()}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Oznacz jako zakończoną
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Operacyjny hub sprawy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Zadania sprawy</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{linkedTasks.length}</p>
                    <p className="mt-1 text-sm text-slate-500">Wszystkie taski przypięte do tej sprawy i widoczne również na liście zadań.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Wydarzenia sprawy</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{linkedEvents.length}</p>
                    <p className="mt-1 text-sm text-slate-500">Bloki czasu i spotkania przypięte bezpośrednio do tej sprawy.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => setIsQuickTaskOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Dodaj zadanie do sprawy
                  </Button>
                  <Button variant="outline" onClick={() => setIsQuickEventOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" /> Dodaj wydarzenie do sprawy
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/tasks">Otwórz zadania <ExternalLink className="w-4 h-4" /></Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/calendar">Otwórz kalendarz <ExternalLink className="w-4 h-4" /></Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-900">Najbliższe zadania</h3>
                      <Badge variant="outline">{linkedTasks.length}</Badge>
                    </div>
                    {linkedTasks.length === 0 ? (
                      <p className="text-sm text-slate-500">Brak tasków przypiętych do tej sprawy.</p>
                    ) : (
                      <div className="space-y-2">
                        {linkedTasks.slice(0, 5).map((task: any) => (
                          <div key={task.id} className="rounded-xl border border-slate-200 px-3 py-2 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 break-words">{task.title || 'Zadanie bez tytułu'}</p>
                                <p className="text-xs text-slate-500 break-words">{formatDateTime(task.scheduledAt || task.dueAt || task.date)}{task.priority ? ` • Priorytet: ${task.priority}` : ''}</p>
                              </div>
                              <Badge variant={task.status === 'done' ? 'secondary' : 'outline'}>{task.status === 'done' ? 'Zrobione' : 'Aktywne'}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" onClick={() => openCaseTaskEditor(task)}>Edytuj</Button>
                              <Button variant="outline" size="sm" onClick={() => void handleToggleCaseTaskStatus(task)} disabled={taskActionPendingId === String(task.id)}>
                                {taskActionPendingId === String(task.id) ? '...' : task.status === 'done' ? 'Przywróć' : 'Zrobione'}
                              </Button>
                              <Button variant="outline" size="sm" className="text-rose-600 hover:text-rose-600" onClick={() => void handleDeleteCaseTask(task)} disabled={taskActionPendingId === String(task.id)}>Usuń</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-900">Najbliższe wydarzenia</h3>
                      <Badge variant="outline">{linkedEvents.length}</Badge>
                    </div>
                    {linkedEvents.length === 0 ? (
                      <p className="text-sm text-slate-500">Brak wydarzeń przypiętych do tej sprawy.</p>
                    ) : (
                      <div className="space-y-2">
                        {linkedEvents.slice(0, 5).map((event: any) => (
                          <div key={event.id} className="rounded-xl border border-slate-200 px-3 py-2 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 break-words">{event.title || 'Wydarzenie bez tytułu'}</p>
                                <p className="text-xs text-slate-500 break-words">{formatDateTime(event.startAt)}{event.endAt ? ` → ${formatDateTime(event.endAt)}` : ''}</p>
                              </div>
                              <Badge variant={event.status === 'completed' ? 'secondary' : 'outline'}>{event.status === 'completed' ? 'Wykonane' : 'Zaplanowane'}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" onClick={() => openCaseEventEditor(event)}>Edytuj</Button>
                              <Button variant="outline" size="sm" onClick={() => void handleCompleteCaseEvent(event)} disabled={eventActionPendingId === String(event.id)}>
                                {eventActionPendingId === String(event.id) ? '...' : event.status === 'completed' ? 'Przywróć' : 'Wykonane'}
                              </Button>
                              <Button variant="outline" size="sm" className="text-rose-600 hover:text-rose-600" onClick={() => void handleDeleteCaseEvent(event)} disabled={eventActionPendingId === String(event.id)}>Usuń</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 pb-6">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <Badge variant={caseData.status === 'blocked' ? 'destructive' : caseData.status === 'ready_to_start' ? 'secondary' : 'default'} className="px-3 py-1">
                    {caseStatusLabel(caseData.status)}
                  </Badge>
                  <span className="text-sm text-slate-500 font-medium text-right">
                    Ostatnia zmiana: {formatDateTime(caseData.updatedAt)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-700">Postęp kompletności</span>
                    <span className="text-primary">{Math.round(caseData.completenessPercent || 0)}%</span>
                  </div>
                  <Progress value={caseData.completenessPercent || 0} className="h-3" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 flex items-center justify-between border-b border-slate-100 gap-3">
                  <h3 className="text-lg font-bold text-slate-900">Lista wymaganych elementów</h3>
                  <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Dodaj element
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dodaj wymagany element</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nazwa elementu</Label>
                          <Input placeholder="np. Logo w formacie SVG" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Opis / Instrukcja</Label>
                          <Textarea placeholder="Wyjaśnij klientowi co dokładnie ma zrobić..." value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Typ</Label>
                            <select
                              className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm"
                              value={newItem.type}
                              onChange={e => setNewItem({...newItem, type: e.target.value})}
                            >
                              <option value="file">Plik</option>
                              <option value="decision">Decyzja (Tak/Nie)</option>
                              <option value="text">Tekst / Odpowiedź</option>
                              <option value="access">Dostępy / Hasła</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2 pt-8">
                            <input
                              type="checkbox"
                              id="required"
                              checked={newItem.isRequired}
                              onChange={e => setNewItem({...newItem, isRequired: e.target.checked})}
                              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="required">Obowiązkowy</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Termin (opcjonalnie)</Label>
                          <Input type="date" value={newItem.dueDate} onChange={e => setNewItem({...newItem, dueDate: e.target.value})} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>Anuluj</Button>
                        <Button onClick={handleAddItem}>Dodaj element</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500">Brak elementów. Dodaj pierwszy element, aby zacząć.</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          item.status === 'accepted' ? 'bg-green-100 text-green-600' :
                          item.status === 'uploaded' ? 'bg-blue-100 text-blue-600' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {item.status === 'accepted' ? <CheckCircle2 className="w-5 h-5" /> :
                           item.status === 'uploaded' ? <Clock className="w-5 h-5" /> :
                           item.status === 'rejected' ? <AlertCircle className="w-5 h-5" /> :
                           <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                            {item.isRequired && <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-red-200 text-red-500">Wymagane</Badge>}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="truncate">{item.description || 'Brak opisu'}</span>
                              {item.dueDate && (
                                <span className="flex items-center gap-1 text-amber-600 font-medium shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {(item.fileUrl || item.response) && (
                              <div className="mt-2 p-2 bg-slate-100 rounded-lg text-xs space-y-1">
                                {item.fileUrl && (
                                  <a
                                    href={item.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-primary hover:underline font-medium"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    {item.fileName || 'Pobierz plik'}
                                  </a>
                                )}
                                {item.response && (
                                  <p className="text-slate-600 italic flex items-start gap-1">
                                    <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                                    {item.response}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.status === 'uploaded' && (
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => handleUpdateItemStatus(item.id, 'accepted', item.title)}>
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleUpdateItemStatus(item.id, 'rejected', item.title)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteItem(item.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Usuń
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserRound className="w-5 h-5 text-slate-400" />
                  Klient sprawy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div>
                    <p className="text-base font-bold text-slate-900 break-words">{caseData.clientName || 'Brak klienta'}</p>
                    <p className="mt-1 text-sm text-slate-500 break-words">{caseData.clientEmail || 'Brak e-maila'}</p>
                    <p className="mt-1 text-sm text-slate-500 break-words">{caseData.clientPhone || 'Brak telefonu'}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => {
                  setCaseClientDraft({
                    clientName: String(caseData?.clientName || ''),
                    clientEmail: String(caseData?.clientEmail || ''),
                    clientPhone: String(caseData?.clientPhone || ''),
                  });
                  setShowClientCreateFields(false);
                  setIsEditClientOpen(true);
                }}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Zmień klienta sprawy
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserRound className="w-5 h-5 text-slate-400" />
                  Źródłowy lead
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sourceLead ? (
                  <>
                    <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-base font-bold text-slate-900 break-words">{sourceLead.name || 'Lead bez nazwy'}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">{leadStatusLabel(sourceLead.status)}</Badge>
                            <Badge variant="secondary">{leadSourceLabel(sourceLead.source)}</Badge>
                            {sourceLead.isAtRisk ? <Badge variant="destructive">Zagrożony</Badge> : null}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/leads/${sourceLead.id}`}>
                            Otwórz <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm text-slate-600">
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Następny krok</p>
                          <p className="mt-1 font-medium text-slate-900 break-words">{sourceLead.nextStep || 'Brak ustawionego kroku'}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-xl bg-slate-50 px-3 py-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Termin ruchu</p>
                            <p className="mt-1 font-medium text-slate-900 flex items-center gap-2 break-words">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {formatDateTime(sourceLead.nextActionAt)}
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-50 px-3 py-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Wartość</p>
                            <p className="mt-1 font-medium text-slate-900 flex items-center gap-2 break-words">
                              <Target className="w-4 h-4 text-slate-400" />
                              {(Number(sourceLead.dealValue) || 0).toLocaleString()} PLN
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-xl bg-slate-50 px-3 py-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">E-mail</p>
                            <p className="mt-1 font-medium text-slate-900 flex items-center gap-2 break-words">
                              <Mail className="w-4 h-4 text-slate-400" />
                              {sourceLead.email || 'Brak'}
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-50 px-3 py-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Telefon</p>
                            <p className="mt-1 font-medium text-slate-900 flex items-center gap-2 break-words">
                              <Phone className="w-4 h-4 text-slate-400" />
                              {sourceLead.phone || 'Brak'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full text-rose-600 hover:text-rose-600" onClick={() => void handleUnlinkLeadFromCase()} disabled={leadRelationPending}>
                      <Unlink className="w-4 h-4 mr-2" />
                      {leadRelationPending ? 'Odpinanie...' : 'Odepnij leada od sprawy'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-sm font-semibold text-slate-900">Ta sprawa nie ma jeszcze źródłowego leada.</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Podepnij leada, żeby zachować pełną ścieżkę sprzedaż → realizacja w jednym rekordzie.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Wybierz leada do powiązania</Label>
                      <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz leada" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLeads.length === 0 ? (
                            <SelectItem value="__empty__" disabled>Brak dostępnych leadów</SelectItem>
                          ) : (
                            availableLeads.map((lead: any) => (
                              <SelectItem key={lead.id} value={String(lead.id)}>
                                {lead.name || 'Lead bez nazwy'}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" onClick={() => void handleLinkLeadToCase()} disabled={!selectedLeadId || leadRelationPending || availableLeads.length === 0}>
                      <Link2 className="w-4 h-4 mr-2" />
                      {leadRelationPending ? 'Podpinanie...' : 'Podepnij leada'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-400" />
                  Ostatnia aktywność
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Notatka operacyjna</Label>
                  <Textarea
                    placeholder="Dodaj krótką notatkę do sprawy..."
                    className="min-h-[96px]"
                    value={caseNote}
                    onChange={(e) => setCaseNote(e.target.value)}
                  />
                  <Button onClick={() => void handleAddCaseNote()} disabled={caseNoteSubmitting || !caseNote.trim()}>
                    {caseNoteSubmitting ? 'Zapisywanie...' : 'Dodaj notatkę'}
                  </Button>
                </div>
                <ScrollArea className="h-[360px] pr-2">
                  <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                    {activities.length === 0 ? (
                      <p className="text-center text-slate-400 py-8 text-sm">Brak aktywności</p>
                    ) : (
                      activities.map((activity) => {
                        const isCaseNote = activity.eventType === 'note_added';
                        return (
                          <div key={activity.id} className="relative pl-8">
                            <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                              activity.actorType === 'operator' ? 'bg-primary' : 'bg-green-500'
                            }`} />
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-slate-900">
                                  {activity.actorType === 'operator' ? 'Ty' : 'Klient'}
                                  <span className="font-normal text-slate-500 ml-1">
                                    {activity.eventType === 'item_added' ? `dodał element: ${activity.payload?.title}` :
                                     activity.eventType === 'status_changed' ? `zmienił status ${activity.payload?.title} na ${activity.payload?.status}` :
                                     activity.eventType === 'file_uploaded' ? `wgrał plik do: ${activity.payload?.title}` :
                                     activity.eventType === 'decision_made' ? `podjął decyzję w: ${activity.payload?.title}` :
                                     activity.eventType === 'portal_token_created' ? `wygenerował link portalu` :
                                     activity.eventType === 'lead_linked' ? `podpiął leada: ${activity.payload?.leadName || 'Lead'}` :
                                     activity.eventType === 'lead_unlinked' ? `odpiął leada: ${activity.payload?.leadName || 'Lead'}` :
                                     activity.eventType === 'case_started' ? `uruchomił start realizacji` :
                                     activity.eventType === 'case_task_created' ? `dodał task do sprawy: ${activity.payload?.title || 'Task'}` :
                                     activity.eventType === 'case_task_updated' ? `zaktualizował task sprawy: ${activity.payload?.title || 'Task'}` :
                                     activity.eventType === 'case_task_status_toggled' ? `zmienił status taska: ${activity.payload?.title || 'Task'}` :
                                     activity.eventType === 'case_task_deleted' ? `usunął task sprawy: ${activity.payload?.title || 'Task'}` :
                                     activity.eventType === 'case_event_created' ? `dodał wydarzenie do sprawy: ${activity.payload?.title || 'Wydarzenie'}` :
                                     activity.eventType === 'case_event_updated' ? `zaktualizował wydarzenie sprawy: ${activity.payload?.title || 'Wydarzenie'}` :
                                     activity.eventType === 'case_event_status_toggled' ? `zmienił status wydarzenia: ${activity.payload?.title || 'Wydarzenie'}` :
                                     activity.eventType === 'case_event_deleted' ? `usunął wydarzenie sprawy: ${activity.payload?.title || 'Wydarzenie'}` :
                                     activity.eventType === 'case_completed' ? `oznaczył sprawę jako zakończoną` :
                                     activity.eventType === 'case_reminder_requested' ? `wysłał przypomnienie i utworzył follow-up` :
                                     activity.eventType === 'reminder_scheduled' ? `zaplanował przypomnienie: ${activity.payload?.title || 'pozycja'}` :
                                     activity.eventType === 'note_added' ? 'dodał notatkę operacyjną' :
                                     'wykonał akcję'}
                                  </span>
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {formatDateTime(activity.updatedAt || activity.createdAt)}
                                </p>
                                {isCaseNote && activity.payload?.content ? (
                                  <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap break-words">{String(activity.payload.content)}</p>
                                ) : null}
                              </div>
                              {isCaseNote ? (
                                <div className="flex items-center gap-1 shrink-0">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openCaseNoteEditor(activity)}>
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-600" onClick={() => void handleDeleteCaseNote(activity)} disabled={caseNoteActionId === String(activity.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Panel Klienta</h4>
                    <p className="text-xs text-white/70">Udostępnij ten link klientowi.</p>
                  </div>
                </div>
                <Button variant="secondary" className="w-full gap-2" onClick={generatePortalLink}>
                  <Copy className="w-4 h-4" />
                  Kopiuj link dostępu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isQuickTaskOpen} onOpenChange={setIsQuickTaskOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Dodaj zadanie do sprawy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tytuł zadania</Label>
              <Input value={quickTask.title} onChange={(e) => setQuickTask((prev) => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Typ</Label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={quickTask.type} onChange={(e) => setQuickTask((prev) => ({ ...prev, type: e.target.value }))}>
                  <option value="follow_up">Follow-up</option>
                  <option value="meeting">Spotkanie</option>
                  <option value="call">Telefon</option>
                  <option value="offer">Oferta</option>
                  <option value="other">Inne</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Priorytet</Label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={quickTask.priority} onChange={(e) => setQuickTask((prev) => ({ ...prev, priority: e.target.value }))}>
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data i godzina</Label>
              <Input type="datetime-local" value={quickTask.scheduledAt} onChange={(e) => setQuickTask((prev) => ({ ...prev, scheduledAt: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Przypomnienie (opcjonalnie)</Label>
                <Input type="datetime-local" value={quickTask.reminderAt} onChange={(e) => setQuickTask((prev) => ({ ...prev, reminderAt: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Powtarzanie</Label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={quickTask.recurrenceMode} onChange={(e) => setQuickTask((prev) => ({ ...prev, recurrenceMode: e.target.value }))}>
                  {SIMPLE_RECURRENCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {quickTask.recurrenceMode !== 'none' ? (
              <div className="space-y-2">
                <Label>Powtarzaj do (opcjonalnie)</Label>
                <Input type="datetime-local" value={quickTask.recurrenceUntil} onChange={(e) => setQuickTask((prev) => ({ ...prev, recurrenceUntil: e.target.value }))} />
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuickTaskOpen(false)}>Anuluj</Button>
            <Button onClick={() => void handleCreateQuickCaseTask()} disabled={quickTaskSubmitting}>
              {quickTaskSubmitting ? 'Dodawanie...' : 'Dodaj zadanie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isQuickEventOpen} onOpenChange={setIsQuickEventOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Dodaj wydarzenie do sprawy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tytuł wydarzenia</Label>
              <Input value={quickEvent.title} onChange={(e) => setQuickEvent((prev) => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Typ</Label>
              <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={quickEvent.type} onChange={(e) => setQuickEvent((prev) => ({ ...prev, type: e.target.value }))}>
                <option value="meeting">Spotkanie</option>
                <option value="call">Telefon</option>
                <option value="deadline">Deadline</option>
                <option value="review">Review</option>
                <option value="other">Inne</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start</Label>
                <Input type="datetime-local" value={quickEvent.startAt} onChange={(e) => {
                  const nextStart = e.target.value;
                  setQuickEvent((prev) => ({ ...prev, startAt: nextStart, endAt: buildDefaultEventEnd(nextStart) }));
                }} />
              </div>
              <div className="space-y-2">
                <Label>Koniec</Label>
                <Input type="datetime-local" value={quickEvent.endAt} onChange={(e) => setQuickEvent((prev) => ({ ...prev, endAt: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={quickEvent.status} onChange={(e) => setQuickEvent((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="scheduled">Zaplanowane</option>
                  <option value="completed">Wykonane</option>
                  <option value="cancelled">Anulowane</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Przypomnienie (opcjonalnie)</Label>
                <Input type="datetime-local" value={quickEvent.reminderAt} onChange={(e) => setQuickEvent((prev) => ({ ...prev, reminderAt: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Powtarzanie</Label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={quickEvent.recurrenceMode} onChange={(e) => setQuickEvent((prev) => ({ ...prev, recurrenceMode: e.target.value }))}>
                  {SIMPLE_RECURRENCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Powtarzaj do (opcjonalnie)</Label>
                <Input type="datetime-local" value={quickEvent.recurrenceUntil} onChange={(e) => setQuickEvent((prev) => ({ ...prev, recurrenceUntil: e.target.value }))} disabled={quickEvent.recurrenceMode === 'none'} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuickEventOpen(false)}>Anuluj</Button>
            <Button onClick={() => void handleCreateQuickCaseEvent()} disabled={quickEventSubmitting}>
              {quickEventSubmitting ? 'Dodawanie...' : 'Dodaj wydarzenie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditClientOpen} onOpenChange={(open) => {
        setIsEditClientOpen(open);
        if (!open) {
          setShowClientCreateFields(false);
        }
      }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Zmień klienta sprawy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Klient</Label>
              <div className="flex gap-2">
                <Input
                  value={caseClientDraft.clientName}
                  onChange={(e) => setCaseClientDraft((prev) => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Wpisz klienta, a system podpowie z leadów i danych spraw"
                />
                <Button
                  type="button"
                  variant={showClientCreateFields ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setShowClientCreateFields((prev) => !prev)}
                  title="Dodaj nowego klienta"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {caseClientSuggestions.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 space-y-1">
                  {caseClientSuggestions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-white"
                      onClick={() => handleSelectCaseClientSuggestion(option)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{option.name}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {[option.email, option.phone].filter(Boolean).join(' • ') || 'Dane klienta zapisane w systemie'}
                          </p>
                        </div>
                        <Badge variant="outline">{option.source === 'lead' ? 'Z leada' : option.source === 'case' ? 'Ze sprawy' : 'Z danych sprawy'}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {showClientCreateFields ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                <p className="text-sm font-semibold text-slate-900">Nowy klient dla tej sprawy</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-mail klienta</Label>
                    <Input value={caseClientDraft.clientEmail} onChange={(e) => setCaseClientDraft((prev) => ({ ...prev, clientEmail: e.target.value }))} placeholder="np. klient@firma.pl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon klienta</Label>
                    <Input value={caseClientDraft.clientPhone} onChange={(e) => setCaseClientDraft((prev) => ({ ...prev, clientPhone: e.target.value }))} placeholder="np. 500 000 000" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClientOpen(false)}>Anuluj</Button>
            <Button onClick={() => void handleSaveCaseClient()} disabled={caseClientSubmitting}>
              {caseClientSubmitting ? 'Zapisywanie...' : 'Zapisz klienta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editCaseTask)} onOpenChange={(open) => { if (!open) setEditCaseTask(null); }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edytuj task sprawy</DialogTitle>
          </DialogHeader>
          {editCaseTask ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Tytuł taska</Label>
                <Input value={editCaseTask.title} onChange={(e) => setEditCaseTask((prev: any) => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Typ</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={editCaseTask.type} onChange={(e) => setEditCaseTask((prev: any) => ({ ...prev, type: e.target.value }))}>
                    <option value="follow_up">Follow-up</option>
                    <option value="meeting">Spotkanie</option>
                    <option value="call">Telefon</option>
                    <option value="offer">Oferta</option>
                    <option value="other">Inne</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Priorytet</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={editCaseTask.priority} onChange={(e) => setEditCaseTask((prev: any) => ({ ...prev, priority: e.target.value }))}>
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data i godzina</Label>
                <Input type="datetime-local" value={editCaseTask.scheduledAt} onChange={(e) => setEditCaseTask((prev: any) => ({ ...prev, scheduledAt: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Przypomnienie (opcjonalnie)</Label>
                  <Input type="datetime-local" value={editCaseTask.reminderAt || ''} onChange={(e) => setEditCaseTask((prev: any) => ({ ...prev, reminderAt: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Powtarzanie</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={editCaseTask.recurrenceMode || 'none'} onChange={(e) => setEditCaseTask((prev: any) => ({ ...prev, recurrenceMode: e.target.value }))}>
                    {SIMPLE_RECURRENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {editCaseTask.recurrenceMode !== 'none' ? (
                <div className="space-y-2">
                  <Label>Powtarzaj do (opcjonalnie)</Label>
                  <Input type="datetime-local" value={editCaseTask.recurrenceUntil || ''} onChange={(e) => setEditCaseTask((prev: any) => ({ ...prev, recurrenceUntil: e.target.value }))} />
                </div>
              ) : null}
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCaseTask(null)}>Anuluj</Button>
            <Button onClick={() => void handleSaveCaseTaskEdit()} disabled={taskEditSubmitting}>
              {taskEditSubmitting ? 'Zapisywanie...' : 'Zapisz task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editCaseEvent)} onOpenChange={(open) => { if (!open) setEditCaseEvent(null); }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edytuj wydarzenie sprawy</DialogTitle>
          </DialogHeader>
          {editCaseEvent ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Tytuł wydarzenia</Label>
                <Input value={editCaseEvent.title} onChange={(e) => setEditCaseEvent((prev: any) => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Typ</Label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={editCaseEvent.type} onChange={(e) => setEditCaseEvent((prev: any) => ({ ...prev, type: e.target.value }))}>
                  <option value="meeting">Spotkanie</option>
                  <option value="call">Telefon</option>
                  <option value="deadline">Deadline</option>
                  <option value="review">Review</option>
                  <option value="other">Inne</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input type="datetime-local" value={editCaseEvent.startAt} onChange={(e) => setEditCaseEvent((prev: any) => ({ ...prev, startAt: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Koniec</Label>
                  <Input type="datetime-local" value={editCaseEvent.endAt} onChange={(e) => setEditCaseEvent((prev: any) => ({ ...prev, endAt: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={editCaseEvent.status} onChange={(e) => setEditCaseEvent((prev: any) => ({ ...prev, status: e.target.value }))}>
                    <option value="scheduled">Zaplanowane</option>
                    <option value="completed">Wykonane</option>
                    <option value="cancelled">Anulowane</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Przypomnienie (opcjonalnie)</Label>
                  <Input type="datetime-local" value={editCaseEvent.reminderAt || ''} onChange={(e) => setEditCaseEvent((prev: any) => ({ ...prev, reminderAt: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Powtarzanie</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm" value={editCaseEvent.recurrenceMode || 'none'} onChange={(e) => setEditCaseEvent((prev: any) => ({ ...prev, recurrenceMode: e.target.value }))}>
                    {SIMPLE_RECURRENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Powtarzaj do (opcjonalnie)</Label>
                  <Input type="datetime-local" value={editCaseEvent.recurrenceUntil || ''} onChange={(e) => setEditCaseEvent((prev: any) => ({ ...prev, recurrenceUntil: e.target.value }))} disabled={editCaseEvent.recurrenceMode === 'none'} />
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCaseEvent(null)}>Anuluj</Button>
            <Button onClick={() => void handleSaveCaseEventEdit()} disabled={eventEditSubmitting}>
              {eventEditSubmitting ? 'Zapisywanie...' : 'Zapisz wydarzenie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editCaseNote)} onOpenChange={(open) => { if (!open) setEditCaseNote(null); }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edytuj notatkę sprawy</DialogTitle>
          </DialogHeader>
          {editCaseNote ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Treść notatki</Label>
                <Textarea value={editCaseNote.content} onChange={(e) => setEditCaseNote((prev: any) => ({ ...prev, content: e.target.value }))} className="min-h-[120px]" />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCaseNote(null)}>Anuluj</Button>
            <Button onClick={() => void handleSaveCaseNoteEdit()} disabled={caseNoteEditSubmitting}>
              {caseNoteEditSubmitting ? 'Zapisywanie...' : 'Zapisz notatkę'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
