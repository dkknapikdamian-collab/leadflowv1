-- DIAGNOSTYKA: pokaż typy kolumn w work_items
select
  column_name,
  data_type,
  udt_name,
  is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'work_items'
order by ordinal_position;


-- NAPRAWA: kolumny pomocnicze w work_items nie mogą być uuid,
-- jeśli aplikacja wysyła tam Firebase UID albo stringowe ID z frontu.
do $$
declare
  col_name text;
begin
  foreach col_name in array array[
    'client_id',
    'lead_id',
    'case_id',
    'linked_case_id',
    'user_id',
    'owner_id',
    'assigned_to',
    'created_by',
    'updated_by'
  ]
  loop
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'work_items'
        and column_name = col_name
        and udt_name = 'uuid'
    ) then
      execute format(
        'alter table public.work_items alter column %I type text using %I::text',
        col_name,
        col_name
      );
    end if;
  end loop;
end $$;


-- Upewnij się, że kolumny używane przez aplikację istnieją
alter table public.work_items
  add column if not exists due_at timestamptz;

alter table public.work_items
  add column if not exists scheduled_at timestamptz;

alter table public.work_items
  add column if not exists reminder_at timestamptz;

alter table public.work_items
  add column if not exists recurrence_rule text;

alter table public.work_items
  add column if not exists client_id text;

alter table public.work_items
  add column if not exists linked_case_id text;


-- Odśwież schema cache PostgREST / Supabase API
select pg_notify('pgrst', 'reload schema');
