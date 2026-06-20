# STAGE232I4_R16T_MISSING_MANAGER_TOGGLE_AND_BADGE_CLEANUP

Date/time: 2026-06-20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scope
- Remove visible `Klient` / `Blokuje` badges from shared missing manager rows.
- Keep checkbox as the single visible blocker control.
- Fix ClientDetail blocker toggle runtime error reported as `existing is not defined` by sending a full normalized task patch through `updateTaskInSupabase`.

## Not touched
- SQL
- Owner Control
- finances
- Calendar
- billing/trial
- CaseDetail

## Required verification
- Guard: `node scripts/check-stage232i4-r16t-missing-manager-toggle-and-badge-cleanup.cjs`
- Test: `node --test tests/stage232i4-r16t-missing-manager-toggle-and-badge-cleanup.test.cjs`
- Build: `npm run build`
- Diff check: `git diff --check`
- Manual smoke: checkbox can be toggled both ways; no visible Klient/Blokuje badges; no horizontal scroll.
