# STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE

- data i godzina: 2026-06-18 03:45 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- zakres: CaseDetail missing_item active filter and delete closure

## Audyt

Po STAGE232K i STAGE232L zwykle zadanie kasuje się poprawnie. Problem został tylko dla wpisu typu "Brak" w CaseDetail: po komunikacie "Brak usunięty" ekran miga, ale brak zostaje widoczny.

Wynik mapowania:
- CaseDetail buduje missing_item z tasków przez isStage232I1CaseMissingTaskSource.
- buildWorkItems filtruje missing_item tylko przez isStage232I1ResolvedCaseMissingTask.
- isStage232I1ResolvedCaseMissingTask uznawał tylko done/completed/accepted.
- Brakowało statusów deleted/rejected/resolved/archived/cancelled/canceled.
- Gałąź target.kind === 'missing' dla task-based missing_item nie ustawiała jawnie payload.status deleted i nie zamykała lokalnego state.

## Zmiana

- isStage232I1ResolvedCaseMissingTask ma listę inactiveStatusesStage232M: done, completed, accepted, deleted, rejected, resolved, archived, cancelled, canceled.
- missing_item delete branch używa updateTaskInSupabase({ status: 'deleted', payload.status: 'deleted' }).
- po sukcesie setTasks lokalnie oznacza brak jako deleted, żeby row zniknął bez czekania na pełny reload.
- normalny task delete branch zostaje osobno.

## Ryzyka

- Jeśli row wróci po odświeżeniu, problem jest w backend persistence/updateTaskInSupabase albo w mapowaniu statusu z API.
- Podobny filtr statusów powinien być później ujednolicony między CaseDetail i ClientDetail, ale ten etap naprawia konkretny błąd CaseDetail.
