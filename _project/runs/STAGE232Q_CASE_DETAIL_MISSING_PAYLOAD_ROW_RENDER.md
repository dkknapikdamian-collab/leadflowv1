# STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER

- data i godzina: 2026-06-18 15:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- zakres: CaseDetail WorkItemRow missing_item payload render

## Audyt

Problem:
- CaseDetail "Braki i blokady" pokazuje licznik 1/2 i po rozwinięciu nie pokazuje wierszy.

Wynik:
- grupa "Braki i blokady" liczy i bierze items z tego samego źródła: workItems.filter(entry.kind === 'missing').
- renderer mapuje group.items do WorkItemRow.
- WorkItemRow ma guard: if (isCaseActivitySourceForWorkRow(entry.source)) return null.
- isCaseActivitySourceForWorkRow traktował każdy source z polem payload jako activity.
- task-based missing_item ma payload, więc był liczony jako missing, ale WorkItemRow zwracał null.

## Zmiana

- isCaseActivitySourceForWorkRow nie traktuje już payload-only source jako activity.
- aktywnością jest tylko explicit activity shape: eventType albo actorType.
- source z kształtem work row / task / event / case item nie jest ukrywany.
- guard/test blokują powrót payload-only activity detection.

## Ryzyka

- Jeśli po tym nadal lista jest pusta, trzeba sprawdzić CSS display/hide dla .stage220a8-work-row-missing.
