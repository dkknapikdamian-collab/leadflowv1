# 2026-06-19 17:05 Europe/Warsaw — STAGE232I4_R13G_CLIENT_DETAIL_MISSING_INLINE_TO_SHARED_VISUAL_SOURCE

Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

ZIP_READY / NOT_APPLIED_YET

## Finding

The live visual failure after R12 was not a Vercel/cache problem. Browser DOM showed R12 deployed, but the active ClientDetail modal still used the older R13F/simple inline visual layer.

Root cause:

- ClientDetail rendered `DialogContent` with `client-detail-missing-window-dialog-simple`.
- Missing item rows used `client-detail-missing-window-row-simple`.
- CSS forced a flat grid row: title + checkbox + actions in one line.

## Decision

Do not patch margins. Remove the simple inline row layer from ClientDetail and force a title-first card contract:

- `data-missing-item-card`
- `data-missing-item-title-block`
- `data-missing-item-blocker-row`
- `data-missing-item-actions-row`

## Scope

Runtime/CSS only:

- `src/pages/ClientDetail.tsx`
- `src/styles/visual-stage12-client-detail-vnext.css`
- new guard/test for R13G
- run report

## Not touched

- backend
- SQL/RLS/migrations
- `api/work-items.ts`
- R8/R9 source truth
- Google Calendar
- billing/trial

## Tests required

- R13G guard/test
- R12 guard/test
- R14 guard/test
- R6 runtime guard
- R9 guard/test
- R8 guard/test
- build
- git diff --check
- Vercel manual visual smoke

## Risk audit

Main risk: a previous stage-specific CSS layer can override a shared modal component. This is now guarded by blocking the R13F/simple row/list/dialog classes in ClientDetail runtime and CSS.
