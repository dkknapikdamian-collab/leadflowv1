# STAGE232T_R1A_TODAY_REFRESH_AND_VIEW_SECTION_VISIBILITY_FIX

Date/time: 2026-06-25 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze

## Status

PUSHED / NEEDS_LOCAL_GUARDS_BUILD_VERIFY / MANUAL_SMOKE_PENDING

## Scope

Small runtime fix for /today:
- manual refresh path was verified in TodayStable: manualRefreshing state, force manual refresh, loading label.
- View section visibility fix was implemented through the shared Card primitive but gated only to the Today root `data-p0-today-stable-rebuild="true"`.
- When a Today section is disabled in the View customizer, its whole section card/list is not displayed, not only the metric tile.

## Files changed

- src/components/ui/card.tsx
- scripts/check-stage232t-r1a-today-refresh-and-view-section-visibility.cjs
- tests/stage232t-r1a-today-refresh-and-view-section-visibility.test.cjs
- _project/runs/STAGE232T_R1A_TODAY_REFRESH_AND_VIEW_SECTION_VISIBILITY_FIX.md

## Not touched

- finance / commission
- SQL / RLS / migrations
- Calendar runtime
- billing / trial
- LeadDetail / ClientDetail / CaseDetail runtime
- large Today redesign

## Required local verification

Run locally from `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`:

```powershell
node scripts/check-stage232t-r1a-today-refresh-and-view-section-visibility.cjs
node --test tests/stage232t-r1a-today-refresh-and-view-section-visibility.test.cjs
node scripts/check-cf-runtime-00-source-truth.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Manual smoke

1. Open /today.
2. Click Odśwież dane.
3. Verify Odświeżanie state appears and Last read updates.
4. Open Widok.
5. Disable a section that has rows.
6. Verify the tile and the whole card/list disappear.
7. Enable it again.
8. Verify tile and card/list return.
9. Hard refresh and verify no route error.

## Risk audit

The implementation is intentionally bounded to cards rendered under the Today root. It avoids touching Today row logic, Calendar action policy, finance, SQL, or billing. Main risk: because the fix is placed in the shared Card primitive, a future Today card title change may require updating the title-to-section mapping. Guard/test now protect the current mapping.
