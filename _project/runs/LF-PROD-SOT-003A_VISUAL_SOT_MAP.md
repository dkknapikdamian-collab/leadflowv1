# LF-PROD-SOT-003A — Mapowanie wizualnego źródła prawdy

## Status

VISUAL_SOT_MAP_DONE / READY_FOR_003B_VISUAL_REPOSITORY

## Wejście

Previous stage: LF-PROD-SOT-002B = FULLY_CLOSED / OBSIDIAN_LOCAL_SYNC_DONE_WITH_UNRELATED_DIRTY_FILE / READY_FOR_003A_VISUAL_SOT_MAP
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
Unrelated dirty file: 10_PROJEKTY/Audytomat_Strony/04_KIERUNEK_DO_WDROZENIA - P001 - RaportStrony.org.md

## Zakres

Etap dokumentacyjno-audytowy. Nie zmieniano UI, CSS, runtime, SQL, Supabase/API, routingu, status repository ani date-time repository.

Mapowane obszary: Today, Leads, LeadDetail, Clients, ClientDetail, Cases, CaseDetail, Tasks, Calendar, Billing/Finance, Settings, AI drafts, Sidebar, Page shell, reusable components, UI primitives, CSS/theme/Tailwind, icons, forms, modals, tables/lists, cards/kafelki.

## Evidence counts

8656 — 01-classname-style-components.txt
15067 — 02-tailwind-classes.txt
13136 — 03-colors-css-vars.txt
21033 — 04-inline-patch-layers.txt
7370 — 05-icons-tones-status.txt
2974 — 06-shell-cards-forms-actions.txt
461 — 07-legacy-patch-todo.txt
61380 — 08-theme-config-css-global.txt

## VISUAL_SOT_MAP

### Global visual sources

Źródła: src/index.css, src/styles/design-system/closeflow-tokens.css, src/styles/design-system/closeflow-icons.css, src/styles/closeflow-visual-source-truth.css, src/styles/closeflow-record-list-source-truth.css, src/styles/closeflow-modal-visual-system.css, src/styles/closeflow-page-header-card-source-truth.css, src/styles/closeflow-page-header-final-lock.css, src/styles/closeflow-metric-tiles.css, src/styles/closeflow-detail-view-source-truth-stage219.css, src/styles/closeflow-right-rail-source-truth.css, src/styles/finance/closeflow-finance.css.
Ryzyko: istnieją tokeny i systemy wizualne, ale konkurują z wieloma stage/final-lock/hardfix CSS.
Rekomendacja 003B: stworzyć read-only visual repository, bez refactor UI.

### Page shell / Sidebar

Źródła: src/components/Layout.tsx, src/styles/visual-stage01-shell.css, closeflow page-header CSS.
Ryzyko: kilka locków dla shell/header/sidebar.
Rekomendacja 003B: jeden kontrakt PageShell/Header/Sidebar.

### Today

Źródła: src/pages/Today.tsx, src/pages/TodayStable.tsx, visual-stage21-today-final-lock.css, visual-stage17-today-hard-1to1.css, closeflow-metric-tiles.css.
Ryzyko: Today i TodayStable równolegle; kafelki/metryki między TSX i CSS lock.
Rekomendacja 003B: kontrakt metric tiles, section cards, badges, list rows, icon tones.

### Leads / LeadDetail

Źródła: src/pages/Leads.tsx, src/pages/LeadDetail.tsx, visual-stage14/22/24/25/26 leads CSS.
Ryzyko: dużo final/parity/hardfix CSS; badge/tone/action styles bez jednego SOT.
Rekomendacja 003B: kontrakt lead card/list/badge/action/form/modal.

### Clients / ClientDetail

Źródła: src/pages/Clients.tsx, src/pages/ClientDetail.tsx, visual-stage12-client-detail-vnext.css, stage35-clients-value-detail-cleanup.css.
Ryzyko: ClientDetail to duże lokalne źródło className/style/colors.
Rekomendacja 003B: kontrakt client detail/card/badge/form.

### Cases / CaseDetail

Źródła: src/pages/Cases.tsx, src/pages/CaseDetail.tsx, visual-stage13-case-detail-vnext.css, case-detail-focus.css, case-history-source-truth.css, right-rail-source-truth.css, case-detail-stage228r9-shell-rail-lift.css, case-finance-modal CSS.
Ryzyko: CaseDetail największy TSX visual hotspot; workspace/rail/finanse/historia/actions mają wiele warstw.
Rekomendacja 003B: tylko read-only kontrakt, zero big-bang refactor.

### Tasks / Calendar

Źródła: src/pages/Tasks.tsx, src/pages/TasksStable.tsx, src/pages/Calendar.tsx, calendar tile CSS, event form CSS, task form CSS, operator rail tasks CSS.
Ryzyko: task rows/cards, event forms i Calendar tile styles są rozproszone.
Rekomendacja 003B: kontrakt task/event/calendar visual oddzielony od date-time repository.

### Billing / Finance

Źródła: src/pages/Billing.tsx, finance CSS, billing visual taxonomy CSS, finance dialogs.
Ryzyko: amount typography, settlement surfaces, modal layout i payment/commission colors są rozdzielone.
Rekomendacja 003B: finance visual taxonomy oddzielona od finance runtime/data.

### Settings / AI drafts / assistant surfaces

Źródła: src/pages/Settings.tsx, src/pages/AiDrafts.tsx, src/pages/AdminAiSettings.tsx, LeadAiFollowupDraft, visual-stage9-ai-drafts-vnext.css.
Ryzyko: AI drafts mają osobny visual layer.
Rekomendacja 003B: włączyć AI/drafts surfaces do visual repository.

### Reusable components / UI primitives

Źródła: src/components/ui/select.tsx, src/components/ui-system/ActionIcon.tsx, src/components/entity-actions.tsx, src/components/StatShortcutCard.tsx, src/ui-system/icons/SemanticIcon.tsx, dialog/form components.
Ryzyko: prymitywy istnieją, ale strony nadal mają dużo lokalnych className, raw button debt, lucide imports i stage CSS.
Rekomendacja 003B: visual repository ma wskazać aktywne primitives i zabronione lokalne obejścia.

### Forms / Modals / Dialogs

Źródła: ClientCreateDialog, ContextActionDialogs, finance dialogs, closeflow-modal-visual-system.css, event/task/template modal CSS.
Ryzyko: różne width, footer/action layout, spacing, input/select style.
Rekomendacja 003B: kontrakt modal/form/field/action layout.

## Najważniejsze duplikaty wizualne

| Obszar | Duplikat | Ryzyko | Rekomendacja |
|---|---|---|---|
| Global CSS | source truth/final lock/hardfix równolegle | konkurencyjne SOT | 003B read-only visual repository |
| CaseDetail | TSX + kilka CSS warstw | wysokie | tylko kontrakt, bez refactor |
| Today | Today + TodayStable + hard locks | wysokie | tile/list row contract |
| Leads | final/parity/hardfix CSS | wysokie | lead card/list/badge contract |
| Clients | ClientDetail + cleanup CSS | średnie/wysokie | detail/card/form contract |
| Calendar/Tasks | tile/form/task rail CSS | wysokie | task/event/calendar contract |
| Forms/modals | kilka modal/form systems | średnie | modal/form contract |
| Icons | SemanticIcon plus lokalne ikony/kolory | średnie | semantic icon tone registry |

## Patch layers / legacy visual risk

| Plik | Pattern | Ryzyko | Rekomendacja |
|---|---|---|---|
| visual-stage12-client-detail-vnext.css | stage vnext CSS | wysokie | mapować, nie usuwać |
| visual-stage13-case-detail-vnext.css | stage vnext CSS | wysokie | mapować, nie usuwać |
| visual-stage14-lead-detail-vnext.css | stage vnext CSS | wysokie | mapować, nie usuwać |
| closeflow-calendar-selected-day-new-tile-v9.css | tile v9 CSS | średnie/wysokie | kontrakt później |
| visual-stage24-leads-html-dom-parity-hardfix.css | hardfix/parity | wysokie | zakaz kolejnych patchy |
| temporary-overrides.css | temporary override | wysokie | UNKNOWN_NEEDS_REVIEW |
| closeflow-page-header-final-lock.css | final lock | średnie | PageShell contract |
| closeflow-modal-visual-system.css | modal visual system | średnie | włączyć do 003B |
| OperatorMetricToneRuntime.tsx | runtime tone component | średnie | mapować, nie usuwać |
| status-repository.ts | status SOT | średnie | oddzielić status truth od visual truth |

## Kandydaci do 003B

003B powinien utworzyć read-only moduł: src/lib/source-of-truth/visual-repository.ts
Proponowane eksporty: visualTokenSourceMap, globalVisualContract, pageShellVisualContract, sidebarVisualContract, metricTileVisualContract, recordListVisualContract, detailViewVisualContract, buttonActionVisualContract, formFieldVisualContract, modalDialogVisualContract, badgeToneVisualContract, statusToneVisualContract, severityToneVisualContract, semanticIconVisualContract, financeVisualContract, calendarTaskEventVisualContract, visualRepository.

## Czego nie ruszano

runtime: NOT_TOUCHED
CSS: NOT_TOUCHED
Tailwind config: NOT_TOUCHED
UI components: NOT_TOUCHED
SQL: NOT_TOUCHED
Supabase/API: NOT_TOUCHED
routing: NOT_TOUCHED
auth: NOT_TOUCHED
date-time repository: NOT_TOUCHED
status repository: NOT_TOUCHED
data provider: NOT_TOUCHED
visual repository: NOT_CREATED

## Guard/test/build

npm run guard:routes:canonical: PASS
npm run guard:ui:patch-layers: PASS
npm run check:polish-mojibake: PASS
git diff --check: PASS
Build: NOT_REQUIRED_DOCS_ONLY

Guard known debt: domPatchFiles 16; directTrash2Files 15; styleLayerFiles 32; stageClassFiles 35; rawButtonFiles 39; lucideImportFiles 54; inlineStyleFiles 12; displayStackImportantFiles 8; cssPatchFiles 238; appStyleImportFiles 0; localIconButtonCloneFiles 5; localColorMapFiles 0; routeLiteralFiles 9.

## Ryzyka

003B nie może być big-bang refactorem UI. Nie wolno tworzyć kolejnej warstwy patchy. Tokeny wizualne muszą być oddzielone od status repository i date-time repository. Legacy CSS/inline style muszą być mapowane przed usuwaniem. Największe ryzyko: CaseDetail, Today, Leads, ClientDetail, Calendar/Tasks, modale.

## Decyzja

LF-PROD-SOT-003A: VISUAL_SOT_MAP_DONE / READY_FOR_003B_VISUAL_REPOSITORY
Następny etap: LF-PROD-SOT-003B — Visual repository
003B musi być osobnym etapem.

## Zapis do Obsidiana

data i godzina: 2026-07-01 08:48 Europe/Warsaw
name/alias: LF-PROD-SOT-003A_VISUAL_SOT_MAP
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-003A_VISUAL_SOT_MAP.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-003A_VISUAL_SOT_MAP.md
save status: APP_REPORT_LOCAL_READY / OBSIDIAN_REPORT_LOCAL_READY
Obsidian GitHub sync: PENDING_LOCAL_COMMIT_PUSH
Obsidian local sync: READY_AFTER_PUSH_PULL
tests: GUARD_ROUTES_PASS / GUARD_UI_PATCH_LAYERS_PASS / MOJIBAKE_PASS / DIFF_CHECK_PASS / BUILD_NOT_REQUIRED_DOCS_ONLY
risk audit: visual map completed from local rg evidence; no runtime/CSS/UI/code changed; evidence files removed after report synthesis
what was not touched: runtime, CSS, Tailwind config, UI components, SQL, Supabase/API, routing, auth, date-time repository, status repository, data provider, visual repository
next step: commit app report, commit obsidian report, push both, pull obsidian
