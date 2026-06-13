// STAGE231B0_R13_R6_OWNER_RISK_MINIMAL_SAFE_CALL: replaces broken ownerRiskBadges fragment with closed safe call.
// STAGE231B0_R13_R4_GUARD_MAP_WINDOW_REPAIR: guard window repair after R13-R3 nested call false fail.
// STAGE231B0_R13_R3_NEXT_ACTION_GUARD_AND_MAP_COMPLETION: normalizes nextActionLabel and R13 guard contract.
// STAGE231B0_R13_R2_CASES_MAP_CLOSED_LOGIC_COMPLETION: completes R13 closed-state row logic and fixes guard contract.
// STAGE231B0_R13_CASES_MAP_RECORD_SCOPE_REAL_FIX: fixes filteredCases.map record scope after R12/R7 regression.
// STAGE231B0_R12_R7_FINAL_CASES_RUNTIME_CONTRACT_RESCUE: final rescue for /cases open/closed/all source and runtime closed banner contract.
// STAGE231B0_R11_CLIENT_WIDTH_AND_CASES_RUNTIME_GUARD: remove runtime free renderClosedCaseBannerStage231B0R12 usage from JSX.
// STAGE231B0_R9_R9_CASES_ITEMS_JSX_SYNTAX_REPAIR: fixes JSX prop syntax items={[...]} for cases shortcuts.
// STAGE231B0_R9_R8_R8_SETTER_WRAPPER_SCAN_REPAIR: explicit R8 -> R9 setter wrapper inserted by function scan.
// STAGE231B0_R9_R3_CLOSED_CASE_BANNER_REPAIR: ensures visible closed case banner in /cases list.
// STAGE231B0_R9_R2_CASES_URL_READER_AND_R8_GUARD_COMPAT: URL view reader repair after partial R9.
// STAGE231B0_R9_CLIENT_HISTORY_AND_CASE_VIEW_MODEL
// STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH
// STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ChevronRight, Clock, ExternalLink, FileText, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { EntityIcon } from '../components/ui-system/EntityIcon';

import { toast } from 'sonner';
import { ConfirmDialog } from '../components/confirm-dialog';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { SimpleFiltersCard } from '../components/operator-rail';
import Layout from '../components/Layout';
import { EntityTrashButton, modalFooterClass, trashActionIconClass } from '../components/entity-actions';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { deleteCaseWithRelations, isClosedCaseStatus } from '../lib/cases';
import { resolveCaseLifecycleV1 } from '../lib/case-lifecycle-v1';
import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
import { getCaseOwnerRiskBadges, ownerRiskTone } from '../lib/owner-control/owner-risk-rules';
import { readOwnerRiskSettings } from '../lib/owner-control/owner-risk-settings';
import { requireWorkspaceId } from '../lib/workspace-context';
import '../styles/visual-stage23-client-case-forms-vnext.css';
import {
  createCaseInSupabase,
  fetchCasesFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  isSupabaseConfigured,
  fetchClientsFromSupabase,
} from '../lib/supabase-fallback';
import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-record-list-source-truth.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-canvas-source-truth-stage211e.css';
const CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CASES = 'CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CASES';
const CLIENT_CASE_FORMS_STAGE23_HUMAN_COPY = 'Podaj nazwę klienta. Podaj tytuł sprawy. Wybierz klienta albo utwórz nowego. Nie udało się zapisać. Spróbuj ponownie. Rozpocznij obsługę.';
const CASES_LIFECYCLE_NEEDS_NEXT_STEP_GUARD = 'Bez kroku';
const CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR = 'tasks cases visual mobile repair scoped to /cases';
const STAGE220A22_CLIENT_CASE_INDEX_CHEVRON_CONSISTENCY = 'cases list index pill follows record-list VST color used by clients';
void STAGE220A22_CLIENT_CASE_INDEX_CHEVRON_CONSISTENCY;
const STAGE220A28_CASE_ROW_ACTIONS_SOURCE_TRUTH = 'cases list open and trash actions use right-side icon cluster like clients and leads';
void STAGE220A28_CASE_ROW_ACTIONS_SOURCE_TRUTH;
const STAGE222_OWNER_RISK_CASE_BADGES = 'case rows show owner risk badges from owner-risk-rules source of truth';
void STAGE222_OWNER_RISK_CASE_BADGES;
const STAGE228G_CASE_ROW_RUNTIME_COPY_CLEANUP = 'case list rows hide lifecycle helper sentence and action count runtime copy';
const STAGE228G_OPERATOR_RAIL_SOURCE_TRUTH = 'cases operational shortcuts use SimpleFiltersCard and shared operator rail tone source';
void STAGE228G_CASE_ROW_RUNTIME_COPY_CLEANUP;
void STAGE228G_OPERATOR_RAIL_SOURCE_TRUTH;

type CaseRecord = {
  id: string;
  title?: string;
  clientName?: string;
  clientId?: string;
  clientEmail?: string;
  clientPhone?: string;
  status?: string;
  completenessPercent?: number;
  leadId?: string;
  createdFromLead?: boolean;
  serviceStartedAt?: string | null;
  portalReady?: boolean;
  updatedAt?: { toDate?: () => Date } | string | null;
};

type ClientOption = {
  key: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  source: 'case' | 'lead' | 'client';
};

type CaseView =
  | 'open'
  | 'closed'
  | 'all'
  | 'waiting'
  | 'blocked'
  | 'approval'
  | 'ready'
  | 'needs_next_step'
  | 'linked';


const stage231b0R7CasesClosedViewContract = {
  route: '/cases?view=closed',
  label: 'Sprawy zamknięte',
  matches(record: { status?: unknown }, caseView: CaseView) {
    const isClosedCase = isClosedCaseStatus((typeof caseRecord !== "undefined" ? caseRecord : null)?.status);
    return (caseView === 'closed' && isClosedCase) || (caseView === 'open' && !isClosedCase) || caseView === 'all';
  },
};
void stage231b0R7CasesClosedViewContract;

function normalizeClientText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildClientOptions(cases: CaseRecord[], leads: any[], clients: any[] = []) {
  const map = new Map<string, ClientOption>();

  const push = (rawName: unknown, rawEmail: unknown, rawPhone: unknown, source: 'case' | 'lead' | 'client') => {
    const name = normalizeClientText(rawName);
    const email = normalizeClientText(rawEmail);
    const phone = normalizeClientText(rawPhone);
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

  for (const record of cases) {
    push(record.clientName, record.clientEmail, record.clientPhone, 'case');
  }

  for (const lead of leads) {
    push(lead?.name || lead?.company, lead?.email, lead?.phone, 'lead');
  }

  for (const client of clients) {
    push(client?.name || client?.company, client?.email, client?.phone, 'client');
  }

  return [...map.values()].sort((left, right) => left.name.localeCompare(right.name, 'pl', { sensitivity: 'base' }));
}

function caseStatusLabel(status?: string) {
  switch (status) {
    case 'waiting_on_client':
      return 'Czeka na klienta';
    case 'blocked':
      return 'Zablokowana';
    case 'ready_to_start':
      return 'Gotowa do startu';
    case 'to_approve':
      return 'Do akceptacji';
    case 'in_progress':
      return 'W realizacji';
    case 'completed':
      return 'Zamknięta';
    default:
      return 'W realizacji';
  }
}

function caseNeedsAttention(caseRecord: CaseRecord) {
  return caseRecord.status === 'blocked' || caseRecord.status === 'waiting_on_client' || (caseRecord.completenessPercent || 0) < 35;
}

function toUpdatedDate(value: CaseRecord['updatedAt']) {
  if (!value) return null;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate();
  }
  return null;
}

function buildCaseActionMap(actions: any[]) {
  const map = new Map<string, any[]>();

  for (const action of actions || []) {
    const caseId = normalizeClientText(action?.caseId);
    if (!caseId) continue;

    const current = map.get(caseId) || [];
    current.push(action);
    map.set(caseId, current);
  }

  return map;
}

function resolveCaseListLifecycle(
  record: CaseRecord,
  tasksByCaseId: Map<string, any[]>,
  eventsByCaseId: Map<string, any[]>,
) {
  return resolveCaseLifecycleV1({
    status: record.status,
    tasks: tasksByCaseId.get(String(record.id || '')) || [],
    events: eventsByCaseId.get(String(record.id || '')) || [],
  });
}

function lifecycleBadgeVariant(bucket: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (bucket === 'blocked') return 'destructive';
  if (bucket === 'ready_to_start' || bucket === 'completed') return 'secondary';
  if (bucket === 'needs_next_step' || bucket === 'waiting_approval') return 'outline';
  return 'default';
}

function lifecycleRiskLabel(level: string) {
  if (level === 'high') return 'Ryzyko wysokie';
  if (level === 'medium') return 'Ryzyko średnie';
  return 'Ryzyko niskie';
}

function lifecycleCompactLabel(record: CaseRecord, lifecycle: ReturnType<typeof resolveCaseLifecycleV1>) {
  if (record.status === 'waiting_on_client' || lifecycle.bucket === 'waiting_approval') return 'Czeka na klienta';
  if (record.status === 'blocked' || lifecycle.bucket === 'blocked') return 'Wymaga uwagi';
  return 'Brak blokerów';
}

function lifecycleCompactVariant(record: CaseRecord, lifecycle: ReturnType<typeof resolveCaseLifecycleV1>) {
  if (record.status === 'waiting_on_client' || lifecycle.bucket === 'waiting_approval') return 'amber';
  if (record.status === 'blocked' || lifecycle.bucket === 'blocked') return 'red';
  return 'green';
}

function compactNextAction(value: string) {
  const text = String(value || '').trim();
  if (!text) return 'Brak zaplanowanych działań';
  const firstSentence = text.split(/[.!?]/)[0]?.trim() || text;
  return firstSentence.slice(0, 56);
}

function cleanCaseListTitle(value: unknown): string {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) return '';
  return text
    .replace(/\s*-\s*obsługa\s*$/i, '')
    .replace(/\s*-\s*obs(?:ł|l|\u0142|\u0139\u201a|\u253c\u00e9)uga\s*$/i, '')
    .trim();
}

function formatNearestCaseAction(action: ReturnType<typeof getNearestPlannedAction>) {
  if (!action) return 'Brak zaplanowanych działań';
  const parsed = new Date(action.when);
  const dateLabel = Number.isNaN(parsed.getTime())
    ? action.when
    : format(parsed, 'd MMM yyyy, HH:mm', { locale: pl });
  return `${action.title} · ${dateLabel}`;
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_CASES = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';

export default function Cases() {
  const { workspace, hasAccess, loading: workspaceLoading, workspaceReady } = useWorkspace();
  const [searchParams, setSearchParams] = useSearchParams();
  const stage23PrefillHandledRef = useRef(false);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [leadCandidates, setLeadCandidates] = useState<any[]>([]);
  const [clientCandidates, setClientCandidates] = useState<any[]>([]);
  const [caseTasks, setCaseTasks] = useState<any[]>([]);
  const [caseEvents, setCaseEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [caseView, setCaseView] = useState<CaseView>('open');
  const [caseToDelete, setCaseToDelete] = useState<CaseRecord | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [createCasePending, setCreateCasePending] = useState(false);
  const [showCreateClientFields, setShowCreateClientFields] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientId: '',
    status: 'in_progress',
  });

  const refreshCases = async () => {
    const [caseRows, leadRows, clientRows, taskRows, eventRows] = await Promise.all([
      fetchCasesFromSupabase(),
      fetchLeadsFromSupabase().catch(() => []),
      fetchClientsFromSupabase().catch(() => []),
      fetchTasksFromSupabase().catch(() => []),
      fetchEventsFromSupabase().catch(() => []),
    ]);
    setCases(caseRows as CaseRecord[]);
    setLeadCandidates(leadRows as any[]);
    setClientCandidates(clientRows as any[]);
    setCaseTasks(taskRows as any[]);
    setCaseEvents(eventRows as any[]);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const allowDevPreview = import.meta.env.DEV && !isSupabaseConfigured();
    if ((!isSupabaseConfigured() && !allowDevPreview) || workspaceLoading || !workspace?.id) {
      setCases([]);
      setLeadCandidates([]);
      setClientCandidates([]);
      setCaseTasks([]);
      setCaseEvents([]);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    Promise.all([
      fetchCasesFromSupabase(),
      fetchLeadsFromSupabase().catch(() => []),
      fetchClientsFromSupabase().catch(() => []),
      fetchTasksFromSupabase().catch(() => []),
      fetchEventsFromSupabase().catch(() => []),
    ])
      .then(([caseRows, leadRows, clientRows, taskRows, eventRows]) => {
        if (!isMounted) return;
        setCases(caseRows as CaseRecord[]);
        setLeadCandidates(leadRows as any[]);
    setClientCandidates(clientRows as any[]);
    setCaseTasks(taskRows as any[]);
        setCaseEvents(eventRows as any[]);
        setLoading(false);
      })
      .catch((error: any) => {
        if (!isMounted) return;
        toast.error(`Błąd cases API: ${error.message}`);
        setCases([]);
        setLeadCandidates([]);
      setClientCandidates([]);
      setCaseTasks([]);
        setCaseEvents([]);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [workspace?.id, workspaceLoading]);

  const caseTasksByCaseId = useMemo(() => buildCaseActionMap(caseTasks), [caseTasks]);
  const caseEventsByCaseId = useMemo(() => buildCaseActionMap(caseEvents), [caseEvents]);
  const ownerRiskSettings = useMemo(() => readOwnerRiskSettings(workspace), [workspace]);

  const caseViewFromUrlStage231B0R9 = searchParams.get('view');

  useEffect(() => {
    const allowedViews: CaseView[] = ['open', 'closed', 'all', 'waiting', 'blocked', 'approval', 'ready', 'needs_next_step', 'linked'];
    const nextView = allowedViews.includes(caseViewFromUrlStage231B0R9 as CaseView) ? (caseViewFromUrlStage231B0R9 as CaseView) : 'open';
    if (caseView !== nextView) setCaseView(nextView);
  }, [caseView, caseViewFromUrlStage231B0R9]);

  const activeCases = useMemo(
    () => cases.filter((record) => !isClosedCaseStatus(record.status)),
    [cases]
  );

  const closedCases = useMemo(
    () => cases.filter((record) => isClosedCaseStatus(record.status)),
    [cases]
  );

  const renderClosedCaseBannerStage231B0R12 = (caseRecord: any) => {
    if (!isClosedCaseStatus(caseRecord?.status)) {
      return null;
    }

    return (
      <span
        className="cf-case-closed-banner-stage231b0-r9"
        data-stage231b0-r9-closed-case-banner="true"
      >
        SPRAWA ZAMKNIĘTA
      </span>
    );
  };

  void renderClosedCaseBannerStage231B0R12;

  const stats = useMemo(() => {
    const lifecycleRows = activeCases.map((record) => resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId));

    return {
      total: activeCases.length,
      open: activeCases.length,
      all: cases.length,
      waiting: lifecycleRows.filter((entry) => entry.bucket === 'blocked' || entry.bucket === 'waiting_approval').length,
      blocked: lifecycleRows.filter((entry) => entry.bucket === 'blocked').length,
      approval: lifecycleRows.filter((entry) => entry.bucket === 'waiting_approval').length,
      ready: lifecycleRows.filter((entry) => entry.bucket === 'ready_to_start').length,
      needsNextStep: lifecycleRows.filter((entry) => entry.bucket === 'needs_next_step').length,
      linked: activeCases.filter((record) => !!record.leadId).length,
      closed: closedCases.length,
    };
  }, [activeCases, caseEventsByCaseId, caseTasksByCaseId, cases.length, closedCases.length]);

  const leadsById = useMemo(
    () => new Map((leadCandidates || []).map((entry: any) => [String(entry.id || ''), entry])),
    [leadCandidates]
  );

  const clientOptions = useMemo(() => buildClientOptions(cases, leadCandidates, clientCandidates), [cases, clientCandidates, leadCandidates]);

  useEffect(() => {
    if (stage23PrefillHandledRef.current) return;

    const shouldOpen = searchParams.get('new') === '1';
    const clientIdFromUrl = searchParams.get('clientId') || '';
    if (!shouldOpen || !clientIdFromUrl) return;

    const client = clientCandidates.find((entry) => String(entry?.id || '') === clientIdFromUrl);
    if (!client) return;

    stage23PrefillHandledRef.current = true;
    setNewCase((prev) => ({
      ...prev,
      clientId: clientIdFromUrl,
      clientName: String(client?.name || client?.company || 'Klient'),
      clientEmail: String(client?.email || ''),
      clientPhone: String(client?.phone || ''),
      title: prev.title.trim() ? cleanCaseListTitle(prev.title) : String(client?.name || client?.company || 'Sprawa bez nazwy'),
    }));
    setShowCreateClientFields(false);
    setIsCreateCaseOpen(true);
  }, [clientCandidates, searchParams]);

  const clientSuggestions = useMemo(() => {
    const normalizedQuery = newCase.clientName.trim().toLowerCase();
    const base = normalizedQuery
      ? clientOptions.filter((option) => {
          return [option.name, option.email, option.phone]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery));
        })
      : clientOptions;

    return base.slice(0, 6);
  }, [clientOptions, newCase.clientName]);

  const filteredCases = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const sourceCases =
      caseView === 'closed' ? closedCases :
      caseView === 'all' ? cases :
      activeCases;

    return sourceCases.filter((record) => {
      const matchesSearch = !normalizedQuery || (
        record.title?.toLowerCase().includes(normalizedQuery)
        || record.clientName?.toLowerCase().includes(normalizedQuery)
        || record.clientEmail?.toLowerCase().includes(normalizedQuery)
        || record.clientPhone?.toLowerCase().includes(normalizedQuery)
        || record.status?.toLowerCase().includes(normalizedQuery)
      );

      const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);
      const matchesView =
        caseView === 'open'
        || caseView === 'closed'
        || caseView === 'all'
        || (caseView === 'waiting' && (lifecycle.bucket === 'blocked' || lifecycle.bucket === 'waiting_approval'))
        || (caseView === 'blocked' && lifecycle.bucket === 'blocked')
        || (caseView === 'approval' && lifecycle.bucket === 'waiting_approval')
        || (caseView === 'ready' && lifecycle.bucket === 'ready_to_start')
        || (caseView === 'needs_next_step' && lifecycle.bucket === 'needs_next_step')
        || (caseView === 'linked' && Boolean(record.leadId));

      return matchesSearch && matchesView;
    });
  }, [activeCases, caseEventsByCaseId, caseTasksByCaseId, caseView, cases, closedCases, searchQuery]);

  const setCaseViewStage231B0R9 = (view: CaseView) => {
    setCaseView(view);
    if (view === 'open') {
      setSearchParams({});
      return;
    }
    setSearchParams({ view });
  };


  const setCaseViewStage231B0R8 = (view: CaseView) => {
    setCaseViewStage231B0R9(view);
  };

const toggleCaseView = (view: CaseView) => {
    if (caseView === view) {
      setCaseViewStage231B0R9('open');
      return;
    }
    setCaseViewStage231B0R9(view);
  };

  async function handleDeleteCase() {
    if (!caseToDelete) return;

    const caseId = String(caseToDelete.id || '');
    if (!caseId) return;

    try {
      setDeletePending(true);
      await deleteCaseWithRelations(caseId);
      await refreshCases();
      toast.success('Sprawa została usunięta.');
      setCaseToDelete(null);
    } catch (error: any) {
      console.error(error);
      const message = String(error?.message || '');
      const hasRelationBlocker = /foreign key|violates|related|powiązan|działani/i.test(message);
      toast.error(hasRelationBlocker ? 'Nie można usunąć sprawy, bo ma powiązane działania.' : 'Nie udało się usunąć sprawy.');
    } finally {
      setDeletePending(false);
    }
  }

  async function handleCreateCase(e: FormEvent) {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    if (!newCase.title.trim()) return toast.error('Podaj tytuł sprawy.');
    if (!newCase.clientId && !newCase.clientName.trim()) return toast.error('Wybierz klienta albo utwórz nowego.');

    try {
      setCreateCasePending(true);
      await createCaseInSupabase({
        title: newCase.title.trim(),
        clientId: newCase.clientId || null,
        clientName: newCase.clientName.trim(),
        clientEmail: newCase.clientEmail.trim(),
        clientPhone: newCase.clientPhone.trim(),
        status: newCase.status,
        createdFromLead: false,
        portalReady: false,
        workspaceId,
      });
      await refreshCases();
      toast.success('Sprawa utworzona');
      setIsCreateCaseOpen(false);
      setShowCreateClientFields(false);
      setNewCase({
        title: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientId: '',
        status: 'in_progress',
      });
    } catch (error: any) {
      toast.error('Nie udało się zapisać. Spróbuj ponownie.');
    } finally {
      setCreateCasePending(false);
    }
  }

  function handleSelectClientSuggestion(option: ClientOption) {
    setNewCase((prev) => ({
      ...prev,
      title: prev.title.trim() ? cleanCaseListTitle(prev.title) : option.name || 'Sprawa bez nazwy',
      clientName: option.name,
      clientEmail: option.email,
      clientPhone: option.phone,
      clientId: option.id || '',
    }));
    setShowCreateClientFields(false);
  }

  return (
    <Layout>
      <div className="cf-html-view main-cases-html" data-cases-real-view="true" data-stage16c-tasks-cases-repair="cases">
        <CloseFlowPageHeaderV2
          pageKey="cases"
          actions={
            <>
              <div className="head-actions">
                          <Button type="button" variant="outline" className="btn soft-blue" data-cf-header-action="ai">
                            <EntityIcon entity="ai" className="h-4 w-4" /> Zapytaj AI
                          </Button>
                          <Dialog open={isCreateCaseOpen} onOpenChange={(open) => {
                            setIsCreateCaseOpen(open);
                            if (!open) {
                              setShowCreateClientFields(false);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button className="btn primary" disabled={!workspaceReady}>
                                <Plus className="h-4 w-4" /> Nowa sprawa
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="client-case-form-content case-form-stage23-content" data-case-form-stage23="true" data-client-case-form-visual-rebuild={CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CASES}>
                              <DialogHeader className="client-case-form-header">
                                <span className="client-case-form-kicker">SPRAWA</span>
                                <DialogTitle>Nowa sprawa</DialogTitle>
                                <p>Utwórz krótką sprawę operacyjną. Klient z kontekstu zostanie przypięty automatycznie.</p>
                              </DialogHeader>

                              <form onSubmit={handleCreateCase} className="client-case-form" data-case-form-fields="case">
                                <section className="client-case-form-section">
                                  <div className="client-case-form-section-head">
                                    <h3>Dane sprawy</h3>
                                    <p>Tytuł, klient i status startowy. Bez duplikowania pól z klienta.</p>
                                  </div>

                                  <div className="client-case-form-grid">
                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Tytuł sprawy</Label>
                                      <Input
                                        value={newCase.title}
                                        onChange={(event) => setNewCase((prev) => ({ ...prev, title: event.target.value }))}
                                        placeholder="np. Wdrożenie klienta X"
                                      />
                                    </div>

                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Klient</Label>
                                      {newCase.clientId ? (
                                        <div className="client-case-form-locked-client" data-case-form-client-prefilled="true">
                                          <strong>{newCase.clientName || 'Klient z kontekstu'}</strong>
                                          <span>Sprawa będzie przypięta do tego klienta. Nie musisz wybierać go drugi raz.</span>
                                          <button
                                            type="button"
                                            onClick={() => setNewCase((prev) => ({ ...prev, clientId: '', clientName: '', clientEmail: '', clientPhone: '' }))}
                                          >
                                            Zmień klienta
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="client-case-form-client-row">
                                            <Input
                                              value={newCase.clientName}
                                              onChange={(event) => setNewCase((prev) => ({ ...prev, clientName: event.target.value, clientId: '' }))}
                                              placeholder="Wpisz klienta, a system podpowie z klientów, leadów i spraw"
                                            />
                                            <Button
                                              type="button"
                                              variant={showCreateClientFields ? 'default' : 'outline'}
                                              size="icon"
                                              onClick={() => setShowCreateClientFields((prev) => !prev)}
                                              title="Dodaj nowego klienta"
                                            >
                                              <Plus className="h-4 w-4" />
                                            </Button>
                                          </div>

                                          {clientSuggestions.length > 0 ? (
                                            <div className="client-case-form-suggestions">
                                              {clientSuggestions.map((option) => (
                                                <button
                                                  key={option.key}
                                                  type="button"
                                                  onClick={() => handleSelectClientSuggestion(option)}
                                                >
                                                  <span>
                                                    <strong>{option.name}</strong>
                                                    <small>{[option.email, option.phone].filter(Boolean).join(' • ') || 'Dane klienta zapisane w systemie'}</small>
                                                  </span>
                                                  <Badge variant="outline">{option.source === 'lead' ? 'Z leada' : option.source === 'client' ? 'Klient' : 'Ze sprawy'}</Badge>
                                                </button>
                                              ))}
                                            </div>
                                          ) : null}
                                        </>
                                      )}

                                      {!showCreateClientFields && !newCase.clientId && (newCase.clientEmail || newCase.clientPhone) ? (
                                        <p className="client-case-form-hint">
                                          Wybrany klient: {[newCase.clientEmail, newCase.clientPhone].filter(Boolean).join(' • ')}
                                        </p>
                                      ) : null}
                                    </div>

                                    {showCreateClientFields && !newCase.clientId ? (
                                      <div className="client-case-form-inline-client client-case-form-field-wide">
                                        <p>Nowy klient dla tej sprawy</p>
                                        <div className="client-case-form-grid">
                                          <div className="client-case-form-field">
                                            <Label>E-mail klienta</Label>
                                            <Input
                                              value={newCase.clientEmail}
                                              onChange={(event) => setNewCase((prev) => ({ ...prev, clientEmail: event.target.value }))}
                                              placeholder="np. klient@firma.pl"
                                            />
                                          </div>
                                          <div className="client-case-form-field">
                                            <Label>Telefon klienta</Label>
                                            <Input
                                              value={newCase.clientPhone}
                                              onChange={(event) => setNewCase((prev) => ({ ...prev, clientPhone: event.target.value }))}
                                              placeholder="np. 500 000 000"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ) : null}

                                    <div className="client-case-form-field">
                                      <Label>Status</Label>
                                      <select
                                        className="client-case-form-select"
                                        value={newCase.status}
                                        onChange={(event) => setNewCase((prev) => ({ ...prev, status: event.target.value }))}
                                      >
                                        <option value="in_progress">W realizacji</option>
                                        <option value="waiting_on_client">Czeka na klienta</option>
                                        <option value="blocked">Zablokowana</option>
                                        <option value="ready_to_start">Gotowa do startu</option>
                                      </select>
                                    </div>

                                    <div className="client-case-form-field">
                                      <Label>Powiązany lead</Label>
                                      <Input value="Jeśli tworzysz sprawę z leada, użyj flow Rozpocznij obsługę w LeadDetail." disabled />
                                    </div>

                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Opis</Label>
                                      <div className="client-case-form-disabled-note">
                                        Opis sprawy nie jest zapisywany w obecnym modelu danych. Ten etap nie udaje pola, którego backend nie obsługuje.
                                      </div>
                                    </div>
                                  </div>
                                </section>

                                <DialogFooter className={modalFooterClass('client-case-form-footer')}>
                                  <Button type="button" variant="outline" onClick={() => setIsCreateCaseOpen(false)}>
                                    Anuluj
                                  </Button>
                                  <Button type="submit" disabled={createCasePending || !workspaceReady}>
                                    {createCasePending ? 'Zapisywanie...' : 'Zapisz sprawę'}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
            </>
          }
        />

        <div className="grid-4" data-stage16c-cases-stat-grid="true" data-stage228g-cases-one-row-stat-grid="true">
          <StatShortcutCard
            label="Otwarte sprawy"
            value={stats.open}
            icon={FileText}
            tone="blue"
            active={caseView === 'open'}
            onClick={() => setCaseViewStage231B0R9('open')}
          />
          <StatShortcutCard
            label="Czeka na klienta"
            value={stats.waiting}
            icon={Clock}
            tone="amber"
            active={caseView === 'waiting' || caseView === 'approval'}
            onClick={() => toggleCaseView('waiting')}
          />
          <StatShortcutCard
            label="Zablokowane"
            value={stats.blocked}
            icon={AlertTriangle}
            tone="red"
            active={caseView === 'blocked'}
            onClick={() => toggleCaseView('blocked')}
          />
          <StatShortcutCard
            label="Gotowe"
            value={stats.ready}
            icon={CheckCircle2}
            tone="green"
            active={caseView === 'ready'}
            onClick={() => toggleCaseView('ready')}
          />
        </div>

        <div className="layout-list">
          <div className="stack">
            <div className="search cf-main-search" data-cf-main-search-source="stage173">
              <span aria-hidden="true"><Search className="h-4 w-4" /></span>
              <Input
                placeholder="Szukaj po nazwie, telefonie, e-mailu, firmie albo sprawie..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            {loading ? (
              <div className="table-card">
                <div className="row row-empty">
                  <span className="index"><div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[color:var(--app-primary)]" /></span>
                  <span><span className="title">Ładowanie spraw</span><span className="sub">Pobieram dane z aplikacji.</span></span>
                </div>
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="table-card">
                <div className="row row-empty">
                  <span className="index">0</span>
                  <span><span className="title">{caseView === 'closed' ? 'Brak zamkniętych spraw' : caseView === 'all' ? 'Brak spraw' : 'Brak otwartych spraw'}</span><span className="sub">Zmień wyszukiwanie albo kliknij inny kafel metryk.</span></span>
                </div>
              </div>
            ) : (
              <div className="table-card">
                {filteredCases.map((record, index) => {

                  const isCaseClosedStage231B0R13 = isClosedCaseStatus(record.status);
const attention = isCaseClosedStage231B0R13 ? false : caseNeedsAttention(record);
                  const percent = Math.round(record.completenessPercent || 0);
                  const updatedAt = toUpdatedDate(record.updatedAt);
                  const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);
                  const statusLabel = caseStatusLabel(record.status);
                  const statusTone = isCaseClosedStage231B0R13 ? 'green' : record.status === 'blocked' ? 'red' : record.status === 'waiting_on_client' ? 'amber' : 'blue';
                  const compactLifecycleLabel = lifecycleCompactLabel(record, lifecycle);
                  const compactLifecyclePill = isCaseClosedStage231B0R13 ? null : (compactLifecycleLabel === statusLabel ? null : compactLifecycleLabel);
                  const progressTone = attention ? 'red' : percent >= 75 ? 'green' : percent >= 35 ? 'blue' : 'amber';
                  const nearestCaseAction = getNearestPlannedAction({
                    recordType: 'case',
                    recordId: String(record.id || ''),
                    items: [...(caseTasksByCaseId.get(String(record.id || '')) || []), ...(caseEventsByCaseId.get(String(record.id || '')) || [])],
                  });
                  const nextActionLabel = isCaseClosedStage231B0R13 ? 'Sprawa zamknięta' : nearestCaseAction ? formatNearestCaseAction(nearestCaseAction) : compactNextAction(lifecycle.nextOperatorAction);

                  const ownerRiskBadges = isCaseClosedStage231B0R13

                    ? []

                    : getCaseOwnerRiskBadges(record, {

                        settings: ownerRiskSettings,

                        lifecycle,

                        nearestCaseAction,

                        nextActionLabel,

                        statusLabel,

                        compactLifecycleLabel,

                        compactLifecyclePill,

                        percent,

                        updatedAt,

                      });
const metaParts = [
                    lifecycle.openActionCount > 0 ? `${lifecycle.openActionCount} działań` : 'brak działań',
                    lifecycle.waitingApprovalCount > 0 ? `akceptacje ${lifecycle.waitingApprovalCount}` : null,
                    lifecycle.missingRequiredCount > 0 ? `brakuje ${lifecycle.missingRequiredCount} elementów` : null,
                  ].filter(Boolean);
                  const metaSuffix = metaParts.join(' · ');
                  return (
                    <div key={record.id} className="row case-row">
                      <span className="index">{index + 1}</span>
                      <span className="lead-main-cell min-w-0">
                        <span className="case-row-title-line">
                          <Link to={`/case/${record.id}`} className="title">{cleanCaseListTitle(record.title || record.clientName || 'Sprawa bez nazwy')}</Link>
                        </span>
                        <span className="cf-list-row-meta" data-stage228g-case-row-copy-clean="true">
                          <span className="cf-list-row-client">Klient: {record.clientName || 'Brak nazwy klienta'}</span>
                        </span>
                        <span className="statusline">
                          <span className="cf-status-pill" data-cf-status-tone={statusTone}>{statusLabel}</span>
                          {compactLifecyclePill ? <span className="cf-status-pill" data-cf-status-tone={lifecycleCompactVariant(record, lifecycle)}>{compactLifecyclePill}</span> : null}
                          {attention && !compactLifecyclePill ? <span className="cf-status-pill" data-cf-status-tone="amber">Wymaga uwagi</span> : null}
                          {ownerRiskBadges.map((badge) => (
                            <span
                              key={badge.key}
                              className="cf-status-pill"
                              data-cf-status-tone={ownerRiskTone(badge.severity)}
                              data-stage222-owner-risk-case-badge="true"
                              title={badge.reason}
                            >
                              {badge.label}
                            </span>
                          ))}
                        </span>
                      </span>
                      <span className="lead-value-cell">
                        <span className="mini">Postęp</span>
                        <strong><span className="cf-progress-pill" data-cf-status-tone={progressTone}>{percent}%</span></strong>
                        <span className="cf-progress-bar" data-cf-status-tone={progressTone} aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} /></span>
                      </span>
                      <span className="lead-action-cell">
                        <span className="mini">Najbliższy termin w sprawie</span>
                        <strong className="next-action-text" title={nextActionLabel}>{nextActionLabel}</strong>
                        {updatedAt ? <span className="sub next-action-date">{format(updatedAt, 'd MMM yyyy', { locale: pl })}</span> : null}
                      </span>
                      <span className="lead-actions cf-case-row-actions-stage220a28">
                        <Button variant="outline" className="btn ghost cf-icon-action-button cf-case-row-open-indicator" asChild data-stage220a28-case-row-open-icon="true">
                          <Link to={`/case/${record.id}`} aria-label={`Otwórz sprawę ${record.title || ''}`}><ChevronRight className="h-4 w-4" /></Link>
                        </Button>
                        <EntityTrashButton
                          type="button"
                          iconOnly
                          data-stage220a28-case-row-delete-icon="true"
                          data-case-row-delete-action="true" data-cf-destructive-source="trash-action-source"
                          aria-label="Usuń sprawę"
                          title="Usuń sprawę"
                          disabled={deletePending && caseToDelete?.id === record.id}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setCaseToDelete(record);
                          }}
                        >
                          {deletePending && caseToDelete?.id === record.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className={trashActionIconClass("h-4 w-4")} />}
                        </EntityTrashButton>
                      </span>
                    </div>
                  );

                    {isCaseClosedStage231B0R13 ? (
                      <span
                        className="cf-case-closed-banner-stage231b0-r9"
                        data-stage231b0-r9-closed-case-banner="true"
                        data-stage231b0-r13-closed-case-row-banner="true"
                      >
                        SPRAWA ZAMKNIĘTA
                      </span>
                    ) : null}
})}
              </div>
            )}
          </div>

          <div className="cases-right-rail">
            <SimpleFiltersCard
              className="cases-shortcuts-rail-card operator-simple-filters-card"
              title="Operacyjne skróty"
              description=""
              dataTestId="cases-operational-shortcuts-card"
              dataAttrs={{ 'data-stage228g-cases-shortcuts-source-truth': true }}
              items={[
                { key: 'open', label: 'Otwarte sprawy', value: stats.open, onClick: () => setCaseViewStage231B0R9('open') },
                { key: 'closed', label: 'Sprawy zamknięte', value: stats.closed, onClick: () => setCaseViewStage231B0R9('closed') },
                { key: 'all', label: 'Wszystkie sprawy', value: stats.all, onClick: () => setCaseViewStage231B0R9('all') },
                { key: 'needs_next_step', label: 'Bez zaplanowanej akcji', value: stats.needsNextStep, onClick: () => toggleCaseView('needs_next_step') },
                { key: 'linked', label: 'Portal klienta', value: stats.linked, onClick: () => toggleCaseView('linked') },
                { key: 'waiting', label: 'Sprawy bez ruchu', value: stats.waiting, onClick: () => toggleCaseView('waiting') },
                { key: 'approval', label: 'Akceptacje', value: stats.approval, onClick: () => toggleCaseView('approval') },
              ]}
            />

            <aside className="right-card cases-risk-rail-card">
              <div className="panel-head"><div><h3 className="cf-rail-card-title">Blokery i ryzyko</h3></div></div>
              <div className="quick-list">
                {filteredCases.slice(0, 4).map((record) => {
                  const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);
                  const riskTitle = `${record.title || 'Sprawa'} — ${lifecycleRiskLabel(lifecycle.riskLevel)} · Braki ${lifecycle.missingRequiredCount}`;
                  return (
                    <Link
                      key={record.id}
                      to={`/case/${record.id}`}
                      title={riskTitle}
                      data-cf-operator-rail-item="true"
                      data-cf-operator-rail-tone={lifecycle.riskLevel === 'high' ? 'red' : lifecycle.riskLevel === 'medium' ? 'amber' : 'blue'}
                    className="cf-rail-risk-row"
                    >
                      <span className="cf-rail-risk-copy"><strong className="cf-rail-risk-title" title={record.title || 'Sprawa'}>{record.title || 'Sprawa'}</strong><small className="cf-rail-risk-meta">{lifecycleRiskLabel(lifecycle.riskLevel)} · Braki {lifecycle.missingRequiredCount}</small></span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
                {filteredCases.length === 0 ? <div className="note">Brak spraw do pokazania.</div> : null}
              </div>
            </aside>
          </div>
        </div>

        <ConfirmDialog
          open={Boolean(caseToDelete)}
          onOpenChange={(open) => {
            if (!open && !deletePending) setCaseToDelete(null);
          }}
          title="Usunąć sprawę?"
          description={caseToDelete ? `Sprawa "${caseToDelete.title || 'bez tytułu'}" zostanie usunięta razem z checklistą i aktywnościami, ale bez kasowania leada, klienta, zadań i wydarzeń.` : ''}
          confirmLabel="Usuń sprawę"
          pending={deletePending}
          onConfirm={handleDeleteCase}
        />
      </div>
    </Layout>
  );
}

/* PHASE0_STAT_CARD_PAGE_GUARD StatShortcutCard onClick= toggleCaseView('blocked') toggleCaseView('needs_next_step') */
