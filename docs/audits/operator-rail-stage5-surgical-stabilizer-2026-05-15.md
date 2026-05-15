# Operator rail Stage 5 — surgical stabilizer

Data: 2026-05-15

## Cel

Naprawa stanu po częściowo udanych patchach Stage5: uszkodzone stringi w guardach, brak literalnego `TopValueRecordsCard` w `Clients.tsx` oraz stare guardy nadal pilnujące panelu `stary panel spięcia leadów`.

## Zasada

Nie przywracamy starego panelu. Aktualna prawda produktu to:

- `/clients` ma `Filtry proste` oraz `Najcenniejsi klienci`,
- `/leads` ma `Filtry proste` oraz `Najcenniejsze leady`,
- wspólna warstwa to `src/components/operator-rail/`,
- stare copy `stary panel spięcia leadów` nie wraca.

## Weryfikacja

```powershell
npm.cmd run check:operator-rail-stage5-guard-compat
npm.cmd run check:operator-rail-stage5
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```
