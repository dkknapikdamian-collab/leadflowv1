# Stage120 - Calendar local-first sync and focus

## Scan-first confirmation

- Repo: CloseFlow / LeadFlow app repo.
- Branch: dev-rollout-freeze.
- Read files/folders: AGENTS.md rules, _project memory protocol, Calendar.tsx, calendar-items.ts, supabase-fallback.ts, scheduling.ts, Stage114 hard refresh guard, Stage108 smoke guard, package.json, quiet release gate, Obsidian CloseFlow dashboard context.
- Active source of truth: repo code for runtime, _project for technical report, Obsidian as dashboard.
- Conflict found: Stage119 gate is green, but manual QA says calendar still does not work. This is runtime/data loading, not release-gate trust.

## FAKTY Z KODU / PLIKOW

- Calendar page loads data through refreshSupabaseBundle() and fetchCalendarBundleFromSupabase().
- Before Stage120, fetchCalendarBundleFromSupabase awaited Google Calendar inbound sync before reading local Supabase data.
- Google inbound sync may take long enough to make hard refresh look empty or frozen.
- Sidebar mini calendar links to /calendar?focus=YYYY-MM-DD, while Calendar did not consume focus before Stage120.

## DECYZJE DAMIANA

- Calendar P0 must be solved, not patched blindly.
- If needed, use a different approach so calendar works reliably.

## HIPOTEZY / PROPOZYCJE AI

- Main cause: local calendar rendering is blocked by external Google inbound sync.
- Fix direction: local Supabase first, Google inbound background after first local render.

## ZMIANY

- src/lib/calendar-items.ts: split Google inbound sync from fetchCalendarBundleFromSupabase.
- src/pages/Calendar.tsx: initial load renders local data first and then runs background Google sync; /calendar?focus date is now honored.
- tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs: regression guard.
- scripts/closeflow-release-check-quiet.cjs and package.json: Stage120 guard wiring.

## TESTY AUTOMATYCZNE

- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run build
- npm run verify:closeflow:quiet

## TESTY RECZNE

TEST RECZNY DO WYKONANIA: /calendar hard refresh, week/month/selected day, /calendar?focus=YYYY-MM-DD, add/edit, +1H/+1D/+1W, done/delete.

## BRAKI I RYZYKA

- Google inbound sync is still async and can update calendar after first render. That is intentional: local data must not be blocked by Google.
- If Google-only events do not appear immediately after hard refresh, wait for background sync completion or add a manual sync button in next stage.

## NASTEPY KROK

Manual QA on calendar. If still broken, collect console/network error and move to API/data schema audit, not UI CSS.

## GIT / ZIP STATUS

ZIP stage with selective push option. Do not use git add .
