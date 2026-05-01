# A14 — business type hardening v4

## Cel

Utwardzić typy danych biznesowych bez włączania pełnego `strict: true` i bez refaktoru UI.

## Zakres

- Dodano `src/lib/domain-statuses.ts`.
- Ustabilizowano typy `BillingStatus` i `AccessState`.
- Utrzymano DTO w `src/lib/data-contract.ts`:
  - `LeadDto`,
  - `TaskDto`,
  - `EventDto`,
  - `CaseDto`,
  - `ClientDto`,
  - `ActivityDto`,
  - `AiDraftDto`.
- Usunięto biznesowe `any` z:
  - `src/lib/scheduling.ts`,
  - `src/lib/lead-health.ts`,
  - `src/lib/supabase-fallback.ts` dla case template items,
  - `src/server/_access-gate.ts`.
- Dodano `scripts/check-a14-business-types.cjs`.
- Dodano skrypt `check:a14-business-types`.

## Nie zmieniono

- UI.
- Routingu.
- Źródła danych.
- `strict: true`.

## Sprawdzenie

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run check:a14-business-types
npm.cmd run test:critical
npm.cmd run lint
npm.cmd run build
```
