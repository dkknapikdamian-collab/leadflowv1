# LF-PROD-SOT-G15-R23 — TypeScript active product scope and active debt repair

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IN_PROGRESS_ACTIVE_TSC_DEBT_REPAIR

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
8480a77d76a4777c2b9ea9d069c632bfd14f5099

PR:
#37

## Classification

FAILURE_CLASSIFICATION:
MAIN_TSC_PROGRAM_ACCIDENTALLY_INCLUDED_HISTORICAL_PATCHERS_THEN_EXPOSED_REAL_ACTIVE_TYPE_DEBT

The root `tsconfig.json` had `allowJs: true` and no `include`, so `tsc --noEmit` parsed the whole repository. Historical malformed `.cjs` patchers were removed from the main TypeScript program by explicitly scoping it to `src/**/*`, `api/**/*` and `vite.config.ts`.

After installing the official React 19 type foundation diagnostically, the scoped program exposed a finite set of real active-code type errors. R23 does not hide them through further exclusions. It repairs them in narrow batches while preserving production behavior.

## Scope repair

- preserve compiler options, including `allowJs` and `noEmit`;
- include active application, API and Vite config sources;
- exclude dependencies, build output, project evidence, backups, bisect, scripts and tools;
- inspect the actual TypeScript program through the TypeScript API;
- require representative active files and reject historical-root leakage.

## Active repair batch one

Validated and committed on the PR branch:

- API schema-fallback nullability guards;
- profile identity optional-field normalization;
- overdue task date narrowing;
- missing page-header kicker contract;
- DOM `MouseEvent` type separation in context actions;
- current Event/Task creation callback result typing;
- commission-status import compatibility;
- finance compatibility aliases and relation/payment fields;
- client finance currency contract;
- icon registry cast through `unknown`;
- runtime access input JSDoc typing;
- payment query `includeArchived` option;
- no-flicker mutation compatibility fields;
- existing Firebase, PWA and no-flicker import/type repairs.

Batch validation:

- exact replacement counters: PASS;
- `git diff --check`: PASS;
- TypeScript scope guard: PASS;
- production build: PASS;
- one-shot patch workflow: self-removed after commit.

## Quality boundary

- active `src`, `api` and `vite.config.ts` remain checked;
- no active directory is excluded to obtain a false PASS;
- historical scripts are not deleted or rewritten in bulk;
- no SQL, migrations, Event DELETE, Task DELETE or remote Google behavior changes;
- manual smoke remains `NOT_EXECUTED_DEFERRED_BY_OWNER`.

## Dependency policy

Official React types are currently installed only diagnostically in CI:

- `@types/react@19.2.17`;
- `@types/react-dom@19.2.3`.

`package.json` and `package-lock.json` remain unchanged. The repository rule requires reviewing lockfile status before any dependency commit.

## Verification pending

FOCUSED_G15_R23_TESTS:
PENDING_FINAL_HEAD_CI

TSC_SCOPE_GUARD:
PENDING_FINAL_HEAD_CI

ACTIVE_PRODUCT_TSC:
IN_PROGRESS_REPAIR

PRODUCTION_BUILD:
PENDING_FINAL_HEAD_CI

VERCEL_EXACT_SHA:
BLOCKED_BUILD_RATE_LIMIT_NOT_PASS

RESULT:
IN_PROGRESS_ACTIVE_TSC_DEBT_REPAIR
