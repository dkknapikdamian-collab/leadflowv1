# LF-PROD-SOT-005C-R17-R1_R15_HISTORICAL_GUARD_COMPAT_REPAIR_DO_POTWIERDZENIA

## Verdict

R17-R1: IMPLEMENTED_IN_APP_REPO / VERIFY_REQUIRED.

## Why

R17 intentionally adopted task-display-status runtime import in TasksStable.
The old R15 guard was historical and still forbade that import.
After R17, R15 must verify the contract still exists and coexists with R17 runtime adoption.

## Changed

- scripts/guards/verify-lf-prod-sot-005c-r15-tasks-stable-task-display-status-contract.cjs
- tests/lf-prod-sot-005c-r15-tasks-stable-task-display-status-contract.test.cjs

## Not changed

- src/pages/TasksStable.tsx
- src/lib/source-of-truth/task-display-status.ts
- package.json
- WorkItemCard
- TodayStable
- callbacks
- mutations
- forms
- CSS/UI
- SQL/Supabase/API
- runtime/data
- data/flows.json

## Expected verification

- npm run verify:lf-prod-sot-005c-r15: PASS
- npm run verify:lf-prod-sot-005c-r17: PASS
- npm run build: PASS
- git diff --check: PASS or LF/CRLF warning only

## NEXT_STAGE_SELECTED

LF-PROD-SOT-005C-R18_TASKS_STABLE_LIST_TASK_STATUS_LABEL_TONE_FACADE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_NEXT_SAFE_CANDIDATE_MAP_DO_POTWIERDZENIA

R18 created: NO
