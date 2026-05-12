# CloseFlow Stage14J Repair1 — calendar month entry tooltip guard fix

## Cel
Naprawa nieudanego Stage14J, w ktorym patch dodal tooltip przez `setAttribute('title', label)`, ale guard szukal dokladnego wariantu `setAttribute("title", label)`.

## Zakres
- `src/pages/Calendar.tsx`
- lokalne style kalendarza miesiecznego
- `scripts/check-stage14j-calendar-month-entry-ellipsis.cjs`
- `tools/repair-stage14j-calendar-month-entry-ellipsis-repair1.cjs`
- `package.json`, tylko jesli brakuje skryptu guarda

## Co pilnuje guard
- wpisy w miesiecznym kalendarzu sa oznaczane `data-calendar-month-entry="true"`,
- wpisy dostaja natywny tooltip `title`,
- wpisy i ich dzieci sa jednowierszowe,
- overflow jest ucinany przez `text-overflow: ellipsis`,
- patch nie dotyka API ani danych.

## Testy
- `npm.cmd run check:stage14j-calendar-month-entry-ellipsis`
- `npm.cmd run check:stage14i-calendar-snake-case-task-dates`, jesli istnieje
- `npm.cmd run check:stage14h-calendar-week-nearest7-dedupe`, jesli istnieje
- `npm.cmd run check:closeflow-admin-feedback-2026-05-11-p3`, jesli istnieje
- `npm.cmd run build`
