# CloseFlow — Google Calendar Stage12B: runtime import hotfix

## Problem

W Stage12 przycisk synchronizacji ręcznej w Ustawieniach mógł rzucać błąd:

```text
syncGoogleCalendarOutboundInSupabase is not a function
```

Przyczyną był błędny import helpera z `react` zamiast stabilnego wywołania endpointu albo importu z warstwy API.

## Naprawa

- `Settings.tsx` nie importuje już `syncGoogleCalendarOutboundInSupabase` z React.
- Kliknięcie `Synchronizuj teraz z Google Calendar` robi bezpośredni `fetch('/api/google-calendar?route=sync-outbound')`.
- Dodany guard: `npm run check:google-calendar-stage12b-runtime-import-hotfix`.

## Test ręczny

1. Otwórz Ustawienia.
2. Przejdź do Google Calendar.
3. Kliknij `Synchronizuj teraz z Google Calendar`.
4. Oczekiwane: brak błędu JS `is not a function`, pojawia się raport synchronizacji albo czytelny komunikat z endpointu.
