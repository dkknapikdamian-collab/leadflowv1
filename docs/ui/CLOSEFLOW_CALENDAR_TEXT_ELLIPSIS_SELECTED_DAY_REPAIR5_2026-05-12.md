# CloseFlow — Calendar Text Ellipsis + Selected Day Repair5

## Problem

Po Repair4 dalej były dwa problemy:

1. Miesięczne kafelki kalendarza nadal potrafiły zawijać tekst albo wyglądać jakby tekst wpadał pod inny wpis.
2. Sekcja `Wybrany dzień` miała dwie karty obok siebie i za mało szerokości na przyciski, więc prawa karta wychodziła poza panel.

## Przyczyna

W kalendarzu narosło kilka warstw CSS i część wpisów miesiąca nie ma stabilnej jednej klasy źródłowej. Poprzednia naprawa była za bardzo zależna od selektora opartego o page header i nie zawsze trafiała w realne wyrenderowane elementy.

## Naprawa

Repair5 robi mocniejszy, ale nadal ograniczony fix:

- `Calendar.tsx` dodaje klasę `cf-calendar-route-active` na `body` tylko gdy kalendarz jest zamontowany.
- Runtime oznacza realne małe wpisy miesiąca klasą `cf-cal-r5-month-entry`.
- Tekst wpisu dostaje jedną linię, `...` i hover `title`.
- Sekcja `Wybrany dzień` dostaje klasę `cf-cal-r5-selected-day-section`.
- Lista kart wybranego dnia jest wymuszona na jedną kolumnę pełnej szerokości.
- Przyciski w karcie są trzymane w jednej linii na desktopie.

## Nie zmienia

- API
- Supabase
- danych kalendarza
- sidebaru
- routingu
- logiki tworzenia / edycji / usuwania
