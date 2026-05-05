# STAGE83 - Task Done -> Next Step Prompt

Status: real application stage.

## Cel

Po oznaczeniu zadania jako zrobione aplikacja pokazuje miękki prompt ustawienia kolejnego follow-upu, żeby lead albo sprawa nie wypadły z procesu.

## Zakres

- `TasksStable.tsx` dostaje marker `STAGE83_TASK_DONE_NEXT_STEP_PROMPT`.
- Po kliknięciu `Zrobione` dla zadania z relacją do leada/sprawy/klienta pojawia się dialog `Ustaw kolejny krok`.
- Dialog tworzy nowe zadanie `follow_up` z tą samą relacją.
- Dodano guard `check:stage83-task-done-next-step-prompt`.
- Dodano verify `verify:stage83-task-next-step`.

## Nie zmienia

- Nie rusza Stripe.
- Nie rusza Google Calendar.
- Nie rusza digestu.
- Nie zmienia schematu Supabase.
- Nie przebudowuje layoutu aplikacji.

## Weryfikacja

```powershell
npm.cmd run check:stage83-task-done-next-step-prompt
npm.cmd run build
```
