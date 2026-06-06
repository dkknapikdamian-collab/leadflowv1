# STAGE220A36-R10 — Commission Modal Three-Field Top Row Polish — REPORT

Data: 2026-06-06 08:55 Europe/Warsaw

## WERDYKT
R10 jest polish UX po R7/R9: model danych zostaje, zmienia sie uklad i copy widocznego modala CaseDetail.

## ZAKRES
- src/pages/CaseDetail.tsx
- src/styles/closeflow-case-finance-modal-stage220a30.css
- scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- tests/stage220a36r7-case-detail-legacy-finance-modal.test.cjs
- nowy guard/test R10
- package.json
- _project ledger/report/obsidian update

## AUDYT RYZYK
- Nie ruszano Supabase, RLS, API, platnosci ani logiki zapisu.
- Ryzyko: stary cache przegladarki moze pokazac poprzedni modal do twardego odswiezenia.
- Ryzyko: osobny blad /api/case-items 500 wymaga Response z Network, jesli nadal wystepuje.
