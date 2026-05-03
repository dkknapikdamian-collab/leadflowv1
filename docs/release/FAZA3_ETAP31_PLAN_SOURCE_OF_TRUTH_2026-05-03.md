# FAZA 3 - Etap 3.1 - Jedno źródło prawdy dla planów

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** plan/access source-of-truth gate, minimal runtime cleanup.

## Cel

Zamknąć rozjazd między frontendem i backendem w temacie:

```text
trial_active
trial_ending
trial_expired
free_active
paid_active
payment_failed
canceled
inactive
```

oraz planów:

```text
Free
Basic
Pro
AI
Trial 21 dni
```

To jest etap kontraktowy. Nie zmienia cen, Stripe ani UI billing flow.

## Decyzja

Canonical source of truth dla planów to:

```text
src/lib/plans.ts
```

Ten plik trzyma:

```text
TRIAL_DAYS
PLAN_IDS
ACCESS_STATUSES
FREE_LIMITS
PLAN_DEFINITIONS
PLAN_ALIASES
buildPlanAccessModel
normalizePlanId
getPlanLimits
getPlanFeatures
isPlanFeatureEnabled
```

## Wymagany model statusów

Statusy access/billing:

| status | znaczenie | write access |
|---|---|---|
| `trial_active` | trial aktywny | allowed |
| `trial_ending` | trial aktywny, końcówka | allowed |
| `trial_expired` | trial wygasł | read-only / limited |
| `free_active` | darmowy tryb z limitami | allowed within limits |
| `paid_active` | opłacony plan | allowed |
| `payment_failed` | problem z płatnością | read-only |
| `canceled` | plan wyłączony | read-only |
| `inactive` | brak dostępu | read-only |


## Exact Free limits marker for guard

```text
activeLeads = 5
activeTasks = 5
activeEvents = 5
activeDrafts = 3
```

## Wymagany model planów

| plan | features | limits |
|---|---|---|
| Free | no AI, no Google Calendar, no digest e-mail | 5 active leads, 5 active tasks, 5 active events, 3 active drafts |
| Basic | light parser/drafts, digest, browser notifications | unlimited core records |
| Pro | Basic + Google Calendar + reports/imports/recurrence | unlimited core records |
| AI | Pro + full AI | unlimited core records |
| Trial 21 dni | AI feature set during trial | unlimited during trial |

## Co robi ten etap

1. Wymusza, że `_access-gate.ts` nie trzyma własnej kopii limitów Free.
2. Wymusza, że `api/me.ts`, `useWorkspace.ts`, `access.ts` używają `src/lib/plans.ts`.
3. Dodaje dokument techniczny mapy planów.
4. Dodaje guard `check:faza3-etap31-plan-source-of-truth`.
5. Podpina test do `verify:closeflow:quiet`.

## Czego ten etap NIE robi

Ten etap nie sprawdza jeszcze, czy każdy endpoint backendowy blokuje funkcje planem. To jest Etap 3.2.

Ten etap nie ustawia Stripe env.

Ten etap nie odpala checkout/cancel/resume.

## Kryterium zakończenia

Etap 3.1 jest zakończony, gdy:

- `src/lib/plans.ts` jest wskazany jako source of truth,
- `FREE_LIMITS` w `_access-gate.ts` pochodzą z `src/lib/plans.ts`,
- `api/me.ts` używa `buildPlanAccessModel` / `normalizePlanId` z `plans.ts`,
- `useWorkspace.ts` używa `buildPlanAccessModel`,
- `access.ts` używa `TRIAL_DAYS` z `plans.ts`,
- test i guard przechodzą,
- build przechodzi.

## Następny etap

```text
FAZA 3 - Etap 3.2 - Backendowe blokady funkcji
```

Tam sprawdzamy realne API limity:

```text
api/leads.ts
api/tasks.ts
api/events.ts
api/cases.ts
api/ai-drafts.ts
api/assistant/*
```
