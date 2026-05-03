# Google Calendar Sync V1 - Stage 02 Event Sync Wiring

## Cel

Podpiac backendowy sync wydarzen CloseFlow -> Google Calendar.

To nadal nie jest pelny etap UI. Ten etap robi warstwe wykonawcza po stronie API.

## Zachowanie

Gdy istnieje aktywne polaczenie Google Calendar dla workspace/uzytkownika:

- utworzenie wydarzenia w CloseFlow probuje utworzyc event w Google Calendar,
- edycja wydarzenia w CloseFlow probuje zaktualizowac event w Google Calendar,
- usuniecie wydarzenia w CloseFlow probuje usunac event w Google Calendar.

## Zasada krytyczna

Sync Google Calendar jest non-blocking.

To znaczy:

- zapis eventu w CloseFlow nie moze pasc tylko dlatego, ze Google API ma blad,
- blad Google jest zapisywany w `google_calendar_sync_status = failed`,
- szczegol bledu trafia do `google_calendar_sync_error`,
- sukces zapisuje `google_calendar_event_id`, `google_calendar_synced_at`, `google_calendar_html_link`.

## Czego ten etap nie robi

- Nie pokazuje przycisku laczenia Google w UI.
- Nie aktywuje jeszcze claimu Google Calendar jako gotowego w `product-truth`.
- Nie robi Google -> CloseFlow.
- Nie robi masowego backfillu historycznych eventow.

## Kryterium zakonczenia

Przechodzi:

- `npm run check:google-calendar-sync-v1-foundation`
- `npm run check:google-calendar-sync-v1-event-wiring`
- `npm run check:ui-truth`
- `npm run build`

## Nastepny etap

Google Calendar Sync V1 - Stage 03 Settings UI Connect

Wtedy dodamy panel w ustawieniach, status polaczenia, connect/disconnect i informacje o wymaganych ENV.
