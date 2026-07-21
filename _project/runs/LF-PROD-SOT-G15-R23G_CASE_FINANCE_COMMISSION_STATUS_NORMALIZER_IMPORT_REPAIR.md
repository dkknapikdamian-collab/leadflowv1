# LF-PROD-SOT-G15-R23G — Case-finance commission-status normalizer import repair

TIMESTAMP:
2026-07-21 18:06 Europe/Warsaw

STATUS:
REMOTE_CI_PENDING

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
200471a785d6f10206727c21fc9cbbc20252a3a1

STAGE_ID:
LF-PROD-SOT-G15-R23G_CASE_FINANCE_COMMISSION_STATUS_NORMALIZER_IMPORT_REPAIR

IMPLEMENTATION_BRANCH:
agent/g15-r23g-case-finance-status-import-repair

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

## Expected acceptance evidence

- focused R23G tests: PASS;
- R23G byte-scope guard: PASS;
- R23A active-scope guard: PASS;
- dependency manifests unchanged: PASS;
- exact changed-file allowlist: five files;
- active TypeScript debt: `57 -> 56`;
- global errors: `0`;
- non-active errors: `0`;
- `CaseFinanceEditorDialog.tsx(94,23) TS2552` absent;
- next first error recorded from the mapper;
- production build: PASS.

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
REMOTE_CI_PENDING

The stage may be squash-merged only after the current PR head passes the R23G workflow and the exact next first error is added to the final evidence.
