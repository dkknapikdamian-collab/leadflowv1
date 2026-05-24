# STAGE179 Tasks Polish Copy + Remove Focus Card — raport

Data: 2026-05-24  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / tasks copy / right rail cleanup

## Cel

Przed pushem poprawić zakładkę `Zadania`:
- naprawić polskie znaki,
- usunąć kartę `Szybki fokus`,
- zostawić prawy rail jako lżejszy układ: `Filtry zadań` + `Najpilniejsze zadania`.

## FAKTY

- Stage178B przeszedł guard Stage178B, guard Stage178 i build.
- Użytkownik zgłosił poprawkę przed pushem.
- W Stage178/178B była karta `Szybki fokus`, która ma zostać usunięta.
- Polskie znaki w UI muszą być odporne na lokalne problemy kodowania.

## DECYZJE DAMIANA

- Poprawić polskie znaki.
- Usunąć `Szybki fokus`.
- Nie pushować przed tą poprawką.
- Każda poprawka ma mieć guard.

## HIPOTEZY AI

- Najbezpieczniej zapisać krytyczne etykiety w `TasksStable.tsx` jako unicode escapes.
- Po usunięciu focus card trzeba zaktualizować Stage178 i Stage178B guardy, bo wcześniej wymagały tej sekcji.
- Prawy rail z dwoma kartami będzie lżejszy i mniej zatłoczony.

## Pliki

- `src/pages/TasksStable.tsx`
- `scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs`
- `scripts/check-stage178b-tasks-rail-guard-repair.cjs`
- `scripts/apply-stage179-tasks-polish-copy-remove-focus.cjs`
- `scripts/check-stage179-tasks-polish-copy-remove-focus.cjs`
- `docs/ui/CLOSEFLOW_STAGE179_TASKS_POLISH_COPY_REMOVE_FOCUS.md`
- `_project/STAGE179_TASKS_POLISH_COPY_REMOVE_FOCUS_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-24 - CloseFlow Stage179 tasks polish copy remove focus.md`

## Testy automatyczne

```powershell
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```

## Testy ręczne

Sprawdzić `/tasks`:
- brak `Szybki fokus`,
- widoczne `Filtry zadań`,
- widoczne `Najpilniejsze zadania`,
- polskie znaki są poprawne: `Zaległe`, `Dziś`, `Bez powiązania`, `Filtry zadań`,
- filtry działają,
- modal `Nowe zadanie` dalej działa.

## Czego nie ruszano

- deploy
- push
- dane
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
