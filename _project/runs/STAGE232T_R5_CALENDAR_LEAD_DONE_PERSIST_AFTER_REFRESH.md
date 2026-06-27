# STAGE232T_R5_CALENDAR_LEAD_DONE_PERSIST_AFTER_REFRESH

Status:
PACKAGE_PREPARED / LOCAL_APPLY_REQUIRED / VERIFY_REQUIRED / PROD_SMOKE_REQUIRED

Bug:
- Calendar lead-shadow `Zrobione` could be session-only.
- Clearing `lead.nextActionAt` removes the active lead-shadow source.
- If no durable completed work item exists, F5 cannot rebuild the crossed completed entry.

Source-of-truth map:
- Active lead-shadow source: `leads.next_action_at / next_action_title / next_action_item_id`.
- Completed after-refresh source: durable `work_items` task created/updated by Calendar R5.
- Calendar rebuild path after F5: `fetchCalendarBundleFromSupabase -> fetchTasksFromSupabase -> expandTaskEntries`.
- Activity log is still only evidence/history and is not used as Calendar source of truth.

Fix:
- `Calendar.tsx`
  - Adds `ensureCompletedLeadCalendarActionStage232T_R5`.
  - Before clearing lead next-action fields, it creates or updates a durable completed task.
  - Existing linked task is updated if `nextActionItemId` points to a task in current task state.
  - Otherwise an existing completed task is found by lead + scheduledAt + title.
  - If no existing task is found, one completed task is created.
- `src/server/task-route-stage124f.ts`
  - Keeps tasks marked with source `calendar_lead_done_persist_after_refresh` visible in Calendar even when status is done.
- Lead still gets:
  - `nextActionAt = null`
  - `nextActionTitle = ''`
  - `nextActionItemId = null`
- Lead is not deleted.

Idempotency:
- Existing task lookup uses:
  - leadId
  - scheduledAt minute key
  - title
  - done/completed status
- Linked `nextActionItemId` wins if it points to a task in the current Calendar task state.

Out of scope:
- SQL/RLS
- billing/finance/commission
- Obsidian
- Today/Clients
- localStorage/sessionStorage/DOM/CSS plaster

Required local verification:
```powershell
node scripts/check-stage232t-r5-calendar-lead-done-persist-after-refresh.cjs
node --test tests/stage232t-r5-calendar-lead-done-persist-after-refresh.test.cjs
node scripts/check-stage232t-r4-calendar-lead-shadow-actions.cjs
node --test tests/stage232t-r4-calendar-lead-shadow-actions.test.cjs
node scripts/check-cf-runtime-00-source-truth.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

Manual smoke after deploy:
1. Calendar -> lead next action.
2. Click `Zrobione`.
3. Entry is crossed/completed.
4. F5.
5. Completed entry still appears as completed/crossed.
6. Lead still exists.
7. Lead has no active `nextActionAt`.
8. Another F5 does not create a duplicate.
