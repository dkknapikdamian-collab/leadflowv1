-- Stage 13: ensure billing columns + canonical billing_events table

alter table if exists public.workspaces
  add column if not exists plan_id text,
  add column if not exists subscription_status text,
  add column if not exists provider_customer_id text,
  add column if not exists provider_subscription_id text,
  add column if not exists next_billing_at timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists trial_ends_at timestamptz;

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'stripe_blik',
  event_id text not null,
  event_type text not null,
  workspace_id uuid null,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now()
);

create unique index if not exists idx_billing_events_provider_event
  on public.billing_events(provider, event_id);

create index if not exists idx_billing_events_workspace
  on public.billing_events(workspace_id, received_at desc);
