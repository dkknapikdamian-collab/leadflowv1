# LF-PROD-SOT-G15-R23H — Client-finance summary currency contract repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
IMPLEMENTED_BRANCH_PENDING_REMOTE_CI

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
d4e537d3b353c596b5ab3c39c69bd9033f22a1a1

STAGE_ID:
LF-PROD-SOT-G15-R23H_CLIENT_FINANCE_SUMMARY_CURRENCY_CONTRACT_REPAIR

IMPLEMENTATION_BRANCH:
agent/g15-r23h-client-finance-summary-currency-contract

## Source-of-truth resolution

R23G closed with 56 active TypeScript errors and the first two errors:

```text
src/components/finance/FinanceMiniSummary.tsx(265,22) TS2339
src/components/finance/FinanceMiniSummary.tsx(266,68) TS2339
Property 'currency' does not exist on type 'ClientFinanceSummary'.
```

`FinanceMiniSummary` does not construct the aggregate. It consumes the result of `calculateClientFinanceSummary`, which delegates to `getClientCasesFinanceSummary`.

The canonical case summary already resolves a normalized `FinanceCurrency` from the case and matching payments. The client aggregate sums those selected case summaries but omitted the currency field from both its internal and public contracts. The correct narrow repair is therefore at the aggregate source, not in the UI consumer and not through a cast or optional field.

## Runtime scope

Changed runtime files:

- `src/lib/client-finance.ts`;
- `src/lib/finance/case-finance-source.ts`.

Exact additions:

1. `ClientFinanceSummary.currency: FinanceCurrency`;
2. `ClientCasesFinanceSummary.currency: FinanceCurrency`;
3. aggregate return `currency: caseSummaries[0]?.currency || 'PLN'`.

The selected first case summary provides the currency label for the existing aggregate, with `PLN` only when no selected case summary exists. No conversion, arithmetic, payment filtering, case selection, commission logic, cost logic or UI rendering is changed.

## Verification scope

Verification-only files:

- `tests/lf-prod-sot-g15-r23h-client-finance-summary-currency.test.cjs`;
- `scripts/check-g15-r23h-client-finance-summary-currency.cjs`;
- `.github/workflows/g15-r23h-client-finance-summary-currency.yml`;
- this report.

The guard reconstructs both R23G source blobs and proves that the two runtime files are unchanged outside the exact contract additions. It also pins `FinanceMiniSummary.tsx` byte-for-byte to the R23G blob.

## Expected TypeScript delta

ACTIVE_TYPE_DEBT_BEFORE:
56

ACTIVE_TYPE_DEBT_EXPECTED_AFTER:
54

REMOVED_ERRORS:

```text
src/components/finance/FinanceMiniSummary.tsx(265,22) TS2339
src/components/finance/FinanceMiniSummary.tsx(266,68) TS2339
```

EXPECTED_FIRST_ERROR_AFTER_R23H:

```text
src/components/finance/FinanceSnapshot.tsx(4,15) TS2305
Module '"../../lib/finance/finance-types"' has no exported member 'CommissionConfig'.
```

## Non-goals

- no UI or CSS change;
- no finance amount or commission calculation change;
- no mixed-currency conversion or new multi-currency policy;
- no SQL or migration;
- no Event DELETE or Task DELETE change;
- no remote Google Calendar DELETE;
- no dependency or lockfile change;
- no automatic `npm audit fix`;
- full lint must not be reported as PASS while active debt remains.

## Result

RESULT:
IMPLEMENTED_BRANCH_PENDING_REMOTE_CI
