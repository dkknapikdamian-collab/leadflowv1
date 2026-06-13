// STAGE231D1_COST_MODEL_SOURCE_TRUTH: central model for case costs, reimbursements and total-to-collect.
import { normalizeCurrency, normalizeMoneyAmount } from './finance-normalize.js';
import type { FinanceCurrency } from './finance-types.js';

export const STAGE231D1_COST_MODEL_SOURCE_TRUTH = 'STAGE231D1_COST_MODEL_SOURCE_TRUTH' as const;
export const STAGE231D1_COST_MODEL_NO_RUNTIME_UI = 'D1 adds cost model only; UI and SQL are later stages' as const;

export const CASE_COST_KINDS = [
  'court_fee',
  'notary',
  'travel',
  'document',
  'office',
  'marketing',
  'other',
] as const;
export type CaseCostKind = (typeof CASE_COST_KINDS)[number];

export const CASE_COST_STATUSES = [
  'planned',
  'incurred',
  'submitted',
  'partially_reimbursed',
  'reimbursed',
  'cancelled',
] as const;
export type CaseCostStatus = (typeof CASE_COST_STATUSES)[number];

export const CASE_COST_FINANCE_LABELS = {
  costsIncurred: 'Koszty poniesione',
  costsToReimburse: 'Koszty do zwrotu',
  costsReimbursed: 'Koszty zwrócone',
  totalToCollect: 'Razem do pobrania',
  commissionDue: 'Pozostało do zapłaty',
} as const;

export type CaseCostLike = {
  id?: string | null;
  caseId?: string | null;
  case_id?: string | null;
  clientId?: string | null;
  client_id?: string | null;
  kind?: CaseCostKind | string | null;
  type?: CaseCostKind | string | null;
  category?: CaseCostKind | string | null;
  status?: CaseCostStatus | string | null;
  amount?: number | string | null;
  value?: number | string | null;
  total?: number | string | null;
  costAmount?: number | string | null;
  cost_amount?: number | string | null;
  reimbursable?: boolean | string | number | null;
  reimbursableAmount?: number | string | null;
  reimbursable_amount?: number | string | null;
  reimbursedAmount?: number | string | null;
  reimbursed_amount?: number | string | null;
  currency?: FinanceCurrency | string | null;
  incurredAt?: string | null;
  incurred_at?: string | null;
  reimbursedAt?: string | null;
  reimbursed_at?: string | null;
  note?: string | null;
};

export type NormalizedCaseCost = {
  id?: string;
  caseId?: string;
  clientId?: string;
  kind: CaseCostKind;
  status: CaseCostStatus;
  amount: number;
  reimbursable: boolean;
  reimbursableAmount: number;
  reimbursedAmount: number;
  costsToReimburseAmount: number;
  currency: FinanceCurrency;
  incurredAt: string | null;
  reimbursedAt: string | null;
  note: string;
};

export type CaseCostsSummary = {
  costsIncurredAmount: number;
  costsReimbursableAmount: number;
  costsReimbursedAmount: number;
  costsToReimburseAmount: number;
  commissionRemainingAmount: number;
  totalToCollectAmount: number;
  currency: FinanceCurrency;
  costCount: number;
  reimbursableCostCount: number;
  reimbursedCostCount: number;
  openCostCount: number;
  hasCosts: boolean;
  source: 'case_costs' | 'empty';
};

export type CaseCostsSummaryInput = {
  costs?: CaseCostLike[] | null;
  commissionRemainingAmount?: number | string | null;
  currency?: FinanceCurrency | string | null;
};

function roundMoney(value: unknown): number {
  const amount = normalizeMoneyAmount(value, 0);
  if (!Number.isFinite(amount)) return 0;
  return Math.round(Math.max(0, amount) * 100) / 100;
}

function nullableText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function textId(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readMoney(row: Record<string, unknown>, keys: readonly string[], fallback = 0): number {
  for (const key of keys) {
    const amount = roundMoney(row[key]);
    if (amount > 0) return amount;
  }
  return roundMoney(fallback);
}

export function normalizeCaseCostKind(value: unknown): CaseCostKind {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized === 'court' || normalized === 'courtfee' || normalized === 'fee') return 'court_fee';
  if (normalized === 'docs' || normalized === 'document_fee') return 'document';
  if (normalized === 'admin' || normalized === 'office_fee') return 'office';
  return (CASE_COST_KINDS as readonly string[]).includes(normalized) ? (normalized as CaseCostKind) : 'other';
}

export function normalizeCaseCostStatus(value: unknown): CaseCostStatus {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized === 'open' || normalized === 'due' || normalized === 'pending') return 'planned';
  if (normalized === 'paid_by_owner' || normalized === 'spent' || normalized === 'paid') return 'incurred';
  if (normalized === 'awaiting_reimbursement' || normalized === 'awaiting_refund' || normalized === 'to_reimburse') return 'submitted';
  if (normalized === 'partial' || normalized === 'partially_paid') return 'partially_reimbursed';
  if (normalized === 'done' || normalized === 'settled' || normalized === 'refunded') return 'reimbursed';
  if (normalized === 'canceled') return 'cancelled';
  return (CASE_COST_STATUSES as readonly string[]).includes(normalized) ? (normalized as CaseCostStatus) : 'planned';
}

export function normalizeCaseCost(cost: CaseCostLike | null | undefined, fallbackCurrency: FinanceCurrency = 'PLN'): NormalizedCaseCost {
  const row = (cost || {}) as Record<string, unknown>;
  const status = normalizeCaseCostStatus(row.status);
  const amount = readMoney(row, ['amount', 'costAmount', 'cost_amount', 'value', 'total']);
  const reimbursableFlag = row.reimbursable;
  const reimbursable = status !== 'cancelled' && reimbursableFlag !== false && reimbursableFlag !== 'false' && reimbursableFlag !== 0;
  const reimbursableAmount = reimbursable
    ? readMoney(row, ['reimbursableAmount', 'reimbursable_amount'], amount)
    : 0;
  const explicitReimbursedAmount = readMoney(row, ['reimbursedAmount', 'reimbursed_amount']);
  const reimbursedAmount = status === 'reimbursed' && explicitReimbursedAmount <= 0
    ? reimbursableAmount
    : Math.min(explicitReimbursedAmount, reimbursableAmount);
  const costsToReimburseAmount = roundMoney(Math.max(reimbursableAmount - reimbursedAmount, 0));

  return {
    id: textId(row.id),
    caseId: textId(row.caseId ?? row.case_id),
    clientId: textId(row.clientId ?? row.client_id),
    kind: normalizeCaseCostKind(row.kind ?? row.type ?? row.category),
    status,
    amount,
    reimbursable,
    reimbursableAmount,
    reimbursedAmount,
    costsToReimburseAmount,
    currency: normalizeCurrency(row.currency, fallbackCurrency),
    incurredAt: nullableText(row.incurredAt ?? row.incurred_at),
    reimbursedAt: nullableText(row.reimbursedAt ?? row.reimbursed_at),
    note: typeof row.note === 'string' ? row.note.trim() : '',
  };
}

export function normalizeCaseCosts(costs: CaseCostLike[] | null | undefined, fallbackCurrency: FinanceCurrency = 'PLN'): NormalizedCaseCost[] {
  return Array.isArray(costs) ? costs.map((cost) => normalizeCaseCost(cost, fallbackCurrency)) : [];
}

export function getCaseCostsSummary(input: CaseCostsSummaryInput = {}): CaseCostsSummary {
  const fallbackCurrency = normalizeCurrency(input.currency, 'PLN');
  const rows = normalizeCaseCosts(input.costs || [], fallbackCurrency);
  const incurredRows = rows.filter((cost) => cost.status !== 'planned' && cost.status !== 'cancelled');
  const reimbursableRows = incurredRows.filter((cost) => cost.reimbursable);
  const costsIncurredAmount = roundMoney(incurredRows.reduce((sum, cost) => sum + cost.amount, 0));
  const costsReimbursableAmount = roundMoney(reimbursableRows.reduce((sum, cost) => sum + cost.reimbursableAmount, 0));
  const costsReimbursedAmount = roundMoney(reimbursableRows.reduce((sum, cost) => sum + cost.reimbursedAmount, 0));
  const costsToReimburseAmount = roundMoney(Math.max(costsReimbursableAmount - costsReimbursedAmount, 0));
  const commissionRemainingAmount = roundMoney(input.commissionRemainingAmount);
  const totalToCollectAmount = roundMoney(commissionRemainingAmount + costsToReimburseAmount);

  return {
    costsIncurredAmount,
    costsReimbursableAmount,
    costsReimbursedAmount,
    costsToReimburseAmount,
    commissionRemainingAmount,
    totalToCollectAmount,
    currency: fallbackCurrency,
    costCount: rows.length,
    reimbursableCostCount: reimbursableRows.length,
    reimbursedCostCount: reimbursableRows.filter((cost) => cost.costsToReimburseAmount <= 0 && cost.reimbursableAmount > 0).length,
    openCostCount: reimbursableRows.filter((cost) => cost.costsToReimburseAmount > 0).length,
    hasCosts: rows.length > 0,
    source: rows.length > 0 ? 'case_costs' : 'empty',
  };
}

export function getCaseTotalToCollectSummary(input: CaseCostsSummaryInput = {}): Pick<CaseCostsSummary, 'commissionRemainingAmount' | 'costsToReimburseAmount' | 'totalToCollectAmount' | 'currency'> {
  const summary = getCaseCostsSummary(input);
  return {
    commissionRemainingAmount: summary.commissionRemainingAmount,
    costsToReimburseAmount: summary.costsToReimburseAmount,
    totalToCollectAmount: summary.totalToCollectAmount,
    currency: summary.currency,
  };
}
