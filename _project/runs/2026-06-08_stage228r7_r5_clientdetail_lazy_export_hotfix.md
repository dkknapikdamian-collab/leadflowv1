# Stage228R7 R5 - ClientDetail lazy export hotfix

- date: 2026-06-08 14:15 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- issue:
  - Browser runtime reported: Missing lazy page export: ClientDetail.
  - App lazyPage loads ./pages/ClientDetail with exportName ClientDetail.
- fix:
  - Convert ClientDetail from inline default function export to named function.
  - Add explicit named export and default export:
    - export { ClientDetail };
    - export default ClientDetail;
  - Add guard scripts/check-stage228r7r5-clientdetail-lazy-export.cjs to prebuild.
- tests:
  - node scripts/check-stage228r7r5-clientdetail-lazy-export.cjs
  - npm run build
- risk audit:
  - No calculation, SQL or finance data changes.
  - Scope is runtime module export compatibility only.
