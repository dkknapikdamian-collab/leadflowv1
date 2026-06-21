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