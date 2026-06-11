# STAGE231D0B-R10/R10 - ClientListCard single-grid alignment source truth

Data: 2026-06-11 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Scan

Repo facts:
- ClientListCard renders primary and secondary wrappers.
- CSS after R7/R8/R9 contains competing alignment overrides.
- Final fix must stop relying on two independent row grids.

Obsidian/project memory:
- Direct local Obsidian was not available in this patcher.
- Payload is written under _project/obsidian_updates.

## Change

- Added STAGE231D0B-R10-R10_SINGLE_GRID_ALIGNMENT final CSS source truth.
- .cf-client-list-card-content becomes one grid with two rows.
- .client-list-card-row-primary and .client-list-card-row-secondary use display: contents.
- Name/company, phone/cases, email/action, finance/finance share physical columns.
- Finance chips use start alignment inside column 4.

## Verification

Expected:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

## Manual QA

Open /clients after deploy and Ctrl+F5.
Verify:
- Aktywna prowizja and Zarobione lacznie begin on one left axis.
- Middle labels also align by column.
- Long names/email/action use ellipsis and do not cover neighbors.
- Hover title still exposes full values.

## Risk audit

- display: contents should be safe for these span wrappers, but manual desktop/narrow/mobile QA is required.
- Historical R7/R8/R9 blocks remain below earlier stages but R10/R10 final block wins by cascade and guard checks final block.
- Build warnings savedRecord and supabase-fallback are existing separate risks, not touched here.
