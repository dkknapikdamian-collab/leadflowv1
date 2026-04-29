/*
CLIENT_DETAIL_VISUAL_REBUILD_STAGE12
Client is a relation record. Operational work after acquisition happens in Case.
*/
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Plus,
  Save,
  Target,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  fetchActivitiesFromSupabase,
  fetchCasesFromSupabase,
  fetchClientByIdFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchPaymentsFromSupabase,
  fetchTasksFromSupabase,
  updateClientInSupabase,
  updateLeadInSupabase,
} from '../lib/supabase-fallback';
import '../styles/visual-stage12-client-detail-vnext.css';

type ClientTab = 'summary' | 'cases' | 'history';

type ClientNextAction = {
  kind: 'task' | 'event' | 'case' | 'lead' | 'empty';
  title: string;
  subtitle: string;
  to?: string;
  date?: string;
  relationId?: string;
  tone: 'red' | 'amber' | 'blue' | 'emerald' | 'slate';
};

type ClientCaseRow = {
  id: string;
  title: string;
  status: string;
  statusLabel: string;
  nextActionLabel: string;
  nextActionMeta: string;
  sourceLabel: string;
  completeness: number;
  blocker: string;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asDate(value: unknown) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value: unknown) {
  const parsed = asDate(value);
  if (!parsed) return 'Brak daty';
  return parsed.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(value: unknown) {
  const parsed = asDate(value);
  if (!parsed) return 'Brak daty';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMoney(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? `${amount.toLocaleString('pl-PL')} PLN` : '0 PLN';
}

function getTaskDate(task: any) {
  return String(task?.scheduledAt || task?.dueAt || task?.reminderAt || task?.date || task?.createdAt || '');
}

function getEventDate(event: any) {
  return String(event?.startAt || event?.scheduledAt || event?.reminderAt || event?.createdAt || '');
}

function isDoneStatus(status: unknown) {
  return ['done', 'completed', 'archived', 'cancelled', 'canceled'].includes(String(status || '').toLowerCase());
}

function getActivityTime(activity: any) {
  return String(activity?.createdAt || activity?.updatedAt || activity?.happenedAt || '');
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
      return 'Czeka na odpowiedź';
    case 'accepted':
      return 'Zaakceptowany';
    case 'moved_to_service':
      return 'W obsłudze';
    case 'won':
      return 'Wygrany';
    case 'lost':
      return 'Przegrany';
    case 'archived':
      return 'Archiwum';
    default:
      return status || 'Lead';
  }
}

function caseStatusLabel(status?: string) {
  switch (status) {
    case 'new':
      return 'Nowa';
    case 'waiting_on_client':
      return 'Czeka na klienta';
    case 'blocked':
      return 'Zablokowana';
    case 'to_approve':
      return 'Do akceptacji';
    case 'ready_to_start':
      return 'Gotowa do startu';
    case 'in_progress':
      return 'W realizacji';
    case 'on_hold':
      return 'Wstrzymana';
    case 'completed':
      return 'Zakończona';
    case 'canceled':
      return 'Anulowana';
    default:
      return status || 'Sprawa';
  }
}

function paymentStatusLabel(status?: string) {
  switch (status) {
    case 'paid':
    case 'fully_paid':
      return 'Opłacone';
    case 'partially_paid':
      return 'Częściowo opłacone';
    case 'awaiting_payment':
      return 'Czeka na płatność';
    case 'deposit_paid':
      return 'Zaliczka';
    case 'refunded':
      return 'Zwrot';
    case 'written_off':
      return 'Spisane';
    default:
      return status || 'Rozliczenie';
  }
}

function activityLabel(activity: any) {
  const eventType = String(activity?.eventType || activity?.activityType || 'activity');
  const title = asText(activity?.payload?.title) || asText(activity?.title);

  switch (eventType) {
    case 'calendar_entry_completed':
      return title ? `Wpis kalendarza wykonany: ${title}` : 'Wpis kalendarza wykonany';
    case 'calendar_entry_restored':
      return title ? `Wpis kalendarza przywrócony: ${title}` : 'Wpis kalendarza przywrócony';
    case 'calendar_entry_deleted':
      return title ? `Wpis kalendarza usunięty: ${title}` : 'Wpis kalendarza usunięty';
    case 'today_task_completed':
      return title ? `Zadanie wykonane: ${title}` : 'Zadanie wykonane';
    case 'today_task_restored':
      return title ? `Zadanie przywrócone: ${title}` : 'Zadanie przywrócone';
    case 'today_task_snoozed':
      return title ? `Zadanie przesunięte: ${title}` : 'Zadanie przesunięte';
    case 'today_event_snoozed':
      return title ? `Wydarzenie przesunięte: ${title}` : 'Wydarzenie przesunięte';
    case 'case_lifecycle_started':
      return title ? `Sprawa rozpoczęta: ${title}` : 'Sprawa rozpoczęta';
    case 'case_lifecycle_completed':
      return title ? `Sprawa zakończona: ${title}` : 'Sprawa zakończona';
    case 'case_lifecycle_reopened':
      return title ? `Sprawa wznowiona: ${title}` : 'Sprawa wznowiona';
    case 'ai_draft_converted':
      return title ? `Szkic zatwierdzony: ${title}` : 'Szkic zatwierdzony';
    default:
      return title || 'Aktywność klienta';
  }
}

function getInitials(client: any) {
  const source = String(client?.name || client?.company || 'Klient');
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return initials || 'K';
}

function getClientName(client: any) {
  return String(client?.name || client?.company || 'Klient bez nazwy');
}

function getCaseTitle(caseRecord: any) {
  return String(caseRecord?.title || caseRecord?.clientName || 'Sprawa klienta');
}

function getCaseCompleteness(caseRecord: any) {
  const value = Number(caseRecord?.completenessPercent || caseRecord?.completionPercent || 0);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
}

function getCaseBlocker(caseRecord: any) {
  const explicit = asText(caseRecord?.blocker) || asText(caseRecord?.blockReason) || asText(caseRecord?.missingReason);
  if (explicit) return explicit;
  const status = String(caseRecord?.status || '');
  if (status === 'blocked') return 'blokada w sprawie';
  if (status === 'waiting_on_client') return 'czeka na klienta';
  if (status === 'to_approve') return 'czeka na akceptację';
  if (status === 'on_hold') return 'sprawa wstrzymana';
  return '';
}

function getCaseSourceLead(caseRecord: any, leads: any[]) {
  const caseId = String(caseRecord?.id || '');
  const directLeadId = String(caseRecord?.leadId || caseRecord?.sourceLeadId || '');
  return (
    leads.find((lead) => String(lead.id || '') === directLeadId) ||
    leads.find((lead) => String(lead.linkedCaseId || lead.caseId || '') === caseId) ||
    null
  );
}

function getCaseNextAction(caseRecord: any, tasks: any[], events: any[]) {
  const caseId = String(caseRecord?.id || '');
  const caseTasks = tasks.filter((task) => String(task.caseId || '') === caseId && !isDoneStatus(task.status));
  const caseEvents = events.filter((event) => String(event.caseId || '') === caseId && !isDoneStatus(event.status));
  const entries = [
    ...caseTasks.map((task) => ({
      kind: 'task' as const,
      title: String(task.title || 'Zadanie'),
      date: getTaskDate(task),
      time: asDate(getTaskDate(task))?.getTime() ?? Number.MAX_SAFE_INTEGER,
    })),
    ...caseEvents.map((event) => ({
      kind: 'event' as const,
      title: String(event.title || 'Wydarzenie'),
      date: getEventDate(event),
      time: asDate(getEventDate(event))?.getTime() ?? Number.MAX_SAFE_INTEGER,
    })),
  ].sort((left, right) => left.time - right.time);

  return entries[0] || null;
}

function relativeActionLabel(value: unknown) {
  const parsed = asDate(value);
  if (!parsed) return 'Brak terminu';
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetStart = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).getTime();
  const diff = Math.round((targetStart - todayStart) / 86_400_000);
  if (diff === 0) return 'Dzisiaj';
  if (diff === 1) return 'Jutro';
  if (diff === -1) return 'Wczoraj';
  return formatDate(value);
}

function statusBadgeClass(status: unknown) {
  const normalized = String(status || '').toLowerCase();
  if (['blocked', 'overdue'].includes(normalized)) return 'client-detail-pill-danger';
  if (['waiting_on_client', 'on_hold', 'to_approve'].includes(normalized)) return 'client-detail-pill-amber';
  if (['completed', 'done', 'paid', 'ready_to_start'].includes(normalized)) return 'client-detail-pill-green';
  if (['canceled', 'cancelled', 'lost'].includes(normalized)) return 'client-detail-pill-muted';
  return 'client-detail-pill-blue';
}

function nextActionToneClass(tone: ClientNextAction['tone']) {
  if (tone === 'red') return 'client-detail-callout-danger';
  if (tone === 'amber') return 'client-detail-callout-amber';
  if (tone === 'emerald') return 'client-detail-callout-green';
  if (tone === 'blue') return 'client-detail-callout-blue';
  return 'client-detail-callout-muted';
}

function buildClientNextAction(leads: any[], cases: any[], tasks: any[], events: any[]): ClientNextAction {
  const now = Date.now();
  const overdueTask = tasks
    .filter((task) => !isDoneStatus(task?.status))
    .map((task) => ({ task, time: asDate(getTaskDate(task))?.getTime() ?? Number.MAX_SAFE_INTEGER }))
    .filter((entry) => entry.time < now)
    .sort((left, right) => left.time - right.time)[0]?.task;

  if (overdueTask) {
    return {
      kind: 'task',
      title: String(overdueTask.title || 'Zaległe zadanie'),
      subtitle: `Termin: ${formatDateTime(getTaskDate(overdueTask))}`,
      date: getTaskDate(overdueTask),
      relationId: String(overdueTask.caseId || overdueTask.leadId || ''),
      to: '/today',
      tone: 'red',
    };
  }

  const nextTask = tasks
    .filter((task) => !isDoneStatus(task?.status))
    .map((task) => ({ task, time: asDate(getTaskDate(task))?.getTime() ?? Number.MAX_SAFE_INTEGER }))
    .sort((left, right) => left.time - right.time)[0]?.task;

  if (nextTask) {
    return {
      kind: 'task',
      title: String(nextTask.title || 'Następne zadanie'),
      subtitle: `Termin: ${formatDateTime(getTaskDate(nextTask))}`,
      date: getTaskDate(nextTask),
      relationId: String(nextTask.caseId || nextTask.leadId || ''),
      to: '/today',
      tone: 'amber',
    };
  }

  const nextEvent = events
    .filter((event) => !isDoneStatus(event?.status))
    .map((event) => ({ event, time: asDate(getEventDate(event))?.getTime() ?? Number.MAX_SAFE_INTEGER }))
    .sort((left, right) => left.time - right.time)[0]?.event;

  if (nextEvent) {
    return {
      kind: 'event',
      title: String(nextEvent.title || 'Następne wydarzenie'),
      subtitle: `Start: ${formatDateTime(getEventDate(nextEvent))}`,
      date: getEventDate(nextEvent),
      relationId: String(nextEvent.caseId || nextEvent.leadId || ''),
      to: '/calendar',
      tone: 'blue',
    };
  }

  const activeCase = cases.find((caseRecord) => !['completed', 'canceled'].includes(String(caseRecord.status || '')));
  if (activeCase) {
    return {
      kind: 'case',
      title: getCaseTitle(activeCase),
      subtitle: `${caseStatusLabel(String(activeCase.status || 'in_progress'))} · kompletność ${getCaseCompleteness(activeCase)}%`,
      relationId: String(activeCase.id || ''),
      to: `/cases/${String(activeCase.id)}`,
      tone: 'emerald',
    };
  }

  const openLead = leads.find((lead) => !['moved_to_service', 'lost', 'archived'].includes(String(lead.status || '')));
  if (openLead) {
    return {
      kind: 'lead',
      title: String(openLead.name || 'Aktywny lead'),
      subtitle: leadStatusLabel(String(openLead.status || 'new')),
      relationId: String(openLead.id || ''),
      to: `/leads/${String(openLead.id)}`,
      tone: 'blue',
    };
  }

  return {
    kind: 'empty',
    title: 'Brak aktywnego ruchu',
    subtitle: 'Ten klient nie ma teraz otwartego zadania, wydarzenia, leada ani sprawy.',
    tone: 'slate',
  };
}

type ClientMultiContactKind = 'email' | 'phone';

type ClientMultiContactFieldProps = {
  kind: ClientMultiContactKind;
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
};

function splitClientContactValue(value?: string | null) {
  const parts = String(value || '')
    .split(/[;\n]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return parts.length ? parts : [''];
}

function joinClientContactValue(values: string[]) {
  return values
    .map((entry) => String(entry || '').trim())
    .filter(Boolean)
    .join('; ');
}

function ClientMultiContactField({ kind, label, value, onChange, placeholder }: ClientMultiContactFieldProps) {
  const values = splitClientContactValue(value);

  const updateValue = (index: number, nextValue: string) => {
    const next = [...values];
    next[index] = nextValue;
    onChange(joinClientContactValue(next));
  };

  const addValue = () => {
    onChange(joinClientContactValue([...values, '']));
  };

  const removeValue = (index: number) => {
    const next = values.filter((_, currentIndex) => currentIndex !== index);
    onChange(joinClientContactValue(next.length ? next : ['']));
  };

  return (
    <div className="client-detail-edit-field" data-client-contact-repeat={kind}>
      <div className="client-detail-edit-label-row">
        <Label>{label}</Label>
        <button
          type="button"
          className="client-detail-mini-button"
          onClick={addValue}
          data-client-contact-repeat-add={kind}
          aria-label={kind === 'email' ? 'Dodaj kolejny email klienta' : 'Dodaj kolejny telefon klienta'}
        >
          +
        </button>
      </div>
      <div className="client-detail-contact-repeat-list">
        {values.map((entry, index) => (
          <div key={index} className="client-detail-contact-repeat-row" data-client-contact-repeat-row={kind}>
            <Input
              value={entry}
              onChange={(event) => updateValue(index, event.target.value)}
              placeholder={placeholder || (kind === 'email' ? 'email klienta' : 'telefon klienta')}
              type={kind === 'email' ? 'email' : 'tel'}
            />
            {values.length > 1 ? (
              <button
                type="button"
                className="client-detail-mini-button client-detail-mini-button-muted"
                onClick={() => removeValue(index)}
                aria-label={kind === 'email' ? 'Usuń email klienta' : 'Usuń telefon klienta'}
              >
                Usuń
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, onCopy }: { icon: any; label: string; value: string; onCopy?: () => void }) {
  return (
    <div className="client-detail-info-row">
      <span className="client-detail-info-icon">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <small>{label}</small>
        <strong>{value || '-'}</strong>
      </span>
      {onCopy && value ? (
        <button type="button" className="client-detail-icon-button" onClick={onCopy} aria-label={`Kopiuj ${label}`}>
          <Copy className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="client-detail-stat-cell">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<ClientTab>('summary');
  const [contactEditing, setContactEditing] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', notes: '' });

  const reload = useCallback(async () => {
    if (!workspace?.id || !clientId) {
      setLoading(workspaceLoading);
      return;
    }

    setLoading(true);
    try {
      const [clientRow, leadRows, caseRows, paymentRows, taskRows, eventRows, activityRows] = await Promise.all([
        fetchClientByIdFromSupabase(clientId),
        fetchLeadsFromSupabase({ clientId }),
        fetchCasesFromSupabase({ clientId }),
        fetchPaymentsFromSupabase({ clientId }),
        fetchTasksFromSupabase(),
        fetchEventsFromSupabase(),
        fetchActivitiesFromSupabase({ limit: 120 }),
      ]);

      setClient(clientRow);
      setLeads(Array.isArray(leadRows) ? leadRows : []);
      setCases(Array.isArray(caseRows) ? caseRows : []);
      setPayments(Array.isArray(paymentRows) ? paymentRows : []);
      setTasks(Array.isArray(taskRows) ? taskRows : []);
      setEvents(Array.isArray(eventRows) ? eventRows : []);
      setActivities(Array.isArray(activityRows) ? activityRows : []);
      setForm({
        name: String((clientRow as any)?.name || ''),
        company: String((clientRow as any)?.company || ''),
        email: String((clientRow as any)?.email || ''),
        phone: String((clientRow as any)?.phone || ''),
        notes: String((clientRow as any)?.notes || ''),
      });
    } catch (error: any) {
      toast.error(`Błąd odczytu klienta: ${error?.message || 'REQUEST_FAILED'}`);
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, [clientId, workspace?.id, workspaceLoading]);

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }
    void reload();
  }, [reload, workspace?.id, workspaceLoading]);

  const relationIds = useMemo(() => {
    const leadIds = new Set(leads.map((lead) => String(lead.id || '')).filter(Boolean));
    const caseIds = new Set(cases.map((caseRecord) => String(caseRecord.id || '')).filter(Boolean));
    return { leadIds, caseIds };
  }, [cases, leads]);

  const clientTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          String(task.clientId || '') === String(clientId || '') ||
          relationIds.leadIds.has(String(task.leadId || '')) ||
          relationIds.caseIds.has(String(task.caseId || '')),
      )
      .sort(
        (left, right) =>
          (asDate(getTaskDate(left))?.getTime() ?? Number.MAX_SAFE_INTEGER) -
          (asDate(getTaskDate(right))?.getTime() ?? Number.MAX_SAFE_INTEGER),
      );
  }, [clientId, relationIds.caseIds, relationIds.leadIds, tasks]);

  const clientEvents = useMemo(() => {
    return events
      .filter(
        (event) =>
          String(event.clientId || '') === String(clientId || '') ||
          relationIds.leadIds.has(String(event.leadId || '')) ||
          relationIds.caseIds.has(String(event.caseId || '')),
      )
      .sort(
        (left, right) =>
          (asDate(getEventDate(left))?.getTime() ?? Number.MAX_SAFE_INTEGER) -
          (asDate(getEventDate(right))?.getTime() ?? Number.MAX_SAFE_INTEGER),
      );
  }, [clientId, events, relationIds.caseIds, relationIds.leadIds]);

  const clientActivities = useMemo(() => {
    return activities
      .filter(
        (activity) =>
          String(activity.clientId || '') === String(clientId || '') ||
          relationIds.leadIds.has(String(activity.leadId || '')) ||
          relationIds.caseIds.has(String(activity.caseId || '')),
      )
      .sort((left, right) => (asDate(getActivityTime(right))?.getTime() ?? 0) - (asDate(getActivityTime(left))?.getTime() ?? 0));
  }, [activities, clientId, relationIds.caseIds, relationIds.leadIds]);

  const activeCases = useMemo(
    () => cases.filter((caseRecord) => !['completed', 'canceled'].includes(String(caseRecord.status || ''))),
    [cases],
  );

  const closedCases = useMemo(
    () => cases.filter((caseRecord) => ['completed', 'canceled'].includes(String(caseRecord.status || ''))),
    [cases],
  );

  const waitingCaseCount = useMemo(
    () => cases.filter((caseRecord) => ['waiting_on_client', 'blocked', 'to_approve', 'on_hold'].includes(String(caseRecord.status || ''))).length,
    [cases],
  );

  const blockers = useMemo(
    () => cases.map((caseRecord) => ({ caseRecord, blocker: getCaseBlocker(caseRecord) })).filter((entry) => entry.blocker),
    [cases],
  );

  const paymentTotal = useMemo(() => payments.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0), [payments]);
  const mainCase = activeCases[0] || cases[0] || null;
  const mainCaseCompleteness = mainCase ? getCaseCompleteness(mainCase) : 0;
  const activeTaskCount = useMemo(() => clientTasks.filter((task) => !isDoneStatus(task.status)).length, [clientTasks]);
  const activeEventCount = useMemo(() => clientEvents.filter((event) => !isDoneStatus(event.status)).length, [clientEvents]);
  const nextAction = useMemo(() => buildClientNextAction(leads, cases, clientTasks, clientEvents), [cases, clientEvents, clientTasks, leads]);
  const lastActivityDate = clientActivities[0]?.createdAt || clientActivities[0]?.updatedAt || client?.updatedAt || client?.createdAt;
  const firstSourceLead = leads[0] || null;

  const clientCaseRows = useMemo<ClientCaseRow[]>(() => {
    return cases.map((caseRecord) => {
      const sourceLead = getCaseSourceLead(caseRecord, leads);
      const next = getCaseNextAction(caseRecord, clientTasks, clientEvents);
      return {
        id: String(caseRecord.id || ''),
        title: getCaseTitle(caseRecord),
        status: String(caseRecord.status || 'in_progress'),
        statusLabel: caseStatusLabel(String(caseRecord.status || 'in_progress')),
        nextActionLabel: next ? next.title : 'Brak zaplanowanych działań',
        nextActionMeta: next ? `${next.kind === 'task' ? 'Zadanie' : 'Wydarzenie'} · ${relativeActionLabel(next.date)}` : 'Dodaj zadanie albo wydarzenie w sprawie.',
        sourceLabel: sourceLead ? `Lead: ${String(sourceLead.name || sourceLead.company || 'bez nazwy')}` : `Utworzono: ${formatDate(caseRecord.createdAt)}`,
        completeness: getCaseCompleteness(caseRecord),
        blocker: getCaseBlocker(caseRecord),
      };
    });
  }, [cases, clientEvents, clientTasks, leads]);

  const handleSave = async () => {
    if (!clientId) return;
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    try {
      setSaving(true);
      await updateClientInSupabase({
        id: clientId,
        ...form,
      });
      setContactEditing(false);

      const linkedLeadUpdates = leads
        .filter((lead) => String(lead?.id || '').trim())
        .map((lead) =>
          updateLeadInSupabase({
            id: String(lead.id),
            name: form.name,
            company: form.company,
            email: form.email,
            phone: form.phone,
          }),
        );

      const linkedLeadResults = await Promise.allSettled(linkedLeadUpdates);
      const failedLeadSyncs = linkedLeadResults.filter((result) => result.status === 'rejected').length;

      if (failedLeadSyncs > 0) {
        toast.error('Klient zapisany, ale nie udało się zsynchronizować części powiązanych leadów.');
      } else {
        toast.success('Klient zaktualizowany');
      }
      await reload();
    } catch (error: any) {
      toast.error(`Błąd zapisu klienta: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClientPanelEditToggle = async () => {
    if (contactEditing) {
      await handleSave();
      return;
    }
    setContactEditing(true);
  };

  const cancelClientPanelEdit = () => {
    setForm({
      name: String(client?.name || ''),
      company: String(client?.company || ''),
      email: String(client?.email || ''),
      phone: String(client?.phone || ''),
      notes: String(client?.notes || ''),
    });
    setContactEditing(false);
  };

  const copyValue = async (label: string, value: string) => {
    if (!value) return toast.error(`Brak wartości: ${label}`);
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} skopiowano`);
    } catch {
      toast.error('Nie udało się skopiować.');
    }
  };

  const openNewCase = () => {
    if (!clientId) return navigate('/cases');
    navigate(`/cases?clientId=${encodeURIComponent(clientId)}&new=1`);
  };

  const openNewLeadForExistingClient = () => {
    if (!clientId) return navigate('/leads');
    navigate(`/leads?clientId=${encodeURIComponent(clientId)}&new=1`);
  };

  const openMainCase = () => {
    if (!mainCase?.id) return;
    navigate(`/cases/${String(mainCase.id)}`);
  };

  if (loading || workspaceLoading) {
    return (
      <Layout>
        <main className="client-detail-vnext-page">
          <div className="client-detail-loading-card">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Ładowanie klienta...</span>
          </div>
        </main>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <main className="client-detail-vnext-page">
          <section className="client-detail-empty-card">
            <UserRound className="h-8 w-8" />
            <h1>Nie znaleziono klienta</h1>
            <p>Ten rekord mógł zostać usunięty albo nie należy do aktualnego workspace.</p>
            <Button type="button" onClick={() => navigate('/clients')} variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Wróć do klientów
            </Button>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="client-detail-vnext-page">
        <header className="client-detail-header">
          <div className="client-detail-header-copy">
            <button type="button" className="client-detail-back-button" onClick={() => navigate('/clients')}>
              <ArrowLeft className="h-4 w-4" />
              Klienci
            </button>
            <p className="client-detail-breadcrumb">Klienci / {getClientName(client)}</p>
            <p className="client-detail-kicker">KARTOTEKA KLIENTA</p>
            <h1>{getClientName(client)}</h1>
            <div className="client-detail-header-meta">
              <span>Ostatni kontakt: {formatDate(lastActivityDate)}</span>
              <span>Główna sprawa: {mainCase ? getCaseTitle(mainCase) : 'Brak głównej sprawy'}</span>
              <span>Status relacji: {activeCases.length > 0 ? 'Aktywna obsługa' : leads.length > 0 ? 'Kontakt po leadzie' : 'Kartoteka'}</span>
            </div>
          </div>
          <div className="client-detail-header-actions">
            <Button type="button" variant="outline" onClick={openMainCase} disabled={!mainCase?.id}>
              <Briefcase className="h-4 w-4" />
              Otwórz główną sprawę
            </Button>
            <Button type="button" onClick={openNewCase} disabled={!hasAccess}>
              <Plus className="h-4 w-4" />
              Nowa sprawa dla klienta
            </Button>
          </div>
        </header>

        <div className="client-detail-shell">
          <aside className="client-detail-left-rail">
            <section className="client-detail-profile-card client-detail-side-card">
              <div className="client-detail-avatar-row">
                <div className="client-detail-avatar">{getInitials(client)}</div>
                <div>
                  <h2>{getClientName(client)}</h2>
                  <p>{client.company || 'Brak firmy'}</p>
                </div>
              </div>

              <div className="client-detail-profile-meta">
                <span>Ostatni kontakt: {formatDate(lastActivityDate)}</span>
                <span>Główna sprawa: {mainCase ? getCaseTitle(mainCase) : 'Brak sprawy'}</span>
              </div>

              <div className="client-detail-mini-stats">
                <StatCell label="Otwarte sprawy" value={activeCases.length} />
                <StatCell label="Czeka" value={waitingCaseCount} />
                <StatCell label="Akcje" value={activeTaskCount + activeEventCount} />
              </div>

              {contactEditing ? (
                <div className="client-detail-edit-form">
                  <div className="client-detail-edit-field">
                    <Label>Nazwa klienta</Label>
                    <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                  </div>
                  <div className="client-detail-edit-field">
                    <Label>Firma</Label>
                    <Input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} placeholder="Brak firmy" />
                  </div>
                  <ClientMultiContactField
                    kind="phone"
                    label="Telefon"
                    value={form.phone}
                    onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
                    placeholder="telefon klienta"
                  />
                  <ClientMultiContactField
                    kind="email"
                    label="E-mail"
                    value={form.email}
                    onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                    placeholder="email klienta"
                  />
                  <div className="client-detail-edit-field">
                    <Label>Notatka</Label>
                    <Textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
                  </div>
                  <div className="client-detail-edit-actions">
                    <Button type="button" onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4" />
                      {saving ? 'Zapisuję...' : 'Zapisz'}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelClientPanelEdit} disabled={saving}>
                      Anuluj
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="client-detail-contact-list">
                  <InfoRow icon={Phone} label="Telefon" value={client.phone || '-'} onCopy={() => copyValue('Telefon', client.phone)} />
                  <InfoRow icon={Mail} label="E-mail" value={client.email || '-'} onCopy={() => copyValue('E-mail', client.email)} />
                  <InfoRow icon={Building2} label="Firma" value={client.company || 'Brak firmy'} />
                </div>
              )}

              <Button type="button" variant="outline" className="client-detail-edit-main-button" onClick={handleClientPanelEditToggle} disabled={saving}>
                <Pencil className="h-4 w-4" />
                {contactEditing ? 'Zapisz dane klienta' : 'Edytuj dane klienta'}
              </Button>
            </section>

            <section className="client-detail-actions-card client-detail-side-card">
              <div className="client-detail-card-title-row">
                <Target className="h-4 w-4" />
                <h2>Akcje klienta</h2>
              </div>
              <div className="client-detail-action-grid">
                <button type="button" onClick={openNewLeadForExistingClient}>Nowy temat do pozyskania</button>
                <button type="button" onClick={() => copyValue('Kontakt', client.phone || client.email || '')}>Szybki kontakt</button>
                <button type="button" disabled title="Do podpięcia w kolejnym etapie">Archiwizuj klienta</button>
                <button type="button" disabled title="Do podpięcia w kolejnym etapie">Eksportuj historię</button>
              </div>
            </section>
          </aside>

          <section className="client-detail-main-column">
            <nav className="client-detail-tabs" aria-label="Zakładki klienta">
              {[
                { key: 'summary', label: 'Podsumowanie' },
                { key: 'cases', label: 'Sprawy' },
                { key: 'history', label: 'Historia' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={activeTab === tab.key ? 'client-detail-tab-active' : ''}
                  onClick={() => setActiveTab(tab.key as ClientTab)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {activeTab === 'summary' ? (
              <div className="client-detail-tab-panel">
                <div className="client-detail-summary-grid">
                  <section className={`client-detail-summary-card ${nextActionToneClass(nextAction.tone)}`}>
                    <div className="client-detail-card-title-row">
                      <Clock className="h-4 w-4" />
                      <h2>Najbliższa akcja</h2>
                    </div>
                    <strong>{nextAction.title}</strong>
                    <p>{nextAction.subtitle}</p>
                    {nextAction.to ? (
                      <button type="button" onClick={() => navigate(nextAction.to as string)}>
                        Przejdź dalej <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : null}
                  </section>

                  <section className="client-detail-summary-card client-detail-callout-amber">
                    <div className="client-detail-card-title-row">
                      <AlertTriangle className="h-4 w-4" />
                      <h2>Blokady</h2>
                    </div>
                    <strong>{blockers.length}</strong>
                    <p>{blockers[0] ? `${getCaseTitle(blockers[0].caseRecord)}: ${blockers[0].blocker}` : 'Brak aktywnych blokad przy sprawach klienta.'}</p>
                  </section>

                  <section className="client-detail-summary-card client-detail-callout-green">
                    <div className="client-detail-card-title-row">
                      <CheckCircle2 className="h-4 w-4" />
                      <h2>Kompletność głównej sprawy</h2>
                    </div>
                    <strong>{mainCase ? `${mainCaseCompleteness}%` : '-'}</strong>
                    <p>{mainCase ? getCaseTitle(mainCase) : 'Brak głównej sprawy do oceny kompletności.'}</p>
                    {mainCase ? <div className="client-detail-progress"><span style={{ width: `${mainCaseCompleteness}%` }} /></div> : null}
                  </section>
                </div>

                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Sprawy klienta</h2>
                      <p>Podgląd tematów operacyjnych. Główna praca dzieje się w sprawie.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => setActiveTab('cases')}>
                      Zobacz wszystkie
                    </Button>
                  </div>
                  <div className="client-detail-case-list">
                    {clientCaseRows.length === 0 ? (
                      <div className="client-detail-light-empty">Brak spraw przy tym kliencie. Po pozyskaniu tematu utwórz sprawę i prowadź tam dalszą obsługę.</div>
                    ) : (
                      clientCaseRows.slice(0, 4).map((caseRow) => (
                        <article key={caseRow.id} className="client-detail-case-row">
                          <div>
                            <h3>{caseRow.title}</h3>
                            <p>{caseRow.sourceLabel}</p>
                          </div>
                          <span className={`client-detail-pill ${statusBadgeClass(caseRow.status)}`}>{caseRow.statusLabel}</span>
                          <div>
                            <strong>{caseRow.nextActionLabel}</strong>
                            <p>{caseRow.nextActionMeta}</p>
                          </div>
                          <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/cases/${caseRow.id}`)}>
                            Otwórz sprawę
                          </Button>
                        </article>
                      ))
                    )}
                  </div>
                </section>

                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Historia pozyskania</h2>
                      <p>Pierwszy kontakt, źródło i połączenie z leadem źródłowym.</p>
                    </div>
                    {firstSourceLead ? (
                      <Button type="button" variant="outline" onClick={() => navigate(`/leads/${String(firstSourceLead.id)}`)}>
                        Otwórz lead
                      </Button>
                    ) : null}
                  </div>
                  <div className="client-detail-source-grid">
                    <div>
                      <small>Pierwszy kontakt</small>
                      <strong>{firstSourceLead ? formatDate(firstSourceLead.createdAt || firstSourceLead.updatedAt) : formatDate(client.createdAt)}</strong>
                    </div>
                    <div>
                      <small>Źródło</small>
                      <strong>{firstSourceLead?.source || client.source || 'Brak źródła'}</strong>
                    </div>
                    <div>
                      <small>Lead źródłowy</small>
                      <strong>{firstSourceLead ? String(firstSourceLead.name || firstSourceLead.company || 'Lead bez nazwy') : 'Brak powiązanego leada'}</strong>
                    </div>
                  </div>
                </section>
              </div>
            ) : null}

            {activeTab === 'cases' ? (
              <div className="client-detail-tab-panel">
                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Sprawy</h2>
                      <p>Klient jest rekordem zbiorczym. Po wejściu w obsługę pracuj na konkretnej sprawie.</p>
                    </div>
                    <Button type="button" onClick={openNewCase} disabled={!hasAccess}>
                      <Plus className="h-4 w-4" />
                      Nowa sprawa
                    </Button>
                  </div>
                  <div className="client-detail-case-list">
                    {clientCaseRows.length === 0 ? (
                      <div className="client-detail-light-empty">Brak spraw do pokazania.</div>
                    ) : (
                      clientCaseRows.map((caseRow) => (
                        <article key={caseRow.id} className="client-detail-case-row client-detail-case-row-wide">
                          <div>
                            <h3>{caseRow.title}</h3>
                            <p>{caseRow.sourceLabel}</p>
                          </div>
                          <span className={`client-detail-pill ${statusBadgeClass(caseRow.status)}`}>{caseRow.statusLabel}</span>
                          <div>
                            <strong>{caseRow.nextActionLabel}</strong>
                            <p>{caseRow.nextActionMeta}</p>
                          </div>
                          <div>
                            <strong>{caseRow.completeness}%</strong>
                            <p>{caseRow.blocker || 'Brak blokady'}</p>
                          </div>
                          <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/cases/${caseRow.id}`)}>
                            Otwórz sprawę
                          </Button>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              </div>
            ) : null}

            {activeTab === 'history' ? (
              <div className="client-detail-tab-panel">
                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Historia</h2>
                      <p>Lekka oś ostatnich ruchów powiązanych z klientem, leadami i sprawami.</p>
                    </div>
                  </div>
                  <div className="client-detail-history-list">
                    {clientActivities.length === 0 ? (
                      <div className="client-detail-light-empty">Brak historii do pokazania.</div>
                    ) : (
                      clientActivities.slice(0, 16).map((activity) => (
                        <article key={String(activity.id || activity.eventType || getActivityTime(activity))} className="client-detail-history-row">
                          <span className="client-detail-history-dot"><Activity className="h-4 w-4" /></span>
                          <div>
                            <h3>{activityLabel(activity)}</h3>
                            <p>{formatDateTime(getActivityTime(activity))}</p>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              </div>
            ) : null}
          </section>

          <aside className="client-detail-right-rail" aria-label="Panel klienta">
            <section className="right-card client-detail-right-card">
              <div className="client-detail-card-title-row">
                <Briefcase className="h-4 w-4" />
                <h2>Główna sprawa</h2>
              </div>
              <p>{mainCase ? getCaseTitle(mainCase) : 'Brak głównej sprawy'}</p>
              <small>{mainCase ? `${caseStatusLabel(mainCase.status)} · ${mainCaseCompleteness}% kompletności` : 'Utwórz sprawę, gdy temat przejdzie do obsługi.'}</small>
              {mainCase ? (
                <Button type="button" variant="outline" size="sm" onClick={openMainCase}>
                  Otwórz sprawę
                </Button>
              ) : null}
            </section>

            <section className="right-card client-detail-right-card">
              <div className="client-detail-card-title-row">
                <Clock className="h-4 w-4" />
                <h2>Najbliższy ruch</h2>
              </div>
              <p>{nextAction.title}</p>
              <small>{nextAction.subtitle}</small>
            </section>

            <section className="right-card client-detail-right-card">
              <div className="client-detail-card-title-row">
                <FileText className="h-4 w-4" />
                <h2>Podsumowanie</h2>
              </div>
              <div className="client-detail-right-metrics">
                <span><strong>{activeCases.length}</strong> otwarte sprawy</span>
                <span><strong>{closedCases.length}</strong> zamknięte sprawy</span>
                <span><strong>{leads.length}</strong> leady źródłowe</span>
                <span><strong>{formatMoney(paymentTotal)}</strong> rozliczenia</span>
              </div>
            </section>

            <section className="right-card client-detail-right-card">
              <div className="client-detail-card-title-row">
                <Calendar className="h-4 w-4" />
                <h2>Skróty</h2>
              </div>
              <div className="client-detail-right-shortcuts">
                <button type="button" onClick={() => navigate('/today')}>Zobacz zadania</button>
                <button type="button" onClick={() => navigate('/calendar')}>Zobacz kalendarz</button>
                <button type="button" onClick={() => navigate('/cases')}>Lista spraw</button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
