# LF-PROD-SOT-005C-R17_TASKS_STABLE_LIST_TASK_STATUS_LABEL_TONE_FACADE_RUNTIME_ADOPTION_DO_POTWIERDZENIA

## Verdict

LF-PROD-SOT-005C-R17: IMPLEMENTED_IN_APP_REPO / LOCAL_VERIFY_REQUIRED_BY_COMMAND_OUTPUT.

## Scope

runtime changed: YES
app source changed: YES
TasksStable touched: YES
WorkItemCard touched: NO
TodayStable touched: NO
grouping changed: NO
callbacks touched: NO
mutations touched: NO
forms touched: NO
CSS/UI touched: NO
SQL/Supabase/API touched: NO
runtime/data touched: NO
data/flows.json touched: NO

## Runtime adoption

Changed only:

- src/pages/TasksStable.tsx import from src/lib/source-of-truth/task-display-status.ts
- getStatusBadge(task)
- getTaskStatusTone(task)

Not changed:

- getTaskGroupId
- buildTaskGroups
- isTaskDone
- isTaskToday
- isTaskOverdue
- cf-status-pill markup
- WorkItemCard props
- task counters
- task sorting/grouping
- callbacks
- mutations
- dialogs/forms
- CSS/UI classes

## Semantic decision

INTENDED_DISPLAY_LABEL_CHANGE: YES

R17 intentionally adopts the R15/R16 contract:
- fallback Aktywne can become Bez terminu or Nadchodzace.
- done -> Zrobione / green
- overdue -> Zalegle / red
- today -> Dzis / blue
- no_due -> Bez terminu / neutral
- upcoming -> Nadchodzace / neutral

## Guard and test

Guard:
scripts/guards/verify-lf-prod-sot-005c-r17-tasks-stable-task-display-status-runtime-adoption.cjs

Test:
tests/lf-prod-sot-005c-r17-tasks-stable-task-display-status-runtime-adoption.test.cjs

Package alias:
verify:lf-prod-sot-005c-r17

## NEXT_STAGE_SELECTED

LF-PROD-SOT-005C-R18_TASKS_STABLE_LIST_TASK_STATUS_LABEL_TONE_FACADE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_NEXT_SAFE_CANDIDATE_MAP_DO_POTWIERDZENIA

R18 created: NO
