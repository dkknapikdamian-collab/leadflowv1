# LF-PROD-SOT-G15-R1_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT

TIMESTAMP:
2026-07-14 16:18 Europe/Warsaw

STATUS:
PASS_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT

CANONICAL_NAME:
CloseFlow / LeadFlow / CaseFlow

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
1212a3b64f5a306621c510b800936e9a12580800

OBSIDIAN_INPUT_BASELINE:
ef7182bbc20a71e75cfd0bd7d22c93ed01d827e5

STAGE_TYPE:
MAP_ONLY / REAL_CODE_AUDIT / PURE_DECISION_CONTRACT

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

OWNER_EVIDENCE_SOURCE:
VERIFIED_SUPABASE_USER_ID_ONLY

OWNER_MATCH_RULE:
NORMALIZED_CREATED_BY_USER_ID_EQUALS_VERIFIED_REQUEST_USER_ID

EMAIL_OWNER_MATCH_ALLOWED:
NO

REQUEST_BODY_OWNER_EVIDENCE_ALLOWED:
NO

REQUEST_HEADER_OWNER_EVIDENCE_ALLOWED:
NO

EXACT_WORKSPACE_OWNER_MATCH:
LOCAL_TOMBSTONE_ALLOWED_AND_FUTURE_OUTBOUND_ELIGIBLE

EXACT_WORKSPACE_OWNER_MISSING:
LOCAL_TOMBSTONE_ONLY_NO_REMOTE_DELETE

EXACT_WORKSPACE_OWNER_MISMATCH:
LOCAL_TOMBSTONE_ONLY_NO_REMOTE_DELETE

LEGACY_WORKSPACE_NULL_OWNER_MATCH:
LOCAL_TOMBSTONE_ONLY

LEGACY_WORKSPACE_NULL_OWNER_MISSING:
FAIL_CLOSED_403_UNCHANGED

LEGACY_WORKSPACE_NULL_OWNER_MISMATCH:
FAIL_CLOSED_403_UNCHANGED

LEGACY_WORKSPACE_CLAIM_ALLOWED:
NO

LEGACY_PENDING_DELETE_ALLOWED:
NO

LEGACY_REMOTE_DELETE_ALLOWED:
NO

IMPORTED_GOOGLE_EVENT_REMOTE_DELETE:
FORBIDDEN

TASK_DELETE_RUNTIME:
NOT_AUTHORIZED

EVENT_DELETE_RUNTIME:
NOT_AUTHORIZED

SECURITY_BLOCKER_RESOLUTION:
OWNER_EVIDENCE_DECISION_FIXED_FOR_FUTURE_RUNTIME

REMAINING_RUNTIME_BLOCKER:
DELETE_ROUTE_OWNER_EVIDENCE_NOT_YET_WIRED

NEXT_AUTHORIZED_STAGE:
LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION

G15_R2_ARTIFACT_CREATED:
NO

G16_ARTIFACT_CREATED:
NO

## Decision matrix

| ID | Case | LOCAL_WRITE | PENDING_DELETE | REMOTE_DELETE | HTTP | DURABLE_STATE | NOTES |
|---|---|---|---|---|---|---|---|
| 01 | exact workspace + exact owner + local-origin + remote ID | YES | FUTURE_YES | FUTURE_OUTBOUND_ONLY | 200 | local tombstone then pending_delete | runtime not in this stage |
| 02 | exact workspace + exact owner + no remote ID | YES | NO | NO | 200 | deleted_local_only | no Google work |
| 03 | exact workspace + owner missing | YES | NO | NO | 200 | deleted_local_only_owner_missing | workspace proves local tenancy only |
| 04 | exact workspace + owner mismatch | YES | NO | NO | 200 | deleted_local_only_owner_mismatch | owner mismatch blocks personal Google mutation |
| 05 | exact workspace + imported external_google_event | YES | NO | FORBIDDEN | 200 | imported_local_tombstone | never delete imported Google source |
| 06 | non-null workspace mismatch | NO | NO | NO | 409 | unchanged | fail closed |
| 07 | workspace_id null + exact owner match | YES_LOCAL_ONLY | NO | NO | 200 | legacy_local_tombstone_only | preserve null workspace and remote identity |
| 08 | workspace_id null + owner missing | NO | NO | NO | 403 | unchanged | no trustworthy authority |
| 09 | workspace_id null + owner mismatch | NO | NO | NO | 403 | unchanged | same external response as owner missing |
| 10 | authenticated identity missing | NO | NO | NO | 401 | unchanged | fail before row mutation |
| 11 | row missing after safe lookup | NO_EXTRA_WRITE | NO | NO | 200 | already_missing | idempotent without leaking another workspace |
| 12 | already locally deleted, exact authorized scope | NO_EXTRA_WRITE | FUTURE_IF_ELIGIBLE | FUTURE_OUTBOUND_ONLY | 200 | unchanged or pending_delete | runtime stage decides retry details |

## Source facts

- Task DELETE and Event DELETE currently perform exact-workspace read followed by id-only service-role fallback.
- Legacy `workspace_id = null` currently reaches unscoped `updateById`.
- DELETE select paths currently omit `created_by_user_id`.
- Verified Supabase identity is available before DELETE but is not consumed by either DELETE branch.
- G8/G9/outbound remain exact-workspace only.
- Therefore this stage authorizes no route wiring and no Google DELETE.

KONIEC ETAPU
