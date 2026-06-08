# STAGE228P A+B — Rail text source truth

- generated_at: 2026-06-08T05:00:22.796Z
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- mode: local-only ZIP
- scope: text only; no runtime mapper

## Problem

Debug and local audit showed that the rail text issue is not caused by one active main.tsx runtime import. Active problems are in the component layer:

- Cases.tsx imports the bad R7 CSS for cases risk rail.
- TopValueRecordsCard hardcodes data-cf-operator-rail-tone="green".
- SimpleFiltersCard has tone hooks but no text classes.
- OperatorSideCard is the correct title source for shared right rail cards.

## Changes

- Added src/styles/operator-rail-text-source-truth-stage228p.css.
- OperatorSideCard h3 uses cf-rail-card-title.
- SimpleFiltersCard rows use cf-rail-filter-row / cf-rail-filter-label / cf-rail-filter-count.
- TopValueRecordsCard no longer hardcodes green and uses cf-rail-top-* text classes.
- Cases risk card removes the bad R7 CSS import and uses cf-rail-risk-* classes.
- Added guard: npm run check:stage228p-rail-text-source-truth.

## Manual check

Routes:

- /leads
- /clients
- /cases

Acceptance:

- Tasks rail remains the reference.
- Simple filters use the same text size/color/weight rhythm.
- Top value rows are not green by default.
- Cases risk title is not a colored chip.
- Cases risk text does not become heavy after one second.

