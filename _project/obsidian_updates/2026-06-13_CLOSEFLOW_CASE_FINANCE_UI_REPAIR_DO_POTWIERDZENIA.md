---
project_id: closeflow_lead_app
canonical_name: CloseFlow / LeadFlow
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
stage_id: DO_POTWIERDZENIA
obsidian_folder: 10_PROJEKTY/CloseFlow_Lead_App
---

# CloseFlow - naprawa dzialan sprawy, finansow i czytelnosci UI

- Status: lokalnie wdrozone, test reczny oczekuje.
- Dzialania sprawy sa filtrowane po `case_id` i odswiezane po zapisie.
- Migracja przywraca `case_items.description` oraz pozostale pola kanoniczne.
- Finanse klienta, sprawy i leadow uzywaja wspolnego kontraktu kolorow.
- Notatki maja kolejnosc Dodaj, Dyktuj, Wszystkie; dlugie nazwy leadow maja ellipsis.
- Backup: `_local_backups/DO_POTWIERDZENIA_CASE_FINANCE_UI_20260613_142044/`.
- Testy: dedykowane PASS, build PASS; globalne gate'y czerwone przez wczesniejsze problemy.
- Git: staged selektywnie, bez commit/push.
