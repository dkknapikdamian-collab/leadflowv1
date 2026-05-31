# CloseFlow Stage174 — Main Search Surface and Text Normalization

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Problem

After Stage173:
- Cases search had different wording and visually heavier placeholder than Leads/Clients.
- Some search bars still had a visible double-layer wrapper + input surface.
- Some bars were too short and should fill the work column to the right rail / grey boundary.

## Decision

Stage174 is an override layer on top of Stage173:
- wrapper `.cf-main-search` becomes transparent, borderless and shadowless,
- input becomes the only visual search surface,
- font, weight, placeholder and height are normalized,
- direct search icons / old markers stay hidden,
- `/cases` placeholder is normalized to the same sentence as Leads/Clients.

## Guard

`node scripts/check-stage174-main-search-surface-and-text-normalization.cjs`
