# STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX

Date: 2026-06-21 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: APPLY_LOCAL / SMOKE_PENDING / PUSH_PENDING

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
