# LF-PROD-SOT-004O - Calendar status/date read-only runtime import

Date: 2026-07-03 20:10 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED / GUARD_PASS / TEST_PASS / BUILD_PASS / DIFF_CHECK_PASS / READONLY_METADATA_IMPORT_ONLY / NO_OUTPUT_DRIFT / SMOKE_DEFERRED_DEBT_FROM_004M / MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS / FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / NO_SUPABASE_API_CHANGE / NO_GCAL_CHANGE

## Linki SOT / mapa wejsciowa

- Previous read-only import: LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.
- Owner decision: LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.
- Smoke debt: SMOKE_DEFERRED_DEBT_FROM_004M.
- Manual smoke status: MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS.

## Import host decision

- selected import host: src/lib/calendar-items.ts
- import type: METADATA_ONLY_VOID_IMPORT
- output usage: NOT_USED_IN_LOGIC
- logic changed: NO
- visible output changed: NO

## Calendar/GCal boundary

- Google Calendar sync touched: NO
- Google Calendar mapper touched: NO
- remote provider touched: NO
- GoogleCalendarSyncChange: FORBIDDEN
- GoogleCalendarMapperChange: FORBIDDEN
- remoteProviderChange: FORBIDDEN
- CalendarCountChange: FORBIDDEN
- CalendarStatusLabelChange: FORBIDDEN
- CalendarDatePrecedenceChange: FORBIDDEN
- CalendarDateOnlyDefaultChange: FORBIDDEN
- localWarsawBusinessDayBoundaryChange: FORBIDDEN

## Not touched

- UI: NO_UI_CHANGE
- CSS: NO_CSS_CHANGE
- SQL: NO_SQL_CHANGE
- Supabase API: NO_SUPABASE_API_CHANGE
- GCal sync/mapper/provider: NO_GCAL_CHANGE
- CaseDetail: NOT_TOUCHED
- Finance: NOT_TOUCHED
- 004P created: NO

## Smoke debt

- SMOKE_DEFERRED_DEBT_FROM_004M: ACTIVE
- SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE
- MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS
- FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE
- This stage does not claim manual smoke PASS.

## Verification planned / required before close

- npm run verify:lf-prod-sot-004m-today-runtime-import-smoke-and-decision
- npm run verify:lf-prod-sot-004n-tasks-status-date-readonly-runtime-import
- npm run verify:lf-prod-sot-004o-calendar-status-date-readonly-runtime-import
- node --test tests/lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.test.cjs
- npm run guard:routes:canonical
- npm run guard:ui:patch-layers
- npm run check:polish-mojibake
- npm run build
- git diff --check

## Risk audit

- Smoke is still deferred, not PASS.
- This stage is allowed only because it is metadata-only and no-output-drift.
- Full manual smoke remains required before final acceptance.
- Calendar runtime behavior must remain unchanged.
- GCal sync/mapper/provider remains forbidden in this stage.

## Wynik

KONIEC ETAPU LF-PROD-SOT-004O.
LOCAL_RERUN_PASS.
READONLY_METADATA_IMPORT_ONLY.
NO_OUTPUT_DRIFT.
NO_GCAL_CHANGE.
SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE.
FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE.
READY_FOR_NEXT_READONLY_NO_DRIFT_STAGE_OR_FINAL_SMOKE_GATE.
## R4 guard/test overwrite repair - 2026-07-03 20:51 Europe/Warsaw

- Root cause after R3: R3 used a fragile text patch point and stopped when local guard content did not match exactly.
- Repair: 004O guard and 004O node test were overwritten with the intended final contract instead of patched by fragment matching.
- CaseDetail contract markers remain allowed only as no-touch metadata markers such as CaseDetailChange/NOT_TOUCHED.
- Forbidden runtime/page/provider references are checked in import lines.
- DOM/runtime snippets remain checked in the full adapter.
- Runtime changes in R4: NO.
- UI/CSS/SQL/Supabase/API/GCal/CaseDetail/Finance changes in R4: NO.
