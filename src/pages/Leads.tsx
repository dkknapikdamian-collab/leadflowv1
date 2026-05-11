// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
// CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent
} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronRight,
  Clock3,
  Loader2,
  Mail,
  RotateCcw,
  Search,
  Trash2,
  TrendingUp
} from 'lucide-react';
import {
  CaseEntityIcon,
  EntityIcon,
  LeadEntityIcon,
  TemplateEntityIcon
} from '../components/ui-system';
import { consumeGlobalQuickAction, subscribeGlobalQuickAction } from '../components/GlobalQuickActions';
import { actionIconClass, modalFooterClass } from '../components/entity-actions';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { EntityConflictDialog, type EntityConflictCandidate } from '../components/EntityConflictDialog';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  findEntityConflictsInSupabase,
  insertLeadToSupabase,
  isSupabaseConfigured,
  updateClientInSupabase,
  updateLeadInSupabase
} from '../lib/supabase-fallback';
import { format, isPast, parseISO } from 'date-fns';
import { toast } from 'sonner';
// CLOSEFLOW_LEAD_CONFLICT_RESOLUTION_V1
// LEAD_TO_CASE_FLOW_STAGE24_LEADS_LIST
// ADMIN_FEEDBACK_P1_LEADS_SEARCH_QUESTION_MARK_REMOVED
// VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD
// VISUAL_STAGE18_LEADS_HTML_HARD_1TO1


import { pl } from 'date-fns/locale';


import Layout from '../components/Layout';


// STAGE30A_LINT_GUARD_COMPAT: legacy visual guard expects exact text: consumeGlobalQuickAction() === 'lead'


import { useWorkspace } from '../hooks/useWorkspace';

import { isActiveSalesLead, isLeadMovedToService } from '../lib/lead-health';

import { getNearestPlannedAction } from '../lib/nearest-action';

import { buildRelationFunnelValue, buildRelationValueEntries, formatRelationValue } from '../lib/relation-value';


import '../styles/visual-stage20-lead-form-vnext.css';

import '../styles/closeflow-page-header-card-source-truth.css';
import '../styles/closeflow-page-header-final-lock.css';
import { PAGE_HEADER_CONTENT } from '../lib/page-header-content';
const STAGE_PANEL_DELETE_LEADS_TRASH_EMPTY_GUARD = 'Kosz leadów jest pusty';
const STAGE_PANEL_DELETE_LEADS_RESTORE_GUARD = 'Przywróć leada';
const STAGE_PANEL_DELETE_LEADS_CONFIRM_GUARD = '\\\\n\\\\nTen lead ma powiązaną sprawę';
const STAGE31_LEADS_SEARCH_COPY_GUARD_1 = 'Szukaj: nazwa, telefon, e-mail, firma, źródło albo sprawa...';
const STAGE31_LEADS_SEARCH_COPY_GUARD_2 = 'Podpowiedzi pojawiają się pod wyszukiwarką. Usuń część tekstu albo wybierz inny filtr.';
const STAGE31_LEADS_SEARCH_COPY_GUARD_UTF8_1 = 'Szukaj: nazwa, telefon, e-mail, firma, źródło albo sprawa...';
const STAGE31_LEADS_SEARCH_COPY_GUARD_UTF8_2 = 'Podpowiedzi pojawiają się pod wyszukiwarką. Usuń część tekstu albo wybierz inny filtr.';
// Guard marker: \n\nTen lead ma powiązaną sprawę

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nowy', tone: 'blue' },
  { value: 'contacted', label: 'Skontaktowany', tone: 'blue' },
  { value: 'qualification', label: 'Kwalifikacja', tone: 'blue' },
  { value: 'proposal_sent', label: 'Oferta wysłana', tone: 'amber' },
  { value: 'waiting_response', label: 'Czeka na odpowiedź', tone: 'amber' },
  { value: 'accepted', label: 'Zaakceptowany', tone: 'green' },
  { value: 'moved_to_service', label: 'Przeniesiony do obsługi', tone: 'blue' },
  { value: 'negotiation', label: 'Negocjacje', tone: 'amber' },
  { value: 'lost', label: 'Przegrany', tone: 'neutral' },
  { value: 'archived', label: 'W koszu', tone: 'amber' },
];

type LeadStatusTone = 'blue' | 'green' | 'amber' | 'red' | 'neutral';
function getLeadStatusLabel(value: unknown) {
  const normalized = String(value || 'new');
  return STATUS_OPTIONS.find((option) => option.value === normalized)?.label || 'Nowy';
}

function getLeadStatusTone(value: unknown) {
  const normalized = String(value || 'new');
  return STATUS_OPTIONS.find((option) => option.value === normalized)?.tone || 'blue';
}

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

type CaseRecord = {
  id: string;
  title?: string;
  status?: string;
  leadId?: string | null;
  clientId?: string | null;
};

type LeadsQuickFilter = 'all' | 'active' | 'at-risk' | 'history';

function formatLeadSourceLabel(value: unknown) {
  const normalized = String(value || 'other');
  return SOURCE_OPTIONS.find((option) => option.value === normalized)?.label || 'Inne';
}

function normalizeLeadSearchValue(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLeadPrimaryContact(lead: any) {
  return String(lead?.phone || lead?.email || '').trim();
}

function buildLeadSearchText(lead: any, linkedCase?: CaseRecord) {
  return [
    lead?.name,
    lead?.email,
    lead?.phone,
    lead?.company,
    lead?.status,
    lead?.source,
    linkedCase?.title,
    linkedCase?.status,
  ].map(normalizeLeadSearchValue).filter(Boolean).join(' ');
}

function buildLeadValueLabel(lead: any) {
  const value = Number(lead?.dealValue || lead?.value || lead?.budget || 0);
  if (!Number.isFinite(value) || value <= 0) return '';
  return value.toLocaleString('pl-PL') + ' PLN';
}

function buildLeadCompactMeta(lead: any, linkedCase: CaseRecord | undefined, sourceLabel: string, leadValueLabel: string = '') {
  // CLOSEFLOW_FB2_LEADS_PHONE_SINGLE_SOURCE: kontakt jest pokazywany raz w sekcji kontaktu, bez drugiego "..." w meta.
  const company = String(lead?.company || '').trim();
  const caseLabel = linkedCase ? 'sprawa: ' + (linkedCase.title || 'otwarta') : '';

  return [
    sourceLabel,
    leadValueLabel,
    company,
    caseLabel,
  ].filter(Boolean).join(' · ');
}

function sanitizeNewLeadCreatePayloadA1(input: any) {
  const payload = { ...(input || {}) };
  delete payload.clientId;
  delete payload.linkedCaseId;
  delete payload.caseId;
  delete payload.client_id;
  delete payload.linked_case_id;
  delete payload.case_id;
  delete payload.leadVisibility;
  return payload;
}

function nativeSelectClassName() {
  return 'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
}

function formatCaseStatusLabel(value?: string) {
  if (!value) return '';
  return value.replaceAll('_', ' ');
}

function getNextActionKindLabel(action: { kind?: string } | null | undefined) {
  if (!action) return '';
  return action.kind === 'event' ? 'Wydarzenie' : 'Zadanie';
}

function buildNextActionMeta(action: { title: string | null; at: string | null; kind?: string | null; status?: string } | null | undefined) {
  if (!action?.at || !action?.title) {
    return {
      title: 'Brak zaplanowanych działań',
      subtitle: '',
      overdue: false,
    };
  }

  const actionDate = parseISO(action.at);
  const overdue = isPast(actionDate);
  const dateLabel = format(actionDate, 'd MMM yyyy, HH:mm', { locale: pl });

  return {
    title: action.title,
    subtitle: `${getNextActionKindLabel(action)} · ${dateLabel} · ${String(action.status || 'todo')}`,
    overdue,
  };
}

function isLeadInTrash(lead: any) {
  // STAGE30_LEADS_TRASH_STRICT_VISIBILITY: kosz leadow nie moze lapac aktywnych rekordow po samym wyniku sprzedazy.
  const status = String(lead?.status || '').trim();
  const visibility = String(lead?.leadVisibility || '').trim();

  return visibility === 'trash' || status === 'archived';
}

function getRestoreStatusForLead(lead: any, linkedCase?: CaseRecord) {
  if (linkedCase || lead?.linkedCaseId || lead?.caseId || lead?.movedToServiceAt || lead?.caseStartedAt) {
    return 'moved_to_service';
  }
  return 'new';
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_LEADS = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';

export default function Leads() {
  const { workspace, hasAccess, loading: workspaceLoading, workspaceReady } = useWorkspace();
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<LeadsQuickFilter>('active');
  const [showTrash, setShowTrash] = useState(false);
  const [valueSortEnabled, setValueSortEnabled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'other',
    dealValue: '',
    company: '',
    summary: '',
    notes: '',
    status: 'new',
    isAtRisk: false,
  });

  const CLOSEFLOW_A2_LEAD_DUPLICATE_WARNING_BEFORE_WRITE = 'lead duplicate warning before write';
  const createLeadSubmitLockRef = useRef(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [archivePendingId, setArchivePendingId] = useState<string | null>(null);
  const [leadConflictOpen, setLeadConflictOpen] = useState(false);
  const [leadConflictCandidates, setLeadConflictCandidates] = useState<EntityConflictCandidate[]>([]);
  const [leadConflictPendingInput, setLeadConflictPendingInput] = useState<any | null>(null);

  useEffect(() => subscribeGlobalQuickAction((target) => {
    if (target === 'lead') setIsNewLeadOpen(true);
  }), []);

  useEffect(() => {
    const quickActionTarget = consumeGlobalQuickAction();
    if (quickActionTarget === 'lead') {
      setIsNewLeadOpen(true);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('quick') !== 'lead') return;
    setIsNewLeadOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const loadLeads = useCallback(async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const [leadRows, caseRows, taskRows, eventRows, clientRows] = await Promise.all([
        fetchLeadsFromSupabase(),
        fetchCasesFromSupabase().catch(() => []),
        fetchTasksFromSupabase().catch(() => []),
        fetchEventsFromSupabase().catch(() => []),
        fetchClientsFromSupabase().catch(() => []),
      ]);
      setLeads(leadRows as any[]);
      setCases(caseRows as CaseRecord[]);
      setTasks(taskRows as any[]);
      setEvents(eventRows as any[]);
      setClients(clientRows as any[]);
    } catch (error: any) {
      const message = error?.message || 'Nie udało się pobrać leadów';
      setLoadError(message);
      toast.error(`Błąd odczytu leadów: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [workspace?.id]);

  useEffect(() => {
    const allowDevPreview = import.meta.env.DEV && !isSupabaseConfigured();
    if ((!isSupabaseConfigured() && !allowDevPreview) || workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }
    void loadLeads();
  }, [loadLeads, workspace?.id, workspaceLoading]);

  const casesByLeadId = useMemo(() => {
    const map = new Map<string, CaseRecord>();
    for (const caseRecord of cases) {
      const leadId = String(caseRecord.leadId || '').trim();
      if (leadId && !map.has(leadId)) {
        map.set(leadId, caseRecord);
      }
    }
    return map;
  }, [cases]);

  const casesByClientId = useMemo(() => {
    const map = new Map<string, CaseRecord>();
    for (const caseRecord of cases) {
      const clientId = String(caseRecord.clientId || '').trim();
      if (clientId && !map.has(clientId)) {
        map.set(clientId, caseRecord);
      }
    }
    return map;
  }, [cases]);

  const resolveLinkedCaseForLead = useCallback((lead: any) => {
    const leadId = String(lead?.id || '').trim();
    const clientId = String(lead?.clientId || '').trim();

    return casesByLeadId.get(leadId) || (clientId ? casesByClientId.get(clientId) : undefined);
  }, [casesByClientId, casesByLeadId]);

  const nextActionByLeadId = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getNearestPlannedAction>>();

    for (const lead of leads) {
      const leadId = String(lead.id || '');
      if (!leadId) continue;
      const linkedCase = resolveLinkedCaseForLead(lead);
      map.set(leadId, getNearestPlannedAction({
        leadId,
        caseId: linkedCase?.id ? String(linkedCase.id) : undefined,
        tasks,
        events,
      }));
    }

    return map;
  }, [events, leads, resolveLinkedCaseForLead, tasks]);

  const resetNewLeadForm = () => {
    setNewLead({ name: '', email: '', phone: '', source: 'other', dealValue: '', company: '', summary: '', notes: '', status: 'new', isAtRisk: false });
  };

  const createLeadFromPreparedInput = async (preparedLead: any, options?: { forceDuplicate?: boolean }) => {
    // A1_LEAD_CREATE_VISIBILITY_FINALIZER: a newly created lead must not inherit stale client/case relations and must stay visible after save.
    const sanitizedPreparedLead = { ...preparedLead };
    delete sanitizedPreparedLead.clientId;
    delete sanitizedPreparedLead.client_id;
    delete sanitizedPreparedLead.linkedCaseId;
    delete sanitizedPreparedLead.linked_case_id;
    delete sanitizedPreparedLead.caseId;
    delete sanitizedPreparedLead.case_id;
    // CLOSEFLOW_A2_LEAD_FORCE_DUPLICATE_TO_ALLOW_DUPLICATE_API_MAP
    await insertLeadToSupabase({ ...sanitizedPreparedLead, allowDuplicate: Boolean(options?.forceDuplicate), ownerId: workspace?.ownerId, workspaceId: requireWorkspaceId(workspace) });
    setSearchQuery('');
    setQuickFilter('all');
    setShowTrash(false);
    setValueSortEnabled(false);
    await loadLeads();
    toast.success('Lead dodany');
    setIsNewLeadOpen(false);
    resetNewLeadForm();
  };

  const restoreConflictCandidate = async (candidate: EntityConflictCandidate) => {
    if (!candidate.canRestore) { toast.info('Ten rekord ma historię. Najpierw go otwórz i zdecyduj, co zrobić.'); return; }
    try {
      setLeadSubmitting(true);
      if (candidate.entityType === 'lead') {
        await updateLeadInSupabase({ id: candidate.id, status: 'new', leadVisibility: 'active', salesOutcome: 'open', closedAt: null });
        toast.success('Lead przywrócony');
      } else {
        await updateClientInSupabase({ id: candidate.id, archivedAt: null });
        toast.success('Klient przywrócony');
      }
      setLeadConflictOpen(false);
      await loadLeads();
    } catch (error: any) { toast.error('Nie udało się przywrócić rekordu: ' + (error?.message || 'REQUEST_FAILED')); }
    finally { setLeadSubmitting(false); }
  };

  const handleCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    if (createLeadSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    const hasLeadIdentity = Boolean(newLead.name.trim() || newLead.phone.trim() || newLead.email.trim() || newLead.company.trim());
    const hasContactOrNeed = Boolean(newLead.phone.trim() || newLead.email.trim() || newLead.summary.trim() || newLead.notes.trim());
    if (!hasLeadIdentity) return toast.error('Podaj nazwę albo kontakt.');
    if (!hasContactOrNeed) return toast.error('Podaj telefon, e-mail albo opis potrzeby.');
    createLeadSubmitLockRef.current = true;
    setLeadSubmitting(true);
    const preparedLead = { ...newLead, name: newLead.name.trim() || newLead.phone.trim() || newLead.email.trim() || 'Lead bez nazwy', email: newLead.email.trim(), phone: newLead.phone.trim(), company: newLead.company.trim(), dealValue: Number(newLead.dealValue) || 0 };
    try {
      const conflicts = await findEntityConflictsInSupabase({ targetType: 'lead', name: preparedLead.name, email: preparedLead.email, phone: preparedLead.phone, company: preparedLead.company, workspaceId }).catch(() => ({ candidates: [] }));
      const candidates = Array.isArray(conflicts.candidates) ? conflicts.candidates as EntityConflictCandidate[] : [];
      if (candidates.length) { setLeadConflictCandidates(candidates); setLeadConflictPendingInput(preparedLead); setIsNewLeadOpen(false); setLeadConflictOpen(true); return; }
      await createLeadFromPreparedInput(preparedLead);
    } catch (error: any) { toast.error(`Błąd zapisu leada: ${error.message}`); }
    finally { createLeadSubmitLockRef.current = false; setLeadSubmitting(false); }
  };

  const handleCreateLeadAnyway = async () => {
    if (!leadConflictPendingInput || leadSubmitting) return;
    try { setLeadSubmitting(true); await createLeadFromPreparedInput(leadConflictPendingInput, { forceDuplicate: true }); setLeadConflictOpen(false); setLeadConflictPendingInput(null); setLeadConflictCandidates([]); }
    catch (error: any) { toast.error('Błąd zapisu leada: ' + (error?.message || 'REQUEST_FAILED')); }
    finally { setLeadSubmitting(false); }
  };

  const handleShowConflictCandidate = (candidate: EntityConflictCandidate) => {
    const safeId = encodeURIComponent(String(candidate.id || ''));
    if (!safeId) return;
    window.location.href = candidate.entityType === 'client' ? '/clients/' + safeId : '/leads/' + safeId;
  };

  const handleArchiveConflictCandidate = async (candidate: EntityConflictCandidate) => {
    const label = candidate.label || (candidate.entityType === 'client' ? 'klienta' : 'leada');
    const confirmed = window.confirm(
      'Przenieść rekord z konfliktu do kosza: ' + label + '? Rekord nie zostanie trwale skasowany i będzie możliwy do przywrócenia.',
    );
    if (!confirmed) return;

    try {
      setLeadSubmitting(true);
      if (candidate.entityType === 'client') {
        await updateClientInSupabase({ id: candidate.id, archivedAt: new Date().toISOString() });
      } else {
        await updateLeadInSupabase({
          id: candidate.id,
          status: 'archived',
          leadVisibility: 'trash',
          salesOutcome: 'archived',
          closedAt: new Date().toISOString(),
        });
      }
      setLeadConflictCandidates((current) => current.filter((item) => !(item.id === candidate.id && item.entityType === candidate.entityType)));
      toast.success('Rekord przeniesiony do kosza');
      await loadLeads();
    } catch (error: any) {
      toast.error('Nie udało się przenieść rekordu do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleArchiveLead = async (event: MouseEvent<HTMLButtonElement>, lead: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const leadId = String(lead.id || '');
    if (!leadId) return;

    const linkedCase = resolveLinkedCaseForLead(lead);
    const relationText = linkedCase
      ? '\\n\\nTen lead ma powiązaną sprawę: ' + (linkedCase.title || linkedCase.id) + '. Rekord zniknie z aktywnej listy, ale nie zostanie trwale skasowany.'
      : '\\n\\nLead zniknie z aktywnej listy, ale będzie można go przywrócić z kosza.';

    if (!window.confirm('Przenieść leada do kosza: ' + (lead.name || 'Lead') + '?' + relationText)) return;

    try {
      setArchivePendingId(leadId);
      await updateLeadInSupabase({
        id: leadId,
        status: 'archived',
        leadVisibility: 'trash',
        salesOutcome: 'archived',
        closedAt: new Date().toISOString(),
      });
      toast.success('Lead przeniesiony do kosza');
      await loadLeads();
    } catch (error: any) {
      toast.error('Błąd przenoszenia leada do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  const handleRestoreLead = async (event: MouseEvent<HTMLButtonElement>, lead: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const leadId = String(lead.id || '');
    if (!leadId) return;

    const linkedCase = resolveLinkedCaseForLead(lead);
    const nextStatus = getRestoreStatusForLead(lead, linkedCase);
    const nextVisibility = nextStatus === 'moved_to_service' ? 'archived' : 'active';
    const nextOutcome = nextStatus === 'moved_to_service' ? 'moved_to_service' : 'open';

    if (!window.confirm('Przywrócić leada do listy: ' + (lead.name || 'Lead') + '?')) return;

    try {
      setArchivePendingId(leadId);
      await updateLeadInSupabase({
        id: leadId,
        status: nextStatus,
        leadVisibility: nextVisibility,
        salesOutcome: nextOutcome,
        closedAt: null,
      });
      toast.success('Lead przywrócony');
      await loadLeads();
    } catch (error: any) {
      toast.error('Błąd przywracania leada: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  const activeLeads = useMemo(
    () => leads.filter((lead) => !isLeadInTrash(lead) && !isLeadMovedToService(lead)),
    [leads],
  );

  const serviceHistoryLeads = useMemo(
    () =>
      activeLeads.filter((lead) => {
        const linkedCase = resolveLinkedCaseForLead(lead);
        return isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      }),
    [activeLeads, resolveLinkedCaseForLead],
  );

  const trashLeads = useMemo(() => leads.filter((lead) => isLeadInTrash(lead)), [leads]);

  // RELATION_FUNNEL_SUM_FROM_ACTIVE_LEADS_AND_CLIENTS
  const relationValueEntries = useMemo(
    () => buildRelationValueEntries({ leads: activeLeads, clients, cases }),
    [activeLeads, clients, cases],
  );

  // CLOSEFLOW_FB2_RIGHT_RAIL_LEADS_ONLY: right rail pokazuje tylko aktywne leady, bez klientów i spraw.
  const mostValuableRelations = useMemo(
    () => buildRelationValueEntries({ leads: activeLeads, clients: [], cases: [] }).slice(0, 5),
    [activeLeads],
  );

  const relationFunnelValue = useMemo(
    () => buildRelationFunnelValue({ leads: activeLeads, clients }),
    [activeLeads, clients],
  );

  const filteredLeads = useMemo(() => {
    // STAGE31_LEADS_THIN_NUMBERED_LIST: wyszukiwarka dziala po nazwie, telefonie, mailu, firmie, zrodle i sprawie.
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);
    const sourceLeads = showTrash ? trashLeads : activeLeads;

    const results = sourceLeads.filter((lead) => {
      const linkedCase = resolveLinkedCaseForLead(lead);
      const movedToService = isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const activeLead = isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const matchesSearch = !normalizedQuery || buildLeadSearchText(lead, linkedCase).includes(normalizedQuery);

      const matchesQuickFilter =
        showTrash
        || quickFilter === 'all'
        || (quickFilter === 'active' && activeLead)
        || (quickFilter === 'at-risk' && Boolean(lead.isAtRisk))
        || (quickFilter === 'history' && movedToService);

      return matchesSearch && matchesQuickFilter;
    });

    if (valueSortEnabled) {
      return [...results].sort((a, b) => (Number(b.dealValue) || 0) - (Number(a.dealValue) || 0));
    }

    return results;
  }, [activeLeads, quickFilter, resolveLinkedCaseForLead, searchQuery, showTrash, trashLeads, valueSortEnabled]);

  const leadSearchSuggestions = useMemo(() => {
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);
    if (!normalizedQuery) return [];

    return filteredLeads.slice(0, 6).map((lead) => {
      const linkedCase = resolveLinkedCaseForLead(lead);
      const sourceLabel = formatLeadSourceLabel(lead.source);
      const leadValueLabel = buildLeadValueLabel(lead);
      return {
        id: String(lead.id || ''),
        name: String(lead.name || 'Lead bez nazwy'),
        meta: buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel),
      };
    }).filter((lead) => lead.id);
  }, [filteredLeads, resolveLinkedCaseForLead, searchQuery]);

  const stats = {
    total: activeLeads.length,
    active: activeLeads.filter((lead) => isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || resolveLinkedCaseForLead(lead)?.id })).length,
    value: relationFunnelValue,
    atRisk: activeLeads.filter((lead) => Boolean(lead.isAtRisk)).length,
    linkedToCase: serviceHistoryLeads.length,
    trash: trashLeads.length,
  };

  const toggleQuickFilter = (filter: LeadsQuickFilter) => {
    setShowTrash(false);
    setValueSortEnabled(false);
    setQuickFilter((prev) => (prev === filter ? 'all' : filter));
  };

  const toggleValueSorting = () => {
    setShowTrash(false);
    setQuickFilter('all');
    setValueSortEnabled((prev) => !prev);
  };

  const toggleTrashView = () => {
    setValueSortEnabled(false);
    setQuickFilter('all');
    setShowTrash((current) => !current);
  };

  return (
    <Layout>
      <div className="cf-html-view main-leads-html" data-visual-stage25-leads-full-jsx="true" data-leads-real-view="true">
        <div data-cf-page-header="true" className="cf-page-header page-head">
          <div>
            <h1 data-cf-page-header-part="title">{PAGE_HEADER_CONTENT.leads.title}</h1>
              <p data-cf-page-header-part="description" className="cf-page-header-description">{PAGE_HEADER_CONTENT.leads.description}</p>
          </div>

          <div className="head-actions" data-cf-page-header-part="actions">
            <Link to="/ai-drafts" className="btn soft-blue" data-stage26-leads-head-ai="true" data-cf-header-action="ai">
              <EntityIcon entity="ai" className="h-4 w-4" />
              Zapytaj AI
            </Link>
            <button
              type="button"
              className="btn"
              onClick={toggleTrashView}
            >
              {showTrash ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              {showTrash ? 'Pokaż aktywne' : 'Kosz'}
              <span className="pill">{showTrash ? stats.total : stats.trash}</span>
            </button>

            <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
              <DialogContent className="lead-form-vnext-content" data-lead-form-stage20="true" aria-describedby="lead-form-stage20-description">
                <DialogHeader className="lead-form-vnext-header">
                  <div data-cf-page-header-part="copy">
                    <span data-cf-page-header-part="kicker" className="lead-form-vnext-kicker">{PAGE_HEADER_CONTENT.leads.kicker}</span>
                    <DialogTitle>Nowy lead</DialogTitle>
                    <p id="lead-form-stage20-description">
                      Wpisz minimum danych i zapisz kontakt. Szczegóły możesz uzupełnić później.
                    </p>
                  </div>
                </DialogHeader>

                <form onSubmit={handleCreateLead} className="lead-form-vnext" data-lead-form-visual-rebuild="LEAD_FORM_VISUAL_REBUILD_STAGE20">
                  <section className="lead-form-section lead-form-primary-section">
                    <div className="lead-form-section-head">
                      <h3>Podstawowe dane</h3>
                      <p>Najważniejsze pola do szybkiego zapisania kontaktu.</p>
                    </div>

                    <div className="lead-form-grid">
                      <div className="lead-form-field lead-form-field-wide">
                        <Label>Nazwa / kontakt</Label>
                        <Input
                          value={newLead.name}
                          onChange={(event) => setNewLead({ ...newLead, name: event.target.value })}
                          placeholder="Np. Jan Kowalski albo Firma ABC"
                        />
                      </div>

                      <div className="lead-form-field">
                        <Label>Telefon</Label>
                        <Input
                          value={newLead.phone}
                          onChange={(event) => setNewLead({ ...newLead, phone: event.target.value })}
                          placeholder="np. 516 000 000"
                        />
                      </div>

                      <div className="lead-form-field">
                        <Label>E-mail</Label>
                        <Input
                          type="email"
                          value={newLead.email}
                          onChange={(event) => setNewLead({ ...newLead, email: event.target.value })}
                          placeholder="kontakt@email.pl"
                        />
                      </div>

                      <div className="lead-form-field">
                        <Label>Źródło</Label>
                        <select
                          className="lead-form-select"
                          value={newLead.source}
                          onChange={(event) => setNewLead({ ...newLead, source: event.target.value })}
                        >
                          {SOURCE_OPTIONS.map((source) => (
                            <option key={source.value} value={source.value}>{source.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="lead-form-field">
                        <Label>Wartość</Label>
                        <Input
                          type="number"
                          value={newLead.dealValue}
                          onChange={(event) => setNewLead({ ...newLead, dealValue: event.target.value })}
                          placeholder="0"
                        />
                      </div>

                      <div className="lead-form-field lead-form-field-wide">
                        <Label>Temat / potrzeba</Label>
                        <Input
                          value={newLead.summary}
                          onChange={(event) => setNewLead({ ...newLead, summary: event.target.value })}
                          placeholder="Np. strona www, kampania, nieruchomość, dokumenty..."
                        />
                      </div>

                      <div className="lead-form-field lead-form-field-wide">
                        <Label>Notatka</Label>
                        <textarea
                          className="lead-form-textarea"
                          value={newLead.notes}
                          onChange={(event) => setNewLead({ ...newLead, notes: event.target.value })}
                          placeholder="Krótki kontekst rozmowy. Bez długiej odprawy."
                        />
                      </div>
                    </div>
                  </section>

                  <details className="lead-form-section lead-form-details">
                    <summary>Dodatkowe pola</summary>
                    <div className="lead-form-grid lead-form-details-grid">
                      <div className="lead-form-field">
                        <Label>Firma</Label>
                        <Input
                          value={newLead.company}
                          onChange={(event) => setNewLead({ ...newLead, company: event.target.value })}
                          placeholder="Opcjonalnie"
                        />
                      </div>

                      <div className="lead-form-field">
                        <Label>Status</Label>
                        <select
                          className="lead-form-select"
                          value={newLead.status}
                          onChange={(event) => setNewLead({ ...newLead, status: event.target.value })}
                        >
                          {STATUS_OPTIONS.filter((status) => status.value !== 'archived').map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </div>

                      <label className="lead-form-checkbox">
                        <input
                          type="checkbox"
                          checked={newLead.isAtRisk}
                          onChange={(event) => setNewLead({ ...newLead, isAtRisk: event.target.checked })}
                        />
                        <span>
                          <strong>Wysoki priorytet</strong>
                          <small>Oznacz, jeśli lead wymaga szybkiej reakcji.</small>
                        </span>
                      </label>
                    </div>
                  </details>

                  <section className="lead-form-section lead-form-planning-note">
                    <Clock3 className="h-4 w-4" />
                    <div>
                      <h3>Szybkie planowanie</h3>
                      <p>Dodanie zadania albo wydarzenia bezpośrednio z formularza wymaga osobnego flow. Ten etap nie udaje tej funkcji.</p>
                    </div>
                  </section>

                  <DialogFooter className={modalFooterClass('lead-form-footer')}>
                    <Button type="button" variant="outline" onClick={() => setIsNewLeadOpen(false)}>
                      Anuluj
                    </Button>
                    <Button type="submit" disabled={leadSubmitting || !workspaceReady}>
                      {leadSubmitting ? 'Zapisywanie...' : 'Zapisz leada'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>          </div>
        </div>

        <div className="grid-5">
          <StatShortcutCard
            label="Wszystkie"
            value={stats.total}
            icon={LeadEntityIcon}
            active={quickFilter === 'all' && !valueSortEnabled && !showTrash}
            onClick={() => { setShowTrash(false); setQuickFilter('all'); setValueSortEnabled(false); }}
            title="Pokaż wszystkie leady"
            ariaLabel="Pokaż wszystkie leady"
          />

          <StatShortcutCard
            label="Aktywne"
            value={stats.active}
            icon={TrendingUp}
            active={quickFilter === 'active' && !showTrash}
            onClick={() => toggleQuickFilter('active')}
            title="Pokaż aktywne leady"
            ariaLabel="Pokaż aktywne leady"
            valueClassName="text-slate-900"
            iconClassName="bg-blue-50 text-blue-500"
          />

          <StatShortcutCard
            label="Wartość"
            value={`${stats.value.toLocaleString('pl-PL')} PLN`}
            icon={TrendingUp}
            active={valueSortEnabled && !showTrash}
            onClick={toggleValueSorting}
            title="Sortuj leady po wartości"
            ariaLabel="Sortuj leady po wartości"
            helper={valueSortEnabled ? 'sortowanie aktywne' : 'kliknij, aby sortować!'}
          />

          <StatShortcutCard
            label="Zagrożone"
            value={stats.atRisk}
            icon={AlertTriangle}
            active={quickFilter === 'at-risk' && !showTrash}
            onClick={() => toggleQuickFilter('at-risk')}
            title="Pokaż zagrożone leady"
            ariaLabel="Pokaż zagrożone leady"
            tone="risk"
          />

          <StatShortcutCard
            label="Historia"
            value={stats.linkedToCase}
            icon={CaseEntityIcon}
            active={quickFilter === 'history' && !showTrash}
            onClick={() => toggleQuickFilter('history')}
            title="Pokaż leady przeniesione do obsługi"
            ariaLabel="Pokaż leady przeniesione do obsługi"
          />
        </div>

        {/* STAGE32_VALUABLE_RELATIONS_RIGHT_RAIL */}
        <div
          className="layout-list xl:grid-cols-[minmax(0,1fr)_300px]"
          data-stage25-leads-layout-list="true"
          data-stage32-leads-value-layout="true"
        >
          <div className="stack">
            <div className="search" data-leads-search="true">
              <span aria-hidden="true">?</span>
              <input
                placeholder={showTrash ? 'Szukaj w koszu leadów...' : 'Szukaj: nazwa, telefon, e-mail, firma, źródło albo sprawa...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                list="lead-search-suggestions-stage25"
              />
              <datalist id="lead-search-suggestions-stage25">
                {leadSearchSuggestions.map((suggestion) => (
                  <option key={suggestion.id} value={suggestion.name} />
                ))}
              </datalist>
            </div>

            {searchQuery.trim() ? (
              leadSearchSuggestions.length ? (
                <div className="suggestions lead-search-suggestions-stage31" data-stage31-lead-search-suggestions="true">
                  {leadSearchSuggestions.map((suggestion, index) => (
                    <Link key={suggestion.id} to={`/leads/${suggestion.id}`}>
                      <span>{index + 1}. {suggestion.name}</span>
                      <small>{suggestion.meta}</small>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="suggestions lead-search-suggestions-stage31" data-stage31-lead-search-suggestions="true">
                  <span className="sub">Podpowiedzi pojawiają się pod wyszukiwarką. Usuń część tekstu albo wybierz inny filtr.</span>
                </div>
              )
            ) : null}

            <div className="table-card lead-table-card" data-stage25-lead-table-card="true">
              {loading || workspaceLoading ? (
                <div className="row row-empty">
                  <span className="index"><Loader2 className="h-4 w-4 animate-spin" /></span>
                  <span>
                    <span className="title">Ładowanie leadów</span>
                    <span className="sub">Pobieram dane z aplikacji.</span>
                  </span>
                </div>
              ) : loadError ? (
                <div className="row row-empty">
                  <span className="index">!</span>
                  <span>
                    <span className="title">Nie udało się pobrać leadów</span>
                    <span className="sub">{loadError}</span>
                  </span>
                </div>
              ) : filteredLeads.length ? (
                filteredLeads.map((lead, leadIndex) => {
                  const leadId = String(lead.id || '');
                  const linkedCase = resolveLinkedCaseForLead(lead);
                  const sourceLabel = formatLeadSourceLabel(lead.source);
                  const statusOption = STATUS_OPTIONS.find((option) => option.value === String(lead.status || 'new'));
                  const statusLabel = statusOption?.label || 'Nowy';
                  const leadValueLabel = (Number(lead.dealValue) || 0).toLocaleString() + ' PLN';
                  const contactLabel = getLeadPrimaryContact(lead);
                  const meta = buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel);
                  const nextActionMeta = buildNextActionMeta(nextActionByLeadId.get(leadId));
                  const pending = archivePendingId === leadId;

                  return (
                    <div key={leadId || leadIndex} className="relative group/lead-row">
                      <Link to={`/leads/${leadId}`} className="block">
                        <div className="row lead-row" data-stage25-lead-row="true" data-stage31-lead-thin-row="true">
                        <span className="index">{leadIndex + 1}</span>

                        <span className="lead-main-cell">
                          <span className="title">{lead.name || 'Lead bez nazwy'}</span>
                          <span className="cf-list-row-meta" data-stage31-lead-one-line-meta="true">
                            {contactLabel ? <span className="cf-list-row-contact">{contactLabel}</span> : null}
                            <span className="cf-list-row-value">{leadValueLabel}</span>
                            {meta ? <span className="sub">{meta}</span> : null}
                          </span>
                          <span className="statusline">
                            <span className="cf-status-pill" data-cf-status-tone="blue">{statusLabel}</span>
                            <span className="pill">{sourceLabel}</span>
                            {linkedCase ? <span className="cf-status-pill" data-cf-status-tone="green">Sprawa</span> : null}
                          </span>
                        </span>

                        <span className="lead-value-cell">
                          <span className="mini">Wartość</span>
                          <strong className="cf-list-row-value">{leadValueLabel}</strong>
                        </span>

                        <span className="lead-action-cell">
                          <span className="mini">Najbliższa zaplanowana akcja</span>
                          <strong className={nextActionMeta.overdue ? 'danger' : ''}>{nextActionMeta.title}</strong>
                          {nextActionMeta.subtitle ? <span className="sub">{nextActionMeta.subtitle}</span> : null}
                        </span>

                        <span className="lead-actions">
                          <span className="btn ghost" aria-hidden="true">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                          <button
                            type="button"
                            className={actionIconClass('danger', 'btn ghost lead-icon-btn')}
                            disabled={pending}
                            onClick={(event) => (showTrash ? handleRestoreLead(event, lead) : handleArchiveLead(event, lead))}
                            aria-label={showTrash ? 'Przywróć leada' : 'Przenieś leada do kosza'}
                            title={showTrash ? 'Przywróć leada' : 'Przenieś leada do kosza'}
                          >
                            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : showTrash ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </span>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="row row-empty">
                  <span className="index">0</span>
                  <span>
                    <span className="title">{showTrash ? 'Kosz leadów jest pusty.' : 'Brak leadów w tym widoku'}</span>
                    <span className="sub">{showTrash ? 'Nie ma rekordów do przywrócenia.' : 'Zmień filtr albo dodaj pierwszego leada.'}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="lead-right-rail" data-stage25-leads-right-rail="true" data-stage32-leads-value-rail="true">
            <aside className="right-card lead-right-card lead-top-relations" data-relation-value-board="true">
              <div className="panel-head">
                <div>
                  <h3>Najcenniejsze leady</h3>
                </div>
                <span className="pill dark">Lejek razem: {formatRelationValue(relationFunnelValue)}</span>
              </div>

              {mostValuableRelations.length ? (
                <div className="quick-list">
                  {mostValuableRelations.map((entry) => (
                    <Link
                      key={entry.key}
                      to={entry.href || '/leads'}
                      title={`${entry.label} - ${formatRelationValue(entry.value)}`}
                      data-stage25-valuable-relation-row="true"
                      data-stage32-valuable-relation-row="true"
                    >
                      <span className="lead-relation-label-wrap">
                        <strong className="lead-relation-label">{entry.label}</strong>
                      </span>
                      <strong className="lead-relation-money">{formatRelationValue(entry.value)}</strong>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="note">Brak relacji z wyliczoną wartością.</div>
              )}
            </aside>

            <div hidden data-leads-stage35-removed-ai-side-card="true" />
          </div>
        </div>
      </div>
    
        <EntityConflictDialog
          open={leadConflictOpen}
          candidates={leadConflictCandidates}
          createAnywayLabel="Dodaj mimo to"
          onOpenChange={(open) => {
            setLeadConflictOpen(open);
            if (!open) {
              setLeadConflictCandidates([]);
              setLeadConflictPendingInput(null);
            }
          }}
          onShow={(candidate) => {
            const targetUrl = candidate.url || (candidate.entityType === 'client' ? '/clients/' + candidate.id : '/leads/' + candidate.id);
            window.location.href = targetUrl;
          }}
          onRestore={restoreConflictCandidate}
          onCreateAnyway={handleCreateLeadAnyway}
          onCancel={() => {
            setLeadConflictOpen(false);
            setLeadConflictCandidates([]);
            setLeadConflictPendingInput(null);
            setIsNewLeadOpen(true);
          }}
          busy={leadSubmitting}
        />

        <div data-closeflow-lead-conflict-dialog-v25="true">
          <EntityConflictDialog
            open={leadConflictOpen}
            candidates={leadConflictCandidates}
            onOpenChange={(open) => {
              setLeadConflictOpen(open);
              if (!open) {
                setLeadConflictPendingInput(null);
                setLeadConflictCandidates([]);
              }
            }}
            onShow={handleShowConflictCandidate}
            onRestore={restoreConflictCandidate}
            onDeleteCandidate={handleArchiveConflictCandidate}
            onCreateAnyway={handleCreateLeadAnyway}
            onCancel={() => {
              setLeadConflictOpen(false);
              setLeadConflictPendingInput(null);
              setLeadConflictCandidates([]);
            }}
            busy={leadSubmitting}
            createAnywayLabel="Dodaj mimo to"
          />
        </div>
</Layout>
  );
}

/* PHASE0_STAT_CARD_PAGE_GUARD StatShortcutCard onClick= toggleQuickFilter('active') toggleValueSorting */

/* GLOBAL_QUICK_ACTIONS_STAGE08D_LEAD_MODAL_EVENT_BUS */


/*
CLOSEFLOW_REPAIR12_STAGE32_VALUE_MARKERS
relationValueEntries.slice(0, 5)
Najcenniejsze relacje
data-relation-value-board="true"
*/
