# LF-PROD-SOT-G15-R23A — Active TypeScript scope and type-debt map

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
PR_OPEN_VERIFICATION_PENDING

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
8480a77d76a4777c2b9ea9d069c632bfd14f5099

REPLACED_STAGE:
LF-PROD-SOT-G15-R23_TSC_ACTIVE_PRODUCT_SCOPE_REPAIR

REPLACED_PR:
#37 CLOSED_WITHOUT_MERGE_SCOPE_MISMATCH

## Goal

Create an executable, narrow map of TypeScript debt in active `src`, `api` and `vite.config.ts` sources without importing any runtime repair from the rejected broad R23 branch.

## Scope

- diagnostic `tsconfig.r23a-active.json` only;
- deterministic TypeScript program-root validation;
- machine-readable JSON, Markdown and raw-log evidence;
- focused contract tests;
- CI artifact upload;
- production build as a non-runtime regression check.

## Explicit exclusions

- no `src` changes;
- no `api` changes;
- no package or lockfile changes;
- no SQL or migrations;
- no Event DELETE or Task DELETE changes;
- no Google Calendar changes;
- no Vercel deployment claim;
- no import of runtime patches from PR #37.

## Dependency handling

React 19 type packages are installed diagnostically with exact versions and `--no-save --package-lock=false`. This stage maps debt only. A persistent dependency decision belongs to a later implementation stage and is not smuggled into R23A.

## Acceptance

- focused R23A tests: pending;
- diagnostic scope leak check: pending;
- active type-debt map artifact: pending;
- changed-file allowlist: pending;
- `git diff --check`: pending;
- production build: pending;
- exact map counts and next stage: pending.

RESULT:
VERIFICATION_PENDING
