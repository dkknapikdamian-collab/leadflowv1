# STAGE232F_TASKS_OPERATIONAL_WORKQUEUE_SOURCE_OF_TRUTH - audit / run decision

Data: 2026-06-15 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DOCS_PREPARED / DO_WDROZENIA
Tryb: audit-first / source-of-truth / no runtime changes in this package

## Scan proof

Przeczytane pliki repo:

- `src/App.tsx`
- `src/pages/TasksStable.tsx`
- `src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`

Lokalnego Obsidiana nie aktualizowano bezpośrednio z tego pakietu. Payload do synchronizacji jest w `_project/obsidian_updates/`.

## Fakty z kodu

- `/tasks` routuje do `src/pages/TasksStable.tsx`.
- `TasksStable.tsx` pobiera `tasks` i `cases`.
- `active` = wszystkie taski, które nie są done.
- `today` = taski niezrobione z datą równą `localDateKey()`.
- `overdue` = taski niezrobione z datą mniejszą niż `localDateKey()`.
- `done` = status done/completed/closed/cancelled/canceled.
- `high` = niezrobione i priority high/urgent/wysoki/pilne.
- `unlinked` = brak leadId/caseId/clientId.
- Lista grupuje filteredTasks w overdue/today/upcoming/no_due/done.
- `Najpilniejsze zadania` bierze top 5 ze wszystkich niezrobionych zadań, niezależnie od aktywnego scope.
- Klik urgent item ustawia scope active/done i searchQuery na tytuł zadania.
- Delete używa optimistic local removal i confirm dialog.
- Po oznaczeniu taska jako done może pojawić się modal kolejnego kroku.

## Decyzja produktu

Zakładka `Zadania` ma być operacyjną kolejką pracy, nie prostą listą. Liczniki i grupy muszą jasno mówić, co jest zaległe, dzisiejsze, przyszłe, bez terminu, wysokiego priorytetu, bez powiązania i zrobione.

## Wdrożenie R1

Patrz etap `STAGE232F_TASKS_OPERATIONAL_WORKQUEUE_SOURCE_OF_TRUTH` w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.

## Ryzyka

- Klasyfikacja dat przez `slice(0,10)` może dać błędy przy UTC/strefie.
- `cancelled` liczone jako `done` jest uproszczeniem.
- `Bez powiązania` może kłamać, jeśli relacja siedzi w payload/meta/relatedId.
- `Najpilniejsze zadania` jako globalne może mylić przy aktywnym filtrze, jeśli UI tego nie wyjaśnia.
- Klik urgent item przez search po tytule może trafić wiele podobnych zadań albo nie trafić po zmianie tytułu.

## Guardy do dodania

- `scripts/check-stage232f-tasks-operational-workqueue.cjs`
- `tests/stage232f-tasks-operational-workqueue.test.cjs`

## Test ręczny

Zobacz sekcję etapu w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.
