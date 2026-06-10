# STAGE231D2-R6 — CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- cel: skrócić górny pasek z nazwą klienta/sprawy i podciągnąć prawy rail do zwolnionego miejsca u góry.
- scope: CSS/layout + markery guard; bez SQL, bez API, bez finansów i bez zmiany zapisu kosztów.

## Zmiany

- src/pages/CaseDetail.tsx: dodano marker i data-attrs dla top strip / rail lift.
- src/styles/case-detail-stage228r9-shell-rail-lift.css: dodano STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT.
- package.json: dodano guard/test R6.
- scripts/check-stage231d2r6-case-detail-top-rail-lift.cjs: guard układu.
- tests/stage231d2r6-case-detail-top-rail-lift.test.cjs: test guarda.

## Testy

- npm run check:stage231d2r6-case-detail-top-rail-lift
- npm run test:stage231d2r6-case-detail-top-rail-lift
- npm run check:stage231d2r5-case-detail-render-crash
- npm run test:stage231d2r5-case-detail-render-crash
- npm run check:stage231d2-case-costs-in-case
- npm run check:stage231d2r3-vercel-function-budget
- npm run build
- git diff --check

## Audyt ryzyk

- Ryzyko: zbyt duży negative margin może na wąskich ekranach zachodzić na header. Mitigacja: reset dla max-width 1220px.
- Ryzyko: prawa kolumna jest dokładnie 320px, a header skracany o 342px; przy przyszłej zmianie szerokości rail trzeba zsynchronizować te wartości.
- Ryzyko: etap jest CSS-first; finalną ocenę robić po deployu na produkcji, nie lokalnym klikaniem.

## Następny krok

- Push po PASS, deploy, produkcyjnie sprawdzić kartę sprawy: top title strip ma kończyć się przed prawą kolumną, a prawy rail ma zaczynać się u samej góry.
