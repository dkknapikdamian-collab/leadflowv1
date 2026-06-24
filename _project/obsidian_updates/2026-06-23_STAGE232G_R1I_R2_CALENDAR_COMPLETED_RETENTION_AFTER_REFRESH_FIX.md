# 2026-06-24 22:00 Europe/Warsaw — STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX

canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
obsidian_folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

GITHUB_PATCH_PUSHED / LOCAL_GUARDS_REQUIRED / OWNER_SMOKE_PENDING

## Decyzja / korekta

R1G jest oznaczony jako false-positive i nie powinien być używany jako dowód naprawy. Problem znikania wpisu po `Zrobione` nie był problemem samego sortowania, tylko utraty wpisu po `refreshSupabaseBundle()` albo po F5, gdy backend/API bundle chwilowo nie zwraca completed row.

## Zakres R1I_R2

- Calendar ma workspace-scoped completed retention cache dla event/task.
- `Zrobione` zapisuje event/task do retention.
- Refresh/F5 scala retained rows z backend bundle, jeśli backend ominie completed row.
- `Przywróć` usuwa retention.
- Backend-returned completed row nie może dać duplikatu.
- Completed rows mają zostać widoczne, przekreślone i na dole listy dnia.
- Lead shadow nie dostaje skutecznej akcji task/event, jeśli action policy jej nie pozwala.
- Retention cache jest safety-netem, nie nowym source of truth.

## Zmienione w patchu GitHub 2026-06-24

- `scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs` — guard rozszerzony z płytkich markerów do kontraktu R1I_R2.
- `tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs` — test rozszerzony o event/task, restore, dedup, completed-last sort, day isolation, lead shadow policy i scope guard.
- `_project/runs/STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX.md` — status i scan report uzupełnione.
- `_project/obsidian_updates/2026-06-23_STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX.md` — ten payload zaktualizowany.

## Testy do wykonania lokalnie

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

## Manual smoke

1. Calendar -> task -> `Zrobione`.
2. F5.
3. Task widoczny jako zakończony, przekreślony, na dole listy.
4. `Przywróć`.
5. F5.
6. Task nie wraca jako sztucznie zakończony z cache.
7. To samo dla event.
8. Lead shadow nie może skutecznie działać jak task/event, jeśli policy akcji tego nie pozwala.

## Ryzyka

- Retention działa lokalnie w przeglądarce i jest safety-netem po Calendar action; backend nadal powinien docelowo zwracać done/completed rows zgodnie z Calendar policy.
- Guard/test są statyczne, więc owner smoke pozostaje obowiązkowy.
- Sam widoczny przycisk `Zrobione/Przywróć` przy lead shadow może być później uznany za UX-noise; obecny kontrakt blokuje skuteczną akcję przez policy/handler, ale osobny etap może ukrywać niedozwolone przyciski, jeśli Damian uzna to za problem.

## Nie dotykano

Owner Control, A35B, LeadDetail, ClientDetail, CaseDetail, Braki/Blokady, finance/commission, billing/trial, Google OAuth/sync, SQL/RLS/migrations, AI Drafts, DudekHome, `.tmp.driveupload`.

## Next step

Po lokalnym PASS guard/test/build/verify/diff-check i manual smoke OK ustawić status:

```txt
PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK
```
