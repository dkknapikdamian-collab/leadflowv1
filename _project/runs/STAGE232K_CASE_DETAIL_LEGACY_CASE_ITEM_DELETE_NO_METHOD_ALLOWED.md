# STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED

- data i godzina: 2026-06-18 02:25 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- Owner Control: NIE
- ClientDetail: NIE

## Audyt

METHOD_NOT_ALLOWED dotyczy CaseDetail -> Działania sprawy -> legacy case_items/checklist. Aktywny kosz wołał deleteCaseItemFromSupabase(item.id), czyli DELETE /api/case-items.

## Zmiana

- legacy case_items/checklist nie używa już fizycznego DELETE,
- kosz zamyka wpis przez updateCaseItemInSupabase({ status: 'rejected' }),
- działa jak bezpieczne Odrzuć,
- wpis powinien zniknąć z aktywnych działań,
- bez SQL, bez ClientDetail.

## Risk audit

Jeżeli wpis wróci po odświeżeniu, następny fix dotyczy filtra aktywnych działań, nie DELETE.
