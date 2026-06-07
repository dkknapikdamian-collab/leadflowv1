# STAGE227E0_DETAIL_SHELL_WIDTH_AUDIT

Data: 2026-06-07
Tryb: local-only, bez pushu.

## Cel
Naprawic klase bledu fosa na detail pages: LeadDetail, ClientDetail i CaseDetail maja korzystac z jednego kontraktu szerokosci, stabilnego guttera i pelnej dostepnej szerokosci shellu.

## Zakres
- Nie zmieniono danych, SQL, Supabase ani logiki akcji.
- Nie przebudowano LeadDetail.
- Dodano shared CSS contract w src/styles/closeflow-unified-page-canvas-stage211c.css.
- Dodano guard i test Stage227E0.

## Decyzja
Nie usuwamy jeszcze historycznych max-width: 1480px z plikow detail CSS, bo to wiekszy refaktor. Stage227E0 nadpisuje je jednym wspolnym source of truth w unified canvas CSS.

## Testy
- node scripts/check-stage227e0-detail-shell-width-audit.cjs
- node --test tests/stage227e0-detail-shell-width-audit.test.cjs
- regresja E4R3 / E3
- npm run build
- git diff --check
