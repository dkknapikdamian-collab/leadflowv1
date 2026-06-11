
# STAGE231D0C-R2 - ClientDetailHeader visual freeze + visible icons

Data: 2026-06-11 Europe/Warsaw
Marker: STAGE231D0C_R2_CLIENT_DETAIL_HEADER_FREEZE
Status: LOCAL_APPLY_PREPARED / DO_PUSH_AFTER_PASS

## Cel
Zamrozić ClientDetailHeader jako wzorzec DetailHeader dla kart detail oraz wymusić widoczność ikon w akcjach headera.

## Zmienione pliki
- src/styles/visual-stage12-client-detail-vnext.css
- _project/UI_DICTIONARY_STAGE231D0A.md
- scripts/check-stage231d0c-r2-client-detail-header-freeze.cjs
- tests/stage231d0c-r2-client-detail-header-freeze.test.cjs
- centralne pliki _project

## Testy
- R2 header freeze guard
- R2 node test
- D0C baseline guard/test
- R12 measured axis regression, jeśli istnieje
- D0B ClientListCard regression, jeśli istnieje
- npm run build
- git diff --check

## Audyt ryzyk
- Globalne style button/svg mogą ukryć ikony w przyszłości, dlatego R2 guard sprawdza reguły svg dla header actions.
- Nie zmieniano JSX, więc ryzyko regresji danych i routingu jest niskie.
- Manual QA: /clients/<id>, Ctrl+F5, ikony w Zapytaj AI i Otwórz główną sprawę są widoczne.
