# LF-PROD-SOT-G15-R10 — Classify and repair Stage18 Leads CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
EXECUTION_PENDING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
01f0fceb1b41ccfd4c95610fe14114d7734d144c

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_VISUAL_GUARD

The guard required the global import of `visual-stage18-leads-hard-1to1.css`. Current `Leads.tsx` carries later Stage25, Stage211 and Stage231 source-of-truth markers and imports current record-list/canvas styles. Re-enabling the Stage18 full-page override would reintroduce obsolete selectors and visual behavior.

## Repair

- explicitly reject the inactive Stage18 global import;
- assert current record-list, Stage211C and Stage211E style imports;
- assert the current Stage25 Leads rebuild marker;
- retain the Stage18 reference file, historical marker, mapping document, shell compatibility and package script checks;
- add a focused executable test and Ubuntu build gate.

## Scope

MUTATED_FILES:
- scripts/check-visual-stage18-leads-hard-1to1.cjs
- tests/lf-prod-sot-g15-r10-stage18-leads-guard.test.cjs
- .github/workflows/g15-r10-stage18-leads-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LEADS_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

## Acceptance pending

- focused G15-R10 tests pass;
- reconciled Stage18 guard passes;
- production build passes;
- diagnostic lint chain passes Stage18 and identifies the next independent failure or all-green result;
- both Vercel deployments succeed.
