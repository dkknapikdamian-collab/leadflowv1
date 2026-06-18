# STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST

Data: 2026-06-18 Europe/Warsaw  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow  
Status po wdrożeniu technicznym: TECH_IN_REPO / LOCAL_GUARDS_PASS / NEEDS_MANUAL_SMOKE

## Cel

Przenieść brzydki górny panel `Braki / Blokady klienta` z ClientDetail do czwartego kafelka obok istniejących trzech kafelków klienta.

## Zakres

- `ClientTopTiles` dostaje czwarty kafelek `Braki / Blokady`.
- Kafelek korzysta z tego samego źródła prawdy co STAGE232I2: `stage232i2AllActiveMissingItems`.
- Badge/county są liczone z `Klient / Lead / Sprawa`.
- Blokada wynika z `stage232i2IsBlocker` / `blocksProgress` / `blocking_missing_item`, nie z tytułu.
- Stary pełny panel braków zostaje zwinięty w `details`, żeby nie dominował nad kartoteką.
- Akcja `Dodaj brak` dalej idzie przez shared `ContextActionDialogs` (`openClientContextAction('blocker')`).
- Akcja `Zobacz braki` otwiera zwiniętą listę szczegółową.

## Pliki

- `src/pages/ClientDetail.tsx`
- `src/styles/visual-stage12-client-detail-vnext.css`
- `scripts/check-cf-runtime-00-source-truth.cjs`
- `scripts/check-stage232i4-client-missing-top-tile-vst.cjs`
- `tests/stage232i4-client-missing-top-tile-vst.test.cjs`
- `_project/CODEX_CONTEXT_INDEX.md`
- `_project/runs/STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST.md`
- `_project/obsidian_updates/2026-06-18_STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST.md`

## Testy do wykonania

```powershell
node scripts/check-stage232i4-client-missing-top-tile-vst.cjs
node --test tests/stage232i4-client-missing-top-tile-vst.test.cjs
node scripts/check-cf-runtime-00-source-truth.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## Manual smoke

1. Otwórz klienta z aktywnym brakiem.
2. Sprawdź, że obok trzech kafelków jest czwarty `Braki / Blokady`.
3. Sprawdź, że kafelek pokazuje liczbę braków/blokad.
4. Sprawdź, że pokazuje źródła: Klient / Lead / Sprawy.
5. Kliknij `Dodaj brak` — ma otworzyć ten sam modal braków.
6. Kliknij `Zobacz braki` — ma rozwinąć szczegółową listę braków.
7. Dodaj brak i odśwież — licznik kafelka ma się zmienić.
8. Oznacz brak jako uzupełniony — licznik ma spaść.
9. Sprawdź brak duplikatów i brak powrotu usuniętych/rozwiązanych braków.

## Ryzyka

- To jest etap UI/runtime, bez SQL.
- Nie zamykać jako CLOSED bez manual smoke.
- Nie wolno wracać do `case_items` jako aktywnego źródła Braków.
- Nie wolno tworzyć lokalnej kopii Braków tylko dla kafelka.

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
