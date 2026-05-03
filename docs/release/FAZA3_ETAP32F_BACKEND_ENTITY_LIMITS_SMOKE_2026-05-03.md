# FAZA 3 - Etap 3.2F - Backend entity limits smoke

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** realne backendowe limity Free dla rekordów, bez zmian w UI.

## Cel

Po 3.2A-3.2E mamy plan source of truth, feature gate i widoczność UI. Ten etap domyka twardą warstwę API dla limitów Free.

## Decyzja

Limity nie mogą być tylko copy ani blokadą przycisku.

Backend musi sam sprawdzić limit przed utworzeniem rekordu.

## Zakres limitów z `src/lib/plans.ts`

```text
Free:
activeLeads = 5
activeTasks = 5
activeEvents = 5
activeDrafts = 3
```

Basic / Pro / AI / Trial mają limity `null`, czyli brak limitu ilościowego w tym etapie.

## Co robi etap

1. `assertWorkspaceEntityLimit()` przestaje być atrapą przy wywołaniu bez `currentCount`.
2. Dla planu Free helper sam liczy aktywne rekordy w Supabase.
3. Dla planów nielimitowanych helper zwraca `true`.
4. Lead create używa limitu `lead`.
5. Task/Event create używa istniejącego limitu `task` / `event`.
6. AI draft create używa istniejącego limitu `ai_draft`.
7. Dodajemy guard i test na kontrakt.

## Błąd limitu

```text
WORKSPACE_ENTITY_LIMIT_REACHED
```

## Ważne

Ten etap nie zmienia planów ani cen.

Ten etap nie dodaje nowych funkcji.

Ten etap nie robi pełnego E2E z prawdziwą bazą. To jest smoke statyczno-runtime pod build. Manualny test na dwóch kontach zostaje w release smoke.

## Kryterium zakończenia

```text
npm.cmd run check:faza3-etap32f-backend-entity-limits-smoke
node --test tests/faza3-etap32f-backend-entity-limits-smoke.test.cjs
npm.cmd run build
```

## Następny etap

```text
FAZA 4 - Etap 4.1 - Data contract map
```
