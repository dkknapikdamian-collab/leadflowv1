# STAGE232I2_R3_CLIENT_MISSING_DELETE_SOFT_DELETE

- data i godzina: 2026-06-18 01:00 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- Owner Control: NIE

## Problem

Przy probie usuniecia Braku u klienta aplikacja pokazala METHOD_NOT_ALLOWED.

## Diagnoza

Handler usuwania Braku klienta nie powinien isc sciezka fizycznego DELETE. Dla active missing_item zgodne z I0/I2 jest soft-delete po zrodlowym task/work item id.

## Zmiana

- handleDeleteClientMissingItemStage228R15 uzywa updateTaskInSupabase.
- status: deleted.
- payload: stage232i2DeleteMode=soft_delete_no_method_delete.
- usuniety Brak znika z aktywnej listy przez filtr deleted.

## Testy

- node scripts/check-stage232i2-r3-client-missing-delete-soft-delete.cjs
- node --test tests/stage232i2-r3-client-missing-delete-soft-delete.test.cjs
- node scripts/check-stage232i2-client-detail-missing-blocker-runtime.cjs
- node --test tests/stage232i2-client-detail-missing-blocker-runtime.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm run build
- npm run verify:closeflow:quiet
