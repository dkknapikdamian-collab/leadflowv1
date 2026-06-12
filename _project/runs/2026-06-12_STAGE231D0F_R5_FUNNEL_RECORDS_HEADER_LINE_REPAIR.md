# 2026-06-12 — STAGE231D0F-R5 Funnel records header line repair

Status: READY_TO_APPLY

## Why R5 exists

R4 still stopped on:
`Old header token still present: <p className="text-xs font-black uppercase tracking`.

Cause:
- the local `SalesFunnel.tsx` has a variant of the old records header that the R4 regex did not catch.

## R5 fix

- Do not try to match the whole JSX block.
- Remove exact old records-header lines:
  - the visibleLabel paragraph,
  - the old h2 title,
  - the old text counter.
- Require the new `FunnelRecordsHeaderRow`.

## Scope

Runtime:
- `src/pages/SalesFunnel.tsx`
- `src/styles/closeflow-metric-tiles.css`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`

Guard/test:
- R5 guard/test
- refreshed R4/R3 guards/tests

Project memory:
- central `_project` files
- run report
- Obsidian payload

## Risk audit

The local tree is dirty from earlier failed packages. Do not push unrelated:
- STAGE231D0E
- mojibake sweep helpers
- historical R8/R9 guard repairs
