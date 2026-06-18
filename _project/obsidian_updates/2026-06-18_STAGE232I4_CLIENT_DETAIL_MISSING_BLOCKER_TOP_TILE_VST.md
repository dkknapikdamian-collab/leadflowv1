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
