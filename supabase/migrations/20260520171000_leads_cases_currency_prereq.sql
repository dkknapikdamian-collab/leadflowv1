-- CloseFlow fresh Supabase restore hotfix.
-- Purpose: API list/detail reads currently expect leads.currency and cases.currency.
-- Safe/idempotent.
-- Source runtime error:
--   column leads.currency does not exist
--   column cases.currency does not exist

alter table public.leads
  add column if not exists currency text not null default 'PLN';

alter table public.cases
  add column if not exists currency text not null default 'PLN';

update public.leads
set currency = 'PLN'
where currency is null or btrim(currency) = '';

update public.cases
set currency = 'PLN'
where currency is null or btrim(currency) = '';

select 'closeflow_leads_cases_currency_prereq_ready' as status;
