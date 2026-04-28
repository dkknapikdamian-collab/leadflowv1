# Stage28f: finalne sprzątanie kontraktu testu direct write

## Cel

Ustabilizować test `tests/ai-direct-write-respects-mode-stage28.test.cjs` po wdrożeniu trybu bezpośredniego zapisu AI.

## Zakres

- nadpisano wyłącznie test Stage28,
- usunięto kruche `assert.match` z regexami dla fragmentów zawierających nawiasy,
- dodano krótkie `assertHas(...includes...)`, żeby błędy nie wypisywały całych plików,
- bez zmian runtime,
- bez SQL.

## Kryterium zakończenia

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/ai-safety-gates-direct-write.test.cjs
node tests/ai-direct-write-respects-mode-stage28.test.cjs
```
