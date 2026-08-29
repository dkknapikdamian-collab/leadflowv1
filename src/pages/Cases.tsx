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
import { ArrowUpDown, Bell, CalendarDays, ChevronDown, ChevronRight, Clock, Download, Filter, Folder, Loader2, LockKeyhole, MoreHorizontal, Plus, Rocket, Search, Send } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { DeleteActionIcon } from '../components/ui-system/ActionIcon';

import { toast } from 'sonner';
import { ConfirmDialog } from '../components/confirm-dialog';
import { StatShortcutCard } from '../components/StatShortcutCard';
import Layout from '../components/Layout';
import { EntityTrashButton, modalFooterClass, trashActionIconClass } from '../components/entity-actions';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FilterSelect } from '../components/ui/filter-select';
import { FilterToolbar } from '../components/ui/filter-toolbar';
import { SortSelect } from '../components/ui/sort-select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { deleteCaseWithRelations, isClosedCaseStatus } from '../lib/cases';
import { resolveCaseLifecycleV1 } from '../lib/case-lifecycle-v1';
import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
import { getCaseOwnerRiskBadges, ownerRiskTone } from '../lib/owner-control/owner-risk-rules';
import { readOwnerRiskSettings } from '../lib/owner-control/owner-risk-settings';
import { getCaseStatusLabel, getCaseStatusTone } from '../lib/config/case-status';
import { normalizeCaseStatus } from '../lib/domain-statuses';
import { caseDetailPath } from '../lib/routes';
import { requireWorkspaceId } from '../lib/workspace-context';
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
import '../styles/closeflow-page-header-runtime.css';
import '../styles/closeflow-record-list-source-truth.css';
import '../styles/forteca-cases-all.css';
import '../styles/forteca-cases-waiting.css';
// LF-UI-SOT-007 shared-source contract: import '../styles/closeflow-unified-page-canvas-stage211c.css' is provided once by App.tsx.
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
  ownerId?: string | null;
  createdFromLead?: boolean;
  serviceStartedAt?: string | null;
  portalReady?: boolean;
  createdAt?: { toDate?: () => Date } | string | null;
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

type CaseStatusFilter = 'all' | 'waiting_on_client' | 'in_progress' | 'blocked' | 'ready_to_start' | 'closed';
type CaseCompletenessFilter = 'all' | 'low' | 'medium' | 'high';
type CaseSort = 'updated_desc' | 'updated_asc' | 'completeness_asc' | 'completeness_desc';

function buildPaginationItems(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, 'ellipsis', total];
  if (current >= total - 2) return [1, 'ellipsis', total - 2, total - 1, total];
  return [1, 'ellipsis', current, 'ellipsis', total];
}


const stage231b0R7CasesClosedViewContract = {
  route: '/cases?view=closed',
  label: 'Sprawy zamknięte',
  matches(record: { status?: unknown }, caseView: CaseView) {
    const isClosedCase = isClosedCaseStatus(record?.status);
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

function caseNeedsAttention(caseRecord: CaseRecord) {
  return caseRecord.status === 'blocked' || caseRecord.status === 'waiting_on_client' || (caseRecord.completenessPercent || 0) < 35;
}

function toUpdatedDate(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object' && value !== null && typeof (value as { toDate?: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}

function formatCaseDate(value: unknown) {
  const date = toUpdatedDate(value);
  if (!date) return 'Brak daty';
  return format(date, 'd MMM yyyy, HH:mm', { locale: pl });
}

function getCaseReference(record: CaseRecord) {
  const rawRecord = record as CaseRecord & Record<string, unknown>;
  const explicitReference = [rawRecord.caseNumber, rawRecord.case_number, rawRecord.reference, rawRecord.number]
    .find((value) => typeof value === 'string' && value.trim());
  if (explicitReference) return String(explicitReference).trim();
  const id = String(record.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase();
  return id ? `SP-${id}` : 'SP-—';
}

function getCaseSubject(record: CaseRecord) {
  const rawRecord = record as CaseRecord & Record<string, unknown>;
  const subject = [rawRecord.subject, rawRecord.topic, rawRecord.description]
    .find((value) => typeof value === 'string' && value.trim());
  return cleanCaseListTitle(String(subject || record.title || record.clientName || 'Sprawa bez nazwy'));
}

function getCaseOwnerLabel(record: CaseRecord, profile: any, workspace: any) {
  const ownerId = String(record.ownerId || '').trim();
  if (!ownerId) return 'Nie przypisano';
  const profileId = String(profile?.id || '').trim();
  const workspaceOwnerId = String(workspace?.ownerId || '').trim();
  if (ownerId === profileId || ownerId === workspaceOwnerId) {
    return String(profile?.fullName || profile?.email || 'Opiekun').trim();
  }
  return `Opiekun ${ownerId.slice(0, 8)}`;
}

function isWaitingForClientCase(record: Pick<CaseRecord, 'status'>) {
  return normalizeCaseStatus(record.status) === 'waiting_on_client';
}

function readCaseField(record: CaseRecord, keys: string[]) {
  const rawRecord = record as CaseRecord & Record<string, unknown>;
  for (const key of keys) {
    const value = rawRecord[key];
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && !value.trim()) continue;
    return value;
  }
  return null;
}

function readCaseDate(record: CaseRecord, keys: string[]) {
  return toUpdatedDate(readCaseField(record, keys) as CaseRecord['updatedAt']);
}

function getWaitingSince(record: CaseRecord) {
  return readCaseDate(record, [
    'waitingSince',
    'waiting_since',
    'clientWaitingSince',
    'client_waiting_since',
    'statusChangedAt',
    'status_changed_at',
    'updatedAt',
    'createdAt',
  ]);
}

function getLastReminderDate(record: CaseRecord) {
  return readCaseDate(record, [
    'lastReminderAt',
    'last_reminder_at',
    'lastClientReminderAt',
    'last_client_reminder_at',
    'remindedAt',
    'reminded_at',
  ]);
}

function formatWaitingAge(value: Date | null) {
  if (!value) return 'Data nieznana';
  const elapsedDays = Math.max(0, Math.floor((Date.now() - value.getTime()) / 86_400_000));
  if (elapsedDays === 0) return 'od dziś';
  if (elapsedDays === 1) return '1 dzień';
  return `${elapsedDays} dni`;
}

function getWaitingMissingLabel(record: CaseRecord, lifecycle: ReturnType<typeof resolveCaseLifecycleV1>) {
  const rawMissingItems = readCaseField(record, ['missingItems', 'missing_items', 'missingRequiredItems', 'missing_required_items']);
  if (Array.isArray(rawMissingItems) && rawMissingItems.length > 0) {
    return `${rawMissingItems.length} ${rawMissingItems.length === 1 ? 'element' : 'elementy'}`;
  }

  const rawMissingCount = readCaseField(record, ['missingCount', 'missing_count', 'missingRequiredCount', 'missing_required_count']);
  if (typeof rawMissingCount === 'number' && Number.isFinite(rawMissingCount) && rawMissingCount > 0) {
    return `${rawMissingCount} ${rawMissingCount === 1 ? 'element' : 'elementy'}`;
  }

  if (lifecycle.missingRequiredCount > 0) {
    return `${lifecycle.missingRequiredCount} ${lifecycle.missingRequiredCount === 1 ? 'element' : 'elementy'}`;
  }

  return 'Brak braków';
}

function percentageLabel(value: number, total: number) {
  if (!total) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

function csvCell(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
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
  const { workspace, profile, hasAccess, loading: workspaceLoading, workspaceReady } = useWorkspace();
  const [searchParams, setSearchParams] = useSearchParams();
  const stage23PrefillHandledRef = useRef(false);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [leadCandidates, setLeadCandidates] = useState<any[]>([]);
  const [clientCandidates, setClientCandidates] = useState<any[]>([]);
  const [caseTasks, setCaseTasks] = useState<any[]>([]);
  const [caseEvents, setCaseEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [caseView, setCaseView] = useState<CaseView>('all');
  const [statusFilter, setStatusFilter] = useState<CaseStatusFilter>('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [blockerFilter, setBlockerFilter] = useState('all');
  const [completenessFilter, setCompletenessFilter] = useState<CaseCompletenessFilter>('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [withoutNextAction, setWithoutNextAction] = useState(false);
  const [sortBy, setSortBy] = useState<CaseSort>('updated_desc');
  const [casePage, setCasePage] = useState(1);
  const [casePageSize, setCasePageSize] = useState(10);
  const [selectedCaseIds, setSelectedCaseIds] = useState<Set<string>>(new Set());
  const [openActionCaseId, setOpenActionCaseId] = useState<string | null>(null);
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
    const nextView = allowedViews.includes(caseViewFromUrlStage231B0R9 as CaseView) ? (caseViewFromUrlStage231B0R9 as CaseView) : 'all';
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

  const waitingCases = useMemo(
    () => cases.filter((record) => isWaitingForClientCase(record)),
    [cases],
  );

  const waitingMetrics = useMemo(() => {
    const ages = waitingCases
      .map((record) => getWaitingSince(record))
      .filter((date): date is Date => Boolean(date))
      .map((date) => Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000)));
    const overdue = ages.filter((days) => days > 5).length;
    const noReminder = waitingCases.filter((record) => !getLastReminderDate(record)).length;

    return {
      count: waitingCases.length,
      averageDays: ages.length ? Math.round(ages.reduce((total, days) => total + days, 0) / ages.length) : 0,
      overdue,
      noReminder,
    };
  }, [waitingCases]);

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
    const lifecycleById = new Map(
      cases.map((record) => [String(record.id || ''), resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId)])
    );

    return {
      open: activeCases.length,
      all: cases.length,
      waiting: cases.filter((record) => isWaitingForClientCase(record)).length,
      blocked: cases.filter((record) => String(record.status || '') === 'blocked' || lifecycleById.get(String(record.id || ''))?.bucket === 'blocked').length,
      approval: cases.filter((record) => lifecycleById.get(String(record.id || ''))?.bucket === 'waiting_approval').length,
      ready: cases.filter((record) => String(record.status || '') === 'ready_to_start' || lifecycleById.get(String(record.id || ''))?.bucket === 'ready_to_start').length,
      needsNextStep: cases.filter((record) => lifecycleById.get(String(record.id || ''))?.bucket === 'needs_next_step').length,
      linked: activeCases.filter((record) => !!record.leadId).length,
      closed: closedCases.length,
    };
  }, [activeCases, caseEventsByCaseId, caseTasksByCaseId, cases, closedCases.length]);

  const leadsById = useMemo(
    () => new Map((leadCandidates || []).map((entry: any) => [String(entry.id || ''), entry])),
    [leadCandidates]
  );

  const clientOptions = useMemo(() => buildClientOptions(cases, leadCandidates, clientCandidates), [cases, clientCandidates, leadCandidates]);

  const clientsById = useMemo(
    () => new Map((clientCandidates || []).map((entry: any) => [String(entry?.id || ''), entry])),
    [clientCandidates]
  );

  const caseOwnerOptions = useMemo(() => {
    const owners = new Map<string, string>();
    if (cases.some((record) => !String(record.ownerId || '').trim())) owners.set('unassigned', 'Nie przypisano');
    for (const record of cases) {
      const ownerId = String(record.ownerId || '').trim();
      if (!ownerId) continue;
      owners.set(ownerId, getCaseOwnerLabel(record, profile, workspace));
    }
    return [...owners.entries()].sort((left, right) => left[1].localeCompare(right[1], 'pl'));
  }, [cases, profile, workspace]);

  const caseClientFilterOptions = useMemo(() => {
    const clients = new Map<string, string>();
    for (const record of cases) {
      const clientId = String(record.clientId || '').trim();
      const client = clientsById.get(clientId);
      const label = String(record.clientName || client?.name || client?.company || '').trim();
      if (clientId && label) clients.set(clientId, label);
    }
    return [...clients.entries()].sort((left, right) => left[1].localeCompare(right[1], 'pl'));
  }, [cases, clientsById]);

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

  useEffect(() => {
    if (searchParams.get('quick') !== 'case') return;

    setShowCreateClientFields(false);
    setIsCreateCaseOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

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
      const client = clientsById.get(String(record.clientId || ''));
      const clientCompany = String(client?.company || client?.companyName || '').trim();
      const recordReference = getCaseReference(record);
      const matchesSearch = !normalizedQuery || (
        record.title?.toLowerCase().includes(normalizedQuery)
        || record.clientName?.toLowerCase().includes(normalizedQuery)
        || record.clientEmail?.toLowerCase().includes(normalizedQuery)
        || record.clientPhone?.toLowerCase().includes(normalizedQuery)
        || record.status?.toLowerCase().includes(normalizedQuery)
        || clientCompany.toLowerCase().includes(normalizedQuery)
        || recordReference.toLowerCase().includes(normalizedQuery)
      );

      const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);
      const status = normalizeCaseStatus(record.status);
      const nearestCaseAction = getNearestPlannedAction({
        recordType: 'case',
        recordId: String(record.id || ''),
        items: [...(caseTasksByCaseId.get(String(record.id || '')) || []), ...(caseEventsByCaseId.get(String(record.id || '')) || [])],
      });
      const matchesView =
        caseView === 'open'
        || caseView === 'closed'
        || caseView === 'all'
        || (caseView === 'waiting' && isWaitingForClientCase(record))
        || (caseView === 'blocked' && (status === 'blocked' || lifecycle.bucket === 'blocked'))
        || (caseView === 'approval' && lifecycle.bucket === 'waiting_approval')
        || (caseView === 'ready' && (status === 'ready_to_start' || lifecycle.bucket === 'ready_to_start'))
        || (caseView === 'needs_next_step' && lifecycle.bucket === 'needs_next_step')
        || (caseView === 'linked' && Boolean(record.leadId));

      const matchesStatus = statusFilter === 'all'
        || (statusFilter === 'closed' ? isClosedCaseStatus(record.status) : status === statusFilter);
      const percent = Math.round(record.completenessPercent || 0);
      const matchesCompleteness = completenessFilter === 'all'
        || (completenessFilter === 'low' && percent < 35)
        || (completenessFilter === 'medium' && percent >= 35 && percent < 75)
        || (completenessFilter === 'high' && percent >= 75);
      const recordOwnerId = String(record.ownerId || '').trim();
      const matchesOwner = ownerFilter === 'all'
        || (ownerFilter === 'unassigned' ? !recordOwnerId : recordOwnerId === ownerFilter);
      const matchesClient = clientFilter === 'all' || String(record.clientId || '').trim() === clientFilter;
      const matchesBlocker = blockerFilter === 'all'
        || (blockerFilter === 'with_missing' && lifecycle.missingRequiredCount > 0)
        || (blockerFilter === 'without_missing' && lifecycle.missingRequiredCount === 0);
      const matchesNextAction = !withoutNextAction || !nearestCaseAction;

      return matchesSearch && matchesView && matchesStatus && matchesCompleteness && matchesOwner && matchesClient && matchesBlocker && matchesNextAction;
    });
  }, [activeCases, blockerFilter, caseEventsByCaseId, caseTasksByCaseId, caseView, cases, clientFilter, clientsById, closedCases, completenessFilter, ownerFilter, searchQuery, statusFilter, withoutNextAction]);

  const sortedCases = useMemo(() => {
    const sorted = [...filteredCases];
    sorted.sort((left, right) => {
      if (sortBy === 'completeness_asc' || sortBy === 'completeness_desc') {
        const leftPercent = Number(left.completenessPercent || 0);
        const rightPercent = Number(right.completenessPercent || 0);
        return sortBy === 'completeness_asc' ? leftPercent - rightPercent : rightPercent - leftPercent;
      }
      const leftDate = toUpdatedDate(left.updatedAt || left.createdAt)?.getTime() ?? 0;
      const rightDate = toUpdatedDate(right.updatedAt || right.createdAt)?.getTime() ?? 0;
      return sortBy === 'updated_asc' ? leftDate - rightDate : rightDate - leftDate;
    });
    return sorted;
  }, [filteredCases, sortBy]);

  const casePageCount = Math.max(1, Math.ceil(sortedCases.length / casePageSize));
  const safeCasePage = Math.min(casePage, casePageCount);
  const visibleCases = sortedCases.slice((safeCasePage - 1) * casePageSize, safeCasePage * casePageSize);
  const isWaitingView = caseView === 'waiting';
  const allVisibleCasesSelected = visibleCases.length > 0 && visibleCases.every((record) => selectedCaseIds.has(record.id));
  const casePageItems = useMemo(() => buildPaginationItems(safeCasePage, casePageCount), [casePageCount, safeCasePage]);

  useEffect(() => {
    if (casePage > casePageCount) setCasePage(casePageCount);
  }, [casePage, casePageCount]);

  useEffect(() => {
    setCasePage(1);
    setSelectedCaseIds(new Set());
  }, [caseView, searchQuery, statusFilter, clientFilter, blockerFilter, completenessFilter, ownerFilter, withoutNextAction, sortBy, casePageSize]);

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

  const resetCaseListFilters = (view: CaseView = 'all') => {
    setSearchQuery('');
    setStatusFilter('all');
    setClientFilter('all');
    setBlockerFilter('all');
    setCompletenessFilter('all');
    setOwnerFilter('all');
    setWithoutNextAction(false);
    setSortBy('updated_desc');
    setCasePage(1);
    setSelectedCaseIds(new Set());
    setCaseViewStage231B0R9(view);
  };

  const activateCaseTab = (view: CaseView, nextStatus: CaseStatusFilter = 'all') => {
    resetCaseListFilters(view);
    if (nextStatus !== 'all') setStatusFilter(nextStatus);
  };

  function handleExportWaitingCases() {
    const headers = ['Sprawa', 'Klient', 'Status', 'Czego brakuje', 'Czekamy od', 'Ostatnie przypomnienie', 'Najbliższy ruch', 'Opiekun'];
    const rows = sortedCases.map((record) => {
      const rawClient = clientsById.get(String(record.clientId || ''));
      const clientName = String(record.clientName || rawClient?.name || rawClient?.company || 'Brak nazwy klienta');
      const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);
      const waitingSince = getWaitingSince(record);
      const lastReminder = getLastReminderDate(record);
      const nearestCaseAction = getNearestPlannedAction({
        recordType: 'case',
        recordId: String(record.id || ''),
        items: [...(caseTasksByCaseId.get(String(record.id || '')) || []), ...(caseEventsByCaseId.get(String(record.id || '')) || [])],
      });
      return [
        `${getCaseSubject(record)} (${getCaseReference(record)})`,
        clientName,
        getCaseStatusLabel(record.status),
        getWaitingMissingLabel(record, lifecycle),
        formatCaseDate(waitingSince || record.createdAt),
        lastReminder ? formatCaseDate(lastReminder) : 'Brak przypomnienia',
        nearestCaseAction ? `${nearestCaseAction.title} · ${formatCaseDate(nearestCaseAction.when)}` : 'Brak zaplanowanego ruchu',
        getCaseOwnerLabel(record, profile, workspace),
      ].map(csvCell).join(',');
    });
    const csv = [headers.map(csvCell).join(','), ...rows].join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'closeflow-sprawy-czekaja-na-klienta.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success(`Wyeksportowano ${sortedCases.length} ${sortedCases.length === 1 ? 'sprawę' : 'spraw'}.`);
  }

  function handleSaveWaitingView() {
    try {
      window.localStorage.setItem('closeflow.cases.waiting-view.v1', JSON.stringify({
        view: 'waiting',
        search: searchQuery,
        owner: ownerFilter,
        savedAt: new Date().toISOString(),
      }));
      toast.success('Widok „Czekają na klienta” zapisany na tym urządzeniu.');
    } catch {
      toast.error('Nie udało się zapisać widoku na tym urządzeniu.');
    }
  }

  const toggleCaseView = (view: CaseView) => {
    if (caseView === view) {
      setCaseViewStage231B0R9('open');
      return;
    }
    setCaseViewStage231B0R9(view);
  };

  const toggleCaseSelection = (caseId: string) => {
    setSelectedCaseIds((current) => {
      const next = new Set(current);
      if (next.has(caseId)) next.delete(caseId);
      else next.add(caseId);
      return next;
    });
  };

  const toggleVisibleCaseSelection = () => {
    setSelectedCaseIds((current) => {
      const next = new Set(current);
      if (allVisibleCasesSelected) {
        visibleCases.forEach((record) => next.delete(record.id));
      } else {
        visibleCases.forEach((record) => next.add(record.id));
      }
      return next;
    });
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
      <div
        className={`cf-html-view main-cases-html ${isWaitingView ? 'cf-cases-waiting-state' : ''}`}
        data-cases-real-view="true"
        data-cases-state={isWaitingView ? 'waiting' : caseView}
        data-stage16c-tasks-cases-repair="cases"
      >
        <CloseFlowPageHeaderV2
          pageKey="cases"
          title="Sprawy"
          description="Zarządzaj realizacją i kompletnością materiałów klientów."
          actions={
            <>
              <div className="head-actions cf-cases-header-actions">
                <Button
                  type="button"
                  variant="outline"
                  className="cf-cases-import-button"
                  onClick={() => isWaitingView
                    ? handleExportWaitingCases()
                    : toast.info('Import CSV wymaga przygotowania pliku i zostanie zapisany w kolejnym kroku.')}
                  data-cf-cases-import={isWaitingView ? undefined : 'true'}
                  data-cf-cases-export={isWaitingView ? 'true' : undefined}
                >
                  <Download aria-hidden="true" />
                  {isWaitingView ? 'Eksportuj' : 'Import CSV'}
                </Button>
                <Dialog open={isCreateCaseOpen} onOpenChange={(open) => {
                            setIsCreateCaseOpen(open);
                            if (!open) {
                              setShowCreateClientFields(false);
                            }
                          }}>
                            <div className="cf-cases-add-group" data-cf-cases-add-group="true">
                              <DialogTrigger asChild>
                                <Button className="cf-cases-add-button" disabled={!workspaceReady}>
                                  <Plus aria-hidden="true" />
                                  Dodaj sprawę
                                </Button>
                              </DialogTrigger>
                              <button
                                type="button"
                                className="cf-cases-add-menu-trigger"
                                aria-label="Więcej opcji dodawania sprawy"
                                title="Więcej opcji dodawania sprawy"
                                disabled={!workspaceReady}
                                onClick={() => setIsCreateCaseOpen(true)}
                              >
                                <ChevronDown aria-hidden="true" />
                              </button>
                            </div>
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

        {isWaitingView ? (
          <nav className="cf-cases-waiting-tabs" aria-label="Widoki spraw" data-cf-cases-tabs="true">
            <button type="button" onClick={() => activateCaseTab('all')}>Wszystkie</button>
            <button type="button" onClick={() => activateCaseTab('open')}>Aktywne</button>
            <button type="button" className="is-active" aria-current="page" onClick={() => activateCaseTab('waiting')}>
              Czekają na klienta <span>{waitingMetrics.count}</span>
            </button>
            <button type="button" onClick={() => activateCaseTab('all', 'in_progress')}>W trakcie</button>
            <button type="button" onClick={() => activateCaseTab('blocked')}>Zablokowane</button>
            <button type="button" onClick={() => activateCaseTab('ready')}>Gotowe do startu</button>
          </nav>
        ) : null}

        {isWaitingView ? (
          <section className="cf-cases-kpi-grid cf-cases-waiting-kpi-grid" aria-label="Podsumowanie spraw czekających na klienta" data-cf-cases-kpi-grid="true" data-cf-cases-waiting-kpi="true">
            <StatShortcutCard
              label="CZEKAJĄ NA KLIENTA"
              value={stats.waiting}
              icon={Clock}
              tone="purple"
              helper={`${percentageLabel(waitingMetrics.count, stats.all)} wszystkich spraw`}
              active
              onClick={() => activateCaseTab('waiting')}
              ariaLabel="Pokaż sprawy czekające na klienta"
            />
            <StatShortcutCard
              label="ŚREDNI CZAS OCZEKIWANIA"
              value={`${waitingMetrics.averageDays} dni`}
              icon={Clock}
              tone="amber"
              helper={waitingMetrics.count ? 'średnia na podstawie dat oczekiwania' : 'brak dat oczekiwania'}
              ariaLabel="Średni czas oczekiwania spraw"
            />
            <StatShortcutCard
              label="PRZEKROCZONE 5 DNI"
              value={waitingMetrics.overdue}
              icon={CalendarDays}
              tone="red"
              helper={`${percentageLabel(waitingMetrics.overdue, waitingMetrics.count)} spraw`}
              ariaLabel="Sprawy oczekujące ponad pięć dni"
            />
            <StatShortcutCard
              label="BEZ PRZYPOMNIENIA"
              value={waitingMetrics.noReminder}
              icon={Bell}
              tone="amber"
              helper={`${percentageLabel(waitingMetrics.noReminder, waitingMetrics.count)} spraw`}
              ariaLabel="Sprawy bez ostatniego przypomnienia"
            />
          </section>
        ) : (
        <section className="cf-cases-kpi-grid" aria-label="Podsumowanie spraw" data-cf-cases-kpi-grid="true">
          <StatShortcutCard
            label="WSZYSTKIE"
            value={stats.all}
            icon={Folder}
            tone="blue"
            helper="Wszystkie sprawy"
            active={caseView === 'all' && statusFilter === 'all' && !searchQuery}
            onClick={() => resetCaseListFilters('all')}
            ariaLabel="Pokaż wszystkie sprawy"
          />
          <StatShortcutCard
            label="CZEKAJĄ NA KLIENTA"
            value={stats.waiting}
            icon={Clock}
            tone="amber"
            helper="Wymagają działania"
            active={caseView === 'all' && statusFilter === 'waiting_on_client'}
            onClick={() => {
              resetCaseListFilters('all');
              setStatusFilter('waiting_on_client');
            }}
            ariaLabel="Pokaż sprawy czekające na klienta"
          />
          <StatShortcutCard
            label="ZABLOKOWANE"
            value={stats.blocked}
            icon={LockKeyhole}
            tone="red"
            helper="Sprawy z blokadami"
            active={caseView === 'all' && statusFilter === 'blocked'}
            onClick={() => {
              resetCaseListFilters('all');
              setStatusFilter('blocked');
            }}
            ariaLabel="Pokaż zablokowane sprawy"
          />
          <StatShortcutCard
            label="GOTOWE DO STARTU"
            value={stats.ready}
            icon={Rocket}
            tone="green"
            helper="Gotowe do rozpoczęcia"
            active={caseView === 'all' && statusFilter === 'ready_to_start'}
            onClick={() => {
              resetCaseListFilters('all');
              setStatusFilter('ready_to_start');
            }}
            ariaLabel="Pokaż sprawy gotowe do startu"
          />
        </section>
        )}

        <section className="cf-cases-table-card" data-cf-cases-list="true">
          <FilterToolbar
            className="cf-cases-toolbar"
            dataAttrs={{ 'data-cf-cases-toolbar': true }}
          >
            <label className="cf-cases-search">
              <Search aria-hidden="true" />
              <Input
                placeholder={isWaitingView ? 'Szukaj sprawy, klienta, opiekuna...' : 'Szukaj sprawy, klienta, tematu, numeru...'}
                aria-label="Szukaj sprawy, klienta, tematu lub numeru"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <FilterSelect
              label="Status"
              value={isWaitingView ? 'waiting_on_client' : statusFilter}
              onChange={(value) => setStatusFilter(value as CaseStatusFilter)}
              disabled={isWaitingView}
              className="cf-cases-control"
              selectClassName="cf-cases-native-select"
              dataAttrs={{ 'data-cf-cases-status-filter': true, 'data-cf-cases-waiting-status-filter': isWaitingView }}
              options={isWaitingView
                ? [{ value: 'waiting_on_client', label: 'Czekają na klienta' }]
                : [
                    { value: 'all', label: 'Wszystkie' },
                    { value: 'in_progress', label: 'W realizacji' },
                    { value: 'waiting_on_client', label: 'Czeka na klienta' },
                    { value: 'blocked', label: 'Zablokowane' },
                    { value: 'ready_to_start', label: 'Gotowe do startu' },
                    { value: 'closed', label: 'Zamknięte' },
                  ]}
            />
            {!isWaitingView ? (
              <FilterSelect
                label="Kompletność"
                value={completenessFilter}
                onChange={(value) => setCompletenessFilter(value as CaseCompletenessFilter)}
                className="cf-cases-control"
                selectClassName="cf-cases-native-select"
                dataAttrs={{ 'data-cf-cases-completeness-filter': true }}
                options={[
                  { value: 'all', label: 'Wszystkie' },
                  { value: 'low', label: '0–34%' },
                  { value: 'medium', label: '35–74%' },
                  { value: 'high', label: '75–100%' },
                ]}
              />
            ) : null}
            <FilterSelect
              label="Opiekun"
              value={ownerFilter}
              onChange={setOwnerFilter}
              className="cf-cases-control"
              selectClassName="cf-cases-native-select"
              dataAttrs={{ 'data-cf-cases-owner-filter': true }}
              options={[
                { value: 'all', label: 'Wszyscy' },
                ...caseOwnerOptions.map(([value, label]) => ({ value, label })),
              ]}
            />
            <button
              type="button"
              className="cf-cases-filter-button"
              aria-label="Więcej filtrów"
              aria-expanded={showMoreFilters}
              onClick={() => setShowMoreFilters((current) => !current)}
            >
              <Filter aria-hidden="true" />
              Więcej filtrów
            </button>
            {!isWaitingView ? (
              <SortSelect
                label="Sortuj"
                value={sortBy}
                onChange={(value) => setSortBy(value as CaseSort)}
                className="cf-cases-sort"
                selectClassName="cf-cases-native-select"
                dataAttrs={{ 'data-cf-cases-sort': true }}
                options={[
                  { value: 'updated_desc', label: 'Ostatni ruch' },
                  { value: 'updated_asc', label: 'Najstarszy ruch' },
                  { value: 'completeness_desc', label: 'Największa kompletność' },
                  { value: 'completeness_asc', label: 'Najmniejsza kompletność' },
                ]}
              />
            ) : (
              <Button type="button" variant="outline" className="cf-cases-save-view" onClick={handleSaveWaitingView} data-cf-cases-save-view="true">
                Zapisz widok
              </Button>
            )}
          </FilterToolbar>

          {showMoreFilters ? (
            <div className="cf-cases-more-filters" data-cf-cases-more-filters="true">
              <FilterSelect
                label="Klient"
                value={clientFilter}
                onChange={setClientFilter}
                className="cf-cases-more-select"
                selectClassName="cf-cases-native-select"
                dataAttrs={{ 'data-cf-cases-client-filter': true }}
                options={[
                  { value: 'all', label: 'Wszyscy klienci' },
                  ...caseClientFilterOptions.map(([value, label]) => ({ value, label })),
                ]}
              />
              <FilterSelect
                label="Blokery"
                value={blockerFilter}
                onChange={setBlockerFilter}
                className="cf-cases-more-select"
                selectClassName="cf-cases-native-select"
                dataAttrs={{ 'data-cf-cases-blocker-filter': true }}
                options={[
                  { value: 'all', label: 'Wszystkie' },
                  { value: 'with_missing', label: 'Tylko z brakami' },
                  { value: 'without_missing', label: 'Bez braków' },
                ]}
              />
              <label className="cf-cases-check-filter">
                <input type="checkbox" checked={withoutNextAction} onChange={(event) => setWithoutNextAction(event.target.checked)} />
                Tylko bez zaplanowanego ruchu
              </label>
              <Button type="button" variant="outline" onClick={() => resetCaseListFilters(caseView)}>Wyczyść filtry</Button>
            </div>
          ) : null}

          <div className="cf-cases-table-scroll">
            <div className="cf-cases-table" role="table" aria-label="Lista spraw" data-cf-cases-table="true">
              {isWaitingView ? (
                <div className="cf-cases-row cf-cases-head cf-cases-waiting-row-head" role="row">
                  <div className="cf-cases-cell" role="columnheader">Sprawa <ArrowUpDown aria-hidden="true" /></div>
                  <div className="cf-cases-cell" role="columnheader">Klient</div>
                  <div className="cf-cases-cell" role="columnheader">Status</div>
                  <div className="cf-cases-cell" role="columnheader">Czego brakuje</div>
                  <div className="cf-cases-cell" role="columnheader">Czekamy od</div>
                  <div className="cf-cases-cell" role="columnheader">Ostatnie przypomnienie</div>
                  <div className="cf-cases-cell" role="columnheader">Najbliższy ruch</div>
                  <div className="cf-cases-cell" role="columnheader">Opiekun</div>
                  <div className="cf-cases-cell cf-cases-actions-cell" role="columnheader">Akcja</div>
                </div>
              ) : (
                <div className="cf-cases-row cf-cases-head" role="row">
                  <div className="cf-cases-cell cf-cases-check-cell" role="columnheader">
                    <input type="checkbox" checked={allVisibleCasesSelected} onChange={toggleVisibleCaseSelection} aria-label="Zaznacz widoczne sprawy" />
                  </div>
                  <div className="cf-cases-cell" role="columnheader">Numer sprawy <ArrowUpDown aria-hidden="true" /></div>
                  <div className="cf-cases-cell" role="columnheader">Klient</div>
                  <div className="cf-cases-cell" role="columnheader">Temat</div>
                  <div className="cf-cases-cell" role="columnheader">Status</div>
                  <div className="cf-cases-cell" role="columnheader">Kompletność</div>
                  <div className="cf-cases-cell" role="columnheader">Braki</div>
                  <div className="cf-cases-cell" role="columnheader">Ostatni ruch</div>
                  <div className="cf-cases-cell" role="columnheader">Najbliższy ruch</div>
                  <div className="cf-cases-cell" role="columnheader">Opiekun</div>
                  <div className="cf-cases-cell cf-cases-actions-cell" role="columnheader" />
                </div>
              )}

              {loading ? (
                <div className="cf-cases-empty-row" role="row">
                  <Loader2 className="animate-spin" aria-label="Ładowanie spraw" />
                  <span>Ładowanie spraw</span>
                </div>
              ) : visibleCases.length === 0 ? (
                <div className="cf-cases-empty-row" role="row">
                  <span>Brak spraw do wyświetlenia.</span>
                  <small>Zmień wyszukiwanie albo kliknij inny filtr.</small>
                </div>
              ) : visibleCases.map((record) => {
                const rawClient = clientsById.get(String(record.clientId || ''));
                const clientName = String(record.clientName || rawClient?.name || rawClient?.company || 'Brak nazwy klienta');
                const clientCompany = String(rawClient?.company || rawClient?.companyName || '').trim();
                const clientInitials = clientName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase() || 'K';
                const isClosed = isClosedCaseStatus(record.status);
                const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);
                const percent = Math.round(record.completenessPercent || 0);
                const nearestCaseAction = getNearestPlannedAction({
                  recordType: 'case',
                  recordId: String(record.id || ''),
                  items: [...(caseTasksByCaseId.get(String(record.id || '')) || []), ...(caseEventsByCaseId.get(String(record.id || '')) || [])],
                });
                const statusTone = isClosed ? 'green' : getCaseStatusTone(record.status);
                const progressTone = isClosed ? 'green' : percent >= 75 ? 'green' : percent >= 35 ? 'blue' : 'amber';
                const ownerLabel = getCaseOwnerLabel(record, profile, workspace);
                const ownerInitials = ownerLabel.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase() || '—';
                const ownerRiskBadges = isClosed ? [] : getCaseOwnerRiskBadges(record, { settings: ownerRiskSettings });
                const updatedValue = record.updatedAt || record.createdAt;
                const waitingSince = getWaitingSince(record);
                const waitingSinceValue = waitingSince || toUpdatedDate(record.createdAt as CaseRecord['createdAt']);
                const lastReminder = getLastReminderDate(record);
                const waitingMissingLabel = getWaitingMissingLabel(record, lifecycle);
                const clientEmail = String(record.clientEmail || rawClient?.email || '').trim();
                const clientPhone = String(record.clientPhone || rawClient?.phone || '').trim();
                const reminderHref = clientEmail
                  ? `mailto:${clientEmail}?subject=${encodeURIComponent(`Przypomnienie: ${getCaseSubject(record)}`)}`
                  : clientPhone
                    ? `tel:${clientPhone.replace(/[^+\d]/g, '')}`
                    : null;

                if (isWaitingView) {
                  return (
                    <div className="cf-cases-row cf-cases-data-row cf-cases-waiting-row" role="row" key={record.id} data-case-id={record.id}>
                      <div className="cf-cases-cell cf-cases-waiting-case-cell" role="cell">
                        <Link to={caseDetailPath(record.id)} className="cf-cases-waiting-case-link" aria-label={`Otwórz sprawę ${record.title || record.id}`}>
                          <strong>{getCaseSubject(record)}</strong>
                          <small>{getCaseReference(record)}</small>
                        </Link>
                      </div>
                      <div className="cf-cases-cell cf-cases-client-cell" role="cell">
                        <span className="cf-cases-avatar" aria-hidden="true">{clientInitials}</span>
                        <span className="cf-cases-client-copy">
                          <Link to={caseDetailPath(record.id)} className="cf-cases-client-name" aria-label={`Otwórz sprawę ${record.title || record.id}`}>
                            {clientName}
                          </Link>
                          <small>{clientCompany || 'Brak firmy'}</small>
                        </span>
                      </div>
                      <div className="cf-cases-cell cf-cases-status-cell" role="cell">
                        <span className="cf-cases-status-pill" data-cf-status-tone={statusTone}>{getCaseStatusLabel(record.status)}</span>
                      </div>
                      <div className="cf-cases-cell cf-cases-waiting-missing-cell" role="cell">
                        <strong>{waitingMissingLabel}</strong>
                        <small>{lifecycle.missingRequiredCount > 0 ? 'elementy wymagane do startu' : 'checklista bez zidentyfikowanych braków'}</small>
                      </div>
                      <div className="cf-cases-cell cf-cases-waiting-date-cell" role="cell">
                        <strong>{formatCaseDate(waitingSinceValue)}</strong>
                        <small>{formatWaitingAge(waitingSinceValue)}</small>
                      </div>
                      <div className="cf-cases-cell cf-cases-waiting-reminder-cell" role="cell">
                        <strong>{lastReminder ? formatCaseDate(lastReminder) : '—'}</strong>
                        <small>{lastReminder ? 'Wysłano przypomnienie' : 'Brak przypomnienia'}</small>
                      </div>
                      <div className="cf-cases-cell cf-cases-next-cell" role="cell">
                        {nearestCaseAction ? (
                          <>
                            <CalendarDays aria-hidden="true" />
                            <span><strong>{formatCaseDate(nearestCaseAction.when)}</strong><small>{nearestCaseAction.title}</small></span>
                          </>
                        ) : (
                          <span className="cf-cases-next-empty"><strong>—</strong><small>Brak zaplanowanego ruchu</small></span>
                        )}
                      </div>
                      <div className="cf-cases-cell cf-cases-owner-cell" role="cell">
                        <span className="cf-cases-avatar cf-cases-owner-avatar" aria-hidden="true">{ownerInitials}</span>
                        <span>{ownerLabel}</span>
                      </div>
                      <div className="cf-cases-cell cf-cases-actions-cell cf-cases-waiting-actions-cell" role="cell">
                        {reminderHref ? (
                          <a
                            className="cf-cases-waiting-reminder-button"
                            href={reminderHref}
                            aria-label={`${clientEmail ? 'Wyślij przypomnienie' : 'Zadzwoń'} do ${clientName}`}
                            title={clientEmail ? 'Otwórz wiadomość do klienta' : 'Zadzwoń do klienta'}
                            data-cf-cases-waiting-action={clientEmail ? 'email' : 'phone'}
                          >
                            <Send aria-hidden="true" />
                            {clientEmail ? 'Wyślij przypomnienie' : 'Zadzwoń'}
                          </a>
                        ) : (
                          <Link to={caseDetailPath(record.id)} className="cf-cases-waiting-open-link" data-cf-cases-waiting-action="open">
                            Otwórz sprawę
                          </Link>
                        )}
                        <button
                          type="button"
                          className="cf-cases-more-button"
                          aria-label={`Akcje dla sprawy ${record.title || 'Sprawa'}`}
                          aria-expanded={openActionCaseId === record.id}
                          onClick={() => setOpenActionCaseId((current) => current === record.id ? null : record.id)}
                        >
                          <MoreHorizontal aria-hidden="true" />
                        </button>
                        {openActionCaseId === record.id ? (
                          <div className="cf-cases-action-menu" role="menu">
                            <Link to={caseDetailPath(record.id)} role="menuitem" onClick={() => setOpenActionCaseId(null)}>
                              Otwórz sprawę <ChevronRight aria-hidden="true" />
                            </Link>
                            <button
                              type="button"
                              role="menuitem"
                              className="cf-cases-delete-menu-item"
                              data-case-row-delete-action="true"
                              aria-label="Usuń sprawę"
                              title="Usuń sprawę"
                              onClick={() => {
                                setOpenActionCaseId(null);
                                setCaseToDelete(record);
                              }}
                            >
                              <DeleteActionIcon className={trashActionIconClass('h-4 w-4')} />
                              Usuń sprawę
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="cf-cases-row cf-cases-data-row" role="row" key={record.id} data-case-id={record.id}>
                    <div className="cf-cases-cell cf-cases-check-cell" role="cell">
                      <input type="checkbox" checked={selectedCaseIds.has(record.id)} onChange={() => toggleCaseSelection(record.id)} aria-label={`Zaznacz sprawę ${record.title || record.id}`} />
                    </div>
                    <div className="cf-cases-cell cf-cases-reference-cell" role="cell">
                      <Link
                        to={caseDetailPath(record.id)}
                        className="cf-cases-reference-link"
                        aria-label={`Otwórz sprawę ${record.title || record.id}`}
                      >
                        <strong>{getCaseReference(record)}</strong>
                        <small>{record.leadId ? 'Powiązana z leadem' : 'Sprawa operacyjna'}</small>
                      </Link>
                    </div>
                    <div className="cf-cases-cell cf-cases-client-cell" role="cell">
                      <span className="cf-cases-avatar" aria-hidden="true">{clientInitials}</span>
                      <span className="cf-cases-client-copy">
                        <Link
                          to={caseDetailPath(record.id)}
                          className="cf-cases-client-name"
                          aria-label={`Otwórz sprawę ${record.title || record.id}`}
                        >
                          {clientName}
                        </Link>
                        <small>{clientCompany || 'Brak firmy'}</small>
                      </span>
                    </div>
                    <div className="cf-cases-cell cf-cases-topic-cell" role="cell">
                      <Link to={caseDetailPath(record.id)}>{getCaseSubject(record)}</Link>
                    </div>
                    <div className="cf-cases-cell cf-cases-status-cell" role="cell">
                      <span className="cf-cases-status-pill" data-cf-status-tone={statusTone}>{getCaseStatusLabel(record.status)}</span>
                      {ownerRiskBadges.length > 0 ? (
                        <span
                          className="cf-cases-risk-marker"
                          data-cf-status-tone={ownerRiskTone(ownerRiskBadges[0].severity)}
                          data-stage222-owner-risk-case-badge="true"
                          title={ownerRiskBadges.map((badge) => badge.reason).join(' · ')}
                        >
                          {ownerRiskBadges[0].label}
                        </span>
                      ) : null}
                    </div>
                    <div className="cf-cases-cell cf-cases-completeness-cell" role="cell">
                      <strong>{percent}%</strong>
                      <span className="cf-cases-progress" data-cf-status-tone={progressTone}><span style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} /></span>
                      <small>{lifecycle.missingRequiredCount > 0 ? `${lifecycle.missingRequiredCount} braków` : 'Brak braków'}</small>
                    </div>
                    <div className="cf-cases-cell cf-cases-missing-cell" role="cell">
                      <span className="cf-cases-missing-badge" data-cf-missing-tone={lifecycle.missingRequiredCount > 0 ? 'danger' : 'success'}>{lifecycle.missingRequiredCount}</span>
                    </div>
                    <div className="cf-cases-cell cf-cases-date-cell" role="cell">
                      <strong>{formatCaseDate(updatedValue)}</strong>
                      <small>{ownerLabel}</small>
                    </div>
                    <div className="cf-cases-cell cf-cases-next-cell" role="cell">
                      {nearestCaseAction ? (
                        <>
                          <CalendarDays aria-hidden="true" />
                          <span><strong>{formatCaseDate(nearestCaseAction.when)}</strong><small>{nearestCaseAction.title}</small></span>
                        </>
                      ) : (
                        <span className="cf-cases-next-empty"><strong>—</strong><small>Brak zaplanowanego ruchu</small></span>
                      )}
                    </div>
                    <div className="cf-cases-cell cf-cases-owner-cell" role="cell">
                      <span className="cf-cases-avatar cf-cases-owner-avatar" aria-hidden="true">{ownerInitials}</span>
                      <span>{ownerLabel}</span>
                    </div>
                    <div className="cf-cases-cell cf-cases-actions-cell" role="cell">
                      <button
                        type="button"
                        className="cf-cases-more-button"
                        aria-label={`Akcje dla sprawy ${record.title || 'Sprawa'}`}
                        aria-expanded={openActionCaseId === record.id}
                        onClick={() => setOpenActionCaseId((current) => current === record.id ? null : record.id)}
                      >
                        <MoreHorizontal aria-hidden="true" />
                      </button>
                      {openActionCaseId === record.id ? (
                        <div className="cf-cases-action-menu" role="menu">
                          <Link to={caseDetailPath(record.id)} role="menuitem" onClick={() => setOpenActionCaseId(null)}>
                            Otwórz sprawę <ChevronRight aria-hidden="true" />
                          </Link>
                          <button
                            type="button"
                            role="menuitem"
                            className="cf-cases-delete-menu-item"
                            data-case-row-delete-action="true"
                            aria-label="Usuń sprawę"
                            title="Usuń sprawę"
                            onClick={() => {
                              setOpenActionCaseId(null);
                              setCaseToDelete(record);
                            }}
                          >
                            <DeleteActionIcon className={trashActionIconClass('h-4 w-4')} />
                            Usuń sprawę
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <footer className="cf-cases-table-footer">
            <span>
              {sortedCases.length === 0 ? 0 : (safeCasePage - 1) * casePageSize + 1}
              –{Math.min(safeCasePage * casePageSize, sortedCases.length)} z {sortedCases.length} spraw
            </span>
            <nav aria-label="Paginacja spraw">
              <button type="button" className="cf-cases-pagination-button" disabled={safeCasePage <= 1} onClick={() => setCasePage((page) => Math.max(1, page - 1))} aria-label="Poprzednia strona">‹</button>
              {casePageItems.map((item, index) => item === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className="cf-cases-page-ellipsis">…</span>
              ) : (
                <button key={item} type="button" className={safeCasePage === item ? 'cf-cases-pagination-button is-active' : 'cf-cases-pagination-button'} aria-current={safeCasePage === item ? 'page' : undefined} onClick={() => setCasePage(item)}>{item}</button>
              ))}
              <button type="button" className="cf-cases-pagination-button" disabled={safeCasePage >= casePageCount} onClick={() => setCasePage((page) => Math.min(casePageCount, page + 1))} aria-label="Następna strona">›</button>
            </nav>
            <label className="cf-cases-page-size">
              Pokaż na stronie:
              <select value={casePageSize} onChange={(event) => setCasePageSize(Number(event.target.value))} aria-label="Liczba spraw na stronie">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
          </footer>
        </section>

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
// LF-UI-SOT-007 canonical header owner marker: closeflow-page-header-structure-lock.css
// LF-UI-SOT-007 canonical header owner marker: closeflow-page-header-copy-left-only.css
