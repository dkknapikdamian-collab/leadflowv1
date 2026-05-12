# Calendar Text Ellipsis + Selected Day Repair5

## Werdykt
Naprawa Repair4 była za słaba, bo nie trafiała stabilnie w faktycznie wyrenderowane małe wpisy miesiąca i zostawiała zaznaczony dzień w dwóch kolumnach.

## Co robi Repair5
- nadaje klasę `cf-calendar-route-active` na `body` tylko podczas montowania kalendarza,
- oznacza realnie wyrenderowane wpisy miesiąca klasą `cf-cal-r5-month-entry`,
- wymusza jedną linię + `text-overflow: ellipsis`,
- dodaje `title`/`aria-label`, żeby hover pokazywał cały tekst,
- zaznaczony dzień układa jako jedną kolumnę pełnej szerokości, żeby przyciski się mieściły.

## Poza zakresem
- API
- Supabase
- sidebar
- logika CRUD
