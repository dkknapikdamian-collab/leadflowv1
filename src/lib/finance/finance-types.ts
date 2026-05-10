export const CLOSEFLOW_FINANCE_DOMAIN_CONTRACT = 'FIN-1_CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_V1' as const;

export const COMMISSION_MODES = ['none', 'percent', 'fixed'] as const;
export type CommissionMode = typeof COMMISSION_MODES[number];

export const COMMISSION_BASES = ['contract_value', 'paid_amount', 'custom'] as const;
export type CommissionBase = typeof COMMISSION_BASES[number];

export const COMMISSION_STATUSES = [
  'not_set',
  'expected',
  'due',
  'partially_paid',
  'paid',
  'overdue',
] as const;
export type CommissionStatus = typeof COMMISSION_STATUSES[number];

export const PAYMENT_TYPES = ['deposit', 'partial', 'final', 'commission', 'refund', 'other'] as const;
export type PaymentType = typeof PAYMENT_TYPES[number];

export const PAYMENT_STATUSES = ['planned', 'due', 'paid', 'cancelled'] as const;
export type PaymentStatus = typeof PAYMENT_STATUSES[number];

export type FinanceEntityType = 'lead' | 'client' | 'case';

export type CurrencyCode = string;

export type MoneyValue = {
  amount: number;
  currency: CurrencyCode;
};

export type FinanceRelationRef = {
  workspaceId: string;
  leadId?: string | null;
  clientId?: string | null;
  caseId?: string | null;
};

export type FinancePayment = FinanceRelationRef & {
  id: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: CurrencyCode;
  paidAt: string | null;
  dueAt: string | null;
  note: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CommissionConfig = {
  mode: CommissionMode;
  base: CommissionBase;
  percent: number | null;
  fixedAmount: number | null;
  customBaseAmount: number | null;
  currency: CurrencyCode;
};

export type FinanceContractInput = {
  contractValue?: number | string | null;
  expectedRevenue?: number | string | null;
  paidAmount?: number | string | null;
  remainingAmount?: number | string | null;
  currency?: string | null;
};

export type CommissionStatusInput = {
  commissionAmount: number;
  paidCommissionAmount?: number | null;
  dueAt?: string | null;
  nowIso?: string | null;
  isDue?: boolean;
};

export type FinanceSummaryInput = FinanceContractInput & {
  payments?: FinancePayment[];
  commission?: CommissionConfig | null;
  commissionDueAt?: string | null;
  nowIso?: string | null;
};

export type FinanceSummary = {
  contractValue: number;
  paidAmount: number;
  plannedAmount: number;
  dueAmount: number;
  refundedAmount: number;
  remainingAmount: number;
  commissionAmount: number;
  paidCommissionAmount: number;
  commissionStatus: CommissionStatus;
  currency: CurrencyCode;
};
