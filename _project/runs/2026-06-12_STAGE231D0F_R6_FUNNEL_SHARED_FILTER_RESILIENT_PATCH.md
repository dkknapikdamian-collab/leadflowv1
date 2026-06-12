# 2026-06-12 — STAGE231D0F-R6 Funnel shared filter resilient patch

Status: READY_TO_APPLY

## Why R6 exists

R5 failed because it did not add:
`data-stage231d0f-r5-stage-filter-no-visible-money`.

The real `SalesFunnel.tsx` has a stable `FunnelStageFilterChip` function with:
- `data-stage231d0f-r2-filter-tone={tone}`
- visible `cf-funnel-stage-filter-chip-value`

R6 patches the function block directly instead of matching the whole button.

## Scope

Runtime:
- `src/pages/SalesFunnel.tsx`
- `src/pages/Clients.tsx`
- `src/styles/closeflow-metric-tiles.css`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`
- `src/styles/closeflow-record-list-source-truth.css`

Guard/test:
- R6 guard/test

Project memory:
- central `_project` files
- run report
- Obsidian payload

## Risk audit

Do not push unrelated:
- STAGE231D0E
- mojibake sweep helpers
- historical R8/R9 guard repairs
