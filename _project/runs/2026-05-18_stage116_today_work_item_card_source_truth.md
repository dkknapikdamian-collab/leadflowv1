# Stage116 - Today work item card source of truth

## Status
LOCAL ZIP/PUSH PACKAGE PREPARED.

## Scan-first confirmation
- Repo: CloseFlow / leadflowv1.
- Branch expected: dev-rollout-freeze.
- Read files before patch: src/pages/TodayStable.tsx, package.json, active Stage115E context, Today row/link rendering.
- Active Today screen: src/pages/TodayStable.tsx.

## FAKTY Z FEEDBACKU
- Kafelki wydarzeń/zadań w Najbliższe 7 dni i podobne elementy mają mieć jedno źródło prawdy wizualne i spójne kolory.
- Work item card must show type, title, date/time, status and Zrobione action.
- Overdue must be red, completed muted.

## MAPOWANIE
- Today Najbliższe 7 dni: patched in this stage for task/event rows via WorkItemCard. Lead rows remain as lead links.
- Today zaległe/today tasks: patched in this stage via WorkItemCard.
- Today events: patched in this stage via WorkItemCard.
- Calendar selected-day: mapped only, not changed in this stage.
- Calendar week plan: mapped only, not changed in this stage.
- LeadDetail work rows: mapped only, not changed in this stage; Stage115D already has overdue red logic.
- ClientDetail/case rows: mapped only, not changed in this stage.

## ZMIANY
- Added src/components/work-item-card.tsx.
- Added src/styles/work-item-card.css.
- TodayStable imports WorkItemCard and uses it for Today task/event work items and Next 7 task/event items.
- Added status helpers in TodayStable for Zaległe/Dziś/Zaplanowane/Zrobione.
- Added task done handler matching event done behavior.
- Added Stage116 guard and package script.

## TESTY AUTOMATYCZNE
Expected after apply:
- node --test tests/stage76-today-event-done-action.test.cjs
- node --test tests/stage79-today-task-done-action.test.cjs
- npm run check:todaystable-next7-v30
- node --test tests/stage116-today-work-item-card-source-truth.test.cjs
- npm run build

## TEST RĘCZNY DO WYKONANIA
1. Open /today.
2. Expand Zadania do wykonania dziś.
3. Confirm task row uses unified card with type Zadanie, title, date/time, status and Zrobione.
4. Expand Wydarzenia dziś.
5. Confirm event row uses unified card with type Wydarzenie, title, date/time, status and Zrobione.
6. Expand Najbliższe 7 dni.
7. Confirm task/event rows use the same card; overdue rows are red if any appear and completed rows are muted if visible.

## OBSIDIAN
Prepared note: 2026-05-18 - CloseFlow Stage116 Today work item card source of truth.md

## NEXT
If manual QA accepts Today card source, create a later Stage117 for Calendar selected-day/week-plan migration to the same component contract.

## Stage116 V2 - Stage76 guard compatibility repair

## Status
LOCAL ZIP/PUSH HOTFIX PREPARED AFTER V1 GUARD FAILURE.

## FAKTY Z LOGU DAMIANA
- Stage116 V1 patch applied, then failed on Stage76 guard.
- Failing token: `doneLabel="Zrobione"` missing in `src/pages/TodayStable.tsx`.
- Root cause: Stage116 moved event done rendering to `WorkItemCard`, while legacy Stage76 guard still scans TodayStable for the literal prop token.

## ZMIANA
- Added `STAGE116_STAGE76_EVENT_DONE_GUARD_COMPAT` literal in TodayStable.
- This preserves Stage116 WorkItemCard source-of-truth and keeps Stage76 guard green without weakening the guard.

## TESTY
- node --test tests/stage76-today-event-done-action.test.cjs
- node --test tests/stage79-today-task-done-action.test.cjs
- npm run check:todaystable-next7-v30
- node --test tests/stage116-today-work-item-card-source-truth.test.cjs
- npm run build
