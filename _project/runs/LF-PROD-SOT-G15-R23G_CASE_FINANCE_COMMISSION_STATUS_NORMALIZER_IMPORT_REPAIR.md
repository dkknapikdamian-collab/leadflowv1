# LF-PROD-SOT-G15-R23G — Case-finance commission-status normalizer import repair

TIMESTAMP:
2026-07-21 18:10 Europe/Warsaw

STATUS:
FIRST_REMOTE_CI_PASS_NEXT_ERROR_PINNED_FINAL_CI_PENDING

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
200471a785d6f10206727c21fc9cbbc20252a3a1

STAGE_ID:
LF-PROD-SOT-G15-R23G_CASE_FINANCE_COMMISSION_STATUS_NORMALIZER_IMPORT_REPAIR

IMPLEMENTATION_BRANCH:
agent/g15-r23g-case-finance-status-import-repair

PR:
#45

## Source-of-truth resolution

The canonical queue after R23F requires rerunning the active TypeScript debt mapper and deriving the next narrow stage from the new first error. R23F closed with:

- active TypeScript debt: `57`;
- global errors: `0`;
- non-active errors: `0`;
- first error: `src/components/finance/CaseFinanceEditorDialog.tsx(94,23) TS2552`.

The failing identifier is `normalizeCommissionStatus`. The helper already exists and is exported by `src/lib/finance/finance-normalize.ts`; the dialog already calls it in the initial-state mapping but omits it from the existing named import.

## Scope

Runtime file changed:

- `src/components/finance/CaseFinanceEditorDialog.tsx`.

Verification-only files:

- `tests/lf-prod-sot-g15-r23g-case-finance-status-import.test.cjs`;
- `scripts/check-g15-r23g-case-finance-status-import.cjs`;
- `.github/workflows/g15-r23g-case-finance-status-import.yml`;
- this report.

## Implementation

The existing import:

```ts
import { normalizeCommissionMode, normalizeCurrency } from '../../lib/finance/finance-normalize';
```

is replaced with:

```ts
import { normalizeCommissionMode, normalizeCommissionStatus, normalizeCurrency } from '../../lib/finance/finance-normalize';
```

No call site, state shape, financial calculation, form behavior, save payload, UI copy, CSS, data source, SQL, DELETE, Google Calendar behavior, dependency manifest, or lockfile is changed.

## Scope proof

The R23G guard normalizes CRLF to LF, replaces the new import with the exact R23F import in memory, and verifies the reconstructed Git blob SHA equals:

`a4c7e29e7ad27e4c7a9f36a63f2121402dfe614b`

This proves `CaseFinanceEditorDialog.tsx` is byte-for-byte unchanged outside the single named import.

## First remote verification

WORKFLOW_RUN:
29847151377

WORKFLOW_JOB:
88690531398

WORKFLOW_RESULT:
SUCCESS

FOCUSED_R23G_TESTS:
PASS

R23G_BYTE_SCOPE_GUARD:
PASS

R23A_ACTIVE_SCOPE_GUARD:
PASS

DEPENDENCY_MANIFESTS_UNCHANGED:
PASS

CHANGED_FILE_ALLOWLIST:
PASS_EXACT_5_FILES

ACTIVE_TYPE_DEBT_BEFORE:
57

ACTIVE_TYPE_DEBT_AFTER:
56

GLOBAL_ERRORS:
0

NON_ACTIVE_ERRORS:
0

REMOVED_ERROR:
`src/components/finance/CaseFinanceEditorDialog.tsx(94,23) TS2552`

FIRST_ERROR_AFTER_R23G:
`src/components/finance/FinanceMiniSummary.tsx(265,22) TS2339`

FIRST_ERROR_MESSAGE:
`Property 'currency' does not exist on type 'ClientFinanceSummary'.`

ARTIFACT_ID:
8501838946

ARTIFACT_DIGEST:
sha256:368d0ecb631f7b43791a4dddd82eb62727997d26eff11f7082f1e9a5d7996dc6

PRODUCTION_BUILD:
PASS

## Final exact-head gate

The workflow now pins the exact next first error shown above. Any final PR-head drift in active debt count, global errors, non-active errors, target removal, or next first error fails the stage.

The two PR-head Vercel statuses currently report an external Hobby build-rate-limit URL, not an application build failure. They are not recorded as deployment PASS and must be rechecked on the exact merge SHA.

## Non-goals

- no broader finance refactor;
- no changes to `normalizeCommissionStatus` implementation;
- no commission calculation or status semantics changes;
- no SQL or migrations;
- no Event or Task DELETE changes;
- no remote Google Calendar DELETE;
- no dependency updates and no automatic `npm audit fix`;
- full lint must not be reported as PASS while 56 active errors remain.

## Result

RESULT:
FIRST_REMOTE_CI_PASS_NEXT_ERROR_PINNED_FINAL_CI_PENDING

The stage may be squash-merged only after the current final PR head passes the updated exact R23G workflow.
