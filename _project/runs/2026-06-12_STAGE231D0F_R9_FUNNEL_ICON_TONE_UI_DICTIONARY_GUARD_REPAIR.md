# 2026-06-12 — STAGE231D0F-R9 Funnel icon tone UI Dictionary guard repair

Status: READY_TO_APPLY

## Why R9 exists

R8 runtime patch passed. The guard failed only on:
`missing UI Dictionary SharedFilterStrip`.

This is a documentation/guard-scope issue, not a runtime issue.

## R9 fix

- Append active UI Dictionary block with:
  - `SharedFilterStrip`
  - `FunnelLayoutFrozen`
  - `FunnelIconToneSourceTruth`
  - `MetricTileIconColorSource`
- Refresh R8 guard so it reads R9/R8/R6/R5/R4 active blocks together.
- Do not change Funnel runtime.

## Tests

- `node --check` for R9/R8 guards
- R9 guard/test
- R8 regression guard/test
- R6 guard if present
- build
- `git diff --check`

## Risk audit

Do not push unrelated:
- STAGE231D0E
- visual-stage12-client-detail-vnext.css
- older R4/R5 sweep helpers
- mojibake repair helpers
