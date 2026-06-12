# 2026-06-12 — STAGE231D0F-R11 Funnel R6 regression guard resolver repair

Status: READY_TO_APPLY

## Why R11 exists

R10/R9/R8 guards and tests passed. The run stopped only on the older R6 regression guard:

- missing `tone: 'blue'`
- missing `tone: 'amber'`
- missing `tone: 'purple'`
- missing `tone: 'red'`
- missing `tone: 'green'`

Those literals are obsolete after R8, because tone source moved to `resolveCloseflowMetricIconTone`.

## R11 fix

- Refresh R6 regression guard/test.
- R6 now accepts resolver-based source of truth:
  - `resolveCloseflowMetricIconTone`
  - semantic tokens
  - `metric-icon-tone-registry.ts`
- No Funnel runtime changes.

## Risk audit

Do not push unrelated:
- STAGE231D0E
- visual-stage12-client-detail-vnext.css
- old R4/R5 artifacts not selected by the push script
- mojibake sweep helpers
