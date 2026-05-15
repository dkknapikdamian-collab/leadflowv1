# CloseFlow lead app - push remaining previous stages v12

## FAKT
- This run stages remaining local dirty tree from previous stages, excluding backup/cache/build folders.
- This run does not change UI, routing or product logic by itself; it only commits existing local changes after guards pass.
- Branch expected: dev-rollout-freeze

## DECYZJA
- Push remaining previous local stages only after build and quiet release gate pass.
- Do not stage backup folders such as docs/audits/*backup*.

## Git status before staging
~~~text
 M AGENTS.md
 M _project/00_PROJECT_STATUS.md
 M _project/01_PROJECT_GOAL.md
 M _project/02_WORK_RULES.md
 M _project/03_CURRENT_STAGE.md
 M _project/04_DECISIONS.md
 M _project/05_MANUAL_TESTS.md
 M _project/06_GUARDS_AND_TESTS.md
 M _project/07_NEXT_STEPS.md
 M _project/08_CHANGELOG_AI.md
 M _project/09_CONTEXT_FOR_OBSIDIAN.md
 M _project/10_PROJECT_TIMELINE.md
 M _project/11_USER_CONFIRMED_TESTS.md
 M docs/audits/operator-rail-stage1-2026-05-15.md
 M docs/audits/right-rail-card-style-map.json
 M docs/audits/right-rail-card-style-map.md
 M docs/audits/right-rail-source-truth-stage70-manual-check.md
 M docs/ui/CLOSEFLOW_ADMIN_FEEDBACK_2026-05-08_TRIAGE.md
 M docs/ui/CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT.generated.json
 M docs/ui/CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2.generated.json
 M docs/ui/CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2.generated.md
 M docs/ui/CLOSEFLOW_UI_MAP.generated.json
 M docs/ui/CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_2026-05-09.md
 M docs/ui/closeflow-ui-map.generated.json
 M docs/ui/closeflow-visual-system-inventory.generated.json
 M package.json
 M scripts/check-clients-attention-rail-visual-stage72.cjs
 M scripts/check-clients-leads-only-attention-stage71.cjs
 M scripts/check-operator-rail-stage1.cjs
 M scripts/check-right-rail-card-source-of-truth-stage75.cjs
 M scripts/check-right-rail-source-truth.cjs
 M scripts/check-stage70-right-rail-source-truth.cjs
 M scripts/check-stage71-leads-right-rail-layout-lock.cjs
 M scripts/check-stage74-clients-leads-to-link-panel.cjs
 M src/App.tsx
 M src/components/AccessGate.tsx
 M src/components/ActivityRoadmap.tsx
 M src/components/AddCaseMissingItemDialog.tsx
 M src/components/CaseQuickActions.tsx
 M src/components/CloseFlowPageHeaderV2.tsx
 M src/components/ContextActionButton.tsx
 M src/components/ContextActionDialogs.tsx
 M src/components/ContextNoteDialog.tsx
 M src/components/DraftReviewDialog.tsx
 M src/components/EmailVerificationGate.tsx
 M src/components/EntityConflictDialog.tsx
 M src/components/ErrorBoundary.tsx
 M src/components/EventCreateDialog.tsx
 M src/components/GlobalAiAssistant.tsx
 M src/components/GlobalQuickActions.tsx
 M src/components/Layout.tsx
 M src/components/LeadAiFollowupDraft.tsx
 M src/components/LeadAiNextAction.tsx
 M src/components/LeadStartServiceDialog.tsx
 M src/components/NotificationRuntime.tsx
 M src/components/PwaInstallPrompt.tsx
 M src/components/QuickAiCapture.tsx
 M src/components/StatShortcutCard.tsx
 M src/components/TaskCreateDialog.tsx
 M src/components/TodayAiAssistant.tsx
 M src/components/admin-tools/AdminDebugToolbar.tsx
 M src/components/appearance-provider.tsx
 M src/components/confirm-dialog.tsx
 M src/components/entity-actions.tsx
 M src/components/finance/CaseFinanceEditorDialog.tsx
 M src/components/finance/CaseFinancePaymentDialog.tsx
 M src/components/finance/CaseSettlementPanel.tsx
 M src/components/finance/CaseSettlementSection.tsx
 M src/components/finance/CommissionFormDialog.tsx
 M src/components/finance/FinanceMiniSummary.tsx
 M src/components/finance/LeadValuePanel.tsx
 M src/components/finance/PaymentFormDialog.tsx
 M src/components/lead-picker.tsx
 M src/components/operator-rail/SimpleFiltersCard.tsx
 M src/components/operator-rail/TopValueRecordsCard.tsx
 M src/components/quick-lead/QuickLeadCaptureModal.tsx
 M src/components/sidebar-mini-calendar.tsx
 M src/components/task-editor-dialog.tsx
 M src/components/topic-contact-picker.tsx
 M src/components/ui-system/ActionCluster.tsx
 M src/components/ui-system/ActionIcon.tsx
 M src/components/ui-system/EntityIcon.tsx
 M src/components/ui-system/FormFooter.tsx
 M src/components/ui-system/ListRow.tsx
 M src/components/ui-system/MetricTile.tsx
 M src/components/ui-system/OperatorMetricTiles.tsx
 M src/components/ui-system/OperatorMetricToneRuntime.tsx
 M src/components/ui-system/icon-registry.ts
 M src/hooks/useClientAuthSnapshot.ts
 M src/hooks/useFirebaseSession.ts
 M src/hooks/useSupabaseSession.ts
 M src/hooks/useWorkspace.ts
 M src/lib/ai-assistant.ts
 M src/lib/ai-drafts.ts
 M src/lib/calendar-items.ts
 M src/lib/finance/case-finance-source.ts
 M src/lib/notifications.ts
 M src/lib/options.ts
 M src/lib/reminders.ts
 M src/lib/schedule-conflicts.ts
 M src/lib/scheduling.ts
 M src/lib/tasks.ts
 M src/lib/utils.ts
 M src/lib/workspace.ts
 M src/main.tsx
 M src/pages/Activity.tsx
 M src/pages/AdminAiSettings.tsx
 M src/pages/AiDrafts.tsx
 M src/pages/Billing.tsx
 M src/pages/Calendar.tsx
 M src/pages/CaseDetail.tsx
 M src/pages/Cases.tsx
 M src/pages/ClientDetail.tsx
 M src/pages/ClientPortal.tsx
 M src/pages/Clients.tsx
 M src/pages/Dashboard.tsx
 M src/pages/LeadDetail.tsx
 M src/pages/Leads.tsx
 M src/pages/Login.tsx
 M src/pages/NotificationsCenter.tsx
 M src/pages/PublicLanding.tsx
 M src/pages/ResponseTemplates.tsx
 M src/pages/Settings.tsx
 M src/pages/SupportCenter.tsx
 M src/pages/Tasks.tsx
 M src/pages/TasksStable.tsx
 M src/pages/Templates.tsx
 M src/pages/Today.tsx
 M src/pages/TodayStable.tsx
 M src/server/_access-gate.ts
 M src/server/_portal-token.ts
 M src/server/_request-scope.ts
 M src/server/ai-assistant.ts
 M src/server/ai-drafts.ts
 M src/server/daily-digest-handler.ts
 M src/server/drafts.ts
 M src/server/google-calendar-handler.ts
 M src/server/google-calendar-inbound.ts
 M src/server/google-calendar-sync.ts
 M src/server/service-profiles.ts
 M src/server/weekly-report-handler.ts
 M src/styles/admin-tools.css
 M src/styles/clients-next-action-layout.css
 M src/styles/closeflow-alert-severity.css
 M src/styles/closeflow-leads-right-rail-layout-lock.css
 M src/styles/closeflow-modal-visual-system.css
 M src/styles/closeflow-right-rail-source-truth.css
 M src/styles/finance/closeflow-finance.css
 M src/styles/tasks-header-stage45b-cleanup.css
 M src/styles/visual-stage10-notifications-vnext.css
 M src/styles/visual-stage12-client-detail-vnext.css
 M src/styles/visual-stage14-lead-detail-vnext.css
 M src/styles/visual-stage21-task-form-vnext.css
 M src/styles/visual-stage25-leads-full-jsx-html-rebuild.css
 M src/styles/visual-stage26-leads-visual-alignment-fix.css
 M tests/right-rail-card-source-of-truth.test.cjs
 M tests/stage71-leads-right-rail-layout-lock.test.cjs
 M tests/stage74-clients-leads-to-link-panel.test.cjs
?? _project/12_IMPLEMENTATION_LEDGER.md
?? _project/13_TEST_HISTORY.md
?? _project/14_AI_REPORTS_INDEX.md
?? _project/15_RELEASE_READINESS.md
?? _project/16_OBSIDIAN_SYNC_LOG.md
?? _project/history/2026-05-15_closeflow_project_memory_rebuild_v8.md
?? _project/history/2026-05-15_closeflow_project_memory_rebuild_v9.md
?? _project/runs/20260515-222758_closeflow_full_memory_obsidian_readable_names_v8.md
?? _project/runs/20260515-223159_closeflow_full_memory_obsidian_readable_names_v9.md
?? docs/audits/cases-import-contract-stage4-v15-2026-05-15.md
?? docs/audits/cases-import-contract-stage4-v15-backup-20260515190348/
?? docs/audits/clients-no-lead-attention-stage1-2026-05-15.md
?? docs/audits/clients-no-lead-attention-stage1-backup-20260515_193132/
?? docs/audits/clients-no-lead-attention-stage1-backup-20260515_193140/
?? docs/audits/clients-top-value-stage2-2026-05-15.md
?? docs/audits/leads-simple-filters-stage3-2026-05-15.md
?? docs/audits/leads-syntax-doctor-stage4-v17-2026-05-15.md
?? docs/audits/leads-syntax-doctor-stage4-v17-backup-20260515200831/
?? docs/audits/operator-rail-stage5-cleanup-2026-05-15.md
?? docs/audits/operator-rail-stage5-final-repair-2026-05-15.md
?? docs/audits/operator-rail-stage5-guard-compat-hotfix-2026-05-15.md
?? docs/audits/operator-rail-stage5-stabilizer-2026-05-15.md
?? docs/audits/operator-rail-stage5-surgical-stabilizer-2026-05-15.md
?? docs/audits/right-rail-cleanup-stage4-backup-20260515175931/
?? docs/audits/right-rail-cleanup-stage4-hotfix-v5-2026-05-15.md
?? docs/audits/right-rail-cleanup-stage4-hotfix-v9-2026-05-15.md
?? docs/audits/right-rail-import-doctor-stage4-v13-2026-05-15.md
?? docs/audits/right-rail-import-doctor-stage4-v14-2026-05-15.md
?? scripts/check-closeflow-project-memory-readable-names.cjs
?? scripts/check-operator-rail-stage5-guard-compat.cjs
?? scripts/check-operator-rail-stage5.cjs
?? src/lib/client-value.ts
?? tests/_stage83-right-rail-stale-helper.cjs
?? tests/stage79-clients-no-lead-attention-rail.test.cjs
?? tests/stage81-clients-top-value-records-card.test.cjs
?? tests/stage82-leads-simple-filters-card.test.cjs
?? tests/stage83-right-rail-stale-cleanup.test.cjs
?? tests/stage84-import-doctor-right-rail.test.cjs
?? tests/stage85-cases-import-contract-repair.test.cjs
?? tests/stage86-leads-allow-dev-preview-syntax.test.cjs
?? tests/stage86-leads-dangling-assignment-guard.test.cjs
?? tools/fix-calendar-relation-link-guard-stage4-v19.cjs
?? tools/fix-cases-import-contract-stage4-v15.cjs
?? tools/fix-leads-allow-dev-preview-v16.cjs
?? tools/hotfix-right-rail-cleanup-stage4-v10.cjs
?? tools/hotfix-right-rail-cleanup-stage4-v3.cjs
?? tools/hotfix-right-rail-cleanup-stage4-v4.cjs
?? tools/hotfix-right-rail-cleanup-stage4-v5.cjs
?? tools/hotfix-right-rail-cleanup-stage4-v6.cjs
?? tools/hotfix-right-rail-cleanup-stage4-v7.cjs
?? tools/hotfix-right-rail-cleanup-stage4-v8.cjs
?? tools/hotfix-right-rail-cleanup-stage4-v9.cjs
?? tools/hotfix-right-rail-cleanup-stage4.cjs
?? tools/import-doctor-stage4-v12.cjs
?? tools/import-doctor-stage4-v13.cjs
?? tools/import-doctor-stage4-v14.cjs
?? tools/leads-syntax-doctor-stage4-v17.cjs
?? tools/patch-clients-no-lead-attention-rail-stage1.cjs
?? tools/patch-clients-top-value-stage2.cjs
?? tools/patch-leads-simple-filters-stage3.cjs
?? tools/patch-right-rail-cleanup-stage4.cjs
~~~

## Staged files
~~~text
AGENTS.md
_project/00_PROJECT_STATUS.md
_project/01_PROJECT_GOAL.md
_project/02_WORK_RULES.md
_project/03_CURRENT_STAGE.md
_project/04_DECISIONS.md
_project/05_MANUAL_TESTS.md
_project/06_GUARDS_AND_TESTS.md
_project/07_NEXT_STEPS.md
_project/08_CHANGELOG_AI.md
_project/09_CONTEXT_FOR_OBSIDIAN.md
_project/10_PROJECT_TIMELINE.md
_project/11_USER_CONFIRMED_TESTS.md
_project/12_IMPLEMENTATION_LEDGER.md
_project/13_TEST_HISTORY.md
_project/14_AI_REPORTS_INDEX.md
_project/15_RELEASE_READINESS.md
_project/16_OBSIDIAN_SYNC_LOG.md
_project/history/2026-05-15_closeflow_project_memory_rebuild_v8.md
_project/history/2026-05-15_closeflow_project_memory_rebuild_v9.md
_project/runs/20260515-222758_closeflow_full_memory_obsidian_readable_names_v8.md
_project/runs/20260515-223159_closeflow_full_memory_obsidian_readable_names_v9.md
docs/audits/cases-import-contract-stage4-v15-2026-05-15.md
docs/audits/clients-no-lead-attention-stage1-2026-05-15.md
docs/audits/clients-top-value-stage2-2026-05-15.md
docs/audits/leads-simple-filters-stage3-2026-05-15.md
docs/audits/leads-syntax-doctor-stage4-v17-2026-05-15.md
docs/audits/operator-rail-stage1-2026-05-15.md
docs/audits/operator-rail-stage5-cleanup-2026-05-15.md
docs/audits/operator-rail-stage5-final-repair-2026-05-15.md
docs/audits/operator-rail-stage5-guard-compat-hotfix-2026-05-15.md
docs/audits/operator-rail-stage5-stabilizer-2026-05-15.md
docs/audits/operator-rail-stage5-surgical-stabilizer-2026-05-15.md
docs/audits/right-rail-card-style-map.json
docs/audits/right-rail-card-style-map.md
docs/audits/right-rail-cleanup-stage4-hotfix-v5-2026-05-15.md
docs/audits/right-rail-cleanup-stage4-hotfix-v9-2026-05-15.md
docs/audits/right-rail-import-doctor-stage4-v13-2026-05-15.md
docs/audits/right-rail-import-doctor-stage4-v14-2026-05-15.md
docs/audits/right-rail-source-truth-stage70-manual-check.md
docs/ui/CLOSEFLOW_ADMIN_FEEDBACK_2026-05-08_TRIAGE.md
docs/ui/CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT.generated.json
docs/ui/CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2.generated.json
docs/ui/CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2.generated.md
docs/ui/CLOSEFLOW_UI_MAP.generated.json
docs/ui/CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_2026-05-09.md
docs/ui/closeflow-ui-map.generated.json
docs/ui/closeflow-visual-system-inventory.generated.json
package.json
scripts/check-clients-attention-rail-visual-stage72.cjs
scripts/check-clients-leads-only-attention-stage71.cjs
scripts/check-closeflow-project-memory-readable-names.cjs
scripts/check-operator-rail-stage1.cjs
scripts/check-operator-rail-stage5-guard-compat.cjs
scripts/check-operator-rail-stage5.cjs
scripts/check-right-rail-card-source-of-truth-stage75.cjs
scripts/check-right-rail-source-truth.cjs
scripts/check-stage70-right-rail-source-truth.cjs
scripts/check-stage71-leads-right-rail-layout-lock.cjs
scripts/check-stage74-clients-leads-to-link-panel.cjs
src/App.tsx
src/components/AccessGate.tsx
src/components/ActivityRoadmap.tsx
src/components/AddCaseMissingItemDialog.tsx
src/components/CaseQuickActions.tsx
src/components/CloseFlowPageHeaderV2.tsx
src/components/ContextActionButton.tsx
src/components/ContextActionDialogs.tsx
src/components/ContextNoteDialog.tsx
src/components/DraftReviewDialog.tsx
src/components/EntityConflictDialog.tsx
src/components/ErrorBoundary.tsx
src/components/EventCreateDialog.tsx
src/components/GlobalAiAssistant.tsx
src/components/GlobalQuickActions.tsx
src/components/Layout.tsx
src/components/LeadAiFollowupDraft.tsx
src/components/LeadAiNextAction.tsx
src/components/LeadStartServiceDialog.tsx
src/components/NotificationRuntime.tsx
src/components/PwaInstallPrompt.tsx
src/components/QuickAiCapture.tsx
src/components/StatShortcutCard.tsx
src/components/TaskCreateDialog.tsx
src/components/TodayAiAssistant.tsx
src/components/admin-tools/AdminDebugToolbar.tsx
src/components/appearance-provider.tsx
src/components/confirm-dialog.tsx
src/components/entity-actions.tsx
src/components/finance/CaseFinanceEditorDialog.tsx
src/components/finance/CaseFinancePaymentDialog.tsx
src/components/finance/CaseSettlementPanel.tsx
src/components/finance/CaseSettlementSection.tsx
src/components/finance/CommissionFormDialog.tsx
src/components/finance/FinanceMiniSummary.tsx
src/components/finance/LeadValuePanel.tsx
src/components/finance/PaymentFormDialog.tsx
src/components/lead-picker.tsx
src/components/operator-rail/SimpleFiltersCard.tsx
src/components/operator-rail/TopValueRecordsCard.tsx
src/components/quick-lead/QuickLeadCaptureModal.tsx
src/components/sidebar-mini-calendar.tsx
src/components/task-editor-dialog.tsx
src/components/topic-contact-picker.tsx
src/components/ui-system/ActionCluster.tsx
src/components/ui-system/ActionIcon.tsx
src/components/ui-system/EntityIcon.tsx
src/components/ui-system/FormFooter.tsx
src/components/ui-system/ListRow.tsx
src/components/ui-system/MetricTile.tsx
src/components/ui-system/OperatorMetricTiles.tsx
src/components/ui-system/OperatorMetricToneRuntime.tsx
src/components/ui-system/icon-registry.ts
src/hooks/useFirebaseSession.ts
src/lib/ai-drafts.ts
src/lib/calendar-items.ts
src/lib/client-value.ts
src/lib/options.ts
src/lib/scheduling.ts
src/lib/tasks.ts
src/main.tsx
src/pages/Activity.tsx
src/pages/AdminAiSettings.tsx
src/pages/AiDrafts.tsx
src/pages/Billing.tsx
src/pages/Calendar.tsx
src/pages/CaseDetail.tsx
src/pages/Cases.tsx
src/pages/ClientDetail.tsx
src/pages/ClientPortal.tsx
src/pages/Clients.tsx
src/pages/Dashboard.tsx
src/pages/LeadDetail.tsx
src/pages/Leads.tsx
src/pages/Login.tsx
src/pages/NotificationsCenter.tsx
src/pages/PublicLanding.tsx
src/pages/ResponseTemplates.tsx
src/pages/Settings.tsx
src/pages/SupportCenter.tsx
src/pages/Tasks.tsx
src/pages/TasksStable.tsx
src/pages/Templates.tsx
src/pages/Today.tsx
src/pages/TodayStable.tsx
src/server/_portal-token.ts
src/server/_request-scope.ts
src/server/drafts.ts
src/server/google-calendar-inbound.ts
src/server/google-calendar-sync.ts
src/styles/admin-tools.css
src/styles/clients-next-action-layout.css
src/styles/closeflow-alert-severity.css
src/styles/closeflow-leads-right-rail-layout-lock.css
src/styles/closeflow-modal-visual-system.css
src/styles/closeflow-right-rail-source-truth.css
src/styles/finance/closeflow-finance.css
src/styles/tasks-header-stage45b-cleanup.css
src/styles/visual-stage10-notifications-vnext.css
src/styles/visual-stage12-client-detail-vnext.css
src/styles/visual-stage14-lead-detail-vnext.css
src/styles/visual-stage21-task-form-vnext.css
src/styles/visual-stage25-leads-full-jsx-html-rebuild.css
src/styles/visual-stage26-leads-visual-alignment-fix.css
tests/_stage83-right-rail-stale-helper.cjs
tests/right-rail-card-source-of-truth.test.cjs
tests/stage71-leads-right-rail-layout-lock.test.cjs
tests/stage74-clients-leads-to-link-panel.test.cjs
tests/stage79-clients-no-lead-attention-rail.test.cjs
tests/stage81-clients-top-value-records-card.test.cjs
tests/stage82-leads-simple-filters-card.test.cjs
tests/stage83-right-rail-stale-cleanup.test.cjs
tests/stage84-import-doctor-right-rail.test.cjs
tests/stage85-cases-import-contract-repair.test.cjs
tests/stage86-leads-allow-dev-preview-syntax.test.cjs
tests/stage86-leads-dangling-assignment-guard.test.cjs
tools/fix-calendar-relation-link-guard-stage4-v19.cjs
tools/fix-cases-import-contract-stage4-v15.cjs
tools/fix-leads-allow-dev-preview-v16.cjs
tools/hotfix-right-rail-cleanup-stage4-v10.cjs
tools/hotfix-right-rail-cleanup-stage4-v3.cjs
tools/hotfix-right-rail-cleanup-stage4-v4.cjs
tools/hotfix-right-rail-cleanup-stage4-v5.cjs
tools/hotfix-right-rail-cleanup-stage4-v6.cjs
tools/hotfix-right-rail-cleanup-stage4-v7.cjs
tools/hotfix-right-rail-cleanup-stage4-v8.cjs
tools/hotfix-right-rail-cleanup-stage4-v9.cjs
tools/hotfix-right-rail-cleanup-stage4.cjs
tools/import-doctor-stage4-v12.cjs
tools/import-doctor-stage4-v13.cjs
tools/import-doctor-stage4-v14.cjs
tools/leads-syntax-doctor-stage4-v17.cjs
tools/patch-clients-no-lead-attention-rail-stage1.cjs
tools/patch-clients-top-value-stage2.cjs
tools/patch-leads-simple-filters-stage3.cjs
tools/patch-right-rail-cleanup-stage4.cjs
~~~

## Checks
~~~text
OK node scripts/check-json-no-bom-stage73b.cjs
OK node scripts/check-project-memory.cjs
OK npm run check:project-memory
SKIP npm run typecheck - no package script
OK npm run build
OK npm run verify:closeflow:quiet
~~~
