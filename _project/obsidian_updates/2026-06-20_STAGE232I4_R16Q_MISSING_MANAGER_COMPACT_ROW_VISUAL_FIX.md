# Obsidian update payload — STAGE232I4_R16Q

Date/time: 2026-06-20 02:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Stage: STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status entry

STAGE232I4_R16Q fixes readability of the shared Braki / Blokady manager introduced by R16O. It is visual-only: each missing item remains a separate stacked card, but card internals use a compact horizontal row on desktop. The add form contrast is repaired so labels/input text are readable.

## Test entry

Required verification:
- R16Q guard
- R16Q node test
- npm run build
- git diff --check
- manual smoke on ClientDetail Braki / Blokady manager

Manual smoke:
1. Open ClientDetail.
2. Open Braki / Blokady manager.
3. Confirm add form text is readable.
4. Confirm each missing item is one horizontal row on desktop: source/priority, title, note/source, blocker checkbox, actions.
5. Confirm items remain stacked one below another.
6. Confirm Uzupełnione and Usuń remain clickable.
7. Confirm LeadDetail still opens the shared manager.

## Risk entry

R16Q does not change persistence. If missing items still reappear after F5, investigate fetch/persist/normalize, not modal layout. If row content feels cramped, tune responsive column widths/buttons in MissingItemsManagerDialog only.

## History entry

2026-06-20 02:05 Europe/Warsaw — prepared STAGE232I4_R16Q visual repair for shared MissingItemsManagerDialog after owner smoke found unreadable add form and vertically split card controls.
