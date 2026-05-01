# A25 - Najbliższa zaplanowana akcja

## Cel

Zamknąć kierunek po uwagach: głównym źródłem akcji w czasie nie jest tekstowe pole `nextStep` / `nextActionTitle`, tylko realne zadania i wydarzenia.

System ma mówić:

```text
Najbliższa zaplanowana akcja
```

Gdy nie ma zadania ani wydarzenia:

```text
Brak zaplanowanych działań
```

W widoku Dziś:

```text
Bez zaplanowanej akcji
```

## Wdrożone

- helper:
  - `src/lib/planned-actions.ts`,
  - `getNearestPlannedAction(recordType, recordId, tasks, events)`,
  - obsługa wariantu obiektowego dla lead/case/client.
- kompatybilność:
  - `src/lib/lead-next-action.ts` deleguje do `getNearestPlannedAction(...)`,
  - obecne miejsca używające `getLeadNextAction(...)` dalej działają.
- `lead-health` dostaje marker i teksty pod realne zaplanowane akcje.
- UI copy w głównych ekranach jest przepięte z „Następny krok” na „Najbliższa zaplanowana akcja”.
- Today używa komunikatu „Bez zaplanowanej akcji”.
- CSS hotfix panelu `Najcenniejsze relacje`:
  - etykieta `Lead` jest widoczna zawsze,
  - etykieta nie nachodzi na nazwę ani wartość,
  - hover nie zmienia układu tekstu.

## Nie zmieniono

- Nie usunięto tasków/eventów.
- Nie dodano nowego pola tekstowego.
- Nie przywrócono `nextStep` jako rdzenia.
- Nie zmieniono układu Lead / Klient / Sprawa.
- Nie ruszano notatek głosowych.

## Check

```powershell
npm.cmd run check:a25-nearest-planned-action
```

## Kryterium zakończenia

System pilnuje realnych działań w czasie przez zadania/wydarzenia, a nie przez luźny opis tekstowy.
