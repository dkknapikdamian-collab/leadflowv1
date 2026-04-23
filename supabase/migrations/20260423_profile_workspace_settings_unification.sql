-- Profile + workspace settings unification
-- Idempotent migration for operator preferences and workspace-level digest/billing metadata

alter table public.profiles
  add column if not exists company_name text null default '',
  add column if not exists appearance_skin text null default 'classic-light',
  add column if not exists planning_conflict_warnings_enabled boolean not null default true,
  add column if not exists browser_notifications_enabled boolean not null default true,
  add column if not exists force_logout_after timestamptz null;

alter table public.workspaces
  add column if not exists billing_provider text null default 'manual',
  add column if not exists provider_customer_id text null,
  add column if not exists provider_subscription_id text null,
  add column if not exists next_billing_at timestamptz null,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists daily_digest_enabled boolean not null default true,
  add column if not exists daily_digest_hour integer not null default 7,
  add column if not exists daily_digest_timezone text null default 'Europe/Warsaw',
  add column if not exists daily_digest_recipient_email text null;

create index if not exists idx_profiles_workspace_id on public.profiles(workspace_id);
create index if not exists idx_workspaces_subscription_status on public.workspaces(subscription_status);

with digest_seed as (
  select distinct on (p.workspace_id)
    p.workspace_id,
    coalesce(p.daily_digest_email_enabled, true) as enabled,
    greatest(0, least(23, coalesce(p.daily_digest_hour, 7))) as digest_hour,
    coalesce(nullif(trim(p.timezone), ''), 'Europe/Warsaw') as digest_timezone,
    coalesce(nullif(trim(p.daily_digest_recipient_email), ''), nullif(trim(p.email), '')) as recipient_email
  from public.profiles p
  where p.workspace_id is not null
  order by p.workspace_id, p.updated_at desc nulls last, p.created_at desc nulls last
)
update public.workspaces w
set
  daily_digest_enabled = coalesce(w.daily_digest_enabled, ds.enabled),
  daily_digest_hour = coalesce(w.daily_digest_hour, ds.digest_hour),
  daily_digest_timezone = coalesce(nullif(w.daily_digest_timezone, ''), ds.digest_timezone),
  daily_digest_recipient_email = coalesce(nullif(w.daily_digest_recipient_email, ''), ds.recipient_email)
from digest_seed ds
where w.id = ds.workspace_id;

update public.workspaces
set
  daily_digest_timezone = coalesce(nullif(daily_digest_timezone, ''), timezone, 'Europe/Warsaw'),
  updated_at = coalesce(updated_at, now())
where daily_digest_timezone is null
   or daily_digest_timezone = '';

select 'ok' as status;
