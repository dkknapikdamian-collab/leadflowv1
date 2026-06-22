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

## STAGE232I4_R16Z_R10_R3_CLOSURE

- status: CLOSED_AFTER_R10_REGRESSION_FIX / OWNER_SMOKE_OK
- next allowed after this closure: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH


# STAGE232I4_R16Z_R10_R3_R4_OVERWRITE_GUARDS_FINAL

- data/czas: 2026-06-21 HH:mm Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK
- owner smoke: LEAD PASS, CLIENT REGRESSION PASS, reported by Damian
- closes: STAGE232I4_R16Z_R10 and R16Z close/status sync
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH
- no SQL, no ClientDetail runtime, no CaseDetail runtime, no Calendar, no billing, no Owner Control runtime
