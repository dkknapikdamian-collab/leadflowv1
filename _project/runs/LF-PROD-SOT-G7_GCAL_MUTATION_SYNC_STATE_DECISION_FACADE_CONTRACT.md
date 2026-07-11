# LF-PROD-SOT-G7 — Google Calendar Mutation Sync-State Decision Facade Contract

DATA_I_CZAS: 2026-07-11 13:01 Europe/Warsaw
STAGE: LF-PROD-SOT-G7_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT
CANONICAL_NAME: CloseFlow / LeadFlow
PROJECT_ID: closeflow_lead_app
ENTITY_ID: DO_POTWIERDZENIA
REPORT_ID: DO_POTWIERDZENIA

APP_REPO: dkknapikdamian-collab/leadflowv1
APP_BRANCH: dev-rollout-freeze
APP_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
APP_INPUT_HEAD_G7: 22ff153ef372670f987318aa373e9ffd49089086

OBSIDIAN_REPO: dkknapikdamian-collab/obsidian-vault
OBSIDIAN_BRANCH: main
OBSIDIAN_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT
OBSIDIAN_INPUT_HEAD_G7: c0fa5f9755b3c0e08ba7620fba984c315704382c
OBSIDIAN_SCOPE_POLICY_G7: CLOSEFLOW_PROJECT_PATH_ONLY
OBSIDIAN_SCOPE_PATH_G7: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY

G6_PREREQUISITE: PASS_FIRST_SAFE_CONTRACT_GUARD_WITH_PROVENANCE_CLARIFICATION
G7_FINAL_STATUS: PASS_PURE_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT
G7_R1_TSC_SCOPE_REPAIR: PASS
GLOBAL_TSC_BASELINE_STATUS: RED_NON_RUNTIME_ARTIFACTS
GLOBAL_TSC_BASELINE_ERRORS_OBSERVED: 6523
GLOBAL_TSC_BASELINE_ERROR_FILES_OBSERVED: 55
G7_TYPESCRIPT_PROJECT: tsconfig.g7.json
G7_TYPESCRIPT_SCOPE: FACADE_ONLY
G7_TYPESCRIPT_SCOPE_REASON: G7 adds a pure unwired facade; repo-wide tsc is polluted by archived backups, bisect copies and local tools outside runtime scope.

## Real-code verification

REAL_CODE_READ_SET:
- src/server/task-route-stage124f.ts
- src/server/event-route-stage124f.ts
- src/server/google-calendar-outbound.ts
- src/server/google-calendar-inbound.ts
- src/server/google-calendar-handler.ts
- src/server/google-calendar-user-scope.ts
- src/lib/calendar-timezone-contract.ts
- _project/runs/LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD.md
- scripts/guards/verify-lf-prod-sot-g6-gcal-first-safe-contract-guard.cjs
- tests/lf-prod-sot-g6-gcal-first-safe-contract-guard.test.cjs
- package.json
- tsconfig.g7.json
- tsconfig.json

TASK_ROUTE_CURRENTLY_WRITES_GCAL_SYNC_STATUS: NO
EVENT_ROUTE_CURRENTLY_WRITES_GCAL_SYNC_STATUS: NO
TASK_EVENT_ROUTES_CURRENTLY_CALL_GOOGLE: NO
CURRENT_OUTBOUND_IMPORT_PREDICATE_COLLISION: YES
SAFE_IMPORTED_ORIGIN_MARKER: type === external_google_event
SOURCE_PROVIDER_ALLOWED_AS_G7_ORIGIN_INPUT: NO
CURRENT_PATCH_DELETE_SNAPSHOT_READY_FOR_RUNTIME_ADOPTION: NO

REAL_CODE_FINDINGS:
- Task PATCH reads only a partial calendar/status snapshot and does not read owner, imported-origin marker, Google event id or current Google sync status.
- Event PATCH has no pre-mutation work-item snapshot.
- Task and event DELETE snapshots omit calendar time, owner, Google event id and current Google sync status.
- Task and event mutation routes neither call Google Calendar nor write google_calendar_sync_status.
- Existing outbound and inbound helper predicates conflate type === external_google_event with source_provider === google_calendar.
- G7 therefore uses only type === external_google_event as the imported-origin decision marker.

## Facade contract

FACADE_FILE: src/lib/google-calendar-mutation-sync-state-decision.ts
FACADE_FUNCTION: decideGoogleCalendarMutationSyncState
FACADE_IS_PURE: YES
FACADE_IS_DETERMINISTIC: YES
FACADE_HAS_IMPORTS: NO
FACADE_HAS_IO: NO

INPUT_FIELDS:
- mutationKind
- recordType
- type
- status
- showInCalendar
- hasCalendarTime
- createdByUserId
- googleCalendarEventId
- currentGoogleSyncStatus

FORBIDDEN_INPUT_FIELDS:
- sourceProvider
- source_provider
- sourceExternalId
- source_external_id
- workspaceId
- userId
- connection
- supabase
- request
- response

SOURCE_PROVIDER_USED_AS_ORIGIN: NO
IMPORTED_RUNTIME_PREDICATE: type === external_google_event

OUTPUT_FIELDS:
- outcome
- nextSyncStatus
- shouldWrite

OUTCOMES:
- pending
- pending_delete
- unchanged
- skip_imported
- skip_no_owner
- skip_no_calendar_time

DATABASE_SYNC_STATUSES_WRITTEN_BY_FUTURE_ADOPTION:
- pending
- pending_delete

SKIP_OUTCOMES_ARE_DATABASE_STATUSES: NO

## Decision order

| # | Condition | outcome | nextSyncStatus | shouldWrite |
|---:|---|---|---|---|
| 1 | normalized type is external_google_event | skip_imported | null | false |
| 2 | recordType is neither task nor event | unchanged | null | false |
| 3 | createdByUserId is empty after trim | skip_no_owner | null | false |
| 4 | Google id exists and mutation is delete, record is hidden, or status is closed/deleted | pending_delete | pending_delete | current status is not pending_delete |
| 5 | delete/hidden/closed record has no Google id | unchanged | null | false |
| 6 | mutation is neither create nor update after prior delete handling | unchanged | null | false |
| 7 | showInCalendar does not normalize to explicit true | unchanged | null | false |
| 8 | visible open local record has no calendar time | skip_no_calendar_time | null | false |
| 9 | supported local create/update has owner, visibility and calendar time | pending | pending | current status is not pending |
| 10 | fallback | unchanged | null | false |

CLOSED_OR_DELETE_STATUSES:
- done
- completed
- cancelled
- canceled
- archived
- deleted
- removed

## No-I/O and no-wiring boundary

TASK_ROUTE_WIRED: NO
EVENT_ROUTE_WIRED: NO
OUTBOUND_WIRED: NO
INBOUND_CHANGED: NO
SQL_API_SUPABASE_CHANGED: NO
GOOGLE_REMOTE_CALL_CHANGED: NO
UI_CSS_CHANGED: NO
RUNTIME_BEHAVIOR_CHANGED: NO

FORBIDDEN_IO_CONFIRMED_ABSENT:
- fetch
- Supabase reads/writes
- Google Calendar calls
- environment access
- console output
- clocks and timers
- browser globals

## Files changed

FILES_CHANGED_APP:
- src/lib/google-calendar-mutation-sync-state-decision.ts
- scripts/guards/verify-lf-prod-sot-g7-gcal-mutation-sync-state-decision-facade-contract.cjs
- tests/lf-prod-sot-g7-gcal-mutation-sync-state-decision-facade-contract.test.cjs
- _project/runs/LF-PROD-SOT-G7_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT.md
- package.json
- tsconfig.g7.json

FILES_CHANGED_OBSIDIAN:
- 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md
- 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G7_GCAL_MUTATION_SYNC_STATE_DECISION_FACADE_CONTRACT_MAP.md

## Verification

G6_PRECHECK: PASS
GIT_DIFF_CHECK: PASS
G7_GUARD: PASS
TSC_NO_EMIT_G7_PROJECT: PASS
GLOBAL_TSC_NO_EMIT: BLOCKED_BY_PREEXISTING_NON_RUNTIME_ARTIFACTS
BEHAVIORAL_TESTS: 24 PASS / 0 FAIL
BUILD: PASS

RISK_AUDIT:
- Runtime adoption remains blocked because PATCH and DELETE snapshots are incomplete.
- source_provider remains a remote-association field and is not used as the G7 imported-origin marker.
- The facade is not wired to routes or processors, so production behavior is unchanged.
- A later stage must map a complete workspace-scoped snapshot before any database status write.

G8_CREATED: NO
NEXT_STAGE_DECISION: DO_POTWIERDZENIA_AFTER_G7_VERIFICATION

KONIEC ETAPU G7

## G7-R2-R1 — package.json diff expectation correction

DATA_I_CZAS: 2026-07-11 14:05 Europe/Warsaw
REPAIR_STAGE: LF-PROD-SOT-G7-R2-R1_PACKAGE_JSON_DIFF_EXPECTATION_CORRECTION
INPUT_APP_HEAD: d1aa7e242015094b5d726c23f32527b1a3964de7
INPUT_OBSIDIAN_HEAD: b70f4980bae919df9abca1f7d915bac58ec4d960
CAUSE: The first G7-R2 script incorrectly expected 1 addition / 0 deletions.
CORRECT_GIT_DIFF_REASON: The former final G6 scripts line is replaced by the same line with a comma, then the G7 alias line is added.
PACKAGE_JSON_SEMANTIC_DELTA: EXACTLY_ONE_G7_ALIAS
PACKAGE_JSON_TEXT_DIFF_FROM_G7_BASE: 2 ADDITIONS / 1 DELETION
G7_VERIFY_AFTER_CORRECTION: PASS
BUILD_AFTER_CORRECTION: PASS
RUNTIME_BEHAVIOR_CHANGED_BY_R2_R1: NO
G8_CREATED: NO
R2_R1_STATUS: PASS_PACKAGE_JSON_DIFF_EXPECTATION_CORRECTION

## G7-R2-R2 - UTF-8 and TypeScript scope closeout

DATA_I_CZAS: 2026-07-11 14:39 Europe/Warsaw
REPAIR_STAGE: LF-PROD-SOT-G7-R2-R2_UTF8_AND_TYPESCRIPT_SCOPE_CLOSEOUT
G7_TSC_SCOPE_EXCEPTION_APPROVED: YES
G7_TSC_SCOPE_EXCEPTION_REASON:
PREEXISTING_GLOBAL_TSC_BASELINE_RED / FACADE_ONLY_VERIFICATION
G7_TSC_SCOPE_EXTENSION_FILE: tsconfig.g7.json
G7_TYPESCRIPT_PROJECT: tsconfig.g7.json
G7_ORIGINAL_SCOPE_EXTENDED: YES
G7_SCOPE_EXTENSION_RATIFIED_BY_CLOSEOUT: YES
MOJIBAKE_GUARD_TOKENS: BROKEN_EM_DASH / BROKEN_EN_DASH / A_TILDE / A_CIRCUMFLEX
G7_VERIFY_RERUN: PASS
BUILD_RERUN: PASS
RUNTIME_BEHAVIOR_CHANGED: NO
TASK_ROUTE_CHANGED: NO
EVENT_ROUTE_CHANGED: NO
OUTBOUND_CHANGED: NO
INBOUND_CHANGED: NO
G8_CREATED: NO
CLOSEOUT_STATUS: PASS_G7_UTF8_AND_TSC_SCOPE_CLOSEOUT
