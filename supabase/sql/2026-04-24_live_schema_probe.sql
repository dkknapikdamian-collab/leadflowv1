-- CloseFlow / LeadFlowV1
-- Live Supabase schema probe.
-- Read-only diagnostics. No data mutations.

begin;

create temporary table if not exists closeflow_schema_probe (
  section text not null,
  table_name text null,
  metric text not null,
  value text null
);

truncate table closeflow_schema_probe;

insert into closeflow_schema_probe(section, table_name, metric, value)
select
  'tables',
  t.table_name,
  'exists',
  case when to_regclass(format('public.%I', t.table_name)) is null then 'missing' else 'present' end
from unnest(array[
  'users',
  'profiles',
  'workspaces',
  'workspace_members',
  'leads',
  'cases',
  'work_items',
  'clients',
  'payments',
  'activities'
]) as t(table_name);

insert into closeflow_schema_probe(section, table_name, metric, value)
select 'counts', 'users', 'rows', count(*)::text from public.users
where to_regclass('public.users') is not null;

insert into closeflow_schema_probe(section, table_name, metric, value)
select 'counts', 'profiles', 'rows', count(*)::text from public.profiles
where to_regclass('public.profiles') is not null;

insert into closeflow_schema_probe(section, table_name, metric, value)
select 'counts', 'workspaces', 'rows', count(*)::text from public.workspaces
where to_regclass('public.workspaces') is not null;

insert into closeflow_schema_probe(section, table_name, metric, value)
select 'counts', 'workspace_members', 'rows', count(*)::text from public.workspace_members
where to_regclass('public.workspace_members') is not null;

insert into closeflow_schema_probe(section, table_name, metric, value)
select
  'columns',
  c.table_name,
  c.column_name,
  concat(c.data_type, '|nullable=', c.is_nullable, '|default=', coalesce(c.column_default, ''))
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name in ('users', 'profiles', 'workspaces', 'workspace_members', 'leads', 'cases', 'work_items', 'clients', 'payments', 'activities')
order by c.table_name, c.ordinal_position;

insert into closeflow_schema_probe(section, table_name, metric, value)
select
  'constraints',
  tc.table_name,
  tc.constraint_name,
  concat(tc.constraint_type, '|', coalesce(kcu.column_name, ''), ' -> ', coalesce(ccu.table_schema, ''), '.', coalesce(ccu.table_name, ''), '.', coalesce(ccu.column_name, ''))
from information_schema.table_constraints tc
left join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
 and tc.table_schema = kcu.table_schema
left join information_schema.constraint_column_usage ccu
  on tc.constraint_name = ccu.constraint_name
 and tc.table_schema = ccu.table_schema
where tc.table_schema = 'public'
  and tc.table_name in ('users', 'profiles', 'workspaces', 'workspace_members', 'leads', 'cases', 'work_items', 'clients', 'payments', 'activities')
order by tc.table_name, tc.constraint_name;

select section, table_name, metric, value
from closeflow_schema_probe
order by section, table_name nulls first, metric;

commit;
