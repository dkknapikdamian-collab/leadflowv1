# STAGE231D2_CASE_COSTS_IN_CASE_RUN

Data i godzina: 2026-06-10 18:55 Europe/Warsaw

## FAKTY
- D1 dodał centralny model kosztów w src/lib/finance/case-costs-source.ts.
- D2 dodaje SQL, API route /api/case-costs, wrappery Supabase oraz panel kosztów w CaseDetail.
- STAGE231D2_CASE_COSTS_IN_CASE jest etapem z SQL.

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
- SQL musi zostać uruchomiony w Supabase przed realnym użyciem zapisu kosztów. Bez tabeli API zwróci błąd Supabase, ale aplikacja nie powinna ukrywać tego błędu.
- D2 dotyka CaseDetail, więc największe ryzyko to regresja w prawym panelu finansowym. Guard pilnuje markerów i D1/D0 regresji.
- RLS jest celowo ostrożny: service_role ma zapis, authenticated ma tylko select przez workspace membership/owner.

## następny krok
Po PASS i push D2: uruchomić SQL w Supabase, wykonać ręczny test dodania kosztu w sprawie, potem przejść do D3 — finanse klienta + koszty.
