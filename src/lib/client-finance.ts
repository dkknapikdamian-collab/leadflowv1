export type ClientFinanceSummary = {
  totalValue: number;
  paidValue: number;
  remainingValue: number;
  settlementsCount: number;
  source: 'primary_case' | 'all_active_cases' | 'all_cases';
};

export type ClientFinanceSummaryMode = 'primary_case_first' | 'all_active_cases';

const VALUE_KEYS = [
  'contractValue',
  'contract_value',
  'caseValue',
  'case_value',
  'dealValue',
  'deal_value',
  'expectedRevenue',
  'expected_revenue',
  'totalValue',
  'total_value',
  'value',
  'amount',
  'price',
  'budget',
];

const PAYMENT_CASE_ID_KEYS = ['caseId', 'case_id', 'relatedCaseId', 'related_case_id'];
const PAYMENT_CLIENT_ID_KEYS = ['clientId', 'client_id', 'relatedClientId', 'related_client_id'];
const CUSTOMER_PAYMENT_TYPES = new Set(['deposit', 'partial', 'final', 'other', 'payment', '']);
const PAID_PAYMENT_STATUSES = new Set([
  'paid',
  'confirmed',
  'settled',
  'completed',
  'deposit_paid',
  'partially_paid',
  'fully_paid',
]);
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

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function normalizeId(value: unknown): string {
  return String(value ?? '').trim();
}

function pickId(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = normalizeId(row[key]);
    if (value) return value;
  }
  return '';
}

function getClientId(client: unknown): string {
  const row = asRecord(client);
  return normalizeId(row.id ?? row.clientId ?? row.client_id);
}

function getPrimaryCaseId(client: unknown): string {
  const row = asRecord(client);
  return normalizeId(row.primaryCaseId ?? row.primary_case_id);
}

function getCaseId(caseRecord: unknown): string {
  const row = asRecord(caseRecord);
  return normalizeId(row.id ?? row.caseId ?? row.case_id);
}

function parseMoney(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, value) : 0;
  const raw = String(value ?? '').trim();
  if (!raw) return 0;
  const normalized = raw
    .replace(/\s+/g, '')
    .replace(/pln|zł/gi, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function pickMoney(row: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = parseMoney(row[key]);
    if (value > 0) return value;
  }
  return 0;
}

function getCaseValue(caseRecord: unknown): number {
  return pickMoney(asRecord(caseRecord), VALUE_KEYS);
}

function getPaymentAmount(payment: unknown): number {
  const row = asRecord(payment);
  return pickMoney(row, ['amount', 'value', 'paidAmount', 'paid_amount', 'total', 'sum']);
}

function getPaymentStatus(payment: unknown): string {
  const row = asRecord(payment);
  return String(row.status ?? row.paymentStatus ?? row.payment_status ?? '').trim().toLowerCase();
}

function getPaymentType(payment: unknown): string {
  const row = asRecord(payment);
  return String(row.type ?? row.paymentType ?? row.payment_type ?? '').trim().toLowerCase();
}

function isCustomerPayment(payment: unknown): boolean {
  const type = getPaymentType(payment);
  if (type === 'commission') return false;
  return CUSTOMER_PAYMENT_TYPES.has(type);
}

function isPaidPayment(payment: unknown): boolean {
  return PAID_PAYMENT_STATUSES.has(getPaymentStatus(payment));
}

function isActiveCase(caseRecord: unknown): boolean {
  const status = String(asRecord(caseRecord).status ?? '').trim().toLowerCase();
  return OPEN_CASE_STATUSES.has(status);
}

function paymentMatchesCase(payment: unknown, caseIds: Set<string>, clientId: string): boolean {
  const row = asRecord(payment);
  const paymentCaseId = pickId(row, PAYMENT_CASE_ID_KEYS);
  if (paymentCaseId) return caseIds.has(paymentCaseId);
  const paymentClientId = pickId(row, PAYMENT_CLIENT_ID_KEYS);
  return Boolean(clientId && paymentClientId && paymentClientId === clientId);
}

function selectCases(input: {
  client: unknown;
  cases: unknown[];
  mode: ClientFinanceSummaryMode;
}): { cases: unknown[]; source: ClientFinanceSummary['source'] } {
  const primaryCaseId = getPrimaryCaseId(input.client);
  const allCases = Array.isArray(input.cases) ? input.cases.filter(Boolean) : [];

  if (input.mode === 'primary_case_first' && primaryCaseId) {
    const primaryCase = allCases.find((caseRecord) => getCaseId(caseRecord) === primaryCaseId);
    if (primaryCase) return { cases: [primaryCase], source: 'primary_case' };
  }

  const activeCases = allCases.filter(isActiveCase);
  return { cases: activeCases, source: 'all_active_cases' };
}

export function calculateClientFinanceSummary(input: {
  client: unknown;
  cases: unknown[];
  payments: unknown[];
  mode?: ClientFinanceSummaryMode;
}): ClientFinanceSummary {
  const mode = input.mode || 'primary_case_first';
  const allPayments = Array.isArray(input.payments) ? input.payments.filter(Boolean) : [];
  const clientId = getClientId(input.client);
  const selected = selectCases({
    client: input.client,
    cases: Array.isArray(input.cases) ? input.cases : [],
    mode,
  });
  const selectedCaseIds = new Set(selected.cases.map(getCaseId).filter(Boolean));
  const relevantPayments = allPayments.filter((payment) => paymentMatchesCase(payment, selectedCaseIds, clientId));

  const paidCustomerPayments = relevantPayments.filter((payment) => isCustomerPayment(payment) && isPaidPayment(payment));
  const paidValue = paidCustomerPayments.reduce((sum, payment) => {
    const amount = getPaymentAmount(payment);
    return sum + (getPaymentType(payment) === 'refund' ? -amount : amount);
  }, 0);

  const settlementsCount = paidCustomerPayments.filter((payment) => getPaymentAmount(payment) > 0).length;
  const explicitTotalValue = selected.cases.reduce((sum, caseRecord) => sum + getCaseValue(caseRecord), 0);
  const paymentIndicatedTotal = relevantPayments
    .filter(isCustomerPayment)
    .reduce((sum, payment) => sum + getPaymentAmount(payment), 0);
  const totalValue = explicitTotalValue > 0 ? explicitTotalValue : Math.max(0, paymentIndicatedTotal, paidValue);
  const safePaidValue = Math.max(0, paidValue);

  return {
    totalValue,
    paidValue: safePaidValue,
    remainingValue: Math.max(totalValue - safePaidValue, 0),
    settlementsCount,
    source: selected.source,
  };
}
