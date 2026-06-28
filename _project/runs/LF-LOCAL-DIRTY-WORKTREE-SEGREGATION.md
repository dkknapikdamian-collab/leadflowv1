# LF-LOCAL-DIRTY-WORKTREE-SEGREGATION

Date: 2026-06-28 14:08 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Status

RESCUE_STASH_CREATED / WORKTREE_CLEAN_AFTER_STASH / NO_DISCARD / MIXED_PUSH_BLOCKED / PUSH_UP_TO_DATE

## Goal

Separate local dirty workspace from closed LF-UI-SOT-002R2 and LF-UI-SOT-004, without discarding or mixing unrelated files.

## Local result from Damian

The safe push package correctly blocked a mixed dirty push and then created a rescue stash.

Before stash, dirty files were present:

```txt
scripts/check-a24-lead-to-case-flow.cjs
scripts/check-cf-runtime-00-source-truth.cjs
scripts/check-fin15-lead-finance-ghosts.cjs
scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs
scripts/check-stage232t-r1c-today-production-ui-cleanup-and-source-truth.cjs
scripts/check-stage233a-route-canonicalization.cjs
src/lib/cases.ts
src/lib/options.ts
src/pages/TodayStable.tsx
src/styles/closeflow-canvas-runtime-source-truth-stage211j.css
src/styles/work-item-card.css
tests/fin15-lead-finance-ghosts.test.cjs
tests/lead-service-mode-v1.test.cjs
tests/lead-start-service-case-redirect.test.cjs
tests/stage116-today-work-item-card-source-truth.test.cjs
tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs
tests/stage232t-r1c-today-production-ui-cleanup-and-source-truth.test.cjs
tests/stage233a-route-canonicalization.test.cjs
```

Rescue stash created:

```txt
stash@{0}: On dev-rollout-freeze: LF-LOCAL-DIRTY-WORKTREE-SEGREGATION rescue before next stage 2026-06-28_1408
```

After stash:

```txt
git status --short --branch
## dev-rollout-freeze...origin/dev-rollout-freeze

git diff --check
(no output)

git push origin HEAD:dev-rollout-freeze
Everything up-to-date
```

An attempted placeholder add failed safely:

```txt
git add -- "KONKRETNY_PLIK_1" "KONKRETNY_PLIK_2"
fatal: pathspec 'KONKRETNY_PLIK_1' did not match any files
```

No commit was created because working tree was clean:

```txt
nothing to commit, working tree clean
```

## Diff inspection previously recorded

### A24 / lead-to-case route helper

Files:

```txt
scripts/check-a24-lead-to-case-flow.cjs
tests/lead-service-mode-v1.test.cjs
tests/lead-start-service-case-redirect.test.cjs
src/lib/cases.ts
```

Verdict:

```txt
D / separate stage to finish: A24 lead-to-case + route helper contract
D / src/lib/cases.ts also overlaps with LF-UI-SOT-003_CONFIG_STATUS_SOURCE_OF_TRUTH
```

### FIN15 / finance ghosts route helper

Files:

```txt
scripts/check-fin15-lead-finance-ghosts.cjs
tests/fin15-lead-finance-ghosts.test.cjs
src/lib/cases.ts
```

Verdict:

```txt
D / separate stage to finish: FIN15 lead finance ghosts + canonical route helper contract
```

### Config/status source of truth candidate

Files:

```txt
src/lib/cases.ts
src/lib/options.ts
```

Verdict:

```txt
D / likely candidate for LF-UI-SOT-003_CONFIG_STATUS_SOURCE_OF_TRUTH reconciliation
```

### CF-RUNTIME-00 guard scope change

File:

```txt
scripts/check-cf-runtime-00-source-truth.cjs
```

Verdict:

```txt
D / separate CF-RUNTIME-00 guard maintenance + STAGE233B scope compatibility stage
```

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

Verdict:

```txt
D / separate STAGE233B_TODAY_WORK_ITEM_READABILITY_ZOOM_FIX or stash after decision
```

### STAGE232I3 owner control route helpers

Files:

```txt
scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs
tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs
```

Verdict:

```txt
D / separate STAGE232I3 route-helper canonicalization follow-up
```

### STAGE233A route canonicalization guard alignment

Files:

```txt
scripts/check-stage233a-route-canonicalization.cjs
tests/stage233a-route-canonicalization.test.cjs
```

Verdict:

```txt
D / separate STAGE233A route canonicalization guard alignment
```

## Current bucket decision

| Bucket | Verdict | Action |
|---|---|---|
| A24 lead-to-case route helper | D | preserved in rescue stash; finish as separate stage if approved |
| FIN15 finance ghosts route helper | D | preserved in rescue stash; finish as separate stage if approved |
| LF-UI-SOT-003 config/status SOT candidate | D | preserved in rescue stash; reconcile before reuse |
| CF-RUNTIME-00 / STAGE233B scope | D | preserved in rescue stash; separate guard-maintenance stage if approved |
| Today/work-item-card UI source truth | D | preserved in rescue stash; separate STAGE233B UI/CSS source-truth stage if approved |
| STAGE232I3 owner control route helper | D | preserved in rescue stash; separate I3 follow-up if approved |
| STAGE233A route canonicalization | D | preserved in rescue stash; separate route guard alignment if approved |

## Hard rules

No dirty file was discarded.
No dirty file was pushed as a mixed commit.
No `git add .` was used.
No reset/clean was used.
Do not drop the rescue stash until Damian confirms the saved changes are no longer needed.

## Recommended next command

Run full verify on clean workspace:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
npm run verify:closeflow:quiet
```

If green, LF-UI-SOT-004 can be treated as clean-workspace verified. Then move to `LF-UI-SOT-005_ACTIVE_VISUAL_TEMPLATE_DICTIONARY` or deliberately apply one stash bucket in isolation.
