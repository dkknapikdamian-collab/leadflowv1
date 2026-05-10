# CLOSEFLOW FB-5 — Toast placement + danger icon source of truth — 2026-05-09

## Status
FB-5 zamyka dwa elementy UI bez zmiany logiki aplikacji:

1. Toast top-center, żeby Google Calendar / globalny toast nie zasłaniał przycisków w prawym górnym rogu.
2. Danger source of truth dla akcji delete / trash / destructive.

## Zakres

- Toast top-center w `src/App.tsx`.
- `richColors` utrzymane na każdym Toasterze.
- `closeButton` dodany na każdym Toasterze.
- danger source of truth przez `entity-actions` i tokeny `closeflow-action-tokens.css`.
- brak lokalnych czerwonych klas przy delete/trash/destructive.
- brak `bg-primary` i `text-white` na koszu / delete.

## Czego nie zmieniamy

- nie zmieniamy delete logic,
- nie usuwamy toastów,
- nie zmieniamy Google Calendar sync,
- nie zmieniamy logiki aplikacji,
- nie przebudowujemy `ClientDetail.tsx` regexem,
- nie dodajemy `data-fb5-danger-source` do JSX.

## Guardy

- `npm run check:closeflow-fb5-toast-danger-source`
- `npm run check:closeflow-fb5-heavy-ui-guards`
- `npm run check:closeflow-fb5-bulk-ui-contract`
- opcjonalnie istniejące guardy: danger style contract, FB-4 cleanup, finance verify.

## Kryterium zakończenia

Build przechodzi po resecie plików z HEAD, toast jest centralny, a wszystkie akcje destrukcyjne używają source of truth zamiast lokalnego czerwonego Tailwinda albo wyglądu primary CTA.
