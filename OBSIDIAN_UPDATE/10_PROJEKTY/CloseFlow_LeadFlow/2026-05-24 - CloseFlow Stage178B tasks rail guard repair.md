# CloseFlow Stage178B — Tasks rail guard repair

Data: 2026-05-24  
Status: przygotowano ZIP lokalny  
Typ: hotfix przed pushem / Stage178 guard repair

## FAKTY

- Stage178 build przeszedł.
- Stage178 guard nie przeszedł.
- Brakujący marker po pierwszej naprawie: `Filtry zadań`.
- To oznacza, że prawa kolumna zadań nie została w pełni wpisana do `TasksStable.tsx`.

## DECYZJE DAMIANA

- Nie pushować, jeśli guard nie przechodzi.
- Naprawić lokalnie.
- Każda poprawka ma mieć guard.

## TESTY

```powershell
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Po przejściu obu guardów i builda można wykonać commit + push na `dev-rollout-freeze`.


## Stage179 update

- Poprawiono polskie znaki w tekstach panelu zadań.
- Usunięto kartę `Szybki fokus` z prawego panelu.
- Pozostają: `Filtry zadań` i `Najpilniejsze zadania`.
