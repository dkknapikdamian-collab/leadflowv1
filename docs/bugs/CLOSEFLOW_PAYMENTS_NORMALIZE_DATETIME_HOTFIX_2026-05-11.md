# CLOSEFLOW_PAYMENTS_NORMALIZE_DATETIME_HOTFIX_2026-05-11

## Cel

Naprawić produkcyjny błąd 500 w endpointach zależnych od płatności i spraw.

## Realny objaw

Vercel / TypeScript zgłaszał:

```text
api/payments.ts: Module "../src/lib/finance/finance-normalize.js" has no exported member "normalizeDateTime"
```

Po tym padały między innymi:
- `/api/payments`
- `/api/payments?leadId=...`
- `/api/payments?clientId=...`
- widoki leada, klienta, spraw i kalendarza zależne od tych danych.

## Przyczyna

`api/payments.ts` importował `normalizeDateTime`, ale `src/lib/finance/finance-normalize.ts` eksportował tylko `normalizeFinanceDate`.

## Zmiana

Dodano eksport:

```ts
export function normalizeDateTime(value: unknown): string | null
```

Funkcja zwraca ISO string albo `null`, opierając się na istniejącym `normalizeFinanceDate`.

## Nie zmieniono

- struktury tabel,
- modelu płatności,
- relacji lead/client/case,
- UI,
- endpointów poza kompatybilnością eksportu.

## Check

Dodano:

```json
"check:closeflow-payments-normalize-datetime-hotfix": "node scripts/check-closeflow-payments-normalize-datetime-hotfix.cjs"
```

