import { getClientCasesFinanceSummary } from './finance/case-finance-source.js';

export type ClientFinanceSummary = {
  totalValue: number;
  paidValue: number;
  remainingValue: number;
  settlementsCount: number;
  source: 'primary_case' | 'all_active_cases' | 'all_cases';
  commissionAmount?: number;
  commissionPaidAmount?: number;
  commissionRemainingAmount?: number;
};

export type ClientFinanceSummaryMode = 'primary_case_first' | 'all_active_cases';

export const CLOSEFLOW_FIN10_CLIENT_FINANCE_USES_CASE_SOURCE = 'CLOSEFLOW_FIN10_CLIENT_FINANCE_USES_CASE_SOURCE_V1' as const;

export function calculateClientFinanceSummary(input: {
  client: unknown;
  cases: unknown[];
  payments: unknown[];
  mode?: ClientFinanceSummaryMode;
}): ClientFinanceSummary {
  return getClientCasesFinanceSummary(input);
}

export const FIN13_CLIENT_FINANCE_IS_CASE_FINANCE = 'FIN13_CLIENT_FINANCE_IS_CASE_FINANCE';
