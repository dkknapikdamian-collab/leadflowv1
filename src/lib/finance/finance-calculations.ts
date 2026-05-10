import type {
  CommissionConfig,
  CommissionStatus,
  CommissionStatusInput,
  FinanceContractInput,
  FinancePayment,
  FinanceSummary,
  FinanceSummaryInput,
  PaymentStatus,
  PaymentType,
} from './finance-types.js';

export function normalizeFinanceNumber(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;

  const normalized = value
    .trim()
    .replace(/\s+/g, '')
    .replace(/pln|zł/gi, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function clampFinanceAmount(value: unknown) {
  return Math.max(0, normalizeFinanceNumber(value));
}

export function normalizeCommissionPercent(value: unknown) {
  const parsed = normalizeFinanceNumber(value);
  if (parsed <= 0) return 0;
  if (parsed > 100) return 100;
  return parsed;
}

export function isPaymentStatus(payment: FinancePayment, status: PaymentStatus) {
  return payment.status === status;
}

export function isPaymentType(payment: FinancePayment, type: PaymentType) {
  return payment.type === type;
}

export function isCustomerSettlementPayment(payment: FinancePayment) {
  return ['deposit', 'partial', 'final', 'other'].includes(payment.type);
}

export function isCommissionPayment(payment: FinancePayment) {
  return payment.type === 'commission';
}

export function isRefundPayment(payment: FinancePayment) {
  return payment.type === 'refund';
}

export function getSignedPaymentAmount(payment: FinancePayment) {
  const amount = clampFinanceAmount(payment.amount);
  return isRefundPayment(payment) ? -amount : amount;
}

export function sumPayments(payments: FinancePayment[], predicate: (payment: FinancePayment) => boolean) {
  return payments.reduce((sum, payment) => (predicate(payment) ? sum + getSignedPaymentAmount(payment) : sum), 0);
}

export function calculatePaidAmount(payments: FinancePayment[] = []) {
  const paid = sumPayments(
    payments,
    (payment) => payment.status === 'paid' && (isCustomerSettlementPayment(payment) || isRefundPayment(payment)),
  );
  return Math.max(0, paid);
}

export function calculatePlannedAmount(payments: FinancePayment[] = []) {
  return sumPayments(payments, (payment) => payment.status === 'planned' && isCustomerSettlementPayment(payment));
}

export function calculateDueAmount(payments: FinancePayment[] = []) {
  return sumPayments(payments, (payment) => payment.status === 'due' && isCustomerSettlementPayment(payment));
}

export function calculateRefundedAmount(payments: FinancePayment[] = []) {
  return payments
    .filter((payment) => payment.status === 'paid' && payment.type === 'refund')
    .reduce((sum, payment) => sum + clampFinanceAmount(payment.amount), 0);
}

export function calculatePaidCommissionAmount(payments: FinancePayment[] = []) {
  return payments
    .filter((payment) => payment.status === 'paid' && isCommissionPayment(payment))
    .reduce((sum, payment) => sum + clampFinanceAmount(payment.amount), 0);
}

export function calculateContractValue(input: FinanceContractInput = {}) {
  const explicit = clampFinanceAmount(input.contractValue ?? input.expectedRevenue);
  if (explicit > 0) return explicit;

  const paid = clampFinanceAmount(input.paidAmount);
  const remaining = clampFinanceAmount(input.remainingAmount);
  return paid + remaining;
}

export function calculateRemainingAmount(contractValue: unknown, paidAmount: unknown) {
  return Math.max(0, clampFinanceAmount(contractValue) - clampFinanceAmount(paidAmount));
}

export function calculateCommissionBaseAmount(config: CommissionConfig, contractValue: unknown, paidAmount: unknown) {
  if (config.base === 'paid_amount') return clampFinanceAmount(paidAmount);
  if (config.base === 'custom') return clampFinanceAmount(config.customBaseAmount);
  return clampFinanceAmount(contractValue);
}

export function calculateCommissionAmount(config: CommissionConfig | null | undefined, contractValue: unknown, paidAmount: unknown) {
  if (!config || config.mode === 'none') return 0;
  if (config.mode === 'fixed') return clampFinanceAmount(config.fixedAmount);

  const baseAmount = calculateCommissionBaseAmount(config, contractValue, paidAmount);
  const percent = normalizeCommissionPercent(config.percent);
  return Math.round(baseAmount * (percent / 100) * 100) / 100;
}

export function isIsoBefore(left: string | null | undefined, right: string | null | undefined) {
  if (!left || !right) return false;
  const leftTime = new Date(left).getTime();
  const rightTime = new Date(right).getTime();
  if (!Number.isFinite(leftTime) || !Number.isFinite(rightTime)) return false;
  return leftTime < rightTime;
}

export function resolveCommissionStatus(input: CommissionStatusInput): CommissionStatus {
  const commissionAmount = clampFinanceAmount(input.commissionAmount);
  const paidCommissionAmount = clampFinanceAmount(input.paidCommissionAmount);

  if (commissionAmount <= 0) return 'not_set';
  if (paidCommissionAmount >= commissionAmount) return 'paid';
  if (paidCommissionAmount > 0) return 'partially_paid';
  if (input.dueAt && input.nowIso && isIsoBefore(input.dueAt, input.nowIso)) return 'overdue';
  if (input.isDue || input.dueAt) return 'due';
  return 'expected';
}

export function buildFinanceSummary(input: FinanceSummaryInput = {}): FinanceSummary {
  const payments = input.payments || [];
  const paidAmount = calculatePaidAmount(payments);
  const contractValue = calculateContractValue({
    contractValue: input.contractValue ?? input.expectedRevenue,
    paidAmount,
    remainingAmount: input.remainingAmount,
  });
  const commissionAmount = calculateCommissionAmount(input.commission, contractValue, paidAmount);
  const paidCommissionAmount = calculatePaidCommissionAmount(payments);
  const commissionStatus = resolveCommissionStatus({
    commissionAmount,
    paidCommissionAmount,
    dueAt: input.commissionDueAt,
    nowIso: input.nowIso,
  });

  return {
    contractValue,
    paidAmount,
    plannedAmount: calculatePlannedAmount(payments),
    dueAmount: calculateDueAmount(payments),
    refundedAmount: calculateRefundedAmount(payments),
    remainingAmount: calculateRemainingAmount(contractValue, paidAmount),
    commissionAmount,
    paidCommissionAmount,
    commissionStatus,
    currency: String(input.currency || input.commission?.currency || payments[0]?.currency || 'PLN').toUpperCase(),
  };
}
