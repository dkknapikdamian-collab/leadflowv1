# CloseFlow API Runtime Finance Import Extensions — 2026-05-10

## Cel

Naprawić produkcyjny runtime API po FIN-5, gdzie `/api/leads`, `/api/cases`, `/api/clients` i część `/api/system` mogły zwracać `FUNCTION_INVOCATION_FAILED` mimo zielonego `vite build`.

## Hipoteza techniczna

Vite build sprawdza frontend, ale Vercel Serverless odpala osobne moduły API. Po FIN-1/FIN-2 `src/lib/data-contract.ts` importuje `./finance/finance-normalize.js`. Ten moduł miał wewnętrzne importy bez rozszerzeń:

- `./finance-types`
- `./finance-calculations`

W runtime ESM/Serverless takie importy są bardziej kruche niż repozytoryjny standard `.js` używany już w plikach API/server.

## Zmiana

Zmieniono importy wewnątrz `src/lib/finance/*` na jawne `.js`:

- `./finance-types.js`
- `./finance-calculations.js`

Bez zmian logiki biznesowej, UX i danych.

## Bramki

- `npm run check:closeflow-api-runtime-finance-import-extensions`
- `npm run check:closeflow-api0-vercel-hobby-functions`
- `npm run check:closeflow-case-settlement-panel`
- `npm run check:closeflow-fin5-import-boundaries-final`
- `npx tsc --noEmit --pretty false`
- `npm run build`

## Po wdrożeniu

Sprawdzić produkcyjnie:

- `/api/leads`
- `/api/cases`
- `/api/clients`
- `/api/system?kind=google-calendar&route=sync-inbound`

Jeśli dalej jest 500, potrzebny jest Runtime Log z Vercel, bo wtedy problemem najpewniej jest konfiguracja środowiskowa, np. brak `SUPABASE_SERVICE_ROLE_KEY`.
