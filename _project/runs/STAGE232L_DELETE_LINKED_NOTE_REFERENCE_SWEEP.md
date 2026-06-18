# STAGE232L_DELETE_LINKED_NOTE_REFERENCE_SWEEP

- data i godzina: 2026-06-18 03:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- Owner Control: NIE
- zakres: CaseDetail task delete linked-note ReferenceError

## Audyt

Błąd produkcyjny:
- "Nie udało się usunąć: getLinkedNoteForTaskStage231H_R1D2_R15C is not defined"

Wynik mapowania:
- helper undefined występuje w aktywnym handlerze CaseDetail -> handleConfirmDeleteWorkItem -> task branch,
- istnieje prawidłowy helper findCaseNoteForFollowUpTaskStage231H_R1D2_R15C(task),
- ClientDetail nie zawiera tego helpera,
- LeadDetail i TodayStable mają własne delete flow dla zadań/wydarzeń; nie są źródłem tego ReferenceError.

## Zmiana

- CaseDetail task delete używa zdefiniowanego helpera findCaseNoteForFollowUpTaskStage231H_R1D2_R15C(task),
- guard blokuje każde odwołanie do getLinkedNoteForTaskStage231H_R1D2_R15C w detalach,
- zachowane są gałęzie task/event/missing.

## Ryzyka

- deleteTaskFromSupabase/deleteEventFromSupabase w innych widokach mogą mieć osobne problemy API, ale to nie jest ten ReferenceError.
- Jeżeli po tej poprawce pojawi się METHOD_NOT_ALLOWED dla task/event, trzeba zrobić osobny soft-delete sweep dla endpointów, nie mieszać z helper reference fix.
