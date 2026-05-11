import {
  type CommissionBase,
  type CommissionMode,
  type CommissionStatus,
  type FinanceCommissionInput,
  type FinancePaymentLike,
  type FinanceSnapshot,
  type FinanceSnapshotInput,
  type FinanceSummary,
  type NormalizedFinancePayment,
} from './finance-types.js';
import {
  normalizeCommissionBase,
  normalizeCommissionMode,
  normalizeCommissionStatus,
  normalizeCurrency,
  normalizeFinanceDate,
  normalizeFinancePayments,
  normalizeMoneyAmount,
} from './finance-normalize.js';

export const CLOSEFLOW_FINANCE_CALCULATIONS_FIN1 = 'CLOSEFLOW_FINANCE_CALCULATIONS_FIN1';
export const CLOSEFLOW_FINANCE_CALCULATIONS_FIN1_COMPAT = 'CLOSEFLOW_FIN1_COMPAT_CASE_SETTLEMENT_PANEL_EXPORTS';

function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(Math.max(0, value) * 100) / 100;
}

/** Backward-compatible public clamp used by existing finance UI. */
export function clampFinanceAmount(value: unknown, fallback = 0): number {
  return roundMoney(normalizeMoneyAmount(value, fallback));
}

/** Backward-compatible percent normalizer used by existing finance UI. */
export function normalizeCommissionPercent(value: unknown): number {
  return Math.min(100, clampFinanceAmount(value, 0));
}

function isPaid(payment: NormalizedFinancePayment): boolean {
  return payment.status === 'paid';
}

function isDue(payment: NormalizedFinancePayment): boolean {
  return payment.status === 'due';
}

function isClientCashIn(payment: NormalizedFinancePayment): boolean {
  return payment.type === 'deposit' || payment.type === 'partial' || payment.type === 'final' || payment.type === 'other';
}

export function calculatePaidAmount(payments: FinancePaymentLike[] | NormalizedFinancePayment[] | null | undefined): number {
  const normalized = normalizeFinancePayments(payments as FinancePaymentLike[] | null | undefined);
  const paidIn = normalized
    .filter((payment) => isPaid(payment) && isClientCashIn(payment))
    .reduce((sum, payment) => sum + payment.amount, 0);
  const refunds = normalized
    .filter((payment) => isPaid(payment) && payment.type === 'refund')
    .reduce((sum, payment) => sum + payment.amount, 0);
  return roundMoney(Math.max(0, paidIn - refunds));
}

export function calculateRemainingAmount(contractValue: unknown, paidAmount: unknown): number {
  return roundMoney(Math.max(0, normalizeMoneyAmount(contractValue, 0) - normalizeMoneyAmount(paidAmount, 0)));
}

export function calculateCommissionPaidAmount(payments: FinancePaymentLike[] | NormalizedFinancePayment[] | null | undefined): number {
  const normalized = normalizeFinancePayments(payments as FinancePaymentLike[] | null | undefined);
  return roundMoney(
    normalized
      .filter((payment) => isPaid(payment) && payment.type === 'commission')
      .reduce((sum, payment) => sum + payment.amount, 0),
  );
}

type CommissionAmountInput = FinanceCommissionInput & {
  contractValue?: number | string | null;
  paidAmount?: number | string | null;
  /** Legacy alias used by existing CaseSettlementPanel. */
  percent?: number | string | null;
};

function getCommissionBaseAmount(base: CommissionBase, input: CommissionAmountInput): number {
  if (base === 'paid_amount') return normalizeMoneyAmount(input.paidAmount, 0);
  if (base === 'custom') return normalizeMoneyAmount(input.customBaseAmount, 0);
  return normalizeMoneyAmount(input.contractValue, 0);
}

export function calculateCommissionAmount(
  input: CommissionAmountInput | null | undefined,
  legacyContractValue?: number | string | null,
  legacyPaidAmount?: number | string | null,
  legacyCustomBaseAmount?: number | string | null,
): number {
  const data: CommissionAmountInput = {
    ...(input || {}),
    contractValue: input?.contractValue ?? legacyContractValue,
    paidAmount: input?.paidAmount ?? legacyPaidAmount,
    customBaseAmount: input?.customBaseAmount ?? legacyCustomBaseAmount,
  };
  const mode: CommissionMode = normalizeCommissionMode(data.mode);
  const base: CommissionBase = normalizeCommissionBase(data.base);

  if (mode === 'none') return 0;
  if (mode === 'fixed') return roundMoney(normalizeMoneyAmount(data.fixedAmount ?? data.amount, 0));

  const baseAmount = getCommissionBaseAmount(base, data);
  const rate = normalizeCommissionPercent(data.rate ?? data.percent);
  return roundMoney((baseAmount * rate) / 100);
}

function deriveCommissionStatus({
  explicitStatus,
  commissionAmount,
  commissionPaidAmount,
  dueAt,
  now,
}: {
  explicitStatus?: CommissionStatus;
  commissionAmount: number;
  commissionPaidAmount: number;
  dueAt?: string | null;
  now?: Date | string | number | null;
}): CommissionStatus {
  if (explicitStatus && explicitStatus !== 'not_set') return explicitStatus;
  if (commissionAmount <= 0) return 'not_set';
  if (commissionPaidAmount >= commissionAmount) return 'paid';
  if (commissionPaidAmount > 0) return 'partially_paid';

  const dueDate = normalizeFinanceDate(dueAt);
  const nowDate = normalizeFinanceDate(now) || new Date();
  if (dueDate && dueDate.getTime() < nowDate.getTime()) return 'overdue';
  return 'expected';
}

export function buildFinanceSnapshot(input: FinanceSnapshotInput | null | undefined): FinanceSnapshot {
  const data = input || {};
  const currency = normalizeCurrency(data.currency, 'PLN');
  const payments = normalizeFinancePayments(data.payments, currency);
  const contractValue = roundMoney(normalizeMoneyAmount(data.contractValue, 0));
  const explicitPaidAmount = data.paidAmount == null ? Number.NaN : normalizeMoneyAmount(data.paidAmount, Number.NaN);
  const paidAmount = roundMoney(Number.isFinite(explicitPaidAmount) ? explicitPaidAmount : calculatePaidAmount(payments));
  const remainingAmount = calculateRemainingAmount(contractValue, paidAmount);
  const commission = data.commission || {};
  const commissionMode = normalizeCommissionMode(commission.mode);
  const commissionBase = normalizeCommissionBase(commission.base);
  const commissionAmount = calculateCommissionAmount({
    ...commission,
    mode: commissionMode,
    base: commissionBase,
    contractValue,
    paidAmount,
  });
  const commissionPaidAmount = roundMoney(
    commission.paidAmount == null ? calculateCommissionPaidAmount(payments) : normalizeMoneyAmount(commission.paidAmount, 0),
  );
  const commissionRemainingAmount = calculateRemainingAmount(commissionAmount, commissionPaidAmount);
  const explicitCommissionStatus = normalizeCommissionStatus(commission.status);
  const commissionStatus = deriveCommissionStatus({
    explicitStatus: explicitCommissionStatus,
    commissionAmount,
    commissionPaidAmount,
    dueAt: commission.dueAt,
    now: data.now ?? data.nowIso,
  });

  return {
    contractValue,
    paidAmount,
    remainingAmount,
    commissionMode,
    commissionBase,
    commissionStatus,
    commissionAmount,
    commissionPaidAmount,
    commissionRemainingAmount,
    currency,
    paymentCount: payments.length,
    paidPaymentCount: payments.filter(isPaid).length,
    duePaymentCount: payments.filter(isDue).length,
    refundAmount: roundMoney(payments.filter((payment) => isPaid(payment) && payment.type === 'refund').reduce((sum, payment) => sum + payment.amount, 0)),
  };
}

/** Backward-compatible alias for existing FIN-5 CaseSettlementPanel. */
export function buildFinanceSummary(input: FinanceSnapshotInput | null | undefined): FinanceSummary {
  const snapshot = buildFinanceSnapshot(input);
  return {
    ...snapshot,
    paidCommissionAmount: snapshot.commissionPaidAmount,
    remainingCommissionAmount: snapshot.commissionRemainingAmount,
    paidClientAmount: snapshot.paidAmount,
    clientPaidAmount: snapshot.paidAmount,
    paymentPaidAmount: snapshot.paidAmount,
  };
}
