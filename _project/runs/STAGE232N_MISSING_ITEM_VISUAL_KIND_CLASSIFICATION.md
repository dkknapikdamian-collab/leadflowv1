# STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION

- data i godzina: 2026-06-18 04:45 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- zakres: LeadDetail/CaseDetail missing_item visual classification and no-flicker metadata

## Audyt

Brak jest zapisywany jako task z type/kind/status missing_item. To jest obecny model danych. Błąd był w prezentacji:
- ContextActionDialogs emituje no-flicker mutation jako kind task.
- LeadDetail buildTimeline mapuje każdy task jako kind task.
- LeadDetail renderuje label wiersza po entry.kind, więc missing_item wygląda jak "Zadanie".
- LeadDetail jednocześnie rozpoznaje isMissingItemTimelineEntry i pokazuje akcje "Rozwiąż brak" / "Usuń brak", więc klasyfikacja biznesowa istnieje, ale nie była używana do etykiety.

## Zmiana

- LeadDetail dodaje helpery STAGE232N dla etykiety Brak/Blokada i statusu Brak/Blokada.
- LeadDetail wiersze nie renderują missing_item jako zwykłe Zadanie.
- ContextActionDialogs zostawia persistence jako task, ale dodaje displayKind/businessKind i record do no-flicker mutation.
- CaseDetail klasyfikacja task-based missing_item jako kind missing zostaje zabezpieczona guardem.

## Ryzyka

- To nie rozwiązuje starych legacy case_items/checklist; to osobny etap STAGE232O, jeśli Damian potwierdzi.
- Jeśli po hard refreshu LeadDetail nadal pokazuje Brak jako Zadanie, trzeba sprawdzić, czy dane z API tracą payload/type/status missing_item.
