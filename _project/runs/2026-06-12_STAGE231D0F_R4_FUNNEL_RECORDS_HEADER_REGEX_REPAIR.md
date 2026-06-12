# 2026-06-12 — STAGE231D0F-R4 Funnel records header regex repair

Status: READY_TO_APPLY

## Why R4 exists

The R3 patch applied but the R3 guard found an old two-line records header token:
`<p className="text-xs font-black uppercase tracking...">`.

Cause:
- R3 patcher searched for one exact old header block.
- The local `SalesFunnel.tsx` had a variant of the old header.

## R4 fix

- Regex-repairs old records header variants in `SalesFunnel.tsx`.
- Requires `data-stage231d0f-r4-records-header-regex-repair`.
- Keeps icon color source truth from R3.
- Refreshes R3 guard/test so it validates the repaired state.

## Scope

Runtime:
- `src/pages/SalesFunnel.tsx`
- `src/styles/closeflow-metric-tiles.css`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`

Guard/test:
- `scripts/check-stage231d0f-r4-funnel-records-header-regex-repair.cjs`
- `tests/stage231d0f-r4-funnel-records-header-regex-repair.test.cjs`
- refreshed R3 guard/test

Project memory:
- central `_project` files
- run report
- Obsidian payload

## Risk audit

Do not push unrelated files from:
- STAGE231D0E
- previous mojibake sweep attempts
- R8/R9 historical guard repairs

Push remains selective.
