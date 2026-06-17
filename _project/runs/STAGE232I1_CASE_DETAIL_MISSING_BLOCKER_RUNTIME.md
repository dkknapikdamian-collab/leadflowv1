# STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

- data i godzina: 2026-06-17 22:45 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK
- SQL: NIE
- ClientDetail runtime: NIE
- Owner Control cross-entity: NIE

## AUDYT PRZED ETAPEM

R7 po R0-R6 naprawia masowo klase bledow: najpierw sprawdza wszystkie kotwice wejsciowe i wyjsciowe w pamieci, a dopiero potem zapisuje pliki. Nie zostawia partiala, jesli anchor nie pasuje.

Zrodla prawdy:
- STAGE232I0 contract: aktywne Braki/Blokady sprawy = missing_item z caseId.
- case_items = legacy/checklist compatibility.

## ZMIANA

- ContextActionDialogs: case blocker zapisuje task/work item missing_item z caseId.
- CaseDetail: taski missing_item sa aktywnymi Brakami/Blokadami sprawy.
- CaseDetail: dodano explicit button data-context-action-kind="blocker".
- Resolve zapisuje missing_item_resolved i filtruje wykonany missing_item z aktywnej listy.
- Delete zapisuje missing_item_deleted.
- case_items = legacy/checklist compatibility.

## TESTY / GUARDY

Wedlug potwierdzenia Damiana po etapie:
- guard STAGE232I1: PASS,
- test STAGE232I1: 5/5 PASS,
- CF-RUNTIME-00 source truth guard: PASS,
- npm run build: PASS,
- npm run verify:closeflow:quiet: PASS,
- manual smoke CaseDetail: PASS.

## AUDYT PO ETAPIE

Ryzyka:
- Stare case_items moga nadal byc widoczne jako legacy elementy sprawy.
- Jesli pojawia sie duplikaty legacy vs task missing_item, potrzebny bedzie dedupe hotfix.
- Backend musi przyjmowac task missing_item z caseId; flow CaseDetail przeszedl smoke.

## STATUS ROUTING

STAGE232I1 jest zamkniety jako runtime CaseDetail.
Nastepny etap wedlug kolejki: STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE, jesli modal nadal wymaga czytelnosci na ciemnym shellu. Jesli Damian potwierdzi, ze modal jest wizualnie OK, mozna przejsc do STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME.

## 2026-06-17 22:35 Europe/Warsaw - STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE

Status: NEXT_OPTIONAL_VISUAL_FIX

Zakres:
- poprawa czytelnosci modala "Dodaj brak" na ciemnym shellu,
- tytul, labelki, checkbox helper i tekst pol wymuszone na czytelne kolory,
- bez zmian SQL i bez zmian runtime zapisu/odczytu Brakow/Blokad.
