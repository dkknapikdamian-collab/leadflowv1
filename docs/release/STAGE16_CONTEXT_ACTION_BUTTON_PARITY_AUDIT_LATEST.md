# STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_V1

GeneratedAt: `2026-05-06T11:47:18.150Z`

## Cel

Sprawdzic, czy przyciski kontekstowe zadanie / wydarzenie / notatka nie rozjezdzaja sie na kilka roznych sciezek zapisu ani kilka roznych dialogow.

## Wynik

- OVERALL: `PASS`
- Checks: `35`
- Failed: `0`

## Tabela

| Status | Area | Check | Evidence |
| --- | --- | --- | --- |
| PASS | `files` | src/pages/LeadDetail.tsx exists | `present` |
| PASS | `files` | src/pages/ClientDetail.tsx exists | `present` |
| PASS | `files` | src/pages/CaseDetail.tsx exists | `present` |
| PASS | `files` | src/components/ContextActionDialogs.tsx exists | `present` |
| PASS | `files` | src/components/TaskCreateDialog.tsx exists | `present` |
| PASS | `files` | src/components/EventCreateDialog.tsx exists | `present` |
| PASS | `files` | src/components/ContextNoteDialog.tsx exists | `present` |
| PASS | `shared-host` | ContextActionDialogs exports explicit kind attr | `data-context-action-kind` |
| PASS | `shared-host` | ContextActionDialogs supports explicit click context | `buildContextFromExplicitClick` |
| PASS | `shared-host` | ContextActionDialogs keeps text fallback | `text fallback still present` |
| PASS | `shared-host` | ContextActionDialogs opens one task dialog | `TaskCreateDialog host count: 1` |
| PASS | `shared-host` | ContextActionDialogs opens one event dialog | `EventCreateDialog host count: 1` |
| PASS | `shared-host` | ContextActionDialogs opens one note dialog | `ContextNoteDialog host count: 1` |
| PASS | `src/pages/LeadDetail.tsx` | uses openContextQuickAction | `openContextQuickAction` |
| PASS | `src/pages/LeadDetail.tsx` | does not import TaskCreateDialog directly | `no direct task dialog import` |
| PASS | `src/pages/LeadDetail.tsx` | does not import EventCreateDialog directly | `no direct event dialog import` |
| PASS | `src/pages/LeadDetail.tsx` | action labels route through shared context host when present | `Zaplanuj spotkanie, Zaplanuj telefon, follow-up, Dodaj notat, Dopisz notat` |
| PASS | `src/pages/LeadDetail.tsx` | no local create dialog host marker duplication | `detail page should not host create dialogs` |
| PASS | `src/pages/ClientDetail.tsx` | uses openContextQuickAction | `openContextQuickAction` |
| PASS | `src/pages/ClientDetail.tsx` | does not import TaskCreateDialog directly | `no direct task dialog import` |
| PASS | `src/pages/ClientDetail.tsx` | does not import EventCreateDialog directly | `no direct event dialog import` |
| PASS | `src/pages/ClientDetail.tsx` | action labels route through shared context host when present | `Dodaj zadanie, Dodaj notat` |
| PASS | `src/pages/ClientDetail.tsx` | no local create dialog host marker duplication | `detail page should not host create dialogs` |
| PASS | `src/pages/CaseDetail.tsx` | uses openContextQuickAction | `openContextQuickAction` |
| PASS | `src/pages/CaseDetail.tsx` | does not import TaskCreateDialog directly | `no direct task dialog import` |
| PASS | `src/pages/CaseDetail.tsx` | does not import EventCreateDialog directly | `no direct event dialog import` |
| PASS | `src/pages/CaseDetail.tsx` | action labels route through shared context host when present | `Dodaj zadanie, Dodaj wydarzenie, follow-up, Dodaj notat` |
| PASS | `src/pages/CaseDetail.tsx` | no local create dialog host marker duplication | `detail page should not host create dialogs` |
| PASS | `TaskCreateDialog` | task dialog saves through insertTaskToSupabase | `insertTaskToSupabase` |
| PASS | `TaskCreateDialog` | task dialog preserves lead/case/client relation ids | `leadId/caseId/clientId` |
| PASS | `TaskCreateDialog` | task dialog saves workspaceId | `workspaceId` |
| PASS | `EventCreateDialog` | event dialog saves through insertEventToSupabase | `insertEventToSupabase` |
| PASS | `EventCreateDialog` | event dialog preserves lead/case/client relation ids | `leadId/caseId/clientId` |
| PASS | `EventCreateDialog` | event dialog writes scheduledAt from startAt | `scheduledAt: form.startAt` |
| PASS | `EventCreateDialog` | event dialog saves workspaceId | `workspaceId` |

## Decyzja

PASS: akcje kontekstowe korzystaja ze wspolnego hosta i wspolnych dialogow. To nie potwierdza kazdego klikniecia runtime, ale blokuje najgrozniejsze regresje statyczne.
