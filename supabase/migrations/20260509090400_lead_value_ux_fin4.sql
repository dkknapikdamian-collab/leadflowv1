-- FIN-4_CLOSEFLOW_LEAD_VALUE_UX_V1
-- Optional finance fields for lead value UX. Safe additive migration.
-- Patched for PostgreSQL compatibility: invalid constraint syntax replaced with guarded DO blocks.

alter table if exists public.leads
  add column if not exists contract_value numeric default 0,
  add column if not exists commission_mode text default 'none',
  add column if not exists commission_base text default 'contract_value',
  add column if not exists commission_rate numeric default 0,
  add column if not exists commission_amount numeric default 0,
  add column if not exists commission_status text default 'not_set',
  add column if not exists finance_note text;

do $$
begin
  alter table public.leads
    add constraint closeflow_leads_commission_mode_check
    check (commission_mode in ('none', 'percent', 'fixed'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.leads
    add constraint closeflow_leads_commission_base_check
    check (commission_base in ('contract_value', 'paid_amount', 'custom'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.leads
    add constraint closeflow_leads_commission_status_check
    check (commission_status in ('not_set', 'expected', 'due', 'partially_paid', 'paid', 'overdue'));
exception when duplicate_object then null;
end $$;

select 'closeflow_lead_value_ux_fin4_ready' as status;