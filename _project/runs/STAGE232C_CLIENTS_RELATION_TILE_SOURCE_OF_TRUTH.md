# STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH

Status: LOCAL_TECH_PASS / NEEDS_OWNER_SMOKE
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Date: 2026-06-27 Europe/Warsaw

## R2

- Guard sync commit: 129dab63.
- Aktywni restored to activeCount.

## R3

- Real `without_case` client relation filter.
- Real `needs_contact` filter from Contact Cadence Grid buckets, not clients without leads.
- Contact Cadence Grid receives related client context.
- Prowizja uses active commission source truth.
- Najwyzsza prowizja uses active commission entries.
- Top tiles and right rail share `applyClientRelationFilterStage232C`.
- STAGE232C guard/test expanded.
- Legacy Stage91 top value test aligned to active commission source truth.

## Additional Runtime Fix From Owner Report

- Calendar lead shadow actions repaired:
  - `+1H`, `+1D`, `+1W` keep writing `leads.nextActionAt`.
  - `Zrobione` now reaches the real lead branch before local seed fallback and shows a completed crossed-out lead shadow entry in the current Calendar session.
  - `Usun` clears the lead next action without deleting the lead.
- Calendar mojibake/BOM cleanup was required by Stage98 after touching `Calendar.tsx`.
- STAGE232T_R4 guard/test expanded so the lead complete branch must run before local seed fallback.

## Not Touched

- Obsidian.
- SQL/RLS/migrations.
- Google Calendar OAuth/sync backend.
- TodayStable runtime.
- LeadDetail runtime.
- ClientDetail runtime.
- CaseDetail runtime.
- Finance schema.

## Manual Smoke

MANUAL_UI_NOT_EXECUTED

Recommended smoke:

- `/clients`: Aktywni, Bez sprawy, Wymaga kontaktu, Prowizja, Kosz, search combined with filters.
- `/calendar` month view selected day: lead row `+1H`, `+1D`, `+1W`, `Zrobione`, `Usun`.
- Lead after Calendar action: next action moves/clears consistently after refresh.

## Local Verification

- `node scripts/check-stage232c-clients-relation-tile-source-of-truth.cjs`: PASS
- `node --test tests/stage232c-clients-relation-tile-source-of-truth.test.cjs`: PASS
- `node scripts/check-stage232t-r4-calendar-lead-shadow-actions.cjs`: PASS
- `node --test tests/stage232t-r4-calendar-lead-shadow-actions.test.cjs`: PASS
- `node --test tests/stage91-clients-top-value-runtime-contract.test.cjs`: PASS
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`: PASS
- `node scripts/check-stage231d0b-client-list-card-freeze.cjs`: PASS
- `node scripts/check-visual-stage05-clients.cjs`: PASS
- `node scripts/check-cf-runtime-00-source-truth.cjs`: PASS
- `npm run build`: PASS
- `npm run verify:closeflow:quiet`: PASS
- `git diff --check`: PASS
