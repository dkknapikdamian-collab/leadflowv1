-- Stage 07: billing webhook idempotency + billing metadata
alter table if exists public.workspaces
  add column if not exists checkout_session_id text;

create table if not exists public.billing_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'stripe_blik',
  event_id text not null,
  event_type text not null,
  workspace_id uuid null,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now()
);

create unique index if not exists idx_billing_webhook_events_provider_event
  on public.billing_webhook_events(provider, event_id);
