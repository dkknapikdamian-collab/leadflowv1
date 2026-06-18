# STAGE232I2_R4_CLIENT_MISSING_DELETE_NO_DELETE_ROUTE

- data i godzina: 2026-06-18 01:25 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_LOCAL / WAITING_GUARD
- SQL: NIE
- Owner Control: NIE

## Problem

Po R3 Damian potwierdzil, ze usuwanie Braku u klienta nadal pokazuje METHOD_NOT_ALLOWED.

## Diagnoza

Aktywny klik przycisku Usuń w panelu Braki / Blokady klienta nadal dochodzil do sciezki delete albo do handlera, ktory w runtime konczy sie METHOD_NOT_ALLOWED.

## Zmiana

Przycisk z data-stage232i2-delete-source-item nie wolno juz kierowac do delete handlera. Klik zamyka aktywny wpis przez dzialajacy update/resolve flow: handleResolveClientMissingItemStage228R13(item). To usuwa wpis z aktywnej listy bez fizycznego DELETE.

## Testy

- node scripts/check-stage232i2-r4-client-missing-delete-no-delete-route.cjs
- node --test tests/stage232i2-r4-client-missing-delete-no-delete-route.test.cjs
- R3 guard/test
- I2 guard/test
- CF-RUNTIME-00
- npm run build
- npm run verify:closeflow:quiet
