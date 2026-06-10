# STAGE231D0C-R4 — Effective Visual Layout Rescue run report

Data: 2026-06-10 22:35 Europe/Warsaw
Status: LOCAL_ONLY_PACKAGE_PREPARED
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Problem

STAGE231D0C passed guards and build, but the live screenshot showed no visible improvement: trial banner remained visually in the same place and simple filters remained too far right.

## Root cause

D0C guard checked markers, not effective visual selectors. The CSS block was too dependent on a scoped ancestor and did not reliably affect the live /clients DOM.

## Implementation

- Added unscoped R4 CSS selectors for the live /clients layout.
- Added R4 layout markers in Clients.tsx.
- Added a direct trial top-card marker in Layout.tsx when trial copy exists.
- Moved filter rail left with a visible transform on wide screens.
- Added a dedicated R4 guard.

Trial marker in Layout.tsx: YES

## Verification

- D0B guard
- D0C guard
- D0C-R4 guard
- git diff --check
- npm run build
- manual /clients screenshot check
