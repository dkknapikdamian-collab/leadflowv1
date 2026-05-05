-- Stage88 / Etap 2: case financial baseline contract
-- Simple financial model only: potential, paid, remaining.

alter table if exists public.cases
  add column if not exists expected_revenue numeric not null default 0,
  add column if not exists paid_amount numeric not null default 0,
  add column if not exists currency text not null default 'PLN';

alter table if exists public.leads
  add column if not exists currency text not null default 'PLN';

update public.cases
set expected_revenue = coalesce(expected_revenue, 0)
where expected_revenue is null;

update public.cases
set paid_amount = coalesce(paid_amount, 0)
where paid_amount is null;

update public.cases
set currency = coalesce(nullif(trim(currency), ''), 'PLN')
where currency is null or trim(currency) = '';

update public.leads
set currency = coalesce(nullif(trim(currency), ''), 'PLN')
where currency is null or trim(currency) = '';

create index if not exists idx_cases_workspace_currency on public.cases (workspace_id, currency);
create index if not exists idx_cases_workspace_expected_revenue on public.cases (workspace_id, expected_revenue);
