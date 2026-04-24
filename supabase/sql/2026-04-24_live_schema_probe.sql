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
  'constraints',
  con.conrelid::regclass::text,
  con.conname,
  concat(con.confrelid::regclass::text, ' | ', pg_get_constraintdef(con.oid))
from pg_constraint con
where con.conrelid in (
  'public.workspaces'::regclass,
  'public.workspace_members'::regclass,
  'public.profiles'::regclass
)
order by con.conrelid::regclass::text, con.conname;

insert into closeflow_schema_probe(section, table_name, metric, value)
select
  'columns',
  c.table_schema || '.' || c.table_name,
  c.column_name,
  concat(c.data_type, '|nullable=', c.is_nullable, '|default=', coalesce(c.column_default, ''))
from information_schema.columns c
where c.table_schema in ('public', 'auth')
  and c.table_name in ('users', 'profiles', 'workspaces', 'workspace_members', 'leads', 'cases', 'work_items', 'clients', 'payments', 'activities')
order by c.table_schema, c.table_name, c.ordinal_position;

insert into closeflow_schema_probe(section, table_name, metric, value)
select 'counts', 'auth.users', 'rows', count(*)::text from auth.users;

insert into closeflow_schema_probe(section, table_name, metric, value)
select 'counts', 'public.profiles', 'rows', count(*)::text from public.profiles;

insert into closeflow_schema_probe(section, table_name, metric, value)
select 'counts', 'public.workspaces', 'rows', count(*)::text from public.workspaces;

insert into closeflow_schema_probe(section, table_name, metric, value)
select 'counts', 'public.workspace_members', 'rows', count(*)::text from public.workspace_members;

select section, table_name, metric, value
from closeflow_schema_probe
order by section, table_name nulls first, metric;

commit;
