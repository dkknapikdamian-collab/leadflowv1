# 2026-06-18 - STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER

- data i godzina: 2026-06-18 15:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- problem: CaseDetail "Braki i blokady" ma licznik, ale rozwinięta lista nie pokazuje wierszy.
- przyczyna: WorkItemRow ukrywał task-based missing_item, bo isCaseActivitySourceForWorkRow uznawał samo payload za activity.
- zmiana: activity detection wymaga eventType/actorType i nie ukrywa work-row shape.
- SQL: NIE.
- ryzyko: jeśli dalej pusto, sprawdzić CSS display/hide.
