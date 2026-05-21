# 2026-05-20 - Stage125B Google Calendar auth bridge local-only

## Status

LOCAL-ONLY ZIP PATCH PREPARED.

## Projekt

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- public app: https://closeflowapp.vercel.app
- nowy Supabase: amrxiaetdocrywnnkoct

## Problem

Runtime test potwierdzil:

- tokenFound: true
- GET /api/google-calendar?route=status -> 401
- response: {"error":"GOOGLE_CALENDAR_USER_REQUIRED"}

To oznacza, ze po przepieciu na nowy Supabase Google Calendar status nie dochodzi do prawdziwej diagnostyki ENV. Handler nadal wymaga legacy `x-user-id`, a Settings nie wysyla Bearer tokena w requestach Google Calendar.

## Zakres patcha

### src/pages/Settings.tsx

- Dodano import `getSupabaseAccessToken` z `../lib/supabase-auth`.
- Dodano helper `buildGoogleCalendarRequestHeaders()`.
- Requesty do `/api/google-calendar` dostaja:
  - `Authorization: Bearer <Supabase access token>` jesli token istnieje,
  - `x-workspace-id`,
  - `x-user-id`,
  - `x-user-email` jako legacy/fallback.

### src/server/google-calendar-handler.ts

- Dodano `requireRequestIdentity`.
- `userId` jest brany z potwierdzonego Supabase request identity.
- Legacy `x-user-id` zostaje tylko fallbackiem.
- `userEmail` jest brany z request identity albo legacy headera.

### tests/stage125b-google-calendar-auth-bridge.test.cjs

Guard sprawdza, ze Settings i handler utrzymuja kontrakt auth bridge.

## Testy automatyczne

Uruchomic lokalnie:

```powershell
node tests/stage125b-google-calendar-auth-bridge.test.cjs
npm run build
```

## Test reczny po deployu

1. Wejsc w `/settings`.
2. Sekcja Google Calendar nie powinna juz pokazywac `STATUS_CHECK_FAILED` przez brak user context.
3. Console status z Bearer tokenem powinien zwrocic 200 z `configured`, `missing`, `connected` albo prawdziwe braki ENV.
4. Nie moze zwrocic 401 `GOOGLE_CALENDAR_USER_REQUIRED`.

## Czego nie ruszano

- Nie zmieniano Vercel ENV.
- Nie zmieniano Google Cloud.
- Nie zmieniano Supabase schema.
- Nie ruszano Calendar render.
- Nie importowano leadow.

## Następny krok

Po wdrozeniu Stage125B sprawdzic prawdziwy status Google Calendar i dopiero wtedy uzupelnic ENV albo OAuth callbacki.
