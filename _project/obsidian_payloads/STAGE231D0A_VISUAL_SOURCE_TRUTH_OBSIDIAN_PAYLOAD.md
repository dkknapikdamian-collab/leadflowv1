# Zapis do Obsidiana — STAGE231D0A Visual Source of Truth

Marker: STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY
Data i godzina: 2026-06-10 17:10 Europe/Warsaw
Nazwa / alias wejściowy: STAGE231D0A — Visual Source of Truth Inventory + UI Consistency Guard
Canonical name: CloseFlow / LeadFlow
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
Typ wpisu: zasada UI / source of truth / etap poprzedzający D0
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Decyzja
Style, kafelki, ikony, badge'e, przyciski i finance rows mają mieć wspólne źródło prawdy. Nie wolno tworzyć lokalnych wyjątków bez mapowania.

## Miejsce w roadmapie
Kolejność po poprawce:
1. R10 — domknięcie archiwum spraw
2. D0A — Visual Source of Truth Inventory + UI Consistency Guard
3. D0 — Client workspace UX cleanup + mojibake guard
4. D1 — model kosztów
5. D2 — koszty w sprawie
6. D3 — finanse klienta + koszty
7. D4 — miesięczny wykres
8. D5 — regresja finansów/kosztów/UI

## Źródła prawdy sprawdzone
- Cards: `SurfaceCard`, `MetricTile`, `closeflow-record-list-source-truth.css`, `visual-stage12-client-detail-vnext.css`, `closeflow-unified-page-canvas-stage211c.css`.
- Buttons: `buttonVariants`, `EntityActionButton`, `EntityTrashButton`, `actionButtonClass`, `modalFooterClass`.
- Badges: `StatusPill`.
- Icons: `ENTITY_ICON_MAP`, `EntityIcon`.
- Finance rows: `FinanceMiniSummary`, `ClientFinanceRelationSummary`, `cf-finance-metric`.
- Typography/spacing/colors: shared UI components, record list CSS, unified canvas, finance CSS.

## Testy
- `node scripts/check-stage231d0a-visual-source-truth-consistency.cjs`
- `node --test tests/stage231d0a-visual-source-truth-consistency.test.cjs`
- `npm run build`
- `git diff --check`

## audyt ryzyk po etapie
- Bez D0A developer może znowu stworzyć niespójne lokalne kafelki.
- Istnieją starsze style page-local; D0A nie usuwa ich automatycznie, tylko wskazuje źródła prawdy i blokuje brak raportu.
- D0/D1-D3 muszą kontynuować na bazie mapy VST, inaczej etap należy odrzucić.

## następny krok
Po PASS D0A wdrożyć D0 dopiero po sprawdzeniu mapy VST i raportu developera.
