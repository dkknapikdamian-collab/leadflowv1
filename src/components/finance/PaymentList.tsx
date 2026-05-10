import type { FinancePayment, PaymentStatus, PaymentType } from '../../lib/finance/finance-types';
import { normalizeFinancePayments } from '../../lib/finance/finance-normalize';

type PaymentListProps = {
  payments?: Array<FinancePayment | Record<string, unknown>>;
  title?: string;
  emptyText?: string;
  compact?: boolean;
};

const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  deposit: 'Zaliczka',
  partial: 'Wpłata częściowa',
  final: 'Wpłata końcowa',
  commission: 'Prowizja',
  refund: 'Zwrot',
  other: 'Inna wpłata',
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  planned: 'planowana',
  due: 'należna',
  paid: 'zapłacona',
  cancelled: 'anulowana',
};

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
    <section className={`cf-finance-payment-list${compact ? ' cf-finance-payment-list--compact' : ''}`} aria-label={title}>
      <div className="cf-finance-section-header">
        <h3>{title}</h3>
        <span>{normalized.length}</span>
      </div>

      {normalized.length === 0 ? (
        <p className="cf-finance-empty">{emptyText}</p>
      ) : (
        <ul className="cf-finance-payment-list__items">
          {normalized.map((payment) => (
            <li key={payment.id} className="cf-finance-payment-row">
              <div className="cf-finance-payment-row__main">
                <strong>{PAYMENT_TYPE_LABELS[payment.type] || payment.type}</strong>
                <span>{payment.note || formatDate(payment.paidAt || payment.dueAt)}</span>
              </div>
              <div className="cf-finance-payment-row__side">
                <strong>{formatMoney(payment.amount, payment.currency)}</strong>
                <span className={`cf-finance-status cf-finance-status--payment-${payment.status}`}>
                  {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PaymentList;
