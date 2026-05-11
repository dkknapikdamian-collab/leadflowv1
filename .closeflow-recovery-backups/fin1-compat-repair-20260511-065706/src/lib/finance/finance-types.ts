export const CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1 = 'CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1';

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

export type FinanceCommissionInput = {
  mode?: CommissionMode | string | null;
  base?: CommissionBase | string | null;
  status?: CommissionStatus | string | null;
  rate?: number | string | null;
  amount?: number | string | null;
  fixedAmount?: number | string | null;
  customBaseAmount?: number | string | null;
  paidAmount?: number | string | null;
  dueAt?: string | null;
};

export type FinanceSnapshotInput = {
  contractValue?: number | string | null;
  paidAmount?: number | string | null;
  currency?: FinanceCurrency | string | null;
  payments?: FinancePaymentLike[] | null;
  commission?: FinanceCommissionInput | null;
  now?: Date | string | number | null;
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

export const CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_NOTE = {
  contractValue: 'WartoĹ›Ä‡ kontraktu/sprawy. Nie oznacza jeszcze pieniÄ™dzy pobranych od klienta.',
  paidAmount: 'Suma wpĹ‚at klienta z payment type deposit/partial/final/other o statusie paid, pomniejszona o refundy paid.',
  commission: 'Prowizja operatora. Nie jest tym samym co pĹ‚atnoĹ›Ä‡ klienta i nie jest tym samym co dealValue leada.',
  noRuntimeMigration: 'FIN-1 nie tworzy UI, migracji DB ani panelu finansĂłw.',
} as const;
