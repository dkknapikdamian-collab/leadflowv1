# LF-PROD-SOT-G5-R1 — Google Calendar Outbound Contract Decision

DATA_I_CZAS: 2026-07-10 21:33 Europe/Warsaw
STAGE: LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION
CHARACTER: CONTRACT_DECISION_ONLY / MAP_AND_GUARD_ONLY
CANONICAL_NAME: CloseFlow / LeadFlow
PROJECT_ID: closeflow_lead_app
ENTITY_ID: DO_POTWIERDZENIA
REPORT_ID: DO_POTWIERDZENIA

APP_REPO: dkknapikdamian-collab/leadflowv1
APP_BRANCH: dev-rollout-freeze
APP_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
OBSIDIAN_REPO: dkknapikdamian-collab/obsidian-vault
OBSIDIAN_BRANCH: main
OBSIDIAN_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT

## Gate order

G5_R1_GATE_ORDER: G5_PRECHECK_BEFORE_G5_R1_ARTIFACTS_ONLY
POST_G5_R1_OLD_G5_GUARD: NOT_RERUN_BY_DESIGN
G5_PREREQUISITE: PASS_GCAL_CALENDAR_BOUNDARY_GAP_MAP

## Final status

G5_R1_FINAL_STATUS: PASS_GCAL_CONTRACT_DECISION
GCAL_CONTRACT_DECISION: COMPLETE

RUNTIME_CHANGED: NO
SRC_CHANGED: NO
UI_CSS_CHANGED: NO
SQL_API_SUPABASE_CHANGED: NO
GCAL_REMOTE_CALL_CHANGED: NO
PACKAGE_LOCK_CHANGED: NO
DATA_FLOWS_CHANGED: NO

## Real code state confirmed before the decision

AUTOMATIC_OUTBOUND_AFTER_TASK_MUTATION: NO
AUTOMATIC_OUTBOUND_AFTER_EVENT_MUTATION: NO
TASK_EVENT_MUTATIONS_MARK_GCAL_PENDING: NO
EVENT_ROUTE_PERSISTS_REMINDER_METHOD: NO
EVENT_ROUTE_PERSISTS_REMINDER_MINUTES: NO
OUTBOUND_SUPPORTS_PENDING_MODE: YES
OUTBOUND_SUPPORTS_FAILED_MODE: YES
OUTBOUND_SUPPORTS_ALL_MODE: YES
ACTIVE_HANDLER_USES_EXACT_WORKSPACE_USER_CONNECTION: YES
ACTIVE_HANDLER_WORKSPACE_FALLBACK_FOR_SYNC: NO
LEGACY_WORKSPACE_DIAGNOSTIC_PRESENT: YES
OUTBOUND_PERSONAL_SCOPE_FAIL_CLOSED: YES
INBOUND_TITLE_AS_IDENTITY: NO
LOCAL_DELETE_TOMBSTONE_WINS: YES
DONE_COMPLETED_CURRENT_REMOTE_POLICY: REMOTE_DELETE
TIMEZONE_OWNER: src/lib/calendar-timezone-contract.ts

## Outbound architecture decision

OUTBOUND_TRIGGER_ARCHITECTURE: DURABLE_WORK_ITEM_SYNC_STATE
LOCAL_WRITE_POLICY: LOCAL_FIRST_NON_BLOCKING
REMOTE_GOOGLE_CALL_INSIDE_TASK_EVENT_MUTATION: FORBIDDEN
MUTATION_SYNC_STATE_OWNER: TASK_AND_EVENT_SERVER_ROUTES
REMOTE_PROCESSOR_OWNER: src/server/google-calendar-outbound.ts
PRIMARY_OUTBOUND_MODE: pending
MANUAL_OUTBOUND_MODE_ALL: RETAIN_AS_OPERATOR_FALLBACK

The task and event routes own only the durable local state transition. They must commit the local mutation first. The Google create, update or delete operation belongs to the separate outbound processor and cannot decide whether the ordinary CloseFlow write succeeds.

## Durable sync states

GCAL_SYNC_STATE_PENDING: local create or update awaits outbound processing
GCAL_SYNC_STATE_PENDING_DELETE: local status, hide or tombstone awaits remote delete
GCAL_SYNC_STATE_SYNCED: last outbound create or update succeeded
GCAL_SYNC_STATE_FAILED: outbound failed and is eligible for retry
GCAL_SYNC_STATE_NOT_CONNECTED: exact user connection is unavailable
GCAL_SYNC_STATE_DELETED: remote event was deleted or already absent

ALLOWED_EXISTING_CONTRACT_FIELDS:
- google_calendar_sync_status
- google_calendar_sync_error
- google_calendar_synced_at
- google_calendar_event_id
- google_calendar_event_etag
- google_calendar_html_link
- google_calendar_id
- google_calendar_sync_enabled

NEW_DATABASE_COLUMNS_CONFIRMED: NO
SQL_CREATED: NO

## Mutation-to-pending contract

LOCAL_ORIGIN_CREATE_UPDATE_PENDING_RULE:
- record_type is task or event
- show_in_calendar is not false
- exact created_by_user_id exists
- row is not imported from Google Calendar
- target google_calendar_sync_status is pending

LOCAL_ORIGIN_PENDING_DELETE_RULE:
- existing google_calendar_event_id exists
- status is done, completed, cancelled, canceled, archived, deleted or removed, or show_in_calendar is false
- target google_calendar_sync_status is pending_delete

MUTATION_TO_PENDING_IMPLEMENTED_IN_G5_R1: NO

## Source separation

OUTBOUND_SOURCE_POLICY: LOCAL_CLOSEFLOW_ROWS_ONLY
GOOGLE_INBOUND_ROWS_REOUTBOUND: FORBIDDEN
IMPORTED_GOOGLE_EVENT_SIGNALS: source_provider=google_calendar OR type=external_google_event
IMPORTED_GOOGLE_EVENT_REMOTE_DELETE: FORBIDDEN_WITHOUT_EXPLICIT_FUTURE_OWNER_ACTION
LOCAL_TOMBSTONE_BLOCKS_INBOUND_RESURRECTION: REQUIRED
SOURCE_EXTERNAL_ID_REMAINS_CANONICAL_IDENTITY: REQUIRED

A local hide or tombstone of an imported Google event cannot silently delete the user's original Google event. That action requires a separate future owner action and contract.

## Exact-user scope

CONNECTION_SCOPE: EXACT_WORKSPACE_ID_PLUS_USER_ID
ROW_OWNER_SCOPE: EXACT_CREATED_BY_USER_ID_MATCH
WORKSPACE_TOKEN_FALLBACK_FOR_ACTIVE_SYNC: FORBIDDEN
OUTBOUND_SCOPE_FAILURE: FAIL_CLOSED_SKIP_ROW

A missing row owner or missing exact user connection must skip the row. No member's event can be sent using another member's workspace token.

## Idempotency

TITLE_AS_IDENTITY: FORBIDDEN
OUTBOUND_LOCAL_IDENTITY: workspace_id + work_item.id + created_by_user_id
OUTBOUND_REMOTE_IDENTITY: google_calendar_event_id
INBOUND_REMOTE_IDENTITY: workspace_id + source_provider + source_external_id
CREATE_RULE: create only when google_calendar_event_id is absent
UPDATE_RULE: update only by stored google_calendar_event_id
DUPLICATE_TITLE_POLICY: ALLOWED
REMOTE_CREATE_RESULT: persist google_calendar_event_id and etag before synced

## Retry and diagnostics

LOCAL_WRITE_ROLLBACK_ON_GOOGLE_FAILURE: FORBIDDEN
OUTBOUND_FAILURE_STATE: failed
OUTBOUND_FAILURE_DIAGNOSTIC: google_calendar_sync_error
RETRY_INPUT_STATES: pending + failed + pending_delete
REMOTE_404_410_ON_DELETE: SUCCESS_ALREADY_GONE
FALSE_SUCCESS: FORBIDDEN

An operator success response is allowed only after the corresponding remote create, update or delete succeeded, or after a delete returned the accepted already-gone condition.

## Reminder persistence contract

REMINDER_INPUT_OWNER: src/lib/google-calendar-reminder-preferences.ts
REMINDER_INPUT_FIELDS: googleCalendarReminderMethod + googleCalendarReminderMinutesBefore
REMINDER_ALLOWED_METHODS: default + popup + email + popup_email
REMINDER_MINUTES_RANGE: 0-40320
REMINDER_PERSISTENCE_OWNER: TASK_AND_EVENT_SERVER_ROUTES
REMINDER_OUTBOUND_OWNER: src/server/google-calendar-outbound.ts
CANONICAL_STORED_FIELDS: google_reminders_use_default + google_reminders_overrides

REMINDER_MAPPING_DEFAULT: use_default=true; overrides=[]
REMINDER_MAPPING_POPUP: use_default=false; overrides=[popup]
REMINDER_MAPPING_EMAIL: use_default=false; overrides=[email]
REMINDER_MAPPING_POPUP_EMAIL: use_default=false; overrides=[popup,email]
REMINDER_PERSISTENCE_IMPLEMENTED_IN_G5_R1: NO

## Done and delete policy

LOCAL_ORIGIN_DONE_COMPLETED_POLICY: REMOTE_DELETE
LOCAL_ORIGIN_CANCELLED_ARCHIVED_DELETED_POLICY: REMOTE_DELETE
LOCAL_ORIGIN_SHOW_IN_CALENDAR_FALSE_POLICY: REMOTE_DELETE
DONE_COMPLETED_REMOTE_POLICY: REMOTE_DELETE
LOCAL_COMMIT_BEFORE_REMOTE_DELETE: REQUIRED
REMOTE_DELETE_BEFORE_LOCAL_COMMIT: FORBIDDEN

DELETE_ORDER:
1. local status, hide or soft-delete commit
2. durable pending_delete state
3. separate outbound processor
4. remote delete
5. durable deleted state and remote identity cleanup

## Timezone and all-day invariants

TIMEZONE_OWNER: src/lib/calendar-timezone-contract.ts
DEFAULT_TIMEZONE: Europe/Warsaw
RAW_DATE_PARSER_AS_NEW_OWNER: FORBIDDEN
TIMEZONE_ROUNDTRIP_SHIFT: FORBIDDEN
GOOGLE_ALL_DAY_FIELDS_PRESERVED: REQUIRED
START_END_ORDER_CHANGED: FORBIDDEN
INBOUND_TIMEZONE_BEHAVIOR_CHANGED: NO

## G6 handoff

G6_FIRST_CONTRACT_TARGET: TASK_EVENT_MUTATION_TO_GCAL_PENDING_STATE_CONTRACT_GUARD
NEXT_STAGE_SELECTED: LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD
G6_CREATED: NO

G6 must protect local-first writes, the lack of synchronous Google calls in mutation routes, exact user ownership, local-origin-only outbound, pending versus pending_delete, unchanged inbound and timezone behavior, no SQL and no remote call from the guard.

## Execution evidence policy

The static report records the selected contract. The execution script must still run the G5-R1 guard, node tests, production build and git diff checks before commit. It must stop rather than converting a red gate into PASS.

KONIEC ETAPU
