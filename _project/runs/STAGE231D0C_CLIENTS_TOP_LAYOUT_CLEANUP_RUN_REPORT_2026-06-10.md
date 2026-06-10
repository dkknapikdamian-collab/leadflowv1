# STAGE231D0C — Clients Top Layout Cleanup run report

Data: 2026-06-10 22:00 Europe/Warsaw
Status: LOCAL_ONLY_PACKAGE_PREPARED
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan report

Repo files read/used:
- AGENTS.md
- src/pages/Clients.tsx
- src/styles/closeflow-record-list-source-truth.css
- src/styles/clients-next-action-layout.css
- _project central ledgers

Obsidian direct access: not available from this chat. ZIP writes Obsidian manifest if local vault path exists.

## Problem

Top area on /clients has too much dead space. Trial notice should sit as a top card, the page/menu should move upward, and simple filters should move closer to the center instead of being pushed too far right.

## Implementation

- Added Clients page layout markers for centered filter rail.
- Added CSS source-of-truth block in closeflow-record-list-source-truth.css.
- Added trial banner marker when a source file with trial/activation copy is found.
- Added guard scripts/check-stage231d0c-clients-top-layout-cleanup.cjs.

Trial source files patched:
- src/components/Layout.tsx
- src/pages/CaseDetail.tsx
- src/pages/ClientDetail.tsx
- src/pages/Today.tsx
- src/pages/UiPreviewVNextFull.tsx

## Verification required

- npm run check:stage231d0b-client-list-card-freeze
- npm run check:stage231d0c-clients-top-layout-cleanup
- git diff --check
- npm run build
- manual /clients visual check
