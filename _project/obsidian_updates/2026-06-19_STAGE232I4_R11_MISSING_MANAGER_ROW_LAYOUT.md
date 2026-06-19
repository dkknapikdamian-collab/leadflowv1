# 2026-06-19 13:50 Europe/Warsaw — STAGE232I4_R11_MISSING_MANAGER_ROW_LAYOUT

Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

ZIP_READY / NOT_APPLIED_YET

## Reason

After R8/R9/R10, missing items are saved and visible, but R10 manager rows are still visually cramped: checkbox/status, missing item name and action buttons can visually collide. The row must use available width and present clear columns.

## Change

R11 updates `MissingItemsManagerDialog` visual layout only:
- left column: blocker checkbox + status text underneath,
- center column: clearly labeled and visible `Nazwa braku`,
- right column: `Uzupełnione` and `Usuń` buttons,
- each row remains a separated card,
- list remains scrollable for many items.

## Tests / guards

Planned:
- R11 guard and node test,
- R10 regression,
- R14/R6 missing manager regression,
- R8/R9 backend/source-truth regression,
- build,
- git diff --check.

## Risk audit

Backend/SQL/source truth are not touched. Main remaining risk is small-screen visual wrapping; grid falls back to a stacked layout on smaller widths.

## Next

Apply ZIP, run guards/tests/build, push selected files, then Vercel visual smoke for Client and Lead missing manager.
