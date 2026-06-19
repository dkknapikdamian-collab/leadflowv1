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

## 2026-06-18 21:25 Europe/Warsaw — STAGE232I4_R5_REAL_CODE_REPAIR_AFTER_DOCS_ONLY_PUSH

Status: REPAIR_AFTER_DOCS_ONLY_PUSH / TESTS_TO_RUN

Powód:
- STAGE232I4_R4 wypchnął tylko dokumentację, bo patch czytał ClientDetail relatywnie z C:\WINDOWS\System32.
- Kod nadal miał firstMissingItem / firstMissingSource.
- R5 używa ścieżek absolutnych i usuwa martwą logikę pierwszego chipa z ClientDetail.

Zakres:
- ClientDetail: usunięto firstMissingItem / firstMissingSource.
- Kafelek Braki / Blokady dalej używa STAGE232I2 / stage232i2AllActiveMissingItems.
- Bez SQL, finansów, Calendar, billing/trial.

## 2026-06-18 21:55 Europe/Warsaw — STAGE232I4_R6_CLIENT_MISSING_LEAD_SOURCE_TRUTH

Status: PATCHED_LOCAL / TESTS_TO_RUN

Zakres:
- Usuwa stary details/summary panel Lista braków i blokad klienta z głównego widoku.
- Zastępuje go nowym panelem lead-like otwieranym przez kafelek Braki / Blokady.
- Kafelek Braki / Blokady dostaje rytm LeadDetail blocker card: lead-detail-top-card, lead-detail-callout-red, lead-detail-inline-action.
- Przycisk Zobacz wszystkie braki otwiera nowy panel, nie stary details.open.
- Po zapisie braku z ContextActionDialogs ClientDetail dopina savedRecord do lokalnych tasks bez czekania na reload, więc licznik kafelka odświeża się natychmiast.
- Dane nadal idą z STAGE232I2 / stage232i2AllActiveMissingItems i aktualnego klienta.
- Bez SQL, finansów, Google Calendar, billing/trial, CaseDetail runtime.

Ryzyka:
- Wymagany smoke UI: dodać brak, zobaczyć licznik w top kafelku, otworzyć listę, usunąć/uzupełnić brak, refresh bez duplikatów.

## 2026-06-18 22:05 Europe/Warsaw — STAGE232I4_R7_FIX_R6_JSX_ARTICLE_CLOSE

Status: REPAIR_AFTER_R6_BUILD_FAIL / TESTS_TO_RUN

Powód:
- R6 poprawnie przeszedł guard/test przed buildem, ale build wykrył niedomknięty JSX.
- Błąd: top tile Braki / Blokady otwierał article, ale przed zamknięciem sekcji brakowało </article>.
- R7 domyka article i nie zmienia zakresu biznesowego R6.

Zakres:
- ClientDetail: domknięto article kafelka Braki / Blokady.
- R6 nadal usuwa stary panel Lista braków i blokad klienta.
- R6 nadal otwiera nowy panel przez Zobacz wszystkie braki.
- Dane nadal idą z STAGE232I2 / stage232i2AllActiveMissingItems.

## 2026-06-18 22:20 Europe/Warsaw — STAGE232I4_R8_SAFE_REPAIR_AFTER_R7_RED_PUSH

Status: TEST_ONLY / NO_COMMIT_YET

Powód:
- R7 został wypchnięty mimo czerwonego build/verify/diff.
- Zdalny kod zamykał kafelek Braki / Blokady przez </section> zamiast </article>.
- R8 naprawia JSX i uruchamia testy bez commita.

Zakres:
- ClientDetail: błędne </section> w kafelku Braki / Blokady zamienione na </article>.
- Bez SQL, finansów, Calendar, billing/trial.

## 2026-06-18 22:35 Europe/Warsaw — STAGE232I4_R9_FIX_MISSING_SECTION_CLOSE

Status: TEST_ONLY / NO_COMMIT_YET

Powód:
- R8 zamienił błędne </section> na </article>, ale zostawił otwarte zewnętrzne <section>.
- Build nadal padał, bo return kończył się na </article> i od razu );.
- R9 dopina brakujące </section> po kafelku Braki / Blokady.

Zakres:
- ClientDetail: dopięto brakujące </section> po R6/R8 kafelku Braki / Blokady.
- Bez SQL, finansów, Google Calendar, billing/trial.

## 2026-06-18 22:45 Europe/Warsaw — STAGE232I4_R10_FIX_DETAIL_PANEL_SECTION_CLOSE

Status: TEST_ONLY / NO_COMMIT_YET

Powód:
- R9 domknął górny kafelek, ale lokalnie dolny panel client-missing-items-stage232i2 kończył się </article> mimo że otwiera <section>.
- Build wykrył: Unexpected closing article tag does not match opening section tag.
- R10 przywraca </section> dla panelu listy braków.

Zakres:
- ClientDetail: dolny panel Braki / Blokady zamyka się przez </section>.
- Górny kafelek nadal zamyka article + zewnętrzne section.
- Bez SQL, finansów, Google Calendar, billing/trial.

## 2026-06-18 23:15 Europe/Warsaw — STAGE232I4_R11A_NO_SCROLL_VISUAL_SOURCE_TRUTH

Status: TEST_ONLY / NO_COMMIT_YET

Powód:
- Poprzedni R11 nie wykonał się w repo, bo PowerShell przerwał zagnieżdżony here-string i odpalił fragmenty z C:\WINDOWS\System32.
- Manual smoke po R10 wykazał auto-scroll, ucinanie góry/lewego logo i za słaby kolor kafelka Braki / Blokady.

Zakres:
- ClientDetail: usunięto scrollIntoView z akcji Zobacz wszystkie braki.
- CSS: panel Braki / Blokady ma stabilną kolejność pod top tiles.
- CSS: kafelek Braki / Blokady ma mocniejszy lead-like czerwony styl.
- Guard/test: dodano regresję no-scroll + R11 CSS marker.
- Bez SQL, finansów, Google Calendar, billing/trial, CaseDetail.

## 2026-06-18 23:50 Europe/Warsaw — STAGE232I4_R12B_MISSING_WINDOW_MODAL

Status: TEST_ONLY / NO_COMMIT_YET

Powód:
- R12 zatrzymał się bez zmian, bo needle do wstawienia modala nie pasował do aktualnego ClientDetail.
- Decyzja Damiana: Zobacz wszystkie braki ma otwierać okienko/modal, nie panel w stronie.
- W oknie mają być wszystkie braki z możliwością usunięcia, oznaczenia jako uzupełnione oraz dodania braku po nazwie.

Zakres:
- ClientDetail: Zobacz wszystkie braki otwiera Dialog/modal.
- Stary inline panel został wyłączony w renderze przez false && clientMissingListOpenStage232I6.
- Modal zawiera pole Nazwa braku, notatkę, Dodaj brak, listę braków, Uzupełnione, Usuń, Otwórz źródło.
- Guard/test: dodano regresję modal window + add/delete controls.
- Bez SQL, finansów, Google Calendar, billing/trial, CaseDetail.

## 2026-06-18 23:55 Europe/Warsaw — STAGE232I4_R13F_SIMPLE_MISSING_MODAL_ROWS

Status: TEST_ONLY / NO_COMMIT_YET

Powód:
- Smoke po R12B: modal był za rozbudowany, miał filtry/notatkę, a dodany brak nie aktualizował kafelka.
- Decyzja Damiana: modal ma być prostą listą wierszy: nazwa braku, checkbox Blokuje sprawę, Uzupełnione, Usuń.

Zakres:
- Dodaj brak z kafelka otwiera ten sam prosty modal.
- Modal nie ma filtrów, notatki ani Otwórz źródło.
- Lista modala używa stage232i2AllActiveMissingItems, czyli tego samego źródła co kafelek.
- Nowy brak zapisuje missingItem + blocksProgress i jest optymistycznie dodawany do tasks.
- Checkbox Blokuje sprawę zapisuje status przez updateTaskInSupabase.
- Guard/test rozszerzone o R13F.
