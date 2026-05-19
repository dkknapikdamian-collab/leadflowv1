select
  table_schema,
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema in ('public', 'auth')
  and table_name in ('users', 'workspaces', 'profiles', 'workspace_members')
order by table_schema, table_name, ordinal_position;
