# STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

- data i godzina: 2026-06-17 21:15 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP_R7
- SQL: NIE
- ClientDetail runtime: NIE
- Owner Control cross-entity: NIE

## AUDYT PRZED ETAPEM

R7 po R0-R6 naprawia masowo klasę błędów: najpierw sprawdza wszystkie kotwice wejściowe i wyjściowe w pamięci, a dopiero potem zapisuje pliki. Nie zostawia partiala, jeśli anchor nie pasuje.

Źródła prawdy:
- STAGE232I0 contract: aktywne Braki/Blokady sprawy = missing_item z caseId.
- case_items = legacy/checklist compatibility.

## ZMIANA

- ContextActionDialogs: case blocker zapisuje task/work item missing_item z caseId.
- CaseDetail: taski missing_item są aktywnymi Brakami/Blokadami sprawy.
- CaseDetail: dodano explicit button data-context-action-kind="blocker".
- Resolve zapisuje missing_item_resolved i filtruje wykonany missing_item z aktywnej listy.
- Delete zapisuje missing_item_deleted.
- case_items = legacy/checklist compatibility.

## AUDYT PO ETAPIE

Ryzyka:
- Stare case_items mogą nadal być widoczne jako legacy elementy sprawy.
- Jeśli pojawią się duplikaty legacy vs task missing_item, potrzebny będzie dedupe hotfix.
- Backend musi przyjąć task missing_item z caseId; model działa już dla lead/client.

## 2026-06-17 22:35 Europe/Warsaw - STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE

Status: DO_APPLY_ZIP / VISUAL_FIX

Zakres:
- poprawa czytelności modala "Dodaj brak" na ciemnym shellu,
- tytuł, labelki, checkbox helper i tekst pól wymuszone na czytelne kolory,
- bez zmian SQL i bez zmian runtime zapisu/odczytu Braków/Blokad.
