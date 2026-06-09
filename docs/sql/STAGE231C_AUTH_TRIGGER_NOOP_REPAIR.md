
# STAGE231C — Supabase Auth trigger no-op repair

Status: EXECUTED MANUALLY IN SUPABASE SQL EDITOR / VERIFIED BY OWNER SCREENSHOTS

Reason:
- Supabase email/password signup returned: Database error saving new user.
- Diagnostics showed two custom AFTER INSERT triggers on auth.users:
  - closeflow_bootstrap_user_after_auth_insert -> public.closeflow_bootstrap_user
  - on_auth_user_created_closeflow -> public.closeflow_handle_new_auth_user
- Disabling the auth.users trigger directly failed with: must be owner of table users.
- The repair changed both trigger functions to no-op functions returning NEW, keeping the triggers present but preventing database bootstrap failure.

Applied SQL marker:
- STAGE231C_R7_NOOP_ALL_AUTH_USERS_BOOTSTRAP_TRIGGERS

Product decision:
- Auth trigger functions no longer create application profile/workspace.
- CloseFlow application bootstrap is handled by api/me after the authenticated user enters the app.
- Email/password signup may still require Supabase email confirmation before full application access.
- Google e-mail is treated as verified by Google; no second e-mail confirmation is planned.

Rollback note:
- Original function definitions were backed up to public.closeflow_auth_function_backups before no-op replacement.
