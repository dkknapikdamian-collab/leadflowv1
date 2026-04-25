# Request scope server helper fix

Data: 2026-04-25

## Problem

Po przeniesieniu helperow poza katalog api Vercel build przechodzil limit funkcji, ale API routes importowaly:

../src/server/_request-scope.js

a plik src/server/_request-scope.ts nie istnial. To powodowalo bledy TypeScript na Vercel i pozniej FUNCTION_INVOCATION_FAILED przy odczycie planu dnia.

## Poprawka

Dodano src/server/_request-scope.ts z eksportami:

- asText
- getRequestIdentity
- resolveRequestWorkspaceId
- withWorkspaceFilter
- fetchSingleScopedRow
- requireScopedRow

Dodano test zabezpieczajacy, zeby helper byl poza api i zeby trasy API importowaly go z src/server.

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi
- Vercel nie pokazuje TS2307 dla _request-scope
- odczyt planu dnia nie wywala FUNCTION_INVOCATION_FAILED przez brak modulu
