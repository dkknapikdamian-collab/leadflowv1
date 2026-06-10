# STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX — run report

Data i godzina: 2026-06-10 19:25 Europe/Warsaw

## FAKTY
- Vercel Hobby deployment blocker: przekroczony limit Serverless Functions po dodaniu api/case-costs.ts.
- D2 SQL i model case_costs zostają bez zmian.
- R3 usuwa osobny endpoint api/case-costs.ts i konsoliduje koszty pod api/cases.ts?resource=costs.
- Frontend dalej używa fetchCaseCostsFromSupabase/createCaseCostInSupabase, ale wrappery kierują ruch na /api/cases?resource=costs.

## TESTY
- npm run check:stage231d2-case-costs-in-case
- npm run test:stage231d2-case-costs-in-case
- npm run check:stage231d2r3-vercel-function-budget
- npm run test:stage231d2r3-vercel-function-budget
- npm run check:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

## audyt ryzyk
- Największe ryzyko: wpięcie kosztów w api/cases.ts nie może naruszyć zwykłego GET/POST/PATCH/DELETE dla spraw.
- Dlatego routing kosztów działa tylko przy resource=costs/case-costs/case_costs i kończy request przez return.
- Write access dla kosztów nadal idzie przez assertWorkspaceWriteAccess.
- D2 manualny test Dodaj koszt trzeba powtórzyć po deployu, bo zmieniła się ścieżka API.

## następny krok
Po PASS R3: commit/push, deploy, ręczny test Dodaj koszt w sprawie i potwierdzenie, że Vercel nie blokuje deploymentu limitem funkcji.
