# ETAP 19B — Tasks + Calendar jako powierzchnie procesu

## Cel
Dodać wspólną warstwę procesu dla:
- listy zadań,
- kalendarza tygodniowego,
- eventów i follow-upów przypiętych do leada.

## Co zostało dodane
- `lib/domain/task-calendar-process-surface.ts`
- `tests/task-calendar-process-surface.test.ts`

## Po co
Żeby każdy task i każde wydarzenie przypięte do leada mogły odpowiedzieć na pytania:
- z jakim leadem to jest związane,
- na jakim etapie jest ten lead,
- jaki jest następny ruch,
- czy to jeszcze sprzedaż, czy już operacje,
- czy można uruchamiać sprawę.

## Jak to wykorzystać później w UI
W `components/views.tsx`:
- w `TasksPageView` obok leada pokazywać:
  - etap procesu
  - następny ruch
- w `CalendarPageView` na pillach wydarzeń pokazywać:
  - etap procesu
  - następny ruch
- dla wpisów bez leada pokazywać jawnie:
  - `Bez procesu`

## Kryterium zakończenia
Taski i wydarzenia nie są tylko terminami.
Są czytane jako element większego procesu leada.
