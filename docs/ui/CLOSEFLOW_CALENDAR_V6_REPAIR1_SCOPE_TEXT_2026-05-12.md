# CloseFlow — Calendar V6 Repair1 Scope/Text

## Problem

V6 był za szeroki. Dotknął wpisów w kafelkach miesiąca, a one miały zostać bez zmian.

Dodatkowo w dolnym panelu pod kalendarzem miesięcznym białe paski miały niewidoczny tekst.

## Naprawa

- usuwa broad runtime effect `CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT`,
- przywraca czarny tekst w kafelkach miesiąca,
- ustawia czarny tekst na białych paskach w dolnym panelu,
- zostawia ellipsis i hover title.

## Nie rusza

- API,
- Supabase,
- danych,
- handlerów,
- sidebaru,
- routingu.
