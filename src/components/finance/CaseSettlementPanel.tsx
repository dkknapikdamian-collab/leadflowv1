import { useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  calculateCommissionAmount,
  clampFinanceAmount,
  normalizeCommissionPercent,
} from '../../lib/finance/finance-calculations';
import { getCaseFinanceSummary } from '../../lib/finance/case-finance-source';
import {
  normalizeCommissionBase,
  normalizeCommissionConfig,
  normalizeCommissionMode,
  normalizeCommissionStatus,
  normalizeCurrency,
  normalizeFinancePayments,
  normalizePaymentStatus,
  normalizePaymentType,
} from '../../lib/finance/finance-normalize';
import type {
  CommissionBase,
  CommissionMode,
  CommissionStatus,
  FinancePayment,
  PaymentStatus,
  PaymentType,
} from '../../lib/finance/finance-types';
import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPE_OPTIONS } from '../../lib/finance/finance-payment-labels';
import { FINANCE_DUPLICATE_PAYMENT_WARNING_COPY, buildFinanceDuplicateCandidatesFromRecord, type FinanceDuplicateCandidate } from '../../lib/finance/finance-duplicate-safety';
import { PaymentList } from './PaymentList';
import { CaseFinanceEditorDialog } from './CaseFinanceEditorDialog';
import { CaseFinanceActionButtons } from './CaseFinanceActionButtons';
import { CaseFinancePaymentDialog } from './CaseFinancePaymentDialog';
import '../../styles/finance/closeflow-finance.css';

import { SurfaceCard, FormFooter } from '../ui-system';
export const CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN5 = 'FIN-5_CLOSEFLOW_CASE_SETTLEMENT_PANEL_V1' as const;
export const CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN10 = 'FIN-10_CASE_FINANCE_SOURCE_TRUTH_PANEL_V1' as const;
export const FIN13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR = 'FIN-13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR' as const;
export const FIN14_CASE_SETTLEMENT_PAYMENT_TYPES = 'FIN-14_CASE_SETTLEMENT_PAYMENT_TYPES_DEPOSIT_PARTIAL_COMMISSION' as const;
const CLOSEFLOW_CASE_SETTLEMENT_EDIT_VALUES_V1 = 'case settlement exposes explicit value and commission edit action';
void CLOSEFLOW_CASE_SETTLEMENT_EDIT_VALUES_V1;
const CLOSEFLOW_CASE_SETTLEMENT_PAYMENT_TYPE_GUARD = 'type="partial" type="commission"';
void CLOSEFLOW_CASE_SETTLEMENT_PAYMENT_TYPE_GUARD;


type CaseSettlementRecord = Record<string, unknown> & {
  id?: string;
  leadId?: string | null;
  lead_id?: string | null;
  clientId?: string | null;
  client_id?: string | null;
  currency?: string | null;
};

export type CaseSettlementPaymentInput = {
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt: string | null;
  dueAt: string | null;
  note: string;
};

export type CaseSettlementCommissionInput = {
  contractValue: number;
  commissionMode: CommissionMode;
  commissionBase: CommissionBase;
  commissionRate: number | null;
  commissionAmount: number | null;
  commissionStatus: CommissionStatus;
  currency: string;
};

type CaseSettlementPanelProps = {
  record?: CaseSettlementRecord | null;
  payments?: Array<FinancePayment | Record<string, unknown>>;
  readonly?: boolean;
  isSaving?: boolean;
  duplicateCandidates?: FinanceDuplicateCandidate[];
  duplicateWarningCopy?: string;
  onAddPayment?: (value: CaseSettlementPaymentInput) => void | Promise<void>;
  onEditCommission?: (value: CaseSettlementCommissionInput) => void | Promise<void>;
};

const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  not_set: 'nieustawiona',
  expected: 'oczekiwana',
  due: 'należna',
  partially_paid: 'częściowo zapłacona',
  paid: 'zapłacona',
  overdue: 'zaległa',
};

const COMMISSION_MODE_OPTIONS: Array<{ value: CommissionMode; label: string }> = [
  { value: 'none', label: 'Brak' },
  { value: 'percent', label: 'Procent' },
  { value: 'fixed', label: 'Kwota stała' },
];

const COMMISSION_BASE_OPTIONS: Array<{ value: CommissionBase; label: string }> = [
  { value: 'contract_value', label: 'Wartość transakcji' },
  { value: 'paid_amount', label: 'Wpłacono od klienta' },
  { value: 'custom', label: 'Własna podstawa' },
];

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function pickNumber(row: CaseSettlementRecord | null | undefined, keys: string[]) {
  if (!row) return 0;
  for (const key of keys) {
    const value = clampFinanceAmount(row[key]);
    if (value > 0) return value;
  }
  return 0;
}

function pickText(row: CaseSettlementRecord | null | undefined, keys: string[], fallback = '') {
  if (!row) return fallback;
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function formatMoney(value: unknown, currency = 'PLN') {
  const amount = clampFinanceAmount(value);
  const safeCurrency = normalizeCurrency(currency);
  return `${Math.round(amount).toLocaleString('pl-PL')} ${safeCurrency}`;
}

function formatPercent(value: unknown) {
  const amount = normalizeCommissionPercent(value);
  if (amount <= 0) return '0%';
  return `${amount.toLocaleString('pl-PL', { maximumFractionDigits: 2 })}%`;
}

function toNumberInputValue(value: unknown) {
  const amount = clampFinanceAmount(value);
  return amount > 0 ? String(amount) : '';
}

function parseMoneyInput(value: string) {
  const parsed = Number(String(value || '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function parseNullableMoneyInput(value: string) {
  const parsed = Number(String(value || '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function makeDateTimeLocalValue(value: unknown) {
  const text = asText(value);
  if (!text) return '';
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromDateTimeLocalValue(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getContractValue(record: CaseSettlementRecord | null | undefined) {
  return pickNumber(record, [
    'contractValue',
    'contract_value',
    'expectedRevenue',
    'expected_revenue',
    'caseValue',
    'case_value',
    'dealValue',
    'deal_value',
    'value',
  ]);
}

function getCommissionConfig(record: CaseSettlementRecord | null | undefined, currency: string) {
  return normalizeCommissionConfig({
    ...record,
    currency,
    mode: record?.commissionMode ?? record?.commission_mode,
    base: record?.commissionBase ?? record?.commission_base,
    percent: record?.commissionRate ?? record?.commission_rate,
    fixedAmount: record?.commissionAmount ?? record?.commission_amount,
  });
}

function getExplicitCommissionAmount(record: CaseSettlementRecord | null | undefined) {
  return pickNumber(record, ['commissionAmount', 'commission_amount']);
}

function getInitialCommissionStatus(record: CaseSettlementRecord | null | undefined, fallback: CommissionStatus) {
  return normalizeCommissionStatus(record?.commissionStatus ?? record?.commission_status ?? fallback);
}

function getCommissionLine(mode: CommissionMode, rate: number | null, commissionAmount: number, currency: string) {
  if (mode === 'none' || commissionAmount <= 0) return 'Brak prowizji';
  if (mode === 'percent') return `${formatPercent(rate)} = ${formatMoney(commissionAmount, currency)}`;
  if (mode === 'fixed') return `kwota stała = ${formatMoney(commissionAmount, currency)}`;
  return formatMoney(commissionAmount, currency);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="cf-finance-settlement-metric">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function CaseSettlementPanel({
  record = null,
  payments = [],
  readonly = false,
  isSaving = false,
  duplicateCandidates: duplicateCandidatesProp = [],
  duplicateWarningCopy = FINANCE_DUPLICATE_PAYMENT_WARNING_COPY,
  onAddPayment,
  onEditCommission,
}: CaseSettlementPanelProps) {
  const [paymentDialogType, setPaymentDialogType] = useState<PaymentType | null>(null);
  const [commissionOpen, setCommissionOpen] = useState(false);

  const normalizedPayments = useMemo(() => normalizeFinancePayments(payments as Record<string, unknown>[]), [payments]);
  const summary = useMemo(() => getCaseFinanceSummary(record, normalizedPayments), [record, normalizedPayments]);
  const currency = summary.currency;
  const contractValue = summary.contractValue;
  const financeDuplicateCandidates = useMemo(() => {
    return duplicateCandidatesProp.length ? duplicateCandidatesProp : buildFinanceDuplicateCandidatesFromRecord(record);
  }, [duplicateCandidatesProp, record]);
  const commissionConfig = useMemo(() => getCommissionConfig(record, currency), [currency, record]);

  const commissionAmount = summary.commissionAmount;
  const commissionStatus = summary.commissionStatus;
  const commissionPaid = summary.commissionPaidAmount;
  const commissionRemaining = summary.commissionRemainingAmount;
  const hasCaseSettlementValue = contractValue > 0;

  return (
    <SurfaceCard className="cf-finance-settlement-panel" tone="default">
      <div className="cf-finance-settlement-header">
        <div>
          <p className="cf-finance-kicker">FIN-5</p>
          <h2>Rozliczenie sprawy</h2>
          <span>Ustaw wartość transakcji, wpłaty klienta i prowizję. Prowizja procentowa liczy się od wartości sprawy.</span>
        </div>
        {!readonly ? (
          <CaseFinanceActionButtons
              className="cf-finance-settlement-actions"
              onEdit={() => setCommissionOpen(true)}
              onAddDepositPayment={() => setPaymentDialogType('deposit')}
              onAddPayment={() => setPaymentDialogType('partial')}
              onAddCommissionPayment={() => setPaymentDialogType('commission')}
              showDepositPayment
              showCommissionPayment
              disabled={isSaving}
            />
        ) : null}
      </div>

      {!hasCaseSettlementValue ? (
        <div className="cf-finance-settlement-empty-value" data-cf-case-settlement-value-cta="true">
          <div>
            <strong>Ustaw wartość sprawy</strong>
            <span>Bez wartości transakcji panel pokazuje zera. Ustaw ją tutaj, a system policzy pozostało do zapłaty i prowizję.</span>
          </div>
          {!readonly ? (
            <Button type="button" onClick={() => setCommissionOpen(true)} disabled={isSaving}>
              Ustaw wartość i prowizję
            </Button>
          ) : null}
        </div>
      ) : null}

      <dl className="cf-finance-settlement-grid">
        <Metric label="Wartość transakcji" value={formatMoney(contractValue, currency)} />
        <Metric label="Prowizja" value={getCommissionLine(summary.commissionMode, summary.commissionRate, commissionAmount, currency)} />
        <Metric label="Prowizja należna" value={formatMoney(commissionAmount, currency)} />
        <Metric label="Wpłacono od klienta" value={formatMoney(summary.clientPaidAmount, currency)} />
        <Metric label="Pozostało" value={formatMoney(summary.remainingAmount, currency)} />
        <Metric label="Prowizja opłacona" value={formatMoney(commissionPaid, currency)} />
        <Metric label="Prowizja do zapłaty" value={formatMoney(commissionRemaining, currency)} />
        <Metric label="Status prowizji" value={COMMISSION_STATUS_LABELS[commissionStatus] || commissionStatus} />
      </dl>

      <div className="cf-finance-settlement-footnote">
        <span>Status prowizji: {COMMISSION_STATUS_LABELS[commissionStatus] || commissionStatus}</span>
        <span>Wpłaty klienta i płatności prowizji są liczone osobno.</span>
      </div>

      <PaymentList
        title="Lista płatności"
        emptyText="Brak zapisanych płatności dla tej sprawy."
        payments={normalizedPayments}
      />

      <CaseFinancePaymentDialog
        open={Boolean(paymentDialogType)}
        onOpenChange={(open) => { if (!open) setPaymentDialogType(null); }}
        caseRecord={record}
        defaultCurrency={currency}
        defaultType={paymentDialogType || 'partial'}
        onSubmit={onAddPayment}
        isSaving={isSaving}
      />
      <CaseFinanceEditorDialog
        open={commissionOpen}
        onOpenChange={setCommissionOpen}
        caseRecord={record}
        payments={normalizedPayments as unknown as Record<string, unknown>[]}
        isSaving={isSaving}
        onSave={async (patch) => {
          await onEditCommission?.({
            contractValue: Number(patch.contractValue || 0),
            commissionMode: normalizeCommissionMode(patch.commissionMode),
            commissionBase: normalizeCommissionBase(patch.commissionBase),
            commissionRate: patch.commissionRate == null ? null : Number(patch.commissionRate || 0),
            commissionAmount: patch.commissionAmount == null ? null : Number(patch.commissionAmount || 0),
            commissionStatus: normalizeCommissionStatus(patch.commissionStatus),
            currency: normalizeCurrency(patch.currency),
          });
        }}
      />
      <span hidden data-fin5-case-settlement-panel="true" data-fin8-finance-visual-integration={CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN5} data-fin9-finance-duplicate-safety="CLOSEFLOW_FIN9_CASE_SETTLEMENT_DUPLICATE_WARNING_ONLY" data-case-settlement-panel="fin10" data-fin10-case-finance-source-truth="true" />
    </SurfaceCard>
  );
}

export default CaseSettlementPanel;
