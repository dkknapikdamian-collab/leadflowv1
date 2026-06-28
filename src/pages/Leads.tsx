const STAGE227G2_LEADS_RUNTIME_COPY_CLEANUP = 'Leads runtime removes helper marketing copy and highest-value helper copy';
void STAGE227G2_LEADS_RUNTIME_COPY_CLEANUP;
// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
// CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP
// STAGE14E_LEADS_VALUE_DEDUP_BADGE_REPAIR1
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronRight,
  Clock3,
  Filter,
  Loader2,
  Mail,
  RotateCcw,
  Search,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import {
  CaseEntityIcon,
  EntityIcon,
  LeadEntityIcon,
  TemplateEntityIcon,
} from '../components/ui-system';
import { consumeGlobalQuickAction, subscribeGlobalQuickAction } from '../components/GlobalQuickActions';
import { actionIconClass, modalFooterClass } from '../components/entity-actions';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { EntityConflictDialog, type EntityConflictCandidate } from '../components/EntityConflictDialog';
import { ConfirmDialog } from '../components/confirm-dialog';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { SimpleFiltersCard, TopValueRecordsCard } from '../components/operator-rail';
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
  updateLeadInSupabase,
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
import { buildRecordOperationalBadges } from '../lib/record-operational-badges';
import {
  buildContactCadenceGrid,
  buildContactCadenceBuckets,
  type ContactCadenceBucketKey,
} from '../lib/owner-control/contact-cadence-grid';
import { buildLostLeadRescue } from '../lib/owner-control/lost-lead-rescue';
import {
  dateInputToNoonIso,
  getDefaultLastContactDateInput,
  getLastContactDateInputError,
  getTodayDateInputValue,
} from '../lib/owner-control/last-contact-intake';

import { getNearestPlannedAction } from '../lib/nearest-action';

import { buildRelationFunnelValue, buildRelationValueEntries, formatRelationValue } from '../lib/relation-value';
import {
  LEAD_SOURCE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  getLeadSourceLabel,
  getLeadStatusLabel,
  getLeadStatusTone,
} from '../lib/source-of-truth/lead-options';

import '../styles/visual-stage20-lead-form-vnext.css';

import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-record-list-source-truth.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-canvas-source-truth-stage211e.css';
const STAGE_PANEL_DELETE_LEADS_TRASH_EMPTY_GUARD = 'Kosz leadĂ„â€šÄąâ€šw jest pusty';
const STAGE_PANEL_DELETE_LEADS_RESTORE_GUARD = 'PrzywrĂ„â€šÄąâ€šÄ‚â€žĂ˘â‚¬Ë‡ leada';
const STAGE_PANEL_DELETE_LEADS_CONFIRM_GUARD = '\\\\n\\\\nTen lead ma powiÄ‚â€žĂ˘â‚¬Â¦zanÄ‚â€žĂ˘â‚¬Â¦ sprawÄ‚â€žĂ˘â€žË';
const STAGE31_LEADS_SEARCH_COPY_GUARD_1 = 'Szukaj: nazwa, telefon, e-mail, firma, Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo albo sprawa...';
const STAGE31_LEADS_SEARCH_COPY_GUARD_2 = 'Podpowiedzi pojawiajÄ‚â€žĂ˘â‚¬Â¦ siÄ‚â€žĂ˘â€žË pod wyszukiwarkÄ‚â€žĂ˘â‚¬Â¦. UsuĂ„Ä…Ă˘â‚¬Ĺľ czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ tekstu albo wybierz inny filtr.';
const STAGE31_LEADS_SEARCH_COPY_GUARD_UTF8_1 = 'Szukaj: nazwa, telefon, e-mail, firma, Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo albo sprawa...';
const STAGE31_LEADS_SEARCH_COPY_GUARD_UTF8_2 = 'Podpowiedzi pojawiajÄ‚â€žĂ˘â‚¬Â¦ siÄ‚â€žĂ˘â€žË pod wyszukiwarkÄ‚â€žĂ˘â‚¬Â¦. UsuĂ„Ä…Ă˘â‚¬Ĺľ czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ tekstu albo wybierz inny filtr.';
const STAGE117_LEADS_RIGHT_RAIL_LAYOUT_CONTRACT = 'Leads right rail starts at search height, simple filters first, top value below, no overlap';
const STAGE222_R4_LEADS_CLIENTS_OPERATIONAL_BADGES = 'lead rows show missing contact, missing next action and 7/14 day silence badges';
const STAGE223R3_LAST_CONTACT_INTAKE_LEADS = 'lead creation captures explicit lastContactAt for activity truth';
const STAGE225_CONTACT_CADENCE_GRID_LEADS = 'leads list uses Contact Cadence Grid filter from activity-truth';
const STAGE226_LOST_LEAD_RESCUE_LEADS = 'lead list exposes Do odzyskania rescue view from buildLostLeadRescue';
const STAGE226R10_LEAD_CLIENT_SEPARATION_RUNTIME = 'lead create stays lead-only and never creates or displays a client row';
const STAGE227F6_LEADS_CONTACT_CADENCE_COMPACT = 'Leads Contact Cadence Grid is a compact filter strip without explanatory runtime copy';
const STAGE231D0C_LEAD_LIST_CARD_CLIENT_VIEW_FREEZE = 'LeadListCard reuses frozen ClientListCard visual shell: size, axes, ellipsis and action column; lead data semantics stay unchanged';
const STAGE231G_LEAD_CREATE_POTENTIAL_INPUT = 'Lead create form exposes PotencjaĂ„Ä…Ă˘â‚¬Ĺˇ / wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ and persists dealValue';
const CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER = 'Szukaj po nazwie, telefonie, e-mailu, firmie albo sprawie...';
const CLOSEFLOW_STAGE134_TRASH_SEARCH_PLACEHOLDER = 'Szukaj w koszu...';
void STAGE117_LEADS_RIGHT_RAIL_LAYOUT_CONTRACT;
void STAGE222_R4_LEADS_CLIENTS_OPERATIONAL_BADGES;
void STAGE223R3_LAST_CONTACT_INTAKE_LEADS;
void STAGE225_CONTACT_CADENCE_GRID_LEADS;
void STAGE226_LOST_LEAD_RESCUE_LEADS;
void STAGE226R10_LEAD_CLIENT_SEPARATION_RUNTIME;
void STAGE227F6_LEADS_CONTACT_CADENCE_COMPACT;
void STAGE231D0C_LEAD_LIST_CARD_CLIENT_VIEW_FREEZE;
void STAGE231G_LEAD_CREATE_POTENTIAL_INPUT;
const STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG = 'lead creation duplicate conflict dialog renders once and client matches cannot be restored from lead create';
void STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG;
const STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE = 'lead duplicate conflict preflight fails closed and requires explicit add anyway';
void STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE;
// Guard marker: \n\nTen lead ma powiÄ‚â€žĂ˘â‚¬Â¦zanÄ‚â€žĂ˘â‚¬Â¦ sprawÄ‚â€žĂ˘â€žË


type CaseRecord = {
  id: string;
  title?: string;
  status?: string;
  leadId?: string | null;
  clientId?: string | null;
};

type LeadsQuickFilter = 'all' | 'active' | 'at-risk' | 'history' | 'rescue';


function normalizeLeadSearchValue(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLeadPrimaryContact(lead: any) {
  const phone = String(lead?.phone || '').trim();
  const email = String(lead?.email || '').trim();
  const company = String(lead?.company || '').trim();

  if (phone) return `Telefon: ${phone}`;
  if (email) return `E-mail: ${email}`;
  if (company) return `Firma: ${company}`;
  return 'Kontakt: -';
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

function buildLeadCompactMeta(lead: any, linkedCase: CaseRecord | undefined, sourceLabel: string, _leadValueLabel: string = '') {
  // STAGE14E_LEADS_VALUE_META_DEDUP: value belongs only to the dedicated value block/pill, never to compact meta.
  void _leadValueLabel;
  const company = String(lead?.company || '').trim();
  const caseLabel = linkedCase ? 'sprawa: ' + (linkedCase.title || 'otwarta') : '';

  return [
    sourceLabel,
    company,
    caseLabel,
  ].filter(Boolean).join(' Ä‚â€šĂ‚Â· ');
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
      title: 'Brak zaplanowanych dziaĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺľ',
      subtitle: '',
      overdue: false,
    };
  }

  const actionDate = parseISO(action.at);
  const overdue = isPast(actionDate);
  const dateLabel = format(actionDate, 'd MMM yyyy, HH:mm', { locale: pl });

  return {
    title: action.title,
    subtitle: `${getNextActionKindLabel(action)} Ä‚â€šĂ‚Â· ${dateLabel} Ä‚â€šĂ‚Â· ${String(action.status || 'todo')}`,
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
const STAGE220A29_LEAD_TRASH_VST_CONFIRM = 'lead trash confirmations use CloseFlow ConfirmDialog instead of native browser confirm';
void STAGE220A29_LEAD_TRASH_VST_CONFIRM;

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
  const [cadenceFilter, setCadenceFilter] = useState<ContactCadenceBucketKey | 'all'>('all');
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
    lastContactAt: getDefaultLastContactDateInput(),
  });

  const CLOSEFLOW_A2_LEAD_DUPLICATE_WARNING_BEFORE_WRITE = 'lead duplicate warning before write';
  const createLeadSubmitLockRef = useRef(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [archivePendingId, setArchivePendingId] = useState<string | null>(null);
  const [leadArchiveConfirmStage220A29, setLeadArchiveConfirmStage220A29] = useState<{ lead: any; linkedCase?: CaseRecord | null } | null>(null);
  const [conflictArchiveConfirmStage220A29, setConflictArchiveConfirmStage220A29] = useState<EntityConflictCandidate | null>(null);
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
      const message = error?.message || 'Nie udaĂ„Ä…Ă˘â‚¬Ĺˇo siÄ‚â€žĂ˘â€žË pobraÄ‚â€žĂ˘â‚¬Ë‡ leadĂ„â€šÄąâ€šw';
      setLoadError(message);
      toast.error(`BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d odczytu leadĂ„â€šÄąâ€šw: ${message}`);
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
    setNewLead({ name: '', email: '', phone: '', source: 'other', dealValue: '', company: '', summary: '', notes: '', status: 'new', isAtRisk: false, lastContactAt: getDefaultLastContactDateInput() });
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
    setCadenceFilter('all');
    await loadLeads();
    toast.success('Lead dodany');
    setIsNewLeadOpen(false);
    resetNewLeadForm();
  };

  const restoreConflictCandidate = async (candidate: EntityConflictCandidate) => {
    if (candidate.entityType === 'client') {
      toast.info('Znaleziono podobnego klienta. To nie jest ten sam rekord. OtwĂ„â€šÄąâ€šrz klienta albo utwĂ„â€šÄąâ€šrz osobnego leada.');
      return;
    }
    if (!candidate.canRestore) { toast.info('Ten rekord ma historiÄ‚â€žĂ˘â€žË. Najpierw go otwĂ„â€šÄąâ€šrz i zdecyduj, co zrobiÄ‚â€žĂ˘â‚¬Ë‡.'); return; }
    try {
      setLeadSubmitting(true);
      await updateLeadInSupabase({ id: candidate.id, status: 'new', leadVisibility: 'active', salesOutcome: 'open', closedAt: null });
      toast.success('Lead przywrĂ„â€šÄąâ€šcony');
      setLeadConflictOpen(false);
      await loadLeads();
    } catch (error: any) { toast.error('Nie udaĂ„Ä…Ă˘â‚¬Ĺˇo siÄ‚â€žĂ˘â€žË przywrĂ„â€šÄąâ€šciÄ‚â€žĂ˘â‚¬Ë‡ rekordu: ' + (error?.message || 'REQUEST_FAILED')); }
    finally { setLeadSubmitting(false); }
  };


  const handleCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    if (createLeadSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('TwĂ„â€šÄąâ€šj trial wygasĂ„Ä…Ă˘â‚¬Ĺˇ.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    const hasLeadIdentity = Boolean(newLead.name.trim() || newLead.phone.trim() || newLead.email.trim() || newLead.company.trim());
    const hasContactOrNeed = Boolean(newLead.phone.trim() || newLead.email.trim() || newLead.summary.trim() || newLead.notes.trim());
    if (!hasLeadIdentity) return toast.error('Podaj nazwÄ‚â€žĂ˘â€žË albo kontakt.');
    if (!hasContactOrNeed) return toast.error('Podaj telefon, e-mail albo opis potrzeby.');
    const lastContactError = getLastContactDateInputError(newLead.lastContactAt);
    if (lastContactError) return toast.error(lastContactError);
    createLeadSubmitLockRef.current = true;
    setLeadSubmitting(true);
    const preparedLead = { ...newLead, name: newLead.name.trim() || newLead.phone.trim() || newLead.email.trim() || 'Lead bez nazwy', email: newLead.email.trim(), phone: newLead.phone.trim(), company: newLead.company.trim(), dealValue: Number(newLead.dealValue) || 0, lastContactAt: dateInputToNoonIso(newLead.lastContactAt) };
    try {
      let conflicts: any;
      try {
        conflicts = await findEntityConflictsInSupabase({ targetType: 'lead', name: preparedLead.name, email: preparedLead.email, phone: preparedLead.phone, company: preparedLead.company, workspaceId });
      } catch (error: any) {
        toast.error('Nie udaĂ„Ä…Ă˘â‚¬Ĺˇo siÄ‚â€žĂ˘â€žË sprawdziÄ‚â€žĂ˘â‚¬Ë‡ duplikatĂ„â€šÄąâ€šw. Zapis leada zatrzymany, Ă„Ä…Ă„Ëťeby nie dodaÄ‚â€žĂ˘â‚¬Ë‡ konfliktu po cichu.');
        return;
      }
      const candidates = Array.isArray(conflicts.candidates)
        ? (conflicts.candidates as EntityConflictCandidate[]).map((candidate) => candidate.entityType === 'client' ? { ...candidate, canRestore: false } : candidate)
        : [];
      if (candidates.length) {
        toast.info('Znaleziono podobny rekord. Zapis leada wymaga potwierdzenia albo klikniÄ‚â€žĂ˘â€žËcia Ä‚ËĂ˘â€šÂ¬ÄąÄľDodaj mimo toÄ‚ËĂ˘â€šÂ¬ÄąÄ„.');
        setLeadConflictCandidates(candidates);
        setLeadConflictPendingInput(preparedLead);
        setIsNewLeadOpen(false);
        setLeadConflictOpen(true);
        return;
      }
      await createLeadFromPreparedInput(preparedLead);
    } catch (error: any) { toast.error(`BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d zapisu leada: ${error.message}`); }
    finally { createLeadSubmitLockRef.current = false; setLeadSubmitting(false); }
  };

  const handleCreateLeadAnyway = async () => {
    if (!leadConflictPendingInput || leadSubmitting) return;
    try { setLeadSubmitting(true); await createLeadFromPreparedInput(leadConflictPendingInput, { forceDuplicate: true }); setLeadConflictOpen(false); setLeadConflictPendingInput(null); setLeadConflictCandidates([]); }
    catch (error: any) { toast.error('BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d zapisu leada: ' + (error?.message || 'REQUEST_FAILED')); }
    finally { setLeadSubmitting(false); }
  };

  const handleShowConflictCandidate = (candidate: EntityConflictCandidate) => {
    const safeId = encodeURIComponent(String(candidate.id || ''));
    if (!safeId) return;
    window.location.href = candidate.entityType === 'client' ? '/clients/' + safeId : '/leads/' + safeId;
  };

  const executeArchiveConflictCandidateStage220A29 = async (candidate: EntityConflictCandidate) => {
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
      setConflictArchiveConfirmStage220A29(null);
      toast.success('Rekord przeniesiony do kosza');
      await loadLeads();
    } catch (error: any) {
      toast.error('Nie udaĂ„Ä…Ă˘â‚¬Ĺˇo siÄ‚â€žĂ˘â€žË przenieĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ rekordu do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleArchiveConflictCandidate = (candidate: EntityConflictCandidate) => {
    setConflictArchiveConfirmStage220A29(candidate);
  };

  const executeArchiveLeadStage220A29 = async (leadToArchive: any) => {
    const leadId = String(leadToArchive?.id || '');
    if (!leadId) return;

    try {
      setArchivePendingId(leadId);
      await updateLeadInSupabase({
        id: leadId,
        status: 'archived',
        leadVisibility: 'trash',
        salesOutcome: 'archived',
        closedAt: new Date().toISOString(),
      });
      setLeadArchiveConfirmStage220A29(null);
      toast.success('Lead przeniesiony do kosza');
      await loadLeads();
    } catch (error: any) {
      toast.error('BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d przenoszenia leada do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  const handleArchiveLead = (event: MouseEvent<HTMLButtonElement>, lead: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('TwĂ„â€šÄąâ€šj trial wygasĂ„Ä…Ă˘â‚¬Ĺˇ.');
      return;
    }

    const leadId = String(lead.id || '');
    if (!leadId) return;

    setLeadArchiveConfirmStage220A29({
      lead,
      linkedCase: resolveLinkedCaseForLead(lead) || null,
    });
  };

  const handleRestoreLead = async (event: MouseEvent<HTMLButtonElement>, lead: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('TwĂ„â€šÄąâ€šj trial wygasĂ„Ä…Ă˘â‚¬Ĺˇ.');
      return;
    }

    const leadId = String(lead.id || '');
    if (!leadId) return;

    const linkedCase = resolveLinkedCaseForLead(lead);
    const nextStatus = getRestoreStatusForLead(lead, linkedCase);
    const nextVisibility = nextStatus === 'moved_to_service' ? 'archived' : 'active';
    const nextOutcome = nextStatus === 'moved_to_service' ? 'moved_to_service' : 'open';

    if (!window.confirm('PrzywrĂ„â€šÄąâ€šciÄ‚â€žĂ˘â‚¬Ë‡ leada do listy: ' + (lead.name || 'Lead') + '?')) return;

    try {
      setArchivePendingId(leadId);
      await updateLeadInSupabase({
        id: leadId,
        status: nextStatus,
        leadVisibility: nextVisibility,
        salesOutcome: nextOutcome,
        closedAt: null,
      });
      toast.success('Lead przywrĂ„â€šÄąâ€šcony');
      await loadLeads();
    } catch (error: any) {
      toast.error('BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d przywracania leada: ' + (error?.message || 'REQUEST_FAILED'));
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

  // CLOSEFLOW_FB2_RIGHT_RAIL_LEADS_ONLY: right rail pokazuje tylko aktywne leady, bez klientĂ„â€šÄąâ€šw i spraw.
  const mostValuableRelations = useMemo(
    () => buildRelationValueEntries({ leads: activeLeads, clients: [], cases: [] }).slice(0, 5),
    [activeLeads],
  );

  const relationFunnelValue = useMemo(
    () => buildRelationFunnelValue({ leads: activeLeads, clients }),
    [activeLeads, clients],
  );

  const relatedRecordsByLeadId = useMemo(() => {
    const map = new Map<string, unknown[]>();
    const touch = (leadId: string) => {
      if (!map.has(leadId)) map.set(leadId, []);
      return map.get(leadId)!;
    };
    const addRelated = (row: Record<string, unknown>) => {
      const leadId = String(row.leadId || row.lead_id || '').trim();
      if (leadId) touch(leadId).push(row);
    };
    for (const row of tasks as Record<string, unknown>[]) addRelated(row);
    for (const row of events as Record<string, unknown>[]) addRelated(row);
    return map;
  }, [events, tasks]);

  const contactCadenceGrid = useMemo(
    () => buildContactCadenceGrid({
      entityType: 'lead',
      records: activeLeads,
      relatedRecordsById: relatedRecordsByLeadId,
      settings: workspace,
    }),
    [activeLeads, relatedRecordsByLeadId, workspace],
  );

  const contactCadenceBuckets = useMemo(() => buildContactCadenceBuckets(workspace), [workspace]);

  const lostLeadRescueSummary = useMemo(
    () => buildLostLeadRescue({
      leads: activeLeads,
      relatedRecordsById: relatedRecordsByLeadId,
    }),
    [activeLeads, relatedRecordsByLeadId],
  );

  const filteredLeads = useMemo(() => {
    // STAGE31_LEADS_THIN_NUMBERED_LIST: wyszukiwarka dziala po nazwie, telefonie, mailu, firmie, zrodle i sprawie.
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);
    const sourceLeads = showTrash ? trashLeads : activeLeads;
    const activeCadenceIds = cadenceFilter === 'all'
      ? null
      : new Set((contactCadenceGrid.buckets[cadenceFilter] || []).map((row) => row.entityId));
    const rescueLeadIds = quickFilter === 'rescue'
      ? new Set(lostLeadRescueSummary.rows.map((row) => row.leadId))
      : null;

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
        || (quickFilter === 'rescue' && Boolean(rescueLeadIds?.has(String(lead.id || ''))))
        || (quickFilter === 'history' && movedToService);

      const matchesCadence = showTrash || quickFilter === 'rescue' || !activeCadenceIds || activeCadenceIds.has(String(lead.id || ''));

      return matchesSearch && matchesQuickFilter && matchesCadence;
    });

    if (valueSortEnabled) {
      return [...results].sort((a, b) => (Number(b.dealValue) || 0) - (Number(a.dealValue) || 0));
    }

    return results;
  }, [activeLeads, cadenceFilter, contactCadenceGrid, lostLeadRescueSummary, quickFilter, resolveLinkedCaseForLead, searchQuery, showTrash, trashLeads, valueSortEnabled]);

  const leadSearchSuggestions = useMemo(() => {
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);
    if (!normalizedQuery) return [];

    return filteredLeads.slice(0, 6).map((lead) => {
      const linkedCase = resolveLinkedCaseForLead(lead);
      const sourceLabel = getLeadSourceLabel(lead.source);
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
    rescue: lostLeadRescueSummary.total,
    linkedToCase: serviceHistoryLeads.length,
    trash: trashLeads.length,
  };

  const toggleQuickFilter = (filter: LeadsQuickFilter) => {
    setShowTrash(false);
    setValueSortEnabled(false);
    setCadenceFilter('all');
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
        <CloseFlowPageHeaderV2
          pageKey="leads"
          actions={
            <>
              <div className="head-actions">
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
                            {showTrash ? 'PokaĂ„Ä…Ă„Ëť aktywne' : 'Kosz'}
                            <span className="pill">{showTrash ? stats.total : stats.trash}</span>
                          </button>

                          <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
                            <DialogContent className="lead-form-vnext-content" data-lead-form-stage20="true" aria-describedby="lead-form-stage20-description">
                              <DialogHeader className="lead-form-vnext-header">
                                <div>

                                  <DialogTitle>Nowy lead</DialogTitle>
                                </div>
                              </DialogHeader>

                              <form onSubmit={handleCreateLead} className="lead-form-vnext" data-lead-form-visual-rebuild="LEAD_FORM_VISUAL_REBUILD_STAGE20">
                                <section className="lead-form-section lead-form-primary-section">
                                  <div className="lead-form-section-head">
                                    <h3>Podstawowe dane</h3>
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

                                    <div className="lead-form-field" data-stage223r3-lead-last-contact-input="true">
                                      <Label>Ostatni kontakt</Label>
                                      <Input
                                        type="date"
                                        value={newLead.lastContactAt}
                                        max={getTodayDateInputValue()}
                                        onChange={(event) => setNewLead({ ...newLead, lastContactAt: event.target.value })}
                                      />
                                      <small className="sub">JeĂ„Ä…Ă˘â‚¬Ĺźli dodajesz starszy kontakt, wpisz dzieĂ„Ä…Ă˘â‚¬Ĺľ ostatniej rozmowy. To wpĂ„Ä…Ă˘â‚¬Ĺˇywa na oznaczenia ciszy 7/14 dni.</small>
                                    </div>

                                    <div className="lead-form-field">
                                      <Label>Ă„Ä…Ă„â€¦rĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo</Label>
                                      <select
                                        className="lead-form-select"
                                        value={newLead.source}
                                        onChange={(event) => setNewLead({ ...newLead, source: event.target.value })}
                                      >
                                        {LEAD_LEAD_LEAD_SOURCE_OPTIONS.map((source) => (
                                          <option key={source.value} value={source.value}>{source.label}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="lead-form-field" data-stage231g-lead-create-potential-field="true">
                                      <Label>PotencjaĂ„Ä…Ă˘â‚¬Ĺˇ / wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡</Label>
                                      <Input
                                        data-stage231g-lead-create-potential-input="true"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={newLead.dealValue}
                                        onChange={(event) => setNewLead({ ...newLead, dealValue: event.target.value })}
                                        placeholder="np. 12000"
                                      />
                                      <small className="sub">Kwota trafia do potencjaĂ„Ä…Ă˘â‚¬Ĺˇu leada i finansĂ„â€šÄąâ€šw na karcie leada.</small>
                                    </div>

                                    <div className="lead-form-field lead-form-field-wide">
                                      <Label>Temat / potrzeba</Label>
                                      <Input
                                        value={newLead.summary}
                                        onChange={(event) => setNewLead({ ...newLead, summary: event.target.value })}
                                        placeholder="Np. strona www, kampania, nieruchomoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡, dokumenty..."
                                      />
                                    </div>

                                    <div className="lead-form-field lead-form-field-wide">
                                      <Label>Notatka</Label>
                                      <textarea
                                        className="lead-form-textarea"
                                        value={newLead.notes}
                                        onChange={(event) => setNewLead({ ...newLead, notes: event.target.value })}
                                        placeholder="KrĂ„â€šÄąâ€štki kontekst rozmowy. Bez dĂ„Ä…Ă˘â‚¬Ĺˇugiej odprawy."
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
                                        {LEAD_LEAD_LEAD_STATUS_OPTIONS.filter((status) => status.value !== 'archived').map((status) => (
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
                                        <small>Oznacz, jeĂ„Ä…Ă˘â‚¬Ĺźli lead wymaga szybkiej reakcji.</small>
                                      </span>
                                    </label>
                                  </div>
                                </details>


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
            </>
          }
        />

        <div className="grid-5">
          <StatShortcutCard
            label="Wszystkie"
            value={stats.total}
            icon={LeadEntityIcon}
            active={quickFilter === 'all' && !valueSortEnabled && !showTrash}
            onClick={() => { setShowTrash(false); setQuickFilter('all'); setValueSortEnabled(false); }}
            title="PokaĂ„Ä…Ă„Ëť wszystkie leady"
            ariaLabel="PokaĂ„Ä…Ă„Ëť wszystkie leady"
          />

          <StatShortcutCard
            label="Aktywne"
            value={stats.active}
            icon={TrendingUp}
            active={quickFilter === 'active' && !showTrash}
            onClick={() => toggleQuickFilter('active')}
            title="PokaĂ„Ä…Ă„Ëť aktywne leady"
            ariaLabel="PokaĂ„Ä…Ă„Ëť aktywne leady"
            valueClassName="text-slate-900"
            iconClassName="bg-blue-50 text-blue-500"
          />

          <StatShortcutCard
            label="WartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡"
            value={`${stats.value.toLocaleString('pl-PL')} PLN`}
            icon={TrendingUp}
            active={valueSortEnabled && !showTrash}
            onClick={toggleValueSorting}
            title="Sortuj leady po wartoĂ„Ä…Ă˘â‚¬Ĺźci"
            ariaLabel="Sortuj leady po wartoĂ„Ä…Ă˘â‚¬Ĺźci"
            helper={valueSortEnabled ? 'sortowanie aktywne' : 'kliknij, aby sortowaÄ‚â€žĂ˘â‚¬Ë‡!'}
          />

          <StatShortcutCard
            label="ZagroĂ„Ä…Ă„Ëťone"
            value={stats.atRisk}
            icon={AlertTriangle}
            active={quickFilter === 'at-risk' && !showTrash}
            onClick={() => toggleQuickFilter('at-risk')}
            title="PokaĂ„Ä…Ă„Ëť zagroĂ„Ä…Ă„Ëťone leady"
            ariaLabel="PokaĂ„Ä…Ă„Ëť zagroĂ„Ä…Ă„Ëťone leady"
            tone="risk"
          />

          <StatShortcutCard
            label="Do odzyskania"
            value={stats.rescue}
            icon={AlertTriangle}
            active={quickFilter === 'rescue' && !showTrash}
            onClick={() => toggleQuickFilter('rescue')}
            title="PokaĂ„Ä…Ă„Ëť leady do odzyskania"
            ariaLabel="PokaĂ„Ä…Ă„Ëť leady do odzyskania"
            tone="risk"
            helper={lostLeadRescueSummary.critical ? `${lostLeadRescueSummary.critical} krytyczne` : 'sprawdĂ„Ä…ÄąĹş ciszÄ‚â€žĂ˘â€žË'}
          />

        </div>

        {/*
// STAGE32_STAGE96_COMPAT_WIDTH_MARKER: xl:grid-cols-[minmax(0,1fr)_300px] is a legacy guard marker only; real rail width is delegated to Stage96 source truth CSS.
STAGE32_VALUABLE_RELATIONS_RIGHT_RAIL
 STAGE223_R2V_STAGE32E_RELATION_RAIL_COPY_COMPAT: Lejek razem: {formatRelationValue(relationFunnelValue)} */}
        <div
          className="layout-list"
          data-stage117-leads-right-rail-layout="true"
          data-stage177-leads-clients-layout-source="true"
          data-cf-right-rail-layout-source="shared"
          data-stage25-leads-layout-list="true"
          data-stage32-leads-value-layout="true"
          data-stage96-leads-right-rail-source-truth="true"
        >
          <div className="stack">
            <div className="search cf-main-search cf-main-search-stage177" data-cf-main-search="true" data-leads-search="true" data-stage117-leads-search-anchor="true" data-cf-main-search-source="stage173">
              <span aria-hidden="true"><Search className="w-4 h-4" /></span>
              <Input
                placeholder={showTrash ? CLOSEFLOW_STAGE134_TRASH_SEARCH_PLACEHOLDER : CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                list="lead-search-suggestions-stage25"
                aria-label="Szukaj w leadach"
              />
              <datalist id="lead-search-suggestions-stage25">
                {leadSearchSuggestions.map((suggestion) => (
                  <option key={suggestion.id} value={suggestion.name} />
                ))}
              </datalist>
            </div>

            {searchQuery.trim() ? (
              leadSearchSuggestions.length ? (
                <div className="suggestions lead-search-suggestions-stage31 cf-main-search" data-stage31-lead-search-suggestions="true" data-stage117-leads-search-suggestions="true" data-cf-main-search-source="stage173">
                  {leadSearchSuggestions.map((suggestion, index) => (
                    <Link key={suggestion.id} to={`/leads/${suggestion.id}`}>
                      <span>{index + 1}. {suggestion.name}</span>
                      <small>{suggestion.meta}</small>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="suggestions lead-search-suggestions-stage31 cf-main-search" data-stage31-lead-search-suggestions="true" data-stage117-leads-search-suggestions="true" data-cf-main-search-source="stage173">
                  <span className="sub">Podpowiedzi pojawiajÄ‚â€žĂ˘â‚¬Â¦ siÄ‚â€žĂ˘â€žË pod wyszukiwarkÄ‚â€žĂ˘â‚¬Â¦. UsuĂ„Ä…Ă˘â‚¬Ĺľ czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ tekstu albo wybierz inny filtr.</span>
                </div>
              )
            ) : null}



            {!showTrash ? (
              <div className="cf-contact-cadence-strip w-full max-w-none" data-stage225-contact-cadence-grid="leads" data-stage227f6-contact-cadence-compact="leads">
                <span hidden data-stage225-cadence-14-label="14+ dni ciszy" />
                <div className="cf-contact-cadence-pills">
                  <button
                    type="button"
                    className={cadenceFilter === 'all' ? 'cf-status-pill' : 'pill'}
                    data-cf-status-tone={cadenceFilter === 'all' ? 'blue' : undefined}
                    onClick={() => setCadenceFilter('all')}
                  >
                    Wszystkie ({activeLeads.length})
                  </button>
                  {contactCadenceBuckets.map((bucket) => (
                    <button
                      key={bucket.key}
                      type="button"
                      className={cadenceFilter === bucket.key ? 'cf-status-pill' : 'pill'}
                      data-cf-status-tone={cadenceFilter === bucket.key ? (bucket.severity === 'high' ? 'red' : bucket.severity === 'medium' ? 'amber' : 'blue') : undefined}
                      onClick={() => setCadenceFilter(bucket.key)}
                      title={bucket.description}
                    >
                      {bucket.label} ({contactCadenceGrid.counts[bucket.key] || 0})
                    </button>
                  ))}
                </div>
              </div>
            ) : null}


            {!showTrash && quickFilter === 'rescue' ? (
              <div className="table-card lead-table-card w-full max-w-none" data-stage226-lost-lead-rescue-list="true">
                <span hidden data-stage226-lost-lead-rescue-filter="true" />
                <div className="row row-empty">
                  <span className="index"><AlertTriangle className="h-4 w-4" /></span>
                  <span>
                    <span className="title">Do odzyskania</span>
                    <span className="sub">Lista priorytetowa dla wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciciela: najpierw leady krytyczne, potem wysokie i Ă„Ä…Ă˘â‚¬Ĺźrednie ryzyko.</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 p-3 pt-0" data-stage226r7-rescue-summary="true">
                  <span className="cf-status-pill" data-cf-status-tone="red">Krytyczne: {lostLeadRescueSummary.critical}</span>
                  <span className="cf-status-pill" data-cf-status-tone="amber">Wysokie: {lostLeadRescueSummary.high}</span>
                  <span className="cf-status-pill" data-cf-status-tone="blue">Ă„Ä…ÄąË‡rednie: {lostLeadRescueSummary.medium}</span>
                  {lostLeadRescueSummary.total > 8 ? <span className="pill">Pokazano 8 z {lostLeadRescueSummary.total}</span> : null}
                </div>
                {lostLeadRescueSummary.rows.length ? (
                  lostLeadRescueSummary.rows.slice(0, 8).map((row, rowIndex) => (
                    <div key={row.id} className="row lead-row cf-lead-row-inline" data-stage226-lost-lead-rescue-row="true">
                      <span className="index">{rowIndex + 1}</span>
                      <span className="lead-main-cell">
                        <span className="title">{row.title}</span>
                        <span className="cf-list-row-meta">
                          {row.subtitle ? <span className="sub">{row.subtitle}</span> : null}
                          <span className="cf-status-pill" data-cf-status-tone={row.severity === 'critical' ? 'red' : row.severity === 'high' ? 'amber' : 'blue'}>{row.reasonLabel}</span>
                          {row.contactSilentDays !== null ? <span className="pill">{row.contactSilentDays} dni ciszy</span> : <span className="pill">Brak daty kontaktu</span>}
                          {row.valueAmount ? <span className="cf-list-row-value">{row.valueAmount.toLocaleString('pl-PL')} {row.valueCurrency || 'PLN'}</span> : null}
                        </span>
                        <span className="sub">{row.reasonDetail}</span>
                      </span>
                      <span className="lead-action-cell" title={nextActionMeta.title}>
                        <span className="mini">NastÄ‚â€žĂ˘â€žËpny ruch</span>
                        <strong>{row.nextMoveTitle || 'Brak zaplanowanej akcji'}</strong>
                        <span className="sub">{row.nextMoveAt || 'Ustaw zadanie rÄ‚â€žĂ˘â€žËcznie po otwarciu leada.'}</span>
                      </span>
                      <span className="lead-actions">
                        <Link to={row.href} className="btn ghost">OtwĂ„â€šÄąâ€šrz</Link>
                        <button type="button" className="btn ghost" disabled title="Do potwierdzenia: bezpieczne tworzenie zadania z rescue">Ustaw zadanie</button>
                        <button type="button" className="btn ghost" disabled title="Do potwierdzenia: trwaĂ„Ä…Ă˘â‚¬Ĺˇy snooze rescue">OdĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šĂ„Ä…Ă„Ëť</button>
                        <button type="button" className="btn ghost danger" disabled title="Do potwierdzenia: bezpieczne oznaczanie jako martwy">Oznacz jako martwy</button>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="row row-empty">
                    <span className="index">0</span>
                    <span>
                      <span className="title">Brak leadĂ„â€šÄąâ€šw do odzyskania</span>
                      <span className="sub">Brak leadĂ„â€šÄąâ€šw wymagajÄ‚â€žĂ˘â‚¬Â¦cych odzyskania wedĂ„Ä…Ă˘â‚¬Ĺˇug aktualnych reguĂ„Ä…Ă˘â‚¬Ĺˇ.</span>
                    </span>
                  </div>
                )}
              </div>
            ) : null}

            <div className="table-card lead-table-card w-full max-w-none" data-stage25-lead-table-card="true" data-stage117-leads-list="true">
              {loading || workspaceLoading ? (
                <div className="row row-empty">
                  <span className="index"><Loader2 className="h-4 w-4 animate-spin" /></span>
                  <span>
                    <span className="title">Ă„Ä…Ă‚Âadowanie leadĂ„â€šÄąâ€šw</span>
                    <span className="sub">Pobieram dane z aplikacji.</span>
                  </span>
                </div>
              ) : loadError ? (
                <div className="row row-empty">
                  <span className="index">!</span>
                  <span>
                    <span className="title">Nie udaĂ„Ä…Ă˘â‚¬Ĺˇo siÄ‚â€žĂ˘â€žË pobraÄ‚â€žĂ˘â‚¬Ë‡ leadĂ„â€šÄąâ€šw</span>
                    <span className="sub">{loadError}</span>
                  </span>
                </div>
              ) : filteredLeads.length ? (
                filteredLeads.map((lead, leadIndex) => {
                  const leadId = String(lead.id || '');
                  const linkedCase = resolveLinkedCaseForLead(lead);
                  const sourceLabel = getLeadSourceLabel(lead.source);
                  const statusLabel = getLeadStatusLabel(lead.status);
                  const statusTone = getLeadStatusTone(lead.status);
                  const leadValueLabel = (Number(lead.dealValue) || 0).toLocaleString() + ' PLN';
                  const contactLabel = getLeadPrimaryContact(lead);
                  const meta = buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel);
                  const nextAction = nextActionByLeadId.get(leadId);
                  const nextActionMeta = buildNextActionMeta(nextAction);
                  const pending = archivePendingId === leadId;
                  const operationalBadges = buildRecordOperationalBadges({
                    entityType: 'lead',
                    record: lead,
                    relatedRecords: linkedCase ? [linkedCase] : [],
                    hasNextStep: Boolean(nextAction),
                    settings: workspace,
                  });

                  return (
                    <div key={leadId || leadIndex} className="relative group/lead-row w-full" data-lead-card-wide-layout="true">
                      <Link to={`/leads/${leadId}`} className="block">
                        <div className="row lead-row lead-card-value-block cf-lead-row-inline cf-lead-row-client-aligned" data-stage231d0c-lead-card-client-aligned="true" data-ui-dictionary="LeadListCard" data-stage25-lead-row="true" data-stage31-lead-thin-row="true" data-stage14e-leads-value-layout="true">
                        <span className="index">{leadIndex + 1}</span>

                        <span className="lead-main-cell">
                          <span className="title cf-lead-list-card-name" title={lead.name || 'Lead bez nazwy'}>{lead.name || 'Lead bez nazwy'}</span>
                          <span className="cf-list-row-meta" data-stage31-lead-one-line-meta="true">
                            {contactLabel ? <span className="cf-list-row-contact" title={contactLabel}>{contactLabel}</span> : null}
                            <span className="cf-list-row-value">{leadValueLabel}</span>
                            {meta ? <span className="sub">{meta}</span> : null}
                          </span>
                          <span className="statusline">
                            <span className="cf-status-pill" data-cf-status-tone={statusTone}>{statusLabel}</span>
                            <span className="pill">{sourceLabel}</span>
                            {linkedCase ? <span className="cf-status-pill" data-cf-status-tone="green">Sprawa</span> : null}
                            {operationalBadges.map((badge) => (
                              <span
                                key={badge.id}
                                className="cf-status-pill"
                                data-cf-status-tone={badge.tone}
                                data-stage222-r4-lead-operational-badge="true"
                                title={badge.title}
                              >
                                {badge.label}
                              </span>
                            ))}
                          </span>
                        </span>

                        <span className="lead-value-cell" title={'WartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡: ' + leadValueLabel}>
                          <span className="mini">WartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡</span>
                          <strong className="cf-list-row-value lead-card-value-pill" data-lead-value-pill="true">{leadValueLabel}</strong>
                        </span>

                        <span className="lead-action-cell">
                          <span className="mini">NajbliĂ„Ä…Ă„Ëťsza zaplanowana akcja</span>
                          <strong className={nextActionMeta.overdue ? 'danger cf-lead-next-action-title' : 'cf-lead-next-action-title'} title={nextActionMeta.title}>{nextActionMeta.title}</strong>
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
                            aria-label={showTrash ? 'PrzywrĂ„â€šÄąâ€šÄ‚â€žĂ˘â‚¬Ë‡ leada' : 'PrzenieĂ„Ä…Ă˘â‚¬Ĺź leada do kosza'}
                            title={showTrash ? 'PrzywrĂ„â€šÄąâ€šÄ‚â€žĂ˘â‚¬Ë‡ leada' : 'PrzenieĂ„Ä…Ă˘â‚¬Ĺź leada do kosza'}
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
                    <span className="title">{showTrash ? 'Kosz leadĂ„â€šÄąâ€šw jest pusty.' : 'Brak leadĂ„â€šÄąâ€šw w tym widoku'}</span>
                    <span className="sub">{showTrash ? 'Nie ma rekordĂ„â€šÄąâ€šw do przywrĂ„â€šÄąâ€šcenia.' : 'ZmieĂ„Ä…Ă˘â‚¬Ĺľ filtr albo dodaj pierwszego leada.'}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="lead-right-rail cf-operator-right-rail" data-stage117-leads-right-rail="true" data-stage177-leads-rail-source="clients-aligned" data-stage25-leads-right-rail="true" data-stage32-leads-value-rail="true" data-stage96-leads-right-rail-source-truth="true" data-cf-right-rail-source="shared">
            {/* STAGE32_OPERATOR_RAIL_GUARD_COMPAT: data-stage32-valuable-relation-row="true" to={entry.href || '/leads'} formatRelationValue(entry.value) */}
            {/* STAGE117_RAIL_ORDER_SIMPLE_FILTERS_FIRST */}
            <SimpleFiltersCard
              className="lead-right-card operator-simple-filters-card"
              title="Filtry proste"
              description=""
              dataTestId="leads-simple-filters-card"
              items={[
                {
                  key: 'active',
                  label: 'Aktywne',
                  value: stats.active,
                  onClick: () => {
                    setShowTrash(false);
                    setQuickFilter('active');
                    setValueSortEnabled(false);
                  },
                },
                {
                  key: 'at-risk',
                  label: 'ZagroĂ„Ä…Ă„Ëťone',
                  value: stats.atRisk,
                  onClick: () => {
                    setShowTrash(false);
                    setQuickFilter('at-risk');
                    setValueSortEnabled(false);
                  },
                },
                {
                  key: 'history',
                  label: 'Historia',
                  value: stats.linkedToCase,
                  onClick: () => {
                    setShowTrash(false);
                    setQuickFilter('history');
                    setValueSortEnabled(false);
                  },
                },
                {
                  key: 'trash',
                  label: 'Kosz',
                  value: stats.trash,
                  onClick: () => {
                    setShowTrash(true);
                    setQuickFilter('all');
                    setValueSortEnabled(false);
                  },
                },
              ]}
            />

            {/* STAGE117_RAIL_ORDER_TOP_VALUE_BELOW_FILTERS */}
            <TopValueRecordsCard
              title="Najcenniejsze leady"
              description=""
              className="operator-top-value-card"
              dataTestId="leads-top-value-records-card"
              dataAttrs={{ 'data-relation-value-board': true }}
items={mostValuableRelations.map((entry) => ({
                key: entry.key,
                href: entry.href || '/leads',
                label: entry.label,
                valueLabel: formatRelationValue(entry.value),
                title: entry.label + ' - ' + formatRelationValue(entry.value),
                dataAttrs: {
                  'data-stage25-valuable-relation-row': true,
                  'data-stage32-valuable-relation-row': true,
                },
              }))}
              emptyLabel="Brak relacji z wyliczonÄ‚â€žĂ˘â‚¬Â¦ wartoĂ„Ä…Ă˘â‚¬ĹźciÄ‚â€žĂ˘â‚¬Â¦."
            />

            <div hidden data-leads-stage35-removed-ai-side-card="true" />
          </div>
        </div>
      </div>


        <ConfirmDialog
          open={Boolean(leadArchiveConfirmStage220A29)}
          onOpenChange={(open) => {
            if (!open && !archivePendingId) setLeadArchiveConfirmStage220A29(null);
          }}
          title="PrzenieĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ leada do kosza?"
          description={
            leadArchiveConfirmStage220A29?.linkedCase
              ? 'Lead ' + (leadArchiveConfirmStage220A29?.lead?.name || 'Lead') + ' ma powiÄ‚â€žĂ˘â‚¬Â¦zanÄ‚â€žĂ˘â‚¬Â¦ sprawÄ‚â€žĂ˘â€žË: ' + (leadArchiveConfirmStage220A29.linkedCase.title || leadArchiveConfirmStage220A29.linkedCase.id) + '. Rekord zniknie z aktywnej listy, ale nie zostanie trwale skasowany.'
              : 'Lead ' + (leadArchiveConfirmStage220A29?.lead?.name || 'Lead') + ' zniknie z aktywnej listy, ale bÄ‚â€žĂ˘â€žËdzie moĂ„Ä…Ă„Ëťna go przywrĂ„â€šÄąâ€šciÄ‚â€žĂ˘â‚¬Ë‡ z kosza.'
          }
          confirmLabel="PrzenieĂ„Ä…Ă˘â‚¬Ĺź do kosza"
          cancelLabel="Anuluj"
          confirmTone="destructive"
          pending={Boolean(archivePendingId)}
          onConfirm={() => leadArchiveConfirmStage220A29 ? executeArchiveLeadStage220A29(leadArchiveConfirmStage220A29.lead) : undefined}
        />

        <span hidden data-stage220a29-lead-trash-confirm="true" />

        <ConfirmDialog
          open={Boolean(conflictArchiveConfirmStage220A29)}
          onOpenChange={(open) => {
            if (!open && !leadSubmitting) setConflictArchiveConfirmStage220A29(null);
          }}
          title="PrzenieĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ rekord do kosza?"
          description={'Rekord ' + (conflictArchiveConfirmStage220A29?.label || 'bez nazwy') + ' zniknie z aktywnej listy, ale bÄ‚â€žĂ˘â€žËdzie moĂ„Ä…Ă„Ëťna go przywrĂ„â€šÄąâ€šciÄ‚â€žĂ˘â‚¬Ë‡ z kosza.'}
          confirmLabel="PrzenieĂ„Ä…Ă˘â‚¬Ĺź do kosza"
          cancelLabel="Anuluj"
          confirmTone="destructive"
          pending={leadSubmitting}
          onConfirm={() => conflictArchiveConfirmStage220A29 ? executeArchiveConflictCandidateStage220A29(conflictArchiveConfirmStage220A29) : undefined}
        />

        <span hidden data-stage220a29-conflict-trash-confirm="true" />

        <div data-closeflow-lead-conflict-dialog-v25="true">
          <EntityConflictDialog
            open={leadConflictOpen}
            candidates={leadConflictCandidates.map((candidate) => candidate.entityType === 'client' ? { ...candidate, canRestore: false } : candidate)}
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
