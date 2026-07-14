# LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP

TIMESTAMP:
2026-07-14 06:06 Europe/Warsaw

STATUS:
PASS_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP

CANONICAL_NAME:
CloseFlow / LeadFlow / CaseFlow

PROJECT_ID:
closeflow_lead_app

ENTITY_RESOLUTION_ACTION:
USE_EXISTING_CANONICAL

ENTITY_RESOLUTION_CANDIDATE_TABLE_REQUIRED:
NO

ENTITY_RESOLUTION_REASON:
Exact canonical registry, alias map, repo, branch and project folder match.

APP_INPUT_HEAD:
ca7a1f0924f7e0d7995cc2cf52a6927c13f758e1

LAST_RUNTIME_APP_HEAD:
01d1d67fc9e8fde1d8c638c104af3d3f30ccfbe9

OBSIDIAN_BASE_ANCESTOR:
266cc8418f5b687c74f750d9af2221c055599e0d

OBSIDIAN_ROUTER_RULES_READ:
YES

OBSIDIAN_CANONICAL_STAGE_PATH:
10_PROJEKTY/CloseFlow_Lead_App/STAGES/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP.md

OBSIDIAN_EXECUTION_REPORT_PATH:
10_PROJEKTY/CloseFlow_Lead_App/90_RAPORTY/LF-PROD-SOT-G15_GCAL_DELETE_LEGACY_WORKSPACE_TOMBSTONE_AND_RETRY_CONTRACT_MAP_REPORT.md

STAGE_TYPE:
MAP_ONLY / REAL_CODE_AUDIT / CONTRACT_DECISION

RUNTIME_CHANGED:
NO

SRC_CHANGED:
NO

SQL_CHANGED:
NO

MIGRATIONS_CHANGED:
NO

REMOTE_GOOGLE_CALL_CHANGED:
NO

PACKAGE_LOCK_CHANGED:
NO

LEGACY_WORKSPACE_NULL_POLICY:
LEGACY_LOCAL_TOMBSTONE_ONLY

LEGACY_OWNER_EVIDENCE_REQUIRED:
YES

LEGACY_WORKSPACE_CLAIM_ALLOWED:
NO

LEGACY_REMOTE_DELETE_ALLOWED:
NO

IMPORTED_GOOGLE_EVENT_REMOTE_DELETE:
FORBIDDEN

SECURITY_BLOCKER:
WORKSPACE_NULL_ROW_CANNOT_BE_SAFELY_CLAIMED_OR_REMOTELY_DELETED_WITH_CURRENT_EVIDENCE

NEXT_AUTHORIZED_STAGE:
LF-PROD-SOT-G15-R1_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT

FIRST_RUNTIME_DELETE_CONSUMER:
NOT_AUTHORIZED

G15_R1_ARTIFACT_CREATED:
NO

G16_ARTIFACT_CREATED:
NO

## Decision matrix

| ID | Case | LOCAL_WRITE_ALLOWED | PENDING_DELETE_ALLOWED | REMOTE_DELETE_ALLOWED | WORKSPACE_CLAIM_ALLOWED | EXPECTED_HTTP_RESULT | EXPECTED_DURABLE_STATE | RETRY_ALLOWED | INBOUND_RESURRECTION_ALLOWED | SECURITY_RISK |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 | exact workspace + exact owner + remote ID | YES | YES | YES_OUTBOUND | NO | 200 | pending_delete -> deleted/failed | YES | NO | LOW |
| 02 | exact workspace + exact owner + no remote ID | YES | NO | NO | NO | 200 | deleted_local_only | NO | NO | LOW |
| 03 | exact workspace + missing owner + remote ID | YES_LOCAL_ONLY | NO | NO | NO | 200 | deleted_local_only_owner_missing | NO | NO | MEDIUM |
| 04 | exact workspace + imported external_google_event | YES_LOCAL_TOMBSTONE | NO | FORBIDDEN | NO | 200 | imported_local_tombstone | NO | NO | MEDIUM |
| 05 | workspace mismatch | NO | NO | NO | NO | 409 | unchanged | NO | YES | CRITICAL |
| 06 | workspace_id null + owner matches | BLOCKED_UNTIL_G15_R1 | NO | NO | NO | BLOCKED_UNTIL_G15_R1 | legacy_local_tombstone_only | NO | NO | HIGH |
| 07 | workspace_id null + owner missing | NO | NO | NO | NO | 403_OR_409 | unchanged | NO | YES | CRITICAL |
| 08 | workspace_id null + owner mismatch | NO | NO | NO | NO | 409 | unchanged | NO | YES | CRITICAL |
| 09 | already deleted + remote ID | YES_IDEMPOTENT | YES_IF_EXACT_SCOPE | YES_OUTBOUND | NO | 200 | pending_delete/deleted | YES | NO | LOW |
| 10 | already pending_delete | NO_EXTRA_WRITE | ALREADY_SET | YES_OUTBOUND | NO | 200 | pending_delete | YES | NO | LOW |
| 11 | failed after remote delete | NO_LOCAL_REOPEN | RETRY_STATE | YES_RETRY | NO | 200_LOCAL_ALREADY_COMMITTED | failed -> deleted/failed | YES | NO | MEDIUM |
| 12 | Google DELETE 204 | N/A | N/A | COMPLETED | NO | N/A | deleted + clear remote identity | NO | NO | LOW |
| 13 | Google DELETE 404 | N/A | N/A | SUCCESS_ALREADY_GONE | NO | N/A | deleted + clear remote identity | NO | NO | LOW |
| 14 | Google DELETE 410 | N/A | N/A | SUCCESS_ALREADY_GONE | NO | N/A | deleted + clear remote identity | NO | NO | LOW |
| 15 | Google DELETE other error | N/A | N/A | FAILED | NO | N/A | failed + diagnostic | YES | NO | MEDIUM |
| 16 | inbound sees local tombstone | NO_RESURRECTION | N/A | N/A | NO | skipped_local_deleted | tombstone retained | N/A | NO | LOW |
| 17 | inbound misses legacy workspace-null tombstone | NO_SAFE_ACTION | NO | NO | NO | BLOCKED | resurrection_risk_unresolved | NO | YES_UNTIL_G15_R1 | CRITICAL |

KONIEC ETAPU
