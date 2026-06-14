# 2026-06-14 - STAGE231G R5 guard/test encoding final hotfix

- data i godzina: 2026-06-14 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- report_id: STAGE231G_R5_GUARD_TEST_ENCODING_FINAL_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: hotfix guard/test po bledzie R4
- status: do potwierdzenia wynikiem lokalnego PASS

## Powod

R4 wywalil sie w tymczasowym writerze Node przez zagniezdzone template literals. Nie nadpisal starego guardu z BOM i starego testu z mojibake regex.

## Zmiana

R5 nadpisuje guard i test jako UTF-8 bez BOM, ASCII-only, oparte o stabilne markery data-stage231g-*.

## Testy

- node scripts/check-stage231g-lead-detail-operational-wiring.cjs
- node --test tests/stage231g-lead-detail-operational-wiring.test.cjs
- npm run build
- git diff --check

## Audyt ryzyk

Nie ruszano runtime aplikacji. Ryzyko glowne zostaje manualne: sprawdzic w UI zapis potencjalu z karty leada, z panelu finansow i przy dodawaniu leada.