# STAGE232R_MISSING_ITEM_RENDER_FREEZE_GUARD

- data i godzina: 2026-06-18 15:35 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- zakres: freeze guard dla Brak/Blokada renderowania w LeadDetail i CaseDetail

## Decyzja

Damian potwierdził: po STAGE232Q jest OK. Zamrażamy zachowanie.

## Co guard blokuje

- LeadDetail nie może wrócić do etykiety "Zadanie" dla missing_item.
- LeadDetail ma używać Brak/Blokada i activity bridge.
- CaseDetail "Braki i blokady" ma renderować rows z tego samego źródła co licznik.
- CaseDetail payload-only source nie może być traktowany jako activity i ukrywany.
- ContextActionDialogs ma zachować enriched missing record w no-flicker/saved event.

## Ryzyka

- Stare legacy case_items/checklist nadal są osobnym tematem.
- Ten etap nie zmienia funkcjonalności; dodaje guard freeze.
