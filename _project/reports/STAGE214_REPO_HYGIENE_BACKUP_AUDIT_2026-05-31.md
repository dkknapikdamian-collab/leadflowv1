---
typ: raport_stage
stage: Stage214
status: audit_only
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# Stage214 - Repo hygiene backup audit

STATUS: AUDIT_ONLY
NO_DELETE_EXECUTED
NO_GIT_ADD_DOT

## Cel

Zmapować lokalne nieśledzone backupy, pliki .bak, patche, foldery archiwalne i inne elementy, które nie powinny przypadkiem wejść do repo przez `git add .`.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- poprzedni etap: Stage213C-A/B/C Supabase query budget fixes

## Fakty

- Stage214 nie usuwa plików.
- Stage214 nie przenosi plików.
- Stage214 nie dotyka SQL, RLS, GRANT ani danych Supabase.
- Stage214 tworzy tylko raport, guard i update Obsidiana.
- Zakaz: `git add .`.

## Podsumowanie lokalnego `git status --short`

- total status entries, excluding Stage214 generated files: 115
- untracked entries: 115
- tracked modified entries unrelated to Stage214: 0

| category | count | action now | recommendation |
|---|---:|---|---|
| local_backups_root | 1 | audit only, no delete | Keep outside commits. Consider moving outside repo or adding a narrow ignore rule after manual review. |
| project_backups | 61 | audit only, no delete | Do not commit raw backups. Decide whether selected final reports should be archived; otherwise ignore or move outside repo. |
| project_archive | 1 | audit only, no delete | Review separately. Archive folders may be legitimate, but untracked archive dumps should not be swept into commit. |
| patch_backup | 2 | audit only, no delete | Do not commit emergency patch backups. Keep only if explicitly needed for rollback evidence. |
| bak_files | 50 | audit only, no delete | Do not commit .bak files. Prefer one documented report over scattered backup copies. |

## Zmienione śledzone pliki poza Stage214

Brak wykrytych śledzonych zmian poza Stage214 w momencie audytu.

## Pełna lista według kategorii


### local_backups_root (1)

```text
?? _local_backups/
```


### project_backups (61)

```text
?? _project/backups/stage180_support_requests_local_2026-05-30/
?? _project/backups/stage180c_support_copy_polish_guard_fix_2026-05-30/
?? _project/backups/stage180d_support_guard_scope_fix_2026-05-30/
?? _project/backups/stage180e_support_visible_copy_fix_2026-05-30/
?? _project/backups/stage180f_support_sidebar_header_copy_guard_fix_2026-05-30/
?? _project/backups/stage180g_support_right_rail_cleanup_2026-05-30/
?? _project/backups/stage180h_support_right_rail_force_cleanup_2026-05-30/
?? _project/backups/stage180i_support_dead_copy_cleanup_2026-05-30/
?? _project/backups/stage180j_support_list_copy_final_cleanup_2026-05-30/
?? _project/backups/stage180k_support_admin_rail_2026-05-30/
?? _project/backups/stage180l_support_admin_rail_anchorless_2026-05-30/
?? _project/backups/stage180m_support_remove_top_metrics_2026-05-30/
?? _project/backups/stage180n_billing_remove_notice_plan_border_2026-05-30/
?? _project/backups/stage180o_billing_plan_tone_and_right_rail_icons_2026-05-30/
?? _project/backups/stage180p_billing_plan_tone_right_rail_cleanup_2026-05-30/
?? _project/backups/stage180q_notifications_remove_channels_card_2026-05-30/
?? _project/backups/stage180r_notifications_remove_channels_card_anchorless_2026-05-30/
?? _project/backups/stage180s_notifications_channels_final_guard_2026-05-30/
?? _project/backups/stage180t_notifications_channels_dead_copy_fix_2026-05-30/
?? _project/backups/stage180u_notifications_metrics_width_parity_2026-05-30/
?? _project/backups/stage180v_notifications_metric_width_like_today_2026-05-30/
?? _project/backups/stage180w_notifications_metric_renderer_today_parity_2026-05-30/
?? _project/backups/stage180x_notifications_metric_renderer_cleanup_2026-05-30/
?? _project/backups/stage180z_notifications_metric_renderer_final_cleanup_2026-05-30/
?? _project/backups/stage181a_notifications_metric_dead_copy_hard_cleanup_2026-05-30/
?? _project/backups/stage181c_notifications_renderer_cleanup_final_2026-05-30/
?? _project/backups/stage181d_notifications_renderer_final_guard_2026-05-30/
?? _project/backups/stage211a_secondary_pages_white_canvas_2026-05-30/
?? _project/backups/stage211b_secondary_pages_unified_white_shell_2026-05-30/
?? _project/backups/stage211c_unified_app_canvas_2026-05-30/
?? _project/backups/stage211d_unified_canvas_source_truth_2026-05-30/
?? _project/backups/stage211e_canvas_source_truth_hard_mount_2026-05-30/
?? _project/backups/stage211f_canvas_edge_color_source_truth_2026-05-30/
?? _project/backups/stage211h_canvas_layer_source_truth_no_regex_2026-05-30/
?? _project/backups/stage211j_canvas_runtime_source_truth_backup_safe_2026-05-30/
?? _project/backups/stage211k_canvas_final_source_truth_2026-05-30/
?? _project/backups/stage212a_visual_foundation_reset_2026-05-30/
?? _project/backups/stage212b_visual_foundation_map_and_sidebar_fix_2026-05-31/
?? _project/backups/stage212c_index_css_import_order_build_repair_2026-05-31/
?? _project/backups/stage212d_index_css_import_order_hard_repair_2026-05-31/
?? _project/backups/stage212e_mojibake_import_and_visual_runtime_repair_2026-05-31/
?? _project/backups/stage212f_import_mojibake_visual_foundation_repair_2026-05-31/
?? _project/backups/stage212g_bulk_ui_repair_2026-05-31/
?? _project/backups/stage212h_final_mojibake_sweep_and_build_repair_2026-05-31/
?? _project/backups/stage212i_final_bulk_repair_2026-05-31/
?? _project/backups/stage212j_guard_syntax_and_bulk_finish_2026-05-31/
?? _project/backups/stage212k_hard_mojibake_sweep_20260531_103643/
?? _project/backups/stage212l_layout_tail_comment_repair_20260531_103906/
?? _project/backups/stage212m_visual_source_truth_debug_today_20260531_104642/
?? _project/backups/stage212n_guard_repair_20260531_104744/
?? _project/backups/stage212o_today_visual_source_truth_20260531_105624/
?? _project/backups/stage212p_runtime_force_visual_source_truth_20260531_111146/
?? _project/backups/stage212q_tabs_visual_source_truth_20260531_113044/
?? _project/backups/stage212r_runtime_inline_source_truth_20260531_142540/
?? _project/backups/stage212s_sidebar_today_icon_and_task_filters_20260531_143008/
?? _project/backups/stage212t_polish_and_visual_guards_20260531_143315/
?? _project/backups/stage212u_notifications_metric_width_20260531_143656/
?? _project/backups/stage212v_notifications_width_runtime_repair_20260531_143909/
?? _project/backups/stage212w_guard_bom_repair_20260531_144602/
?? _project/backups/stage212x_notifications_guard_final_20260531_144827/
?? _project/backups/stage212y_today_icon_size_final_20260531_145314/
```


### project_archive (1)

```text
?? _project/archive/STAGE197B_DISABLE_OLD_SIDEBAR_FIT_CONTENT_IMPORT_FIXED/
```


### patch_backup (2)

```text
?? _project/BACKUP_before_restore_remove_stage153_154_20260523_171407.patch
?? _project/BACKUP_before_restore_remove_stage155_20260523_173341.patch
```


### bak_files (50)

```text
?? _project/runs/STAGE179_SETTINGS_FORM_CONTROL_READABILITY_LOCAL_ONLY_2026-05-29.md.stage179.bak
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
?? src/styles/closeflow-green-focus-theme-stage182.css.stage183.replaced.bak
?? src/styles/closeflow-settings-form-control-readability-stage179.css.stage179.bak
?? src/styles/closeflow-theme-runtime-stage181.css.stage182.removed.bak
?? src/styles/visual-stage19-settings-vnext.css.stage180e.bak
?? src/styles/visual-stage19-settings-vnext.css.stage180f.bak
?? src/styles/visual-stage19-settings-vnext.css.stage180g.bak
?? tests/stage179-settings-form-control-readability-contract.test.cjs.stage179.bak
```





## Decyzja operacyjna

Nie commitować lokalnych backupów, plików .bak, folderów _local_backups ani folderów _project/backups bez osobnej decyzji. Stage214 to tylko mapa minowego pola, nie sprzątanie kombajnem.

## Rekomendowany Stage214-B

1. Dodać lub poprawić reguły .gitignore dla typowych lokalnych backupów, ale tylko po sprawdzeniu, że nie ukryją ważnych raportów.
2. Przenieść oczywiste lokalne backupy poza repo, do katalogu lokalnego archiwum, jeżeli Damian potwierdzi.
3. Zostawić w repo tylko dokumentację etapów, guardy i finalne raporty.
4. Nigdy nie używać `git add .` w CloseFlow.

## Testy

- `node scripts/check-stage214-repo-hygiene-audit.cjs`
- `npm run build` jako sanity check po wygenerowaniu raportu
