alter table public.access_status
  add column if not exists bonus_code_used text,
  add column if not exists bonus_kind text check (bonus_kind in ('promo_code', 'referral', 'manual')),
  add column if not exists bonus_applied_at timestamptz;

create unique index if not exists idx_access_status_billing_customer_id
  on public.access_status (billing_customer_id)
  where billing_customer_id is not null;

create unique index if not exists idx_access_status_billing_subscription_id
  on public.access_status (billing_subscription_id)
  where billing_subscription_id is not null;
