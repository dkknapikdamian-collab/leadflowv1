# STAGE16Y - A13 AI draft status marker repair

Cel: zamknąć ostatni czerwony `test:critical` / A13 bez zmiany runtime logiki AI drafts.

## Problem

A13 sprawdza stary statyczny kontrakt:

```text
status: 'draft'
```

Po nowszych etapach runtime draft flow używa aktualnego modelu szkiców i A13 nie znajdował już starego markera.

## Zakres naprawy

- Dodano tylko statyczny marker kompatybilności w `src/lib/ai-drafts.ts`.
- Nie zmieniono statusów runtime.
- Nie zmieniono potwierdzania szkiców.
- Nie zmieniono AI, billing, workspace ani PWA.

## Weryfikacja

Skrypt uruchamia:

- `npm.cmd run build`
- `node scripts/check-a13-critical-regressions.cjs`
- `node --test tests/a13-critical-regressions.test.cjs`
- `npm.cmd run test:critical`
- `npm.cmd run verify:closeflow:quiet`
- opcjonalnie `npm.cmd run check:stage16p:focused`, jeśli istnieje

## Git

Bez commita i bez pusha.
