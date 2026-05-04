# STAGE60_STAGE59_GUARD_COMPAT_HOTFIX

## Cel

Naprawa kompatybilnosci guarda Stage59 po wdrozeniu Stage60.

## Problem

Stage60 dodal nowy check do `verify:case-operational-ui`, ale `scripts/check-stage59-case-note-follow-up-prompt.cjs` nadal oczekiwal starego lancucha:

`check:stage58-case-recent-moves-panel && npm.cmd run check:stage59-case-note-follow-up-prompt && npm.cmd run verify:client-detail-operational-ui`

Po Stage60 poprawny lancuch to:

`check:stage58-case-recent-moves-panel && npm.cmd run check:stage59-case-note-follow-up-prompt && npm.cmd run check:stage60-case-action-copy-note-dedupe && npm.cmd run verify:client-detail-operational-ui`

## Zakres

- Zmieniono tylko guard Stage59.
- Nie zmieniono runtime, UI ani logiki Stage60.
- Stage60 cleanup pozostaje bez zmian.

## Kryterium zakonczenia

- `npm.cmd run check:stage59-case-note-follow-up-prompt` przechodzi.
- `npm.cmd run verify:case-operational-ui` przechodzi.
- `npm.cmd run build` przechodzi.
