-- Stage228R16/R16R2 - leads.next_action_title nullable compatibility
-- Run in Supabase SQL Editor for the CloseFlow production project.
-- In this conversation SQL is already confirmed as applied if verification returns is_nullable = YES.

begin;

alter table public.leads
  alter column next_action_title drop not null;

alter table public.leads
  alter column next_action_title set default '';

commit;

select
  table_schema,
  table_name,
  column_name,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'leads'
  and column_name = 'next_action_title';

-- Expected:
-- is_nullable = YES
