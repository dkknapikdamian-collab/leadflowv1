# STAGE220A12 - CaseDetail tabs micro polish - 2026-06-03

## Cel

Mikro-poprawka po ręcznym teście UI:
- minimalnie większe ikonki w zakładkach,
- minimalny odstęp między ikonką i tekstem,
- w zakładce Historia zostaje tylko pogrubiony nagłówek "Historia sprawy".

## Zakres

Zmieniono:
- src/pages/CaseDetail.tsx
- src/styles/closeflow-case-detail-stage220a10-tabs-layout-repair.css
- scripts/check-stage220a12-case-detail-tabs-micro-polish.cjs

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- finanse
- logika historii
- buildCaseHistoryItemsStage14D

## Testy

Wymagane:
- npm run build
- node scripts/check-stage220a11-case-detail-tabs-production.cjs
- node scripts/check-stage220a12-case-detail-tabs-micro-polish.cjs

## Test ręczny

Sprawdzić CaseDetail:
- ikonki nie nachodzą na tekst,
- odstęp jest mały,
- Historia pokazuje tylko nagłówek "Historia sprawy" nad listą.
