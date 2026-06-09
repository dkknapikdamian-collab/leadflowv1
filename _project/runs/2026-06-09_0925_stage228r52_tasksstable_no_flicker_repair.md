# Stage228R52 - TasksStable no-flicker repair

Date: 2026-06-09 09:25 Europe/Warsaw
Branch: dev-rollout-freeze

## Scope
- Repairs the R50/R51 guard drift after R50 runtime patching.
- Enforces optimistic local delete in TasksStable.
- Keeps rollback when backend delete fails.
- Keeps the Supabase deleted-status SQL in repo memory.

## Manual test
- Create CF_DEL_TEST_4 on a lead.
- Delete it from LeadDetail and verify no full section flicker.
- Delete a task from TasksStable and verify the row disappears immediately without a full reload.
- Refresh page and confirm deleted rows do not return.

## Risk audit
- If a background mutation event refreshes later, it must be silent and not show full loading.
- Rollback must restore the task if backend delete fails.
- Calendar baseline is intentionally not changed in this stage.
