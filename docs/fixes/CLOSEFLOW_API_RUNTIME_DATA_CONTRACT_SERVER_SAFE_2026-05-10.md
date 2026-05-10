# CLOSEFLOW API runtime data-contract server-safe repair — 2026-05-10

## Cel

Naprawić runtime 500 w Vercel API po etapach FIN/API/import-boundary, bez zmiany UX i bez cięcia funkcji.

## Diagnoza

Po wdrożeniach frontend build przechodzi, ale runtime Vercel zwraca 500 dla wielu API:
- `/api/leads`
- `/api/cases`
- `/api/clients`
- `/api/system?kind=google-calendar&route=sync-inbound`

To wskazuje na wspólną warstwę server/API, a nie pojedynczy ekran.

Najbardziej ryzykowny wspólny punkt po FIN-1/FIN-2 to `src/lib/data-contract.ts`, używany przez wiele endpointów API.
Wcześniejsze przepięcie finansów do jednego źródła prawdy dodało zależność runtime z `data-contract.ts` do `src/lib/finance/finance-normalize.ts`.

## Zmiana

`src/lib/data-contract.ts` nie importuje już `./finance/finance-normalize.js` w ścieżce serwerowej.

Zamiast tego ma lokalne, server-safe normalizery enumów finansowych:
- `normalizeCommissionMode`
- `normalizeCommissionBase`
- `normalizeCommissionStatus`
- `normalizePaymentType`
- `normalizePaymentStatus`

To zmniejsza ryzyko runtime crashu w Vercel serverless przez łańcuch importów FIN.

## Nie zmieniono

- Nie zmieniono UI.
- Nie zmieniono FIN-5 panelu.
- Nie zmieniono API-0 limitu 12/12.
- Nie zmieniono endpointów publicznych.
- Nie zmieniono modelu DB.

## Guard

`npm run check:closeflow-api-runtime-data-contract-server-safe`

Weryfikuje:
- brak importu `finance-normalize` w `data-contract.ts`,
- obecność lokalnych server-safe normalizerów,
- zachowanie `.js` importów w modułach finance,
- obecność package script.
