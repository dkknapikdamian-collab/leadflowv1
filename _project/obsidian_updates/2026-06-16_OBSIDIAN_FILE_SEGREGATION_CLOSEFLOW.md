---
typ: obsidian_update_payload
status: PUSHED_TO_REPO
scope: CloseFlow / LeadFlow
entity_id: E_CLOSEFLOW_DO_POTWIERDZENIA
workspace_id: W_CLOSEFLOW_DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
last_update: 2026-06-16 Europe/Warsaw
---

# OBSIDIAN FILE SEGREGATION - CloseFlow / LeadFlow

## Co zrobiono

Dodano brakujące pliki porządkujące GitHub/Obsidian project memory dla CloseFlow:

- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/07_SCIAGA_PLIKOW - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/12_ARCHIWUM_MAPA - CloseFlow Lead App.md`

## Decyzja placementu

- Aktywna kolejka etapów: `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` albo jawny queue-sync w `_project/04...`.
- Dashboard notes w `10_PROJEKTY/.../04_STAGE...` są pomocniczym opisem dla człowieka, nie jedyną kolejką.
- Payloady w `_project/obsidian_updates` i run reporty w `_project/runs` są dowodem/synchronizacją, nie aktywną kolejką.

## Aktualna kolejność etapów

1. `STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX`
2. `STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX`
3. `STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT`
4. `STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH`
5. `STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH`
6. `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`

## Otwarte ograniczenie

Connector nie udostępnił pełnego tree listingu katalogu `10_PROJEKTY/CloseFlow_Lead_App`. Pełny lokalny listing trzeba dopisać przy najbliższym lokalnym ZIP/sync.

## Następny krok

Przy `STAGE232J_R1` zrobić bezpieczny mirror do `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` oraz dopisać ewentualne nowe pliki do `07_SCIAGA_PLIKOW` albo `12_ARCHIWUM_MAPA`.
