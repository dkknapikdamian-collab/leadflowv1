# STAGE231D0C-R3 — Preview string rescue

Data: 2026-06-10 22:35 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Status

R3 fixes the build failure caused by STAGE231D0C patching a static HTML preview string in UiPreviewVNextFull.tsx.

## Decision

Static preview HTML files are out of scope for the live Clients top-layout cleanup. They must not be patched with unescaped JSX attributes by this stage.

## Tests

- D0B guard.
- D0C guard.
- git diff --check.
- build.
- manual /clients visual check.

## Risk audit

Main risk: D0C may still have adjusted trial banner markers in several live pages. That is acceptable only if build and manual /clients check pass. Any broad trial banner cleanup across the whole app should be a separate stage.
