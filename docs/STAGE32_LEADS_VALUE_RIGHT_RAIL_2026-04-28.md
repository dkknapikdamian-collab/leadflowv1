# Stage32 - Najcenniejsze relacje po prawej stronie

## Cel
Przenieść blok `Najcenniejsze relacje` z dużej sekcji w zakładce Leadów do małej listy po prawej stronie.

## Zmienione pliki
- `src/pages/Leads.tsx`
- `tests/stage32-leads-value-right-rail.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `scripts/closeflow-release-check.cjs`

## Zakres
- Dodano prawy panel `Najcenniejsze` obok wyszukiwarki.
- Zostawiono dotychczasowe liczenie wartości relacji.
- Lista pokazuje maksymalnie 5 relacji.
- Każdy wiersz jest klikalny i prowadzi do istniejącego `entry.href`.
- Usunięto długi opis i duży siatkowy układ starego bloku.

## Nie zmieniaj
- Bez zmian SQL.
- Bez zmian w liczeniu `relation-value.ts`.
- Bez zmian w tworzeniu i archiwizacji leadów.

## Kryterium zakończenia
- `npm.cmd run lint`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run build`
- `node tests/stage32-leads-value-right-rail.test.cjs`
