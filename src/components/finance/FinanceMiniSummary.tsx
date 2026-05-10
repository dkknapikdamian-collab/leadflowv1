import type { CommissionMode, CommissionStatus, FinanceSummary } from '../../lib/finance/finance-types';

type FinanceMiniSummaryProps = {
  summary: FinanceSummary;
  commissionMode?: CommissionMode;
  commissionRate?: number | null;
  commissionStatus?: CommissionStatus;
  title?: string;
};

const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  not_set: 'nieustawiona',
  expected: 'oczekiwana',
  due: 'należna',
  partially_paid: 'częściowo zapłacona',
  paid: 'zapłacona',
  overdue: 'zaległa',
};

function formatMoney(value: unknown, currency = 'PLN') {
  const amount = Number(value || 0);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeCurrency = String(currency || 'PLN').toUpperCase();
  return `${Math.round(safeAmount).toLocaleString('pl-PL')} ${safeCurrency}`;
}

function formatPercent(value: unknown) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount <= 0) return '';
  return `${amount.toLocaleString('pl-PL', { maximumFractionDigits: 2 })}%`;
}

function buildCommissionLabel(summary: FinanceSummary, mode?: CommissionMode, rate?: number | null) {
  if (!summary.commissionAmount) return 'Brak prowizji';
  if (mode === 'percent' && Number(rate || 0) > 0) {
    return `${formatPercent(rate)} = ${formatMoney(summary.commissionAmount, summary.currency)}`;
  }
  if (mode === 'fixed') {
    return `stała = ${formatMoney(summary.commissionAmount, summary.currency)}`;
  }
  return formatMoney(summary.commissionAmount, summary.currency);
}

export function FinanceMiniSummary({
  summary,
  commissionMode = 'none',
  commissionRate = null,
  commissionStatus,
  title = 'Rozliczenie',
}: FinanceMiniSummaryProps) {
  const resolvedCommissionStatus = commissionStatus || summary.commissionStatus;

  return (
    <section className="cf-finance-mini-summary" aria-label={title}>
      <div className="cf-finance-mini-summary__header">
        <p className="cf-finance-kicker">{title}</p>
        <strong className="cf-finance-mini-summary__value">
          {formatMoney(summary.contractValue, summary.currency)}
        </strong>
      </div>

      <dl className="cf-finance-mini-summary__grid">
        <div className="cf-finance-metric">
          <dt>Wartość</dt>
          <dd>{formatMoney(summary.contractValue, summary.currency)}</dd>
        </div>
        <div className="cf-finance-metric">
          <dt>Prowizja</dt>
          <dd>{buildCommissionLabel(summary, commissionMode, commissionRate)}</dd>
        </div>
        <div className="cf-finance-metric">
          <dt>Wpłacono</dt>
          <dd>{formatMoney(summary.paidAmount, summary.currency)}</dd>
        </div>
        <div className="cf-finance-metric">
          <dt>Pozostało</dt>
          <dd>{formatMoney(summary.remainingAmount, summary.currency)}</dd>
        </div>
        <div className="cf-finance-metric cf-finance-metric--wide">
          <dt>Status prowizji</dt>
          <dd>
            <span className={`cf-finance-status cf-finance-status--${resolvedCommissionStatus}`}>
              {COMMISSION_STATUS_LABELS[resolvedCommissionStatus] || resolvedCommissionStatus}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default FinanceMiniSummary;
