-- CloseFlow cases expected_revenue prerequisite for FIN-2 fresh Supabase restore.
-- Purpose: 20260509090000_finance_contract_fin2.sql reads public.cases.expected_revenue.
-- Safe/idempotent.

alter table public.cases
  add column if not exists expected_revenue numeric(14,2) not null default 0;

update public.cases
set expected_revenue = greatest(0, coalesce(expected_revenue, 0))
where expected_revenue is null;

select 'closeflow_cases_expected_revenue_prereq_ready' as status;
