# STAGE227A — Sales Funnel Movement View — aktualizacja Obsidiana

Data i godzina: 2026-06-06 15:35 Europe/Warsaw
Nazwa / alias wejściowy: Stage227A — Sales Funnel Movement View local-only
Entity ID: DO_POTWIERDZENIA
Workspace ID: DO_POTWIERDZENIA
Project ID: CloseFlow_Lead_App / DO_POTWIERDZENIA
Canonical name: CloseFlow / LeadFlow
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Wpis do 02_AKTUALNY_STAN

Stage227A przygotowuje lokalny, read-only widok `/funnel` — Lejek ruchu sprzedażowego. Widok zbiera istniejące sygnały: etap, ostatni kontakt, ciszę, następny krok, ryzyko i wartość/prowizję dla leadów oraz spraw. Nie jest to klasyczny kanban CRM.

## Wpis do 03_AKTYWNE_DECYZJE

Stage227A jest lokalnym, read-only wdrożeniem widoku Lejek. Lejek nie jest klasycznym kanbanem CRM. Nie ma drag/drop ani mutacji statusu. Widok zbiera istniejące sygnały: ciszę, brak następnego kroku, ryzyko i wartość/prowizję. Push dopiero po akceptacji Damiana.

## Wpis do 04_KIERUNEK_DO_WDROZENIA

Kierunek: Owner-control funnel. Najpierw pokazujemy gdzie stoi ruch sprzedażowy i pieniądze; dopiero później można rozważać akcje operacyjne. Kolejny etap po akceptacji Stage227A: osobny ekran/sekcja do odzyskiwania albo Finance Watchlist, zależnie od testu ręcznego `/funnel`.

## Wpis do 06_MAPA_ZALEZNOSCI

Stage227A zależy od:
- `src/lib/owner-control/activity-truth.ts`
- `src/lib/owner-control/contact-cadence-grid.ts`
- `src/lib/owner-control/lost-lead-rescue.ts`
- `src/lib/work-items/planned-actions.ts`
- `src/lib/work-items/normalize.ts`
- `src/lib/record-operational-badges.ts`
- `src/lib/finance/case-finance-source.ts`
- `src/lib/supabase-fallback.ts`

## Wpis do 07_SCIAGA_PLIKOW

Nowe pliki:
- `src/pages/SalesFunnel.tsx`
- `src/lib/owner-control/sales-funnel-movement.ts`
- `scripts/check-stage227a-sales-funnel-movement-view.cjs`
- `tests/stage227a-sales-funnel-movement-view.test.cjs`
- `_project/runs/STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_LOCAL_RUN.md`
- `_project/reports/STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_LOCAL_REPORT.md`
- `_project/obsidian_updates/STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_OBSIDIAN_UPDATE.md`

Zmodyfikowane pliki:
- `src/App.tsx`
- `src/components/Layout.tsx`
- `package.json`
- `scripts/closeflow-release-check-quiet.cjs`
- `_project/04_DECISIONS.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/07_NEXT_STEPS.md`
- `_project/08_CHANGELOG_AI.md`
- `_project/12_IMPLEMENTATION_LEDGER.md`
- `_project/13_TEST_HISTORY.md`

## Wpis do 09_TESTY_DO_WYKONANIA_I_WYNIKI

Do wykonania lokalnie:
- `node scripts/check-stage227a-sales-funnel-movement-view.cjs`
- `node --test tests/stage227a-sales-funnel-movement-view.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- regresja R10 lead/client separation, jeśli pliki istnieją
- regresja R11 Google Calendar timezone reminder truth, jeśli pliki istnieją
- manual smoke `/funnel`

## Wpis do 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

Ryzyka po Stage227A:
- Nie dopuścić, żeby `/funnel` stał się zwykłym kanbanem z drag/drop.
- Nie traktować `updatedAt/createdAt` jako prawdy ostatniego kontaktu.
- Nie mieszać leada z klientem.
- Nie mieszać pełnej wartości transakcji z prowizją sprawy.
- Sprawdzić manualnie, czy godziny zadań/wydarzeń na kartach nie są przesunięte.
- Sprawdzić mobile i szeroki lejek, bo poziomy scroll może wymagać późniejszego dopracowania.
