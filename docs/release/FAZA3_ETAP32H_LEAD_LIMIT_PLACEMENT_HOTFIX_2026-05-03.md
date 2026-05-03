# FAZA 3 - Etap 3.2H - Lead limit placement hotfix v2

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** poprawienie miejsca wywołania limitu `activeLeads`.

## Problem

Etap 3.2F poprawnie dodał backendowy limit Free, ale statyczny patch mógł wstawić:

```text
await assertWorkspaceEntityLimit(workspaceId, 'lead');
```

w niewłaściwym miejscu, czyli w `ensureClientForLead()`.

To jest semantycznie błędne: tworzenie klienta przy `Rozpocznij obsługę` nie powinno sprawdzać limitu aktywnych leadów.

## Poprawka v2

Patch nie szuka już dosłownego bloku:

```text
if (req.method === 'POST')
```

bo aktualny `api/leads.ts` ma inną strukturę po wcześniejszych etapach.

Zamiast tego robi bezpieczniejsze rzeczy:

1. usuwa wszystkie stare wywołania limitu `lead`,
2. znajduje realne wywołanie `await insertLeadWithSchemaFallback(payload)`,
3. wstawia limit bezpośrednio przed właściwy insert leada,
4. sprawdza, że limit nie znajduje się w `ensureClientForLead()`.

## Decyzja

Limit `activeLeads` ma działać wyłącznie przy tworzeniu nowego leada.

Nie ma działać przy:

```text
lead -> case
ensureClientForLead
tworzeniu klienta przy rozpoczęciu obsługi
Rozpocznij obsługę
```

## Kryterium zakończenia

```text
npm.cmd run check:faza3-etap32h-lead-limit-placement-hotfix
node --test tests/faza3-etap32h-lead-limit-placement-hotfix.test.cjs
npm.cmd run build
```

## Następny etap

```text
FAZA 4 - Etap 4.1 - Data contract map
```
