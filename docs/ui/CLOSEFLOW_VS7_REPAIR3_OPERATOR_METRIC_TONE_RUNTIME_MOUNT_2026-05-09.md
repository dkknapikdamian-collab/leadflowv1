# CLOSEFLOW VS-7 Repair3 — mount semantic metric tone runtime

Data: 2026-05-09
Branch: `dev-rollout-freeze`

## Problem

`check:vs7-semantic-metric-tones` wymaga obecności `OperatorMetricToneRuntime` w `src/components/Layout.tsx`, ale poprzednia paczka VS-7 nie zamontowała runtime w globalnym layoucie.

Efekt:

```text
Error: Missing OperatorMetricToneRuntime in src/components/Layout.tsx
```

## Cel

Dopiąć runtime semantycznych tonów globalnie w `Layout.tsx`, żeby legacy karty i sekcje, które nie przechodzą jeszcze przez `OperatorMetricTiles`, były naprawiane z jednego źródła prawdy.

## Zmieniane pliki

- `src/components/Layout.tsx`
- `tools/vs7/apply-vs7-repair3-mount-semantic-tone-runtime.cjs`
- `docs/ui/CLOSEFLOW_VS7_REPAIR3_OPERATOR_METRIC_TONE_RUNTIME_MOUNT_2026-05-09.md`

## Nie zmieniać

- mapy kolorów VS-7,
- CSS tonów,
- logiki ekranów,
- danych,
- routingu,
- billing/access.

## Weryfikacja

Wymagane komendy:

```powershell
node --test .	ests\client-relation-command-center.test.cjs
npm.cmd run check:vs7-semantic-metric-tones
npm.cmd run verify:closeflow:quiet
npm.cmd run build
```

## Kryterium zakończenia

- `Layout.tsx` importuje `OperatorMetricToneRuntime`.
- `Layout.tsx` renderuje `<OperatorMetricToneRuntime />` dokładnie raz.
- `check:vs7-semantic-metric-tones` przechodzi.
- `verify:closeflow:quiet` przechodzi.
- build produkcyjny przechodzi.
