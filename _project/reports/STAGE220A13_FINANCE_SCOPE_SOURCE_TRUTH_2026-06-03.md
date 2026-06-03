# STAGE220A13 - Finance scope source truth - 2026-06-03

## Cel

Ujednolicić finanse klienta i finanse sprawy bez mieszania zakresów danych.

## Decyzja Damiana

- Finanse klienta sumują wszystkie sprawy klienta.
- Finanse sprawy dotyczą tylko jednej konkretnej sprawy.
- Panel finansów sprawy ma wyglądać jak panel finansów klienta, ale z nazewnictwem "Finanse sprawy".
- Oba panele mają korzystać ze wspólnego źródła prawdy wizualnego.

## Zakres wdrożenia

Zmieniono:
- src/lib/finance/case-finance-source.ts
- src/lib/client-finance.ts
- src/pages/ClientDetail.tsx
- src/pages/CaseDetail.tsx
- src/styles/finance/closeflow-finance.css
- scripts/check-stage220a13-finance-scope-source-truth.cjs

## Co poprawiono

- Dodano tryb all_cases do helpera finansów klienta.
- ClientDetail liczy finanse klienta jako sumę wszystkich spraw klienta.
- CaseDetail pokazuje panel Finanse sprawy z tego samego wzorca wizualnego.
- CaseDetail używa caseFinanceSummary jako źródła finansów jednej sprawy.
- Dodano wspólne klasy wizualne cf-finance-scope-card.

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- migracje
- logika tworzenia płatności

## Testy

Wymagane:
- npm run build
- node scripts/check-stage220a11-case-detail-tabs-production.cjs
- node scripts/check-stage220a12-case-detail-tabs-micro-polish.cjs
- node scripts/check-stage220a13-finance-scope-source-truth.cjs
