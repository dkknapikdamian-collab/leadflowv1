# 2026-06-20 01:20 Europe/Warsaw — STAGE232I4_R16O_CLIENT_SHARED_MISSING_MANAGER_NO_MARKER_ANCHOR_FINAL

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- status: package prepared, local apply required

## Decision

R16C-R16N helper packages failed due to brittle patch anchors and wrapper/ZIP mistakes. R16O explicitly removes dependency on R14/R6 marker anchoring and patches the active ClientDetail missing manager by structure.

## Scope

- Replace ClientDetail local missing dialog with shared MissingItemsManagerDialog.
- Keep quick add modal separate.
- Add inline adapter for stage232i2AllActiveMissingItems.
- Use title fallbacks from item/raw/payload.
- Add R16 tile marker by resilient fallback.
- Make manager wide/readable.

## Tests

- node guard
- node test
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- manual smoke Client/Lead

## Risk audit

If F5 still loses/revives missing items, investigate fetch/persist/normalize next. Do not keep changing modal CSS.

## Sync status

- App repo GitHub sync: pending until push
- Obsidian GitHub sync: pending
- Obsidian local sync: LOCAL_SYNC_PENDING
