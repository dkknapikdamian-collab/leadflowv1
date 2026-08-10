-- B3: billing_events is the single Stripe event ledger. Webhook processing
-- state makes failed mutations retryable without reactivating access manually.
alter table if exists public.billing_events
  add column if not exists processing_status text not null default 'received',
  add column if not exists processing_started_at timestamptz,
  add column if not exists last_error text;

create unique index if not exists idx_billing_events_provider_event
  on public.billing_events(provider, event_id);
