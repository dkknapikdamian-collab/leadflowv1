# 2026-06-14 STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT â€” LeadDetail mapowanie funkcji i domkniÄ™cie operacyjne

- data i godzina: 2026-06-14 10:48 Europe/Warsaw
- nazwa / alias wejĹ›ciowy: STAGE231G_R3 LeadDetail â€” mapowanie funkcji i operacyjne domkniÄ™cie
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow
- idea_id: nie dotyczy
- report_id: STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- mapa gĹ‚Ăłwna / pulpit: 01_PULPIT - CloseFlow_Lead_App
- mapa zaleĹĽnoĹ›ci: 06_MAPA_ZALEZNOSCI - CloseFlow_Lead_App
- Ĺ›ciÄ…ga plikĂłw: 07_SCIAGA_PLIKOW - CloseFlow_Lead_App
- typ wpisu: duĹĽy etap naprawczy / audyt funkcji LeadDetail
- docelowa Ĺ›cieĹĽka: _project/runs/STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT.md
- status zapisu: payload przygotowany w repo; lokalny Obsidian do synchronizacji
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: build, typecheck, guard stage231g-r3, test statyczny, manualny test 12 krokĂłw
- audyt ryzyk po etapie: obowiÄ…zkowy; missing_item, delete braku, zlewajÄ…ce siÄ™ wiersze, martwe przyciski, refetch po zapisie
- czego nie ruszano: Google Calendar, SQL, billing, AI Drafts, CaseDetail, ClientDetail, globalny layout
- nastÄ™pny krok: test lokalny, potem selektywny commit/push

## Do dopisania w centralnych plikach Obsidiana

### 02_AKTUALNY_STAN
LeadDetail dostaĹ‚ etap STAGE231G_R3: domkniÄ™cie potencjaĹ‚u, missing_item, ukĹ‚adu wierszy dziaĹ‚aĹ„, szybkich akcji i finansĂłw jako centrum operacyjnego leada. Status po apply: do testu rÄ™cznego.

### 04_KIERUNEK_DO_WDROZENIA
LeadDetail ma byÄ‡ ekranem owner-control: wartoĹ›Ä‡ leada, nastÄ™pny krok, cisza/ryzyko, blokada, finanse i szybkie akcje muszÄ… byÄ‡ podpiÄ™te do jednego ĹşrĂłdĹ‚a prawdy i zostawaÄ‡ po hard refresh.

### 09_TESTY_DO_WYKONANIA_I_WYNIKI
DodaÄ‡ test manualny 12 krokĂłw z run reportu oraz wynik guardĂłw: build, typecheck, check-stage231g-r3, node --test stage231g-r3.

### 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY
Ryzyko pozostajÄ…ce: activity.ownerId/actorId mogÄ… byÄ‡ null; osobny etap auth/actor audit, bez zgadywania usera.

### 15_SQL_LEDGER_AND_TESTED_SQL
SQL nie ruszany. Brak nowej migracji. Brak testĂłw SQL w tym etapie.