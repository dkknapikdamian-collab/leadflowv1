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
import '../../styles/finance/closeflow-finance.css';

import { SurfaceCard, FormFooter } from '../ui-system';
export const CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN5 = 'FIN-5_CLOSEFLOW_CASE_SETTLEMENT_PANEL_V1' as const;
export const CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN10 = 'FIN-10_CASE_FINANCE_SOURCE_TRUTH_PANEL_V1' as const;
export const FIN13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR = 'FIN-13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR' as const;
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

function PaymentDialog({
  open,
  onOpenChange,
  defaultCurrency,
  defaultType,
  onSubmit,
  isSaving,
  duplicateCandidates = [],
  duplicateWarningCopy = FINANCE_DUPLICATE_PAYMENT_WARNING_COPY,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCurrency: string;
  defaultType: PaymentType;
  onSubmit?: (value: CaseSettlementPaymentInput) => void | Promise<void>;
  isSaving?: boolean;
  duplicateCandidates?: FinanceDuplicateCandidate[];
  duplicateWarningCopy?: string;
}) {
  const [type, setType] = useState<PaymentType>(defaultType);
  const [status, setStatus] = useState<PaymentStatus>('paid');
  const [amount, setAmount] = useState('');
  const [paidAt, setPaidAt] = useState(makeDateTimeLocalValue(new Date().toISOString()));
  const [dueAt, setDueAt] = useState('');
  const [note, setNote] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = parseMoneyInput(amount);
    if (parsedAmount <= 0) return;
    await onSubmit?.({
      type: normalizePaymentType(type),
      status: normalizePaymentStatus(status),
      amount: parsedAmount,
      currency: normalizeCurrency(defaultCurrency),
      paidAt: fromDateTimeLocalValue(paidAt),
      dueAt: fromDateTimeLocalValue(dueAt),
      note: note.trim(),
    });
    setAmount('');
    setNote('');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cf-finance-dialog cf-finance-settlement-dialog">
        <DialogHeader>
          <DialogTitle>{defaultType === 'commission' ? 'Dodaj płatność prowizji' : 'Dodaj wpłatę od klienta'}</DialogTitle>
        </DialogHeader>
        <form className="cf-finance-form" onSubmit={handleSubmit}>
          {duplicateCandidates.length > 0 ? (
            <div className="cf-finance-duplicate-warning" role="alert" data-fin9-payment-duplicate-warning="true">
              <strong>Możliwy duplikat klienta</strong>
              <span>{duplicateWarningCopy}</span>
            </div>
          ) : null}
          <label className="cf-finance-field">
            <span>Typ płatności</span>
            <select className="cf-finance-input" value={type} onChange={(event) => setType(normalizePaymentType(event.target.value))}>
              {PAYMENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="cf-finance-field">
            <span>Status</span>
            <select className="cf-finance-input" value={status} onChange={(event) => setStatus(normalizePaymentStatus(event.target.value))}>
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="cf-finance-field">
            <span>Kwota</span>
            <Input value={amount} inputMode="decimal" placeholder="40000" onChange={(event) => setAmount(event.target.value)} />
          </label>
          <label className="cf-finance-field">
            <span>Data zapłaty</span>
            <Input type="datetime-local" value={paidAt} onChange={(event) => setPaidAt(event.target.value)} />
          </label>
          <label className="cf-finance-field">
            <span>Termin</span>
            <Input type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} />
          </label>
          <label className="cf-finance-field cf-finance-field--wide">
            <span>Notatka</span>
            <Textarea value={note} placeholder="np. zaliczka gotówką / przelew / faktura" onChange={(event) => setNote(event.target.value)} />
          </label>
          <FormFooter className="cf-finance-dialog__footer" align="right">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
            <Button type="submit" disabled={isSaving || parseMoneyInput(amount) <= 0}>Zapisz płatność</Button>
          </FormFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CommissionDialog({
  open,
  onOpenChange,
  record,
  currency,
  onSubmit,
  isSaving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: CaseSettlementRecord | null;
  currency: string;
  onSubmit?: (value: CaseSettlementCommissionInput) => void | Promise<void>;
  isSaving?: boolean;
}) {
  const initialContractValue = getContractValue(record);
  const initialConfig = getCommissionConfig(record, currency);
  const explicitCommission = getExplicitCommissionAmount(record);
  const initialMode = normalizeCommissionMode(record?.commissionMode ?? record?.commission_mode ?? initialConfig.mode);
  const initialBase = normalizeCommissionBase(record?.commissionBase ?? record?.commission_base ?? initialConfig.base);

  const [contractValue, setContractValue] = useState(toNumberInputValue(initialContractValue));
  const [commissionMode, setCommissionMode] = useState<CommissionMode>(initialMode);
  const [commissionBase, setCommissionBase] = useState<CommissionBase>(initialBase);
  const [commissionRate, setCommissionRate] = useState(toNumberInputValue(record?.commissionRate ?? record?.commission_rate ?? initialConfig.percent));
  const [commissionAmount, setCommissionAmount] = useState(toNumberInputValue(record?.commissionAmount ?? record?.commission_amount ?? explicitCommission));
  const [commissionStatus, setCommissionStatus] = useState<CommissionStatus>(getInitialCommissionStatus(record, 'expected'));

  const previewCommission = useMemo(() => {
    const nextContract = parseMoneyInput(contractValue);
    const mode = normalizeCommissionMode(commissionMode);
    if (mode === 'fixed') return parseNullableMoneyInput(commissionAmount) || 0;
    if (mode === 'percent') {
      return calculateCommissionAmount({
        mode,
        base: normalizeCommissionBase(commissionBase),
        percent: normalizeCommissionPercent(commissionRate),
        fixedAmount: null,
        customBaseAmount: null,
        currency,
      }, nextContract, 0);
    }
    return 0;
  }, [commissionAmount, commissionBase, commissionMode, commissionRate, contractValue, currency]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextMode = normalizeCommissionMode(commissionMode);
    await onSubmit?.({
      contractValue: parseMoneyInput(contractValue),
      commissionMode: nextMode,
      commissionBase: normalizeCommissionBase(commissionBase),
      commissionRate: nextMode === 'percent' ? normalizeCommissionPercent(commissionRate) : null,
      commissionAmount: nextMode === 'fixed' ? parseNullableMoneyInput(commissionAmount) : previewCommission,
      commissionStatus: normalizeCommissionStatus(commissionStatus),
      currency: normalizeCurrency(currency),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cf-finance-dialog cf-finance-settlement-dialog">
        <DialogHeader>
          <DialogTitle>Ustaw wartość transakcji i prowizję</DialogTitle>
        </DialogHeader>
        <form className="cf-finance-form" onSubmit={handleSubmit}>
          <label className="cf-finance-field">
            <span>Wartość transakcji / sprawy</span>
            <Input value={contractValue} inputMode="decimal" placeholder="np. 105000" onChange={(event) => setContractValue(event.target.value)} />
          </label>
          <label className="cf-finance-field">
            <span>Model prowizji</span>
            <select className="cf-finance-input" value={commissionMode} onChange={(event) => setCommissionMode(normalizeCommissionMode(event.target.value))}>
              {COMMISSION_MODE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="cf-finance-field">
            <span>Podstawa prowizji</span>
            <select className="cf-finance-input" value={commissionBase} onChange={(event) => setCommissionBase(normalizeCommissionBase(event.target.value))}>
              {COMMISSION_BASE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="cf-finance-field">
            <span>Procent prowizji</span>
            <Input value={commissionRate} inputMode="decimal" disabled={commissionMode !== 'percent'} placeholder="2,5" onChange={(event) => setCommissionRate(event.target.value)} />
          </label>
          <label className="cf-finance-field">
            <span>Kwota stała prowizji</span>
            <Input value={commissionAmount} inputMode="decimal" disabled={commissionMode !== 'fixed'} placeholder="2625" onChange={(event) => setCommissionAmount(event.target.value)} />
          </label>
          <label className="cf-finance-field">
            <span>Status prowizji</span>
            <select className="cf-finance-input" value={commissionStatus} onChange={(event) => setCommissionStatus(normalizeCommissionStatus(event.target.value))}>
              <option value="not_set">nieustawiona</option>
              <option value="expected">oczekiwana</option>
              <option value="due">należna</option>
              <option value="partially_paid">częściowo zapłacona</option>
              <option value="paid">zapłacona</option>
              <option value="overdue">zaległa</option>
            </select>
          </label>
          <div className="cf-finance-settlement-preview" aria-label="Podgląd prowizji">
            Prowizja należna: <strong>{formatMoney(previewCommission, currency)}</strong>
          </div>
          <p className="cf-finance-settlement-help" data-cf-case-settlement-commission-note="true">
            Przy prowizji procentowej kwota liczy się od wartości transakcji. Przy kwocie stałej wpisana kwota jest prowizją należną.
          </p>
          <FormFooter className="cf-finance-dialog__footer" align="right">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
            <Button type="submit" disabled={isSaving}>Zapisz wartość i prowizję</Button>
          </FormFooter>
        </form>
      </DialogContent>
    </Dialog>
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
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [commissionPaymentOpen, setCommissionPaymentOpen] = useState(false);
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
              onAddPayment={() => setPaymentOpen(true)}
              onAddCommissionPayment={() => setCommissionPaymentOpen(true)}
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

      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        defaultCurrency={currency}
        defaultType="partial"
        onSubmit={onAddPayment}
        isSaving={isSaving}
        duplicateCandidates={financeDuplicateCandidates}
        duplicateWarningCopy={duplicateWarningCopy}
      />
      <PaymentDialog
        open={commissionPaymentOpen}
        onOpenChange={setCommissionPaymentOpen}
        defaultCurrency={currency}
        defaultType="commission"
        onSubmit={onAddPayment}
        isSaving={isSaving}
        duplicateCandidates={financeDuplicateCandidates}
        duplicateWarningCopy={duplicateWarningCopy}
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
