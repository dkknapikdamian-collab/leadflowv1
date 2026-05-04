# STAGE51 — Clients/Case contrast hotfix — 2026-05-04

## Cel
Poprawić czytelność kontrastu na stronach Klienci, Klient i Sprawa bez przebudowy layoutu.

## Zakres
- src/pages/ClientDetail.tsx
- src/styles/visual-stage12-client-detail-vnext.css
- src/styles/visual-stage05-clients.css
- src/styles/visual-stage08-case-detail.css
- scripts/check-stage51-clients-case-contrast-hotfix.cjs
- tests/stage51-clients-case-contrast-hotfix.test.cjs
- package.json

## Zmieniono
- Podbito kontrast tekstów pomocniczych i wartości na stronie klienta.
- Zmniejszono drobne teksty i badge w widokach klienta oraz sprawy.
- Podbito kontrast prostych filtrów i elementów pomocniczych na stronie Klienci.

## Weryfikacja
- npm.cmd run check:stage51-clients-case-contrast-hotfix
- npm.cmd run build

## Smoke test ręczny
1. Wejdź na Klienci i sprawdź kartę Filtry proste.
2. Wejdź w klienta i sprawdź czytelność kart i badge.
3. Wejdź w sprawę i sprawdź czy tekst pomocniczy nie jest za duży ani za jasny.
