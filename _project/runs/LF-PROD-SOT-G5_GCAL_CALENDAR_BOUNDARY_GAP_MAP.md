# LF-PROD-SOT-G5 — GCal / Calendar Boundary Gap Map

DATA_I_CZAS: 2026-07-10 18:48 Europe/Warsaw
STAGE: LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP
CHARACTER: MAP_ONLY_REAL_CODE_BOUNDARY_AUDIT
CANONICAL_NAME: CloseFlow / LeadFlow
PROJECT_ID: closeflow_lead_app
ENTITY_ID: DO_POTWIERDZENIA
REPORT_ID: DO_POTWIERDZENIA

APP_REPO: dkknapikdamian-collab/leadflowv1
APP_BRANCH: dev-rollout-freeze
APP_INPUT_HEAD: fa44c9aed16be191915b38ffd184605aa8be0deb
APP_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

OBSIDIAN_REPO: dkknapikdamian-collab/obsidian-vault
OBSIDIAN_BRANCH: main
OBSIDIAN_INPUT_HEAD: da61c4bb8f7765ae58c95756f549b2fdeb76318c
OBSIDIAN_FOLDER: 10_PROJEKTY/CloseFlow_Lead_App
OBSIDIAN_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT

## Recovery V3

RECOVERY_PACKAGE: V3_SAFE_VAULT_HEAD_ADVANCE_COMPAT
RECOVERY_REASON: V1 mismatched readonly boundary keys; V2 then stopped on an unrelated Obsidian HEAD advance. V3 binds the G5 guard to the verified current vault HEAD without touching intervening non-G5 commits.
RECOVERY_SCOPE: GUARD_TEST_AND_SAFE_VAULT_HEAD_BINDING_ONLY
RECOVERY_RUNTIME_CHANGE: NO
RECOVERY_SRC_CHANGE: NO

## Scan report

PROJECT: CloseFlow / LeadFlow
READ_MODE: TARGETED_REAL_CODE_GCAL_BOUNDARY_SCAN
CURRENT_STAGE: LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP

FILES_READ:
- AGENTS.md
- _project/00_AI_START_SPIS_TRESCI.md
- _project/runs/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE.md
- package.json
- vercel.json
- api/system.ts
- src/pages/Calendar.tsx
- src/pages/Settings.tsx
- src/lib/calendar-items.ts
- src/lib/calendar-operational-entry-contract.ts
- src/lib/calendar-timezone-contract.ts
- src/lib/google-calendar-reminder-preferences.ts
- src/lib/supabase-fallback.ts
- src/lib/source-of-truth/calendar-date-time-boundary-readonly-runtime.ts
- src/lib/source-of-truth/calendar-status-date-readonly-runtime.ts
- src/server/google-calendar-handler.ts
- src/server/google-calendar-user-scope.ts
- src/server/google-calendar-sync.ts
- src/server/google-calendar-inbound.ts
- src/server/google-calendar-outbound.ts
- src/server/task-route-stage124f.ts
- src/server/event-route-stage124f.ts

FILES_INTENTIONALLY_NOT_READ:
- unrelated UI baselines
- CaseDetail runtime outside G3 prerequisite
- finance runtime
- SQL and migrations
- historical ZIPs and archive
- unrelated _project run reports

ACTIVE_DECISIONS:
- G3 CaseDetail lane is closed.
- G4 is skipped.
- G5 is map-only and must not modify Google Calendar runtime.
- User-scoped OAuth and sync isolation must not regress.
- Calendar timezone roundtrip must not shift Europe/Warsaw wall-clock time.
- Local delete tombstones must not be resurrected by inbound sync.

OPEN_RISKS:
- no automatic outbound trigger after task/event create, update or delete
- local mutations do not mark Google sync state pending
- browser reminder preference fields are not persisted by the event route
- done/completed currently participates in remote-delete semantics
- inbound background failure is reduced to console warning plus false return
- legacy workspace fallback helpers coexist with active exact-user scope

TESTS_GUARDS_RELEVANT:
- verify:lf-prod-sot-g3-r1 — precheck only before G5 files exist
- verify:lf-prod-sot-g5 — active G5 guard and tests
- npm run build
- git diff --check for app and Obsidian

## Final decision

G5_FINAL_STATUS: PASS_GCAL_CALENDAR_BOUNDARY_GAP_MAP
GCAL_BOUNDARY_REAL_CODE_VERIFY: PASS
GCAL_RUNTIME_DECISION: STOP_NO_SAFE_RUNTIME_CANDIDATE
G5_FIRST_SAFE_RUNTIME_CANDIDATE: NONE

AUTOMATIC_OUTBOUND_AFTER_TASK_MUTATION: NO
AUTOMATIC_OUTBOUND_AFTER_EVENT_MUTATION: NO
TASK_EVENT_MUTATIONS_MARK_GCAL_PENDING: NO
SETTINGS_MANUAL_OUTBOUND_CALLSITE: YES
CALENDAR_BACKGROUND_INBOUND_TRIGGER: YES
CALENDAR_INBOUND_LOCAL_FIRST: YES
INBOUND_THROTTLE_MS: 60000
INBOUND_HELPER_ERROR_CHANNEL: CONSOLE_WARNING_AND_NULL_RETURN

CLIENT_REMINDER_PREFERENCE_FIELDS_SENT: YES
EVENT_ROUTE_PERSISTS_REMINDER_PREFERENCE_FIELDS: NO
OUTBOUND_MAPPER_READS_BROWSER_PREFERENCE_FIELDS: NO
GCAL_REMINDER_PREFERENCE_CONTRACT_COMPLETE: NO

ACTIVE_HANDLER_REQUIRES_EXACT_USER_CONNECTION: YES
LEGACY_WORKSPACE_FALLBACK_HELPERS_PRESENT: YES
INBOUND_CANONICAL_IDENTITY: workspace_id+source_provider+source_external_id
INBOUND_TITLE_AS_IDENTITY: NO
LOCAL_DELETE_TOMBSTONE_WINS: YES
OUTBOUND_PERSONAL_SCOPE_FAIL_CLOSED: YES
DONE_COMPLETED_REMOTE_POLICY: REMOTE_DELETE
TIMEZONE_OWNER: src/lib/calendar-timezone-contract.ts
READONLY_SOT_FORBIDS_GCAL_CHANGE: YES

G5_R1_CREATED: NO
NEXT_STAGE_SELECTED: LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION

## Why runtime stops here

A safe runtime patch cannot be isolated to one helper or one readonly callsite.

The automatic outbound gap crosses:
- task and event mutation routes,
- Google connection scope,
- sync eligibility and retry state,
- remote create/update/delete operations,
- error observability,
- reminder preference persistence,
- done/completed remote semantics,
- idempotency and source identity,
- timezone and all-day mapping.

Adding a direct sync call after a local mutation without a contract could:
- block ordinary writes on Google availability,
- duplicate remote events,
- sync a row to the wrong user's calendar,
- lose reminder preferences,
- delete completed entries unexpectedly,
- reintroduce time shifts,
- weaken tombstone protection.

## Findings

### G5-FINDING-001 — outbound is not triggered by local mutations

Task and event POST/PATCH/DELETE routes only write local `work_items` state and return. They do not import or call `syncGoogleCalendarOutbound`.

### G5-FINDING-002 — mutation routes do not mark sync pending

The task and event write routes do not set `google_calendar_sync_status: pending`. An updated row with an existing Google event ID and `synced` status is not selected by outbound `pending` mode.

### G5-FINDING-003 — outbound UI is manual

Settings explicitly invokes `/api/google-calendar?route=sync-outbound` with `mode: all`. Calendar itself has no outbound callsite.

### G5-FINDING-004 — reminder preference is dropped at the event API boundary

The client adds `googleCalendarReminderMethod` and `googleCalendarReminderMinutesBefore`. The event route does not persist these fields. The outbound mapper reads stored Google reminder objects and overrides instead.

### G5-FINDING-005 — inbound is local-first and background-throttled

Calendar bundle loading returns local Supabase data first. Google inbound runs later in the background with a 60-second throttle.

### G5-FINDING-006 — inbound failure has weak operator visibility

The background helper catches the error, writes a console warning and returns `null`. This does not constitute a durable sync failure state.

### G5-FINDING-007 — active sync is user-scoped, but legacy fallback helpers remain

The handler, inbound and outbound paths use the exact `workspaceId + userId` connection. Legacy workspace fallback lookup functions remain in the lower-level sync module.

### G5-FINDING-008 — inbound identity and tombstones are hardened

Inbound prefers `workspace_id + source_provider + source_external_id`, does not use title as identity, handles duplicate-key races and prevents local tombstones from being resurrected.

### G5-FINDING-009 — done/completed has remote-delete meaning

Outbound treats done/completed/cancelled/archived/deleted/hidden rows as remote delete candidates when a Google event ID exists. This business semantic must be decided before automatic triggering.

### G5-FINDING-010 — existing readonly SOT explicitly blocks Google changes

The readonly Calendar SOT contracts forbid Google sync, mapper, provider, Supabase/API and runtime-output changes. G5 therefore maps the boundary but cannot adopt runtime.

## Required next contract decision

The selected G5-R1 decision stage must define, before any runtime patch:
- trigger owner: synchronous write, durable outbox, job or explicit manual action
- retry and failure state
- user-scope invariants
- idempotency key and duplicate handling
- mutation-to-pending transition
- reminder preference persistence owner
- done/completed/cancelled remote semantics
- local delete and remote delete ordering
- timezone and all-day invariants
- operator-visible diagnostics
- rollback and manual smoke

## Scope

RUNTIME_CHANGED: NO
SRC_CHANGED: NO
UI_CSS_CHANGED: NO
SQL_API_SUPABASE_CHANGED: NO
GCAL_REMOTE_CALL_CHANGED: NO
PACKAGE_LOCK_CHANGED: NO
DATA_FLOWS_CHANGED: NO
G5_R1_CREATED: NO

## Gates

VERIFY_G3_R1_PRECHECK: PASS
REAL_CODE_PRECHECK: PASS
VERIFY_G5: PASS
BUILD: PASS
GIT_DIFF_CHECK_APP: PASS
GIT_DIFF_CHECK_OBSIDIAN: PASS

APP_COMMIT: REPORTED_BY_EXECUTOR_AFTER_COMMIT
OBSIDIAN_COMMIT: REPORTED_BY_EXECUTOR_AFTER_COMMIT
APP_FINAL_STATUS: REPORTED_BY_EXECUTOR
OBSIDIAN_FINAL_STATUS: REPORTED_BY_EXECUTOR
OBSIDIAN_LOCAL_SYNC: DONE_BY_LOCAL_COMMIT_AND_PUSH

KONIEC ETAPU
