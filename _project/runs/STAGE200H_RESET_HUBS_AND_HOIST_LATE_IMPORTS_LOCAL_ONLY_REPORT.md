# STAGE200H_RESET_HUBS_AND_HOIST_LATE_IMPORTS_LOCAL_ONLY_REPORT

## ROUTING

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- mode: local-only, no git add, no commit, no push

## FAKTY

- Stage200G nadal zostawił build error.
- Błąd wynikał z późnych @import po deklaracjach CSS albo uszkodzonych komentarzy importów.
- Stage200H resetuje trzy huby z HEAD:
  - src/index.css
  - src/styles/temporary/temporary-overrides.css
  - src/styles/emergency/emergency-hotfixes.css
- Stage200H wyłącza tylko eliteflow-sidebar-user-footer-below-nav.css.
- Stage200H przenosi późne importy z emergency-hotfixes.css do src/index.css.
- Nie wykonano git add, commita ani pusha.

## WYNIK SKRYPTU

{   "resetFromHead": [     "src/index.css",     "src/styles/temporary/temporary-overrides.css",     "src/styles/emergency/emergency-hotfixes.css"   ],   "disabledFitContentImport": true,   "hoistedFromEmergencyToIndex": [     "./styles/closeflow-metric-tile-visual-source-truth.css",     "./styles/closeflow-operator-metric-tiles.css",     "./styles/closeflow-page-header-card-source-truth.css",     "./styles/closeflow-command-actions-source-truth.css",     "./styles/closeflow-page-header-copy-source-truth.css",     "./styles/closeflow-page-header-action-semantics-packet1.css",     "./styles/closeflow-page-header-stage6-final-lock.css",     "./styles/closeflow-page-header-final-lock.css",     "./styles/closeflow-page-header-structure-lock.css",     "./styles/closeflow-page-header-copy-left-only.css"   ],   "bad": [     "src/index.css:254: late active @import after CSS declarations: @import \"./styles/closeflow-mobile-start-tile-trim.css\";"   ] }

## TESTY

- node scripts/repair-stage200h-reset-hubs-and-hoist-late-imports.cjs
- node scripts/check-stage200-no-legacy-visual-scale.cjs
- npm run build

## GIT STATUS PRZED BUILD

 M .gitignore
 M _project/07_NEXT_STEPS.md
 M _project/08_CHANGELOG_AI.md
 M _project/13_TEST_HISTORY.md
 M package-lock.json
 M src/App.tsx
 M src/components/CloseFlowPageHeaderV2.tsx
 M src/components/GlobalQuickActions.tsx
 M src/components/Layout.tsx
 M src/components/PwaInstallPrompt.tsx
 M src/components/TaskCreateDialog.tsx
 M src/components/operator-rail/TopValueRecordsCard.tsx
 M src/components/topic-contact-picker.tsx
 M src/components/ui-system/PageShell.tsx
 M src/hooks/useWorkspace.ts
 M src/index.css
 M src/lib/appearance.ts
 M src/lib/page-header-content.ts
 M src/pages/Activity.tsx
 M src/pages/AdminAiSettings.tsx
 M src/pages/AiDrafts.tsx
 M src/pages/Billing.tsx
 M src/pages/Calendar.tsx
 M src/pages/Cases.tsx
 M src/pages/Clients.tsx
 M src/pages/Leads.tsx
 M src/pages/NotificationsCenter.tsx
 M src/pages/ResponseTemplates.tsx
 M src/pages/Settings.tsx
 M src/pages/SupportCenter.tsx
 M src/pages/TasksStable.tsx
 M src/pages/Templates.tsx
 M src/pages/Today.tsx
 M src/pages/TodayStable.tsx
 M src/pages/UiPreviewVNext.tsx
 M src/pages/UiPreviewVNextFull.tsx
 M src/styles/closeflow-calendar-selected-day-new-tile-v9.css
 M src/styles/closeflow-right-rail-source-truth.css
 M src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css
 M src/styles/closeflow-vnext-ui-contract.css
 M src/styles/core/core-contracts.css
 M src/styles/design-system/index.css
 M src/styles/emergency/emergency-hotfixes.css
 M src/styles/legacy/legacy-imports.css
 M src/styles/page-adapters/page-adapters.css
 M src/styles/temporary/temporary-overrides.css
 M src/styles/visual-stage19-settings-vnext.css
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage132 PWA install prompt copy cleanup.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage133 Local Admin Preview.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage134 search and leads value card cleanup.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage135 right rail heading source truth.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage136 desktop wide content.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage137 desktop content shell fix.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage138 desktop left anchor content.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage139 unified desktop canvas and right stretch.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage140 unified desktop work width.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage141 shared work width frame.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage142 repair shared work width frame mount.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage143 hard work frame width.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage144 shell content width source truth.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage145 route root width normalization.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage146 fluid work surface.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage147 shell overflow and work surface repair.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage148 scaled desktop shell.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage149 clean desktop app shell canvas.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage150 panel typography and width source truth.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage151 compact cards source truth.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage152 dense cards 80 percent target.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage156 real density tokens no zoom.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage157 viewport zoom 80 source truth.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage158 overlay portal density source truth.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage159 overlay real density and footer fix.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage160 modal center and compact all.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage161 cf modal surface center fix.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage162 cf modal lower smaller source truth.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage163 cf modal main center tall compact.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage164 cf modal top anchor light surface.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage165 modal unified event motif source truth.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage166 modal footer in flow no overlay.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage167 remove quick planning placeholder.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage168 remove sales list label from cards.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage169 topic contact picker readable and task guard.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage170 task dialog relation and field readability.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage171 remove modal helper copy.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage172 global client button and picker icon cleanup.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage173 main search source truth.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage174 main search surface and text normalization.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage175 extend main search source truth secondary pages.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage176 TopValueRecordsCard duplicate import hotfix.md"
?? "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-24 - CloseFlow Stage177 leads clients list layout source truth.md"
?? _local_backups/
?? _project/BACKUP_before_restore_remove_stage153_154_20260523_171407.patch
?? _project/BACKUP_before_restore_remove_stage155_20260523_173341.patch
?? _project/STAGE132_PWA_INSTALL_COPY_CLEANUP_REPORT.md
?? _project/STAGE133_LOCAL_ADMIN_PREVIEW_REPORT.md
?? _project/STAGE134_SEARCH_AND_LEADS_VALUE_CARD_CLEANUP_REPORT.md
?? _project/STAGE135_RIGHT_RAIL_HEADING_SOURCE_TRUTH_REPORT.md
?? _project/STAGE136_DESKTOP_WIDE_CONTENT_REPORT.md
?? _project/STAGE137_DESKTOP_CONTENT_SHELL_FIX_REPORT.md
?? _project/STAGE138_DESKTOP_LEFT_ANCHOR_CONTENT_REPORT.md
?? _project/STAGE139_UNIFIED_DESKTOP_CANVAS_AND_RIGHT_STRETCH_REPORT.md
?? _project/STAGE140_UNIFIED_DESKTOP_WORK_WIDTH_REPORT.md
?? _project/STAGE141_SHARED_WORK_WIDTH_FRAME_REPORT.md
?? _project/STAGE142_REPAIR_SHARED_WORK_WIDTH_FRAME_MOUNT_REPORT.md
?? _project/STAGE143_HARD_WORK_FRAME_WIDTH_REPORT.md
?? _project/STAGE144_SHELL_CONTENT_WIDTH_SOURCE_TRUTH_REPORT.md
?? _project/STAGE145_FORENSIC_WIDTH_AUDIT_LOCAL.txt
?? _project/STAGE145_ROUTE_ROOT_WIDTH_NORMALIZATION_REPORT.md
?? _project/STAGE146_FLUID_WORK_SURFACE_REPORT.md
?? _project/STAGE147_SHELL_OVERFLOW_AND_WORK_SURFACE_REPAIR_REPORT.md
?? _project/STAGE148_PRE_AUDIT_SHELL_CLIPPING_LOCAL.txt
?? _project/STAGE148_SCALED_DESKTOP_SHELL_REPORT.md
?? _project/STAGE149_CLEAN_DESKTOP_APP_SHELL_CANVAS_REPORT.md
?? _project/STAGE150_PANEL_TYPOGRAPHY_AND_WIDTH_SOURCE_TRUTH_REPORT.md
?? _project/STAGE151_COMPACT_CARDS_SOURCE_TRUTH_REPORT.md
?? _project/STAGE152_DENSE_CARDS_80_PERCENT_TARGET_REPORT.md
?? _project/STAGE156_REAL_DENSITY_TOKENS_NO_ZOOM_REPORT.md
?? _project/STAGE157_VIEWPORT_ZOOM_80_SOURCE_TRUTH_REPORT.md
?? _project/STAGE158_OVERLAY_PORTAL_DENSITY_SOURCE_TRUTH_REPORT.md
?? _project/STAGE159_OVERLAY_REAL_DENSITY_AND_FOOTER_FIX_REPORT.md
?? _project/STAGE160_MODAL_CENTER_AND_COMPACT_ALL_REPORT.md
?? _project/STAGE161_CF_MODAL_SURFACE_CENTER_FIX_REPORT.md
?? _project/STAGE162_CF_MODAL_SURFACE_LOWER_SMALLER_SOURCE_TRUTH_REPORT.md
?? _project/STAGE163_CF_MODAL_MAIN_CENTER_TALL_COMPACT_REPORT.md
?? _project/STAGE164_CF_MODAL_TOP_ANCHOR_LIGHT_SURFACE_REPORT.md
?? _project/STAGE165_MODAL_UNIFIED_EVENT_MOTIF_SOURCE_TRUTH_REPORT.md
?? _project/STAGE166_MODAL_FOOTER_IN_FLOW_NO_OVERLAY_REPORT.md
?? _project/STAGE167_REMOVE_QUICK_PLANNING_PLACEHOLDER_REPORT.md
?? _project/STAGE168_REMOVE_SALES_LIST_LABEL_FROM_CARDS_REPORT.md
?? _project/STAGE168_TOUCHED_FILES.txt
?? _project/STAGE169_TOPIC_CONTACT_PICKER_READABLE_AND_TASK_GUARD_REPORT.md
?? _project/STAGE170_TASK_DIALOG_RELATION_AND_FIELD_READABILITY_REPORT.md
?? _project/STAGE171_REMOVE_MODAL_HELPER_COPY_REPORT.md
?? _project/STAGE171_TOUCHED_FILES.txt
?? _project/STAGE172_GLOBAL_CLIENT_BUTTON_PICKER_ICON_CLEANUP_REPORT.md
?? _project/STAGE173_MAIN_SEARCH_SOURCE_TRUTH_REPORT.md
?? _project/STAGE173_MAIN_SEARCH_TOUCHED_FILES.txt
?? _project/STAGE174_MAIN_SEARCH_SURFACE_AND_TEXT_NORMALIZATION_REPORT.md
?? _project/STAGE175_EXTEND_MAIN_SEARCH_SOURCE_TRUTH_SECONDARY_PAGES_REPORT.md
?? _project/STAGE175_SEARCH_SOURCE_TOUCHED_FILES.txt
?? _project/STAGE176_TOP_VALUE_RECORDS_CARD_DUPLICATE_IMPORT_HOTFIX_REPORT.md
?? _project/STAGE177_LEADS_CLIENTS_LIST_LAYOUT_SOURCE_TRUTH_REPORT.md
?? _project/archive/
?? _project/restore_remove_stage155.cjs
?? _project/runs/STAGE179_SETTINGS_FORM_CONTROL_READABILITY_LOCAL_ONLY_2026-05-29.md
?? _project/runs/STAGE179_SETTINGS_FORM_CONTROL_READABILITY_LOCAL_ONLY_2026-05-29.md.stage179.bak
?? _project/runs/STAGE182_GREEN_FOCUS_THEME_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE183_FOREST_NAVY_THEME_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE184_FOREST_NAVY_DARK_SETTINGS_HARDENING_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE185_FOREST_NAVY_READABLE_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE186_THEME_ROLLBACK_DISABLE_SWITCH_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE187B_HIDE_APP_PREFERENCES_SECTION_FIX_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE187_HIDE_APP_PREFERENCES_SECTION_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE188_SIDEBAR_FULL_HEIGHT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE189_SIDEBAR_LEFT_RAIL_FULL_VIEWPORT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE190B_SIDEBAR_REAL_PANEL_FULL_HEIGHT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE191_SIDEBAR_HEIGHT_ONLY_KEEP_WIDTH_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE192_SIDEBAR_FIT_HEIGHT_NO_SCROLL_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE193_SIDEBAR_SOURCE_AND_RENDER_AUDIT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE194_SIDEBAR_LAYOUT_CONTRACT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE195_SIDEBAR_INLINE_LAYOUT_CONTRACT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE196A_SIDEBAR_DEEP_AUDIT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE196_SIDEBAR_FIXED_VIEWPORT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE197B_DISABLE_OLD_SIDEBAR_FIT_CONTENT_IMPORT_FIXED_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE197_DISABLE_OLD_SIDEBAR_FIT_CONTENT_IMPORT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE198A_GLOBAL_SCALE_DENSITY_AUDIT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE198B_DISABLE_GLOBAL_DESKTOP_DENSITY_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE199A_SIDEBAR_DEEP_VISUAL_STACK_AUDIT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE199C_SIDEBAR_SCALE_AND_OLD_VISUAL_LAYERS_AUDIT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE200B_REPAIR_MALFORMED_CSS_IMPORT_COMMENT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE200C_REPAIR_INDEX_CSS_BROKEN_IMPORT_COMMENTS_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE200D_REPAIR_ALL_CSS_MALFORMED_IMPORT_COMMENTS_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE200E_HARD_REPAIR_INDEX_CSS_IMPORT_LINES_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE200F_RESTORE_CSS_HUBS_AND_DISABLE_ONLY_SIDEBAR_FIT_CONTENT_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE200G_HOIST_LATE_EMERGENCY_IMPORTS_LOCAL_ONLY_REPORT.md
?? _project/runs/STAGE200_REMOVE_LEGACY_80_ZOOM_AND_SIDEBAR_FIT_CONTENT_LOCAL_ONLY_REPORT.md
?? docs/ui/CLOSEFLOW_STAGE145_RUNTIME_WIDTH_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE146_RUNTIME_WIDTH_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE147_RUNTIME_WIDTH_AND_CLIPPING_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE148_RUNTIME_SCALED_DESKTOP_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE149_RUNTIME_APP_SHELL_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE150_PANEL_VISUAL_SOURCE_TRUTH.md
?? docs/ui/CLOSEFLOW_STAGE151_COMPACT_CARDS_SOURCE_TRUTH.md
?? docs/ui/CLOSEFLOW_STAGE152_DENSE_CARDS_80_PERCENT_TARGET.md
?? docs/ui/CLOSEFLOW_STAGE156_REAL_DENSITY_TOKENS_NO_ZOOM.md
?? docs/ui/CLOSEFLOW_STAGE156_RUNTIME_DENSITY_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE157_RUNTIME_VIEWPORT_ZOOM_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE157_VIEWPORT_ZOOM_80_SOURCE_TRUTH.md
?? docs/ui/CLOSEFLOW_STAGE158_OVERLAY_PORTAL_DENSITY_SOURCE_TRUTH.md
?? docs/ui/CLOSEFLOW_STAGE158_RUNTIME_OVERLAY_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE159_OVERLAY_REAL_DENSITY_AND_FOOTER_FIX.md
?? docs/ui/CLOSEFLOW_STAGE159_RUNTIME_OVERLAY_FOOTER_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE160_MODAL_CENTER_AND_COMPACT_ALL.md
?? docs/ui/CLOSEFLOW_STAGE160_RUNTIME_MODAL_CENTER_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE161_CF_MODAL_SURFACE_CENTER_FIX.md
?? docs/ui/CLOSEFLOW_STAGE161_RUNTIME_CF_MODAL_SURFACE_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE162_CF_MODAL_SURFACE_LOWER_SMALLER_SOURCE_TRUTH.md
?? docs/ui/CLOSEFLOW_STAGE162_RUNTIME_CF_MODAL_SURFACE_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE163_CF_MODAL_MAIN_CENTER_TALL_COMPACT.md
?? docs/ui/CLOSEFLOW_STAGE163_RUNTIME_CF_MODAL_SURFACE_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE164_CF_MODAL_TOP_ANCHOR_LIGHT_SURFACE.md
?? docs/ui/CLOSEFLOW_STAGE164_RUNTIME_CF_MODAL_SURFACE_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE165_MODAL_UNIFIED_EVENT_MOTIF_SOURCE_TRUTH.md
?? docs/ui/CLOSEFLOW_STAGE165_RUNTIME_MODAL_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE166_MODAL_FOOTER_IN_FLOW_NO_OVERLAY.md
?? docs/ui/CLOSEFLOW_STAGE166_RUNTIME_MODAL_FOOTER_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE167_REMOVE_QUICK_PLANNING_PLACEHOLDER.md
?? docs/ui/CLOSEFLOW_STAGE168_REMOVE_SALES_LIST_LABEL_FROM_CARDS.md
?? docs/ui/CLOSEFLOW_STAGE169_RUNTIME_TOPIC_CONTACT_PICKER_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE169_TOPIC_CONTACT_PICKER_READABLE_AND_TASK_GUARD.md
?? docs/ui/CLOSEFLOW_STAGE170_RUNTIME_TASK_DIALOG_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE170_TASK_DIALOG_RELATION_AND_FIELD_READABILITY.md
?? docs/ui/CLOSEFLOW_STAGE171_REMOVE_MODAL_HELPER_COPY.md
?? docs/ui/CLOSEFLOW_STAGE171_RUNTIME_MODAL_HELPER_COPY_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE172_GLOBAL_CLIENT_BUTTON_PICKER_ICON_CLEANUP.md
?? docs/ui/CLOSEFLOW_STAGE172_RUNTIME_GLOBAL_CLIENT_AND_PICKER_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE173_MAIN_SEARCH_SOURCE_TRUTH.md
?? docs/ui/CLOSEFLOW_STAGE173_RUNTIME_MAIN_SEARCH_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE174_MAIN_SEARCH_SURFACE_AND_TEXT_NORMALIZATION.md
?? docs/ui/CLOSEFLOW_STAGE174_RUNTIME_MAIN_SEARCH_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE175_EXTEND_MAIN_SEARCH_SOURCE_TRUTH_SECONDARY_PAGES.md
?? docs/ui/CLOSEFLOW_STAGE175_RUNTIME_SECONDARY_SEARCH_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE176_TOP_VALUE_RECORDS_CARD_DUPLICATE_IMPORT_HOTFIX.md
?? docs/ui/CLOSEFLOW_STAGE177_LEADS_CLIENTS_LIST_LAYOUT_SOURCE_TRUTH.md
?? docs/ui/CLOSEFLOW_STAGE177_RUNTIME_LEADS_CLIENTS_LAYOUT_AUDIT.js
?? docs/ui/CLOSEFLOW_STAGE178_RUNTIME_TASKS_LAYOUT_AUDIT.js
?? scripts/apply-stage146-fluid-work-surface.cjs
?? scripts/apply-stage147-shell-overflow-work-surface.cjs
?? scripts/apply-stage148-scaled-desktop-shell.cjs
?? scripts/apply-stage149-clean-desktop-app-shell-canvas.cjs
?? scripts/apply-stage150-panel-typography-source-truth.cjs
?? scripts/apply-stage151-compact-cards-source-truth.cjs
?? scripts/apply-stage152-dense-cards-80-percent-target.cjs
?? scripts/apply-stage156-real-density-tokens-no-zoom.cjs
?? scripts/apply-stage157-viewport-zoom-80.cjs
?? scripts/apply-stage158-overlay-portal-density.cjs
?? scripts/apply-stage159-overlay-real-density-and-footer.cjs
?? scripts/apply-stage160-modal-center-and-compact-all.cjs
?? scripts/apply-stage161-cf-modal-surface-center-fix.cjs
?? scripts/apply-stage162-cf-modal-surface-lower-smaller.cjs
?? scripts/apply-stage163-cf-modal-main-center-tall-compact.cjs
?? scripts/apply-stage164-cf-modal-top-anchor-light-surface.cjs
?? scripts/apply-stage165-modal-unified-event-motif.cjs
?? scripts/apply-stage166-modal-footer-in-flow-no-overlay.cjs
?? scripts/apply-stage167-remove-quick-planning-placeholder.cjs
?? scripts/apply-stage168-remove-sales-list-label-from-cards.cjs
?? scripts/apply-stage169-topic-contact-picker-readable.cjs
?? scripts/apply-stage170-task-dialog-relation-and-field-readability.cjs
?? scripts/apply-stage171-remove-modal-helper-copy.cjs
?? scripts/apply-stage172-global-client-button-picker-icon-cleanup.cjs
?? scripts/apply-stage173-main-search-source-truth.cjs
?? scripts/apply-stage174-main-search-surface-and-text-normalization.cjs
?? scripts/apply-stage175-extend-main-search-source-truth-secondary-pages.cjs
?? scripts/apply-stage176-top-value-records-card-duplicate-import-hotfix.cjs
?? scripts/apply-stage177-leads-clients-list-layout-source-truth.cjs
?? scripts/check-stage132-pwa-install-copy-cleanup.cjs
?? scripts/check-stage133-local-admin-preview.cjs
?? scripts/check-stage134-search-and-value-card.cjs
?? scripts/check-stage135-right-rail-heading-source-truth.cjs
?? scripts/check-stage136-desktop-wide-content.cjs
?? scripts/check-stage137-desktop-content-shell.cjs
?? scripts/check-stage138-desktop-left-anchor-content.cjs
?? scripts/check-stage139-unified-desktop-canvas.cjs
?? scripts/check-stage140-unified-desktop-work-width.cjs
?? scripts/check-stage141-shared-work-width-frame.cjs
?? scripts/check-stage142-repair-shared-work-width-frame-mount.cjs
?? scripts/check-stage143-hard-work-frame-width.cjs
?? scripts/check-stage144-shell-content-width-source-truth.cjs
?? scripts/check-stage145-route-root-width-normalization.cjs
?? scripts/check-stage146-fluid-work-surface.cjs
?? scripts/check-stage147-shell-overflow-work-surface.cjs
?? scripts/check-stage148-scaled-desktop-shell.cjs
?? scripts/check-stage149-clean-desktop-app-shell-canvas.cjs
?? scripts/check-stage150-panel-typography-and-width-source-truth.cjs
?? scripts/check-stage151-compact-cards-source-truth.cjs
?? scripts/check-stage152-dense-cards-80-percent-target.cjs
?? scripts/check-stage156-real-density-tokens-no-zoom.cjs
?? scripts/check-stage157-viewport-zoom-80.cjs
?? scripts/check-stage158-overlay-portal-density.cjs
?? scripts/check-stage159-overlay-real-density-and-footer.cjs
?? scripts/check-stage160-modal-center-and-compact-all.cjs
?? scripts/check-stage161-cf-modal-surface-center-fix.cjs
?? scripts/check-stage162-cf-modal-surface-lower-smaller.cjs
?? scripts/check-stage163-cf-modal-main-center-tall-compact.cjs
?? scripts/check-stage164-cf-modal-top-anchor-light-surface.cjs
?? scripts/check-stage165-modal-unified-event-motif.cjs
?? scripts/check-stage166-modal-footer-in-flow-no-overlay.cjs
?? scripts/check-stage167-remove-quick-planning-placeholder.cjs
?? scripts/check-stage168-remove-sales-list-label-from-cards.cjs
?? scripts/check-stage169-topic-contact-picker-readable.cjs
?? scripts/check-stage170-task-dialog-relation-and-field-readability.cjs
?? scripts/check-stage171-remove-modal-helper-copy.cjs
?? scripts/check-stage172-global-client-button-picker-icon-cleanup.cjs
?? scripts/check-stage173-main-search-source-truth.cjs
?? scripts/check-stage174-main-search-surface-and-text-normalization.cjs
?? scripts/check-stage175-extend-main-search-source-truth-secondary-pages.cjs
?? scripts/check-stage176-top-value-records-card-duplicate-import-hotfix.cjs
?? scripts/check-stage177-leads-clients-list-layout-source-truth.cjs
?? scripts/check-stage181c-mobile-simple-filters-source-truth-local.cjs
?? scripts/check-stage181e-top-value-spacing-local.cjs
?? scripts/check-stage200-no-legacy-visual-scale.cjs
?? scripts/local-fix-calendar-duplicate-declaration.cjs
?? scripts/local-fix-stage181aa-admin-ai-settings-runtime-guard.cjs
?? scripts/local-fix-stage181ab-settings-duplicate-declaration.cjs
?? scripts/local-fix-stage181d-top-value-cards-source-truth.cjs
?? scripts/local-fix-stage181f-tasks-urgent-title-trash-icon.cjs
?? scripts/local-fix-stage181g-tasks-custom-urgent-tooltip.cjs
?? scripts/local-fix-stage181j-calendar-local-done-state.cjs
?? scripts/local-fix-stage181j-v2-calendar-local-done-state.cjs
?? scripts/local-fix-stage181k-calendar-month-tooltip-clean.cjs
?? scripts/local-fix-stage181l-template-modal-visual-source.cjs
?? scripts/local-fix-stage181m-template-modal-light.cjs
?? scripts/local-fix-stage181n-template-modal-rebuild.cjs
?? scripts/local-fix-stage181o-template-type-other.cjs
?? scripts/local-fix-stage181p-remove-templates-badge.cjs
?? scripts/local-fix-stage181q-response-template-modal-spacing.cjs
?? scripts/local-fix-stage181r-response-template-modal-lead-style.cjs
?? scripts/local-fix-stage181s-response-template-cancel-visible.cjs
?? scripts/local-fix-stage181t-activity-duplicate-declaration.cjs
?? scripts/local-fix-stage181u-activity-visual-taxonomy.cjs
?? scripts/local-fix-stage181v-activity-rail-force-colors.cjs
?? scripts/local-fix-stage181w-ai-drafts-rail-colors.cjs
?? scripts/local-fix-stage181x-notifications-rail-colors.cjs
?? scripts/local-fix-stage181y-notifications-remove-help-card.cjs
?? scripts/local-fix-stage181z-billing-visual-taxonomy.cjs
?? scripts/local-seed-stage181h-calendar-dev-preview.cjs
?? scripts/local-seed-stage181i-calendar-direct.cjs
?? scripts/repair-stage200d-all-css-import-comments.cjs
?? scripts/repair-stage200e-index-css-import-lines.cjs
?? scripts/repair-stage200g-hoist-late-emergency-imports.cjs
?? scripts/repair-stage200h-reset-hubs-and-hoist-late-imports.cjs
?? src/App.tsx.stage185.bak
?? src/App.tsx.stage186.before-rollback.bak
?? src/App.tsx.stage190b.bak
?? src/App.tsx.stage191.bak
?? src/App.tsx.stage192.bak
?? src/App.tsx.stage194.bak
?? src/App.tsx.stage195.bak
?? src/App.tsx.stage196.bak
?? src/App.tsx.stage197.bak
?? src/App.tsx.stage197b.bak
?? src/App.tsx.stage198b.bak
?? src/components/ClientCreateDialog.tsx
?? src/components/Layout.tsx.stage184.bak
?? src/components/Layout.tsx.stage186.before-rollback.bak
?? src/components/Layout.tsx.stage188.bak
?? src/components/Layout.tsx.stage189.bak
?? src/components/Layout.tsx.stage190b.bak
?? src/components/Layout.tsx.stage191.bak
?? src/components/Layout.tsx.stage192.bak
?? src/components/Layout.tsx.stage194.bak
?? src/components/Layout.tsx.stage195.bak
?? src/components/Layout.tsx.stage197.bak
?? src/components/Layout.tsx.stage197b.bak
?? src/components/Layout.tsx.stage198b.bak
?? src/components/ShellDesktopViewportRuntime.tsx
?? src/index.css.stage181.bak
?? src/index.css.stage182.bak
?? src/index.css.stage183.bak
?? src/index.css.stage186.before-rollback.bak
?? src/lib/appearance.ts.stage181.bak
?? src/lib/appearance.ts.stage182.bak
?? src/lib/appearance.ts.stage183.bak
?? src/lib/appearance.ts.stage185.bak
?? src/lib/appearance.ts.stage186.before-rollback.bak
?? src/pages/Settings.tsx.stage179.bak
?? src/pages/Settings.tsx.stage180.bak
?? src/pages/Settings.tsx.stage180c.bak
?? src/pages/Settings.tsx.stage180d.bak
?? src/pages/Settings.tsx.stage180e.bak
?? src/pages/Settings.tsx.stage180f.bak
?? src/pages/Settings.tsx.stage184.bak
?? src/pages/Settings.tsx.stage186.before-rollback.bak
?? src/pages/Settings.tsx.stage187-hide-preferences-section.bak
?? src/pages/Settings.tsx.stage187b-before-fix.bak
?? src/styles/closeflow-activity-rail-force-colors-stage181v.css
?? src/styles/closeflow-activity-visual-source-truth-stage181u.css
?? src/styles/closeflow-ai-drafts-rail-force-colors-stage181w.css
?? src/styles/closeflow-billing-visual-taxonomy-stage181z.css
?? src/styles/closeflow-cf-modal-main-center-tall-compact-stage163.css
?? src/styles/closeflow-cf-modal-surface-center-fix-stage161.css
?? src/styles/closeflow-cf-modal-surface-lower-smaller-stage162.css
?? src/styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css
?? src/styles/closeflow-clean-desktop-app-shell-canvas-stage149.css
?? src/styles/closeflow-compact-cards-source-truth-stage151.css
?? src/styles/closeflow-dense-cards-80-percent-target-stage152.css
?? src/styles/closeflow-desktop-content-shell-stage137.css
?? src/styles/closeflow-desktop-left-anchor-content-stage138.css
?? src/styles/closeflow-desktop-wide-content-stage136.css
?? src/styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css
?? src/styles/closeflow-fluid-work-surface-stage146.css
?? src/styles/closeflow-global-client-create-dialog-stage172.css
?? src/styles/closeflow-green-focus-theme-stage182.css.stage183.replaced.bak
?? src/styles/closeflow-hard-work-frame-width-stage143.css
?? src/styles/closeflow-leads-clients-list-layout-source-truth-stage177.css
?? src/styles/closeflow-main-search-source-truth-stage173.css
?? src/styles/closeflow-main-search-surface-and-text-normalization-stage174.css
?? src/styles/closeflow-modal-center-and-compact-all-stage160.css
?? src/styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css
?? src/styles/closeflow-modal-unified-event-motif-source-truth-stage165.css
?? src/styles/closeflow-notifications-conflict-card-stage181aj.css
?? src/styles/closeflow-notifications-rail-force-colors-stage181x.css
?? src/styles/closeflow-overlay-portal-density-stage158.css
?? src/styles/closeflow-overlay-real-density-and-footer-stage159.css
?? src/styles/closeflow-panel-typography-and-width-source-truth-stage150.css
?? src/styles/closeflow-real-density-tokens-no-zoom-stage156.css
?? src/styles/closeflow-remove-modal-helper-copy-stage171.css
?? src/styles/closeflow-repair-shared-work-width-frame-stage142.css
?? src/styles/closeflow-response-template-modal-source-truth-stage181r.css
?? src/styles/closeflow-right-rail-heading-source-truth-stage135.css
?? src/styles/closeflow-route-root-width-normalization-stage145.css
?? src/styles/closeflow-scaled-desktop-shell-stage148.css
?? src/styles/closeflow-search-source-truth-stage134.css
?? src/styles/closeflow-secondary-pages-full-width-stage181ad.css
?? src/styles/closeflow-settings-form-control-readability-stage179.css
?? src/styles/closeflow-settings-form-control-readability-stage179.css.stage179.bak
?? src/styles/closeflow-settings-profile-readability-stage181af.css
?? src/styles/closeflow-settings-safe-copy-cleanup-stage181ai.css
?? src/styles/closeflow-settings-summary-right-rail-stage181ae.css
?? src/styles/closeflow-settings-tabs-stage181ac.css
?? src/styles/closeflow-shared-work-width-frame-stage141.css
?? src/styles/closeflow-shell-content-width-source-truth-stage144.css
?? src/styles/closeflow-shell-overflow-work-surface-stage147.css
?? src/styles/closeflow-task-dialog-relation-and-field-readability-stage170.css
?? src/styles/closeflow-template-modal-source-truth-stage181l.css
?? src/styles/closeflow-template-modal-source-truth-stage181n.css
?? src/styles/closeflow-theme-runtime-stage181.css.stage182.removed.bak
?? src/styles/closeflow-topic-contact-picker-readable-stage169.css
?? src/styles/closeflow-unified-desktop-canvas-stage139.css
?? src/styles/closeflow-unified-desktop-work-width-stage140.css
?? src/styles/closeflow-viewport-zoom-80-source-truth-stage157.css
?? src/styles/visual-stage19-settings-vnext.css.stage180e.bak
?? src/styles/visual-stage19-settings-vnext.css.stage180f.bak
?? src/styles/visual-stage19-settings-vnext.css.stage180g.bak
?? tests/stage179-settings-form-control-readability-contract.test.cjs
?? tests/stage179-settings-form-control-readability-contract.test.cjs.stage179.bak


## NASTĘPNY KROK

- Jeżeli build przejdzie, uruchomić npm run dev.
- Sprawdzić / i /tasks.
- Jeżeli sidebar dalej będzie proporcji 0.8, wykonać runtime matched CSS rules.
