alter table public.access_status
  add column if not exists grace_period_end timestamptz,
  add column if not exists manual_override_mode text not null default 'none' check (manual_override_mode in ('none', 'allow', 'block')),
  add column if not exists manual_override_until timestamptz,
  add column if not exists manual_override_reason text;

create index if not exists idx_access_status_grace_period_end
  on public.access_status (grace_period_end)
  where grace_period_end is not null;

create index if not exists idx_access_status_manual_override_until
  on public.access_status (manual_override_until)
  where manual_override_until is not null;

drop policy if exists "access_status_update_own" on public.access_status;
