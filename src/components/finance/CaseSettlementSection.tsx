import type { ComponentProps } from 'react';
import CaseSettlementPanel from './CaseSettlementPanel';
export type { CaseSettlementCommissionInput, CaseSettlementPaymentInput } from './CaseSettlementPanel';

const CLOSEFLOW_CASE_SETTLEMENT_SECTION_ROUTE_GUARD = 'case finance must render only for loaded matching CaseDetail record';
void CLOSEFLOW_CASE_SETTLEMENT_SECTION_ROUTE_GUARD;

type CaseSettlementPanelProps = ComponentProps<typeof CaseSettlementPanel>;

export type CaseSettlementSectionProps = CaseSettlementPanelProps & {
  routeCaseId?: string | number | null;
  isLoading?: boolean;
};

function readRecordId(record: CaseSettlementPanelProps['record']) {
  if (!record || typeof record !== 'object') return '';
  const value = (record as Record<string, unknown>).id;
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
}

export function CaseSettlementSection({
  record = null,
  payments = [],
  routeCaseId = null,
  isLoading = false,
  ...rest
}: CaseSettlementSectionProps) {
  const recordId = readRecordId(record);
  const expectedRouteId = typeof routeCaseId === 'string' || typeof routeCaseId === 'number'
    ? String(routeCaseId).trim()
    : '';

  if (isLoading || !record || !recordId) {
    return null;
  }

  if (expectedRouteId && expectedRouteId !== recordId) {
    return null;
  }

  return (
    <section
      data-cf-case-finance-section="case-detail-only"
      data-case-settlement-section="fin10"
      data-cf-case-id={recordId}
      aria-label="Rozliczenie sprawy"
    >
      <CaseSettlementPanel
        {...rest}
        key={recordId}
        record={record}
        payments={payments}
      />
    </section>
  );
}

export default CaseSettlementSection;
