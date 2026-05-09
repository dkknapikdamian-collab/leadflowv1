# CloseFlow — Visual System Inventory Freeze

**Data:** 2026-05-09  
**Etap:** 0  
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
| Importy CSS z src/index.css | 61 |
| Pliki CSS rodzin visual-stage/hotfix/eliteflow/stage | 72 |
| Lokalne kafelki / cardy | 20 |
| Lokalne page headery / hero | 6 |
| Lokalne list rows / entry rows | 12 |
| Lokalne formularze / dialogi | 31 |
| Aktywne ekrany | 23 |
| Aktywne ekrany bez standardowego wrappera | 3 |
| Aktywne ekrany bez standardowych kafelków | 13 |
| Aktywne ekrany bez standardowego page hero | 13 |

## Decyzje zbiorcze

| Decyzja | Liczba |
|---|---:|
| zostaje | 12 |
| migrujemy | 212 |
| legacy | 1 |
| usunąć później | 0 |

## Importy CSS z src/index.css

| line | import | decision |
| --- | --- | --- |
| 1 | ./styles/tasks-header-stage45b-cleanup.css | migrujemy |
| 2 | ./styles/visual-stage30-tasks-compact-after-calendar.css | migrujemy |
| 3 | ./styles/stage7a-tasks-blue-outline-fix.css | migrujemy |
| 4 | ./styles/visual-stage28-tasks-vnext.css | migrujemy |
| 5 | ./styles/visual-stage29-calendar-vnext.css | migrujemy |
| 6 | ./styles/visual-stage27-cases-vnext.css | migrujemy |
| 7 | ./styles/visual-stage26-leads-visual-alignment-fix.css | migrujemy |
| 8 | ./styles/visual-stage25-leads-full-jsx-html-rebuild.css | migrujemy |
| 9 | ./styles/visual-stage13-case-detail-vnext.css | migrujemy |
| 10 | ./styles/visual-stage21-today-final-lock.css | migrujemy |
| 11 | ./styles/visual-stage20-tasks-safe-css.css | migrujemy |
| 12 | ./styles/visual-stage19-clients-safe-css.css | migrujemy |
| 13 | ./styles/visual-stage18-leads-hard-1to1.css | migrujemy |
| 14 | ./styles/visual-stage16-today-html-reset.css | migrujemy |
| 15 | tailwindcss | zostaje |
| 16 | ./styles/case-detail-simplified.css | legacy |
| 17 | ./styles/case-detail-stage2.css | migrujemy |
| 18 | ./styles/visual-stage3-pipeline-and-case.css | migrujemy |
| 19 | ./styles/visual-stage08-case-detail.css | migrujemy |
| 20 | ./styles/visual-stage07-cases.css | migrujemy |
| 21 | ./styles/visual-stage06-client-detail.css | migrujemy |
| 22 | ./styles/visual-stage05-clients.css | migrujemy |
| 23 | ./styles/visual-stage04-lead-detail.css | migrujemy |
| 24 | ./styles/visual-stage03-leads.css | migrujemy |
| 25 | ./styles/visual-stage02-today.css | migrujemy |
| 26 | ./styles/visual-stage01-shell.css | migrujemy |
| 27 | ./styles/closeflow-action-tokens.css | zostaje |
| 28 | ./styles/closeflow-entity-type-tokens.css | zostaje |
| 29 | ./styles/closeflow-stage16c-tasks-cases-parity.css | migrujemy |
| 248 | ./styles/visual-html-theme-v14.css | zostaje |
| 249 | ./styles/closeflow-vnext-ui-contract.css | zostaje |
| 250 | ./styles/quick-lead-capture-stage27.css | migrujemy |
| 251 | ./styles/hotfix-task-stat-tiles-clean.css | migrujemy |
| 252 | ./styles/hotfix-lead-client-right-rail-dark-wrappers.css | migrujemy |
| 253 | ./styles/hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css | migrujemy |
| 254 | ./styles/hotfix-ai-drafts-right-rail-stage28.css | migrujemy |
| 256 | ./styles/stage30a-mobile-contrast-lock.css | migrujemy |
| 258 | ./styles/stage31-full-mobile-polish.css | migrujemy |
| 260 | ./styles/stage33a-ai-drafts-generated-text-contrast.css | migrujemy |
| 261 | ./styles/stage34-calendar-readability-status-forms.css | migrujemy |
| 262 | ./styles/stage34b-calendar-complete-polish.css | migrujemy |
| 263 | ./styles/stage35-clients-value-detail-cleanup.css | migrujemy |
| 264 | ./styles/stageA19v2-sidebar-nav-contrast-fix.css | migrujemy |
| 265 | ./styles/stageA20-sidebar-today-click-fix.css | migrujemy |
| 266 | ./styles/stageA20c-sidebar-today-hitbox-fix.css | migrujemy |
| 267 | ./styles/stageA20d-sidebar-unified-nav-tone.css | migrujemy |
| 268 | ./styles/stageA20e-sidebar-today-tone-lock.css | migrujemy |
| 269 | ./styles/stageA24-today-relations-label-align.css | migrujemy |
| 270 | ./styles/stageA25-today-relations-lead-badge-inline.css | migrujemy |
| 271 | ./styles/stage37-unified-page-head-and-metrics.css | migrujemy |
| 272 | ./styles/stage38-metrics-and-relations-polish.css | migrujemy |
| 273 | ./styles/eliteflow-final-metric-tiles-hard-lock.css | migrujemy |
| 274 | ./styles/eliteflow-metric-tiles-color-font-parity.css | migrujemy |
| 275 | ./styles/eliteflow-metric-text-clip-tasks-repair.css | migrujemy |
| 276 | ./styles/eliteflow-desktop-compact-scale.css | migrujemy |
| 277 | ./styles/eliteflow-sidebar-footer-contrast-repair.css | migrujemy |
| 278 | ./styles/eliteflow-sidebar-user-footer-below-nav.css | migrujemy |
| 279 | ./styles/eliteflow-admin-feedback-p1-hotfix.css | migrujemy |
| 280 | ./styles/eliteflow-semantic-badges-and-today-sections.css | migrujemy |
| 281 | ./styles/closeflow-stage16d-tasks-metric-final-lock.css | migrujemy |
| 411 | ./styles/closeflow-client-event-modal-runtime-repair.css | migrujemy |


## Rodziny CSS do opanowania

| family | file | decision |
| --- | --- | --- |
| stage*.css | src/styles/case-detail-stage2.css | migrujemy |
| stage*.css | src/styles/closeflow-stage16c-tasks-cases-parity.css | migrujemy |
| stage*.css | src/styles/closeflow-stage16d-tasks-metric-final-lock.css | migrujemy |
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
| stage*.css | src/styles/quick-lead-capture-stage27.css | migrujemy |
| stage*.css | src/styles/stage30a-mobile-contrast-lock.css | migrujemy |
| stage*.css | src/styles/stage31-full-mobile-polish.css | migrujemy |
| stage*.css | src/styles/stage33a-ai-drafts-generated-text-contrast.css | migrujemy |
| stage*.css | src/styles/stage34-calendar-readability-status-forms.css | migrujemy |
| stage*.css | src/styles/stage34b-calendar-complete-polish.css | migrujemy |
| stage*.css | src/styles/stage35-clients-value-detail-cleanup.css | migrujemy |
| stage*.css | src/styles/stage36-unified-light-pages.css | migrujemy |
| stage*.css | src/styles/stage37-unified-page-head-and-metrics.css | migrujemy |
| stage*.css | src/styles/stage38-metrics-and-relations-polish.css | migrujemy |
| stage*.css | src/styles/stage7a-tasks-blue-outline-fix.css | migrujemy |
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
| src/pages/AdminAiSettings.tsx | AdminAiSettings | standard tiles, standard page hero | migrujemy |
| src/pages/Billing.tsx | Billing | standard tiles, standard page hero | migrujemy |
| src/pages/Calendar.tsx | Calendar | standard tiles | migrujemy |
| src/pages/CaseDetail.tsx | CaseDetail | standard tiles, standard page hero | migrujemy |
| src/pages/ClientDetail.tsx | ClientDetail | standard tiles, standard page hero | migrujemy |
| src/pages/ClientPortal.tsx | ClientPortal | standard wrapper, standard tiles, standard page hero | migrujemy |
| src/pages/LeadDetail.tsx | LeadDetail | standard tiles, standard page hero | migrujemy |
| src/pages/Login.tsx | Login | standard wrapper, standard tiles, standard page hero | migrujemy |
| src/pages/ResponseTemplates.tsx | ResponseTemplates | standard page hero | migrujemy |
| src/pages/Settings.tsx | Settings | standard tiles, standard page hero | migrujemy |
| src/pages/SupportCenter.tsx | SupportCenter | standard tiles, standard page hero | migrujemy |
| src/pages/TasksStable.tsx | TasksStable | standard page hero | migrujemy |
| src/pages/Templates.tsx | Templates | standard page hero | migrujemy |
| src/pages/TodayStable.tsx | TodayStable | standard tiles, standard page hero | migrujemy |
| src/pages/UiPreviewVNext.tsx | UiPreviewVNext | standard tiles | migrujemy |
| src/pages/UiPreviewVNextFull.tsx | UiPreviewVNextFull | standard wrapper, standard tiles | migrujemy |


## Lokalne kafelki / cardy

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/Layout.tsx | 111 | function TrialCard | migrujemy |
| src/components/Layout.tsx | 131 | function UserCard | migrujemy |
| src/components/StatShortcutCard.tsx | 87 | function StatShortcutCard | migrujemy |
| src/pages/AdminAiSettings.tsx | 25 | function ProviderCard | migrujemy |
| src/pages/AiDrafts.tsx | 112 | const MetricCard = | migrujemy |
| src/pages/Calendar.tsx | 360 | function ScheduleEntryCard | migrujemy |
| src/pages/CaseDetail.tsx | 1822 | function ShieldStatusIcon | migrujemy |
| src/pages/CaseDetail.tsx | 1827 | function PathCard | migrujemy |
| src/pages/ClientDetail.tsx | 721 | function ClientTopTiles | migrujemy |
| src/pages/NotificationsCenter.tsx | 301 | function MetricCard | migrujemy |
| src/pages/Templates.tsx | 101 | function LightMetricCardRow | migrujemy |
| src/pages/Today.tsx | 534 | function TileCard | migrujemy |
| src/pages/Today.tsx | 597 | function LeadLinkCard | migrujemy |
| src/pages/Today.tsx | 1069 | function TodayFunnelDedupValueCard | migrujemy |
| src/pages/Today.tsx | 1183 | function TodayAiDraftsTopTile | migrujemy |
| src/pages/Today.tsx | 1212 | function TodayPipelineValueCard | migrujemy |
| src/pages/Today.tsx | 2996 | function TileCard | migrujemy |
| src/pages/Today.tsx | 3013 | function TileCard | migrujemy |
| src/pages/TodayStable.tsx | 451 | function EmptyState | migrujemy |
| src/pages/TodayStable.tsx | 455 | function StableCard | migrujemy |


## Lokalne page headery / hero

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/entity-actions.tsx | 133 | function PanelHeaderActions | migrujemy |
| src/components/ui/card.tsx | 19 | const CardHeader = | migrujemy |
| src/components/ui/dialog.tsx | 51 | const DialogHeader = | migrujemy |
| src/components/ui/table.tsx | 20 | function TableHeader | migrujemy |
| src/pages/TodayStable.tsx | 401 | function SectionHeaderIcon | migrujemy |
| src/pages/TodayStable.tsx | 414 | function SectionHeader | migrujemy |


## Lokalne list rows / entries

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/entity-actions.tsx | 141 | function PanelActionRow | migrujemy |
| src/components/ui/table.tsx | 53 | function TableRow | migrujemy |
| src/pages/Activity.tsx | 507 | function ActivityRow | migrujemy |
| src/pages/Calendar.tsx | 360 | function ScheduleEntryCard | migrujemy |
| src/pages/CaseDetail.tsx | 1836 | function WorkItemRow | migrujemy |
| src/pages/ClientDetail.tsx | 650 | function InfoRow | migrujemy |
| src/pages/NotificationsCenter.tsx | 293 | function NotificationRowIcon | migrujemy |
| src/pages/NotificationsCenter.tsx | 367 | function NotificationsRow | migrujemy |
| src/pages/Templates.tsx | 101 | function LightMetricCardRow | migrujemy |
| src/pages/Today.tsx | 695 | function TodayEntryRelationLinks | migrujemy |
| src/pages/Today.tsx | 728 | function TodayEntryPriorityReasons | migrujemy |
| src/pages/Today.tsx | 747 | function TodayEntrySnoozeBar | migrujemy |


## Lokalne formularze / dialogi

| file | line | match | decision |
| --- | --- | --- | --- |
| src/components/ContextActionDialogs.tsx | 112 | function ContextActionDialogsHost | migrujemy |
| src/components/ContextNoteDialog.tsx | 100 | <form | migrujemy |
| src/components/ContextNoteDialog.tsx | 31 | function ContextNoteDialog | migrujemy |
| src/components/DraftReviewDialog.tsx | 15 | function DraftReviewDialog | migrujemy |
| src/components/EntityConflictDialog.tsx | 50 | function EntityConflictDialog | migrujemy |
| src/components/EventCreateDialog.tsx | 131 | <form | migrujemy |
| src/components/EventCreateDialog.tsx | 66 | function EventCreateDialog | migrujemy |
| src/components/LeadAiFollowupDraft.tsx | 106 | <form | migrujemy |
| src/components/LeadStartServiceDialog.tsx | 14 | function LeadStartServiceDialog | migrujemy |
| src/components/TaskCreateDialog.tsx | 130 | <form | migrujemy |
| src/components/TaskCreateDialog.tsx | 68 | function TaskCreateDialog | migrujemy |
| src/components/confirm-dialog.tsx | 18 | function ConfirmDialog | migrujemy |
| src/components/quick-lead/QuickLeadCaptureModal.tsx | 79 | function QuickLeadCaptureModal | migrujemy |
| src/components/task-editor-dialog.tsx | 114 | <form | migrujemy |
| src/components/task-editor-dialog.tsx | 62 | function TaskEditorDialog | migrujemy |
| src/pages/Calendar.tsx | 1257 | <form | migrujemy |
| src/pages/Calendar.tsx | 1432 | <form | migrujemy |
| src/pages/Calendar.tsx | 1719 | <form | migrujemy |
| src/pages/CaseDetail.tsx | 1892 | function CaseItemDialog | migrujemy |
| src/pages/Cases.tsx | 515 | <form | migrujemy |
| src/pages/Clients.tsx | 475 | <form | migrujemy |
| src/pages/LeadDetail.tsx | 1569 | <form | migrujemy |
| src/pages/Leads.tsx | 680 | <form | migrujemy |
| src/pages/Login.tsx | 178 | <form | migrujemy |
| src/pages/Login.tsx | 218 | <form | migrujemy |
| src/pages/Login.tsx | 262 | <form | migrujemy |
| src/pages/SupportCenter.tsx | 460 | <form | migrujemy |
| src/pages/Tasks.tsx | 1097 | <form | migrujemy |
| src/pages/Tasks.tsx | 1230 | <form | migrujemy |
| src/pages/TasksStable.tsx | 568 | <form | migrujemy |
| src/pages/TasksStable.tsx | 620 | <form | migrujemy |


## Co wolno dalej

1. Najpierw migrować aktywne ekrany bez standardowego wrappera.
2. Potem migrować aktywne ekrany bez standardowych kafelków.
3. Potem migrować lokalne page hero/headery.
4. Dopiero na końcu usuwać legacy/hotfix CSS.

## Czego nie wolno robić po tym etapie

- Nie usuwać hurtowo `visual-stage*`, `hotfix-*`, `eliteflow-*` ani `stage*.css`.
- Nie przepinać UI bez sprawdzenia aktywnego routingu.
- Nie robić „ładniejszego” cleanupu bez checka i aktualizacji tego inventory.
