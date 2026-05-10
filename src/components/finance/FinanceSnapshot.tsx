import { useMemo, useState } from 'react';
import { SurfaceCard } from '../ui-system';
import { Button } from '../ui/button';
import type { CommissionConfig, CommissionMode, CommissionStatus, FinancePayment, FinanceSummary } from '../../lib/finance/finance-types';
import { buildFinanceSummary, clampFinanceAmount, calculateCommissionAmount } from '../../lib/finance/finance-calculations';
import { normalizeCommissionConfig, normalizeCommissionStatus, normalizeFinancePayments } from '../../lib/finance/finance-normalize';
import { FinanceMiniSummary } from './FinanceMiniSummary';
import { PaymentList } from './PaymentList';
import { PaymentFormDialog, type PaymentFormValue } from './PaymentFormDialog';
import { CommissionFormDialog, type CommissionFormValue } from './CommissionFormDialog';
import '../../styles/finance/closeflow-finance.css';

export const CLOSEFLOW_FINANCE_COMPONENTS_FIN3 = 'FIN-3_CLOSEFLOW_FINANCE_COMPONENTS_V1' as const;

type FinanceRecord = Record<string, unknown> & {
  id?: string;
  workspaceId?: string;
  workspace_id?: string;
  leadId?: string | null;
  lead_id?: string | null;
  clientId?: string | null;
  client_id?: string | null;
  caseId?: string | null;
  case_id?: string | null;
};

export type FinanceSnapshotProps = {
  record?: FinanceRecord | null;
  payments?: Array<FinancePayment | Record<string, unknown>>;
  title?: string;
  readonly?: boolean;
  onAddPayment?: (value: PaymentFormValue) => void | Promise<void>;
  onEditCommission?: (value: CommissionFormValue) => void | Promise<void>;
  isSaving?: boolean;
};

function pickNumber(row: FinanceRecord | null | undefined, keys: string[]) {
  if (!row) return 0;
  for (const key of keys) {
    const amount = clampFinanceAmount(row[key]);
    if (amount > 0) return amount;
  }
  return 0;
}

function pickText(row: FinanceRecord | null | undefined, keys: string[], fallback = '') {
  if (!row) return fallback;
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function buildRelation(record?: FinanceRecord | null) {
  const caseId = pickText(record, ['caseId', 'case_id', 'id']);
  return {
    workspaceId: pickText(record, ['workspaceId', 'workspace_id']),
    leadId: pickText(record, ['leadId', 'lead_id']) || null,
    clientId: pickText(record, ['clientId', 'client_id']) || null,
    caseId: caseId || null,
  };
}

function buildFallbackPaidPayment(record: FinanceRecord | null | undefined, currency: string): FinancePayment[] {
  const paidAmount = pickNumber(record, ['paidAmount', 'paid_amount']);
  if (paidAmount <= 0) return [];
  return [{
    id: 'record-paid-amount',
    workspaceId: pickText(record, ['workspaceId', 'workspace_id']),
    leadId: pickText(record, ['leadId', 'lead_id']) || null,
    clientId: pickText(record, ['clientId', 'client_id']) || null,
    caseId: pickText(record, ['caseId', 'case_id', 'id']) || null,
    type: 'partial',
    status: 'paid',
    amount: paidAmount,
    currency,
    paidAt: null,
    dueAt: null,
    note: 'Kwota wpłacona z rekordu',
    createdAt: null,
    updatedAt: null,
  }];
}

function buildCommissionConfigFromRecord(record: FinanceRecord | null | undefined, currency: string): CommissionConfig {
  return normalizeCommissionConfig({
    ...record,
    currency,
    mode: record?.['commissionMode'] || record?.['commission_mode'],
    base: record?.['commissionBase'] || record?.['commission_base'],
    percent: record?.['commissionRate'] || record?.['commission_rate'],
    fixedAmount: record?.['commissionAmount'] || record?.['commission_amount'],
  });
}

function buildSummary(record: FinanceRecord | null | undefined, payments: FinancePayment[], commission: CommissionConfig): FinanceSummary {
  const contractValue = pickNumber(record, ['contractValue', 'contract_value', 'expectedRevenue', 'expected_revenue', 'dealValue', 'deal_value', 'value']);
  const remainingAmount = pickNumber(record, ['remainingAmount', 'remaining_amount']);
  const summary = buildFinanceSummary({
    contractValue,
    remainingAmount,
    currency: commission.currency,
    payments,
    commission,
    nowIso: new Date().toISOString(),
  });

  const explicitCommissionAmount = pickNumber(record, ['commissionAmount', 'commission_amount']);
  if (explicitCommissionAmount > 0 && summary.commissionAmount <= 0) {
    return {
      ...summary,
      commissionAmount: explicitCommissionAmount,
      commissionStatus: normalizeCommissionStatus(record?.['commissionStatus'] || record?.['commission_status'] || summary.commissionStatus),
    };
  }

  return {
    ...summary,
    commissionStatus: normalizeCommissionStatus(record?.['commissionStatus'] || record?.['commission_status'] || summary.commissionStatus),
  };
}

export function FinanceSnapshot({
  record = null,
  payments = [],
  title = 'Rozliczenie',
  readonly = false,
  onAddPayment,
  onEditCommission,
  isSaving = false,
}: FinanceSnapshotProps) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [commissionOpen, setCommissionOpen] = useState(false);

  const currency = pickText(record, ['currency'], 'PLN').toUpperCase();
  const relation = useMemo(() => buildRelation(record), [record]);
  const normalizedPayments = useMemo(() => {
    const fromRows = normalizeFinancePayments(payments as Record<string, unknown>[]);
    return fromRows.length ? fromRows : buildFallbackPaidPayment(record, currency);
  }, [currency, payments, record]);
  const commission = useMemo(() => buildCommissionConfigFromRecord(record, currency), [currency, record]);
  const summary = useMemo(() => buildSummary(record, normalizedPayments, commission), [commission, normalizedPayments, record]);
  const commissionAmount = calculateCommissionAmount(commission, summary.contractValue, summary.paidAmount) || summary.commissionAmount;
  const commissionStatus = normalizeCommissionStatus(record?.['commissionStatus'] || record?.['commission_status'] || summary.commissionStatus) as CommissionStatus;

  return (
    <SurfaceCard className="cf-finance-snapshot" tone="default">
      <FinanceMiniSummary
        title={title}
        summary={{ ...summary, commissionAmount }}
        commissionMode={commission.mode as CommissionMode}
        commissionRate={commission.percent}
        commissionStatus={commissionStatus}
      />

      {!readonly && (
        <div className="cf-finance-actions" aria-label="Akcje rozliczenia">
          <Button type="button" size="sm" onClick={() => setPaymentOpen(true)} disabled={isSaving || !onAddPayment}>
            Dodaj wpłatę
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setCommissionOpen(true)} disabled={isSaving || !onEditCommission}>
            Edytuj prowizję
          </Button>
        </div>
      )}

      <PaymentList payments={normalizedPayments} compact />

      <PaymentFormDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        relation={relation}
        defaultCurrency={currency}
        onSubmit={onAddPayment}
        isSaving={isSaving}
      />

      <CommissionFormDialog
        open={commissionOpen}
        onOpenChange={setCommissionOpen}
        defaultCurrency={currency}
        defaultValue={{
          commissionMode: commission.mode,
          commissionBase: commission.base,
          commissionRate: commission.percent,
          commissionAmount,
          commissionStatus,
          currency,
        }}
        onSubmit={onEditCommission}
        isSaving={isSaving}
      />
    </SurfaceCard>
  );
}

export default FinanceSnapshot;
