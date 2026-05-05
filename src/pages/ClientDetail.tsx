/* STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE */
/* STAGE55_CLIENT_CASE_OPERATIONAL_PACK */
/* STAGE54_CLIENT_CASES_COMPACT_FIT */
/* STAGE53_CLIENT_OPERATIONAL_RECENT_MOVES */
/* STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX */
/*
CLIENT_DETAIL_VISUAL_REBUILD_STAGE12
Client is a relation record. Operational work after acquisition happens in Case.
CLIENT_DETAIL_FINAL_OPERATING_MODEL_V83
CLIENT_DETAIL_WORK_IN_CASE_OR_ACTIVE_LEAD
CLIENT_DETAIL_MORE_MENU_SECONDARY
CLIENT_DETAIL_TABS_KARTOTEKA_RELACJE_HISTORIA_WIECEJ
STAGE35_CLIENT_DETAIL_VISIBLE_EDIT_ACTION
CLIENT_DETAIL_STAGE46_ACQUISITION_HISTORY_ONLY
STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH
*/
const STAGE35_CLIENT_DETAIL_EDIT_TOGGLE_GUARD = "contactEditing ? 'Zapisz' : 'Edytuj'";
const CLIENT_DETAIL_FINAL_MORE_MENU_GUARD = 'Dodatkowe client-detail-more-menu DrugorzÄ™dne akcje menu pomocnicze';
const CLIENT_DETAIL_FINAL_MORE_MENU_COPY = 'Dodatkowe DrugorzÄ™dne akcje';
const CLIENT_DETAIL_NEW_CASE_FOR_CLIENT_COPY_GUARD = '+ Nowa sprawa dla klienta';
const A16_V2_CONTACT_WRITE_STORM_GUARD = "contact-onchange-local-only-save-button-persists";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Loader2,
  Mail,
  Mic,
  MicOff,
  Pencil,
  Phone,
  Plus,
  Save,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { openContextQuickAction, type ContextActionKind } from '../components/ContextActionDialogs';
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

type ClientTab = 'summary' | 'cases' | 'contact' | 'history';

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
  leadId?: string | null;
  status: string;
  statusLabel: string;
  nextActionLabel: string;
  nextActionMeta: string;
  sourceLabel: string;
  completeness: number;
  blocker: string;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const browserWindow = window as any;
  return browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition || null;
}

function normalizeTranscriptText(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/[.,!?;:]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeTranscriptAppend(previous: string, addition: string) {
  const base = previous.trim();
  const next = addition.trim();
  if (!next) return base;
  if (!base) return next;

  const baseNormalized = normalizeTranscriptText(base);
  const nextNormalized = normalizeTranscriptText(next);
  if (!nextNormalized) return base;
  if (baseNormalized.endsWith(nextNormalized)) return base;
  if (nextNormalized.startsWith(baseNormalized)) return next;

  const baseWords = base.split(/\s+/).filter(Boolean);
  const nextWords = next.split(/\s+/).filter(Boolean);
  const normalizedBaseWords = baseWords.map(normalizeTranscriptText);
  const normalizedNextWords = nextWords.map(normalizeTranscriptText);
  const maxOverlap = Math.min(normalizedBaseWords.length, normalizedNextWords.length, 18);

  for (let size = maxOverlap; size > 0; size -= 1) {
    const left = normalizedBaseWords.slice(-size).join(' ');
    const right = normalizedNextWords.slice(0, size).join(' ');
    if (left && left === right) {
      const rest = nextWords.slice(size).join(' ').trim();
      return rest ? `${base} ${rest}` : base;
    }
  }

  return `${base} ${next}`;
}

function joinTranscript(previous: string, addition: string) {
  return dedupeTranscriptAppend(previous, addition);
}

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

function formatMoneyWithCurrency(value: unknown, currency?: string) {
  const amount = Number(value || 0);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeCurrency = typeof currency === 'string' && currency.trim() ? currency.trim().toUpperCase() : 'PLN';
  return `${safeAmount.toLocaleString('pl-PL')} ${safeCurrency}`;
}

function isPaidPaymentStatus(status: unknown) {
  return ['deposit_paid', 'partially_paid', 'fully_paid', 'paid'].includes(String(status || '').toLowerCase());
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
  const eventType = String(activity?.eventType || activity?.activityType || 'activity');
  const title = asText(activity?.payload?.title) || asText(activity?.title);

  switch (eventType) {
    case 'calendar_entry_completed':
      return title ? `Wpis kalendarza wykonany: ${title}` : 'Wpis kalendarza wykonany';
    case 'calendar_entry_restored':
      return title ? `Wpis kalendarza przywrĂłcony: ${title}` : 'Wpis kalendarza przywrĂłcony';
    case 'calendar_entry_deleted':
      return title ? `Wpis kalendarza usuniÄ™ty: ${title}` : 'Wpis kalendarza usuniÄ™ty';
    case 'today_task_completed':
      return title ? `Zadanie wykonane: ${title}` : 'Zadanie wykonane';
    case 'today_task_restored':
      return title ? `Zadanie przywrĂłcone: ${title}` : 'Zadanie przywrĂłcone';
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
    case 'ai_draft_converted':
      return title ? `Szkic zatwierdzony: ${title}` : 'Szkic zatwierdzony';
    default:
      return title || 'AktywnoĹ›Ä‡ klienta';
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
  if (status === 'to_approve') return 'czeka na akceptacjÄ™';
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
      title: getCaseTitle(activeCase),
      subtitle: `${caseStatusLabel(String(activeCase.status || 'in_progress'))} Â· kompletnoĹ›Ä‡ ${getCaseCompleteness(activeCase)}%`,
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
                aria-label={kind === 'email' ? 'UsuĹ„ email klienta' : 'UsuĹ„ telefon klienta'}
              >
                UsuĹ„
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, onCopy }: { icon: any; label: string; value: string; onCopy?: () => void }) {
  const copyLabel = label === 'Telefon' ? 'Kopiuj telefon' : label === 'E-mail' ? 'Kopiuj email' : `Kopiuj ${label}`;
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
        <button type="button" className="client-detail-icon-button" onClick={onCopy} aria-label={copyLabel} title={copyLabel}>
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
  const [clientNoteListening, setClientNoteListening] = useState(false);
  const [clientNoteInterimText, setClientNoteInterimText] = useState('');
  const [clientNoteAutosaving, setClientNoteAutosaving] = useState(false);
  const clientNoteRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const clientNoteVoiceDirtyRef = useRef(false);

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


  const recentClientMovements = useMemo(() => {
    return clientActivities.slice(0, 5).map((activity: any, index: number) => ({
      id: String(activity?.id || activity?.activityId || activity?.eventId || (getActivityTime(activity) + '-' + index)),
      title: activityLabel(activity),
      time: formatDateTime(getActivityTime(activity)),
      meta: String(activity?.eventType || activity?.activityType || 'AktywnoĹ›Ä‡'),
    }));
  }, [clientActivities]);
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

  const clientFinance = useMemo(() => {
    const activeLeadPotential = leads
      .filter((lead) => {
        const status = String(lead?.status || '').toLowerCase();
        const linkedCaseId = String(lead?.linkedCaseId || lead?.caseId || '');
        return !['moved_to_service', 'won', 'lost', 'archived'].includes(status) && !linkedCaseId;
      })
      .reduce((sum, lead) => sum + (Number(lead?.dealValue) || 0), 0);

    const casesExpected = cases.reduce((sum, caseRecord) => sum + (Number(caseRecord?.expectedRevenue || caseRecord?.dealValue || 0) || 0), 0);
    const paidTotal = payments
      .filter((entry) => isPaidPaymentStatus(entry?.status))
      .reduce((sum, entry) => sum + (Number(entry?.amount) || 0), 0);
    const potentialTotal = Math.max(0, activeLeadPotential + casesExpected);
    const remainingTotal = Math.max(0, potentialTotal - paidTotal);
    const currencies = [client?.currency, ...leads.map((lead) => lead?.currency), ...cases.map((entry) => entry?.currency), ...payments.map((entry) => entry?.currency)]
      .map((value) => String(value || '').trim().toUpperCase())
      .filter((value) => /^[A-Z]{3}$/.test(value));
    const currency = currencies[0] || 'PLN';

    return {
      potentialTotal,
      paidTotal,
      remainingTotal,
      currency,
      hasMixedCurrencies: new Set(currencies).size > 1,
    };
  }, [cases, client?.currency, leads, payments]);
  const mainCase = activeCases[0] || cases[0] || null;
  const mainCaseCompleteness = mainCase ? getCaseCompleteness(mainCase) : 0;
  const activeTaskCount = useMemo(() => clientTasks.filter((task) => !isDoneStatus(task.status)).length, [clientTasks]);
  const activeEventCount = useMemo(() => clientEvents.filter((event) => !isDoneStatus(event.status)).length, [clientEvents]);
  const nextAction = useMemo(() => buildClientNextAction(leads, cases, clientTasks, clientEvents), [cases, clientEvents, clientTasks, leads]);
  const lastActivityDate = clientActivities[0]?.createdAt || clientActivities[0]?.updatedAt || client?.updatedAt || client?.createdAt;
  const firstSourceLead = leads[0] || null;
  const STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS = 'Client detail uses shared context action dialogs instead of local simplified quick forms';
  const openClientContextAction = (kind: ContextActionKind) => {
    if (!clientId) return;
    openContextQuickAction({
      kind,
      recordType: 'client',
      recordId: clientId,
      clientId,
      recordLabel: getClientName(client),
    });
  };

  const clientCaseRows = useMemo<ClientCaseRow[]>(() => {
    return cases.map((caseRecord) => {
      const sourceLead = getCaseSourceLead(caseRecord, leads);
      const next = getCaseNextAction(caseRecord, clientTasks, clientEvents);
      return {
        id: String(caseRecord.id || ''),
        title: getCaseTitle(caseRecord),
        leadId: caseRecord?.leadId ? String(caseRecord.leadId) : null,
        status: String(caseRecord.status || 'in_progress'),
        statusLabel: caseStatusLabel(String(caseRecord.status || 'in_progress')),
        nextActionLabel: next ? next.title : 'Brak zaplanowanych dziaĹ‚aĹ„',
        nextActionMeta: next ? `${next.kind === 'task' ? 'Zadanie' : 'Wydarzenie'} Â· ${relativeActionLabel(next.date)}` : 'Dodaj zadanie albo wydarzenie w sprawie.',
        sourceLabel: sourceLead ? `Lead: ${String(sourceLead.name || sourceLead.company || 'bez nazwy')}` : `Utworzono: ${formatDate(caseRecord.createdAt)}`,
        completeness: getCaseCompleteness(caseRecord),
        blocker: getCaseBlocker(caseRecord),
      };
    });
  }, [cases, clientEvents, clientTasks, leads]);



  const resetClientContactForm = () => {
    setForm({
      name: String(client?.name || ''),
      company: String(client?.company || ''),
      email: String(client?.email || ''),
      phone: String(client?.phone || ''),
      notes: String(client?.notes || ''),
    });
  };

  const handleCancelContactEditing = () => {
    resetClientContactForm();
    setContactEditing(false);
  };

  const handleSave = async () => {
    if (!clientId) return;
    if (!hasAccess) return toast.error('TwĂłj trial wygasĹ‚.');
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
        toast.error('Klient zapisany, ale nie udaĹ‚o siÄ™ zsynchronizowaÄ‡ czÄ™Ĺ›ci powiÄ…zanych leadĂłw.');
      } else {
        toast.success('Klient zaktualizowany');
      }
      await reload();
    } catch (error: any) {
      toast.error(`BĹ‚Ä…d zapisu klienta: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClientPanelEditToggle = async () => {
    if (contactEditing) {
      await handleSave();
      return;
    }
    resetClientContactForm();
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

  const stopClientNoteSpeech = () => {
    const recognition = clientNoteRecognitionRef.current;
    clientNoteRecognitionRef.current = null;
    setClientNoteListening(false);
    setClientNoteInterimText('');
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      try {
        recognition.abort?.();
      } catch {
        // ignore
      }
    }
  };

  const handleToggleClientNoteSpeech = () => {
    if (!hasAccess) return toast.error('TwĂłj trial wygasĹ‚.');
    if (clientNoteListening) {
      stopClientNoteSpeech();
      return;
    }
    const RecognitionConstructor = getSpeechRecognitionConstructor();
    if (!RecognitionConstructor) {
      toast.error('Dyktowanie nie jest dostÄ™pne w tej przeglÄ…darce.');
      return;
    }
    try {
      const recognition = new RecognitionConstructor();
      recognition.lang = 'pl-PL';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let index = event.resultIndex || 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          const transcript = String(result?.[0]?.transcript || '').trim();
          if (!transcript) continue;
          if (result?.isFinal) finalTranscript = joinTranscript(finalTranscript, transcript);
          else interimTranscript = joinTranscript(interimTranscript, transcript);
        }
        if (finalTranscript) {
          clientNoteVoiceDirtyRef.current = true;
          setForm((current) => ({ ...current, notes: joinTranscript(current.notes, finalTranscript) }));
        }
        setClientNoteInterimText(interimTranscript);
      };
      recognition.onerror = () => {
        toast.error('Nie udaĹ‚o siÄ™ dokoĹ„czyÄ‡ dyktowania notatki.');
        stopClientNoteSpeech();
      };
      recognition.onend = () => {
        clientNoteRecognitionRef.current = null;
        setClientNoteListening(false);
        setClientNoteInterimText('');
      };
      clientNoteRecognitionRef.current = recognition;
      recognition.start();
      setClientNoteListening(true);
      setContactEditing(true);
      toast.success('Dyktowanie notatki wĹ‚Ä…czone');
    } catch {
      toast.error('Nie udaĹ‚o siÄ™ uruchomiÄ‡ dyktowania.');
      stopClientNoteSpeech();
    }
  };

  useEffect(() => {
    if (!clientNoteVoiceDirtyRef.current) return;
    if (!clientId || !hasAccess || !form.notes.trim() || clientNoteAutosaving) return;
    const timer = window.setTimeout(async () => {
      try {
        setClientNoteAutosaving(true);
        await updateClientInSupabase({ id: clientId, notes: form.notes.trim() });
        setClient((current: any) => (current ? { ...current, notes: form.notes.trim() } : current));
        clientNoteVoiceDirtyRef.current = false;
        toast.success('Notatka klienta zapisana');
      } catch (error: any) {
        toast.error(`BĹ‚Ä…d zapisu notatki: ${error?.message || 'REQUEST_FAILED'}`);
      } finally {
        setClientNoteAutosaving(false);
      }
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [clientId, form.notes, hasAccess, clientNoteAutosaving]);

  useEffect(() => () => stopClientNoteSpeech(), []);

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
            <span>Ĺadowanie klienta...</span>
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
            <p>Ten rekord mĂłgĹ‚ zostaÄ‡ usuniÄ™ty albo nie naleĹĽy do aktualnego workspace.</p>
            <Button type="button" onClick={() => navigate('/clients')} variant="outline">
              <ArrowLeft className="h-4 w-4" />
              WrĂłÄ‡ do klientĂłw
            </Button>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="client-detail-vnext-page" data-client-detail-simplified-card-view="true">
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
              <span>GĹ‚Ăłwna sprawa: {mainCase ? getCaseTitle(mainCase) : 'Brak gĹ‚Ăłwnej sprawy'}</span>
              <span>Status relacji: {activeCases.length > 0 ? 'Aktywna obsĹ‚uga' : leads.length > 0 ? 'Kontakt po leadzie' : 'Kartoteka'}</span>
            </div>
          </div>
          <div className="client-detail-header-actions">
            <Button
              type="button"
              variant="outline"
              className="client-detail-visible-edit-action client-detail-header-action-soft"
              data-client-detail-visible-edit-action="true"
              onClick={handleClientPanelEditToggle}
              disabled={saving}
            >
              {contactEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              {contactEditing ? 'Zapisz dane' : 'Edytuj dane'}
            </Button>
            <Button type="button" variant="outline" className="client-detail-header-action-soft" asChild>
              <Link to="/ai-drafts">
                <Sparkles className="h-4 w-4" />
                Zapytaj AI
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={openNewCase} disabled={!hasAccess}>
              <Plus className="h-4 w-4" />
              Nowa sprawa dla klienta
            </Button>
            <Button type="button" className="client-detail-header-action-primary" onClick={openMainCase} disabled={!mainCase?.id}>
              <Briefcase className="h-4 w-4" />
              OtwĂłrz gĹ‚ĂłwnÄ… sprawÄ™
            </Button>
          </div>
        </header>

        <div className="client-detail-shell">
          <aside className="client-detail-left-rail">
            <section className="client-detail-profile-card client-detail-side-card" data-client-inline-contact-edit="true">
              <div className="client-detail-avatar-row">
                <div className="client-detail-avatar">{getInitials(client)}</div>
                <div>
                  <h2>{getClientName(client)}</h2>
                  <p>{mainCase ? 'Klient Â· gĹ‚Ăłwna sprawa aktywna' : 'Klient Â· brak aktywnej sprawy'}</p>
                </div>
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
                    {clientNoteInterimText ? <p className="text-xs text-slate-500">Dyktowanie: {clientNoteInterimText}</p> : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={handleToggleClientNoteSpeech} disabled={!hasAccess || clientNoteAutosaving}>
                        {clientNoteListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        {clientNoteListening ? 'Zatrzymaj dyktowanie' : 'Dyktuj notatkÄ™'}
                      </Button>
                      {clientNoteAutosaving ? <span className="text-xs text-slate-500">Zapisywanie za 2sâ€¦</span> : null}
                    </div>
                  </div>
                  <div className="client-detail-edit-actions">
                    <Button type="button" onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4" />
                      {saving ? 'ZapisujÄ™...' : 'Zapisz'}
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
                  <InfoRow icon={Calendar} label="Ostatni kontakt" value={formatDate(lastActivityDate)} />
                </div>
              )}

            </section>

          </aside>

          <section className="client-detail-main-column">
            <nav className="client-detail-tabs" aria-label="ZakĹ‚adki klienta">
              {[
                { key: 'summary', label: 'Podsumowanie' },
                { key: 'cases', label: 'Sprawy' },
                { key: 'history', label: 'Historia' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  {...(tab.key === 'summary'
                    ? { 'data-client-tab-summary': 'true' }
                    : tab.key === 'cases'
                      ? { 'data-client-tab-cases': 'true' }
                      : { 'data-client-tab-history': 'true' })}
                  className={activeTab === tab.key ? 'client-detail-tab-active' : ''}
                  onClick={() => setActiveTab(tab.key as ClientTab)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {activeTab === 'summary' ? (
              <div className="client-detail-tab-panel">
                <div className="client-detail-top-cards">
                  <section className="client-detail-hero-card" aria-label="NastÄ™pny ruch">
                    <div className="client-detail-hero-kicker">NASTÄPNA AKCJA</div>
                    <div className="client-detail-hero-date">{nextAction.date || formatDate(new Date())}</div>
                    <div className="client-detail-hero-sub">{nextAction.subtitle}</div>
                    <Button
                      type="button"
                      className="client-detail-hero-cta"
                      onClick={() => {
                        if (mainCase?.id) return openMainCase();
                        if (nextAction.to) return navigate(nextAction.to as string);
                        return openNewCase();
                      }}
                      disabled={!hasAccess && !mainCase?.id && !nextAction.to}
                    >
                      OtwĂłrz sprawÄ™
                    </Button>
                  </section>

                                    <div className="client-detail-top-cards-side">
                    <section className="client-detail-completeness-card" aria-label="Kompletność sprawy">
                      <div className="client-detail-card-title-row">
                        <CheckCircle2 className="h-4 w-4" />
                        <h2>Kompletność sprawy</h2>
                      </div>
                      <strong>{mainCase ? `${mainCaseCompleteness}%` : '0%'}</strong>
                      <p>{mainCase ? getCaseTitle(mainCase) : 'Główna sprawa nie ma kompletu elementów.'}</p>
                      {mainCase ? <div className="client-detail-progress"><span style={{ width: `${mainCaseCompleteness}%` }} /></div> : null}
                      {blockers.length > 0 ? (
                        <div className="client-detail-completeness-note">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Blokady: {blockers[0] ? blockers[0].blocker : blockers.length}</span>
                        </div>
                      ) : null}
                    </section>

                    <section className="client-detail-summary-card client-detail-finance-card" aria-label="Finanse klienta">
                      <div className="client-detail-card-title-row">
                        <Target className="h-4 w-4" />
                        <h2>Finanse klienta</h2>
                      </div>
                      <div className="client-detail-finance-metrics">
                        <div>
                          <small>Możliwy przychód</small>
                          <strong>{formatMoneyWithCurrency(clientFinance.potentialTotal, clientFinance.currency)}</strong>
                        </div>
                        <div>
                          <small>Wpłacono</small>
                          <strong>{formatMoneyWithCurrency(clientFinance.paidTotal, clientFinance.currency)}</strong>
                        </div>
                        <div>
                          <small>Pozostało</small>
                          <strong>{formatMoneyWithCurrency(clientFinance.remainingTotal, clientFinance.currency)}</strong>
                        </div>
                      </div>
                      {clientFinance.hasMixedCurrencies ? <p>Wykryto wiele walut, podsumowanie pokazuje walutę dominującą.</p> : null}
                    </section>
                  </div>
                </div>

                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Relacje</h2>
</div>
                    <Button type="button" variant="outline" onClick={() => setActiveTab('history')}>
                      ZnajdĹş w historii
                    </Button>
                  </div>
                  <div className="client-detail-relations-list">
                    {leads.length ? (
                      leads.slice(0, 3).map((lead) => (
                        <article key={String(lead.id)} className="client-detail-relation-row">
                          <div className="client-detail-relation-main">
                            <h3>{String(lead.name || lead.company || lead.email || 'Lead')}</h3>
                            <p>Lead powiÄ…zany z klientem.</p>
                          </div>
                          <span className="client-detail-pill client-detail-pill-muted">Lead</span>
                          <div className="client-detail-relation-actions">
                            <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/leads/${String(lead.id)}`)}>
                              OtwĂłrz lead
                            </Button>
                            {lead.linkedCaseId ? (
                              <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/cases/${String(lead.linkedCaseId)}`)}>
                                OtwĂłrz sprawÄ™
                              </Button>
                            ) : null}
                          </div>
                        </article>
                      ))
                    ) : null}
                    {clientCaseRows.length === 0 ? (
                      <div className="client-detail-light-empty">Brak spraw przy tym kliencie. Po pozyskaniu tematu utwĂłrz sprawÄ™ i prowadĹş tam dalszÄ… obsĹ‚ugÄ™.</div>
                    ) : (
                      clientCaseRows.slice(0, 4).map((caseRecord) => (
                        <article key={caseRecord.id} className="client-detail-relation-row">
                          <div className="client-detail-relation-main">
                            <h3>{caseRecord.title}</h3>
                            <p>{caseRecord.nextActionMeta || `W realizacji Â· najbliĹĽsza akcja ${caseRecord.nextActionLabel}`}</p>
                          </div>
                          <span className={`client-detail-pill ${statusBadgeClass(caseRecord.status)}`}>
                            {activeCases.some((entry) => String(entry.id) === String(caseRecord.id)) ? 'Aktywna' : caseRecord.statusLabel}
                          </span>
                          <div className="client-detail-relation-actions">
                            <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/cases/${String(caseRecord.id)}`)}>
                              OtwĂłrz sprawÄ™
                            </Button>
                            {caseRecord.leadId ? (
                              <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/leads/${String(caseRecord.leadId)}`)}>
                                OtwĂłrz lead
                              </Button>
                            ) : null}
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>

                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Historia pozyskania</h2>
                      <p>Pierwszy kontakt, ĹşrĂłdĹ‚o i poĹ‚Ä…czenie z leadem ĹşrĂłdĹ‚owym.</p>
                    </div>
                    {firstSourceLead ? (
                      <Button type="button" variant="outline" onClick={() => navigate(`/leads/${String(firstSourceLead.id)}`)}>
                        OtwĂłrz lead
                      </Button>
                    ) : null}
                  </div>
                  <div className="client-detail-acquisition-line">
                    <span>
                      Pierwszy kontakt:{' '}
                      <strong>{firstSourceLead ? formatDate(firstSourceLead.createdAt || firstSourceLead.updatedAt) : formatDate(client.createdAt)}</strong>
                    </span>
                    <span>
                      ĹąrĂłdĹ‚o: <strong>{firstSourceLead?.source || client.source || 'Brak ĹşrĂłdĹ‚a'}</strong>
                    </span>
                    <span>
                      Lead ĹşrĂłdĹ‚owy:{' '}
                      <strong>{firstSourceLead ? String(firstSourceLead.name || firstSourceLead.company || 'Lead bez nazwy') : 'Brak powiÄ…zanego leada'}</strong>
                    </span>
                  </div>
                </section>
              </div>
            ) : null}

                        {activeTab === 'cases' ? (
              <div className="client-detail-tab-panel" data-client-relations-acquisition-only="true">
                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Historia pozyskania</h2>
                      <p>Jedno miejsce pokazujÄ…ce, skÄ…d przyszedĹ‚ klient. Bez dublowania przejĹ›Ä‡ do tego samego leada.</p>
                    </div>
                  </div>

                  {leads.length ? (
                    <div className="client-detail-relations-list client-detail-relations-list-acquisition-only">
                      {leads.map((lead) => {
                        const leadId = String(lead.id || lead.leadId || lead.name || lead.createdAt || 'lead');
                        const leadName = String(lead.name || lead.company || 'Lead bez nazwy');
                        const source = asText(lead.source) || asText(lead.sourceName) || asText(lead.channel) || asText(lead.origin) || asText(lead.acquisitionSource) || 'Nie podano';
                        const status = leadStatusLabel(String(lead.status || 'new'));
                        return (
                          <div
                            key={leadId}
                            className="client-detail-relation-row client-detail-relation-row-acquisition-only"
                            data-client-acquisition-history-row="true"
                          >
                            <div className="client-detail-relation-main">
                              <h3>{leadName}</h3>
                              <p><strong>ĹąrĂłdĹ‚o:</strong> {source}</p>
                              <p><strong>Status przy pozyskaniu:</strong> {status} Â· <strong>Utworzono:</strong> {formatDate(lead.createdAt || lead.updatedAt)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="client-detail-light-empty">
                      Brak zapisanej historii pozyskania dla tego klienta.
                    </div>
                  )}
                </section>
              </div>
            ) : null}

{activeTab === 'history' ? (
              <div className="client-detail-tab-panel">
                <section className="client-detail-section-card">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Historia</h2>
                      <p>Lekka oĹ› ostatnich ruchĂłw powiÄ…zanych z klientem, leadami i sprawami.</p>
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
                    <section className="client-detail-right-card client-detail-recent-moves-card" data-client-recent-moves-panel="true">
          <div className="client-detail-card-title-row">
            <Activity className="h-4 w-4" />
            <h2>Ostatnie ruchy</h2>
          </div>
          {recentClientMovements.length ? (
            <div className="client-detail-recent-moves-list">
              {recentClientMovements.map((move) => (
                <Link key={move.id} to="/activity" className="client-detail-recent-move-row">
                  <span>
                    <strong>{move.title}</strong>
                    <small>{move.meta}</small>
                  </span>
                  <em>{move.time}</em>
                </Link>
              ))}
            </div>
          ) : (
            <p className="client-detail-light-empty">Brak ostatnich ruchĂłw dla tego klienta.</p>
          )}
          <Link to="/activity" className="client-detail-recent-moves-link">
            Zobacz caĹ‚Ä… aktywnoĹ›Ä‡
          </Link>
        </section>
<section className="right-card client-detail-right-card client-detail-operational-center" aria-label="Centrum operacyjne klienta">
              <div className="client-detail-card-title-row">
                <Clock className="h-4 w-4" />
                <h2>NastÄ™pny ruch</h2>
              </div>
              <div className="client-detail-quick-actions-list">
                <div>
                  <span>Zadania klienta</span>
                  <strong>{activeTaskCount}</strong>
                </div>
                <div>
                  <span>Wydarzenia klienta</span>
                  <strong>{activeEventCount}</strong>
                </div>
                <div>
                  <span>AktywnoĹ›Ä‡ klienta</span>
                  <strong>{lastActivityDate ? formatDateTime(lastActivityDate) : 'Brak'}</strong>
                </div>
              </div>
            </section>

            <div hidden data-client-detail-stage35-removed-quick-actions="true" />
            <div hidden data-client-detail-stage35-retain-open-new-lead={String(Boolean(openNewLeadForExistingClient))} />

            {/* STAGE35_CLIENT_DETAIL_HIDE_DODATKOWO */}

            <section className="right-card client-detail-right-card client-detail-note-card">
              <div className="client-detail-card-title-row">
                <FileText className="h-4 w-4" />
                <h2>KrĂłtka notatka</h2>
              </div>
              <p className="client-detail-note-text">
                {client.notes ? String(client.notes) : 'Brak osobnej notatki. Dodaj, jeĹ›li jest coĹ› waĹĽnego.'}
              </p>
                    <Button type="button" variant="outline" size="sm" onClick={() => openClientContextAction('note')} disabled={!hasAccess}>
                      Dodaj notatkÄ™
                    </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleToggleClientNoteSpeech} disabled={!hasAccess}>
                {clientNoteListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                Dyktuj
              </Button>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
}


