# Stage228R7 R7 - ClientDetail undefined stage marker hotfix

- date: 2026-06-08 15:15 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- issue:
  - Browser runtime crashed with ReferenceError: STAGE220A35_R2_BUILD_GUARD_COMPATIBILITY_FIX is not defined.
  - ClientDetail.tsx had "void STAGE220A35_R2_BUILD_GUARD_COMPATIBILITY_FIX;" without a previous const declaration.
- fix:
  - Define STAGE220A35_R2_BUILD_GUARD_COMPATIBILITY_FIX before void usage.
  - Add guard scripts/check-stage228r7r7-clientdetail-stage-marker-defined.cjs.
  - Guard checks ClientDetail for void markers without previous const declaration.
- tests:
  - node scripts/check-stage228r7r7-clientdetail-stage-marker-defined.cjs
  - npm run build
- risk audit:
  - No UI behavior change.
  - No route loading change.
  - No finance calculation change.
  - No SQL/migration.
