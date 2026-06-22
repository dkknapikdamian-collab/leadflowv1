# STAGE232I4_R16Z_R5_R2_BOM_REPAIR_CONTINUE

Date/time: 2026-06-21 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze
Base commit: d0cae442

Reason:
- R16Z_R5_R1 passed R16O/R16Z/R16Z_R5 guards and tests, but verify:closeflow:quiet failed on Stage98 mojibake/BOM gate.
- Failure source: raw BOM at start of src/components/detail/MissingItemsManagerDialog.tsx.

Scope:
- Remove UTF-8 BOM from MissingItemsManagerDialog.tsx.
- Preserve R16Z_R5 consolidation changes already applied by R16Z_R5_R1.
- Add focused R16Z_R5_R2 guard/test to prevent BOM regression.

Not touched:
- SQL
- backend
- finance
- Calendar
- CaseDetail runtime
- Owner Control runtime

Required checks:
- R16O consolidated guard/test
- R16Z_R4 guard/test
- R16Z_R5 guard/test
- R16Z_R5_R2 guard/test
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

Manual smoke still required before push:
- Client missing add/list/checkbox/resolve/delete/F5.
- Lead missing manager/checkbox/resolve/delete/F5.

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
