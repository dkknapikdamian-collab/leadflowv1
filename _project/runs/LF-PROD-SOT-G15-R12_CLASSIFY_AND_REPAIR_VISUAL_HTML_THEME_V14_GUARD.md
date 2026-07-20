# LF-PROD-SOT-G15-R12 — Classify and repair Visual HTML Theme V14 guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
3ae9027a939117e72fda136b7b6df3eecc6cb76c

APP_EXECUTION_HEAD:
607a85c2d9e5f796431e796b7b32461fbf982b7c

PR:
PENDING

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_GLOBAL_THEME_GUARD

The historical V14 guard required global import of `visual-html-theme-v14.css`. The reference stylesheet applies a fixed 286px shell, sidebar, form, button and Cases-page overrides with broad `!important` rules. Current Layout and Cases use later compact-shell, operator-trim, Stage211 canvas, record-list and page-header source-of-truth styles. Restoring V14 would reintroduce obsolete global visual behavior.

## Repair

- explicitly reject the inactive V14 global theme import;
- assert current Layout shell and Stage212M visual foundation sources;
- assert current Cases page-header, record-list and Stage211 canvas sources;
- retain `cf-html-shell` compatibility and V14 trace markers;
- retain the V14 stylesheet as historical reference evidence;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

FOCUSED_G15_R12_TESTS:
PENDING_CI

RECONCILED_V14_GUARD:
PENDING_CI

PRODUCTION_BUILD:
PENDING_CI

NEXT_LINT_DIAGNOSTIC:
PENDING_CI

VERCEL_2_CLOSEFLOW:
PENDING_MERGE

VERCEL_CLOSEDOCKAPP:
PENDING_MERGE

## Scope

MUTATED_FILES:
- scripts/check-visual-html-theme-v14.cjs
- tests/lf-prod-sot-g15-r12-visual-html-theme-v14-guard.test.cjs
- .github/workflows/g15-r12-visual-html-theme-v14-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
CASES_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

RESULT: PENDING_CI
