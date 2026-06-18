# 2026-06-18 - STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND

- data i godzina: 2026-06-18 05:35 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- problem: Brak był w dobrej grupie, ale jako "Zadanie · Zaległe"; w CaseDetail trafiał do "Wszystkie aktywne" jako task.
- przyczyna: timeline/task row tracił metadane missing_item albo nie używał activity missing_item_created jako źródła klasyfikacji.
- zmiana: LeadDetail markeruje activity-bridged missing rows; ContextActionDialogs wysyła wzbogacony savedRecord; CaseDetail wzbogaca taski z activity metadata przed buildWorkItems.
- SQL: NIE.
- ryzyko: jeśli API nie zwraca activity missing_item_created, trzeba dalej sprawdzać backend read model.
