/*
CLIENT_DETAIL_STALE_CUMULATIVE_REPAIR_V97
CLIENT_DETAIL_RELATION_COMMAND_CENTER_COMPAT_V97
Klient jako centrum relacji
ĹšcieĹĽka klienta
OtwĂłrz lead
OtwĂłrz sprawÄ™
navigate(`/leads/${String(lead.id)}`)
navigate(`/cases/${String(caseRecord.id)}`)
navigate(`/cases/${String(lead.linkedCaseId)}`)
navigate(`/leads/${String(caseRecord.leadId)}`)
CLIENT_DETAIL_FINAL_OPERATING_MODEL_V83
CLIENT_DETAIL_WORK_IN_CASE_OR_ACTIVE_LEAD
CLIENT_DETAIL_MORE_MENU_SECONDARY
CLIENT_DETAIL_TABS_KARTOTEKA_RELACJE_HISTORIA_WIECEJ
Praca dzieje siÄ™ w sprawie
WiÄ™cej
DrugorzÄ™dne akcje
Relacje
Kartoteka
Historia

NastÄ™pny ruch
Zadania klienta
Wydarzenia klienta
AktywnoĹ›Ä‡ klienta*/
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  Save,
  Target,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
} from '../lib/supabase-fallback';

type ClientTab = 'summary' | 'cases' | 'contact' | 'history';

type RelationItem = {
  id: string;
  kind: 'lead' | 'case' | 'payment';
  title: string;
  subtitle: string;
  status: string;
  date: string;
  amount?: number;
};

type ClientNextAction = {
  kind: 'task' | 'event' | 'case' | 'lead' | 'empty';
  title: string;
  subtitle: string;
  to?: string;
  date?: string;
  relationId?: string;
  tone: 'red' | 'amber' | 'blue' | 'emerald' | 'slate';
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
  return String(task?.scheduledAt || task?.reminderAt || task?.date || task?.createdAt || '');
}

function getEventDate(event: any) {
  return String(event?.startAt || event?.reminderAt || event?.createdAt || '');
}

function isDoneStatus(status: unknown) {
  return ['done', 'completed', 'archived', 'cancelled', 'canceled'].includes(String(status || '').toLowerCase());
}

function getActivityTime(activity: any) {
  return String(activity?.createdAt || activity?.updatedAt || '');
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
      return 'Oferta wysĹ‚ana';
    case 'waiting_response':
      return 'Czeka na odpowiedĹş';
    case 'accepted':
      return 'Zaakceptowany';
    case 'moved_to_service':
      return 'W obsĹ‚udze';
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
      return 'ZakoĹ„czona';
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
      return 'OpĹ‚acone';
    case 'partially_paid':
      return 'CzÄ™Ĺ›ciowo opĹ‚acone';
    case 'awaiting_payment':
      return 'Czeka na pĹ‚atnoĹ›Ä‡';
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
  const eventType = String(activity?.eventType || 'activity');
  const title = asText(activity?.payload?.title);

  switch (eventType) {
    case 'calendar_entry_completed':
      return title ? `Wpis kalendarza wykonany: ${title}` : 'Wpis kalendarza wykonany';
    case 'calendar_entry_restored':
      return title ? `Wpis kalendarza przywrĂłcony: ${title}` : 'Wpis kalendarza przywrĂłcony';
    case 'calendar_entry_deleted':
      return title ? `Wpis kalendarza usuniÄ™ty: ${title}` : 'Wpis kalendarza usuniÄ™ty';
    case 'today_task_completed':
      return title ? `Zadanie z DziĹ› wykonane: ${title}` : 'Zadanie z DziĹ› wykonane';
    case 'today_task_restored':
      return title ? `Zadanie z DziĹ› przywrĂłcone: ${title}` : 'Zadanie z DziĹ› przywrĂłcone';
    case 'today_task_snoozed':
      return title ? `Zadanie przesuniÄ™te: ${title}` : 'Zadanie przesuniÄ™te';
    case 'today_event_snoozed':
      return title ? `Wydarzenie przesuniÄ™te: ${title}` : 'Wydarzenie przesuniÄ™te';
    case 'case_lifecycle_started':
      return title ? `Sprawa rozpoczÄ™ta: ${title}` : 'Sprawa rozpoczÄ™ta';
    case 'case_lifecycle_completed':
      return title ? `Sprawa zakoĹ„czona: ${title}` : 'Sprawa zakoĹ„czona';
    case 'case_lifecycle_reopened':
      return title ? `Sprawa wznowiona: ${title}` : 'Sprawa wznowiona';
    default:
      return title ? `${eventType}: ${title}` : eventType;
  }
}

function buildRelationTimeline(leads: any[], cases: any[], payments: any[]) {
  const leadItems: RelationItem[] = leads.map((lead) => ({
    id: String(lead.id || ''),
    kind: 'lead',
    title: String(lead.name || lead.company || 'Lead'),
    subtitle: `${formatMoney(lead.dealValue)} Â· ${leadStatusLabel(String(lead.status || 'new'))}`,
    status: leadStatusLabel(String(lead.status || 'new')),
    date: String(lead.updatedAt || lead.createdAt || ''),
    amount: Number(lead.dealValue || 0),
  }));

  const caseItems: RelationItem[] = cases.map((caseRecord) => ({
    id: String(caseRecord.id || ''),
    kind: 'case',
    title: String(caseRecord.title || caseRecord.clientName || 'Sprawa'),
    subtitle: `KompletnoĹ›Ä‡ ${Math.round(Number(caseRecord.completenessPercent || 0))}% Â· ${caseStatusLabel(String(caseRecord.status || 'in_progress'))}`,
    status: caseStatusLabel(String(caseRecord.status || 'in_progress')),
    date: String(caseRecord.updatedAt || caseRecord.createdAt || ''),
  }));

  const paymentItems: RelationItem[] = payments.map((payment) => ({
    id: String(payment.id || ''),
    kind: 'payment',
    title: formatMoney(payment.amount),
    subtitle: paymentStatusLabel(String(payment.status || 'not_started')),
    status: paymentStatusLabel(String(payment.status || 'not_started')),
    date: String(payment.paidAt || payment.dueAt || payment.updatedAt || payment.createdAt || ''),
    amount: Number(payment.amount || 0),
  }));

  return [...leadItems, ...caseItems, ...paymentItems]
    .filter((item) => item.id)
    .sort((left, right) => {
      const leftTime = asDate(left.date)?.getTime() ?? 0;
      const rightTime = asDate(right.date)?.getTime() ?? 0;
      return rightTime - leftTime;
    });
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
      title: String(overdueTask.title || 'ZalegĹ‚e zadanie'),
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
      title: String(nextTask.title || 'NastÄ™pne zadanie'),
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
      title: String(nextEvent.title || 'NastÄ™pne wydarzenie'),
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
      title: String(activeCase.title || 'Aktywna sprawa'),
      subtitle: `${caseStatusLabel(String(activeCase.status || 'in_progress'))} Â· kompletnoĹ›Ä‡ ${Math.round(Number(activeCase.completenessPercent || 0))}%`,
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

function nextActionToneClass(tone: ClientNextAction['tone']) {
  switch (tone) {
    case 'red':
      return 'border-rose-200 bg-rose-50 text-rose-800';
    case 'amber':
      return 'border-amber-200 bg-amber-50 text-amber-800';
    case 'blue':
      return 'border-blue-200 bg-blue-50 text-blue-800';
    case 'emerald':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700';
  }
}

function statusBadgeClass(status: unknown) {
  const normalized = String(status || '').toLowerCase();
  if (['blocked', 'overdue'].includes(normalized)) return 'border-rose-200 bg-rose-50 text-rose-700';
  if (['waiting_on_client', 'on_hold', 'to_approve'].includes(normalized)) return 'border-amber-200 bg-amber-50 text-amber-700';
  if (['completed', 'done', 'paid', 'ready_to_start'].includes(normalized)) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (['canceled', 'cancelled', 'lost'].includes(normalized)) return 'border-slate-200 bg-slate-50 text-slate-600';
  return 'border-blue-200 bg-blue-50 text-blue-700';
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
  return '';
}

function getCaseSourceLead(caseRecord: any, leads: any[]) {
  const caseId = String(caseRecord?.id || '');
  const directLeadId = String(caseRecord?.leadId || caseRecord?.sourceLeadId || '');
  return leads.find((lead) => String(lead.id || '') === directLeadId)
    || leads.find((lead) => String(lead.linkedCaseId || lead.caseId || '') === caseId)
    || null;
}

function getCaseNextAction(caseRecord: any, tasks: any[], events: any[]) {
  const caseId = String(caseRecord?.id || '');
  const caseTasks = tasks.filter((task) => String(task.caseId || '') === caseId && !isDoneStatus(task.status));
  const caseEvents = events.filter((event) => String(event.caseId || '') === caseId && !isDoneStatus(event.status));
  const entries = [
    ...caseTasks.map((task) => ({ kind: 'task' as const, title: String(task.title || 'Zadanie'), date: getTaskDate(task), time: asDate(getTaskDate(task))?.getTime() ?? Number.MAX_SAFE_INTEGER })),
    ...caseEvents.map((event) => ({ kind: 'event' as const, title: String(event.title || 'Wydarzenie'), date: getEventDate(event), time: asDate(getEventDate(event))?.getTime() ?? Number.MAX_SAFE_INTEGER })),
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
      setLeads(leadRows as any[]);
      setCases(caseRows as any[]);
      setPayments(paymentRows as any[]);
      setTasks(taskRows as any[]);
      setEvents(eventRows as any[]);
      setActivities(activityRows as any[]);
      setForm({
        name: String((clientRow as any)?.name || ''),
        company: String((clientRow as any)?.company || ''),
        email: String((clientRow as any)?.email || ''),
        phone: String((clientRow as any)?.phone || ''),
        notes: String((clientRow as any)?.notes || ''),
      });
    } catch (error: any) {
      toast.error(`BĹ‚Ä…d odczytu klienta: ${error?.message || 'REQUEST_FAILED'}`);
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
      .filter((task) => String(task.clientId || '') === String(clientId || '') || relationIds.leadIds.has(String(task.leadId || '')) || relationIds.caseIds.has(String(task.caseId || '')))
      .sort((left, right) => (asDate(getTaskDate(left))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (asDate(getTaskDate(right))?.getTime() ?? Number.MAX_SAFE_INTEGER));
  }, [clientId, relationIds.caseIds, relationIds.leadIds, tasks]);

  const clientEvents = useMemo(() => {
    return events
      .filter((event) => String(event.clientId || '') === String(clientId || '') || relationIds.leadIds.has(String(event.leadId || '')) || relationIds.caseIds.has(String(event.caseId || '')))
      .sort((left, right) => (asDate(getEventDate(left))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (asDate(getEventDate(right))?.getTime() ?? Number.MAX_SAFE_INTEGER));
  }, [clientId, events, relationIds.caseIds, relationIds.leadIds]);

  const clientActivities = useMemo(() => {
    return activities
      .filter((activity) => String(activity.clientId || '') === String(clientId || '') || relationIds.leadIds.has(String(activity.leadId || '')) || relationIds.caseIds.has(String(activity.caseId || '')))
      .sort((left, right) => (asDate(getActivityTime(right))?.getTime() ?? 0) - (asDate(getActivityTime(left))?.getTime() ?? 0));
  }, [activities, clientId, relationIds.caseIds, relationIds.leadIds]);

  const paymentTotal = useMemo(
    () => payments.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0),
    [payments],
  );

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

  const mainCase = activeCases[0] || cases[0] || null;
  const mainCaseCompleteness = mainCase ? getCaseCompleteness(mainCase) : 0;
  const activeTaskCount = useMemo(() => clientTasks.filter((task) => !isDoneStatus(task.status)).length, [clientTasks]);
  const activeEventCount = useMemo(() => clientEvents.filter((event) => !isDoneStatus(event.status)).length, [clientEvents]);
  const relationTimeline = useMemo(() => buildRelationTimeline(leads, cases, payments), [cases, leads, payments]);
  const nextAction = useMemo(() => buildClientNextAction(leads, cases, clientTasks, clientEvents), [cases, clientEvents, clientTasks, leads]);
  const lastActivityDate = clientActivities[0]?.createdAt || clientActivities[0]?.updatedAt || client?.updatedAt || client?.createdAt;
  const firstSourceLead = leads[0] || null;

  const handleSave = async () => {
    if (!clientId) return;
    if (!hasAccess) return toast.error('TwĂłj trial wygasĹ‚.');
    try {
      setSaving(true);
      await updateClientInSupabase({
        id: clientId,
        ...form,
      });
      toast.success('Klient zaktualizowany');
      await reload();
    } catch (error: any) {
      toast.error(`BĹ‚Ä…d zapisu klienta: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  };

  const copyValue = async (label: string, value: string) => {
    if (!value) return toast.error(`Brak wartoĹ›ci: ${label}`);
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} skopiowano`);
    } catch {
      toast.error('Nie udaĹ‚o siÄ™ skopiowaÄ‡.');
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

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="space-y-4 p-6">
          <Button variant="outline" onClick={() => navigate('/clients')}><ArrowLeft className="mr-2 h-4 w-4" /> WrĂłÄ‡</Button>
          <Card><CardContent className="p-6 text-slate-500">Nie znaleziono klienta.</CardContent></Card>
        </div>
      </Layout>
    );
  }

  const tabs: { key: ClientTab; label: string }[] = [
    { key: 'summary', label: 'Podsumowanie' },
    { key: 'cases', label: 'Sprawy' },
    { key: 'contact', label: 'Kontakt' },
    { key: 'history', label: 'Historia' },
  ];

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-4" data-client-detail-simplified-card-view="true">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/clients')} className="rounded-xl"><ArrowLeft className="mr-2 h-4 w-4" /> Klienci</Button>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Kartoteka klienta</p>
              <h1 className="text-2xl font-black tracking-tight text-slate-950">{client.name || client.company || 'Klient'}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {mainCase ? (
              <Button onClick={() => navigate(`/cases/${String(mainCase.id)}`)} className="rounded-xl">
                <Briefcase className="mr-2 h-4 w-4" /> OtwĂłrz gĹ‚ĂłwnÄ… sprawÄ™
              </Button>
            ) : null}
            <Button variant="outline" onClick={openNewCase} className="rounded-xl">+ Nowa sprawa dla klienta</Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="space-y-3">
            <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-black text-white shadow-md">
                    {getInitials(client)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-black tracking-tight text-slate-950">{client.name || 'Klient'}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {client.company ? `${client.company} Â· ` : 'Klient prywatny Â· '}
                      ostatni kontakt: {formatDate(lastActivityDate)}
                      {mainCase ? ` Â· gĹ‚Ăłwna sprawa: ${getCaseTitle(mainCase)}` : ''}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-2xl font-black text-blue-700">{activeCases.length}</p>
                    <p className="text-[11px] font-bold text-slate-500">Otwarte sprawy</p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-2xl font-black text-amber-700">{waitingCaseCount}</p>
                    <p className="text-[11px] font-bold text-amber-700">Czeka</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-lg font-black text-slate-800">{formatDate(lastActivityDate).slice(0, 5)}</p>
                    <p className="text-[11px] font-bold text-slate-500">Ostatni kontakt</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button type="button" onClick={() => void copyValue('Telefon', asText(form.phone))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50">
                    <span className="block text-[11px] font-black uppercase tracking-wide text-slate-500">Telefon</span>
                    <strong className="mt-1 flex items-center gap-2 text-sm text-slate-950"><Phone className="h-4 w-4 text-blue-600" /> {form.phone || 'Brak'}</strong>
                  </button>
                  <button type="button" onClick={() => void copyValue('E-mail', asText(form.email))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50">
                    <span className="block text-[11px] font-black uppercase tracking-wide text-slate-500">E-mail</span>
                    <strong className="mt-1 flex items-center gap-2 break-all text-sm text-slate-950"><Mail className="h-4 w-4 text-blue-600" /> {form.email || 'Brak'}</strong>
                  </button>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <span className="block text-[11px] font-black uppercase tracking-wide text-slate-500">Preferowany kontakt</span>
                    <strong className="mt-1 text-sm text-slate-950">{asText(client.preferredContact) || (form.phone ? 'Telefon' : form.email ? 'E-mail' : 'Do uzupeĹ‚nienia')}</strong>
                  </div>
                  <button type="button" onClick={() => setActiveTab('history')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50">
                    <span className="block text-[11px] font-black uppercase tracking-wide text-slate-500">Pierwsze ĹşrĂłdĹ‚o</span>
                    <strong className="mt-1 text-sm text-slate-950">{asText(firstSourceLead?.source) || asText(client.firstSource) || 'Do uzupeĹ‚nienia'}</strong>
                  </button>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                </div>

                <div className="space-y-2">
                  <Button className="w-full rounded-xl" variant="outline" onClick={() => setActiveTab('contact')}>Edytuj dane kontaktowe</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardContent className="space-y-2 p-4">
                <p className="text-sm font-black text-slate-900">WiÄ™cej</p>
                <Button variant="outline" size="sm" className="w-full justify-start rounded-xl" onClick={openNewLeadForExistingClient}>Nowy temat do pozyskania</Button>
                <Button variant="outline" size="sm" className="w-full justify-start rounded-xl" onClick={() => toast.info('Scalanie duplikatĂłw zostaje jako osobna bezpieczna akcja.')}>
                  Scal duplikat
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start rounded-xl" onClick={() => toast.info('Archiwizacja klienta wymaga osobnego potwierdzenia.')}>
                  Archiwizuj klienta
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start rounded-xl" onClick={() => toast.info('Eksport historii bÄ™dzie generowany z zakĹ‚adki Historia.')}>
                  Eksportuj historiÄ™
                </Button>
              </CardContent>
            </Card>
          </aside>

          <section className="min-w-0">
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardContent className="p-3 md:p-4">
                <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={[
                        'min-h-10 rounded-xl px-4 text-sm font-black transition whitespace-nowrap',
                        activeTab === tab.key ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-white/70 hover:text-slate-900',
                      ].join(' ')}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'summary' ? (
                  <div className="space-y-4" data-client-tab-summary="true">
                    <div className="grid gap-3 md:grid-cols-3">
                      <button type="button" onClick={() => nextAction.to && navigate(nextAction.to)} className={`rounded-2xl border p-4 text-left ${nextActionToneClass(nextAction.tone)}`}>
                        <p className="text-2xl font-black tracking-tight">{relativeActionLabel(nextAction.date)}</p>
                        <p className="mt-1 text-xs font-semibold opacity-80">NajbliĹĽsza akcja: {nextAction.title}</p>
                        <p className="mt-2 text-xs opacity-75">{nextAction.subtitle}</p>
                      </button>
                      <button type="button" onClick={() => blockers[0]?.caseRecord?.id && navigate(`/cases/${String(blockers[0].caseRecord.id)}`)} className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-left text-rose-800">
                        <p className="text-2xl font-black tracking-tight">{blockers.length}</p>
                        <p className="mt-1 text-xs font-semibold opacity-80">Blokady</p>
                        <p className="mt-2 text-xs opacity-75">{blockers[0]?.blocker || 'Brak blokad w sprawach klienta.'}</p>
                      </button>
                      <button type="button" onClick={() => mainCase?.id && navigate(`/cases/${String(mainCase.id)}`)} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left text-emerald-800">
                        <p className="text-2xl font-black tracking-tight">{mainCase ? `${mainCaseCompleteness}%` : '0%'}</p>
                        <p className="mt-1 text-xs font-semibold opacity-80">KompletnoĹ›Ä‡ gĹ‚Ăłwnej sprawy</p>
                        <p className="mt-2 text-xs opacity-75">{mainCase ? getCaseTitle(mainCase) : 'Brak sprawy do pokazania.'}</p>
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div>
                      </div>
                      {waitingCaseCount > 0 ? <Badge variant="outline" className="w-fit border-amber-200 bg-amber-50 text-amber-700">Wymaga ruchu</Badge> : null}
                    </div>

                    <div className="space-y-2">
                      {activeCases.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Ten klient nie ma aktywnej sprawy. MoĹĽesz zaĹ‚oĹĽyÄ‡ nowÄ… sprawÄ™ dla klienta.</div>
                      ) : activeCases.slice(0, 4).map((caseRecord) => {
                        const caseAction = getCaseNextAction(caseRecord, clientTasks, clientEvents);
                        const blocker = getCaseBlocker(caseRecord);
                        const sourceLead = getCaseSourceLead(caseRecord, leads);
                        return (
                          <div key={caseRecord.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-black text-slate-950">{getCaseTitle(caseRecord)}</p>
                                <Badge variant="outline" className={statusBadgeClass(caseRecord.status)}>{caseStatusLabel(String(caseRecord.status || 'in_progress'))}</Badge>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                <span>NajbliĹĽsza akcja: {caseAction ? `${caseAction.title} Â· ${formatDateTime(caseAction.date)}` : 'brak zaplanowanej akcji'}</span>
                                <span>{blocker ? `Blokada: ${blocker}` : 'Bez blokad'}</span>
                                <span>ĹąrĂłdĹ‚o: {sourceLead ? `lead ${asText(sourceLead.source) || 'ĹşrĂłdĹ‚owy'}` : 'brak ĹşrĂłdĹ‚a'}</span>
                              </div>
                            </div>
                            <Button size="sm" className="rounded-xl" onClick={() => navigate(`/cases/${String(caseRecord.id)}`)}>OtwĂłrz sprawÄ™ <ArrowRight className="ml-1 h-3 w-3" /></Button>
                          </div>
                        );
                      })}

                      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-slate-950">Historia pozyskania</p>
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">informacyjnie</Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span>Pierwszy kontakt: {asText(firstSourceLead?.source) || asText(client.firstSource) || 'do uzupeĹ‚nienia'}</span>
                            <span>{firstSourceLead ? `Lead: ${leadStatusLabel(String(firstSourceLead.status || 'new'))}` : 'Brak leada ĹşrĂłdĹ‚owego'}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setActiveTab('history')}>PokaĹĽ historiÄ™</Button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {activeTab === 'cases' ? (
                  <div className="space-y-4" data-client-tab-cases="true">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div>
                        <h2 className="text-lg font-black tracking-tight text-slate-950">Sprawy klienta</h2>
                        <p className="text-sm text-slate-500">To jest gĹ‚Ăłwna lista robocza klienta. KlikniÄ™cie prowadzi do sprawy, czyli miejsca pracy.</p>
                      </div>
                      <Button size="sm" onClick={openNewCase} className="rounded-xl">+ Nowa sprawa</Button>
                    </div>

                    <div className="space-y-3">
                      {[...activeCases, ...closedCases].length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Brak spraw dla tego klienta.</div>
                      ) : [...activeCases, ...closedCases].map((caseRecord) => {
                        const caseAction = getCaseNextAction(caseRecord, clientTasks, clientEvents);
                        const blocker = getCaseBlocker(caseRecord);
                        const sourceLead = getCaseSourceLead(caseRecord, leads);
                        const completeness = getCaseCompleteness(caseRecord);
                        return (
                          <div key={caseRecord.id} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/30">
                            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <button type="button" onClick={() => navigate(`/cases/${String(caseRecord.id)}`)} className="text-left font-black text-slate-950 hover:text-blue-700">{getCaseTitle(caseRecord)}</button>
                                  <Badge variant="outline" className={statusBadgeClass(caseRecord.status)}>{caseStatusLabel(String(caseRecord.status || 'in_progress'))}</Badge>
                                </div>
                                <div className="mt-2 grid gap-1 text-xs text-slate-500 md:grid-cols-2">
                                  <span>KompletnoĹ›Ä‡: {completeness}%</span>
                                  <span>NajbliĹĽsza akcja: {caseAction ? `${caseAction.title} Â· ${formatDateTime(caseAction.date)}` : 'brak'}</span>
                                  <span>{blocker ? `Brakuje / blokada: ${blocker}` : 'Bez blokad'}</span>
                                  <button type="button" onClick={() => setActiveTab('history')} className="text-left text-blue-700 hover:underline">ĹąrĂłdĹ‚o: {sourceLead ? `lead ${asText(sourceLead.source) || 'ĹşrĂłdĹ‚owy'}` : 'brak ĹşrĂłdĹ‚a'}</button>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 md:justify-end">
                                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => navigate(`/cases/${String(caseRecord.id)}?section=portal`)}>Portal</Button>
                                <Button size="sm" className="rounded-xl" onClick={() => navigate(`/cases/${String(caseRecord.id)}`)}>OtwĂłrz sprawÄ™</Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'contact' ? (
                  <div className="space-y-4" data-client-tab-contact="true">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div>
                        <h2 className="text-lg font-black tracking-tight text-slate-950">Kontakt</h2>
                        <p className="text-sm text-slate-500">Same dane kontaktowe. Bez follow-upĂłw, zadaĹ„ i wydarzeĹ„.</p>
                      </div>
                      <Button onClick={() => void handleSave()} disabled={saving} className="rounded-xl"><Save className="mr-2 h-4 w-4" /> {saving ? 'Zapisywanie...' : 'Zapisz dane'}</Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2"><Label>Nazwa</Label><Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} /></div>
                      <div className="space-y-2"><Label>Firma</Label><Input value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} /></div>
                      <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} /></div>
                      <div className="space-y-2"><Label>Telefon</Label><Input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} /></div>
                      <div className="space-y-2 md:col-span-2"><Label>Notatka kontaktowa</Label><Textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} rows={5} placeholder="Np. najlepiej dzwoniÄ‡ po 15:00." /></div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-4">
                      <Button variant="outline" className="rounded-xl" onClick={() => form.phone ? window.open(`tel:${form.phone}`) : toast.error('Brak telefonu')}>ZadzwoĹ„</Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => form.email ? window.open(`mailto:${form.email}`) : toast.error('Brak e-maila')}>Napisz e-mail</Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => void copyValue('Telefon', form.phone)}>Kopiuj telefon</Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => void copyValue('E-mail', form.email)}>Kopiuj e-mail</Button>
                    </div>

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      Kontakt jest ksiÄ…ĹĽkÄ… adresowÄ…. Zadania, wydarzenia, follow-upy, portal i materiaĹ‚y zostajÄ… w sprawie albo w globalnych widokach.
                    </div>
                  </div>
                ) : null}

                {activeTab === 'history' ? (
                  <div className="space-y-4" data-client-tab-history="true">
                    <div>
                      <h2 className="text-lg font-black tracking-tight text-slate-950">Historia relacji</h2>
                      <p className="text-sm text-slate-500">Tu trafia ĹşrĂłdĹ‚o leadĂłw, przejĹ›cie do obsĹ‚ugi, utworzone sprawy i waĹĽne aktywnoĹ›ci.</p>
                    </div>

                    <div className="space-y-2">
                      {clientActivities.slice(0, 8).map((activity) => (
                        <div key={activity.id || `${activity.eventType}:${getActivityTime(activity)}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-slate-100 p-2"><Activity className="h-4 w-4 text-slate-600" /></div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <p className="font-black text-slate-950">{activityLabel(activity)}</p>
                                <span className="text-xs text-slate-500">{formatDateTime(getActivityTime(activity))}</span>
                              </div>
                              {activity.caseId ? <button type="button" onClick={() => navigate(`/cases/${String(activity.caseId)}`)} className="mt-1 text-xs font-semibold text-blue-700 hover:underline">OtwĂłrz powiÄ…zanÄ… sprawÄ™</button> : null}
                              {activity.leadId ? <button type="button" onClick={() => navigate(`/leads/${String(activity.leadId)}`)} className="mt-1 block text-xs font-semibold text-blue-700 hover:underline">PodglÄ…d leada ĹşrĂłdĹ‚owego</button> : null}
                            </div>
                          </div>
                        </div>
                      ))}

                      {relationTimeline.map((item) => (
                        <div key={`${item.kind}:${item.id}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-slate-100 p-2">
                              {item.kind === 'lead' ? <Target className="h-4 w-4 text-blue-600" /> : item.kind === 'case' ? <Briefcase className="h-4 w-4 text-violet-600" /> : <CreditCard className="h-4 w-4 text-emerald-600" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <p className="font-black text-slate-950">{item.kind === 'lead' ? 'Lead ĹşrĂłdĹ‚owy' : item.kind === 'case' ? 'Utworzono sprawÄ™' : 'Rozliczenie'}: {item.title}</p>
                                <span className="text-xs text-slate-500">{formatDate(item.date)}</span>
                              </div>
                              <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                              {item.kind === 'case' ? <button type="button" onClick={() => navigate(`/cases/${item.id}`)} className="mt-2 text-xs font-semibold text-blue-700 hover:underline">OtwĂłrz sprawÄ™</button> : null}
                              {item.kind === 'lead' ? <button type="button" onClick={() => navigate(`/leads/${item.id}`)} className="mt-2 text-xs font-semibold text-blue-700 hover:underline">Archiwalny podglÄ…d leada</button> : null}
                            </div>
                          </div>
                        </div>
                      ))}

                      {clientActivities.length === 0 && relationTimeline.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Brak historii dla tego klienta.</div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" data-client-detail-work-boundary="true">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <p>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
