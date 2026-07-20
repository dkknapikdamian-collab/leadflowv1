# LF-PROD-SOT-G15-R9 — Classify and repair A13 Templates light UI guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
EXECUTION_PENDING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
34d47d2dc7de3b57080fb9acc8c224c4a77d7424

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_GUARD_MARKER

The A13 guard required `data-a16-template-light-ui="true"`, a selector owned by the reference-only Stage36 stylesheet. The same guard explicitly forbids importing that stylesheet globally because it breaks the live UI. Current `Templates.tsx` instead exposes `data-cf-templates-page-source="record-list-source-truth"` and uses the required light utility classes.

## Repair

- replace the inactive Stage36 marker assertion with the current record-list source marker;
- explicitly reject restoration of the inactive Stage36 marker in `Templates.tsx`;
- retain all light utility, ResponseTemplates, mojibake, security and architecture checks;
- add a focused executable test and Ubuntu gate with production build.

## Scope

MUTATED_FILES:
- scripts/check-a13-critical-regressions.cjs — 3 additions / 2 deletions
- tests/lf-prod-sot-g15-r9-a13-templates-light-guard.test.cjs
- .github/workflows/g15-r9-a13-templates-light-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
TEMPLATES_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

## Acceptance pending

- focused G15-R9 tests pass;
- A13 critical regression guard passes;
- production build passes;
- diagnostic lint chain passes A13 and identifies the next independent failure or all-green result;
- both Vercel deployments succeed.
