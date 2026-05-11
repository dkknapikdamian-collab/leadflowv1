# CloseFlow page header style source audit

This report lists old CSS files that still mention page header selectors or nearby visual properties.

## Summary

- src/styles/closeflow-page-header.css: 246
- src/styles/closeflow-page-header-card-source-truth.css: 161
- src/styles/visual-stage9-ai-drafts-vnext.css: 154
- src/styles/visual-stage10-notifications-vnext.css: 93
- src/styles/visual-stage16-billing-vnext.css: 93
- src/styles/visual-stage8-activity-vnext.css: 67
- src/styles/visual-stage17-support-vnext.css: 60
- src/styles/visual-stage21-today-final-lock.css: 53
- src/styles/visual-stage19-settings-vnext.css: 46
- src/styles/visual-stage29-calendar-vnext.css: 45
- src/styles/visual-stage24-leads-html-dom-parity-hardfix.css: 44
- src/styles/visual-stage25-leads-full-jsx-html-rebuild.css: 42
- src/styles/stage31-full-mobile-polish.css: 41
- src/styles/visual-stage17-today-hard-1to1.css: 41
- src/styles/visual-stage18-leads-hard-1to1.css: 38
- src/styles/visual-stage08-case-detail.css: 33
- src/styles/visual-stage26-leads-visual-alignment-fix.css: 32
- src/styles/visual-stage07-cases.css: 30
- src/styles/visual-stage27-cases-vnext.css: 30
- src/styles/stage39-page-headers-copy-visual-system.css: 29
- src/styles/visual-stage05-clients.css: 25
- src/styles/visual-stage28-tasks-vnext.css: 24
- src/styles/closeflow-stage16c-tasks-cases-parity.css: 23
- src/styles/visual-stage22-leads-final-lock.css: 21
- src/styles/visual-stage16-today-html-reset.css: 19
- src/styles/Settings.css: 17
- src/styles/visual-stage06-client-detail.css: 17
- src/styles/design-system/closeflow-layout.css: 16
- src/styles/stage40-page-header-action-overflow-hardening.css: 15
- src/styles/stage37-unified-page-head-and-metrics.css: 11
- src/styles/stage36-unified-light-pages.css: 5
- src/styles/page-adapters/page-adapters.css: 3
- src/styles/closeflow-vnext-ui-contract.css: 2
- src/styles/emergency/emergency-hotfixes.css: 2

## Rule

The final source of truth must be `src/styles/closeflow-page-header-card-source-truth.css` and must target only `[data-cf-page-header="true"]`.
