# CloseFlow — Calendar Month Tooltip + Actions Repair4

## Problem

Aktualnie są dwa widoczne problemy:

1. W kalendarzu miesięcznym długie tytuły wpadają wizualnie pod kolejne wpisy albo zawijają się tak, że wygląda to jak rozjazd.
2. W sekcji zaznaczonego dnia akcje przy wpisie są czytelne, ale układ ikon/przycisków nie jest zablokowany jako jedna linia.

## Decyzja

Nie ruszamy danych ani logiki kalendarza.

Naprawa robi tylko warstwę render/readability:

- wpis w miesiącu = jedna linia,
- nadmiar tekstu = `...`,
- pełny tekst = `title` po najechaniu,
- wpis zaznaczonego dnia = biała karta z czarnym tekstem,
- akcje w zaznaczonym dniu = jedna linia na desktopie.

## Zmienione pliki

- `src/pages/Calendar.tsx`
- `src/styles/closeflow-calendar-month-tooltip-actions-repair4.css`
- `tools/patch-closeflow-calendar-month-tooltip-actions-repair4.cjs`
- `tools/audit-closeflow-calendar-month-tooltip-actions-repair4.cjs`
- `scripts/check-closeflow-calendar-month-tooltip-actions-repair4.cjs`

## Nie zmieniać

- API
- Supabase
- sidebar
- tworzenie/edycja/usuwanie wpisów
- routing
