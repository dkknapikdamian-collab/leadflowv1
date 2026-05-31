# CloseFlow Stage173 — Main Search Source Truth

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Decision

All main-section search bars must use one visual source truth:
- unified class: `cf-main-search`,
- unified marker: `data-cf-main-search-source="stage173"`,
- one CSS file: `src/styles/closeflow-main-search-source-truth-stage173.css`.

## Problem

The current search bar can stretch too far and the decorative icon overlaps / competes with placeholder text.

## Fix

- Constrain search bar desktop width to `--cf173-main-search-max-width: 1060px`.
- Hide decorative direct search icons / old question-mark markers in main search bars.
- Normalize input padding, text color, placeholder, height and radius.
- Keep mobile width at 100%.

## Guard

`node scripts/check-stage173-main-search-source-truth.cjs`
