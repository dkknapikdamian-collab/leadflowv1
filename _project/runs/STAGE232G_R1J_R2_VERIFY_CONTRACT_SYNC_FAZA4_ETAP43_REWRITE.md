# STAGE232G_R1J_R2_VERIFY_CONTRACT_SYNC_FAZA4_ETAP43_REWRITE

Status:
CONTRACT_SYNC_SOURCE_REVIEW_DONE / LOCAL_VERIFY_REQUIRED

Scope:
- Updated the Faza 4 Etap 4.3 test contract for task and event rewrites.
- Kept the current system-route source truth.
- Did not change runtime logic.
- Did not revert vercel routing.

Why:
- The old test expected task and event API rewrites to go through work-items.
- The current contract after the delete-resurrection fix is the system route family.

Changed file:
- `tests/faza4-etap43-critical-crud-smoke.test.cjs`

Local verification still required:
- run the project verify command set on Windows after pulling this branch.
