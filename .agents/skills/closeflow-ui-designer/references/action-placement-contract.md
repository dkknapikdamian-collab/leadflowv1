# Action Placement Contract

Same function must appear in the same logical place across comparable screens.

## Required target regions

- `entity-header-action-cluster`: edit/open/back/secondary actions for the entity itself.
- `activity-panel-header`: add note and activity-related actions.
- `tasks-panel-header`: add task and task-related actions.
- `cases-panel-header`: add/open cases.
- `form-footer`: save/cancel actions.
- `danger-zone` or `secondary-action-menu`: destructive actions.

## Example

`Dodaj notatkę` should not appear as:

- quick action in one screen,
- card body button in another,
- history form in a third,

unless those are explicitly different actions. Normalize to `activity-panel-header` when possible.
