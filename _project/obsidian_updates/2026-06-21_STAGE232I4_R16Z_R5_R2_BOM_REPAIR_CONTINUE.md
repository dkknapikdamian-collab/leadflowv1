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