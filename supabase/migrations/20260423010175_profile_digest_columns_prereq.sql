-- CloseFlow profile digest columns prerequisite for fresh Supabase projects.
-- Purpose: columns read by 20260423010200_profile_workspace_settings_unification.sql.
-- Safe/idempotent.

alter table public.profiles
  add column if not exists daily_digest_email_enabled boolean not null default true,
  add column if not exists daily_digest_hour integer not null default 7,
  add column if not exists timezone text null default 'Europe/Warsaw',
  add column if not exists daily_digest_recipient_email text null;

select 'closeflow_profile_digest_columns_prereq_ready' as status;
