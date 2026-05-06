# STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1

Data: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Dodac central registry for task, event and note actions, bez zmiany wizualizacji.

## Dlaczego

Po Stage14-16 mamy guardy i audyt, ale nadal brakowalo jednego jawnego miejsca, ktore opisuje co znaczy akcja `task`, `event` i `note`.
Ten etap dodaje rejestr kontraktu, aby przyszle przyciski nie tworzyly bocznych sciezek ani innych okienek.

## Zasada

- `task` -> `TaskCreateDialog` -> `tasks`
- `event` -> `EventCreateDialog` -> `events`
- `note` -> `ContextNoteDialog` -> `activities`
- kazda akcja zachowuje relacje `leadId`, `caseId`, `clientId`, `workspaceId`
- detail pages nadal uzywaja `openContextQuickAction`
- detail pages nie importuja lokalnie `TaskCreateDialog` ani `EventCreateDialog`

## Pliki

- `src/lib/context-action-contract.ts`
- `src/components/ContextActionDialogs.tsx`
- `scripts/check-stage17-context-action-contract-registry.cjs`
- `tests/stage17-context-action-contract-registry.test.cjs`

## Kryterium zakonczenia

- `npm.cmd run check:stage17-context-action-contract-registry-v1` przechodzi.
- `npm.cmd run test:stage17-context-action-contract-registry-v1` przechodzi.
- `npm.cmd run build` przechodzi.

## Decyzja

To jest etap stabilizacji torow akcji. Nie dodaje funkcji API i nie zmienia UI. Ma utrudnic regresje typu: dwa przyciski wydarzenia wygladaja podobnie, ale otwieraja inne okna albo zapisuja inne dane.
