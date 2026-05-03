# Google Calendar Sync V1 - Stage 03b Vercel Hobby Function Budget Hotfix v2

## Problem

Vercel Hobby blokuje deployment, gdy projekt ma wiecej niz 12 Serverless Functions.

Po dodaniu `api/google-calendar.ts` deployment przebil limit.

## Decyzja

Nie usuwamy funkcji Google Calendar.

Przenosimy handler do:

`src/server/google-calendar-handler.ts`

I wystawiamy ten sam publiczny URL przez rewrite:

`/api/google-calendar` -> `/api/system?kind=google-calendar`

## Co jest przepiete

- `api/system.ts` importuje `google-calendar-handler.js`
- `api/system.ts` obsluguje `kind === 'google-calendar'`
- `vercel.json` przekierowuje `/api/google-calendar`
- UI dalej uzywa `/api/google-calendar?...`
- OAuth redirect moze nadal wskazywac `/api/google-calendar?route=callback`
- guard Stage 01 nie szuka juz `api/google-calendar.ts`

## Dlaczego to nie usuwa funkcji

Logika Google Calendar zostaje w kodzie. Usuwamy tylko osobny plik funkcji Vercel, bo ten plik liczyl sie do limitu Hobby.

## Kryterium zakonczenia

Przechodzi:

- `npm run check:vercel-hobby-function-budget`
- `npm run check:google-calendar-sync-v1-foundation`
- `npm run check:google-calendar-sync-v1-event-wiring`
- `npm run check:google-calendar-sync-v1-settings-ui`
- `npm run check:ui-truth`
- `npm run build`

Vercel deployment nie moze juz padac przez limit 12 Serverless Functions.
