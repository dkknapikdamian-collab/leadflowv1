# CloseFlow Stage179C — Tasks Polish Final Guard Repair

Data: 2026-05-24  
Status: przygotowano ZIP lokalny  
Typ: hotfix / tasks copy / guard reconciliation przed pushem

## FAKTY

- Stage179B build przeszedł, ale Stage179B guard nadal padł na `Ĺ‚`.
- Stage179 guard padł na starym oczekiwaniu escaped markeru `<h2>{'Filtry zada\u0144'}</h2>`.
- Stage178 i Stage178B guardy przechodzą.
- Nie można jeszcze pushować.

## DECYZJE DAMIANA

- Poprawić polskie znaki.
- Usunąć `Szybki fokus`.
- Nie pushować bez przejścia guardów.
- Każda poprawka ma mieć guard.

## HIPOTEZY AI

- Trzeba zamknąć Stage179 finalnym kontraktem guardów zamiast mieszać escaped JSX i literalny JSX.
- Literalne `<h2>Filtry zadań</h2>` powinno zostać, bo starsze Stage178/178B guardy tego oczekują.
- Etykiety w tablicach pozostają jako unicode escapes.

## TESTY

```powershell
node scripts/check-stage179c-tasks-polish-final-guard-repair.cjs
node scripts/check-stage179b-tasks-polish-guard-alignment.cjs
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Po przejściu wszystkich guardów i builda można wrócić do commit + push.
