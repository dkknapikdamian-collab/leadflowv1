# LF-PROD-SOT-G15-R23H — Client-finance summary currency contract repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
FIRST_REMOTE_CI_PASS_FINAL_READ_ONLY_CI_PENDING

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
d4e537d3b353c596b5ab3c39c69bd9033f22a1a1

STAGE_ID:
LF-PROD-SOT-G15-R23H_CLIENT_FINANCE_SUMMARY_CURRENCY_CONTRACT_REPAIR

IMPLEMENTATION_BRANCH:
agent/g15-r23h-client-finance-summary-currency-contract

PR:
#46

CURRENT_PR_HEAD:
fac2956c9088919ca7290687d829f90b315fdaf7

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

## First remote verification

WORKFLOW_RUN:
29851156617

WORKFLOW_JOB:
88704070544

WORKFLOW_RESULT:
SUCCESS

FOCUSED_R23H_TESTS:
PASS

R23H_BYTE_SCOPE_GUARD:
PASS

R23A_ACTIVE_SCOPE_GUARD:
PASS

DEPENDENCY_MANIFESTS_UNCHANGED:
PASS

CHANGED_FILE_ALLOWLIST:
PASS_EXACT_6_FILES

PRODUCTION_BUILD:
PASS

ACTIVE_TYPE_DEBT_BEFORE:
56

ACTIVE_TYPE_DEBT_AFTER:
54

GLOBAL_ERRORS:
0

NON_ACTIVE_ERRORS:
0

REMOVED_ERRORS:

```text
src/components/finance/FinanceMiniSummary.tsx(265,22) TS2339
src/components/finance/FinanceMiniSummary.tsx(266,68) TS2339
```

FIRST_ERROR_AFTER_R23H:

```text
src/components/finance/FinanceSnapshot.tsx(4,15) TS2305
Module '"../../lib/finance/finance-types"' has no exported member 'CommissionConfig'.
```

ARTIFACT_ID:
8503416279

ARTIFACT_DIGEST:
sha256:70cb099e4544968cb43e6440692c5130faf6f4b06f585b54eac24550015fcdac

## Final exact-head gate

The first workflow used a one-time idempotent bootstrap to write the two exact runtime additions and committed them to the PR branch. That bootstrap is now removed. The final workflow is read-only and must pass again on the exact final PR head before merge.

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
FIRST_REMOTE_CI_PASS_FINAL_READ_ONLY_CI_PENDING
