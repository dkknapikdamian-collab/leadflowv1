# STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR

Date/time: 2026-06-21 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze

Reason:
- R16Z_R5_R3 correctly patched CF-RUNTIME-00 allowlist and local artifact exclude.
- R16Z_R5 close guard then failed because it did not allow the intentional tracked change to scripts/check-cf-runtime-00-source-truth.cjs.

Scope:
- Add scripts/check-cf-runtime-00-source-truth.cjs to the R16Z_R5 close guard tracked diff allowlist.
- Add R16Z_R5_R4 files to CF-RUNTIME-00 allowlist.
- Preserve R16Z_R5/R2/R3 work without restore.
- Keep manager UTF-8 without BOM.

Not touched:
- SQL/RLS
- backend runtime logic
- finance
- Google Calendar
- billing/trial
- Owner Control runtime
- CaseDetail runtime

Manual smoke still required before push:
- Client missing add/list/checkbox/resolve/delete/F5.
- Lead missing manager checkbox/resolve/delete/F5.