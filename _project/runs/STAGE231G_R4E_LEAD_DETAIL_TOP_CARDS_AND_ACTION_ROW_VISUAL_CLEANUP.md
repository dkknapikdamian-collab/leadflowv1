# STAGE231G_R4E_LEAD_DETAIL_TOP_CARDS_AND_ACTION_ROW_VISUAL_CLEANUP

Data: 2026-06-14 12:45 Europe/Warsaw
Status: PUSHED_VIA_GITHUB_CONNECTOR / REQUIRES_DEPLOY_PREVIEW_VISUAL_CONFIRMATION
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Commit series:
- 95e947a0 — CSS visual cleanup override
- b75ab95f — R4E guard
- 70d0778e — R4E test

## Routing
- canonical_name: CloseFlow / LeadFlow
- project_id: CloseFlow / LeadFlow
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Scan report
Read from GitHub before change:
- AGENTS.md
- src/pages/LeadDetail.tsx
- src/styles/visual-stage14-lead-detail-vnext.css
- src/styles/closeflow-lead-detail-sales-signal-stage227e4.css
- scripts/check-stage231g-r4d-work-row-one-line-alignment.cjs
- _project/13_TEST_HISTORY.md

## Problem
Damian screenshot showed three visual problems in LeadDetail:
- visible helper text `Zapisana wartość leada` in Potential top card,
- small status pills inside large decision cards (`Do zrobienia`, `Pod kontrolą`, `Czysto`),
- action row alignment still needed hardening for status/actions one-line desktop layout.

## Scope
Changed only LeadDetail visual CSS and static guards/tests:
- appended R4E override block to `src/styles/closeflow-lead-detail-sales-signal-stage227e4.css`, imported after `visual-stage14-lead-detail-vnext.css`,
- added `scripts/check-stage231g-r4e-lead-detail-top-cards-action-row-visual.cjs`,
- added `tests/stage231g-r4e-lead-detail-top-cards-action-row-visual.test.cjs`.

## What changed
- Potential helper paragraph is hidden in the top card.
- Direct top-card `.lead-detail-pill` micro badges are hidden.
- Top-card title/value/body text is slightly enlarged and hardened with more specific selectors.
- Stage228D action rows get a later CSS override keeping content/status/actions in one desktop row.
- Medium-width fallback remains allowed at max-width 1180px.

## Tests / guards
Static guards added:
- `node scripts/check-stage231g-r4e-lead-detail-top-cards-action-row-visual.cjs`
- `node --test tests/stage231g-r4e-lead-detail-top-cards-action-row-visual.test.cjs`

Not run in this chat environment:
- npm build
- node guard/test execution

Reason: this commit was performed through the GitHub connector, not Damian's local repo. Required next verification after pull/deploy preview:
- R3 guard/test,
- R4 guard/test,
- R4D guard/test,
- R4E guard/test,
- npm run build,
- visual check on LeadDetail.

## Manual visual check required
On LeadDetail:
- `Zapisana wartość leada` is not visible.
- top-card micro badges are not visible in large decision cards.
- top-card text is more readable.
- `Do zrobienia / Edytuj / Jutro / Zrobione / Usuń` align in one desktop row.

## Risk audit after stage
- This is CSS-over-visibility cleanup, not JSX removal. The underlying strings may still exist in `LeadDetail.tsx`, but are no longer visible in the dashboard top cards.
- Later JSX cleanup can remove the dead helper text fully, but this stage avoids large direct replacement of `LeadDetail.tsx` through connector.
- CSS is scoped to LeadDetail top grid and Stage228D action center. CaseDetail, SQL, Google Calendar, billing/trial untouched.
- Existing dirty local working tree from older 231D0D/231D0E/231D0F/231D0H remains separate and was not touched.

## Next step
Verify on deployed/pulled UI. If visual PASS, proceed to cleanup working tree or STAGE231H CaseDetail mapping. If text still appears, do JSX removal in a separate small commit with full local checkout.
