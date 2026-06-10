# STAGE231D0A — Visual Source of Truth Inventory + UI Consistency Guard

Marker: STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY
Status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_AND_PUSH_AFTER_APPROVAL
Data: 2026-06-10 17:10 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan report

### Repo files read:
- `AGENTS.md`
- `package.json`
- `_project/03_CURRENT_STAGE.md`
- `_project/07_NEXT_STEPS.md`
- `src/components/ui/button.tsx`
- `src/components/entity-actions.tsx`
- `src/components/ui-system/index.ts`
- `src/components/ui-system/EntityIcon.tsx`
- `src/components/ui-system/icon-registry.ts`
- `src/components/ui-system/SurfaceCard.tsx`
- `src/components/ui-system/MetricTile.tsx`
- `src/components/ui-system/StatusPill.tsx`
- `src/components/finance/FinanceMiniSummary.tsx`
- `src/pages/Clients.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/Cases.tsx`
- `src/styles/closeflow-record-list-source-truth.css`
- `src/styles/closeflow-unified-page-canvas-stage211c.css`
- `src/styles/visual-stage12-client-detail-vnext.css`

### Obsidian/project-memory files read:
- Brak bezpośredniego dostępu do lokalnego Obsidiana w tej rozmowie.
- Przygotowano payload do zapisania w `10_PROJEKTY/CloseFlow_Lead_App`.

### Symptom:
Ryzyko, że kolejne etapy UI będą tworzyć lokalne style kart, ikon, badge'y, przycisków i finance rows zamiast używać istniejących źródeł prawdy.

### Likely cause:
Repo ma już kilka istniejących visual source of truth, ale nie było jednego mikro-etapu, który przed D0 wymusza ich mapowanie i raportowanie.

### Source location:
- `src/components/ui/button.tsx`
- `src/components/entity-actions.tsx`
- `src/components/ui-system/*`
- `src/components/finance/FinanceMiniSummary.tsx`
- `src/styles/closeflow-record-list-source-truth.css`
- `src/styles/closeflow-unified-page-canvas-stage211c.css`
- `src/styles/visual-stage12-client-detail-vnext.css`

### Similar places to inspect:
- `src/pages/Clients.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/Cases.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/Leads.tsx`
- `src/pages/LeadDetail.tsx`

### Minimal safe fix:
Dodać D0A jako etap inventory/guard. Nie zmieniać UI runtime. Nie tworzyć nowych kart ani CSS, jeśli repo ma już używalne wzorce.

### Regression risk:
Niskie dla runtime, bo D0A nie powinien zmieniać widoków. Średnie dla procesu, jeśli guard będzie zbyt ostry wobec starych lokalnych stylów. Dlatego D0A blokuje brak mapy i brak źródeł, a nie próbuje automatycznie przepisać całego UI.

### Test/guard plan:
- `node scripts/check-stage231d0a-visual-source-truth-consistency.cjs`
- `node --test tests/stage231d0a-visual-source-truth-consistency.test.cjs`
- `npm run build`
- `git diff --check`

### Documentation update needed:
- `_project/VISUAL_SOURCE_OF_TRUTH.md`
- `_project/03_CURRENT_STAGE.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/07_NEXT_STEPS.md`
- `_project/08_CHANGELOG_AI.md`
- `_project/10_PROJECT_TIMELINE.md`
- `_project/12_IMPLEMENTATION_LEDGER.md`
- `_project/13_TEST_HISTORY.md`
- `_project/obsidian_payloads/STAGE231D0A_VISUAL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md`

## VISUAL SOURCE OF TRUTH

### Sprawdzone wzorce:
- Cards: `SurfaceCard`, `closeflow-record-list-source-truth.css`, `visual-stage12-client-detail-vnext.css`, unified detail/page canvas.
- Buttons: `buttonVariants`, `EntityActionButton`, `EntityTrashButton`, `actionButtonClass`, `modalFooterClass`.
- Badges: `StatusPill`, finance status pill usage.
- Icons: `ENTITY_ICON_MAP`, `EntityIcon`.
- Finance rows: `FinanceMiniSummary`, `ClientFinanceRelationSummary`, `cf-finance-metric`.
- Typography: card titles in `SurfaceCard`, list row titles in record list CSS, finance values in finance CSS/component.
- Spacing: `--cf-page-canvas-*`, record list grid spacing, entity action clusters.

### Źródło prawdy użyte:
- `src/components/ui/button.tsx`
- `src/components/entity-actions.tsx`
- `src/components/ui-system/index.ts`
- `src/components/ui-system/EntityIcon.tsx`
- `src/components/ui-system/icon-registry.ts`
- `src/components/ui-system/SurfaceCard.tsx`
- `src/components/ui-system/MetricTile.tsx`
- `src/components/ui-system/StatusPill.tsx`
- `src/components/finance/FinanceMiniSummary.tsx`
- `src/styles/closeflow-record-list-source-truth.css`
- `src/styles/closeflow-unified-page-canvas-stage211c.css`

### Nowe klasy dodane:
- Brak. D0A jest etapem inventory/guard, nie runtime UI.

### Dlaczego były potrzebne:
- Nie dotyczy. Nie dodano nowego runtime CSS.

### Czy są scoped:
- Nie dotyczy.

### Czy nie dublują istniejących:
- Nie dotyczy. Etap wskazuje istniejące wzorce zamiast tworzyć nowe.

## VISUAL SOURCE OF TRUTH MAP

### Cards:
- `SurfaceCard` — wspólna karta powierzchniowa.
- `MetricTile`/`OperatorMetricTiles` — kafelki metryk/statusu.
- `closeflow-record-list-source-truth.css` — karty/wiersze list rekordów.
- `visual-stage12-client-detail-vnext.css` — aktualny układ kart klienta.
- `closeflow-unified-page-canvas-stage211c.css` — źródło prawdy szerokości/canvasu.

### Buttons:
- `src/components/ui/button.tsx` — primitive `Button` i `buttonVariants`.
- `src/components/entity-actions.tsx` — akcje encji, delete/restore/action clusters.

### Badges:
- `src/components/ui-system/StatusPill.tsx` — główny wzorzec statusów.
- `FinanceMiniSummary.tsx` — finance status przez `StatusPill`.

### Icons:
- `src/components/ui-system/icon-registry.ts` — mapa ikon.
- `src/components/ui-system/EntityIcon.tsx` — komponent konsumujący mapę.

### Finance rows:
- `src/components/finance/FinanceMiniSummary.tsx` — commission/finance row vocabulary.
- D1-D3 muszą rozszerzyć ten język o koszty bez lokalnego bloku w ClientDetail.

### Typography:
- `SurfaceCard` dla tytułów kart.
- `closeflow-record-list-source-truth.css` dla list.
- `FinanceMiniSummary`/finance CSS dla liczb finansowych.

### Spacing:
- `--cf-page-canvas-*` i `--cf-detail-shell-*`.
- `cf-entity-action-cluster`, `cf-panel-header-actions`, `cf-panel-action-row`.

### Colors:
- Primary/danger w `buttonVariants`.
- Status tones w `StatusPill`.
- Finance tones w `FinanceMiniSummary` + finance CSS.
- Canvas neutralny w `closeflow-unified-page-canvas-stage211c.css`.

## Ryzyka:
- Stare style lokalne nadal istnieją i mogą kusić do kopiowania.
- D0/D1-D3 mogą rozjechać UI, jeśli developer ominie mapę.
- Guard D0A nie zastępuje późniejszego wizualnego przeglądu manualnego.

## Co nie było ruszane:
- Runtime UI.
- Supabase/SQL.
- Logika zamykania/przywracania/usuwania spraw.
- Google Calendar.
- Finanse i płatności.

## Następny krok:
Po PASS D0A wdrażać D0, ale tylko na bazie tej mapy i raportu VISUAL SOURCE OF TRUTH.
