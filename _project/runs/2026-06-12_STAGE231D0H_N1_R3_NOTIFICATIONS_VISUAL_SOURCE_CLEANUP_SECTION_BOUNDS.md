# 2026-06-12 — STAGE231D0H-N1-R3 Notifications visual source cleanup section bounds

Status:
READY_TO_APPLY

## Scan report

Repo files read:
- `src/pages/NotificationsCenter.tsx`
- `src/styles/visual-stage10-notifications-vnext.css`
- `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`
- `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md`

## FAKTY Z KODU

- Real conflict placeholder block is:
  - `data-notification-rail-card="conflicts"`
  - title `Ostrzeżenia o konfliktach terminów`
  - text `Gdy terminy będą się nakładać, alert pojawi się tutaj.`
- It sits between right rail actions and upcoming cards.
- R2 failed because full block regex did not remove that section in the local file.

## WHY R3

R3 removes conflict card by locating the conflict marker, its previous `<section`, and the next upcoming/right-card section.

## Scope

No data logic, filter logic, localStorage, Supabase, SQL or routing changes.

## Manual QA

- `/notifications`
- top metric tiles look like CloseFlowMetricTileV2/Funnel
- conflict placeholder card removed
- last refresh on right side
- row icons are small icon boxes, not blobs

## Risk audit

- Existing CSS may still contain deprecated class names for historical compatibility. Guard forbids them in active JSX.
- Visual QA required before push.
