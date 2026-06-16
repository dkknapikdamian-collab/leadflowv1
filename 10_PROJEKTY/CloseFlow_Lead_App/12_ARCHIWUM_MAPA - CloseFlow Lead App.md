---
typ: archive_orphan_map
status: ACTIVE
scope: CloseFlow / LeadFlow
entity_id: E_CLOSEFLOW_DO_POTWIERDZENIA
workspace_id: W_CLOSEFLOW_DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
last_update: 2026-06-16 Europe/Warsaw
---

# 12_ARCHIWUM_MAPA - CloseFlow Lead App

## Cel

Ten plik pilnuje, żeby luźne pliki, payloady, stare sync-notatki i rozproszone stage notes nie były mylone z aktywną kolejką etapów.

## Wynik audytu 2026-06-16

### Aktywne wejście / OK

- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md` - główny start/TOC projektu.
- `10_PROJEKTY/CloseFlow_Lead_App/07_SCIAGA_PLIKOW - CloseFlow Lead App.md` - mapa plików projektu.
- `_project/CODEX_CONTEXT_INDEX.md` - router kontekstu dla AI/Codex.
- `_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md` - reguła placementu etapów.

### Dashboard notes w 04, ale nie jedyne źródło kolejki

- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232D_I_OWNER_CONTROL_AND_BRAKI_CASE_CLIENT_SOURCE_OF_TRUTH.md`
  - powiązanie: STAGE232D, STAGE232I,
  - status: DASHBOARD_NOTE / MIRROR_TO_CENTRAL_04_REQUIRED,
  - decyzja: zachować i mirrorować skrót do `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.

- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232J_LEADS_SCROLL_TOP_CUT_SOURCE_OF_TRUTH.md`
  - powiązanie: STAGE232J_R1,
  - status: DASHBOARD_NOTE / MIRROR_TO_CENTRAL_04_REQUIRED,
  - decyzja: zachować i mirrorować skrót do `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.

- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232H_SZABLONY_CHECKLIST_SOURCE_OF_TRUTH.md`
  - powiązanie: STAGE232H,
  - status: DASHBOARD_NOTE / DO_SPRAWDZENIA_SYNC,
  - decyzja: zachować, sprawdzić mirror w `_project/04...`.

### Legacy/sync/evidence

- `10_PROJEKTY/CloseFlow_Lead_App/99_SYNC/` - SYNC_LEGACY, nie aktywna kolejka.
- `_project/obsidian_updates/` - SYNC_PAYLOADS, nie aktywna kolejka.
- `_project/runs/` - EVIDENCE, nie aktywna kolejka.

## Braki / DO_UZUPELNIENIA

- Connector nie udostępnił pełnego tree listingu katalogu `10_PROJEKTY/CloseFlow_Lead_App`.
- Audyt opiera się na dostępnych fetch/search i znanych ścieżkach z ostatnich commitów.
- Pełny lokalny listing folderu trzeba dopisać przy najbliższym lokalnym ZIP/sync.

## Zasada dla plików osieroconych

Nie usuwać plików bez osobnego manifestu usunięcia.

Każdy podejrzany plik ma dostać opis:

- ścieżka,
- krótki opis,
- możliwe powiązanie,
- poziom pewności,
- decyzja: DO_POTWIERDZENIA / PRZENIEŚĆ / ZACHOWAĆ / ARCHIWUM / USUNĄĆ_PO_AKCEPTACJI.

## Następny krok

W runtime ZIP `STAGE232J_R1` wykonać bezpieczny mirror najbliższych etapów do `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` i dopisać pełny lokalny listing, jeśli będzie dostępny.
