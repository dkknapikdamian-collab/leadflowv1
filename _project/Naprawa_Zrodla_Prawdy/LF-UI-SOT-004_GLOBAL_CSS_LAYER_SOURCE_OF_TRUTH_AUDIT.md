# LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT

Status: DONE / LOCAL_CSS_MATRIX_RECORDED / DOCS_ONLY / RUNTIME_NOT_TOUCHED / CSS_NOT_TOUCHED / IMPORT_ORDER_NOT_TOUCHED
Date: 2026-06-28 15:35 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Scope

This stage completes LF-UI-SOT-004 only. It does not start LF-UI-SOT-005.

Not touched:

- UI runtime
- CSS contents
- CSS import order
- src/App.tsx
- pages/components/layout
- SQL/API/Supabase/Firebase

## Guard baseline

- active global CSS imports in src/App.tsx: 45
- disabled legacy CSS import in src/App.tsx: 1
- scripts/check-ui-patch-layers.cjs APP_STYLES_IMPORT_MAX for src/App.tsx: 45

Decision: do not increase the App.tsx CSS import baseline and do not add new global CSS layers.

## Pattern summary

- aktywne importy CSS z App.tsx: 45
- wyłączone importy CSS z App.tsx: 1
- pliki aktywne z !important: 41
- pliki aktywne z display:none: 10
- pliki aktywne z z-index: 11
- pliki aktywne z position fixed/absolute: 8

## Status counts

- ACTIVE_COMPONENT_SYSTEM: 7
- ACTIVE_FINANCE_SYSTEM: 1
- ACTIVE_MODAL_SYSTEM: 1
- ACTIVE_RUNTIME_COMPAT: 2
- ACTIVE_TOKEN_SYSTEM: 5
- DISABLED_LAYER: 1
- DO_MIGRACJI: 7
- DO_USUNIĘCIA_PO_GUARDZIE: 1
- HOTFIX_STAGE: 21

## App.tsx CSS import matrix

| kolejność importu | ścieżka | czy plik istnieje | obszar UI | status warstwy | ryzyko | czy ma !important | czy ma display:none | czy ma z-index | czy ma position fixed/absolute | rekomendacja |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | `src/styles/closeflow-visual-source-truth.css` | TAK | app shell/layout | ACTIVE_RUNTIME_COMPAT | MEDIUM_CASCADE_RISK | TAK (277) | NIE (0) | NIE (0) | NIE (0) | Zostawić; wymaga osobnego etapu runtime/density przed cleanupem. |
| 2 | `src/styles/closeflow-action-tokens.css` | TAK | buttons/actions | ACTIVE_TOKEN_SYSTEM | MEDIUM_CASCADE_RISK | TAK (37) | NIE (0) | NIE (0) | NIE (0) | Zostawić jako token SOT; nie nadpisywać nową warstwą. |
| 3 | `src/styles/closeflow-action-clusters.css` | TAK | buttons/actions | ACTIVE_COMPONENT_SYSTEM | LOW_ACTIVE_SOT | NIE (0) | NIE (0) | NIE (0) | NIE (0) | Zostawić; przyszłe zmiany przez komponent/SOT właściciela. |
| 4 | `src/styles/closeflow-form-actions.css` | TAK | buttons/actions | ACTIVE_COMPONENT_SYSTEM | LOW_ACTIVE_SOT | NIE (0) | NIE (0) | NIE (0) | NIE (0) | Zostawić; przyszłe zmiany przez komponent/SOT właściciela. |
| 5 | `src/styles/closeflow-card-readability.css` | TAK | cards/metrics | ACTIVE_COMPONENT_SYSTEM | MEDIUM_CASCADE_RISK | TAK (13) | NIE (0) | NIE (0) | NIE (0) | Zostawić; przyszłe zmiany przez komponent/SOT właściciela. |
| 6 | `src/styles/closeflow-surface-tokens.css` | TAK | DO_POTWIERDZENIA | ACTIVE_TOKEN_SYSTEM | MEDIUM_CASCADE_RISK | TAK (4) | NIE (0) | NIE (0) | NIE (0) | Zostawić jako token SOT; nie nadpisywać nową warstwą. |
| 7 | `src/styles/closeflow-modal-visual-system.css` | TAK | modal/dialog/overlay | ACTIVE_MODAL_SYSTEM | HIGH_PATCH_LAYER | TAK (139) | TAK (1) | TAK (2) | TAK (1) | Zostawić jako bazę modal system; hotfixy scalać później. |
| 8 | `src/styles/closeflow-metric-tiles.css` | TAK | cards/metrics | ACTIVE_COMPONENT_SYSTEM | HIGH_PATCH_LAYER | TAK (314) | NIE (0) | NIE (0) | TAK (1) | Zostawić; przyszłe zmiany przez komponent/SOT właściciela. |
| 9 | `src/styles/closeflow-page-header.css` | TAK | page header | ACTIVE_COMPONENT_SYSTEM | MEDIUM_CASCADE_RISK | TAK (89) | NIE (0) | NIE (0) | NIE (0) | Zostawić; przyszłe zmiany przez komponent/SOT właściciela. |
| 10 | `src/styles/closeflow-list-row-tokens.css` | TAK | lists/rows | ACTIVE_TOKEN_SYSTEM | LOW_ACTIVE_SOT | NIE (0) | NIE (0) | NIE (0) | NIE (0) | Zostawić jako token SOT; nie nadpisywać nową warstwą. |
| 11 | `src/styles/closeflow-alert-severity.css` | TAK | DO_POTWIERDZENIA | ACTIVE_TOKEN_SYSTEM | LOW_ACTIVE_SOT | NIE (0) | NIE (0) | NIE (0) | NIE (0) | Zostawić jako token SOT; nie nadpisywać nową warstwą. |
| 12 | `src/styles/finance/closeflow-finance.css` | TAK | finance / modal rozliczeń | ACTIVE_FINANCE_SYSTEM | MEDIUM_CASCADE_RISK | TAK (33) | NIE (0) | NIE (0) | NIE (0) | Zostawić jako bazę finance; final hotfix przenieść dopiero po guardzie. |
| 13 | `src/styles/closeflow-right-rail-source-truth.css` | TAK | right rail | ACTIVE_COMPONENT_SYSTEM | HIGH_PATCH_LAYER | TAK (318) | TAK (1) | NIE (0) | NIE (0) | Zostawić; przyszłe zmiany przez komponent/SOT właściciela. |
| 14 | `src/styles/closeflow-command-actions-source-truth.css` | TAK | buttons/actions | ACTIVE_COMPONENT_SYSTEM | MEDIUM_CASCADE_RISK | TAK (148) | NIE (0) | NIE (0) | NIE (0) | Zostawić; przyszłe zmiany przez komponent/SOT właściciela. |
| 15 | `src/styles/closeflow-page-header-copy-source-truth.css` | TAK | page header | DO_MIGRACJI | HIGH_PATCH_LAYER | TAK (19) | TAK (1) | NIE (0) | NIE (0) | Przenieść do aktywnego SOT właściciela w późniejszym etapie. |
| 16 | `src/styles/closeflow-page-header-action-semantics-packet1.css` | TAK | page header | DO_MIGRACJI | MEDIUM_CASCADE_RISK | TAK (47) | NIE (0) | NIE (0) | NIE (0) | Przenieść do aktywnego SOT właściciela w późniejszym etapie. |
| 17 | `src/styles/closeflow-search-source-truth-stage134.css` | TAK | search | HOTFIX_STAGE | HIGH_PATCH_LAYER | TAK (5) | TAK (1) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 18 | `src/styles/closeflow-right-rail-heading-source-truth-stage135.css` | TAK | right rail | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (23) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 19 | `src/styles/closeflow-clean-desktop-app-shell-canvas-stage149.css` | TAK | app shell/layout | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (109) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 20 | `src/styles/closeflow-panel-typography-and-width-source-truth-stage150.css` | TAK | DO_POTWIERDZENIA | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (34) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 21 | `src/styles/closeflow-compact-cards-source-truth-stage151.css` | TAK | cards/metrics | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (28) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 22 | `src/styles/closeflow-dense-cards-80-percent-target-stage152.css` | TAK | cards/metrics | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (30) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 23 | `src/styles/closeflow-real-density-tokens-no-zoom-stage156.css` | TAK | density/scale | ACTIVE_TOKEN_SYSTEM | MEDIUM_CASCADE_RISK | TAK (67) | NIE (0) | NIE (0) | NIE (0) | Zostawić jako token SOT; nie nadpisywać nową warstwą. |
| 24 | `src/styles/closeflow-overlay-portal-density-stage158.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (28) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 25 | `src/styles/closeflow-overlay-real-density-and-footer-stage159.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | HIGH_PATCH_LAYER | TAK (93) | NIE (0) | TAK (2) | TAK (2) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 26 | `src/styles/closeflow-modal-center-and-compact-all-stage160.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | HIGH_PATCH_LAYER | TAK (96) | NIE (0) | TAK (1) | TAK (4) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 27 | `src/styles/closeflow-cf-modal-surface-center-fix-stage161.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | HIGH_PATCH_LAYER | TAK (77) | NIE (0) | TAK (3) | TAK (2) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 28 | `src/styles/closeflow-cf-modal-surface-lower-smaller-stage162.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (62) | NIE (0) | TAK (1) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 29 | `src/styles/closeflow-cf-modal-main-center-tall-compact-stage163.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (69) | NIE (0) | TAK (1) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 30 | `src/styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (97) | NIE (0) | TAK (1) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 31 | `src/styles/closeflow-modal-unified-event-motif-source-truth-stage165.css` | TAK | modal/dialog/overlay | DO_MIGRACJI | HIGH_PATCH_LAYER | TAK (136) | NIE (0) | TAK (3) | TAK (3) | Przenieść do aktywnego SOT właściciela w późniejszym etapie. |
| 32 | `src/styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css` | TAK | modal/dialog/overlay | DO_MIGRACJI | HIGH_PATCH_LAYER | TAK (39) | TAK (1) | TAK (1) | NIE (0) | Przenieść do aktywnego SOT właściciela w późniejszym etapie. |
| 33 | `src/styles/closeflow-topic-contact-picker-readable-stage169.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (39) | NIE (0) | TAK (1) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 34 | `src/styles/closeflow-task-dialog-relation-and-field-readability-stage170.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (41) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 35 | `src/styles/closeflow-remove-modal-helper-copy-stage171.css` | TAK | modal/dialog/overlay | DO_USUNIĘCIA_PO_GUARDZIE | HIGH_PATCH_LAYER | TAK (9) | NIE (0) | NIE (0) | TAK (1) | Usunąć dopiero po dodaniu guarda i ręcznym smoke. |
| 36 | `src/styles/closeflow-global-client-create-dialog-stage172.css` | TAK | modal/dialog/overlay | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (15) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 37 | `src/styles/closeflow-main-search-source-truth-stage173.css` | TAK | search | DO_MIGRACJI | HIGH_PATCH_LAYER | TAK (40) | TAK (1) | NIE (0) | NIE (0) | Przenieść do aktywnego SOT właściciela w późniejszym etapie. |
| 38 | `src/styles/closeflow-main-search-surface-and-text-normalization-stage174.css` | TAK | search | DO_MIGRACJI | HIGH_PATCH_LAYER | TAK (62) | TAK (1) | NIE (0) | NIE (0) | Przenieść do aktywnego SOT właściciela w późniejszym etapie. |
| 39 | `src/styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css` | TAK | search | DO_MIGRACJI | HIGH_PATCH_LAYER | TAK (63) | TAK (1) | NIE (0) | NIE (0) | Przenieść do aktywnego SOT właściciela w późniejszym etapie. |
| 40 | `src/styles/closeflow-leads-clients-list-layout-source-truth-stage177.css` | TAK | lists/rows | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (76) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 41 | `src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css` | TAK | right rail | HOTFIX_STAGE | HIGH_PATCH_LAYER | TAK (214) | TAK (2) | TAK (2) | TAK (2) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 42 | `src/styles/closeflow-secondary-pages-full-width-stage181ad.css` | TAK | DO_POTWIERDZENIA | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (32) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 43 | `src/styles/closeflow-app-viewport-scale-75-stage201.css` | TAK | density/scale | ACTIVE_RUNTIME_COMPAT | MEDIUM_CASCADE_RISK | TAK (29) | NIE (0) | NIE (0) | NIE (0) | Zostawić; wymaga osobnego etapu runtime/density przed cleanupem. |
| 44 | `src/styles/closeflow-ops-badges-and-icons-stretch-stage204.css` | TAK | DO_POTWIERDZENIA | HOTFIX_STAGE | MEDIUM_CASCADE_RISK | TAK (58) | NIE (0) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |
| 45 | `src/styles/stage231h-r1e-case-finance-correction-modal-final.css` | TAK | finance / modal rozliczeń | HOTFIX_STAGE | HIGH_PATCH_LAYER | TAK (13) | TAK (4) | NIE (0) | NIE (0) | Nie ruszać teraz; kandydat do konsolidacji po owner guardzie. |

## Disabled App.tsx CSS import matrix

| ścieżka | czy plik istnieje | obszar UI | status warstwy | ryzyko | czy ma !important | czy ma display:none | czy ma z-index | czy ma position fixed/absolute | rekomendacja |
|---|---|---|---|---|---|---|---|---|---|
| `src/styles/closeflow-viewport-zoom-80-source-truth-stage157.css` | TAK | density/scale | DISABLED_LAYER | LOW_DISABLED | TAK (37) | NIE (0) | NIE (0) | NIE (0) | Zostawić wyłączone; nie reaktywować bez decyzji. |

## Conflict map

| ID | Area | Problem | Risk | Later repair direction |
|---|---|---|---|---|
| CSS-CONFLICT-001 | page header | page-header, page-header-copy and action semantics are split | edits may land in the wrong layer | page-header owner guard/consolidation |
| CSS-CONFLICT-002 | modal/dialog | modal base plus many stage overlay layers | another modal fix can stack more CSS | modal owner map before cleanup |
| CSS-CONFLICT-003 | right rail | right rail base, heading and grouped list are split | CaseDetail/Tasks rail regressions | right-rail owner map |
| CSS-CONFLICT-004 | search | search source truth is duplicated across stage134 and 173-175 | secondary search divergence | search SOT consolidation |
| CSS-CONFLICT-005 | density/scale | density and zoom spread across cards, overlays and viewport | browser zoom fixes may fight layout | density/scale owner map |
| CSS-CONFLICT-006 | finance modal | finance base and final finance modal hotfix split ownership | finance modal can bypass modal canonical style | finance modal integration after guard |
| CSS-CONFLICT-007 | cards/list layout | cards and list layout split between base and stage layers | inconsistent cards across screens | active visual template dictionary after this stage |

## Tests / verify

- npm run guard:ui:patch-layers: PASS
- node --test tests/ui-patch-layers-guard.test.cjs: PASS
- npm run guard:routes:canonical: PASS
- npm run guard:config:status-source-of-truth: PASS
- node --test tests/config-status-source-of-truth.test.cjs: PASS
- npm run build: PASS
- npm run verify:closeflow:quiet: PASS
- git diff --check: PASS

## Final decision

LF-UI-SOT-004 is now complete only if this report, run report and obsidian update file are committed and pushed.

NEXT is still not LF-UI-SOT-005 until Damian verifies Test-Path locally.
