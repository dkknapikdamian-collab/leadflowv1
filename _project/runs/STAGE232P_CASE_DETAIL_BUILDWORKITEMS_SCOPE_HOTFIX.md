# STAGE232P_CASE_DETAIL_BUILDWORKITEMS_SCOPE_HOTFIX

- data i godzina: 2026-06-18 14:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- zakres: CaseDetail production crash hotfix

## Błąd produkcyjny

Po STAGE232O widok CaseDetail wyrzucał:
- ReferenceError: taskWithMissingBridgeStage232O is not defined

## Przyczyna

Patcher STAGE232O podmienił wywołanie w buildWorkItems:
- getTaskNoteFollowUpPreviewStage231H_R1D2_R11(taskWithMissingBridgeStage232O)

Zmienna taskWithMissingBridgeStage232O istnieje tylko w useMemo openTasksWithNoteFollowUpPreviewStage231H_R1D2_R11, a nie w buildWorkItems. Vite build tego nie złapał, bo nie robi pełnego typecheckingu.

## Zmiana

- buildWorkItems używa lokalnego task.
- zmienna taskWithMissingBridgeStage232O zostaje tylko w prawidłowym scope useMemo.
- guard/test blokują taskWithMissingBridgeStage232O w bloku buildWorkItems.

## Ryzyka

- Po deployu sprawdzić wejście w dowolny CaseDetail.
- Jeśli widok działa, wrócić do smoke Brak/Blokada.
