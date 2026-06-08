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
  CaseEntityIcon,
  LeadEntityIcon,
  PaymentEntityIcon,
} from '../components/ui-system';
import {
  AlertTriangle,
  ChevronRight,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { EntityConflictDialog, type EntityConflictCandidate } from '../components/EntityConflictDialog';
import { ConfirmDialog } from '../components/confirm-dialog';
import { actionIconClass, modalFooterClass } from '../components/entity-actions';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { OperatorSideCard, SimpleFiltersCard, TopValueRecordsCard } from '../components/operator-rail';
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
import { buildRecordOperationalBadges } from '../lib/record-operational-badges';
import {
  buildContactCadenceGrid,
  CONTACT_CADENCE_BUCKETS,
  type ContactCadenceBucketKey,
} from '../lib/owner-control/contact-cadence-grid';
import {
  dateInputToNoonIso,
  getDefaultLastContactDateInput,
  getLastContactDateInputError,
  getTodayDateInputValue,
} from '../lib/owner-control/last-contact-intake';
import { buildTopClientValueEntries } from '../lib/client-value';
import { getCaseFinanceSummary } from '../lib/finance/case-finance-source';
import '../styles/visual-stage23-client-case-forms-vnext.css';
import '../styles/clients-next-action-layout.css';

import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-record-list-source-truth.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-canvas-source-truth-stage211e.css';
const CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CLIENTS = 'CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CLIENTS';
const STAGE30_CLIENTS_TRASH_COPY_REMOVED = 'STAGE30_CLIENTS_TRASH_COPY_REMOVED';
const CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER = 'Szukaj po nazwie, telefonie, e-mailu, firmie albo sprawie...';
const CLOSEFLOW_STAGE134_TRASH_SEARCH_PLACEHOLDER = 'Szukaj w koszu...';

type ClientRecord = {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  lastContactAt?: string | null;
  archivedAt?: string | null;
};
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
void STAGE220A25_CASE_FINANCE_SYNC_FROM_CLIENT_CREATE;
void STAGE223R3_LAST_CONTACT_INTAKE_CLIENTS;
void STAGE225_CONTACT_CADENCE_GRID_CLIENTS;
void STAGE227F6_CLIENTS_CONTACT_CADENCE_COMPACT;

const CLOSEFLOW_CLIENT_VALUE_EXPECTED_NOT_PAID_V29 = 'client list shows expected relation value, not paid amount only';
const STAGE220A36_CLIENTS_COMMISSION_VALUE_SOURCE = 'clients list operational value uses commission due, not transaction price';
const STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL = 'new client starter case opens CaseDetail finance modal instead of collecting finance in client form';
const STAGE228R5R2_CLIENT_CASE_FINANCE_FLOW_LOCK = 'client create modal only asks for case name then redirects to CaseDetail finance editor';
const STAGE226R10_CLIENTS_LIST_SOURCE_TRUTH = 'clients page renders rows only from clients state; leads are relation context only';
void STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL;
void STAGE228R5R2_CLIENT_CASE_FINANCE_FLOW_LOCK;
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
  const [showArchived, setShowArchived] = useState(false);
  const [cadenceFilter, setCadenceFilter] = useState<ContactCadenceBucketKey | 'all'>('all');
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
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '', lastContactAt: getDefaultLastContactDateInput(), notes: '', createCase: true, caseTitle: '', caseCurrency: 'PLN' });

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

  const contactCadenceGrid = useMemo(
    () => buildContactCadenceGrid({
      entityType: 'client',
      records: clients.filter((client) => !client.archivedAt),
    }),
    [clients],
  );

  // STAGE226R10_FILTERED_CLIENT_ROWS_ONLY: main /clients list starts from clients and never maps leads into client rows.
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const activeCadenceIds = cadenceFilter === 'all'
      ? null
      : new Set((contactCadenceGrid.buckets[cadenceFilter] || []).map((row) => row.entityId));
    return clients
      .filter((client) => (showArchived ? Boolean(client.archivedAt) : !client.archivedAt))
      .filter((client) => {
        const matchesCadence = showArchived || !activeCadenceIds || activeCadenceIds.has(String(client.id || ''));
        if (!matchesCadence) return false;
        if (!query) return true;
        return [client.name, client.company, client.email, client.phone].some((entry) => String(entry || '').toLowerCase().includes(query));
      })
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pl'));
  }, [cadenceFilter, clients, contactCadenceGrid, search, showArchived]);

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

  const operationalRecordsByClientId = useMemo(() => {
    const map = new Map<string, unknown[]>();
    const touch = (clientId: string) => {
      if (!map.has(clientId)) map.set(clientId, []);
      return map.get(clientId)!;
    };
    for (const client of clients) {
      const clientId = String(client.id || '').trim();
      if (clientId) touch(clientId).push(client);
    }
    const addRelated = (row: Record<string, unknown>) => {
      const clientId = getStage35RelationClientId(row);
      if (clientId) touch(clientId).push(row);
    };
    for (const row of leads as Record<string, unknown>[]) addRelated(row);
    for (const row of cases as Record<string, unknown>[]) addRelated(row);
    for (const row of payments as Record<string, unknown>[]) addRelated(row);
    for (const row of tasks as Record<string, unknown>[]) addRelated(row);
    for (const row of events as Record<string, unknown>[]) addRelated(row);
    return map;
  }, [cases, clients, events, leads, payments, tasks]);

  const clientsWithCases = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.cases || 0) > 0).length,
    [clients, countersByClientId],
  );
  const clientsWithoutCases = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.cases || 0) === 0).length,
    [clients, countersByClientId],
  );
  const relationValue = useMemo(
    () => clients.filter((client) => !client.archivedAt).reduce((sum, client) => sum + (clientValueByClientId.get(client.id) || 0), 0),
    [clientValueByClientId, clients],
  );
  const staleClients = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.leads || 0) === 0).length,
    [clients, countersByClientId],
  );

  const topClientValueEntries = useMemo(() => {
    return clients
      .filter((client) => !client.archivedAt)
      .map((client) => {
        const value = clientValueByClientId.get(client.id) || 0;
        return {
          key: client.id,
          href: '/clients/' + client.id,
          label: client.name || 'Klient',
          value,
          description: client.company || client.email || client.phone || 'Klient',
        };
      })
      .filter((entry) => entry.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [clients, clientValueByClientId]);

  const resetNewClientForm = () => { setNewClient({ name: '', company: '', email: '', phone: '', lastContactAt: getDefaultLastContactDateInput(), notes: '', createCase: true, caseTitle: '', caseCurrency: 'PLN' }); };

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
      const currency = /^[A-Z]{3}$/.test(String(preparedClient.caseCurrency || '').trim().toUpperCase())
        ? String(preparedClient.caseCurrency || '').trim().toUpperCase()
        : 'PLN';
      const transactionValue = 0;

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
    const preparedClient = { ...newClient, name: newClient.name.trim(), company: newClient.company.trim(), email: newClient.email.trim(), phone: newClient.phone.trim(), lastContactAt: newClient.lastContactAt, notes: newClient.notes.trim(), caseTitle: newClient.caseTitle.trim(), caseCurrency: newClient.caseCurrency.trim().toUpperCase() || 'PLN' };
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

  return (
    <Layout>
      <div className="cf-html-view main-clients-html" data-clients-real-view="true">
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
        <span hidden data-stage220a24-client-archive-confirm="true" />
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
        <CloseFlowPageHeaderV2
          pageKey="clients"
          actions={
            <>
              <div className="head-actions">
                          <Button type="button" variant="outline" className="btn soft-blue" data-cf-header-action="ai">? Zapytaj AI</Button>
                          <Button type="button" variant="outline" className="btn" onClick={() => setShowArchived((current) => !current)}>
                            {showArchived ? <RotateCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                            {showArchived ? 'Pokaż aktywnych' : 'Kosz'}
                            <span className="pill">{showArchived ? activeCount : archivedCount}</span>
                          </Button>
                          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                              <Button className="btn primary" disabled={!workspace?.id}><Plus className="w-4 h-4" /> Dodaj klienta</Button>
                            </DialogTrigger>
                            <DialogContent className="client-case-form-content client-form-stage23-content" data-client-form-stage23="true" data-client-case-form-visual-rebuild={CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CLIENTS}>
                              <DialogHeader className="client-case-form-header">
                                <span className="client-case-form-kicker">KLIENT</span>
                                <DialogTitle>Nowy klient</DialogTitle>
                                <p>Dodaj tylko najważniejsze dane kontaktowe. Resztę można uzupełnić później.</p>
                              </DialogHeader>

                              <form onSubmit={handleCreateClient} className="client-case-form" data-client-form-fields="contact">
                                <section className="client-case-form-section">
                                  <div className="client-case-form-section-head">
                                    <h3>Dane podstawowe</h3>
                                    <p>Minimum potrzebne do zapisania klienta i rozpoczęcia sprawy.</p>
                                  </div>

                                  <div className="client-case-form-grid">
                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Imię / nazwa</Label>
                                      <Input
                                        value={newClient.name}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, name: event.target.value }))}
                                        placeholder="Np. Jan Kowalski albo Firma ABC"
                                        required
                                      />
                                    </div>

                                    <div className="client-case-form-field">
                                      <Label>Telefon</Label>
                                      <Input
                                        value={newClient.phone}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, phone: event.target.value }))}
                                        placeholder="np. 516 000 000"
                                      />
                                    </div>

                                    <div className="client-case-form-field">
                                      <Label>E-mail</Label>
                                      <Input
                                        type="email"
                                        value={newClient.email}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, email: event.target.value }))}
                                        placeholder="kontakt@email.pl"
                                      />
                                    </div>

                                    <div className="client-case-form-field" data-stage223r3-client-last-contact-input="true">
                                      <Label>Ostatni kontakt</Label>
                                      <Input
                                        type="date"
                                        value={newClient.lastContactAt}
                                        max={getTodayDateInputValue()}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, lastContactAt: event.target.value }))}
                                      />
                                      <small className="sub">Jeśli klient wraca po czasie, wpisz dzień ostatniego kontaktu. To wpływa na oznaczenia ciszy 7/14 dni.</small>
                                    </div>

                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Firma</Label>
                                      <Input
                                        value={newClient.company}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, company: event.target.value }))}
                                        placeholder="Opcjonalnie"
                                      />
                                    </div>

                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Notatka</Label>
                                      <textarea
                                        className="client-case-form-textarea"
                                        value={newClient.notes}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, notes: event.target.value }))}
                                        placeholder="Krótki kontekst relacji, źródło albo ważna informacja."
                                      />
                                    </div>
                                  </div>
                                </section>

                                <section className="client-case-form-section" data-stage220a25-client-case-fields="true">
                                  <div className="client-case-form-section-head">
                                    <h3>Sprawa startowa</h3>
                                    <p>Po zapisie otworzymy nową sprawę i okno finansów, gdzie uzupełnisz wartość transakcji, rodzaj prowizji i prowizję.</p>
                                  </div>

                                  <label className="client-case-form-check-row">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(newClient.createCase)}
                                      onChange={(event) => setNewClient((prev) => ({ ...prev, createCase: event.target.checked }))}
                                    />
                                    <span>Utwórz sprawę od razu</span>
                                  </label>

                                  <div className="client-case-form-grid">
                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Nazwa sprawy</Label>
                                      <Input
                                        value={newClient.caseTitle}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, caseTitle: event.target.value }))}
                                        placeholder="Np. Sprzedaż działki, obsługa klienta, zlecenie"
                                      />
                                    </div>

                                    <div className="client-case-form-field">
                                      <Label>Waluta</Label>
                                      <Input
                                        value={newClient.caseCurrency}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, caseCurrency: event.target.value.toUpperCase().slice(0, 3) }))}
                                        placeholder="PLN"
                                      />
                                    </div>
                                  </div>
                                </section>

                                <DialogFooter className={modalFooterClass('client-case-form-footer')}>
                                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Anuluj
                                  </Button>
                                  <Button type="submit" disabled={createPending}>
                                    {createPending ? 'Zapisywanie...' : 'Zapisz klienta'}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
            </>
          }
        />

        <div className="grid-4">
          <StatShortcutCard
            label="Aktywni"
            value={activeCount}
            icon={LeadEntityIcon}
            active={!showArchived}
            onClick={() => setShowArchived(false)}
            title="Pokaż aktywnych klientów"
            ariaLabel="Pokaż aktywnych klientów"
            tone="blue"
            helper="z otwartą sprawą"
          />
          <StatShortcutCard
            label="Bez sprawy"
            value={clientsWithoutCases}
            icon={CaseEntityIcon}
            onClick={() => setShowArchived(false)}
            title="Pokaż klientów bez sprawy"
            ariaLabel="Pokaż klientów bez sprawy"
            tone="neutral"
            helper="tylko kontakt"
          />
          <StatShortcutCard
            label="Prowizja"
            value={formatClientMoney(relationValue)}
            icon={PaymentEntityIcon}
            onClick={() => setShowArchived(false)}
            title="Pokaż prowizję relacji"
            ariaLabel="Pokaż prowizję relacji"
            tone="green"
            helper="do zarobienia"
          />
          <StatShortcutCard
            label="Bez ruchu"
            value={staleClients}
            icon={AlertTriangle}
            onClick={() => setShowArchived(false)}
            title="Pokaż klientów bez ruchu"
            ariaLabel="Pokaż klientów bez ruchu"
            tone="red"
            helper="do sprawdzenia"
          />
        </div>

        <div className="layout-list w-full max-w-none" data-clients-wide-layout="true">
          <div className="stack">
            <div className="search cf-main-search" data-cf-main-search="true" data-clients-search="true" data-cf-main-search-source="stage173">
              <span aria-hidden="true"><Search className="w-4 h-4" /></span>
              <Input placeholder={showArchived ? CLOSEFLOW_STAGE134_TRASH_SEARCH_PLACEHOLDER : CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER} value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Szukaj w klientach" />
            </div>



            {!showArchived ? (
              <div className="cf-contact-cadence-strip w-full max-w-none" data-stage225-contact-cadence-grid="clients" data-stage227f6-contact-cadence-compact="clients">
                <span hidden data-stage225-cadence-14-label="14+ dni ciszy" />
                <div className="cf-contact-cadence-pills">
                  <button
                    type="button"
                    className={cadenceFilter === 'all' ? 'cf-status-pill' : 'pill'}
                    data-cf-status-tone={cadenceFilter === 'all' ? 'blue' : undefined}
                    onClick={() => setCadenceFilter('all')}
                  >
                    Wszystkie ({activeCount})
                  </button>
                  {CONTACT_CADENCE_BUCKETS.map((bucket) => (
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

            {loading ? (
              <div className="table-card w-full max-w-none"><div className="row row-empty"><span className="index"><Loader2 className="w-4 h-4 animate-spin" /></span><span><span className="title">Ładowanie klientów</span><span className="sub">Pobieram dane z aplikacji.</span></span></div></div>
            ) : filtered.length === 0 ? (
              <div className="table-card w-full max-w-none"><div className="row row-empty"><span className="index">0</span><span><span className="title">{showArchived ? 'Kosz klientów jest pusty.' : 'Brak klientów do wyświetlenia.'}</span></span></div></div>
            ) : (
              <div className="table-card w-full max-w-none">
                {filtered.map((client, index) => {
                   const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
                   const isArchived = Boolean(client.archivedAt);
                   const clientValue = clientValueByClientId.get(client.id) || 0;
                   const nearestActionLabel = nearestActionByClientId.get(client.id) || 'Brak zaplanowanej akcji';
                   const operationalBadges = buildRecordOperationalBadges({
                     entityType: 'client',
                     record: client,
                     relatedRecords: operationalRecordsByClientId.get(client.id) || [],
                     hasNextStep: nearestActionLabel !== 'Brak zaplanowanej akcji',
                   });
                   return (
                     <div key={client.id} className="relative group/client-card w-full" data-client-card-wide-layout="true">
                       <Link to={`/clients/${client.id}`} className="block">
                         <div className="row client-row cf-client-row-inline">
                         <span className="index">{index + 1}</span>
                         <span className="lead-main-cell min-w-0 cf-client-main-cell">
                           <span className="title">{client.name || 'Klient'}</span>
                           <span className="cf-list-row-meta">
                             <span className="sub">{client.company || 'Bez firmy'}</span>
                             <span className="cf-list-row-contact">{[client.email, client.phone].filter(Boolean).join(' · ') || 'brak kontaktu'}</span>
                             <span className="cf-list-row-value">{formatClientMoney(clientValue)}</span>
                           </span>
                           <span className="statusline">
                             {isArchived ? <span className="cf-status-pill" data-cf-status-tone="amber">W koszu</span> : counters.cases > 0 ? <span className="cf-status-pill cf-chip-case-active" data-cf-status-tone="green">Aktywna sprawa</span> : <span className="cf-status-pill cf-chip-no-case">Bez sprawy</span>}
                             <span className="cf-status-pill cf-chip-leads-count" data-cf-status-tone="blue">Leady: {counters.leads}</span>
                             <span className="cf-list-row-value cf-chip-client-value" data-stage220a36-client-commission-value="true">Prowizja: {formatClientMoney(clientValue)}</span>
                              {operationalBadges.map((badge) => (
                                <span
                                  key={badge.id}
                                  className="cf-status-pill"
                                  data-cf-status-tone={badge.tone}
                                  data-stage222-r4-client-operational-badge="true"
                                  title={badge.title}
                                >
                                  {badge.label}
                                </span>
                              ))}
                           </span>
                         </span>
                         <span className="lead-value-cell cf-client-cases-cell"><span className="mini">Sprawy</span><strong>{counters.cases}</strong></span>
                         <span className="lead-action-cell client-card-next-action-block cf-client-next-action-panel cf-client-next-action-inline"><span className="mini">Najbliższa akcja</span><strong>{nearestActionLabel}</strong></span>
                         <span className="lead-actions client-card-action-buttons cf-client-row-actions cf-client-row-inline">
                           <span className="btn ghost cf-icon-action-button cf-client-row-open-indicator" aria-hidden="true" title="Otwórz klienta" data-stage220a22-client-chevron="true"><ChevronRight className="h-4 w-4" /></span>
                           <button
                             type="button"
                             aria-label={isArchived ? 'Przywróć klienta' : 'Przenieś klienta do kosza'}
                             title={isArchived ? 'Przywróć klienta' : 'Przenieś klienta do kosza'}
                             disabled={archivePendingId === client.id}
                             onClick={(event) => isArchived ? handleRestoreClient(event, client) : handleArchiveClient(event, client, counters)}
                              className={actionIconClass('danger', 'btn ghost cf-icon-action-button')}
                           >
                             {archivePendingId === client.id ? <Loader2 className="h-4 w-4 animate-spin" /> : isArchived ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                           </button>
                         </span>
                         </div>
                       </Link>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>

          <div className="clients-right-rail">
            <SimpleFiltersCard
              className="client-right-card operator-simple-filters-card"
              title="Filtry proste"
              description=""
              dataTestId="clients-simple-filters-card"
              items={[
                { key: 'active', label: 'Aktywni', value: activeCount, onClick: () => setShowArchived(false) },
                { key: 'without-case', label: 'Bez sprawy', value: clientsWithoutCases, onClick: () => setShowArchived(false) },
                { key: 'stale', label: 'Bez ruchu', value: staleClients, onClick: () => setShowArchived(false) },
                { key: 'trash', label: 'Kosz', value: archivedCount, onClick: () => setShowArchived(true) },
              ]}
            />
            <TopValueRecordsCard
              title="Najwyższa prowizja"
              description=""
              className="operator-top-value-card"
              dataTestId="clients-top-value-records-card"
              dataAttrs={{ 'data-clients-top-value-board': true }}
              items={topClientValueEntries.map((entry) => ({
                key: entry.key,
                href: entry.href || '/clients',
                label: entry.label,
                valueLabel: formatClientMoney(entry.value),
                description: 'description' in entry ? String(entry.description || '') : undefined,
                title: entry.label + ' - ' + formatClientMoney(entry.value),
                dataAttrs: { 'data-clients-top-value-row': true },
              }))}
              emptyLabel="Brak klientów z wyliczoną wartością."
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
