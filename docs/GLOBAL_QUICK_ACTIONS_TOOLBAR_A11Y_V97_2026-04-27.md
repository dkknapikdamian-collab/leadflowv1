# V97 — globalny pasek szybkich akcji jako jeden toolbar

## Cel

Domknięcie kierunku: szybkie akcje mają być zawsze w jednym miejscu u góry aplikacji, bez dublowania w osobnych sekcjach stron.

## Zakres

- src/components/GlobalQuickActions.tsx
- src/pages/Today.tsx
- src/pages/ClientDetail.tsx
- tests/global-quick-actions-no-duplicates.test.cjs
- tests/global-quick-actions-toolbar-a11y.test.cjs
- scripts/closeflow-release-check-quiet.cjs

## Zmienione

- GlobalQuickActions dostaje kontrakt GLOBAL_QUICK_ACTIONS_TOOLBAR_A11Y_V97.
- Globalny pasek działa jako role="toolbar" z opisem aria-label="Szybkie akcje aplikacji".
- Today nie ma lokalnych duplikatów Asystenta AI, Szybkiego szkicu ani przycisków dodawania.
- Test pilnuje, żeby podstrony nie importowały i nie renderowały lokalnych kopii globalnych widgetów.

## Nie zmieniać

- Nie usuwać lokalnych akcji, które są inne niż globalny pasek.
- Nie przenosić pracy procesowej klienta z powrotem do kokpitu klienta.
- Nie dotykać logiki AI, płatności ani bazy danych.

## Weryfikacja

```powershell
node tests/global-quick-actions-no-duplicates.test.cjs
node tests/global-quick-actions-toolbar-a11y.test.cjs
node tests/client-relation-command-center.test.cjs
node tests/client-detail-final-operating-model.test.cjs
node tests/relation-funnel-value.test.cjs
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```
