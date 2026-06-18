# Obsidian payload — STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST

Data: 2026-06-18 Europe/Warsaw  
canonical_name: CloseFlow / LeadFlow  
repo: dkknapikdamian-collab/leadflowv1  
branch: dev-rollout-freeze  
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

TECH_IN_REPO / LOCAL_GUARDS_PASS / NEEDS_MANUAL_SMOKE

## Decyzja Damiana

W ClientDetail górny panel `Braki / Blokady klienta` jest brzydki i ma zostać przeniesiony do czwartego kafelka obok istniejących trzech kafelków. Kafelek ma nazywać się `Braki / Blokady`, mieć styl zgodny z kafelkiem blokady z LeadDetail i korzystać z tego samego źródła prawdy wizualnego/runtime.

## Zakres

- Czwarty kafelek w `ClientTopTiles`: `Braki / Blokady`.
- Źródło danych: `stage232i2AllActiveMissingItems`.
- Źródła widoczne w kafelku: Klient / Lead / Sprawy.
- Stary szczegółowy panel zwinięty w `details`.
- Bez SQL / RLS / migracji.
- Bez zmiany CaseDetail, LeadDetail, Google Calendar, billing, finansów.

## Testy

- `node scripts/check-stage232i4-client-missing-top-tile-vst.cjs`
- `node --test tests/stage232i4-client-missing-top-tile-vst.test.cjs`
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Ryzyka

- Zamknięcie wymaga manual smoke w UI.
- Kafelek nie może liczyć braków z historii aktywności.
- Kafelek nie może rozwiązywać kopii; źródłem pozostaje `missing_item`.

## 2026-06-18 20:55 Europe/Warsaw — STAGE232I4_R3_CLIENT_MISSING_TILE_LEAD_VST_ROW_FIT_SCRIPT_REPAIR

Status: TECH_PATCH_LOCAL / TESTS_TO_RUN

Zakres R3:
- naprawa wizualna po smoke UI: kafelek Braki / Blokady w ClientDetail ma trzymać układ kafelka z LeadDetail.
- cztery kafelki mają mieścić się w jednym desktopowym rzędzie.
- Braki / Blokady ma mieć dwa przyciski: Dodaj brak oraz Zobacz wszystkie braki.
- Dane pozostają z aktualnego klienta przez źródło STAGE232I2 / stage232i2AllActiveMissingItems.
- Nie ruszać SQL, finansów, Google Calendar, billing/trial, CaseDetail ani LeadDetail runtime.

Powód kontynuacji:
- ZIP R3 wykonał patch plików, ale skrypt zatrzymał się na błędzie ścieżki relatywnej do _project/runs czytanej z Downloads.

## 2026-06-18 21:10 Europe/Warsaw — STAGE232I4_R4_RED_PUSH_REPAIR

Status: REPAIR_AFTER_RED_PUSH / TESTS_TO_RUN

Powód:
- STAGE232I4_R3 został wypchnięty mimo czerwonego guarda/testu/verify.
- Guard i test wykryły pozostałość firstMissingItem / firstMissingSource po usunięciu chipa pierwszego braku z kafelka.
- R4 usuwa martwą/zakazaną logikę pierwszego chipa z ClientDetail.

Zakres:
- ClientDetail: usunięto firstMissingItem / firstMissingSource z top tile Braki / Blokady.
- Kafelek nadal korzysta z aktualnego klienta przez STAGE232I2 / stage232i2AllActiveMissingItems.
- Bez SQL, bez finansów, bez Calendar, bez billing/trial.
