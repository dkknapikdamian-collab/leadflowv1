# LF-PROD-SOT-005C-R15_TASKS_STABLE_LIST_TASK_STATUS_LABEL_TONE_FACADE_CONTRACT_GUARD_DO_POTWIERDZENIA

Date: 2026-07-07 07:xx Europe/Warsaw

## Status

TASKS_STABLE_TASK_DISPLAY_STATUS_FACADE_CONTRACT_GUARD_CREATED

CHARACTER: CONTRACT_GUARD / MINIMAL_CONTRACT_FILE / NO_RUNTIME_REWIRE / NO_TASKSSTABLE_CALLSITE_CHANGE.

## Prerequisites

- R14 report exists and selects `src/lib/source-of-truth/task-display-status.ts` as the future task display status facade.
- Active route proof from R14: `/tasks` uses `src/pages/TasksStable.tsx`, not inactive `src/pages/Tasks.tsx`.
- R14 selected R15: `LF-PROD-SOT-005C-R15_TASKS_STABLE_LIST_TASK_STATUS_LABEL_TONE_FACADE_CONTRACT_GUARD_DO_POTWIERDZENIA`.

## Change

Created task display status facade contract:

`src/lib/source-of-truth/task-display-status.ts`

Created contract guard and node test:

- `scripts/guards/verify-lf-prod-sot-005c-r15-tasks-stable-task-display-status-contract.cjs`
- `tests/lf-prod-sot-005c-r15-tasks-stable-task-display-status-contract.test.cjs`

Package alias required by the R15 guard:

`verify:lf-prod-sot-005c-r15`

## Contract

- done -> Zrobione / green
- overdue -> Zalegle / red
- today -> Dzis / blue
- no_due -> Bez terminu / neutral
- upcoming -> Nadchodzace / neutral

## Explicit No Runtime Rewire

- NO_RUNTIME_REWIRE
- NO_TASKSSTABLE_CALLSITE_CHANGE
- NO_CALLBACK_CHANGE
- NO_MUTATION_CHANGE
- NO_FORM_CHANGE
- NO_CSS_UI_CHANGE
- NO_SQL_SUPABASE_API_CHANGE
- NO_RUNTIME_DATA_CHANGE
- NO_DATA_FLOWS_CHANGE
- TASKSSTABLE_TOUCHED: NO

## Guard Contract

The R15 guard checks:

- contract facade exists with expected labels, tones, kinds and exported helpers,
- package alias `verify:lf-prod-sot-005c-r15` exists,
- `src/pages/TasksStable.tsx` is not rewired to the new facade,
- `src/pages/TodayStable.tsx` and `src/components/work-item-card.tsx` do not import the new facade,
- this app report contains required closeout markers.

## Verification

Connector-created app artifacts. Local Windows guard/build proof is still required after pull if connector cannot run local repo commands:

- `npm run verify:lf-prod-sot-005c-r15`
- `npm run build`
- `git diff --check`

## NEXT_STAGE_SELECTED

NEXT_STAGE_SELECTED: LF-PROD-SOT-005C-R16_TASKS_STABLE_LIST_TASK_STATUS_LABEL_TONE_FACADE_RUNTIME_ADOPTION_MAP_DO_POTWIERDZENIA

R16_CREATED: NO
R16_RUNTIME_CREATED: NO

KONIEC ETAPU R15
