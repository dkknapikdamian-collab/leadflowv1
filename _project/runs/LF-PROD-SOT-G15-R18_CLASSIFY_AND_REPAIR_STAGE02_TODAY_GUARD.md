# LF-PROD-SOT-G15-R18 — Classify and repair Stage02 Today guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STAGE02_TODAY_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
9735166175ddfe685d16f870b95d97134e484d79

APP_VERIFIED_HEAD:
3291bc6b8c0d97483571178feea93581d79c17e3

PR:
#32

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_TODAY_VISUAL_AND_PAGE_TARGET_GUARD

The historical Stage02 guard required global import of `visual-stage02-today.css` and inspected legacy `Today.tsx`. Active `/` and `/today` routes use `TodayStable`, which imports later page-header and Stage211C/211E/211J canvas source contracts. The Stage02 reference stylesheet broadly overrides utility colors, backgrounds, radii and cards with `!important`; restoring it would overwrite the current Today operating surface.

## Repair

- explicitly reject the inactive Stage02 global CSS import;
- assert that the active route loads `TodayStable`;
- assert current page-header and Stage211 canvas sources;
- assert current owner-control and action source markers;
- retain Stage02 stylesheet as historical reference evidence;
- move data, AI, mutation, delete and action-policy checks to active `TodayStable`;
- retain mojibake checks across current source files;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

G15_R18_WORKFLOW_RUN_ID:
29774583479

G15_R18_WORKFLOW_JOB_ID:
88460780009

FOCUSED_G15_R18_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE02_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29774585031

G15_R6_ARTIFACT_ID:
8474123952

G15_R6_ARTIFACT_DIGEST:
sha256:c68fa31668496f065521741c7fd628816d628f50ada8be921898c71a19ccd565

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
14

REPAIRED_COMMAND:
node scripts/check-visual-stage02-today.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-stage01-shell.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/components/Layout.tsx: missing Szkice AI navigation

NEXT_FAILURE_CLASSIFICATION:
PENDING_NARROW_R19_CLASSIFICATION

VERCEL_2_CLOSEFLOW:
PENDING_MERGE_RATE_LIMIT_SLOT

VERCEL_CLOSEDOCKAPP:
PENDING_MERGE_RATE_LIMIT_SLOT

## Scope

MUTATED_FILES:
- scripts/check-visual-stage02-today.cjs
- tests/lf-prod-sot-g15-r18-stage02-today-guard.test.cjs
- .github/workflows/g15-r18-stage02-today-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
APP_TSX_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
TODAY_TSX_CHANGED: NO
TODAY_STABLE_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

NEXT_STAGE:
LF-PROD-SOT-G15-R19_CLASSIFY_AND_REPAIR_STAGE01_SHELL_GUARD

RESULT: PASS
