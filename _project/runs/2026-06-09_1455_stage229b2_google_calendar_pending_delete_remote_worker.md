# Stage229B2 - adaptive Google Calendar pending delete remote worker

- data i godzina: 2026-06-09 14:55 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: Google Calendar remote delete repair / adaptive runner repair
- status: prepared by ZIP runner

## Powod

Stage229B padl na zbyt sztywnym needle w api/work-items.ts dla googleEventIdFrom. Stage229B2 uzywa parsera nawiasow funkcji i anchorow semantycznych zamiast dokladnego formatowania.

## Zakres

- google-calendar-outbound przetwarza pending_delete / hidden/closed rows z google_calendar_event_id przez deleteGoogleCalendarEvent.
- api/work-items natychmiast wykonuje remote delete po update/delete gdy row staje sie hidden/closed/deleted.
- po remote delete lokalny rekord dostaje google_calendar_event_id=null i google_calendar_sync_status=deleted.

## Audyt ryzyk po etapie

- Ryzyko: pending_delete wymaga uruchomienia outbound sync po deployu, jezeli rekordy byly oznaczone przed Stage229B2.
- Ryzyko: Google 404/410 jest traktowane jako sukces, bo event juz nie istnieje.
- Ryzyko: brak aktywnego Google connection pozostawi rekord w pending/failed do ponownego syncu.
