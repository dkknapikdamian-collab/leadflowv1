# STAGE232G_R1J_GOOGLE_CALENDAR_INBOUND_SYNC_IDEMPOTENT_UPSERT

Status:
LOCAL_TECH_PARTIAL / PUSH_BLOCKED_BY_EXISTING_VERIFY_FAILURE

INBOUND_SYNC_SOURCE_OF_TRUTH:
- endpoint: `/api/system?kind=google-calendar&route=sync-inbound`
- mapper: `basePayload()` in `src/server/google-calendar-inbound.ts`
- save helper: `applyGoogleEvent()` using `safePatchWorkItem()` / `safeInsertWorkItem()`
- dedupe key: `workspace_id + source_provider + source_external_id`
- unique index: `idx_work_items_google_calendar_source_external`
- reason duplicate happened: the R2 runtime had duplicate-key fallback, but `findExistingWorkItem()` could choose a broader Google identity row before the canonical `workspace_id/source_provider/source_external_id` row. If both rows existed, a later PATCH could collide with the unique index instead of updating the canonical record.

What changed:
- create path: unchanged; missing Google event rows still use `safeInsertWorkItem(payload)`.
- update path: `findExistingWorkItem()` now checks `findExistingGoogleCalendarWorkItemByCanonicalKey()` first and updates that row when present.
- duplicate-key fallback: unchanged; insert race `23505` still re-selects the canonical row and patches it.
- skip path: missing Google external id remains a controlled skip, not blind insert.
- deleted/cancelled handling: existing cancelled Google events are deleted or marked cancelled; missing cancelled events are skipped.

Tests:
- R1J guard: PASS
  - `node scripts/check-stage232g-r1j-google-calendar-inbound-idempotent-upsert.cjs`
- R1J node test: PASS
  - `node --test tests/stage232g-r1j-google-calendar-inbound-idempotent-upsert.test.cjs`
- R2 guard/test: PASS
  - `node scripts/check-stage232g-r2-google-inbound-sync-idempotency.cjs`
  - `node --test tests/stage232g-r2-google-inbound-sync-idempotency.test.cjs`
- R1I guard/test: PASS
  - `node scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs`
  - `node --test tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs`
- CF_RUNTIME_00: PASS after adding the R1J guard/test/report to the existing Google Calendar allowlist.
  - `node scripts/check-cf-runtime-00-source-truth.cjs`
- build: PASS
  - `npm run build`
- verify quiet: FAIL outside R1J scope
  - `npm run verify:closeflow:quiet`
  - failing test: `tests/faza4-etap43-critical-crud-smoke.test.cjs`
  - reason: the test expects `vercel.json` rewrite `/api/tasks -> /api/work-items?kind=tasks`, while current repo routes `/api/tasks -> /api/system?apiRoute=tasks`.
- diff-check: PASS before this report status update
  - `git diff --check`

Manual smoke:
- MANUAL_GOOGLE_SYNC_NOT_EXECUTED
- MANUAL_UI_NOT_EXECUTED

Manual check path:
1. Add one test event in connected Google Calendar.
2. Run `POST /api/system?kind=google-calendar&route=sync-inbound` with the same authenticated workspace/user context used by the app.
3. Confirm Calendar/Today show one item.
4. Run the same inbound sync again.
5. Confirm no 500 and no duplicate.
6. Change the Google event title or time.
7. Run inbound sync again.
8. Confirm the existing CloseFlow record updates instead of creating another record.

FOUND_BUT_NOT_FIXED:
- Existing R2 guard passed before this stage, but the R2 node test exposed the missing canonical-first lookup. R1J fixes that exact runtime gap.
- No real Google OAuth/session was available in local Codex, so manual Google sync was not executed.
- `npm run verify:closeflow:quiet` fails on existing Faza 4 Etap 4.3 rewrite expectation unrelated to R1J Google Calendar inbound sync. Per project rules, no commit/push while this guard is red.
