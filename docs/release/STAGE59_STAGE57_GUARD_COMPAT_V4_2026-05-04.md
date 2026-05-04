# STAGE59_STAGE57_GUARD_COMPAT_V4

Data: 2026-05-04
Branch: dev-rollout-freeze

## Cel

Naprawa kompatybilnoĹ›ci guarda Stage57 po dodaniu Stage59.

## Problem

Stage59 zostaĹ‚ wdroĹĽony po Stage58, wiÄ™c poprawny Ĺ‚aĹ„cuch w `verify:case-operational-ui` to:

`check:stage57-case-create-action-hub && npm.cmd run check:stage58-case-recent-moves-panel && npm.cmd run check:stage59-case-note-follow-up-prompt && npm.cmd run verify:client-detail-operational-ui`

Stary guard Stage57 oczekiwaĹ‚ Ĺ‚aĹ„cucha koĹ„czÄ…cego siÄ™ po Stage58, wiÄ™c blokowaĹ‚ poprawny verify mimo przejĹ›cia testu Stage59.

## Zakres

- Zmieniono tylko `scripts/check-stage57-case-create-action-hub.cjs`.
- Nie zmieniono runtime Stage59.
- Nie zmieniono `CaseDetail.tsx`.
- Nie zmieniono modelu danych ani API.

## Kryterium zakoĹ„czenia

- `npm.cmd run test:stage59-case-note-follow-up-prompt` przechodzi.
- `npm.cmd run verify:case-operational-ui` przechodzi.
- `npm.cmd run build` przechodzi.
