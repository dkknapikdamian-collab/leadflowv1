-- CloseFlow / LeadFlowV1
-- Live Supabase auth/workspace schema probe.
-- Read-only. Use this to verify actual FK targets before writing repair SQL.

begin;

select
  con.conname as constraint_name,
  con.conrelid::regclass::text as source_table,
  con.confrelid::regclass::text as target_table,
  pg_get_constraintdef(con.oid) as definition
from pg_constraint con
where con.conrelid = 'public.workspaces'::regclass
  and con.conname = 'workspaces_owner_user_id_fkey';

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

select
  'auth_users' as metric,
  count(*)::text as value
from auth.users
union all
select
  'profiles',
  count(*)::text
from public.profiles
union all
select
  'profiles_with_auth_user',
  count(*)::text
from public.profiles p
join auth.users au on au.id = p.user_id
union all
select
  'workspaces',
  count(*)::text
from public.workspaces
union all
select
  'workspaces_owner_without_auth_user',
  count(*)::text
from public.workspaces w
left join auth.users au on au.id = w.owner_user_id
where au.id is null
union all
select
  'workspace_members',
  count(*)::text
from public.workspace_members
union all
select
  'workspace_members_without_auth_user',
  count(*)::text
from public.workspace_members wm
left join auth.users au on au.id = wm.user_id
where au.id is null
union all
select
  'profiles_without_workspace_id',
  count(*)::text
from public.profiles
where workspace_id is null
union all
select
  'profiles_orphan_workspace_reference',
  count(*)::text
from public.profiles p
left join public.workspaces w on w.id = p.workspace_id
where p.workspace_id is not null
  and w.id is null;

commit;
