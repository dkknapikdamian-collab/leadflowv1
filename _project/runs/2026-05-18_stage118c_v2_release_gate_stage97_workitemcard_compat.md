# Stage118C V2 - release gate Stage97 WorkItemCard compatibility

## Status
LOCAL ZIP/PUSH PACKAGE PREPARED.

## Scan-first confirmation
- Repo: CloseFlow / leadflowv1.
- Branch expected: dev-rollout-freeze.
- Read before patch: tests/stage97-today-overdue-task-done-button.test.cjs, src/pages/TodayStable.tsx, src/components/work-item-card.tsx, package.json.

## FAKTY
- Stage118B fixed Stage77 locally but quiet gate stopped at Stage97.
- Stage97 still expected Today task rows to use legacy RowLink taskId/doneKind props.
- Stage116 moved Today task/event rows to WorkItemCard as source-of-truth.
- Current Today task rows use WorkItemCard with kind task, href /tasks, onDone, onEdit and onDelete.

## DECYZJA
Do not revert Stage116. Update Stage97 guard to validate WorkItemCard task done behavior and route/action identity.

## TESTY
- node --test tests/stage118b-release-gate-stage77-compat.test.cjs
- node --test tests/stage118c-release-gate-stage97-workitemcard-compat.test.cjs
- node --test tests/stage77-lead-detail-single-status-pill.test.cjs
- node --test tests/stage97-today-overdue-task-done-button.test.cjs
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet

## NEXT
If quiet gate exposes another stale guard, stop and prepare a narrow compatibility patch. No git add dot.
