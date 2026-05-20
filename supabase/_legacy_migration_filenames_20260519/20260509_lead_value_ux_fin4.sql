-- FIN-4_CLOSEFLOW_LEAD_VALUE_UX_V1
-- Optional finance fields for lead value UX. Safe additive migration.

alter table if exists public.leads
  add column if not exists contract_value numeric default 0,
  add column if not exists commission_mode text default 'none',
  add column if not exists commission_base text default 'contract_value',
  add column if not exists commission_rate numeric default 0,
  add column if not exists commission_amount numeric default 0,
  add column if not exists commission_status text default 'not_set',
  add column if not exists finance_note text;

alter table if exists public.leads
  add constraint if not exists closeflow_leads_commission_mode_check
  check (commission_mode in ('none', 'percent', 'fixed'));

alter table if exists public.leads
  add constraint if not exists closeflow_leads_commission_base_check
  check (commission_base in ('contract_value', 'paid_amount', 'custom'));

alter table if exists public.leads
  add constraint if not exists closeflow_leads_commission_status_check
  check (commission_status in ('not_set', 'expected', 'due', 'partially_paid', 'paid', 'overdue'));
