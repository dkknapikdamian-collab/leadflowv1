---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216J2_ROLLBACK
status: rollback_after_build_failure
date: 2026-06-01
---

# 2026-06-01 - CloseFlow Stage216-J2 rollback build failure

## FAKTY

- Stage216-J2 został wypchnięty jako b91519ce.
- Build padł na uszkodzonym JSX w LeadDetail.tsx.
- Rollback jest potrzebny, żeby przywrócić działający build i Vercel deploy.

## DECYZJE

- Cofamy tylko b91519ce przez git revert.
- Nie używać git add .
- Następny J3 musi być mniejszy i bardziej kontrolowany.

## NASTĘPNY KROK

- Po rollbacku i build PASS sprawdzić Vercel.