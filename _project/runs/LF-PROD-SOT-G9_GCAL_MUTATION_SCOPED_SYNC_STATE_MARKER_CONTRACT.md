# LF-PROD-SOT-G9 — Google Calendar Mutation Scoped Sync-State Marker Contract

DATA_I_CZAS:
2026-07-11 18:25 Europe/Warsaw

STAGE:
LF-PROD-SOT-G9_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT

STATUS:
PASS_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_CONTRACT

CANONICAL_NAME:
CloseFlow / LeadFlow

PROJECT_ID:
closeflow_lead_app

APP_REPO:
dkknapikdamian-collab/leadflowv1

APP_BRANCH:
dev-rollout-freeze

APP_LOCAL_PATH:
C:\Users\malim\Desktop\biznesy_ai\2.closeflow

APP_INPUT_HEAD_G9:
ae2cd28d10ed74760487e98f891f23d0098b6a64

PREVIOUS_G9_APP_COMMIT:
8177bbc3db82855b1f3b1940372bb0cbe387b6a7

G9_CONTRACT_REPAIR:
PASS

G9_CONTRACT_REPAIR_REASON:
The first G9 implementation treated shouldWrite=true with nextSyncStatus=null as a no-write result, used a non-canonical result shape and did not use the exact required error contract. The repair aligns real code and tests with the supplied G9 stage brief.

OBSIDIAN_REPO:
dkknapikdamian-collab/obsidian-vault

OBSIDIAN_BRANCH:
main

OBSIDIAN_LOCAL_PATH:
C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT

OBSIDIAN_INPUT_HEAD_G9:
349192d84009ab7062780ef96c710b1040f10d22

G8_PREREQUISITE:
PASS_GCAL_MUTATION_EXACT_WORKSPACE_SNAPSHOT_READER_CONTRACT

G8_PRECHECK:
PASS_FROM_ORIGINAL_G9_EXECUTION

G8_PRECHECK_TESTS:
26 PASS / 0 FAIL

G8_PRECHECK_BUILD:
PASS_FROM_ORIGINAL_G9_EXECUTION

MARKER_FILE:
src/server/google-calendar-mutation-sync-state-marker.ts

SNAPSHOT_READER:
readGoogleCalendarMutationSnapshot

DECISION_FACADE:
decideGoogleCalendarMutationSyncState

MARKER_USES_G8_READER: YES

MARKER_USES_G7_FACADE: YES

SCOPED_WRITE_HELPER:
updateByIdScoped

MARKER_WRITE_IS_WORKSPACE_SCOPED: YES

READER_CALL_COUNT:
1

DECISION_CALL_COUNT:
1 for found snapshots / 0 for not-found

WRITE_ALLOWED_STATUSES: pending / pending_delete

WRITE_PAYLOAD_FIELDS: google_calendar_sync_status

INVALID_DECISION_IS_HARD_ERROR: YES

INVALID_DECISION_ERROR:
GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_DECISION

WRITE_RESPONSE_HARD_CONFIRMED: YES

WRITE_CONFIRMATION_FIELDS:
workItemId / workspaceId / googleCalendarSyncStatus

READ_ERROR_PROPAGATION:
UNCHANGED_OBJECT

WRITE_ERROR_PROPAGATION:
UNCHANGED_OBJECT

NOT_FOUND_DISTINGUISHED:
YES

RESULT_SHAPE:
found / wrote / decision / confirmation

WRITER_IDENTIFIERS_SOURCE:
snapshot.id / snapshot.workspaceId

TASK_ROUTE_WIRED: NO

EVENT_ROUTE_WIRED: NO

OUTBOUND_WIRED:
NO

INBOUND_CHANGED:
NO

SQL_CHANGED:
NO

UI_CSS_CHANGED:
NO

GOOGLE_REMOTE_CALL_CHANGED:
NO

RUNTIME_BEHAVIOR_CHANGED: NO

G9_TESTS:
50 PASS / 0 FAIL

G9_TEST_SOURCE:
REAL_COMPILED_MARKER_AND_REAL_G7_FACADE_SOURCE

G9_SCOPED_TSC:
PASS

BUILD:
PREVIOUS_G9_BUILD_PASS; REPAIR_REMOTE_BUILD_TO_VERIFY_AFTER_COMMIT

GIT_DIFF_CHECK:
PATCH_CONTENT_CHECKED / REMOTE_WORKTREE_NOT_AVAILABLE

APP_COMMIT:
SELF_RESOLVED_AFTER_COMMIT

OBSIDIAN_COMMIT:
SELF_RESOLVED_AFTER_COMMIT

RISK_AUDIT:
- Full repository build cannot be executed inside the GitHub connector sandbox; remote deployment status must be checked after push.
- G9 remains intentionally disconnected from task and event routes.
- Existing route-level legacy reads and unscoped compatibility paths remain outside G9.
- Local Windows worktree cleanliness and local Obsidian pull cannot be inspected by the connector.

G10_CREATED: NO

NEXT_STEP:
INDEPENDENT_G9_VERIFICATION_BEFORE_ANY_G10_DECISION

KONIEC ETAPU G9
