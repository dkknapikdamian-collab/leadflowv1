# STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze

Reason:
- R16Z_R5_R5 updated the legacy ClientDetail operational center test, but its guard showed CF-RUNTIME-00 did not yet allow the R5_R5 repair files.

Scope:
- Add R5_R5 compatibility repair files to both R16Z_R5 close guard and CF-RUNTIME-00 allowlists.
- Add R6 guard/test/report files to both allowlists.
- Preserve R16Z_R5/R2/R3/R4/R5 work without restore.
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