# LF-PROD-SOT-G15-R23A — Active TypeScript scope and type-debt map

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
PASS_DIAGNOSTIC_STAGE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
8480a77d76a4777c2b9ea9d069c632bfd14f5099

PR:
#39

REPLACED_STAGE:
LF-PROD-SOT-G15-R23_TSC_ACTIVE_PRODUCT_SCOPE_REPAIR

REPLACED_PR:
#37 CLOSED_WITHOUT_MERGE_SCOPE_MISMATCH

## Goal

Create an executable, narrow map of TypeScript debt in active `src`, `api` and `vite.config.ts` sources without importing any runtime repair from the rejected broad R23 branch.

## Implemented scope

- diagnostic `tsconfig.r23a-active.json`;
- deterministic TypeScript program-root validation;
- machine-readable JSON, Markdown and raw-log evidence;
- focused contract tests;
- changed-file allowlist;
- CI artifact upload;
- production build as a non-runtime regression check.

## Explicit exclusions verified

- no `src` changes;
- no `api` changes;
- no package or lockfile changes;
- no SQL or migrations;
- no Event DELETE or Task DELETE changes;
- no Google Calendar changes;
- no Vercel deployment claim;
- no import of runtime patches from PR #37.

## Dependency handling

React 19 type packages were installed diagnostically with exact versions and `--no-save --package-lock=false`. R23A maps debt only. A persistent dependency decision belongs to a later implementation stage and was not smuggled into this diagnostic PR.

## Verification evidence

WORKFLOW:
G15-R23A active TypeScript debt map

RUN_ID:
29828362951

WORKFLOW_STATUS:
PASS

ARTIFACT_ID:
8494248379

ARTIFACT_NAME:
g15-r23a-active-type-debt-map

ARTIFACT_SHA256:
d96cb96010071b3f8d50c41f37d3f6286f2934ce8493fadd4e7756f2ae7b535c

FOCUSED_R23A_TESTS:
PASS

DIAGNOSTIC_SCOPE_LEAK_CHECK:
PASS — 381 active root files, 0 scope leaks

CHANGED_FILE_ALLOWLIST:
PASS

GIT_DIFF_CHECK:
PASS

PRODUCTION_BUILD:
PASS

## Exact active debt map

TSC_EXIT_CODE:
2

TOTAL_ERRORS:
68

UNIQUE_ERROR_FILES:
26

MISSING_REACT_TYPE_ERRORS_AFTER_DIAGNOSTIC_INSTALL:
0

IMPLICIT_JSX_ERRORS_AFTER_DIAGNOSTIC_INSTALL:
0

ERRORS_BY_CODE:
- TS2304: 13
- TS2339: 12
- TS2769: 8
- TS2322: 7
- TS2353: 6
- TS2305: 3
- TS2365: 3
- TS2300: 2
- TS2345: 2
- TS2352: 2
- TS2554: 2
- TS2741: 2
- remaining codes: 6

TOP_ERROR_FILES:
- `src/pages/CaseDetail.tsx`: 11
- `src/pages/LeadDetail.tsx`: 8
- `src/components/ContextActionDialogs.tsx`: 5
- `src/pages/Today.tsx`: 5
- `src/lib/finance/case-finance-source.ts`: 4
- `src/components/finance/FinanceSnapshot.tsx`: 3
- `src/hooks/useFirebaseSession.ts`: 3
- `src/pages/Cases.tsx`: 3
- `src/pages/ClientDetail.tsx`: 3
- `src/pwa/chunk-asset-reload-guard.ts`: 3

## R23B planning boundary

The 68 errors must not be repaired as one unreviewed bulk patch. R23B must partition them into behavior-preserving batches with focused tests before any runtime merge:

1. missing symbols and out-of-scope JSX fragments;
2. DOM event versus React event type collisions;
3. finance-domain export and summary compatibility;
4. work-item no-flicker and missing-item contracts;
5. component callback and button-prop contracts;
6. session, PWA and runtime-source narrowing.

Each batch must preserve runtime semantics, include executable regression tests, run active typecheck and production build, and reject unrelated runtime edits.

NEXT_STAGE:
LF-PROD-SOT-G15-R23B_ACTIVE_TYPE_DEBT_REPAIR_PLAN

RESULT:
PASS_MAP_GENERATED_WITH_ACTIVE_DEBT
