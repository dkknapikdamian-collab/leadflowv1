# HOTFIX - Global Zadanie opens modal without route change

**Data:** 2026-05-04  
**Branch:** `dev-rollout-freeze`

## Co poprawiamy

1. Zadanie w górnym pasku otwiera modal dodania zadania.
2. Kliknięcie Zadanie nie przenosi do /tasks.
3. zielony przycisk dodawania zadania w /tasks jest usunięty.
4. v5 używa blokowego czyszczenia JSX, żeby nie łapać fałszywych dopasowań między różnymi przyciskami.
5. Modal w górnym pasku zapisuje przez `insertTaskToSupabase` i wymaga `workspaceId`.

## Kryterium zakończenia

```text
npm.cmd run check:hotfix-global-task-action-modal-no-route
npm.cmd run build
```

## Test ręczny

1. Otwórz dowolny ekran, np. `Dziś`.
2. Kliknij `Zadanie` na górnym pasku.
3. Ma otworzyć się modal `Nowe zadanie`.
4. URL nie może zmienić się na `/tasks`.
5. Wejdź w `/tasks`.
6. Zielony przycisk dodawania zadania nie powinien być widoczny.
