# LF-PROD-SOT-G15-R23 — TypeScript active product scope repair

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
8480a77d76a4777c2b9ea9d069c632bfd14f5099

## Classification

FAILURE_CLASSIFICATION:
MAIN_TSC_PROGRAM_ACCIDENTALLY_INCLUDED_HISTORICAL_ONE_SHOT_CJS_PATCHERS

The root `tsconfig.json` had `allowJs: true` and no `include`, so `tsc --noEmit` parsed the whole repository. The first failures came from malformed historical `.cjs` patch/check generators in `scripts/` and `tools/`, not from active application or API sources. Production Vite build remained green.

Existing scoped configuration `tsconfig.g14.json` already demonstrates the repository rule: active product files are typechecked while `_project`, backups, `scripts` and `tools` are excluded from that TypeScript program.

## Repair

- keep all compiler options, including `allowJs` and `noEmit`;
- explicitly include `src/**/*`, `api/**/*` and `vite.config.ts`;
- exclude dependency/build output, project evidence, backups, bisect, scripts and tools;
- add a guard using the TypeScript config parser to inspect the actual program file list;
- require representative active files `src/App.tsx`, `api/me.ts` and `vite.config.ts`;
- fail if any historical patcher root leaks into the main program;
- run the real scoped `tsc --noEmit`, focused tests and production build in Ubuntu CI.

## Quality boundary

This stage does not suppress TypeScript errors in active product or API code. Imported active dependencies remain part of the TypeScript program. Historical scripts keep their own executable guards/tests and are not deleted or rewritten in bulk.

## Scope

MUTATED_FILES:
- tsconfig.json
- scripts/check-g15-r23-tsc-active-product-scope.cjs
- tests/lf-prod-sot-g15-r23-tsc-active-product-scope.test.cjs
- .github/workflows/g15-r23-tsc-active-product-scope.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
API_RUNTIME_CHANGED: NO
ACTIVE_SOURCE_EXCLUDED: NO
HISTORICAL_SCRIPTS_DELETED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

## Verification pending

FOCUSED_G15_R23_TESTS:
PENDING_CI

TSC_SCOPE_GUARD:
PENDING_CI

ACTIVE_PRODUCT_TSC:
PENDING_CI

PRODUCTION_BUILD:
PENDING_CI

NEXT_FIRST_NONZERO_COMMAND:
PENDING_DIAGNOSTIC

VERCEL_EXACT_SHA:
PENDING_CHECK

RESULT:
IMPLEMENTED_AWAITING_CI
