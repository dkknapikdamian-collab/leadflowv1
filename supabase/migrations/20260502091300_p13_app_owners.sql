-- P13 App owner identity hardening
-- Production source of truth for global app owner/developer access.
-- Apply in Supabase SQL editor or migration pipeline.

create table if not exists public.app_owners (
  id uuid primary key default gen_random_uuid(),
  auth_uid text,
  user_id uuid,
  profile_id uuid,
  email text,
  role text not null default 'developer' check (role in ('owner', 'developer', 'creator')),
  status text not null default 'active' check (status in ('active', 'revoked')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz
);

create unique index if not exists app_owners_active_auth_uid_idx
  on public.app_owners (auth_uid)
  where auth_uid is not null and status = 'active';

create unique index if not exists app_owners_active_user_id_idx
  on public.app_owners (user_id)
  where user_id is not null and status = 'active';

create unique index if not exists app_owners_active_profile_id_idx
  on public.app_owners (profile_id)
  where profile_id is not null and status = 'active';

create unique index if not exists app_owners_active_email_idx
  on public.app_owners (lower(email))
  where email is not null and status = 'active';

alter table public.app_owners enable row level security;

drop policy if exists app_owners_no_client_select on public.app_owners;
drop policy if exists app_owners_no_client_insert on public.app_owners;
drop policy if exists app_owners_no_client_update on public.app_owners;
drop policy if exists app_owners_no_client_delete on public.app_owners;

create policy app_owners_no_client_select on public.app_owners
  for select
  using (false);

create policy app_owners_no_client_insert on public.app_owners
  for insert
  with check (false);

create policy app_owners_no_client_update on public.app_owners
  for update
  using (false)
  with check (false);

create policy app_owners_no_client_delete on public.app_owners
  for delete
  using (false);

-- Example production grant:
-- insert into public.app_owners (auth_uid, email, role, status, note)
-- values ('YOUR_SUPABASE_AUTH_UID', 'you@example.com', 'owner', 'active', 'initial app owner')
-- on conflict do nothing;

-- Revoke:
-- update public.app_owners
-- set status = 'revoked', revoked_at = now(), updated_at = now()
-- where auth_uid = 'YOUR_SUPABASE_AUTH_UID' and status = 'active';
