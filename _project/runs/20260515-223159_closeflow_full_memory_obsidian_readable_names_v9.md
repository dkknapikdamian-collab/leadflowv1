# CloseFlow / LeadFlow - run report V9

Data: 2026-05-15
Run: 20260515-223159
AppRepo: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
AppBranch: dev-rollout-freeze
ObsidianVault: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT

## Co wykonano
- Dopisano zasady do AGENTS.md bez nadpisywania.
- Utworzono/uzupelniono _project z payload/project.
- Dodano guard pamieci projektu.
- Zsynchronizowano Obsidiana z payload/obsidian.
- Wykonano audyt generycznych nazw Obsidiana.

## Naprawa V9
- V8 mial blad kopiowania payloadu: wildcard przy LiteralPath nie skopiowal plikow _project.
- V9 kopiuje payload przez Get-ChildItem, wiec guard uruchamia sie dopiero po realnym zapisie plikow.

## Status git przed
### App repo
```text
 M AGENTS.md
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
?? _project/history/2026-05-15_closeflow_project_memory_rebuild_v8.md
?? _project/runs/20260515-222758_closeflow_full_memory_obsidian_readable_names_v8.md
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
```
### Obsidian
```text
 M .obsidian/graph.json
?? 10_PROJEKTY/CloseFlow_LeadFlow/
?? "CloseFlow - LeadFlow - CaseFlow + AI Operator - ledger decyzji i test\303\263w.md"
```

## Log testow / guardow
```text
# CloseFlow checks 20260515-223159
RUN npm.cmd run check:project-memory:closeflow
 
 >   c l o s e f l o w @ 0 . 0 . 0   c h e c k : p r o j e c t - m e m o r y : c l o s e f l o w  
 >   n o d e   s c r i p t s / c h e c k - c l o s e f l o w - p r o j e c t - m e m o r y - r e a d a b l e - n a m e s . c j s  
  
 O K :   C l o s e F l o w   p r o j e c t   m e m o r y   g u a r d   p a s s e d .  
 RUN npm.cmd run verify:closeflow:quiet
 
 >   c l o s e f l o w @ 0 . 0 . 0   v e r i f y : c l o s e f l o w : q u i e t  
 >   n o d e   s c r i p t s / c l o s e f l o w - r e l e a s e - c h e c k - q u i e t . c j s  
  
 C L O S E F L O W _ C A S E S _ I M P O R T _ C O N T R A C T _ O K  
 O K   c a s e   d e t a i l   n o   p a r t i a l   l o a d i n g  
 O K   c a s e   d e t a i l   n o   p a r t i a l   l o a d i n g  
 O K   c a s e   d e t a i l   l o a d i n g   r e f e r e n c e  
 O K   t o d a y   h e a d e r   a c t i o n s   s t a c k  
 O K   t o d a y   m o b i l e   t i l e   f o c u s  
 O K   c a s e   t r a s h   a c t i o n s  
 O K   p r o d u c t i o n   b u i l d  
 O K   t e s t s / s t a g e 7 9 - r e l e a s e - g a t e - m a s s - g u a r d . t e s t . c j s  
 O K   t e s t s / s t a g e 7 9 - t o d a y - t a s k - d o n e - a c t i o n . t e s t . c j s  
 O K   t e s t s / r i g h t - r a i l - c a r d - s o u r c e - o f - t r u t h . t e s t . c j s  
 O K   t e s t s / c l o s e f l o w - r e l e a s e - g a t e . t e s t . c j s  
 O K   t e s t s / c l o s e f l o w - r e l e a s e - g a t e - q u i e t . t e s t . c j s  
 O K   t e s t s / l e a d - n e x t - a c t i o n - t i t l e - n o t - n u l l . t e s t . c j s  
 O K   t e s t s / l e a d - c l i e n t - p a t h - c o n t r a c t . t e s t . c j s  
 O K   t e s t s / c l i e n t - r e l a t i o n - c o m m a n d - c e n t e r . t e s t . c j s  
 O K   t e s t s / c a l e n d a r - c o m p l e t e d - e v e n t - b e h a v i o r . t e s t . c j s  
 O K   t e s t s / c a l e n d a r - r e s t o r e - c o m p l e t e d - e n t r i e s . t e s t . c j s  
 O K   t e s t s / c a l e n d a r - e n t r y - r e l a t i o n - l i n k s . t e s t . c j s  
 O K   t e s t s / t o d a y - c o m p l e t e d - e n t r i e s - b e h a v i o r . t e s t . c j s  
 O K   t e s t s / t o d a y - r e s t o r e - c o m p l e t e d - l a b e l . t e s t . c j s  
 O K   t e s t s / t o d a y - e n t r y - r e l a t i o n - l i n k s . t e s t . c j s  
 O K   t e s t s / t o d a y - c a l e n d a r - a c t i v i t y - l o g g i n g . t e s t . c j s  
 O K   t e s t s / a c t i v i t y - c o m m a n d - c e n t e r . t e s t . c j s  
 O K   t e s t s / l e a d - s e r v i c e - m o d e - v 1 . t e s t . c j s  
 O K   t e s t s / p a n e l - d e l e t e - a c t i o n s - v 1 . t e s t . c j s  
 O K   t e s t s / c a s e - l i f e c y c l e - v 1 - f o u n d a t i o n . t e s t . c j s  
 O K   t e s t s / t o d a y - v 1 - f i n a l - a c t i o n - b o a r d . t e s t . c j s  
 O K   t e s t s / t o d a y - p r i o r i t y - r e a s o n s - r u n t i m e . t e s t . c j s  
 O K   t e s t s / c a s e s - v 1 - l i f e c y c l e - c o m m a n d - b o a r d . t e s t . c j s  
 O K   t e s t s / c a s e s - f i l e t e x t - r u n t i m e . t e s t . c j s  
 O K   t e s t s / c a s e - d e t a i l - v 1 - c o m m a n d - c e n t e r . t e s t . c j s  
 O K   t e s t s / c a s e - d e t a i l - h i s t o r y - w o r k r o w - l e a k - f i x - 2 0 2 6 - 0 5 - 1 3 . t e s t . c j s  
 O K   t e s t s / c a s e - d e t a i l - r e w r i t e - b u i l d - w o r k i t e m s - f i n a l - 2 0 2 6 - 0 5 - 1 3 . t e s t . c j s  
 O K   t e s t s / c a s e - d e t a i l - n o - a c t i v i t y - n o t e s - f i n a l - 2 0 2 6 - 0 5 - 1 3 . t e s t . c j s  
 O K   t e s t s / c a s e - d e t a i l - n o - a c t i v i t y - n o t e s - w o r k i t e m s - 2 0 2 6 - 0 5 - 1 3 . t e s t . c j s  
 O K   t e s t s / p 1 - c a s e - d e t a i l - h i s t o r y - q u i c k - a c t i o n s - v i s u a l - 2 0 2 6 - 0 5 - 1 3 . t e s t . c j s  
 O K   t e s t s / c a s e - d e t a i l - h i s t o r y - v i s u a l - p 1 - r e p a i r 3 - 2 0 2 6 - 0 5 - 1 3 . t e s t . c j s  
 O K   t e s t s / c a s e - d e t a i l - h i s t o r y - v i s u a l - p 1 - r e p a i r 4 - 2 0 2 6 - 0 5 - 1 3 . t e s t . c j s  
 O K   t e s t s / c a s e - d e t a i l - h i s t o r y - v i s u a l - p 1 - r e p a i r 5 - 2 0 2 6 - 0 5 - 1 3 . t e s t . c j s  
 O K   t e s t s / c l i e n t - d e t a i l - v 1 - o p e r a t i o n a l - c e n t e r . t e s t . c j s  
 O K   t e s t s / c l i e n t - d e t a i l - s i m p l i f i e d - c a r d - v i e w . t e s t . c j s  
 O K   t e s t s / c l i e n t - d e t a i l - f i n a l - o p e r a t i n g - m o d e l . t e s t . c j s  
 O K   t e s t s / t o d a y - q u i c k - s n o o z e - o p t i o n s . t e s t . c j s  
 O K   t e s t s / t o d a y - q u i c k - s n o o z e - c l i c k - e d i t - p o l i s h . t e s t . c j s  
 O K   t e s t s / t o d a y - q u i c k - s n o o z e - h a r d - c l i c k - f i x . t e s t . c j s  
 O K   t e s t s / p w a - f o u n d a t i o n . t e s t . c j s  
 O K   t e s t s / d a i l y - d i g e s t - e m a i l - r u n t i m e . t e s t . c j s  
 O K   t e s t s / e m a i l - d i g e s t - d o m a i n - g a t e . t e s t . c j s  
 O K   t e s t s / b i l l i n g - s t r i p e - b l i k - f o u n d a t i o n . t e s t . c j s  
 O K   t e s t s / b i l l i n g - f o u n d a t i o n - t e s t - p o l i s h - l a b e l - r e g r e s s i o n . t e s t . c j s  
 O K   t e s t s / b i l l i n g - s t r i p e - b l i k - m u l t i - p l a n - p r i c i n g . t e s t . c j s  
 O K   t e s t s / b i l l i n g - c h e c k o u t - v e r c e l - a p i - t y p e - g u a r d . t e s t . c j s  
 O K   t e s t s / b i l l i n g - u i - p o l i s h - a n d - d i a g n o s t i c s . t e s t . c j s  
 O K   t e s t s / u i - c o p y - a n d - b i l l i n g - c l e a n u p . t e s t . c j s  
 O K   t e s t s / a i - c o n f i g - a d m i n - f o u n d a t i o n . t e s t . c j s  
 O K   t e s t s / a i - c o n f i g - n o - s e c r e t - l e a k . t e s t . c j s  
 O K   t e s t s / c a s e s - p a g e - h e l p e r - c o p y - c l e a n u p . t e s t . c j s  
 O K   t e s t s / s t a t - s h o r t c u t - c a r d s - s t a n d a r d . t e s t . c j s  
 O K   t e s t s / u i - c o m p l e t e d - l a b e l - c o n s i s t e n c y . t e s t . c j s  
 O K   t e s t s / l e a d s - h i s t o r y - c o p y - c l e a n u p . t e s t . c j s  
 O K   t e s t s / a i - q u i c k - c a p t u r e - f o u n d a t i o n . t e s t . c j s  
 O K   t e s t s / a i - q u i c k - c a p t u r e - v o i c e - a n d - t o d a y . t e s t . c j s  
 O K   t e s t s / a i - f o l l o w u p - d r a f t . t e s t . c j s  
 O K   t e s t s / a i - n e x t - a c t i o n - s u g g e s t i o n . t e s t . c j s  
 O K   t e s t s / a i - n e x t - a c t i o n - c r e a t e - t a s k . t e s t . c j s  
 O K   t e s t s / p 1 a - n o - g l o b a l - f o c u s - r e f r e s h - 2 0 2 6 - 0 5 - 1 3 . t e s t . c j s  
 O K   t e s t s / a i - a s s i s t a n t - c o m m a n d - c e n t e r . t e s t . c j s  
 O K   t e s t s / a i - c a p t u r e - s p e e c h - p a r s e r . t e s t . c j s  
 O K   t e s t s / a i - a s s i s t a n t - s c o p e - b u d g e t - g u a r d . t e s t . c j s  
 O K   t e s t s / a i - a s s i s t a n t - c a p t u r e - h a n d o f f . t e s t . c j s  
 O K   t e s t s / b i l l i n g - s t r i p e - d i a g n o s t i c s - d r y - r u n . t e s t . c j s  
 O K   t e s t s / b i l l i n g - d r y - r u n - t e s t - o r d e r - r e g r e s s i o n . t e s t . c j s  
 O K   t e s t s / s t r i p e - c h e c k o u t - a p p - u r l - n o r m a l i z a t i o n . t e s t . c j s  
 O K   t e s t s / d a i l y - d i g e s t - d i a g n o s t i c s . t e s t . c j s  
 O K   t e s t s / d a i l y - d i g e s t - c r o n - a u t h . t e s t . c j s  
 O K   t e s t s / t o d a y - a c t i o n - l a y o u t - n o t - c o l u m n - c r a m p e d . t e s t . c j s  
 O K   t e s t s / v e r c e l - h o b b y - f u n c t i o n - b u d g e t . t e s t . c j s  
 O K   t e s t s / r e q u e s t - s c o p e - s e r v e r - h e l p e r . t e s t . c j s  
 O K   t e s t s / r e q u e s t - i d e n t i t y - v e r c e l - a p i - s i g n a t u r e . t e s t . c j s  
 O K   t e s t s / p o l i s h - m o j i b a k e - a u d i t . t e s t . c j s  
 O K   t e s t s / r e p o - b a c k u p - f o l d e r s - n o t - t r a c k e d . t e s t . c j s  
 O K   t e s t s / s t a g e 3 0 - l e a d s - c l i e n t s - t r a s h - c o n t r a c t . t e s t . c j s  
 O K   t e s t s / s t a g e 3 1 - l e a d s - t h i n - l i s t - s e a r c h . t e s t . c j s  
 O K   t e s t s / s t a g e 3 2 - l e a d s - v a l u e - r i g h t - r a i l . t e s t . c j s  
 O K   t e s t s / s t a g e 3 2 e - r e l a t i o n - r a i l - c o p y - c o m p a t . t e s t . c j s  
 O K   t e s t s / s t a g e 3 2 g - r e l a t i o n - f u n n e l - f u l l - g a t e - c o n t r a c t . t e s t . c j s  
 O K   t e s t s / s t a g e 3 2 f - r e l a t i o n - f u n n e l - c o n t r a c t . t e s t . c j s  
 O K   t e s t s / s t a g e 3 5 c - a i - a u t o s p e e c h - c o m p a c t - c o n t r a c t - f i x . t e s t . c j s  
 O K   t e s t s / s t a g e 3 5 - a i - a s s i s t a n t - c o m p a c t - u i . t e s t . c j s  
 O K   t e s t s / l a y o u t - b r a n d - l a b e l . t e s t . c j s  
 O K   t e s t s / l e a d - s t a r t - s e r v i c e - c a s e - r e d i r e c t . t e s t . c j s  
 O K   t e s t s / b i l l i n g - c h e c k o u t - n o - p r e f i l l e d - p e r s o n a l - e m a i l . t e s t . c j s  
 O K   t e s t s / s t a g e 0 2 - a c c e s s - b i l l i n g - r e l e a s e - e v i d e n c e . t e s t . c j s  
 O K   t e s t s / s t a g e 0 3 a - a p i - s c h e m a - c o n t r a c t . t e s t . c j s  
 O K   t e s t s / s t a g e 0 3 b - s y s t e m - f a l l b a c k - b o u n d a r y . t e s t . c j s  
 O K   t e s t s / s t a g e 0 3 c - l e a d s - f a l l b a c k - b o u n d a r y . t e s t . c j s  
 O K   t e s t s / s t a g e 0 3 d - o p t i o n a l - c o l u m n s - e v i d e n c e . t e s t . c j s  
 O K   t e s t s / f a z a 2 - e t a p 2 1 - w o r k s p a c e - i s o l a t i o n . t e s t . c j s  
 O K   t e s t s / f a z a 2 - e t a p 2 2 - r l s - b a c k e n d - s e c u r i t y - p r o o f . t e s t . c j s  
 O K   t e s t s / f a z a 3 - e t a p 3 1 - p l a n - s o u r c e - o f - t r u t h . t e s t . c j s  
 O K   t e s t s / f a z a 3 - e t a p 3 2 - p l a n - f e a t u r e - a c c e s s - g a t e . t e s t . c j s  
 O K   t e s t s / f a z a 3 - e t a p 3 2 b - p l a n - v i s i b i l i t y - c o n t r a c t . t e s t . c j s  
 O K   t e s t s / f a z a 3 - e t a p 3 2 c - a c c e s s - g a t e - r u n t i m e - h o t f i x - v 3 . t e s t . c j s  
 O K   t e s t s / f a z a 3 - e t a p 3 2 d - p l a n - b a s e d - u i - v i s i b i l i t y . t e s t . c j s  
 O K   t e s t s / f a z a 3 - e t a p 3 2 e - s e t t i n g s - d i g e s t - b i l l i n g - v i s i b i l i t y - s m o k e . t e s t . c j s  
 O K   t e s t s / f a z a 3 - e t a p 3 2 g - a i - d r a f t - c a n c e l - s m o k e . t e s t . c j s  
 O K   t e s t s / f a z a 3 - e t a p 3 2 h - l e a d - l i m i t - p l a c e m e n t - h o t f i x . t e s t . c j s  
 O K   t e s t s / f a z a 4 - e t a p 4 1 - d a t a - c o n t r a c t - m a p . t e s t . c j s  
 O K   t e s t s / f a z a 4 - e t a p 4 2 - t a s k - e v e n t - c o n t r a c t - n o r m a l i z a t i o n . t e s t . c j s  
 O K   t e s t s / f a z a 4 - e t a p 4 3 - c r i t i c a l - c r u d - s m o k e . t e s t . c j s  
 O K   t e s t s / f a z a 4 - e t a p 4 4 a - l i v e - r e f r e s h - m u t a t i o n - b u s . t e s t . c j s  
 O K   t e s t s / f a z a 4 - e t a p 4 4 b - t o d a y - l i v e - r e f r e s h - l i s t e n e r . t e s t . c j s  
 O K   t e s t s / f a z a 4 - e t a p 4 4 b - t o d a y - l i v e - r e f r e s h - i m p o r t - h o t f i x . t e s t . c j s  
 O K   t e s t s / f a z a 4 - e t a p 4 4 c - m u t a t i o n - b u s - c o v e r a g e - s m o k e . t e s t . c j s  
 O K   t e s t s / f a z a 5 - e t a p 5 1 - a i - r e a d - v s - d r a f t - i n t e n t . t e s t . c j s  
 O K   t e s t s / h o t f i x - g l o b a l - t a s k - a c t i o n - m o d a l - n o - r o u t e . t e s t . c j s  
 O K   t e s t s / f a z a 3 - e t a p 3 2 f - b a c k e n d - e n t i t y - l i m i t s - s m o k e . t e s t . c j s  
 O K   t e s t s / u i - d e v e l o p e r - c o p y - p a i d - r e a d i n e s s . t e s t . c j s  
 O K   t e s t s / c a s e - d e t a i l - w r i t e - a c c e s s - g a t e - s t a g e 0 2 b . t e s t . c j s  
 O K   t e s t s / l e a d - w r i t e - a c c e s s - g a t e . t e s t . c j s  
 O K   t e s t s / b i l l i n g - a c c e s s - p l a n - n o r m a l i z a t i o n . t e s t . c j s  
 O K   t e s t s / t o d a y - q u i c k - s n o o z e - r e a l - b u t t o n - c l i c k . t e s t . c j s  
 O K   t e s t s / g o o g l e - m o b i l e - l o g i n - w e b v i e w - g u a r d . t e s t . c j s  
 O K   t e s t s / r e l a t i o n - f u n n e l - v a l u e . t e s t . c j s  
 O K   t e s t s / g l o b a l - q u i c k - a c t i o n s - o p e n - m o d a l s . t e s t . c j s  
 O K   t e s t s / a i - d r a f t - i n b o x - f l o w . t e s t . c j s  
 O K   t e s t s / a i - d r a f t - i n b o x - c o m m a n d - c e n t e r . t e s t . c j s  
 O K   t e s t s / g l o b a l - q u i c k - a c t i o n s - s t i c k y - s i n g l e - s o u r c e . t e s t . c j s  
 O K   t e s t s / g l o b a l - q u i c k - a c t i o n s - n o - d u p l i c a t e s . t e s t . c j s  
 O K   t e s t s / g l o b a l - q u i c k - a c t i o n s - t o o l b a r - a 1 1 y . t e s t . c j s  
 O K   t e s t s / a i - u s a g e - l i m i t - g u a r d . t e s t . c j s  
 O K   t e s t s / a i - r e a l - p r o v i d e r - w i r i n g . t e s t . c j s  
 O K   t e s t s / a i - c l o u d f l a r e - p r o v i d e r - w i r i n g . t e s t . c j s  
 O K   t e s t s / a i - a s s i s t a n t - g l o b a l - a p p - s e a r c h . t e s t . c j s  
 O K   t e s t s / a i - a s s i s t a n t - a u t o s p e e c h - a n d - c l e a r - i n p u t . t e s t . c j s  
 O K   t e s t s / a i - a s s i s t a n t - s a v e - v s - s e a r c h - r u l e . t e s t . c j s  
 O K   t e s t s / a i - a s s i s t a n t - a d m i n - a n d - a p p - s c o p e . t e s t . c j s  
 O K   t e s t s / a i - s a f e t y - g a t e s - d i r e c t - w r i t e . t e s t . c j s  
 O K   t e s t s / a i - d i r e c t - w r i t e - r e s p e c t s - m o d e - s t a g e 2 8 . t e s t . c j s  
 O K   t e s t s / t o d a y - a i - d r a f t s - t i l e - s t a g e 2 9 . t e s t . c j s  
 O K   t e s t s / s t a g e 2 9 d - t o d a y - a i - d r a f t s - c o m p a c t - t i l e . t e s t . c j s  
 O K   t e s t s / s u p a b a s e - f i r s t - r e a d i n e s s - s t a g e 1 6 . t e s t . c j s  
 O K   t e s t s / s t a g e 9 4 - a i - l a y e r - s e p a r a t i o n - c o p y . t e s t . c j s  
 O K   t e s t s / s t a g e 7 6 - t o d a y - e v e n t - d o n e - a c t i o n . t e s t . c j s  
 O K   t e s t s / s t a g e 7 7 - l e a d - d e t a i l - s i n g l e - s t a t u s - p i l l . t e s t . c j s  
 O K   t e s t s / s t a g e 7 8 - l e a d - d e t a i l - n o - s t a t i c - a i - f o l l o w u p - c a r d . t e s t . c j s  
  
 C l o s e F l o w   q u i e t   r e l e a s e   g a t e   p a s s e d .  
 
```

## Status git po
### App repo
```text
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
```
### Obsidian
```text
 M .obsidian/graph.json
?? 10_PROJEKTY/CloseFlow_LeadFlow/
?? "CloseFlow - LeadFlow - CaseFlow + AI Operator - ledger decyzji i test\303\263w.md"
```
