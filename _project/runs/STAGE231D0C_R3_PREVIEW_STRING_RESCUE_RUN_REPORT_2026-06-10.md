# STAGE231D0C-R3 — Preview string rescue run report

Data: 2026-06-10 22:35 Europe/Warsaw
Status: LOCAL_ONLY_PACKAGE_PREPARED
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Problem

STAGE231D0C-R2 fixed the guard syntax, but build failed in src/pages/UiPreviewVNextFull.tsx because R1 patched data-stage231d0c-trial-top-card into a static HTML string without escaping JSX/TS string quotes.

## Fix

- Restore static UI preview files from HEAD:
  - src/pages/UiPreviewVNextFull.tsx
  - src/pages/UiPreviewVNext.tsx, if present.
- Rewrite STAGE231D0C guard to skip static preview HTML sources while still guarding live source files.
- Keep D0B client card guard active.
- Keep D0C layout patch and docs active.

## Verification required

- npm run check:stage231d0b-client-list-card-freeze
- npm run check:stage231d0c-clients-top-layout-cleanup
- git diff --check
- npm run build
- manual /clients visual check

## Risk audit

The failure class is broad string patching in files that contain full HTML previews. Future patches must not mutate huge HTML string constants with naive tag insertion.
