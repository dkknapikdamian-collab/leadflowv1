# 2026-06-12 — STAGE231D0F-R4 Funnel owner dashboard targeted guard repair

Status: READY_TO_APPLY

## Why R4 exists

R3 proved that a broad `_project` mojibake sweep is the wrong scope for the Funnel visual stage.
It started reporting old historical entries unrelated to STAGE231D0F and guard scripts flagged their own mojibake token literals.

## R4 scope

R4 narrows the repair to:
- `src/pages/SalesFunnel.tsx`
- `src/pages/CaseDetail.tsx`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`
- active STAGE231D0F UI Dictionary block
- active STAGE231D0F run and Obsidian payload
- stage guard/test scripts

## Verification

- STAGE231D0F guard
- STAGE231D0F test
- CaseDetail R4 regression guard
- build
- `git diff --check`

## Risk audit

Historical `_project` mojibake is not fixed in this stage. If needed, create a separate encoding cleanup stage. Do not mix it with Funnel UI alignment.
