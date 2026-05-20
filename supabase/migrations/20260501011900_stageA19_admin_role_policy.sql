-- A19 — Admin role policy for CloseFlow
-- Admin role is owned by Supabase profile data, not by frontend hardcoded e-mails.

alter table if exists public.profiles
  add column if not exists role text not null default 'member';

alter table if exists public.profiles
  add column if not exists is_admin boolean not null default false;

update public.profiles
set role = 'admin'
where coalesce(is_admin, false) = true
  and coalesce(role, 'member') <> 'admin';

update public.profiles
set role = 'member'
where role is null
   or trim(role) = '';

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
      check (role in ('member', 'admin'));
  end if;
exception
  when undefined_table then
    null;
end $$;

create index if not exists profiles_role_idx
  on public.profiles(role);

comment on column public.profiles.role is
  'CloseFlow application role. Admin tools require role = admin and must be verified server-side.';
