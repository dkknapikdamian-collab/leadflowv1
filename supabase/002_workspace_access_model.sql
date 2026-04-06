create extension if not exists pgcrypto;

alter table public.profiles
  add column if not exists timezone text not null default 'Europe/Warsaw',
  add column if not exists is_email_verified boolean not null default false,
  add column if not exists signup_source text not null default 'unknown',
  add column if not exists invited_by_user_id uuid references auth.users(id) on delete set null;

alter table public.profiles
  alter column signup_source set default 'unknown';

create table if not exists public.access_status (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  access_status text not null default 'trial_active' check (access_status in ('trial_active', 'trial_expired', 'paid_active', 'payment_failed', 'canceled')),
  trial_start timestamptz not null default now(),
  trial_end timestamptz not null default (now() + interval '7 days'),
  paid_until timestamptz,
  billing_customer_id text,
  billing_subscription_id text,
  plan_name text not null default 'Solo',
  trial_used boolean not null default true,
  signup_source text not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.access_status (
  workspace_id,
  user_id,
  access_status,
  trial_start,
  trial_end,
  paid_until,
  billing_customer_id,
  billing_subscription_id,
  plan_name,
  trial_used,
  signup_source
)
select
  w.id,
  aa.user_id,
  aa.status,
  aa.trial_started_at,
  aa.trial_ends_at,
  aa.current_period_ends_at,
  aa.stripe_customer_id,
  aa.stripe_subscription_id,
  'Solo',
  aa.trial_used,
  coalesce(nullif(trim(p.auth_provider), ''), 'unknown')
from public.account_access aa
join public.workspaces w on w.owner_user_id = aa.user_id
left join public.profiles p on p.user_id = aa.user_id
on conflict (workspace_id) do update
  set user_id = excluded.user_id,
      access_status = excluded.access_status,
      trial_start = excluded.trial_start,
      trial_end = excluded.trial_end,
      paid_until = excluded.paid_until,
      billing_customer_id = excluded.billing_customer_id,
      billing_subscription_id = excluded.billing_subscription_id,
      plan_name = excluded.plan_name,
      trial_used = excluded.trial_used,
      signup_source = excluded.signup_source,
      updated_at = now();

create table if not exists public.settings (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  timezone text not null default 'Europe/Warsaw',
  in_app_reminders boolean not null default true,
  email_reminders boolean not null default false,
  default_reminder text not null default '1h_before',
  default_snooze text not null default 'tomorrow',
  workspace_name text not null default 'LeadFlow',
  font_scale text not null default 'compact',
  view_profile text not null default 'desktop',
  theme text not null default 'classic',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.settings (workspace_id, user_id)
select w.id, w.owner_user_id
from public.workspaces w
on conflict (workspace_id) do nothing;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  company text not null default '',
  email text not null default '',
  phone text not null default '',
  source text not null default 'Inne',
  value numeric(12, 2) not null default 0,
  summary text not null default '',
  notes text not null default '',
  status text not null default 'new',
  priority text not null default 'medium',
  next_action_title text not null default '',
  next_action_at timestamptz,
  next_action_item_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_workspace_id on public.leads (workspace_id);
create index if not exists idx_leads_workspace_status on public.leads (workspace_id, status);

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by_user_id uuid references auth.users(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  record_type text not null default 'task',
  type text not null default 'task',
  title text not null,
  description text not null default '',
  status text not null default 'todo',
  priority text not null default 'medium',
  scheduled_at timestamptz,
  start_at timestamptz,
  end_at timestamptz,
  recurrence text not null default 'none',
  reminder text not null default 'none',
  show_in_tasks boolean not null default true,
  show_in_calendar boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_work_items_workspace_id on public.work_items (workspace_id);
create index if not exists idx_work_items_lead_id on public.work_items (lead_id);

create or replace function public.bootstrap_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  workspace_uuid uuid;
  resolved_email text;
  resolved_name text;
  resolved_provider text;
begin
  resolved_email := public.normalize_email(new.email);
  resolved_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    split_part(resolved_email, '@', 1),
    'Twoje konto'
  );
  resolved_provider := coalesce(
    nullif(trim(new.raw_app_meta_data ->> 'provider'), ''),
    'unknown'
  );

  insert into public.profiles (
    user_id,
    normalized_email,
    email,
    display_name,
    auth_provider,
    timezone,
    is_email_verified,
    signup_source
  )
  values (
    new.id,
    resolved_email,
    new.email,
    resolved_name,
    resolved_provider,
    'Europe/Warsaw',
    new.email_confirmed_at is not null,
    case when resolved_provider = 'google' then 'google' else 'email_password' end
  )
  on conflict (user_id) do update
    set normalized_email = excluded.normalized_email,
        email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name),
        auth_provider = coalesce(excluded.auth_provider, public.profiles.auth_provider),
        timezone = coalesce(public.profiles.timezone, excluded.timezone),
        is_email_verified = excluded.is_email_verified,
        signup_source = excluded.signup_source;

  insert into public.workspaces (owner_user_id, name)
  values (new.id, 'LeadFlow')
  on conflict (owner_user_id) do nothing;

  select id into workspace_uuid
  from public.workspaces
  where owner_user_id = new.id
  limit 1;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (workspace_uuid, new.id, 'owner')
  on conflict (workspace_id, user_id) do nothing;

  insert into public.access_status (
    workspace_id,
    user_id,
    access_status,
    trial_start,
    trial_end,
    plan_name,
    trial_used,
    signup_source
  )
  values (
    workspace_uuid,
    new.id,
    'trial_active',
    now(),
    now() + interval '7 days',
    'Solo',
    true,
    case when resolved_provider = 'google' then 'google' else 'email_password' end
  )
  on conflict (workspace_id) do update
    set user_id = excluded.user_id,
        updated_at = now();

  insert into public.settings (workspace_id, user_id, workspace_name, timezone)
  values (workspace_uuid, new.id, 'LeadFlow', 'Europe/Warsaw')
  on conflict (workspace_id) do update
    set user_id = excluded.user_id,
        workspace_name = coalesce(public.settings.workspace_name, excluded.workspace_name),
        timezone = coalesce(public.settings.timezone, excluded.timezone),
        updated_at = now();

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'app_snapshots'
  ) then
    insert into public.app_snapshots (user_id, workspace_id, snapshot_json)
    values (
      new.id,
      workspace_uuid,
      jsonb_build_object(
        'context', jsonb_build_object(
          'userId', new.id,
          'workspaceId', workspace_uuid,
          'accessStatus', 'trial_active',
          'billingStatus', 'trial'
        )
      )
    )
    on conflict (user_id) do update
      set workspace_id = excluded.workspace_id,
          updated_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists trg_access_status_updated_at on public.access_status;
create trigger trg_access_status_updated_at
before update on public.access_status
for each row
execute function public.set_updated_at();

drop trigger if exists trg_settings_updated_at on public.settings;
create trigger trg_settings_updated_at
before update on public.settings
for each row
execute function public.set_updated_at();

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

drop trigger if exists trg_work_items_updated_at on public.work_items;
create trigger trg_work_items_updated_at
before update on public.work_items
for each row
execute function public.set_updated_at();

alter table public.access_status enable row level security;
alter table public.settings enable row level security;
alter table public.leads enable row level security;
alter table public.work_items enable row level security;

drop policy if exists "access_status_select_own" on public.access_status;
create policy "access_status_select_own"
on public.access_status
for select
using (auth.uid() = user_id);

drop policy if exists "access_status_update_own" on public.access_status;
create policy "access_status_update_own"
on public.access_status
for update
using (auth.uid() = user_id);

drop policy if exists "settings_select_member" on public.settings;
create policy "settings_select_member"
on public.settings
for select
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.settings.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "settings_insert_member" on public.settings;
create policy "settings_insert_member"
on public.settings
for insert
with check (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.settings.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "settings_update_member" on public.settings;
create policy "settings_update_member"
on public.settings
for update
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.settings.workspace_id
      and wm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.settings.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "leads_select_member" on public.leads;
create policy "leads_select_member"
on public.leads
for select
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.leads.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "leads_insert_member" on public.leads;
create policy "leads_insert_member"
on public.leads
for insert
with check (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.leads.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "leads_update_member" on public.leads;
create policy "leads_update_member"
on public.leads
for update
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.leads.workspace_id
      and wm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.leads.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "leads_delete_member" on public.leads;
create policy "leads_delete_member"
on public.leads
for delete
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.leads.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "work_items_select_member" on public.work_items;
create policy "work_items_select_member"
on public.work_items
for select
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.work_items.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "work_items_insert_member" on public.work_items;
create policy "work_items_insert_member"
on public.work_items
for insert
with check (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.work_items.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "work_items_update_member" on public.work_items;
create policy "work_items_update_member"
on public.work_items
for update
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.work_items.workspace_id
      and wm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.work_items.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "work_items_delete_member" on public.work_items;
create policy "work_items_delete_member"
on public.work_items
for delete
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.work_items.workspace_id
      and wm.user_id = auth.uid()
  )
);
