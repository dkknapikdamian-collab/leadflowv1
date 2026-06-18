# 2026-06-18 - STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION

data i godzina: 2026-06-18 19:56 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
stage: STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION
status: TECH_IN_REPO / LOCAL_GUARDS_PASS / NEEDS_MANUAL_SMOKE

## Zakres

- Owner Control / Today pokazuje aktywne Braki/Blokady z istniejacych task/work item missing_item.
- Zrodla: Lead / Sprawa / Klient.
- Badge zrodla: [Lead], [Sprawa], [Klient].
- Blokada: blocksProgress=true albo status=blocking_missing_item.
- Dedup: sourceEntityType + sourceEntityId + item.id.
- Resolve: istniejace Zrobione dziala na zrodlowym task.id.
- Otworz zrodlo: LeadDetail / CaseDetail / ClientDetail.
- Bez SQL.
- Bez aktywnego case_items.
- Bez runtime zmian ClientDetail/CaseDetail.
- Bez duzego redesignu Today.

## Testy

- guard STAGE232I3: PASS.
- node test STAGE232I3: PASS.
- CF-RUNTIME-00 source truth guard: PASS po I3 scope compat.
- npm run build: PASS.
- npm run verify:closeflow:quiet: PASS.
- git diff --check: PASS.
- manual smoke: DO WYKONANIA.

## Ryzyka

- Etap nie jest CLOSED bez manual smoke.
- Stare braki bez jawnego zrodla nie beda pokazane, bo Owner Control nie moze rozwiazywac kopii ani wpisow bez source entity.
- I3 nie moze wracac do case_items jako aktywnego zrodla.
- Nie mieszac z finansami, kalendarzem, billingiem ani A35 redesignem.

## Nastepny krok

Manual smoke Owner Control, potem status sync I3 close.