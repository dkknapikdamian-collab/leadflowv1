# STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1

Data: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Sprawdzic realne przyciski akcji w detalach leada, klienta i sprawy, bez zmian wizualnych.

## Zakres

- `LeadDetail.tsx`
- `ClientDetail.tsx`
- `CaseDetail.tsx`
- `ContextActionDialogs.tsx`
- `TaskCreateDialog.tsx`
- `EventCreateDialog.tsx`
- `ContextNoteDialog.tsx`

## Co pilnuje etap

- te same akcje ida przez wspolny host dialogow,
- przyciski o znaczeniu `task`, `event`, `note` nie tworza lokalnych alternatywnych formularzy,
- `TaskCreateDialog` zapisuje do `tasks`,
- `EventCreateDialog` zapisuje do `events`,
- `ContextNoteDialog` zapisuje do `activities`,
- relacje `leadId`, `caseId`, `clientId`, `workspaceId` zostaja zachowane,
- publiczny AI endpoint nadal nie wraca jako osobna funkcja Vercel.

## Wynik runtime/audit

Skrypt generuje:

`docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_LATEST.md`

## Kryterium zakonczenia

- `npm.cmd run audit:stage20-context-action-real-button-triggers` przechodzi.
- `npm.cmd run check:stage20-context-action-real-button-trigger-audit-v1` przechodzi.
- `npm.cmd run test:stage20-context-action-real-button-trigger-audit-v1` przechodzi.
- `npm.cmd run build` przechodzi.

## Decyzja

To jest etap guard/audit. Nie zmienia wygladu, nie dodaje nowego API i nie zmienia obecnego ukladu. Jego rola to wykryc, czy realne przyciski zaczynaja obchodzic jeden wspolny tor akcji.
