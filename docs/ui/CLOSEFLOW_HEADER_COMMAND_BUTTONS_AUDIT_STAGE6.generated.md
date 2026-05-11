# CloseFlow header command buttons audit Stage 6

Audyt pokazuje stare źródła, które nadal mogą wpływać na przyciski w górnym pasku i headerach.

## Pliki z trafieniami

- src/styles/closeflow-page-header.css: 55
- src/styles/closeflow-command-actions-source-truth.css: 51
- src/styles/stage30a-mobile-contrast-lock.css: 32
- src/styles/closeflow-page-header-card-source-truth.css: 25
- src/styles/stage31-full-mobile-polish.css: 21
- src/components/GlobalQuickActions.tsx: 13
- src/styles/closeflow-action-tokens.css: 12
- src/styles/stage40-page-header-action-overflow-hardening.css: 9
- src/styles/visual-stage17-today-hard-1to1.css: 9
- src/styles/visual-stage21-today-final-lock.css: 8
- src/pages/Login.tsx: 8
- src/pages/Tasks.tsx: 8
- src/pages/Today.tsx: 8
- src/styles/closeflow-stage16c-tasks-cases-parity.css: 7
- src/styles/stage39-page-headers-copy-visual-system.css: 7
- src/styles/visual-stage01-shell.css: 6
- src/styles/visual-stage26-leads-visual-alignment-fix.css: 6
- src/pages/TodayStable.tsx: 5
- src/styles/visual-stage18-leads-hard-1to1.css: 4
- src/components/LeadAiFollowupDraft.tsx: 4
- src/components/LeadAiNextAction.tsx: 4
- src/components/PwaInstallPrompt.tsx: 4
- src/pages/Dashboard.tsx: 4
- src/styles/closeflow-modal-visual-system.css: 3
- src/styles/visual-stage05-clients.css: 3
- src/styles/visual-stage20-tasks-safe-css.css: 3
- src/styles/visual-stage25-leads-full-jsx-html-rebuild.css: 3
- src/styles/visual-stage27-cases-vnext.css: 3
- src/components/EmailVerificationGate.tsx: 3
- src/styles/visual-stage28-tasks-vnext.css: 2
- src/styles/visual-stage29-calendar-vnext.css: 2
- src/components/confirm-dialog.tsx: 2
- src/pages/Calendar.tsx: 2
- src/pages/Cases.tsx: 2
- src/pages/ClientPortal.tsx: 2
- src/pages/Clients.tsx: 2
- src/pages/Leads.tsx: 2
- src/styles/admin-tools.css: 1
- src/styles/stage35-clients-value-detail-cleanup.css: 1
- src/styles/visual-stage02-today.css: 1
- src/styles/visual-stage07-cases.css: 1
- src/styles/visual-stage19-clients-safe-css.css: 1
- src/styles/visual-stage22-leads-final-lock.css: 1
- src/styles/visual-stage23-leads-html-parity-fix.css: 1
- src/components/admin-tools/AdminDebugToolbar.tsx: 1
- src/components/ErrorBoundary.tsx: 1
- src/components/lead-picker.tsx: 1
- src/components/QuickAiCapture.tsx: 1
- src/components/topic-contact-picker.tsx: 1
- src/components/ui/card.tsx: 1
- src/components/ui-system/OperatorMetricToneRuntime.tsx: 1
- src/components/ui-system/PageHero.tsx: 1
- src/pages/TasksStable.tsx: 1
- src/pages/UiPreviewVNextFull.tsx: 1

## Decyzja

Finalnym źródłem prawdy dla tych akcji jest `src/styles/closeflow-command-actions-source-truth.css`.

Ten plik celowo jest importowany w `src/App.tsx`, w `GlobalQuickActions.tsx`, w `QuickAiCapture.tsx` oraz na końcu `src/styles/emergency/emergency-hotfixes.css`, żeby wygrać ze starymi warstwami `closeflow-action-tokens.css`, page header CSS i visual-stage.
