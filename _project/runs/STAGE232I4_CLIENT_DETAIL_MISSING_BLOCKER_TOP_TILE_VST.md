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
