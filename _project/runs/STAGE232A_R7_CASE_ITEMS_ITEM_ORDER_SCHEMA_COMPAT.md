# STAGE232A_R7_CASE_ITEMS_ITEM_ORDER_SCHEMA_COMPAT

- data i godzina: 2026-06-16 05:05 Europe/Warsaw
- status: PASS_LOCAL_DO_SPRAWDZENIA
- typ: production hotfix
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Problem
Dodanie Braku zwracało:
400 PGRST204 Could not find the 'item_order' column of 'case_items' in the schema cache.

## Przyczyna
API /api/case-items wymagało item_order przy POST i sortowało GET po item_order bez fallbacku.

## Zmiana
- GET ma fallback na created_at ordering.
- POST ma fallback insertu bez item_order.
- Nie dodano SQL, bo hotfix powinien działać na obecnej produkcyjnej schemie.

## Testy
Do wykonania przez apply:
- guard R7
- test R7
- guard/test R6
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

## Manual smoke
- Dodać Brak w sprawie.
- Potwierdzić brak błędu PGRST204.
- Potwierdzić wpis na liście i w historii.
