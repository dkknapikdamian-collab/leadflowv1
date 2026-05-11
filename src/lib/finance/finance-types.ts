export const CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1 = 'CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1';
export const CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1_COMPAT = 'CLOSEFLOW_FIN1_COMPAT_CASE_SETTLEMENT_PANEL_EXPORTS';

export const COMMISSION_MODES = ['none', 'percent', 'fixed'] as const;
export type CommissionMode = (typeof COMMISSION_MODES)[number];

export const COMMISSION_BASES = ['contract_value', 'paid_amount', 'custom'] as const;
export type CommissionBase = (typeof COMMISSION_BASES)[number];

export const COMMISSION_STATUSES = [
  'not_set',
  'expected',
  'due',
  'partially_paid',
  'paid',
  'overdue',
] as const;
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];

export const PAYMENT_TYPES = ['deposit', 'partial', 'final', 'commission', 'refund', 'other'] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const PAYMENT_STATUSES = ['planned', 'due', 'paid', 'cancelled'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type FinanceCurrency = string;

export type FinancePaymentLike = {
  id?: string;
  type?: PaymentType | string | null;
  status?: PaymentStatus | string | null;
  amount?: number | string | null;
  currency?: FinanceCurrency | string | null;
  paidAt?: string | null;
  paid_at?: string | null;
  dueAt?: string | null;
  due_at?: string | null;
  note?: string | null;
};

export type NormalizedFinancePayment = {
  id?: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: FinanceCurrency;
  paidAt: string | null;
  dueAt: string | null;
  note: string;
};

/** Backward-compatible alias used by existing FIN-5 components. */
export type FinancePayment = NormalizedFinancePayment;

export type FinanceCommissionInput = {
  mode?: CommissionMode | string | null;
  base?: CommissionBase | string | null;
  status?: CommissionStatus | string | null;
  rate?: number | string | null;
  /** Backward-compatible alias used by existing settlement UI. */
  percent?: number | string | null;
  amount?: number | string | null;
  fixedAmount?: number | string | null;
  customBaseAmount?: number | string | null;
  paidAmount?: number | string | null;
  dueAt?: string | null;
  currency?: FinanceCurrency | string | null;
};

export type FinanceCommissionConfig = {
  mode: CommissionMode;
  base: CommissionBase;
  status: CommissionStatus;
  rate: number;
  /** Backward-compatible alias for rate. */
  percent: number;
  amount: number | null;
  fixedAmount: number | null;
  customBaseAmount: number | null;
  paidAmount: number | null;
  dueAt: string | null;
  currency: FinanceCurrency;
};

export type FinanceSnapshotInput = {
  contractValue?: number | string | null;
  paidAmount?: number | string | null;
  currency?: FinanceCurrency | string | null;
  payments?: FinancePaymentLike[] | null;
  commission?: FinanceCommissionInput | null;
  now?: Date | string | number | null;
  /** Backward-compatible alias used by older CaseSettlementPanel code. */
  nowIso?: string | null;
};

export type FinanceSnapshot = {
  contractValue: number;
  paidAmount: number;
  remainingAmount: number;
  commissionMode: CommissionMode;
  commissionBase: CommissionBase;
  commissionStatus: CommissionStatus;
  commissionAmount: number;
  commissionPaidAmount: number;
  commissionRemainingAmount: number;
  currency: FinanceCurrency;
  paymentCount: number;
  paidPaymentCount: number;
  duePaymentCount: number;
  refundAmount: number;
};

/** Backward-compatible summary shape used by existing FIN-5 components. */
export type FinanceSummary = FinanceSnapshot & {
  paidCommissionAmount: number;
  remainingCommissionAmount: number;
  paidClientAmount: number;
  clientPaidAmount: number;
  paymentPaidAmount: number;
};

export const CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_NOTE = {
  contractValue: 'Wartość kontraktu/sprawy. Nie oznacza jeszcze pieniędzy pobranych od klienta.',
  paidAmount: 'Suma wpłat klienta z payment type deposit/partial/final/other o statusie paid, pomniejszona o refundy paid.',
  commission: 'Prowizja operatora. Nie jest tym samym co płatność klienta i nie jest tym samym co dealValue leada.',
  noRuntimeMigration: 'FIN-1 nie tworzy UI, migracji DB ani panelu finansów.',
  compat: 'FIN-1 repair zostawia stare eksporty używane przez CaseSettlementPanel: FinancePayment, FinanceSummary i FinanceCommissionConfig.',
} as const;
