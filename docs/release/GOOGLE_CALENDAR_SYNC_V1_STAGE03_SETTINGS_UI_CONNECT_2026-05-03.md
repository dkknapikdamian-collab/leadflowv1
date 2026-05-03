# Google Calendar Sync V1 - Stage 03 Settings UI Connect

## Cel

Dodac panel Google Calendar w ustawieniach aplikacji.

Ten etap pokazuje uzytkownikowi status integracji i pozwala uruchomic OAuth connect/disconnect, ale nadal nie udaje, ze funkcja jest aktywna bez ENV.

## Co dodano

- panel Google Calendar w `src/pages/Settings.tsx`
- status `/api/google-calendar?route=status`
- connect `/api/google-calendar?route=connect`
- disconnect `/api/google-calendar?route=disconnect`
- guard `scripts/check-google-calendar-sync-v1-settings-ui.cjs`
- komenda `npm run check:google-calendar-sync-v1-settings-ui`

## Zmiana product truth

Google Calendar zmienia status z:

`coming_soon`

na:

`requires_config`

Powod: backend i UI istnieja, ale funkcja wymaga konfiguracji Google OAuth i ENV.

## Wymagane ENV

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_TOKEN_ENCRYPTION_KEY`
- opcjonalnie `GOOGLE_OAUTH_STATE_SECRET`

## Czego ten etap nie robi

- Nie robi jeszcze pelnego smoke testu z prawdziwym kontem Google.
- Nie robi dwustronnej synchronizacji.
- Nie wlacza Google Calendar jako bezwarunkowo aktywnej funkcji w UI/billing copy.

## Kryterium zakonczenia

Przechodzi:

- `npm run check:google-calendar-sync-v1-foundation`
- `npm run check:google-calendar-sync-v1-event-wiring`
- `npm run check:google-calendar-sync-v1-settings-ui`
- `npm run check:ui-truth`
- `npm run build`

## Nastepny etap

Google Calendar Sync V1 - Stage 04 OAuth ENV setup and manual smoke

Wtedy trzeba ustawic Google Cloud OAuth, Vercel ENV i wykonac realny test: connect -> create event -> Google Calendar.
