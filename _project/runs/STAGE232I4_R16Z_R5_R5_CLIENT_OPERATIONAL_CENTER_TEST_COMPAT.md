# STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT

Date/time: 2026-06-21 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze

Reason:
- verify:closeflow:quiet progressed past CF-RUNTIME-00 after R16Z_R5_R4.
- The next failure was tests/client-detail-v1-operational-center.test.cjs expecting old exact source text: relationIds.leadIds.has(String(task.leadId.
- ClientDetail now uses normalized Stage232I4R14 relation readers for task lead/case IDs and still filters through relationIds.

Scope:
- Update the legacy operational center test to validate current normalized relation filter semantics.
- Add final R16Z_R5_R5 guard/test.
- Add this compatibility repair to R16Z_R5 close guard and CF-RUNTIME-00 allowlists.
- Preserve R16Z_R5/R2/R3/R4 work without restore.

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
