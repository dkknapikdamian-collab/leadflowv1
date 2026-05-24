# CloseFlow Stage178B — Tasks rail guard repair

## Problem

Stage178 build passed, but Stage178 guard failed because the JSX section with `Filtry zadań` was not present in `TasksStable.tsx`.

## Fix

Stage178B repairs the local file by forcibly ensuring:
- Stage178 main marker,
- helper functions for grouping and right rail,
- grouped task list,
- right rail with `Filtry zadań`, `Najpilniejsze zadania`,
- Stage178 search marker.

## Tests

```powershell
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```


## Stage179 update

- Poprawiono polskie znaki w tekstach panelu zadań.
- Usunięto kartę `Szybki fokus` z prawego panelu.
- Pozostają: `Filtry zadań` i `Najpilniejsze zadania`.
