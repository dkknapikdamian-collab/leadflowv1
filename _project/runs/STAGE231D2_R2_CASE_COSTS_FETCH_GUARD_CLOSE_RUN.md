# STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE — run report

Data i godzina: 2026-06-10 19:10 Europe/Warsaw

## FAKTY
- R2 domyka D2 po lokalnym FAIL guardu: CaseDetail nie zawierał tokenu fetchCaseCostsFromSupabase.
- R2 nie dodaje nowego SQL i nie zmienia modelu D1.
- R2 dopina import fetchCaseCostsFromSupabase/createCaseCostInSupabase w CaseDetail oraz fetch kosztów do Promise.all ładowania sprawy.

## TESTY
- npm run check:stage231d2-case-costs-in-case
- npm run test:stage231d2-case-costs-in-case
- npm run check:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

## audyt ryzyk
- Największe ryzyko D2 pozostaje po stronie SQL: bez tabeli case_costs zapis kosztu w aplikacji nie przejdzie.
- R2 dotyka tylko integracji CaseDetail z API kosztów; nie zmienia prowizji, płatności ani delete flow.
- Build może ujawnić problemy TypeScript, dlatego R2 wymusza build przed pushem.

## następny krok
Po PASS R2: uruchomić SQL D2 w Supabase, ręcznie dodać koszt w sprawie, potem commit/push D2.
