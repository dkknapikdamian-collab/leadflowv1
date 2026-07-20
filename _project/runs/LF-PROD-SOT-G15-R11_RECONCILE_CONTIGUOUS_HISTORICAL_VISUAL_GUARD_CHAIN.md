# LF-PROD-SOT-G15-R11 — Reconcile contiguous historical visual guard chain

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
EXECUTION_PENDING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
28416f6626e89b1811cd164c066931b4afd52a31

## Root cause

The lint chain contains a contiguous block of historical visual guards that require globally importing obsolete full-page CSS layers or inspect the inactive `Today.tsx` surface. Current production source truth lives in later page-level Stage12/13/14/23/25 styles, shared Stage211 canvas sources, Stage201 shell scaling and the active `TodayStable` route.

Re-enabling the historical imports would create visual regressions and conflict with current source-of-truth layers.

## Reconciled guards

- Stage16 Today HTML reset;
- Visual HTML theme V14;
- Stage08 CaseDetail;
- Stage07 Cases;
- Stage06 ClientDetail;
- Stage04 LeadDetail;
- Stage03 Leads;
- Stage02 Today;
- Stage01 shell.

Stage05 Clients remains unchanged because it already validates current page-level source imports.

## Repair

- add one shared reconciler for current visual source truth;
- keep each historical lint entry and package command intact through a small wrapper;
- reject restoration of inactive global CSS imports;
- validate active routes, current page-level styles and core functional contracts;
- preserve old styles as reference evidence without loading them into production;
- add a focused test and dedicated Ubuntu build gate.

## Scope

PRODUCT_PAGES_CHANGED: NO
PRODUCT_CSS_CHANGED: NO
INDEX_CSS_CHANGED: NO
APP_ROUTING_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

## Acceptance pending

- all nine reconciled wrappers pass;
- unchanged Stage05 guard passes;
- focused chain tests pass;
- production build passes;
- G15-R6 diagnostic passes the full visual guard block and identifies the next independent non-visual failure or proves the remaining lint chain green;
- both Vercel deployments succeed.
