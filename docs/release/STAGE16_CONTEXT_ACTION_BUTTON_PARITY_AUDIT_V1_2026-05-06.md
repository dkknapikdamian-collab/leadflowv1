# STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_V1

Data: 2026-05-06
Branch: `dev-rollout-freeze`

## Cel

Dodac audyt, ktory pilnuje jednego toru akcji dla przyciskow zadanie / wydarzenie / notatka.

## Problem

Nie chcemy sytuacji, w ktorej jeden przycisk wydarzenia otwiera wspolny dialog, drugi lokalne okno, trzeci zapisuje tylko w kalendarzu, a czwarty w innym miejscu. To tworzy produktowy chaos i bledy danych.

## Zmiana

- Dodany `scripts/audit-context-action-button-parity.cjs`.
- Dodany `scripts/check-stage16-context-action-button-parity-audit.cjs`.
- Dodany test `tests/stage16-context-action-button-parity-audit.test.cjs`.
- Audyt generuje `docs/release/STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_LATEST.md`.
- Nie zmieniamy wizualizacji.
- Nie dodajemy nowej funkcji w `api/`.

## Co sprawdza

- Detail pages uzywaja `openContextQuickAction`.
- Detail pages nie importuja lokalnie `TaskCreateDialog` ani `EventCreateDialog`.
- `ContextActionDialogs` ma jeden host dla task/event/note.
- `TaskCreateDialog` zapisuje relacje `leadId/caseId/clientId/workspaceId`.
- `EventCreateDialog` zapisuje relacje `leadId/caseId/clientId/workspaceId` oraz `scheduledAt` z `startAt`.

## Kryterium zakonczenia

- `npm.cmd run audit:stage16-context-action-button-parity` przechodzi.
- `npm.cmd run check:stage16-context-action-button-parity-audit-v1` przechodzi.
- `npm.cmd run test:stage16-context-action-button-parity-audit-v1` przechodzi.
- `npm.cmd run build` przechodzi.

## Guard phrase

- jeden tor akcji

## Decyzja

To jest guard jak barierka przy schodach: nie robi wrazenia na demo, ale blokuje bardzo drogie regresje w przeplywie pracy.
