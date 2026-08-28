// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
import {
  type FormEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CircleDollarSign,
  ChevronDown,
  CloudUpload,
  Filter,
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  RotateCcw,
  Search,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';
import { DeleteActionIcon } from '../components/ui-system/ActionIcon';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { EntityConflictDialog, type EntityConflictCandidate } from '../components/EntityConflictDialog';
import { ConfirmDialog } from '../components/confirm-dialog';
import { actionIconClass, modalFooterClass } from '../components/entity-actions';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  createClientInSupabase,
  createCaseInSupabase,
  findEntityConflictsInSupabase,
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchPaymentsFromSupabase,
  fetchTasksFromSupabase,
  updateClientInSupabase,
  updateLeadInSupabase,
} from '../lib/supabase-fallback';
import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
import {
  buildContactCadenceGrid,
  buildContactCadenceBuckets,
  type ContactCadenceBucketKey,
} from '../lib/owner-control/contact-cadence-grid';
import {
  dateInputToNoonIso,
  getDefaultLastContactDateInput,
  getLastContactDateInputError,
  getTodayDateInputValue,
} from '../lib/owner-control/last-contact-intake';
import { isActiveClientCase } from '../lib/client-cases';
import { getCaseFinanceSummary, getClientCasesFinanceSummary } from '../lib/finance/case-finance-source';
// LF-UI-SOT-007 shared-source contract: import '../styles/visual-stage23-client-case-forms-vnext.css'; is provided once by App.tsx.
import '../styles/clients-next-action-layout.css';

import '../styles/forteca-clients-all.css';
import '../styles/closeflow-page-header-runtime.css';
import '../styles/closeflow-record-list-source-truth.css';
// LF-UI-SOT-007 shared-source contract: import '../styles/closeflow-unified-page-canvas-stage211c.css'; is provided once by App.tsx.
// LF-UI-SOT-007 shared-source contract: import '../styles/closeflow-canvas-source-truth-stage211e.css'; is provided once by App.tsx.
type ClientRecord = {
  [key: string]: unknown;
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  lastContactAt?: string | null;
  archivedAt?: string | null;
};

type ClientRelationFilterStage232C =
  | 'all'
  | 'without_case'
  | 'needs_contact'
  | 'active_commission'
  | 'archived';

type ClientStatusFilterStage021 = 'all' | 'active' | 'in_service' | 'new' | 'archived';

const FRT021_CLIENT_PAGE_SIZE = 7;

function getStage021DynamicValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim()) return value;
  }
  return '';
}

function getStage021DynamicText(row: Record<string, unknown>, keys: string[], fallback = '') {
  const value = getStage021DynamicValue(row, keys);
  if (Array.isArray(value)) return value.map((entry) => String(entry || '').trim()).filter(Boolean).join(', ') || fallback;
  return String(value || '').trim() || fallback;
}

function getStage021ClientOwner(client: ClientRecord) {
  return getStage021DynamicText(client, ['ownerName', 'owner_name', 'assigneeName', 'assignee_name', 'assignedTo', 'assigned_to'], 'Nieprzypisany');
}

function getStage021ClientTags(client: ClientRecord) {
  const value = getStage021DynamicValue(client, ['tags', 'tag']);
  if (Array.isArray(value)) return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  return String(value || '').split(',').map((entry) => entry.trim()).filter(Boolean);
}

function getStage021RelationType(client: ClientRecord) {
  const rawType = getStage021DynamicText(client, ['relationType', 'relation_type', 'clientType', 'client_type', 'type']).toLowerCase();
  if (rawType.includes('firma') || rawType.includes('company') || client.company) return 'Firma';
  return 'Osoba';
}

function getStage021ClientStatus(client: ClientRecord, activeCaseCount: number): ClientStatusFilterStage021 {
  if (client.archivedAt) return 'archived';
  if (activeCaseCount > 0) return 'in_service';
  const lastContact = getStage021DynamicValue(client, ['lastContactAt', 'last_contact_at']);
  return lastContact ? 'active' : 'new';
}

function getStage021StatusLabel(status: ClientStatusFilterStage021) {
  if (status === 'in_service') return 'W obsłudze';
  if (status === 'new') return 'Nowy';
  if (status === 'archived') return 'W archiwum';
  return 'Aktywny';
}

function getStage021CaseReference(caseRow: Record<string, unknown> | undefined) {
  if (!caseRow) return '—';
  return getStage021DynamicText(caseRow, ['caseNumber', 'case_number', 'reference', 'code', 'number'], '—');
}

function getStage021CaseTitle(caseRow: Record<string, unknown> | undefined) {
  if (!caseRow) return 'Brak aktywnej sprawy';
  return getStage021DynamicText(caseRow, ['title', 'name', 'serviceName', 'service_name'], 'Aktywna sprawa');
}

function getStage021ContactDate(value: unknown) {
  const raw = String(value || '').trim();
  if (!raw) return { date: '—', time: '' };
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return { date: raw, time: '' };
  const date = parsed.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
  const hasTime = /T\d{2}:\d{2}|\s\d{2}:\d{2}/.test(raw);
  return {
    date,
    time: hasTime ? parsed.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : '',
  };
}

const NEEDS_CONTACT_BUCKETS_STAGE232C: ContactCadenceBucketKey[] = [
  'silent_3',
  'silent_5',
  'silent_7',
  'silent_14_plus',
  'unknown',
];

const STAGE35_REAL_CLIENT_VALUE = 'STAGE35_REAL_CLIENT_VALUE';

function getStage35NumericValue(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const normalized = String(value || '').replace(/[^0-9,.-]/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getStage35FirstMoneyValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = getStage35NumericValue(row[key]);
    if (value > 0) return value;
  }
  return 0;
}

function getStage35RelationClientId(row: Record<string, unknown>) {
  return String(row.clientId || row.client_id || row.customerId || row.customer_id || '').trim();
}

function getStage232CRecordId(row: Record<string, unknown>) {
  return String(row.id || '').trim();
}

function getStage232CRelationLeadId(row: Record<string, unknown>) {
  return String(row.leadId || row.lead_id || '').trim();
}

function getStage232CRelationCaseId(row: Record<string, unknown>) {
  return String(row.caseId || row.case_id || '').trim();
}

function formatClientMoney(value: number) {
  return `${Math.round(Number(value || 0)).toLocaleString('pl-PL')} PLN`;
}
function parseClientCreateMoneyStage220A25(value: unknown) {
  const normalized = String(value ?? '').trim().replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100) / 100) : 0;
}

const CLOSEFLOW_CLIENT_CARD_NEXT_ACTION_LAYOUT_ETAP10 = 'nearest action is full-width before client card buttons';
const STAGE220A22_CLIENT_CASE_INDEX_CHEVRON_CONSISTENCY = 'client and case row index pills share color and client row uses chevron open indicator';
void STAGE220A22_CLIENT_CASE_INDEX_CHEVRON_CONSISTENCY;
const STAGE220A24_CLIENT_DIALOGS_LAYOUT_VST = 'client trash/restore uses production ConfirmDialog and no native browser confirm';
void STAGE220A24_CLIENT_DIALOGS_LAYOUT_VST;
const STAGE220A25_CASE_FINANCE_SYNC_FROM_CLIENT_CREATE = 'new client form can create primary case and writes case contractValue expectedRevenue';
const STAGE223R3_LAST_CONTACT_INTAKE_CLIENTS = 'client creation captures explicit lastContactAt for activity truth';
const STAGE225_CONTACT_CADENCE_GRID_CLIENTS = 'clients list uses Contact Cadence Grid filter from activity-truth';
const STAGE227F6_CLIENTS_CONTACT_CADENCE_COMPACT = 'Clients Contact Cadence Grid is a compact filter strip without explanatory runtime copy';
const STAGE231D0F_R6_CLIENTS_SHARED_FILTER_RESILIENT_PATCH = 'Clients contact cadence filters use robust SharedFilterStrip header and pill classes';
void STAGE220A25_CASE_FINANCE_SYNC_FROM_CLIENT_CREATE;
void STAGE223R3_LAST_CONTACT_INTAKE_CLIENTS;
void STAGE225_CONTACT_CADENCE_GRID_CLIENTS;
void STAGE227F6_CLIENTS_CONTACT_CADENCE_COMPACT;
void STAGE231D0F_R6_CLIENTS_SHARED_FILTER_RESILIENT_PATCH;

const CLOSEFLOW_CLIENT_VALUE_EXPECTED_NOT_PAID_V29 = 'client list shows expected relation value, not paid amount only';
const STAGE220A36_CLIENTS_COMMISSION_VALUE_SOURCE = 'clients list operational value uses commission due, not transaction price';
const STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL = 'new client starter case opens CaseDetail finance modal instead of collecting finance in client form';
const STAGE228R5R2_CLIENT_CASE_FINANCE_FLOW_LOCK = 'client create modal only asks for case name then redirects to CaseDetail finance editor';
const STAGE228R5R3_CLIENT_CASE_NAME_ONLY_MODAL = 'client create modal shows only case title; all case value and commission fields live in CaseDetail finance modal';
const STAGE226R10_CLIENTS_LIST_SOURCE_TRUTH = 'clients page renders rows only from clients state; leads are relation context only';
const STAGE231D0B_CLIENT_LIST_CARD_VISUAL_FREEZE = 'ClientListCard uses 2-line relationship row: active commission, lifetime earned, cases, nearest action; no leads count or active-case badge';
const STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH = 'Clients relation counters use active case truth without changing Aktywni tile semantics';
void STAGE231D0B_CLIENT_LIST_CARD_VISUAL_FREEZE;
void STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH;
void STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL;
void STAGE228R5R2_CLIENT_CASE_FINANCE_FLOW_LOCK;
void STAGE228R5R3_CLIENT_CASE_NAME_ONLY_MODAL;
void STAGE226R10_CLIENTS_LIST_SOURCE_TRUTH;

function getStage220A36CaseCommissionValue(caseRow: Record<string, unknown>) {
  return getCaseFinanceSummary(caseRow, []).commissionAmount;
}

const STAGE29_EXPECTED_VALUE_KEYS = [
  'expectedRevenue',
  'expected_revenue',
  'caseValue',
  'case_value',
  'dealValue',
  'deal_value',
  'value',
  'estimatedValue',
  'estimated_value',
  'budget',
  'price',
  'total',
  'totalValue',
  'total_value',
  'grossAmount',
  'gross_amount',
  'netAmount',
  'net_amount',
];

const STAGE29_PAID_VALUE_KEYS = ['paidAmount', 'paid_amount', 'amountPaid', 'amount_paid'];
const STAGE29_REMAINING_VALUE_KEYS = ['remainingAmount', 'remaining_amount', 'leftAmount', 'left_amount'];

function getStage29ExpectedCaseValue(row: Record<string, unknown>) {
  const explicit = getStage35FirstMoneyValue(row, STAGE29_EXPECTED_VALUE_KEYS);
  if (explicit > 0) return explicit;
  const paid = getStage35FirstMoneyValue(row, STAGE29_PAID_VALUE_KEYS);
  const remaining = getStage35FirstMoneyValue(row, STAGE29_REMAINING_VALUE_KEYS);
  return paid + remaining > 0 ? paid + remaining : 0;
}

const STAGE35_MONEY_KEYS = [
  'amount',
  'value',
  'dealValue',
  'deal_value',
  'estimatedValue',
  'estimated_value',
  'budget',
  'price',
  'total',
  'grossAmount',
  'gross_amount',
  'netAmount',
  'net_amount',
  'commission',
  'commissionAmount',
  'commission_amount',
];

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_CLIENTS = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';
const CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FULL = 'lead and client duplicate warning modal before write';
const CLOSEFLOW_A2_CLIENT_DUPLICATE_WARNING_BEFORE_WRITE = 'client duplicate warning before write';
const STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_CLIENTS = 'client duplicate conflict preflight fails closed and requires explicit add anyway';
void STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_CLIENTS;

export default function Clients() {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [clientRelationFilterStage232C, setClientRelationFilterStage232C] =
    useState<ClientRelationFilterStage232C>('all');
  const [cadenceFilter, setCadenceFilter] = useState<ContactCadenceBucketKey | 'all'>('all');
  const [statusFilterStage021, setStatusFilterStage021] = useState<ClientStatusFilterStage021>('all');
  const [ownerFilterStage021, setOwnerFilterStage021] = useState('all');
  const [tagFilterStage021, setTagFilterStage021] = useState('all');
  const [relationTypeFilterStage021, setRelationTypeFilterStage021] = useState('all');
  const [filterPanelOpenStage021, setFilterPanelOpenStage021] = useState(false);
  const [clientPageStage021, setClientPageStage021] = useState(1);
  const [selectedClientIdsStage021, setSelectedClientIdsStage021] = useState<Set<string>>(new Set());
  const [openActionClientIdStage021, setOpenActionClientIdStage021] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createPending, setCreatePending] = useState(false);
  const [archivePendingId, setArchivePendingId] = useState<string | null>(null);
  const [clientArchiveConfirm, setClientArchiveConfirm] = useState<{
    mode: 'archive' | 'restore';
    client: ClientRecord;
    title: string;
    description: string;
  } | null>(null);
  const [clientConflictOpen, setClientConflictOpen] = useState(false);
  const [clientConflictCandidates, setClientConflictCandidates] = useState<EntityConflictCandidate[]>([]);
  const [clientConflictPendingInput, setClientConflictPendingInput] = useState<any | null>(null);
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '', lastContactAt: getDefaultLastContactDateInput(), notes: '', createCase: true, caseTitle: '' });

  const applyClientRelationFilterStage232C = useCallback((filter: ClientRelationFilterStage232C) => {
    setClientRelationFilterStage232C(filter);
    if (filter !== 'needs_contact') setCadenceFilter('all');
  }, []);

  const reload = useCallback(async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [clientRows, leadRows, caseRows, paymentRows, taskRows, eventRows] = await Promise.all([
        fetchClientsFromSupabase(),
        fetchLeadsFromSupabase().catch(() => []),
        fetchCasesFromSupabase().catch(() => []),
        fetchPaymentsFromSupabase().catch(() => []),
        fetchTasksFromSupabase().catch(() => []),
        fetchEventsFromSupabase().catch(() => []),
      ]);
      setClients(clientRows as ClientRecord[]);
      setLeads(leadRows as any[]);
      setCases(caseRows as any[]);
      setPayments(paymentRows as any[]);
      setTasks(taskRows as any[]);
      setEvents(eventRows as any[]);
    } catch (error: any) {
      toast.error(`Błąd odczytu klientów: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLoading(false);
    }
  }, [workspace?.id]);

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }
    void reload();
  }, [reload, workspace?.id, workspaceLoading]);

  const activeCount = useMemo(() => clients.filter((client) => !client.archivedAt).length, [clients]);
  const archivedCount = useMemo(() => clients.filter((client) => Boolean(client.archivedAt)).length, [clients]);

  const relatedRecordsByClientIdStage232C = useMemo(() => {
    const map = new Map<string, unknown[]>();
    const leadClientById = new Map<string, string>();
    const caseClientById = new Map<string, string>();
    const touch = (clientId: string) => {
      if (!map.has(clientId)) map.set(clientId, []);
      return map.get(clientId)!;
    };
    const addForClient = (clientId: string, row: unknown) => {
      const safeClientId = String(clientId || '').trim();
      if (safeClientId) touch(safeClientId).push(row);
    };

    for (const client of clients) {
      addForClient(client.id, client);
    }

    for (const lead of leads as Record<string, unknown>[]) {
      const clientId = getStage35RelationClientId(lead);
      const leadId = getStage232CRecordId(lead);
      if (leadId && clientId) leadClientById.set(leadId, clientId);
      addForClient(clientId, lead);
    }

    for (const caseRecord of cases as Record<string, unknown>[]) {
      const clientId = getStage35RelationClientId(caseRecord);
      const caseId = getStage232CRecordId(caseRecord);
      if (caseId && clientId) caseClientById.set(caseId, clientId);
      addForClient(clientId, caseRecord);
    }

    const addByAnyRelation = (row: Record<string, unknown>) => {
      const directClientId = getStage35RelationClientId(row);
      if (directClientId) {
        addForClient(directClientId, row);
        return;
      }
      const caseClientId = caseClientById.get(getStage232CRelationCaseId(row));
      if (caseClientId) {
        addForClient(caseClientId, row);
        return;
      }
      const leadClientId = leadClientById.get(getStage232CRelationLeadId(row));
      if (leadClientId) addForClient(leadClientId, row);
    };

    for (const row of payments as Record<string, unknown>[]) addByAnyRelation(row);
    for (const row of tasks as Record<string, unknown>[]) addByAnyRelation(row);
    for (const row of events as Record<string, unknown>[]) addByAnyRelation(row);

    return map;
  }, [cases, clients, events, leads, payments, tasks]);

  const contactCadenceGrid = useMemo(
    () => buildContactCadenceGrid({
      entityType: 'client',
      records: clients.filter((client) => !client.archivedAt),
      relatedRecordsById: relatedRecordsByClientIdStage232C,
      settings: workspace,
    }),
    [clients, relatedRecordsByClientIdStage232C, workspace],
  );

  const contactCadenceBuckets = useMemo(() => buildContactCadenceBuckets(workspace), [workspace]);

  const countersByClientId = useMemo(() => {
    const map = new Map<string, { leads: number; cases: number; payments: number }>();
    const touch = (clientId: string) => {
      if (!map.has(clientId)) map.set(clientId, { leads: 0, cases: 0, payments: 0 });
      return map.get(clientId)!;
    };
    for (const lead of leads) {
      const clientId = getStage35RelationClientId(lead);
      if (!clientId) continue;
      touch(clientId).leads += 1;
    }
    for (const caseRecord of cases) {
      if (!isActiveClientCase(caseRecord)) continue;
      const clientId = getStage35RelationClientId(caseRecord);
      if (!clientId) continue;
      touch(clientId).cases += 1;
    }
    for (const payment of payments) {
      const clientId = getStage35RelationClientId(payment);
      if (!clientId) continue;
      touch(clientId).payments += 1;
    }
    return map;
  }, [cases, leads, payments]);

  const paymentValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const payment of payments as Record<string, unknown>[]) {
      const clientId = getStage35RelationClientId(payment);
      if (!clientId) continue;
      const amount = getStage35FirstMoneyValue(payment, STAGE35_MONEY_KEYS);
      map.set(clientId, (map.get(clientId) || 0) + amount);
    }
    return map;
  }, [payments]);

  const caseValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const caseRow of cases as Record<string, unknown>[]) {
      const clientId = getStage35RelationClientId(caseRow);
      if (!clientId) continue;
      const value = getStage220A36CaseCommissionValue(caseRow);
      map.set(clientId, (map.get(clientId) || 0) + value);
    }
    return map;
  }, [cases]);

  const leadValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const lead of leads as Record<string, unknown>[]) {
      const clientId = getStage35RelationClientId(lead);
      if (!clientId) continue;
      const value = getStage35FirstMoneyValue(lead, STAGE35_MONEY_KEYS);
      map.set(clientId, (map.get(clientId) || 0) + value);
    }
    return map;
  }, [leads]);

  const clientFieldValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const client of clients as Record<string, unknown>[]) {
      const clientId = String(client.id || '').trim();
      if (!clientId) continue;
      map.set(clientId, getStage35FirstMoneyValue(client, STAGE35_MONEY_KEYS));
    }
    return map;
  }, [clients]);

  const clientValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const client of clients) {
      const clientId = String(client.id || '').trim();
      if (!clientId) continue;
      const paymentValue = paymentValueByClientId.get(clientId) || 0;
      const caseValue = caseValueByClientId.get(clientId) || 0;
      const leadValue = leadValueByClientId.get(clientId) || 0;
      const fallbackClientValue = clientFieldValueByClientId.get(clientId) || 0;
      const expectedValue = caseValue > 0
        ? caseValue
        : leadValue > 0
          ? leadValue
          : fallbackClientValue;
      const finalValue = expectedValue > 0 ? expectedValue : paymentValue;
      map.set(clientId, finalValue);
    }
    return map;
  }, [caseValueByClientId, clientFieldValueByClientId, clients, leadValueByClientId, paymentValueByClientId]);

  const clientFinanceByClientId = useMemo(() => {
    const map = new Map<string, { activeCommission: number; lifetimeEarned: number }>();
    for (const client of clients) {
      const clientId = String(client.id || '').trim();
      if (!clientId) continue;
      const clientCases = (cases as Record<string, unknown>[]).filter((caseRow) => getStage35RelationClientId(caseRow) === clientId);
      const activeSummary = getClientCasesFinanceSummary({
        client,
        cases: clientCases,
        payments,
        mode: 'all_active_cases',
      });
      const lifetimeSummary = getClientCasesFinanceSummary({
        client,
        cases: clientCases,
        payments,
        mode: 'all_cases',
      });
      map.set(clientId, {
        activeCommission: activeSummary.commissionAmount,
        lifetimeEarned: lifetimeSummary.commissionPaidAmount,
      });
    }
    return map;
  }, [cases, clients, payments]);

  const nearestActionByClientId = useMemo(() => {
    const map = new Map<string, string>();
    for (const client of clients) {
      const clientId = String(client.id || '').trim();
      if (!clientId) continue;
      const relatedLeadIds = (leads as Record<string, unknown>[])
        .filter((lead) => getStage35RelationClientId(lead) === clientId)
        .map((lead) => String(lead.id || '').trim())
        .filter(Boolean);
      const relatedCaseIds = (cases as Record<string, unknown>[])
        .filter((caseRow) => getStage35RelationClientId(caseRow) === clientId)
        .map((caseRow) => String(caseRow.id || '').trim())
        .filter(Boolean);
      const nearest = getNearestPlannedAction({
        recordType: 'client',
        recordId: clientId,
        relatedLeadIds,
        relatedCaseIds,
        items: [...tasks, ...events],
      });
      if (!nearest) {
        map.set(clientId, 'Brak zaplanowanej akcji');
        continue;
      }
      const parsed = new Date(nearest.when);
      const dateLabel = Number.isNaN(parsed.getTime())
        ? nearest.when
        : parsed.toLocaleString('pl-PL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      map.set(clientId, `${nearest.title} · ${dateLabel}`);
    }
    return map;
  }, [cases, clients, events, leads, tasks]);

  const clientsWithCases = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.cases || 0) > 0).length,
    [clients, countersByClientId],
  );
  const clientsWithoutCases = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.cases || 0) === 0).length,
    [clients, countersByClientId],
  );

  const needsContactClientIdsStage232C = useMemo(() => {
    const ids = new Set<string>();
    for (const key of NEEDS_CONTACT_BUCKETS_STAGE232C) {
      for (const row of contactCadenceGrid.buckets[key] || []) {
        const id = String(row.entityId || '').trim();
        if (id) ids.add(id);
      }
    }
    return ids;
  }, [contactCadenceGrid]);

  const activeCommissionValueStage232C = useMemo(
    () => clients
      .filter((client) => !client.archivedAt)
      .reduce((sum, client) => sum + (clientFinanceByClientId.get(client.id)?.activeCommission || 0), 0),
    [clientFinanceByClientId, clients],
  );

  const clientOwnerOptionsStage021 = useMemo(
    () => Array.from(new Set(clients.map((client) => getStage021ClientOwner(client)))).sort((a, b) => a.localeCompare(b, 'pl')),
    [clients],
  );

  const clientTagOptionsStage021 = useMemo(
    () => Array.from(new Set(clients.flatMap((client) => getStage021ClientTags(client)))).sort((a, b) => a.localeCompare(b, 'pl')),
    [clients],
  );

  // STAGE226R10_FILTERED_CLIENT_ROWS_ONLY: main /clients list starts from clients and never maps leads into client rows.
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const activeCadenceIds = cadenceFilter === 'all'
      ? null
      : new Set((contactCadenceGrid.buckets[cadenceFilter] || []).map((row) => row.entityId));
    return clients
      .filter((client) => {
        const isArchived = Boolean(client.archivedAt);
        if (clientRelationFilterStage232C === 'archived') return isArchived;
        if (isArchived) return false;
        if (clientRelationFilterStage232C === 'without_case') {
          return (countersByClientId.get(client.id)?.cases || 0) === 0;
        }
        if (clientRelationFilterStage232C === 'needs_contact') {
          return needsContactClientIdsStage232C.has(String(client.id || ''));
        }
        if (clientRelationFilterStage232C === 'active_commission') {
          return (clientFinanceByClientId.get(client.id)?.activeCommission || 0) > 0;
        }
        const activeCaseCount = countersByClientId.get(client.id)?.cases || 0;
        const clientStatus = getStage021ClientStatus(client, activeCaseCount);
        const matchesStatus = statusFilterStage021 === 'all'
          || (statusFilterStage021 === 'active' && (clientStatus === 'active' || clientStatus === 'in_service'))
          || clientStatus === statusFilterStage021;
        if (!matchesStatus) return false;
        if (ownerFilterStage021 !== 'all' && getStage021ClientOwner(client) !== ownerFilterStage021) return false;
        if (tagFilterStage021 !== 'all' && !getStage021ClientTags(client).includes(tagFilterStage021)) return false;
        if (relationTypeFilterStage021 !== 'all' && getStage021RelationType(client) !== relationTypeFilterStage021) return false;
        return true;
      })
      .filter((client) => {
        const matchesCadence = clientRelationFilterStage232C === 'archived' || !activeCadenceIds || activeCadenceIds.has(String(client.id || ''));
        if (!matchesCadence) return false;
        if (!query) return true;
        const relatedCaseTitles = (cases as Record<string, unknown>[])
          .filter((caseRow) => getStage35RelationClientId(caseRow) === client.id)
          .flatMap((caseRow) => [caseRow.title, caseRow.name, caseRow.caseNumber, caseRow.case_number]);
        return [
          client.name,
          client.company,
          client.email,
          client.phone,
          getStage021ClientOwner(client),
          getStage021RelationType(client),
          ...getStage021ClientTags(client),
          ...relatedCaseTitles,
        ].some((entry) => String(entry || '').toLowerCase().includes(query));
      })
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pl'));
  }, [cadenceFilter, cases, clientFinanceByClientId, clientRelationFilterStage232C, clients, contactCadenceGrid, countersByClientId, needsContactClientIdsStage232C, ownerFilterStage021, relationTypeFilterStage021, search, statusFilterStage021, tagFilterStage021]);

  const clientPageCountStage021 = Math.max(1, Math.ceil(filtered.length / FRT021_CLIENT_PAGE_SIZE));
  const safeClientPageStage021 = Math.min(clientPageStage021, clientPageCountStage021);
  const visibleClientsStage021 = filtered.slice(
    (safeClientPageStage021 - 1) * FRT021_CLIENT_PAGE_SIZE,
    safeClientPageStage021 * FRT021_CLIENT_PAGE_SIZE,
  );
  const selectedVisibleClientsStage021 = visibleClientsStage021.length > 0
    && visibleClientsStage021.every((client) => selectedClientIdsStage021.has(client.id));

  useEffect(() => {
    setClientPageStage021(1);
  }, [cadenceFilter, clientRelationFilterStage232C, ownerFilterStage021, relationTypeFilterStage021, search, statusFilterStage021, tagFilterStage021]);

  useEffect(() => {
    if (clientPageStage021 > clientPageCountStage021) setClientPageStage021(clientPageCountStage021);
  }, [clientPageCountStage021, clientPageStage021]);

  const toggleClientSelectionStage021 = (clientId: string) => {
    setSelectedClientIdsStage021((current) => {
      const next = new Set(current);
      if (next.has(clientId)) next.delete(clientId);
      else next.add(clientId);
      return next;
    });
  };

  const toggleVisibleClientSelectionStage021 = () => {
    setSelectedClientIdsStage021((current) => {
      const next = new Set(current);
      if (selectedVisibleClientsStage021) visibleClientsStage021.forEach((client) => next.delete(client.id));
      else visibleClientsStage021.forEach((client) => next.add(client.id));
      return next;
    });
  };

  const resetNewClientForm = () => { setNewClient({ name: '', company: '', email: '', phone: '', lastContactAt: getDefaultLastContactDateInput(), notes: '', createCase: true, caseTitle: '' }); };

  const createClientFromPreparedInput = async (preparedClient: any, options?: { forceDuplicate?: boolean }) => {
    // CLOSEFLOW_A2_CLIENT_FORCE_DUPLICATE_TO_ALLOW_DUPLICATE_API_MAP
    const shouldCreateCase = Boolean(preparedClient.createCase || String(preparedClient.caseTitle || '').trim());
    const clientPayload = {
      name: preparedClient.name,
      company: preparedClient.company,
      email: preparedClient.email,
      phone: preparedClient.phone,
      lastContactAt: dateInputToNoonIso(preparedClient.lastContactAt),
      notes: preparedClient.notes,
      allowDuplicate: Boolean(options?.forceDuplicate),
      workspaceId: requireWorkspaceId(workspace),
    };

    const createdClient = await createClientInSupabase(clientPayload);
    const createdClientId = String((createdClient as any)?.id || '').trim();
    let createdCaseId = '';

    if (shouldCreateCase && createdClientId) {
      const caseTitle = String(preparedClient.caseTitle || '').trim() || 'Sprawa: ' + String(preparedClient.name || 'Klient').trim();
      const currency = 'PLN';

      const createdCase = await createCaseInSupabase({
        title: caseTitle,
        clientId: createdClientId,
        clientName: preparedClient.name,
        clientEmail: preparedClient.email,
        clientPhone: preparedClient.phone,
        status: 'in_progress',
        contractValue: 0,
        expectedRevenue: 0,
        caseValue: 0,
        currency,
        paidAmount: 0,
        remainingAmount: 0,
        commissionMode: 'not_set',
        commissionBase: 'contract_value',
        commissionRate: 0,
        commissionAmount: 0,
        commissionStatus: 'not_set',
        primaryForClient: true,
        replacePrimaryCase: true,
        workspaceId: requireWorkspaceId(workspace),
      } as any);
      createdCaseId = String((createdCase as any)?.id || (createdCase as any)?.caseId || (createdCase as any)?.case_id || '').trim();
    }

    toast.success(shouldCreateCase ? 'Klient i sprawa dodane. Uzupełnij finanse sprawy.' : 'Klient dodany');
    setIsCreateOpen(false);
    resetNewClientForm();
    if (createdCaseId) {
      navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-create');
      return;
    }
    await reload();
  };

  const restoreClientConflictCandidate = async (candidate: EntityConflictCandidate) => {
    if (!candidate.canRestore) { toast.info('Ten rekord ma historię. Najpierw go otwórz i zdecyduj, co zrobić.'); return; }
    try {
      setCreatePending(true);
      if (candidate.entityType === 'client') { await updateClientInSupabase({ id: candidate.id, archivedAt: null }); toast.success('Klient przywrócony'); }
      else { await updateLeadInSupabase({ id: candidate.id, status: 'new', leadVisibility: 'active', salesOutcome: 'open', closedAt: null }); toast.success('Lead przywrócony'); }
      setClientConflictOpen(false);
      await reload();
    } catch (error: any) { toast.error('Nie udało się przywrócić rekordu: ' + (error?.message || 'REQUEST_FAILED')); }
    finally { setCreatePending(false); }
  };

  const handleCreateClient = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasAccess) { toast.error('Twój trial wygasł.'); return; }
    if (!newClient.name.trim()) { toast.error('Podaj nazwę klienta.'); return; }
    if (!workspace?.id) { toast.error('Kontekst workspace nie jest jeszcze gotowy.'); return; }
    const lastContactError = getLastContactDateInputError(newClient.lastContactAt);
    if (lastContactError) { toast.error(lastContactError); return; }
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) { toast.error('Kontekst workspace nie jest jeszcze gotowy.'); return; }
    const preparedClient = { ...newClient, name: newClient.name.trim(), company: newClient.company.trim(), email: newClient.email.trim(), phone: newClient.phone.trim(), lastContactAt: newClient.lastContactAt, notes: newClient.notes.trim(), caseTitle: newClient.caseTitle.trim() };
    try {
      setCreatePending(true);
      let conflicts: any;
      try {
        conflicts = await findEntityConflictsInSupabase({ targetType: 'client', name: preparedClient.name, email: preparedClient.email, phone: preparedClient.phone, company: preparedClient.company, workspaceId });
      } catch (error: any) {
        toast.error('Nie udało się sprawdzić duplikatów. Zapis klienta zatrzymany, żeby nie dodać konfliktu po cichu.');
        return;
      }
      const candidates = Array.isArray(conflicts.candidates) ? conflicts.candidates as EntityConflictCandidate[] : [];
      if (candidates.length) {
        toast.info('Znaleziono podobny rekord. Zapis klienta wymaga potwierdzenia albo kliknięcia „Dodaj mimo to”.');
        setClientConflictCandidates(candidates);
        setClientConflictPendingInput(preparedClient);
        setIsCreateOpen(false);
        setClientConflictOpen(true);
        return;
      }
      await createClientFromPreparedInput(preparedClient);
    } catch (error: any) { toast.error('Nie udało się zapisać. Spróbuj ponownie.'); }
    finally { setCreatePending(false); }
  };

  const handleCreateClientAnyway = async () => {
    if (!clientConflictPendingInput || createPending) return;
    try { setCreatePending(true); await createClientFromPreparedInput(clientConflictPendingInput, { forceDuplicate: true }); setClientConflictOpen(false); setClientConflictPendingInput(null); setClientConflictCandidates([]); }
    catch (error: any) { toast.error('Nie udało się zapisać. Spróbuj ponownie.'); }
    finally { setCreatePending(false); }
  };

  const handleArchiveClient = async (
    event: MouseEvent<HTMLButtonElement>,
    client: ClientRecord,
    counters: { leads: number; cases: number; payments: number },
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const relationCount = counters.leads + counters.cases + counters.payments;
    const relationText = relationCount > 0
      ? '\n\nTen klient ma powiązania: leady ' + counters.leads + ', sprawy ' + counters.cases + ', rozliczenia ' + counters.payments + '. Dane nie zostaną trwale skasowane.'
      : 'Rekord zniknie z aktywnej listy, ale będzie można go przywrócić z kosza.';

    setClientArchiveConfirm({
      mode: 'archive',
      client,
      title: 'Przenieść klienta do kosza?',
      description: (client.name || 'Klient') + ' zostanie ukryty z aktywnej listy. ' + relationText,
    });
  };

  const handleRestoreClient = async (event: MouseEvent<HTMLButtonElement>, client: ClientRecord) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    setClientArchiveConfirm({
      mode: 'restore',
      client,
      title: 'Przywrócić klienta?',
      description: (client.name || 'Klient') + ' wróci do aktywnej listy klientów.',
    });
  };
  const confirmClientArchiveAction = async () => {
    if (!clientArchiveConfirm?.client?.id) return;
    const targetClient = clientArchiveConfirm.client;
    const mode = clientArchiveConfirm.mode;

    try {
      setArchivePendingId(targetClient.id);
      if (mode === 'archive') {
        await updateClientInSupabase({
          id: targetClient.id,
          archivedAt: new Date().toISOString(),
        });
      } else {
        await updateClientInSupabase({
          id: targetClient.id,
          archivedAt: null,
        });
      }

      toast.success(mode === 'archive' ? 'Klient przeniesiony do kosza' : 'Klient przywrócony');
      setClientArchiveConfirm(null);
      await reload();
    } catch (error: any) {
      toast.error(mode === 'archive'
        ? 'Nie udało się przenieść klienta do kosza.'
        : 'Nie udało się przywrócić klienta.'
      );
    } finally {
      setArchivePendingId(null);
    }
  };

  const handleStatusFilterStage021 = (value: ClientStatusFilterStage021) => {
    setStatusFilterStage021(value);
    if (value === 'archived') {
      applyClientRelationFilterStage232C('archived');
    } else if (clientRelationFilterStage232C === 'archived') {
      applyClientRelationFilterStage232C('all');
    }
  };

  const resetClientFiltersStage021 = () => {
    setSearch('');
    setStatusFilterStage021('all');
    setOwnerFilterStage021('all');
    setTagFilterStage021('all');
    setRelationTypeFilterStage021('all');
    setCadenceFilter('all');
    applyClientRelationFilterStage232C('all');
    setFilterPanelOpenStage021(false);
  };

  const allLiveClientsStage021 = useMemo(
    () => clients.filter((client) => !client.archivedAt),
    [clients],
  );
  const activeClientsStage021 = useMemo(
    () => allLiveClientsStage021.filter((client) => {
      const status = getStage021ClientStatus(client, countersByClientId.get(client.id)?.cases || 0);
      return status === 'active' || status === 'in_service';
    }),
    [allLiveClientsStage021, countersByClientId],
  );
  const activeShareStage021 = allLiveClientsStage021.length
    ? Math.round((activeClientsStage021.length / allLiveClientsStage021.length) * 100)
    : 0;
  const withoutCaseShareStage021 = allLiveClientsStage021.length
    ? Math.round((clientsWithoutCases / allLiveClientsStage021.length) * 100)
    : 0;
  const pageItemsStage021: Array<number | 'ellipsis'> = clientPageCountStage021 <= 5
    ? Array.from({ length: clientPageCountStage021 }, (_, index) => index + 1)
    : [1, 2, 3, 'ellipsis', clientPageCountStage021];

  return (
    <Layout>
      <div className="forteca-frt-021-page forteca-frt-021-clients-view" data-forteca-frt-021-runtime="true">
        <ConfirmDialog
          open={Boolean(clientArchiveConfirm)}
          onOpenChange={(open) => {
            if (!open && !archivePendingId) setClientArchiveConfirm(null);
          }}
          title={clientArchiveConfirm?.title || 'Potwierdź zmianę'}
          description={clientArchiveConfirm?.description || 'Potwierdź operację na kliencie.'}
          confirmLabel={archivePendingId ? 'Zapisywanie...' : clientArchiveConfirm?.mode === 'restore' ? 'Przywróć klienta' : 'Przenieś do kosza'}
          cancelLabel="Anuluj"
          confirmTone={clientArchiveConfirm?.mode === 'restore' ? 'default' : 'destructive'}
          pending={Boolean(archivePendingId)}
          onConfirm={confirmClientArchiveAction}
        />
        <EntityConflictDialog
          open={clientConflictOpen}
          onOpenChange={setClientConflictOpen}
          candidates={clientConflictCandidates}
          title="Możliwy duplikat"
          description="Znaleziono podobny rekord po e-mailu, telefonie, nazwie albo firmie. Sprawdź go przed zapisem albo świadomie dodaj mimo to."
          createAnywayLabel="Dodaj mimo to"
          busy={createPending}
          onShow={(candidate) => window.location.assign(candidate.url || (candidate.entityType === 'lead' ? '/leads/' + candidate.id : '/clients/' + candidate.id))}
          onRestore={restoreClientConflictCandidate}
          onCreateAnyway={handleCreateClientAnyway}
          onCancel={() => { setClientConflictOpen(false); setIsCreateOpen(true); }}
        />

        <header className="forteca-frt-021-header forteca-frt-021-page-header" data-forteca-frt-021-header="true">
          <div>
            <h1>Klienci</h1>
            <p>Zarządzaj relacjami i prowadź klientów od kontaktu do sprawy.</p>
          </div>
          <div className="forteca-frt-021-header-actions forteca-frt-021-page-actions">
            <Button
              type="button"
              variant="outline"
              className="forteca-frt-021-button forteca-frt-021-button-secondary forteca-frt-021-import-button"
              onClick={() => toast.info('Import CSV wymaga przygotowania pliku i zostanie zapisany w kolejnym kroku.')}
              data-forteca-frt-021-import="true"
            >
              <CloudUpload aria-hidden="true" />
              Import CSV
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button type="button" className="forteca-frt-021-button forteca-frt-021-button-primary forteca-frt-021-add-button" disabled={!workspace?.id}>
                  <Plus aria-hidden="true" />
                  Dodaj klienta
                  <ChevronDown aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent className="client-case-form-content client-form-stage23-content" data-client-form-stage23="true">
                <DialogHeader className="client-case-form-header">
                  <span className="client-case-form-kicker">KLIENT</span>
                  <DialogTitle>Nowy klient</DialogTitle>
                  <p>Dodaj najważniejsze dane kontaktowe. Resztę można uzupełnić później.</p>
                </DialogHeader>
                <form onSubmit={handleCreateClient} className="client-case-form" data-client-form-fields="contact">
                  <div className="client-case-form-grid">
                    <div className="client-case-form-field client-case-form-field-wide">
                      <Label htmlFor="forteca-frt-021-client-name">Imię / nazwa</Label>
                      <Input
                        id="forteca-frt-021-client-name"
                        value={newClient.name}
                        onChange={(event) => setNewClient((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Np. Jan Kowalski albo Firma ABC"
                        required
                      />
                    </div>
                    <div className="client-case-form-field">
                      <Label htmlFor="forteca-frt-021-client-phone">Telefon</Label>
                      <Input
                        id="forteca-frt-021-client-phone"
                        value={newClient.phone}
                        onChange={(event) => setNewClient((prev) => ({ ...prev, phone: event.target.value }))}
                        placeholder="np. 516 000 000"
                      />
                    </div>
                    <div className="client-case-form-field">
                      <Label htmlFor="forteca-frt-021-client-email">E-mail</Label>
                      <Input
                        id="forteca-frt-021-client-email"
                        type="email"
                        value={newClient.email}
                        onChange={(event) => setNewClient((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="kontakt@email.pl"
                      />
                    </div>
                    <div className="client-case-form-field">
                      <Label htmlFor="forteca-frt-021-client-company">Firma</Label>
                      <Input
                        id="forteca-frt-021-client-company"
                        value={newClient.company}
                        onChange={(event) => setNewClient((prev) => ({ ...prev, company: event.target.value }))}
                        placeholder="Opcjonalnie"
                      />
                    </div>
                    <div className="client-case-form-field">
                      <Label htmlFor="forteca-frt-021-client-last-contact">Ostatni kontakt</Label>
                      <Input
                        id="forteca-frt-021-client-last-contact"
                        type="date"
                        value={newClient.lastContactAt}
                        max={getTodayDateInputValue()}
                        onChange={(event) => setNewClient((prev) => ({ ...prev, lastContactAt: event.target.value }))}
                      />
                    </div>
                    <div className="client-case-form-field client-case-form-field-wide">
                      <Label htmlFor="forteca-frt-021-client-notes">Notatka</Label>
                      <textarea
                        id="forteca-frt-021-client-notes"
                        className="client-case-form-textarea"
                        value={newClient.notes}
                        onChange={(event) => setNewClient((prev) => ({ ...prev, notes: event.target.value }))}
                        placeholder="Krótki kontekst relacji albo ważna informacja."
                      />
                    </div>
                  </div>
                  <DialogFooter className={modalFooterClass('client-case-form-footer')}>
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Anuluj</Button>
                    <Button type="submit" disabled={createPending}>{createPending ? 'Zapisywanie...' : 'Zapisz klienta'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <section className="forteca-frt-021-kpi-grid" aria-label="Podsumowanie klientów">
          <button
            type="button"
            className="forteca-frt-021-kpi forteca-frt-021-kpi-card"
            data-kpi-active={clientRelationFilterStage232C === 'all' && statusFilterStage021 === 'all'}
            onClick={() => { applyClientRelationFilterStage232C('all'); setStatusFilterStage021('all'); }}
          >
            <span className="forteca-frt-021-kpi-icon forteca-frt-021-kpi-icon--blue" data-forteca-frt-021-tone="primary"><UsersRound aria-hidden="true" /></span>
            <span className="forteca-frt-021-kpi-copy">
              <span className="forteca-frt-021-kpi-label">Wszyscy</span>
              <strong className="forteca-frt-021-kpi-value">{allLiveClientsStage021.length}</strong>
              <small className="forteca-frt-021-kpi-helper">niearchiwalni klienci</small>
            </span>
          </button>
          <button
            type="button"
            className="forteca-frt-021-kpi forteca-frt-021-kpi-card"
            data-kpi-active={statusFilterStage021 === 'active' && clientRelationFilterStage232C === 'all'}
            onClick={() => { applyClientRelationFilterStage232C('all'); setStatusFilterStage021('active'); }}
          >
            <span className="forteca-frt-021-kpi-icon forteca-frt-021-kpi-icon--green" data-forteca-frt-021-tone="task"><UserRoundCheck aria-hidden="true" /></span>
            <span className="forteca-frt-021-kpi-copy">
              <span className="forteca-frt-021-kpi-label">Aktywni</span>
              <strong className="forteca-frt-021-kpi-value">{activeClientsStage021.length}</strong>
              <small className="forteca-frt-021-kpi-helper">{activeShareStage021}% wszystkich</small>
            </span>
          </button>
          <button
            type="button"
            className="forteca-frt-021-kpi forteca-frt-021-kpi-card"
            data-kpi-active={clientRelationFilterStage232C === 'without_case'}
            onClick={() => { applyClientRelationFilterStage232C('without_case'); setStatusFilterStage021('all'); }}
          >
            <span className="forteca-frt-021-kpi-icon forteca-frt-021-kpi-icon--amber" data-forteca-frt-021-tone="event"><UserRound aria-hidden="true" /></span>
            <span className="forteca-frt-021-kpi-copy">
              <span className="forteca-frt-021-kpi-label">Bez sprawy</span>
              <strong className="forteca-frt-021-kpi-value">{clientsWithoutCases}</strong>
              <small className="forteca-frt-021-kpi-helper">{withoutCaseShareStage021}% wszystkich</small>
            </span>
          </button>
          <button
            type="button"
            className="forteca-frt-021-kpi forteca-frt-021-kpi-card"
            data-kpi-active={clientRelationFilterStage232C === 'active_commission'}
            onClick={() => { applyClientRelationFilterStage232C('active_commission'); setStatusFilterStage021('all'); }}
          >
            <span className="forteca-frt-021-kpi-icon forteca-frt-021-kpi-icon--purple" data-forteca-frt-021-tone="payment"><CircleDollarSign aria-hidden="true" /></span>
            <span className="forteca-frt-021-kpi-copy">
              <span className="forteca-frt-021-kpi-label">Aktywna prowizja</span>
              <strong className="forteca-frt-021-kpi-value">{formatClientMoney(activeCommissionValueStage232C)}</strong>
              <small className="forteca-frt-021-kpi-helper">z aktywnych spraw</small>
            </span>
          </button>
        </section>

        <section className="forteca-frt-021-table-card forteca-frt-021-list-card" data-forteca-frt-021-list="true">
          <div className="forteca-frt-021-toolbar" data-forteca-frt-021-toolbar="true">
            <label className="forteca-frt-021-search">
              <Search aria-hidden="true" />
              <Input
                placeholder="Szukaj klienta po nazwie, e-mailu lub firmie..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Szukaj klienta po nazwie, e-mailu lub firmie"
              />
            </label>
            <label className="forteca-frt-021-control forteca-frt-021-select">
              <span>Status:</span>
              <select value={statusFilterStage021} onChange={(event) => handleStatusFilterStage021(event.target.value as ClientStatusFilterStage021)} aria-label="Status">
                <option value="all">Wszystkie</option>
                <option value="active">Aktywni</option>
                <option value="in_service">W obsłudze</option>
                <option value="new">Nowy</option>
                <option value="archived">W archiwum</option>
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <label className="forteca-frt-021-control forteca-frt-021-select">
              <span>Opiekun:</span>
              <select value={ownerFilterStage021} onChange={(event) => setOwnerFilterStage021(event.target.value)} aria-label="Opiekun">
                <option value="all">Wszyscy</option>
                {clientOwnerOptionsStage021.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <label className="forteca-frt-021-control forteca-frt-021-select">
              <span>Tag:</span>
              <select value={tagFilterStage021} onChange={(event) => setTagFilterStage021(event.target.value)} aria-label="Tag">
                <option value="all">Wszystkie</option>
                {clientTagOptionsStage021.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <label className="forteca-frt-021-control forteca-frt-021-select">
              <span>Typ relacji:</span>
              <select value={relationTypeFilterStage021} onChange={(event) => setRelationTypeFilterStage021(event.target.value)} aria-label="Typ relacji">
                <option value="all">Wszystkie</option>
                <option value="Osoba">Osoba</option>
                <option value="Firma">Firma</option>
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <button
              type="button"
              className={filterPanelOpenStage021 ? 'forteca-frt-021-toolbar-button forteca-frt-021-filter-button is-open' : 'forteca-frt-021-toolbar-button forteca-frt-021-filter-button'}
              aria-label="Więcej filtrów"
              aria-expanded={filterPanelOpenStage021}
              onClick={() => setFilterPanelOpenStage021((current) => !current)}
            >
              <Filter aria-hidden="true" />
            </button>
          </div>
          {filterPanelOpenStage021 ? (
            <div className="forteca-frt-021-filter-panel" data-forteca-frt-021-filter-panel="true">
              <div>
                <span className="forteca-frt-021-filter-panel-label">Ostatni kontakt</span>
                <div className="forteca-frt-021-filter-panel-pills">
                  <button type="button" className={cadenceFilter === 'all' ? 'is-active' : ''} onClick={() => setCadenceFilter('all')}>Wszystkie</button>
                  {contactCadenceBuckets.map((bucket) => (
                    <button type="button" key={bucket.key} className={cadenceFilter === bucket.key ? 'is-active' : ''} onClick={() => setCadenceFilter(bucket.key)}>
                      {bucket.label} ({contactCadenceGrid.counts[bucket.key] || 0})
                    </button>
                  ))}
                </div>
              </div>
              <Button type="button" variant="outline" onClick={resetClientFiltersStage021}>Wyczyść filtry</Button>
            </div>
          ) : null}

          <div className="forteca-frt-021-table" role="table" aria-label="Lista klientów" data-forteca-frt-021-table="true">
            <div className="forteca-frt-021-table-row forteca-frt-021-row forteca-frt-021-table-head" role="row">
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-checkbox-cell forteca-frt-021-cell--check" role="columnheader">
                <input type="checkbox" checked={selectedVisibleClientsStage021} onChange={toggleVisibleClientSelectionStage021} aria-label="Zaznacz widocznych klientów" />
              </div>
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell" role="columnheader">Klient <span className="forteca-frt-021-sort-mark" aria-hidden="true">⌃</span></div>
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell" role="columnheader">Telefon</div>
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell" role="columnheader">E-mail</div>
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell" role="columnheader">Status</div>
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell" role="columnheader">Aktywna sprawa</div>
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell" role="columnheader">Ostatni kontakt</div>
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell" role="columnheader">Najbliższy ruch</div>
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell" role="columnheader">Prowizja</div>
              <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-action-cell forteca-frt-021-cell--actions" role="columnheader" />
            </div>
            {loading ? (
              <div className="forteca-frt-021-empty forteca-frt-021-empty-row" role="row"><Loader2 className="animate-spin" aria-label="Ładowanie klientów" /> Ładowanie klientów</div>
            ) : visibleClientsStage021.length === 0 ? (
              <div className="forteca-frt-021-empty forteca-frt-021-empty-row" role="row">Brak klientów do wyświetlenia.</div>
            ) : visibleClientsStage021.map((client, index) => {
              const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
              const clientFinance = clientFinanceByClientId.get(client.id) || { activeCommission: 0, lifetimeEarned: 0 };
              const activeCase = (cases as Record<string, unknown>[]).find((caseRow) => getStage35RelationClientId(caseRow) === client.id && isActiveClientCase(caseRow));
              const status = getStage021ClientStatus(client, counters.cases);
              const contact = getStage021ContactDate(client.lastContactAt || getStage021DynamicValue(client, ['lastContactAt', 'last_contact_at']));
              const nearestActionLabel = nearestActionByClientId.get(client.id) || 'Brak zaplanowanej akcji';
              const nearestActionParts = nearestActionLabel.split(' · ');
              const initials = String(client.name || 'K')
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0))
                .join('')
                .toUpperCase();
              const isArchived = Boolean(client.archivedAt);
              return (
                <div className="forteca-frt-021-table-row forteca-frt-021-row forteca-frt-021-data-row" role="row" key={client.id} data-client-id={client.id}>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-checkbox-cell forteca-frt-021-cell--check" role="cell">
                    <input type="checkbox" checked={selectedClientIdsStage021.has(client.id)} onChange={() => toggleClientSelectionStage021(client.id)} aria-label={'Zaznacz klienta ' + (client.name || 'Klient')} />
                  </div>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-client-cell" role="cell">
                    <span className="forteca-frt-021-client-avatar forteca-frt-021-avatar" data-forteca-frt-021-tone={['primary', 'task', 'payment', 'event'][index % 4]} aria-hidden="true">{initials || 'K'}</span>
                    <span className="forteca-frt-021-client-copy">
                      <Link to={'/clients/' + client.id} className="forteca-frt-021-client-name">{client.name || 'Klient'}</Link>
                      <span>{client.company || getStage021RelationType(client)}</span>
                    </span>
                  </div>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-contact-cell" role="cell">
                    {client.phone ? <span className="forteca-frt-021-contact-line"><Phone className="forteca-frt-021-contact-icon" aria-hidden="true" /><span className="forteca-frt-021-contact-value">{client.phone}</span></span> : <span className="forteca-frt-021-contact-muted">—</span>}
                  </div>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-contact-cell" role="cell">
                    {client.email ? <span className="forteca-frt-021-contact-line"><Mail className="forteca-frt-021-contact-icon" aria-hidden="true" /><span className="forteca-frt-021-contact-value">{client.email}</span></span> : <span className="forteca-frt-021-contact-muted">—</span>}
                  </div>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-status-cell" role="cell">
                    <span className="forteca-frt-021-status forteca-frt-021-status-pill" data-forteca-frt-021-status={status === 'in_service' ? 'primary' : status === 'new' ? 'attention' : status}>{getStage021StatusLabel(status)}</span>
                  </div>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-case-cell forteca-frt-021-relation-cell" role="cell">
                    {activeCase ? (
                      <Link to={'/cases/' + String(activeCase.id || '')}>
                        <strong>{getStage021CaseReference(activeCase)}</strong>
                        <span>{getStage021CaseTitle(activeCase)}</span>
                      </Link>
                    ) : <><strong>—</strong><span>Brak sprawy</span></>}
                  </div>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-date-cell" role="cell">
                    <span className="forteca-frt-021-date-value">{contact.date}</span>
                    {contact.time ? <small className="forteca-frt-021-date-meta">{contact.time}</small> : null}
                  </div>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-next-cell forteca-frt-021-relation-cell" role="cell">
                    <CalendarDays aria-hidden="true" />
                    <span><strong>{nearestActionParts[0]}</strong>{nearestActionParts.length > 1 ? <small>{nearestActionParts.slice(1).join(' · ')}</small> : null}</span>
                  </div>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-money-cell forteca-frt-021-finance-cell" role="cell">
                    <span className="forteca-frt-021-finance-value">{clientFinance.activeCommission > 0 ? formatClientMoney(clientFinance.activeCommission) : '—'}</span>
                  </div>
                  <div className="forteca-frt-021-cell forteca-frt-021-table-cell forteca-frt-021-action-cell forteca-frt-021-cell--actions" role="cell">
                    <button
                      type="button"
                      className="forteca-frt-021-action-button forteca-frt-021-more-button"
                      aria-label={'Akcje dla klienta ' + (client.name || 'Klient')}
                      aria-expanded={openActionClientIdStage021 === client.id}
                      onClick={() => setOpenActionClientIdStage021((current) => current === client.id ? null : client.id)}
                    >
                      <MoreHorizontal aria-hidden="true" />
                    </button>
                    {openActionClientIdStage021 === client.id ? (
                      <div className="forteca-frt-021-action-menu" role="menu">
                        <Link to={'/clients/' + client.id} role="menuitem" onClick={() => setOpenActionClientIdStage021(null)}>Otwórz klienta</Link>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={(event) => {
                            setOpenActionClientIdStage021(null);
                            if (isArchived) handleRestoreClient(event, client);
                            else handleArchiveClient(event, client, counters);
                          }}
                        >
                          {isArchived ? 'Przywróć klienta' : 'Przenieś do kosza'}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <footer className="forteca-frt-021-table-footer forteca-frt-021-pagination">
            <span>
              Wyświetlanie {filtered.length === 0 ? 0 : (safeClientPageStage021 - 1) * FRT021_CLIENT_PAGE_SIZE + 1}
              –{Math.min(safeClientPageStage021 * FRT021_CLIENT_PAGE_SIZE, filtered.length)} z {filtered.length} klientów
            </span>
            <nav aria-label="Paginacja klientów">
              <button type="button" className="forteca-frt-021-pagination-button" disabled={safeClientPageStage021 <= 1} onClick={() => setClientPageStage021((page) => Math.max(1, page - 1))}>‹ <span>Poprzednia</span></button>
              {pageItemsStage021.map((item) => item === 'ellipsis' ? (
                <span key="ellipsis" className="forteca-frt-021-page-ellipsis">…</span>
              ) : (
                <button type="button" key={item} className={safeClientPageStage021 === item ? 'forteca-frt-021-pagination-button forteca-frt-021-is-active' : 'forteca-frt-021-pagination-button'} aria-current={safeClientPageStage021 === item ? 'page' : undefined} onClick={() => setClientPageStage021(item)}>{item}</button>
              ))}
              <button type="button" className="forteca-frt-021-pagination-button" disabled={safeClientPageStage021 >= clientPageCountStage021} onClick={() => setClientPageStage021((page) => Math.min(clientPageCountStage021, page + 1))}><span>Następna</span> ›</button>
            </nav>
          </footer>
        </section>
      </div>
    </Layout>
  );

}
// LF-UI-SOT-007 canonical header owner marker: closeflow-page-header-structure-lock.css
// LF-UI-SOT-007 canonical header owner marker: closeflow-page-header-copy-left-only.css
