# STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS

Date/time: 2026-06-21 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze

Reason:
- R16Z_R5_R2 fixed Stage98 BOM gate, but verify:closeflow:quiet then failed in CF-RUNTIME-00 because the guard checks all changed and untracked files.
- The failure had two causes: current R16Z_R5 close files were not in CF-RUNTIME-00 allowlist, and old local artifacts/backups were still visible to git as untracked.

Scope:
- Add R16Z_R5/R2/R3 files to CF-RUNTIME-00 allowlist.
- Add local .git/info/exclude entries for old stage backup/runtime artifacts without deleting them.
- Keep MissingItemsManagerDialog UTF-8 without BOM.

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
