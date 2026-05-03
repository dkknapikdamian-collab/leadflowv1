# CloseFlow — Google Calendar Stage12: synchronizacja ręczna istniejących wpisów

## Cel

Ten pakiet dodaje brakujący etap utwardzenia Google Calendar:

- ręczną synchronizację istniejących zadań i wydarzeń z CloseFlow do Google Calendar,
- raport synchronizacji: scanned / created / updated / skipped / failed,
- endpoint `POST /api/google-calendar?route=sync-outbound`,
- pomocniczy klient `syncGoogleCalendarOutboundInSupabase`,
- przycisk w Ustawieniach: `Synchronizuj teraz z Google Calendar`,
- guard: `npm run check:google-calendar-stage12-outbound-backfill`.

## Dlaczego

Dotychczas synchronizacja działała głównie przy tworzeniu, edycji albo usunięciu rekordu. Po świeżym podłączeniu Google istniejące rekordy mogły zostać w CloseFlow bez odpowiadającego wpisu w Google Calendar. Ten etap dodaje bezpieczną ręczną synchronizację i widoczny raport.

## Nie zmienia

- CloseFlow nadal jest źródłem prawdy.
- Nie kasuje danych w CloseFlow po rozłączeniu Google.
- Nie dodaje Google Contacts ani zapraszania gości.
- Nie zmienia planów/cennika.

## Weryfikacja po wdrożeniu

1. Połącz Google Calendar w Ustawieniach.
2. Dodaj zadanie i wydarzenie w CloseFlow.
3. Wejdź w Ustawienia → Google Calendar → kliknij `Synchronizuj teraz z Google Calendar`.
4. Sprawdź raport na ekranie.
5. Otwórz Google Calendar i sprawdź, czy wpisy są widoczne.
6. Zmień godzinę wydarzenia w CloseFlow, kliknij sync ponownie, sprawdź aktualizację w Google.
