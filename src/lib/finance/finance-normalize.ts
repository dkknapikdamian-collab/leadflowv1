import {
  COMMISSION_BASES,
  COMMISSION_MODES,
  COMMISSION_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_TYPES,
  type CommissionBase,
  type CommissionConfig,
  type CommissionMode,
  type CommissionStatus,
  type FinancePayment,
  type PaymentStatus,
  type PaymentType,
} from './finance-types';
import { clampFinanceAmount, normalizeCommissionPercent } from './finance-calculations';

type RawFinanceRecord = Record<string, unknown>;

type ReadonlyStringList = readonly string[];

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function pickText(row: RawFinanceRecord, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function pickNullableText(row: RawFinanceRecord, keys: string[]) {
  const value = pickText(row, keys, '');
  return value || null;
}

function isAllowed<T extends string>(value: string, allowed: ReadonlyStringList): value is T {
  return allowed.includes(value);
}

export function normalizeCurrency(value: unknown, fallback = 'PLN') {
  const normalized = asText(value || fallback).toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : fallback;
}

export function normalizePaymentType(value: unknown): PaymentType {
  const normalized = asText(value).toLowerCase();
  return isAllowed<PaymentType>(normalized, PAYMENT_TYPES) ? normalized : 'other';
}

export function normalizePaymentStatus(value: unknown): PaymentStatus {
  const normalized = asText(value).toLowerCase();
  if (normalized === 'pending' || normalized === 'awaiting_payment') return 'due';
  if (normalized === 'done' || normalized === 'completed' || normalized === 'settled') return 'paid';
  if (normalized === 'canceled') return 'cancelled';
  return isAllowed<PaymentStatus>(normalized, PAYMENT_STATUSES) ? normalized : 'planned';
}

export function normalizeCommissionMode(value: unknown): CommissionMode {
  const normalized = asText(value).toLowerCase();
  return isAllowed<CommissionMode>(normalized, COMMISSION_MODES) ? normalized : 'none';
}

export function normalizeCommissionBase(value: unknown): CommissionBase {
  const normalized = asText(value).toLowerCase();
  return isAllowed<CommissionBase>(normalized, COMMISSION_BASES) ? normalized : 'contract_value';
}

export function normalizeCommissionStatus(value: unknown): CommissionStatus {
  const normalized = asText(value).toLowerCase();
  return isAllowed<CommissionStatus>(normalized, COMMISSION_STATUSES) ? normalized : 'not_set';
}

export function normalizeDateTime(value: unknown) {
  const text = asText(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function normalizeFinancePayment(row: RawFinanceRecord, fallbackId = 'payment') : FinancePayment {
  return {
    id: pickText(row, ['id'], fallbackId),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    leadId: pickNullableText(row, ['leadId', 'lead_id']),
    clientId: pickNullableText(row, ['clientId', 'client_id']),
    caseId: pickNullableText(row, ['caseId', 'case_id']),
    type: normalizePaymentType(row.type || row.paymentType || row.payment_type),
    status: normalizePaymentStatus(row.status || row.paymentStatus || row.payment_status),
    amount: clampFinanceAmount(row.amount ?? row.value ?? row.total ?? row.paidAmount ?? row.paid_amount),
    currency: normalizeCurrency(row.currency),
    paidAt: normalizeDateTime(row.paidAt || row.paid_at),
    dueAt: normalizeDateTime(row.dueAt || row.due_at),
    note: pickText(row, ['note', 'notes'], ''),
    createdAt: normalizeDateTime(row.createdAt || row.created_at),
    updatedAt: normalizeDateTime(row.updatedAt || row.updated_at),
  };
}

export function normalizeFinancePayments(rows: RawFinanceRecord[] = []) {
  return rows.map((row, index) => normalizeFinancePayment(row, `payment-${index}`));
}

export function normalizeCommissionConfig(row: RawFinanceRecord = {}): CommissionConfig {
  const mode = normalizeCommissionMode(row.commissionMode || row.commission_mode || row.mode);
  const base = normalizeCommissionBase(row.commissionBase || row.commission_base || row.base);

  return {
    mode,
    base,
    percent: mode === 'percent' ? normalizeCommissionPercent(row.commissionPercent || row.commission_percent || row.percent) : null,
    fixedAmount: mode === 'fixed' ? clampFinanceAmount(row.commissionFixedAmount || row.commission_fixed_amount || row.fixedAmount || row.fixed_amount) : null,
    customBaseAmount: base === 'custom' ? clampFinanceAmount(row.commissionCustomBaseAmount || row.commission_custom_base_amount || row.customBaseAmount || row.custom_base_amount) : null,
    currency: normalizeCurrency(row.currency),
  };
}
