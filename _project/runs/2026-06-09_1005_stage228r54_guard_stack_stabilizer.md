# Stage228R54 — guard stack stabilizer for no-flicker work item UX

Date: 2026-06-09 10:05 Europe/Warsaw

## Scope

R54 repairs the obsolete R51 meta-guard after the R53 runtime patch and R50 behavior guard passed locally.

## Facts

- Stage228R50/R52/R53 local changes may already be present in the working tree.
- The last failure was not runtime code. It was a stale guard expecting an old exact string in R50 guard.
- The R54 guard stack checks behavior:
  - LeadDetail consumes savedRecord and updates linkedTasks/linkedEvents.
  - TasksStable performs optimistic delete with rollback and without forced refreshData after success.
  - supabase-fallback emits no-flicker mutation with input.id, not the whole input object.
  - SQL memory keeps deleted in work_items_status_domain_check.

## Guards/tests

Run by package:
- check-stage228r47-sql-deleted-status-constraint.cjs
- check-stage228r50-no-flicker-real-anchors.cjs
- check-stage228r51-r50-guard-repair.cjs
- check-stage228r52-tasksstable-no-flicker-repair.cjs
- check-stage228r53-leaddetail-savedrecord-guard-repair.cjs
- check-stage228r54-guard-stack-stabilizer.cjs
- matching node --test tests
- npm run build
- git diff --check
- git diff --cached --check

## Manual test after deploy

CF_DEL_TEST_4:
1. Open lead detail.
2. Add missing/task/event through the normal UI.
3. Confirm the row appears without full-page flicker.
4. Delete it.
5. Confirm it disappears without full-page flicker.
6. Refresh page.
7. Confirm it does not return.

## Risk audit

- Optimistic UI can hide a failed API mutation unless rollback is preserved.
- Silent refresh must not replace local state with stale cache.
- Calendar remains the baseline and is not refactored by this stage.
- AGENTS.md and unrelated global project rule file are intentionally not staged.
