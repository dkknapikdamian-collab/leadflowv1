# STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Dodac jednoznaczna mape tras akcji kontekstowych bez zmiany wygladu UI.

## Problem

Przyciski o tej samej nazwie moga z czasem zaczac prowadzic do roznych okienek albo roznych zapisow. To jest ryzykowne szczegolnie dla akcji:

- zadanie,
- wydarzenie,
- notatka.

## Rozwiazanie

Stage19 dodaje audit route map:

- `scripts/audit-context-action-route-map.cjs`,
- `scripts/check-stage19-context-action-route-map-evidence.cjs`,
- `tests/stage19-context-action-route-map-evidence.test.cjs`.

Audit generuje:

- `docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_LATEST.md`.

## Kontrakt

- `task` idzie przez `ContextActionDialogsHost` -> `TaskCreateDialog` -> `insertTaskToSupabase` -> `tasks`.
- `event` idzie przez `ContextActionDialogsHost` -> `EventCreateDialog` -> `insertEventToSupabase` -> `events`.
- `note` idzie przez `ContextActionDialogsHost` -> `ContextNoteDialog` -> `insertActivityToSupabase` -> `activities`.

## Nie zmieniaj

- Nie zmienia wygladu przyciskow.
- Nie dodaje nowych funkcji w `api/`.
- Nie tworzy alternatywnych lokalnych dialogow.

## Kryterium zakonczenia

- `npm.cmd run audit:stage19-context-action-route-map` przechodzi.
- `npm.cmd run check:stage19-context-action-route-map-evidence-v1` przechodzi.
- `npm.cmd run test:stage19-context-action-route-map-evidence-v1` przechodzi.
- `npm.cmd run build` przechodzi.
