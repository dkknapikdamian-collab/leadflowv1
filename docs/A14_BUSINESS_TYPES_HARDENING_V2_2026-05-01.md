# A14 — Business DTO types hardening v2

## Cel

Utwardzić typy głównych danych biznesowych bez włączania pełnego `strict: true` i bez refaktoru UI.

## Zakres

- Dodano `src/lib/domain-statuses.ts` z typami statusów domenowych.
- Reeksportowano `BillingStatus` i `AccessState` przez `src/lib/data-contract.ts`.
- Usunięto luźne `any` z głównych plików danych biznesowych:
  - `src/lib/supabase-fallback.ts`,
  - `src/lib/scheduling.ts`,
  - `src/lib/lead-health.ts`,
  - `src/server/_access-gate.ts`.
- Dodano guard `scripts/check-a14-business-types.cjs`.

## Nie zmieniono

- Nie włączono `strict: true`.
- Nie ruszano UI.
- Nie zmieniano logiki zapisów i odczytów poza typami wejścia/wyjścia.

## Sprawdzenie

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run check:a14-business-types
npm.cmd run test:critical
npm.cmd run lint
npm.cmd run build
```
