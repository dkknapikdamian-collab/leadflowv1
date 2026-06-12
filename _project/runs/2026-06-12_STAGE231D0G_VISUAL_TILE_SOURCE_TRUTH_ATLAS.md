# 2026-06-12 — STAGE231D0G Visual Tile Source Truth Atlas

Status:
READY_TO_APPLY

## Scan report

Repo files read:
- `AGENTS.md`
- `src/App.tsx`
- `src/pages/SalesFunnel.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Clients.tsx`
- `src/pages/Cases.tsx`
- `src/styles/closeflow-metric-tiles.css`
- `_project/03_CURRENT_STAGE.md`
- `_project/UI_DICTIONARY_STAGE231D0A.md`

Obsidian:
- direct local vault access unavailable in this chat.
- update payload prepared in `_project/obsidian_updates/2026-06-12_STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS.md`.

## FAKTY Z KODU

- `AGENTS.md` requires scan-first and `_project` updates.
- `App.tsx` lists protected routes and lazy page files.
- `SalesFunnel.tsx` includes R13 marker and explicit Funnel owner tile tone map.
- `closeflow-metric-tiles.css` is imported globally from `App.tsx` and is the current metric tile source.
- `Leads.tsx`, `Clients.tsx`, and `Cases.tsx` already use `StatShortcutCard` / operator rail / shared record-list CSS patterns that can be migrated later.

## DECYZJE DAMIANA

- Lejek R13 is VISUAL ACCEPTED / FREEZE AS BASELINE.
- FunnelMetricTileR13 becomes CloseFlowMetricTileV2.
- Do not migrate all pages in one stage.
- Build atlas first, then migrate by waves.

## HIPOTEZY / PROPOZYCJE

- The safest migration order is Wave 1: Leads, Clients, Cases, CaseDetail, ClientDetail.
- Runtime tile migration should happen only after this atlas is committed.

## DO POTWIERDZENIA

- Final entity_id/workspace_id/project_id for Obsidian remain DO_POTWIERDZENIA in this chat.
- Whether to clean historical UI Dictionary duplicate/mojibake blocks in a separate cleanup stage.

## VISUAL TILE ATLAS

Created:
- `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md`
- `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`

## Audyt ryzyk

- Main risk: local page CSS overriding global tile source.
- Guard prevents missing atlas/source truth but does not refactor runtime views.
- Dirty working tree from old packages must not be pushed accidentally.
