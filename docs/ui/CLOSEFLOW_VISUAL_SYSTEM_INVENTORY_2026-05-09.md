# CloseFlow — Visual System Inventory Freeze

**Data:** 2026-05-09
**Etap:** VS-0
**Tryb:** audyt / freeze, bez migracji UI
**Źródło JSON:** `docs/ui/closeflow-visual-system-inventory.generated.json`

## Werdykt

Ten dokument jest stop-klatką obecnego systemu wizualnego. Celem jest policzyć rozjazdy przed porządkowaniem, nie poprawiać wygląd.

## Legenda decyzji

| Decyzja | Znaczenie |
|---|---|
| zostaje | Element jest częścią bazowego kontraktu albo tokenów i nie migrujemy go w najbliższym cleanupie. |
| migrujemy | Element jest aktywny albo wpływa na aktywne UI, ale powinien zostać przeniesiony do standardowego komponentu/kontraktu. |
| legacy | Element wygląda na historyczny, kompatybilnościowy albo wyłączony z aktywnej ścieżki. Nie ruszać bez osobnego etapu. |
| usunąć później | Element wygląda na tymczasowy/zbędny, ale usuwanie wymaga osobnego, bezpiecznego etapu. |

## Podsumowanie liczb

| Obszar | Liczba |
|---|---:|
| Importy CSS z src/index.css | 9 |
| Pliki CSS rodzin visual-stage/hotfix/eliteflow/stage | 194 |
| Lokalne kafelki / cardy | 37 |
| Lokalne page headery / hero | 9 |
| Lokalne list rows / entry rows | 17 |
| Lokalne formularze | 34 |
| Lokalne right-card / right-rail | 56 |
| Lokalne modale / dialogi | 146 |
| Aktywne ekrany | 27 |
| Aktywne ekrany bez standardowego wrappera | 6 |
| Aktywne ekrany bez standardowych kafelków | 15 |
| Aktywne ekrany bez standardowego page hero | 9 |

## Decyzje zbiorcze

| Decyzja | Liczba |
|---|---:|
| zostaje | 11 |
| migrujemy | 518 |
| legacy | 0 |
| usunąć później | 0 |

## Importy CSS z src/index.css

| line | import | decision |
| --- | --- | --- |
| 2 | ./styles/closeflow-visual-foundation-stage212m.css | migrujemy |
| 3 | ./styles/design-system/index.css | migrujemy |
| 4 | ./styles/closeflow-operator-semantic-tones.css | migrujemy |
| 5 | ./styles/core/core-contracts.css | migrujemy |
| 6 | ./styles/page-adapters/page-adapters.css | migrujemy |
| 7 | ./styles/legacy/legacy-imports.css | migrujemy |
| 8 | ./styles/temporary/temporary-overrides.css | migrujemy |
| 9 | ./styles/emergency/emergency-hotfixes.css | migrujemy |
| 10 | ./styles/stage232a-r10-r2-lead-action-groups-visual-polish.css | migrujemy |


## Rodziny CSS do opanowania

| family | file | decision |
| --- | --- | --- |
| stage*.css | src/styles/case-detail-stage2.css | migrujemy |
| stage*.css | src/styles/case-detail-stage228r9-shell-rail-lift.css | migrujemy |
| stage*.css | src/styles/closeflow-activity-rail-force-colors-stage181v.css | migrujemy |
| stage*.css | src/styles/closeflow-activity-visual-source-truth-stage181u.css | migrujemy |
| stage*.css | src/styles/closeflow-ai-drafts-rail-force-colors-stage181w.css | migrujemy |
| stage*.css | src/styles/closeflow-app-viewport-scale-75-stage201.css | migrujemy |
| stage*.css | src/styles/closeflow-billing-visual-taxonomy-stage181z.css | migrujemy |
| stage*.css | src/styles/closeflow-canvas-edge-color-source-truth-stage211f.css | migrujemy |
| stage*.css | src/styles/closeflow-canvas-final-source-truth-stage211k.css | migrujemy |
| stage*.css | src/styles/closeflow-canvas-layer-source-truth-stage211h.css | migrujemy |
| stage*.css | src/styles/closeflow-canvas-runtime-source-truth-stage211j.css | migrujemy |
| stage*.css | src/styles/closeflow-canvas-source-truth-stage211d.css | migrujemy |
| stage*.css | src/styles/closeflow-canvas-source-truth-stage211e.css | migrujemy |
| stage*.css | src/styles/closeflow-case-detail-stage217-operation-workspace.css | migrujemy |
| stage*.css | src/styles/closeflow-case-detail-stage220a10-tabs-layout-repair.css | migrujemy |
| stage*.css | src/styles/closeflow-case-finance-modal-stage220a30.css | migrujemy |
| stage*.css | src/styles/closeflow-center-content-scroll-owner-stage207.css | migrujemy |
| stage*.css | src/styles/closeflow-cf-modal-main-center-tall-compact-stage163.css | migrujemy |
| stage*.css | src/styles/closeflow-cf-modal-surface-center-fix-stage161.css | migrujemy |
| stage*.css | src/styles/closeflow-cf-modal-surface-lower-smaller-stage162.css | migrujemy |
| stage*.css | src/styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css | migrujemy |
| stage*.css | src/styles/closeflow-clean-desktop-app-shell-canvas-stage149.css | migrujemy |
| stage*.css | src/styles/closeflow-compact-cards-source-truth-stage151.css | migrujemy |
| stage*.css | src/styles/closeflow-content-only-scroll-stage206.css | migrujemy |
| stage*.css | src/styles/closeflow-dense-cards-80-percent-target-stage152.css | migrujemy |
| stage*.css | src/styles/closeflow-desktop-content-shell-stage137.css | migrujemy |
| stage*.css | src/styles/closeflow-desktop-left-anchor-content-stage138.css | migrujemy |
| stage*.css | src/styles/closeflow-desktop-wide-content-stage136.css | migrujemy |
| stage*.css | src/styles/closeflow-detail-view-source-truth-stage219.css | migrujemy |
| stage*.css | src/styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css | migrujemy |
| stage*.css | src/styles/closeflow-fluid-work-surface-stage146.css | migrujemy |
| stage*.css | src/styles/closeflow-global-client-create-dialog-stage172.css | migrujemy |
| stage*.css | src/styles/closeflow-hard-work-frame-width-stage143.css | migrujemy |
| stage*.css | src/styles/closeflow-lead-detail-sales-signal-stage227e4.css | migrujemy |
| stage*.css | src/styles/closeflow-leads-clients-list-layout-source-truth-stage177.css | migrujemy |
| stage*.css | src/styles/closeflow-main-only-scroll-stage205.css | migrujemy |
| stage*.css | src/styles/closeflow-main-search-source-truth-stage173.css | migrujemy |
| stage*.css | src/styles/closeflow-main-search-surface-and-text-normalization-stage174.css | migrujemy |
| stage*.css | src/styles/closeflow-modal-center-and-compact-all-stage160.css | migrujemy |
| stage*.css | src/styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css | migrujemy |
| stage*.css | src/styles/closeflow-modal-unified-event-motif-source-truth-stage165.css | migrujemy |
| stage*.css | src/styles/closeflow-notifications-conflict-card-stage181aj.css | migrujemy |
| stage*.css | src/styles/closeflow-notifications-rail-force-colors-stage181x.css | migrujemy |
| stage*.css | src/styles/closeflow-ops-badges-and-icons-stretch-stage204.css | migrujemy |
| stage*.css | src/styles/closeflow-overlay-portal-density-stage158.css | migrujemy |
| stage*.css | src/styles/closeflow-overlay-real-density-and-footer-stage159.css | migrujemy |
| stage*.css | src/styles/closeflow-page-header-stage6-final-lock.css | migrujemy |
| stage*.css | src/styles/closeflow-page-scroll-owner-stage203.css | migrujemy |
| stage*.css | src/styles/closeflow-panel-typography-and-width-source-truth-stage150.css | migrujemy |
| stage*.css | src/styles/closeflow-real-density-tokens-no-zoom-stage156.css | migrujemy |
| stage*.css | src/styles/closeflow-remove-modal-helper-copy-stage171.css | migrujemy |
| stage*.css | src/styles/closeflow-repair-shared-work-width-frame-stage142.css | migrujemy |
| stage*.css | src/styles/closeflow-response-template-modal-source-truth-stage181r.css | migrujemy |
| stage*.css | src/styles/closeflow-right-rail-heading-source-truth-stage135.css | migrujemy |
| stage*.css | src/styles/closeflow-route-root-width-normalization-stage145.css | migrujemy |
| stage*.css | src/styles/closeflow-scaled-desktop-shell-stage148.css | migrujemy |
| stage*.css | src/styles/closeflow-scroll-and-calendar-overflow-stage202.css | migrujemy |
| stage*.css | src/styles/closeflow-search-source-truth-stage134.css | migrujemy |
| stage*.css | src/styles/closeflow-secondary-pages-full-width-stage181ad.css | migrujemy |
| stage*.css | src/styles/closeflow-settings-form-control-readability-stage179.css | migrujemy |
| stage*.css | src/styles/closeflow-settings-profile-readability-stage181af.css | migrujemy |
| stage*.css | src/styles/closeflow-settings-safe-copy-cleanup-stage181ai.css | migrujemy |
| stage*.css | src/styles/closeflow-settings-summary-right-rail-stage181ae.css | migrujemy |
| stage*.css | src/styles/closeflow-settings-tabs-stage181ac.css | migrujemy |
| stage*.css | src/styles/closeflow-shared-quick-actions-bar-stage227e3.css | migrujemy |
| stage*.css | src/styles/closeflow-shared-work-width-frame-stage141.css | migrujemy |
| stage*.css | src/styles/closeflow-shell-content-width-source-truth-stage144.css | migrujemy |
| stage*.css | src/styles/closeflow-shell-overflow-work-surface-stage147.css | migrujemy |
| stage*.css | src/styles/closeflow-stage16c-tasks-cases-parity.css | migrujemy |
| stage*.css | src/styles/closeflow-stage16d-tasks-metric-final-lock.css | migrujemy |
| stage*.css | src/styles/closeflow-task-dialog-relation-and-field-readability-stage170.css | migrujemy |
| stage*.css | src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css | migrujemy |
| stage*.css | src/styles/closeflow-template-modal-source-truth-stage181l.css | migrujemy |
| stage*.css | src/styles/closeflow-template-modal-source-truth-stage181n.css | migrujemy |
| stage*.css | src/styles/closeflow-toast-source-truth-stage220a33.css | migrujemy |
| stage*.css | src/styles/closeflow-topic-contact-picker-readable-stage169.css | migrujemy |
| stage*.css | src/styles/closeflow-unified-desktop-canvas-stage139.css | migrujemy |
| stage*.css | src/styles/closeflow-unified-desktop-work-width-stage140.css | migrujemy |
| stage*.css | src/styles/closeflow-unified-page-canvas-stage211c.css | migrujemy |
| stage*.css | src/styles/closeflow-viewport-zoom-80-source-truth-stage157.css | migrujemy |
| stage*.css | src/styles/closeflow-visual-foundation-source-truth-stage212a.css | migrujemy |
| stage*.css | src/styles/closeflow-visual-foundation-stage212b.css | migrujemy |
| stage*.css | src/styles/closeflow-visual-foundation-stage212g.css | migrujemy |
| stage*.css | src/styles/closeflow-visual-foundation-stage212m.css | migrujemy |
| eliteflow-* | src/styles/eliteflow-admin-feedback-p1-hotfix.css | migrujemy |
| eliteflow-* | src/styles/eliteflow-desktop-compact-scale.css | migrujemy |
| eliteflow-* | src/styles/eliteflow-final-metric-tiles-hard-lock.css | migrujemy |
| eliteflow-* | src/styles/eliteflow-metric-text-clip-tasks-repair.css | migrujemy |
| eliteflow-* | src/styles/eliteflow-metric-tiles-color-font-parity.css | migrujemy |
| eliteflow-* | src/styles/eliteflow-semantic-badges-and-today-sections.css | migrujemy |
| eliteflow-* | src/styles/eliteflow-sidebar-footer-contrast-repair.css | migrujemy |
| eliteflow-* | src/styles/eliteflow-sidebar-user-footer-below-nav.css | migrujemy |
| hotfix-* | src/styles/hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css | migrujemy |
| hotfix-* | src/styles/hotfix-ai-drafts-right-rail-stage28.css | migrujemy |
| hotfix-* | src/styles/hotfix-lead-client-right-rail-dark-wrappers.css | migrujemy |
| hotfix-* | src/styles/hotfix-right-rail-dark-wrappers.css | migrujemy |
| hotfix-* | src/styles/hotfix-task-stat-tiles-clean.css | migrujemy |
| stage*.css | src/styles/operator-rail-tasks-pattern-stage228r1.css | migrujemy |
| stage*.css | src/styles/quick-lead-capture-stage27.css | migrujemy |
| stage*.css | src/styles/sales-funnel-stage231d0f-r2-color-filter-parity.css | migrujemy |
| stage*.css | src/styles/sales-funnel-stage231d0f-visual-alignment.css | migrujemy |
| stage*.css | src/styles/stage216l-client-detail-lead-layout-cumulative.css | migrujemy |
| stage*.css | src/styles/stage216m-client-detail-lead-dimensions-sync.css | migrujemy |
| stage*.css | src/styles/stage216m-r1-client-detail-lead-grid-lock.css | migrujemy |
| stage*.css | src/styles/stage216m-r10-client-center-work-order.css | migrujemy |
| stage*.css | src/styles/stage216m-r10-r4-client-center-tabs-and-intro-lock.css | migrujemy |
| stage*.css | src/styles/stage216m-r11-client-finance-summary-right-rail-lock.css | migrujemy |
| stage*.css | src/styles/stage216m-r12-client-right-rail-finance-hard-render.css | migrujemy |
| stage*.css | src/styles/stage216m-r13-client-right-rail-finance-inline-refactor.css | migrujemy |
| stage*.css | src/styles/stage216m-r14-clean-copy-and-finance-mojibake.css | migrujemy |
| stage*.css | src/styles/stage216m-r15-client-notes-source-truth.css | migrujemy |
| stage*.css | src/styles/stage216m-r15-r1-client-notes-source-truth-repair.css | migrujemy |
| stage*.css | src/styles/stage216m-r15-r2-client-notes-source-truth-actual-repair.css | migrujemy |
| stage*.css | src/styles/stage216m-r15-r3-client-notes-source-truth-nonfragile.css | migrujemy |
| stage*.css | src/styles/stage216m-r15-r4-client-notes-source-truth-hard-repair.css | migrujemy |
| stage*.css | src/styles/stage216m-r15-r5-client-notes-source-truth-final-repair.css | migrujemy |
| stage*.css | src/styles/stage216m-r16-client-note-modal-source-truth.css | migrujemy |
| stage*.css | src/styles/stage216m-r16-r1-client-note-modal-source-truth.css | migrujemy |
| stage*.css | src/styles/stage216m-r16-r2-client-note-modal-source-truth.css | migrujemy |
| stage*.css | src/styles/stage216m-r16-r3-client-note-modal-portal-lock.css | migrujemy |
| stage*.css | src/styles/stage216m-r17-client-note-dialog-match-lead.css | migrujemy |
| stage*.css | src/styles/stage216m-r2-client-detail-card-1to1.css | migrujemy |
| stage*.css | src/styles/stage216m-r3-r1-header-actions-repair.css | migrujemy |
| stage*.css | src/styles/stage216m-r3-r2-header-clean-final.css | migrujemy |
| stage*.css | src/styles/stage216m-r4-client-right-rail-1to1.css | migrujemy |
| stage*.css | src/styles/stage216m-r5-client-right-rail-finance-colors-icons.css | migrujemy |
| stage*.css | src/styles/stage216m-r6-client-data-card-1to1.css | migrujemy |
| stage*.css | src/styles/stage216m-r6-r1-client-data-card-polish.css | migrujemy |
| stage*.css | src/styles/stage216m-r6-r2-client-data-card-button-size.css | migrujemy |
| stage*.css | src/styles/stage216m-r6-r3-client-data-card-visual-lock.css | migrujemy |
| stage*.css | src/styles/stage216m-r7-entity-data-card-source-truth.css | migrujemy |
| stage*.css | src/styles/stage216m-r8-client-left-rail-history-source-truth.css | migrujemy |
| stage*.css | src/styles/stage216m-r9-client-left-rail-final-lock.css | migrujemy |
| stage*.css | src/styles/stage231h-r1e-case-finance-correction-modal-final.css | migrujemy |
| stage*.css | src/styles/stage232a-missing-item-visual-source.css | migrujemy |
| stage*.css | src/styles/stage232a-r10-r2-lead-action-groups-visual-polish.css | migrujemy |
| stage*.css | src/styles/stage30a-mobile-contrast-lock.css | migrujemy |
| stage*.css | src/styles/stage31-full-mobile-polish.css | migrujemy |
| stage*.css | src/styles/stage33a-ai-drafts-generated-text-contrast.css | migrujemy |
| stage*.css | src/styles/stage34-calendar-readability-status-forms.css | migrujemy |
| stage*.css | src/styles/stage34b-calendar-complete-polish.css | migrujemy |
| stage*.css | src/styles/stage35-clients-value-detail-cleanup.css | migrujemy |
| stage*.css | src/styles/stage36-unified-light-pages.css | migrujemy |
| stage*.css | src/styles/stage37-unified-page-head-and-metrics.css | migrujemy |
| stage*.css | src/styles/stage38-metrics-and-relations-polish.css | migrujemy |
| stage*.css | src/styles/stage39-page-headers-copy-visual-system.css | migrujemy |
| stage*.css | src/styles/stage40-page-header-action-overflow-hardening.css | migrujemy |
| stage*.css | src/styles/stage7a-tasks-blue-outline-fix.css | migrujemy |
| stage*.css | src/styles/stage80-today-task-done-desktop-visibility.css | migrujemy |
| stage*.css | src/styles/stageA19v2-sidebar-nav-contrast-fix.css | migrujemy |
| stage*.css | src/styles/stageA20-sidebar-today-click-fix.css | migrujemy |
| stage*.css | src/styles/stageA20c-sidebar-today-hitbox-fix.css | migrujemy |
| stage*.css | src/styles/stageA20d-sidebar-unified-nav-tone.css | migrujemy |
| stage*.css | src/styles/stageA20e-sidebar-today-tone-lock.css | migrujemy |
| stage*.css | src/styles/stageA24-today-relations-label-align.css | migrujemy |
| stage*.css | src/styles/stageA25-today-relations-lead-badge-inline.css | migrujemy |
| stage*.css | src/styles/tasks-header-stage45b-cleanup.css | migrujemy |
| visual-stage* | src/styles/visual-stage01-shell.css | migrujemy |
| visual-stage* | src/styles/visual-stage02-today.css | migrujemy |
| visual-stage* | src/styles/visual-stage03-leads.css | migrujemy |
| visual-stage* | src/styles/visual-stage04-lead-detail.css | migrujemy |
| visual-stage* | src/styles/visual-stage05-clients.css | migrujemy |
| visual-stage* | src/styles/visual-stage06-client-detail.css | migrujemy |
| visual-stage* | src/styles/visual-stage07-cases.css | migrujemy |
| visual-stage* | src/styles/visual-stage08-case-detail.css | migrujemy |
| visual-stage* | src/styles/visual-stage10-notifications-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage12-client-detail-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage13-case-detail-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage14-lead-detail-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage16-billing-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage16-today-html-reset.css | migrujemy |
| visual-stage* | src/styles/visual-stage17-support-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage17-today-hard-1to1.css | migrujemy |
| visual-stage* | src/styles/visual-stage18-leads-hard-1to1.css | migrujemy |
| visual-stage* | src/styles/visual-stage19-clients-safe-css.css | migrujemy |
| visual-stage* | src/styles/visual-stage19-settings-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage20-lead-form-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage20-tasks-safe-css.css | migrujemy |
| visual-stage* | src/styles/visual-stage21-task-form-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage21-today-final-lock.css | migrujemy |
| visual-stage* | src/styles/visual-stage22-event-form-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage22-leads-final-lock.css | migrujemy |
| visual-stage* | src/styles/visual-stage23-client-case-forms-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage23-leads-html-parity-fix.css | migrujemy |
| visual-stage* | src/styles/visual-stage24-leads-html-dom-parity-hardfix.css | migrujemy |
| visual-stage* | src/styles/visual-stage25-leads-full-jsx-html-rebuild.css | migrujemy |
| visual-stage* | src/styles/visual-stage26-leads-visual-alignment-fix.css | migrujemy |
| visual-stage* | src/styles/visual-stage27-cases-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage28-tasks-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage29-calendar-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage3-pipeline-and-case.css | migrujemy |
| visual-stage* | src/styles/visual-stage30-tasks-compact-after-calendar.css | migrujemy |
| visual-stage* | src/styles/visual-stage8-activity-vnext.css | migrujemy |
| visual-stage* | src/styles/visual-stage9-ai-drafts-vnext.css | migrujemy |


## Aktywne ekrany bez pełnego kontraktu wrapper / tiles / hero

| file | page | missing | decision |
| --- | --- | --- | --- |
| src/pages/AdminAiSettings.tsx | AdminAiSettings | standard tiles | migrujemy |
| src/pages/Billing.tsx | Billing | standard tiles | migrujemy |
| src/pages/Calendar.tsx | Calendar | standard tiles | migrujemy |
| src/pages/CaseDetail.tsx | CaseDetail | standard tiles, standard page hero | migrujemy |
| src/pages/ClientDetail.tsx | ClientDetail | standard tiles, standard page hero | migrujemy |
| src/pages/ClientPortal.tsx | ClientPortal | standard wrapper, standard tiles, standard page hero | migrujemy |
| src/pages/LeadDetail.tsx | LeadDetail | standard tiles, standard page hero | migrujemy |
| src/pages/LegalPrivacy.tsx | LegalPrivacy | standard wrapper, standard tiles, standard page hero | migrujemy |
| src/pages/LegalTerms.tsx | LegalTerms | standard wrapper, standard tiles, standard page hero | migrujemy |
| src/pages/Login.tsx | Login | standard wrapper, standard tiles, standard page hero | migrujemy |
| src/pages/PublicLanding.tsx | PublicLanding | standard wrapper, standard tiles, standard page hero | migrujemy |
| src/pages/SalesFunnel.tsx | SalesFunnel | standard page hero | migrujemy |
| src/pages/Settings.tsx | Settings | standard tiles | migrujemy |
| src/pages/SupportCenter.tsx | SupportCenter | standard tiles | migrujemy |
| src/pages/UiPreviewVNext.tsx | UiPreviewVNext | standard tiles | migrujemy |
| src/pages/UiPreviewVNextFull.tsx | UiPreviewVNextFull | standard wrapper, standard tiles | migrujemy |


## Lokalne kafelki / cardy

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/Layout.tsx | 130 | function TrialCard | migrujemy |
| src/components/Layout.tsx | 185 | function UserCard | migrujemy |
| src/components/StatShortcutCard.tsx | 121 | function StatShortcutCard | migrujemy |
| src/components/entity-contact-card.tsx | 93 | function EntityContactCard | migrujemy |
| src/components/operator-rail/OperatorSideCard.tsx | 23 | function OperatorSideCard | migrujemy |
| src/components/operator-rail/SimpleFiltersCard.tsx | 28 | function SimpleFiltersCard | migrujemy |
| src/components/operator-rail/TopValueRecordsCard.tsx | 26 | function TopValueRecordsCard | migrujemy |
| src/components/ui-system/EmptyState.tsx | 12 | function EmptyState | migrujemy |
| src/components/ui-system/MetricTile.tsx | 35 | function MetricTileFallbackIcon | migrujemy |
| src/components/ui-system/MetricTile.tsx | 39 | function MetricTile | migrujemy |
| src/components/ui-system/OperatorMetricTiles.tsx | 39 | function OperatorMetricTiles | migrujemy |
| src/components/ui-system/OperatorMetricTiles.tsx | 71 | function OperatorMetricTile | migrujemy |
| src/components/ui-system/OperatorMetricToneRuntime.tsx | 113 | function OperatorMetricToneRuntime | migrujemy |
| src/components/ui-system/SurfaceCard.tsx | 22 | function SurfaceCard | migrujemy |
| src/components/ui/empty-state-card.tsx | 21 | function EmptyStateCard | migrujemy |
| src/components/ui/list-card.tsx | 33 | function ListCard | migrujemy |
| src/components/ui/metric-card.tsx | 37 | function MetricCard | migrujemy |
| src/components/work-item-card.tsx | 59 | function WorkItemCard | migrujemy |
| src/pages/AdminAiSettings.tsx | 78 | function ProviderCard | migrujemy |
| src/pages/AiDrafts.tsx | 116 | const MetricCard = | migrujemy |
| src/pages/Calendar.tsx | 537 | function ScheduleEntryCard | migrujemy |
| src/pages/Calendar.tsx | 691 | function CalendarSelectedDayTileV9 | migrujemy |
| src/pages/CaseDetail.tsx | 5095 | function ShieldStatusIcon | migrujemy |
| src/pages/CaseDetail.tsx | 5100 | function PathCard | migrujemy |
| src/pages/ClientDetail.tsx | 1199 | function ClientTopTiles | migrujemy |
| src/pages/SalesFunnel.tsx | 217 | function FunnelOwnerDecisionTile | migrujemy |
| src/pages/SalesFunnel.tsx | 325 | function FunnelDecisionListCard | migrujemy |
| src/pages/Templates.tsx | 65 | function LightMetricCardRow | migrujemy |
| src/pages/Today.tsx | 545 | function TileCard | migrujemy |
| src/pages/Today.tsx | 608 | function LeadLinkCard | migrujemy |
| src/pages/Today.tsx | 1080 | function TodayFunnelDedupValueCard | migrujemy |
| src/pages/Today.tsx | 1194 | function TodayAiDraftsTopTile | migrujemy |
| src/pages/Today.tsx | 1222 | function TodayPipelineValueCard | migrujemy |
| src/pages/Today.tsx | 3019 | function TileCard | migrujemy |
| src/pages/Today.tsx | 3033 | function TileCard | migrujemy |
| src/pages/TodayStable.tsx | 533 | function EmptyState | migrujemy |
| src/pages/TodayStable.tsx | 537 | function StableCard | migrujemy |


## Lokalne page headery / hero

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/CloseFlowPageHeaderV2.tsx | 88 | function CloseFlowPageHeaderV2 | migrujemy |
| src/components/entity-actions.tsx | 177 | function PanelHeaderActions | migrujemy |
| src/components/layout/page-header.tsx | 21 | function PageHeader | migrujemy |
| src/components/ui-system/PageHero.tsx | 14 | function PageHero | migrujemy |
| src/components/ui/card.tsx | 96 | const CardHeader = | migrujemy |
| src/components/ui/dialog.tsx | 55 | const DialogHeader = | migrujemy |
| src/components/ui/table.tsx | 20 | function TableHeader | migrujemy |
| src/pages/TodayStable.tsx | 483 | function SectionHeaderIcon | migrujemy |
| src/pages/TodayStable.tsx | 496 | function SectionHeader | migrujemy |


## Lokalne list rows / entries

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/ActivityRoadmap.tsx | 69 | function RoadmapItemRow | migrujemy |
| src/components/entity-actions.tsx | 185 | function PanelActionRow | migrujemy |
| src/components/entity-contact-card.tsx | 46 | function EntityContactInfoRow | migrujemy |
| src/components/ui-system/ListRow.tsx | 17 | function ListRowContent | migrujemy |
| src/components/ui-system/ListRow.tsx | 33 | function ListRow | migrujemy |
| src/components/ui/table.tsx | 53 | function TableRow | migrujemy |
| src/pages/Activity.tsx | 91 | function ActivityRow | migrujemy |
| src/pages/Calendar.tsx | 537 | function ScheduleEntryCard | migrujemy |
| src/pages/Calendar.tsx | 633 | function CalendarSelectedDayEntryRowV9 | migrujemy |
| src/pages/CaseDetail.tsx | 5109 | function WorkItemRow | migrujemy |
| src/pages/NotificationsCenter.tsx | 317 | function NotificationRowIcon | migrujemy |
| src/pages/NotificationsCenter.tsx | 325 | function NotificationsRow | migrujemy |
| src/pages/Templates.tsx | 65 | function LightMetricCardRow | migrujemy |
| src/pages/Today.tsx | 8 | function TodayEntryRelationLinks | migrujemy |
| src/pages/Today.tsx | 706 | function TodayEntryRelationLinks | migrujemy |
| src/pages/Today.tsx | 739 | function TodayEntryPriorityReasons | migrujemy |
| src/pages/Today.tsx | 758 | function TodayEntrySnoozeBar | migrujemy |


## Lokalne formularze

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/ClientCreateDialog.tsx | 230 | <form | migrujemy |
| src/components/ContextNoteDialog.tsx | 115 | <form | migrujemy |
| src/components/CreateClientCaseDialog.tsx | 98 | <form | migrujemy |
| src/components/EventCreateDialog.tsx | 163 | <form | migrujemy |
| src/components/LeadAiFollowupDraft.tsx | 105 | <form | migrujemy |
| src/components/TaskCreateDialog.tsx | 212 | <form | migrujemy |
| src/components/detail/MissingItemQuickActionModal.tsx | 82 | <form | migrujemy |
| src/components/finance/CaseFinanceEditorDialog.tsx | 184 | <form | migrujemy |
| src/components/finance/CaseFinancePaymentDialog.tsx | 155 | <form | migrujemy |
| src/components/finance/CommissionFormDialog.tsx | 96 | <form | migrujemy |
| src/components/finance/CommissionFormDialog.tsx | 51 | function CommissionFormDialog | migrujemy |
| src/components/finance/LeadValuePanel.tsx | 129 | <form | migrujemy |
| src/components/finance/PaymentFormDialog.tsx | 97 | <form | migrujemy |
| src/components/finance/PaymentFormDialog.tsx | 46 | function PaymentFormDialog | migrujemy |
| src/components/task-editor-dialog.tsx | 113 | <form | migrujemy |
| src/pages/Calendar.tsx | 3107 | <form | migrujemy |
| src/pages/Calendar.tsx | 3291 | <form | migrujemy |
| src/pages/Calendar.tsx | 3531 | <form | migrujemy |
| src/pages/Cases.tsx | 595 | <form | migrujemy |
| src/pages/ClientDetail.tsx | 3370 | <form | migrujemy |
| src/pages/Clients.tsx | 872 | <form | migrujemy |
| src/pages/LeadDetail.tsx | 3066 | <form | migrujemy |
| src/pages/LeadDetail.tsx | 3106 | <form | migrujemy |
| src/pages/LeadDetail.tsx | 3188 | <form | migrujemy |
| src/pages/Leads.tsx | 798 | <form | migrujemy |
| src/pages/Login.tsx | 182 | <form | migrujemy |
| src/pages/Login.tsx | 222 | <form | migrujemy |
| src/pages/Login.tsx | 266 | <form | migrujemy |
| src/pages/SupportCenter.tsx | 498 | <form | migrujemy |
| src/pages/Tasks.tsx | 1199 | <form | migrujemy |
| src/pages/Tasks.tsx | 1332 | <form | migrujemy |
| src/pages/TasksStable.tsx | 751 | <form | migrujemy |
| src/pages/TasksStable.tsx | 803 | <form | migrujemy |
| src/pages/TodayStable.tsx | 2024 | <form | migrujemy |


## Lokalne right-card / right-rail

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/operator-rail/OperatorSideCard.tsx | 23 | function OperatorSideCard | migrujemy |
| src/pages/Activity.tsx | 416 | className="activity-right-rail" | migrujemy |
| src/pages/Activity.tsx | 417 | className="right-card activity-right-card" | migrujemy |
| src/pages/Activity.tsx | 418 | className="activity-right-card-head" | migrujemy |
| src/pages/Activity.tsx | 432 | className="right-card activity-right-card" | migrujemy |
| src/pages/Activity.tsx | 433 | className="activity-right-card-head" | migrujemy |
| src/pages/Activity.tsx | 454 | className="right-card activity-right-card" | migrujemy |
| src/pages/Activity.tsx | 455 | className="activity-right-card-head" | migrujemy |
| src/pages/AiDrafts.tsx | 1318 | className="ai-drafts-right-rail" | migrujemy |
| src/pages/AiDrafts.tsx | 1319 | className="right-card ai-drafts-right-card" | migrujemy |
| src/pages/AiDrafts.tsx | 1320 | className="ai-drafts-right-card-head" | migrujemy |
| src/pages/AiDrafts.tsx | 1338 | className="right-card ai-drafts-right-card" | migrujemy |
| src/pages/AiDrafts.tsx | 1339 | className="ai-drafts-right-card-head" | migrujemy |
| src/pages/AiDrafts.tsx | 1357 | className="right-card ai-drafts-right-card" | migrujemy |
| src/pages/AiDrafts.tsx | 1358 | className="ai-drafts-right-card-head" | migrujemy |
| src/pages/AiDrafts.tsx | 1376 | className="right-card ai-drafts-right-card" | migrujemy |
| src/pages/AiDrafts.tsx | 1377 | className="ai-drafts-right-card-head" | migrujemy |
| src/pages/Billing.tsx | 415 | className="billing-right-rail" | migrujemy |
| src/pages/Billing.tsx | 416 | className="right-card billing-right-card" | migrujemy |
| src/pages/Billing.tsx | 443 | className="right-card billing-right-card" | migrujemy |
| src/pages/Billing.tsx | 452 | className="right-card billing-right-card billing-right-featured" | migrujemy |
| src/pages/Billing.tsx | 464 | className="right-card billing-right-card" | migrujemy |
| src/pages/Calendar.tsx | 3222 | className="right-card mb-4 flex items-center gap-3 border border-blue-100 bg-blue-50/70 text-blue-900" | migrujemy |
| src/pages/Calendar.tsx | 3429 | className="right-card calendar-week-filter" | migrujemy |
| src/pages/Calendar.tsx | 3472 | className="right-card calendar-week-plan" | migrujemy |
| src/pages/CaseDetail.tsx | 4170 | className="case-detail-right-rail" | migrujemy |
| src/pages/CaseDetail.tsx | 4171 | className="right-card case-detail-right-card cf-finance-scope-card cf-finance-scope-card--case case-settlement-rail-card" | migrujemy |
| src/pages/Cases.tsx | 909 | className="cases-right-rail" | migrujemy |
| src/pages/Cases.tsx | 927 | className="right-card cases-risk-rail-card" | migrujemy |
| src/pages/ClientDetail.tsx | 2927 | className="client-detail-profile-card client-detail-side-card" | migrujemy |
| src/pages/ClientDetail.tsx | 3024 | className="client-detail-right-card client-detail-recent-moves-card" | migrujemy |
| src/pages/ClientDetail.tsx | 3622 | className="client-detail-right-rail" | migrujemy |
| src/pages/ClientDetail.tsx | 3623 | className="right-card client-detail-right-card client-detail-upcoming-actions-card" | migrujemy |
| src/pages/ClientDetail.tsx | 3688 | className="right-card client-detail-right-card" | migrujemy |
| src/pages/Clients.tsx | 1133 | className="clients-right-rail" | migrujemy |
| src/pages/Clients.tsx | 1135 | className="client-right-card operator-simple-filters-card" | migrujemy |
| src/pages/LeadDetail.tsx | 2919 | className="lead-detail-right-rail" | migrujemy |
| src/pages/LeadDetail.tsx | 2987 | className="right-card lead-detail-right-card" | migrujemy |
| src/pages/Leads.tsx | 1252 | className="lead-right-rail cf-operator-right-rail" | migrujemy |
| src/pages/Leads.tsx | 1256 | className="lead-right-card operator-simple-filters-card" | migrujemy |
| src/pages/NotificationsCenter.tsx | 800 | className="notifications-right-rail" | migrujemy |
| src/pages/NotificationsCenter.tsx | 801 | className="right-card notifications-right-card" | migrujemy |
| src/pages/NotificationsCenter.tsx | 802 | className="notifications-right-card-head" | migrujemy |
| src/pages/NotificationsCenter.tsx | 820 | className="right-card notifications-right-card" | migrujemy |
| src/pages/NotificationsCenter.tsx | 821 | className="notifications-right-card-head" | migrujemy |
| src/pages/NotificationsCenter.tsx | 839 | className="right-card notifications-right-card" | migrujemy |
| src/pages/NotificationsCenter.tsx | 840 | className="notifications-right-card-head notifications-right-card-head-clean" | migrujemy |
| src/pages/Settings.tsx | 1459 | className="settings-right-rail settings-summary-right-rail-stage181ae" | migrujemy |
| src/pages/Settings.tsx | 1460 | className="right-card settings-summary-rail-card-stage181ae" | migrujemy |
| src/pages/Tasks.tsx | 1553 | className="tasks-right-rail" | migrujemy |
| src/pages/Tasks.tsx | 1554 | className="right-card tasks-right-card" | migrujemy |
| src/pages/Tasks.tsx | 1563 | className="right-card tasks-right-card" | migrujemy |
| src/pages/TasksStable.tsx | 702 | className="tasks-stage178-right-rail cf-operator-right-rail" | migrujemy |
| src/pages/Today.tsx | 2862 | className="right-card today-right-rail space-y-8" | migrujemy |
| src/pages/UiPreviewVNext.tsx | 47 | className="cfv-right-card" | migrujemy |
| src/pages/UiPreviewVNext.tsx | 52 | className="cfv-right-card" | migrujemy |


## Lokalne modale / dialogi

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/ActivityItemPreviewDialog.tsx | 36 | function ActivityItemPreviewDialog | migrujemy |
| src/components/ActivityItemPreviewDialog.tsx | 40 | <Dialog | migrujemy |
| src/components/ActivityItemPreviewDialog.tsx | 41 | <DialogContent | migrujemy |
| src/components/ActivityRoadmap.tsx | 270 | <Dialog | migrujemy |
| src/components/ActivityRoadmap.tsx | 271 | <DialogContent | migrujemy |
| src/components/AddCaseMissingItemDialog.tsx | 27 | function AddCaseMissingItemDialog | migrujemy |
| src/components/AddCaseMissingItemDialog.tsx | 101 | <Dialog | migrujemy |
| src/components/AddCaseMissingItemDialog.tsx | 105 | <DialogContent | migrujemy |
| src/components/ClientCreateDialog.tsx | 112 | function ClientCreateDialog | migrujemy |
| src/components/ClientCreateDialog.tsx | 211 | <Dialog | migrujemy |
| src/components/ClientCreateDialog.tsx | 215 | <DialogContent | migrujemy |
| src/components/ContextActionDialogs.tsx | 157 | function ContextActionDialogsHost | migrujemy |
| src/components/ContextNoteDialog.tsx | 39 | function ContextNoteDialog | migrujemy |
| src/components/ContextNoteDialog.tsx | 105 | <Dialog | migrujemy |
| src/components/ContextNoteDialog.tsx | 106 | <DialogContent | migrujemy |
| src/components/CreateClientCaseDialog.tsx | 28 | function CreateClientCaseDialog | migrujemy |
| src/components/CreateClientCaseDialog.tsx | 90 | <Dialog | migrujemy |
| src/components/CreateClientCaseDialog.tsx | 91 | <DialogContent | migrujemy |
| src/components/DraftReviewDialog.tsx | 15 | function DraftReviewDialog | migrujemy |
| src/components/DraftReviewDialog.tsx | 25 | <Dialog | migrujemy |
| src/components/DraftReviewDialog.tsx | 26 | <DialogContent | migrujemy |
| src/components/EditActivityNoteDialog.tsx | 15 | function EditActivityNoteDialog | migrujemy |
| src/components/EditActivityNoteDialog.tsx | 23 | <Dialog | migrujemy |
| src/components/EditActivityNoteDialog.tsx | 24 | <DialogContent | migrujemy |
| src/components/EntityConflictDialog.tsx | 57 | function EntityConflictDialog | migrujemy |
| src/components/EntityConflictDialog.tsx | 72 | <Dialog | migrujemy |
| src/components/EntityConflictDialog.tsx | 73 | <DialogContent | migrujemy |
| src/components/EventCreateDialog.tsx | 98 | function EventCreateDialog | migrujemy |
| src/components/EventCreateDialog.tsx | 153 | <Dialog | migrujemy |
| src/components/EventCreateDialog.tsx | 154 | <DialogContent | migrujemy |
| src/components/LeadAiFollowupDraft.tsx | 94 | <Dialog | migrujemy |
| src/components/LeadAiFollowupDraft.tsx | 101 | <DialogContent | migrujemy |
| src/components/LeadAiNextAction.tsx | 149 | <Dialog | migrujemy |
| src/components/LeadAiNextAction.tsx | 156 | <DialogContent | migrujemy |
| src/components/LeadStartServiceDialog.tsx | 14 | function LeadStartServiceDialog | migrujemy |
| src/components/LeadStartServiceDialog.tsx | 23 | <Dialog | migrujemy |
| src/components/LeadStartServiceDialog.tsx | 24 | <DialogContent | migrujemy |
| src/components/QuickAiCapture.tsx | 260 | <Dialog | migrujemy |
| src/components/QuickAiCapture.tsx | 284 | <DialogContent | migrujemy |
| src/components/TaskCreateDialog.tsx | 92 | function TaskCreateDialog | migrujemy |
| src/components/TaskCreateDialog.tsx | 194 | <Dialog | migrujemy |
| src/components/TaskCreateDialog.tsx | 195 | <DialogContent | migrujemy |
| src/components/confirm-dialog.tsx | 17 | function ConfirmDialog | migrujemy |
| src/components/confirm-dialog.tsx | 29 | <Dialog | migrujemy |
| src/components/confirm-dialog.tsx | 30 | <DialogContent | migrujemy |
| src/components/detail/MissingItemQuickActionModal.tsx | 63 | function MissingItemQuickActionModal | migrujemy |
| src/components/detail/MissingItemsManagerDialog.tsx | 117 | function MissingItemsManagerDialog | migrujemy |
| src/components/detail/MissingItemsManagerDialog.tsx | 137 | <Dialog | migrujemy |
| src/components/finance/CaseFinanceEditorDialog.tsx | 103 | function CaseFinanceEditorDialog | migrujemy |
| src/components/finance/CaseFinanceEditorDialog.tsx | 178 | <Dialog | migrujemy |
| src/components/finance/CaseFinanceEditorDialog.tsx | 179 | <DialogContent | migrujemy |
| src/components/finance/CaseFinancePaymentDialog.tsx | 96 | function CaseFinancePaymentDialog | migrujemy |
| src/components/finance/CaseFinancePaymentDialog.tsx | 149 | <Dialog | migrujemy |
| src/components/finance/CaseFinancePaymentDialog.tsx | 150 | <DialogContent | migrujemy |
| src/components/finance/CommissionFormDialog.tsx | 51 | function CommissionFormDialog | migrujemy |
| src/components/finance/CommissionFormDialog.tsx | 90 | <Dialog | migrujemy |
| src/components/finance/CommissionFormDialog.tsx | 91 | <DialogContent | migrujemy |
| src/components/finance/PaymentFormDialog.tsx | 46 | function PaymentFormDialog | migrujemy |
| src/components/finance/PaymentFormDialog.tsx | 91 | <Dialog | migrujemy |
| src/components/finance/PaymentFormDialog.tsx | 92 | <DialogContent | migrujemy |
| src/components/quick-lead/QuickLeadCaptureModal.tsx | 72 | function QuickLeadCaptureModal | migrujemy |
| src/components/quick-lead/QuickLeadCaptureModal.tsx | 208 | <Dialog | migrujemy |
| src/components/quick-lead/QuickLeadCaptureModal.tsx | 209 | <DialogContent | migrujemy |
| src/components/task-editor-dialog.tsx | 61 | function TaskEditorDialog | migrujemy |
| src/components/task-editor-dialog.tsx | 99 | <Dialog | migrujemy |
| src/components/task-editor-dialog.tsx | 100 | <DialogContent | migrujemy |
| src/components/ui/CloseFlowDialogShell.tsx | 24 | function CloseFlowDialogShell | migrujemy |
| src/components/ui/CloseFlowDialogShell.tsx | 57 | function CloseFlowDialogBody | migrujemy |
| src/components/ui/CloseFlowDialogShell.tsx | 61 | function CloseFlowDialogSection | migrujemy |
| src/components/ui/CloseFlowDialogShell.tsx | 65 | function CloseFlowDialogFooter | migrujemy |
| src/components/ui/CloseFlowDialogShell.tsx | 26 | <DialogContent | migrujemy |
| src/pages/Calendar.tsx | 3101 | <Dialog | migrujemy |
| src/pages/Calendar.tsx | 3102 | <DialogContent | migrujemy |
| src/pages/Calendar.tsx | 3285 | <Dialog | migrujemy |
| src/pages/Calendar.tsx | 3286 | <DialogContent | migrujemy |
| src/pages/Calendar.tsx | 3519 | <Dialog | migrujemy |
| src/pages/Calendar.tsx | 3525 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 5189 | function CaseItemDialog | migrujemy |
| src/pages/CaseDetail.tsx | 4257 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 4258 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 4288 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 4295 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 4416 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 4417 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 4465 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 4466 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 4508 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 4509 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 4636 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 4645 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 4723 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 4732 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 4903 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 4904 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 5011 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 5012 | <DialogContent | migrujemy |
| src/pages/CaseDetail.tsx | 5203 | <Dialog | migrujemy |
| src/pages/CaseDetail.tsx | 5204 | <DialogContent | migrujemy |
| src/pages/Cases.tsx | 577 | <Dialog | migrujemy |
| src/pages/Cases.tsx | 588 | <DialogContent | migrujemy |
| src/pages/ClientDetail.tsx | 3353 | <Dialog | migrujemy |
| src/pages/ClientDetail.tsx | 3365 | <DialogContent | migrujemy |
| src/pages/ClientPortal.tsx | 300 | <Dialog | migrujemy |
| src/pages/ClientPortal.tsx | 310 | <DialogContent | migrujemy |
| src/pages/ClientPortal.tsx | 334 | <Dialog | migrujemy |
| src/pages/ClientPortal.tsx | 344 | <DialogContent | migrujemy |
| src/pages/Clients.tsx | 861 | <Dialog | migrujemy |
| src/pages/Clients.tsx | 865 | <DialogContent | migrujemy |
| src/pages/Dashboard.tsx | 233 | <Dialog | migrujemy |
| src/pages/Dashboard.tsx | 240 | <DialogContent | migrujemy |
| src/pages/LeadDetail.tsx | 3031 | <Dialog | migrujemy |
| src/pages/LeadDetail.tsx | 3032 | <DialogContent | migrujemy |
| src/pages/LeadDetail.tsx | 3060 | <Dialog | migrujemy |
| src/pages/LeadDetail.tsx | 3061 | <DialogContent | migrujemy |
| src/pages/LeadDetail.tsx | 3100 | <Dialog | migrujemy |
| src/pages/LeadDetail.tsx | 3101 | <DialogContent | migrujemy |
| src/pages/LeadDetail.tsx | 3135 | <Dialog | migrujemy |
| src/pages/LeadDetail.tsx | 3136 | <DialogContent | migrujemy |
| src/pages/LeadDetail.tsx | 3152 | <Dialog | migrujemy |
| src/pages/LeadDetail.tsx | 3153 | <DialogContent | migrujemy |
| src/pages/LeadDetail.tsx | 3167 | <Dialog | migrujemy |
| src/pages/LeadDetail.tsx | 3168 | <DialogContent | migrujemy |
| src/pages/LeadDetail.tsx | 3182 | <Dialog | migrujemy |
| src/pages/LeadDetail.tsx | 3183 | <DialogContent | migrujemy |
| src/pages/LeadDetail.tsx | 3211 | <Dialog | migrujemy |
| src/pages/LeadDetail.tsx | 3212 | <DialogContent | migrujemy |
| src/pages/Leads.tsx | 789 | <Dialog | migrujemy |
| src/pages/Leads.tsx | 790 | <DialogContent | migrujemy |
| src/pages/ResponseTemplates.tsx | 298 | <Dialog | migrujemy |
| src/pages/ResponseTemplates.tsx | 299 | <DialogContent | migrujemy |
| src/pages/Tasks.tsx | 1123 | <Dialog | migrujemy |
| src/pages/Tasks.tsx | 1129 | <DialogContent | migrujemy |
| src/pages/Tasks.tsx | 1196 | <Dialog | migrujemy |
| src/pages/Tasks.tsx | 1197 | <DialogContent | migrujemy |
| src/pages/Tasks.tsx | 1324 | <Dialog | migrujemy |
| src/pages/Tasks.tsx | 1328 | <DialogContent | migrujemy |
| src/pages/TasksStable.tsx | 746 | <Dialog | migrujemy |
| src/pages/TasksStable.tsx | 747 | <DialogContent | migrujemy |
| src/pages/TasksStable.tsx | 798 | <Dialog | migrujemy |
| src/pages/TasksStable.tsx | 799 | <DialogContent | migrujemy |
| src/pages/Templates.tsx | 414 | <Dialog | migrujemy |
| src/pages/Templates.tsx | 415 | <DialogContent | migrujemy |
| src/pages/Today.tsx | 2927 | <Dialog | migrujemy |
| src/pages/Today.tsx | 2928 | <DialogContent | migrujemy |
| src/pages/TodayStable.tsx | 2012 | <Dialog | migrujemy |
| src/pages/TodayStable.tsx | 2013 | <DialogContent | migrujemy |


## Co wolno dalej

1. Najpierw migrować aktywne ekrany bez standardowego wrappera.
2. Potem migrować aktywne ekrany bez standardowych kafelków.
3. Potem migrować lokalne page hero/headery.
4. Potem porządkować lokalne right-card i modale.
5. Dopiero na końcu usuwać legacy/hotfix CSS.

## Czego nie wolno robić po tym etapie

- Nie usuwać hurtowo `visual-stage*`, `hotfix-*`, `eliteflow-*` ani `stage*.css`.
- Nie przepinać UI bez sprawdzenia aktywnego routingu.
- Nie robić cleanupu wizualnego bez checka i aktualizacji tego inventory.
