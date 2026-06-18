# 2026-06-18 - STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE

- data i godzina: 2026-06-18 03:45 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- problem: CaseDetail missing_item po usunięciu dalej widoczny mimo toast "Brak usunięty".
- przyczyna: isStage232I1ResolvedCaseMissingTask nie traktował deleted/rejected/resolved jako nieaktywnych.
- zmiana: filtr inactive statusów + jawny updateTaskInSupabase status deleted + lokalny setTasks closure.
- SQL: NIE.
- ryzyko: jeśli po refreshu wróci, sprawdzić backend persistence/updateTaskInSupabase.
