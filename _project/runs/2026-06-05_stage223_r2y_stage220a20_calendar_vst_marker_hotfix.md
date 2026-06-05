# STAGE223 R2Y - Stage220A20 Calendar VST marker hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2X mass scan przeszedł wszystkie 178 testów.
- Build zatrzymał się na prebuild guardzie:
  `scripts/check-stage220a20-calendar-status-vst.cjs`
- Guard wymaga literalnego stringa:
  `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card`
- Stage100/104/99 zabraniają tej sekwencji w funkcji `ScheduleEntryCard`, bo widzą ją jako legacy combo.
- R2Y dodaje wymagany string poza `ScheduleEntryCard`, jako compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`.

## ZAKRES

- Dotknąć tylko:
  - `src/pages/Calendar.tsx`,
  - centralne `_project/*` memory files,
  - `_project/runs`,
  - `_project/obsidian_updates`.
- Nie zmieniać runtime UI.
- Nie przywracać legacy class combo do `ScheduleEntryCard`.
- Nie zmieniać Stage223, Activity Truth, Today, Supabase, daily digest ani `/api/activities`.

## TESTY

```powershell
node scripts/check-stage220a20-calendar-status-vst.cjs
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- To jest marker kompatybilności dla sprzecznych historycznych gate’ów.
- Nie powinien wpływać na UI.
- Po zielonym buildzie nadal trzeba ręcznie sprawdzić Calendar, bo R2X zmieniał klasy/dialogi.

## NASTĘPNY KROK

Jeśli `build`, `verify:closeflow:quiet` i `git diff --check` przejdą, wykonać push całego Stage223.
