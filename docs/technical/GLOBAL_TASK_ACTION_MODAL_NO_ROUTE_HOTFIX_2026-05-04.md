# GLOBAL TASK ACTION MODAL NO ROUTE HOTFIX

## Files

```text
src/components/GlobalQuickActions.tsx
src/pages/Tasks.tsx
```

## Contract

`Zadanie` in the global top bar:

```text
data-global-task-create-dialog-trigger="true"
data-global-task-create-dialog="true"
data-global-task-create-form="true"
```

Must:

```text
openGlobalTaskDialog
handleGlobalTaskSubmit
insertTaskToSupabase
requireWorkspaceId(workspace)
```

Must not:

```text
navigate to /tasks?quick=task
call rememberGlobalQuickAction('task')
use Button asChild + Link for task global action
```

## Tasks page

The green/primary add task button in `/tasks` is removed.
