// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Archive,
  CalendarDays,
  CalendarClock,
  ClipboardCheck,
  CircleDollarSign,
  ChevronDown,
  Clock3,
  CloudUpload,
  FilePlus2,
  Flag,
  Filter,
  LayoutGrid,
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
  PhoneCall,
  Plus,
  RotateCcw,
  Search,
  Settings,
  X,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';
import { DeleteActionIcon } from '../components/ui-system/ActionIcon';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import ClientCreateDialog from '../components/ClientCreateDialog';
import { ConfirmDialog } from '../components/confirm-dialog';
import { actionIconClass } from '../components/entity-actions';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchPaymentsFromSupabase,
  fetchTasksFromSupabase,
  updateClientInSupabase,
} from '../lib/supabase-fallback';
import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
import {
  buildContactCadenceGrid,
  buildContactCadenceBuckets,
  type ContactCadenceBucketKey,
  type ContactCadenceRow,
} from '../lib/owner-control/contact-cadence-grid';
import { isActiveClientCase } from '../lib/client-cases';
import { getCaseFinanceSummary, getClientCasesFinanceSummary } from '../lib/finance/case-finance-source';
import { normalizeFinanceDate, normalizeFinancePayment } from '../lib/finance/finance-normalize';
import type { CommissionStatus } from '../lib/finance/finance-types';
import { formatCaseFinanceMoney } from '../components/finance/CaseFinanceEditorDialog';
// LF-UI-SOT-007 shared-source contract: import '../styles/visual-stage23-client-case-forms-vnext.css'; is provided once by App.tsx.
import '../styles/clients-next-action-layout.css';

import '../styles/forteca-clients-all.css';
import '../styles/forteca-clients-without-case.css';
import '../styles/forteca-clients-needs-contact.css';
import '../styles/forteca-clients-commission.css';
import '../styles/forteca-clients-archived.css';
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
  | 'with_case'
  | 'without_case'
  | 'needs_contact'
  | 'overdue_payment'
  | 'inactive'
  | 'active_commission'
  | 'archived';

type ClientStatusFilterStage021 = 'all' | 'active' | 'in_service' | 'new' | 'archived';
type Stage022ContactFilter = 'all' | 'last_7' | 'last_30' | 'older';
type Stage022ViewMode = 'table' | 'compact';
type Stage023ReasonFilter = 'all' | 'no_contact' | 'no_next_step' | 'high_priority';
type Stage023ContactFilter = 'all' | 'last_7' | 'last_30' | 'older' | 'unknown';

const FRT021_CLIENT_PAGE_SIZE = 7;
const FRT024_COMMISSION_PAGE_SIZE = 8;
const FRT025_ARCHIVED_PAGE_SIZE = 10;

type Stage024CommissionStatusFilter = 'all' | CommissionStatus;
type Stage025ArchiveDateFilter = 'all' | 'last_30' | 'last_90' | 'older';

type Stage024CommissionRow = {
  client: ClientRecord;
  caseRecord: Record<string, unknown>;
  caseId: string;
  summary: ReturnType<typeof getCaseFinanceSummary>;
  commissionPayment: ReturnType<typeof normalizeFinancePayment> | null;
  payoutAt: string | null;
};

type Stage025ArchivedRow = {
  client: ClientRecord;
  archivedAt: string | null;
  reason: string;
  owner: string;
  lastCase: Record<string, unknown> | undefined;
  latestActivityAt: string | null;
  canRestore: boolean;
  inactiveOver90Days: boolean;
};

function getStage024RecordId(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = String(row[key] ?? '').trim();
    if (value) return value;
  }
  return '';
}

function getStage024CasePayments(
  caseRecord: Record<string, unknown>,
  payments: Record<string, unknown>[],
  clientId: string,
  clientCaseCount: number,
) {
  const caseId = getStage024RecordId(caseRecord, ['id', 'caseId', 'case_id']);
  return payments.filter((payment) => {
    const paymentCaseId = getStage024RecordId(payment, ['caseId', 'case_id', 'relatedCaseId', 'related_case_id']);
    if (paymentCaseId) return Boolean(caseId && paymentCaseId === caseId);
    if (clientCaseCount !== 1) return false;
    const paymentClientId = getStage024RecordId(payment, ['clientId', 'client_id', 'relatedClientId', 'related_client_id']);
    return Boolean(clientId && paymentClientId && paymentClientId === clientId);
  });
}

function getStage024CasePayoutAt(
  caseRecord: Record<string, unknown>,
  commissionPayment: ReturnType<typeof normalizeFinancePayment> | null,
) {
  if (commissionPayment?.dueAt) return commissionPayment.dueAt;
  return getStage021DynamicText(caseRecord, [
    'commissionDueAt',
    'commission_due_at',
    'payoutAt',
    'payout_at',
    'paymentDueAt',
    'payment_due_at',
    'dueAt',
    'due_at',
  ], '') || null;
}

function getStage024CommissionStatusLabel(status: string) {
  const labels: Record<string, string> = {
    not_set: 'Nieustawiona',
    expected: 'Oczekiwana',
    due: 'Należna',
    partially_paid: 'Częściowo zapłacona',
    paid: 'Zapłacona',
    overdue: 'Zaległa',
  };
  return labels[status] || status;
}

function getStage024SettlementLabel(summary: ReturnType<typeof getCaseFinanceSummary>) {
  if (summary.commissionPaidAmount >= summary.commissionAmount) return 'Rozliczona';
  if (summary.commissionPaidAmount > 0) return 'Częściowo rozliczona';
  return 'Do rozliczenia';
}

function isStage024PayoutWithinSevenDays(value: string | null, now = Date.now()) {
  const parsed = normalizeFinanceDate(value);
  if (!parsed) return false;
  const time = parsed.getTime();
  return time >= now && time <= now + 7 * 24 * 60 * 60 * 1000;
}

function formatStage024Money(value: number, currency = 'PLN') {
  return formatCaseFinanceMoney(value, currency);
}

function formatStage024Date(value: string | null) {
  const parsed = normalizeFinanceDate(value);
  if (!parsed) return '—';
  return parsed.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}

const STAGE025_ARCHIVE_REASON_KEYS = [
  'archiveReason',
  'archive_reason',
  'archivedReason',
  'archived_reason',
];
const STAGE025_ACTIVITY_DATE_KEYS = [
  'lastContactAt',
  'last_contact_at',
  'lastActivityAt',
  'last_activity_at',
  'updatedAt',
  'updated_at',
  'createdAt',
  'created_at',
];
const STAGE025_CASE_DATE_KEYS = [
  'updatedAt',
  'updated_at',
  'lastActivityAt',
  'last_activity_at',
  'createdAt',
  'created_at',
];

function getStage025ArchivedAt(client: ClientRecord) {
  const value = getStage021DynamicValue(client, ['archivedAt', 'archived_at', 'archivedOn', 'archived_on']);
  const normalized = String(value || '').trim();
  return normalized || null;
}

function getStage025ArchiveReason(client: ClientRecord) {
  return getStage021DynamicText(client, STAGE025_ARCHIVE_REASON_KEYS, 'Nie określono');
}

function getStage025Date(value: unknown) {
  const parsed = new Date(String(value || '').trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatStage025Date(value: string | null) {
  const parsed = getStage025Date(value);
  if (!parsed) return 'Brak daty';
  return parsed.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getStage025LatestActivityAt(client: ClientRecord, relatedRecords: unknown[]) {
  const candidates = [client, ...relatedRecords].filter((row): row is Record<string, unknown> => Boolean(row && typeof row === 'object'));
  let latest: Date | null = null;
  for (const row of candidates) {
    for (const key of STAGE025_ACTIVITY_DATE_KEYS) {
      const parsed = getStage025Date(row[key]);
      if (!parsed || parsed.getTime() > Date.now()) continue;
      if (!latest || parsed.getTime() > latest.getTime()) latest = parsed;
    }
  }
  return latest ? latest.toISOString() : null;
}

function getStage025LatestCase(clientId: string, cases: Record<string, unknown>[]) {
  return cases
    .filter((caseRecord) => getStage35RelationClientId(caseRecord) === clientId)
    .sort((left, right) => {
      const leftDate = STAGE025_CASE_DATE_KEYS
        .map((key) => getStage025Date(left[key]))
        .find(Boolean)?.getTime() || 0;
      const rightDate = STAGE025_CASE_DATE_KEYS
        .map((key) => getStage025Date(right[key]))
        .find(Boolean)?.getTime() || 0;
      return rightDate - leftDate;
    })[0];
}

function isStage025InactiveOver90Days(value: string | null, now = Date.now()) {
  const parsed = getStage025Date(value);
  if (!parsed) return false;
  const age = now - parsed.getTime();
  return age >= 90 * 24 * 60 * 60 * 1000;
}

function isStage025InMonth(value: string | null, month: Date) {
  const parsed = getStage025Date(value);
  return Boolean(parsed && parsed.getFullYear() === month.getFullYear() && parsed.getMonth() === month.getMonth());
}

function getStage025ArchiveDeltaLabel(currentCount: number, previousCount: number) {
  if (previousCount <= 0) return 'Brak danych porównawczych';
  const delta = Math.round(((currentCount - previousCount) / previousCount) * 100);
  return `${delta >= 0 ? '↑' : '↓'} ${Math.abs(delta)}% vs poprzedni miesiąc`;
}

function isStage025ArchiveDateFilterMatch(value: string | null, filter: Stage025ArchiveDateFilter, now = Date.now()) {
  if (filter === 'all') return true;
  const parsed = getStage025Date(value);
  if (!parsed) return false;
  const age = now - parsed.getTime();
  if (filter === 'last_30') return age >= 0 && age <= 30 * 24 * 60 * 60 * 1000;
  if (filter === 'last_90') return age >= 0 && age <= 90 * 24 * 60 * 60 * 1000;
  return age > 90 * 24 * 60 * 60 * 1000;
}

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

function getStage022LastContactValue(client: ClientRecord) {
  return getStage021DynamicValue(client, ['lastContactAt', 'last_contact_at', 'lastContact', 'last_contact']);
}

function isStage022WithinDays(value: unknown, days: number, now = Date.now()) {
  const parsed = new Date(String(value || ''));
  if (Number.isNaN(parsed.getTime())) return false;
  const age = now - parsed.getTime();
  return age >= 0 && age <= days * 24 * 60 * 60 * 1000;
}

function isStage022ContactFilterMatch(client: ClientRecord, filter: Stage022ContactFilter) {
  if (filter === 'all') return true;
  const lastContact = getStage022LastContactValue(client);
  if (filter === 'last_7') return isStage022WithinDays(lastContact, 7);
  if (filter === 'last_30') return isStage022WithinDays(lastContact, 30);
  const parsed = new Date(String(lastContact || ''));
  if (Number.isNaN(parsed.getTime())) return true;
  return Date.now() - parsed.getTime() > 30 * 24 * 60 * 60 * 1000;
}

function getStage023AttentionMeta(row: ContactCadenceRow | undefined) {
  if (row?.bucketKey === 'silent_7' || row?.bucketKey === 'silent_14_plus') {
    return { label: 'Wysoki priorytet', tone: 'danger' as const };
  }
  if (row?.bucketKey === 'unknown' || row?.bucketKey === 'silent_3' || row?.bucketKey === 'silent_5') {
    return { label: 'Średni priorytet', tone: 'warning' as const };
  }
  return { label: 'Do kontaktu', tone: 'neutral' as const };
}

function getStage023AttentionReason(row: ContactCadenceRow | undefined) {
  if (!row) return 'Wymaga kontaktu';
  if (row.rescueReason) return row.rescueReason;
  if (row.bucketKey === 'unknown') return 'Brak daty kontaktu';
  if (typeof row.contactSilentDays === 'number') {
    return `${row.contactSilentDays} ${row.contactSilentDays === 1 ? 'dzień' : 'dni'} bez kontaktu`;
  }
  return 'Wymaga kontaktu';
}

function isStage023ContactFilterMatch(row: ContactCadenceRow | undefined, filter: Stage023ContactFilter) {
  if (filter === 'all') return true;
  if (filter === 'unknown') return !row?.lastContactAt;
  if (!row?.lastContactAt) return false;
  if (filter === 'last_7') return isStage022WithinDays(row.lastContactAt, 7);
  if (filter === 'last_30') return isStage022WithinDays(row.lastContactAt, 30);
  const parsed = new Date(row.lastContactAt);
  return !Number.isNaN(parsed.getTime()) && Date.now() - parsed.getTime() > 30 * 24 * 60 * 60 * 1000;
}

function isStage023ReasonFilterMatch(
  row: ContactCadenceRow | undefined,
  nearestAction: string | undefined,
  filter: Stage023ReasonFilter,
) {
  if (filter === 'all') return true;
  if (filter === 'no_contact') return !row?.lastContactAt;
  if (filter === 'no_next_step') return !nearestAction || nearestAction === 'Brak zaplanowanej akcji';
  return getStage023AttentionMeta(row).tone === 'danger';
}

const STAGE023_PAYMENT_DUE_KEYS = ['dueAt', 'due_at', 'dueDate', 'due_date', 'scheduledAt', 'scheduled_at'];
const STAGE023_PAYMENT_STATUS_KEYS = ['status', 'state', 'paymentStatus', 'payment_status'];
const STAGE023_PAYMENT_SETTLED_KEYS = ['paidAt', 'paid_at', 'settledAt', 'settled_at', 'completedAt', 'completed_at'];

function isStage023OverduePayment(row: Record<string, unknown>, now = Date.now()) {
  const status = getStage021DynamicText(row, STAGE023_PAYMENT_STATUS_KEYS).toLowerCase();
  if (['paid', 'settled', 'completed', 'cancelled', 'canceled', 'refunded'].includes(status)) return false;
  if (getStage021DynamicValue(row, STAGE023_PAYMENT_SETTLED_KEYS)) return false;
  const dueAt = getStage021DynamicValue(row, STAGE023_PAYMENT_DUE_KEYS);
  const parsed = new Date(String(dueAt || ''));
  return !Number.isNaN(parsed.getTime()) && parsed.getTime() < now;
}

function getStage022CreatedAtValue(client: ClientRecord) {
  return getStage021DynamicValue(client, ['createdAt', 'created_at', 'insertedAt', 'inserted_at', 'created']);
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
  const location = useLocation();
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
  const [stage022ContactFilter, setStage022ContactFilter] = useState<Stage022ContactFilter>('all');
  const [stage022ViewMode, setStage022ViewMode] = useState<Stage022ViewMode>('table');
  const [stage023ReasonFilter, setStage023ReasonFilter] = useState<Stage023ReasonFilter>('all');
  const [stage023ContactFilter, setStage023ContactFilter] = useState<Stage023ContactFilter>('all');
  const [statusFilterStage021, setStatusFilterStage021] = useState<ClientStatusFilterStage021>('all');
  const [ownerFilterStage021, setOwnerFilterStage021] = useState('all');
  const [tagFilterStage021, setTagFilterStage021] = useState('all');
  const [relationTypeFilterStage021, setRelationTypeFilterStage021] = useState('all');
  const [filterPanelOpenStage021, setFilterPanelOpenStage021] = useState(false);
  const [clientPageStage021, setClientPageStage021] = useState(1);
  const [stage024CommissionStatusFilter, setStage024CommissionStatusFilter] = useState<Stage024CommissionStatusFilter>('all');
  const [stage024OwnerFilter, setStage024OwnerFilter] = useState('all');
  const [stage024Page, setStage024Page] = useState(1);
  const [stage024ColumnsOpen, setStage024ColumnsOpen] = useState(false);
  const [stage024ExportOpen, setStage024ExportOpen] = useState(false);
  const [stage025ArchiveReasonFilter, setStage025ArchiveReasonFilter] = useState('all');
  const [stage025ArchiveDateFilter, setStage025ArchiveDateFilter] = useState<Stage025ArchiveDateFilter>('all');
  const [stage025OwnerFilter, setStage025OwnerFilter] = useState('all');
  const [stage025Page, setStage025Page] = useState(1);
  const [stage025CustomizeOpen, setStage025CustomizeOpen] = useState(false);
  const [selectedClientIdsStage021, setSelectedClientIdsStage021] = useState<Set<string>>(new Set());
  const [openActionClientIdStage021, setOpenActionClientIdStage021] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [archivePendingId, setArchivePendingId] = useState<string | null>(null);
  const [clientArchiveConfirm, setClientArchiveConfirm] = useState<{
    mode: 'archive' | 'restore';
    client: ClientRecord;
    title: string;
    description: string;
  } | null>(null);

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

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('frt025') === 'archived') {
      setClientRelationFilterStage232C('archived');
      setStatusFilterStage021('all');
      setCadenceFilter('all');
      setStage025ArchiveReasonFilter('all');
      setStage025ArchiveDateFilter('all');
      setStage025OwnerFilter('all');
      setStage025Page(1);
    }
    if (query.get('frt024') === 'active-commission') {
      setClientRelationFilterStage232C('active_commission');
      setStatusFilterStage021('all');
      setCadenceFilter('all');
      setStage024CommissionStatusFilter('all');
      setStage024OwnerFilter('all');
      setStage024Page(1);
    }
    if (query.get('frt022') === 'without-case') {
      setClientRelationFilterStage232C('without_case');
      setStatusFilterStage021('all');
    }
    if (query.get('frt023') === 'needs-contact') {
      setClientRelationFilterStage232C('needs_contact');
      setStatusFilterStage021('all');
      setCadenceFilter('all');
      setStage022ContactFilter('all');
      setStage023ReasonFilter('all');
      setStage023ContactFilter('all');
    }
  }, [location.search]);

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

  const contactCadenceRowByClientIdStage023 = useMemo(() => {
    const map = new Map<string, ContactCadenceRow>();
    for (const bucketRows of Object.values(contactCadenceGrid.buckets)) {
      for (const row of bucketRows) map.set(row.entityId, row);
    }
    return map;
  }, [contactCadenceGrid]);

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

  const overduePaymentClientIdsStage023 = useMemo(() => {
    const ids = new Set<string>();
    for (const payment of payments as Record<string, unknown>[]) {
      if (!isStage023OverduePayment(payment)) continue;
      const clientId = getStage35RelationClientId(payment);
      if (clientId) ids.add(clientId);
    }
    return ids;
  }, [payments]);

  const inactiveClientIdsStage023 = useMemo(() => {
    const ids = new Set<string>();
    for (const client of clients) {
      if (client.archivedAt) continue;
      const cadenceRow = contactCadenceRowByClientIdStage023.get(client.id);
      const nearestAction = nearestActionByClientId.get(client.id);
      const hasNextAction = Boolean(nearestAction && nearestAction !== 'Brak zaplanowanej akcji');
      const hasStaleContact = cadenceRow?.bucketKey === 'silent_14_plus' || cadenceRow?.bucketKey === 'unknown';
      if (!hasNextAction && hasStaleContact) ids.add(client.id);
    }
    return ids;
  }, [clients, contactCadenceRowByClientIdStage023, nearestActionByClientId]);

  const activeCommissionValueStage232C = useMemo(
    () => clients
      .filter((client) => !client.archivedAt)
      .reduce((sum, client) => sum + (clientFinanceByClientId.get(client.id)?.activeCommission || 0), 0),
    [clientFinanceByClientId, clients],
  );

  // FRT-024 source chain: activeCommissionRowsStage024 -> clientFinanceByClientId -> getCaseFinanceSummary -> payments.
  const activeCommissionRowsStage024 = useMemo<Stage024CommissionRow[]>(() => {
    const rows: Stage024CommissionRow[] = [];
    for (const client of clients) {
      if (client.archivedAt) continue;
      const clientId = String(client.id || '').trim();
      if (!clientId) continue;
      const clientFinance = clientFinanceByClientId.get(clientId);
      if (!clientFinance || clientFinance.activeCommission <= 0) continue;
      const activeCases = (cases as Record<string, unknown>[])
        .filter((caseRecord) => getStage35RelationClientId(caseRecord) === clientId && isActiveClientCase(caseRecord));
      for (const caseRecord of activeCases) {
        const casePayments = getStage024CasePayments(caseRecord, payments as Record<string, unknown>[], clientId, activeCases.length);
        const summary = getCaseFinanceSummary(caseRecord, casePayments);
        if (summary.commissionAmount <= 0) continue;
        const commissionPayment = casePayments
          .map((payment) => normalizeFinancePayment(payment, summary.currency))
          .filter((payment) => payment.type === 'commission' && payment.status !== 'cancelled')
          .sort((left, right) => {
            const leftTime = normalizeFinanceDate(left.dueAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
            const rightTime = normalizeFinanceDate(right.dueAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
            return leftTime - rightTime;
          })[0] || null;
        rows.push({
          client,
          caseRecord,
          caseId: getStage024RecordId(caseRecord, ['id', 'caseId', 'case_id']),
          summary,
          commissionPayment,
          payoutAt: getStage024CasePayoutAt(caseRecord, commissionPayment),
        });
      }
    }
    return rows.sort((left, right) => {
      const clientOrder = String(left.client.name || '').localeCompare(String(right.client.name || ''), 'pl');
      if (clientOrder !== 0) return clientOrder;
      return String(left.caseRecord.title || left.caseRecord.name || '').localeCompare(String(right.caseRecord.title || right.caseRecord.name || ''), 'pl');
    });
  }, [cases, clientFinanceByClientId, clients, payments]);

  const activeCommissionValueStage024 = useMemo(
    () => activeCommissionRowsStage024.reduce((sum, row) => sum + row.summary.commissionAmount, 0),
    [activeCommissionRowsStage024],
  );
  const activeCommissionClientCountStage024 = useMemo(
    () => new Set(activeCommissionRowsStage024.map((row) => row.client.id)).size,
    [activeCommissionRowsStage024],
  );
  const commissionDueWithinSevenDaysRowsStage024 = useMemo(
    () => activeCommissionRowsStage024.filter((row) => row.summary.commissionRemainingAmount > 0 && isStage024PayoutWithinSevenDays(row.payoutAt)),
    [activeCommissionRowsStage024],
  );
  const commissionDueInSevenDaysStage024 = useMemo(
    () => commissionDueWithinSevenDaysRowsStage024.reduce((sum, row) => sum + row.summary.commissionRemainingAmount, 0),
    [commissionDueWithinSevenDaysRowsStage024],
  );
  const averageActiveCommissionStage024 = activeCommissionClientCountStage024 > 0
    ? activeCommissionValueStage024 / activeCommissionClientCountStage024
    : 0;

  const filteredCommissionRowsStage024 = useMemo(() => {
    const query = search.trim().toLowerCase();
    return activeCommissionRowsStage024.filter((row) => {
      if (stage024CommissionStatusFilter !== 'all' && row.summary.commissionStatus !== stage024CommissionStatusFilter) return false;
      if (stage024OwnerFilter !== 'all' && getStage021ClientOwner(row.client) !== stage024OwnerFilter) return false;
      if (!query) return true;
      const caseReference = getStage021CaseReference(row.caseRecord);
      const caseTitle = getStage021CaseTitle(row.caseRecord);
      return [
        row.client.name,
        row.client.company,
        getStage021ClientOwner(row.client),
        caseReference,
        caseTitle,
      ].some((entry) => String(entry || '').toLowerCase().includes(query));
    });
  }, [activeCommissionRowsStage024, search, stage024CommissionStatusFilter, stage024OwnerFilter]);

  const stage024PageCount = Math.max(1, Math.ceil(filteredCommissionRowsStage024.length / FRT024_COMMISSION_PAGE_SIZE));
  const safeStage024Page = Math.min(stage024Page, stage024PageCount);
  const visibleCommissionRowsStage024 = filteredCommissionRowsStage024.slice(
    (safeStage024Page - 1) * FRT024_COMMISSION_PAGE_SIZE,
    safeStage024Page * FRT024_COMMISSION_PAGE_SIZE,
  );

  useEffect(() => {
    setStage024Page(1);
  }, [search, stage024CommissionStatusFilter, stage024OwnerFilter]);

  useEffect(() => {
    if (stage024Page > stage024PageCount) setStage024Page(stage024PageCount);
  }, [stage024Page, stage024PageCount]);

  const archivedRowsStage025 = useMemo<Stage025ArchivedRow[]>(() => {
    const caseRows = cases as Record<string, unknown>[];
    return clients
      .map((client) => {
        const archivedAt = getStage025ArchivedAt(client);
        if (!archivedAt) return null;
        const relatedRecords = relatedRecordsByClientIdStage232C.get(client.id) || [];
        const latestActivityAt = getStage025LatestActivityAt(client, relatedRecords);
        return {
          client,
          archivedAt,
          reason: getStage025ArchiveReason(client),
          owner: getStage021ClientOwner(client),
          lastCase: getStage025LatestCase(client.id, caseRows),
          latestActivityAt,
          canRestore: true,
          inactiveOver90Days: isStage025InactiveOver90Days(latestActivityAt),
        };
      })
      .filter((row): row is Stage025ArchivedRow => Boolean(row))
      .sort((left, right) => {
        const leftDate = getStage025Date(left.archivedAt)?.getTime() || 0;
        const rightDate = getStage025Date(right.archivedAt)?.getTime() || 0;
        if (leftDate !== rightDate) return rightDate - leftDate;
        return String(left.client.name || '').localeCompare(String(right.client.name || ''), 'pl');
      });
  }, [cases, clients, relatedRecordsByClientIdStage232C]);

  const stage025ArchiveReasonOptions = useMemo(
    () => Array.from(new Set(archivedRowsStage025.map((row) => row.reason))).sort((a, b) => a.localeCompare(b, 'pl')),
    [archivedRowsStage025],
  );

  const stage025OwnerOptions = useMemo(
    () => Array.from(new Set(archivedRowsStage025.map((row) => row.owner))).sort((a, b) => a.localeCompare(b, 'pl')),
    [archivedRowsStage025],
  );

  const filteredArchivedRowsStage025 = useMemo(() => {
    const query = search.trim().toLowerCase();
    return archivedRowsStage025.filter((row) => {
      if (stage025ArchiveReasonFilter !== 'all' && row.reason !== stage025ArchiveReasonFilter) return false;
      if (!isStage025ArchiveDateFilterMatch(row.archivedAt, stage025ArchiveDateFilter)) return false;
      if (stage025OwnerFilter !== 'all' && row.owner !== stage025OwnerFilter) return false;
      if (!query) return true;
      const caseReference = getStage021CaseReference(row.lastCase);
      const caseTitle = getStage021CaseTitle(row.lastCase);
      return [
        row.client.name,
        row.client.company,
        row.client.email,
        row.reason,
        row.owner,
        caseReference,
        caseTitle,
      ].some((entry) => String(entry || '').toLowerCase().includes(query));
    });
  }, [archivedRowsStage025, search, stage025ArchiveDateFilter, stage025ArchiveReasonFilter, stage025OwnerFilter]);

  const stage025PageCount = Math.max(1, Math.ceil(filteredArchivedRowsStage025.length / FRT025_ARCHIVED_PAGE_SIZE));
  const safeStage025Page = Math.min(stage025Page, stage025PageCount);
  const visibleArchivedRowsStage025 = filteredArchivedRowsStage025.slice(
    (safeStage025Page - 1) * FRT025_ARCHIVED_PAGE_SIZE,
    safeStage025Page * FRT025_ARCHIVED_PAGE_SIZE,
  );
  const stage025ArchivedThisMonth = useMemo(() => {
    const now = new Date();
    return archivedRowsStage025.filter((row) => isStage025InMonth(row.archivedAt, now)).length;
  }, [archivedRowsStage025]);
  const stage025ArchivedPreviousMonth = useMemo(() => {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return archivedRowsStage025.filter((row) => isStage025InMonth(row.archivedAt, previousMonth)).length;
  }, [archivedRowsStage025]);
  const stage025ArchiveDeltaLabel = getStage025ArchiveDeltaLabel(stage025ArchivedThisMonth, stage025ArchivedPreviousMonth);
  const stage025RestorableCount = archivedRowsStage025.filter((row) => row.canRestore).length;
  const stage025InactiveOver90Count = archivedRowsStage025.filter((row) => row.inactiveOver90Days).length;

  useEffect(() => {
    setStage025Page(1);
  }, [search, stage025ArchiveDateFilter, stage025ArchiveReasonFilter, stage025OwnerFilter]);

  useEffect(() => {
    if (stage025Page > stage025PageCount) setStage025Page(stage025PageCount);
  }, [stage025Page, stage025PageCount]);

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
        if (clientRelationFilterStage232C === 'with_case') {
          if ((countersByClientId.get(client.id)?.cases || 0) === 0) return false;
        }
        if (clientRelationFilterStage232C === 'without_case') {
          if ((countersByClientId.get(client.id)?.cases || 0) > 0) return false;
        }
        if (clientRelationFilterStage232C === 'needs_contact') {
          if (!needsContactClientIdsStage232C.has(String(client.id || ''))) return false;
        }
        if (clientRelationFilterStage232C === 'overdue_payment') {
          if (!overduePaymentClientIdsStage023.has(String(client.id || ''))) return false;
        }
        if (clientRelationFilterStage232C === 'inactive') {
          if (!inactiveClientIdsStage023.has(String(client.id || ''))) return false;
        }
        if (clientRelationFilterStage232C === 'active_commission') {
          if ((clientFinanceByClientId.get(client.id)?.activeCommission || 0) <= 0) return false;
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
        if (clientRelationFilterStage232C === 'without_case' && !isStage022ContactFilterMatch(client, stage022ContactFilter)) return false;
        if (clientRelationFilterStage232C === 'needs_contact') {
          const cadenceRow = contactCadenceRowByClientIdStage023.get(client.id);
          const nearestAction = nearestActionByClientId.get(client.id);
          if (!isStage023ReasonFilterMatch(cadenceRow, nearestAction, stage023ReasonFilter)) return false;
          if (!isStage023ContactFilterMatch(cadenceRow, stage023ContactFilter)) return false;
        }
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
  }, [cadenceFilter, cases, clientFinanceByClientId, clientRelationFilterStage232C, clients, contactCadenceGrid, contactCadenceRowByClientIdStage023, countersByClientId, inactiveClientIdsStage023, needsContactClientIdsStage232C, nearestActionByClientId, overduePaymentClientIdsStage023, ownerFilterStage021, relationTypeFilterStage021, search, stage022ContactFilter, stage023ContactFilter, stage023ReasonFilter, statusFilterStage021, tagFilterStage021]);

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
  }, [cadenceFilter, clientRelationFilterStage232C, ownerFilterStage021, relationTypeFilterStage021, search, stage022ContactFilter, stage023ContactFilter, stage023ReasonFilter, statusFilterStage021, tagFilterStage021]);

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
    setStage022ContactFilter('all');
    setStage023ReasonFilter('all');
    setStage023ContactFilter('all');
    applyClientRelationFilterStage232C('all');
    setFilterPanelOpenStage021(false);
  };

  const resetArchivedFiltersStage025 = () => {
    setSearch('');
    setStage025ArchiveReasonFilter('all');
    setStage025ArchiveDateFilter('all');
    setStage025OwnerFilter('all');
    setStage025Page(1);
  };

  const exportActiveCommissionStage024 = (scope: 'all' | 'visible') => {
    const rows = scope === 'visible' ? visibleCommissionRowsStage024 : filteredCommissionRowsStage024;
    const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csvRows = [
      ['Klient', 'Wartość prowizji', 'Sprawa', 'Status', 'Etap rozliczenia', 'Termin wypłaty', 'Opiekun'],
      ...rows.map((row) => [
        row.client.name || 'Klient',
        formatStage024Money(row.summary.commissionAmount, row.summary.currency),
        `${getStage021CaseReference(row.caseRecord)} ${getStage021CaseTitle(row.caseRecord)}`.trim(),
        getStage024CommissionStatusLabel(row.summary.commissionStatus),
        getStage024SettlementLabel(row.summary),
        formatStage024Date(row.payoutAt),
        getStage021ClientOwner(row.client),
      ]),
    ];
    const csv = csvRows.map((row) => row.map(escapeCsv).join(';')).join('\n');
    const downloadUrl = window.URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `forteca-aktywna-prowizja-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(downloadUrl);
    setStage024ExportOpen(false);
    toast.success(`Wyeksportowano ${rows.length} ${rows.length === 1 ? 'wiersz' : 'wierszy'} aktywnej prowizji.`);
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
  const withoutCaseClientsStage022 = useMemo(
    () => allLiveClientsStage021.filter((client) => (countersByClientId.get(client.id)?.cases || 0) === 0),
    [allLiveClientsStage021, countersByClientId],
  );
  const newClientsStage022 = useMemo(
    () => withoutCaseClientsStage022.filter((client) => isStage022WithinDays(getStage022CreatedAtValue(client), 30)),
    [withoutCaseClientsStage022],
  );
  const qualificationClientsStage022 = useMemo(
    () => withoutCaseClientsStage022.filter((client) => {
      const status = getStage021ClientStatus(client, 0);
      const hasContactChannel = Boolean(String(client.email || '').trim() || String(client.phone || '').trim());
      return status === 'new' || !hasContactChannel;
    }),
    [withoutCaseClientsStage022],
  );
  const recentContactClientsStage022 = useMemo(
    () => withoutCaseClientsStage022.filter((client) => isStage022WithinDays(getStage022LastContactValue(client), 7)),
    [withoutCaseClientsStage022],
  );
  const isWithoutCaseStage022 = clientRelationFilterStage232C === 'without_case';
  const isActiveCommissionStage024 = new URLSearchParams(location.search).get('frt024') === 'active-commission';
  const isArchivedStage025 = new URLSearchParams(location.search).get('frt025') === 'archived';
  const isNeedsContactStage023 = clientRelationFilterStage232C === 'needs_contact'
    || new URLSearchParams(location.search).get('frt023') === 'needs-contact';
  const pageItemsStage021: Array<number | 'ellipsis'> = clientPageCountStage021 <= 5
    ? Array.from({ length: clientPageCountStage021 }, (_, index) => index + 1)
    : [1, 2, 3, 'ellipsis', clientPageCountStage021];

  const pageItemsStage025: Array<number | 'ellipsis'> = stage025PageCount <= 5
    ? Array.from({ length: stage025PageCount }, (_, index) => index + 1)
    : [1, 2, 3, 'ellipsis', stage025PageCount];

  const renderArchivedStage025 = () => (
    <>
      <nav className="forteca-frt-025-tabs" aria-label="Widoki klientów" data-forteca-frt-025-tabs="true">
        <button
          type="button"
          onClick={() => {
            setClientRelationFilterStage232C('all');
            setStatusFilterStage021('active');
            navigate('/clients');
          }}
          data-forteca-frt-025-tab="active"
        >
          Aktywni
        </button>
        <button type="button" className="is-active" aria-current="page" data-forteca-frt-025-tab="archived">
          Archiwalne
        </button>
        <button
          type="button"
          onClick={() => {
            setClientRelationFilterStage232C('all');
            setStatusFilterStage021('all');
            navigate('/clients');
          }}
          data-forteca-frt-025-tab="all"
        >
          Wszyscy
        </button>
      </nav>

      <section className="forteca-frt-025-kpi-grid" aria-label="Podsumowanie klientów archiwalnych" data-forteca-frt-025-kpis="true">
        <article className="forteca-frt-025-kpi" data-forteca-frt-025-tone="primary">
          <span className="forteca-frt-025-kpi-icon" aria-hidden="true"><Archive /></span>
          <span className="forteca-frt-025-kpi-copy">
            <span className="forteca-frt-025-kpi-label">Klienci w archiwum</span>
            <strong className="forteca-frt-025-kpi-value">{archivedRowsStage025.length}</strong>
            <small className="forteca-frt-025-kpi-helper">Łącznie zarchiwizowanych</small>
          </span>
        </article>
        <article className="forteca-frt-025-kpi" data-forteca-frt-025-tone="warning">
          <span className="forteca-frt-025-kpi-icon" aria-hidden="true"><CalendarDays /></span>
          <span className="forteca-frt-025-kpi-copy">
            <span className="forteca-frt-025-kpi-label">Zarchiwizowani w tym miesiącu</span>
            <strong className="forteca-frt-025-kpi-value">{stage025ArchivedThisMonth}</strong>
            <small className="forteca-frt-025-kpi-helper" data-forteca-frt-025-tone={stage025ArchivedPreviousMonth > 0 ? (stage025ArchivedThisMonth >= stage025ArchivedPreviousMonth ? 'success' : 'danger') : 'neutral'}>{stage025ArchiveDeltaLabel}</small>
          </span>
        </article>
        <article className="forteca-frt-025-kpi" data-forteca-frt-025-tone="success">
          <span className="forteca-frt-025-kpi-icon" aria-hidden="true"><RotateCcw /></span>
          <span className="forteca-frt-025-kpi-copy">
            <span className="forteca-frt-025-kpi-label">Można przywrócić</span>
            <strong className="forteca-frt-025-kpi-value">{stage025RestorableCount}</strong>
            <small className="forteca-frt-025-kpi-helper">Bezpieczny restore bez utraty danych</small>
          </span>
        </article>
        <article className="forteca-frt-025-kpi" data-forteca-frt-025-tone="danger">
          <span className="forteca-frt-025-kpi-icon" aria-hidden="true"><Clock3 /></span>
          <span className="forteca-frt-025-kpi-copy">
            <span className="forteca-frt-025-kpi-label">Nieaktywni &gt; 90 dni</span>
            <strong className="forteca-frt-025-kpi-value">{stage025InactiveOver90Count}</strong>
            <small className="forteca-frt-025-kpi-helper">Do weryfikacji</small>
          </span>
        </article>
      </section>

      <section className="forteca-frt-025-content-grid" data-forteca-frt-025-content="true">
        <section className="forteca-frt-025-list-column" aria-label="Lista klientów archiwalnych">
          <div className="forteca-frt-025-toolbar-shell" aria-label="Narzędzia klientów archiwalnych" data-forteca-frt-025-toolbar="true">
            <div className="forteca-frt-025-toolbar">
              <label className="forteca-frt-025-search">
                <Search aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Szukaj klienta..."
                  aria-label="Szukaj klienta"
                />
              </label>
              <div className="forteca-frt-025-filters" data-forteca-frt-025-filters="true">
                <label className="forteca-frt-025-filter">
                  <span>Powód archiwizacji</span>
                  <select value={stage025ArchiveReasonFilter} onChange={(event) => setStage025ArchiveReasonFilter(event.target.value)} aria-label="Powód archiwizacji">
                    <option value="all">Wszystkie</option>
                    {stage025ArchiveReasonOptions.map((reason) => <option value={reason} key={reason}>{reason}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" />
                </label>
                <label className="forteca-frt-025-filter">
                  <span>Data archiwizacji</span>
                  <select value={stage025ArchiveDateFilter} onChange={(event) => setStage025ArchiveDateFilter(event.target.value as Stage025ArchiveDateFilter)} aria-label="Data archiwizacji">
                    <option value="all">Wszystkie</option>
                    <option value="last_30">Ostatnie 30 dni</option>
                    <option value="last_90">Ostatnie 90 dni</option>
                    <option value="older">Ponad 90 dni</option>
                  </select>
                  <ChevronDown aria-hidden="true" />
                </label>
                <label className="forteca-frt-025-filter">
                  <span>Opiekun</span>
                  <select value={stage025OwnerFilter} onChange={(event) => setStage025OwnerFilter(event.target.value)} aria-label="Opiekun">
                    <option value="all">Wszyscy</option>
                    {stage025OwnerOptions.map((owner) => <option value={owner} key={owner}>{owner}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" />
                </label>
                <button type="button" className="forteca-frt-025-clear-button" onClick={resetArchivedFiltersStage025} data-forteca-frt-025-clear="true">Wyczyść filtry</button>
              </div>
            </div>
            {stage025CustomizeOpen ? (
              <div className="forteca-frt-025-customize-panel" role="region" aria-label="Widoczne kolumny" data-forteca-frt-025-customize-panel="true">
                <strong>Widoczne kolumny</strong>
                <span>Klient · Data archiwizacji · Ostatnia sprawa · Powód · Opiekun · Akcja</span>
              </div>
            ) : null}
          </div>

          <section className="forteca-frt-025-table-card" aria-label="Archiwalni klienci" data-forteca-frt-025-table="true">
            <div className="forteca-frt-025-table-scroll">
              <div className="forteca-frt-025-table" role="table">
                <div className="forteca-frt-025-table-row forteca-frt-025-table-head" role="row">
                  <div className="forteca-frt-025-cell" role="columnheader">Klient</div>
                  <div className="forteca-frt-025-cell" role="columnheader">Data archiwizacji <span aria-hidden="true">↓</span></div>
                  <div className="forteca-frt-025-cell" role="columnheader">Ostatnia sprawa</div>
                  <div className="forteca-frt-025-cell" role="columnheader">Powód</div>
                  <div className="forteca-frt-025-cell" role="columnheader">Opiekun</div>
                  <div className="forteca-frt-025-cell forteca-frt-025-action-cell" role="columnheader">Akcja</div>
                </div>
                {loading ? (
                  <div className="forteca-frt-025-empty" role="row"><Loader2 className="animate-spin" aria-label="Ładowanie klientów archiwalnych" /> Ładowanie klientów</div>
                ) : visibleArchivedRowsStage025.length === 0 ? (
                  <div className="forteca-frt-025-empty" role="row">
                    <Archive aria-hidden="true" />
                    <strong>Brak zarchiwizowanych klientów</strong>
                    <p>Gdy klient zostanie przeniesiony do archiwum, pojawi się tutaj z pełną historią i opcją bezpiecznego przywrócenia.</p>
                  </div>
                ) : visibleArchivedRowsStage025.map((row, index) => {
                  const client = row.client;
                  const caseId = row.lastCase ? getStage024RecordId(row.lastCase, ['id', 'caseId', 'case_id']) : '';
                  const initials = String(client.name || 'K')
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('')
                    .toUpperCase();
                  return (
                    <div className="forteca-frt-025-table-row forteca-frt-025-data-row" role="row" key={client.id} data-forteca-frt-025-row="true" data-client-id={client.id}>
                      <div className="forteca-frt-025-cell forteca-frt-025-client-cell" role="cell">
                        <span className="forteca-frt-025-avatar" data-forteca-frt-025-tone={['primary', 'success', 'warning', 'danger'][index % 4]} aria-hidden="true">{initials || 'K'}</span>
                        <span className="forteca-frt-025-client-copy">
                          <Link to={'/clients/' + client.id}>{client.name || 'Klient'}</Link>
                          <small>{client.company || getStage021RelationType(client)}</small>
                        </span>
                      </div>
                      <div className="forteca-frt-025-cell forteca-frt-025-date-cell" role="cell">{formatStage025Date(row.archivedAt)}</div>
                      <div className="forteca-frt-025-cell forteca-frt-025-case-cell" role="cell">
                        {row.lastCase ? (
                          <span className="forteca-frt-025-case-copy">
                            {caseId ? <Link to={'/cases/' + caseId}>{getStage021CaseReference(row.lastCase)}</Link> : <strong>{getStage021CaseReference(row.lastCase)}</strong>}
                            <small>{getStage021CaseTitle(row.lastCase)}</small>
                          </span>
                        ) : <span className="forteca-frt-025-muted">Brak sprawy</span>}
                      </div>
                      <div className="forteca-frt-025-cell forteca-frt-025-reason-cell" role="cell">{row.reason}</div>
                      <div className="forteca-frt-025-cell forteca-frt-025-owner-cell" role="cell">
                        <span className="forteca-frt-025-owner-avatar" aria-hidden="true">{row.owner.slice(0, 2).toUpperCase()}</span>
                        <span>{row.owner}</span>
                      </div>
                      <div className="forteca-frt-025-cell forteca-frt-025-action-cell" role="cell">
                        <button type="button" className="forteca-frt-025-restore-button" onClick={(event) => handleRestoreClient(event, client)}>
                          <RotateCcw aria-hidden="true" />
                          Przywróć
                        </button>
                        <div className="forteca-frt-025-action-menu-wrap">
                          <button
                            type="button"
                            className="forteca-frt-025-more-button"
                            aria-label={'Akcje dla klienta ' + (client.name || 'Klient')}
                            aria-expanded={openActionClientIdStage021 === client.id}
                            onClick={() => setOpenActionClientIdStage021((current) => current === client.id ? null : client.id)}
                          >
                            <MoreHorizontal aria-hidden="true" />
                          </button>
                          {openActionClientIdStage021 === client.id ? (
                            <div className="forteca-frt-025-action-menu" role="menu">
                              <Link to={'/clients/' + client.id} role="menuitem" onClick={() => setOpenActionClientIdStage021(null)}>Otwórz klienta</Link>
                              <button type="button" role="menuitem" onClick={(event) => { setOpenActionClientIdStage021(null); handleRestoreClient(event, client); }}>Przywróć klienta</button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <footer className="forteca-frt-025-table-footer">
              <span className="forteca-frt-025-result-count">
                Wyświetlanie {filteredArchivedRowsStage025.length === 0 ? 0 : (safeStage025Page - 1) * FRT025_ARCHIVED_PAGE_SIZE + 1}–{Math.min(safeStage025Page * FRT025_ARCHIVED_PAGE_SIZE, filteredArchivedRowsStage025.length)} z {filteredArchivedRowsStage025.length}
              </span>
              <nav className="forteca-frt-025-pagination" aria-label="Paginacja klientów archiwalnych">
                <button type="button" className="forteca-frt-025-pagination-button" disabled={safeStage025Page <= 1} onClick={() => setStage025Page((page) => Math.max(1, page - 1))}>‹</button>
                {pageItemsStage025.map((item) => item === 'ellipsis'
                  ? <span key="ellipsis" className="forteca-frt-025-page-ellipsis">…</span>
                  : <button type="button" key={item} className={safeStage025Page === item ? 'forteca-frt-025-pagination-button is-active' : 'forteca-frt-025-pagination-button'} aria-current={safeStage025Page === item ? 'page' : undefined} onClick={() => setStage025Page(item)}>{item}</button>)}
                <button type="button" className="forteca-frt-025-pagination-button" disabled={safeStage025Page >= stage025PageCount} onClick={() => setStage025Page((page) => Math.min(stage025PageCount, page + 1))}>›</button>
                <span className="forteca-frt-025-page-size">10 / strona</span>
              </nav>
            </footer>
          </section>
        </section>

        <aside className="forteca-frt-025-guide" aria-label="Informacje o klientach archiwalnych" data-forteca-frt-025-guide="true">
          <div className="forteca-frt-025-guide-icon" aria-hidden="true"><Archive /></div>
          <h2>Klienci archiwalni</h2>
          <p>Archiwum pomaga zachować porządek na aktywnej liście bez utraty historii relacji z klientem.</p>
          <div className="forteca-frt-025-guide-info">
            <ClipboardCheck aria-hidden="true" />
            <p><strong>Archiwizacja nie usuwa danych.</strong> Wszystkie informacje, sprawy i historia pozostają bezpieczne.</p>
          </div>
          <button type="button" className="forteca-frt-025-guide-link" onClick={() => toast.info('Archiwizacja ukrywa klienta z aktywnej listy, ale nie usuwa jego danych.')}>Dowiedz się więcej <span aria-hidden="true">→</span></button>
        </aside>
      </section>
    </>
  );

  const renderActiveCommissionStage024 = () => {
    const pageItems: Array<number | 'ellipsis'> = stage024PageCount <= 5
      ? Array.from({ length: stage024PageCount }, (_, index) => index + 1)
      : [1, 2, 3, 'ellipsis', stage024PageCount];

    return (
      <>
        <nav className="forteca-frt-024-tabs" aria-label="Widoki klientów" data-forteca-frt-024-tabs="true">
          <button
            type="button"
            onClick={() => navigate('/clients')}
            data-forteca-frt-024-tab="all"
          >
            Lista klientów
          </button>
          <button
            type="button"
            className="is-active"
            aria-current="page"
            data-forteca-frt-024-tab="active-commission"
          >
            Aktywna prowizja
          </button>
          <button
            type="button"
            onClick={() => toast.info('Historia prowizji będzie dostępna po zamknięciu bieżącego okresu rozliczeniowego.')}
            data-forteca-frt-024-tab="commission-history"
          >
            Historia prowizji
          </button>
          <button
            type="button"
            onClick={() => toast.info('Segmenty klientów są przygotowywane na podstawie aktywnych relacji.')}
            data-forteca-frt-024-tab="segments"
          >
            Segmenty klientów
          </button>
        </nav>

        <section className="forteca-frt-024-kpi-grid" aria-label="Podsumowanie aktywnej prowizji" data-forteca-frt-024-kpis="true">
          <article className="forteca-frt-024-kpi" data-forteca-frt-024-tone="primary">
            <span className="forteca-frt-024-kpi-icon" aria-hidden="true"><CircleDollarSign /></span>
            <span className="forteca-frt-024-kpi-copy">
              <span className="forteca-frt-024-kpi-label">Łączna aktywna prowizja</span>
              <strong className="forteca-frt-024-kpi-value">{formatClientMoney(activeCommissionValueStage024)}</strong>
              <small className="forteca-frt-024-kpi-helper" data-forteca-frt-024-tone="success">{activeCommissionClientCountStage024} aktywnych klientów</small>
            </span>
          </article>
          <article className="forteca-frt-024-kpi" data-forteca-frt-024-tone="primary">
            <span className="forteca-frt-024-kpi-icon" aria-hidden="true"><UsersRound /></span>
            <span className="forteca-frt-024-kpi-copy">
              <span className="forteca-frt-024-kpi-label">Liczba klientów</span>
              <strong className="forteca-frt-024-kpi-value">{activeCommissionClientCountStage024}</strong>
              <small className="forteca-frt-024-kpi-helper" data-forteca-frt-024-tone="success">Aktywne sprawy z prowizją</small>
            </span>
          </article>
          <article className="forteca-frt-024-kpi" data-forteca-frt-024-tone="warning">
            <span className="forteca-frt-024-kpi-icon" aria-hidden="true"><CalendarClock /></span>
            <span className="forteca-frt-024-kpi-copy">
              <span className="forteca-frt-024-kpi-label">Do wypłaty w 7 dni</span>
              <strong className="forteca-frt-024-kpi-value">{formatStage024Money(commissionDueInSevenDaysStage024)}</strong>
              <small className="forteca-frt-024-kpi-helper" data-forteca-frt-024-tone="warning">● {commissionDueWithinSevenDaysRowsStage024.length} prowizji</small>
            </span>
          </article>
          <article className="forteca-frt-024-kpi" data-forteca-frt-024-tone="payment">
            <span className="forteca-frt-024-kpi-icon" aria-hidden="true"><CircleDollarSign /></span>
            <span className="forteca-frt-024-kpi-copy">
              <span className="forteca-frt-024-kpi-label">Średnia prowizja na klienta</span>
              <strong className="forteca-frt-024-kpi-value">{formatStage024Money(averageActiveCommissionStage024)}</strong>
              <small className="forteca-frt-024-kpi-helper" data-forteca-frt-024-tone="success">Na podstawie aktywnych spraw</small>
            </span>
          </article>
        </section>

        <section className="forteca-frt-024-toolbar-shell" aria-label="Narzędzia aktywnej prowizji" data-forteca-frt-024-toolbar="true">
          <div className="forteca-frt-024-toolbar">
            <label className="forteca-frt-024-search" data-forteca-frt-024-search="true">
              <Search aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Szukaj klienta, sprawy lub opiekuna..."
                aria-label="Szukaj klienta, sprawy lub opiekuna"
              />
            </label>
            <div className="forteca-frt-024-toolbar-actions">
              <button
                type="button"
                className={filterPanelOpenStage021 ? 'forteca-frt-024-toolbar-button is-open' : 'forteca-frt-024-toolbar-button'}
                aria-expanded={filterPanelOpenStage021}
                aria-label="Filtry"
                onClick={() => setFilterPanelOpenStage021((current) => !current)}
                data-forteca-frt-024-filter="true"
              >
                <Filter aria-hidden="true" />
                Filtry
              </button>
              <button
                type="button"
                className={stage024ColumnsOpen ? 'forteca-frt-024-toolbar-button forteca-frt-024-toolbar-button--columns is-open' : 'forteca-frt-024-toolbar-button forteca-frt-024-toolbar-button--columns'}
                aria-expanded={stage024ColumnsOpen}
                aria-label="Kolumny"
                onClick={() => setStage024ColumnsOpen((current) => !current)}
                data-forteca-frt-024-columns="true"
              >
                <LayoutGrid aria-hidden="true" />
                Kolumny
                <ChevronDown aria-hidden="true" />
              </button>
              <button
                type="button"
                className="forteca-frt-024-toolbar-button forteca-frt-024-toolbar-button--refresh"
                aria-label="Odśwież dane"
                onClick={() => void reload()}
              >
                <RotateCcw aria-hidden="true" />
              </button>
            </div>
          </div>
          {filterPanelOpenStage021 ? (
            <div className="forteca-frt-024-customize-panel" data-forteca-frt-024-filter-panel="true">
              <label className="forteca-frt-024-control">
                <span>Status prowizji:</span>
                <select value={stage024CommissionStatusFilter} onChange={(event) => setStage024CommissionStatusFilter(event.target.value as Stage024CommissionStatusFilter)} aria-label="Status prowizji">
                  <option value="all">Wszystkie</option>
                  <option value="expected">Oczekiwana</option>
                  <option value="due">Należna</option>
                  <option value="partially_paid">Częściowo zapłacona</option>
                  <option value="paid">Zapłacona</option>
                  <option value="overdue">Zaległa</option>
                </select>
              </label>
              <label className="forteca-frt-024-control">
                <span>Opiekun:</span>
                <select value={stage024OwnerFilter} onChange={(event) => setStage024OwnerFilter(event.target.value)} aria-label="Opiekun prowizji">
                  <option value="all">Wszyscy</option>
                  {clientOwnerOptionsStage021.map((owner) => <option value={owner} key={owner}>{owner}</option>)}
                </select>
              </label>
              <button type="button" className="forteca-frt-024-header-button" onClick={() => { setStage024CommissionStatusFilter('all'); setStage024OwnerFilter('all'); }}>
                Wyczyść filtry
              </button>
            </div>
          ) : null}
          {stage024ColumnsOpen ? (
            <div className="forteca-frt-024-customize-panel" data-forteca-frt-024-columns-panel="true">
              <span className="forteca-frt-024-control"><strong>Widoczne kolumny</strong></span>
              <span className="forteca-frt-024-control">Klient · Wartość prowizji · Sprawa · Status · Etap rozliczenia · Termin wypłaty · Opiekun</span>
            </div>
          ) : null}
        </section>

        <section className="forteca-frt-024-table-card" aria-label="Aktywne prowizje klientów" data-forteca-frt-024-table="true">
          <div className="forteca-frt-024-table-scroll">
            <div className="forteca-frt-024-table" role="table">
              <div className="forteca-frt-024-table-row forteca-frt-024-table-head" role="row">
                <div className="forteca-frt-024-cell" role="columnheader">Klient</div>
                <div className="forteca-frt-024-cell" role="columnheader">Wartość prowizji <span aria-hidden="true">↑↓</span></div>
                <div className="forteca-frt-024-cell" role="columnheader">Sprawa</div>
                <div className="forteca-frt-024-cell" role="columnheader">Status</div>
                <div className="forteca-frt-024-cell" role="columnheader">Etap rozliczenia</div>
                <div className="forteca-frt-024-cell" role="columnheader">Termin wypłaty <span aria-hidden="true">↓</span></div>
                <div className="forteca-frt-024-cell" role="columnheader">Opiekun</div>
                <div className="forteca-frt-024-cell forteca-frt-024-action-cell" role="columnheader" />
              </div>
              {loading ? (
                <div className="forteca-frt-024-empty" role="row"><Loader2 className="animate-spin" aria-label="Ładowanie aktywnych prowizji" /> Ładowanie danych finansowych</div>
              ) : visibleCommissionRowsStage024.length === 0 ? (
                <div className="forteca-frt-024-empty" role="row">
                  <CircleDollarSign aria-hidden="true" />
                  <strong>Brak aktywnych prowizji</strong>
                  <p>Nie znaleziono aktywnych spraw z należną prowizją dla bieżącego zakresu.</p>
                </div>
              ) : visibleCommissionRowsStage024.map((row, index) => {
                const client = row.client;
                const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
                const statusTone = row.summary.commissionStatus === 'paid'
                  ? 'success'
                  : row.summary.commissionStatus === 'overdue'
                    ? 'danger'
                    : row.summary.commissionStatus === 'not_set'
                      ? 'neutral'
                      : 'warning';
                const settlementTone = row.summary.commissionPaidAmount >= row.summary.commissionAmount
                  ? 'success'
                  : row.summary.commissionPaidAmount > 0
                    ? 'payment'
                    : 'warning';
                const initials = String(client.name || 'K')
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part.charAt(0))
                  .join('')
                  .toUpperCase();
                const owner = getStage021ClientOwner(client);
                return (
                  <div className="forteca-frt-024-table-row" role="row" key={`${client.id}-${row.caseId || index}`} data-forteca-frt-024-row="true" data-client-id={client.id}>
                    <div className="forteca-frt-024-cell forteca-frt-024-client-cell" role="cell">
                      <span className="forteca-frt-024-avatar" data-forteca-frt-024-tone={['primary', 'success', 'payment', 'warning'][index % 4]} aria-hidden="true">{initials || 'K'}</span>
                      <span className="forteca-frt-024-client-copy">
                        <Link to={'/clients/' + client.id}>{client.name || 'Klient'}</Link>
                        <small>{client.company || getStage021RelationType(client)}</small>
                      </span>
                    </div>
                    <div className="forteca-frt-024-cell forteca-frt-024-commission-cell" role="cell">
                      <strong>{formatStage024Money(row.summary.commissionAmount, row.summary.currency)}</strong>
                      <small>{row.summary.commissionRemainingAmount > 0 ? 'Pozostało do rozliczenia' : 'Rozliczona kwota'}</small>
                    </div>
                    <div className="forteca-frt-024-cell forteca-frt-024-case-cell" role="cell">
                      <span className="forteca-frt-024-case-copy">
                        {row.caseId ? <Link to={'/cases/' + row.caseId}>{getStage021CaseReference(row.caseRecord)}</Link> : <strong>{getStage021CaseReference(row.caseRecord)}</strong>}
                        <small>{getStage021CaseTitle(row.caseRecord)}</small>
                      </span>
                    </div>
                    <div className="forteca-frt-024-cell" role="cell">
                      <span className="forteca-frt-024-status" data-forteca-frt-024-tone={statusTone}>{getStage024CommissionStatusLabel(row.summary.commissionStatus)}</span>
                    </div>
                    <div className="forteca-frt-024-cell" role="cell">
                      <span className="forteca-frt-024-settlement" data-forteca-frt-024-tone={settlementTone}>
                        <CircleDollarSign aria-hidden="true" data-forteca-frt-024-icon="true" />
                        {getStage024SettlementLabel(row.summary)}
                      </span>
                    </div>
                    <div className="forteca-frt-024-cell forteca-frt-024-date-cell" role="cell" data-forteca-frt-024-tone={isStage024PayoutWithinSevenDays(row.payoutAt) ? 'warning' : undefined}>
                      <strong>{formatStage024Date(row.payoutAt)}</strong>
                      <small>{row.payoutAt ? (isStage024PayoutWithinSevenDays(row.payoutAt) ? 'W ciągu 7 dni' : 'Termin płatności') : 'Brak terminu'}</small>
                    </div>
                    <div className="forteca-frt-024-cell forteca-frt-024-owner-cell" role="cell">
                      <span className="forteca-frt-024-owner-avatar" aria-hidden="true">{owner.slice(0, 2).toUpperCase()}</span>
                      <span className="forteca-frt-024-owner-copy"><strong>{owner}</strong><small>Opiekun klienta</small></span>
                    </div>
                    <div className="forteca-frt-024-cell forteca-frt-024-action-cell" role="cell">
                      <button
                        type="button"
                        className="forteca-frt-024-more-button"
                        aria-label={'Akcje dla klienta ' + (client.name || 'Klient')}
                        aria-expanded={openActionClientIdStage021 === client.id}
                        onClick={() => setOpenActionClientIdStage021((current) => current === client.id ? null : client.id)}
                      >
                        <MoreHorizontal aria-hidden="true" />
                      </button>
                      {openActionClientIdStage021 === client.id ? (
                        <div className="forteca-frt-024-action-menu" role="menu">
                          <Link to={'/clients/' + client.id} role="menuitem" onClick={() => setOpenActionClientIdStage021(null)}>Otwórz klienta</Link>
                          <button type="button" role="menuitem" onClick={(event) => { setOpenActionClientIdStage021(null); handleArchiveClient(event, client, counters); }}>Przenieś do kosza</button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <footer className="forteca-frt-024-table-footer">
            <span className="forteca-frt-024-result-count">
              {filteredCommissionRowsStage024.length === 0 ? 0 : (safeStage024Page - 1) * FRT024_COMMISSION_PAGE_SIZE + 1}–{Math.min(safeStage024Page * FRT024_COMMISSION_PAGE_SIZE, filteredCommissionRowsStage024.length)} z {filteredCommissionRowsStage024.length} pozycji
            </span>
            <nav className="forteca-frt-024-pagination" aria-label="Paginacja aktywnej prowizji">
              <button type="button" className="forteca-frt-024-pagination-button" disabled={safeStage024Page <= 1} onClick={() => setStage024Page((page) => Math.max(1, page - 1))}>‹ <span>Poprzednia</span></button>
              {pageItems.map((item) => item === 'ellipsis'
                ? <span key="ellipsis" className="forteca-frt-024-page-ellipsis">…</span>
                : <button type="button" key={item} className={safeStage024Page === item ? 'forteca-frt-024-pagination-button is-active' : 'forteca-frt-024-pagination-button'} aria-current={safeStage024Page === item ? 'page' : undefined} onClick={() => setStage024Page(item)}>{item}</button>)}
              <button type="button" className="forteca-frt-024-pagination-button" disabled={safeStage024Page >= stage024PageCount} onClick={() => setStage024Page((page) => Math.min(stage024PageCount, page + 1))}><span>Następna</span> ›</button>
            </nav>
            <label className="forteca-frt-024-page-size">{FRT024_COMMISSION_PAGE_SIZE} / strona</label>
          </footer>
        </section>
      </>
    );
  };

  const renderNeedsContactStage023 = () => (
    <>
      <nav className="forteca-frt-023-tabs" aria-label="Widoki klientów" data-forteca-frt-023-tabs="true">
        <button
          type="button"
          className={clientRelationFilterStage232C === 'all' && statusFilterStage021 === 'all' ? 'is-active' : ''}
          aria-current={clientRelationFilterStage232C === 'all' && statusFilterStage021 === 'all' ? 'page' : undefined}
          onClick={() => { applyClientRelationFilterStage232C('all'); setStatusFilterStage021('all'); }}
          data-forteca-frt-023-tab="all"
        >
          Wszyscy klienci <span>{allLiveClientsStage021.length}</span>
        </button>
        <button
          type="button"
          className={clientRelationFilterStage232C === 'all' && statusFilterStage021 === 'active' ? 'is-active' : ''}
          aria-current={clientRelationFilterStage232C === 'all' && statusFilterStage021 === 'active' ? 'page' : undefined}
          onClick={() => { applyClientRelationFilterStage232C('all'); setStatusFilterStage021('active'); }}
          data-forteca-frt-023-tab="active"
        >
          Aktywni <span>{activeClientsStage021.length}</span>
        </button>
        <button
          type="button"
          className={clientRelationFilterStage232C === 'needs_contact' ? 'is-active' : ''}
          aria-current={clientRelationFilterStage232C === 'needs_contact' ? 'page' : undefined}
          onClick={() => { applyClientRelationFilterStage232C('needs_contact'); setStatusFilterStage021('all'); }}
          data-forteca-frt-023-tab="needs-contact"
        >
          Wymaga kontaktu <span className="forteca-frt-023-tab-badge">{needsContactClientIdsStage232C.size}</span>
        </button>
        <button
          type="button"
          className={clientRelationFilterStage232C === 'overdue_payment' ? 'is-active' : ''}
          aria-current={clientRelationFilterStage232C === 'overdue_payment' ? 'page' : undefined}
          onClick={() => { applyClientRelationFilterStage232C('overdue_payment'); setStatusFilterStage021('all'); }}
          data-forteca-frt-023-tab="overdue-payment"
        >
          Z opóźnionymi płatnościami <span>{overduePaymentClientIdsStage023.size}</span>
        </button>
        <button
          type="button"
          className={clientRelationFilterStage232C === 'inactive' ? 'is-active' : ''}
          aria-current={clientRelationFilterStage232C === 'inactive' ? 'page' : undefined}
          onClick={() => { applyClientRelationFilterStage232C('inactive'); setStatusFilterStage021('all'); }}
          data-forteca-frt-023-tab="inactive"
        >
          Bez aktywności <span>{inactiveClientIdsStage023.size}</span>
        </button>
      </nav>

      <section className="forteca-frt-023-toolbar-shell" data-forteca-frt-023-toolbar-shell="true">
        <div className="forteca-frt-023-toolbar" data-forteca-frt-023-toolbar="true">
          <label className="forteca-frt-023-search">
            <Search aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Szukaj klienta, firmy, e-maila lub telefonu..."
              aria-label="Szukaj klienta, firmy, e-maila lub telefonu"
              data-forteca-frt-023-search="true"
            />
          </label>
          <label className="forteca-frt-023-control">
            <span>Powód:</span>
            <select value={stage023ReasonFilter} onChange={(event) => setStage023ReasonFilter(event.target.value as Stage023ReasonFilter)} aria-label="Powód">
              <option value="all">Wszystkie</option>
              <option value="no_contact">Brak daty kontaktu</option>
              <option value="no_next_step">Brak następnego kroku</option>
              <option value="high_priority">Wysoki priorytet</option>
            </select>
          </label>
          <label className="forteca-frt-023-control">
            <span>Opiekun:</span>
            <select value={ownerFilterStage021} onChange={(event) => setOwnerFilterStage021(event.target.value)} aria-label="Opiekun">
              <option value="all">Wszyscy</option>
              {clientOwnerOptionsStage021.map((owner) => <option value={owner} key={owner}>{owner}</option>)}
            </select>
          </label>
          <label className="forteca-frt-023-control">
            <span>Ostatni kontakt:</span>
            <select value={stage023ContactFilter} onChange={(event) => setStage023ContactFilter(event.target.value as Stage023ContactFilter)} aria-label="Ostatni kontakt">
              <option value="all">Dowolny</option>
              <option value="last_7">Ostatnie 7 dni</option>
              <option value="last_30">Ostatnie 30 dni</option>
              <option value="older">Ponad 30 dni</option>
              <option value="unknown">Brak daty</option>
            </select>
          </label>
          <button type="button" className="forteca-frt-023-clear-button" onClick={resetClientFiltersStage021} aria-label="Wyczyść filtry" data-forteca-frt-023-clear="true">
            <X aria-hidden="true" />
            Wyczyść filtry
          </button>
        </div>
        {filterPanelOpenStage021 ? (
          <div className="forteca-frt-023-customize-panel" data-forteca-frt-023-customize-panel="true">
            <label className="forteca-frt-023-control">
              <span>Tag:</span>
              <select value={tagFilterStage021} onChange={(event) => setTagFilterStage021(event.target.value)} aria-label="Tag">
                <option value="all">Wszystkie</option>
                {clientTagOptionsStage021.map((tag) => <option value={tag} key={tag}>{tag}</option>)}
              </select>
            </label>
            <label className="forteca-frt-023-control">
              <span>Typ relacji:</span>
              <select value={relationTypeFilterStage021} onChange={(event) => setRelationTypeFilterStage021(event.target.value)} aria-label="Typ relacji">
                <option value="all">Wszystkie</option>
                <option value="Firma">Firma</option>
                <option value="Osoba">Osoba</option>
              </select>
            </label>
          </div>
        ) : null}
      </section>

      <section className="forteca-frt-023-table-card" data-forteca-frt-023-table-card="true">
        <div className="forteca-frt-023-table" role="table" aria-label="Klienci wymagający kontaktu" data-forteca-frt-023-table="true">
          <div className="forteca-frt-023-table-row forteca-frt-023-table-head" role="row">
            <div className="forteca-frt-023-cell" role="columnheader">Klient</div>
            <div className="forteca-frt-023-cell" role="columnheader">Powód</div>
            <div className="forteca-frt-023-cell" role="columnheader">Ostatni kontakt <span aria-hidden="true">⌄</span></div>
            <div className="forteca-frt-023-cell" role="columnheader">Najbliższy ruch</div>
            <div className="forteca-frt-023-cell" role="columnheader">Opiekun</div>
            <div className="forteca-frt-023-cell forteca-frt-023-action-cell" role="columnheader">Akcja</div>
          </div>
          {loading ? (
            <div className="forteca-frt-023-empty" role="row"><Loader2 className="animate-spin" aria-label="Ładowanie klientów" /> Ładowanie klientów</div>
          ) : visibleClientsStage021.length === 0 ? (
            <div className="forteca-frt-023-empty" role="row">Brak klientów wymagających kontaktu do wyświetlenia.</div>
          ) : visibleClientsStage021.map((client, index) => {
            const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
            const cadenceRow = contactCadenceRowByClientIdStage023.get(client.id);
            const attention = getStage023AttentionMeta(cadenceRow);
            const contact = getStage021ContactDate(cadenceRow?.lastContactAt);
            const nearestActionLabel = nearestActionByClientId.get(client.id) || 'Brak zaplanowanej akcji';
            const nearestActionParts = nearestActionLabel.split(' · ');
            const hasNextAction = nearestActionLabel !== 'Brak zaplanowanej akcji';
            const NextActionIcon = /telefon|zadzwoń|call/i.test(nearestActionLabel)
              ? PhoneCall
              : /spotkan|termin|meeting/i.test(nearestActionLabel)
                ? CalendarClock
                : ClipboardCheck;
            const initials = String(client.name || 'K')
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part.charAt(0))
              .join('')
              .toUpperCase();
            const phoneHref = client.phone ? `tel:${String(client.phone).replace(/[^\d+]/g, '')}` : '';
            const emailHref = client.email ? `mailto:${String(client.email)}` : '';
            const actionLabel = phoneHref ? 'Zadzwoń' : emailHref ? 'Napisz' : hasNextAction ? 'Otwórz klienta' : 'Ustaw ruch';
            return (
              <div className="forteca-frt-023-table-row" role="row" key={client.id} data-forteca-frt-023-row="true" data-forteca-frt-023-tone={attention.tone} data-client-id={client.id}>
                <div className="forteca-frt-023-cell forteca-frt-023-client-cell" role="cell">
                  <span className="forteca-frt-023-avatar" data-forteca-frt-023-tone={['primary', 'task', 'payment', 'event'][index % 4]} aria-hidden="true">{initials || 'K'}</span>
                  <span className="forteca-frt-023-client-copy"><Link to={'/clients/' + client.id}>{client.name || 'Klient'}</Link><small>{client.company || getStage021RelationType(client)}</small></span>
                </div>
                <div className="forteca-frt-023-cell forteca-frt-023-reason-cell" role="cell">
                  <span className="forteca-frt-023-reason-copy"><strong>{getStage023AttentionReason(cadenceRow)}</strong></span>
                  <span className="forteca-frt-023-priority" data-forteca-frt-023-priority={attention.tone}>{attention.label}</span>
                </div>
                <div className="forteca-frt-023-cell forteca-frt-023-contact-cell" role="cell"><strong>{contact.date}</strong>{contact.time ? <small>{contact.time}</small> : <small>{cadenceRow?.bucketKey === 'unknown' ? 'Brak potwierdzonej daty' : 'Data kontaktu'}</small>}</div>
                <div className="forteca-frt-023-cell forteca-frt-023-next-cell" role="cell">
                  <NextActionIcon aria-hidden="true" />
                  <span><strong>{nearestActionParts[0]}</strong>{nearestActionParts.length > 1 ? <small>{nearestActionParts.slice(1).join(' · ')}</small> : <small>{hasNextAction ? 'Zaplanowane w aktywności' : 'Wymaga zaplanowania'}</small>}</span>
                </div>
                <div className="forteca-frt-023-cell forteca-frt-023-owner-cell" role="cell"><span className="forteca-frt-023-owner-avatar" aria-hidden="true">{getStage021ClientOwner(client).slice(0, 2).toUpperCase()}</span><span>{getStage021ClientOwner(client)}</span></div>
                <div className="forteca-frt-023-cell forteca-frt-023-action-cell" role="cell">
                  {phoneHref ? <a className="forteca-frt-023-row-action" href={phoneHref}>{actionLabel}</a> : emailHref ? <a className="forteca-frt-023-row-action" href={emailHref}>{actionLabel}</a> : <Link className="forteca-frt-023-row-action" to={'/clients/' + client.id}>{actionLabel}</Link>}
                  <button type="button" className="forteca-frt-023-more-button" aria-label={'Akcje dla klienta ' + (client.name || 'Klient')} aria-expanded={openActionClientIdStage021 === client.id} onClick={() => setOpenActionClientIdStage021((current) => current === client.id ? null : client.id)}><MoreHorizontal aria-hidden="true" /></button>
                  {openActionClientIdStage021 === client.id ? (
                    <div className="forteca-frt-023-action-menu" role="menu">
                      <Link to={'/clients/' + client.id} role="menuitem" onClick={() => setOpenActionClientIdStage021(null)}>Otwórz klienta</Link>
                      <button type="button" role="menuitem" onClick={(event) => { setOpenActionClientIdStage021(null); handleArchiveClient(event, client, counters); }}>Przenieś do kosza</button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <footer className="forteca-frt-023-table-footer">
          <span>Wyświetlanie {filtered.length === 0 ? 0 : (safeClientPageStage021 - 1) * FRT021_CLIENT_PAGE_SIZE + 1}–{Math.min(safeClientPageStage021 * FRT021_CLIENT_PAGE_SIZE, filtered.length)} z {filtered.length} wyników</span>
          <nav aria-label="Paginacja klientów">
            <button type="button" className="forteca-frt-023-pagination-button" disabled={safeClientPageStage021 <= 1} onClick={() => setClientPageStage021((page) => Math.max(1, page - 1))}>‹ <span>Poprzednia</span></button>
            {pageItemsStage021.map((item) => item === 'ellipsis' ? <span key="ellipsis" className="forteca-frt-023-page-ellipsis">…</span> : <button type="button" key={item} className={safeClientPageStage021 === item ? 'forteca-frt-023-pagination-button is-active' : 'forteca-frt-023-pagination-button'} aria-current={safeClientPageStage021 === item ? 'page' : undefined} onClick={() => setClientPageStage021(item)}>{item}</button>)}
            <button type="button" className="forteca-frt-023-pagination-button" disabled={safeClientPageStage021 >= clientPageCountStage021} onClick={() => setClientPageStage021((page) => Math.min(clientPageCountStage021, page + 1))}><span>Następna</span> ›</button>
          </nav>
        </footer>
      </section>
    </>
  );

  const renderWithoutCaseStage022 = () => (
    <>
      <nav className="forteca-frt-022-tabs" aria-label="Widoki klientów" data-forteca-frt-022-tabs="true">
        <button
          type="button"
          className={clientRelationFilterStage232C === 'all' ? 'is-active' : ''}
          aria-current={clientRelationFilterStage232C === 'all' ? 'page' : undefined}
          onClick={() => { applyClientRelationFilterStage232C('all'); setStatusFilterStage021('all'); setStage022ContactFilter('all'); }}
          data-forteca-frt-022-tab="all"
        >
          Wszyscy klienci <span>{allLiveClientsStage021.length}</span>
        </button>
        <button
          type="button"
          className={clientRelationFilterStage232C === 'with_case' ? 'is-active' : ''}
          aria-current={clientRelationFilterStage232C === 'with_case' ? 'page' : undefined}
          onClick={() => { applyClientRelationFilterStage232C('with_case'); setStatusFilterStage021('all'); setStage022ContactFilter('all'); }}
          data-forteca-frt-022-tab="with-case"
        >
          Z aktywną sprawą <span>{clientsWithCases}</span>
        </button>
        <button
          type="button"
          className={clientRelationFilterStage232C === 'without_case' ? 'is-active' : ''}
          aria-current={clientRelationFilterStage232C === 'without_case' ? 'page' : undefined}
          onClick={() => { applyClientRelationFilterStage232C('without_case'); setStatusFilterStage021('all'); }}
          data-forteca-frt-022-tab="without-case"
        >
          Bez sprawy <span>{clientsWithoutCases}</span>
        </button>
      </nav>

      <section className="forteca-frt-022-kpi-grid" aria-label="Podsumowanie klientów bez sprawy" data-forteca-frt-022-kpis="true">
        <article className="forteca-frt-022-kpi" data-forteca-frt-022-kpi="without-case" data-forteca-frt-022-tone="primary">
          <span className="forteca-frt-022-kpi-icon"><UsersRound aria-hidden="true" /></span>
          <span className="forteca-frt-022-kpi-copy">
            <span className="forteca-frt-022-kpi-label">Klienci bez sprawy</span>
            <strong className="forteca-frt-022-kpi-value">{withoutCaseClientsStage022.length}</strong>
            <small className="forteca-frt-022-kpi-helper">{withoutCaseShareStage021}% wszystkich klientów</small>
          </span>
        </article>
        <article className="forteca-frt-022-kpi" data-forteca-frt-022-kpi="new" data-forteca-frt-022-tone="task">
          <span className="forteca-frt-022-kpi-icon"><UserRoundCheck aria-hidden="true" /></span>
          <span className="forteca-frt-022-kpi-copy">
            <span className="forteca-frt-022-kpi-label">Nowi klienci (30 dni)</span>
            <strong className="forteca-frt-022-kpi-value">{newClientsStage022.length}</strong>
            <small className="forteca-frt-022-kpi-helper">na podstawie daty utworzenia</small>
          </span>
        </article>
        <article className="forteca-frt-022-kpi" data-forteca-frt-022-kpi="qualification" data-forteca-frt-022-tone="event">
          <span className="forteca-frt-022-kpi-icon"><Flag aria-hidden="true" /></span>
          <span className="forteca-frt-022-kpi-copy">
            <span className="forteca-frt-022-kpi-label">Wymaga kwalifikacji</span>
            <strong className="forteca-frt-022-kpi-value">{qualificationClientsStage022.length}</strong>
            <small className="forteca-frt-022-kpi-helper">{withoutCaseClientsStage022.length ? Math.round((qualificationClientsStage022.length / withoutCaseClientsStage022.length) * 100) : 0}% klientów bez sprawy</small>
          </span>
        </article>
        <article className="forteca-frt-022-kpi" data-forteca-frt-022-kpi="recent-contact" data-forteca-frt-022-tone="payment">
          <span className="forteca-frt-022-kpi-icon"><PhoneCall aria-hidden="true" /></span>
          <span className="forteca-frt-022-kpi-copy">
            <span className="forteca-frt-022-kpi-label">Ostatni kontakt (7 dni)</span>
            <strong className="forteca-frt-022-kpi-value">{recentContactClientsStage022.length}</strong>
            <small className="forteca-frt-022-kpi-helper">{withoutCaseClientsStage022.length ? Math.round((recentContactClientsStage022.length / withoutCaseClientsStage022.length) * 100) : 0}% klientów bez sprawy</small>
          </span>
        </article>
      </section>

      <section className="forteca-frt-022-toolbar-shell" data-forteca-frt-022-toolbar-shell="true">
        <div className="forteca-frt-022-toolbar" data-forteca-frt-022-toolbar="true">
          <label className="forteca-frt-022-search">
            <Search aria-hidden="true" />
            <Input
              placeholder="Szukaj klienta, telefonu lub e-maila..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Szukaj klienta, telefonu lub e-maila"
            />
          </label>
          <label className="forteca-frt-022-control">
            <span>Status:</span>
            <select value={statusFilterStage021} onChange={(event) => setStatusFilterStage021(event.target.value as ClientStatusFilterStage021)} aria-label="Status">
              <option value="all">Wszystkie</option>
              <option value="active">Aktywni</option>
              <option value="new">Nowi</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
          <label className="forteca-frt-022-control">
            <span>Ostatni kontakt:</span>
            <select value={stage022ContactFilter} onChange={(event) => setStage022ContactFilter(event.target.value as Stage022ContactFilter)} aria-label="Ostatni kontakt">
              <option value="all">Dowolny</option>
              <option value="last_7">Ostatnie 7 dni</option>
              <option value="last_30">Ostatnie 30 dni</option>
              <option value="older">Ponad 30 dni</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
          <button
            type="button"
            className={filterPanelOpenStage021 ? 'forteca-frt-022-toolbar-button is-open' : 'forteca-frt-022-toolbar-button'}
            aria-label="Więcej filtrów"
            aria-expanded={filterPanelOpenStage021}
            onClick={() => setFilterPanelOpenStage021((current) => !current)}
          >
            <Filter aria-hidden="true" />
            Więcej filtrów
          </button>
          <button
            type="button"
            className="forteca-frt-022-view-toggle"
            aria-label="Przełącz widok listy"
            aria-pressed={stage022ViewMode === 'compact'}
            onClick={() => setStage022ViewMode((mode) => mode === 'table' ? 'compact' : 'table')}
          >
            <span className="forteca-frt-022-view-toggle-icon" aria-hidden="true"><LayoutGrid /></span>
            <ChevronDown aria-hidden="true" />
          </button>
        </div>
        {filterPanelOpenStage021 ? (
          <div className="forteca-frt-022-filter-panel" data-forteca-frt-022-filter-panel="true">
            <label className="forteca-frt-022-control">
              <span>Opiekun:</span>
              <select value={ownerFilterStage021} onChange={(event) => setOwnerFilterStage021(event.target.value)} aria-label="Opiekun">
                <option value="all">Wszyscy</option>
                {clientOwnerOptionsStage021.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <label className="forteca-frt-022-control">
              <span>Tag:</span>
              <select value={tagFilterStage021} onChange={(event) => setTagFilterStage021(event.target.value)} aria-label="Tag">
                <option value="all">Wszystkie</option>
                {clientTagOptionsStage021.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <Button type="button" variant="outline" onClick={resetClientFiltersStage021}>Wyczyść filtry</Button>
          </div>
        ) : null}
      </section>

      <section className="forteca-frt-022-content-grid" data-forteca-frt-022-content="true">
        <div className="forteca-frt-022-list-card" data-forteca-frt-022-list="true">
          <div className={stage022ViewMode === 'compact' ? 'forteca-frt-022-table is-compact' : 'forteca-frt-022-table'} role="table" aria-label="Klienci bez sprawy" data-forteca-frt-022-table="true">
            <div className="forteca-frt-022-table-row forteca-frt-022-table-head" role="row">
              <div className="forteca-frt-022-cell forteca-frt-022-checkbox-cell" role="columnheader"><input type="checkbox" checked={selectedVisibleClientsStage021} onChange={toggleVisibleClientSelectionStage021} aria-label="Zaznacz widocznych klientów" /></div>
              <div className="forteca-frt-022-cell" role="columnheader">Klient <span aria-hidden="true">⌃</span></div>
              <div className="forteca-frt-022-cell" role="columnheader">Telefon</div>
              <div className="forteca-frt-022-cell" role="columnheader">E-mail</div>
              <div className="forteca-frt-022-cell" role="columnheader">Ostatni kontakt</div>
              <div className="forteca-frt-022-cell" role="columnheader">Status</div>
              <div className="forteca-frt-022-cell" role="columnheader">Sugerowany ruch</div>
              <div className="forteca-frt-022-cell forteca-frt-022-action-cell" role="columnheader" />
            </div>
            {loading ? (
              <div className="forteca-frt-022-empty" role="row"><Loader2 className="animate-spin" aria-label="Ładowanie klientów" /> Ładowanie klientów</div>
            ) : visibleClientsStage021.length === 0 ? (
              <div className="forteca-frt-022-empty" role="row">Brak klientów bez aktywnej sprawy do wyświetlenia.</div>
            ) : visibleClientsStage021.map((client, index) => {
              const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
              const status = getStage021ClientStatus(client, counters.cases);
              const contact = getStage021ContactDate(getStage022LastContactValue(client));
              const nearestActionLabel = nearestActionByClientId.get(client.id) || 'Brak zaplanowanej akcji';
              const nearestActionParts = nearestActionLabel.split(' · ');
              const initials = String(client.name || 'K').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
              const statusTone = status === 'new' ? 'event' : 'task';
              return (
                <div className="forteca-frt-022-table-row" role="row" key={client.id} data-forteca-frt-022-row="true" data-client-id={client.id}>
                  <div className="forteca-frt-022-cell forteca-frt-022-checkbox-cell" role="cell"><input type="checkbox" checked={selectedClientIdsStage021.has(client.id)} onChange={() => toggleClientSelectionStage021(client.id)} aria-label={'Zaznacz klienta ' + (client.name || 'Klient')} /></div>
                  <div className="forteca-frt-022-cell forteca-frt-022-client-cell" role="cell">
                    <span className="forteca-frt-022-avatar" data-forteca-frt-022-tone={['primary', 'task', 'payment', 'event'][index % 4]} aria-hidden="true">{initials || 'K'}</span>
                    <span className="forteca-frt-022-client-copy"><Link to={'/clients/' + client.id}>{client.name || 'Klient'}</Link><small>{client.company || getStage021RelationType(client)}</small></span>
                  </div>
                  <div className="forteca-frt-022-cell forteca-frt-022-contact-cell" role="cell">{client.phone ? <span><Phone aria-hidden="true" />{client.phone}</span> : <span className="is-muted">—</span>}</div>
                  <div className="forteca-frt-022-cell forteca-frt-022-contact-cell" role="cell">{client.email ? <span><Mail aria-hidden="true" />{client.email}</span> : <span className="is-muted">—</span>}</div>
                  <div className="forteca-frt-022-cell forteca-frt-022-date-cell" role="cell"><strong>{contact.date}</strong>{contact.time ? <small>{contact.time}</small> : null}</div>
                  <div className="forteca-frt-022-cell" role="cell"><span className="forteca-frt-022-status" data-forteca-frt-022-tone={statusTone}>{getStage021StatusLabel(status)}</span></div>
                  <div className="forteca-frt-022-cell forteca-frt-022-next-cell" role="cell"><CalendarDays aria-hidden="true" /><span><strong>{nearestActionParts[0]}</strong>{nearestActionParts.length > 1 ? <small>{nearestActionParts.slice(1).join(' · ')}</small> : null}<Link to={'/clients/' + client.id}>Otwórz klienta</Link></span></div>
                  <div className="forteca-frt-022-cell forteca-frt-022-action-cell" role="cell">
                    <button type="button" className="forteca-frt-022-more-button" aria-label={'Akcje dla klienta ' + (client.name || 'Klient')} aria-expanded={openActionClientIdStage021 === client.id} onClick={() => setOpenActionClientIdStage021((current) => current === client.id ? null : client.id)}><MoreHorizontal aria-hidden="true" /></button>
                    {openActionClientIdStage021 === client.id ? (
                      <div className="forteca-frt-022-action-menu" role="menu">
                        <Link to={'/clients/' + client.id} role="menuitem" onClick={() => setOpenActionClientIdStage021(null)}>Otwórz klienta</Link>
                        <button type="button" role="menuitem" onClick={(event) => { setOpenActionClientIdStage021(null); handleArchiveClient(event, client, counters); }}>Przenieś do kosza</button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          <footer className="forteca-frt-022-table-footer">
            <span>Wyświetlanie {filtered.length === 0 ? 0 : (safeClientPageStage021 - 1) * FRT021_CLIENT_PAGE_SIZE + 1}–{Math.min(safeClientPageStage021 * FRT021_CLIENT_PAGE_SIZE, filtered.length)} z {filtered.length} klientów</span>
            <nav aria-label="Paginacja klientów">
              <button type="button" className="forteca-frt-022-pagination-button" disabled={safeClientPageStage021 <= 1} onClick={() => setClientPageStage021((page) => Math.max(1, page - 1))}>‹ <span>Poprzednia</span></button>
              {pageItemsStage021.map((item) => item === 'ellipsis' ? <span key="ellipsis" className="forteca-frt-022-page-ellipsis">…</span> : <button type="button" key={item} className={safeClientPageStage021 === item ? 'forteca-frt-022-pagination-button is-active' : 'forteca-frt-022-pagination-button'} aria-current={safeClientPageStage021 === item ? 'page' : undefined} onClick={() => setClientPageStage021(item)}>{item}</button>)}
              <button type="button" className="forteca-frt-022-pagination-button" disabled={safeClientPageStage021 >= clientPageCountStage021} onClick={() => setClientPageStage021((page) => Math.min(clientPageCountStage021, page + 1))}><span>Następna</span> ›</button>
            </nav>
          </footer>
        </div>

        <aside className="forteca-frt-022-guide" data-forteca-frt-022-guide="true">
          <div className="forteca-frt-022-guide-icon"><UsersRound aria-hidden="true" /><FilePlus2 aria-hidden="true" /></div>
          <h2>Klienci bez sprawy</h2>
          <p>To osoby, z którymi miałeś kontakt, ale nie mają jeszcze aktywnej sprawy.</p>
          <ul>
            <li><UserRoundCheck aria-hidden="true" /><span>Utworzyć lead i kontynuować kwalifikację</span></li>
            <li><Plus aria-hidden="true" /><span>Utworzyć sprawę i rozpocząć działanie</span></li>
            <li><CalendarDays aria-hidden="true" /><span>Dodać notatkę lub zaplanować kontakt</span></li>
          </ul>
          <Link className="forteca-frt-022-guide-link" to="/leads">Dowiedz się więcej <span aria-hidden="true">→</span></Link>
        </aside>
      </section>
    </>
  );

  return (
    <Layout>
      <div className={isArchivedStage025
        ? 'forteca-frt-021-page forteca-frt-021-clients-view forteca-frt-025-page'
        : isActiveCommissionStage024
          ? 'forteca-frt-021-page forteca-frt-021-clients-view forteca-frt-024-page'
        : isNeedsContactStage023
          ? 'forteca-frt-021-page forteca-frt-021-clients-view forteca-frt-023-page'
          : isWithoutCaseStage022
            ? 'forteca-frt-021-page forteca-frt-021-clients-view forteca-frt-022-page'
        : 'forteca-frt-021-page forteca-frt-021-clients-view'} data-clients-real-view="true" data-forteca-frt-021-runtime="true" data-forteca-frt-022-runtime={isWithoutCaseStage022 ? 'true' : undefined} data-forteca-frt-023-runtime={isNeedsContactStage023 ? 'true' : undefined} data-forteca-frt-024-runtime={isActiveCommissionStage024 ? 'true' : undefined} data-forteca-frt-024-root={isActiveCommissionStage024 ? 'true' : undefined} data-forteca-frt-025-runtime={isArchivedStage025 ? 'true' : undefined} data-forteca-frt-025-root={isArchivedStage025 ? 'true' : undefined}>
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
        <header className={isArchivedStage025 ? 'forteca-frt-025-header' : isActiveCommissionStage024 ? 'forteca-frt-024-header' : 'forteca-frt-021-header forteca-frt-021-page-header'} data-forteca-frt-021-header="true">
          <div className={isArchivedStage025 ? 'forteca-frt-025-header-copy' : isActiveCommissionStage024 ? 'forteca-frt-024-header-copy' : undefined}>
            <h1 className={isArchivedStage025 ? 'forteca-frt-025-title' : isActiveCommissionStage024 ? 'forteca-frt-024-title' : undefined}>Klienci</h1>
            {isActiveCommissionStage024
              ? <p className="forteca-frt-024-subtitle">Zarządzaj klientami i monitoruj aktywną prowizję.</p>
              : !isArchivedStage025 && !isWithoutCaseStage022 && !isNeedsContactStage023 ? <p>Zarządzaj relacjami i prowadź klientów od kontaktu do sprawy.</p> : null}
          </div>
          <div className={isArchivedStage025 ? 'forteca-frt-025-header-actions' : isActiveCommissionStage024 ? 'forteca-frt-024-header-actions' : 'forteca-frt-021-header-actions forteca-frt-021-page-actions'}>
            {isActiveCommissionStage024 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="forteca-frt-024-customize-button"
                  onClick={() => setStage024ColumnsOpen((current) => !current)}
                  aria-expanded={stage024ColumnsOpen}
                  data-forteca-frt-024-customize="true"
                >
                  <Settings aria-hidden="true" />
                  Dostosuj widok
                </Button>
                <div className="forteca-frt-024-export-group" data-forteca-frt-024-export="true">
                  <button
                    type="button"
                    className="forteca-frt-024-export-trigger"
                    aria-expanded={stage024ExportOpen}
                    aria-haspopup="menu"
                    onClick={() => setStage024ExportOpen((current) => !current)}
                  >
                    <span className="forteca-frt-024-export-trigger-main"><CloudUpload aria-hidden="true" />Eksportuj</span>
                    <ChevronDown className="forteca-frt-024-export-trigger-chevron" aria-hidden="true" />
                  </button>
                  {stage024ExportOpen ? (
                    <div className="forteca-frt-024-export-menu" role="menu">
                      <button type="button" role="menuitem" onClick={() => exportActiveCommissionStage024('visible')}>Eksportuj bieżący widok</button>
                      <button type="button" role="menuitem" onClick={() => exportActiveCommissionStage024('all')}>Eksportuj wszystkie wyniki</button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : isArchivedStage025 ? (
              <Button
                type="button"
                variant="outline"
                className="forteca-frt-025-customize-button"
                onClick={() => setStage025CustomizeOpen((current) => !current)}
                aria-expanded={stage025CustomizeOpen}
                data-forteca-frt-025-customize="true"
              >
                <Settings aria-hidden="true" />
                Dostosuj widok
              </Button>
            ) : isNeedsContactStage023 ? (
              <Button
                type="button"
                variant="outline"
                className="forteca-frt-021-button forteca-frt-021-button-secondary forteca-frt-023-customize-button"
                onClick={() => setFilterPanelOpenStage021((current) => !current)}
                aria-expanded={filterPanelOpenStage021}
                data-forteca-frt-023-customize="true"
              >
                <Settings aria-hidden="true" />
                Dostosuj widok
              </Button>
            ) : (
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
            )}
            {!isActiveCommissionStage024 ? (
              <Button
                type="button"
                className={isArchivedStage025 ? 'forteca-frt-025-add-button' : 'forteca-frt-021-button forteca-frt-021-button-primary forteca-frt-021-add-button'}
                disabled={!workspace?.id}
                data-forteca-frt-025-add={isArchivedStage025 ? 'true' : undefined}
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus aria-hidden="true" />
                Dodaj klienta
                <ChevronDown aria-hidden="true" />
              </Button>
            ) : null}
            <ClientCreateDialog
              open={isCreateOpen}
              onOpenChange={setIsCreateOpen}
              onCreated={reload}
            />
          </div>
        </header>

        {isArchivedStage025 ? renderArchivedStage025() : isActiveCommissionStage024 ? renderActiveCommissionStage024() : isNeedsContactStage023 ? renderNeedsContactStage023() : isWithoutCaseStage022 ? renderWithoutCaseStage022() : <>
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
            data-kpi-active={String(clientRelationFilterStage232C) === 'without_case'}
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
        </>}
      </div>
    </Layout>
  );

}
// LF-UI-SOT-007 canonical header owner marker: closeflow-page-header-structure-lock.css
// LF-UI-SOT-007 canonical header owner marker: closeflow-page-header-copy-left-only.css
