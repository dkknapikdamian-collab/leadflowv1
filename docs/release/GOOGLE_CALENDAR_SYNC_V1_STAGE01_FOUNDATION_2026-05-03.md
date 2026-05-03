# Google Calendar Sync V1 - Stage 01 Foundation

## Cel

Przygotowac fundament pod integracje Google Calendar bez obiecywania gotowego syncu w UI.

To nie jest jeszcze pelna funkcja uzytkownika. Ten etap dodaje backend, migracje i guardy, zeby kolejny etap mogl bezpiecznie podpiac automatyczny zapis wydarzen z CloseFlow do Google Calendar.

## Co dodano

- `api/google-calendar.ts`
- `src/server/google-calendar-sync.ts`
- `supabase/migrations/20260503_google_calendar_sync_v1_stage01_foundation.sql`
- `scripts/check-google-calendar-sync-v1-foundation.cjs`
- `npm run check:google-calendar-sync-v1-foundation`

## Endpointy

Endpoint: `/api/google-calendar`

Tryby:

- `GET /api/google-calendar?route=status`
- `POST /api/google-calendar?route=connect`
- `GET /api/google-calendar?route=callback`
- `POST /api/google-calendar?route=disconnect`
- `DELETE /api/google-calendar?route=disconnect`

## Wymagane ENV

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_TOKEN_ENCRYPTION_KEY`
- opcjonalnie `GOOGLE_OAUTH_STATE_SECRET`

Jako awaryjny fallback dla szyfrowania i podpisu state moze dzialac `CRON_SECRET`, ale produkcyjnie lepiej ustawic osobny `GOOGLE_TOKEN_ENCRYPTION_KEY` i `GOOGLE_OAUTH_STATE_SECRET`.

## Zakres V1

V1 ma byc jednokierunkowy:

CloseFlow -> Google Calendar

Nasz kalendarz jest zrodlem prawdy. Google Calendar jest kopia wykonawcza.

## Czego ten etap jeszcze nie robi

- Nie pokazuje przycisku connect w UI.
- Nie aktualizuje jeszcze produktu truth na active.
- Nie odpala automatycznego syncu przy tworzeniu eventu.
- Nie robi dwustronnej synchronizacji Google -> CloseFlow.

## Kryterium zakonczenia

Przechodzi:

- `npm run check:google-calendar-sync-v1-foundation`
- `npm run build`
