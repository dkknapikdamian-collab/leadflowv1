# Stage228R7 R6 - ClientDetail static import unblock

- date: 2026-06-08 14:45 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- issue:
  - Browser still reports CLOSEFLOW_LAZY_PAGE_EXPORT_MISSING / Missing lazy page export: ClientDetail.
  - R5 added named/default exports, but runtime ClientDetail route still fails through lazyPage.
- fix:
  - ClientDetail is imported statically in App.tsx.
  - App.tsx no longer uses lazyPage for ClientDetail route.
  - Added guard scripts/check-stage228r7r6-clientdetail-static-import.cjs to prebuild.
- tests:
  - node scripts/check-stage228r7r6-clientdetail-static-import.cjs
  - npm run build
- risk audit:
  - Initial JS bundle may grow slightly because ClientDetail is no longer code-split.
  - No SQL, no data migration, no finance calculation change.
