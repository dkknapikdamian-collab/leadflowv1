# A20b - API runtime import hotfix

## Cel

Naprawic produkcyjny blad 500 / FUNCTION_INVOCATION_FAILED po A20.

## Przyczyna

`src/lib/data-contract.ts` jest uzywany przez API po stronie serwera. Po A20 importowal `./domain-statuses` bez rozszerzenia `.js`. W runtime Vercel/Node ESM taki import moze wysypac funkcje API przed wykonaniem handlera. Skutek: `api/leads`, `api/cases` i `api/clients` zwracaja 500 naraz.

## Zmiana

- `src/lib/data-contract.ts` importuje `./domain-statuses.js`.
- Dodano guard `check:a20-runtime-imports`.

## Nie zmieniano

- Statusow domenowych.
- Migracji Supabase.
- Logiki leadow, klientow, spraw i notatek.
- Sidebaru.

## Reczne sprawdzenie

1. Po deployu odswiez aplikacje.
2. Sprawdz, czy `/api/leads`, `/api/cases` i `/api/clients` nie zwracaja juz 500.
3. Sprawdz ekran Dzis, Leady, Klienci i Sprawy.