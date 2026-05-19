# CloseFlow Supabase Private SQL Snippets - classification

Source folder: C:\Users\malim\Desktop\biznesy_ai\2.closeflow\supabase\rescue\snippets\20260519_192150\downloaded_sql_v2

| File | Length | Class | Run policy |
|---|---:|---|---|
| 2026-04-24_1ee8e6ec_Workspace_Schema_Repair_and_Seed_from_Auth_Users.sql | 758 | DIAGNOSTIC_SELECT_ONLY | READ_ONLY_OK_WITH_REVIEW |
| 2026-04-24_2e4dc0ce_Fetch_Foreign_Key_Constraint_Definition.sql | 310 | DIAGNOSTIC_SELECT_ONLY | READ_ONLY_OK_WITH_REVIEW |
| 2026-04-24_437cfbd0_Normalize_next_action_title_defaults.sql | 179 | SCHEMA_MIGRATION_CANDIDATE | REVIEW_BEFORE_RESTORE |
| 2026-04-26_d56256f9_Fetch_Recent_Workspace_Subscriptions.sql | 223 | DATA_SPECIFIC_WORKSPACE_FIX | DO_NOT_RUN_ON_NEW_PROJECT |
| 2026-04-27_62f463bd_AI_Drafts_per_Workspace_Storage.sql | 5567 | SCHEMA_MIGRATION_CANDIDATE | REVIEW_BEFORE_RESTORE |
| 2026-04-28_49ec78db_AI_Drafts_Table_Setup__Stage_19_.sql | 1716 | SCHEMA_MIGRATION_CANDIDATE | REVIEW_BEFORE_RESTORE |
| 2026-04-29_540446f7_Dostosowanie_typ__w_i_dodanie_p__l_w_work_items.sql | 1716 | SCHEMA_MIGRATION_CANDIDATE | REVIEW_BEFORE_RESTORE |
| 2026-05-01_b5adadc6_Bootstrap_profili_i_workspace_po_rejestracji_auth.sql | 19085 | SCHEMA_MIGRATION_CANDIDATE | REVIEW_BEFORE_RESTORE |
| 2026-05-03_ea73f39a_Google_Calendar_Sync_Foundation_Storage.sql | 1192 | NOT_SQL_POWERSHELL_SNIPPET | DO_NOT_RUN |
| 2026-05-19_e2c2a603_Untitled_query.sql | 1192 | NOT_SQL_POWERSHELL_SNIPPET | DO_NOT_RUN |

## Notes
- Secret scan matched SQL role name service_role, not a secret key.
- Files classified as NOT_SQL_POWERSHELL_SNIPPET must not be run in Supabase SQL Editor.
- DATA_SPECIFIC_WORKSPACE_FIX must not be run on a new project without rewriting IDs.
- SCHEMA_MIGRATION_CANDIDATE still requires comparison against repo migrations and remote schema dump.
