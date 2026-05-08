# CloseFlow NotificationsCenter severity contract Stage11 — 2026-05-08

## Cel

Etap 11 porządkuje jednoznaczne lokalne kolory severity/status w `NotificationsCenter`, bez przebudowy ekranu i bez zmiany logiki powiadomień.

## Co przepięto

- Ikona wiersza powiadomienia została przepięta z lokalnego `rowIconClass(...)` na `cf-severity-dot` + `data-cf-severity={notificationRowSeverity(row.status)}`.
- Status wiersza powiadomienia został przepięty z lokalnego `notifications-status-*` na `cf-severity-pill` + `data-cf-severity={notificationRowSeverity(row.status)}`.
- Prawdziwe alerty nadal pozostają czerwone, ale kolor pochodzi z kontraktu `closeflow-alert-severity.css`.

## Liczby

- Sklasyfikowane lokalne miejsca red/rose/amber/status severity w NotificationsCenter: 4
- Przepięte na alert/severity: 2
- Zostawione jako wyjątek: 2

## Co zostawiono jako wyjątek

- Metric tiles `StatShortcutCard` dla „Zaległe” i „Odłożone” zostają poza zakresem, bo ich ton kontroluje osobny metric/icon tone contract.
- Przyciski odkładania `notifications-action-amber` zostają poza zakresem, bo są akcją UI, nie severity/status surface.
- Pozostałe legacy czerwienie z danger audit w `Today.tsx`, `Calendar.tsx`, `Activity.tsx`, `Leads.tsx` i `TasksStable.tsx` są poza zakresem Stage11.

## Co zostaje na Etap 12

Najlepszy kolejny etap: `Calendar / Activity severity pass`, bo po Stage11 to najbliższe małe, izolowane źródła alert/status legacy kolorów.
