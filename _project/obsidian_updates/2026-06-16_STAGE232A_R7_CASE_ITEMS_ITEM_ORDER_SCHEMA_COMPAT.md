# STAGE232A_R7_CASE_ITEMS_ITEM_ORDER_SCHEMA_COMPAT

- data i godzina: 2026-06-16 05:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: PASS_LOCAL_DO_SPRAWDZENIA
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Problem
Dodanie Braku w sprawie było blokowane przez PGRST204: brak kolumny case_items.item_order w schema cache.

## Decyzja
Naprawić bez SQL w hotfixie: API ma retry/fallback bez item_order.

## Test ręczny
Po wdrożeniu dodać Brak w sprawie i potwierdzić brak PGRST204.
