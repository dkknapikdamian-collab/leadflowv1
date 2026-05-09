# CloseFlow VS-7 Repair2 — semantic runtime label guard

Data: 2026-05-09  
Branch: `dev-rollout-freeze`

## Cel

Naprawić fałszywie czerwony guard `check:vs7-semantic-metric-tones`, który wymagał literalnych etykiet zgłoszonych w feedbacku w `OperatorMetricToneRuntime.tsx`, mimo że runtime korzystał ze spreadu `CLOSEFLOW_VS7_REPORTED_ADMIN_FEEDBACK_LABELS` z centralnego kontraktu.

## Problem

`check:vs7-semantic-metric-tones` zatrzymał wdrożenie na:

```text
Missing Najbliższe 7 dni in src/components/ui-system/OperatorMetricToneRuntime.tsx
```

To nie był błąd logiki mapowania kolorów, tylko zbyt literalny guard. Runtime działał przez import centralnej listy, ale guard sprawdzał obecność tekstu bezpośrednio w pliku runtime.

## Zmiana

Dodano w runtime lokalny guard listy etykiet:

- `Najbliższe 7 dni`
- `Szkice AI do sprawdzenia`
- `Leady czekające`

oraz dołączono go do `LEGACY_SECTION_LABELS`.

## Nie zmieniaj

- Nie ruszać mapy kolorów.
- Nie zmieniać `OperatorMetricTiles`.
- Nie ruszać CSS VS-7.
- Nie cofać repair1 dla `ClientDetail`.

## Weryfikacja

Po wdrożeniu muszą przejść:

```text
node --test .	ests\client-relation-command-center.test.cjs
npm.cmd run check:vs7-semantic-metric-tones
npm.cmd run verify:closeflow:quiet
npm.cmd run build
```

## Kryterium zakończenia

Repair1 i Repair2 są zacommitowane razem albo w kolejnym commicie repair, `verify:closeflow:quiet` jest zielony, build jest zielony i commit zostaje wypchnięty na `dev-rollout-freeze`.
