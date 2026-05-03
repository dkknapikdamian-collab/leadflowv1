# Google Calendar Sync V1 - Scope

## Decyzja produktowa

Wdraza sie jednokierunkowy sync:

CloseFlow -> Google Calendar

Nie wdrazamy na start dwustronnego syncu, bo to generuje konflikty, duplikaty, usuniecia z dwoch stron i trudny support.

## Docelowe zachowanie V1

1. Uzytkownik laczy konto Google w ustawieniach.
2. Tworzy wydarzenie w CloseFlow.
3. Backend tworzy odpowiadajace wydarzenie w Google Calendar.
4. CloseFlow zapisuje `google_calendar_event_id`.
5. Edycja wydarzenia w CloseFlow aktualizuje event w Google.
6. Usuniecie wydarzenia w CloseFlow usuwa albo anuluje event w Google.
7. Przypomnienia sa mapowane do Google Calendar reminders:
   - `popup`
   - `email`
   - `useDefault`
   - maksymalnie 5 override reminders
   - zakres minut: 0-40320

## Plany

Funkcja ma byc dostepna w kazdym planie platnym.

Free/trial moze widziec status informacyjny, ale bez aktywnego syncu.

## Wazne ograniczenia

- Google Calendar API nie generuje kosztu za eventy, ale ma limity quota.
- Sa limity projektu Google Cloud oraz limity per uzytkownik.
- Publiczna aplikacja moze wymagac OAuth verification.
- Trzeba miec polityke prywatnosci i poprawnie ustawiony consent screen.
- Tokeny OAuth musza byc trzymane po stronie backendu i szyfrowane.
