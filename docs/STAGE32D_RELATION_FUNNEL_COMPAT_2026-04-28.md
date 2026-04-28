# Stage32d: kompatybilność testu wartości lejka po przeniesieniu listy na prawą stronę

Data: 2026-04-28

## Cel

Zachować nowy układ Stage32, ale przywrócić kompatybilny tekst wymagany przez starszy test `relation-funnel-value.test.cjs`.

## Zakres

- prawy panel Najcenniejsze relacje zostaje,
- źródło wartości lejka zostaje bez zmian,
- wraca kompatybilny tekst `Lejek razem: {formatRelationValue(relationFunnelValue)}`,
- nie zmieniamy logiki liczenia wartości.

## SQL

Brak zmian SQL.
