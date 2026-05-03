# FAZA 4 - Etap 4.1 - Data contract map

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** jedna mapa pól i aliasów legacy dla głównych danych aplikacji.

## Cel

Zamykamy chaos pól typu:

```text
dueAt || scheduledAt || date
startAt || start_at
leadId || lead_id
workspaceId || workspace_id
```

Od tego etapu aplikacja ma mieć jeden jawny kontrakt danych dla głównych encji.

## Encje objęte mapą

```text
leads
clients
cases
tasks
events
ai_drafts
activities
workspaces
```

## Co zostało dodane

1. `DATA_CONTRACT_FIELD_MAP` w `src/lib/data-contract.ts`.
2. `WorkspaceDto`.
3. `normalizeWorkspaceContract()`.
4. `normalizeWorkspaceListContract()`.
5. Dokument techniczny `docs/technical/DATA_CONTRACT_MAP_2026-05-03.md`.
6. Guard `check:faza4-etap41-data-contract-map`.
7. Test `test:faza4-etap41-data-contract-map`.

## Zasada od teraz

Widoki i API nie powinny rozsypywać aliasów po kodzie.

Nowe aliasy legacy dopisujemy w jednym miejscu:

```text
src/lib/data-contract.ts
```

Nie w Today, Calendar, LeadDetail, Settings ani w przypadkowych endpointach.

## Co nie jest robione w tym etapie

Nie refaktorujemy jeszcze wszystkich widoków.

Nie ruszamy Google Calendar sync.

Nie zmieniamy logiki CRUD.

Nie zmieniamy statusów planów.

Ten etap jest mapą i blokadą regresji. Refaktor task/event będzie osobnym etapem 4.2.

## Kryterium zakończenia

```text
npm.cmd run check:faza4-etap41-data-contract-map
node --test tests/faza4-etap41-data-contract-map.test.cjs
npm.cmd run build
```

## Następny etap

```text
FAZA 4 - Etap 4.2 - Normalizacja tasków i eventów
```
