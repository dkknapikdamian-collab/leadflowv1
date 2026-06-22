# STAGE232I4_R16Z_R10_R3_R4_OVERWRITE_GUARDS_FINAL

- data/czas: 2026-06-21 HH:mm Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK
- owner smoke: LEAD PASS, CLIENT REGRESSION PASS, reported by Damian
- closes: STAGE232I4_R16Z_R10 and R16Z close/status sync
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH
- no SQL, no ClientDetail runtime, no CaseDetail runtime, no Calendar, no billing, no Owner Control runtime

# STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX

Date: 2026-06-21 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK

## Root cause
R8 fixed LeadDetail task PATCH fields and R9 fixed MissingItemsManagerDialog direct false handling, but LeadDetail still computed item.isBlocker from stale activity metadata. buildLeadMissingActivityMetadataStage232AR8 could preserve an old blocking creation/activity signal, so after loadLead/F5 the manager received isBlocker=true again.

## Fix
- Add direct task/payload blocker override before activity fallback in isLeadBlockerTaskStage232AR8.
- Treat payload blocksProgress=false as explicit false, not as fallback to eventType/status block text.
- Keep newest activity metadata by timestamp instead of arbitrary map overwrite.
- On toggle, write a neutral missing_item_state_updated activity with blocksProgress/status/priority.

## Tests
Run by package:
- node scripts/check-stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.cjs
- node --test tests/stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.test.cjs
- node scripts/check-stage232i4-r16z-r9-missing-manager-direct-blocker-override.cjs
- node --test tests/stage232i4-r16z-r9-missing-manager-direct-blocker-override.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## Manual smoke required
Lead -> Zobacz wszystkie braki -> odznacz Blokuje -> wait -> F5 -> checkbox remains unchecked. Then re-check -> F5 -> checkbox remains checked.

## Scope not touched
SQL, RLS, finance, calendar, CaseDetail runtime, modal visual layout, billing/trial.


## STAGE232I4_R16Z_R10_R3_CLOSURE

- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK
- owner smoke: PASS confirmed by Damian.
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH
