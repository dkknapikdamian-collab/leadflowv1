# 2026-06-18 - STAGE232P_CASE_DETAIL_BUILDWORKITEMS_SCOPE_HOTFIX

- data i godzina: 2026-06-18 14:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- problem: CaseDetail po STAGE232O nie ładował widoku przez ReferenceError taskWithMissingBridgeStage232O is not defined.
- przyczyna: buildWorkItems używał zmiennej z innego scope.
- zmiana: buildWorkItems używa lokalnego task; guard blokuje taskWithMissingBridgeStage232O w buildWorkItems.
- SQL: NIE.
- ryzyko: Vite build nie łapie takich ReferenceError bez typecheckingu; dodać guardy runtime-scope dla podobnych zmian.
