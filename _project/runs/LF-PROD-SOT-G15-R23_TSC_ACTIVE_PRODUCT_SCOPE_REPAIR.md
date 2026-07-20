# LF-PROD-SOT-G15-R23 — TypeScript active product scope and active debt repair

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
FINAL_HEAD_VERIFICATION_RUNNING

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
8480a77d76a4777c2b9ea9d069c632bfd14f5099

APP_VERIFICATION_HEAD:
a196ab5a2ee699d6ce79f630053ab5202b1501bd

PR:
#37

## Classification

FAILURE_CLASSIFICATION:
MAIN_TSC_PROGRAM_ACCIDENTALLY_INCLUDED_HISTORICAL_PATCHERS_THEN_EXPOSED_REAL_ACTIVE_TYPE_DEBT

The root `tsconfig.json` had `allowJs: true` and no `include`, so `tsc --noEmit` parsed the whole repository. R23 scopes the main TypeScript program to active `src/**/*`, `api/**/*` and `vite.config.ts`, while excluding historical patchers, project evidence and backup roots.

The corrected scope exposed real active-code type debt. It was repaired rather than hidden through additional exclusions.

## Implemented repairs

- TypeScript program scope guard using the TypeScript API;
- API missing-column fallback and identity nullability;
- Firebase session type collision;
- PWA asset-event narrowing;
- work-item no-flicker compatibility contract;
- runtime access input typing;
- page-header contract completion;
- Event/Task dialog callback result typing;
- complete finance summary and compatibility types;
- finance numeric accumulator and currency contracts;
- task reset client relation;
- native DOM event handlers in Today and context actions;
- CaseDetail loading-state cleanup, task preview identifier and case-item payload contract;
- Cases risk adapter and record status source;
- Leads next-action tooltip source;
- ClientDetail full missing-item modal contract, persistence and supported button props;
- LeadDetail risk fields, button attribute adapter, optimistic rollback snapshots and async `void` handlers.

## Validation already completed per repair batch

- exact replacement counters: PASS;
- `git diff --check`: PASS;
- TypeScript scope guard: PASS;
- diagnostic active-source `tsc`: executed after each batch;
- production build: PASS after each batch;
- one-shot repair workflows: self-removed after successful commit.

## Quality boundary

- active `src`, `api` and `vite.config.ts` remain checked;
- no active directory is excluded to obtain a false PASS;
- no bulk deletion or rewrite of historical scripts;
- no SQL or migrations;
- Event DELETE and Task DELETE contract unchanged;
- remote Google Calendar behavior unchanged;
- manual smoke remains `NOT_EXECUTED_DEFERRED_BY_OWNER`.

## Dependency policy

The final verification installs exact official React type packages diagnostically:

- `@types/react@19.2.17`;
- `@types/react-dom@19.2.3`.

`package.json` and `package-lock.json` remain unchanged because the established project rule forbids staging `package-lock.json` without an explicit exception. R23 cannot be declared fully closed until final source verification is green and the persistent dependency path is decided without silently violating that rule.

## Final verification

FOCUSED_G15_R23_TESTS:
RUNNING_FINAL_HEAD

TSC_SCOPE_GUARD:
RUNNING_FINAL_HEAD

ACTIVE_PRODUCT_TSC_WITH_PINNED_REACT_TYPES:
RUNNING_FINAL_HEAD

PRODUCTION_BUILD:
RUNNING_FINAL_HEAD

VERCEL_EXACT_SHA:
BLOCKED_BUILD_RATE_LIMIT_NOT_PASS

RESULT:
FINAL_HEAD_VERIFICATION_RUNNING
