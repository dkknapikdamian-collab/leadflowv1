import type { PaymentStatus, PaymentType } from './finance-types.js';

export const FIN6_PAYMENTS_LIST_AND_PAYMENT_TYPES = 'FIN-6_PAYMENTS_LIST_AND_PAYMENT_TYPES_V1' as const;

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  deposit: 'Zaliczka',
  partial: 'Częściowa wpłata',
  final: 'Końcowa wpłata',
  commission: 'Prowizja',
  refund: 'Zwrot',
  other: 'Inne',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  planned: 'Planowana',
  due: 'Należna',
  paid: 'Zapłacona',
  cancelled: 'Anulowana',
};

export const PAYMENT_TYPE_OPTIONS: Array<{ value: PaymentType; label: string }> = [
  { value: 'deposit', label: PAYMENT_TYPE_LABELS.deposit },
  { value: 'partial', label: PAYMENT_TYPE_LABELS.partial },
  { value: 'final', label: PAYMENT_TYPE_LABELS.final },
  { value: 'commission', label: PAYMENT_TYPE_LABELS.commission },
  { value: 'refund', label: PAYMENT_TYPE_LABELS.refund },
  { value: 'other', label: PAYMENT_TYPE_LABELS.other },
];

export const PAYMENT_STATUS_OPTIONS: Array<{ value: PaymentStatus; label: string }> = [
  { value: 'planned', label: PAYMENT_STATUS_LABELS.planned },
  { value: 'due', label: PAYMENT_STATUS_LABELS.due },
  { value: 'paid', label: PAYMENT_STATUS_LABELS.paid },
  { value: 'cancelled', label: PAYMENT_STATUS_LABELS.cancelled },
];

export function getPaymentTypeLabel(value: PaymentType | string | null | undefined) {
  const key = String(value || 'other') as PaymentType;
  return PAYMENT_TYPE_LABELS[key] || PAYMENT_TYPE_LABELS.other;
}

export function getPaymentStatusLabel(value: PaymentStatus | string | null | undefined) {
  const key = String(value || 'planned') as PaymentStatus;
  return PAYMENT_STATUS_LABELS[key] || String(value || 'planned');
}
