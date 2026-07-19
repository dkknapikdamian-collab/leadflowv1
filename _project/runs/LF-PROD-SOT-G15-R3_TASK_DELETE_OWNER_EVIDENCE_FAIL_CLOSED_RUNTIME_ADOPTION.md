# LF-PROD-SOT-G15-R3 — Task DELETE owner-evidence fail-closed runtime adoption

TIMESTAMP:
2026-07-19 Europe/Warsaw

STATUS:
PASS_TASK_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION

CANONICAL_NAME:
CloseFlow / LeadFlow / CaseFlow

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
cec7f322d4256d914d08308a21c53c2f88ddebcb

BRANCH:
dev-rollout-freeze

## Implemented scope

- Task DELETE reads `created_by_user_id` and uses the verified Supabase request user ID as the only owner evidence.
- Legacy `workspace_id = null` owner match uses an owner-filtered `updateWhere` tombstone.
- Legacy owner missing or mismatch returns the same `403` response and leaves the row unchanged.
- Non-null workspace mismatch remains `409` with no write.
- Exact-workspace rows retain scoped local tombstone and scoped lead next-action cleanup.
- Legacy-null rows perform only the task tombstone; they do not read or mutate a lead next action.
- Event DELETE, SQL, migrations, schema, RLS and remote Google DELETE remain unchanged.

TASK_DELETE_OWNER_EVIDENCE: VERIFIED_SUPABASE_USER_ID_ONLY
LEGACY_NULL_OWNER_MATCH: LOCAL_TASK_TOMBSTONE_ONLY
LEGACY_NULL_OWNER_MISSING_OR_MISMATCH: 403_UNCHANGED
LEGACY_NULL_LEAD_NEXT_ACTION_MUTATION: NO
NON_NULL_WORKSPACE_MISMATCH: 409_UNCHANGED
EXACT_WORKSPACE_LOCAL_TOMBSTONE: YES
EXACT_WORKSPACE_SCOPED_LEAD_CLEANUP: YES
EVENT_DELETE_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
REMOTE_GOOGLE_DELETE_ADDED: NO
WORKSPACE_CLAIM_ADDED: NO
PENDING_DELETE_ADDED: NO

## Verification evidence

- Dedicated executable Task DELETE matrix: 20 PASS / 0 FAIL.
- Static guard covers changed-file scope, verified owner evidence, race-safe legacy writer, exact-workspace lead cleanup and Event DELETE regression.
- Verification commands run the G15-R3 guard, G15-R3 runtime test and the existing G15-R2 Event DELETE runtime test directly; `package.json` is intentionally unchanged.
- TypeScript transpilation of the changed route: PASS.
- Production build and deployment statuses are resolved after the branch is merged and Vercel checks finish.

## Important limitation

Historical G15/G15-R1 guard files encode the earlier intentional state where Task DELETE was not yet authorized. They are not used as forward gates for G15-R3. Their security invariants are reasserted by the G15-R3 guard without weakening the historical evidence.

NEXT_CHECKPOINT:
FINAL_GOOGLE_CALENDAR_DELETE_SMOKE_AFTER_BOTH_SAFE_CONSUMERS

G16_AUTOMATICALLY_AUTHORIZED:
NO
