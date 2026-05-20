-- FIN-2_DATABASE_API_FINANCE_CONTRACT_V1
-- Finance contract foundation for CloseFlow.
-- Scope: database columns + payments table only. No UI/UX changes.

alter table if exists public.cases
  add column if not exists contract_value numeric(14,2) not null default 0,
  add column if not exists commission_mode text not null default 'none',
  add column if not exists commission_base text not null default 'contract_value',
  add column if not exists commission_rate numeric(7,4) not null default 0,
  add column if not exists commission_amount numeric(14,2) not null default 0,
  add column if not exists commission_status text not null default 'not_set',
  add column if not exists paid_amount numeric(14,2) not null default 0,
  add column if not exists remaining_amount numeric(14,2) not null default 0;

update public.cases
set
  contract_value = greatest(0, coalesce(contract_value, expected_revenue, 0)),
  paid_amount = greatest(0, coalesce(paid_amount, 0)),
  remaining_amount = greatest(0, coalesce(remaining_amount, contract_value - paid_amount, expected_revenue - paid_amount, 0)),
  commission_mode = coalesce(nullif(commission_mode, ''), 'none'),
  commission_base = coalesce(nullif(commission_base, ''), 'contract_value'),
  commission_rate = greatest(0, coalesce(commission_rate, 0)),
  commission_amount = greatest(0, coalesce(commission_amount, 0)),
  commission_status = coalesce(nullif(commission_status, ''), 'not_set')
where true;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  lead_id uuid null,
  client_id uuid null,
  case_id uuid null,
  type text not null default 'other',
  status text not null default 'planned',
  amount numeric(14,2) not null default 0,
  currency text not null default 'PLN',
  paid_at timestamptz null,
  due_at timestamptz null,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments
  add column if not exists workspace_id uuid,
  add column if not exists lead_id uuid null,
  add column if not exists client_id uuid null,
  add column if not exists case_id uuid null,
  add column if not exists type text not null default 'other',
  add column if not exists status text not null default 'planned',
  add column if not exists amount numeric(14,2) not null default 0,
  add column if not exists currency text not null default 'PLN',
  add column if not exists paid_at timestamptz null,
  add column if not exists due_at timestamptz null,
  add column if not exists note text null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  alter table public.cases
    add constraint closeflow_cases_fin2_commission_mode_chk check (commission_mode in ('none', 'percent', 'fixed'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.cases
    add constraint closeflow_cases_fin2_commission_base_chk check (commission_base in ('contract_value', 'paid_amount', 'custom'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.cases
    add constraint closeflow_cases_fin2_commission_status_chk check (commission_status in ('not_set', 'expected', 'due', 'partially_paid', 'paid', 'overdue'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.payments
    add constraint closeflow_payments_fin2_type_chk check (type in ('deposit', 'partial', 'final', 'commission', 'refund', 'other'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.payments
    add constraint closeflow_payments_fin2_status_chk check (status in ('planned', 'due', 'paid', 'cancelled'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.payments
    add constraint closeflow_payments_fin2_amount_nonnegative_chk check (amount >= 0);
exception when duplicate_object then null;
end $$;

create index if not exists idx_closeflow_payments_workspace_created
  on public.payments (workspace_id, created_at desc);
create index if not exists idx_closeflow_payments_case
  on public.payments (workspace_id, case_id);
create index if not exists idx_closeflow_payments_lead
  on public.payments (workspace_id, lead_id);
create index if not exists idx_closeflow_payments_client
  on public.payments (workspace_id, client_id);
create index if not exists idx_closeflow_payments_status_due
  on public.payments (workspace_id, status, due_at);

alter table public.payments enable row level security;

-- RLS policies are intentionally conservative and depend on the existing workspace model.
-- Service-role API endpoints still scope every operation by workspace_id through _request-scope.
-- If the project has user-facing direct Supabase queries later, add workspace-member policies in a separate security stage.
