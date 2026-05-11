# CloseFlow — Stage 11 guard repair 3 — Today restore label

Data: 2026-05-11

## Cel

Naprawić czerwony guard `tests/today-restore-completed-label.test.cjs`, który wymaga literalnego kontraktu etykiety przycisku wykonania/przywracania na ekranie Today.

## Zakres

- `src/pages/Today.tsx`

## Co poprawiono

Helper `formatTodayCompleteActionLabel` zwraca teraz dokładny kontrakt:

```ts
return isCompleted ? 'Przywróć' : 'Zrobione';
```

Stan `completePending` nadal zwraca `Zapisywanie...`, więc UX nie traci informacji o trwającej akcji.

## Guardy

```powershell
npm.cmd run check:closeflow-case-client-roadmap-repair
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```
