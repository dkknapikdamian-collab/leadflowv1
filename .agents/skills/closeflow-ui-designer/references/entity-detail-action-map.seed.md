# Entity Detail Action Placement Seed

## Rule

Same function = same logical region.

| Function | ClientDetail | LeadDetail | CaseDetail | Target logical region |
|---|---|---|---|---|
| Dodaj notatkę | must be audited; possible duplicate entry points | must be audited; likely local contact/history form | must be audited; likely operational add panel | activity-panel-header |
| Dodaj zadanie | must be audited | must be audited | must be audited | tasks-panel-header |
| Edytuj dane | entity profile/header | entity profile/header | entity profile/header | entity-header-action-cluster |
| Usuń | secondary/danger menu or confirm flow | secondary/danger menu or confirm flow | secondary/danger menu or confirm flow | danger-zone or secondary action menu |
| Kopiuj dane kontaktowe | inline contact row | inline contact row | if present, inline contact row | info-row-inline-action |

## First normalization target

Start with destructive/delete style, then normalize `Dodaj notatkę` placement.
