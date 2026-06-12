# 2026-06-12 — STAGE231D0F-R6 Funnel UI Dictionary guard repair

Status: READY_TO_APPLY

## Why R6 exists

R5 runtime patch passed. The guard failed only because the UI Dictionary active R5 block did not include:
- `MetricTileIconColorSource`
- `FunnelColorToneMap`

## R6 fix

- Append a dedicated UI Dictionary block containing:
  - `MetricTileIconColorSource`
  - `FunnelColorToneMap`
  - `FunnelRecordsHeaderRow`
- Refresh R6/R5/R4/R3 guards so they combine relevant active blocks instead of checking only the latest block.

## Scope

No funnel logic changes.

Changed:
- guard/test scripts
- UI Dictionary and central `_project` files
- run report
- Obsidian payload

## Risk audit

Do not push unrelated files from:
- STAGE231D0E
- mojibake sweep helpers
- historical R8/R9 guard repairs
