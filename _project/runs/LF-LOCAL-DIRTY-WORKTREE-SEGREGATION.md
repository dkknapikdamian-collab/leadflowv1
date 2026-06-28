# LF-LOCAL-DIRTY-WORKTREE-SEGREGATION

Date: 2026-06-28 02:45 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Status

AUDIT_RECORDED / NO_LOCAL_CHANGES_TOUCHED_BY_AI / NO_DISCARD / NO_STASH_YET / NEEDS_DIFF_INSPECTION

## Goal

Separate local dirty workspace from closed LF-UI-SOT-002R2.

## Local result from Damian

- branch: dev-rollout-freeze tracking origin/dev-rollout-freeze
- dirty files: 18 modified files
- guard:ui:patch-layers: already PASS in previous R2 verify
- tests/ui-patch-layers-guard: already PASS in previous R2 verify
- guard:routes:canonical: PASS
- build: PASS
- verify:closeflow:quiet: RED because CF-RUNTIME-00 reports unrelated dirty files

## CF-RUNTIME-00 blocker files

| File | Verdict | Bucket |
|---|---|---|
| scripts/check-a24-lead-to-case-flow.cjs | D | A24 lead-to-case flow |
| scripts/check-fin15-lead-finance-ghosts.cjs | D | FIN15 lead finance ghosts |
| src/lib/cases.ts | D | case/lead service behavior |
| src/lib/options.ts | D | options/config baseline |
| tests/fin15-lead-finance-ghosts.test.cjs | D | FIN15 lead finance ghosts |
| tests/lead-service-mode-v1.test.cjs | D | lead service mode |
| tests/lead-start-service-case-redirect.test.cjs | D | lead-to-case redirect |

D = finish as separate stage or stash after decision. Do not push with LF-UI-SOT-002R2.

## Other dirty files

| File | Verdict | Bucket |
|---|---|---|
| scripts/check-cf-runtime-00-source-truth.cjs | D | CF-RUNTIME-00 guard maintenance |
| scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs | D | STAGE232I3 owner control |
| tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs | D | STAGE232I3 owner control |
| scripts/check-stage232t-r1c-today-production-ui-cleanup-and-source-truth.cjs | D | STAGE232T Today cleanup |
| tests/stage232t-r1c-today-production-ui-cleanup-and-source-truth.test.cjs | D | STAGE232T Today cleanup |
| scripts/check-stage233a-route-canonicalization.cjs | D | STAGE233A route canonicalization |
| tests/stage233a-route-canonicalization.test.cjs | D | STAGE233A route canonicalization |
| src/pages/TodayStable.tsx | D | Today UI/source truth |
| src/styles/closeflow-canvas-runtime-source-truth-stage211j.css | D | Today/canvas source truth |
| src/styles/work-item-card.css | D | work item card source truth |
| tests/stage116-today-work-item-card-source-truth.test.cjs | D | STAGE116 work item card |

## Decision

No dirty file is approved for discard from the current log alone.
No dirty file belongs to LF-UI-SOT-002R2.
Do not continue to LF-UI-SOT-003 until this workspace is clean or intentionally stashed.

## Next safe stage

LF-LOCAL-DIRTY-WORKTREE-SEGREGATION continues with exact diff inspection per bucket.
