import {
  normalizeCommissionBase,
  normalizeCommissionMode,
  normalizeCommissionStatus,
  normalizeCurrency,
  normalizeMoneyAmount,
} from './finance-normalize.js';
import type {
  CommissionBase,
  CommissionMode,
  CommissionStatus,
  FinanceCurrency,
  FinancePaymentLike,
} from './finance-types.js';

export const CLOSEFLOW_FIN10_CASE_FINANCE_SOURCE_TRUTH = 'CLOSEFLOW_FIN10_CASE_FINANCE_SOURCE_TRUTH_V1' as const;
export const CLOSEFLOW_FIN10_PAYMENTS_ARE_SOURCE_FOR_PAID_AMOUNTS = 'payments are the source of truth for paid and remaining amounts' as const;

export type CaseFinanceSource = 'payments' | 'case_legacy' | 'mixed';

export type CaseFinancePatchInput = {
  contractValue?: number | string | null;
  expectedRevenue?: number | string | null;
  currency?: string | null;
  commissionMode?: CommissionMode | string | null;
  commissionBase?: CommissionBase | string | null;
  commissionRate?: number | string | null;
  commissionAmount?: number | string | null;
  commissionStatus?: CommissionStatus | string | null;
};

export type CaseFinanceSummary = {
  contractValue: number;
  expectedRevenue: number;
  currency: FinanceCurrency;

  commissionMode: CommissionMode;
  commissionBase: CommissionBase;
  commissionRate: number;
  commissionAmount: number;
  commissionStatus: CommissionStatus;

  clientPaidAmount: number;
  commissionPaidAmount: number;
  commissionRemainingAmount: number;
  remainingAmount: number;

  hasPayments: boolean;
  source: CaseFinanceSource;

  /** Compatibility aliases for the older FinanceSummary shape. */
  paidAmount: number;
  paidClientAmount: number;
  paidCommissionAmount: number;
  remainingCommissionAmount: number;
  paymentPaidAmount: number;
  paymentCount: number;
  paidPaymentCount: number;
  duePaymentCount: number;
  refundAmount: number;
};

export type ClientCasesFinanceSummary = {
  totalValue: number;
  paidValue: number;
  remainingValue: number;
  settlementsCount: number;
  source: 'primary_case' | 'all_active_cases' | 'all_cases';
  commissionAmount: number;
  commissionPaidAmount: number;
  commissionRemainingAmount: number;
};

type AnyRecord = Record<string, unknown>;

type ClientCasesFinanceInput = {
  client: unknown;
  cases: unknown[];
  payments: unknown[];
  mode?: 'primary_case_first' | 'all_active_cases';
};

const CASE_VALUE_KEYS = [
  'contractValue',
  'contract_value',
  'expectedRevenue',
  'expected_revenue',
  'caseValue',
  'case_value',
  'dealValue',
  'deal_value',
  'value',
] as const;

const CASE_EXPECTED_REVENUE_KEYS = [
  'expectedRevenue',
  'expected_revenue',
  'contractValue',
  'contract_value',
  'caseValue',
  'case_value',
  'dealValue',
  'deal_value',
  'value',
] as const;

const PAID_LIKE_STATUSES = new Set([
  'paid',
  'fully_paid',
  'deposit_paid',
  'partially_paid',
  'confirmed',
  'settled',
  'completed',
  'done',
]);

const DUE_LIKE_STATUSES = new Set(['due', 'planned', 'pending', 'awaiting_payment', 'open']);
const PAYMENT_CASE_ID_KEYS = ['caseId', 'case_id', 'relatedCaseId', 'related_case_id'] as const;
const PAYMENT_CLIENT_ID_KEYS = ['clientId', 'client_id', 'relatedClientId', 'related_client_id'] as const;
const OPEN_CASE_STATUSES = new Set([
  '',
  'new',
  'open',
  'active',
  'waiting_on_client',
  'blocked',
  'to_approve',
  'ready_to_start',
  'in_progress',
  'on_hold',
]);

function roundMoney(value: unknown): number {
  const amount = typeof value === 'number' ? value : normalizeMoneyAmount(value, 0);
  if (!Number.isFinite(amount)) return 0;
  return Math.round(Math.max(0, amount) * 100) / 100;
}

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' ? (value as AnyRecord) : {};
}

function normalizeId(value: unknown): string {
  return String(value ?? '').trim();
}

function readText(row: AnyRecord, keys: readonly string[], fallback = ''): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function readMoney(row: AnyRecord, keys: readonly string[], fallback = 0): number {
  for (const key of keys) {
    const amount = roundMoney(row[key]);
    if (amount > 0) return amount;
  }
  return roundMoney(fallback);
}

function paymentType(payment: unknown): string {
  const row = asRecord(payment);
  return String(row.type ?? row.paymentType ?? row.payment_type ?? '').trim().toLowerCase();
}

function paymentStatus(payment: unknown): string {
  const row = asRecord(payment);
  return String(row.status ?? row.paymentStatus ?? row.payment_status ?? '').trim().toLowerCase();
}

function paymentAmount(payment: unknown): number {
  const row = asRecord(payment);
  return readMoney(row, ['amount', 'value', 'paidAmount', 'paid_amount', 'total', 'sum']);
}

function paymentCurrency(payment: unknown): string {
  return normalizeCurrency(asRecord(payment).currency, 'PLN');
}

function isPaidLike(payment: unknown): boolean {
  return PAID_LIKE_STATUSES.has(paymentStatus(payment));
}

function isDueLike(payment: unknown): boolean {
  return DUE_LIKE_STATUSES.has(paymentStatus(payment));
}

function paymentId(row: AnyRecord, keys: readonly string[]): string {
  for (const key of keys) {
    const id = normalizeId(row[key]);
    if (id) return id;
  }
  return '';
}

function getCaseId(caseRecord: unknown): string {
  const row = asRecord(caseRecord);
  return normalizeId(row.id ?? row.caseId ?? row.case_id);
}

function getClientId(client: unknown): string {
  const row = asRecord(client);
  return normalizeId(row.id ?? row.clientId ?? row.client_id);
}

function getPrimaryCaseId(client: unknown): string {
  const row = asRecord(client);
  return normalizeId(row.primaryCaseId ?? row.primary_case_id);
}

function caseStatus(caseRecord: unknown): string {
  return String(asRecord(caseRecord).status ?? '').trim().toLowerCase();
}

function isActiveCase(caseRecord: unknown): boolean {
  return OPEN_CASE_STATUSES.has(caseStatus(caseRecord));
}

function paymentMatchesCase(payment: unknown, caseIds: Set<string>, clientId: string): boolean {
  const row = asRecord(payment);
  const caseId = paymentId(row, PAYMENT_CASE_ID_KEYS);
  if (caseId) return caseIds.has(caseId);
  const paymentClientId = paymentId(row, PAYMENT_CLIENT_ID_KEYS);
  return Boolean(clientId && paymentClientId && paymentClientId === clientId);
}

function selectClientCases(input: ClientCasesFinanceInput): { cases: unknown[]; source: ClientCasesFinanceSummary['source'] } {
  const mode = input.mode || 'primary_case_first';
  const allCases = Array.isArray(input.cases) ? input.cases.filter(Boolean) : [];
  const primaryCaseId = getPrimaryCaseId(input.client);

  if (mode === 'primary_case_first' && primaryCaseId) {
    const primary = allCases.find((caseRecord) => getCaseId(caseRecord) === primaryCaseId);
    if (primary) return { cases: [primary], source: 'primary_case' };
  }

  const activeCases = allCases.filter(isActiveCase);
  if (activeCases.length) return { cases: activeCases, source: 'all_active_cases' };
  return { cases: allCases, source: 'all_cases' };
}

function getCommissionRate(caseRecord: unknown): number {
  const row = asRecord(caseRecord);
  return Math.min(100, readMoney(row, ['commissionRate', 'commission_rate', 'rate', 'percent']));
}

function getCommissionBaseAmount(caseRecord: unknown, mode: CommissionMode, base: CommissionBase, contractValue: number, clientPaidAmount: number): number {
  if (mode !== 'percent') return 0;
  const row = asRecord(caseRecord);
  if (base === 'paid_amount') return clientPaidAmount;
  if (base === 'custom') return readMoney(row, ['customBaseAmount', 'custom_base_amount', 'commissionCustomBase', 'commission_custom_base'], contractValue);
  return contractValue;
}

function getLegacyCasePaidAmount(caseRecord: unknown): number {
  return readMoney(asRecord(caseRecord), ['paidAmount', 'paid_amount']);
}

function getLegacyCommissionPaidAmount(caseRecord: unknown): number {
  return readMoney(asRecord(caseRecord), ['commissionPaidAmount', 'commission_paid_amount']);
}

function deriveCommissionStatus(caseRecord: unknown, commissionAmount: number, commissionPaidAmount: number): CommissionStatus {
  const explicit = normalizeCommissionStatus(asRecord(caseRecord).commissionStatus ?? asRecord(caseRecord).commission_status);
  if (explicit !== 'not_set') return explicit;
  if (commissionAmount <= 0) return 'not_set';
  if (commissionPaidAmount >= commissionAmount) return 'paid';
  if (commissionPaidAmount > 0) return 'partially_paid';
  return 'expected';
}

export function getCaseFinanceValue(caseRecord: unknown): number {
  return readMoney(asRecord(caseRecord), CASE_VALUE_KEYS);
}

export function getCaseFinanceCurrency(caseRecord: unknown, payments: unknown[] = []): FinanceCurrency {
  const row = asRecord(caseRecord);
  const caseCurrency = normalizeCurrency(row.currency, '');
  if (caseCurrency) return caseCurrency;
  const firstPaymentCurrency = (Array.isArray(payments) ? payments : [])
    .map(paymentCurrency)
    .find((currency) => /^[A-Z]{3}$/.test(currency));
  return normalizeCurrency(firstPaymentCurrency, 'PLN');
}

export function getCaseClientPaidAmount(payments: unknown[] = []): number {
  const rows = Array.isArray(payments) ? payments : [];
  const total = rows
    .filter((payment) => paymentType(payment) !== 'commission' && isPaidLike(payment))
    .reduce((sum, payment) => {
      const amount = paymentAmount(payment);
      return sum + (paymentType(payment) === 'refund' ? -amount : amount);
    }, 0);
  return roundMoney(Math.max(0, total));
}

export function getCaseCommissionPaidAmount(payments: unknown[] = []): number {
  const rows = Array.isArray(payments) ? payments : [];
  return roundMoney(
    rows
      .filter((payment) => paymentType(payment) === 'commission' && isPaidLike(payment))
      .reduce((sum, payment) => sum + paymentAmount(payment), 0),
  );
}

export function getCaseCommissionDue(caseRecord: unknown, paidAmount = 0): number {
  const summary = getCaseFinanceSummary(caseRecord, []);
  return roundMoney(Math.max(summary.commissionAmount - roundMoney(paidAmount), 0));
}

export function getCaseFinanceSummary(caseRecord: unknown, payments: unknown[] = []): CaseFinanceSummary {
  const row = asRecord(caseRecord);
  const paymentRows = Array.isArray(payments) ? payments.filter(Boolean) : [];
  const hasPayments = paymentRows.length > 0;
  const currency = getCaseFinanceCurrency(caseRecord, paymentRows);

  const contractValue = getCaseFinanceValue(caseRecord);
  const expectedRevenue = readMoney(row, CASE_EXPECTED_REVENUE_KEYS, contractValue);
  const clientPaidFromPayments = getCaseClientPaidAmount(paymentRows);
  const clientPaidAmount = hasPayments ? clientPaidFromPayments : getLegacyCasePaidAmount(caseRecord);
  const commissionPaidAmount = hasPayments ? getCaseCommissionPaidAmount(paymentRows) : getLegacyCommissionPaidAmount(caseRecord);
  const remainingAmount = contractValue > 0 || hasPayments
    ? roundMoney(Math.max(contractValue - clientPaidAmount, 0))
    : readMoney(row, ['remainingAmount', 'remaining_amount']);

  const commissionMode = normalizeCommissionMode(row.commissionMode ?? row.commission_mode);
  const commissionBase = normalizeCommissionBase(row.commissionBase ?? row.commission_base);
  const commissionRate = getCommissionRate(caseRecord);
  const explicitCommissionAmount = readMoney(row, ['commissionAmount', 'commission_amount']);
  const commissionBaseAmount = getCommissionBaseAmount(caseRecord, commissionMode, commissionBase, contractValue, clientPaidAmount);
  const commissionAmount = commissionMode === 'fixed'
    ? explicitCommissionAmount
    : commissionMode === 'percent'
      ? roundMoney((commissionBaseAmount * commissionRate) / 100)
      : 0;
  const commissionRemainingAmount = roundMoney(Math.max(commissionAmount - commissionPaidAmount, 0));
  const commissionStatus = deriveCommissionStatus(caseRecord, commissionAmount, commissionPaidAmount);
  const paidPaymentCount = paymentRows.filter(isPaidLike).length;
  const duePaymentCount = paymentRows.filter(isDueLike).length;
  const refundAmount = roundMoney(
    paymentRows
      .filter((payment) => paymentType(payment) === 'refund' && isPaidLike(payment))
      .reduce((sum, payment) => sum + paymentAmount(payment), 0),
  );

  return {
    contractValue,
    expectedRevenue,
    currency,
    commissionMode,
    commissionBase,
    commissionRate,
    commissionAmount,
    commissionStatus,
    clientPaidAmount,
    commissionPaidAmount,
    commissionRemainingAmount,
    remainingAmount,
    hasPayments,
    source: hasPayments ? 'payments' : 'case_legacy',
    paidAmount: clientPaidAmount,
    paidClientAmount: clientPaidAmount,
    paidCommissionAmount: commissionPaidAmount,
    remainingCommissionAmount: commissionRemainingAmount,
    paymentPaidAmount: clientPaidAmount,
    paymentCount: paymentRows.length,
    paidPaymentCount,
    duePaymentCount,
    refundAmount,
  };
}

export function buildCaseFinancePatch(input: CaseFinancePatchInput): Record<string, unknown> {
  const contractValue = roundMoney(input.contractValue);
  const expectedRevenue = input.expectedRevenue == null ? contractValue : roundMoney(input.expectedRevenue);
  const commissionMode = normalizeCommissionMode(input.commissionMode);
  const commissionBase = normalizeCommissionBase(input.commissionBase);
  const commissionRate = commissionMode === 'percent' ? Math.min(100, roundMoney(input.commissionRate)) : null;
  const commissionAmount = commissionMode === 'fixed'
    ? roundMoney(input.commissionAmount)
    : commissionMode === 'percent'
      ? roundMoney((contractValue * (commissionRate || 0)) / 100)
      : 0;

  return {
    contractValue,
    expectedRevenue,
    currency: normalizeCurrency(input.currency, 'PLN'),
    commissionMode,
    commissionBase,
    commissionRate,
    // FIN-10: derived commission cache only, not paid/remaining source of truth.
    commissionAmount,
    commissionStatus: normalizeCommissionStatus(input.commissionStatus),
  };
}

export function getClientCasesFinanceSummary(input: ClientCasesFinanceInput): ClientCasesFinanceSummary {
  const selected = selectClientCases(input);
  const clientId = getClientId(input.client);
  const selectedCaseIds = new Set(selected.cases.map(getCaseId).filter(Boolean));
  const allPayments = Array.isArray(input.payments) ? input.payments.filter(Boolean) : [];

  const caseSummaries = selected.cases.map((caseRecord) => {
    const caseId = getCaseId(caseRecord);
    const casePayments = allPayments.filter((payment) => {
      const row = asRecord(payment);
      const paymentCaseId = paymentId(row, PAYMENT_CASE_ID_KEYS);
      if (paymentCaseId) return paymentCaseId === caseId;
      return paymentMatchesCase(payment, selectedCaseIds, clientId);
    });
    return getCaseFinanceSummary(caseRecord, casePayments as FinancePaymentLike[]);
  });

  return {
    totalValue: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.contractValue, 0)),
    paidValue: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.clientPaidAmount, 0)),
    remainingValue: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.remainingAmount, 0)),
    settlementsCount: caseSummaries.reduce((sum, summary) => sum + summary.paidPaymentCount, 0),
    source: selected.source,
    commissionAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionAmount, 0)),
    commissionPaidAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionPaidAmount, 0)),
    commissionRemainingAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionRemainingAmount, 0)),
  };
}


// FIN-PUSH-V19: semantic finance helper used by ClientDetail/CaseDetail guards.
export function getCaseFinanceSemanticValues(caseLike: any = {}) {
  const rawContract = caseLike?.contractValue ?? caseLike?.transactionValue ?? caseLike?.dealValue ?? caseLike?.expectedRevenue ?? 0;
  const contractValue = Number.isFinite(Number(rawContract)) ? Number(rawContract) : 0;
  const commissionMode = String(caseLike?.commissionMode ?? caseLike?.commission_mode ?? "fixed").toLowerCase();
  const rawRate = caseLike?.commissionRate ?? caseLike?.commission_rate ?? 0;
  const commissionRate = Number.isFinite(Number(rawRate)) ? Number(rawRate) : 0;
  const rawAmount = caseLike?.commissionAmount ?? caseLike?.commission_amount;
  const explicitAmount = Number.isFinite(Number(rawAmount)) ? Number(rawAmount) : null;
  const commissionDue = explicitAmount !== null ? explicitAmount : (commissionMode === "percent" ? contractValue * commissionRate / 100 : commissionRate);
  return {
    transactionValue: contractValue,
    contractValue,
    commissionDue,
    commissionAmount: commissionDue,
    expectedRevenue: commissionDue,
  };
}
