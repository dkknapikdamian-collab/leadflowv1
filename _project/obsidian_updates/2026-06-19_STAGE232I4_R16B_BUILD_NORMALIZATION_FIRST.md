# 2026-06-19 20:40 Europe/Warsaw — STAGE232I4_R16B_BUILD_NORMALIZATION_FIRST

canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

BUILD_FIX_DO_WDROZENIA_LOCAL_ZIP

## Decision

Before returning to `STAGE232I4_R16` UI work, normalize the build path. Timeout wrappers are not accepted as the main workflow. The normal command must remain `npm run build` / `vite build`.

## Change

- Scope Tailwind v4 source detection in `src/index.css` to the `src` directory via `@import "tailwindcss" source("./");`.
- Keep Vite/Tailwind plugin unchanged.
- Remove failed R16/R16A untracked artifacts from the local repo workspace.
- Add guard/test for build normalization.

## Tests

- `node scripts/check-stage232i4-r16b-build-normalization.cjs`
- `node --test tests/stage232i4-r16b-build-normalization.test.cjs`
- `npm run build`
- `git diff --check`

## Risk audit

If `npm run build` still takes many minutes after limiting Tailwind source detection, the next audit must inspect Vite transform target, generated import graph, oversized CSS imports, dependency prebundling, Node version behavior, and recent R13G build audit artifacts. Do not continue UI hotfixes until build is stable.

## Not touched

SQL, Owner Control I3, finances, billing/trial, Google Calendar, ClientDetail/LeadDetail/CaseDetail runtime.
