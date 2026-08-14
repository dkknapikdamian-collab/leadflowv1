import type { CommissionStatus, FinancePayment, FinanceSummary } from './finance-types.js';
import { buildFinanceSummary, clampFinanceAmount, calculateCommissionAmount } from './finance-calculations.js';
import {
  normalizeCommissionBase,
  normalizeCommissionConfig,
  normalizeCommissionMode,
  normalizeCommissionStatus,
  normalizeCurrency,
  normalizeFinancePayments,
} from './finance-normalize.js';

export const FIN7_CLIENT_FINANCE_SUMMARY_CONTRACT = 'FIN-7_CLIENT_FINANCE_RELATION_SUMMARY_V1' as const;

export type ClientFinanceSummaryInput = {
  cases?: Array<Record<string, unknown>>;
  payments?: Array<FinancePayment | Record<string, unknown>>;
  currency?: string;
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
  'totalValue',
  'total_value',
  'value',
  'amount',
];

const CASE_PAID_KEYS = ['paidAmount', 'paid_amount', 'paid', 'paidValue', 'paid_value'];
const CASE_REMAINING_KEYS = ['remainingAmount', 'remaining_amount', 'remaining', 'unpaidAmount', 'unpaid_amount'];
const CASE_COMMISSION_AMOUNT_KEYS = ['commissionAmount', 'commission_amount'];

function pickText(row: Record<string, unknown> | null | undefined, keys: string[], fallback = '') {
  if (!row) return fallback;
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function pickNumber(row: Record<string, unknown> | null | undefined, keys: string[], fallback = 0) {
  if (!row) return fallback;
  for (const key of keys) {
    const value = clampFinanceAmount(row[key]);
    if (value > 0) return value;
  }
  return fallback;
}

function getCaseCurrency(row: Record<string, unknown> | null | undefined, fallback = 'PLN') {
  return normalizeCurrency(pickText(row, ['currency', 'currencyCode', 'currency_code'], fallback));
}

function getCaseContractValue(row: Record<string, unknown>) {
  const value = pickNumber(row, CASE_VALUE_KEYS, 0);
  if (value > 0) return value;
  const paid = pickNumber(row, CASE_PAID_KEYS, 0);
  const remaining = pickNumber(row, CASE_REMAINING_KEYS, 0);
  return paid + remaining;
}

function getCaseCommissionAmount(row: Record<string, unknown>, contractValue: number, paidAmount: number, currency: string) {
  const explicit = pickNumber(row, CASE_COMMISSION_AMOUNT_KEYS, 0);
  const mode = normalizeCommissionMode(row.commissionMode ?? row.commission_mode);
  if (mode === 'fixed') return explicit;
  if (mode === 'percent') {
    const config = normalizeCommissionConfig({
      ...row,
      mode,
      base: normalizeCommissionBase(row.commissionBase ?? row.commission_base),
      percent: row.commissionRate ?? row.commission_rate,
      fixedAmount: explicit || null,
      currency,
    });
    const calculated = calculateCommissionAmount(config, contractValue, paidAmount);
    return calculated > 0 ? calculated : explicit;
  }
  return explicit;
}

function resolveCommissionStatus(cases: Array<Record<string, unknown>>, commissionAmount: number, paidCommissionAmount: number): CommissionStatus {
  const explicit = cases
    .map((row) => normalizeCommissionStatus(row.commissionStatus ?? row.commission_status))
    .find((status) => status && status !== 'not_set');
  if (explicit) return explicit;
  if (commissionAmount <= 0) return 'not_set';
  if (paidCommissionAmount >= commissionAmount) return 'paid';
  if (paidCommissionAmount > 0) return 'partially_paid';
  return 'due';
}

export function buildClientFinanceSummary(input: ClientFinanceSummaryInput = {}): FinanceSummary {
  const cases = Array.isArray(input.cases) ? input.cases.filter(Boolean) : [];
  const normalizedPayments = normalizeFinancePayments((Array.isArray(input.payments) ? input.payments : []) as Record<string, unknown>[]);
  const fallbackCurrency = normalizeCurrency(
    input.currency
      || pickText(cases[0], ['currency', 'currencyCode', 'currency_code'], '')
      || normalizedPayments.find((payment) => payment.currency)?.currency
      || 'PLN',
  );

  let contractValue = 0;
  let casePaidAmount = 0;
  let commissionAmount = 0;

  for (const row of cases) {
    const currency = getCaseCurrency(row, fallbackCurrency);
    const currentContractValue = getCaseContractValue(row);
    const currentPaid = pickNumber(row, CASE_PAID_KEYS, 0);
    contractValue += currentContractValue;
    casePaidAmount += currentPaid;
    commissionAmount += getCaseCommissionAmount(row, currentContractValue, currentPaid, currency);
  }

  const paidCustomerPayments = normalizedPayments
    .filter((payment) => payment.status === 'paid' && payment.type !== 'commission')
    .reduce((sum, payment) => sum + (payment.type === 'refund' ? -payment.amount : payment.amount), 0);

  const paidCommissionAmount = normalizedPayments
    .filter((payment) => payment.status === 'paid' && payment.type === 'commission')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const paidAmount = paidCustomerPayments > 0 ? paidCustomerPayments : casePaidAmount;
  const commissionStatus = resolveCommissionStatus(cases, commissionAmount, paidCommissionAmount);

  return buildFinanceSummary({
    contractValue,
    paidAmount: Math.max(0, paidAmount),
    currency: fallbackCurrency,
    payments: normalizedPayments,
    commission: {
      mode: commissionAmount > 0 ? 'fixed' : 'none',
      base: 'contract_value',
      amount: commissionAmount,
      fixedAmount: commissionAmount,
      paidAmount: paidCommissionAmount,
      status: commissionStatus,
      currency: fallbackCurrency,
    },
  });
}
