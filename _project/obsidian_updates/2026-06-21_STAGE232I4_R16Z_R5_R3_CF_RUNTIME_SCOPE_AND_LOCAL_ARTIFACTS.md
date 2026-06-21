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