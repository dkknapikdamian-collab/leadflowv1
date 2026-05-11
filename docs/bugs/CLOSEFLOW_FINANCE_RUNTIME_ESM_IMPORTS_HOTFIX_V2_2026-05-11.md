# CLOSEFLOW FINANCE RUNTIME ESM IMPORTS HOTFIX V2 2026-05-11

## Problem

Produkcja Vercel zwraca `500 FUNCTION_INVOCATION_FAILED` dla `/api/cases` i `/api/payments`.

Runtime log:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/src/lib/finance/finance-types'
imported from /var/task/src/lib/finance/finance-normalize.js
```

## Przyczyna

Serverless Node ESM na Vercel wymaga rozszerzeń `.js` w runtime importach. Lokalny Vite build przechodzi, bo bundler toleruje importy bez rozszerzenia.

Ryzykowne importy:

- `src/lib/finance/finance-normalize.ts`
  - `from './finance-types'`
- `src/lib/finance/finance-calculations.ts`
  - `from './finance-types'`
  - `from './finance-normalize'`

## Naprawa

Zmieniamy importy wewnątrz `src/lib/finance/*.ts` na format runtime-safe:

- `from './finance-types.js'`
- `from './finance-normalize.js'`
- analogicznie dla innych lokalnych `finance-*`, jeśli wystąpią.

## Zakres

Nie zmieniamy logiki finansów, modelu danych, API kontraktów ani UI.
To jest wyłącznie hotfix zgodności runtime ESM dla Vercel.
