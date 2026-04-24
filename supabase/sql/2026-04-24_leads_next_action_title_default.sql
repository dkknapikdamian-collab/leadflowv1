-- CloseFlow / LeadFlowV1
-- Leads next_action_title default guard.
-- Safe additive migration for live schema where leads.next_action_title is NOT NULL.
-- Run in Supabase SQL Editor once, after app deploy or before retesting lead creation.

begin;

do $$
begin
  if to_regclass('public.leads') is not null then
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'leads'
        and column_name = 'next_action_title'
    ) then
      execute 'update public.leads set next_action_title = '''' where next_action_title is null';
      execute 'alter table public.leads alter column next_action_title set default ''''';
    end if;
  end if;
end $$;

commit;