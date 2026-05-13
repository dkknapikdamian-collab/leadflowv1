import type { FinancePayment, PaymentStatus, PaymentType } from '../../lib/finance/finance-types';
import { normalizeFinancePayments } from '../../lib/finance/finance-normalize';
import { getPaymentStatusLabel, getPaymentTypeLabel } from '../../lib/finance/finance-payment-labels';
import { StatusPill } from '../ui-system';

export const CLOSEFLOW_FIN14_PAYMENT_LIST_TYPE_LABELS = 'CLOSEFLOW_FIN14_PAYMENT_LIST_TYPE_LABELS_V1' as const;

type PaymentListProps = {
  payments?: Array<FinancePayment | Record<string, unknown>>;
  title?: string;
  emptyText?: string;
  compact?: boolean;
};

export function getPaymentStatusTone(status: PaymentStatus | string) {
  if (status === 'paid' || status === 'fully_paid' || status === 'deposit_paid' || status === 'partially_paid') return 'green' as const;
  if (status === 'due' || status === 'planned' || status === 'pending' || status === 'awaiting_payment') return 'amber' as const;
  if (status === 'cancelled' || status === 'canceled') return 'red' as const;
  return 'blue' as const;
}

export function getVisiblePaymentTypeLabel(type: PaymentType | string | null | undefined) {
  const normalized = String(type || '').trim().toLowerCase();
  if (normalized === 'deposit') return 'Zaliczka';
  if (normalized === 'partial') return 'Wpłata klienta';
  if (normalized === 'commission') return 'Prowizja';
  return getPaymentTypeLabel(type || 'other');
}

function formatMoney(value: unknown, currency = 'PLN') {
  const amount = Number(value || 0);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${Math.round(safeAmount).toLocaleString('pl-PL')} ${String(currency || 'PLN').toUpperCase()}`;
}

function formatDate(value?: string | null) {
  if (!value) return 'bez terminu';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'bez terminu';
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function PaymentList({
  payments = [],
  title = 'Wpłaty',
  emptyText = 'Brak zapisanych wpłat.',
  compact = false,
}: PaymentListProps) {
  const normalized = normalizeFinancePayments(payments as Record<string, unknown>[]);

  return (
    <section className={`cf-finance-payment-list${compact ? ' cf-finance-payment-list--compact' : ''}`} aria-label={title} data-fin14-payment-list="true">
      <div className="cf-finance-section-header">
        <h3>{title}</h3>
        <span>{normalized.length}</span>
      </div>

      {normalized.length === 0 ? (
        <p className="cf-finance-empty">{emptyText}</p>
      ) : (
        <ul className="cf-finance-payment-list__items">
          {normalized.map((payment, index) => (
            <li key={payment.id || `${payment.type}-${payment.amount}-${index}`} className="cf-finance-payment-row" data-fin14-payment-row-type={payment.type}>
              <div className="cf-finance-payment-row__main">
                <strong>{getVisiblePaymentTypeLabel(payment.type)}</strong>
                <span>{payment.note || formatDate(payment.paidAt || payment.dueAt)}</span>
              </div>
              <div className="cf-finance-payment-row__side">
                <strong>{formatMoney(payment.amount, payment.currency)}</strong>
                <StatusPill tone={getPaymentStatusTone(payment.status)} className={`cf-finance-status cf-finance-status--payment-${payment.status}`}>
                  {getPaymentStatusLabel(payment.status)}
                </StatusPill>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PaymentList;
