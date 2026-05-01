-- STAGE A19 v2: admin role schema repair
-- Cel:
-- - admin wynika z Supabase profiles.role = 'admin' albo profiles.is_admin = true,
-- - nie z Firebase, localStorage, query param, request body ani hardcoded e-maila w froncie.
--
-- Ten plik jest bezpieczny do ponownego odpalenia.

alter table if exists public.profiles
  add column if not exists role text not null default 'member';

alter table if exists public.profiles
  add column if not exists is_admin boolean not null default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_allowed_values'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_allowed_values
      check (role in ('admin', 'member', 'owner', 'operator'));
  end if;
end $$;

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_is_admin_idx on public.profiles(is_admin);

comment on column public.profiles.role is
  'CloseFlow role. Admin UI and admin-only endpoints use this server-side value.';

comment on column public.profiles.is_admin is
  'Legacy compatibility flag. Prefer role = admin for new admin configuration.';
