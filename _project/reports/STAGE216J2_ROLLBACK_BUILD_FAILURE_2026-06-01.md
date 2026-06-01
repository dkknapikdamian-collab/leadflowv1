---
typ: project_report
stage: STAGE216J2_ROLLBACK
status: rollback_after_build_failure
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J2 rollback - build failure

## FAKTY

- Commit b91519ce wprowadził Stage216-J2 workbench layout.
- Build padł na uszkodzonym JSX w LeadDetail.tsx.
- Cofamy tylko b91519ce przez git revert, bo commit był już na origin/dev-rollout-freeze.

## TESTY

- npm run build po rollbacku.
- Vercel visual review po deployu rollbacku.

## NASTĘPNY KROK

- Po przywróceniu builda przygotować Stage216-J3 mniejszymi krokami.