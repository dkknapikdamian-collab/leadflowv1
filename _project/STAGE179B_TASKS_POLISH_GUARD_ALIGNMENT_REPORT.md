# STAGE179B Tasks Polish Guard Alignment — raport

Data: 2026-05-24  
Projekt: CloseFlow / LeadFlow  
Zakres: hotfix / tasks copy / guard alignment

## Cel

Naprawić Stage179 po nieudanym przejściu guardów:
- usunąć resztki mojibake `zadaĹ`,
- wyrównać literale wymagane przez Stage178/178B guardy,
- utrzymać usunięcie `Szybki fokus`.

## FAKTY

- Stage179 build przeszedł.
- Stage179 guard padł na `zadaĹ`.
- Stage178 i Stage178B guardy padły na brak literalnego `Filtry zadań`.
- Dodatkowe ręczne komendy zostały odpalone z `C:\Windows\System32`, dlatego późniejsze `node scripts/...` i `npm run build` nie znalazły repo ani `package.json`.

## DECYZJE DAMIANA

- Poprawić polskie znaki.
- Usunąć `Szybki fokus`.
- Nie pushować, dopóki guardy nie przejdą.
- Każda poprawka ma mieć guard.

## HIPOTEZY AI

- Część tekstów warto zostawić jako literalne nagłówki, żeby stare guardy nadal działały.
- Etykiety w tablicach JS mogą zostać jako unicode escapes, żeby nie wracał mojibake.

## Pliki

- `src/pages/TasksStable.tsx`
- `scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs`
- `scripts/check-stage178b-tasks-rail-guard-repair.cjs`
- `scripts/apply-stage179b-tasks-polish-guard-alignment.cjs`
- `scripts/check-stage179b-tasks-polish-guard-alignment.cjs`
- `docs/ui/CLOSEFLOW_STAGE179B_TASKS_POLISH_GUARD_ALIGNMENT.md`
- `_project/STAGE179B_TASKS_POLISH_GUARD_ALIGNMENT_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-24 - CloseFlow Stage179B tasks polish guard alignment.md`

## Testy automatyczne

```powershell
node scripts/check-stage179b-tasks-polish-guard-alignment.cjs
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```

## Czego nie ruszano

- deploy
- push
- dane
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
