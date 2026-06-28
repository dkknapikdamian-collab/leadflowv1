# LF-LOCAL-DIRTY-WORKTREE-SEGREGATION

Date: 2026-06-28 03:00 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Status

PARTIAL_DIFF_INSPECTION_RECORDED / NO_LOCAL_CHANGES_TOUCHED_BY_AI / NO_DISCARD / NO_STASH_YET / DO_NOT_CONTINUE_TO_LF_UI_SOT_003_YET

## Goal

Separate local dirty workspace from closed LF-UI-SOT-002R2.

## Local result from Damian

- branch: dev-rollout-freeze tracking origin/dev-rollout-freeze
- dirty files: 18 modified files
- guard:ui:patch-layers: PASS in R2 verify
- tests/ui-patch-layers-guard: PASS in R2 verify
- guard:routes:canonical: PASS
- build: PASS
- verify:closeflow:quiet: RED because CF-RUNTIME-00 reports unrelated dirty files

## Diff inspection recorded from Damian paste

### A24 / lead-to-case route helper

Files:

```txt
scripts/check-a24-lead-to-case-flow.cjs
tests/lead-service-mode-v1.test.cjs
tests/lead-start-service-case-redirect.test.cjs
src/lib/cases.ts
```

Observed diff:

- `scripts/check-a24-lead-to-case-flow.cjs` changes expected route evidence from manual `/case/${...}` literal to `caseDetailPath(startServiceSuccess.caseId)`.
- `src/lib/cases.ts` starts moving closed case status source from local hardcoded array to `./config/case-status`.

Verdict:

```txt
D / separate stage to finish: A24 lead-to-case + route helper contract
D / src/lib/cases.ts also overlaps with LF-UI-SOT-003_CONFIG_STATUS_SOURCE_OF_TRUTH
```

Do not commit this with LF-UI-SOT-002R2. Do not discard without Damian approval.

### FIN15 / finance ghosts route helper

Files:

```txt
scripts/check-fin15-lead-finance-ghosts.cjs
tests/fin15-lead-finance-ghosts.test.cjs
src/lib/cases.ts
```

Observed diff:

- required evidence changed from `navigate(`/case/${startServiceSuccess.caseId}`);` to `navigate(caseDetailPath(startServiceSuccess.caseId));`.
- guard now rejects both manual `/case/:id` and manual `/cases/:id` construction.

Verdict:

```txt
D / separate stage to finish: FIN15 lead finance ghosts + canonical route helper contract
```

This looks intentional, not random drift, but it needs its own stage and tests.

### Config/status source of truth candidate

Files:

```txt
src/lib/cases.ts
src/lib/options.ts
```

Observed diff:

- `src/lib/cases.ts` imports `CASE_CLOSED_STATUSES` and `getCaseStatusLabel` from `./config/case-status`.
- `CLOSED_CASE_STATUSES` is redirected to `CASE_CLOSED_STATUSES`.
- `src/lib/options.ts` imports `LEAD_STATUS_OPTIONS` from `./config/lead-status` instead of `./domain-statuses`.

Verdict:

```txt
D / likely candidate for LF-UI-SOT-003_CONFIG_STATUS_SOURCE_OF_TRUTH
```

Do not continue to LF-UI-SOT-003 until this dirty workspace is either stashed or turned into a clean scoped stage.

### CF-RUNTIME-00 guard scope change

File:

```txt
scripts/check-cf-runtime-00-source-truth.cjs
```

Observed diff:

- adds marker `CF_RUNTIME_00_STAGE233B_TODAY_WORK_ITEM_READABILITY_ZOOM_FIX_SCOPE_COMPAT`.
- adds STAGE233B allowlist for TodayStable, canvas CSS, work-item-card CSS, Today cleanup guard/test, and STAGE116 work item card test.

Verdict:

```txt
D / separate CF-RUNTIME-00 guard maintenance + STAGE233B scope compatibility stage
```

This is scope authorization. It must not be hidden inside another stage.

## Files still needing exact diff inspection

```txt
src/pages/TodayStable.tsx
src/styles/closeflow-canvas-runtime-source-truth-stage211j.css
src/styles/work-item-card.css
tests/stage116-today-work-item-card-source-truth.test.cjs
scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs
tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs
scripts/check-stage232t-r1c-today-production-ui-cleanup-and-source-truth.cjs
tests/stage232t-r1c-today-production-ui-cleanup-and-source-truth.test.cjs
scripts/check-stage233a-route-canonicalization.cjs
tests/stage233a-route-canonicalization.test.cjs
tests/lead-service-mode-v1.test.cjs
tests/lead-start-service-case-redirect.test.cjs
tests/fin15-lead-finance-ghosts.test.cjs
```

## Current bucket decision

| Bucket | Verdict | Action |
|---|---|---|
| A24 lead-to-case route helper | D | finish as separate stage or stash after decision |
| FIN15 finance ghosts route helper | D | finish as separate stage or stash after decision |
| LF-UI-SOT-003 config/status SOT candidate | D | do not start until workspace is clean/scoped |
| CF-RUNTIME-00 / STAGE233B scope | D | separate guard-maintenance stage |
| Today/work-item-card UI source truth | D | inspect exact diffs before any decision |
| STAGE232I3 owner control | D | inspect exact diffs before any decision |
| STAGE233A route canonicalization | D | inspect exact diffs before any decision |

## Hard rules

No dirty file is approved for discard from the current log alone.
No dirty file belongs to LF-UI-SOT-002R2.
Do not continue to LF-UI-SOT-003 until this workspace is clean or intentionally stashed.
No `git add .`.
No reset/clean.
No push of local dirty files as one commit.

## Next safe commands

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

git diff -- tests/lead-service-mode-v1.test.cjs tests/lead-start-service-case-redirect.test.cjs tests/fin15-lead-finance-ghosts.test.cjs

git diff -- src/pages/TodayStable.tsx src/styles/closeflow-canvas-runtime-source-truth-stage211j.css src/styles/work-item-card.css tests/stage116-today-work-item-card-source-truth.test.cjs

git diff -- scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs

git diff -- scripts/check-stage233a-route-canonicalization.cjs tests/stage233a-route-canonicalization.test.cjs
```
