# LF-PROD-SOT-003B — Visual repository

## Status

VISUAL_REPOSITORY_ADDED / GUARD_PASS_AFTER_LOCAL_RUN / TEST_PASS_AFTER_LOCAL_RUN / BUILD_PASS_AFTER_LOCAL_RUN / READY_FOR_004A_RUNTIME_ADOPTION_MAP

## Wejście

Previous stage:
LF-PROD-SOT-003A = FULLY_CLOSED / VISUAL_SOT_MAP_DONE / READY_FOR_003B_VISUAL_REPOSITORY

Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
HEAD: LOCAL_HEAD_AT_COMMIT_TIME
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY

## Linki SOT / mapa wejściowa

Centralny indeks map:
10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md

Mapa wejściowa:
_project/runs/LF-PROD-SOT-003A_VISUAL_SOT_MAP.md
10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-003A_VISUAL_SOT_MAP.md

## Zakres

Co dodano:
- visual-repository.ts
- guard
- test
- package alias
- app report
- Obsidian report
- read-only adoption: ADOPTION_DEFERRED_TO_NEXT_STAGE

## VISUAL_REPOSITORY_SOURCE_MAP

- area: global visual tokens, PageShell, Sidebar, metric tiles, record lists, detail views, actions, forms, modals, badge/status/severity tones, semantic icons, finance, calendar/tasks/events, AI drafts
- source files: src/index.css, closeflow-tokens.css, closeflow-icons.css, closeflow-visual-source-truth.css, closeflow-record-list-source-truth.css, closeflow-modal-visual-system.css, closeflow-page-header-card-source-truth.css, closeflow-page-header-final-lock.css, closeflow-metric-tiles.css, closeflow-detail-view-source-truth-stage219.css, closeflow-right-rail-source-truth.css, closeflow-finance.css, Layout.tsx, Today.tsx, TodayStable.tsx, Leads.tsx, LeadDetail.tsx, Clients.tsx, ClientDetail.tsx, Cases.tsx, CaseDetail.tsx, Tasks.tsx, TasksStable.tsx, Calendar.tsx, Billing.tsx, Settings.tsx, AiDrafts.tsx, AdminAiSettings.tsx, ActionIcon.tsx, SemanticIcon.tsx
- active primitives: Layout, ActionIcon, SemanticIcon, entity-actions, StatShortcutCard, ui/select
- css sources: existing CSS/token/stage/final-lock sources only
- token sources: closeflow-tokens.css, closeflow-icons.css
- tailwind sources: existing page-level class strings documented only
- inline style risk: MEDIUM
- patch layer risk: HIGH
- legacy visual risk: HIGH
- local color maps: documented only
- local tone maps: documented only
- local badge maps: documented only
- local icon colors: documented only
- typography policy: token/CSS contract before adoption
- spacing policy: no page spacing change in 003B
- surface policy: existing CSS surfaces only
- radius policy: existing CSS/token source only
- shadow policy: existing CSS/token source only
- border policy: existing CSS/token source only
- responsive policy: observed and not changed
- forbidden patterns: no runtime visual patching, no new CSS patch layer, no business/date truth redefinition
- consumers: all screens and shared visual primitives
- recommendation: 004A should map safe adoption before runtime changes

## Eksporty repository

- visualTokenSourceMap
- globalVisualContract
- pageShellVisualContract
- sidebarVisualContract
- metricTileVisualContract
- recordListVisualContract
- detailViewVisualContract
- buttonActionVisualContract
- formFieldVisualContract
- modalDialogVisualContract
- badgeToneVisualContract
- statusToneVisualContract
- severityToneVisualContract
- semanticIconVisualContract
- financeVisualContract
- calendarTaskEventVisualContract
- aiDraftVisualContract
- visualRepository

## Najważniejsze rozdzielenia

- visual tones !== business status truth
- date urgency !== visual badge color
- CSS/token sources !== runtime adoption
- semantic icons !== local lucide color patches
- modal/form contract !== modal redesign
- CaseDetail visual hotspot !== refactor target in 003B
- PageShell contract !== layout change
- finance visual contract !== finance runtime/data

## Ograniczone podpięcie runtime

ADOPTION_DEFERRED_TO_NEXT_STAGE

Nie przepinano runtime.

## Czego nie ruszano

runtime: NOT_TOUCHED
Today: NOT_TOUCHED
Leads: NOT_TOUCHED
Clients: NOT_TOUCHED
Cases: NOT_TOUCHED
CaseDetail: NOT_TOUCHED
Calendar: NOT_TOUCHED
Billing/Finance: NOT_TOUCHED
CSS: NOT_TOUCHED
Tailwind config: NOT_TOUCHED
UI components: NOT_TOUCHED
status repository: NOT_TOUCHED
date-time repository: NOT_TOUCHED
Supabase/API: NOT_TOUCHED
SQL/migrations: NOT_TOUCHED
routing: NOT_TOUCHED
auth: NOT_TOUCHED
data provider: NOT_TOUCHED

## Guard/test/build

npm run verify:lf-prod-sot-003b-visual-repository: PASS_AFTER_LOCAL_RUN
node --test tests/lf-prod-sot-003b-visual-repository.test.cjs: PASS_AFTER_LOCAL_RUN
npm run guard:routes:canonical: PASS_AFTER_LOCAL_RUN
npm run guard:ui:patch-layers: PASS_AFTER_LOCAL_RUN
npm run check:polish-mojibake: PASS_AFTER_LOCAL_RUN
npm run build: PASS_AFTER_LOCAL_RUN
git diff --check: PASS_AFTER_LOCAL_RUN

## Ryzyka

- 004A nie może startować, jeśli 003B nie ma PASS.
- Visual repository nie może zawierać runtime DOM/class manipulation.
- Visual repository nie może importować pages/components/CSS.
- 003B nie może wprowadzić kolejnej warstwy CSS patch.
- CaseDetail/Today/Leads/Calendar są high-risk i mogą być dotykane tylko w osobnych etapach adopcyjnych.
- status/date-time repository muszą pozostać oddzielone od visual repository.

## Decyzja

LF-PROD-SOT-003B:
VISUAL_REPOSITORY_ADDED / READY_FOR_004A_RUNTIME_ADOPTION_MAP

Następny etap:
LF-PROD-SOT-004A — Mapowanie bezpiecznej adopcji runtime

004A musi być osobnym etapem.

## Zapis do Obsidiana

data i godzina: 2026-07-01 13:00 Europe/Warsaw
name/alias: LF-PROD-SOT-003B_VISUAL_REPOSITORY
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-003B_VISUAL_REPOSITORY.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-003B_VISUAL_REPOSITORY.md
save status: LOCAL_SCRIPT_READY / APP_PUSH_PENDING / OBSIDIAN_PUSH_PENDING
Obsidian GitHub sync: PENDING_UNTIL_SCRIPT_RUN
Obsidian local sync: PENDING_UNTIL_SCRIPT_RUN
tests: PASS_AFTER_LOCAL_RUN
risk audit: read-only repository only; no runtime/CSS/UI adoption
what was not touched: runtime, CSS, Tailwind config, UI components, status repository, date-time repository, SQL/migrations, Supabase/API, routing, auth, data provider
next step: run local apply/check/push script and paste output

## 003B-R1 BOM/package.json hotfix validation

data i godzina: 2026-07-01 16:39 Europe/Warsaw

Problem:
- pierwotny commit 003B dodal wymagane pliki, ale package.json zostal zapisany z UTF-8 BOM przez PowerShell.
- npm run verify:lf-prod-sot-003b-visual-repository oraz npm run build zatrzymaly sie na JSON.parse package.json.

Fix:
- package.json przepisany jako UTF-8 bez BOM.
- nie zmieniano UI, CSS, runtime, pages/components, SQL, Supabase/API, routingu ani auth.

Recheck po fixie:
- npm run verify:lf-prod-sot-003b-visual-repository: PASS
- node --test tests/lf-prod-sot-003b-visual-repository.test.cjs: PASS
- npm run guard:routes:canonical: PASS
- npm run guard:ui:patch-layers: PASS
- npm run check:polish-mojibake: PASS
- npm run build: PASS
- git diff --check: PASS
