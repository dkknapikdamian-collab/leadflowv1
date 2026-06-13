# STAGE231E2_R8_SIDEBAR_POLISH_AND_PLAN_WIRING_GUARD

Date: 2026-06-13 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status
LOCAL_ONLY_PACKAGE_FIX3.

## Why FIX3 exists
The previous R8 package generated a temporary JS patch file containing nested template-literal syntax. Node failed before creating the R8 guard file. FIX3 removes template literals from the generated guard and keeps the apply script ASCII-safe.

## AUDYT PRZED ETAPEM
- Manualny screen po R7 pokazaĹ‚ poprawny trial 14 dni, ale sidebar miaĹ‚ mojibake.
- `src/components/Layout.tsx` had broken Polish source labels in the sidebar access card.
- `src/lib/plans.ts` defines all current plan IDs, definitions and feature minimum gates.

## CO ZMIENIONO
- `src/components/Layout.tsx`: sidebar shows `Trial aktywny`; Polish labels are encoded safely.
- `_project/06_STAGE231E2_PLAN_ENTITLEMENT_MATRIX.md`: R8 plan wiring confirmation.
- `scripts/check-stage231e2-r8-sidebar-polish-and-plan-wiring.cjs`: dedicated guard for sidebar Polish labels and complete plan wiring.

## TESTY / GUARDY
- node scripts/check-stage231e2-r8-sidebar-polish-and-plan-wiring.cjs
- node scripts/check-stage231e2-r7-trial-access-bootstrap-repair.cjs
- node scripts/check-stage231e2-trial-14d-contract.cjs
- node scripts/check-stage231e2-plan-entitlement-matrix.cjs
- npm run build
- git diff --check

## AUDYT PO ETAPIE
- Runtime billing, SQL, Stripe and Google Calendar runtime are not changed.
- Guard verifies every plan ID/definition, feature minimum and Trial feature inheritance.
- Existing local Stage231D files remain intentionally out of scope.

## MANUAL TEST
- Refresh deployed app after push.
- Sidebar should show `Trial aktywny` and `14 dni`, with no mojibake.