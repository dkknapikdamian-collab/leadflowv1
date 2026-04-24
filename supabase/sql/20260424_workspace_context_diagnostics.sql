-- Workspace context diagnostics after Firebase -> Supabase migration.
-- Safe read-only script (no data mutations).

begin;

create temporary table if not exists workspace_context_diag (
  section text not null,
  metric text not null,
  value text not null
);

truncate table workspace_context_diag;

insert into workspace_context_diag (section, metric, value)
select
  'tables',
  table_name,
  case when to_regclass(format('public.%I', table_name)) is null then 'missing' else 'present' end
from unnest(array[
  'profiles',
  'workspaces',
  'workspace_members',
  'work_items',
  'leads',
  'cases',
  'clients',
  'payments'
]) as table_name;

do $$
declare
  uuid_regex constant text := '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
begin
  if to_regclass('public.profiles') is not null then
    execute '
      insert into workspace_context_diag(section, metric, value)
      select ''profiles'', ''without_workspace_id'', count(*)::text
      from public.profiles
      where workspace_id is null
    ';

    execute '
      insert into workspace_context_diag(section, metric, value)
      select ''profiles'', ''orphan_workspace_reference'', count(*)::text
      from public.profiles p
      left join public.workspaces w on w.id = p.workspace_id
      where p.workspace_id is not null and w.id is null
    ';

    execute format($sql$
      insert into workspace_context_diag(section, metric, value)
      select 'profiles', 'non_uuid_profile_id', count(*)::text
      from public.profiles
      where coalesce(id::text, '') !~* %L
    $sql$, uuid_regex);
  end if;

  if to_regclass('public.leads') is not null then
    execute '
      insert into workspace_context_diag(section, metric, value)
      select ''leads'', ''without_workspace_id'', count(*)::text
      from public.leads
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.cases') is not null then
    execute '
      insert into workspace_context_diag(section, metric, value)
      select ''cases'', ''without_workspace_id'', count(*)::text
      from public.cases
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.work_items') is not null then
    execute '
      insert into workspace_context_diag(section, metric, value)
      select ''work_items'', ''without_workspace_id'', count(*)::text
      from public.work_items
      where workspace_id is null
    ';

    execute '
      insert into workspace_context_diag(section, metric, value)
      select ''work_items'', ''legacy_firestore_id_nonempty'', count(*)::text
      from public.work_items
      where nullif(trim(coalesce(legacy_firestore_id, '''')), '''') is not null
    ';
  end if;

  if to_regclass('public.clients') is not null then
    execute '
      insert into workspace_context_diag(section, metric, value)
      select ''clients'', ''without_workspace_id'', count(*)::text
      from public.clients
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.payments') is not null then
    execute '
      insert into workspace_context_diag(section, metric, value)
      select ''payments'', ''without_workspace_id'', count(*)::text
      from public.payments
      where workspace_id is null
    ';
  end if;
end $$;

create temporary table if not exists workspace_context_examples (
  entity text not null,
  row_id text not null,
  workspace_id text null,
  note text null
);

truncate table workspace_context_examples;

do $$
begin
  if to_regclass('public.profiles') is not null then
    execute '
      insert into workspace_context_examples(entity, row_id, workspace_id, note)
      select ''profiles'', id::text, workspace_id::text, ''profile without workspace_id''
      from public.profiles
      where workspace_id is null
      order by coalesce(updated_at, created_at) desc nulls last
      limit 20
    ';
  end if;

  if to_regclass('public.leads') is not null then
    execute '
      insert into workspace_context_examples(entity, row_id, workspace_id, note)
      select ''leads'', id::text, workspace_id::text, ''lead without workspace_id''
      from public.leads
      where workspace_id is null
      order by coalesce(updated_at, created_at) desc nulls last
      limit 20
    ';
  end if;

  if to_regclass('public.cases') is not null then
    execute '
      insert into workspace_context_examples(entity, row_id, workspace_id, note)
      select ''cases'', id::text, workspace_id::text, ''case without workspace_id''
      from public.cases
      where workspace_id is null
      order by coalesce(updated_at, created_at) desc nulls last
      limit 20
    ';
  end if;

  if to_regclass('public.work_items') is not null then
    execute '
      insert into workspace_context_examples(entity, row_id, workspace_id, note)
      select ''work_items'', id::text, workspace_id::text, ''work_item without workspace_id''
      from public.work_items
      where workspace_id is null
      order by coalesce(updated_at, created_at) desc nulls last
      limit 20
    ';
  end if;
end $$;

select section, metric, value
from workspace_context_diag
order by section, metric;

select entity, row_id, workspace_id, note
from workspace_context_examples
order by entity, row_id;

commit;
