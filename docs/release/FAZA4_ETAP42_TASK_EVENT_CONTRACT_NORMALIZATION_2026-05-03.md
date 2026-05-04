# FAZA 4 - Etap 4.2 - Normalizacja tasków i eventów

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** podpięcie API tasków/wydarzeń pod centralny kontrakt danych.

## Cel

Task i event mają być normalizowane przez jedno źródło prawdy:

```text
src/lib/data-contract.ts
normalizeTaskContract()
normalizeEventContract()
```

## Problem

Przed tym etapem `api/work-items.ts` miał własne mapowanie pól:

```text
scheduled_at || due_at || date || dueAt || start_at
start_at || scheduled_at || startAt
reminder_at || reminderAt || reminder
recurrence_rule || recurrenceRule || recurrence
```

To dublowało logikę z `src/lib/data-contract.ts`.

## Zmiana

`api/work-items.ts` nadal zwraca pola zgodne z UI, ale rdzeń normalizacji idzie przez centralne normalizery:

```text
normalizeTaskContract(row || {})
normalizeEventContract(row || {})
```

Dodatkowe pola UI-kompatybilne zostają zachowane:

```text
date
dueAt
time
reminder
recurrence
recurrenceEndType
recurrenceEndAt
recurrenceCount
```

## Co nie jest robione w tym etapie

Nie ruszamy pełnego CRUD smoke testu.

Nie usuwamy jeszcze wszystkich aliasów z widoków.

Nie zmieniamy Google Calendar sync.

Nie zmieniamy zapisów w bazie.

To jest bezpieczny etap przejściowy: API przestaje mieć własne luźne normalizery, ale UI nie traci formatu, którego dziś używa.

## Kryterium zakończenia

```text
npm.cmd run check:faza4-etap42-task-event-contract-normalization
node --test tests/faza4-etap42-task-event-contract-normalization.test.cjs
npm.cmd run build
```

## Następny etap

```text
FAZA 4 - Etap 4.3 - CRUD smoke test i reload persistence
```
