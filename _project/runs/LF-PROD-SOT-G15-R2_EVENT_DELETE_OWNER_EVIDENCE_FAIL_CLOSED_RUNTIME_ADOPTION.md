# LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION

TIMESTAMP:
2026-07-19 Europe/Warsaw

STATUS:
PASS_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION

CANONICAL_NAME:
CloseFlow / LeadFlow / CaseFlow

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
6acc65b22f6fd467019da5973682aa03cc9cbe65

RUNTIME_CORE_COMMIT:
8de42509c797fbe5fbb6dbd083e06388d7f607ea

VERIFICATION_GATE_COMMIT:
COMMIT_CONTAINING_THIS_REPORT

BRANCH:
dev-rollout-freeze

RUNTIME_CHANGED:
YES_EVENT_DELETE_ONLY

OWNER_EVIDENCE_SOURCE:
VERIFIED_SUPABASE_USER_ID_ONLY

OWNER_MATCH_RULE:
NORMALIZED_CREATED_BY_USER_ID_EQUALS_VERIFIED_REQUEST_USER_ID

EXACT_WORKSPACE_OWNER_MATCH:
LOCAL_TOMBSTONE_ONLY

EXACT_WORKSPACE_OWNER_MISSING:
LOCAL_TOMBSTONE_ONLY_NO_REMOTE_DELETE

EXACT_WORKSPACE_OWNER_MISMATCH:
LOCAL_TOMBSTONE_ONLY_NO_REMOTE_DELETE

NON_NULL_WORKSPACE_MISMATCH:
FAIL_CLOSED_409_UNCHANGED

LEGACY_WORKSPACE_NULL_OWNER_MATCH:
LOCAL_TOMBSTONE_ONLY_OWNER_FILTERED_WRITE

LEGACY_WORKSPACE_NULL_OWNER_MISSING:
FAIL_CLOSED_403_UNCHANGED

LEGACY_WORKSPACE_NULL_OWNER_MISMATCH:
FAIL_CLOSED_403_UNCHANGED

LEGACY_WRITE_FILTER:
id + workspace_id=is.null + created_by_user_id=verified request user ID

TASK_DELETE_NOT_TOUCHED: YES
SQL_NOT_TOUCHED: YES
MIGRATIONS_NOT_TOUCHED: YES
WORKSPACE_CLAIM_NOT_ADDED: YES
LEGACY_PENDING_DELETE_NOT_ADDED: YES
REMOTE_GOOGLE_NOT_CALLED: YES
IMPORTED_GOOGLE_EVENT_REMOTE_DELETE: FORBIDDEN

## HTTP / write matrix

| Case | HTTP | Local write | Remote Google | Result |
|---|---:|---|---|---|
| missing verified user ID | 401 | none | none | unchanged |
| row missing after safe lookup | 200 | none | none | alreadyMissing |
| exact workspace, owner match | 200 | scoped tombstone | none | hidden/deleted |
| exact workspace, owner missing | 200 | scoped tombstone | none | hidden/deleted local only |
| exact workspace, owner mismatch | 200 | scoped tombstone | none | hidden/deleted local only |
| non-null workspace mismatch | 409 | none | none | unchanged |
| legacy-null, owner match | 200 | owner-filtered local tombstone | none | hidden/deleted local only |
| legacy-null, owner missing | 403 | none | none | unchanged |
| legacy-null, owner mismatch | 403 | none | none | unchanged |
| imported Google row in exact workspace | 200 | scoped tombstone | forbidden | local only |

## Files

- `src/server/event-route-stage124f.ts`
- `scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs`
- `tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs`
- this report

STAGE_CLOSE_STATUS:
PASS_TECHNICAL_VERIFICATION_COMPLETE

## Verification

- G15-R2 guard and runtime test: PASS.
- G15-R2 runtime matrix: 18 PASS / 0 FAIL.
- G15-R1 regression: PASS.
- G15 regression: PASS.
- G14 regression and scoped typecheck: PASS.
- build: PASS.
- git diff --check: PASS.

NEXT_STAGE_AUTOMATICALLY_AUTHORIZED:
NO

NEXT_CHECKPOINT:
OWNER_DECISION_AFTER_G15_R2_PROOF

KONIEC ETAPU
