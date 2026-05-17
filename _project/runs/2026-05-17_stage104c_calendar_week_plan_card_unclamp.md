# Stage104C — Calendar week plan card unclamp

## Scan-first confirmation

- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- Read files/folders: src/pages/Calendar.tsx, src/styles/closeflow-calendar-selected-day-new-tile-v9.css, tests/stage99, tests/stage100, tests/stage104, scripts/closeflow-release-check-quiet.cjs, _project docs.
- Obsidian notes targeted: 10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md and Stage104C note.
- Active source of truth: Calendar.tsx ScheduleEntryCard + closeflow-calendar-selected-day-new-tile-v9.css.
- Legacy / competing paths: calendar-entry-card global CSS must not affect week-plan card.

## Run report

- Goal: stop week-plan entries from collapsing into a tiny vertical action chip.
- Files changed: Calendar.tsx, V9 CSS, Stage99/100/104 guards, quiet gate if needed, project memory, Obsidian note.
- Reason: screenshot showed corrected Polish copy but broken entry visibility.
- Tests run: see script output.
- Manual checks: TEST RĘCZNY DO WYKONANIA on /calendar.
- Remaining risks: unrelated dirty tools/_project files remain in local repo and are intentionally not staged.
- Next step: manual screenshot test for day with 1 wpis and day with 0 wpisów.
