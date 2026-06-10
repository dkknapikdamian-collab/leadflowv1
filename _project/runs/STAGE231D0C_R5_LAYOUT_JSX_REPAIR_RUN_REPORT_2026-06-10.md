# STAGE231D0C-R5 - Layout JSX repair run report

- data: 2026-06-10 Europe/Warsaw
- status: LOCAL_ONLY_PREPARED / BUILD_RESCUE_AFTER_R4
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- affected files:
  - src/components/Layout.tsx
  - scripts/check-stage231d0c-r4-effective-visual-layout-rescue.cjs
- problem: R4 inserted trial marker attributes into a closing </p> tag and broke JSX build.
- fix: move trial marker to access warning container and remove invalid closing-tag attributes.
- required checks:
  - npm run check:stage231d0b-client-list-card-freeze
  - npm run check:stage231d0c-clients-top-layout-cleanup
  - npm run check:stage231d0c-r4-effective-visual-layout-rescue
  - git diff --check
  - npm run build
- manual test: /clients screenshot must confirm the trial banner/top-card and filters visually changed.
