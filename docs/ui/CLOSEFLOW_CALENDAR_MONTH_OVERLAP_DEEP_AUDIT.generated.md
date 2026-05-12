# CloseFlow — Calendar Month Overlap Deep Audit

Generated: 2026-05-12T05:21:52.111Z

## Werdykt

To nie wygląda już jak problem „jednego starego koloru”. To jest problem struktury renderu wpisu w miesiącu. CSS próbuje naprawiać niepewny, zagnieżdżony DOM i dlatego tekst nadal wpada pod inne wpisy.

## Główna diagnoza

- CSS-only fixes are now at the limit. The screenshot still shows overlapping because the month entry DOM is not a clean single row component.
- Multiple active calendar skin layers are imported into Calendar.tsx and can compete by selector weight/import order.
- The safer next implementation should be structural: replace the month item render with MonthEntryChip(label, text, title), not another broad CSS override.
- The hover-title idea is good and should stay, but it belongs on the real chip element, not on guessed nested nodes.

## Prawdopodobna przyczyna

- Month cell entries are rendered with nested existing classes/utilities that allow multiple children/text nodes to paint in the same vertical space.
- The current enhancer guesses type labels after render, then CSS tries to force layout across unknown nested DOM. That is brittle.
- Old and new calendar CSS layers remain active at the same time.

## Rekomendowany następny ruch

- Stop adding more CSS bandaids for overlap.
- Patch Calendar.tsx month-view render only: create a MonthEntryChip component with fixed markup.
- Use title={fullText} directly on the chip.
- Show max visible entries in the tile and render +X więcej as a separate row.
- Keep the left Calendar side panel and all existing handlers.

## Calendar.tsx CSS import order

- src/pages/Calendar.tsx:101 -> ../styles/visual-stage22-event-form-vnext.css
- src/pages/Calendar.tsx:106 -> ../styles/closeflow-page-header-v2.css
- src/pages/Calendar.tsx:107 -> ../styles/closeflow-calendar-skin-only-v1.css
- src/pages/Calendar.tsx:108 -> ../styles/closeflow-calendar-color-tooltip-v2.css
- src/pages/Calendar.tsx:109 -> ../styles/closeflow-calendar-month-chip-overlap-fix-v1.css
- src/pages/Calendar.tsx:110 -> ../styles/closeflow-calendar-month-rows-no-overlap-repair2.css

## Import order issues

- none

## Active visual CSS imports related to calendar/stages

- src/App.tsx:21 -> ./styles/closeflow-page-header.css
- src/App.tsx:26 -> ./styles/closeflow-page-header-copy-source-truth.css
- src/App.tsx:27 -> ./styles/closeflow-page-header-action-semantics-packet1.css
- src/components/CloseFlowPageHeaderV2.tsx:3 -> ../styles/closeflow-page-header-v2.css
- src/components/task-editor-dialog.tsx:10 -> ../styles/visual-stage21-task-form-vnext.css
- src/index.css:18 -> ./styles/page-adapters/page-adapters.css
- src/index.css:27 -> ./styles/emergency/emergency-hotfixes.css
- src/pages/Activity.tsx:30 -> ../styles/visual-stage8-activity-vnext.css
- src/pages/Activity.tsx:50 -> ../styles/closeflow-page-header-v2.css
- src/pages/AdminAiSettings.tsx:22 -> ../styles/closeflow-page-header-v2.css
- src/pages/AiDrafts.tsx:81 -> ../styles/visual-stage9-ai-drafts-vnext.css
- src/pages/AiDrafts.tsx:85 -> ../styles/closeflow-page-header-v2.css
- src/pages/Billing.tsx:68 -> ../styles/visual-stage16-billing-vnext.css
- src/pages/Billing.tsx:71 -> ../styles/closeflow-page-header-v2.css
- src/pages/Calendar.tsx:101 -> ../styles/visual-stage22-event-form-vnext.css
- src/pages/Calendar.tsx:106 -> ../styles/closeflow-page-header-v2.css
- src/pages/Calendar.tsx:107 -> ../styles/closeflow-calendar-skin-only-v1.css
- src/pages/Calendar.tsx:108 -> ../styles/closeflow-calendar-color-tooltip-v2.css
- src/pages/Calendar.tsx:109 -> ../styles/closeflow-calendar-month-chip-overlap-fix-v1.css
- src/pages/Calendar.tsx:110 -> ../styles/closeflow-calendar-month-rows-no-overlap-repair2.css
- src/pages/CaseDetail.tsx:98 -> ../styles/visual-stage13-case-detail-vnext.css
- src/pages/Cases.tsx:23 -> ../styles/visual-stage23-client-case-forms-vnext.css
- src/pages/Cases.tsx:35 -> ../styles/closeflow-page-header-v2.css
- src/pages/ClientDetail.tsx:117 -> ../styles/visual-stage12-client-detail-vnext.css
- src/pages/Clients.tsx:85 -> ../styles/visual-stage23-client-case-forms-vnext.css
- src/pages/Clients.tsx:89 -> ../styles/closeflow-page-header-v2.css
- src/pages/LeadDetail.tsx:87 -> ../styles/visual-stage14-lead-detail-vnext.css
- src/pages/Leads.tsx:81 -> ../styles/visual-stage20-lead-form-vnext.css
- src/pages/Leads.tsx:84 -> ../styles/closeflow-page-header-v2.css
- src/pages/NotificationsCenter.tsx:50 -> ../styles/visual-stage10-notifications-vnext.css
- src/pages/NotificationsCenter.tsx:54 -> ../styles/closeflow-page-header-v2.css
- src/pages/ResponseTemplates.tsx:37 -> ../styles/closeflow-page-header-v2.css
- src/pages/Settings.tsx:91 -> ../styles/visual-stage19-settings-vnext.css
- src/pages/Settings.tsx:94 -> ../styles/closeflow-page-header-v2.css
- src/pages/SupportCenter.tsx:32 -> ../styles/visual-stage17-support-vnext.css
- src/pages/SupportCenter.tsx:35 -> ../styles/closeflow-page-header-v2.css
- src/pages/Tasks.tsx:133 -> ../styles/visual-stage21-task-form-vnext.css
- src/pages/TasksStable.tsx:34 -> ../styles/closeflow-page-header-v2.css
- src/pages/Templates.tsx:59 -> ../styles/closeflow-page-header-v2.css
- src/pages/TodayStable.tsx:53 -> ../styles/closeflow-page-header-v2.css
- src/styles/core/core-contracts.css:8 -> ../visual-stage01-shell.css
- src/styles/emergency/emergency-hotfixes.css:219 -> ../closeflow-page-header-card-source-truth.css
- src/styles/emergency/emergency-hotfixes.css:228 -> ../closeflow-page-header-copy-source-truth.css
- src/styles/emergency/emergency-hotfixes.css:229 -> ../closeflow-page-header-action-semantics-packet1.css
- src/styles/emergency/emergency-hotfixes.css:231 -> ../closeflow-page-header-stage6-final-lock.css
- src/styles/emergency/emergency-hotfixes.css:236 -> ../closeflow-page-header-final-lock.css
- src/styles/emergency/emergency-hotfixes.css:241 -> ../closeflow-page-header-structure-lock.css
- src/styles/emergency/emergency-hotfixes.css:246 -> ../closeflow-page-header-copy-left-only.css
- src/styles/legacy/legacy-imports.css:10 -> ../visual-stage3-pipeline-and-case.css
- src/styles/page-adapters/page-adapters.css:8 -> ../visual-stage02-today.css
- src/styles/page-adapters/page-adapters.css:9 -> ../visual-stage03-leads.css
- src/styles/page-adapters/page-adapters.css:10 -> ../visual-stage04-lead-detail.css
- src/styles/page-adapters/page-adapters.css:11 -> ../visual-stage05-clients.css
- src/styles/page-adapters/page-adapters.css:12 -> ../visual-stage06-client-detail.css
- src/styles/page-adapters/page-adapters.css:13 -> ../visual-stage07-cases.css
- src/styles/page-adapters/page-adapters.css:14 -> ../visual-stage08-case-detail.css
- src/styles/page-adapters/page-adapters.css:15 -> ../visual-stage13-case-detail-vnext.css
- src/styles/page-adapters/page-adapters.css:16 -> ../visual-stage18-leads-hard-1to1.css
- src/styles/page-adapters/page-adapters.css:17 -> ../visual-stage19-clients-safe-css.css
- src/styles/page-adapters/page-adapters.css:18 -> ../visual-stage20-lead-form-vnext.css
- src/styles/page-adapters/page-adapters.css:19 -> ../visual-stage20-tasks-safe-css.css
- src/styles/page-adapters/page-adapters.css:20 -> ../visual-stage21-today-final-lock.css
- src/styles/page-adapters/page-adapters.css:21 -> ../visual-stage23-client-case-forms-vnext.css
- src/styles/page-adapters/page-adapters.css:22 -> ../visual-stage25-leads-full-jsx-html-rebuild.css
- src/styles/page-adapters/page-adapters.css:23 -> ../visual-stage26-leads-visual-alignment-fix.css
- src/styles/page-adapters/page-adapters.css:24 -> ../visual-stage27-cases-vnext.css
- src/styles/page-adapters/page-adapters.css:25 -> ../visual-stage28-tasks-vnext.css
- src/styles/page-adapters/page-adapters.css:26 -> ../visual-stage29-calendar-vnext.css
- src/styles/page-adapters/page-adapters.css:27 -> ../visual-stage30-tasks-compact-after-calendar.css
- src/styles/page-adapters/page-adapters.css:30 -> ../stage37-unified-page-head-and-metrics.css
- src/styles/page-adapters/page-adapters.css:32 -> ../stage39-page-headers-copy-visual-system.css
- src/styles/page-adapters/page-adapters.css:33 -> ../stage40-page-header-action-overflow-hardening.css
- src/styles/temporary/temporary-overrides.css:43 -> ../stage34-calendar-readability-status-forms.css
- src/styles/temporary/temporary-overrides.css:44 -> ../stage34b-calendar-complete-polish.css
- tools/audit-closeflow-calendar-month-chip-overlap-fix-v1.cjs:20 -> ../styles/closeflow-calendar-month-chip-overlap-fix-v1.css
- tools/audit-closeflow-calendar-month-rows-no-overlap-repair2.cjs:18 -> ../styles/closeflow-calendar-month-rows-no-overlap-repair2.css
- tools/patch-closeflow-calendar-color-tooltip-v2.cjs:22 -> ../styles/closeflow-calendar-color-tooltip-v2.css
- tools/patch-closeflow-calendar-color-tooltip-v2.cjs:24 -> ../styles/closeflow-calendar-skin-only-v1.css
- tools/patch-closeflow-calendar-month-chip-overlap-fix-v1.cjs:20 -> ../styles/closeflow-calendar-month-chip-overlap-fix-v1.css
- tools/patch-closeflow-calendar-month-chip-overlap-fix-v1.cjs:22 -> ../styles/closeflow-calendar-color-tooltip-v2.css
- tools/patch-closeflow-calendar-month-chip-overlap-fix-v1.cjs:23 -> ../styles/closeflow-calendar-skin-only-v1.css
- tools/patch-closeflow-calendar-month-rows-no-overlap-repair2.cjs:20 -> ../styles/closeflow-calendar-month-rows-no-overlap-repair2.css
- tools/patch-closeflow-calendar-month-rows-no-overlap-repair2.cjs:22 -> ../styles/closeflow-calendar-month-chip-overlap-fix-v1.css
- tools/patch-closeflow-calendar-month-rows-no-overlap-repair2.cjs:23 -> ../styles/closeflow-calendar-color-tooltip-v2.css
- tools/patch-closeflow-calendar-skin-only-v1.cjs:23 -> ../styles/closeflow-calendar-skin-only-v1.css
- tools/patch-closeflow-calendar-skin-scope-repair-audit-v2.cjs:20 -> ../styles/closeflow-calendar-skin-only-v1.css
- tools/patch-closeflow-calendar-skin-scope-repair-audit-v2.cjs:22 -> ../styles/closeflow-page-header-v2.css
- tools/patch-closeflow-etap10-client-card-next-action-layout.cjs:26 -> ../styles/visual-stage23-client-case-forms-vnext.css
- tools/patch-closeflow-page-header-copy-left-only-packet4.cjs:40 -> ../styles/closeflow-page-header-copy-left-only.css
- tools/patch-closeflow-page-header-copy-left-only-packet4.cjs:83 -> ../closeflow-page-header-copy-left-only.css
- tools/patch-closeflow-page-header-final-lock-packet2.cjs:41 -> ../styles/closeflow-page-header-final-lock.css
- tools/patch-closeflow-page-header-final-lock-packet2.cjs:83 -> ../closeflow-page-header-final-lock.css
- tools/patch-closeflow-page-header-rebuild-light-source-truth.cjs:5 -> ../styles/closeflow-page-header-card-source-truth.css
- tools/patch-closeflow-page-header-semantic-copy-packet1.cjs:28 -> ../closeflow-page-header-copy-source-truth.css
- tools/patch-closeflow-page-header-semantic-copy-packet1.cjs:28 -> ../closeflow-page-header-action-semantics-packet1.css
- tools/patch-closeflow-page-header-semantic-copy-packet1.cjs:78 -> ./styles/closeflow-page-header-copy-source-truth.css
- tools/patch-closeflow-page-header-semantic-copy-packet1.cjs:79 -> ./styles/closeflow-page-header-action-semantics-packet1.css
- tools/patch-closeflow-page-header-source-truth-rebuild-stage2.cjs:5 -> ../styles/closeflow-page-header-card-source-truth.css
- tools/patch-closeflow-page-header-source-truth-rebuild-stage2.cjs:137 -> ../closeflow-page-header-card-source-truth.css
- tools/patch-closeflow-page-header-stage6-final-lock.cjs:45 -> ../closeflow-page-header-stage6-final-lock.css
- tools/patch-closeflow-page-header-structure-lock-packet3.cjs:41 -> ../styles/closeflow-page-header-structure-lock.css
- tools/patch-closeflow-page-header-structure-lock-packet3.cjs:82 -> ../closeflow-page-header-structure-lock.css
- tools/patch-closeflow-page-header-v2-all-headers-repair4.cjs:46 -> ../styles/closeflow-page-header-card-source-truth.css
- tools/patch-closeflow-page-header-v2-all-headers-repair4.cjs:47 -> ../styles/closeflow-page-header-final-lock.css
- tools/patch-closeflow-page-header-v2-all-headers-repair4.cjs:48 -> ../styles/closeflow-page-header-structure-lock.css
- tools/patch-closeflow-page-header-v2-all-headers-repair4.cjs:49 -> ../styles/closeflow-page-header-copy-left-only.css
- tools/patch-closeflow-page-header-v2-all-headers-repair4.cjs:50 -> ../styles/closeflow-page-header-copy-source-truth.css
- tools/patch-closeflow-page-header-v2-all-headers-repair4.cjs:51 -> ../styles/closeflow-page-header-action-semantics-packet1.css
- tools/patch-closeflow-page-header-v2-all-headers-repair4.cjs:282 -> ../styles/closeflow-page-header-v2.css
- tools/patch-closeflow-page-header-v2-surgery-repair2.cjs:40 -> ../styles/closeflow-page-header-card-source-truth.css
- tools/patch-closeflow-page-header-v2-surgery-repair2.cjs:41 -> ../styles/closeflow-page-header-final-lock.css
- tools/patch-closeflow-page-header-v2-surgery-repair2.cjs:42 -> ../styles/closeflow-page-header-structure-lock.css
- tools/patch-closeflow-page-header-v2-surgery-repair2.cjs:43 -> ../styles/closeflow-page-header-copy-left-only.css
- tools/patch-closeflow-page-header-v2-surgery-repair2.cjs:44 -> ../styles/closeflow-page-header-copy-source-truth.css
- tools/patch-closeflow-page-header-v2-surgery-repair2.cjs:45 -> ../styles/closeflow-page-header-action-semantics-packet1.css
- tools/patch-closeflow-page-header-v2-surgery-repair2.cjs:181 -> ../styles/closeflow-page-header-v2.css
- tools/patch-closeflow-page-header-v2-surgery.cjs:47 -> ../styles/closeflow-page-header-card-source-truth.css
- tools/patch-closeflow-page-header-v2-surgery.cjs:48 -> ../styles/closeflow-page-header-final-lock.css
- tools/patch-closeflow-page-header-v2-surgery.cjs:49 -> ../styles/closeflow-page-header-structure-lock.css
- tools/patch-closeflow-page-header-v2-surgery.cjs:50 -> ../styles/closeflow-page-header-copy-left-only.css
- tools/patch-closeflow-page-header-v2-surgery.cjs:51 -> ../styles/closeflow-page-header-copy-source-truth.css
- tools/patch-closeflow-page-header-v2-surgery.cjs:52 -> ../styles/closeflow-page-header-action-semantics-packet1.css
- tools/patch-closeflow-page-header-v2-surgery.cjs:223 -> ../styles/closeflow-page-header-v2.css
- tools/patch-closeflow-page-header-visual-unification-stage1.cjs:5 -> ../styles/closeflow-page-header-card-source-truth.css
- tools/repair-closeflow-etap3-clients-wide-layout.cjs:39 -> ../styles/visual-stage23-client-case-forms-vnext.css
- tools/repair-closeflow-stage14a-clientdetail-notes-history-repair2.cjs:58 -> ../styles/visual-stage12-client-detail-vnext.css
- scripts/apply-stage34-calendar-readability-status-forms.cjs:21 -> ./styles/stage34-calendar-readability-status-forms.css
- scripts/apply-stage34b-calendar-complete-polish.cjs:44 -> ./styles/stage34b-calendar-complete-polish.css
- scripts/check-closeflow-calendar-color-tooltip-v2.cjs:22 -> ../styles/closeflow-calendar-color-tooltip-v2.css
- scripts/check-closeflow-calendar-month-chip-overlap-fix-v1.cjs:22 -> ../styles/closeflow-calendar-month-chip-overlap-fix-v1.css
- scripts/check-closeflow-calendar-month-rows-no-overlap-repair2.cjs:21 -> ../styles/closeflow-calendar-month-rows-no-overlap-repair2.css
- scripts/check-closeflow-calendar-skin-only-v1.cjs:24 -> ../styles/closeflow-calendar-skin-only-v1.css
- scripts/check-closeflow-calendar-skin-scope-repair-audit-v2.cjs:21 -> ../styles/closeflow-calendar-skin-only-v1.css
- scripts/check-closeflow-css-import-order.cjs:74 -> ./styles/page-adapters/page-adapters.css
- scripts/check-closeflow-css-import-order.cjs:75 -> ./styles/page-adapters/page-adapters.css
- scripts/check-closeflow-css-import-order.cjs:77 -> ./styles/emergency/emergency-hotfixes.css
- scripts/check-closeflow-page-header-copy-contract.cjs:16 -> ./styles/closeflow-page-header.css
- scripts/check-closeflow-page-header-source-truth-rebuild-stage2.cjs:30 -> ../closeflow-page-header-card-source-truth.css
- scripts/check-stage39-page-headers-copy-visual-system.cjs:33 -> ../stage39-page-headers-copy-visual-system.css
- scripts/check-stage40-page-header-action-overflow-hardening.cjs:37 -> ../stage39-page-headers-copy-visual-system.css
- scripts/check-stage40-page-header-action-overflow-hardening.cjs:41 -> ../stage40-page-header-action-overflow-hardening.css
- scripts/check-visual-stage01-shell.cjs:83 -> ./styles/visual-stage01-shell.css
- scripts/check-visual-stage02-today.cjs:66 -> ./styles/visual-stage02-today.css
- scripts/check-visual-stage03-leads.cjs:26 -> ./styles/visual-stage03-leads.css
- scripts/check-visual-stage04-lead-detail.cjs:44 -> ./styles/visual-stage04-lead-detail.css
- scripts/check-visual-stage05-clients.cjs:23 -> ./styles/visual-stage05-clients.css
- scripts/check-visual-stage06-client-detail.cjs:31 -> ./styles/visual-stage06-client-detail.css
- scripts/check-visual-stage07-cases.cjs:26 -> ./styles/visual-stage07-cases.css
- scripts/check-visual-stage08-case-detail.cjs:31 -> ./styles/visual-stage08-case-detail.css
- scripts/check-visual-stage16-today-html-reset.cjs:17 -> ./styles/visual-stage16-today-html-reset.css

## Old / competing calendar visual layers

- src/styles/closeflow-calendar-color-tooltip-v2.css
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css
- src/styles/closeflow-calendar-month-rows-no-overlap-repair2.css
- src/styles/closeflow-calendar-skin-only-v1.css
- src/styles/emergency/emergency-hotfixes.css
- src/styles/stage34-calendar-readability-status-forms.css
- src/styles/stage34b-calendar-complete-polish.css
- src/styles/visual-stage22-event-form-vnext.css
- src/styles/visual-stage29-calendar-vnext.css

## High-risk CSS rows for overlap

- src/pages/UiPreviewVNextFull.tsx:20 weight=20 [absolute-position, translate-transform, height-hard, line-height-too-small, display-grid, display-flex, flex-wrap, top-left-inset, line-through] selector=`` :: `const FULL_CLOSEFLOW_HTML = "<!doctype html>\n<html lang=\"pl\">\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n  <title>CloseFlow - pełny kierunek UI</title>\n  <style>\n    :root {\n      `
- tools/repair-closeflow-stage5-case-quick-actions.cjs:97 weight=7 [translate-transform, line-height-too-small, display-grid, display-flex] selector=`` :: `css += '\n\n/* CLOSEFLOW_STAGE5_CASE_QUICK_ACTIONS */\n.case-quick-actions {\n  display: grid;\n  gap: 12px;\n}\n.case-quick-actions__header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n}\n.case-quick-action`
- src/styles/closeflow-calendar-month-rows-no-overlap-repair2.css:192 weight=6 [height-hard, max-height-hard] selector=`) :is(p, span, strong, a, div):not(.cf-calendar-type-badge):not(.cf-entity-type-pill):not([data-cf-calendar-kind]):not([data-cf-entity-type])` :: `max-height: 18px !important;`
- src/styles/visual-stage28-tasks-vnext.css:114 weight=6 [display-flex, flex-wrap, top-left-inset] selector=`.cf-html-view.main-tasks-html .task-pills` :: `.cf-html-view.main-tasks-html .task-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }`
- tools/repair-closeflow-modal-visual-system-readable-v2.cjs:64 weight=6 [absolute-position, top-left-inset] selector=`` :: `const css = "/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1\n   CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2\n   owner: CloseFlow UI system\n   reason: unified, readable, light operator dialogs without dark header/body split.\n   source_of_truth: src/components/ui/dialog.ts`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:145 weight=5 [height-hard, line-height-too-small] selector=`) :is(p, span, strong, a, div):not(.cf-calendar-type-badge):not(.cf-entity-type-pill)` :: `line-height: 18px !important;`
- src/styles/closeflow-calendar-month-rows-no-overlap-repair2.css:190 weight=5 [height-hard, line-height-too-small] selector=`) :is(p, span, strong, a, div):not(.cf-calendar-type-badge):not(.cf-entity-type-pill):not([data-cf-calendar-kind]):not([data-cf-entity-type])` :: `line-height: 18px !important;`
- scripts/check-stage34-calendar-readability-status-forms.cjs:20 weight=3 [white-space-normal] selector=`` :: `expect('src/styles/stage34-calendar-readability-status-forms.css', 'white-space: normal !important', 'month text wrapping');`
- scripts/check-stage34b-calendar-complete-polish.cjs:20 weight=3 [white-space-normal] selector=`` :: `expect('src/styles/stage34b-calendar-complete-polish.css', 'white-space: normal !important', 'month entry text wrap');`
- src/styles/closeflow-calendar-month-rows-no-overlap-repair2.css:191 weight=3 [height-hard] selector=`) :is(p, span, strong, a, div):not(.cf-calendar-type-badge):not(.cf-entity-type-pill):not([data-cf-calendar-kind]):not([data-cf-entity-type])` :: `height: 18px !important;`
- src/styles/closeflow-client-event-modal-runtime-repair.css:91 weight=3 [flex-wrap] selector=`:where(.event-form-vnext-content, [data-event-create-dialog-stage85="true"], [data-event-create-dialog-stage22b="true"], .closeflow-event-modal-readable) :is(.event-form-footer, [data-event-modal-save-footer="true"], [data-radix-dialog-footer])` :: `flex-wrap: wrap !important;`
- src/styles/stage31-full-mobile-polish.css:382 weight=3 [white-space-normal] selector=`.calendar-action` :: `white-space: normal !important;`
- src/styles/stage31-full-mobile-polish.css:697 weight=3 [flex-wrap] selector=`.calendar-day-actions` :: `flex-wrap: wrap !important;`
- src/styles/visual-stage21-task-form-vnext.css:221 weight=3 [flex-wrap] selector=`.task-form-action-strip` :: `flex-wrap: wrap;`
- src/styles/visual-stage28-tasks-vnext.css:116 weight=3 [height-hard] selector=`.cf-html-view.main-tasks-html .task-done-btn` :: `.cf-html-view.main-tasks-html .task-done-btn { width: 26px; height: 26px; }`
- src/styles/visual-stage28-tasks-vnext.css:174 weight=3 [white-space-normal] selector=`.cf-html-view.main-tasks-html .task-meta` :: `.cf-html-view.main-tasks-html .task-meta { white-space: normal; }`
- src/styles/visual-stage29-calendar-vnext.css:61 weight=3 [flex-wrap] selector=`.cf-html-view.main-calendar-html .calendar-toolbar` :: `flex-wrap: wrap;`
- src/styles/visual-stage29-calendar-vnext.css:68 weight=3 [flex-wrap] selector=`.cf-html-view.main-calendar-html .calendar-toolbar-right` :: `flex-wrap: wrap;`
- src/styles/visual-stage29-calendar-vnext.css:162 weight=3 [translate-transform] selector=`.cf-html-view.main-calendar-html .calendar-day-cell:hover` :: `transform: translateY(-1px);`
- src/styles/visual-stage29-calendar-vnext.css:212 weight=3 [height-hard] selector=`.cf-html-view.main-calendar-html .calendar-pill-type` :: `height: 16px;`
- src/styles/visual-stage29-calendar-vnext.css:350 weight=3 [height-hard] selector=`.cf-html-view.main-calendar-html .pill` :: `height: 24px;`
- src/styles/visual-stage30-tasks-compact-after-calendar.css:22 weight=3 [height-hard] selector=`.cf-html-view.main-tasks-html .task-type-badge` :: `min-height: 24px;`
- src/styles/visual-stage30-tasks-compact-after-calendar.css:103 weight=3 [flex-wrap] selector=`.cf-html-view.main-tasks-html .task-action-col.task-action-col-compact` :: `flex-wrap: wrap;`

## Calendar render signals

- src/pages/Calendar.tsx:109 [month] `import '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css';`
- src/pages/Calendar.tsx:110 [month] `import '../styles/closeflow-calendar-month-rows-no-overlap-repair2.css';`
- src/pages/Calendar.tsx:130 [month] `type CalendarView = 'week' | 'month';`
- src/pages/Calendar.tsx:142 [CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2] `const CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2 = 'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_2026_05_12';`
- src/pages/Calendar.tsx:292 [cf-entity-type-pill] `return 'cf-entity-type-pill';`
- src/pages/Calendar.tsx:387 [line-through] `const relationClass = 'truncate text-[12px] font-semibold ${isCompletedEntry ? 'text-slate-400 line-through' : 'text-slate-500'}';`
- src/pages/Calendar.tsx:394 [calendar-entry-card] `<div data-calendar-entry-completed={isCompletedEntry ? 'true' : undefined} className={'calendar-entry-card cf-readable-card ${isCompletedEntry ? 'calendar-entry-completed' : ''} rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:`
- src/pages/Calendar.tsx:403 [line-through, title=] `<p className={'truncate text-[14px] font-bold leading-5 ${isCompletedEntry ? 'text-slate-500 line-through' : 'text-slate-900'}'} title={entry.title}>`
- src/pages/Calendar.tsx:408 [title=] `<Link to={'/cases/${entry.raw.caseId}'} className={'${relationClass} transition hover:text-sky-700'} title={relationLabel}>`
- src/pages/Calendar.tsx:412 [title=] `<Link to={'/leads/${entry.raw.leadId}'} className={'${relationClass} transition hover:text-blue-700'} title={relationLabel}>`
- src/pages/Calendar.tsx:416 [title=] `<p className={relationClass} title={relationLabel}>{relationLabel}</p>`
- src/pages/Calendar.tsx:474 [selectedDate] `const [selectedDate, setSelectedDate] = useState(new Date());`
- src/pages/Calendar.tsx:476 [calendarScale] `const [calendarScale, setCalendarScale] = useState<CalendarScale>('default');`
- src/pages/Calendar.tsx:541 [month] `if (forcedCalendarView === 'week' || forcedCalendarView === 'month') {`
- src/pages/Calendar.tsx:570 [month] `if (storedView === 'week' || storedView === 'month') {`
- src/pages/Calendar.tsx:577 [calendarScale] `window.localStorage.setItem(CALENDAR_SCALE_STORAGE_KEY, calendarScale);`
- src/pages/Calendar.tsx:579 [calendarScale] `}, [calendarScale]);`
- src/pages/Calendar.tsx:589 [CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT] `// CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT: native hover tooltips for clipped calendar text + visual type hints.`
- src/pages/Calendar.tsx:608 [calendar-entry-card] `'.calendar-entry-card',`
- src/pages/Calendar.tsx:609 [calendar-entry-card] `'.calendar-entry-card *',`
- src/pages/Calendar.tsx:610 [month] `'[class*="month"] [class*="entry"]',`
- src/pages/Calendar.tsx:611 [month] `'[class*="month"] [class*="entry"] *',`
- src/pages/Calendar.tsx:612 [month] `'[class*="month"] [class*="item"]',`
- src/pages/Calendar.tsx:613 [month] `'[class*="month"] [class*="item"] *',`
- src/pages/Calendar.tsx:614 [month] `'[class*="month"] [class*="chip"]',`
- src/pages/Calendar.tsx:615 [month] `'[class*="month"] [class*="chip"] *',`
- src/pages/Calendar.tsx:643 [data-cf-calendar] `const row = node.closest('[data-cf-calendar-row-kind]') as HTMLElement | null;`
- src/pages/Calendar.tsx:645 [CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2] `row.setAttribute('title', (row.innerText || row.textContent || raw).replace(/\\s+/g, ' ').trim()); // CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_TOOLTIP_ROW_TITLE`
- src/pages/Calendar.tsx:661 [calendarScale, selectedDate] `}, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients, loading]);`
- src/pages/Calendar.tsx:945 [month] `const monthStart = startOfMonth(currentMonth);`
- src/pages/Calendar.tsx:946 [month] `const monthEnd = endOfMonth(monthStart);`
- src/pages/Calendar.tsx:947 [month] `const monthRangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });`
- src/pages/Calendar.tsx:948 [month] `const monthRangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });`
- src/pages/Calendar.tsx:955 [month] `const calendarDataRangeEnd = rollingWeekEnd.getTime() > monthRangeEnd.getTime() ? rollingWeekEnd : monthRangeEnd;`
- src/pages/Calendar.tsx:956 [month] `const calendarDays = eachDayOfInterval({ start: monthRangeStart, end: monthRangeEnd });`
- src/pages/Calendar.tsx:961 [month] `rangeStart: monthRangeStart,`
- src/pages/Calendar.tsx:973 [selectedDate] `const selectedDayEntries = sortCalendarEntriesForDisplay(getEntriesForDay(scheduleEntries, selectedDate));`
- src/pages/Calendar.tsx:988 [calendarScale, month] `const monthCellMinHeight = calendarScale === 'compact' ? 104 : calendarScale === 'large' ? 160 : 128;`
- src/pages/Calendar.tsx:1473 [month] `<button type="button" className={'seg-btn ${calendarView === 'month' ? 'active' : ''}'} onClick={() => setCalendarView('month')}>Miesiąc</button>`
- src/pages/Calendar.tsx:1477 [month] `{calendarView === 'month' ? (`
- src/pages/Calendar.tsx:1479 [calendarScale] `<button type="button" className={'seg-btn ${calendarScale === 'compact' ? 'active' : ''}'} onClick={() => setCalendarScale('compact')}>Małe kafelki</button>`
- src/pages/Calendar.tsx:1480 [calendarScale] `<button type="button" className={'seg-btn ${calendarScale === 'default' ? 'active' : ''}'} onClick={() => setCalendarScale('default')}>Standard</button>`
- src/pages/Calendar.tsx:1481 [calendarScale] `<button type="button" className={'seg-btn ${calendarScale === 'large' ? 'active' : ''}'} onClick={() => setCalendarScale('large')}>Duże kafelki</button>`
- src/pages/Calendar.tsx:1491 [selectedDate] `const next = addDays(selectedDate, -7);`
- src/pages/Calendar.tsx:1510 [selectedDate] `const next = addDays(selectedDate, 7);`
- src/pages/Calendar.tsx:1571 [month] `{calendarView === 'month' ? (`
- src/pages/Calendar.tsx:1579 [month] `<div className="calendar-month-grid">`
- src/pages/Calendar.tsx:1582 [month] `const isCurrentMonth = isSameMonth(day, monthStart);`
- src/pages/Calendar.tsx:1584 [selectedDate] `const isSelectedDay = isSameDay(day, selectedDate);`
- src/pages/Calendar.tsx:1598 [month] `style={{ minHeight: monthCellMinHeight }}`
- src/pages/Calendar.tsx:1608 [calendarScale] `{dayEntries.slice(0, calendarScale === 'compact' ? 3 : 4).map((entry) => {`
- src/pages/Calendar.tsx:1615 [month] `className={'calendar-day-pill ${getEntryTone(entry)} ${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''} ${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''} ${isCom`
- src/pages/Calendar.tsx:1621 [title=] `title={entry.title}`
- src/pages/Calendar.tsx:1631 [calendarScale] `{dayEntries.length > (calendarScale === 'compact' ? 3 : 4) && (`
- src/pages/Calendar.tsx:1632 [calendarScale, więcej] `<div className="calendar-more">+ {dayEntries.length - (calendarScale === 'compact' ? 3 : 4)} więcej</div>`
- src/pages/Calendar.tsx:1644 [selectedDate] `<h2 className="text-xl font-bold text-slate-900">{format(selectedDate, 'EEEE, d MMMM yyyy', { locale: pl })}</h2>`
- src/pages/Calendar.tsx:1683 [selectedDate] `const active = isSameDay(day, selectedDate);`
- src/pages/Calendar.tsx:1736 [selectedDate] `const isActive = isSameDay(item.date, selectedDate);`
- src/pages/Calendar.tsx:1763 [selectedDate] `const isActiveDay = isSameDay(day, selectedDate);`
