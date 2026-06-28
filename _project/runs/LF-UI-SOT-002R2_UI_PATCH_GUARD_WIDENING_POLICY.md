# LF-UI-SOT-002R2 UI patch guard widening policy - run report

Date: 2026-06-28 02:30 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

LOCAL_R2_VERIFY_PASS / GUARD_PASS / TEST_PASS / ROUTES_GUARD_PASS / BUILD_PASS / VERIFY_QUIET_BLOCKED_BY_UNRELATED_DIRTY_WORKSPACE

## Local verify from Damian

Damian ran after pulling commit 0bcb1330:

```powershell
npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
npm run guard:routes:canonical
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Results

PASS:

```txt
npm run guard:ui:patch-layers: PASS
node --test tests/ui-patch-layers-guard.test.cjs: PASS, 5/5
npm run guard:routes:canonical: PASS
npm run build: PASS
```

Blocked outside this stage:

```txt
npm run verify:closeflow:quiet: RED
Reason: CF-RUNTIME-00 out-of-scope changed files from unrelated local dirty workspace.
```

`git diff --check`:

```txt
Warnings only: LF will be replaced by CRLF in src/lib/cases.ts and src/lib/options.ts.
```

Dirty workspace files are outside LF-UI-SOT-002R2 and must not be pushed as one commit.

## Guard output after pass

Known debt frozen by guard:

```txt
domPatchFiles: 16
directTrash2Files: 15
styleLayerFiles: 32
stageClassFiles: 35
rawButtonFiles: 40
lucideImportFiles: 56
inlineStyleFiles: 12
displayStackImportantFiles: 8
cssPatchFiles: 238
appStyleImportFiles: 0
localIconButtonCloneFiles: 5
localColorMapFiles: 0
routeLiteralFiles: 9
```

This known debt is not approval for new patches. It is frozen baseline only.

## Scope unchanged

No runtime UI files changed.
No src/pages refactor.
No src/components refactor.
No src/styles changes.
No SQL/API/Supabase changes.

## Guard state

The guard blocks the same R2 policy classes:

- raw <button> in src/pages and src/components outside explicit debt allowlist
- direct lucide-react imports outside explicit debt allowlist
- broad style={{ scan in pages/components
- CSS scan for display:none, z-index, !important, position fixed/absolute
- App.tsx global CSS import baseline
- local IconButton/ActionIcon/ActionButton/DangerButton clones
- local status/badge/status-label/color helpers
- manual case/lead/client route literals where helpers exist

## Next safe step

Do not continue UI work while local dirty workspace is unresolved.
Next safe stage:

```txt
LF-LOCAL-DIRTY-WORKTREE-SEGREGATION
```

## Known blocker

`verify:closeflow:quiet` remains blocked by unrelated local changes:

```txt
scripts/check-a24-lead-to-case-flow.cjs
scripts/check-fin15-lead-finance-ghosts.cjs
src/lib/cases.ts
src/lib/options.ts
tests/fin15-lead-finance-ghosts.test.cjs
tests/lead-service-mode-v1.test.cjs
tests/lead-start-service-case-redirect.test.cjs
```
