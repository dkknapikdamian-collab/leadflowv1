# STAGE61_CHECK_REGEX_HOTFIX_2026-05-04

Marker: STAGE61_CASE_NOTE_ACTION_BUTTON_SWAP

## Cel
Naprawa guarda Stage61 po awarii parsera Node na regex literal w `scripts/check-stage61-case-note-action-button-swap.cjs`.

## Zakres
- przepisano Stage61 check bez regex literal,
- przepisano Stage61 test bez regex literal,
- nie zmieniono logiki runtime,
- nie zmieniono UI poza wcześniejszym Stage61.

## Kryterium
- `npm.cmd run check:stage61-case-note-action-button-swap` przechodzi,
- `npm.cmd run test:stage61-case-note-action-button-swap` przechodzi,
- `npm.cmd run verify:case-operational-ui` przechodzi,
- `npm.cmd run build` przechodzi.
