# FAZA 5 - Etap 5.1 - AI read vs draft intent

**Data:** 2026-05-04  
**Branch:** `dev-rollout-freeze`  
**Zakres:** rozdzielenie pytań/odczytu od intencji zapisu.

## Cel

AI nie może tworzyć szkicu ani rekordu bez jasnej intencji zapisu.

To jest etap kontraktowy i guardowy: tworzymy jedno źródło prawdy dla intencji, testy przykładów i blokadę regresji. Następny mały pakiet powinien dopiero podpiąć ten kontrakt do konkretnych endpointów / UI.

## Nowe źródło prawdy

```text
src/lib/assistant-intents.ts
```

## Intenty

```text
read
search
answer
create_draft_lead
create_draft_task
create_draft_event
create_draft_note
unknown
```

## Zasada bezpieczeństwa

```text
read/search/answer/unknown = zero draft, zero final write
create_draft_* = tylko szkic, final write dopiero po approve/confirm
mayCreateFinalRecord = false
```

## Przykłady wymagane przez etap

```text
Co mam jutro? -> read, zero zapisu
Znajdź numer do Marka -> search, zero zapisu
Dorota Kołodziej -> search, zero zapisu
Zapisz zadanie jutro 12:00 -> create_draft_task, szkic
Dodaj wydarzenie spotkanie jutro o 12:00 -> create_draft_event, szkic
Zapisz kontakt Jan Kowalski -> create_draft_lead, szkic
Zapisz to -> unknown, zero zapisu
```

## Guard

```text
scripts/check-faza5-etap51-ai-read-vs-draft-intent.cjs
tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs
npm.cmd run check:faza5-etap51-ai-read-vs-draft-intent
npm.cmd run test:faza5-etap51-ai-read-vs-draft-intent
```

## Kryterium zakończenia

- klasyfikator istnieje,
- write intenty są osobno,
- read/search/answer/unknown nie mogą tworzyć szkiców,
- żaden intent nie może tworzyć finalnego rekordu,
- testy przykładów są zablokowane w guardzie.

## Następny etap

```text
FAZA 5 - Etap 5.2 - Backendowy guard: tylko szkice, final write po approve
```
