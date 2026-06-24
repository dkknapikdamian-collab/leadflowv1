# STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX

Date: 2026-06-24 22:00 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

GITHUB_PATCH_PUSHED / LOCAL_GUARDS_REQUIRED / OWNER_SMOKE_PENDING

## Scan report

Read mode: targeted Project Scan First.

Files read before implementation:

- `AGENTS.md`
- `_project/00_AI_START_SPIS_TRESCI.md`
- `_project/CODEX_CONTEXT_INDEX.md`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `src/pages/Calendar.tsx`
- `src/lib/calendar-operational-entry-contract.ts`
- `src/lib/calendar-operational-entry-action-policy.ts`
- `src/lib/scheduling.ts`
- `scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs`
- `tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs`
- `scripts/check-cf-runtime-00-source-truth.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `package.json`

Files intentionally not read broadly:

- whole repo,
- whole `_project`,
- Owner Control runtime,
- A35B runtime,
- LeadDetail / ClientDetail / CaseDetail,
- finance / billing / SQL / Google OAuth / AI Drafts.

## Current finding

R1I retention runtime already exists in `Calendar.tsx`:

- workspace-scoped localStorage/in-memory completed retention cache,
- retained task/event row builder,
- merge of retained event/task rows after `refreshSupabaseBundle()` if backend omits completed row,
- release on `Przywróć`,
- completed styling and completed-last sorting.

R1I_R2 closeout problem was guard/test depth, not a need to rewrite Calendar runtime.

## Implemented in this closeout patch

Updated:

- `scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs`
- `tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs`
- this run report
- Obsidian payload for this stage

Guard/test now cover:

1. R1G false-positive marker is absent.
2. Runtime marker `STAGE232G_R1I_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX` exists.
3. R1I_R2 run report and payload exist.
4. Retention cache is workspace-scoped and persisted in localStorage.
5. Retention is restricted to `event | task`.
6. `Zrobione` retains task/event.
7. `Przywróć` releases retention and deletes cache entry.
8. Refresh merge covers both events and tasks.
9. Backend-returned completed row does not duplicate retained row.
10. Completed entries keep crossed/completed visual state and sort below open entries.
11. Day fields are preserved so retention does not create cross-day leakage.
12. Lead shadow is blocked by the operational action contract and action policy.
13. No Owner Control/A35B/SQL scope creep in Calendar.
14. CF runtime allowlist still references the R1I guard/test.

## Commands required locally

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

node scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs
node --test tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs
node scripts/check-cf-runtime-00-source-truth.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Manual smoke required

1. Wejdź w Calendar.
2. Wybierz dzień z taskiem.
3. Kliknij `Zrobione`.
4. Zrób F5.
5. Task ma nadal być widoczny jako zakończony, na dole listy.
6. Kliknij `Przywróć`.
7. Zrób F5.
8. Task nie może wrócić jako zakończony z cache.
9. Powtórz na event.
10. Sprawdź lead shadow — nie może skutecznie wykonać `Zrobione/Przywróć`, jeśli action policy tego nie pozwala.

## Risk audit

- Retention cache jest lokalnym safety-netem po akcji wykonanej w Calendar, nie nowym źródłem prawdy.
- Jeżeli backend/API zacznie zwracać completed rows konsekwentnie, merge ma nie dublować wpisów.
- Jeżeli użytkownik kliknie `Przywróć`, retention musi zostać usunięty, żeby po F5 wpis nie wracał jako sztucznie zakończony.
- Lead shadow jest nadal ryzykiem UX, bo Calendar renderuje wspólne przyciski akcji, ale handler i policy blokują niedozwolone akcje. Do osobnego etapu można rozważyć ukrywanie przycisków niedozwolonych, jeśli Damian potwierdzi, że sam widoczny przycisk jest mylący.

## Not touched

- Owner Control runtime,
- A35B,
- LeadDetail,
- ClientDetail,
- CaseDetail,
- Braki/Blokady,
- finance / commission,
- billing / trial,
- Google OAuth / production sync,
- SQL / RLS / migrations,
- AI Drafts,
- DudekHome,
- `.tmp.driveupload`.

## Close criteria

Stage can move to `PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK` only after:

- guard PASS,
- node test PASS,
- CF runtime source truth PASS,
- build PASS,
- verify quiet PASS,
- diff-check PASS,
- Damian manual smoke OK.
