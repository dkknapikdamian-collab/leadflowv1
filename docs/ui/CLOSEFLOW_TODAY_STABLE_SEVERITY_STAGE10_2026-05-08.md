# CloseFlow TodayStable severity contract Stage10 — 2026-05-08

## Cel

Etap 10 porządkuje jednoznaczne lokalne kolory ryzyka/statusu w aktywnym ekranie `TodayStable`, bez przebudowy ekranu i bez zmiany logiki danych.

## Co przepięto

- Nagłówki sekcji ryzyka/statusu w `SectionHeader` dostały mostek do `cf-severity-dot` przez `data-cf-severity`.
- Semantyczne badge w wierszach `RowLink` zostały przepięte z lokalnego `cf-semantic-badge-*` na `cf-status-pill` + `data-cf-status-tone`.
- Prawdziwe ryzyko dalej pozostaje czerwone, ale kolor pochodzi z kontraktu `closeflow-alert-severity.css` lub `closeflow-list-row-tokens.css`.

## Liczby z patcha

- Sklasyfikowane lokalne red/rose/amber tokeny przed patchem: 13
- W tym rose/red przed patchem: 7
- W tym amber przed patchem: 6
- Przepięte jednoznaczne miejsca na alert/severity: 5
- Przepięte jednoznaczne miejsca na status/progress: 1
- Pozostałe lokalne red/rose/amber tokeny po patchu: 7
- Pozostałe rose/red po patchu: 5
- Pozostałe amber po patchu: 2

## Co zostawiono jako wyjątek

- `src/pages/Today.tsx` zostaje poza zakresem. Aktywny route używa `TodayStable`.
- Metric tiles nie były ruszane. Ich ton kontroluje osobny kontrakt metryk.
- Delete/trash/danger actions nie były ruszane. Ich ton kontroluje `EntityActionButton` i `closeflow-action-tokens.css`.
- Stare wizualne klasy niezwiązane jednoznacznie z ryzykiem/status/progress zostają do osobnego passu, jeśli pokaże je kolejny audyt.

## Co zostaje na Etap 11

Najlepszy kolejny etap: `NotificationsCenter severity/status pass`, bo tam nadal miesza się status powiadomień, alerty i lokalne kolory CSS.
