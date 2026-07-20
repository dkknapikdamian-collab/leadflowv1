import { normalizeFinancePayment } from './finance-normalize';
import type { FinanceCurrency, FinanceSummary, NormalizedFinancePayment } from './finance-types';

function numberOrZero(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeCurrency(value: unknown): FinanceCurrency {
  const normalized = String(value || 'PLN').trim().toUpperCase();
  return normalized === 'EUR' || normalized === 'USD' ? normalized : 'PLN';
}

function isPaymentForClient(payment: NormalizedFinancePayment, clientId: string, caseIds: Set<string>): boolean {
  const paymentClientId = String(payment.clientId || '').trim();
  const paymentCaseId = String(payment.caseId || '').trim();
  return paymentClientId === clientId || (paymentCaseId && caseIds.has(paymentCaseId));
}

function paymentAmountForClient(payment: NormalizedFinancePayment): number {
  const amount = Math.abs(numberOrZero(payment.amount));
  return payment.type === 'refund' ? -amount : amount;
}

function paymentCurrencyMatches(payment: NormalizedFinancePayment, currency: FinanceCurrency): boolean {
  return normalizeCurrency(payment.currency) === currency;
}

function resolveCommissionStatus(cases: any[], commissionAmount: number, paidCommissionAmount: number): 'not_started' | 'partially_paid' | 'paid' | 'overdue' | 'not_applicable' {
  if (commissionAmount <= 0) return 'not_applicable';
  if (paidCommissionAmount >= commissionAmount) return 'paid';
  if (paidCommissionAmount > 0) return 'partially_paid';
  const hasOverdueCommission = cases.some((caseRecord) => {
    const status = String(caseRecord?.commissionStatus || caseRecord?.commission_status || '').toLowerCase();
    return status === 'overdue';
  });
  return hasOverdueCommission ? 'overdue' : 'not_started';
}

export function buildFinanceClientSummary(client: any, cases: any[], payments: any[]): FinanceSummary {
  const clientId = String(client?.id || '').trim();
  const caseIds = new Set((Array.isArray(cases) ? cases : []).map((caseRecord) => String(caseRecord?.id || '').trim()).filter(Boolean));
  const fallbackCurrency = normalizeCurrency(client?.currency || cases?.[0]?.currency || payments?.[0]?.currency || 'PLN');
  const normalizedPayments = (Array.isArray(payments) ? payments : [])
    .map((payment) => normalizeFinancePayment(payment))
    .filter((payment) => isPaymentForClient(payment, clientId, caseIds))
    .filter((payment) => paymentCurrencyMatches(payment, fallbackCurrency));
  const contractValue = (Array.isArray(cases) ? cases : []).reduce((sum, caseRecord) => sum + numberOrZero(caseRecord?.contractValue ?? caseRecord?.contract_value ?? caseRecord?.dealValue ?? caseRecord?.deal_value ?? caseRecord?.expectedRevenue ?? caseRecord?.expected_revenue), 0);
  const paidCustomerPayments = normalizedPayments.filter((payment) => payment.status === 'paid' && payment.type !== 'commission').reduce((sum, payment) => sum + paymentAmountForClient(payment), 0);
  const legacyPaidValue = numberOrZero(client?.paidValue ?? client?.paid_value);
  const paidAmount = paidCustomerPayments || legacyPaidValue;
  const remainingAmount = Math.max(0, contractValue - paidAmount);
  const commissionAmount = (Array.isArray(cases) ? cases : []).reduce((sum, caseRecord) => sum + numberOrZero(caseRecord?.commissionAmount ?? caseRecord?.commission_amount ?? caseRecord?.commissionValue ?? caseRecord?.commission_value), 0);
  const paidCommissionAmount = normalizedPayments.filter((payment) => payment.status === 'paid' && payment.type === 'commission').reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
  const plannedAmount = normalizedPayments.filter((payment) => payment.status === 'planned').reduce((sum, payment) => sum + payment.amount, 0);
  const dueAmount = normalizedPayments.filter((payment) => payment.status === 'due').reduce((sum, payment) => sum + payment.amount, 0);
  const refundedAmount = normalizedPayments.filter((payment) => payment.type === 'refund').reduce((sum, payment) => sum + payment.amount, 0);
  const commissionRemainingAmount = Math.max(0, commissionAmount - paidCommissionAmount);
  const normalizedPaidAmount = Math.max(0, paidAmount);
  return {
    contractValue,
    paidAmount: normalizedPaidAmount,
    plannedAmount,
    dueAmount,
    refundedAmount,
    remainingAmount,
    commissionMode: commissionAmount > 0 ? 'fixed' : 'none',
    commissionBase: 'contract_value',
    commissionAmount,
    commissionPaidAmount: paidCommissionAmount,
    commissionRemainingAmount,
    paidCommissionAmount,
    remainingCommissionAmount: commissionRemainingAmount,
    paidClientAmount: normalizedPaidAmount,
    clientPaidAmount: normalizedPaidAmount,
    paymentPaidAmount: Math.max(0, paidCustomerPayments),
    commissionStatus: resolveCommissionStatus(cases, commissionAmount, paidCommissionAmount),
    currency: fallbackCurrency,
    paymentCount: normalizedPayments.length,
    paidPaymentCount: normalizedPayments.filter((payment) => payment.status === 'paid').length,
    duePaymentCount: normalizedPayments.filter((payment) => payment.status === 'due').length,
    refundAmount: refundedAmount,
  };
}
