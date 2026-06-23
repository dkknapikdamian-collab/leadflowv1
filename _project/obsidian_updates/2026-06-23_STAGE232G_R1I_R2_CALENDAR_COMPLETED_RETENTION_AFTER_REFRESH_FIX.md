# 2026-06-23 20:05 Europe/Warsaw — STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX

canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
obsidian_folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

APPLIED_PENDING_GUARDS_AND_MANUAL_SMOKE

## Decyzja / korekta

R1G jest oznaczony jako false-positive i nie powinien być commitowany. Problem znikania wpisu po `Zrobione` nie był problemem sortowania, tylko utraty wpisu po `refreshSupabaseBundle()`.

## Zakres R1I_R2

- Czyści R1G z Calendar runtime.
- Dodaje workspace-scoped completed retention dla Calendar event/task.
- Utrzymuje zakończony wpis po refreshu i F5 jako widoczny do cofnięcia.
- `Przywróć` usuwa retention.
- Nie dotyka Today, SQL/RLS, Google, billing, finance, Braki.

## Testy

- `node scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs`
- `node --test tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs`
- `node --test tests/stage232g-r1f-calendar-today-final-parity-guard-and-smoke.test.cjs`
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`
- manual smoke: Calendar -> Zrobione -> visible crossed bottom -> F5 -> visible -> Przywróć -> F5 -> active

## Ryzyka

Retention działa jako lokalny safety net po działaniach wykonanych z Calendar. Docelowo backend/API powinien jawnie zwracać completed rows, jeśli Calendar ma być pełnym operacyjnym źródłem prawdy.
