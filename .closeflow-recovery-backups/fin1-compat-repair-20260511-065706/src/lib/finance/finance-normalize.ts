import {
  COMMISSION_BASES,
  COMMISSION_MODES,
  COMMISSION_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_TYPES,
  type CommissionBase,
  type CommissionMode,
  type CommissionStatus,
  type FinanceCurrency,
  type FinancePaymentLike,
  type NormalizedFinancePayment,
  type PaymentStatus,
  type PaymentType,
} from './finance-types';

export const CLOSEFLOW_FINANCE_NORMALIZE_FIN1 = 'CLOSEFLOW_FINANCE_NORMALIZE_FIN1';

export function normalizeMoneyAmount(value: unknown, fallback = 0): number {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, value) : fallback;
  if (typeof value !== 'string') return fallback;

  const normalized = value
    .trim()
    .replace(/\s+/g, '')
    .replace(/pln|zĹ‚/gi, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

export function normalizeCurrency(value: unknown, fallback: FinanceCurrency = 'PLN'): FinanceCurrency {
  const normalized = typeof value === 'string' ? value.trim().toUpperCase() : '';
  return /^[A-Z]{3}$/.test(normalized) ? normalized : fallback;
}

function normalizeEnum<T extends readonly string[]>(value: unknown, allowed: T, fallback: T[number]): T[number] {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return (allowed as readonly string[]).includes(normalized) ? (normalized as T[number]) : fallback;
}

export function normalizeCommissionMode(value: unknown): CommissionMode {
  return normalizeEnum(value, COMMISSION_MODES, 'none');
}

export function normalizeCommissionBase(value: unknown): CommissionBase {
  return normalizeEnum(value, COMMISSION_BASES, 'contract_value');
}

export function normalizeCommissionStatus(value: unknown): CommissionStatus {
  return normalizeEnum(value, COMMISSION_STATUSES, 'not_set');
}

export function normalizePaymentType(value: unknown): PaymentType {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized === 'advance') return 'deposit';
  if (normalized === 'part') return 'partial';
  if (normalized === 'rest') return 'final';
  return normalizeEnum(normalized, PAYMENT_TYPES, 'other');
}

export function normalizePaymentStatus(value: unknown): PaymentStatus {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized === 'pending' || normalized === 'awaiting_payment') return 'due';
  if (normalized === 'done' || normalized === 'completed' || normalized === 'settled') return 'paid';
  if (normalized === 'canceled') return 'cancelled';
  return normalizeEnum(normalized, PAYMENT_STATUSES, 'planned');
}

function nullableText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function normalizeFinancePayment(payment: FinancePaymentLike | null | undefined, fallbackCurrency = 'PLN'): NormalizedFinancePayment {
  const row = payment || {};
  return {
    id: typeof row.id === 'string' && row.id.trim() ? row.id.trim() : undefined,
    type: normalizePaymentType(row.type),
    status: normalizePaymentStatus(row.status),
    amount: normalizeMoneyAmount(row.amount, 0),
    currency: normalizeCurrency(row.currency, fallbackCurrency),
    paidAt: nullableText(row.paidAt ?? row.paid_at),
    dueAt: nullableText(row.dueAt ?? row.due_at),
    note: typeof row.note === 'string' ? row.note.trim() : '',
  };
}

export function normalizeFinancePayments(payments: FinancePaymentLike[] | null | undefined, fallbackCurrency = 'PLN'): NormalizedFinancePayment[] {
  return Array.isArray(payments) ? payments.map((payment) => normalizeFinancePayment(payment, fallbackCurrency)) : [];
}

export function normalizeFinanceDate(value: unknown): Date | null {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T23:59:59` : raw);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}
