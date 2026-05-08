# CloseFlow Calendar / Activity severity contract Stage12 — 2026-05-08

## Cel

Etap 12 porządkuje jednoznaczne lokalne kolory alert/status w `Calendar` i `Activity`, bez przebudowy ekranów i bez zmiany logiki ładowania, filtrowania, tworzenia, edycji, usuwania ani synchronizacji.

## Klasyfikacja

### Calendar

- Sklasyfikowane lokalne miejsca red/rose/amber: 2
- `overdue` w statusie wpisu kalendarza: prawdziwy alert / zaległość
- typ wpisu `Lead` w pigułce typu: rozróżnienie encji, nie alert

### Activity

- Sklasyfikowane lokalne miejsca red/rose/amber: 4
- ikona wiersza `requiresAttention(...)`: prawdziwy alert / wymaga uwagi
- pigułka `Wymaga uwagi`: prawdziwy alert / wymaga uwagi
- typ aktywności `task`: rozróżnienie encji, nie alert
- kafel metryczny `Wymaga uwagi`: metric tile, nie row alert/status

## Co przepięto

- Calendar: status `overdue` używa `cf-severity-pill` + `data-cf-severity="error"`.
- Calendar: pozostałe statusy wpisów używają `cf-status-pill` + `data-cf-status-tone`.
- Activity: ikona wiersza wymagającego uwagi używa `cf-severity-dot` + `data-cf-severity="warning"`.
- Activity: pigułka `Wymaga uwagi` używa `cf-severity-pill` + `data-cf-severity="warning"`.

## Liczby

- Calendar red/rose/amber sklasyfikowane: 2
- Activity red/rose/amber sklasyfikowane: 4
- Przepięte na alert/severity: 3
- Przepięte na status/progress: 1

## Wyjątki

- Calendar `getCalendarEntryTypeClass(...)` zostaje lokalnym typem encji, bo kolor `Lead` rozróżnia typ wpisu, nie alert/status.
- Activity `activity-row-icon-amber` zostaje lokalnym typem encji dla zadań, bo to nie jest alert/status.
- Activity metric tile `Wymaga uwagi` zostaje w `StatShortcutCard`, bo ton metryk kontroluje osobny metric/icon tone contract.

## Co zostaje na Etap 13

Etap 13 powinien objąć `Leads` + `TasksStable` jako mały pass status/progress. `Today` i `TodayStable` zostawić na osobny etap, bo mają dużo legacy alert/status powierzchni i większe ryzyko regresji.
