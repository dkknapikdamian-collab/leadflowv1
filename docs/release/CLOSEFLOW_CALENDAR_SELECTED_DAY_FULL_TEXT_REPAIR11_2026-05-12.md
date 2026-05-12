# CloseFlow — Calendar Selected Day Full Text Repair11 — 2026-05-12

## Cel

Naprawić wyłącznie sekcję `Wybrany dzień` pod miesięcznym kalendarzem.

Miesięczny widok V4 jest zamrożony i nie jest bezpośrednio zmieniany.

## Zakres zmian

- `src/pages/Calendar.tsx`
  - dodaje import CSS Repair11 po imporcie V4,
  - dodaje marker sekcji `data-cf-calendar-selected-day="true"`,
  - dodaje hooki `data-cf-entry-type-label` i `data-cf-entry-title`,
  - dodaje guardy, żeby stare normalizery DOM nie przerabiały `.calendar-entry-card`.
- `src/styles/closeflow-calendar-selected-day-full-text-repair11.css`
  - scoped tylko do `[data-cf-calendar-selected-day="true"]`,
  - przywraca pełne etykiety `Zadanie`, `Wydarzenie`, `Lead`,
  - pokazuje tytuł wpisu obok etykiety,
  - nie dotyka `closeflow-calendar-month-plain-text-rows-v4.css`.
- `scripts/check-closeflow-calendar-selected-day-full-text-repair11.cjs`
  - guard wdrożeniowy.
- `tools/audit-closeflow-calendar-selected-day-full-text-repair11.cjs`
  - audyt lokalny markerów i starych importów.

## Czego nie zmieniać

- Nie ruszać miesięcznego V4.
- Nie przywracać V5/V6/Repair2/Repair3/Repair4/Repair5.
- Nie zmieniać `src/styles/closeflow-calendar-month-plain-text-rows-v4.css`.
- Nie robić globalnych CSS-ów na cały kalendarz.

## Kryterium zakończenia

W sekcji `Wybrany dzień` karta wpisu pokazuje:

- pełny typ, np. `Zadanie`, `Wydarzenie`, `Lead`,
- pełny tytuł wpisu,
- czytelny biały pasek/kartę bez samych skrótów `Zad` / `Wy`.
