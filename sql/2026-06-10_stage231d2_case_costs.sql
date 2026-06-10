-- STAGE231D2_CASE_COSTS_IN_CASE_SQL
-- Where: Supabase SQL Editor for CloseFlow production project.
-- Purpose: create durable case_costs rows for case-level costs and reimbursements.
-- Order: run once before deploying/using D2 cost writes in the app.

create extension if not exists pgcrypto;

create table if not exists public.case_costs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid not null references public.cases(id) on delete cascade,
  client_id uuid null references public.clients(id) on delete set null,
  kind text not null default 'other',
  status text not null default 'incurred',
  amount numeric(14,2) not null default 0 check (amount >= 0),
  reimbursable boolean not null default true,
  reimbursable_amount numeric(14,2) not null default 0 check (reimbursable_amount >= 0),
  reimbursed_amount numeric(14,2) not null default 0 check (reimbursed_amount >= 0),
  currency text not null default 'PLN',
  incurred_at timestamptz null,
  reimbursed_at timestamptz null,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint case_costs_kind_check check (kind in ('court_fee','notary','travel','document','office','marketing','other')),
  constraint case_costs_status_check check (status in ('planned','incurred','submitted','partially_reimbursed','reimbursed','cancelled')),
  constraint case_costs_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint case_costs_reimbursed_lte_reimbursable check (reimbursed_amount <= reimbursable_amount)
);

create index if not exists case_costs_workspace_id_idx on public.case_costs(workspace_id);
create index if not exists case_costs_case_id_idx on public.case_costs(case_id);
create index if not exists case_costs_client_id_idx on public.case_costs(client_id);
create index if not exists case_costs_status_idx on public.case_costs(status);

create or replace function public.set_case_costs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_case_costs_updated_at on public.case_costs;
create trigger trg_case_costs_updated_at
before update on public.case_costs
for each row execute function public.set_case_costs_updated_at();

alter table public.case_costs enable row level security;

-- Service role writes through API. Authenticated users can read rows for their workspace when RLS auth context is available.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'case_costs' and policyname = 'case_costs_select_workspace_members'
  ) then
    create policy case_costs_select_workspace_members
    on public.case_costs
    for select
    using (
      workspace_id in (
        select wm.workspace_id from public.workspace_members wm where wm.user_id = auth.uid()
      )
      or workspace_id in (
        select w.id from public.workspaces w where w.owner_id = auth.uid() or w.owner_user_id = auth.uid()
      )
    );
  end if;
end $$;

grant select, insert, update, delete on public.case_costs to service_role;
grant select on public.case_costs to authenticated;

-- Guard / verification query. Expected: one row with table_name = case_costs.
select table_schema, table_name
from information_schema.tables
where table_schema = 'public' and table_name = 'case_costs';
