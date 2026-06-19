# 2026-06-19 14:25 Europe/Warsaw — STAGE232I4_R12_SHARED_MODAL_VISUAL_SOURCE_TRUTH

Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

ZIP_READY / NOT_APPLIED_YET

## Decision

Do not continue with local visual patches for `Braki / Blokady`. The modal must use one shared visual source of truth with other application dialogs.

## Problem

R8/R9 fixed save/source truth. R10/R11 made partial visual fixes. Manual Vercel smoke still failed because the missing manager used a separate locally built modal layout and the missing item name was not the primary visible element.

## R12 scope

- Add shared `CloseFlowDialogShell` component.
- Refactor `MissingItemsManagerDialog` to use the shell.
- Make each missing item card title-first:
  - visible `Nazwa braku`,
  - blocker row below,
  - actions row separated.
- Update R10/R11 visual guards to check source-truth structure instead of brittle class tokens.
- Add R12 structural guard/test.

## Not touched

- Backend/API.
- SQL.
- `api/work-items.ts`.
- R8/R9 source truth.
- Google Calendar.
- Owner Control runtime.

## Tests / guards

Planned:

- R12 shared modal source truth guard/test.
- R10/R11 visual regression guards/tests.
- R14/R6 missing manager regression.
- R9/R8 backend/source truth regression.
- build.
- `git diff --check`.

## Risk audit

Main risk: shared shell is introduced but not yet applied to every existing modal. This stage fixes the broken missing manager and creates the canonical pattern for later adoption.

## Next

Apply ZIP, run checks, push selected files, then Vercel manual visual smoke for Client and Lead missing manager.
