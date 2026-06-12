# 2026-06-12 — STAGE231D0F-R2 Funnel color/icon/filter parity

Status: READY_TO_APPLY

## Scan report

Repo files read:
- `AGENTS.md`
- `src/pages/SalesFunnel.tsx`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`
- `src/styles/closeflow-metric-tiles.css`
- `src/pages/Clients.tsx`
- `_project/UI_DICTIONARY_STAGE231D0A.md`

Obsidian/project-memory files read:
- Direct local Obsidian vault not available in this chat.
- User supplied stage contract for `STAGE231D0F-R2 — Funnel color/icon/filter parity`.

## FAKTY Z KODU

- `SalesFunnel.tsx` already has `FunnelOwnerDecisionTile`, `FunnelStageFilterChip`, `FunnelDecisionListCard`.
- Existing owner tiles use `data-eliteflow-metric-tone` and `cf-top-metric-tile-icon`.
- `closeflow-metric-tiles.css` already supports tone variables for `blue`, `amber`, `red`, `green`, `purple`.
- `Clients.tsx` uses `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-status-pill`, `pill`, `data-cf-status-tone`.

## DECYZJE DAMIANA

- Funnel concept stays.
- Funnel is not a kanban.
- Owner tiles need explicit color/icon map.
- Stage filter strip should use the same visual language as Clients filters.
- Do not change funnel filter logic, Supabase, SQL, drag/drop or routes.

## Implementation scope

Runtime:
- `src/pages/SalesFunnel.tsx`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`

Guards/tests:
- `scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- refreshed targeted D0F guard/test

Project memory:
- UI Dictionary and central `_project` files
- run report
- Obsidian payload

## Risk audit

Possible regression:
- Funnel filters visually diverge from Clients again.
- Owner tiles lose semantic color map.
- Funnel accidentally turns into a kanban/drag-drop view.
- Dirty working tree from prior stages may be staged accidentally.

Guard blocks the main R2 class: color/icon/filter parity and scope creep.
