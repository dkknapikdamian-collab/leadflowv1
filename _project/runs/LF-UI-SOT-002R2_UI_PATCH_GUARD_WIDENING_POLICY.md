# LF-UI-SOT-002R2 UI patch guard widening policy - run report

Date: 2026-06-28 02:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

IMPLEMENTED_IN_REPO / BASELINE_REPAIR_AFTER_LOCAL_RED_GUARD / BEZ_UI_REFACTORU / NEEDS_LOCAL_VERIFY

## Local verify from Damian

Damian ran:

```powershell
npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
```

Result:

```txt
guard:ui:patch-layers RED
tests/ui-patch-layers-guard.test.cjs RED because embedded guard run was RED
```

Reason:

The R2 guard rules were correct as policy, but the baseline allowlists did not yet freeze all existing debt. The guard was catching old debt in current repo instead of only preventing new patch growth.

Examples from local red guard:

- broad inline style debt in Activity, Calendar, CaseDetail, Cases, ClientDetail, NotificationsCenter, Today;
- direct lucide-react debt in AdminAiSettings, AiDrafts, NotificationsCenter, PublicLanding, ResponseTemplates, SalesFunnel, SupportCenter, TasksStable, TodayStable and components;
- raw button debt in UiPreview files and several components;
- local LeadActionButton / ActionIcon debt;
- existing visual runtime `!important` debt;
- legal public page CSS debt;
- Activity/AiDrafts/NotificationsCenter stage CSS import baseline was 7, not 6.

## Baseline repair performed

Changed only:

- scripts/check-ui-patch-layers.cjs
- this run report

No runtime UI files changed.
No src/pages refactor.
No src/components refactor.
No src/styles changes.
No SQL/API/Supabase changes.

## Guard state after repair

The guard still blocks the same R2 policy classes:

- raw <button> in src/pages and src/components outside explicit debt allowlist
- direct lucide-react imports outside explicit debt allowlist
- broad style={{ scan in pages/components
- CSS scan for display:none, z-index, !important, position fixed/absolute
- App.tsx global CSS import baseline
- local IconButton/ActionIcon/ActionButton/DangerButton clones
- local status/badge/status-label/color helpers
- manual case/lead/client route literals where helpers exist

## Allowlist rule

Allowlists freeze existing debt only.
Do not increase allowlists without a scoped stage note with file, pattern, reason, and cleanup target.

## Local verify required again

Run locally:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

git pull --ff-only origin dev-rollout-freeze
npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
npm run guard:routes:canonical
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Known risk

verify:closeflow:quiet may still be red because local workspace has unrelated dirty files. Do not mix that with this guard-only stage.
