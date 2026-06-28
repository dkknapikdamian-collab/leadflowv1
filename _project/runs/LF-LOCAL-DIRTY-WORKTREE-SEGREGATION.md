# LF-LOCAL-DIRTY-WORKTREE-SEGREGATION

Date: 2026-06-28 03:15 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Status

DIFF_BUCKETS_CLASSIFIED / NO_LOCAL_CHANGES_TOUCHED_BY_AI / NO_DISCARD / NO_STASH_YET / DO_NOT_CONTINUE_TO_LF_UI_SOT_003_YET

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
- `tests/lead-service-mode-v1.test.cjs` now expects `navigate(caseDetailPath(startServiceSuccess.caseId));` and updates wording to canonical `/cases/:id`.
- `tests/lead-start-service-case-redirect.test.cjs` was listed as dirty earlier but exact hunk was not included in the pasted diff output; keep it in this bucket until inspected.
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
- `tests/fin15-lead-finance-ghosts.test.cjs` now asserts `navigate(caseDetailPath(startServiceSuccess.caseId));` and explicitly rejects manual `/case/:id` and `/cases/:id` navigation.

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

### Today / work-item-card UI readability scope

Files:

```txt
src/pages/TodayStable.tsx
src/styles/closeflow-canvas-runtime-source-truth-stage211j.css
src/styles/work-item-card.css
tests/stage116-today-work-item-card-source-truth.test.cjs
scripts/check-stage232t-r1c-today-production-ui-cleanup-and-source-truth.cjs
tests/stage232t-r1c-today-production-ui-cleanup-and-source-truth.test.cjs
```

Observed diff from pasted output:

- `TodayStable.tsx` changes section grid from `xl:grid-cols-3` to `2xl:grid-cols-3`.
- `closeflow-canvas-runtime-source-truth-stage211j.css` comment names STAGE233B readability/zoom goal.
- `work-item-card.css`, STAGE116 test, and STAGE232T guard/test were listed dirty but complete hunks were not fully pasted yet.

Verdict:

```txt
D / separate STAGE233B_TODAY_WORK_ITEM_READABILITY_ZOOM_FIX or stash after decision
```

This is a real UI/CSS source-truth change. Do not mix with route-helper or config/status work.

### STAGE232I3 owner control route helpers

Files:

```txt
scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs
tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs
```

Observed diff:

- expected routes change from manual `/leads/${encodedId}`, `/case/${encodedId}`, `/clients/${encodedId}` to helper calls:
  - `leadDetailPath(sourceEntityId)`
  - `caseDetailPath(sourceEntityId)`
  - `clientDetailPath(sourceEntityId)`
- test expectations are being aligned with route helpers.

Verdict:

```txt
D / separate STAGE232I3 route-helper canonicalization follow-up
```

This belongs to the route-helper cleanup family, but it is a separate I3-owned guard/test bucket.

### STAGE233A route canonicalization guard alignment

Files:

```txt
scripts/check-stage233a-route-canonicalization.cjs
tests/stage233a-route-canonicalization.test.cjs
```

Observed diff:

- route helper evidence becomes stricter: `return `${CLOSEFLOW_ROUTES.cases}/${encodeRouteId(caseId)}`;`.
- App route evidence changes from hardcoded `/cases/:caseId` and `/case/:caseId` JSX to `CLOSEFLOW_ROUTES.caseDetail`, `CLOSEFLOW_ROUTES.legacyCaseDetail`, and `loginPath()`.
- test file was listed dirty but full hunk was not pasted yet.

Verdict:

```txt
D / separate STAGE233A route canonicalization guard alignment
```

This is not UI guard R2. It is route SOT guard hardening.

## Current bucket decision

| Bucket | Verdict | Action |
|---|---|---|
| A24 lead-to-case route helper | D | finish as separate stage or stash after decision |
| FIN15 finance ghosts route helper | D | finish as separate stage or stash after decision |
| LF-UI-SOT-003 config/status SOT candidate | D | do not start until workspace is clean/scoped |
| CF-RUNTIME-00 / STAGE233B scope | D | separate guard-maintenance stage |
| Today/work-item-card UI source truth | D | separate STAGE233B UI/CSS source-truth stage or stash |
| STAGE232I3 owner control route helper | D | separate I3 follow-up or stash |
| STAGE233A route canonicalization | D | separate route guard alignment or stash |

## Hard rules

No dirty file is approved for discard from the current log alone.
No dirty file belongs to LF-UI-SOT-002R2.
Do not continue to LF-UI-SOT-003 until this workspace is clean or intentionally stashed.
No `git add .`.
No reset/clean.
No push of local dirty files as one commit.

## Recommended next decision

There are two safe routes:

1. Stash all local dirty work as one named rescue stash, then start LF-UI-SOT-003 clean.
2. Finish one small bucket first. Best candidate: STAGE233A route canonicalization guard alignment, because it is guard/test-only and directly supports Route SOT.

No action taken by AI on local dirty files.
